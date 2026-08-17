import React from "react";
import { prisma } from "@/lib/prisma";
import ClicksDashboard from "./_components/ClicksDashboard";

export const revalidate = 0; // Динамические данные

export default async function ClicksPage() {
  const initialClicks = await prisma.leadClick.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  // Преобразуем Date в ISO String для чистой гидратации
  const formattedClicks = initialClicks.map((c) => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
  }));

  return <ClicksDashboard initialClicks={formattedClicks} />;
}
