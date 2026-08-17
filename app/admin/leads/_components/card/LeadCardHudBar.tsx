"use client";

import React from "react";
import { 
  ImageIcon, 
  FileText, 
  Calculator, 
  MessageSquare, 
  MapPin 
} from "lucide-react";
import { formatManagerName } from "../../_data/leadsDictionary";

interface LeadCardHudBarProps {
  imagesCount: number;
  docsCount: number;
  estimateItemsCount: number;
  hasComment: boolean;
  hasAddress: boolean;
  manager?: string | null;
}

export default function LeadCardHudBar({
  imagesCount,
  docsCount,
  estimateItemsCount,
  hasComment,
  hasAddress,
  manager,
}: LeadCardHudBarProps) {
  return (
    <div className="flex items-center gap-2 pt-2 border-t border-slate-100 flex-wrap text-[11px] font-bold text-slate-500">
      {/* Фото */}
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border ${
          imagesCount > 0
            ? "bg-blue-50 text-blue-700 border-blue-200"
            : "bg-slate-50 text-slate-400 border-slate-200/60"
        }`}
      >
        <ImageIcon className="w-3 h-3" />
        {imagesCount} фото
      </span>

      {/* Документы */}
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border ${
          docsCount > 0
            ? "bg-indigo-50 text-indigo-700 border-indigo-200"
            : "bg-slate-50 text-slate-400 border-slate-200/60"
        }`}
      >
        <FileText className="w-3 h-3" />
        {docsCount} док
      </span>

      {/* Смета */}
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border ${
          estimateItemsCount > 0
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : "bg-slate-50 text-slate-400 border-slate-200/60"
        }`}
      >
        <Calculator className="w-3 h-3" />
        {estimateItemsCount > 0 ? `${estimateItemsCount} поз.` : "Смета"}
      </span>

      {/* Заметка */}
      {hasComment && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
          <MessageSquare className="w-3 h-3" />
          Заметка
        </span>
      )}

      {/* Адрес */}
      {hasAddress && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
          <MapPin className="w-3 h-3" />
          Адрес
        </span>
      )}

      {/* Ответственный */}
      {manager && (
        <span className="ml-auto text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-extrabold border border-slate-200">
          {formatManagerName(manager)}
        </span>
      )}
    </div>
  );
}
