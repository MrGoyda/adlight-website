import { prisma } from "@/lib/prisma";
import CompaniesDashboard from "./_components/CompaniesDashboard";

export const revalidate = 0;

export default async function CompaniesPage() {
  const companies = await prisma.company.findMany({
    include: {
      contacts: true,
      projects: true,
      leads: {
        select: {
          id: true,
          revenue: true,
          expenses: true,
          status: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });

  const allLeads = await prisma.lead.findMany({
    select: {
      id: true,
      name: true,
      phone: true,
      address: true,
      companyId: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-slate-50/50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <CompaniesDashboard 
          initialCompanies={JSON.parse(JSON.stringify(companies))} 
          allLeads={JSON.parse(JSON.stringify(allLeads))}
        />
      </div>
    </main>
  );
}
