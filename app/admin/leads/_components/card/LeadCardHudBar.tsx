"use client";

import React from "react";
import { 
  ImageIcon, 
  FileText, 
  Calculator, 
  MessageSquare, 
  MapPin,
  Palette,
  CheckSquare,
  Clock
} from "lucide-react";
import { formatManagerName } from "../../_data/leadsDictionary";

interface LeadCardHudBarProps {
  imagesCount: number;
  docsCount: number;
  designCount?: number;
  estimateItemsCount: number;
  checklistProgress?: { completed: number; total: number; percent: number } | null;
  commentsCount: number;
  hasAddress: boolean;
  manager?: string | null;
}

export default function LeadCardHudBar({
  imagesCount,
  docsCount,
  designCount = 0,
  estimateItemsCount,
  checklistProgress,
  commentsCount,
  hasAddress,
  manager,
}: LeadCardHudBarProps) {
  const totalFiles = imagesCount + docsCount + designCount;

  return (
    <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 flex-wrap text-[11px] font-bold text-slate-500">
      {/* 1. Чек-лист сделки (прогресс) */}
      {checklistProgress && checklistProgress.completed > 0 && (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-black ${
            checklistProgress.percent === 100
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-orange-50 text-orange-800 border-orange-200"
          }`}
          title={`Чек-лист: ${checklistProgress.completed} из ${checklistProgress.total} шагов выполнено`}
        >
          <CheckSquare className="w-3 h-3 text-orange-600" />
          <span>{checklistProgress.completed}/{checklistProgress.total} ({checklistProgress.percent}%)</span>
        </span>
      )}

      {/* 2. Дизайн-макеты */}
      {designCount > 0 && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 text-[10px]">
          <Palette className="w-3 h-3 text-purple-600" />
          {designCount} макет
        </span>
      )}

      {/* 3. Фото / Замеры */}
      {imagesCount > 0 && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[10px]">
          <ImageIcon className="w-3 h-3 text-blue-600" />
          {imagesCount} фото
        </span>
      )}

      {/* 4. Документы */}
      {docsCount > 0 && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px]">
          <FileText className="w-3 h-3 text-indigo-600" />
          {docsCount} док
        </span>
      )}

      {/* Если файлов вообще нет */}
      {totalFiles === 0 && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 text-slate-400 border border-slate-200/60 text-[10px]">
          <ImageIcon className="w-3 h-3" />
          0 файлов
        </span>
      )}

      {/* 5. Смета */}
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] ${
          estimateItemsCount > 0
            ? "bg-emerald-50 text-emerald-700 border-emerald-200 font-extrabold"
            : "bg-slate-50 text-slate-400 border-slate-200/60 font-medium"
        }`}
      >
        <Calculator className="w-3 h-3" />
        {estimateItemsCount > 0 ? `${estimateItemsCount} поз.` : "Смета"}
      </span>

      {/* 6. Заметки / Активности */}
      {commentsCount > 0 && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-[10px]">
          <MessageSquare className="w-3 h-3 text-amber-600" />
          {commentsCount}
        </span>
      )}

      {/* 7. Адрес */}
      {hasAddress && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 text-[10px]">
          <MapPin className="w-3 h-3 text-orange-500" />
          Адрес
        </span>
      )}

      {/* 8. Ответственный менеджер */}
      {manager && (
        <span className="ml-auto text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-extrabold border border-slate-200">
          {formatManagerName(manager)}
        </span>
      )}
    </div>
  );
}
