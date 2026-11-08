"use client";

import React, { useState } from "react";
import { ArrowRightLeft, X } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { toast } from "@/lib/toast";
import { recordTransfer } from "../../actions";
import { FinanceAccountItem } from "../../_types/financeTypes";
import { FINANCE_DICTIONARY } from "../../_data/financeDictionary";
import BottomSheet from "@/components/ui/BottomSheet";

interface FinanceTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: FinanceAccountItem[];
  onSuccess?: () => void;
}

export default function FinanceTransferModal({
  isOpen,
  onClose,
  accounts,
  onSuccess,
}: FinanceTransferModalProps) {
  const dict = FINANCE_DICTIONARY.modals;
  const toasts = FINANCE_DICTIONARY.toasts;

  const [fromAccountId, setFromAccountId] = useState(accounts[0]?.id || "");
  const [toAccountId, setToAccountId] = useState(accounts[1]?.id || accounts[0]?.id || "");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [transactionDate, setTransactionDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      toast.error("Укажите сумму перевода");
      return;
    }
    if (fromAccountId === toAccountId) {
      toast.error("Выберите разные счета для перевода");
      return;
    }

    setIsSubmitting(true);
    triggerHaptic("medium");

    try {
      const res = await recordTransfer({
        fromAccountId,
        toAccountId,
        amount: parsedAmount,
        description: description.trim() || undefined,
        transactionDate: transactionDate ? new Date(transactionDate).toISOString() : undefined,
      });

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(toasts.transferSuccess);
        setAmount("");
        setDescription("");
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
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/80">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 leading-tight">
                {dict.transferTitle}
              </h3>
              <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                Инкассация, пополнение кассы или подотчета
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
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-lg sm:text-xl font-black font-mono text-slate-900 outline-none focus:bg-white focus:border-blue-500 transition"
          />
        </div>

        {/* Счета */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-black text-slate-700 mb-1">
              {dict.fromAccountLabel}
            </label>
            <select
              value={fromAccountId}
              onChange={(e) => setFromAccountId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-500 transition"
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} ({acc.balance.toLocaleString("ru-RU")} ₸)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-700 mb-1">
              {dict.toAccountLabel}
            </label>
            <select
              value={toAccountId}
              onChange={(e) => setToAccountId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-500 transition"
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} ({acc.balance.toLocaleString("ru-RU")} ₸)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Примечание */}
        <div>
          <label className="block text-xs font-black text-slate-700 mb-1">
            {dict.descLabel}
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Снятие налички в цех / выдача подотчета..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-base sm:text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-500 transition"
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
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-500 transition"
          />
        </div>

        {/* Кнопка отправки */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md shadow-blue-600/25 active:scale-98 transition cursor-pointer disabled:opacity-50 touch-manipulation"
          >
            {isSubmitting ? "Перевод..." : dict.saveBtn}
          </button>
        </div>
      </form>
    </BottomSheet>
  );
}
