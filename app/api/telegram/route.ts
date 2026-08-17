import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getFeatureFlags } from '@/lib/featureFlags';
import { prisma } from '@/lib/prisma';
import { normalizePhone } from '@/lib/phoneUtils';

// Простой in-memory кэш для лимитирования запросов по IP (Rate Limiting)
const rateLimitMap = new Map<string, number[]>();
const LIMIT_WINDOW_MS = 5 * 60 * 1000; // Окно: 5 минут
const LIMIT_MAX_REQUESTS = 5;         // Лимит: максимум 5 отправлений за 5 минут

// Схема валидации Zod
const LeadSchema = z.object({
  name: z.string()
    .min(2, { message: 'Имя должно содержать не менее 2 символов' })
    .max(50, { message: 'Имя должно содержать не более 50 символов' })
    .transform(val => val.replace(/<[^>]*>/g, '').trim()), // Очистка от HTML и лишних пробелов
  phone: z.string()
    .min(8, { message: 'Телефон слишком короткий' })
    .regex(/^[\d\s()+-]+$/, { message: 'Некорректный формат телефона' }),
  source: z.string().optional().default('Не указан'),
  message: z.string().optional(),
  website: z.string().optional(), // Honeypot-поле
});

interface ParsedSource {
  title: string;
  formType: string;
  context: string;
  quizQuestions?: Array<{ q: string; a: string }>;
}

const parseLeadSource = (source: string): ParsedSource => {
  // 1. Проверяем, если лид пришел с квиза
  if (source.includes("Квиз-Подбор")) {
    const questions: Array<{ q: string; a: string }> = [];
    
    const signMatch = source.match(/\[Вывеска:\s*([^\]]+)\]/);
    const nicheMatch = source.match(/\[Ниша:\s*([^\]]+)\]/);
    const timelineMatch = source.match(/\[Сроки:\s*([^\]]+)\]/);
    
    if (signMatch) questions.push({ q: "Что изготовить", a: signMatch[1].trim() });
    if (nicheMatch) questions.push({ q: "Сфера бизнеса", a: nicheMatch[1].trim() });
    if (timelineMatch) questions.push({ q: "Сроки производства", a: timelineMatch[1].trim() });
    
    return {
      title: "🔥 <b>НОВАЯ ЗАЯВКА С КВИЗА!</b>",
      formType: "Квиз-подбор вывески со скидкой 10%",
      context: "Интерактивный квиз на сайте",
      quizQuestions: questions,
    };
  }

  // 2. Логика маппинга для обычных форм связи
  let formType = "Быстрая заявка";
  let context = source;

  if (source.includes("Хедер")) {
    formType = "Быстрая консультация";
    context = "Кнопка «Заказать звонок» в шапке сайта";
  } else if (source.includes("Hero Section - Заявка")) {
    formType = "Заявка на консультацию";
    context = "Главный экран (Hero Section)";
  } else if (source.includes("Дизайн-код (Hero)")) {
    formType = "Консультация по дизайн-коду";
    context = "Первый экран страницы Дизайн-кода";
  } else if (source.includes("Промо-баннер")) {
    formType = "Зафиксировать скидку 10%";
    context = "Промо-баннер со скидкой (подвал лендинга)";
  } else if (source.includes("Hero Section:")) {
    const serviceName = source.replace("Hero Section:", "").trim();
    formType = `Заявка на расчет: ${serviceName}`;
    context = `Первый экран страницы "${serviceName}"`;
  } else if (source.includes("Блок решений:")) {
    const nicheName = source.replace("Блок решений:", "").trim();
    formType = `Решение для ниши: ${nicheName}`;
    context = "Интерактивный блок отраслевых решений";
  } else if (source.includes("Согласование вывески")) {
    formType = "Согласование вывески";
    context = "Блок проверки соответствия дизайн-коду";
  }

  return {
    title: "⚡️ <b>НОВЫЙ ЛИД С САЙТА!</b>",
    formType,
    context,
  };
};

