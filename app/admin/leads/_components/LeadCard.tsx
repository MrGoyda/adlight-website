"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Phone, 
  ImageIcon, 
  FileText, 
  MessageSquare, 
  MapPin, 
  Calculator, 
  FolderOpen, 
  Trash2,
  RotateCcw,
  ChevronDown,
  Copy,
  Check,
  ExternalLink,
  CalendarCheck,
  Flame,
  Sparkles,
  AlertCircle,
  DollarSign
} from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { STATUS_MAP, LEADS_DICTIONARY, formatManagerName } from "../_data/leadsDictionary";
import { Lead } from "../_types/leadTypes";
import { getLeadTimingInfo } from "../_utils/leadTimelineUtils";
import { toast } from "@/lib/toast";
import { copyToClipboard } from "@/lib/clipboard";

function WhatsAppIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.04 14.69 2 12.04 2M12.04 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.67 12.04 3.67M9.53 7.57C9.38 7.57 9.13 7.63 8.92 7.85C8.71 8.08 8.13 8.63 8.13 9.74C8.13 10.86 8.95 11.93 9.06 12.08C9.18 12.24 10.66 14.52 12.92 15.5C13.46 15.73 13.88 15.87 14.21 15.97C14.75 16.14 15.24 16.12 15.63 16.06C16.06 16 16.95 15.52 17.14 15C17.32 14.47 17.32 14.02 17.27 13.93C17.21 13.83 17.06 13.78 16.83 13.67C16.61 13.56 15.51 13.02 15.31 12.94C15.1 12.87 14.95 12.83 14.8 13.06C14.65 13.28 14.22 13.78 14.09 13.93C13.96 14.08 13.83 14.1 13.61 13.99C13.38 13.88 12.65 13.64 11.79 12.87C11.11 12.27 10.66 11.53 10.53 11.31C10.4 11.08 10.52 10.96 10.63 10.85C10.74 10.74 10.87 10.57 10.99 10.44C11.1 10.31 11.15 10.22 11.23 10.07C11.3 9.92 11.26 9.79 11.21 9.68C11.15 9.57 10.7 8.47 10.52 8C10.34 7.55 10.15 7.61 10.01 7.61C9.88 7.6 9.71 7.58 9.53 7.57Z" />
    </svg>
  );
}

interface LeadCardProps {
  lead: Lead;
  isSelected: boolean;
  isGloballyExpanded?: boolean;
  onSelect: (lead: Lead) => void;
  onOpenEstimate: (lead: Lead) => void;
  onOpenFullCard: (leadId: string) => void;
  onDeleteClick: (leadId: string, e: React.MouseEvent) => void;
  onRestoreLead?: (leadId: string, e: React.MouseEvent) => void;
}

