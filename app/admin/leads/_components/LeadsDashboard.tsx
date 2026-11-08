"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { triggerHaptic } from "@/lib/haptics";
import { toast } from "@/lib/toast";
import { LeadStatus } from "@prisma/client";
import { Lead } from "../_types/leadTypes";
import { LEADS_DICTIONARY } from "../_data/leadsDictionary";
import { useLeadFilters } from "../_hooks/useLeadFilters";
import { useLeadOperations } from "../_hooks/useLeadOperations";
import { updateLeadStatus } from "../actions";
import ClickMatcherWidget from "@/components/admin/ClickMatcherWidget";
import LeadsPipelineMetrics from "./dashboard/LeadsPipelineMetrics";
import LeadsToolbar from "./toolbar/LeadsToolbar";
import LeadStaleBanner from "./banner/LeadStaleBanner";
import LeadTrashBanner from "./banner/LeadTrashBanner";
import LeadKanbanBoard from "./kanban/LeadKanbanBoard";
import LeadCardsGrid from "./grid/LeadCardsGrid";
import LeadTableView from "./table/LeadTableView";
import { Archive, Trash2, RotateCcw } from "lucide-react";

// ── ДИНАМИЧЕСКИЙ ИМПОРТ ТЯЖЕЛЫХ МОДАЛЬНЫХ ОКОН (CODE SPLITTING / LAZY LOADING) ──
const LeadDetailSheet = dynamic(() => import("./detail/LeadDetailSheet"), { ssr: false });
const LeadCreateModal = dynamic(() => import("./dashboard/LeadCreateModal"), { ssr: false });
const LeadFinanceModal = dynamic(() => import("./dashboard/LeadFinanceModal"), { ssr: false });
const LeadDeleteConfirmModal = dynamic(() => import("./dashboard/LeadDeleteConfirmModal"), { ssr: false });
const LeadRejectionModal = dynamic(() => import("./dashboard/LeadRejectionModal"), { ssr: false });
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
const LeadBulkActionDock = dynamic(() => import("./dashboard/LeadBulkActionDock"), { ssr: false });
const LeadBulkConfirmModal = dynamic(() => import("./dashboard/LeadBulkConfirmModal"), { ssr: false });
const LeadArchiveView = dynamic(() => import("./archive/LeadArchiveView"), { ssr: false });

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

  // Модальные окна
  const [estimateLead, setEstimateLead] = useState<Lead | null>(null);
  const [showEstimateModal, setShowEstimateModal] = useState(false);
  const [showCreateClientModal, setShowCreateClientModal] = useState(false);
  const [showBatchImportModal, setShowBatchImportModal] = useState(false);
  const [showExportAudienceModal, setShowExportAudienceModal] = useState(false);
  const [rejectionLead, setRejectionLead] = useState<{ id: string; name: string; targetStatus: LeadStatus } | null>(null);

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

  // Массовые операции (выбор чекбоксами)
  const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(new Set());
  const [bulkModalConfig, setBulkModalConfig] = useState<{
    isOpen: boolean;
    type: "ARCHIVE" | "TRASH" | "STALE_ALL" | "REACTIVATE";
    count: number;
  } | null>(null);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  // Очистка выделения при смене пространства воронки
  useEffect(() => {
    setSelectedLeadIds(new Set());
  }, [filters.workView, filters.statusFilter, managerFilter]);

  // Мемоизированные стабильные обработчики
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
    if (newStatus === "CANCELLED" || newStatus === "UNPROCESSED") {
      const leadToReject = ops.leads.find((l) => l.id === leadId);
      setRejectionLead({
        id: leadId,
        name: leadToReject?.name || "",
        targetStatus: newStatus,
      });
      return;
    }

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

  // Подтверждение причины отказа
  const handleConfirmRejection = useCallback(async (reason: string | null) => {
    if (!rejectionLead) return;
    const { id, targetStatus } = rejectionLead;
    setRejectionLead(null);
    triggerHaptic("medium");

    ops.setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: targetStatus, rejectionReason: reason } : l))
    );
    setDetailLead((prev) => (prev && prev.id === id ? { ...prev, status: targetStatus, rejectionReason: reason } : prev));

    try {
      const res = await updateLeadStatus(id, targetStatus, reason);
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
  }, [rejectionLead, ops, router, toastDict]);

  // Фильтрация сделок по номеру телефона дубликата
  const handleFilterDuplicatePhone = useCallback((phone: string) => {
    triggerHaptic("light");
    filters.setSearchTerm(phone);
    filters.setWorkView("ACTIVE");
  }, [filters]);

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

  // Обработчики массового выбора
  const handleToggleBatchSelect = useCallback((leadId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    triggerHaptic("light");
    setSelectedLeadIds((prev) => {
      const next = new Set(prev);
      if (next.has(leadId)) {
        next.delete(leadId);
      } else {
        next.add(leadId);
      }
      return next;
    });
  }, []);

  const handleToggleSelectAll = useCallback(() => {
    triggerHaptic("medium");
    setSelectedLeadIds((prev) => {
      if (prev.size === finalLeads.length && finalLeads.length > 0) {
        return new Set();
      } else {
        return new Set(finalLeads.map((l) => l.id));
      }
    });
  }, [finalLeads]);

  const handleClearSelection = useCallback(() => {
    triggerHaptic("light");
    setSelectedLeadIds(new Set());
  }, []);

  const handleOpenBulkArchiveConfirm = useCallback(() => {
    if (selectedLeadIds.size === 0) return;
    setBulkModalConfig({
      isOpen: true,
      type: "ARCHIVE",
      count: selectedLeadIds.size,
    });
  }, [selectedLeadIds]);

  const handleOpenBulkDeleteConfirm = useCallback(() => {
    if (selectedLeadIds.size === 0) return;
    setBulkModalConfig({
      isOpen: true,
      type: "TRASH",
      count: selectedLeadIds.size,
    });
  }, [selectedLeadIds]);

  const handleOpenBulkReactivateConfirm = useCallback(() => {
    if (selectedLeadIds.size === 0) return;
    setBulkModalConfig({
      isOpen: true,
      type: "REACTIVATE",
      count: selectedLeadIds.size,
    });
  }, [selectedLeadIds]);

  const handleOpenArchiveStaleConfirm = useCallback(() => {
    if (filters.timingStats.stale14d === 0) {
      toast.info(LEADS_DICTIONARY.bulkActions.noStaleToArchive);
      return;
    }
    setBulkModalConfig({
      isOpen: true,
      type: "STALE_ALL",
      count: filters.timingStats.stale14d,
    });
  }, [filters.timingStats.stale14d]);

  const handleExecuteBulkConfirm = useCallback(async () => {
    if (!bulkModalConfig) return;
    setIsBulkProcessing(true);
    try {
      if (bulkModalConfig.type === "ARCHIVE") {
        await ops.handleBulkArchive(Array.from(selectedLeadIds));
        setSelectedLeadIds(new Set());
      } else if (bulkModalConfig.type === "TRASH") {
        await ops.handleBulkDelete(Array.from(selectedLeadIds));
        setSelectedLeadIds(new Set());
      } else if (bulkModalConfig.type === "STALE_ALL") {
        await ops.handleArchiveAllStale(14);
        setSelectedLeadIds(new Set());
      } else if (bulkModalConfig.type === "REACTIVATE") {
        await ops.handleBulkReactivate(Array.from(selectedLeadIds));
        setSelectedLeadIds(new Set());
      }
      setBulkModalConfig(null);
    } finally {
      setIsBulkProcessing(false);
    }
  }, [bulkModalConfig, ops, selectedLeadIds]);

  const handleResetAllFilters = useCallback(() => {
    triggerHaptic("light");
    filters.setStatusFilter("ALL");
    filters.setTimingFilter("ALL");
    setManagerFilter("ALL");
    filters.setSearchTerm("");
  }, [filters]);

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

      {/* ── ЕДИНЫЙ TOOLBAR (APPLE / LINEAR STYLE) ── */}
      <LeadsToolbar
        workView={filters.workView}
        onSelectWorkView={(v) => {
          filters.setWorkView(v);
          filters.setStatusFilter("ALL");
        }}
        activeCount={filters.activeLeads.length}
        onHoldCount={filters.onHoldLeads.length}
        archiveCount={filters.archiveLeads.length}
        trashCount={filters.trashLeads.length}
        viewMode={viewMode}
        onSelectViewMode={setViewMode}
        searchTerm={filters.searchTerm}
        onSearchChange={filters.setSearchTerm}
        managerFilter={managerFilter}
        onSelectManagerFilter={setManagerFilter}
        timingFilter={filters.timingFilter}
        onSelectTimingFilter={filters.setTimingFilter}
        statusFilter={filters.statusFilter}
        onResetFilters={handleResetAllFilters}
        timingStats={filters.timingStats}
        onOpenCreateModal={handleOpenCreateModal}
        onOpenEstimateModal={() => {
          setEstimateLead(null);
          setShowEstimateModal(true);
        }}
        onOpenCreateClientModal={() => setShowCreateClientModal(true)}
        onOpenBatchImportModal={() => setShowBatchImportModal(true)}
        onOpenExportAudienceModal={() => setShowExportAudienceModal(true)}
        onArchiveStaleClick={handleOpenArchiveStaleConfirm}
      />

      {/* ── БАННЕР КОРЗИНЫ (ТОЛЬКО В РЕЖИМЕ TRASH) ── */}
      {filters.workView === "TRASH" && (
        <LeadTrashBanner
          trashCount={filters.trashLeads.length}
          onEmptyTrash={ops.handleEmptyTrash}
        />
      )}

      {/* ── БАННЕР ЗАВИСШИХ ЗАЯВОК (ПРИ АКТИВНОМ СМАРТ-ФИЛЬТРЕ STALE_14D) ── */}
      {filters.timingFilter === "STALE_14D" && filters.timingStats.stale14d > 0 && (
        <LeadStaleBanner
          staleCount={filters.timingStats.stale14d}
          onArchiveStale={handleOpenArchiveStaleConfirm}
        />
      )}

      {/* ── ОСНОВНОЙ КОНТЕНТ: ВЫДЕЛЕННЫЙ АРХИВ / КАНБАН / СЕТКА / ТАБЛИЦА ── */}
      <div className="w-full">
        {filters.workView === "ARCHIVE" ? (
          /* ── РЕЖИМ 0: ВЫДЕЛЕННЫЙ АРХИВ СДЕЛОК (ВЫПОЛНЕННЫЕ И ОТКАЗЫ) ── */
          <LeadArchiveView
            leads={finalLeads}
            allArchiveLeads={filters.archiveLeads}
            selectedLeadIds={selectedLeadIds}
            onToggleBatchSelect={handleToggleBatchSelect}
            onToggleSelectAll={handleToggleSelectAll}
            onSelectLead={handleSelectLead}
            onReactivateLead={ops.handleReactivateLead}
            onDeleteClick={ops.handleDeleteClick}
            onCopyPhone={handleCopyPhone}
            onFilterDuplicatePhone={handleFilterDuplicatePhone}
            phoneOccurrences={filters.phoneOccurrences}
            archiveSubTab={filters.archiveSubTab}
            onSelectSubTab={filters.setArchiveSubTab}
            archiveReasonFilter={filters.archiveReasonFilter}
            onSelectReasonFilter={filters.setArchiveReasonFilter}
            archiveStats={filters.archiveStats}
          />
        ) : finalLeads.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 font-medium shadow-xs">
            {filters.workView === "TRASH" ? LEADS_DICTIONARY.trash.emptyState : LEADS_DICTIONARY.toolbar.emptyStateText}
          </div>
        ) : viewMode === "kanban" ? (
          /* ── РЕЖИМ 1: ИНТЕРАКТИВНАЯ КАНБАН-ДОСКА ПО ЭТАПАМ ── */
          <LeadKanbanBoard
            leads={finalLeads}
            selectedLeadId={detailLead?.id}
            phoneOccurrences={filters.phoneOccurrences}
            onFilterDuplicatePhone={handleFilterDuplicatePhone}
            onSelectLead={handleSelectLead}
            onOpenEstimate={handleOpenEstimate}
            onOpenFullCard={handleOpenFullCard}
            onDeleteClick={ops.handleDeleteClick}
            onRestoreLead={ops.handleRestoreLead}
            onRestoreFromTrash={ops.handleRestoreFromTrash}
            onStatusChangeQuick={handleStatusChangeQuick}
            onOpenCreateModal={handleOpenCreateModal}
            selectedLeadIds={selectedLeadIds}
            onToggleBatchSelect={handleToggleBatchSelect}
          />
        ) : viewMode === "cards" ? (
          /* ── РЕЖИМ 2: СЕТКА КАРТОЧЕК ── */
          <LeadCardsGrid
            leads={finalLeads}
            selectedLeadId={detailLead?.id}
            selectedLeadIds={selectedLeadIds}
            phoneOccurrences={filters.phoneOccurrences}
            onFilterDuplicatePhone={handleFilterDuplicatePhone}
            onSelectLead={handleSelectLead}
            onOpenEstimate={handleOpenEstimate}
            onOpenFullCard={handleOpenFullCard}
            onDeleteClick={ops.handleDeleteClick}
            onRestoreLead={ops.handleRestoreLead}
            onRestoreFromTrash={ops.handleRestoreFromTrash}
            onStatusChangeQuick={handleStatusChangeQuick}
            onToggleBatchSelect={handleToggleBatchSelect}
          />
        ) : (
          /* ── РЕЖИМ 3: СОВРЕМЕННЫЙ РЕЕСТР (ДАТА-ТАБЛИЦА) ── */
          <LeadTableView
            leads={finalLeads}
            selectedLeadIds={selectedLeadIds}
            detailLeadId={detailLead?.id}
            phoneOccurrences={filters.phoneOccurrences}
            onSelectLead={handleSelectLead}
            onToggleBatchSelect={handleToggleBatchSelect}
            onToggleSelectAll={handleToggleSelectAll}
            onFilterDuplicatePhone={handleFilterDuplicatePhone}
            onCopyPhone={handleCopyPhone}
            onDeleteClick={ops.handleDeleteClick}
            onRestoreFromTrash={ops.handleRestoreFromTrash}
          />
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
          isPermanent={ops.isPermanentDelete}
        />
      )}

      {rejectionLead && (
        <LeadRejectionModal
          isOpen={Boolean(rejectionLead)}
          leadName={rejectionLead.name}
          onClose={() => setRejectionLead(null)}
          onConfirm={handleConfirmRejection}
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

      {/* ── ПЛАВАЮЩИЙ BOTTOM ACTION DOCK ДЛЯ МАССОВЫХ ДЕЙСТВИЙ (APPLE / LINEAR STYLE) ── */}
      <LeadBulkActionDock
        selectedCount={selectedLeadIds.size}
        totalFilteredCount={finalLeads.length}
        isAllSelected={selectedLeadIds.size === finalLeads.length && finalLeads.length > 0}
        onToggleSelectAll={handleToggleSelectAll}
        onBulkArchive={handleOpenBulkArchiveConfirm}
        onBulkDelete={handleOpenBulkDeleteConfirm}
        onClearSelection={handleClearSelection}
        isProcessing={isBulkProcessing}
        isArchiveMode={filters.workView === "ARCHIVE"}
        onBulkReactivate={handleOpenBulkReactivateConfirm}
      />

      {/* ── ДИАЛОГ ПОДТВЕРЖДЕНИЯ МАССОВЫХ ДЕЙСТВИЙ ── */}
      {bulkModalConfig && (
        <LeadBulkConfirmModal
          isOpen={bulkModalConfig.isOpen}
          title={
            bulkModalConfig.type === "STALE_ALL"
              ? LEADS_DICTIONARY.bulkActions.archiveStaleTitle
              : bulkModalConfig.type === "REACTIVATE"
              ? LEADS_DICTIONARY.archive.bulkReactivateBtn
              : bulkModalConfig.type === "ARCHIVE"
              ? LEADS_DICTIONARY.bulkActions.archiveBtn
              : LEADS_DICTIONARY.bulkActions.trashBtn
          }
          description={
            bulkModalConfig.type === "STALE_ALL"
              ? LEADS_DICTIONARY.bulkActions.archiveStaleConfirm(bulkModalConfig.count)
              : bulkModalConfig.type === "REACTIVATE"
              ? LEADS_DICTIONARY.archive.bulkReactivateConfirm(bulkModalConfig.count)
              : bulkModalConfig.type === "ARCHIVE"
              ? LEADS_DICTIONARY.bulkActions.bulkArchiveConfirm(bulkModalConfig.count)
              : LEADS_DICTIONARY.bulkActions.bulkTrashConfirm(bulkModalConfig.count)
          }
          count={bulkModalConfig.count}
          confirmBtnText={
            bulkModalConfig.type === "STALE_ALL" || bulkModalConfig.type === "ARCHIVE"
              ? LEADS_DICTIONARY.bulkActions.archiveBtn
              : bulkModalConfig.type === "REACTIVATE"
              ? LEADS_DICTIONARY.archive.bulkReactivateBtn
              : LEADS_DICTIONARY.bulkActions.trashBtn
          }
          confirmBtnVariant={
            bulkModalConfig.type === "TRASH"
              ? "danger"
              : bulkModalConfig.type === "REACTIVATE"
              ? "primary"
              : "warning"
          }
          icon={
            bulkModalConfig.type === "TRASH" ? (
              <Trash2 className="w-5 h-5 text-rose-600" />
            ) : bulkModalConfig.type === "REACTIVATE" ? (
              <RotateCcw className="w-5 h-5 text-orange-600" />
            ) : (
              <Archive className="w-5 h-5 text-amber-600" />
            )
          }
          onClose={() => setBulkModalConfig(null)}
          onConfirm={handleExecuteBulkConfirm}
          isProcessing={isBulkProcessing}
        />
      )}

    </div>
  );
}
