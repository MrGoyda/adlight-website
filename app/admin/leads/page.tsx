import { prisma } from "@/lib/prisma";
import LeadsDashboard from "./_components/LeadsDashboard";
import { getCachedCalculatorPrices } from "@/lib/cachedQueries";

export const revalidate = 0; // Актуальные оперативные данные CRM

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const selectedLeadId = typeof resolvedParams.id === "string" ? resolvedParams.id : undefined;

  // Оптимизированное параллельное получение данных (без избыточных джойнов и кликов)
  const [
    leads,
    clients,
    companies,
    warehouseItems,
    supplierPrices
  ] = await Promise.all([
    // 1. Лиды с компактными связями
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
          take: 5,
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
          take: 5,
        },
        estimate: {
          include: {
            items: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    }),

    // 2. Клиентская база
    prisma.client.findMany({
      orderBy: { name: "asc" },
      take: 100,
    }),

    // 3. Компании
    prisma.company.findMany({
      include: {
        projects: true,
        contacts: true,
      },
      orderBy: { name: "asc" },
      take: 80,
    }),

    // 4. Складские позиции (чистые скалярные поля без Date)
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

    // 5. Прайсы поставщиков (из Next.js Data Cache)
    getCachedCalculatorPrices(),
  ]);

  return (
    <div className="w-full">
      <LeadsDashboard 
        initialLeads={JSON.parse(JSON.stringify(leads))} 
        initialClients={JSON.parse(JSON.stringify(clients))}
        initialCompanies={JSON.parse(JSON.stringify(companies))}
        initialWarehouseItems={warehouseItems}
        initialSupplierPrices={supplierPrices}
        selectedLeadId={selectedLeadId} 
      />
    </div>
  );
}
