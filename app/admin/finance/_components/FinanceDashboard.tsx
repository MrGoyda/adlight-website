"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TransactionType, PartnerName } from "@prisma/client";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  User, 
  PlusCircle, 
  ArrowDownLeft, 
  LogOut,
  Calendar,
  AlertCircle
} from "lucide-react";
import { addCompanyExpense, recordPartnerWithdrawal, addCompanyIncome } from "../actions";
import { triggerHaptic } from "@/lib/haptics";
import Button from "@/components/ui/Button";
import { crmDict } from "@/dictionaries/crm";

interface Transaction {
  id: string;
  createdAt: string;
  type: TransactionType;
  amount: number;
  description: string;
  partner: PartnerName | null;
  lead?: {
    name: string;
    phone: string;
  } | null;
}

interface LeadForIncome {
  id: string;
  name: string;
  phone: string;
  status: string;
  prepayment: number;
  revenue: number;
}

interface FinanceDashboardProps {
  cashbox: number;
  transactions: Transaction[];
  withdrawals: {
    DANIIL: number;
    ELISEY: number;
  };
  leads?: LeadForIncome[];
}

const TYPE_MAP: Record<TransactionType, { label: string; color: string; bg: string }> = {
  INCOME: { label: "Доход (Выручка)", color: "text-emerald-600 border-emerald-200", bg: "bg-emerald-50" },
  EXPENSE_COMPANY: { label: "Расход фирмы", color: "text-rose-600 border-rose-200", bg: "bg-rose-50" },
  WITHDRAWAL_PARTNER: { label: "Вывод партнера", color: "text-amber-600 border-amber-200", bg: "bg-amber-50" },
};

