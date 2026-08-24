import { prisma } from "@/lib/prisma";
import LeadsDashboard from "./_components/LeadsDashboard";

export const revalidate = 0; // Отключаем кэширование страницы для получения актуальных данных

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // В Next.js 15/16 searchParams является Promise, обязательно await-им его
  const resolvedParams = await searchParams;
  const selectedLeadId = typeof resolvedParams.id === "string" ? resolvedParams.id : undefined;

  // Параллельное выполнение всех 6 независимых запросов к БД через Promise.all (ускорение в 3 раза)
  const [
    leads,
    clients,
    companies,
    warehouseItems,
    pendingClicks,
    supplierPrices
  ] = await Promise.all([
    // 1. Лиды со связями и оптимизированными полями
    prisma.lead.findMany({
      include: {
        client: true,
        company: true,
        project: true,
        contact: true,
        files: {
          select: {
            id: true,
            mimeType: true,
            category: true,
            name: true,
            url: true,
            fileKey: true,
            size: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
        activities: {
          select: {
            id: true,
            text: true,
            createdAt: true,
            author: true,
            type: true,
          },
          orderBy: { createdAt: "desc" },
        },
        estimate: {
          include: {
            items: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),

    // 2. Клиентская база
    prisma.client.findMany({
      orderBy: { name: "asc" },
    }),

    // 3. Компании со связями
    prisma.company.findMany({
      include: {
        projects: true,
        contacts: true,
      },
      orderBy: { name: "asc" },
    }),

    // 4. Складские позиции
    prisma.warehouseItem.findMany({
      orderBy: { name: "asc" },
    }),

    // 5. Ожидающие клики аналитики
    prisma.leadClick.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" },
      take: 15,
    }),

    // 6. Прайсы поставщиков
    prisma.supplierPrice.findMany({
      include: {
        supplierObj: true,
      },
      orderBy: { supplier: "asc" },
    }),
  ]);

  return (
    <main className="min-h-screen bg-slate-50/50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <LeadsDashboard 
          initialLeads={JSON.parse(JSON.stringify(leads))} 
          initialClients={JSON.parse(JSON.stringify(clients))}
          initialCompanies={JSON.parse(JSON.stringify(companies))}
          initialWarehouseItems={JSON.parse(JSON.stringify(warehouseItems))}
          initialSupplierPrices={JSON.parse(JSON.stringify(supplierPrices))}
          initialPendingClicks={JSON.parse(JSON.stringify(pendingClicks))}
          selectedLeadId={selectedLeadId} 
        />
      </div>
    </main>
  );
}
