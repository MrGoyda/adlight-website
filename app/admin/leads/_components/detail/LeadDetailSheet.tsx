"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import BottomSheet from "@/components/ui/BottomSheet";
import LeadDetailHeader from "./LeadDetailHeader";
import LeadDetailTabs from "./LeadDetailTabs";
import LeadParametersTab from "./tabs/LeadParametersTab";
import LeadTechSpecTab from "./tabs/LeadTechSpecTab";
import LeadMediaFilesTab from "./tabs/LeadMediaFilesTab";
import LeadTimelineTab from "./tabs/LeadTimelineTab";
import MediaViewerModal from "../../[id]/_components/MediaViewerModal";
import EstimateModal from "../EstimateModal";
import DrawerCompanyConvertModal from "../drawer/DrawerCompanyConvertModal";
import InitialMessageAccordion from "@/components/admin/InitialMessageAccordion";
import PhoneInput from "@/components/ui/PhoneInput";
import { useLeadDetailState } from "./useLeadDetailState";
import { LeadFullDetails } from "../../_types/leadDetailTypes";
import { triggerHaptic } from "@/lib/haptics";
import { 
  UserCheck, 
  MapPin, 
  DollarSign, 
  Check, 
  Calculator, 
  Calendar, 
  Clock, 
  Briefcase, 
  AlertCircle, 
  Layers, 
  Sparkles, 
  MessageSquare,
  ExternalLink
} from "lucide-react";

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
}: LeadDetailSheetProps) {
  const [showEstimateModal, setShowEstimateModal] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [cachedLead, setCachedLead] = useState<LeadFullDetails | null>(lead);

  if (lead && lead !== cachedLead) {
    setCachedLead(lead);
  }

  const activeLead = lead || cachedLead;
  if (!activeLead) return null;

  return (
    <LeadDetailSheetContent
      isOpen={isOpen}
      onClose={onClose}
      lead={activeLead}
      onUpdateLead={onUpdateLead}
      showEstimateModal={showEstimateModal}
      setShowEstimateModal={setShowEstimateModal}
      showConvertModal={showConvertModal}
      setShowConvertModal={setShowConvertModal}
      warehouseItems={warehouseItems}
      supplierPrices={supplierPrices}
      leads={leads}
      clients={clients}
      companies={companies}
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
  showConvertModal,
  setShowConvertModal,
  warehouseItems,
  supplierPrices,
  leads,
  clients,
  companies,
}: {
  isOpen: boolean;
  onClose: () => void;
  lead: LeadFullDetails;
  onUpdateLead?: (updated: LeadFullDetails) => void;
  showEstimateModal: boolean;
  setShowEstimateModal: (val: boolean) => void;
  showConvertModal: boolean;
  setShowConvertModal: (val: boolean) => void;
  warehouseItems: any[];
  supplierPrices: any[];
  leads: any[];
  clients: any[];
  companies: any[];
}) {
  const router = useRouter();

  const state = useLeadDetailState({
    lead,
    onUpdateLead,
    onClose,
    clients,
    companies,
  });

  const parsedRevenue = parseFloat(state.offeredPrice) || 0;
  const parsedPrepayment = parseFloat(state.prepayment) || 0;
  const balanceRemaining = Math.max(0, parsedRevenue - (state.isPrepaymentPaid ? parsedPrepayment : 0));

  // Определение процента оплаты
  let paymentPercentage = 0;
  let paymentStatusLabel = "Ожидает предоплаты";
  let paymentStatusColor = "text-slate-400 bg-slate-100 border-slate-200";
  let progressColor = "bg-slate-300";

  if (state.isBalancePaid) {
    paymentPercentage = 100;
    paymentStatusLabel = "Оплачено 100%";
    paymentStatusColor = "text-emerald-700 bg-emerald-50 border-emerald-200";
    progressColor = "bg-emerald-500";
  } else if (state.isPrepaymentPaid) {
    paymentPercentage = parsedRevenue > 0 ? Math.round((parsedPrepayment / parsedRevenue) * 100) || 50 : 50;
    paymentStatusLabel = `Аванс ${paymentPercentage}% внесен`;
    paymentStatusColor = "text-teal-700 bg-teal-50 border-teal-200";
    progressColor = "bg-teal-500";
  }

  return (
    <>
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        maxWidth="max-w-7xl"
        desktopWidth="lg:w-[94vw] lg:max-w-6xl xl:max-w-7xl"
        maxHeight="max-h-[92dvh]"
        height="h-auto min-h-[500px]"
        desktopVariant="modal"
      >
        <div className="flex-1 flex flex-col min-h-0 h-full overflow-hidden select-text">
          
          {/* 1. Верхняя панель со статусом, рейтингом и кнопками звонка / WhatsApp / Сметы */}
          <LeadDetailHeader
            lead={lead}
            rating={state.rating}
            saveStatus={state.saveStatus}
            onRatingChange={state.handleRatingChange}
            onStatusChange={state.handleStatusChange}
            onOpenEstimate={() => setShowEstimateModal(true)}
            onClose={onClose}
          />

          {/* ─────────────────────────────────────────────────────────────
              МОБИЛЬНЫЙ ВИД (< lg): ТАБЫ (PARAMS / TECH / FILES / TIMELINE)
             ───────────────────────────────────────────────────────────── */}
          <div className="lg:hidden flex-1 flex flex-col min-h-0 overflow-hidden">
            <LeadDetailTabs
              activeTab={state.activeTab}
              onChangeTab={state.setActiveTab}
              filesCount={state.files.length}
              activitiesCount={state.activities.length}
            />

            <div className="flex-1 min-h-0 overflow-y-auto p-4 pb-20 overscroll-contain">
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

          {/* ─────────────────────────────────────────────────────────────
              ДЕСКТОПНЫЙ ВИД (>= lg): ДВУХКОЛОНОЧНЫЙ PRO-ИНСПЕКТОР (65% / 35%)
             ───────────────────────────────────────────────────────────── */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-6 p-6 overflow-y-auto bg-slate-50/50 flex-1 min-h-0 overscroll-contain">
            
            {/* ── ЛЕВАЯ КОЛОНКА (65%, col-span-8): РАБОЧАЯ ОБЛАСТЬ ── */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* БЛОК 1: ЗАКАЗЧИК И КОНТАКТНЫЕ ДАННЫЕ */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-blue-500" />
                    Заказчик и Объект монтажа
                  </span>
                  
                  {lead.source && (
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold">
                      Источник: {lead.source}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Имя клиента */}
                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
                      Имя клиента / Контактное лицо *
                    </label>
                    <input
                      type="text"
                      value={state.name}
                      onChange={(e) => state.setName(e.target.value)}
                      onBlur={() => state.autoSaveLead({ name: state.name })}
                      placeholder="Например: Аслан"
                      className="w-full bg-slate-50/70 border border-slate-200/80 rounded-2xl py-2.5 px-3.5 text-sm font-bold text-slate-900 focus:bg-white focus:border-orange-500 focus:outline-none transition"
                    />
                  </div>

                  {/* Телефон */}
                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
                      Номер телефона *
                    </label>
                    <PhoneInput
                      value={state.phone}
                      onChange={(val) => state.setPhone(val)}
                      onBlur={() => state.autoSaveLead({ phone: state.phone })}
                      placeholder="+7 (701) 000-00-00"
                    />
                  </div>
                </div>

                {/* Адрес монтажа */}
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    Адрес монтажа / Объект
                  </label>
                  <input
                    type="text"
                    value={state.address}
                    onChange={(e) => state.setAddress(e.target.value)}
                    onBlur={() => state.autoSaveLead({ address: state.address })}
                    placeholder="г. Алматы, пр. Достык, 180, ТЦ 'Dostyk Plaza'..."
                    className="w-full bg-slate-50/70 border border-slate-200/80 rounded-2xl py-2.5 px-3.5 text-xs font-semibold text-slate-900 focus:bg-white focus:border-orange-500 focus:outline-none transition"
                  />
                </div>

                {/* Связка с профилем клиента в CRM */}
                <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-200/70 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                      Профиль в базе клиентов CRM
                    </span>
                    {state.client ? (
                      <div className="flex items-center gap-2 mt-0.5">
                        <a
                          href={`/admin/clients?search=${encodeURIComponent(state.client.phone || state.client.name)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-extrabold text-slate-900 hover:text-orange-600 transition flex items-center gap-1"
                        >
                          <span>{state.client.name}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </a>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                          Привязан
                        </span>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Сделка не связана с постоянной карточкой клиента
                      </p>
                    )}
                  </div>

                  {!state.client && (
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic("light");
                        state.handleCreateClientFromLead();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs shadow-2xs transition active:scale-95 shrink-0"
                    >
                      + В базу клиентов
                    </button>
                  )}
                </div>

                {/* Исходное сообщение с сайта */}
                {lead.message && (
                  <InitialMessageAccordion 
                    message={lead.message} 
                    source={lead.source}
                  />
                )}
              </div>

              {/* БЛОК 2: ТЕХСПЕЦИФИКАЦИЯ ВЫВЕСКИ */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-orange-500" />
                    Конструкция и Техспецификация вывески
                  </span>
                </div>

                <LeadTechSpecTab
                  techSpec={state.techSpec}
                  setTechSpec={state.setTechSpec}
                  onAutoSave={state.autoSaveLead}
                />
              </div>

              {/* БЛОК 3: ЭСКИЗЫ И ФОТОГРАФИИ */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    Эскизы, Рендеры и Фотографии объекта
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-black">
                      {state.files.length}
                    </span>
                  </span>
                </div>

                <LeadMediaFilesTab
                  files={state.files}
                  onUploadFiles={state.handleUploadFiles}
                  onDeleteFile={state.handleDeleteFile}
                  onOpenFile={(f) => state.setViewerFile(f)}
                  isUploading={state.isUploading}
                />
              </div>

              {/* БЛОК 4: ЗАМЕТКИ И ТАЙМЛАЙН */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-teal-500" />
                    Чек-лист, Заметки и Таймлайн сделки
                  </span>
                </div>

                <LeadTimelineTab
                  checklist={state.checklist}
                  onToggleChecklistItem={state.handleToggleChecklistItem}
                  activities={state.activities}
                  onAddNote={state.handleAddNote}
                  onDeleteActivity={state.handleDeleteActivity}
                  isAddingNote={state.isAddingNote}
                />
              </div>

            </div>

            {/* ── ПРАВАЯ КОЛОНКА (35%, col-span-4): STICKY INSPECTOR ── */}
            <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-2 self-start">
              
              {/* КАРТОЧКА 1: ФИНАНСЫ И ОПЛАТА */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    Финансы и Оплата
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${paymentStatusColor}`}>
                    {paymentStatusLabel}
                  </span>
                </div>

                {/* Прогресс-бар оплаты */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-extrabold">
                    <span className="text-slate-600">Оплачено:</span>
                    <span className="text-slate-900">{paymentPercentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 rounded-full ${progressColor}`}
                      style={{ width: `${paymentPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Сумма договора */}
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
                    Сумма сделки (Выручка, ₸)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={state.offeredPrice}
                      onChange={(e) => state.setOfferedPrice(e.target.value)}
                      onBlur={() => state.autoSaveLead({ offeredPrice: parseFloat(state.offeredPrice) || 0 })}
                      placeholder="0"
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl py-2.5 px-3.5 text-base font-black text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none transition"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₸</span>
                  </div>
                </div>

                {/* Аванс и Остаток */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                      Аванс (₸)
                    </label>
                    <input
                      type="number"
                      value={state.prepayment}
                      onChange={(e) => state.setPrepayment(e.target.value)}
                      onBlur={() => state.autoSaveLead({ prepayment: parseFloat(state.prepayment) || 0 })}
                      placeholder="0"
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-2 px-3 text-xs font-bold text-slate-900 focus:bg-white focus:border-slate-400 focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                      Остаток к доплате
                    </label>
                    <div className="w-full bg-slate-100/70 border border-slate-200/60 rounded-xl py-2 px-3 text-xs font-black text-slate-700">
                      {balanceRemaining.toLocaleString("ru")} ₸
                    </div>
                  </div>
                </div>

                {/* Переключатели оплаты */}
                <div className="space-y-2 pt-1 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic("medium");
                      const next = !state.isPrepaymentPaid;
                      state.setIsPrepaymentPaid(next);
                      state.autoSaveLead({ isPrepaymentPaid: next });
                    }}
                    className={`w-full py-2.5 px-3.5 rounded-2xl border text-xs font-extrabold flex items-center justify-between transition cursor-pointer active:scale-95 ${
                      state.isPrepaymentPaid 
                        ? "bg-teal-50 border-teal-300 text-teal-800 shadow-2xs" 
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Check className={`w-4 h-4 ${state.isPrepaymentPaid ? "text-teal-600 stroke-[3]" : "text-slate-300"}`} />
                      <span>Аванс внесен в кассу</span>
                    </span>
                    <span className="text-[10px] uppercase font-black">{state.isPrepaymentPaid ? "ДА" : "НЕТ"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic("medium");
                      const next = !state.isBalancePaid;
                      state.setIsBalancePaid(next);
                      state.autoSaveLead({ isBalancePaid: next });
                    }}
                    className={`w-full py-2.5 px-3.5 rounded-2xl border text-xs font-extrabold flex items-center justify-between transition cursor-pointer active:scale-95 ${
                      state.isBalancePaid 
                        ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-2xs" 
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Check className={`w-4 h-4 ${state.isBalancePaid ? "text-emerald-600 stroke-[3]" : "text-slate-300"}`} />
                      <span>Остаток оплачен (100%)</span>
                    </span>
                    <span className="text-[10px] uppercase font-black">{state.isBalancePaid ? "ДА" : "НЕТ"}</span>
                  </button>
                </div>

                {/* Кнопка расчета сметы */}
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic("light");
                    setShowEstimateModal(true);
                  }}
                  className="w-full py-2.5 px-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-sm transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Calculator className="w-4 h-4" />
                  <span>Рассчитать смету и маржу</span>
                </button>
              </div>

              {/* КАРТОЧКА 2: СРОКИ И ОТВЕТСТВЕННЫЙ */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    Сроки и Менеджер
                  </span>
                </div>

                {/* Сегментированный переключатель партнера */}
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">
                    Ответственный менеджер
                  </label>
                  <div className="flex gap-1.5 bg-slate-100 p-1 rounded-2xl">
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic("light");
                        state.setManager("ELISEY");
                        state.autoSaveLead({ manager: "ELISEY" });
                      }}
                      className={`flex-1 py-1.5 text-xs font-extrabold rounded-xl transition ${
                        state.manager === "ELISEY" 
                          ? "bg-white text-orange-600 shadow-xs" 
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Елисей (Я)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic("light");
                        state.setManager("DANIIL");
                        state.autoSaveLead({ manager: "DANIIL" });
                      }}
                      className={`flex-1 py-1.5 text-xs font-extrabold rounded-xl transition ${
                        state.manager === "DANIIL" 
                          ? "bg-white text-blue-600 shadow-xs" 
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Даниил
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic("light");
                        state.setManager("");
                        state.autoSaveLead({ manager: null });
                      }}
                      className={`px-2 py-1.5 text-[10px] font-bold rounded-xl transition ${
                        !state.manager 
                          ? "bg-white text-slate-800 shadow-xs" 
                          : "text-slate-400 hover:text-slate-700"
                      }`}
                      title="Без ответственного"
                    >
                      —
                    </button>
                  </div>
                </div>

                {/* Дата замера / визита */}
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Дата замера / встречи
                  </label>
                  <input
                    type="datetime-local"
                    value={state.appDate}
                    onChange={(e) => state.setAppDate(e.target.value)}
                    onBlur={() => state.autoSaveLead({ appointmentDate: state.appDate ? new Date(state.appDate) : null })}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-2 px-3 text-xs font-semibold text-slate-900 focus:bg-white focus:border-slate-400 focus:outline-none transition"
                  />
                </div>

                {/* Дедлайн сдачи */}
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Дедлайн монтажа
                  </label>
                  <input
                    type="date"
                    value={state.deadline}
                    onChange={(e) => state.setDeadline(e.target.value)}
                    onBlur={() => state.autoSaveLead({ deadline: state.deadline ? new Date(state.deadline) : null })}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-2 px-3 text-xs font-semibold text-slate-900 focus:bg-white focus:border-slate-400 focus:outline-none transition"
                  />
                </div>
              </div>

              {/* КАРТОЧКА 3: ПРОИЗВОДСТВЕННЫЙ ЭТАП (ЦЕХ) */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-orange-500" />
                    Производство
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic("light");
                    setShowConvertModal(true);
                  }}
                  className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-extrabold text-xs shadow-sm transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Передать в цех (В Проект)</span>
                </button>

                {state.status === "CANCELLED" && (
                  <div className="pt-2 border-t border-slate-100">
                    <label className="block text-[11px] font-extrabold text-rose-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Причина отказа
                    </label>
                    <input
                      type="text"
                      value={state.cancellationReason}
                      onChange={(e) => state.setCancellationReason(e.target.value)}
                      onBlur={() => state.autoSaveLead({ cancellationReason: state.cancellationReason })}
                      placeholder="Причина отказа..."
                      className="w-full bg-rose-50/50 border border-rose-200 rounded-xl py-1.5 px-3 text-xs font-semibold text-rose-900 focus:bg-white focus:outline-none transition"
                    />
                  </div>
                )}
              </div>

            </div>

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
            setShowEstimateModal(false);
            router.refresh();
          }}
        />
      )}

      {/* Модалка конвертации в Проект и Компанию */}
      {showConvertModal && (
        <DrawerCompanyConvertModal
          isOpen={showConvertModal}
          activeLead={lead}
          companies={companies}
          onClose={() => setShowConvertModal(false)}
          onConvert={async (data) => {
            const res = await state.handleConvertToCompanyAndProject(
              data.companyName,
              data.binIin,
              data.contactPosition,
              data.projectTitle
            );
            if (res.success) {
              setShowConvertModal(false);
              router.refresh();
            }
          }}
        />
      )}
    </>
  );
}
