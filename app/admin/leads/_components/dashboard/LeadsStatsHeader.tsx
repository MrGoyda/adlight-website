"use client";

import React from "react";
import { FolderKanban, Flame, Clock, DollarSign, TrendingUp } from "lucide-react";
import { LEADS_DICTIONARY } from "../../_data/leadsDictionary";

interface LeadsStatsHeaderProps {
  totalCount: number;
  newCount: number;
  inProgressCount: number;
  totalRevenue: number;
  conversionRate: number;
}

export default function LeadsStatsHeader({
  totalCount,
  newCount,
  inProgressCount,
  totalRevenue,
  conversionRate,
}: LeadsStatsHeaderProps) {
  const dict = LEADS_DICTIONARY.stats;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
      {/* 1. Всего лидов */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
          <FolderKanban className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">
            {dict.total}
          </span>
          <span className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
            {totalCount}
          </span>
        </div>
      </div>

      {/* 2. Новые заявки */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
          <Flame className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <span className="block text-[11px] font-bold text-blue-600/80 uppercase tracking-wider truncate">
            {dict.new}
          </span>
          <span className="text-lg sm:text-xl font-black text-blue-700 leading-tight">
            {newCount}
          </span>
        </div>
      </div>

      {/* 3. В работе */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
          <Clock className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <span className="block text-[11px] font-bold text-amber-600/80 uppercase tracking-wider truncate">
            {dict.inProgress}
          </span>
          <span className="text-lg sm:text-xl font-black text-amber-700 leading-tight">
            {inProgressCount}
          </span>
        </div>
      </div>

      {/* 4. Выручка */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
          <DollarSign className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <span className="block text-[11px] font-bold text-emerald-600/80 uppercase tracking-wider truncate">
            {dict.revenue}
          </span>
          <span className="text-base sm:text-lg font-black text-emerald-700 leading-tight truncate block">
            {totalRevenue.toLocaleString("ru")} ₸
          </span>
        </div>
      </div>

      {/* 5. Конверсия */}
      <div className="col-span-2 sm:col-span-2 lg:col-span-1 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <span className="block text-[11px] font-bold text-purple-600/80 uppercase tracking-wider truncate">
            {dict.conversion}
          </span>
          <span className="text-lg sm:text-xl font-black text-purple-700 leading-tight">
            {conversionRate}%
          </span>
        </div>
      </div>
    </div>
  );
}
