import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Выбираем нераспределенные клики за последние 48 часов
    const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);

    const clicks = await prisma.leadClick.findMany({
      where: {
        createdAt: { gte: twoDaysAgo },
        status: "PENDING",
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({ success: true, clicks });
  } catch (error) {
    console.error("Error fetching recent clicks:", error);
    return NextResponse.json({ error: "Failed to fetch clicks" }, { status: 500 });
  }
}
