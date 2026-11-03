"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { TransactionType, PartnerName } from "@prisma/client";
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  User, 
  Plus, 
  ArrowDownLeft, 
  ArrowUpRight,
  Search,
  X,
  Calendar,
  Building,
  CreditCard,
  CheckCircle2,
  FileText,
  DollarSign
} from "lucide-react";
import { addCompanyExpense, recordPartnerWithdrawal, addCompanyIncome } from "../actions";
import { triggerHaptic } from "@/lib/haptics";
import { toast } from "@/lib/toast";
import Button from "@/components/ui/Button";
import BottomSheet from "@/components/ui/BottomSheet";

interface Transaction {
  id: string;
  createdAt: string;
  type: TransactionType;
  amount: number;
  description: string;
  partner: PartnerName | null;
  lead?: {
    id?: string;
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

type ModalType = "INCOME" | "EXPENSE" | "WITHDRAWAL" | null;
type FilterTab = "ALL" | "INCOME" | "EXPENSE" | "WITHDRAWAL";

export default function FinanceDashboard({
  cashbox,
  transactions,
  withdrawals,
  leads = []
}: FinanceDashboardProps) {
  const router = useRouter();

  // Состояние модального окна добавления операции
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  
  // Состояния фильтрации
  const [filterTab, setFilterTab] = useState<FilterTab>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Поля формы: Доход
  const [incomeAmount, setIncomeAmount] = useState("");
  const [incomeDesc, setIncomeDesc] = useState("");
  const [incomeLeadId, setIncomeLeadId] = useState("");
  const [isSubmittingIncome, setIsSubmittingIncome] = useState(false);

  // Поля формы: Расход
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDesc, setExpenseDesc] = useState("");
  const [isSubmittingExpense, setIsSubmittingExpense] = useState(false);

  // Поля формы: Вывод
  const [withdrawalPartner, setWithdrawalPartner] = useState<PartnerName>("ELISEY");
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [withdrawalDesc, setWithdrawalDesc] = useState("");
  const [isSubmittingWithdrawal, setIsSubmittingWithdrawal] = useState(false);

  // Быстрые суммы
  const QUICK_AMOUNTS = [50000, 100000, 250000, 500000];

  // Обработка отправки формы Дохода
  const handleIncomeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(incomeAmount);
    if (!amount || amount <= 0 || !incomeDesc) {
      toast.error("Укажите сумму и назначение платежа");
      return;
    }

    setIsSubmittingIncome(true);
    triggerHaptic("success");

    const res = await addCompanyIncome(amount, incomeDesc, incomeLeadId || null);
    if (res.success) {
      toast.success("Поступление средств успешно проведено!");
      setIncomeAmount("");
      setIncomeDesc("");
      setIncomeLeadId("");
      setActiveModal(null);
      router.refresh();
    } else {
      toast.error(res.error || "Не удалось зафиксировать доход");
    }
    setIsSubmittingIncome(false);
  };

  // Обработка отправки формы Расхода
  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(expenseAmount);
    if (!amount || amount <= 0 || !expenseDesc) {
      toast.error("Укажите сумму и описание расхода");
      return;
    }

    setIsSubmittingExpense(true);
    triggerHaptic("success");

