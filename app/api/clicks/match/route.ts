import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { leadId, clickId } = await req.json();

    if (!leadId || !clickId) {
      return NextResponse.json({ error: "leadId and clickId required" }, { status: 400 });
    }

    const click = await prisma.leadClick.findUnique({
      where: { id: clickId },
    });

    if (!click) {
      return NextResponse.json({ error: "Click not found" }, { status: 404 });
    }

    // 1. Обновляем лид маркетинг данными клика
    const lead = await prisma.lead.update({
      where: { id: leadId },
      data: {
        utmSource: click.utmSource || undefined,
        utmMedium: click.utmMedium || undefined,
        utmCampaign: click.utmCampaign || undefined,
        utmContent: click.utmContent || undefined,
        utmTerm: click.utmTerm || undefined,
        yandexClientId: click.yandexClientId || undefined,
        googleClientId: click.googleClientId || undefined,
        fbBrowserId: click.fbBrowserId || undefined,
      },
    });

    // 2. Помечаем клик как MATCHED
    await prisma.leadClick.update({
      where: { id: clickId },
      data: {
        status: "MATCHED",
        matchedLeadId: leadId,
      },
    });

    // 3. Создаем запись в активности
    await prisma.leadActivity.create({
      data: {
        leadId,
        text: `Клик [Код: ${click.code}, ${click.type.toUpperCase()}] успешно привязан к сделке.`,
        type: "NOTE",
        author: "Менеджер CRM",
      },
    });

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error("Error matching click:", error);
    return NextResponse.json({ error: "Failed to match click" }, { status: 500 });
  }
}
