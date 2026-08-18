"use client";

import React, { useState } from "react";
import { LeadStatus } from "@prisma/client";
import { LEADS_DICTIONARY } from "../_data/leadsDictionary";
import { Lead, Client, Company } from "../_types/leadTypes";
import DrawerHeader from "./drawer/DrawerHeader";
import DrawerClientSection from "./drawer/DrawerClientSection";
import DrawerParamsSection from "./drawer/DrawerParamsSection";
import DrawerFinancesSection from "./drawer/DrawerFinancesSection";
import DrawerLocationNotesSection from "./drawer/DrawerLocationNotesSection";
import DrawerCompanyConvertModal from "./drawer/DrawerCompanyConvertModal";
import BottomSheet from "@/components/ui/BottomSheet";
import Button from "@/components/ui/Button";
import { triggerHaptic } from "@/lib/haptics";
import { toast } from "@/lib/toast";
import { 
  Phone, 
  MapPin, 
  Calendar, 
  CalendarCheck, 
  UserCheck, 
  DollarSign, 
  Edit3, 
  FolderOpen, 
  Copy, 
  MessageSquareQuote,
  Calculator,
  Save
} from "lucide-react";
import { formatManagerName } from "../_data/leadsDictionary";

interface LeadMobileDrawerProps {
  activeLead: Lead | null;
  clients: Client[];
  companies?: Company[];
  editName: string;
  setEditName: (val: string) => void;
  editPhone: string;
  setEditPhone: (val: string) => void;
  editAddress: string;
  setEditAddress: (val: string) => void;
  editManager: string;
  setEditManager: (val: string) => void;
  editAppDate: string;
  setEditAppDate: (val: string) => void;
  editDeadline: string;
  setEditDeadline: (val: string) => void;
  editOfferedPrice: string;
  setEditOfferedPrice: (val: string) => void;
  editIsDiscounted: boolean;
  setEditIsDiscounted: (val: boolean) => void;
  editPrepayment: string;
  setEditPrepayment: (val: string) => void;
  editComment: string;
  setEditComment: (val: string) => void;
  isSavingDetails: boolean;
  onClose: () => void;
  onSaveLeadDetails: (e: React.FormEvent) => void;
  onStatusChange: (leadId: string, newStatus: LeadStatus) => void;
  onOpenEstimateModal: () => void;
  onOpenFullCard: (leadId: string) => void;
  onLinkLeadToClient: (leadId: string, clientId: string | null) => void;
  onCreateClientFromLead: (lead: Lead) => void;
  onOpenClientsPage: () => void;
  onConvertToCompanyAndProject?: (
    leadId: string,
    companyName: string,
    binIin: string,
    contactPosition: string,
    projectTitle: string
  ) => Promise<{ success: boolean; error?: string }>;
}

