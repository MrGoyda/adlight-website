"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { triggerHaptic } from "@/lib/haptics";
import { toast } from "@/lib/toast";
import { STATUS_MAP, LEADS_DICTIONARY } from "../_data/leadsDictionary";
import { Lead } from "../_types/leadTypes";
import { LeadStatus } from "@prisma/client";
import { getLeadTimingInfo } from "../_utils/leadTimelineUtils";
import { parseLeadMetadata } from "../_utils/leadMetaUtils";
import { SIGN_TYPES } from "../_data/leadDetailDictionary";
import { getWhatsAppUrl } from "@/lib/phoneUtils";
import { updateLeadComment, updateLeadStatus } from "../actions";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { 
  Phone, 
  Crown, 
  AlertCircle, 
  Calculator, 
  Copy, 
  FileText, 
  ArrowRight, 
  Check,
  RotateCcw,
  Trash2 
} from "lucide-react";

interface LeadCardProps {
  lead: Lead;
  isSelected: boolean;
  isGloballyExpanded?: boolean;
  duplicateCount?: number;
  onFilterDuplicatePhone?: (phone: string) => void;
  onSelect: (lead: Lead) => void;
  onOpenEstimate?: (lead: Lead) => void;
  onOpenFullCard?: (leadId: string) => void;
  onDeleteClick?: (leadId: string, e: React.MouseEvent, isPermanent?: boolean) => void;
  onRestoreLead?: (leadId: string, e: React.MouseEvent) => void;
  onRestoreFromTrash?: (leadId: string, e: React.MouseEvent) => void;
  onStatusChangeQuick?: (leadId: string, status: LeadStatus) => void;
  isBatchSelected?: boolean;
  onToggleBatchSelect?: (leadId: string, e: React.MouseEvent) => void;
  isBatchSelectionActive?: boolean;
}

