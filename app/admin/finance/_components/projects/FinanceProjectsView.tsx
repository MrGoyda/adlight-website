"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, X, Filter, Target, AlertTriangle } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { getProjectsUnitEconomics } from "../../actions";
import { ProjectFinanceUnit } from "../../_types/financeTypes";
import { FINANCE_DICTIONARY } from "../../_data/financeDictionary";
import ProjectFinanceCard from "./ProjectFinanceCard";

export default function FinanceProjectsView() {
  const dict = FINANCE_DICTIONARY.projects;

  const [projects, setProjects] = useState<ProjectFinanceUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"ALL" | "OVERBUDGET" | "SAVED">("ALL");

  useEffect(() => {
    let isCancelled = false;
    getProjectsUnitEconomics().then((res) => {
      if (!isCancelled && res.success && res.data) {
        setProjects(res.data);
      }
      if (!isCancelled) setLoading(false);
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (filterMode === "OVERBUDGET" && p.deltaCost <= 0) return false;
      if (filterMode === "SAVED" && p.deltaCost >= 0) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.leadName.toLowerCase().includes(q);
        const matchPhone = p.phone.includes(q);
        if (!matchName && !matchPhone) return false;
      }

      return true;
    });
  }, [projects, filterMode, searchQuery]);

  const stats = useMemo(() => {
    const totalProjects = projects.length;
    const overbudgetCount = projects.filter((p) => p.deltaCost > 0).length;
    const totalActualMargin = projects.reduce((sum, p) => sum + p.actualMargin, 0);

    return { totalProjects, overbudgetCount, totalActualMargin };
  }, [projects]);

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* ── ВЕРХНЯЯ ПАНЕЛЬ С ПОИСКОМ И ФИЛЬТРАМИ ── */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
            {dict.title}
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {dict.subtitle}
          </p>
        </div>

        {/* Быстрые фильтры по бюджету */}
        <div className="inline-flex bg-slate-100 p-1 rounded-2xl select-none max-w-full overflow-x-auto no-scrollbar shrink-0">
          <button
            type="button"
            onClick={() => { triggerHaptic("light"); setFilterMode("ALL"); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer whitespace-nowrap ${
              filterMode === "ALL" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Все заказы ({stats.totalProjects})
          </button>
          <button
            type="button"
            onClick={() => { triggerHaptic("light"); setFilterMode("OVERBUDGET"); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer whitespace-nowrap ${
              filterMode === "OVERBUDGET" ? "bg-white text-rose-700 shadow-2xs font-extrabold" : "text-slate-500 hover:text-rose-700"
            }`}
          >
            Перерасход ({stats.overbudgetCount})
          </button>
          <button
            type="button"
            onClick={() => { triggerHaptic("light"); setFilterMode("SAVED"); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer whitespace-nowrap ${
              filterMode === "SAVED" ? "bg-white text-emerald-700 shadow-2xs font-extrabold" : "text-slate-500 hover:text-emerald-700"
            }`}
          >
            В рамках сметы
          </button>
        </div>
      </div>

      {/* Поиск */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          placeholder={dict.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-slate-200/80 rounded-2xl pl-9 pr-8 py-2.5 text-base sm:text-xs font-semibold text-slate-900 focus:border-orange-500 outline-none shadow-2xs transition"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* ── РЕЕСТР КАРТОЧЕК ПРОЕКТОВ ── */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 font-medium text-xs">
          {dict.emptyState}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredProjects.map((unit) => (
            <ProjectFinanceCard key={unit.leadId} unit={unit} />
          ))}
        </div>
      )}
    </div>
  );
}
