import { NextResponse } from 'next/server';

// Вставляем ваши данные напрямую для надежности
const TELEGRAM_BOT_TOKEN = '8354234464:AAH6g-fNSueBfjm2UZid0mKVCCqqX_lOOZc';
const TELEGRAM_CHAT_ID = '5574165741';

export async function POST(req: Request) {
  try {
    // 1. Получаем данные из тела запроса
    const body = await req.json();
    const { name, phone, source } = body;

    // Простая проверка, что данные пришли
    if (!name || !phone) {
      return NextResponse.json({ error: 'Имя и телефон обязательны' }, { status: 400 });
    }

    // 2. Формируем сообщение для Telegram
    // Используем HTML разметку для красоты
    const message = `
🔥 <b>НОВАЯ ЗАЯВКА С САЙТА!</b>

👤 <b>Имя:</b> ${name}
📱 <b>Телефон:</b> <a href="tel:${phone.replace(/[^0-9+]/g, '')}">${phone}</a>
📍 <b>Источник:</b> ${source || 'Не указан'}

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
        text: message,
        parse_mode: 'HTML', // Важно для жирного шрифта
      }),
    });

    // Проверяем ответ от Телеграма
    if (!telegramResponse.ok) {
      const errorData = await telegramResponse.json();
      console.error('Telegram API Error:', errorData);
      return NextResponse.json({ error: `Ошибка Telegram: ${errorData.description}` }, { status: 500 });
    }

    // Успех
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Internal Server Error:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}