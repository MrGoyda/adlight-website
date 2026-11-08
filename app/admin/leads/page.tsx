import { prisma } from "@/lib/prisma";
import LeadsDashboard from "./_components/LeadsDashboard";
import { getCachedCalculatorPrices } from "@/lib/cachedQueries";

export const revalidate = 0; // Отключаем кэширование страницы для получения актуальных данных

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // В Next.js 15/16 searchParams является Promise, обязательно await-им его
  const resolvedParams = await searchParams;
  const selectedLeadId = typeof resolvedParams.id === "string" ? resolvedParams.id : undefined;

  // Параллельное выполнение всех запросов с кэшированным каталогом (ускорение в 3-5 раз)
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
          take: 10,
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
          take: 20,
        },
        estimate: {
          include: {
            items: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 250,
    }),

    // 2. Клиентская база
    prisma.client.findMany({
      orderBy: { name: "asc" },
      take: 100,
    }),

    // 3. Компании со связями
    prisma.company.findMany({
      include: {
        projects: true,
        contacts: true,
      },
      orderBy: { name: "asc" },
      take: 100,
    }),

    // 4. Складские позиции
    prisma.warehouseItem.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        quantity: true,
        unit: true,
        price: true,
      },
      orderBy: { name: "asc" },
    }),

    // 5. Ожидающие клики аналитики
    prisma.leadClick.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" },
      take: 15,
    }),

    // 6. Прайсы поставщиков (из Data Cache, 0ms вместо 1500ms)
    getCachedCalculatorPrices(),
  ]);

  return (
    <div className="w-full">
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
  );
}
