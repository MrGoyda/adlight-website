import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import LeadDetailPage from "./_components/LeadDetailPage";

export const revalidate = 0; // Отключаем кэш для получения актуальных данных

export default async function LeadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const leadId = resolvedParams.id;

  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: {
      client: true,
      company: {
        include: {
          contacts: true,
          projects: true,
        },
      },
      project: true,
      contact: true,
      files: {
        orderBy: { createdAt: "desc" },
      },
      activities: {
        orderBy: { createdAt: "desc" },
      },
      estimate: {
        include: {
          items: true,
        },
      },
    },
  });

  const companies = await prisma.company.findMany({
    include: {
      contacts: true,
      projects: true,
    },
    orderBy: { name: "asc" },
  });

  if (!lead) {
    notFound();
  }

  const warehouseItems = await prisma.warehouseItem.findMany({
    orderBy: { name: "asc" },
  });

  const supplierPrices = await prisma.supplierPrice.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-slate-50/50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <LeadDetailPage 
          lead={JSON.parse(JSON.stringify(lead))} 
          companies={JSON.parse(JSON.stringify(companies))}
          warehouseItems={JSON.parse(JSON.stringify(warehouseItems))}
          supplierPrices={JSON.parse(JSON.stringify(supplierPrices))}
        />
      </div>
    </main>
  );
}
