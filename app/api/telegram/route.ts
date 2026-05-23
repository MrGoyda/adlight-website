import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getFeatureFlags } from '@/lib/featureFlags';

// Вставляем ваши данные напрямую для надежности
const TELEGRAM_BOT_TOKEN = '8354234464:AAH6g-fNSueBfjm2UZid0mKVCCqqX_lOOZc';
const TELEGRAM_CHAT_ID = '5574165741';

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
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const flags = getFeatureFlags();

    let name: string;
    let phone: string;
    let source: string;
    let customMessage: string | undefined;

    if (flags.enableZodValidation) {
      // Строгая валидация Zod
      const result = LeadSchema.safeParse(body);
      
      if (!result.success) {
        // Возвращаем ошибки Zod в удобном плоском формате
        const errors = result.error.flatten().fieldErrors;
        return NextResponse.json({ 
          error: 'Ошибка валидации данных', 
          details: errors 
        }, { status: 400 });
      }

      name = result.data.name;
      phone = result.data.phone;
      source = result.data.source;
      customMessage = result.data.message;
    } else {
      // Старая логика (обратная совместимость при отключенном флаге)
      name = body.name;
      phone = body.phone;
      source = body.source;
      customMessage = body.message;

      if (!name || !phone) {
        return NextResponse.json({ error: 'Имя и телефон обязательны' }, { status: 400 });
      }
    }

    // 2. Формируем сообщение для Telegram с учетом кастомных деталей
    const messageContent = `
🔥 <b>НОВАЯ ЗАЯВКА С САЙТА!</b>

👤 <b>Имя:</b> ${name}
📱 <b>Телефон:</b> <a href="tel:${phone.replace(/[^0-9+]/g, '')}">${phone}</a>
📍 <b>Источник:</b> ${source}
${customMessage ? `📝 <b>Детали:</b> ${customMessage}` : ''}

⏰ <i>${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Almaty' })}</i>
    `;

    // 3. Отправляем запрос к API Telegram
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const telegramResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: messageContent.trim(),
        parse_mode: 'HTML', // HTML теги для красивой верстки
      }),
    });

    if (!telegramResponse.ok) {
      const errorData = await telegramResponse.json();
      console.error('Telegram API Error:', errorData);
      return NextResponse.json({ error: `Ошибка Telegram: ${errorData.description}` }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Internal Server Error:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}