export async function POST(req: Request) {
  try {
    // 1. IP Rate Limiting (лимитирование запросов для защиты от спама)
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
               req.headers.get('x-real-ip') || 
               '127.0.0.1';

    const now = Date.now();
    const requestTimes = rateLimitMap.get(ip) || [];
    
    // Оставляем только те отметки времени, которые попадают в последние 5 минут
    const activeTimes = requestTimes.filter((time) => now - time < LIMIT_WINDOW_MS);
    
    if (activeTimes.length >= LIMIT_MAX_REQUESTS) {
      console.warn(`Rate limit exceeded for IP: ${ip}`);
      return NextResponse.json({ 
        error: 'Слишком много запросов. Пожалуйста, подождите 5 минут.' 
      }, { status: 429 });
    }
    
    activeTimes.push(now);
    rateLimitMap.set(ip, activeTimes);

    // 2. Валидация входных данных
    const body = await req.json();
    const flags = getFeatureFlags();

    let name: string;
    let phone: string;
    let rawSource: string;
    let customMessage: string | undefined;
    let honeypot: string | undefined;

    if (flags.enableZodValidation) {
      // Строгая валидация Zod
      const result = LeadSchema.safeParse(body);
      
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        return NextResponse.json({ 
          error: 'Ошибка валидации данных', 
          details: errors 
        }, { status: 400 });
      }

      name = result.data.name;
      phone = result.data.phone;
      rawSource = result.data.source;
      customMessage = result.data.message;
      honeypot = result.data.website;
    } else {
      // Старая логика обратной совместимости
      name = body.name;
      phone = body.phone;
      rawSource = body.source;
      customMessage = body.message;
      honeypot = body.website;

      if (!name || !phone) {
        return NextResponse.json({ error: 'Имя и телефон обязательны' }, { status: 400 });
      }
    }

    // 3. Honeypot спам-фильтрация (если невидимое поле "website" заполнено, блокируем отправку тихо)
    if (honeypot && honeypot.trim().length > 0) {
      console.warn(`Spam bot detected via Honeypot check! IP: ${ip}, Blocked silently.`);
      return NextResponse.json({ success: true, spamBlocked: true });
    }

    // Сохранение лида в базу данных Supabase с UTM-метками и Client IDs
    let leadId = '';
    const cleanPhone = normalizePhone(phone) || phone;
    
    try {
      // 1. Поиск или создание клиента
      let clientId: string | null = null;
      try {
        const existingClient = await prisma.client.findFirst({
          where: {
            OR: [
              { phone: cleanPhone },
              { phone: phone }
            ]
          }
        });
        if (existingClient) {
          clientId = existingClient.id;
        } else {
          const newClient = await prisma.client.create({
            data: {
              name,
              phone: cleanPhone,
              notes: `Создан из лида: ${rawSource}`,
            }
          });
          clientId = newClient.id;
        }
      } catch (clientErr) {
        console.error('Client auto-link error in telegram route:', clientErr);
      }

      // 2. Создание лида
      const dbLead = await prisma.lead.create({
        data: {
          name,
          phone: cleanPhone,
          message: customMessage || null,
          calcDetails: body.calcDetails || null,
          status: 'NEW',
          source: rawSource || 'Сайт',
          utmSource: body.utmSource || null,
          utmMedium: body.utmMedium || null,
          utmCampaign: body.utmCampaign || null,
          utmContent: body.utmContent || null,
          utmTerm: body.utmTerm || null,
          yandexClientId: body.yandexClientId || null,
          googleClientId: body.googleClientId || null,
          fbBrowserId: body.fbBrowserId || null,
          clientId: clientId,
        },
      });
      leadId = dbLead.id;

      // 3. Если передан ID клика, связываем его
      if (body.clickId && leadId) {
        await prisma.leadClick.update({
          where: { id: body.clickId },
          data: {
            status: 'MATCHED',
            matchedLeadId: leadId,
          },
        }).catch(() => {});
      }
    } catch (dbError) {
      console.error('Database lead insertion failed:', dbError);
    }

    // 4. Получение приватных ключей из переменных окружения (.env.local)
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error('Telegram bot credentials are not configured in environment variables!');
      return NextResponse.json({ error: 'Внутренняя ошибка конфигурации сервера' }, { status: 500 });
    }

    // Парсим технический источник в человекочитаемый вид
    const parsed = parseLeadSource(rawSource);

    // Строим красивое HTML-сообщение
    let messageContent = `
${parsed.title}
──────────────────
👤 <b>Имя:</b> ${name}
📱 <b>Телефон:</b> <a href="tel:${phone.replace(/[^0-9+]/g, '')}">${phone}</a>
🏷️ <b>Форма:</b> ${parsed.formType}
🎯 <b>Контекст:</b> ${parsed.context}
`;

    // Если есть ответы на квиз, добавляем их аккуратным списком
    if (parsed.quizQuestions && parsed.quizQuestions.length > 0) {
      messageContent += `
📋 <b>ОТВЕТЫ НА ВОПРОСЫ:</b>
`;
      parsed.quizQuestions.forEach((q) => {
        messageContent += `▪️ <b>${q.q}:</b> ${q.a}\n`;
      });
    }

    if (customMessage) {
      messageContent += `📝 <b>Сообщение:</b> ${customMessage}\n`;
    }

    messageContent += `──────────────────
🔗 <a href="https://adlight.kz/admin/leads?id=${leadId}">Открыть в CRM</a>
⏰ <i>${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Almaty' })} (Астана)</i>
`;

    // 5. Отправляем запрос к API Telegram для каждого Chat ID
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const chatIds = chatId.split(',').map(id => id.trim());

    console.log(`[Telegram] Sending to chat IDs: ${chatIds.join(', ')} | Lead: ${leadId} | Source: ${rawSource}`);
    
    const sendPromises = chatIds.map(async (id) => {
      const telegramPayload: any = {
        chat_id: id,
        text: messageContent.trim(),
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      };

      if (leadId) {
        telegramPayload.reply_markup = {
          inline_keyboard: [
            [
              { text: "🟢 Принять (В работу)", callback_data: `lead_qualify:${leadId}:IN_PROGRESS` },
              { text: "💰 Оплачен задаток", callback_data: `lead_qualify:${leadId}:PROCESSED` }
            ],
            [
              { text: "🔴 Отказ / Спам", callback_data: `lead_qualify:${leadId}:CANCELLED` }
            ]
          ]
        };
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(telegramPayload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error(`[Telegram] ❌ FAILED for chat_id=${id} | HTTP ${response.status} | Error: ${JSON.stringify(responseData)}`);
      } else {
        console.log(`[Telegram] ✅ Sent OK to chat_id=${id} | message_id=${responseData?.result?.message_id}`);
      }

      return { id, response, responseData };
    });

    const results = await Promise.all(sendPromises);
    const failedChats: string[] = [];

    for (const result of results) {
      if (!result.response.ok) {
        failedChats.push(`chat_id=${result.id}: ${result.responseData?.description || 'Unknown error'}`);
      }
    }

    if (failedChats.length === chatIds.length) {
      console.error(`[Telegram] ❌ ALL chats failed: ${failedChats.join(' | ')}`);
      return NextResponse.json({ error: `Ошибка Telegram: ${failedChats.join(', ')}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, partialFailures: failedChats.length > 0 ? failedChats : undefined });

  } catch (error) {
    console.error('[Telegram] ❌ Internal Server Error:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}