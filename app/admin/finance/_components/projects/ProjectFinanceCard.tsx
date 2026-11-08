"use client";

import React, { useState } from "react";
import { 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  DollarSign
} from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { ProjectFinanceUnit } from "../../_types/financeTypes";
import { FINANCE_DICTIONARY } from "../../_data/financeDictionary";

interface ProjectFinanceCardProps {
  unit: ProjectFinanceUnit;
}

function ProjectFinanceCard({ unit }: ProjectFinanceCardProps) {
  const dict = FINANCE_DICTIONARY.projects;
  const [isExpanded, setIsExpanded] = useState(false);

  const isOverbudget = unit.deltaCost > 0;
  const isSaved = unit.deltaCost < 0;

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3.5 transition hover:shadow-xs">
      {/* ── ВЕРХНЯЯ СТРОКА: ИМЯ ПРОЕКТА + СТАТУС ── */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-extrabold text-sm sm:text-base text-slate-900 truncate">
              {unit.leadName}
            </h4>
            <span className="text-[10px] font-mono text-slate-400 font-bold">
              {unit.phone}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <a
              href={`/admin/leads/${unit.leadId}`}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 hover:underline"
            >
              <span>Открыть карточку заказа</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Бейдж перерасхода / экономии */}
        <div className="shrink-0">
          {isOverbudget ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-200">
              <AlertTriangle className="w-3 h-3 text-rose-600" />
              {dict.overbudgetBadge} +{unit.deltaCost.toLocaleString("ru-RU")}&nbsp;₸
            </span>
          ) : isSaved ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              {dict.savedBadge} {Math.abs(unit.deltaCost).toLocaleString("ru-RU")}&nbsp;₸
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-black bg-slate-50 text-slate-600 border border-slate-200">
              {dict.onBudgetBadge}
            </span>
          )}
        </div>
      </div>

      {/* ── 4 МЕТРИКИ ЮНИТ-ЭКОНОМИКИ (2x2 на мобилке, 4 в ряд на десктопе) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100 text-xs">
        {/* План выручки vs Факт оплаты */}
        <div className="p-2.5 bg-slate-50 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-400 block uppercase">
            {dict.paidRevenue}
          </span>
          <span className="font-black font-mono text-slate-900 block text-xs sm:text-sm mt-0.5">
            {unit.paidByClient.toLocaleString("ru-RU")}&nbsp;₸
          </span>
          <span className="text-[9px] text-slate-400 font-medium block">
            по договору: {unit.contractPrice.toLocaleString("ru-RU")} ₸
          </span>
        </div>

        {/* План сметы */}
        <div className="p-2.5 bg-slate-50 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-400 block uppercase">
            {dict.plannedCost}
          </span>
          <span className="font-black font-mono text-slate-700 block text-xs sm:text-sm mt-0.5">
            {unit.estimatedCost.toLocaleString("ru-RU")}&nbsp;₸
          </span>
          <span className="text-[9px] text-slate-400 font-medium block">
            план сметчика
          </span>
        </div>

        {/* Факт расходов цеха */}
        <div className={`p-2.5 rounded-2xl ${isOverbudget ? "bg-rose-50/70 border border-rose-200/80" : "bg-slate-50"}`}>
          <span className={`text-[10px] font-bold block uppercase ${isOverbudget ? "text-rose-700" : "text-slate-400"}`}>
            {dict.actualCost}
          </span>
          <span className={`font-black font-mono block text-xs sm:text-sm mt-0.5 ${isOverbudget ? "text-rose-700" : "text-slate-900"}`}>
            {unit.actualDirectExpenses.toLocaleString("ru-RU")}&nbsp;₸
          </span>
          <span className="text-[9px] text-slate-400 font-medium block">
            по чекам цеха
          </span>
        </div>

        {/* Фактическая чистая маржа */}
        <div className="p-2.5 bg-emerald-50/60 rounded-2xl border border-emerald-100">
          <span className="text-[10px] font-bold text-emerald-700 block uppercase">
            {dict.actualMargin}
          </span>
          <span className="font-black font-mono text-emerald-800 block text-xs sm:text-sm mt-0.5">
            {unit.actualMargin.toLocaleString("ru-RU")}&nbsp;₸
          </span>
          <span className="text-[9px] font-black text-emerald-600 block">
            Рентабельность: {unit.actualMarginPercent}%
          </span>
        </div>
      </div>

      {/* ── АККОРДЕОН СВЯЗАННЫХ ЧЕКОВ И ПЛАТЕЖЕЙ ── */}
      {unit.transactions.length > 0 && (
        <div className="pt-1">
          <button
            type="button"
            onClick={() => {
              triggerHaptic("light");
              setIsExpanded((p) => !p);
            }}
            className="w-full flex items-center justify-between py-1.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold transition cursor-pointer"
          >
            <span>Связанных операций цеха: {unit.transactions.length}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {isExpanded && (
            <div className="mt-2 space-y-1.5 animate-in fade-in duration-100 pl-2 border-l-2 border-slate-200">
              {unit.transactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between text-xs py-1 text-slate-700">
                  <div className="min-w-0 mr-2">
                    <span className="font-medium truncate block">{t.description}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(t.transactionDate).toLocaleDateString("ru-RU")} • {t.account?.name || "Счет"}
                    </span>
                  </div>
                  <span className={`font-mono font-black shrink-0 ${t.type === "INCOME" ? "text-emerald-600" : "text-rose-600"}`}>
                    {t.type === "INCOME" ? "+" : "-"}{t.amount.toLocaleString("ru-RU")}&nbsp;₸
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default React.memo(ProjectFinanceCard);
