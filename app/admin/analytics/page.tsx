import { prisma } from "@/lib/prisma";
import AnalyticsDashboard from "./_components/AnalyticsDashboard";
import { LeadStatus } from "@prisma/client";

export const revalidate = 0; // Отключаем кэш для получения актуальной статистики

export default async function AnalyticsPage() {
  // 1. Получаем всех лидов для расчета маркетинговой статистики
  const leads = await prisma.lead.findMany();

  // 2. Группируем показатели по источникам рекламы (UTM Source)
  const sourceStats: Record<
    string,
    { count: number; completedCount: number; revenue: number; expenses: number }
  > = {};

  leads.forEach((lead) => {
    const source = lead.utmSource || "Органический трафик (SEO)";
    if (!sourceStats[source]) {
      sourceStats[source] = { count: 0, completedCount: 0, revenue: 0, expenses: 0 };
    }
    
    sourceStats[source].count += 1;
    if (lead.status === LeadStatus.COMPLETED) {
      sourceStats[source].completedCount += 1;
      sourceStats[source].revenue += lead.revenue;
      sourceStats[source].expenses += lead.expenses;
    }
  });

  const formattedStats = Object.entries(sourceStats).map(([source, data]) => ({
    source,
    leadsCount: data.count,
    completedCount: data.completedCount,
    conversionRate: data.count > 0 ? (data.completedCount / data.count) * 100 : 0,
    revenue: data.revenue,
    expenses: data.expenses,
    netProfit: data.revenue - data.expenses,
  })).sort((a, b) => b.revenue - a.revenue); // Сортируем по выручке

  // 3. Общие финансовые агрегаты
  const totalRevenue = leads.reduce((sum, l) => sum + l.revenue, 0);
  const totalExpenses = leads.reduce((sum, l) => sum + l.expenses, 0);
  const totalLeads = leads.length;
  const completedLeads = leads.filter(l => l.status === LeadStatus.COMPLETED).length;

  return (
    <main className="min-h-screen bg-slate-50/50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <AnalyticsDashboard 
          stats={formattedStats}
          summary={{
            totalRevenue,
            totalExpenses,
            netProfit: totalRevenue - totalExpenses,
            totalLeads,
            completedLeads,
            averageBill: completedLeads > 0 ? totalRevenue / completedLeads : 0,
          }}
        />
      </div>
    </main>
  );
}
