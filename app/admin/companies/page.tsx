import { prisma } from "@/lib/prisma";
import CompaniesDashboard from "./_components/CompaniesDashboard";

export const revalidate = 0;

export default async function CompaniesPage() {
  const [companies, allLeads] = await Promise.all([
    prisma.company.findMany({
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
    }),

    prisma.lead.findMany({
      select: {
        id: true,
        name: true,
        phone: true,
        address: true,
        companyId: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="w-full space-y-6">
      <CompaniesDashboard 
        initialCompanies={JSON.parse(JSON.stringify(companies))} 
        allLeads={JSON.parse(JSON.stringify(allLeads))}
      />
    </div>
  );
}
