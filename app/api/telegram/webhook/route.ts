import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendMetaConversionEvent, sendYandexConversionEvent } from "@/lib/analytics";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Проверяем, является ли запрос callback_query (нажатием инлайн-кнопки в Telegram)
    if (body.callback_query) {
      const callback = body.callback_query;
      const callbackData = callback.data || "";
      const botToken = process.env.TELEGRAM_BOT_TOKEN;

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

          // 3. Если статус "В производстве" или "Завершен" — отправляем офлайн-конверсии в Google Ads / Meta / Yandex
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

            // Yandex Offline
            if (updatedLead.yandexClientId) {
              await sendYandexConversionEvent(updatedLead.yandexClientId, revenue);
            }
          }

          // 4. Отвечаем Telegram, что кнопка обработана (убираем часики на кнопке)
          if (botToken) {
            await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                callback_query_id: callback.id,
                text: `✅ Статус лида "${lead.name}" успешно обновлен на ${newStatus}!`,
                show_alert: false,
              }),
            });

            // Обновляем текст кнопки в Telegram на зеленый статус
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
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error processing Telegram webhook:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
