"use client";

import React, { useMemo } from "react";
import { 
  TrendingUp, 
  Hammer, 
  CheckCircle2, 
  Flame, 
  Calendar,
  AlertTriangle
} from "lucide-react";
import { Lead } from "../../_types/leadTypes";
import { triggerHaptic } from "@/lib/haptics";

interface LeadsPipelineMetricsProps {
  leads: Lead[];
  currentStatusFilter: string;
  onSelectStatusFilter: (status: string) => void;
  timingFilter: string;
  onSelectTimingFilter: (filter: "ALL" | "APPOINTMENTS_TODAY" | "COLD_WARNING") => void;
  coldWarnings?: number;
  appointmentsToday?: number;
}

export default function LeadsPipelineMetrics({
  leads,
  currentStatusFilter,
  onSelectStatusFilter,
  timingFilter,
  onSelectTimingFilter,
  coldWarnings = 0,
  appointmentsToday = 0,
}: LeadsPipelineMetricsProps) {
  const metrics = useMemo(() => {
    let pipelineRevenue = 0;
    let pipelineCount = 0;

    let inProductionRevenue = 0;
    let inProductionCount = 0;

    let completedRevenue = 0;
    let completedCount = 0;

    for (const lead of leads) {
      const val = lead.offeredPrice || lead.revenue || 0;

      // 1. Активный пайплайн (Новые, В работе, Смета, Производство)
      if (["NEW", "IN_PROGRESS", "ESTIMATE", "PROCESSED"].includes(lead.status)) {
        pipelineRevenue += val;
        pipelineCount++;
      }

      // 2. В производстве
      if (lead.status === "PROCESSED") {
        inProductionRevenue += val;
        inProductionCount++;
      }

      // 3. Выполнено / Оплачено
      if (lead.status === "COMPLETED") {
        completedRevenue += val;
        completedCount++;
      }
    }

    return {
      pipelineRevenue,
      pipelineCount,
      inProductionRevenue,
      inProductionCount,
      completedRevenue,
      completedCount,
    };
  }, [leads]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* ── 1. ОБЩИЙ ПАЙПЛАЙН В РАБОТЕ ── */}
      <button
        type="button"
        onClick={() => {
          triggerHaptic("light");
          onSelectStatusFilter("ALL");
        }}
        className={`p-4 bg-white border rounded-3xl shadow-2xs flex items-center justify-between text-left transition cursor-pointer active:scale-98 ${
          currentStatusFilter === "ALL" && timingFilter === "ALL"
            ? "border-orange-500 ring-2 ring-orange-500/10"
            : "border-slate-200/80 hover:border-slate-300"
        }`}
      >
        <div className="space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Активный пайплайн
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight">
              {metrics.pipelineRevenue.toLocaleString("ru-RU")}&nbsp;₸
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">
            {metrics.pipelineCount} активных сделок
          </p>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-orange-50 border border-orange-200/70 text-orange-600 flex items-center justify-center shrink-0">
          <TrendingUp className="w-5 h-5" />
        </div>
      </button>

      {/* ── 2. В ПРОИЗВОДСТВЕ (В ЦЕХУ) ── */}
      <button
        type="button"
        onClick={() => {
          triggerHaptic("light");
          onSelectStatusFilter(currentStatusFilter === "PROCESSED" ? "ALL" : "PROCESSED");
        }}
        className={`p-4 bg-white border rounded-3xl shadow-2xs flex items-center justify-between text-left transition cursor-pointer active:scale-98 ${
          currentStatusFilter === "PROCESSED"
            ? "border-blue-500 ring-2 ring-blue-500/10"
            : "border-slate-200/80 hover:border-slate-300"
        }`}
      >
        <div className="space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            В производстве (цех)
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-blue-700 font-mono tracking-tight">
              {metrics.inProductionRevenue.toLocaleString("ru-RU")}&nbsp;₸
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">
            {metrics.inProductionCount} заказов в работе
          </p>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200/70 text-blue-600 flex items-center justify-center shrink-0">
          <Hammer className="w-5 h-5" />
        </div>
      </button>

      {/* ── 3. СДАНО И ОПЛАЧЕНО ── */}
      <button
        type="button"
        onClick={() => {
          triggerHaptic("light");
          onSelectStatusFilter(currentStatusFilter === "COMPLETED" ? "ALL" : "COMPLETED");
        }}
        className={`p-4 bg-white border rounded-3xl shadow-2xs flex items-center justify-between text-left transition cursor-pointer active:scale-98 ${
          currentStatusFilter === "COMPLETED"
            ? "border-emerald-500 ring-2 ring-emerald-500/10"
            : "border-slate-200/80 hover:border-slate-300"
        }`}
      >
        <div className="space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Сдано / Оплачено
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-emerald-700 font-mono tracking-tight">
              {metrics.completedRevenue.toLocaleString("ru-RU")}&nbsp;₸
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">
            {metrics.completedCount} завершенных проектов
          </p>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200/70 text-emerald-600 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </button>

      {/* ── 4. АЛЕРТЫ СРОЧНОСТИ (Горящие / Замеры) ── */}
      <div className="p-4 bg-white border border-slate-200/80 rounded-3xl shadow-2xs flex items-center justify-between">
        <div className="space-y-2 flex-1 mr-2">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Срочные действия
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {coldWarnings > 0 && (
              <button
                type="button"
                onClick={() => {
                  triggerHaptic("medium");
                  onSelectTimingFilter(timingFilter === "COLD_WARNING" ? "ALL" : "COLD_WARNING");
                }}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-black transition cursor-pointer ${
                  timingFilter === "COLD_WARNING"
                    ? "bg-rose-600 text-white shadow-2xs"
                    : "bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100"
                }`}
                title="Клиенты ждут ответа более 2 часов"
              >
                <Flame className="w-3.5 h-3.5" />
                <span>{coldWarnings}&nbsp;ждёт</span>
              </button>
            )}

            {appointmentsToday > 0 && (
              <button
                type="button"
                onClick={() => {
                  triggerHaptic("light");
                  onSelectTimingFilter(timingFilter === "APPOINTMENTS_TODAY" ? "ALL" : "APPOINTMENTS_TODAY");
                }}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-black transition cursor-pointer ${
                  timingFilter === "APPOINTMENTS_TODAY"
                    ? "bg-amber-600 text-white shadow-2xs"
                    : "bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100"
                }`}
                title="Замеры назначены на сегодня"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{appointmentsToday}&nbsp;замер</span>
              </button>
            )}

            {coldWarnings === 0 && appointmentsToday === 0 && (
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Все в графике
              </span>
            )}
          </div>
        </div>

        <div className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-200/70 text-slate-500 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-5 h-5 text-slate-400" />
        </div>
      </div>
    </div>
  );
}
