"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Zap, 
  Clock, 
  Archive, 
  Trash2, 
  Columns, 
  LayoutGrid, 
  List, 
  Search, 
  X, 
  User, 
  ChevronDown, 
  Check, 
  Calculator, 
  FileSpreadsheet, 
  Target, 
  Plus, 
  Flame, 
  Calendar 
} from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { LEADS_DICTIONARY } from "../../_data/leadsDictionary";

interface LeadsToolbarProps {
  workView: "ACTIVE" | "ON_HOLD" | "ARCHIVE" | "TRASH";
  onSelectWorkView: (view: "ACTIVE" | "ON_HOLD" | "ARCHIVE" | "TRASH") => void;
  activeCount: number;
  onHoldCount: number;
  archiveCount: number;
  trashCount: number;
  viewMode: "kanban" | "cards" | "list";
  onSelectViewMode: (mode: "kanban" | "cards" | "list") => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  managerFilter: string;
  onSelectManagerFilter: (manager: string) => void;
  timingFilter: "ALL" | "APPOINTMENTS_TODAY" | "COLD_WARNING" | "URGENT_DEADLINES" | "STALE_14D";
  onSelectTimingFilter: (timing: "ALL" | "APPOINTMENTS_TODAY" | "COLD_WARNING" | "URGENT_DEADLINES" | "STALE_14D") => void;
  statusFilter: string;
  onResetFilters: () => void;
  timingStats: {
    coldWarnings: number;
    appointmentsToday: number;
    stale14d: number;
  };
  onOpenCreateModal: () => void;
  onOpenEstimateModal: () => void;
  onOpenCreateClientModal: () => void;
  onOpenBatchImportModal: () => void;
  onOpenExportAudienceModal: () => void;
  onArchiveStaleClick: () => void;
}

