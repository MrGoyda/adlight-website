"use client";

import React, { useState, useEffect } from "react";
import { TrendingDown, X, DollarSign, Wallet } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { toast } from "@/lib/toast";
import { recordTaskExpense } from "../actions";
import { CrmTaskItem } from "../_types/taskTypes";
import { TASKS_DICTIONARY } from "../_data/tasksDictionary";
import BottomSheet from "@/components/ui/BottomSheet";

interface TaskExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: CrmTaskItem | null;
  accounts: { id: string; name: string; balance: number }[];
  categories: { id: string; name: string }[];
  onSuccess?: () => void;
}

const QUICK_AMOUNTS = [10000, 25000, 50000, 100000, 200000];

export default function TaskExpenseModal({
  isOpen,
  onClose,
  task,
  accounts,
  categories,
  onSuccess,
}: TaskExpenseModalProps) {
  const dict = TASKS_DICTIONARY.modals;

  const [amount, setAmount] = useState("");
  const [accountId, setAccountId] = useState(accounts[0]?.id || "");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setDescription(`Расход по задаче: ${task.title}`);
      if (task.estimatedCost && task.estimatedCost > 0) {
        setAmount(String(task.estimatedCost));
      } else {
        setAmount("");
      }
    }
  }, [task]);

  if (!task) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      toast.error("Укажите сумму расхода");
      return;
    }
    if (!accountId) {
      toast.error("Выберите счет списания");
      return;
    }

    setIsSubmitting(true);
    triggerHaptic("medium");

    try {
      const res = await recordTaskExpense({
        taskId: task.id,
        amount: parsedAmount,
        accountId,
        categoryId: categoryId || undefined,
        description: description.trim() || `Расход по задаче: ${task.title}`,
        leadId: task.leadId,
      });

      if (!res.success && "error" in res) {
        toast.error(res.error);
      } else {
        toast.success(TASKS_DICTIONARY.toasts.expenseRecorded);
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
      desktopWidth="sm:w-[480px]"
    >
      <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
        {/* Заголовок */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200/80">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 leading-tight">
                {dict.expenseTitle}
              </h3>
              <p className="text-[11px] text-slate-400 font-semibold mt-0.5 truncate max-w-[280px]">
                {task.title}
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
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-lg sm:text-xl font-black font-mono text-slate-900 outline-none focus:bg-white focus:border-rose-500 transition"
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
                className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 transition shrink-0 cursor-pointer"
              >
                {val.toLocaleString("ru-RU")}&nbsp;₸
              </button>
            ))}
          </div>
        </div>

        {/* Счет списания */}
        <div>
          <label className="block text-xs font-black text-slate-700 mb-1">
            {dict.accountLabel}
          </label>
          <select
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-rose-500 transition"
          >
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name} ({acc.balance.toLocaleString("ru-RU")} ₸)
              </option>
            ))}
          </select>
        </div>

        {/* Статья затрат */}
        <div>
          <label className="block text-xs font-black text-slate-700 mb-1">
            {dict.categoryLabel}
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-rose-500 transition"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Назначение */}
        <div>
          <label className="block text-xs font-black text-slate-700 mb-1">
            {dict.expenseDescLabel}
          </label>
          <input
            type="text"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-base sm:text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-rose-500 transition"
          />
        </div>

        {/* Кнопка отправки */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md shadow-rose-600/25 active:scale-98 transition cursor-pointer disabled:opacity-50 touch-manipulation"
          >
            {isSubmitting ? "Списание..." : dict.confirmExpenseBtn}
          </button>
        </div>
      </form>
    </BottomSheet>
  );
}
