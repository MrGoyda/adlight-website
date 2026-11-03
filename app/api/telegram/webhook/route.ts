import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendMetaConversionEvent, sendYandexConversionEvent } from "@/lib/analytics";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from "@/lib/r2";

// Вспомогательная функция отправки сообщения в Telegram
async function sendTelegramMessage(
  botToken: string,
  chatId: string | number,
  text: string,
  replyMarkup?: any
) {
  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
        reply_markup: replyMarkup,
      }),
    });
  } catch (err) {
    console.error("Failed to send telegram message:", err);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    if (!botToken) {
      console.warn("TELEGRAM_BOT_TOKEN is not configured");
      return NextResponse.json({ ok: true });
    }

    // ─────────────────────────────────────────────────────────────
    // 1. ОБРАБОТКА CALLBACK_QUERY (НАЖАТИЕ ИНЛАЙН-КНОПОК)
    // ─────────────────────────────────────────────────────────────
    if (body.callback_query) {
      const callback = body.callback_query;
      const callbackData = callback.data || "";

      // Формат callback_data: "lead_qualify:{leadId}:{NEW_STATUS}"
      if (callbackData.startsWith("lead_qualify:")) {
        const [, leadId, newStatus] = callbackData.split(":");

        // Ищем лид в БД Prisma
        const lead = await prisma.lead.findUnique({
          where: { id: leadId },
        });

        if (lead) {
          // 1. Обновляем статус лида в CRM
          const updatedLead = await prisma.lead.update({
            where: { id: leadId },
            data: {
              status: newStatus as any,
            },
          });

          // 2. Создаем активность в карточке лида CRM
          const managerName = callback.from?.first_name || "Менеджер";
          await prisma.leadActivity.create({
            data: {
              leadId: lead.id,
              text: `Статус изменен через Telegram: ${newStatus}`,
              author: managerName,
              type: "STATUS_CHANGE",
            },
          });

          // 3. Если статус "В производстве" или "Завершен" — отправляем офлайн-конверсии
          if (newStatus === "PROCESSED" || newStatus === "COMPLETED") {
            const revenue = updatedLead.revenue || updatedLead.prepayment || 50000;
            
            // Meta CAPI
            await sendMetaConversionEvent({
              name: updatedLead.name,
              phone: updatedLead.phone,
              revenue: revenue,
              fbBrowserId: updatedLead.fbBrowserId,
              leadId: updatedLead.id,
            });

            // Google Ads / GA4 Offline Purchase
            if (updatedLead.googleClientId) {
              const { sendGoogleOfflineConversion } = await import("@/lib/analytics");
              await sendGoogleOfflineConversion(updatedLead.googleClientId, revenue);
            }

            // Yandex Offline
            if (updatedLead.yandexClientId) {
              await sendYandexConversionEvent(updatedLead.yandexClientId, revenue);
            }
          }

          // 4. Отвечаем Telegram (убираем крутилку на кнопке)
          await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              callback_query_id: callback.id,
              text: `✅ Статус лида "${lead.name}" успешно обновлен на ${newStatus}!`,
              show_alert: false,
            }),
          });

          // Обновляем текст кнопки в Telegram на финальный статус
          const statusLabels: Record<string, string> = {
            IN_PROGRESS: "🟢 Принят в работу",
            PROCESSED: "💰 Оплачен (В производстве)",
            CANCELLED: "🔴 Отменен / Спам",
          };

          await fetch(`https://api.telegram.org/bot${botToken}/editMessageReplyMarkup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: callback.message.chat.id,
              message_id: callback.message.message_id,
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: `✅ ${statusLabels[newStatus] || newStatus}`,
                      callback_data: "none",
                    },
                  ],
                ],
              },
            }),
          });
        }
      }

      return NextResponse.json({ ok: true });
    }

    // ─────────────────────────────────────────────────────────────
    // 2. ОБРАБОТКА ТЕКСТОВЫХ СООБЩЕНИЙ И КОМАНД МЕНЕДЖЕРОВ
    // ─────────────────────────────────────────────────────────────
    if (body.message) {
      const message = body.message;
      const chatId = message.chat.id;
      const rawText = (message.text || "").trim();
      const lowerText = rawText.toLowerCase();

      // Проверка авторизации (если указаны TELEGRAM_CHAT_ID)
      const allowedChats = (process.env.TELEGRAM_CHAT_ID || "")
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean);

      if (allowedChats.length > 0 && !allowedChats.includes(String(chatId))) {
        console.warn(`[Telegram Webhook] Unauthorized access attempt from chatId: ${chatId}`);
        await sendTelegramMessage(
          botToken,
          chatId,
          "🔒 Доступ ограничен. Данный чат не зарегистрирован в качестве администратора CRM ADLight."
        );
        return NextResponse.json({ ok: true });
      }

      // ── А. ОБРАБОТКА ФОТО ──
      if (message.photo && Array.isArray(message.photo) && message.photo.length > 0) {
        const bestPhoto = message.photo[message.photo.length - 1];
        const caption = message.caption || "";

        try {
          // Получаем путь к файлу через Telegram Bot API
          const fileRes = await fetch(
            `https://api.telegram.org/bot${botToken}/getFile?file_id=${bestPhoto.file_id}`
          );
          const fileData = await fileRes.json();

          if (fileData.ok && fileData.result?.file_path) {
            const downloadUrl = `https://api.telegram.org/file/bot${botToken}/${fileData.result.file_path}`;
            const imgBuffer = await fetch(downloadUrl).then((r) => r.arrayBuffer());

            const fileKey = `telegram/${Date.now()}-${bestPhoto.file_id}.jpg`;

            await r2Client.send(
              new PutObjectCommand({
                Bucket: R2_BUCKET_NAME,
                Key: fileKey,
                Body: Buffer.from(imgBuffer),
                ContentType: "image/jpeg",
              })
            );

            const publicUrl = `${R2_PUBLIC_URL}/${fileKey}`;

            // Если в подписи указан номер телефона или имя, пытаемся прикрепить к сделке
            let attachedInfo = "";
            if (caption.trim()) {
              const matchedLead = await prisma.lead.findFirst({
                where: {
                  OR: [
                    { phone: { contains: caption.replace(/[^0-9]/g, "") } },
                    { name: { contains: caption.trim(), mode: "insensitive" } },
                  ],
                },
                orderBy: { updatedAt: "desc" },
              });

              if (matchedLead) {
                await prisma.leadFile.create({
                  data: {
                    leadId: matchedLead.id,
                    name: `Фото из Telegram (${caption.trim()})`,
                    url: publicUrl,
                    fileKey: fileKey,
                    size: bestPhoto.file_size || 0,
                    mimeType: "image/jpeg",
                  },
                });
                attachedInfo = `\n📎 Прикреплено к сделке: <b>${matchedLead.name}</b>`;
              }
            }

            await sendTelegramMessage(
              botToken,
              chatId,
              `✅ <b>Фото успешно загружено в Cloudflare R2!</b>\n🔗 <a href="${publicUrl}">Открыть изображение</a>${attachedInfo}`
            );
            return NextResponse.json({ ok: true });
          }
        } catch (uploadErr) {
          console.error("Failed to upload photo from Telegram:", uploadErr);
          await sendTelegramMessage(
            botToken,
            chatId,
            "⚠️ Не удалось загрузить фото в хранилище. Попробуйте еще раз."
          );
          return NextResponse.json({ ok: true });
        }
      }

      // ── Б. КОМАНДА: /start ИЛИ /help ──
      if (lowerText === "/start" || lowerText === "/help" || lowerText === "помощь" || lowerText === "меню") {
        const welcomeText = `
⚡️ <b>Ассистент CRM ADLight</b>

Доступные быстрые команды:
💼 <b>/kassa</b> — текущий баланс кассы и выводы партнеров
📋 <b>/leads</b> — сводка по активным заявкам
🔍 <b>/search [имя или телефон]</b> — поиск клиента или сделки
📸 Отправьте фото с подписью — оно автоматически сохранится в Cloudflare R2

🌐 <b>Веб-панель:</b> <a href="https://crm.adlight.kz">crm.adlight.kz</a>
`;
        await sendTelegramMessage(botToken, chatId, welcomeText, {
          keyboard: [
            [{ text: "💼 Касса" }, { text: "📋 Заявки" }],
            [{ text: "🌐 Открыть CRM" }],
          ],
          resize_keyboard: true,
        });
        return NextResponse.json({ ok: true });
      }

      // ── В. КОМАНДА: /kassa ИЛИ /finance ──
      if (lowerText === "/kassa" || lowerText === "/finance" || lowerText === "касса" || lowerText === "💼 касса" || lowerText === "баланс") {
        const [state, withdrawals] = await Promise.all([
          prisma.companyState.findUnique({ where: { id: "global" } }),
          prisma.dbTransaction.groupBy({
            by: ["partner"],
            where: { type: "WITHDRAWAL_PARTNER" },
            _sum: { amount: true },
          }),
        ]);

        const cashbox = state?.cashbox || 0;
        const daniil = withdrawals.find((w) => w.partner === "DANIIL")?._sum.amount || 0;
        const elisey = withdrawals.find((w) => w.partner === "ELISEY")?._sum.amount || 0;

        const kassaText = `
💼 <b>Финансовый баланс ADLight</b>
──────────────────
💵 <b>Касса фирмы:</b> <code>${cashbox.toLocaleString("ru")} ₸</code>

👤 <b>Выведено партнерами:</b>
▫️ Даниил: <code>${daniil.toLocaleString("ru")} ₸</code>
▫️ Елисей (Я): <code>${elisey.toLocaleString("ru")} ₸</code>

──────────────────
🔗 <a href="https://crm.adlight.kz/finance">Управление финансами в CRM</a>
`;
        await sendTelegramMessage(botToken, chatId, kassaText);
        return NextResponse.json({ ok: true });
      }

      // ── Г. КОМАНДА: /leads ИЛИ /status ──
      if (lowerText === "/leads" || lowerText === "/status" || lowerText === "лиды" || lowerText === "заявки" || lowerText === "📋 заявки") {
        const [newCount, inProgressCount, processedCount, recentNew] = await Promise.all([
          prisma.lead.count({ where: { status: "NEW" } }),
          prisma.lead.count({ where: { status: "IN_PROGRESS" } }),
          prisma.lead.count({ where: { status: "PROCESSED" } }),
          prisma.lead.findMany({
            where: { status: "NEW" },
            orderBy: { createdAt: "desc" },
            take: 3,
            select: { id: true, name: true, phone: true, source: true },
          }),
        ]);

        let leadsText = `
📋 <b>Сводка по сделкам ADLight</b>
──────────────────
🔥 Новые заявки: <b>${newCount}</b>
⚙️ В работе: <b>${inProgressCount}</b>
🏭 В производстве: <b>${processedCount}</b>
`;

        if (recentNew.length > 0) {
          leadsText += `\n<b>Свежие необработанные:</b>\n`;
          recentNew.forEach((l, idx) => {
            leadsText += `${idx + 1}. <b>${l.name}</b> — <a href="tel:${l.phone}">${l.phone}</a>\n   🔗 <a href="https://crm.adlight.kz/leads?id=${l.id}">Открыть сделку</a>\n`;
          });
        }

        leadsText += `\n──────────────────\n🔗 <a href="https://crm.adlight.kz/leads">Все заявки в CRM</a>`;

        await sendTelegramMessage(botToken, chatId, leadsText);
        return NextResponse.json({ ok: true });
      }

      // ── Д. ССЫЛКА НА CRM ──
      if (lowerText === "🌐 открыть crm" || lowerText === "crm") {
        await sendTelegramMessage(
          botToken,
          chatId,
          `🚀 <b>Прямой вход в систему:</b>\n\n👉 <a href="https://crm.adlight.kz">crm.adlight.kz</a>`
        );
        return NextResponse.json({ ok: true });
      }

      // ── Е. КОМАНДА: /search <запрос> ──
      if (lowerText.startsWith("/search") || lowerText.startsWith("поиск") || lowerText.startsWith("найти")) {
        const query = rawText
          .replace(/^\/(search|find)/i, "")
          .replace(/^(поиск|найти)/i, "")
          .trim();

        if (!query) {
          await sendTelegramMessage(
            botToken,
            chatId,
            "🔍 Укажите имя или номер телефона для поиска. Пример: <code>/search Аслан</code> или <code>/search 7701</code>"
          );
          return NextResponse.json({ ok: true });
        }

        const cleanDigits = query.replace(/[^0-9]/g, "");

        const foundLeads = await prisma.lead.findMany({
          where: {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              ...(cleanDigits ? [{ phone: { contains: cleanDigits } }] : []),
            ],
          },
          take: 5,
          orderBy: { updatedAt: "desc" },
          select: { id: true, name: true, phone: true, status: true, revenue: true },
        });

        if (foundLeads.length === 0) {
          await sendTelegramMessage(
            botToken,
            chatId,
            `🔍 По запросу "<b>${query}</b>" ничего не найдено в базе заявок.`
          );
          return NextResponse.json({ ok: true });
        }

        let searchResultText = `🔍 <b>Найдено сделок (${foundLeads.length}):</b>\n──────────────────\n`;
        foundLeads.forEach((l, idx) => {
          searchResultText += `${idx + 1}. <b>${l.name}</b> (${l.status})\n   📱 ${l.phone}\n   💰 ${l.revenue ? l.revenue.toLocaleString("ru") + " ₸" : "Сумма не указана"}\n   🔗 <a href="https://crm.adlight.kz/leads?id=${l.id}">Открыть сделку</a>\n\n`;
        });

        await sendTelegramMessage(botToken, chatId, searchResultText);
        return NextResponse.json({ ok: true });
      }

      // ── Ж. ИНТЕЛЛЕКТУАЛЬНЫЙ AI-ОТВЕТЧИК (ЕСЛИ ЗАДАН GEMINI_API_KEY) ──
      const geminiApiKey = process.env.GEMINI_API_KEY;
      if (geminiApiKey && rawText.length > 3) {
        try {
          const aiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [
                      {
                        text: `Ты — интеллектуальный ассистент руководства рекламно-производственной компании ADLight (г. Алматы, Казахстан). 
Отвечай емко, профессионально, дружелюбно и по делу на русском языке.
Если пользователь задает вопрос о производстве, материалах, ценах или советуется — помоги ему.
Вопрос руководителя: "${rawText}"`,
                      },
                    ],
                  },
                ],
              }),
            }
          );

          const aiData = await aiResponse.json();
          const replyText =
            aiData?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Я получил ваш вопрос, но не смог сформировать ответ. Используйте /help для просмотра команд.";

          await sendTelegramMessage(botToken, chatId, `🤖 ${replyText}`);
          return NextResponse.json({ ok: true });
        } catch (aiErr) {
          console.error("Gemini AI API error:", aiErr);
        }
      }

      // Дефолтный ответ на неизвестные сообщения
      await sendTelegramMessage(
        botToken,
        chatId,
        `Я не распознал команду "<b>${rawText}</b>".\nОтправьте <b>/help</b> для просмотра списка команд или <b>/kassa</b> для проверки баланса.`
      );
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error processing Telegram webhook:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
