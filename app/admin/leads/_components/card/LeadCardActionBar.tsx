"use client";

import React from "react";
import { Calculator, FolderOpen, Trash2, RotateCcw } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { Lead } from "../../_types/leadTypes";

interface LeadCardActionBarProps {
  lead: Lead;
  onOpenEstimate: (lead: Lead) => void;
  onOpenFullCard: (leadId: string) => void;
  onDeleteClick: (leadId: string, e: React.MouseEvent) => void;
  onRestoreLead?: (leadId: string, e: React.MouseEvent) => void;
}

export default function LeadCardActionBar({
  lead,
  onOpenEstimate,
  onOpenFullCard,
  onDeleteClick,
  onRestoreLead,
}: LeadCardActionBarProps) {
  return (
    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
      {/* Кнопка сметы или восстановления */}
      {lead.status === "CANCELLED" && onRestoreLead ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            triggerHaptic("medium");
            onRestoreLead(lead.id, e);
          }}
          className="flex-1 py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-extrabold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer border border-emerald-200 shadow-2xs active:scale-98"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Восстановить сделку
        </button>
      ) : (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            triggerHaptic("light");
            onOpenEstimate(lead);
          }}
          className="flex-1 py-2 px-3 rounded-xl bg-slate-50 hover:bg-orange-50 text-slate-700 hover:text-orange-600 font-extrabold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer border border-slate-200 hover:border-orange-200 shadow-2xs active:scale-98"
        >
          <Calculator className="w-3.5 h-3.5 text-orange-500" />
          Смета
        </button>
      )}

      {/* Кнопка открытия полной карточки */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          triggerHaptic("light");
          onOpenFullCard(lead.id);
        }}
        className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs active:scale-98"
      >
        <FolderOpen className="w-3.5 h-3.5" />
        Карточка
      </button>

      {/* Кнопка удаления */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          triggerHaptic("medium");
          onDeleteClick(lead.id, e);
        }}
        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition cursor-pointer active:scale-95 shrink-0"
        title="Удалить лид"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