export default function LeadMobileDrawer({
  activeLead,
  clients,
  companies = [],
  editName,
  setEditName,
  editPhone,
  setEditPhone,
  editAddress,
  setEditAddress,
  editManager,
  setEditManager,
  editAppDate,
  setEditAppDate,
  editDeadline,
  setEditDeadline,
  editOfferedPrice,
  setEditOfferedPrice,
  editIsDiscounted,
  setEditIsDiscounted,
  editPrepayment,
  setEditPrepayment,
  editComment,
  setEditComment,
  isSavingDetails,
  onClose,
  onSaveLeadDetails,
  onStatusChange,
  onOpenEstimateModal,
  onOpenFullCard,
  onLinkLeadToClient,
  onCreateClientFromLead,
  onOpenClientsPage,
  onConvertToCompanyAndProject,
}: LeadMobileDrawerProps) {
  const dict = LEADS_DICTIONARY.drawer;
  const [showCompanyConvert, setShowCompanyConvert] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleCopyAddress = (addr: string) => {
    if (!addr) return;
    triggerHaptic("light");
    navigator.clipboard.writeText(addr);
    toast.success("Адрес скопирован в буфер");
  };

  const handleOpen2Gis = (addr: string) => {
    if (!addr) return;
    triggerHaptic("light");
    window.open(`https://2gis.kz/search/${encodeURIComponent(addr)}`, "_blank");
  };

  const handleOpenYandex = (addr: string) => {
    if (!addr) return;
    triggerHaptic("light");
    window.open(`https://yandex.kz/maps/?text=${encodeURIComponent(addr)}`, "_blank");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    await onSaveLeadDetails(e);
    setIsEditing(false);
  };

  return (
    <>
      <BottomSheet
        isOpen={Boolean(activeLead)}
        onClose={onClose}
        maxWidth="max-w-2xl"
        maxHeight="max-h-[90dvh]"
      >
        {activeLead && (
          <>
            {/* 1. ШАПКА ШТОРКИ */}
            <DrawerHeader
              activeLead={activeLead}
              isEditing={isEditing}
              onToggleEditing={() => setIsEditing(!isEditing)}
              onClose={onClose}
              onStatusChange={onStatusChange}
              onOpenFullCard={onOpenFullCard}
              onOpenCompanyConvert={() => setShowCompanyConvert(true)}
            />

            {/* 2. ТЕЛО: РЕЖИМ ПРОСМОТРА ИЛИ РЕДАКТИРОВАНИЯ */}
            {!isEditing ? (
              /* ═══════════════════════════════════════════════════════════════
                 РЕЖИМ ПРОСМОТРА (View Mode) — Читаемый аккуратный вид
                 ═══════════════════════════════════════════════════════════════ */
              <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-4">
                {/* Секция заказчика */}
                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      Заказчик
                    </span>
                    {activeLead.source && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                        {activeLead.source}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      {activeLead.name || "Имя не указано"}
                    </h3>
                    {activeLead.phone ? (
                      <a
                        href={`tel:${activeLead.phone}`}
                        onClick={() => triggerHaptic("light")}
                        className="inline-flex items-center gap-1.5 text-xs font-extrabold text-orange-600 hover:text-orange-700 mt-1 transition"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{activeLead.phone}</span>
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">Телефон не указан</span>
                    )}
                  </div>
                </div>

                {/* Адрес объекта */}
                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-orange-500" />
                      Адрес объекта
                    </span>
                    {activeLead.address && (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleCopyAddress(activeLead.address!)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition cursor-pointer"
                          title="Копировать адрес"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpen2Gis(activeLead.address!)}
                          className="px-2 py-1 rounded-lg text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition cursor-pointer"
                        >
                          2GIS
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenYandex(activeLead.address!)}
                          className="px-2 py-1 rounded-lg text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition cursor-pointer"
                        >
                          Яндекс
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-extrabold text-slate-800">
                    {activeLead.address || <span className="text-slate-400 font-normal">Адрес не указан</span>}
                  </p>
                </div>

                {/* Сроки и менеджер */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-200/80">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                      <Calendar className="w-3 h-3 text-orange-500" />
                      Замер
                    </span>
                    <p className="text-xs font-black text-slate-900">
                      {activeLead.appointmentDate
                        ? new Date(activeLead.appointmentDate).toLocaleString([], { dateStyle: "short", timeStyle: "short" })
                        : "Не назначен"}
                    </p>
                  </div>

                  <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-200/80">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                      <CalendarCheck className="w-3 h-3 text-emerald-600" />
                      Дедлайн
                    </span>
                    <p className="text-xs font-black text-slate-900">
                      {activeLead.deadline ? new Date(activeLead.deadline).toLocaleDateString() : "Не установлен"}
                    </p>
                  </div>

                  <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-200/80">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                      <UserCheck className="w-3 h-3 text-indigo-500" />
                      Ответственный
                    </span>
                    <p className="text-xs font-black text-slate-900">
                      {formatManagerName(activeLead.manager) || "Не назначен"}
                    </p>
                  </div>
                </div>

                {/* Финансы и смета */}
                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      Финансы и смета
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic("light");
                        onOpenEstimateModal();
                      }}
                      className="px-2.5 py-1 rounded-xl text-xs font-black bg-orange-500 hover:bg-orange-600 text-white transition flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <Calculator className="w-3 h-3" />
                      <span>Калькулятор сметы</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] text-slate-400 font-bold block mb-0.5">Озвучено</span>
                      <span className="text-xs font-black text-slate-900">
                        {activeLead.offeredPrice ? `${Number(activeLead.offeredPrice).toLocaleString()} ₸` : "Не озвучена"}
                      </span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] text-slate-400 font-bold block mb-0.5">Предоплата</span>
                      <span className="text-xs font-black text-slate-900">
                        {activeLead.prepayment ? `${Number(activeLead.prepayment).toLocaleString()} ₸` : "0 ₸"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Заметка */}
                {activeLead.comment && (
                  <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-1.5">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                      Заметка по сделке
                    </span>
                    <p className="text-xs font-medium text-slate-800 whitespace-pre-wrap leading-relaxed">
                      {activeLead.comment}
                    </p>
                  </div>
                )}

                {/* Исходный запрос с сайта */}
                {activeLead.message && (
                  <div className="bg-orange-50/70 p-3.5 rounded-2xl border border-orange-200/80 space-y-1.5 w-full min-w-0 max-w-full overflow-hidden">
                    <span className="text-[10px] font-black text-orange-900 uppercase tracking-wider flex items-center gap-1.5">
                      <MessageSquareQuote className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                      Исходный запрос с сайта:
                    </span>
                    <p className="text-xs font-semibold text-slate-800 whitespace-pre-wrap break-words break-all [overflow-wrap:anywhere] leading-relaxed max-w-full">
                      {activeLead.message}
                    </p>
                  </div>
                )}

                {/* Нижняя панель действий режима просмотра */}
                <div className="pt-2 sticky bottom-0 bg-white/95 pb-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic("light");
                      setIsEditing(true);
                    }}
                    className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-black text-white font-black text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-98"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-slate-300" />
                    <span>Редактировать сделку</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic("light");
                      onOpenFullCard(activeLead.id);
                    }}
                    className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-98"
                  >
                    <FolderOpen className="w-3.5 h-3.5 text-slate-600" />
                    <span>Полная карточка</span>
                  </button>
                </div>
              </div>
            ) : (
              /* ═══════════════════════════════════════════════════════════════
                 РЕЖИМ РЕДАКТИРОВАНИЯ (Edit Mode) — Форма с инпутами
                 ═══════════════════════════════════════════════════════════════ */
              <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-4">
                {/* Секция привязки к карточке клиента */}
                <DrawerClientSection
                  activeLead={activeLead}
                  clients={clients}
                  onLinkLeadToClient={onLinkLeadToClient}
                  onCreateClientFromLead={onCreateClientFromLead}
                  onOpenClientsPage={onOpenClientsPage}
                />

                {/* Секция параметров: ФИО, Телефон, Менеджер, Даты */}
                <DrawerParamsSection
                  editName={editName}
                  setEditName={setEditName}
                  editPhone={editPhone}
                  setEditPhone={setEditPhone}
                  editManager={editManager}
                  setEditManager={setEditManager}
                  editAppDate={editAppDate}
                  setEditAppDate={setEditAppDate}
                  editDeadline={editDeadline}
                  setEditDeadline={setEditDeadline}
                />

                {/* Секция финансов */}
                <DrawerFinancesSection
                  activeLead={activeLead}
                  editOfferedPrice={editOfferedPrice}
                  setEditOfferedPrice={setEditOfferedPrice}
                  editIsDiscounted={editIsDiscounted}
                  setEditIsDiscounted={setEditIsDiscounted}
                  editPrepayment={editPrepayment}
                  setEditPrepayment={setEditPrepayment}
                  onOpenEstimateModal={onOpenEstimateModal}
                />

                {/* Секция локации, заметок и первичного запроса */}
                <DrawerLocationNotesSection
                  activeLead={activeLead}
                  editAddress={editAddress}
                  setEditAddress={setEditAddress}
                  editComment={editComment}
                  setEditComment={setEditComment}
                />

                {/* Кнопка сохранения параметров и отмена */}
                <div className="pt-2 sticky bottom-0 bg-white/95 pb-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic("light");
                      setIsEditing(false);
                    }}
                    className="py-3 px-4 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 font-extrabold text-xs transition cursor-pointer active:scale-95"
                  >
                    Отмена
                  </button>

                  <Button
                    type="submit"
                    disabled={isSavingDetails}
                    variant="solid"
                    className="flex-1 py-3 text-xs font-black shadow-md shadow-orange-500/20"
                  >
                    <Save className="w-3.5 h-3.5 mr-1" />
                    {isSavingDetails ? dict.savingBtn : dict.saveBtn}
                  </Button>
                </div>
              </form>
            )}
          </>
        )}
      </BottomSheet>

      {/* Модальное окно быстрой конвертации */}
      {showCompanyConvert && onConvertToCompanyAndProject && activeLead && (
        <DrawerCompanyConvertModal
          activeLead={activeLead}
          companies={companies}
          onClose={() => setShowCompanyConvert(false)}
          onConvert={async (data) => {
            await onConvertToCompanyAndProject(
              activeLead.id,
              data.companyName,
              data.binIin,
              data.contactPosition,
              data.projectTitle
            );
            setShowCompanyConvert(false);
          }}
        />
      )}
    </>
  );
}
