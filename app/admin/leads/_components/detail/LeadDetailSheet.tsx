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
  clients?: any[];
  companies?: any[];
  isEmbedded?: boolean;
}

export default function LeadDetailSheet({
  isOpen,
  onClose,
  lead,
  onUpdateLead,
  warehouseItems = [],
  supplierPrices = [],
  leads = [],
  clients = [],
  companies = [],
  isEmbedded = false,
}: LeadDetailSheetProps) {
  const [showEstimateModal, setShowEstimateModal] = useState(false);
  const lastLeadRef = React.useRef<LeadFullDetails | null>(lead);

  if (lead) {
    lastLeadRef.current = lead;
  }

  const activeLead = lead || lastLeadRef.current;
  if (!activeLead) return null;

  return (
    <LeadDetailSheetContent
      isOpen={isOpen}
      onClose={onClose}
      lead={activeLead}
      onUpdateLead={onUpdateLead}
      showEstimateModal={showEstimateModal}
      setShowEstimateModal={setShowEstimateModal}
      warehouseItems={warehouseItems}
      supplierPrices={supplierPrices}
      leads={leads}
      clients={clients}
      companies={companies}
      isEmbedded={isEmbedded}
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
  clients,
  companies,
  isEmbedded,
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
  clients: any[];
  companies: any[];
  isEmbedded?: boolean;
}) {
  const state = useLeadDetailState({
    lead,
    onUpdateLead,
    onClose,
    clients,
    companies,
  });

  const content = (
    <div className="flex-1 flex flex-col min-h-0 h-full overflow-hidden select-text">
      {/* 1. Синхронизированная шапка */}
      <LeadDetailHeader
        lead={lead}
        rating={state.rating}
        saveStatus={state.saveStatus}
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
      <div className="flex-1 min-h-0 overflow-y-auto p-3.5 sm:p-5 pb-24 lg:pb-6 overscroll-contain">
        {state.activeTab === "params" && (
          <LeadParametersTab
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
            leadId={lead.id}
            client={state.client}
            clients={clients}
            companies={companies}
            activities={state.activities}
            onAddNote={state.handleAddNote}
            onDeleteActivity={state.handleDeleteActivity}
            isAddingNote={state.isAddingNote}
            onAutoSave={state.autoSaveLead}
            onLinkLeadToClient={state.handleLinkLeadToClient}
            onCreateClientFromLead={state.handleCreateClientFromLead}
            onConvertToCompanyAndProject={state.handleConvertToCompanyAndProject}
          />
        )}

        {state.activeTab === "tech" && (
          <LeadTechSpecTab
            techSpec={state.techSpec}
            setTechSpec={state.setTechSpec}
            onAutoSave={state.autoSaveLead}
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
            setShowEstimateModal(false);
          }}
        />
      )}
    </div>
  );

  // Если это встраиваемый Desktop Inspector Drawer (двухпанельный режим на ПК)
  if (isEmbedded) {
    return (
      <div className="w-full h-full flex flex-col bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-3 duration-200">
        {content}
      </div>
    );
  }

  // Иначе для мобильных — нативная шторка BottomSheet
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-5xl"
      height="h-[92dvh] min-h-[92dvh]"
      maxHeight="max-h-[92dvh]"
      desktopVariant="sheet"
    >
      {content}
    </BottomSheet>
  );
}
