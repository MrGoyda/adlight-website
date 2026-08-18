import { LeadTechSpec, LeadChecklistState } from "../_types/leadDetailTypes";

export interface ParsedLeadMetadata {
  techSpec?: LeadTechSpec | null;
  checklist?: LeadChecklistState | null;
  rejectionReason?: string | null;
  discountAmount?: number | null;
  raw?: any;
}

/**
 * Безопасный парсинг JSON-метаданных лида (тех-спецификация, чек-лист, причина отказа)
 */
export function parseLeadMetadata(calcDetails: string | null | undefined): ParsedLeadMetadata {
  if (!calcDetails || typeof calcDetails !== "string" || !calcDetails.trim().startsWith("{")) {
    return {
      techSpec: null,
      checklist: null,
      rejectionReason: null,
      discountAmount: null,
      raw: null,
    };
  }

  try {
    const parsed = JSON.parse(calcDetails);
    return {
      techSpec: parsed.techSpec || null,
      checklist: parsed.checklist && typeof parsed.checklist === "object" ? parsed.checklist : null,
      rejectionReason: parsed.rejectionReason || null,
      discountAmount: typeof parsed.discountAmount === "number" ? parsed.discountAmount : null,
      raw: parsed,
    };
  } catch (err) {
    console.warn("Failed to parse lead calcDetails JSON:", err);
    return {
      techSpec: null,
      checklist: null,
      rejectionReason: null,
      discountAmount: null,
      raw: null,
    };
  }
}