    const res = await addCompanyExpense(amount, expenseDesc);
    if (res.success) {
      toast.success("Расход успешно зафиксирован!");
      setExpenseAmount("");
      setExpenseDesc("");
      setActiveModal(null);
      router.refresh();
    } else {
      toast.error(res.error || "Не удалось сохранить расход");
    }
    setIsSubmittingExpense(false);
  };

  // Обработка отправки формы Вывода
  const handleWithdrawalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawalAmount);
    if (!amount || amount <= 0) {
      toast.error("Укажите корректную сумму вывода");
      return;
    }

    setIsSubmittingWithdrawal(true);
    triggerHaptic("success");

    const res = await recordPartnerWithdrawal(
      withdrawalPartner, 
      amount, 
      withdrawalDesc || `Вывод партнеру (${withdrawalPartner === "ELISEY" ? "Елисей" : "Даниил"})`
    );
    if (res.success) {
      toast.success("Вывод средств партнеру зафиксирован!");
      setWithdrawalAmount("");
      setWithdrawalDesc("");
      setActiveModal(null);
      router.refresh();
    } else {
      toast.error(res.error || "Не удалось зафиксировать вывод");
    }
    setIsSubmittingWithdrawal(false);
  };

  // Фильтрация транзакций
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Фильтр по типу
      if (filterTab === "INCOME" && tx.type !== TransactionType.INCOME) return false;
      if (filterTab === "EXPENSE" && tx.type !== TransactionType.EXPENSE_COMPANY) return false;
      if (filterTab === "WITHDRAWAL" && tx.type !== TransactionType.WITHDRAWAL_PARTNER) return false;

      // Фильтр по поиску
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const descMatch = tx.description.toLowerCase().includes(query);
        const leadMatch = tx.lead?.name.toLowerCase().includes(query) || tx.lead?.phone.includes(query);
        const partnerMatch = tx.partner?.toLowerCase().includes(query);
        if (!descMatch && !leadMatch && !partnerMatch) return false;
      }

      return true;
    });
  }, [transactions, filterTab, searchQuery]);

  // Подсчет статистики для табов
  const counts = useMemo(() => {
    return {
      all: transactions.length,
      income: transactions.filter(t => t.type === TransactionType.INCOME).length,
      expense: transactions.filter(t => t.type === TransactionType.EXPENSE_COMPANY).length,
      withdrawal: transactions.filter(t => t.type === TransactionType.WITHDRAWAL_PARTNER).length,
    };
  }, [transactions]);

  return (
    <div className="space-y-6">
      
      {/* ── ВЕРХНЯЯ ПАНЕЛЬ С ДЕЙСТВИЯМИ ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/70 backdrop-blur-md p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Финансы и Касса</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Касса активна
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Контроль оборотных средств компании, расходов и распределения прибыли
          </p>
        </div>

        {/* Кнопки вызова модалок */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            onClick={() => {
              triggerHaptic("light");
              setActiveModal("INCOME");
            }}
            variant="solid"
            leftIcon={<ArrowDownLeft className="w-4 h-4 text-emerald-200" />}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 shadow-sm"
          >
            Внести доход
          </Button>

          <Button
            onClick={() => {
              triggerHaptic("light");
              setActiveModal("EXPENSE");
            }}
            variant="secondary"
            leftIcon={<ArrowUpRight className="w-4 h-4 text-rose-500" />}
            className="text-slate-800 font-bold text-xs py-2.5 px-4 shadow-sm hover:bg-slate-100"
          >
            Внести расход
          </Button>

          <Button
            onClick={() => {
              triggerHaptic("light");
              setActiveModal("WITHDRAWAL");
            }}
            variant="lightGlass"
            leftIcon={<User className="w-4 h-4 text-amber-600" />}
            className="text-amber-800 bg-amber-50/80 hover:bg-amber-100/80 border-amber-200/80 font-bold text-xs py-2.5 px-4 shadow-xs"
          >
            Вывод партнера
          </Button>
        </div>
      </div>

      {/* ── КАРТОЧКИ ФИНАНСОВЫХ СЧЕТОВ ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        
        {/* Касса компании (Главный счет) */}
        <div className="bg-gradient-to-br from-white to-slate-50/80 p-6 rounded-3xl border border-slate-200/80 shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[160px] group hover:border-slate-300 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-emerald-500/15 transition-all" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-emerald-600" />
              Касса фирмы
            </span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Оборотный баланс
            </span>
          </div>
          <div className="mt-4">
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              {cashbox.toLocaleString("ru")} <span className="text-xl font-bold text-slate-400">₸</span>
            </h2>
            <p className="text-[11px] text-slate-500 font-medium mt-1.5">
              Доступные средства для закупа и текущих расходов
            </p>
          </div>
        </div>

        {/* Выводы Даниила */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[160px] group hover:border-slate-300 transition-all duration-300">
          <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/10 blur-[40px] rounded-full pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-600" />
              Партнер Даниил
            </span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Выведено
            </span>
          </div>
          <div className="mt-4">
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              {withdrawals.DANIIL.toLocaleString("ru")} <span className="text-xl font-bold text-slate-400">₸</span>
            </h2>
            <p className="text-[11px] text-slate-500 font-medium mt-1.5">
              Суммарно распределено на счет партнера
            </p>
          </div>
        </div>

        {/* Выводы Елисея */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[160px] group hover:border-slate-300 transition-all duration-300">
          <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/10 blur-[40px] rounded-full pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-600" />
              Партнер Елисей (Я)
            </span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              Выведено
            </span>
          </div>
          <div className="mt-4">
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              {withdrawals.ELISEY.toLocaleString("ru")} <span className="text-xl font-bold text-slate-400">₸</span>
            </h2>
            <p className="text-[11px] text-slate-500 font-medium mt-1.5">
              Суммарно распределено на счет партнера
            </p>
          </div>
        </div>

      </div>

      {/* ── ТАБЛИЦА ТРАНЗАКЦИЙ И ФИЛЬТРЫ ── */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        
        {/* Панель фильтров и поиска */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Сегментированные табы */}
          <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-2xl overflow-x-auto no-scrollbar">
            <button
              onClick={() => { triggerHaptic("light"); setFilterTab("ALL"); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                filterTab === "ALL"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Все операции <span className="ml-1 text-[10px] opacity-70">({counts.all})</span>
            </button>
            <button
              onClick={() => { triggerHaptic("light"); setFilterTab("INCOME"); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                filterTab === "INCOME"
                  ? "bg-white text-emerald-700 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Поступления <span className="ml-1 text-[10px] opacity-70">({counts.income})</span>
            </button>
            <button
              onClick={() => { triggerHaptic("light"); setFilterTab("EXPENSE"); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                filterTab === "EXPENSE"
                  ? "bg-white text-rose-700 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Расходы фирмы <span className="ml-1 text-[10px] opacity-70">({counts.expense})</span>
            </button>
            <button
              onClick={() => { triggerHaptic("light"); setFilterTab("WITHDRAWAL"); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                filterTab === "WITHDRAWAL"
                  ? "bg-white text-amber-700 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Выводы <span className="ml-1 text-[10px] opacity-70">({counts.withdrawal})</span>
            </button>
          </div>

          {/* Строка поиска */}
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по назначению..."
              className="w-full pl-9 pr-8 py-2 text-xs font-medium bg-slate-50 border border-slate-200/80 rounded-xl focus:bg-white focus:border-slate-400 focus:outline-none transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

        </div>

        {/* ── DESKTOP ТАБЛИЦА (md:block) ── */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/60 border-b border-slate-100 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-6">Дата и время</th>
                <th className="py-3.5 px-6">Тип операции</th>
                <th className="py-3.5 px-6">Описание / Контрагент</th>
                <th className="py-3.5 px-6">Получатель / Сделка</th>
                <th className="py-3.5 px-6 text-right">Сумма</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 px-6 text-center text-slate-400 font-medium">
                    {searchQuery ? "Транзакции по вашему запросу не найдены" : "В этой категории пока нет записей"}
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const isIncome = tx.type === TransactionType.INCOME;
                  const isExpense = tx.type === TransactionType.EXPENSE_COMPANY;
                  const isWithdrawal = tx.type === TransactionType.WITHDRAWAL_PARTNER;

                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-6 text-slate-400 font-semibold whitespace-nowrap" suppressHydrationWarning>
                        {new Date(tx.createdAt).toLocaleDateString("ru-RU", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-3.5 px-6 whitespace-nowrap">
                        {isIncome && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <ArrowDownLeft className="w-3 h-3" />
                            Доход
                          </span>
                        )}
                        {isExpense && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                            <ArrowUpRight className="w-3 h-3" />
                            Расход фирмы
                          </span>
                        )}
                        {isWithdrawal && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                            <User className="w-3 h-3" />
                            Вывод средств
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-6 font-semibold text-slate-900 max-w-sm">
                        {tx.description}
                      </td>
                      <td className="py-3.5 px-6 text-slate-500 font-medium whitespace-nowrap">
                        {tx.lead && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-bold text-[11px]">
                            {tx.lead.name}
                          </span>
                        )}
                        {tx.partner && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 font-bold text-[11px]">
                            {tx.partner === "ELISEY" ? "Елисей" : "Даниил"}
                          </span>
                        )}
                        {!tx.lead && !tx.partner && (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-6 text-right whitespace-nowrap">
                        <span className={`text-sm font-black ${
                          isIncome ? "text-emerald-600" : isExpense ? "text-rose-600" : "text-amber-600"
                        }`}>
                          {isIncome ? "+" : "-"}{tx.amount.toLocaleString("ru")} ₸
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── MOBILE КАРТОЧКИ (md:hidden) — Revolut/Apple Wallet Style ── */}
        <div className="md:hidden divide-y divide-slate-100">
          {filteredTransactions.length === 0 ? (
            <div className="py-12 px-4 text-center text-slate-400 font-medium text-xs">
              {searchQuery ? "Ничего не найдено" : "Нет операций в этой категории"}
            </div>
          ) : (
            filteredTransactions.map((tx) => {
              const isIncome = tx.type === TransactionType.INCOME;
              const isExpense = tx.type === TransactionType.EXPENSE_COMPANY;
              const isWithdrawal = tx.type === TransactionType.WITHDRAWAL_PARTNER;

              return (
                <div key={tx.id} className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/60 active:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Круглая иконка */}
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                      isIncome 
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                        : isExpense 
                        ? "bg-rose-50 text-rose-600 border-rose-200"
                        : "bg-amber-50 text-amber-600 border-amber-200"
                    }`}>
                      {isIncome && <ArrowDownLeft className="w-5 h-5" />}
                      {isExpense && <ArrowUpRight className="w-5 h-5" />}
                      {isWithdrawal && <User className="w-5 h-5" />}
                    </div>

                    {/* Текстовая информация */}
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {tx.description}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] text-slate-400 font-medium" suppressHydrationWarning>
                          {new Date(tx.createdAt).toLocaleDateString("ru-RU", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </span>
                        {tx.lead && (
                          <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded truncate">
                            {tx.lead.name}
                          </span>
                        )}
                        {tx.partner && (
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded">
                            {tx.partner === "ELISEY" ? "Елисей" : "Даниил"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Сумма */}
                  <div className="text-right shrink-0">
                    <span className={`text-xs font-black block ${
                      isIncome ? "text-emerald-600" : isExpense ? "text-rose-600" : "text-amber-600"
                    }`}>
                      {isIncome ? "+" : "-"}{tx.amount.toLocaleString("ru")} ₸
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                      {isIncome ? "Доход" : isExpense ? "Расход" : "Вывод"}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

      {/* ── ЕДИНОЕ МОДАЛЬНОЕ ОКНО ОПЕРАЦИЙ (BOTTOM SHEET НА МОБИЛКЕ / MODAL НА ДЕСКТОПЕ) ── */}
      <BottomSheet
        isOpen={activeModal !== null}
        onClose={() => setActiveModal(null)}
        desktopVariant="modal"
        desktopWidth="lg:w-[520px]"
        maxHeight="max-h-[92dvh]"
      >
        <div className="p-6">
          
          {/* Селектор типа операции в модалке */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl w-full">
              <button
                type="button"
                onClick={() => { triggerHaptic("light"); setActiveModal("INCOME"); }}
                className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all ${
                  activeModal === "INCOME" 
                    ? "bg-white text-emerald-700 shadow-xs" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                + Доход
              </button>
              <button
                type="button"
                onClick={() => { triggerHaptic("light"); setActiveModal("EXPENSE"); }}
                className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all ${
                  activeModal === "EXPENSE" 
                    ? "bg-white text-rose-700 shadow-xs" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                - Расход
              </button>
              <button
                type="button"
                onClick={() => { triggerHaptic("light"); setActiveModal("WITHDRAWAL"); }}
                className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all ${
                  activeModal === "WITHDRAWAL" 
                    ? "bg-white text-amber-700 shadow-xs" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Вывод
              </button>
            </div>
          </div>

          {/* ── ФОРМА 1: ДОХОД ── */}
          {activeModal === "INCOME" && (
            <form onSubmit={handleIncomeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                  Сумма поступления (₸) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    value={incomeAmount}
                    onChange={(e) => setIncomeAmount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-slate-900 font-bold text-lg focus:bg-white focus:border-emerald-500 focus:outline-none transition"
                    placeholder="150 000"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₸</span>
                </div>
                {/* Быстрые пресеты сумм */}
                <div className="flex gap-1.5 mt-2">
                  {QUICK_AMOUNTS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => { triggerHaptic("light"); setIncomeAmount(q.toString()); }}
                      className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
                    >
                      {q.toLocaleString("ru")}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                  Привязать к сделке (опционально)
                </label>
                <select
                  value={incomeLeadId}
                  onChange={(e) => {
                    const leadId = e.target.value;
                    setIncomeLeadId(leadId);
                    if (leadId) {
                      const selectedLead = leads.find(l => l.id === leadId);
                      if (selectedLead) {
                        setIncomeDesc(`Оплата / Аванс: ${selectedLead.name}`);
                        if (selectedLead.prepayment > 0) {
                          setIncomeAmount(selectedLead.prepayment.toString());
                        }
                      }
                    }
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-slate-900 font-semibold text-xs focus:bg-white focus:border-emerald-500 focus:outline-none transition"
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
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                  Назначение / Описание *
                </label>
                <input
                  type="text"
                  required
                  value={incomeDesc}
                  onChange={(e) => setIncomeDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-slate-900 font-semibold text-xs focus:bg-white focus:border-emerald-500 focus:outline-none transition"
                  placeholder="Предоплата 50% за световую вывеску"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  variant="lightOutline"
                  className="flex-1 py-3 text-xs font-bold text-slate-600"
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmittingIncome}
                  variant="solid"
                  className="flex-1 py-3 text-xs font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                >
                  {isSubmittingIncome ? "Сохранение..." : "Внести в кассу"}
                </Button>
              </div>
            </form>
          )}

          {/* ── ФОРМА 2: РАСХОД ── */}
          {activeModal === "EXPENSE" && (
            <form onSubmit={handleExpenseSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                  Сумма расхода фирмы (₸) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-slate-900 font-bold text-lg focus:bg-white focus:border-rose-500 focus:outline-none transition"
                    placeholder="35 000"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₸</span>
                </div>
                {/* Быстрые пресеты */}
                <div className="flex gap-1.5 mt-2">
                  {QUICK_AMOUNTS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => { triggerHaptic("light"); setExpenseAmount(q.toString()); }}
                      className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
                    >
                      {q.toLocaleString("ru")}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                  Статья расхода / Описание *
                </label>
                <input
                  type="text"
                  required
                  value={expenseDesc}
                  onChange={(e) => setExpenseDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-slate-900 font-semibold text-xs focus:bg-white focus:border-rose-500 focus:outline-none transition"
                  placeholder="Закуп акрила, фрезеровка, аренда цеха..."
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  variant="lightOutline"
                  className="flex-1 py-3 text-xs font-bold text-slate-600"
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmittingExpense}
                  variant="solid"
                  className="flex-1 py-3 text-xs font-extrabold bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
                >
                  {isSubmittingExpense ? "Списание..." : "Списать из кассы"}
                </Button>
              </div>
            </form>
          )}

          {/* ── ФОРМА 3: ВЫВОД ПАРТНЕРА ── */}
          {activeModal === "WITHDRAWAL" && (
            <form onSubmit={handleWithdrawalSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                  Партнер-получатель *
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { triggerHaptic("light"); setWithdrawalPartner("ELISEY"); }}
                    className={`flex-1 py-3 rounded-2xl border text-xs font-extrabold transition-all cursor-pointer ${
                      withdrawalPartner === "ELISEY"
                        ? "bg-amber-50 border-amber-500 text-amber-700 shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    Елисей (Я)
                  </button>
                  <button
                    type="button"
                    onClick={() => { triggerHaptic("light"); setWithdrawalPartner("DANIIL"); }}
                    className={`flex-1 py-3 rounded-2xl border text-xs font-extrabold transition-all cursor-pointer ${
                      withdrawalPartner === "DANIIL"
                        ? "bg-blue-50 border-blue-500 text-blue-700 shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    Даниил
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                  Сумма вывода (₸) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-slate-900 font-bold text-lg focus:bg-white focus:border-amber-500 focus:outline-none transition"
                    placeholder="100 000"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₸</span>
                </div>
                {/* Быстрые пресеты */}
                <div className="flex gap-1.5 mt-2">
                  {QUICK_AMOUNTS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => { triggerHaptic("light"); setWithdrawalAmount(q.toString()); }}
                      className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
                    >
                      {q.toLocaleString("ru")}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                  Комментарий / Назначение
                </label>
                <input
                  type="text"
                  value={withdrawalDesc}
                  onChange={(e) => setWithdrawalDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-slate-900 font-semibold text-xs focus:bg-white focus:border-amber-500 focus:outline-none transition"
                  placeholder="Вывод прибыли за месяц"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  variant="lightOutline"
                  className="flex-1 py-3 text-xs font-bold text-slate-600"
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmittingWithdrawal}
                  variant="solid"
                  className="flex-1 py-3 text-xs font-extrabold bg-amber-600 hover:bg-amber-700 text-white shadow-sm"
                >
                  {isSubmittingWithdrawal ? "Оформление..." : "Подтвердить вывод"}
                </Button>
              </div>
            </form>
          )}

        </div>
      </BottomSheet>

    </div>
  );
}
