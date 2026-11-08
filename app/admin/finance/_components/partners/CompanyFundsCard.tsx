"use client";

import React from "react";
import { ShieldCheck, Plus, Sparkles } from "lucide-react";
import { CompanyFundItem } from "../../_types/financeTypes";
import { FINANCE_DICTIONARY } from "../../_data/financeDictionary";

interface CompanyFundsCardProps {
  funds: CompanyFundItem[];
}

export default function CompanyFundsCard({ funds }: CompanyFundsCardProps) {
  const dict = FINANCE_DICTIONARY.partners;

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-4">
      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
        <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/80">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-black text-slate-900 leading-tight">
            {dict.fundsTitle}
          </h3>
          <p className="text-[11px] text-slate-400 font-bold">
            {dict.fundsSubtitle}
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        {funds.map((fund) => (
          <div
            key={fund.id}
            className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200/60 flex items-center justify-between gap-3 text-xs"
          >
            <div>
              <span className="font-extrabold text-slate-900 block">
                {fund.name}
              </span>
              <span className="text-[10px] text-slate-400 font-bold">
                Отчисление: {fund.targetPercent}% от чистой прибыли
              </span>
            </div>

            <div className="text-right">
              <span className="font-black font-mono text-slate-900 block text-sm">
                {fund.balance.toLocaleString("ru-RU")}&nbsp;₸
              </span>
              <span className="text-[10px] text-emerald-600 font-bold">
                Активен
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
