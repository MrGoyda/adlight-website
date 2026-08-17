"use client";

import { useRouter } from "next/navigation";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Percent, 
  LogOut,
  Target,
  ArrowUpRight,
  ShieldCheck
} from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import Button from "@/components/ui/Button";

interface SourceStat {
  source: string;
  leadsCount: number;
  completedCount: number;
  conversionRate: number;
  revenue: number;
  expenses: number;
  netProfit: number;
}

interface AnalyticsDashboardProps {
  stats: SourceStat[];
  summary: {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    totalLeads: number;
    completedLeads: number;
    averageBill: number;
  };
}

export default function AnalyticsDashboard({ stats, summary }: AnalyticsDashboardProps) {
  const router = useRouter();

  const handleLogout = async () => {
    triggerHaptic("light");
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const conversion = summary.totalLeads > 0 
    ? (summary.completedLeads / summary.totalLeads) * 100 
    : 0;

  return (
    <div className="space-y-6 select-none">

      {/* ── ФИНАНСОВАЯ СВОДКА (KPI) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Чистая прибыль */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between h-36">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-450 uppercase tracking-wider">Чистая прибыль</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {summary.netProfit.toLocaleString("ru")} ₸
            </h2>
            <p className="text-[10px] text-slate-400 font-semibold mt-1">После вычета прямых расходов</p>
          </div>
        </div>

        {/* Выручка / Обороты */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between h-36">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-450 uppercase tracking-wider">Общая выручка</span>
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center border border-orange-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {summary.totalRevenue.toLocaleString("ru")} ₸
            </h2>
            <p className="text-[10px] text-slate-400 font-semibold mt-1">Всего принято от клиентов</p>
          </div>
        </div>

        {/* Средний чек */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between h-36">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-450 uppercase tracking-wider">Средний чек</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center border border-blue-500/20">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {Math.round(summary.averageBill).toLocaleString("ru")} ₸
            </h2>
            <p className="text-[10px] text-slate-400 font-semibold mt-1">Выручка на одну продажу</p>
          </div>
        </div>

        {/* Конверсия */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between h-36">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-450 uppercase tracking-wider">Конверсия</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center border border-purple-500/20">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {conversion.toFixed(1)} %
            </h2>
            <p className="text-[10px] text-slate-400 font-semibold mt-1">
              {summary.completedLeads} из {summary.totalLeads} заявок закрыто
            </p>
          </div>
        </div>

      </div>

      {/* ── ТАБЛИЦА ЭФФЕКТИВНОСТИ КАНАЛОВ РЕКЛАМЫ (UTM) ── */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">Эффективность рекламных каналов (UTM)</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-450 font-bold text-[10px] uppercase tracking-wider">
                <th className="py-4 px-6">Источник (utm_source)</th>
                <th className="py-4 px-6 text-center">Заявок</th>
                <th className="py-4 px-6 text-center">Продаж</th>
                <th className="py-4 px-6 text-center">Конверсия</th>
                <th className="py-4 px-6 text-right">Выручка</th>
                <th className="py-4 px-6 text-right">Расходы</th>
                <th className="py-4 px-6 text-right">Чистая прибыль</th>
              </tr>
            </thead>
            <tbody>
              {stats.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 px-6 text-center text-slate-400 font-semibold">
                    Нет аналитических данных для анализа
                  </td>
                </tr>
              ) : (
                stats.map((stat, idx) => (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/40 transition">
                    <td className="py-4 px-6 text-slate-800 font-bold flex items-center gap-2">
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {stat.source}
                    </td>
                    <td className="py-4 px-6 text-center text-slate-650 font-semibold">
                      {stat.leadsCount}
                    </td>
                    <td className="py-4 px-6 text-center text-slate-650 font-semibold">
                      {stat.completedCount}
                    </td>
                    <td className="py-4 px-6 text-center text-slate-700 font-bold">
                      {stat.conversionRate.toFixed(1)}%
                    </td>
                    <td className="py-4 px-6 text-right text-slate-800 font-semibold">
                      {stat.revenue.toLocaleString("ru")} ₸
                    </td>
                    <td className="py-4 px-6 text-right text-slate-500 font-medium">
                      {stat.expenses.toLocaleString("ru")} ₸
                    </td>
                    <td className="py-4 px-6 text-right text-emerald-600 font-bold">
                      {stat.netProfit.toLocaleString("ru")} ₸
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
