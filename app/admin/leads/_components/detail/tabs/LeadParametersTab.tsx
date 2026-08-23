"use client";

import React, { useState } from "react";
import { 
  Phone, 
  MapPin, 
  Calendar, 
  CalendarCheck, 
  UserCheck, 
  DollarSign, 
  Tag, 
  Copy, 
  AlertCircle,
  MessageSquareQuote,
  Clock,
  ExternalLink,
  ChevronDown,
  UserPlus,
  Link as LinkIcon,
  Search,
  Briefcase
} from "lucide-react";
import AutoResizeTextarea from "@/components/ui/AutoResizeTextarea";
import { triggerHaptic } from "@/lib/haptics";
import { toast } from "@/lib/toast";
import { PartnerName, LeadStatus } from "@prisma/client";
import { CANCELLATION_REASONS } from "../../../_data/leadDetailDictionary";
import { formatManagerName } from "../../../_data/leadsDictionary";
import InitialMessageAccordion from "@/components/admin/InitialMessageAccordion";
import DrawerCompanyConvertModal from "../../drawer/DrawerCompanyConvertModal";

interface LeadParametersTabProps {
  isEditing: boolean;
  name: string;
  setName: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  address: string;
  setAddress: (val: string) => void;
  appDate: string;
  setAppDate: (val: string) => void;
  deadline: string;
  setDeadline: (val: string) => void;
  manager: string;
  setManager: (val: string) => void;
  offeredPrice: string;
  setOfferedPrice: (val: string) => void;
  isDiscounted: boolean;
  setIsDiscounted: (val: boolean) => void;
  prepayment: string;
  setPrepayment: (val: string) => void;
  isPrepaymentPaid: boolean;
  setIsPrepaymentPaid: (val: boolean) => void;
  isBalancePaid: boolean;
  setIsBalancePaid: (val: boolean) => void;
  comment: string;
  setComment: (val: string) => void;
  status: LeadStatus;
  cancellationReason: string;
  setCancellationReason: (val: string) => void;
  initialMessage?: string | null;
  source?: string | null;
  leadId?: string;
  client?: any;
  clients?: any[];
  companies?: any[];
  onLinkLeadToClient?: (clientId: string | null) => void;
  onCreateClientFromLead?: () => void;
  onConvertToCompanyAndProject?: (
    companyName: string,
    binIin: string,
    contactPosition: string,
    projectTitle: string
  ) => Promise<{ success: boolean; error?: string }>;
}

