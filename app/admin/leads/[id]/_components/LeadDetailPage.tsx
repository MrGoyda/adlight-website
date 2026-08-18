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
  warehouseItems?: any[];
  supplierPrices?: any[];
}

export default function LeadDetailPage({
  lead,
  companies = [],
  warehouseItems = [],
  supplierPrices = [],
}: LeadDetailPageProps) {
  const router = useRouter();
  const [showEstimateModal, setShowEstimateModal] = useState(false);

  const state = useLeadDetailState({
    lead,
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
          isEditing={state.isEditing}
          onToggleEditing={() => state.setIsEditing(!state.isEditing)}
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
        <div className="p-4 sm:p-6">
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
        <div className="p-3 sm:px-6 sm:py-4 bg-white/95 backdrop-blur-md border-t border-slate-200/80 sticky bottom-0 z-20 flex items-center justify-between gap-3 shrink-0">
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
                  onClick={() => router.push("/admin/leads")}
                  className="px-4 py-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 font-extrabold text-xs transition cursor-pointer active:scale-95"
                >
                  К заявкам
                </button>

                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic("light");
                    state.setIsEditing(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-extrabold text-xs shadow-sm transition cursor-pointer active:scale-95"
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
                  className="px-4 py-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 font-extrabold text-xs transition cursor-pointer active:scale-95"
                >
                  Отмена
                </button>

                <button
                  type="button"
                  disabled={state.isSaving}
                  onClick={() => state.handleSave()}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs shadow-md shadow-orange-600/20 transition cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{state.isSaving ? "Сохранение..." : "Сохранить изменения"}</span>
                </button>
              </>
            )}
          </div>
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
