"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { triggerHaptic } from "@/lib/haptics";
import { toast } from "@/lib/toast";
import { STATUS_MAP } from "../_data/leadsDictionary";
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
  Check 
} from "lucide-react";

interface LeadCardProps {
  lead: Lead;
  isSelected: boolean;
  isGloballyExpanded?: boolean;
  onSelect: (lead: Lead) => void;
  onOpenEstimate?: (lead: Lead) => void;
  onOpenFullCard?: (leadId: string) => void;
  onDeleteClick?: (leadId: string, e: React.MouseEvent) => void;
  onRestoreLead?: (leadId: string, e: React.MouseEvent) => void;
  onStatusChangeQuick?: (leadId: string, status: LeadStatus) => void;
}

export default function LeadCard({
  lead,
  isSelected,
  onSelect,
  onStatusChangeQuick,
}: LeadCardProps) {
  const router = useRouter();

  const [isEditingNote, setIsEditingNote] = useState(false);
  const [quickNote, setQuickNote] = useState(lead.comment || "");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const status = STATUS_MAP[lead.status] || {
    label: lead.status,
    color: "text-slate-600 border-slate-200",
    bg: "bg-slate-100",
  };

  const timing = getLeadTimingInfo(
    lead.createdAt,
    lead.status,
    lead.appointmentDate,
    lead.deadline
  );

  // Извлекаем краткую суть конструкции из метаданных или calcDetails
  const meta = parseLeadMetadata(lead.calcDetails);
  const techSpec = meta.techSpec;
  
  let constructionSummary = "";
  if (techSpec?.items && techSpec.items.length > 0) {
    const first = techSpec.items[0];
    const signTypeLabel = SIGN_TYPES.find((s) => s.id === first.signType)?.label || first.title || "Вывеска";
    const dim = first.lengthMm && first.heightMm ? ` ${first.lengthMm}×${first.heightMm} мм` : "";
    constructionSummary = `${signTypeLabel}${dim}`;
  } else if (techSpec?.signTypes && techSpec.signTypes.length > 0) {
    const signTypeLabel = SIGN_TYPES.find((s) => s.id === techSpec.signTypes?.[0])?.label || "Вывеска";
    constructionSummary = signTypeLabel;
  } else if (lead.address) {
    constructionSummary = lead.address;
  } else if (lead.source) {
    constructionSummary = lead.source;
  } else {
    constructionSummary = "Рекламная конструкция";
  }

  const cleanPhone = (lead.phone || "").replace(/[^0-9+]/g, "");
  const amount = lead.offeredPrice || lead.revenue || 0;

  // 1. Быстрый клик по WhatsApp
  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic("light");
    const waUrl = getWhatsAppUrl(
      lead.phone || "",
      `Здравствуйте, ${lead.name || "клиент"}! По вашей заявке на изготовление вывески в компании ADLight:`
    );
    if (waUrl) window.open(waUrl, "_blank");
  };

  // 2. Быстрый звонок
  const handleCallClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic("light");
    if (cleanPhone) {
      window.location.href = `tel:${cleanPhone}`;
    }
  };

  // 3. Копирование номера в буфер обмена в 1 клик
  const handleCopyPhone = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!cleanPhone) return;
    triggerHaptic("success");
    navigator.clipboard.writeText(cleanPhone);
    toast.success(`Номер скопирован: ${cleanPhone}`);
  };

  // 4. Прямой переход в калькулятор сметы
  const handleOpenCalculator = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic("light");
    router.push(`/admin/calculator?leadId=${lead.id}`);
  };

  // 5. Быстрый переход на следующий этап воронки
  const getNextStage = (current: LeadStatus) => {
    switch (current) {
      case "NEW":
        return { next: LeadStatus.ESTIMATE, label: "В смету", icon: <ArrowRight className="w-3 h-3" /> };
      case "IN_PROGRESS":
      case "ESTIMATE":
        return { next: LeadStatus.PROCESSED, label: "В цех", icon: <ArrowRight className="w-3 h-3" /> };
      case "PROCESSED":
        return { next: LeadStatus.COMPLETED, label: "Сдан", icon: <Check className="w-3 h-3" /> };
      default:
        return null;
    }
  };

  const nextStage = getNextStage(lead.status);

  const handleAdvanceStage = async (e: React.MouseEvent) => {
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
        toast.success(`Сделка переведена: ${STATUS_MAP[nextStage.next]?.label || nextStage.next}`);
        router.refresh();
      }
    }
    setIsUpdatingStatus(false);
  };

  // 6. Сохранение быстрой заметки
  const handleSaveNote = async () => {
    setIsEditingNote(false);
    if (quickNote.trim() === (lead.comment || "").trim()) return;

    triggerHaptic("medium");
    const res = await updateLeadComment(lead.id, quickNote);
    if (res.success) {
      toast.success("Заметка обновлена");
      router.refresh();
    } else {
      toast.error(res.error || "Ошибка сохранения");
    }
  };

  return (
    <motion.div
      layout
      onClick={() => {
        triggerHaptic("light");
        onSelect(lead);
      }}
      className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[120px] select-none ${
        isSelected
          ? "bg-orange-50/30 border-orange-400 ring-2 ring-orange-500/20 shadow-sm"
          : "bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-2xs active:bg-slate-50/50"
      }`}
    >
      {/* Акцентная левая полоска при горящем замере сегодня или остывающем лиде */}
      {timing.isAppointmentToday && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 to-amber-500" />
      )}
      {timing.isLeadColdWarning && !timing.isAppointmentToday && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500" />
      )}

      {/* ── СТРОКА 1: Имя клиента + Рейтинг VIP + Дата + Аватар менеджера ── */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
            {lead.name || "Без имени"}
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
            {timing.timeSinceCreationStr || "Недавно"}
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
              placeholder="Заметка к сделке..."
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
                title="Нажмите чтобы изменить заметку"
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
                title="Добавить быструю заметку"
              >
                <FileText className="w-3 h-3" />
                <span>Заметка</span>
              </button>
            )}

            {/* Копировать телефон */}
            {cleanPhone && (
              <button
                type="button"
                onClick={handleCopyPhone}
                className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-700 font-mono text-[10px] hover:underline"
                title="Скопировать номер"
              >
                <span>{cleanPhone}</span>
                <Copy className="w-2.5 h-2.5 opacity-60" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── СТРОКА 3: Сумма сделки + Быстрый следующий этап + Действия (Калькулятор / WA / Звонок) ── */}
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
              Аванс
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
              title={`Перевести на этап: ${nextStage.label}`}
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
            title="Открыть смету в Калькуляторе"
          >
            <Calculator className="w-3.5 h-3.5" />
          </button>

          {/* Звонок */}
          {cleanPhone && (
            <button
              type="button"
              onClick={handleCallClick}
              className="w-7 h-7 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center transition active:scale-90 border border-blue-200/60"
              title={`Позвонить клиенту: ${lead.phone}`}
            >
              <Phone className="w-3.5 h-3.5" />
            </button>
          )}

          {/* WhatsApp */}
          <button
            type="button"
            onClick={handleWhatsAppClick}
            className="w-7 h-7 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center transition active:scale-90 border border-emerald-200/60"
            title="Написать в WhatsApp"
          >
            <WhatsAppIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
