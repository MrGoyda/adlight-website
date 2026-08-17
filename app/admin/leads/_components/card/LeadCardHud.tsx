"use client";

import React from "react";
import { 
  ImageIcon, 
  FileText, 
  Calculator, 
  MessageSquare, 
  MapPin, 
  UserCheck 
} from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { Lead } from "../../_types/leadTypes";
import { LEADS_DICTIONARY, formatManagerName } from "../../_data/leadsDictionary";

interface LeadCardHudProps {
  lead: Lead;
  imagesCount: number;
  docsCount: number;
  estimateItemsCount: number;
  estimateTotal: number;
  onOpenEstimate: (lead: Lead) => void;
}

export default function LeadCardHud({
  lead,
  imagesCount,
  docsCount,
  estimateItemsCount,
  estimateTotal,
  onOpenEstimate,
}: LeadCardHudProps) {
  const dict = LEADS_DICTIONARY.card;

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 text-[11px] select-none border-t border-slate-100/80">
      {/* 📷 Фото */}
      {imagesCount > 0 ? (
        <span 
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 font-extrabold shrink-0 shadow-2xs" 
          title={`${imagesCount} ${dict.photosCount}`}
        >
          <ImageIcon className="w-3 h-3 text-blue-600 shrink-0" />
          <span>{imagesCount} {dict.photosCount}</span>
        </span>
      ) : (
        <span 
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl bg-slate-50 text-slate-400 border border-slate-200/60 font-semibold shrink-0 opacity-70" 
          title={`0 ${dict.photosCount}`}
        >
          <ImageIcon className="w-3 h-3 text-slate-300 shrink-0" />
          <span>0 {dict.photosCount}</span>
        </span>
      )}

      {/* 📄 Документы */}
      {docsCount > 0 ? (
        <span 
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 font-extrabold shrink-0 shadow-2xs" 
          title={`${docsCount} ${dict.docsCount}`}
        >
          <FileText className="w-3 h-3 text-indigo-600 shrink-0" />
          <span>{docsCount} {dict.docsCount}</span>
        </span>
      ) : (
        <span 
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl bg-slate-50 text-slate-400 border border-slate-200/60 font-semibold shrink-0 opacity-70" 
          title={`0 ${dict.docsCount}`}
        >
          <FileText className="w-3 h-3 text-slate-300 shrink-0" />
          <span>0 {dict.docsCount}</span>
        </span>
      )}

      {/* 🧮 Смета */}
      {lead.estimate ? (
        <span 
          onClick={(e) => {
            e.stopPropagation();
            triggerHaptic("light");
            onOpenEstimate(lead);
          }}
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold shrink-0 shadow-2xs transition cursor-pointer" 
          title={`Смета: ${estimateItemsCount} позиций${estimateTotal > 0 ? ` на ${estimateTotal.toLocaleString('ru')} ₸` : ''}`}
        >
          <Calculator className="w-3 h-3 text-purple-600 shrink-0" />
          <span>{dict.estimateLabel} ({estimateItemsCount})</span>
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl bg-slate-50 text-slate-400 border border-slate-200/60 font-semibold shrink-0 opacity-70" title={dict.noEstimate}>
          <Calculator className="w-3 h-3 text-slate-300 shrink-0" />
          <span>{dict.noEstimate}</span>
        </span>
      )}

      {/* 💬 Заметка */}
      {lead.comment ? (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/80 font-bold shrink-0 shadow-2xs" title={`Заметка: ${lead.comment}`}>
          <MessageSquare className="w-3 h-3 text-amber-600 shrink-0" />
          <span>{dict.noteBadge}</span>
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl bg-slate-50 text-slate-400 border border-slate-200/60 font-semibold shrink-0 opacity-70" title={dict.noNote}>
          <MessageSquare className="w-3 h-3 text-slate-300 shrink-0" />
          <span>{dict.noNote}</span>
        </span>
      )}

      {/* 📍 Адрес */}
      {lead.address ? (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-bold shrink-0 max-w-[150px] truncate shadow-2xs" title={`Адрес: ${lead.address}`}>
          <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
          <span className="truncate">{lead.address}</span>
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl bg-slate-50 text-slate-400 border border-slate-200/60 font-semibold shrink-0 opacity-70" title={dict.noAddress}>
          <MapPin className="w-3 h-3 text-slate-300 shrink-0" />
          <span>{dict.noAddress}</span>
        </span>
      )}

      {/* 👤 Менеджер */}
      {lead.manager ? (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl bg-orange-50 text-orange-700 border border-orange-200/80 font-black shrink-0 shadow-2xs" title={`Ответственный: ${formatManagerName(lead.manager)}`}>
          <UserCheck className="w-3 h-3 text-orange-500 shrink-0" />
          <span>{formatManagerName(lead.manager)}</span>
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl bg-slate-50 text-slate-400 border border-slate-200/60 font-semibold shrink-0 opacity-70" title={dict.noManager}>
          <UserCheck className="w-3 h-3 text-slate-300 shrink-0" />
          <span>{dict.noManager}</span>
        </span>
      )}
    </div>
  );
}
