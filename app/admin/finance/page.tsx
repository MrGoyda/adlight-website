import { getFinanceInitialData } from "./actions";
import FinanceDashboard from "./_components/FinanceDashboard";

export const revalidate = 0; // Отключаем кэширование для получения свежих финансовых логов

export default async function FinancePage() {
  const result = await getFinanceInitialData();

  if (!result.success || !result.data) {
    return (
      <div className="p-8 text-center text-rose-500 bg-rose-50 rounded-3xl border border-rose-200">
        Не удалось загрузить финансовую систему: {result.error || "Неизвестная ошибка"}
      </div>
    );
  }

  const { accounts, categories, funds, transactions, leads, totalCashbox } = result.data;

  return (
    <div className="w-full">
      <FinanceDashboard 
        accounts={accounts}
        categories={categories}
        funds={funds}
        transactions={transactions}
        leads={leads}
        totalCashbox={totalCashbox}
      />
    </div>
  );
}
