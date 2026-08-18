"use client";

import React, { useState } from "react";
import BottomSheet from "@/components/ui/BottomSheet";
import LeadDetailHeader from "./LeadDetailHeader";
import LeadDetailTabs from "./LeadDetailTabs";
import LeadParametersTab from "./tabs/LeadParametersTab";
import LeadTechSpecTab from "./tabs/LeadTechSpecTab";
import LeadMediaFilesTab from "./tabs/LeadMediaFilesTab";
import LeadTimelineTab from "./tabs/LeadTimelineTab";
import MediaViewerModal from "../../[id]/_components/MediaViewerModal";
import EstimateModal from "../EstimateModal";
import { useLeadDetailState } from "./useLeadDetailState";
import { LeadFullDetails } from "../../_types/leadDetailTypes";
import { triggerHaptic } from "@/lib/haptics";
import { Save, Edit3, X, Check } from "lucide-react";

interface LeadDetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  lead: LeadFullDetails | null;
  onUpdateLead?: (updated: LeadFullDetails) => void;
  warehouseItems?: any[];
  supplierPrices?: any[];
  leads?: any[];
}

export default function LeadDetailSheet({
  isOpen,
  onClose,
  lead,
  onUpdateLead,
  warehouseItems = [],
  supplierPrices = [],
  leads = [],
}: LeadDetailSheetProps) {
  const [showEstimateModal, setShowEstimateModal] = useState(false);

  // Если лид не передан, не рендерим
  if (!lead) return null;

  return (
    <LeadDetailSheetContent
      isOpen={isOpen}
      onClose={onClose}
      lead={lead}
      onUpdateLead={onUpdateLead}
      showEstimateModal={showEstimateModal}
      setShowEstimateModal={setShowEstimateModal}
      warehouseItems={warehouseItems}
      supplierPrices={supplierPrices}
      leads={leads}
    />
  );
}

