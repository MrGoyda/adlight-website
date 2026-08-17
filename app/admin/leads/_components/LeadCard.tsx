"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { triggerHaptic } from "@/lib/haptics";
import { STATUS_MAP } from "../_data/leadsDictionary";
import { Lead } from "../_types/leadTypes";
import { getLeadTimingInfo } from "../_utils/leadTimelineUtils";

import LeadCardHeader from "./card/LeadCardHeader";
import LeadCardTimingBadges from "./card/LeadCardTimingBadges";
import LeadCardContactRow from "./card/LeadCardContactRow";
import LeadCardHudBar from "./card/LeadCardHudBar";
import LeadCardAccordionContent from "./card/LeadCardAccordionContent";
import LeadCardActionBar from "./card/LeadCardActionBar";

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

  useEffect(() => {
    setIsLocalExpanded(null);
  }, [isGloballyExpanded]);

  const isExpanded = isLocalExpanded !== null ? isLocalExpanded : isGloballyExpanded;

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

  const imagesCount =
    lead.files?.filter((f) => f.mimeType.startsWith("image/")).length || 0;
  const docsCount =
    lead.files?.filter((f) => !f.mimeType.startsWith("image/")).length || 0;
  const estimateItemsCount = lead.estimate?.items?.length || 0;

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic("light");
    setIsLocalExpanded(!isExpanded);
  };

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
      <LeadCardHeader
        name={lead.name}
        createdAt={lead.createdAt}
        isExpanded={isExpanded}
        onToggleExpand={toggleExpand}
      />

      {/* ── Смарт-бейджи внимания (Замер сегодня / Остывающий лид / Свежий / Дедлайн) ── */}
      <LeadCardTimingBadges timing={timing} />

      {/* ── Этаж 2: Статус + Телефон + WhatsApp + Озвучено со скидкой + Выручка ── */}
      <LeadCardContactRow
        status={status}
        source={lead.source}
        phone={lead.phone}
        offeredPrice={lead.offeredPrice}
        isDiscounted={lead.isDiscounted}
        revenue={lead.revenue}
      />

      {/* ── Этаж 3: Полоса 6 индикаторов (HUD) в 1 ряд ── */}
      <LeadCardHudBar
        imagesCount={imagesCount}
        docsCount={docsCount}
        estimateItemsCount={estimateItemsCount}
        hasComment={Boolean(lead.comment)}
        hasAddress={Boolean(lead.address)}
        manager={lead.manager}
      />

      {/* ── Этаж 4: Разворачиваемый аккордеон с адресом, кнопками 2GIS/Копия, заметкой и датами ── */}
      <LeadCardAccordionContent
        isExpanded={isExpanded}
        address={lead.address}
        message={lead.message}
        comment={lead.comment}
        appointmentDate={lead.appointmentDate}
        deadline={lead.deadline}
        manager={lead.manager}
      />

      {/* ── Этаж 5: Нижняя панель действий (Смета, Карточка, Удаление) ── */}
      <LeadCardActionBar
        lead={lead}
        onOpenEstimate={onOpenEstimate}
        onOpenFullCard={onOpenFullCard}
        onDeleteClick={onDeleteClick}
        onRestoreLead={onRestoreLead}
      />
    </motion.div>
  );
}