export default function LeadCard({
  lead,
  isSelected,
  isGloballyExpanded = false,
  onSelect,
  onOpenEstimate,
  onOpenFullCard,
  onDeleteClick,
  onRestoreLead,
}: LeadCardProps) {
  const [isLocalExpanded, setIsLocalExpanded] = useState<boolean | null>(null);
  const [copiedAddress, setCopiedAddress] = useState(false);

  useEffect(() => {
    setIsLocalExpanded(null);
  }, [isGloballyExpanded]);

  const isExpanded = isLocalExpanded !== null ? isLocalExpanded : isGloballyExpanded;

  const status = STATUS_MAP[lead.status] || { 
    label: lead.status, 
    color: "text-slate-600 border-slate-200", 
    bg: "bg-slate-100" 
  };

  const timing = getLeadTimingInfo(lead.createdAt, lead.status, lead.appointmentDate, lead.deadline);

  const imagesCount = lead.files?.filter((f) => f.mimeType.startsWith("image/")).length || 0;
  const docsCount = lead.files?.filter((f) => !f.mimeType.startsWith("image/")).length || 0;
  const estimateItemsCount = lead.estimate?.items?.length || 0;

  const handleCopyAddress = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!lead.address) return;
    triggerHaptic("light");
    const ok = await copyToClipboard(lead.address);
    if (ok) {
      setCopiedAddress(true);
      toast.success("Адрес скопирован в буфер!");
      setTimeout(() => setCopiedAddress(false), 2000);
    } else {
      toast.error("Не удалось скопировать адрес");
    }
  };

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic("light");
    setIsLocalExpanded(!isExpanded);
  };

  const cleanPhone = lead.phone.replace(/[^0-9+]/g, "");

  return (
    <motion.div
      layout
      onClick={() => {
        triggerHaptic("light");
        onSelect(lead);
      }}
      className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer space-y-3 relative overflow-hidden ${
        isSelected 
          ? "bg-orange-50/40 border-orange-300 shadow-md shadow-orange-500/5" 
          : "bg-white border-slate-200 hover:border-slate-300 shadow-xs"
      }`}
    >
      {/* Акцентная левая полоска при горящем замере сегодня или просрочке */}
      {timing.isAppointmentToday && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 to-amber-500" />
      )}
      {timing.isLeadColdWarning && !timing.isAppointmentToday && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500" />
      )}

      {/* ── Этаж 1: Шапка (Имя + Время + Кнопка Раскрытия) ── */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-extrabold text-slate-900 text-base leading-snug break-words">
            {lead.name}
          </h3>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] text-slate-400 font-semibold pt-0.5" suppressHydrationWarning>
            {new Date(lead.createdAt).toLocaleDateString("ru-RU", {
              day: "2-digit",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>

          <button
            type="button"
            onClick={toggleExpand}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer active:scale-95"
            title={isExpanded ? "Свернуть карточку" : "Развернуть детали"}
          >
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </button>
        </div>
      </div>

      {/* ── Умные бейджи внимания (Замер сегодня / Остывающий лид / Дедлайн) ── */}
      {(timing.appointmentBadge || timing.isLeadColdWarning || timing.isFreshLead || timing.deadlineBadge) && (
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          {/* Бейдж замера / встречи */}
          {timing.appointmentBadge && (
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-black border shadow-2xs ${
                timing.appointmentBadge.variant === "today"
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-400 shadow-orange-500/20 animate-pulse"
                  : timing.appointmentBadge.variant === "tomorrow"
                  ? "bg-amber-50 text-amber-800 border-amber-200"
                  : timing.appointmentBadge.variant === "past"
                  ? "bg-slate-100 text-slate-600 border-slate-200"
                  : "bg-blue-50 text-blue-700 border-blue-200"
              }`}
            >
              <CalendarCheck className="w-3.5 h-3.5 shrink-0" />
              <span>{timing.appointmentBadge.text}</span>
            </span>
          )}

          {/* Индикатор остывания лида (>2 часов в статусе Новый) */}
          {timing.isLeadColdWarning && (
            <span 
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-extrabold animate-pulse"
              title="Заявка в статусе Новый более 2 часов без ответа"
            >
              <Flame className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span suppressHydrationWarning>Ждет ответа ({timing.timeSinceCreationStr})</span>
            </span>
          )}

          {/* Свежий лид (<2 часов) */}
          {timing.isFreshLead && !timing.appointmentBadge && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
              <Sparkles className="w-3 h-3 text-emerald-600 shrink-0" />
              <span suppressHydrationWarning>Свежий ({timing.timeSinceCreationStr})</span>
            </span>
          )}

          {/* Дедлайн сдачи проекта */}
          {timing.deadlineBadge && (
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl text-[11px] font-bold border ${
                timing.deadlineBadge.variant === "overdue"
                  ? "bg-rose-50 text-rose-700 border-rose-200"
                  : timing.deadlineBadge.variant === "today" || timing.deadlineBadge.variant === "urgent"
                  ? "bg-amber-50 text-amber-800 border-amber-200"
                  : "bg-slate-100 text-slate-600 border-slate-200"
              }`}
            >
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{timing.deadlineBadge.text}</span>
            </span>
          )}
        </div>
      )}

      {/* ── Этаж 2: Статус + Телефон (с WhatsApp) + Озвученная цена + Выручка ── */}
      <div className="flex flex-wrap items-center gap-2">
        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${status.color} ${status.bg}`}>
          {status.label}
        </span>

        <div className="inline-flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200/60 shadow-2xs">
          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <a
            href={`tel:${cleanPhone}`}
            onClick={(e) => {
              e.stopPropagation();
              triggerHaptic("light");
            }}
            className="text-slate-800 text-xs font-extrabold hover:text-orange-600 transition"
          >
            {lead.phone}
          </a>
          <a
            href={`https://wa.me/${cleanPhone.replace("+", "")}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
              triggerHaptic("light");
            }}
            className="ml-1 p-0.5 rounded-md hover:bg-emerald-100 text-emerald-600 transition flex items-center justify-center cursor-pointer"
            title="Написать в WhatsApp"
          >
            <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
          </a>
        </div>

        {/* Озвученная стоимость */}
        {lead.offeredPrice !== undefined && lead.offeredPrice !== null && lead.offeredPrice > 0 && (
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-black px-2.5 py-1 rounded-xl border ${
              lead.isDiscounted
                ? "bg-amber-50 text-amber-900 border-amber-200 shadow-2xs"
                : "bg-blue-50 text-blue-900 border-blue-200 shadow-2xs"
            }`}
            title={lead.isDiscounted ? "Озвученная стоимость (со скидкой)" : "Озвученная стоимость"}
          >
            <DollarSign className="w-3.5 h-3.5 opacity-70 shrink-0" />
            <span>Озвучено: {lead.offeredPrice.toLocaleString("ru")} ₸</span>
            {lead.isDiscounted && (
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-amber-200/90 text-amber-950 uppercase tracking-tight">
                🏷️ Скидка
              </span>
            )}
          </span>
        )}

        {lead.revenue > 0 && (
          <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-100">
            +{lead.revenue.toLocaleString("ru")} ₸
          </span>
        )}
      </div>

      {/* ── Этаж 3: HUD-ПОЛОСА СОСТОЯНИЯ ── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none select-none text-[11px]">
        {/* 📷 Фото / Эскизы */}
        {imagesCount > 0 ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200/80 font-bold shrink-0 shadow-2xs" title={`Фотографий и эскизов: ${imagesCount}`}>
            <ImageIcon className="w-3 h-3 text-blue-600 shrink-0" />
            <span>{imagesCount} фото</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl bg-slate-50 text-slate-400 border border-slate-200/60 font-semibold shrink-0 opacity-70" title="Фотографии еще не прикреплены">
            <ImageIcon className="w-3 h-3 text-slate-300 shrink-0" />
            <span>0 фото</span>
          </span>
        )}

        {/* 📄 Документы */}
        {docsCount > 0 ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200/80 font-bold shrink-0 shadow-2xs" title={`Документов и файлов: ${docsCount}`}>
            <FileText className="w-3 h-3 text-indigo-600 shrink-0" />
            <span>{docsCount} док</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl bg-slate-50 text-slate-400 border border-slate-200/60 font-semibold shrink-0 opacity-70" title="Документы не загружены">
            <FileText className="w-3 h-3 text-slate-300 shrink-0" />
            <span>0 док</span>
          </span>
        )}

        {/* 🧮 Смета */}
        {lead.estimate ? (
          <span 
            onClick={(e) => {
              e.stopPropagation();
              triggerHaptic("light");
              onOpenEstimate(lead);
            }}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold shrink-0 shadow-2xs transition cursor-pointer" 
            title={`Смета: ${estimateItemsCount} поз.`}
          >
            <Calculator className="w-3 h-3 text-purple-600 shrink-0" />
            <span>Смета ({estimateItemsCount})</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl bg-slate-50 text-slate-400 border border-slate-200/60 font-semibold shrink-0 opacity-70" title="Смета еще не рассчитана">
            <Calculator className="w-3 h-3 text-slate-300 shrink-0" />
            <span>Без сметы</span>
          </span>
        )}

        {/* 💬 Заметка */}
        {lead.comment ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/80 font-bold shrink-0 shadow-2xs" title={`Заметка: ${lead.comment}`}>
            <MessageSquare className="w-3 h-3 text-amber-600 shrink-0" />
            <span>Заметка</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl bg-slate-50 text-slate-400 border border-slate-200/60 font-semibold shrink-0 opacity-70" title="Заметка не оставлена">
            <MessageSquare className="w-3 h-3 text-slate-300 shrink-0" />
            <span>Без заметки</span>
          </span>
        )}

        {/* 📍 Адрес */}
        {lead.address ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-bold shrink-0 max-w-[140px] truncate shadow-2xs" title={`Адрес: ${lead.address}`}>
            <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
            <span className="truncate">{lead.address}</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl bg-slate-50 text-slate-400 border border-slate-200/60 font-semibold shrink-0 opacity-70" title="Адрес объекта не указан">
            <MapPin className="w-3 h-3 text-slate-300 shrink-0" />
            <span>Без адреса</span>
          </span>
        )}

        {/* 👤 Менеджер */}
        {lead.manager ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl bg-orange-50 text-orange-700 border border-orange-200/80 font-black shrink-0 shadow-2xs" title={`Ответственный: ${formatManagerName(lead.manager)}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
            <span>{formatManagerName(lead.manager)}</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl bg-slate-50 text-slate-400 border border-slate-200/60 font-semibold shrink-0 opacity-70" title="Ответственный менеджер не назначен">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
            <span>Не назначен</span>
          </span>
        )}
      </div>

      {/* ── Этаж 4: Раскрывающийся аккордеон с подробной информацией ── */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="space-y-2.5 pt-2 border-t border-slate-100 overflow-hidden"
          >
            {/* Полный адрес объекта */}
            {lead.address ? (
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 min-w-0">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      Адрес объекта
                    </span>
                    <p className="text-xs font-bold text-slate-800 break-words select-text">
                      {lead.address}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={handleCopyAddress}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 transition shadow-2xs cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                    title="Скопировать адрес"
                  >
                    {copiedAddress ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{copiedAddress ? "Скопировано" : "Копия"}</span>
                  </button>
                  <a
                    href={`https://2gis.kz/astana/search/${encodeURIComponent(lead.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200/80 transition shadow-2xs flex items-center gap-1 text-[11px] font-bold"
                    title="Открыть в 2GIS"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">2GIS</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50/60 px-3 py-2 rounded-xl border border-dashed border-slate-200 text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-300" />
                <span>Адрес объекта не указан</span>
              </div>
            )}

            {/* Исходный запрос с сайта */}
            {lead.message && (
              <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-200/60 space-y-1">
                <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider flex items-center gap-1">
                  <FileText className="w-3 h-3 text-amber-600" />
                  Запрос с сайта
                </span>
                <p className="text-xs font-semibold text-slate-800 leading-relaxed break-words whitespace-pre-wrap">
                  {lead.message}
                </p>
              </div>
            )}

            {/* Заметка менеджера */}
            {lead.comment && (
              <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-200/60 space-y-1">
                <span className="text-[10px] font-extrabold text-blue-700 uppercase tracking-wider flex items-center gap-1">
                  <MessageSquare className="w-3 h-3 text-blue-600" />
                  Заметка менеджера
                </span>
                <p className="text-xs font-bold text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {lead.comment}
                </p>
              </div>
            )}

            {/* Замер и Дедлайн монтажа */}
            {(lead.appointmentDate || lead.deadline || lead.manager) && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                {lead.appointmentDate && (
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/70">
                    <span className="block text-[9px] font-extrabold text-slate-400 uppercase">Выезд / Замер</span>
                    <span className="font-bold text-slate-800">
                      {new Date(lead.appointmentDate).toLocaleString("ru-RU", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                  </div>
                )}

                {lead.deadline && (
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/70">
                    <span className="block text-[9px] font-extrabold text-slate-400 uppercase">Срок сдачи</span>
                    <span className="font-bold text-slate-800">
                      {new Date(lead.deadline).toLocaleDateString("ru-RU", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      })}
                    </span>
                  </div>
                )}

                {lead.manager && (
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/70">
                    <span className="block text-[9px] font-extrabold text-slate-400 uppercase">Ответственный</span>
                    <span className="font-extrabold text-orange-700">
                      {formatManagerName(lead.manager)}
                    </span>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Этаж 5: Кнопки действий на нижней панели ── */}
      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {(lead.status === "CANCELLED" || lead.status === "UNPROCESSED") && onRestoreLead ? (
            <button
              type="button"
              onClick={(e) => onRestoreLead(lead.id, e)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition cursor-pointer active:scale-95 shadow-2xs"
              title="Восстановить сделку в активную воронку"
            >
              <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
              <span>Восстановить в работу</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                triggerHaptic("light");
                onOpenEstimate(lead);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200/70 transition cursor-pointer active:scale-95"
              title="Открыть / составить смету"
            >
              <Calculator className="w-3.5 h-3.5 text-purple-600" />
              <span>{LEADS_DICTIONARY.card.estimateBtn}</span>
            </button>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              triggerHaptic("light");
              onOpenFullCard(lead.id);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-slate-900 hover:bg-slate-800 text-white transition cursor-pointer shadow-xs active:scale-95"
            title="Открыть карточку и файлы проекта"
          >
            <FolderOpen className="w-3.5 h-3.5 text-orange-400" />
            <span>{LEADS_DICTIONARY.card.cardBtn}</span>
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={(e) => onDeleteClick(lead.id, e)}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer active:scale-95"
            title={LEADS_DICTIONARY.card.deleteTooltip}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
