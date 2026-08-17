"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  X, 
  Maximize2, 
  Minimize2, 
  Plus, 
  Calculator, 
  User, 
  FileSpreadsheet, 
  Target, 
  Zap, 
  Clock, 
  Archive, 
  Flame, 
  CalendarCheck, 
  AlertCircle 
} from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import ClickMatcherWidget from "@/components/admin/ClickMatcherWidget";
import { LEADS_DICTIONARY, STATUS_MAP } from "../_data/leadsDictionary";
import { Lead, Client, Company, WarehouseItem, SupplierPrice } from "../_types/leadTypes";
import { useLeadOperations } from "../_hooks/useLeadOperations";
import { useLeadFilters } from "../_hooks/useLeadFilters";

import LeadCard from "./LeadCard";
import LeadMobileDrawer from "./LeadMobileDrawer";
import LeadCreateModal from "./dashboard/LeadCreateModal";
import LeadFinanceModal from "./dashboard/LeadFinanceModal";
import LeadDeleteConfirmModal from "./dashboard/LeadDeleteConfirmModal";
import EstimateModal from "./EstimateModal";
import { CreateClientModal } from "../../clients/_components/CreateClientModal";
import { BatchImportClientsModal } from "../../clients/_components/BatchImportClientsModal";
import { ExportAudienceModal } from "../../clients/_components/ExportAudienceModal";

interface LeadsDashboardProps {
  initialLeads: Lead[];
  initialClients: Client[];
  initialCompanies?: Company[];
  initialWarehouseItems?: WarehouseItem[];
  initialSupplierPrices?: SupplierPrice[];
  initialPendingClicks?: any[];
  selectedLeadId?: string;
}

