"use client";

import React, { useState } from "react";
import { Plus, TrendingUp, X, Calendar, User, Wallet } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { toast } from "@/lib/toast";
import { recordIncome } from "../../actions";
import { FinanceAccountItem, FinanceCategoryItem } from "../../_types/financeTypes";
import { FINANCE_DICTIONARY } from "../../_data/financeDictionary";
import BottomSheet from "@/components/ui/BottomSheet";

interface FinanceIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: FinanceAccountItem[];
  categories: FinanceCategoryItem[];
  leads?: { id: string; name: string; phone: string }[];
  onSuccess?: () => void;
}

const QUICK_AMOUNTS = [50000, 100000, 250000, 500000, 1000000];

export default function FinanceIncomeModal({
  isOpen,
  onClose,
  accounts,
  categories,
  leads = [],
  onSuccess,
}: FinanceIncomeModalProps) {
  const dict = FINANCE_DICTIONARY.modals;
  const toasts = FINANCE_DICTIONARY.toasts;

  const defaultAccount = accounts.find((a) => a.isDefault) || accounts[0];
  const incomeCategories = categories.filter((c) => c.type === "INCOME");

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [accountId, setAccountId] = useState(defaultAccount?.id || "");
  const [categoryId, setCategoryId] = useState(incomeCategories[0]?.id || "");
  const [leadId, setLeadId] = useState("");
  const [transactionDate, setTransactionDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      toast.error("Укажите сумму поступления");
      return;
    }
    if (!description.trim()) {
      toast.error("Укажите назначение платежа");
      return;
    }

    setIsSubmitting(true);
    triggerHaptic("medium");

    try {
      const res = await recordIncome({
        amount: parsedAmount,
        description: description.trim(),
        accountId: accountId || undefined,
        categoryId: categoryId || undefined,
        leadId: leadId || null,
        transactionDate: transactionDate ? new Date(transactionDate).toISOString() : undefined,
      });

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(toasts.incomeSuccess);
        setAmount("");
        setDescription("");
        setLeadId("");
        onClose();
        onSuccess?.();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-lg"
      desktopVariant="modal"
      desktopWidth="sm:w-[500px]"
    >
      <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
        {/* Заголовок */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/80">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 leading-tight">
                {dict.incomeTitle}
              </h3>
              <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                Пополнение кассы или расчетного счета
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Сумма */}
        <div>
          <label className="block text-xs font-black text-slate-700 mb-1">
            {dict.amountLabel}
          </label>
          <input
            type="number"
            autoFocus
            required
            min="1"
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0 ₸"
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-lg sm:text-xl font-black font-mono text-slate-900 outline-none focus:bg-white focus:border-emerald-500 transition"
          />

          {/* Быстрые суммы */}
          <div className="flex items-center gap-1.5 mt-2 overflow-x-auto no-scrollbar py-0.5">
            {QUICK_AMOUNTS.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => {
                  triggerHaptic("light");
                  setAmount(String(val));
                }}
                className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 transition shrink-0 cursor-pointer"
              >
                +{val.toLocaleString("ru-RU")}&nbsp;₸
              </button>
            ))}
          </div>
        </div>

        {/* Счет зачисления */}
        <div>
          <label className="block text-xs font-black text-slate-700 mb-1">
            {dict.accountLabel}
          </label>
          <select
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-emerald-500 transition"
          >
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name} ({acc.balance.toLocaleString("ru-RU")} ₸)
              </option>
            ))}
          </select>
        </div>

        {/* Статья доходов */}
        <div>
          <label className="block text-xs font-black text-slate-700 mb-1">
            {dict.categoryLabel}
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-emerald-500 transition"
          >
            {incomeCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Привязка к сделке (опционально) */}
        <div>
          <label className="block text-xs font-black text-slate-700 mb-1">
            {dict.leadLabel}
          </label>
          <select
            value={leadId}
            onChange={(e) => {
              setLeadId(e.target.value);
              const selectedLead = leads.find((l) => l.id === e.target.value);
              if (selectedLead && !description) {
                setDescription(`Оплата по сделке: ${selectedLead.name}`);
              }
            }}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-emerald-500 transition"
          >
            <option value="">Без привязки к сделке</option>
            {leads.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name} ({l.phone || "без тел"})
              </option>
            ))}
          </select>
        </div>

        {/* Назначение платежа */}
        <div>
          <label className="block text-xs font-black text-slate-700 mb-1">
            {dict.descLabel}
          </label>
          <input
            type="text"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Предоплата 50% за световую вывеску..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-base sm:text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-emerald-500 transition"
          />
        </div>

        {/* Дата */}
        <div>
          <label className="block text-xs font-black text-slate-700 mb-1">
            {dict.dateLabel}
          </label>
          <input
            type="date"
            value={transactionDate}
            onChange={(e) => setTransactionDate(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-emerald-500 transition"
          />
        </div>

        {/* Кнопка отправки */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-600/25 active:scale-98 transition cursor-pointer disabled:opacity-50 touch-manipulation"
          >
            {isSubmitting ? "Проведение..." : dict.saveBtn}
          </button>
        </div>
      </form>
    </BottomSheet>
  );
}
