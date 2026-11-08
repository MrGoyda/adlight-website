"use client";

import React, { useMemo } from "react";
import { 
  Wallet, 
  CreditCard, 
  Building2, 
  Coins, 
  ArrowRightLeft, 
  Plus, 
  CheckCircle2,
  TrendingUp,
  Sparkles
} from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { FinanceAccountItem } from "../../_types/financeTypes";
import { FINANCE_DICTIONARY } from "../../_data/financeDictionary";

interface FinanceAccountsBentoProps {
  accounts: FinanceAccountItem[];
  selectedAccountId: string | null;
  onSelectAccount: (accountId: string | null) => void;
  onOpenTransferModal: () => void;
  onOpenIncomeModal: () => void;
  onOpenExpenseModal: () => void;
}

const ACCOUNT_ICONS: Record<string, any> = {
  KASPI_PAY: CreditCard,
  BANK_CHECKING: Building2,
  CASH_OFFICE: Coins,
  PETTY_CASH: Wallet,
  SAFE: Wallet,
};

const COLOR_CLASSES: Record<string, { bg: string; border: string; text: string; ring: string }> = {
  red: {
    bg: "bg-red-50/70 hover:bg-red-50",
    border: "border-red-200/90",
    text: "text-red-700",
    ring: "ring-red-500/30",
  },
  emerald: {
    bg: "bg-emerald-50/70 hover:bg-emerald-50",
    border: "border-emerald-200/90",
    text: "text-emerald-700",
    ring: "ring-emerald-500/30",
  },
  amber: {
    bg: "bg-amber-50/70 hover:bg-amber-50",
    border: "border-amber-200/90",
    text: "text-amber-700",
    ring: "ring-amber-500/30",
  },
  blue: {
    bg: "bg-blue-50/70 hover:bg-blue-50",
    border: "border-blue-200/90",
    text: "text-blue-700",
    ring: "ring-blue-500/30",
  },
  orange: {
    bg: "bg-orange-50/70 hover:bg-orange-50",
    border: "border-orange-200/90",
    text: "text-orange-700",
    ring: "ring-orange-500/30",
  },
};

export default function FinanceAccountsBento({
  accounts,
  selectedAccountId,
  onSelectAccount,
  onOpenTransferModal,
  onOpenIncomeModal,
  onOpenExpenseModal,
}: FinanceAccountsBentoProps) {
  const dict = FINANCE_DICTIONARY.accounts;
  const actionsDict = FINANCE_DICTIONARY.actions;

  const totalLiquidity = useMemo(() => {
    return accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
  }, [accounts]);

  return (
    <div className="space-y-3.5">
      {/* ── ВЕРХНЯЯ СТРОКА: ОБЩАЯ ЛИКВИДНОСТЬ И БЫСТРЫЕ ДЕЙСТВИЯ ── */}
      <div className="bg-slate-900 text-white rounded-3xl p-4 sm:p-6 shadow-xl border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/25 shrink-0">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-400 block">
              {dict.totalLiquidity}
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white">
                {totalLiquidity.toLocaleString("ru-RU")}&nbsp;₸
              </span>
            </div>
          </div>
        </div>

        {/* Кнопки быстрых операций */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
          <button
            type="button"
            onClick={() => {
              triggerHaptic("medium");
              onOpenIncomeModal();
            }}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-600/25 active:scale-95 transition cursor-pointer touch-manipulation"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{actionsDict.incomeBtn}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic("medium");
              onOpenExpenseModal();
            }}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-md shadow-rose-600/25 active:scale-95 transition cursor-pointer touch-manipulation"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{actionsDict.expenseBtn}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic("light");
              onOpenTransferModal();
            }}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-extrabold text-xs active:scale-95 transition cursor-pointer touch-manipulation"
            title={dict.transferBtn}
          >
            <ArrowRightLeft className="w-4 h-4 text-orange-400" />
            <span>{dict.transferBtn}</span>
          </button>
        </div>
      </div>

      {/* ── BENTO-СЕТКА СЧЕТОВ И КАСС ── */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
        {accounts.map((acc) => {
          const Icon = ACCOUNT_ICONS[acc.type] || Wallet;
          const colors = COLOR_CLASSES[acc.color] || COLOR_CLASSES.orange;
          const isSelected = selectedAccountId === acc.id;

          return (
            <div
              key={acc.id}
              onClick={() => {
                triggerHaptic("light");
                onSelectAccount(isSelected ? null : acc.id);
              }}
              className={`p-3.5 sm:p-4 rounded-3xl border transition-all duration-150 cursor-pointer select-none active:scale-[0.98] relative flex flex-col justify-between min-h-[110px] ${
                isSelected
                  ? `bg-white border-orange-500 ring-4 ring-orange-500/15 shadow-md`
                  : `bg-white border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-xs`
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`w-8 h-8 rounded-xl ${colors.bg} ${colors.text} border ${colors.border} flex items-center justify-center shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-extrabold text-xs text-slate-900 truncate block">
                      {acc.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold block">
                      {dict.types[acc.type] || acc.type}
                    </span>
                  </div>
                </div>

                {acc.isDefault && (
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-orange-100 text-orange-700 shrink-0">
                    {dict.defaultBadge}
                  </span>
                )}
              </div>

              <div className="mt-3 flex items-baseline justify-between gap-1">
                <span className="text-base sm:text-xl font-black font-mono tracking-tight text-slate-900 truncate">
                  {acc.balance.toLocaleString("ru-RU")}&nbsp;₸
                </span>

                {isSelected && (
                  <span className="text-[10px] font-bold text-orange-600 shrink-0 flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" />
                    Фильтр
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Сброс фильтра по счетам (если выбран) */}
      {selectedAccountId && (
        <div className="flex items-center justify-between px-3 py-1.5 bg-orange-50/70 border border-orange-200 rounded-2xl animate-in fade-in duration-100">
          <span className="text-xs font-bold text-orange-900 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            Показаны операции по выбранному счету
          </span>
          <button
            type="button"
            onClick={() => onSelectAccount(null)}
            className="text-xs font-black text-orange-700 hover:text-orange-950 hover:underline cursor-pointer"
          >
            Показать все счета
          </button>
        </div>
      )}
    </div>
  );
}
