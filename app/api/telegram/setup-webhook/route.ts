import { NextResponse } from "next/server";

export async function GET() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const webhookUrl = "https://adlight.kz/api/telegram/webhook";

  if (!botToken) {
    return NextResponse.json({ error: "TELEGRAM_BOT_TOKEN missing" }, { status: 500 });
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/setWebhook?url=${encodeURIComponent(webhookUrl)}`);
    const data = await res.json();

    return NextResponse.json({
      success: data.ok,
      telegramResponse: data,
      webhookUrl,
    });
  } catch (error) {
    console.error("Error setting Telegram webhook:", error);
    return NextResponse.json({ error: "Failed to set webhook" }, { status: 500 });
  }
}
