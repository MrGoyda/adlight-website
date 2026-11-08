"use client";

import React from "react";
import { User, Wallet, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { PartnerEquityBreakdown } from "../../_types/financeTypes";
import { FINANCE_DICTIONARY } from "../../_data/financeDictionary";

interface PartnerEquityCardProps {
  equity: PartnerEquityBreakdown;
  onOpenWithdrawalModal: () => void;
}

export default function PartnerEquityCard({
  equity,
  onOpenWithdrawalModal,
}: PartnerEquityCardProps) {
  const dict = FINANCE_DICTIONARY.partners;
  const isElisey = equity.partner === "ELISEY";

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm text-white shadow-sm ${
              isElisey ? "bg-orange-500 shadow-orange-500/20" : "bg-blue-600 shadow-blue-600/20"
            }`}>
              {equity.name[0]}
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 leading-tight">
                {equity.name}
              </h3>
              <p className="text-[11px] text-slate-400 font-bold">
                Доля в бизнесе: {equity.sharePercent}%
              </p>
            </div>
          </div>

          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-700">
            50/50
          </span>
        </div>

        {/* Метрики прибыли и дивидендов */}
        <div className="space-y-2.5 mt-3 text-xs">
          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-2xl">
            <span className="text-slate-500 font-bold">{dict.earnedShare}</span>
            <span className="font-black font-mono text-slate-900">
              {equity.earnedShare.toLocaleString("ru-RU")}&nbsp;₸
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-2xl">
            <span className="text-slate-500 font-bold">{dict.withdrawn}</span>
            <span className="font-black font-mono text-rose-600">
              -{equity.withdrawnTotal.toLocaleString("ru-RU")}&nbsp;₸
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
            <span className="text-emerald-900 font-black">{dict.available}</span>
            <span className="font-black font-mono text-emerald-700 text-base">
              {equity.availableBalance.toLocaleString("ru-RU")}&nbsp;₸
            </span>
          </div>
        </div>
      </div>

      {/* Кнопка вывода */}
      <button
        type="button"
        onClick={() => {
          triggerHaptic("medium");
          onOpenWithdrawalModal();
        }}
        className="w-full py-2.5 px-4 rounded-2xl bg-slate-900 hover:bg-black text-white font-extrabold text-xs shadow-md transition active:scale-98 cursor-pointer flex items-center justify-center gap-1.5 touch-manipulation"
      >
        <ArrowUpRight className="w-3.5 h-3.5 text-orange-400" />
        <span>{dict.withdrawBtn}</span>
      </button>
    </div>
  );
}
