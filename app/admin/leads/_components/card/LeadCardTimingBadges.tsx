"use client";

import React from "react";
import { CalendarCheck, Flame, Sparkles, AlertCircle } from "lucide-react";
import { LeadTimingInfo } from "../../_utils/leadTimelineUtils";

interface LeadCardTimingBadgesProps {
  timing: LeadTimingInfo;
}

export default function LeadCardTimingBadges({ timing }: LeadCardTimingBadgesProps) {
  const hasBadges =
    timing.isAppointmentToday ||
    timing.isLeadColdWarning ||
    timing.isFreshLead ||
    Boolean(timing.deadlineBadge);

  if (!hasBadges) return null;

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {/* 1. ГОРЯЩИЙ ЗАМЕР СЕГОДНЯ */}
      {timing.isAppointmentToday && (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs animate-pulse">
          <CalendarCheck className="w-3 h-3" />
          Замер сегодня
        </span>
      )}

      {/* 2. ОСТЫВАЮЩИЙ ЛИД (>2 часов без ответа) */}
      {timing.isLeadColdWarning && !timing.isAppointmentToday && (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-600 border border-rose-200">
          <Flame className="w-3 h-3 text-rose-500 animate-bounce" />
          Ждет ответа {timing.timeSinceCreationStr}
        </span>
      )}

      {/* 3. СВЕЖИЙ ЛИД */}
      {timing.isFreshLead && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-200">
          <Sparkles className="w-3 h-3 text-emerald-500" />
          Новый ({timing.timeSinceCreationStr})
        </span>
      )}

      {/* 4. ДЕДЛАЙН */}
      {timing.deadlineBadge && (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
            timing.deadlineBadge.variant === "overdue"
              ? "bg-rose-100 text-rose-700 border-rose-300"
              : timing.deadlineBadge.variant === "today"
              ? "bg-amber-50 text-amber-700 border-amber-300"
              : "bg-slate-100 text-slate-700 border-slate-200"
          }`}
        >
          <AlertCircle className="w-3 h-3" />
          {timing.deadlineBadge.text}
        </span>
      )}
    </div>
  );
}
