"use client";

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { 
  Zap, 
  Clock, 
  Archive, 
  Plus, 
  Search, 
  X, 
  Flame, 
  Calendar, 
  Calculator, 
  User, 
  FileSpreadsheet, 
  Target, 
  ChevronDown, 
  LayoutGrid, 
  List, 
  Columns,
  Phone, 
  Check, 
  Copy
} from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { toast } from "@/lib/toast";
import { LeadStatus } from "@prisma/client";
import { Lead } from "../_types/leadTypes";
import { STATUS_MAP, LEADS_DICTIONARY } from "../_data/leadsDictionary";
import { useLeadFilters } from "../_hooks/useLeadFilters";
import { useLeadOperations } from "../_hooks/useLeadOperations";
import { updateLeadStatus } from "../actions";
import LeadCard from "./LeadCard";
import ClickMatcherWidget from "@/components/admin/ClickMatcherWidget";
import LeadsPipelineMetrics from "./dashboard/LeadsPipelineMetrics";
import LeadKanbanBoard from "./kanban/LeadKanbanBoard";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { getWhatsAppUrl } from "@/lib/phoneUtils";

// ── ДИНАМИЧЕСКИЙ ИМПОРТ ТЯЖЕЛЫХ МОДАЛЬНЫХ ОКОН (CODE SPLITTING / LAZY LOADING) ──
const LeadDetailSheet = dynamic(() => import("./detail/LeadDetailSheet"), { ssr: false });
const LeadCreateModal = dynamic(() => import("./dashboard/LeadCreateModal"), { ssr: false });
const LeadFinanceModal = dynamic(() => import("./dashboard/LeadFinanceModal"), { ssr: false });
const LeadDeleteConfirmModal = dynamic(() => import("./dashboard/LeadDeleteConfirmModal"), { ssr: false });
const EstimateModal = dynamic(() => import("./EstimateModal"), { ssr: false });
const CreateClientModal = dynamic(
  () => import("../../clients/_components/CreateClientModal").then((m) => m.CreateClientModal),
  { ssr: false }
);
const BatchImportClientsModal = dynamic(
  () => import("../../clients/_components/BatchImportClientsModal").then((m) => m.BatchImportClientsModal),
  { ssr: false }
);
const ExportAudienceModal = dynamic(
  () => import("../../clients/_components/ExportAudienceModal").then((m) => m.ExportAudienceModal),
  { ssr: false }
);

interface LeadsDashboardProps {
  initialLeads: Lead[];
  initialClients?: any[];
  initialCompanies?: any[];
  initialWarehouseItems?: any[];
  initialSupplierPrices?: any[];
  initialPendingClicks?: any[];
  selectedLeadId?: string;
}

