"use client";

import React, { useMemo } from "react";
import { LeadStatus } from "@prisma/client";
import { Lead } from "../../_types/leadTypes";
import LeadCard from "../LeadCard";
import { 
  Sparkles, 
  Ruler, 
  Hammer, 
  CheckCircle2, 
  Archive,
  Plus
} from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { LEADS_DICTIONARY } from "../../_data/leadsDictionary";

interface KanbanColumnConfig {
  id: string;
  titleKey: keyof typeof LEADS_DICTIONARY.kanban;
  statuses: LeadStatus[];
  primaryStatus: LeadStatus;
  colorClass: string;
  badgeBg: string;
  icon: React.ReactNode;
}

const KANBAN_COLUMNS: KanbanColumnConfig[] = [
  {
    id: "new",
    titleKey: "newTitle",
    statuses: [LeadStatus.NEW],
    primaryStatus: LeadStatus.NEW,
    colorClass: "text-blue-700 border-blue-200 bg-blue-50/50",
    badgeBg: "bg-blue-100 text-blue-800",
    icon: <Sparkles className="w-4 h-4 text-blue-600" />,
  },
  {
    id: "estimate",
    titleKey: "estimateTitle",
    statuses: [LeadStatus.IN_PROGRESS, LeadStatus.ESTIMATE],
    primaryStatus: LeadStatus.ESTIMATE,
    colorClass: "text-purple-700 border-purple-200 bg-purple-50/50",
    badgeBg: "bg-purple-100 text-purple-800",
    icon: <Ruler className="w-4 h-4 text-purple-600" />,
  },
  {
    id: "production",
    titleKey: "processedTitle",
    statuses: [LeadStatus.PROCESSED],
    primaryStatus: LeadStatus.PROCESSED,
    colorClass: "text-indigo-700 border-indigo-200 bg-indigo-50/50",
    badgeBg: "bg-indigo-100 text-indigo-800",
    icon: <Hammer className="w-4 h-4 text-indigo-600" />,
  },
  {
    id: "completed",
    titleKey: "completedTitle",
    statuses: [LeadStatus.COMPLETED],
    primaryStatus: LeadStatus.COMPLETED,
    colorClass: "text-emerald-700 border-emerald-200 bg-emerald-50/50",
    badgeBg: "bg-emerald-100 text-emerald-800",
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
  },
  {
    id: "archive",
    titleKey: "archiveTitle",
    statuses: [LeadStatus.CANCELLED, LeadStatus.UNPROCESSED],
    primaryStatus: LeadStatus.CANCELLED,
    colorClass: "text-slate-700 border-slate-200 bg-slate-50/50",
    badgeBg: "bg-slate-200 text-slate-700",
    icon: <Archive className="w-4 h-4 text-slate-500" />,
  },
];

interface LeadKanbanBoardProps {
  leads: Lead[];
  selectedLeadId?: string;
  onSelectLead: (lead: Lead) => void;
  onOpenEstimate?: (lead: Lead) => void;
  onOpenFullCard?: (leadId: string) => void;
  onOpenCreateModal?: (defaultStatus?: LeadStatus) => void;
  onDeleteClick?: (leadId: string, e: React.MouseEvent) => void;
  onRestoreLead?: (leadId: string, e: React.MouseEvent) => void;
  onStatusChangeQuick?: (leadId: string, status: LeadStatus) => void;
}

export default function LeadKanbanBoard({
  leads,
  selectedLeadId,
  onSelectLead,
  onOpenEstimate,
  onOpenFullCard,
  onOpenCreateModal,
  onDeleteClick,
  onRestoreLead,
  onStatusChangeQuick,
}: LeadKanbanBoardProps) {
  const dict = LEADS_DICTIONARY.kanban;

  // Группировка лидов по колонкам воронки
  const columnsData = useMemo(() => {
    return KANBAN_COLUMNS.map((col) => {
      const colLeads = leads.filter((l) => col.statuses.includes(l.status));
      const colTotalSum = colLeads.reduce((acc, l) => acc + (l.offeredPrice || l.revenue || 0), 0);
      return {
        ...col,
        title: dict[col.titleKey],
        leads: colLeads,
        totalSum: colTotalSum,
      };
    });
  }, [leads, dict]);

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="inline-flex items-start gap-4 min-w-[1280px] w-full">
        {columnsData.map((col) => (
          <div
            key={col.id}
            className="flex-1 min-w-[280px] max-w-[340px] bg-slate-100/70 rounded-3xl p-3 border border-slate-200/80 flex flex-col max-h-[calc(100vh-250px)]"
          >
            {/* ── ШАПКА КОЛОНКИ ── */}
            <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-slate-200/80">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-white shadow-2xs border border-slate-200/70 flex items-center justify-center shrink-0">
                  {col.icon}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-xs text-slate-900">
                      {col.title}
                    </h3>
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${col.badgeBg}`}>
                      {col.leads.length}
                    </span>
                  </div>
                  <p className="text-[10px] font-mono font-bold text-slate-500">
                    {col.totalSum > 0 ? `${col.totalSum.toLocaleString("ru-RU")} ₸` : "0 ₸"}
                  </p>
                </div>
              </div>

              {onOpenCreateModal && col.id !== "archive" && (
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic("light");
                    onOpenCreateModal(col.primaryStatus);
                  }}
                  className="w-7 h-7 rounded-xl bg-white hover:bg-slate-200 text-slate-600 flex items-center justify-center transition border border-slate-200 shadow-2xs cursor-pointer"
                  title={`${dict.createInStageTooltip} "${col.title}"`}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* ── КАРТОЧКИ СДЕЛОК В КОЛОНКЕ ── */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 no-scrollbar min-h-[120px]">
              {col.leads.length === 0 ? (
                <div className="h-28 rounded-2xl border-2 border-dashed border-slate-200/90 flex items-center justify-center text-slate-400 text-xs font-semibold select-none">
                  {dict.noDealsInStage}
                </div>
              ) : (
                col.leads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    isSelected={selectedLeadId === lead.id}
                    onSelect={onSelectLead}
                    onOpenEstimate={onOpenEstimate}
                    onOpenFullCard={onOpenFullCard}
                    onDeleteClick={onDeleteClick}
                    onRestoreLead={onRestoreLead}
                    onStatusChangeQuick={onStatusChangeQuick}
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
