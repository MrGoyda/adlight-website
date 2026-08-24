import { prisma } from "@/lib/prisma";
import FinanceDashboard from "./_components/FinanceDashboard";
import { PartnerName, TransactionType } from "@prisma/client";

export const revalidate = 0; // Отключаем кэширование для получения свежих финансовых логов

export default async function FinancePage() {
  // Параллельный запрос состояния кассы, транзакций, выводов и сделок через Promise.all
  const [
    state,
    transactions,
    withdrawals,
    leads
  ] = await Promise.all([
    // 1. Получаем состояние кассы
    prisma.companyState.findUnique({
      where: { id: "global" },
    }),

    // 2. Получаем все транзакции
    prisma.dbTransaction.findMany({
      orderBy: { createdAt: "desc" },
      include: { lead: true }
    }),

    // 3. Высчитываем суммарные выводы партнеров
    prisma.dbTransaction.groupBy({
      by: ["partner"],
      where: {
        type: TransactionType.WITHDRAWAL_PARTNER,
      },
      _sum: {
        amount: true,
      },
    }),

    // 4. Получаем список сделок для привязки к доходу
    prisma.lead.findMany({
      where: {
        status: {
          not: "CANCELLED"
        }
      },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        name: true,
        phone: true,
        status: true,
        prepayment: true,
        revenue: true,
      }
    }),
  ]);

  const cashbox = state?.cashbox || 0;

  const withdrawalsMap = {
    DANIIL: withdrawals.find(w => w.partner === PartnerName.DANIIL)?._sum.amount || 0,
    ELISEY: withdrawals.find(w => w.partner === PartnerName.ELISEY)?._sum.amount || 0,
  };

  return (
    <main className="min-h-screen bg-slate-50/50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <FinanceDashboard 
          cashbox={cashbox}
          transactions={JSON.parse(JSON.stringify(transactions))}
          withdrawals={withdrawalsMap}
          leads={JSON.parse(JSON.stringify(leads))}
        />
      </div>
    </main>
  );
}