export default function LeadsDashboard({
  initialLeads,
  initialClients,
  initialCompanies = [],
  initialWarehouseItems = [],
  initialSupplierPrices = [],
  selectedLeadId,
}: LeadsDashboardProps) {
  const router = useRouter();

  // Хук операций и состояний лидов
  const ops = useLeadOperations({ initialLeads, initialClients, selectedLeadId });

  // Хук фильтрации, поиска и метрик
  const filters = useLeadFilters(ops.leads);

  // Модальные окна сметы и клиентов
  const [showEstimateModal, setShowEstimateModal] = useState(false);
  const [estimateLead, setEstimateLead] = useState<Lead | null>(null);
  const [showCreateClientModal, setShowCreateClientModal] = useState(false);
  const [showBatchImportModal, setShowBatchImportModal] = useState(false);
  const [showExportAudienceModal, setShowExportAudienceModal] = useState(false);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Виджет сопоставления кликов с сайта */}
      <ClickMatcherWidget onMatched={() => router.refresh()} />

      {/* ── ПАНЕЛЬ БЫСТРЫХ ДЕЙСТВИЙ (Десктоп) ── */}
      <div className="hidden md:flex flex-wrap items-center justify-between gap-2.5 pb-1">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => { triggerHaptic("light"); ops.setShowCreateModal(true); }}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs shadow-sm transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Новая сделка / Лид</span>
          </button>

          <button
            onClick={() => { triggerHaptic("light"); setEstimateLead(null); setShowEstimateModal(true); }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 hover:border-orange-500 hover:bg-orange-50/50 text-slate-800 font-extrabold text-xs shadow-2xs transition active:scale-95 cursor-pointer"
          >
            <Calculator className="w-4 h-4 text-orange-600" />
            <span>Создать смету</span>
          </button>

          <button
            onClick={() => { triggerHaptic("light"); setShowCreateClientModal(true); }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-slate-800 font-extrabold text-xs shadow-2xs transition active:scale-95 cursor-pointer"
          >
            <User className="w-4 h-4 text-blue-600" />
            <span>Новый клиент</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => { triggerHaptic("light"); setShowBatchImportModal(true); }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer active:scale-95 shadow-2xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-purple-600" />
            <span>Импорт базы</span>
          </button>

          <button
            onClick={() => { triggerHaptic("light"); setShowExportAudienceModal(true); }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer active:scale-95 shadow-2xs"
          >
            <Target className="w-3.5 h-3.5 text-emerald-600" />
            <span>Аудитории</span>
          </button>
        </div>
      </div>

      {/* ── СЕГМЕНТИРОВАННЫЙ ПЕРЕКЛЮЧАТЕЛЬ 3 ПРОСТРАНСТВ ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="grid grid-cols-3 sm:inline-flex bg-slate-200/80 p-1 rounded-2xl w-full sm:w-auto shadow-2xs select-none gap-1">
          <button
            onClick={() => { triggerHaptic("light"); filters.setWorkView("ACTIVE"); filters.setStatusFilter("ALL"); }}
            className={`flex items-center justify-center gap-1 sm:gap-2 px-2 py-2 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
              filters.workView === "ACTIVE" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
            <span>В фокусе ({filters.activeLeads.length})</span>
          </button>

          <button
            onClick={() => { triggerHaptic("light"); filters.setWorkView("ON_HOLD"); filters.setStatusFilter("ALL"); }}
            className={`flex items-center justify-center gap-1 sm:gap-2 px-2 py-2 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
              filters.workView === "ON_HOLD" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span>На паузе ({filters.onHoldLeads.length})</span>
          </button>

          <button
            onClick={() => { triggerHaptic("light"); filters.setWorkView("ARCHIVE"); filters.setStatusFilter("ALL"); }}
            className={`flex items-center justify-center gap-1 sm:gap-2 px-2 py-2 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
              filters.workView === "ARCHIVE" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Archive className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span>Архив ({filters.archiveLeads.length})</span>
          </button>
        </div>
      </div>

      {/* ── СТРОКА ПОИСКА И ЧИПСЫ СТАТУСОВ ── */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={LEADS_DICTIONARY.searchPlaceholder}
              value={filters.searchTerm}
              onChange={(e) => filters.setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-10 py-2.5 text-xs text-slate-800 font-semibold focus:border-orange-500/50 focus:outline-none transition shadow-2xs placeholder:text-slate-400"
              suppressHydrationWarning
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            {filters.searchTerm && (
              <button
                type="button"
                onClick={() => { triggerHaptic("light"); filters.setSearchTerm(""); }}
                className="absolute right-3 top-2.5 p-0.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => { triggerHaptic("light"); filters.setIsGlobalExpanded(!filters.isGlobalExpanded); }}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-2xl border text-xs font-black transition active:scale-95 cursor-pointer shrink-0 shadow-2xs ${
              filters.isGlobalExpanded ? "bg-slate-900 border-slate-900 text-white" : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
            }`}
          >
            {filters.isGlobalExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{filters.isGlobalExpanded ? "Компактно" : "Подробно"}</span>
          </button>
        </div>

        {/* Чипсы фильтрации активных сделок */}
        {filters.workView === "ACTIVE" && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none select-none scroll-smooth">
            <button
              onClick={() => { triggerHaptic("light"); filters.setStatusFilter("ALL"); filters.setTimingFilter("ALL"); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer shrink-0 active:scale-95 whitespace-nowrap ${
                filters.statusFilter === "ALL" && filters.timingFilter === "ALL"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-2xs"
              }`}
            >
              <span>Все ({filters.activeLeads.length})</span>
            </button>

            {filters.timingStats.coldWarnings > 0 && (
              <button
                onClick={() => { triggerHaptic("light"); filters.setStatusFilter("ALL"); filters.setTimingFilter(filters.timingFilter === "COLD_WARNING" ? "ALL" : "COLD_WARNING"); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer shrink-0 active:scale-95 whitespace-nowrap ${
                  filters.timingFilter === "COLD_WARNING" ? "bg-rose-600 text-white shadow-md shadow-rose-500/20" : "bg-rose-50 border border-rose-200/80 text-rose-700"
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Ждут ответа &gt;2ч ({filters.timingStats.coldWarnings})</span>
              </button>
            )}

            {filters.timingStats.appointmentsToday > 0 && (
              <button
                onClick={() => { triggerHaptic("light"); filters.setStatusFilter("ALL"); filters.setTimingFilter(filters.timingFilter === "APPOINTMENTS_TODAY" ? "ALL" : "APPOINTMENTS_TODAY"); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer shrink-0 active:scale-95 whitespace-nowrap ${
                  filters.timingFilter === "APPOINTMENTS_TODAY" ? "bg-orange-600 text-white shadow-md shadow-orange-500/20" : "bg-orange-50 border border-orange-200/80 text-orange-700"
                }`}
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>Замеры сегодня ({filters.timingStats.appointmentsToday})</span>
              </button>
            )}

            {Object.entries(STATUS_MAP)
              .filter(([key]) => key !== "CANCELLED" && key !== "UNPROCESSED")
              .map(([key, value]) => {
                const count = filters.activeLeads.filter((l) => l.status === key).length;
                const isSelected = filters.statusFilter === key && filters.timingFilter === "ALL";
                return (
                  <button
                    key={key}
                    onClick={() => { triggerHaptic("light"); filters.setTimingFilter("ALL"); filters.setStatusFilter(filters.statusFilter === key ? "ALL" : key); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer shrink-0 active:scale-95 whitespace-nowrap ${
                      isSelected ? "bg-slate-900 text-white shadow-xs" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-2xs"
                    }`}
                  >
                    <span>{value.label} ({count})</span>
                  </button>
                );
              })}
          </div>
        )}
      </div>

      {/* ── ОСНОВНОЙ СПИСОК КАРТОЧЕК ЛИДОВ ── */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="flex-1 w-full space-y-3">
          {filters.filteredLeads.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 font-medium shadow-xs">
              {LEADS_DICTIONARY.noLeadsFound}
            </div>
          ) : (
            filters.filteredLeads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                isSelected={ops.activeLead?.id === lead.id}
                isGloballyExpanded={filters.isGlobalExpanded}
                onSelect={(selected) => ops.setActiveLead(selected)}
                onOpenEstimate={(selected) => { setEstimateLead(selected); setShowEstimateModal(true); }}
                onOpenFullCard={(id) => router.push(`/admin/leads/${id}`)}
                onDeleteClick={ops.handleDeleteClick}
                onRestoreLead={ops.handleRestoreLead}
              />
            ))
          )}
        </div>

        {/* ── САЙДБАР / ШТОРКА ЛИДА ── */}
        <LeadMobileDrawer
          activeLead={ops.activeLead}
          clients={ops.clients}
          companies={initialCompanies}
          editName={ops.editName}
          setEditName={ops.setEditName}
          editPhone={ops.editPhone}
          setEditPhone={ops.setEditPhone}
          editAddress={ops.editAddress}
          setEditAddress={ops.setEditAddress}
          editManager={ops.editManager}
          setEditManager={ops.setEditManager}
          editAppDate={ops.editAppDate}
          setEditAppDate={ops.setEditAppDate}
          editDeadline={ops.editDeadline}
          setEditDeadline={ops.setEditDeadline}
          editOfferedPrice={ops.editOfferedPrice}
          setEditOfferedPrice={ops.setEditOfferedPrice}
          editIsDiscounted={ops.editIsDiscounted}
          setEditIsDiscounted={ops.setEditIsDiscounted}
          editPrepayment={ops.editPrepayment}
          setEditPrepayment={ops.setEditPrepayment}
          editComment={ops.editComment}
          setEditComment={ops.setEditComment}
          isSavingDetails={ops.isSavingDetails}
          onClose={() => ops.setActiveLead(null)}
          onSaveLeadDetails={ops.handleSaveLeadDetails}
          onStatusChange={ops.handleStatusChange}
          onOpenEstimateModal={() => {
            if (ops.activeLead) setEstimateLead(ops.activeLead);
            setShowEstimateModal(true);
          }}
          onOpenFullCard={(id) => router.push(`/admin/leads/${id}`)}
          onLinkLeadToClient={ops.handleLinkLeadToClient}
          onCreateClientFromLead={ops.handleCreateClientFromLead}
          onOpenClientsPage={() => router.push("/admin/clients")}
          onConvertToCompanyAndProject={ops.handleConvertToCompanyAndProject}
        />
      </div>

      {/* ── МОДАЛЬНЫЕ ОКНА ── */}
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
            if (ops.activeLead && ops.activeLead.id === newEstimate.leadId) {
              ops.setActiveLead((prev) =>
                prev ? { ...prev, revenue, expenses, estimate: newEstimate } : null
              );
            }
            setEstimateLead(null);
            router.refresh();
          }}
        />
      )}

      <CreateClientModal
        isOpen={showCreateClientModal}
        onClose={() => setShowCreateClientModal(false)}
        onSuccess={(client) => {
          ops.setClients((prev) => [client, ...prev.filter((c) => c.id !== client.id)]);
          router.refresh();
        }}
      />

      <BatchImportClientsModal
        isOpen={showBatchImportModal}
        onClose={() => setShowBatchImportModal(false)}
        onSuccess={() => router.refresh()}
      />

      <ExportAudienceModal
        isOpen={showExportAudienceModal}
        onClose={() => setShowExportAudienceModal(false)}
      />
    </div>
  );
}
