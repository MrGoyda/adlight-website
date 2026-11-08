"use client";

import React, { useState } from "react";
import { UserCheck, X } from "lucide-react";
import { PartnerName } from "@prisma/client";
import { triggerHaptic } from "@/lib/haptics";
import { toast } from "@/lib/toast";
import { recordPartnerWithdrawal } from "../../actions";
import { FinanceAccountItem } from "../../_types/financeTypes";
import { FINANCE_DICTIONARY } from "../../_data/financeDictionary";
import BottomSheet from "@/components/ui/BottomSheet";

interface FinanceWithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: FinanceAccountItem[];
  onSuccess?: () => void;
}

const QUICK_AMOUNTS = [100000, 250000, 500000, 1000000];

export default function FinanceWithdrawalModal({
  isOpen,
  onClose,
  accounts,
  onSuccess,
}: FinanceWithdrawalModalProps) {
  const dict = FINANCE_DICTIONARY.modals;
  const toasts = FINANCE_DICTIONARY.toasts;

  const defaultAccount = accounts.find((a) => a.isDefault) || accounts[0];

  const [partner, setPartner] = useState<PartnerName>(PartnerName.ELISEY);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [accountId, setAccountId] = useState(defaultAccount?.id || "");
  const [transactionDate, setTransactionDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      toast.error("Укажите сумму вывода");
      return;
    }

    setIsSubmitting(true);
    triggerHaptic("medium");

    try {
      const res = await recordPartnerWithdrawal(
        partner,
        parsedAmount,
        description.trim(),
        accountId || undefined,
        transactionDate ? new Date(transactionDate).toISOString() : undefined
      );

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(toasts.withdrawalSuccess);
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
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-200/80">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 leading-tight">
                {dict.withdrawalTitle}
              </h3>
              <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                Вывод дивидендов основателей из чистой прибыли
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

        {/* Выбор партнера */}
        <div>
          <label className="block text-xs font-black text-slate-700 mb-1.5">
            {dict.partnerLabel}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                triggerHaptic("light");
                setPartner(PartnerName.ELISEY);
              }}
              className={`py-2.5 px-3 rounded-2xl border font-black text-xs transition-all cursor-pointer ${
                partner === PartnerName.ELISEY
                  ? "bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20"
                  : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              Елисей
            </button>

            <button
              type="button"
              onClick={() => {
                triggerHaptic("light");
                setPartner(PartnerName.DANIIL);
              }}
              className={`py-2.5 px-3 rounded-2xl border font-black text-xs transition-all cursor-pointer ${
                partner === PartnerName.DANIIL
                  ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20"
                  : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              Даниил
            </button>
          </div>
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
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-lg sm:text-xl font-black font-mono text-slate-900 outline-none focus:bg-white focus:border-orange-500 transition"
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
                className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-slate-100 hover:bg-orange-50 hover:text-orange-700 text-slate-600 transition shrink-0 cursor-pointer"
              >
                {val.toLocaleString("ru-RU")}&nbsp;₸
              </button>
            ))}
          </div>
        </div>

        {/* Счет списания */}
        <div>
          <label className="block text-xs font-black text-slate-700 mb-1">
            {dict.fromAccountLabel}
          </label>
          <select
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-orange-500 transition"
          >
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name} ({acc.balance.toLocaleString("ru-RU")} ₸)
              </option>
            ))}
          </select>
        </div>

        {/* Описание */}
        <div>
          <label className="block text-xs font-black text-slate-700 mb-1">
            {dict.descLabel}
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={`Вывод на личную карту Kaspi Gold...`}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-base sm:text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-orange-500 transition"
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
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-orange-500 transition"
          />
        </div>

        {/* Кнопка отправки */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs shadow-md shadow-orange-600/25 active:scale-98 transition cursor-pointer disabled:opacity-50 touch-manipulation"
          >
            {isSubmitting ? "Проведение..." : dict.saveBtn}
          </button>
        </div>
      </form>
    </BottomSheet>
  );
}