export default function LeadsDashboard({
  initialLeads,
  initialClients = [],
  initialCompanies = [],
  initialWarehouseItems = [],
  initialSupplierPrices = [],
  selectedLeadId,
}: LeadsDashboardProps) {
  const router = useRouter();
  const t = LEADS_DICTIONARY.toolbar;
  const tableDict = LEADS_DICTIONARY.table;
  const toastDict = LEADS_DICTIONARY.toasts;

  // Хуки логики операций и фильтрации
  const ops = useLeadOperations({
    initialLeads,
    initialClients,
    selectedLeadId,
  });
  const filters = useLeadFilters(ops.leads);

  // Выбранная сделка для инспектора (двухпанельный режим на десктопе и шторка на мобилке)
  const [detailLead, setDetailLead] = useState<Lead | null>(() => {
    if (selectedLeadId) {
      return initialLeads.find((l) => l.id === selectedLeadId) || null;
    }
    return null;
  });

  // Режим отображения: Канбан-доска, Сетка карточек или Список (Таблица)
  const [viewMode, setViewMode] = useState<"kanban" | "cards" | "list">("kanban");

  // Фильтр по менеджеру
  const [managerFilter, setManagerFilter] = useState<string>("ALL");

  // Состояние меню «Действия»
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [showManagerMenu, setShowManagerMenu] = useState(false);

  const actionsRef = useRef<HTMLDivElement>(null);
  const managerRef = useRef<HTMLDivElement>(null);

  // Модальные окна
  const [estimateLead, setEstimateLead] = useState<Lead | null>(null);
  const [showEstimateModal, setShowEstimateModal] = useState(false);
  const [showCreateClientModal, setShowCreateClientModal] = useState(false);
  const [showBatchImportModal, setShowBatchImportModal] = useState(false);
  const [showExportAudienceModal, setShowExportAudienceModal] = useState(false);

  // Мемоизированные стабильные обработчики для React.memo карточек
  const handleSelectLead = useCallback((lead: Lead) => {
    setDetailLead(lead);
  }, []);

  const handleOpenEstimate = useCallback((lead: Lead) => {
    setEstimateLead(lead);
    setShowEstimateModal(true);
  }, []);

  const handleOpenFullCard = useCallback((id: string) => {
    router.push(`/admin/leads/${id}`);
  }, [router]);

  const handleOpenCreateModal = useCallback(() => {
    ops.setShowCreateModal(true);
  }, [ops]);

  // Быстрый перевод сделки на следующий этап с оптимистичным обновлением
  const handleStatusChangeQuick = useCallback(async (leadId: string, newStatus: LeadStatus) => {
    triggerHaptic("medium");
    ops.setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );
    setDetailLead((prev) => (prev && prev.id === leadId ? { ...prev, status: newStatus } : prev));
    try {
      const res = await updateLeadStatus(leadId, newStatus);
      if (!res.success) {
        toast.error(res.error || toastDict.statusError);
        router.refresh();
      } else {
        toast.success(toastDict.stageUpdated);
      }
    } catch (err: any) {
      toast.error(err.message || toastDict.statusError);
      router.refresh();
    }
  }, [ops, router, toastDict]);

  // Копирование телефона с уведомлением
  const handleCopyPhone = useCallback(async (e: React.MouseEvent, phone: string) => {
    e.stopPropagation();
    triggerHaptic("light");
    try {
      await navigator.clipboard.writeText(phone);
      toast.success(toastDict.phoneCopied);
    } catch {
      toast.error(toastDict.copyError);
    }
  }, [toastDict]);

  // Закрытие выпадающих списков по клику вне
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

  // Дополнительная фильтрация по выбранному менеджеру
  const finalLeads = useMemo(() => {
    let result = filters.filteredLeads;
    if (managerFilter === "ELISEY") {
      result = result.filter((l) => l.manager === "ELISEY");
    } else if (managerFilter === "DANIIL") {
      result = result.filter((l) => l.manager === "DANIIL");
    } else if (managerFilter === "UNASSIGNED") {
      result = result.filter((l) => !l.manager);
    }
    return result;
  }, [filters.filteredLeads, managerFilter]);

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-16">
      
      {/* ── НЕРАСПРЕДЕЛЕННЫЕ КЛИКИ (КОМПАКТНЫЙ СТРИП, ИСЧЕЗАЕТ ПРИ 0 КЛИКОВ) ── */}
      <ClickMatcherWidget onMatched={() => router.refresh()} />

      {/* ── ФИНАНСОВЫЕ KPI И МЕТРИКИ ВОРОНКИ ПРОИЗВОДСТВА ── */}
      <LeadsPipelineMetrics
        leads={ops.leads}
        currentStatusFilter={filters.statusFilter}
        onSelectStatusFilter={(s: string) => filters.setStatusFilter(s)}
        timingFilter={filters.timingFilter}
        onSelectTimingFilter={(f: "ALL" | "APPOINTMENTS_TODAY" | "COLD_WARNING") => filters.setTimingFilter(f)}
        coldWarnings={filters.timingStats.coldWarnings}
        appointmentsToday={filters.timingStats.appointmentsToday}
      />

      {/* ── ЕДИНЫЙ СОВРЕМЕННЫЙ TOOLBAR (APPLE / LINEAR STYLE) ── */}
      <div className="bg-white rounded-3xl p-3 sm:p-4 border border-slate-200/90 shadow-xs space-y-3">
        
        {/* Верхний ряд: Переключатель пространств + Вид + Поиск + Действия + Новая сделка */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          {/* Слева: Сегментированный переключатель 3 пространств + Вид (Канбан / Сетка / Список) */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* 3 пространства: В работе / На паузе / Архив */}
            <div className="inline-flex bg-slate-100 p-1 rounded-2xl select-none">
              <button
                onClick={() => {
                  triggerHaptic("light");
                  filters.setWorkView("ACTIVE");
                  filters.setStatusFilter("ALL");
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                  filters.workView === "ACTIVE"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                <span>{t.workViewActive} ({filters.activeLeads.length})</span>
              </button>

              <button
                onClick={() => {
                  triggerHaptic("light");
                  filters.setWorkView("ON_HOLD");
                  filters.setStatusFilter("ALL");
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                  filters.workView === "ON_HOLD"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>{t.workViewOnHold} ({filters.onHoldLeads.length})</span>
              </button>

              <button
                onClick={() => {
                  triggerHaptic("light");
                  filters.setWorkView("ARCHIVE");
                  filters.setStatusFilter("ALL");
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                  filters.workView === "ARCHIVE"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Archive className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>{t.workViewArchive} ({filters.archiveLeads.length})</span>
              </button>
            </div>

            {/* Переключатель вида: Канбан / Сетка / Таблица */}
            <div className="hidden sm:inline-flex bg-slate-100 p-1 rounded-2xl select-none">
              <button
                onClick={() => { triggerHaptic("light"); setViewMode("kanban"); }}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "kanban" ? "bg-white text-slate-900 shadow-2xs font-black" : "text-slate-400 hover:text-slate-700"
                }`}
                title={t.viewKanbanTitle}
              >
                <Columns className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{t.viewKanban}</span>
              </button>
              <button
                onClick={() => { triggerHaptic("light"); setViewMode("cards"); }}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "cards" ? "bg-white text-slate-900 shadow-2xs font-black" : "text-slate-400 hover:text-slate-700"
                }`}
                title={t.viewCardsTitle}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{t.viewCards}</span>
              </button>
              <button
                onClick={() => { triggerHaptic("light"); setViewMode("list"); }}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "list" ? "bg-white text-slate-900 shadow-2xs font-black" : "text-slate-400 hover:text-slate-700"
                }`}
                title={t.viewListTitle}
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{t.viewList}</span>
              </button>
            </div>
          </div>

          {/* В центре: Умный поиск */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={filters.searchTerm}
              onChange={(e) => filters.setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl pl-9 pr-8 py-2 text-xs font-semibold text-slate-900 focus:bg-white focus:border-orange-500 focus:outline-none transition shadow-2xs placeholder:text-slate-400"
            />
            {filters.searchTerm && (
              <button
                type="button"
                onClick={() => { triggerHaptic("light"); filters.setSearchTerm(""); }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Справа: Фильтры + Меню Действия + Кнопка Новая сделка */}
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
                    onClick={() => { triggerHaptic("light"); setManagerFilter("ALL"); setShowManagerMenu(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-bold rounded-xl flex items-center justify-between ${
                      managerFilter === "ALL" ? "bg-slate-100 text-slate-900" : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <span>{t.managerAll}</span>
                    {managerFilter === "ALL" && <Check className="w-3.5 h-3.5 text-orange-600" />}
                  </button>
                  <button
                    onClick={() => { triggerHaptic("light"); setManagerFilter("ELISEY"); setShowManagerMenu(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-bold rounded-xl flex items-center justify-between ${
                      managerFilter === "ELISEY" ? "bg-orange-50 text-orange-700" : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <span>{t.managerElisey}</span>
                    {managerFilter === "ELISEY" && <Check className="w-3.5 h-3.5 text-orange-600" />}
                  </button>
                  <button
                    onClick={() => { triggerHaptic("light"); setManagerFilter("DANIIL"); setShowManagerMenu(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-bold rounded-xl flex items-center justify-between ${
                      managerFilter === "DANIIL" ? "bg-blue-50 text-blue-700" : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <span>{t.managerDaniil}</span>
                    {managerFilter === "DANIIL" && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                  <button
                    onClick={() => { triggerHaptic("light"); setManagerFilter("UNASSIGNED"); setShowManagerMenu(false); }}
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

            {/* Выпадающее меню «Действия» */}
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
                <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 p-1.5 z-40 space-y-1 animate-in fade-in zoom-in-95 duration-100">
                  <button
                    onClick={() => {
                      triggerHaptic("light");
                      setShowActionsMenu(false);
                      setEstimateLead(null);
                      setShowEstimateModal(true);
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
                      setShowCreateClientModal(true);
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
                      setShowBatchImportModal(true);
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
                      setShowExportAudienceModal(true);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-bold rounded-xl hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 flex items-center gap-2 transition"
                  >
                    <Target className="w-4 h-4 text-emerald-500" />
                    <span>{t.actionExportAudience}</span>
                  </button>
                </div>
              )}
            </div>

            {/* ГЛАВНАЯ КНОПКА: Новая сделка */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic("light");
                ops.setShowCreateModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs shadow-sm transition active:scale-95 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{t.newDealBtn}</span>
            </button>

          </div>

        </div>

        {/* Нижний ряд (чипсы статусов и горящих напоминаний, если актуально) */}
        {(filters.timingStats.coldWarnings > 0 || filters.timingStats.appointmentsToday > 0 || filters.statusFilter !== "ALL" || managerFilter !== "ALL") && (
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 flex-wrap text-xs">
            {/* Смарт-чипсы горящих заявок */}
            {filters.timingStats.coldWarnings > 0 && (
              <button
                onClick={() => {
                  triggerHaptic("light");
                  filters.setTimingFilter(filters.timingFilter === "COLD_WARNING" ? "ALL" : "COLD_WARNING");
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black transition cursor-pointer ${
                  filters.timingFilter === "COLD_WARNING"
                    ? "bg-rose-600 text-white shadow-xs"
                    : "bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100"
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>{t.coldWarningBadge} ({filters.timingStats.coldWarnings})</span>
              </button>
            )}

            {filters.timingStats.appointmentsToday > 0 && (
              <button
                onClick={() => {
                  triggerHaptic("light");
                  filters.setTimingFilter(filters.timingFilter === "APPOINTMENTS_TODAY" ? "ALL" : "APPOINTMENTS_TODAY");
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black transition cursor-pointer ${
                  filters.timingFilter === "APPOINTMENTS_TODAY"
                    ? "bg-orange-600 text-white shadow-xs"
                    : "bg-orange-50 border border-orange-200 text-orange-700 hover:bg-orange-100"
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{t.appointmentsTodayBadge} ({filters.timingStats.appointmentsToday})</span>
              </button>
            )}

            {/* Кнопка сброса всех фильтров */}
            {(filters.statusFilter !== "ALL" || filters.timingFilter !== "ALL" || managerFilter !== "ALL" || filters.searchTerm) && (
              <button
                onClick={() => {
                  triggerHaptic("light");
                  filters.setStatusFilter("ALL");
                  filters.setTimingFilter("ALL");
                  setManagerFilter("ALL");
                  filters.setSearchTerm("");
                }}
                className="text-slate-400 hover:text-slate-700 text-xs font-semibold underline underline-offset-2 ml-auto cursor-pointer"
              >
                {t.resetFilters}
              </button>
            )}
          </div>
        )}

      </div>

      {/* ── ОСНОВНОЙ КОНТЕНТ: КАНБАН-ДОСКА, СЕТКА КАРТОЧЕК ИЛИ РЕЕСТР ТАБЛИЦЫ ── */}
      <div className="w-full">
        {finalLeads.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 font-medium shadow-xs">
            {t.emptyStateText}
          </div>
        ) : viewMode === "kanban" ? (
          /* ── РЕЖИМ 1: ИНТЕРАКТИВНАЯ КАНБАН-ДОСКА ПО ЭТАПАМ ── */
          <LeadKanbanBoard
            leads={finalLeads}
            selectedLeadId={detailLead?.id}
            onSelectLead={handleSelectLead}
            onOpenEstimate={handleOpenEstimate}
            onOpenFullCard={handleOpenFullCard}
            onDeleteClick={ops.handleDeleteClick}
            onRestoreLead={ops.handleRestoreLead}
            onStatusChangeQuick={handleStatusChangeQuick}
            onOpenCreateModal={handleOpenCreateModal}
          />
        ) : viewMode === "cards" ? (
          /* ── РЕЖИМ 2: СЕТКА КАРТОЧЕК ── */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-3.5 items-start">
            {finalLeads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                isSelected={detailLead?.id === lead.id}
                onSelect={handleSelectLead}
                onOpenEstimate={handleOpenEstimate}
                onOpenFullCard={handleOpenFullCard}
                onDeleteClick={ops.handleDeleteClick}
                onRestoreLead={ops.handleRestoreLead}
                onStatusChangeQuick={handleStatusChangeQuick}
              />
            ))}
          </div>
        ) : (
          /* ── РЕЖИМ 3: СОВРЕМЕННЫЙ РЕЕСТР (ДАТА-ТАБЛИЦА) ── */
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">{tableDict.colClient}</th>
                    <th className="py-3 px-4">{tableDict.colNote}</th>
                    <th className="py-3 px-4">{tableDict.colStage}</th>
                    <th className="py-3 px-4">{tableDict.colManager}</th>
                    <th className="py-3 px-4">{tableDict.colAmount}</th>
                    <th className="py-3 px-4 text-right">{tableDict.colActions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {finalLeads.map((lead) => {
                    const status = STATUS_MAP[lead.status] || { label: lead.status, color: "text-slate-600", bg: "bg-slate-100" };
                    const amount = lead.offeredPrice || lead.revenue || 0;
                    const cleanPhone = (lead.phone || "").replace(/[^0-9+]/g, "");

                    return (
                      <tr
                        key={lead.id}
                        style={{ contentVisibility: "auto", containIntrinsicSize: "44px" }}
                        onClick={() => {
                          triggerHaptic("light");
                          handleSelectLead(lead);
                        }}
                        className={`hover:bg-slate-50/80 cursor-pointer transition ${
                          detailLead?.id === lead.id ? "bg-orange-50/40" : ""
                        }`}
                      >
                        <td className="py-3 px-4">
                          <span className="font-extrabold text-slate-900 block truncate max-w-xs">{lead.name || tableDict.noName}</span>
                          <span className="text-[10px] text-slate-400 font-medium">{lead.phone || "—"}</span>
                        </td>
                        <td className="py-3 px-4 max-w-[200px] truncate text-slate-500 font-medium">
                          {lead.comment || "—"}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${status.color} ${status.bg}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-slate-600 font-bold">
                          {lead.manager === "ELISEY" ? t.managerElisey : lead.manager === "DANIIL" ? t.managerDaniil : "—"}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap font-black text-slate-900">
                          {amount > 0 ? `${amount.toLocaleString("ru")} ₸` : "—"}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                            {/* Смета калькулятор */}
                            <a
                              href={`/admin/calculator?leadId=${lead.id}`}
                              className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 flex items-center justify-center transition"
                              title={tableDict.calcTooltip}
                            >
                              <Calculator className="w-3.5 h-3.5" />
                            </a>

                            {/* Копировать телефон */}
                            {cleanPhone && (
                              <button
                                type="button"
                                onClick={(e) => handleCopyPhone(e, lead.phone || "")}
                                className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition cursor-pointer"
                                title={tableDict.copyPhoneTooltip}
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Позвонить */}
                            {cleanPhone && (
                              <a
                                href={`tel:${cleanPhone}`}
                                className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition"
                                title={tableDict.callTooltip}
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                            )}

                            {/* WhatsApp */}
                            <a
                              href={getWhatsAppUrl(lead.phone || "", `Здравствуйте, ${lead.name || tableDict.whatsAppGreeting}!`)}
                              target="_blank"
                              rel="noreferrer"
                              className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition"
                              title={tableDict.whatsAppTooltip}
                            >
                              <WhatsAppIcon className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── ЦЕНТРИРОВАННОЕ APPLE PRO ОКНО КАРТОЧКИ (MODAL QUICKVIEW НА ПК / BOTTOM SHEET НА МОБИЛКЕ) ── */}
      {detailLead && (
        <LeadDetailSheet
          isOpen={Boolean(detailLead)}
          onClose={() => setDetailLead(null)}
          lead={detailLead as any}
          clients={ops.clients}
          companies={initialCompanies}
          onUpdateLead={(updated) => {
            ops.setLeads((prev) =>
              prev.map((l) => (l.id === updated.id ? { ...l, ...updated } : l))
            );
            setDetailLead(updated as any);
          }}
          warehouseItems={initialWarehouseItems}
          supplierPrices={initialSupplierPrices}
          leads={ops.leads}
        />
      )}

      {/* ── МОДАЛЬНЫЕ ОКНА (ДИНАМИЧЕСКИЕ ЧАНКИ) ── */}
      {ops.showFinanceModal && ops.financeLead && (
        <LeadFinanceModal
          lead={ops.financeLead}
          onClose={() => { ops.setShowFinanceModal(false); ops.setFinanceLead(null); }}
          onSubmit={ops.handleFinanceSubmit}
          isFinancing={ops.isFinancing}
        />
      )}

      {ops.showCreateModal && (
        <LeadCreateModal
          isOpen={ops.showCreateModal}
          onClose={() => ops.setShowCreateModal(false)}
          onSubmit={ops.handleCreateLeadSubmit}
          isCreating={ops.isCreatingLead}
        />
      )}

      {ops.showDeleteConfirm && (
        <LeadDeleteConfirmModal
          onClose={() => ops.setShowDeleteConfirm(false)}
          onConfirm={ops.handleDeleteConfirm}
        />
      )}

      {showEstimateModal && (
        <EstimateModal
          isOpen={showEstimateModal}
          onClose={() => { setShowEstimateModal(false); setEstimateLead(null); }}
          leadId={(estimateLead || ops.activeLead)?.id || null}
          leadName={(estimateLead || ops.activeLead)?.name || ""}
          initialItems={((estimateLead || ops.activeLead)?.estimate?.items as any) || []}
          isStockDeducted={(estimateLead || ops.activeLead)?.estimate?.isStockDeducted || false}
          warehouseItems={(initialWarehouseItems as any) || []}
          supplierPrices={(initialSupplierPrices as any) || []}
          leads={ops.leads}
          onSaveSuccess={(revenue, expenses, newEstimate) => {
            if (newEstimate.leadId) {
              ops.setLeads((prev) =>
                prev.map((l) =>
                  l.id === newEstimate.leadId ? { ...l, revenue, expenses, estimate: newEstimate } : l
                )
              );
            }
            setEstimateLead(null);
            router.refresh();
          }}
        />
      )}

      {showCreateClientModal && (
        <CreateClientModal
          isOpen={showCreateClientModal}
          onClose={() => setShowCreateClientModal(false)}
          onSuccess={(client: any) => {
            ops.setClients((prev) => [client, ...prev.filter((c) => c.id !== client.id)]);
            router.refresh();
          }}
        />
      )}

      {showBatchImportModal && (
        <BatchImportClientsModal
          isOpen={showBatchImportModal}
          onClose={() => setShowBatchImportModal(false)}
          onSuccess={() => router.refresh()}
        />
      )}

      {showExportAudienceModal && (
        <ExportAudienceModal
          isOpen={showExportAudienceModal}
          onClose={() => setShowExportAudienceModal(false)}
        />
      )}

    </div>
  );
}
