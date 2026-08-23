"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Edit3, Check } from "lucide-react";
import CrmBreadcrumbs from "@/components/ui/CrmBreadcrumbs";
import LeadDetailHeader from "../../_components/detail/LeadDetailHeader";
import LeadDetailTabs from "../../_components/detail/LeadDetailTabs";
import LeadParametersTab from "../../_components/detail/tabs/LeadParametersTab";
import LeadTechSpecTab from "../../_components/detail/tabs/LeadTechSpecTab";
import LeadMediaFilesTab from "../../_components/detail/tabs/LeadMediaFilesTab";
import LeadTimelineTab from "../../_components/detail/tabs/LeadTimelineTab";
import MediaViewerModal from "./MediaViewerModal";
import EstimateModal from "../../_components/EstimateModal";
import { useLeadDetailState } from "../../_components/detail/useLeadDetailState";
import { LeadFullDetails } from "../../_types/leadDetailTypes";
import { triggerHaptic } from "@/lib/haptics";

interface LeadDetailPageProps {
  lead: LeadFullDetails;
  companies?: any[];
  clients?: any[];
  warehouseItems?: any[];
  supplierPrices?: any[];
}

export default function LeadDetailPage({
  lead,
  companies = [],
  clients = [],
  warehouseItems = [],
  supplierPrices = [],
}: LeadDetailPageProps) {
  const router = useRouter();
  const [showEstimateModal, setShowEstimateModal] = useState(false);

  const state = useLeadDetailState({
    lead,
    clients,
    companies,
    onClose: () => router.push("/admin/leads"),
  });

  return (
    <div className="space-y-4 max-w-5xl mx-auto pb-20">
      {/* Breadcrumbs и Назад */}
      <div className="flex items-center justify-between gap-3">
        <CrmBreadcrumbs
          items={[
            { label: "CRM", href: "/admin" },
            { label: "Заявки", href: "/admin/leads" },
            { label: lead.name || "Карточка лида" },
          ]}
        />
        <button
          type="button"
          onClick={() => router.push("/admin/leads")}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>К списку заявок</span>
        </button>
      </div>

      {/* Основная карточка */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {/* 1. Синхронизированная шапка */}
        <LeadDetailHeader
          lead={lead}
          rating={state.rating}
          saveStatus={state.saveStatus}
          onRatingChange={state.handleRatingChange}
          onStatusChange={state.handleStatusChange}
          onOpenEstimate={() => setShowEstimateModal(true)}
          onClose={() => router.push("/admin/leads")}
        />

        {/* 2. Apple Segmented Control табы */}
        <LeadDetailTabs
          activeTab={state.activeTab}
          onChangeTab={state.setActiveTab}
          filesCount={state.files.length}
          activitiesCount={state.activities.length}
        />

        {/* 3. Контент активной вкладки */}
        <div className="p-4 sm:p-6 pb-8">
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
          leads={companies}
          onSaveSuccess={() => router.refresh()}
        />
      )}
    </div>
  );
}
