import { LeadStatus, ClientRating, FileCategory } from "@prisma/client";
import { Lead } from "./leadTypes";

export interface LeadConstructionItem {
  id: string;
  signType?: string | null;
  title?: string | null;
  lengthMm?: number | null;
  heightMm?: number | null;
  letterHeightMm?: number | null;
  depthMm?: number | null;
  mountingHeight?: string | null;
  facadeType?: string | null;
  powerSupply?: string | null;
  approvalStatus?: string | null;
  nightMountingOnly?: boolean;
  comment?: string | null;
}

export interface LeadTechSpec {
  items?: LeadConstructionItem[];
  // Поля совместимости
  signTypes?: string[];
  lengthMeters?: number | null;
  heightMeters?: number | null;
  letterHeightCm?: number | null;
  lengthMm?: number | null;
  heightMm?: number | null;
  letterHeightMm?: number | null;
  // Монтажные условия
  mountingHeight?: string | null;
  facadeType?: string | null;
  powerSupply?: string | null;
  approvalStatus?: string | null;
  nightMountingOnly?: boolean;
}

export interface LeadChecklistState {
  [itemId: string]: boolean;
}

export interface LeadFileItem {
  id: string;
  name: string;
  url: string;
  fileKey: string;
  size: number;
  mimeType: string;
  category: FileCategory;
  createdAt: string;
}

export interface LeadActivityItem {
  id: string;
  createdAt: string;
  text: string;
  author: string | null;
  type: string;
  title?: string;
  comment?: string | null;
}

export interface LeadFullDetails extends Omit<Lead, "files" | "activities"> {
  rating?: ClientRating | null;
  techSpec?: LeadTechSpec;
  checklist?: LeadChecklistState;
  cancellationReason?: string | null;
  files?: LeadFileItem[];
  activities?: LeadActivityItem[];
}