function LeadDetailSheetContent({
  isOpen,
  onClose,
  lead,
  onUpdateLead,
  showEstimateModal,
  setShowEstimateModal,
  warehouseItems,
  supplierPrices,
  leads,
}: {
  isOpen: boolean;
  onClose: () => void;
  lead: LeadFullDetails;
  onUpdateLead?: (updated: LeadFullDetails) => void;
  showEstimateModal: boolean;
  setShowEstimateModal: (val: boolean) => void;
  warehouseItems: any[];
  supplierPrices: any[];
  leads: any[];
}) {
  const state = useLeadDetailState({ lead, onUpdateLead, onClose });

  return (
    <>
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        maxWidth="max-w-5xl"
        maxHeight="max-h-[92dvh]"
      >
        {/* 1. Синхронизированная шапка */}
        <LeadDetailHeader
          lead={lead}
          rating={state.rating}
          isEditing={state.isEditing}
          onToggleEditing={() => state.setIsEditing(!state.isEditing)}
          onRatingChange={state.handleRatingChange}
          onStatusChange={state.handleStatusChange}
          onOpenEstimate={() => setShowEstimateModal(true)}
          onClose={onClose}
        />

        {/* 2. Apple Segmented Control табы */}
        <LeadDetailTabs
          activeTab={state.activeTab}
          onChangeTab={state.setActiveTab}
          filesCount={state.files.length}
          activitiesCount={state.activities.length}
        />

        {/* 3. Контент активной вкладки */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 pb-24 overscroll-contain">
          {state.activeTab === "params" && (
            <LeadParametersTab
              isEditing={state.isEditing}
              name={state.name}
              setName={state.setName}
              phone={state.phone}
              setPhone={state.setPhone}
              address={state.address}
              setAddress={state.setAddress}
              appDate={state.appDate}
              setAppDate={state.setAppDate}
              deadline={state.deadline}
              setDeadline={state.setDeadline}
              manager={state.manager}
              setManager={state.setManager}
              offeredPrice={state.offeredPrice}
              setOfferedPrice={state.setOfferedPrice}
              isDiscounted={state.isDiscounted}
              setIsDiscounted={state.setIsDiscounted}
              prepayment={state.prepayment}
              setPrepayment={state.setPrepayment}
              isPrepaymentPaid={state.isPrepaymentPaid}
              setIsPrepaymentPaid={state.setIsPrepaymentPaid}
              isBalancePaid={state.isBalancePaid}
              setIsBalancePaid={state.setIsBalancePaid}
              comment={state.comment}
              setComment={state.setComment}
              status={state.status}
              cancellationReason={state.cancellationReason}
              setCancellationReason={state.setCancellationReason}
              initialMessage={lead.message}
              source={lead.source}
            />
          )}

          {state.activeTab === "tech" && (
            <LeadTechSpecTab
              isEditing={state.isEditing}
              techSpec={state.techSpec}
              setTechSpec={state.setTechSpec}
            />
          )}

          {state.activeTab === "files" && (
            <LeadMediaFilesTab
              files={state.files}
              onUploadFiles={state.handleUploadFiles}
              onDeleteFile={state.handleDeleteFile}
              onOpenFile={(f) => state.setViewerFile(f)}
              isUploading={state.isUploading}
            />
          )}

          {state.activeTab === "timeline" && (
            <LeadTimelineTab
              checklist={state.checklist}
              onToggleChecklistItem={state.handleToggleChecklistItem}
              activities={state.activities}
              onAddNote={state.handleAddNote}
              onDeleteActivity={state.handleDeleteActivity}
              isAddingNote={state.isAddingNote}
            />
          )}
        </div>

        {/* 4. Фиксированный футер сохранения / редактирования */}
        <div className="p-3 sm:px-6 sm:py-3.5 bg-white/95 backdrop-blur-md border-t border-slate-200/80 sticky bottom-0 z-30 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs font-black text-slate-700 truncate">
            {state.offeredPrice ? (
              <span>
                Озвучено:{" "}
                <b className="text-slate-900 font-extrabold">
                  {Number(state.offeredPrice).toLocaleString()} ₸
                </b>
                {state.isDiscounted && <span className="text-orange-600 ml-1">(со скидкой)</span>}
              </span>
            ) : (
              <span className="text-slate-400">Стоимость не озвучена</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!state.isEditing ? (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 font-extrabold text-xs transition cursor-pointer active:scale-95"
                >
                  Закрыть
                </button>

                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic("light");
                    state.setIsEditing(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-extrabold text-xs shadow-sm transition cursor-pointer active:scale-95"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-300" />
                  <span>Редактировать</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic("light");
                    state.setIsEditing(false);
                  }}
                  className="px-3.5 py-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 font-extrabold text-xs transition cursor-pointer active:scale-95"
                >
                  Отмена
                </button>

                <button
                  type="button"
                  disabled={state.isSaving}
                  onClick={() => state.handleSave()}
                  className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs shadow-md shadow-orange-600/20 transition cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{state.isSaving ? "Сохранение..." : "Сохранить"}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </BottomSheet>

      {/* Модалка просмотра файлов / медиа */}
      {state.viewerFile && (
        <MediaViewerModal
          isOpen={Boolean(state.viewerFile)}
          onClose={() => state.setViewerFile(null)}
          files={state.files as any}
          initialFileId={state.viewerFile.id}
        />
      )}

      {/* Модалка калькулятора сметы */}
      {showEstimateModal && (
        <EstimateModal
          isOpen={showEstimateModal}
          onClose={() => setShowEstimateModal(false)}
          leadId={lead.id}
          leadName={lead.name}
          initialItems={((lead.estimate?.items as any) || [])}
          isStockDeducted={lead.estimate?.isStockDeducted || false}
          warehouseItems={warehouseItems}
          supplierPrices={supplierPrices}
          leads={leads}
          onSaveSuccess={(revenue, expenses, newEstimate) => {
            if (onUpdateLead) {
              onUpdateLead({
                ...lead,
                revenue,
                expenses,
                estimate: newEstimate,
              });
            }
          }}
        />
      )}
    </>
  );
}