function LeadCard({
  lead,
  isSelected,
  duplicateCount = 0,
  onFilterDuplicatePhone,
  onSelect,
  onDeleteClick,
  onRestoreLead,
  onRestoreFromTrash,
  onStatusChangeQuick,
  isBatchSelected = false,
  onToggleBatchSelect,
  isBatchSelectionActive = false,
}: LeadCardProps) {
  const router = useRouter();
  const dict = LEADS_DICTIONARY.card;
  const toasts = LEADS_DICTIONARY.toasts;

  const [isEditingNote, setIsEditingNote] = useState(false);
  const [quickNote, setQuickNote] = useState(lead.comment || "");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const status = STATUS_MAP[lead.status] || {
    label: lead.status,
    color: "text-slate-600 border-slate-200",
    bg: "bg-slate-100",
  };

  const timing = useMemo(
    () => getLeadTimingInfo(lead.createdAt, lead.status, lead.appointmentDate, lead.deadline),
    [lead.createdAt, lead.status, lead.appointmentDate, lead.deadline]
  );

  // Извлекаем краткую суть конструкции из метаданных или calcDetails
  const meta = useMemo(() => parseLeadMetadata(lead.calcDetails), [lead.calcDetails]);
  
  const constructionSummary = useMemo(() => {
    const techSpec = meta.techSpec;
    if (techSpec?.items && techSpec.items.length > 0) {
      const first = techSpec.items[0];
      const signTypeLabel = SIGN_TYPES.find((s) => s.id === first.signType)?.label || first.title || dict.defaultConstruction;
      const dim = first.lengthMm && first.heightMm ? ` ${first.lengthMm}×${first.heightMm} мм` : "";
      return `${signTypeLabel}${dim}`;
    }
    if (techSpec?.signTypes && techSpec.signTypes.length > 0) {
      const signTypeLabel = SIGN_TYPES.find((s) => s.id === techSpec.signTypes?.[0])?.label || dict.defaultConstruction;
      return signTypeLabel;
    }
    if (lead.address) return lead.address;
    if (lead.source) return lead.source;
    return dict.defaultConstruction;
  }, [meta.techSpec, lead.address, lead.source, dict.defaultConstruction]);

  const cleanPhone = useMemo(() => (lead.phone || "").replace(/[^0-9+]/g, ""), [lead.phone]);
  const amount = lead.offeredPrice || lead.revenue || 0;

  // 1. Быстрый клик по WhatsApp
  const handleWhatsAppClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic("light");
    const waUrl = getWhatsAppUrl(
      lead.phone || "",
      `Здравствуйте, ${lead.name || LEADS_DICTIONARY.table.whatsAppGreeting}! По вашей заявке на изготовление вывески в компании ADLight:`
    );
    if (waUrl) window.open(waUrl, "_blank");
  }, [lead.phone, lead.name]);

  // 2. Быстрый звонок
  const handleCallClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic("light");
    if (cleanPhone) {
      window.location.href = `tel:${cleanPhone}`;
    }
  }, [cleanPhone]);

  // 3. Копирование номера в буфер обмена в 1 клик
  const handleCopyPhone = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!cleanPhone) return;
    triggerHaptic("success");
    navigator.clipboard.writeText(cleanPhone);
    toast.success(`${toasts.phoneCopied}: ${cleanPhone}`);
  }, [cleanPhone, toasts.phoneCopied]);

  // 4. Прямой переход в калькулятор сметы
  const handleOpenCalculator = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic("light");
    router.push(`/admin/calculator?leadId=${lead.id}`);
  }, [lead.id, router]);

  // 5. Быстрый переход на следующий этап воронки
  const getNextStage = useCallback((current: LeadStatus) => {
    switch (current) {
      case "NEW":
        return { next: LeadStatus.ESTIMATE, label: dict.quickAdvanceEstimate, icon: <ArrowRight className="w-3 h-3" /> };
      case "IN_PROGRESS":
      case "ESTIMATE":
        return { next: LeadStatus.PROCESSED, label: dict.quickAdvanceProduction, icon: <ArrowRight className="w-3 h-3" /> };
      case "PROCESSED":
        return { next: LeadStatus.COMPLETED, label: dict.quickAdvanceComplete, icon: <Check className="w-3 h-3" /> };
      default:
        return null;
    }
  }, [dict.quickAdvanceEstimate, dict.quickAdvanceProduction, dict.quickAdvanceComplete]);

  const nextStage = getNextStage(lead.status);

  const handleAdvanceStage = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!nextStage || isUpdatingStatus) return;

    triggerHaptic("medium");
    setIsUpdatingStatus(true);

    if (onStatusChangeQuick) {
      onStatusChangeQuick(lead.id, nextStage.next);
    } else {
      const res = await updateLeadStatus(lead.id, nextStage.next);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(`${toasts.stageUpdated}: ${STATUS_MAP[nextStage.next]?.label || nextStage.next}`);
        router.refresh();
      }
    }
    setIsUpdatingStatus(false);
  }, [nextStage, isUpdatingStatus, onStatusChangeQuick, lead.id, toasts.stageUpdated, router]);

  // 6. Сохранение быстрой заметки
  const handleSaveNote = useCallback(async () => {
    setIsEditingNote(false);
    if (quickNote.trim() === (lead.comment || "").trim()) return;

    triggerHaptic("medium");
    const res = await updateLeadComment(lead.id, quickNote);
    if (res.success) {
      toast.success(toasts.noteSaved);
      router.refresh();
    } else {
      toast.error(res.error || toasts.noteSaveError);
    }
  }, [quickNote, lead.comment, lead.id, toasts.noteSaved, toasts.noteSaveError, router]);

  return (
    <div
      draggable={!lead.deletedAt}
      onDragStart={(e) => {
        if (lead.deletedAt) return;
        e.dataTransfer.setData("text/plain", lead.id);
        e.dataTransfer.effectAllowed = "move";
        triggerHaptic("medium");
      }}
      onClick={() => {
        triggerHaptic("light");
        onSelect(lead);
      }}
      className={`group relative bg-white rounded-2xl p-3 border transition-all duration-150 ease-out cursor-pointer select-none overflow-hidden ${
        isBatchSelected
          ? "border-orange-500 bg-orange-50/20 ring-2 ring-orange-500/20 shadow-xs"
          : isSelected
          ? "border-orange-500 shadow-md ring-2 ring-orange-500/10"
          : "border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-xs"
      }`}
    >
      {/* Акцентная левая полоска при горящем замере сегодня или остывающем лиде */}
      {timing.isAppointmentToday && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 to-amber-500" />
      )}
      {timing.isLeadColdWarning && !timing.isAppointmentToday && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500" />
      )}

      {/* ── СТРОКА 1: Чекбокс выбора + Имя клиента + Рейтинг VIP + Дата + Аватар менеджера ── */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          {onToggleBatchSelect && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                triggerHaptic("light");
                onToggleBatchSelect(lead.id, e);
              }}
              className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                isBatchSelected
                  ? "bg-orange-600 border-orange-600 text-white opacity-100"
                  : isBatchSelectionActive
                  ? "border-slate-300 bg-white opacity-100 hover:border-orange-400"
                  : "border-slate-300 bg-white opacity-0 group-hover:opacity-100 hover:border-orange-400"
              }`}
              title="Выбрать заявку для массовых действий"
            >
              {isBatchSelected && <Check className="w-3 h-3 stroke-[3]" />}
            </button>
          )}

          <span className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
            {lead.name || LEADS_DICTIONARY.table.noName}
          </span>
          {lead.rating === "EASY" && (
            <span title="VIP Заказчик" className="inline-flex shrink-0">
              <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
            </span>
          )}
          {lead.rating === "PROBLEM" && (
            <span title="Сложный клиент" className="inline-flex shrink-0">
              <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] text-slate-400 font-semibold" suppressHydrationWarning>
            {timing.timeSinceCreationStr || dict.recentTimeDefault}
          </span>

          {/* Аватар ответственного менеджера */}
          {lead.manager === "ELISEY" && (
            <span
              className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 font-extrabold text-[10px] flex items-center justify-center border border-orange-200"
              title="Ответственный: Елисей"
            >
              Е
            </span>
          )}
          {lead.manager === "DANIIL" && (
            <span
              className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-extrabold text-[10px] flex items-center justify-center border border-blue-200"
              title="Ответственный: Даниил"
            >
              Д
            </span>
          )}
        </div>
      </div>

      {/* ── СТРОКА 2: Тип конструкции / объект + Статус ── */}
      <div className="my-1.5 flex items-center justify-between gap-2 min-w-0">
        <p className="text-[11px] text-slate-500 font-medium truncate flex-1">
          {constructionSummary}
        </p>
        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border shrink-0 ${status.color} ${status.bg}`}>
          {status.label}
        </span>
      </div>

      {/* ── СТРОКА 2.1: Бейджи дубликата и причины отказа ── */}
      {(duplicateCount > 1 || lead.rejectionReason) && (
        <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
          {duplicateCount > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onFilterDuplicatePhone?.(cleanPhone);
              }}
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-purple-50 hover:bg-purple-100 text-purple-700 text-[10px] font-bold border border-purple-200 transition"
              title={`${LEADS_DICTIONARY.duplicates.filterTitle} ${duplicateCount}`}
            >
              <span>🔁 {LEADS_DICTIONARY.duplicates.badge} ({duplicateCount})</span>
            </button>
          )}

          {lead.rejectionReason && (
            <span 
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200 truncate max-w-full"
              title={lead.rejectionReason}
            >
              🏷️ {lead.rejectionReason}
            </span>
          )}
        </div>
      )}

      {/* ── СТРОКА 2.5: Быстрая заметка менеджера (если есть или редактируется) ── */}
      <div
        className="mb-2"
        onClick={(e) => e.stopPropagation()}
      >
        {isEditingNote ? (
          <div className="flex items-center gap-1.5 pt-0.5">
            <input
              type="text"
              autoFocus
              value={quickNote}
              onChange={(e) => setQuickNote(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveNote();
                if (e.key === "Escape") setIsEditingNote(false);
              }}
              onBlur={handleSaveNote}
              placeholder={dict.notePlaceholder}
              className="w-full text-[11px] px-2 py-1 bg-amber-50/60 border border-amber-300 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        ) : (
          <div className="flex items-center justify-between gap-1 text-[10px] text-slate-400">
            {lead.comment ? (
              <span
                onClick={() => {
                  triggerHaptic("light");
                  setIsEditingNote(true);
                }}
                className="truncate text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60 max-w-[220px]"
                title={dict.addNoteHint}
              >
                💬 {lead.comment}
              </span>
            ) : (
              <button
                type="button"
                onClick={() => {
                  triggerHaptic("light");
                  setIsEditingNote(true);
                }}
                className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50 px-1.5 py-0.5 rounded transition"
                title={dict.addNoteHint}
              >
                <FileText className="w-3 h-3" />
                <span>{dict.noteBadge}</span>
              </button>
            )}

            {/* Копировать телефон */}
            {cleanPhone && (
              <button
                type="button"
                onClick={handleCopyPhone}
                className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-700 font-mono text-[10px] hover:underline"
                title={LEADS_DICTIONARY.table.copyPhoneTooltip}
              >
                <span>{cleanPhone}</span>
                <Copy className="w-2.5 h-2.5 opacity-60" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── СТРОКА 3: Сумма сделки + Быстрый следующий этап + Действия (Калькулятор / WA / Звонок) ── */}
      {lead.deletedAt ? (
        <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-slate-100/80">
          <span className="text-[10px] font-black text-rose-500 uppercase tracking-wider">
            В корзине
          </span>

          <div className="flex items-center gap-1.5">
            {onRestoreFromTrash && (
              <button
                type="button"
                onClick={(e) => onRestoreFromTrash(lead.id, e)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-black bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition active:scale-95"
                title={LEADS_DICTIONARY.trash.restoreBtn}
              >
                <RotateCcw className="w-3 h-3" />
                <span>{LEADS_DICTIONARY.trash.restoreBtn}</span>
              </button>
            )}

            {onDeleteClick && (
              <button
                type="button"
                onClick={(e) => onDeleteClick(lead.id, e, true)}
                className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition active:scale-95"
                title={LEADS_DICTIONARY.trash.permanentDeleteBtn}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      ) : (lead.status === "CANCELLED" || lead.status === "UNPROCESSED") ? (
        <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-slate-100/80">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-xs sm:text-sm font-black text-slate-900 tracking-tight whitespace-nowrap">
              {amount > 0 ? `${amount.toLocaleString("ru")} ₸` : "— ₸"}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {onRestoreLead && (
              <button
                type="button"
                onClick={(e) => onRestoreLead(lead.id, e)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-black bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition active:scale-95"
                title="Вернуть в работу"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Восстановить</span>
              </button>
            )}

            {onDeleteClick && (
              <button
                type="button"
                onClick={(e) => onDeleteClick(lead.id, e, false)}
                className="p-1.5 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 transition active:scale-95"
                title="В корзину"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100/80">
          {/* Сумма и статус оплаты */}
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-xs sm:text-sm font-black text-slate-900 tracking-tight whitespace-nowrap">
              {amount > 0 ? `${amount.toLocaleString("ru")} ₸` : "— ₸"}
            </span>

            {lead.isBalancePaid && (
              <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 text-[9px] font-extrabold border border-emerald-200 shrink-0">
                100%
              </span>
            )}
            {!lead.isBalancePaid && lead.isPrepaymentPaid && (
              <span className="px-1.5 py-0.2 rounded bg-teal-50 text-teal-700 text-[9px] font-extrabold border border-teal-200 shrink-0">
                {LEADS_DICTIONARY.drawer.prepayment}
              </span>
            )}
          </div>

          {/* Быстрые действия */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Быстрый перевод на следующий этап воронки */}
            {nextStage && (
              <button
                type="button"
                onClick={handleAdvanceStage}
                disabled={isUpdatingStatus}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-xl text-[10px] font-black bg-slate-50 hover:bg-orange-50 text-slate-700 hover:text-orange-700 border border-slate-200 hover:border-orange-200 transition cursor-pointer active:scale-95"
                title={`${LEADS_DICTIONARY.toasts.stageUpdated}: ${nextStage.label}`}
              >
                <span>{nextStage.label}</span>
                {nextStage.icon}
              </button>
            )}

            {/* Быстрый переход в Калькулятор сметы */}
            <button
              type="button"
              onClick={handleOpenCalculator}
              className="w-7 h-7 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-600 flex items-center justify-center transition active:scale-90 border border-orange-200/60"
              title={LEADS_DICTIONARY.table.calcTooltip}
            >
              <Calculator className="w-3.5 h-3.5" />
            </button>

            {/* Звонок */}
            {cleanPhone && (
              <button
                type="button"
                onClick={handleCallClick}
                className="w-7 h-7 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center transition active:scale-90 border border-blue-200/60"
                title={`${LEADS_DICTIONARY.table.callTooltip}: ${lead.phone}`}
              >
                <Phone className="w-3.5 h-3.5" />
              </button>
            )}

            {/* WhatsApp */}
            <button
              type="button"
              onClick={handleWhatsAppClick}
              className="w-7 h-7 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center transition active:scale-90 border border-emerald-200/60"
              title={LEADS_DICTIONARY.table.whatsAppTooltip}
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
            </button>

            {/* В корзину */}
            {onDeleteClick && (
              <button
                type="button"
                onClick={(e) => onDeleteClick(lead.id, e, false)}
                className="w-7 h-7 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition active:scale-90 border border-slate-200/60"
                title="Переместить в корзину"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function areLeadCardPropsEqual(prev: LeadCardProps, next: LeadCardProps): boolean {
  return (
    prev.lead.id === next.lead.id &&
    prev.lead.status === next.lead.status &&
    prev.lead.comment === next.lead.comment &&
    prev.lead.rating === next.lead.rating &&
    prev.lead.revenue === next.lead.revenue &&
    prev.lead.offeredPrice === next.lead.offeredPrice &&
    prev.lead.isDiscounted === next.lead.isDiscounted &&
    prev.lead.isPrepaymentPaid === next.lead.isPrepaymentPaid &&
    prev.lead.isBalancePaid === next.lead.isBalancePaid &&
    prev.lead.appointmentDate === next.lead.appointmentDate &&
    prev.lead.deadline === next.lead.deadline &&
    prev.lead.manager === next.lead.manager &&
    prev.lead.rejectionReason === next.lead.rejectionReason &&
    prev.lead.deletedAt === next.lead.deletedAt &&
    prev.isSelected === next.isSelected &&
    prev.isBatchSelected === next.isBatchSelected &&
    prev.isBatchSelectionActive === next.isBatchSelectionActive &&
    prev.duplicateCount === next.duplicateCount
  );
}

export default React.memo(LeadCard, areLeadCardPropsEqual);
