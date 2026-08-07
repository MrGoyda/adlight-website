import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      type = "whatsapp",
      pageUrl = "",
      gclid = null,
      yclid = null,
      fbclid = null,
      utmSource = null,
      utmMedium = null,
      utmCampaign = null,
      utmContent = null,
      utmTerm = null,
      yandexClientId = null,
      googleClientId = null,
      fbBrowserId = null,
    } = body;

    // Генерируем 4-значный короткий уникальный код (например "AD-8492")
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const code = `AD-${randomDigits}`;

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      null;
    const userAgent = request.headers.get("user-agent") || null;

    // Записываем клик в БД Supabase/Prisma
    const click = await prisma.leadClick.create({
      data: {
        code,
        type,
        pageUrl,
        gclid,
        yclid,
        fbclid,
        utmSource,
        utmMedium,
        utmCampaign,
        utmContent,
        utmTerm,
        yandexClientId,
        googleClientId,
        fbBrowserId,
        ip,
        userAgent,
      },
    });

    return NextResponse.json({
      success: true,
      code: click.code,
      clickId: click.id,
    });
  } catch (error) {
    console.error("Error registering click:", error);
    // В случае ошибки возвращаем базовый фоллбек-код, чтобы интерфейс не ломался
    const fallbackCode = `AD-${Math.floor(1000 + Math.random() * 9000)}`;
    return NextResponse.json({
      success: false,
      code: fallbackCode,
    });
  }
}
