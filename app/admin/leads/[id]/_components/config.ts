"use client";

import { ClientRating, FileCategory } from "@prisma/client";
import { 
  Smile, 
  Meh, 
  Frown, 
  ImageIcon, 
  FileText, 
  FileCheck, 
  Calculator 
} from "lucide-react";
import { crmDict } from "@/dictionaries/crm";

export interface RatingConfigItem {
  label: string;
  sub: string;
  icon: any;
  color: string;
  bg: string;
  border: string;
}

export const RATING_CONFIG: Record<ClientRating, RatingConfigItem> = {
  EASY: { 
    label: crmDict.leadDetail.ratings.EASY.label, 
    sub: crmDict.leadDetail.ratings.EASY.sub, 
    icon: Smile, 
    color: "text-emerald-600", 
    bg: "bg-emerald-50", 
    border: "border-emerald-200" 
  },
  STANDARD: { 
    label: crmDict.leadDetail.ratings.STANDARD.label, 
    sub: crmDict.leadDetail.ratings.STANDARD.sub, 
    icon: Meh, 
    color: "text-amber-600", 
    bg: "bg-amber-50", 
    border: "border-amber-200" 
  },
  PROBLEM: { 
    label: crmDict.leadDetail.ratings.PROBLEM.label, 
    sub: crmDict.leadDetail.ratings.PROBLEM.sub, 
    icon: Frown, 
    color: "text-rose-600", 
    bg: "bg-rose-50", 
    border: "border-rose-200" 
  },
};

export const CATEGORY_LABELS: Record<FileCategory, { label: string; icon: any }> = {
  MEASUREMENT: { label: crmDict.leadDetail.categories.MEASUREMENT, icon: ImageIcon },
  SKETCH: { label: crmDict.leadDetail.categories.SKETCH, icon: FileText },
  CONTRACT: { label: crmDict.leadDetail.categories.CONTRACT, icon: FileCheck },
  INVOICE: { label: crmDict.leadDetail.categories.INVOICE, icon: Calculator },
  OTHER: { label: crmDict.leadDetail.categories.OTHER, icon: FileText },
};
