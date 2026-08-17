import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { clickId } = await req.json();

    if (!clickId) {
      return NextResponse.json({ error: "Missing clickId" }, { status: 400 });
    }

    const updatedClick = await prisma.leadClick.update({
      where: { id: clickId },
      data: {
        status: "DISCARDED",
      },
    });

    return NextResponse.json({ success: true, click: updatedClick });
  } catch (error: any) {
    console.error("Discard click error:", error);
    return NextResponse.json({ error: error.message || "Failed to discard click" }, { status: 500 });
  }
}
