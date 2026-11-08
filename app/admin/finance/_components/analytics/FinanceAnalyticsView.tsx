"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Percent, 
  Building, 
  CreditCard, 
  Landmark, 
  Sparkles,
  ArrowRight
} from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { getFinanceAnalytics } from "../../actions";
import { FinancePeriod, FinanceAnalyticsSummary } from "../../_types/financeTypes";
import { FINANCE_DICTIONARY } from "../../_data/financeDictionary";
import FinancePeriodPicker from "./FinancePeriodPicker";
import FinanceCategoryDonut from "./FinanceCategoryDonut";

export default function FinanceAnalyticsView() {
  const dict = FINANCE_DICTIONARY.analytics;

  const [period, setPeriod] = useState<FinancePeriod>("THIS_MONTH");
  const [data, setData] = useState<FinanceAnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const cacheRef = useRef<Map<FinancePeriod, FinanceAnalyticsSummary>>(new Map());

  useEffect(() => {
    let isCancelled = false;

    // Мгновенный показ из кэша для нулевой задержки переключения
    if (cacheRef.current.has(period)) {
      setData(cacheRef.current.get(period)!);
      setLoading(false);
    } else {
      setLoading(true);
    }

    getFinanceAnalytics(period).then((res) => {
      if (!isCancelled && res.success && res.data) {
        cacheRef.current.set(period, res.data);
        setData(res.data);
      }
      if (!isCancelled) setLoading(false);
    });

    return () => {
      isCancelled = true;
    };
  }, [period]);

  const summary = data || {
    period,
    totalRevenue: 0,
    totalDirectExpenses: 0,
    grossProfit: 0,
    grossMarginPercent: 0,
    totalOverheadExpenses: 0,
    totalCommercialExpenses: 0,
    totalTaxes: 0,
    totalExpenses: 0,
    netProfit: 0,
    netMarginPercent: 0,
    categoryBreakdown: [],
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* ── ВЕРХНЯЯ СТРОКА: ЗАГОЛОВОК И СЕЛЕКТОР ПЕРИОДА ── */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
            {dict.title}
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {dict.subtitle}
          </p>
        </div>

        <FinancePeriodPicker
          currentPeriod={period}
          onSelectPeriod={setPeriod}
        />
      </div>

      {/* ── ФИНАНСОВАЯ ЛЕСТНИЦА P&L (BENTO CARDS) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
        {/* 1. Выручка */}
        <div className="p-4 bg-white rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              {dict.metrics.revenue}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-lg sm:text-2xl font-black font-mono tracking-tight text-emerald-700 block truncate">
              {summary.totalRevenue.toLocaleString("ru-RU")}&nbsp;₸
            </span>
            <span className="text-[10px] text-slate-400 font-bold block mt-0.5">
              100% от оборота
            </span>
          </div>
        </div>

        {/* 2. Прямая себестоимость цеха */}
        <div className="p-4 bg-white rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              {dict.metrics.cogs}
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-lg sm:text-2xl font-black font-mono tracking-tight text-blue-700 block truncate">
              {summary.totalDirectExpenses.toLocaleString("ru-RU")}&nbsp;₸
            </span>
            <span className="text-[10px] text-slate-400 font-bold block mt-0.5">
              Сырье, металл, LED и монтажи
            </span>
          </div>
        </div>

        {/* 3. Валовая прибыль */}
        <div className="p-4 bg-white rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              {dict.metrics.grossProfit}
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-lg sm:text-2xl font-black font-mono tracking-tight text-purple-700 block truncate">
              {summary.grossProfit.toLocaleString("ru-RU")}&nbsp;₸
            </span>
            <span className="text-[10px] text-purple-600 font-bold block mt-0.5">
              Маржинальность: {summary.grossMarginPercent}%
            </span>
          </div>
        </div>

        {/* 4. ЧИСТАЯ ПРИБЫЛЬ (ГЛАВНАЯ МЕТРИКА) */}
        <div className="p-4 bg-slate-900 text-white rounded-3xl shadow-md border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
              {dict.metrics.netProfit}
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-lg sm:text-2xl font-black font-mono tracking-tight text-white block truncate">
              {summary.netProfit.toLocaleString("ru-RU")}&nbsp;₸
            </span>
            <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">
              Чистая рентабельность: {summary.netMarginPercent}%
            </span>
          </div>
        </div>
      </div>

      {/* ── ПОДРОБНАЯ РАСШИФРОВКА РАСХОДОВ ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {/* Накладные, Офис, Налоги */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-3">
          <h3 className="font-extrabold text-sm text-slate-900">
            Накладные расходы компании
          </h3>

          <div className="space-y-2.5">
            <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-slate-500" />
                <span className="font-bold text-slate-700">{dict.metrics.opex}</span>
              </div>
              <span className="font-black font-mono text-slate-900">
                {(summary.totalOverheadExpenses + summary.totalCommercialExpenses).toLocaleString("ru-RU")}&nbsp;₸
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Landmark className="w-4 h-4 text-slate-500" />
                <span className="font-bold text-slate-700">{dict.metrics.taxes}</span>
              </div>
              <span className="font-black font-mono text-slate-900">
                {summary.totalTaxes.toLocaleString("ru-RU")}&nbsp;₸
              </span>
            </div>

            <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-2xl flex items-center justify-between text-xs">
              <span className="font-black text-rose-900">ИТОГО ВСЕХ РАСХОДОВ</span>
              <span className="font-black font-mono text-rose-700 text-sm">
                -{summary.totalExpenses.toLocaleString("ru-RU")}&nbsp;₸
              </span>
            </div>
          </div>
        </div>

        {/* Круговая диаграмма распределения */}
        <div className="lg:col-span-2">
          <FinanceCategoryDonut
            categories={summary.categoryBreakdown}
            totalExpenses={summary.totalExpenses}
          />
        </div>
      </div>
    </div>
  );
}
