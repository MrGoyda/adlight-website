"use client";

import React from "react";
import { Sparkles, AlertCircle, ChevronDown, Trash2, RotateCcw } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { Lead } from "../../_types/leadTypes";
import { StatusConfig } from "../../_data/leadsDictionary";
import { LeadTimingInfo } from "../../_utils/leadTimelineUtils";

interface LeadCardHeaderProps {
  lead: Lead;
  status: StatusConfig;
  timing: LeadTimingInfo;
  isExpanded: boolean;
  onToggleExpand: (e: React.MouseEvent) => void;
  onDeleteClick: (leadId: string, e: React.MouseEvent) => void;
  onRestoreLead?: (leadId: string, e: React.MouseEvent) => void;
}

export default function LeadCardHeader({
  lead,
  status,
  timing,
  isExpanded,
  onToggleExpand,
  onDeleteClick,
  onRestoreLead,
}: LeadCardHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3">
      {/* Левая колонка: Статус + Клиент */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          {/* Бейдж статуса сделки */}
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider border shadow-2xs ${status.bg} ${status.color}`}
          >
            {status.label}
          </span>

          {/* Маркер источника (Сайт/Вручную) */}
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            {lead.source || "Сайт"}
          </span>
        </div>

        {/* Имя клиента */}
        <h3 className="font-black text-slate-900 text-base sm:text-lg leading-tight truncate">
          {lead.name}
        </h3>
      </div>

      {/* Правая колонка: Тайминг + Действия */}
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <div className="flex items-center gap-1">
          {/* Индикатор удаления / восстановления */}
          {lead.status === "CANCELLED" && onRestoreLead ? (
            <button
              onClick={(e) => onRestoreLead(lead.id, e)}
              className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition cursor-pointer"
              title="Восстановить заявку"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={(e) => onDeleteClick(lead.id, e)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
              title="Удалить заявку"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Стрелка раскрытия аккордеона */}
          <button
            onClick={onToggleExpand}
            className={`p-1.5 rounded-xl border border-slate-200/80 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-all cursor-pointer ${
              isExpanded ? "rotate-180 bg-orange-50 text-orange-600 border-orange-200" : ""
            }`}
            title={isExpanded ? "Свернуть подробности" : "Развернуть подробности"}
            aria-label="Переключить подробности"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Дата и тайминг создания */}
        <span className="text-[11px] font-bold text-slate-500" suppressHydrationWarning>
          {timing.timeSinceCreationStr}
        </span>
      </div>
    </div>
  );
}