export default function LeadsToolbar({
  workView,
  onSelectWorkView,
  activeCount,
  onHoldCount,
  archiveCount,
  trashCount,
  viewMode,
  onSelectViewMode,
  searchTerm,
  onSearchChange,
  managerFilter,
  onSelectManagerFilter,
  timingFilter,
  onSelectTimingFilter,
  statusFilter,
  onResetFilters,
  timingStats,
  onOpenCreateModal,
  onOpenEstimateModal,
  onOpenCreateClientModal,
  onOpenBatchImportModal,
  onOpenExportAudienceModal,
  onArchiveStaleClick,
}: LeadsToolbarProps) {
  const t = LEADS_DICTIONARY.toolbar;

  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [showManagerMenu, setShowManagerMenu] = useState(false);

  const actionsRef = useRef<HTMLDivElement>(null);
  const managerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (actionsRef.current && !actionsRef.current.contains(e.target as Node)) {
        setShowActionsMenu(false);
      }
      if (managerRef.current && !managerRef.current.contains(e.target as Node)) {
        setShowManagerMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasActiveFilters = statusFilter !== "ALL" || timingFilter !== "ALL" || managerFilter !== "ALL" || Boolean(searchTerm);

  return (
    <div className="bg-white rounded-3xl p-3 sm:p-4 border border-slate-200/90 shadow-xs space-y-3">
      {/* Верхний ряд: Переключатель пространств + Вид + Поиск + Действия + Новая сделка */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        
        {/* Слева: 3 пространства + Вид */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap min-w-0 max-w-full">
          <div className="inline-flex bg-slate-100 p-1 rounded-2xl select-none max-w-full overflow-x-auto no-scrollbar shrink-0">
            <button
              onClick={() => {
                triggerHaptic("light");
                onSelectWorkView("ACTIVE");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                workView === "ACTIVE"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
              <span>{t.workViewActive} ({activeCount})</span>
            </button>

            <button
              onClick={() => {
                triggerHaptic("light");
                onSelectWorkView("ON_HOLD");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                workView === "ON_HOLD"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span>{t.workViewOnHold} ({onHoldCount})</span>
            </button>

            <button
              onClick={() => {
                triggerHaptic("light");
                onSelectWorkView("ARCHIVE");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                workView === "ARCHIVE"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Archive className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span>{t.workViewArchive} ({archiveCount})</span>
            </button>

            <button
              onClick={() => {
                triggerHaptic("light");
                onSelectWorkView("TRASH");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                workView === "TRASH"
                  ? "bg-white text-rose-700 shadow-2xs font-extrabold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span>{t.workViewTrash} ({trashCount})</span>
            </button>
          </div>

          {/* Переключатель вида (только для активных режимов) */}
          {workView !== "ARCHIVE" && (
            <div className="hidden sm:inline-flex bg-slate-100 p-1 rounded-2xl select-none">
              <button
                onClick={() => { triggerHaptic("light"); onSelectViewMode("kanban"); }}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "kanban" ? "bg-white text-slate-900 shadow-2xs font-black" : "text-slate-400 hover:text-slate-700"
                }`}
                title={t.viewKanbanTitle}
              >
                <Columns className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{t.viewKanban}</span>
              </button>
              <button
                onClick={() => { triggerHaptic("light"); onSelectViewMode("cards"); }}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "cards" ? "bg-white text-slate-900 shadow-2xs font-black" : "text-slate-400 hover:text-slate-700"
                }`}
                title={t.viewCardsTitle}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{t.viewCards}</span>
              </button>
              <button
                onClick={() => { triggerHaptic("light"); onSelectViewMode("list"); }}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "list" ? "bg-white text-slate-900 shadow-2xs font-black" : "text-slate-400 hover:text-slate-700"
                }`}
                title={t.viewListTitle}
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{t.viewList}</span>
              </button>
            </div>
          )}
        </div>

        {/* В центре: Умный поиск */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl pl-9 pr-8 py-2 text-base sm:text-xs font-semibold text-slate-900 focus:bg-white focus:border-orange-500 focus:outline-none transition shadow-2xs placeholder:text-slate-400"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => { triggerHaptic("light"); onSearchChange(""); }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Справа: Менеджер + Действия + Новая сделка */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
          
          {/* Селектор Менеджера */}
          <div className="relative" ref={managerRef}>
            <button
              type="button"
              onClick={() => { triggerHaptic("light"); setShowManagerMenu((p) => !p); }}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl border text-xs font-bold transition cursor-pointer ${
                managerFilter !== "ALL"
                  ? "bg-blue-50 border-blue-200 text-blue-700 font-extrabold"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {managerFilter === "ELISEY" ? t.managerElisey : managerFilter === "DANIIL" ? t.managerDaniil : managerFilter === "UNASSIGNED" ? t.managerUnassigned : t.managerLabel}
              </span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {showManagerMenu && (
              <div className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-2xl shadow-xl border border-slate-200 p-1.5 z-40 space-y-1 animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={() => { triggerHaptic("light"); onSelectManagerFilter("ALL"); setShowManagerMenu(false); }}
                  className={`w-full text-left px-3 py-1.5 text-xs font-bold rounded-xl flex items-center justify-between ${
                    managerFilter === "ALL" ? "bg-slate-100 text-slate-900" : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <span>{t.managerAll}</span>
                  {managerFilter === "ALL" && <Check className="w-3.5 h-3.5 text-orange-600" />}
                </button>
                <button
                  onClick={() => { triggerHaptic("light"); onSelectManagerFilter("ELISEY"); setShowManagerMenu(false); }}
                  className={`w-full text-left px-3 py-1.5 text-xs font-bold rounded-xl flex items-center justify-between ${
                    managerFilter === "ELISEY" ? "bg-orange-50 text-orange-700" : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <span>{t.managerElisey}</span>
                  {managerFilter === "ELISEY" && <Check className="w-3.5 h-3.5 text-orange-600" />}
                </button>
                <button
                  onClick={() => { triggerHaptic("light"); onSelectManagerFilter("DANIIL"); setShowManagerMenu(false); }}
                  className={`w-full text-left px-3 py-1.5 text-xs font-bold rounded-xl flex items-center justify-between ${
                    managerFilter === "DANIIL" ? "bg-blue-50 text-blue-700" : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <span>{t.managerDaniil}</span>
                  {managerFilter === "DANIIL" && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>
                <button
                  onClick={() => { triggerHaptic("light"); onSelectManagerFilter("UNASSIGNED"); setShowManagerMenu(false); }}
                  className={`w-full text-left px-3 py-1.5 text-xs font-bold rounded-xl flex items-center justify-between ${
                    managerFilter === "UNASSIGNED" ? "bg-slate-100 text-slate-900" : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <span>{t.managerUnassigned}</span>
                  {managerFilter === "UNASSIGNED" && <Check className="w-3.5 h-3.5 text-slate-600" />}
                </button>
              </div>
            )}
          </div>

          {/* Меню Действия */}
          <div className="relative" ref={actionsRef}>
            <button
              type="button"
              onClick={() => { triggerHaptic("light"); setShowActionsMenu((p) => !p); }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer active:scale-95"
              title={t.actionsTooltip}
            >
              <span>{t.actionsLabel}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {showActionsMenu && (
              <div className="absolute right-0 top-full mt-1.5 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-1.5 z-40 space-y-1 animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={() => {
                    triggerHaptic("light");
                    setShowActionsMenu(false);
                    onOpenEstimateModal();
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-bold rounded-xl hover:bg-orange-50 text-slate-700 hover:text-orange-700 flex items-center gap-2 transition"
                >
                  <Calculator className="w-4 h-4 text-orange-500" />
                  <span>{t.actionEstimateCalc}</span>
                </button>
                <button
                  onClick={() => {
                    triggerHaptic("light");
                    setShowActionsMenu(false);
                    onOpenCreateClientModal();
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-bold rounded-xl hover:bg-blue-50 text-slate-700 hover:text-blue-700 flex items-center gap-2 transition"
                >
                  <User className="w-4 h-4 text-blue-500" />
                  <span>{t.actionNewClient}</span>
                </button>
                <button
                  onClick={() => {
                    triggerHaptic("light");
                    setShowActionsMenu(false);
                    onOpenBatchImportModal();
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-bold rounded-xl hover:bg-purple-50 text-slate-700 hover:text-purple-700 flex items-center gap-2 transition"
                >
                  <FileSpreadsheet className="w-4 h-4 text-purple-500" />
                  <span>{t.actionImportExcel}</span>
                </button>
                <button
                  onClick={() => {
                    triggerHaptic("light");
                    setShowActionsMenu(false);
                    onOpenExportAudienceModal();
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-bold rounded-xl hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 flex items-center gap-2 transition"
                >
                  <Target className="w-4 h-4 text-emerald-500" />
                  <span>{t.actionExportAudience}</span>
                </button>
                <button
                  onClick={() => {
                    triggerHaptic("light");
                    setShowActionsMenu(false);
                    onArchiveStaleClick();
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-bold rounded-xl hover:bg-amber-50 text-slate-700 hover:text-amber-800 flex items-center gap-2 transition border-t border-slate-100"
                >
                  <Archive className="w-4 h-4 text-amber-600" />
                  <span>
                    {t.actionArchiveStale}
                    {timingStats.stale14d > 0 ? ` (${timingStats.stale14d})` : ""}
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Новая сделка */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic("light");
              onOpenCreateModal();
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs shadow-sm transition active:scale-95 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{t.newDealBtn}</span>
          </button>

        </div>
      </div>

      {/* Нижний ряд (чипсы статусов и горящих напоминаний) */}
      {(timingStats.coldWarnings > 0 || timingStats.appointmentsToday > 0 || timingStats.stale14d > 0 || hasActiveFilters) && (
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 flex-wrap text-xs">
          {timingStats.coldWarnings > 0 && (
            <button
              onClick={() => {
                triggerHaptic("light");
                onSelectTimingFilter(timingFilter === "COLD_WARNING" ? "ALL" : "COLD_WARNING");
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black transition cursor-pointer ${
                timingFilter === "COLD_WARNING"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100"
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>{t.coldWarningBadge} ({timingStats.coldWarnings})</span>
            </button>
          )}

          {timingStats.appointmentsToday > 0 && (
            <button
              onClick={() => {
                triggerHaptic("light");
                onSelectTimingFilter(timingFilter === "APPOINTMENTS_TODAY" ? "ALL" : "APPOINTMENTS_TODAY");
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black transition cursor-pointer ${
                timingFilter === "APPOINTMENTS_TODAY"
                  ? "bg-orange-600 text-white shadow-xs"
                  : "bg-orange-50 border border-orange-200 text-orange-700 hover:bg-orange-100"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{t.appointmentsTodayBadge} ({timingStats.appointmentsToday})</span>
            </button>
          )}

          {/* Смарт-чипс зависших заявок > 14 дней */}
          {timingStats.stale14d > 0 && (
            <div className="inline-flex items-center gap-1">
              <button
                onClick={() => {
                  triggerHaptic("light");
                  onSelectTimingFilter(timingFilter === "STALE_14D" ? "ALL" : "STALE_14D");
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black transition cursor-pointer ${
                  timingFilter === "STALE_14D"
                    ? "bg-slate-800 text-white shadow-xs"
                    : "bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200"
                }`}
                title="Заявки в статусе Новые более 14 дней"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{t.staleWarningBadge} ({timingStats.stale14d})</span>
              </button>

              {timingFilter === "STALE_14D" && (
                <button
                  type="button"
                  onClick={onArchiveStaleClick}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-black transition cursor-pointer shadow-2xs"
                  title={LEADS_DICTIONARY.bulkActions.quickArchiveStale}
                >
                  <Archive className="w-3 h-3" />
                  <span>{LEADS_DICTIONARY.bulkActions.archiveBtn}</span>
                </button>
              )}
            </div>
          )}

          {/* Сброс фильтров */}
          {hasActiveFilters && (
            <button
              onClick={() => {
                triggerHaptic("light");
                onResetFilters();
              }}
              className="text-slate-400 hover:text-slate-700 text-xs font-semibold underline underline-offset-2 ml-auto cursor-pointer"
            >
              {t.resetFilters}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