export default function LeadParametersTab({
  isEditing,
  name,
  setName,
  phone,
  setPhone,
  address,
  setAddress,
  appDate,
  setAppDate,
  deadline,
  setDeadline,
  manager,
  setManager,
  offeredPrice,
  setOfferedPrice,
  isDiscounted,
  setIsDiscounted,
  prepayment,
  setPrepayment,
  isPrepaymentPaid,
  setIsPrepaymentPaid,
  isBalancePaid,
  setIsBalancePaid,
  comment,
  setComment,
  status,
  cancellationReason,
  setCancellationReason,
  initialMessage,
  source,
  leadId,
  client,
  clients = [],
  companies = [],
  onLinkLeadToClient,
  onCreateClientFromLead,
  onConvertToCompanyAndProject,
}: LeadParametersTabProps) {
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [showClientSearch, setShowClientSearch] = useState(false);
  const [clientSearchQuery, setClientSearchQuery] = useState("");

  const filteredClients = clients.filter((c: any) =>
    (c.name || "").toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
    (c.phone || "").includes(clientSearchQuery)
  );

  const handleCopyAddress = () => {
    if (!address) return;
    triggerHaptic("light");
    navigator.clipboard.writeText(address);
    toast.success("Адрес скопирован в буфер");
  };

  const handleOpen2Gis = () => {
    if (!address) return;
    triggerHaptic("light");
    window.open(`https://2gis.kz/search/${encodeURIComponent(address)}`, "_blank");
  };

  const handleOpenYandex = () => {
    if (!address) return;
    triggerHaptic("light");
    window.open(`https://yandex.kz/maps/?text=${encodeURIComponent(address)}`, "_blank");
  };

  const [isMessageExpanded, setIsMessageExpanded] = useState(false);
  const reasonObj = CANCELLATION_REASONS.find((r) => r.id === cancellationReason);

  // ═══════════════════════════════════════════════════════════════
  // РЕЖИМ ПРОСМОТРА (View Mode) — Читаемый, легкий Apple-интерфейс
  // ═══════════════════════════════════════════════════════════════
  if (!isEditing) {
    return (
      <div className="space-y-4 animate-in fade-in duration-150">
        {/* Причина отказа при статусе CANCELLED */}
        {status === "CANCELLED" && (
          <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-2xl flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <span className="text-[10px] font-black text-rose-500 uppercase tracking-wider block">
                Причина срыва сделки
              </span>
              <p className="text-xs font-black text-rose-900">
                {reasonObj?.label || "Причина не указана"}
              </p>
            </div>
          </div>
        )}

        {/* Карточка контактов заказчика и CRM привязка */}
        <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-orange-500" />
              Заказчик и CRM-профиль
            </span>
            <div className="flex items-center gap-1.5">
              {source && (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                  {source}
                </span>
              )}
              {onConvertToCompanyAndProject && (
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic("light");
                    setShowConvertModal(true);
                  }}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-orange-100 text-orange-800 hover:bg-orange-200 border border-orange-200 transition cursor-pointer flex items-center gap-1 active:scale-95"
                  title="Квалифицировать в Компанию и Проект"
                >
                  <Briefcase className="w-3 h-3 text-orange-600" />
                  <span>В Проект</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-slate-900">
                {name || "Имя не указано"}
              </h3>
              {phone ? (
                <a
                  href={`tel:${phone}`}
                  onClick={() => triggerHaptic("light")}
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-orange-600 hover:text-orange-700 mt-1 transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{phone}</span>
                </a>
              ) : (
                <span className="text-xs text-slate-400 font-medium">Телефон не указан</span>
              )}
            </div>
          </div>

          {/* Привязка к базе клиентов */}
          {client ? (
            <div className="bg-white p-3 rounded-xl border border-emerald-200/80 flex items-center justify-between gap-3 shadow-2xs">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-extrabold text-slate-900 text-xs truncate">
                    Клиент: {client.name}
                  </span>
                  {client.companyName && (
                    <span className="text-[10px] font-bold text-slate-500">
                      ({client.companyName})
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-medium text-slate-500 block">
                  {client.phone}
                </span>
              </div>

              {onLinkLeadToClient && (
                <button
                  type="button"
                  onClick={() => onLinkLeadToClient(null)}
                  className="px-2.5 py-1 text-[11px] font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer shrink-0"
                >
                  Отвязать
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2 pt-1 border-t border-slate-200/60">
              {!showClientSearch ? (
                <div className="flex items-center gap-2">
                  {onCreateClientFromLead && (
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic("light");
                        onCreateClientFromLead();
                      }}
                      className="flex-1 py-1.5 px-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer active:scale-98"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Создать клиента</span>
                    </button>
                  )}

                  {onLinkLeadToClient && (
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic("light");
                        setShowClientSearch(true);
                      }}
                      className="py-1.5 px-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-xs transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <LinkIcon className="w-3.5 h-3.5 text-slate-500" />
                      <span>Привязать</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm space-y-2 animate-in fade-in duration-150">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={clientSearchQuery}
                      onChange={(e) => setClientSearchQuery(e.target.value)}
                      placeholder="Поиск по имени или телефону..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 outline-none focus:border-orange-500"
                      autoFocus
                    />
                  </div>

                  <div className="max-h-36 overflow-y-auto space-y-1">
                    {filteredClients.slice(0, 5).map((c: any) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          if (onLinkLeadToClient) {
                            onLinkLeadToClient(c.id);
                          }
                          setShowClientSearch(false);
                        }}
                        className="w-full text-left p-2 rounded-lg hover:bg-orange-50 text-slate-800 hover:text-orange-700 text-xs font-bold transition flex items-center justify-between"
                      >
                        <span className="truncate">{c.name} ({c.phone})</span>
                        <span className="text-[10px] font-black text-orange-600 uppercase">Выбрать</span>
                      </button>
                    ))}
                    {filteredClients.length === 0 && (
                      <span className="block text-center text-xs text-slate-400 py-2">
                        Клиент не найден
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowClientSearch(false)}
                    className="w-full py-1 text-center text-xs text-slate-500 hover:text-slate-700 font-bold"
                  >
                    Отмена
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Карточка адреса объекта */}
        <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-orange-500" />
              Адрес объекта
            </span>
            {address && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition cursor-pointer"
                  title="Копировать адрес"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleOpen2Gis}
                  className="px-2 py-1 rounded-lg text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition cursor-pointer"
                >
                  2GIS
                </button>
                <button
                  type="button"
                  onClick={handleOpenYandex}
                  className="px-2 py-1 rounded-lg text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition cursor-pointer"
                >
                  Яндекс
                </button>
              </div>
            )}
          </div>
          <p className="text-xs font-extrabold text-slate-800">
            {address || <span className="text-slate-400 font-normal">Адрес не указан</span>}
          </p>
        </div>

        {/* Сетка сроков и ответственности */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Дата замера */}
          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
              <Calendar className="w-3 h-3 text-orange-500" />
              Замер / Встреча
            </span>
            <p className="text-xs font-black text-slate-900">
              {appDate ? new Date(appDate).toLocaleString([], { dateStyle: "short", timeStyle: "short" }) : "Не назначена"}
            </p>
          </div>

          {/* Дедлайн */}
          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
              <CalendarCheck className="w-3 h-3 text-emerald-600" />
              Дедлайн сдачи
            </span>
            <p className="text-xs font-black text-slate-900">
              {deadline ? new Date(deadline).toLocaleDateString() : "Не установлен"}
            </p>
          </div>

          {/* Ответственный менеджер */}
          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
              <UserCheck className="w-3 h-3 text-indigo-500" />
              Ответственный
            </span>
            <p className="text-xs font-black text-slate-900">
              {formatManagerName(manager) || "Не назначен"}
            </p>
          </div>
        </div>

        {/* Финансовый блок */}
        <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-3">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
            Финансы сделки
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white p-3 rounded-xl border border-slate-200/80">
              <span className="text-[10px] text-slate-400 font-bold block mb-0.5">
                Озвученная стоимость
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-slate-900">
                  {offeredPrice ? `${Number(offeredPrice).toLocaleString()} ₸` : "Не озвучена"}
                </span>
                {isDiscounted && (
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-orange-100 text-orange-700">
                    Скидка
                  </span>
                )}
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200/80">
              <span className="text-[10px] text-slate-400 font-bold block mb-0.5">
                Предоплата
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-slate-900">
                  {prepayment ? `${Number(prepayment).toLocaleString()} ₸` : "0 ₸"}
                </span>
                {isPrepaymentPaid ? (
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    ✓ Внесена
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                    Ожидается
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="pt-1">
            {isBalancePaid ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-black bg-blue-50 text-blue-800 border border-blue-200">
                ✓ Сделка полностью оплачена (100%)
              </span>
            ) : (
              <span className="text-xs text-slate-500 font-bold">
                Статус расчета: Полная оплата ожидается после монтажа
              </span>
            )}
          </div>
        </div>

        {/* Заметка по сделке */}
        {comment && (
          <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-1.5">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
              Заметка по сделке
            </span>
            <p className="text-xs font-medium text-slate-800 whitespace-pre-wrap leading-relaxed">
              {comment}
            </p>
          </div>
        )}

        {/* Исходный запрос с сайта (раскрывающийся аккордеон) */}
        <InitialMessageAccordion message={initialMessage} />
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // РЕЖИМ РЕДАКТИРОВАНИЯ (Edit Mode) — Поля ввода данных
  // ═══════════════════════════════════════════════════════════════
  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Причина отказа (если статус CANCELLED) */}
      {status === "CANCELLED" && (
        <div className="bg-rose-50/90 border border-rose-200/90 p-3.5 rounded-2xl space-y-2">
          <label className="block text-[11px] font-black text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            Причина отказа / срыва сделки:
          </label>
          <select
            value={cancellationReason}
            onChange={(e) => setCancellationReason(e.target.value)}
            className="w-full bg-white border border-rose-200 text-rose-950 font-extrabold rounded-xl px-3 py-2 text-xs outline-none focus:border-rose-500 shadow-2xs"
          >
            <option value="">Выберите причину отказа...</option>
            {CANCELLATION_REASONS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Блок контактов */}
      <div className="bg-slate-50/80 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 space-y-3">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
          Контакты заказчика
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] text-slate-500 font-bold mb-1">
              ФИО / Название компании
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Алексей или ТОО Капитал"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:border-orange-500 outline-none text-xs shadow-2xs transition"
            />
          </div>
          <div>
            <label className="block text-[10px] text-slate-500 font-bold mb-1">
              Номер телефона
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+7 (700) 000-00-00"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:border-orange-500 outline-none text-xs shadow-2xs transition"
            />
          </div>
        </div>
      </div>

      {/* Блок адреса с картами */}
      <div className="bg-slate-50/80 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-orange-500" />
            Адрес объекта и монтажа
          </label>
          {address && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleCopyAddress}
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-md transition cursor-pointer"
                title="Копировать адрес"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleOpen2Gis}
                className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition cursor-pointer"
              >
                2GIS
              </button>
              <button
                type="button"
                onClick={handleOpenYandex}
                className="px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition cursor-pointer"
              >
                Яндекс
              </button>
            </div>
          )}
        </div>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="например: пр. Достык 123, ТРЦ Dostyk Plaza, 2 этаж"
          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:border-orange-500 outline-none text-xs shadow-2xs transition"
        />
      </div>

      {/* Блок дат и менеджера */}
      <div className="bg-slate-50/80 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 space-y-3">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
          Сроки и ответственность
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[10px] text-slate-500 font-bold mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-orange-500" />
              Дата замера / встречи
            </label>
            <input
              type="datetime-local"
              value={appDate}
              onChange={(e) => setAppDate(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-slate-900 font-bold focus:border-orange-500 outline-none text-xs shadow-2xs transition"
            />
          </div>

          <div>
            <label className="block text-[10px] text-slate-500 font-bold mb-1 flex items-center gap-1">
              <CalendarCheck className="w-3 h-3 text-emerald-600" />
              Дедлайн сдачи
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-slate-900 font-bold focus:border-orange-500 outline-none text-xs shadow-2xs transition"
            />
          </div>

          <div>
            <label className="block text-[10px] text-slate-500 font-bold mb-1 flex items-center gap-1">
              <UserCheck className="w-3 h-3 text-indigo-500" />
              Ответственный
            </label>
            <select
              value={manager}
              onChange={(e) => setManager(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-slate-900 font-bold focus:border-orange-500 outline-none text-xs shadow-2xs transition"
            >
              <option value="">Не назначен</option>
              <option value="DANIIL">Даниил</option>
              <option value="ELISEY">Елисей</option>
            </select>
          </div>
        </div>
      </div>

      {/* Финансовый блок */}
      <div className="bg-slate-50/80 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 space-y-3">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
          Финансы и расчеты
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] text-slate-500 font-bold mb-1">
              Озвученная цена клиенту (₸)
            </label>
            <input
              type="number"
              value={offeredPrice}
              onChange={(e) => setOfferedPrice(e.target.value)}
              placeholder="например: 180000"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-black focus:border-orange-500 outline-none text-xs shadow-2xs transition"
            />
          </div>

          <div>
            <label className="block text-[10px] text-slate-500 font-bold mb-1">
              Сумма предоплаты (₸)
            </label>
            <input
              type="number"
              value={prepayment}
              onChange={(e) => setPrepayment(e.target.value)}
              placeholder="например: 90000"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-black focus:border-orange-500 outline-none text-xs shadow-2xs transition"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap pt-1 border-t border-slate-200/60 text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isDiscounted}
              onChange={(e) => setIsDiscounted(e.target.checked)}
              className="w-4 h-4 rounded text-orange-600 border-slate-300 focus:ring-orange-500 cursor-pointer"
            />
            <span className="font-extrabold text-slate-800">🏷️ Озвучено со скидкой</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isPrepaymentPaid}
              onChange={(e) => setIsPrepaymentPaid(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500 cursor-pointer"
            />
            <span className="font-extrabold text-emerald-800">✓ Предоплата получена</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isBalancePaid}
              onChange={(e) => setIsBalancePaid(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
            />
            <span className="font-extrabold text-blue-800">✓ Полный расчет закрыт</span>
          </label>
        </div>
      </div>

      {/* Заметка и комментарий */}
      <div className="bg-slate-50/80 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
          Заметка по сделке
        </label>
        <AutoResizeTextarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Укажите важные детали разговора, пожелания заказчика..."
          minHeight={64}
          className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-900 font-bold focus:border-orange-500 outline-none text-xs shadow-2xs transition"
        />
      </div>

      {/* Исходный запрос с сайта (раскрывающийся аккордеон) */}
      {initialMessage && (
        <div className="bg-orange-50/70 rounded-2xl border border-orange-200/80 w-full min-w-0 max-w-full overflow-hidden transition shadow-2xs">
          <button
            type="button"
            onClick={() => {
              triggerHaptic("light");
              setIsMessageExpanded((prev) => !prev);
            }}
            className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer select-none hover:bg-orange-100/60 transition"
          >
            <div className="flex items-center gap-2 min-w-0">
              <MessageSquareQuote className="w-4 h-4 text-orange-600 shrink-0" />
              <span className="text-[11px] font-black text-orange-950 uppercase tracking-wider">
                Исходный запрос с сайта
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 ml-2">
              <span className="text-[10px] font-bold text-orange-700">
                {isMessageExpanded ? "Свернуть" : "Показать"}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-orange-600 transition-transform duration-200 ${
                  isMessageExpanded ? "rotate-180" : ""
                }`}
              />
            </div>
          </button>

          {isMessageExpanded && (
            <div className="px-3.5 pb-3.5 pt-1 border-t border-orange-200/60 animate-in fade-in duration-150">
              <p className="text-xs font-semibold text-slate-800 whitespace-pre-wrap break-words break-all [overflow-wrap:anywhere] leading-relaxed max-w-full">
                {initialMessage}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Модалка квалификации в Компанию и Проект */}
      {showConvertModal && onConvertToCompanyAndProject && (
        <DrawerCompanyConvertModal
          activeLead={{ id: leadId || "", name, phone, client } as any}
          companies={companies}
          onClose={() => setShowConvertModal(false)}
          onConvert={async (data) => {
            const res = await onConvertToCompanyAndProject(
              data.companyName,
              data.binIin,
              data.contactPosition,
              data.projectTitle
            );
            if (res.success) {
              setShowConvertModal(false);
            }
          }}
        />
      )}
    </div>
  );
}
