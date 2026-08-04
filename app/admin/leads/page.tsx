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

  const leads = await prisma.lead.findMany({
    include: {
      client: true,
      files: {
        select: {
          id: true,
          mimeType: true,
          category: true,
        },
      },
      activities: {
        select: {
          id: true,
        },
      },
      estimate: {
        include: {
          items: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const clients = await prisma.client.findMany({
    orderBy: { name: "asc" },
  });

  const warehouseItems = await prisma.warehouseItem.findMany({
    orderBy: { name: "asc" },
  });

  const supplierPrices = await prisma.supplierPrice.findMany({
    include: {
      supplierObj: true
    },
    orderBy: { supplier: "asc" },
  });

  return (
    <main className="min-h-screen bg-slate-50/50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <LeadsDashboard 
          initialLeads={JSON.parse(JSON.stringify(leads))} 
          initialClients={JSON.parse(JSON.stringify(clients))}
          initialWarehouseItems={JSON.parse(JSON.stringify(warehouseItems))}
          initialSupplierPrices={JSON.parse(JSON.stringify(supplierPrices))}
          selectedLeadId={selectedLeadId} 
        />
      </div>
    </main>
  );
}
