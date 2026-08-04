import { prisma } from "@/lib/prisma";
import FinanceDashboard from "./_components/FinanceDashboard";
import { PartnerName, TransactionType } from "@prisma/client";

export const revalidate = 0; // Отключаем кэширование для получения свежих финансовых логов

export default async function FinancePage() {
  // 1. Получаем состояние кассы
  const state = await prisma.companyState.findUnique({
    where: { id: "global" },
  });
  const cashbox = state?.cashbox || 0;

  // 2. Получаем все транзакции
  const transactions = await prisma.dbTransaction.findMany({
    orderBy: { createdAt: "desc" },
    include: { lead: true }
  });

  // 3. Высчитываем суммарные выводы партнеров
  const withdrawals = await prisma.dbTransaction.groupBy({
    by: ["partner"],
    where: {
      type: TransactionType.WITHDRAWAL_PARTNER,
    },
    _sum: {
      amount: true,
    },
  });

  const withdrawalsMap = {
    DANIIL: withdrawals.find(w => w.partner === PartnerName.DANIIL)?._sum.amount || 0,
    ELISEY: withdrawals.find(w => w.partner === PartnerName.ELISEY)?._sum.amount || 0,
  };

  // 4. Получаем список сделок для привязки к доходу
  const leads = await prisma.lead.findMany({
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
  });

  return (
    <main className="min-h-screen bg-slate-50/50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <FinanceDashboard 
          cashbox={cashbox}
          transactions={JSON.parse(JSON.stringify(transactions))}
          withdrawals={withdrawalsMap}
          leads={leads}
        />
      </div>
    </main>
  );
}