export default function FinanceDashboard({ cashbox, transactions, withdrawals, leads = [] }: FinanceDashboardProps) {
  const router = useRouter();
  
  // Состояния для форм
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDesc, setExpenseDesc] = useState("");
  const [isSubmittingExpense, setIsSubmittingExpense] = useState(false);
  
  const [withdrawalPartner, setWithdrawalPartner] = useState<PartnerName>("ELISEY");
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [withdrawalDesc, setWithdrawalDesc] = useState("");
  const [isSubmittingWithdrawal, setIsSubmittingWithdrawal] = useState(false);

  const [incomeAmount, setIncomeAmount] = useState("");
  const [incomeDesc, setIncomeDesc] = useState("");
  const [incomeLeadId, setIncomeLeadId] = useState("");
  const [isSubmittingIncome, setIsSubmittingIncome] = useState(false);

  const handleLogout = async () => {
    triggerHaptic("light");
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(expenseAmount);
    if (!amount || amount <= 0 || !expenseDesc) return;

    setIsSubmittingExpense(true);
    triggerHaptic("success");

    const res = await addCompanyExpense(amount, expenseDesc);
    if (res.success) {
      setExpenseAmount("");
      setExpenseDesc("");
      setShowExpenseForm(false);
      router.refresh();
    } else {
      alert(res.error);
    }
    setIsSubmittingExpense(false);
  };

  const handleWithdrawalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawalAmount);
    if (!amount || amount <= 0 || !withdrawalDesc) return;

    setIsSubmittingWithdrawal(true);
    triggerHaptic("success");

    const res = await recordPartnerWithdrawal(withdrawalPartner, amount, withdrawalDesc);
    if (res.success) {
      setWithdrawalAmount("");
      setWithdrawalDesc("");
      setShowWithdrawalForm(false);
      router.refresh();
    } else {
      alert(res.error);
    }
    setIsSubmittingWithdrawal(false);
  };

  const handleIncomeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(incomeAmount);
    if (!amount || amount <= 0 || !incomeDesc) return;

    setIsSubmittingIncome(true);
    triggerHaptic("success");

    const res = await addCompanyIncome(amount, incomeDesc, incomeLeadId || null);
    if (res.success) {
      setIncomeAmount("");
      setIncomeDesc("");
      setIncomeLeadId("");
      setShowIncomeForm(false);
      router.refresh();
    } else {
      alert(res.error);
    }
    setIsSubmittingIncome(false);
  };

  return (
    <div className="space-y-8 select-none">
      
      {/* ── НАВИГАЦИОННАЯ ШАПКА АДМИНКИ ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-[0_10px_30px_rgba(0,0,0,0.015)]">
        <div>
          <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">{crmDict.navigation.dashboard}</span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">{crmDict.navigation.title}</h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Button 
            onClick={() => router.push("/admin/leads")}
            variant="lightOutline" 
            className="text-slate-600 border-slate-200 text-xs font-bold py-2.5"
          >
            {crmDict.navigation.leads}
          </Button>

          <Button 
            onClick={() => router.push("/admin/clients")}
            variant="lightOutline" 
            className="text-slate-600 border-slate-200 text-xs font-bold py-2.5"
          >
            {crmDict.navigation.clients}
          </Button>

          <Button 
            onClick={() => router.push("/admin/warehouse")}
            variant="lightOutline" 
            className="text-slate-600 border-slate-200 text-xs font-bold py-2.5"
          >
            {crmDict.navigation.warehouse}
          </Button>

          <Button 
            variant="lightGlass" 
            className="text-orange-600 bg-orange-50 border-orange-200/50 text-xs font-bold py-2.5"
          >
            {crmDict.navigation.finance}
          </Button>

          <Button 
            onClick={() => router.push("/admin/analytics")}
            variant="lightOutline" 
            className="text-slate-600 border-slate-200 text-xs font-bold py-2.5"
          >
            {crmDict.navigation.analytics}
          </Button>
          
          <div className="h-6 w-[1px] bg-slate-250 mx-2 hidden sm:block" />
          
          <Button 
            onClick={handleLogout}
            variant="lightOutline"
            leftIcon={<LogOut className="w-3.5 h-3.5 text-rose-500" />}
            className="text-rose-600 border-rose-200/60 bg-rose-50/30 hover:bg-rose-50 text-xs font-extrabold py-2.5"
          >
            {crmDict.navigation.logout}
          </Button>
        </div>
      </div>

      {/* ── КАРТОЧКИ ФИНАНСОВЫХ СЧЕТОВ ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Касса компании */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between h-40">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 blur-[40px] rounded-full pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-450 uppercase tracking-wider">Касса фирмы</span>
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center border border-orange-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {cashbox.toLocaleString("ru")} ₸
            </h2>
            <p className="text-[10px] text-slate-400 font-semibold mt-1">Доступные оборотные средства</p>
          </div>
        </div>

        {/* Выводы Даниила */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between h-40">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-[40px] rounded-full pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-450 uppercase tracking-wider">Выведено: Даниил</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center border border-blue-500/20">
              <User className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {withdrawals.DANIIL.toLocaleString("ru")} ₸
            </h2>
            <p className="text-[10px] text-slate-400 font-semibold mt-1">Личные средства из кассы</p>
          </div>
        </div>

        {/* Выводы Елисея */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between h-40">
          <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 blur-[40px] rounded-full pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-450 uppercase tracking-wider">Выведено: Елисей (Я)</span>
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center border border-teal-500/20">
              <User className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {withdrawals.ELISEY.toLocaleString("ru")} ₸
            </h2>
            <p className="text-[10px] text-slate-400 font-semibold mt-1">Личные средства из кассы</p>
          </div>
        </div>

      </div>

      {/* ── КНОПКИ ДЕЙСТВИЙ И ФОРМЫ ── */}
      <div className="flex flex-wrap gap-4">
        <Button
          onClick={() => { triggerHaptic("light"); setShowIncomeForm(true); setShowExpenseForm(false); setShowWithdrawalForm(false); }}
          variant="lightGlass"
          leftIcon={<PlusCircle className="w-4 h-4" />}
          className="px-6 py-3.5 text-sm font-bold shadow-md text-emerald-600 bg-emerald-50 border-emerald-250/50 hover:bg-emerald-100/70"
        >
          Внести доход фирмы
        </Button>

        <Button
          onClick={() => { triggerHaptic("light"); setShowExpenseForm(true); setShowWithdrawalForm(false); setShowIncomeForm(false); }}
          variant="secondary"
          leftIcon={<TrendingDown className="w-4 h-4" />}
          className="px-6 py-3.5 text-sm font-bold shadow-md"
        >
          Внести расход фирмы
        </Button>

        <Button
          onClick={() => { triggerHaptic("light"); setShowWithdrawalForm(true); setShowExpenseForm(false); setShowIncomeForm(false); }}
          variant="solid"
          leftIcon={<ArrowDownLeft className="w-4 h-4" />}
          className="px-6 py-3.5 text-sm font-bold shadow-md shadow-orange-500/10"
        >
          Зафиксировать вывод партнера
        </Button>
      </div>

      {/* Форма доходов фирмы */}
      {showIncomeForm && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm max-w-md animate-in slide-in-from-top-4 duration-200">
          <h3 className="text-base font-bold text-slate-900 mb-4 text-emerald-600">Внести доход фирмы</h3>
          <form onSubmit={handleIncomeSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Сумма (₸)</label>
              <input
                type="number"
                required
                value={incomeAmount}
                onChange={(e) => setIncomeAmount(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 font-semibold focus:border-emerald-500 focus:outline-none transition text-sm"
                placeholder="150 000"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Привязать к сделке (опционально)</label>
              <select
                value={incomeLeadId}
                onChange={(e) => {
                  const leadId = e.target.value;
                  setIncomeLeadId(leadId);
                  if (leadId) {
                    const selectedLead = leads.find(l => l.id === leadId);
                    if (selectedLead) {
                      setIncomeDesc(`Аванс/Расчет за проект: ${selectedLead.name}`);
                      if (selectedLead.prepayment > 0) {
                        setIncomeAmount(selectedLead.prepayment.toString());
                      }
                    }
                  } else {
                    setIncomeDesc("");
                    setIncomeAmount("");
                  }
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 font-semibold focus:border-emerald-500 focus:outline-none transition text-sm"
              >
                <option value="">Без привязки к сделке</option>
                {leads.map((lead) => (
                  <option key={lead.id} value={lead.id}>
                    {lead.name} ({lead.phone}) — {lead.revenue.toLocaleString()} ₸
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Описание дохода</label>
              <input
                type="text"
                required
                value={incomeDesc}
                onChange={(e) => setIncomeDesc(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 font-semibold focus:border-emerald-500 focus:outline-none transition text-sm"
                placeholder="Оплата за вывеску / Предоплата"
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => setShowIncomeForm(false)}
                variant="lightOutline"
                className="flex-1 py-2.5 text-xs font-bold text-slate-600"
              >
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={isSubmittingIncome}
                variant="solid"
                className="flex-grow py-2.5 text-xs font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 border-none shadow-md text-white"
              >
                {isSubmittingIncome ? "Внесение..." : "Записать"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Форма расходов фирмы */}
      {showExpenseForm && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm max-w-md animate-in slide-in-from-top-4 duration-200">
          <h3 className="text-base font-bold text-slate-900 mb-4">Внести расход фирмы</h3>
          <form onSubmit={handleExpenseSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Сумма (₸)</label>
              <input
                type="number"
                required
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 font-semibold focus:border-orange-500 focus:outline-none transition text-sm"
                placeholder="50 000"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Описание расхода</label>
              <input
                type="text"
                required
                value={expenseDesc}
                onChange={(e) => setExpenseDesc(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 font-semibold focus:border-orange-500 focus:outline-none transition text-sm"
                placeholder="Аренда цеха / Закуп светодиодов"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => setShowExpenseForm(false)}
                variant="lightOutline"
                className="flex-1 py-2.5 text-xs font-bold text-slate-600"
              >
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={isSubmittingExpense}
                variant="solid"
                className="flex-1 py-2.5 text-xs font-extrabold bg-gradient-to-r from-orange-600 to-red-600 shadow-md"
              >
                {isSubmittingExpense ? "Внесение..." : "Записать"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Форма вывода партнера */}
      {showWithdrawalForm && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm max-w-md animate-in slide-in-from-top-4 duration-200">
          <h3 className="text-base font-bold text-slate-900 mb-4">Зафиксировать вывод партнера</h3>
          <form onSubmit={handleWithdrawalSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Партнер</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setWithdrawalPartner("ELISEY")}
                  className={`flex-1 py-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                    withdrawalPartner === "ELISEY"
                      ? "bg-orange-50 border-orange-500 text-orange-600 font-extrabold"
                      : "bg-slate-50 border-slate-200 text-slate-700"
                  }`}
                >
                  Елисей (Я)
                </button>
                <button
                  type="button"
                  onClick={() => setWithdrawalPartner("DANIIL")}
                  className={`flex-1 py-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                    withdrawalPartner === "DANIIL"
                      ? "bg-orange-50 border-orange-500 text-orange-600 font-extrabold"
                      : "bg-slate-50 border-slate-200 text-slate-700"
                  }`}
                >
                  Даниил
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Сумма вывода (₸)</label>
              <input
                type="number"
                required
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 font-semibold focus:border-orange-500 focus:outline-none transition text-sm"
                placeholder="100 000"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Назначение (необязательно)</label>
              <input
                type="text"
                value={withdrawalDesc}
                onChange={(e) => setWithdrawalDesc(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 font-semibold focus:border-orange-500 focus:outline-none transition text-sm"
                placeholder="Забрал из кассы на личные нужды"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => setShowWithdrawalForm(false)}
                variant="lightOutline"
                className="flex-1 py-2.5 text-xs font-bold text-slate-600"
              >
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={isSubmittingWithdrawal}
                variant="solid"
                className="flex-1 py-2.5 text-xs font-extrabold bg-gradient-to-r from-orange-600 to-red-600 shadow-md"
              >
                {isSubmittingWithdrawal ? "Списание..." : "Вывести"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* ── ТАБЛИЦА ТРАНЗАКЦИЙ (ИСТОРИЯ) ── */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">История финансовых операций</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-450 font-bold text-[10px] uppercase tracking-wider">
                <th className="py-4 px-6">Дата</th>
                <th className="py-4 px-6">Тип</th>
                <th className="py-4 px-6">Назначение / Описание</th>
                <th className="py-4 px-6 text-right">Сумма</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-10 px-6 text-center text-slate-400 font-semibold">
                    Нет финансовых операций в системе
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => {
                  const type = TYPE_MAP[tx.type] || { label: tx.type, color: "text-slate-600", bg: "bg-slate-100" };
                  
                  let amountColor = "text-slate-900";
                  let prefix = "";
                  
                  if (tx.type === TransactionType.INCOME) {
                    amountColor = "text-emerald-600 font-bold";
                    prefix = "+";
                  } else {
                    amountColor = "text-rose-600 font-bold";
                    prefix = "-";
                  }

                  return (
                    <tr key={tx.id} className="border-b border-slate-100 hover:bg-slate-50/40 transition">
                      <td className="py-4 px-6 text-slate-400 font-semibold text-xs whitespace-nowrap">
                        {new Date(tx.createdAt).toLocaleDateString("ru-RU", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${type.color} ${type.bg}`}>
                          {type.label}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-700 font-semibold max-w-xs truncate">
                        {tx.description}
                      </td>
                      <td className={`py-4 px-6 text-right whitespace-nowrap ${amountColor}`}>
                        {prefix}{tx.amount.toLocaleString("ru")} ₸
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
