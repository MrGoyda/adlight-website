"use client";

import React from "react";
import LeadCard from "../LeadCard";
import { Lead } from "../../_types/leadTypes";
import { LeadStatus } from "@prisma/client";

interface LeadCardsGridProps {
  leads: Lead[];
  selectedLeadId?: string;
  selectedLeadIds: Set<string>;
  phoneOccurrences?: Record<string, number>;
  onFilterDuplicatePhone: (phone: string) => void;
  onSelectLead: (lead: Lead) => void;
  onOpenEstimate?: (lead: Lead) => void;
  onOpenFullCard?: (leadId: string) => void;
  onDeleteClick?: (leadId: string, e: React.MouseEvent, isPermanent?: boolean) => void;
  onRestoreLead?: (leadId: string, e: React.MouseEvent) => void;
  onRestoreFromTrash?: (leadId: string, e: React.MouseEvent) => void;
  onStatusChangeQuick?: (leadId: string, status: LeadStatus) => void;
  onToggleBatchSelect: (leadId: string, e?: React.MouseEvent) => void;
}

function LeadCardsGrid({
  leads,
  selectedLeadId,
  selectedLeadIds,
  phoneOccurrences,
  onFilterDuplicatePhone,
  onSelectLead,
  onOpenEstimate,
  onOpenFullCard,
  onDeleteClick,
  onRestoreLead,
  onRestoreFromTrash,
  onStatusChangeQuick,
  onToggleBatchSelect,
}: LeadCardsGridProps) {
  const isBatchSelectionActive = selectedLeadIds.size > 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-3.5 items-start">
      {leads.map((lead) => {
        const cleanDigits = (lead.phone || "").replace(/\D/g, "").slice(-10);
        const dupCount = cleanDigits && phoneOccurrences ? (phoneOccurrences[cleanDigits] || 0) : 0;
        const isBatchSelected = selectedLeadIds.has(lead.id);

        return (
          <LeadCard
            key={lead.id}
            lead={lead}
            isSelected={selectedLeadId === lead.id}
            duplicateCount={dupCount}
            onFilterDuplicatePhone={onFilterDuplicatePhone}
            onSelect={onSelectLead}
            onOpenEstimate={onOpenEstimate}
            onOpenFullCard={onOpenFullCard}
            onDeleteClick={onDeleteClick}
            onRestoreLead={onRestoreLead}
            onRestoreFromTrash={onRestoreFromTrash}
            onStatusChangeQuick={onStatusChangeQuick}
            isBatchSelected={isBatchSelected}
            onToggleBatchSelect={onToggleBatchSelect}
            isBatchSelectionActive={isBatchSelectionActive}
          />
        );
      })}
    </div>
  );
}

export default React.memo(LeadCardsGrid);
