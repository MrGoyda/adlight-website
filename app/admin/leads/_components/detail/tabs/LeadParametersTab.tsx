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
  Briefcase,
  Send,
  MessageSquare,
  Trash2,
  CheckCircle2,
  Sparkles,
  User
} from "lucide-react";
import AutoResizeTextarea from "@/components/ui/AutoResizeTextarea";
import { triggerHaptic } from "@/lib/haptics";
import { toast } from "@/lib/toast";
import { PartnerName, LeadStatus } from "@prisma/client";
import { CANCELLATION_REASONS } from "../../../_data/leadDetailDictionary";
import { formatManagerName } from "../../../_data/leadsDictionary";
import InitialMessageAccordion from "@/components/admin/InitialMessageAccordion";
import DrawerCompanyConvertModal from "../../drawer/DrawerCompanyConvertModal";
import { LeadActivityItem } from "../../../_types/leadDetailTypes";

interface LeadParametersTabProps {
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
  activities?: LeadActivityItem[];
  onAddNote?: (text: string) => Promise<void>;
  onDeleteActivity?: (activityId: string) => void;
  isAddingNote?: boolean;
  onAutoSave?: (patch: any) => void;
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
  activities = [],
  onAddNote,
  onDeleteActivity,
  isAddingNote = false,
  onAutoSave,
  onLinkLeadToClient,
  onCreateClientFromLead,
  onConvertToCompanyAndProject,
}: LeadParametersTabProps) {
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [showClientSearch, setShowClientSearch] = useState(false);
  const [clientSearchQuery, setClientSearchQuery] = useState("");
  const [quickNoteText, setQuickNoteText] = useState("");

  const filteredClients = clients.filter((c: any) =>
    (c.name || "").toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
    (c.phone && c.phone.includes(clientSearchQuery))
  );

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    triggerHaptic("success");
    toast.success(`${label} скопирован в буфер!`);
  };

  const handleQuickNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickNoteText.trim() || !onAddNote) return;
    triggerHaptic("medium");
    await onAddNote(quickNoteText.trim());
    setQuickNoteText("");
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* ── БЛОК КЛИЕНТА И КОНВЕРТАЦИИ В ПРОЕКТ ── */}
      <div className="bg-slate-50/80 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-blue-500" />
            Профиль заказчика в CRM
          </span>

          <div className="flex items-center gap-1.5">
            {onConvertToCompanyAndProject && (
              <button
                type="button"
                onClick={() => {
                  triggerHaptic("light");
                  setShowConvertModal(true);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs shadow-sm transition active:scale-95 cursor-pointer"
                title="Квалифицировать в Проект и Компанию"
              >
                <Briefcase className="w-3 h-3" />
                <span>В Проект</span>
              </button>
            )}
          </div>
        </div>

        {client ? (
          <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <a
                  href={`/admin/clients?search=${encodeURIComponent(client.phone || client.name)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-black text-slate-900 text-xs hover:text-orange-600 transition flex items-center gap-1 truncate"
                >
                  <span>{client.name}</span>
                  <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                </a>
                <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-extrabold shrink-0 border border-emerald-200">
                  База CRM
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-bold mt-0.5 truncate">
                {client.phone || "Без телефона"}
                {client.companies && client.companies.length > 0 && (
                  <span className="text-slate-400 font-medium"> • {client.companies.map((c: any) => c.company.name).join(", ")}</span>
                )}
              </p>
            </div>

            {onLinkLeadToClient && (
              <button
                type="button"
                onClick={() => {
                  triggerHaptic("medium");
                  onLinkLeadToClient(null);
                }}
                className="px-2.5 py-1 text-[11px] font-black text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer shrink-0"
              >
                Отвязать
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 flex-wrap">
              {onCreateClientFromLead && (
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic("light");
                    onCreateClientFromLead();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white font-extrabold text-xs shadow-2xs transition active:scale-95 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5 text-amber-400" />
                  <span>+ Создать клиента</span>
                </button>
              )}

              {onLinkLeadToClient && (
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic("light");
                    setShowClientSearch((prev) => !prev);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-xs shadow-2xs transition active:scale-95 cursor-pointer"
                >
                  <LinkIcon className="w-3.5 h-3.5 text-blue-500" />
                  <span>Привязать существующего</span>
                </button>
              )}
            </div>

            {showClientSearch && onLinkLeadToClient && (
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2 animate-in fade-in zoom-in-95 duration-150">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={clientSearchQuery}
                    onChange={(e) => setClientSearchQuery(e.target.value)}
                    placeholder="Поиск по имени или телефону..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs font-bold text-slate-800 outline-none focus:border-orange-500"
                    autoFocus
                  />
                </div>

                <div className="max-h-40 overflow-y-auto space-y-1">
                  {filteredClients.length === 0 ? (
                    <p className="text-[11px] text-slate-400 text-center py-2">Клиенты не найдены</p>
                  ) : (
                    filteredClients.slice(0, 10).map((c: any) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          triggerHaptic("success");
                          onLinkLeadToClient(c.id);
                          setShowClientSearch(false);
                        }}
                        className="w-full text-left p-2 rounded-lg hover:bg-slate-50 transition flex items-center justify-between text-xs cursor-pointer"
                      >
                        <span className="font-extrabold text-slate-800 truncate">{c.name}</span>
                        <span className="text-[11px] text-slate-400 font-mono shrink-0">{c.phone || "нет тел"}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── 1. ОСНОВНЫЕ КОНТАКТНЫЕ ДАННЫЕ (INLINE EDIT) ── */}
      <div className="bg-slate-50/80 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 space-y-3">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-slate-500" />
          Контактные данные и адрес объекта
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Имя клиента */}
          <div>
            <label className="block text-[10px] text-slate-500 font-bold mb-1">
              Имя клиента / Контактное лицо
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => onAutoSave?.({ name })}
              placeholder="Имя заказчика"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:border-orange-500 outline-none text-xs shadow-2xs transition"
            />
          </div>

          {/* Телефон */}
          <div>
            <label className="block text-[10px] text-slate-500 font-bold mb-1 flex items-center justify-between">
              <span>Номер телефона</span>
              {phone && (
                <button
                  type="button"
                  onClick={() => handleCopy(phone, "Телефон")}
                  className="text-slate-400 hover:text-slate-700 flex items-center gap-0.5 cursor-pointer text-[10px]"
                >
                  <Copy className="w-2.5 h-2.5" />
                  <span>Копировать</span>
                </button>
              )}
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onBlur={() => onAutoSave?.({ phone })}
                placeholder="+7 (___) ___-__-__"
                className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-slate-900 font-bold focus:border-orange-500 outline-none text-xs shadow-2xs transition font-mono"
              />
              <Phone className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Адрес объекта */}
        <div>
          <label className="block text-[10px] text-slate-500 font-bold mb-1 flex items-center justify-between">
            <span>Адрес монтажа / Объект</span>
            {address && (
              <a
                href={`https://2gis.kz/astana/search/${encodeURIComponent(address)}`}
                target="_blank"
                rel="noreferrer"
                className="text-orange-600 hover:text-orange-700 flex items-center gap-0.5 text-[10px] font-bold"
              >
                <span>2GIS</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
          </label>
          <div className="relative">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onBlur={() => onAutoSave?.({ address })}
              placeholder="Улица, дом, ТРЦ, этаж, бутик..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-slate-900 font-bold focus:border-orange-500 outline-none text-xs shadow-2xs transition"
            />
            <MapPin className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      </div>

      {/* ── 2. МЕНЕДЖЕР, ДАТА ЗАМЕРА И СРОК (INLINE) ── */}
      <div className="bg-slate-50/80 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 space-y-3">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-indigo-500" />
          Ответственный менеджер и график
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Менеджер */}
          <div>
            <label className="block text-[10px] text-slate-500 font-bold mb-1">
              Ответственный
            </label>
            <select
              value={manager || ""}
              onChange={(e) => {
                const val = e.target.value;
                setManager(val);
                onAutoSave?.({ manager: val || null });
              }}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:border-orange-500 outline-none text-xs shadow-2xs transition cursor-pointer"
            >
              <option value="">Не назначен</option>
              {Object.values(PartnerName).map((p) => (
                <option key={p} value={p}>
                  {formatManagerName(p)}
                </option>
              ))}
            </select>
          </div>

          {/* Дата и время замера */}
          <div>
            <label className="block text-[10px] text-slate-500 font-bold mb-1">
              Дата и время замера
            </label>
            <input
              type="datetime-local"
              value={appDate}
              onChange={(e) => {
                const val = e.target.value;
                setAppDate(val);
                onAutoSave?.({ appDate: val });
              }}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:border-orange-500 outline-none text-xs shadow-2xs transition font-mono"
            />
          </div>

          {/* Срок сдачи (Дедлайн) */}
          <div>
            <label className="block text-[10px] text-slate-500 font-bold mb-1">
              Крайний срок (Дедлайн)
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => {
                const val = e.target.value;
                setDeadline(val);
                onAutoSave?.({ deadline: val });
              }}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:border-orange-500 outline-none text-xs shadow-2xs transition font-mono"
            />
          </div>
        </div>
      </div>

      {/* ── 3. ФИНАНСЫ И ПРЕДОПЛАТА (INLINE) ── */}
      <div className="bg-slate-50/80 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 space-y-3">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
          Финансовые условия и расчеты
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Предложенная сумма */}
          <div className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] text-slate-500 font-bold">
                Сумма договора / КП (₸)
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-[10px] font-bold text-slate-600">
                <input
                  type="checkbox"
                  checked={isDiscounted}
                  onChange={(e) => {
                    const val = e.target.checked;
                    setIsDiscounted(val);
                    onAutoSave?.({ isDiscounted: val });
                  }}
                  className="rounded text-orange-600 border-slate-300"
                />
                <span>Со скидкой</span>
              </label>
            </div>
            <input
              type="number"
              value={offeredPrice}
              onChange={(e) => setOfferedPrice(e.target.value)}
              onBlur={() => onAutoSave?.({ offeredPrice })}
              placeholder="0 ₸"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-black focus:border-orange-500 outline-none text-sm font-mono shadow-inner"
            />
          </div>

          {/* Предоплата */}
          <div className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] text-slate-500 font-bold">
                Предоплата (₸)
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-[10px] font-bold text-emerald-700">
                <input
                  type="checkbox"
                  checked={isPrepaymentPaid}
                  onChange={(e) => {
                    const val = e.target.checked;
                    setIsPrepaymentPaid(val);
                    onAutoSave?.({ isPrepaymentPaid: val });
                  }}
                  className="rounded text-emerald-600 border-slate-300"
                />
                <span>Оплачена</span>
              </label>
            </div>
            <input
              type="number"
              value={prepayment}
              onChange={(e) => setPrepayment(e.target.value)}
              onBlur={() => onAutoSave?.({ prepayment })}
              placeholder="0 ₸"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-black focus:border-orange-500 outline-none text-sm font-mono shadow-inner"
            />
          </div>
        </div>

        {/* Статус закрытия расчета */}
        <div className="pt-1 flex items-center justify-between px-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isBalancePaid}
              onChange={(e) => {
                const val = e.target.checked;
                setIsBalancePaid(val);
                onAutoSave?.({ isBalancePaid: val });
              }}
              className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
            />
            <span className="font-extrabold text-blue-800 text-xs">Полный расчет закрыт (100%)</span>
          </label>
        </div>
      </div>

      {/* ── 4. БЫСТРЫЕ ЗАМЕТКИ И ПОМЕТКИ МЕНЕДЖЕРА ── */}
      <div className="bg-slate-50/80 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 space-y-3">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-orange-500" />
          Быстрые пометки и заметки ({activities.length})
        </span>

        {/* Форма добавления быстрой заметки */}
        {onAddNote && (
          <form onSubmit={handleQuickNoteSubmit} className="space-y-2">
            <div className="relative">
              <AutoResizeTextarea
                value={quickNoteText}
                onChange={(e) => setQuickNoteText(e.target.value)}
                placeholder="Добавить пометку: звонок клиенту, правки по смете, договоренности..."
                minHeight={56}
                className="w-full bg-white border border-slate-200 rounded-xl p-3 pr-10 text-slate-900 font-bold focus:border-orange-500 outline-none text-xs shadow-2xs transition"
              />
              <button
                type="submit"
                disabled={isAddingNote || !quickNoteText.trim()}
                className="absolute right-2.5 bottom-2.5 p-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white transition cursor-pointer disabled:opacity-30 shadow-2xs active:scale-95"
                title="Сохранить пометку"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}

        {/* Список последних заметок */}
        {activities.length > 0 && (
          <div className="space-y-2 max-h-48 overflow-y-auto pt-1">
            {activities.map((act) => (
              <div
                key={act.id}
                className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs space-y-1 relative group"
              >
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                  <span className="text-slate-700 font-black">{act.author || "Менеджер"}</span>
                  <div className="flex items-center gap-2">
                    <span>{new Date(act.createdAt).toLocaleDateString()} {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {onDeleteActivity && (
                      <button
                        type="button"
                        onClick={() => {
                          triggerHaptic("medium");
                          onDeleteActivity(act.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                        title="Удалить"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-xs font-medium text-slate-800 whitespace-pre-wrap leading-relaxed">
                  {act.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── 5. ПОСТОЯННЫЙ КОММЕНТАРИЙ ── */}
      <div className="bg-slate-50/80 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
          Постоянный комментарий к лиду
        </label>
        <AutoResizeTextarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onBlur={() => onAutoSave?.({ comment })}
          placeholder="Главный комментарий по объекту..."
          minHeight={64}
          className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-900 font-bold focus:border-orange-500 outline-none text-xs shadow-2xs transition"
        />
      </div>

      {/* ── 6. ПРИЧИНА ОТКАЗА (Если статус CANCELLED) ── */}
      {status === "CANCELLED" && (
        <div className="bg-rose-50/80 p-3.5 sm:p-4 rounded-2xl border border-rose-200 space-y-2 animate-in fade-in duration-150">
          <label className="text-[10px] font-black text-rose-600 uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            Причина отказа / срыва сделки
          </label>
          <select
            value={cancellationReason || ""}
            onChange={(e) => {
              const val = e.target.value;
              setCancellationReason(val);
              onAutoSave?.({ cancellationReason: val });
            }}
            className="w-full bg-white border border-rose-200 text-rose-950 font-extrabold rounded-xl px-3 py-2 text-xs outline-none focus:border-rose-500 shadow-2xs transition cursor-pointer"
          >
            <option value="">Не указана</option>
            {CANCELLATION_REASONS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Исходный запрос с сайта (раскрывающийся аккордеон) */}
      {initialMessage && (
        <div className="bg-orange-50/70 rounded-2xl border border-orange-200/80 w-full min-w-0 max-w-full overflow-hidden transition shadow-2xs">
          <InitialMessageAccordion message={initialMessage} source={source} />
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
