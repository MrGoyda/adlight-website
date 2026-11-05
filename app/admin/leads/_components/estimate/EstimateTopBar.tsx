"use client";

import React from "react";
import { EstimateItemType } from "@prisma/client";
import { ITEM_TYPE_LABELS } from "./constants";
import { Plus, Sparkles, Copy, BookmarkPlus } from "lucide-react";

interface EstimateTopBarProps {
  onAddItem: (type: EstimateItemType) => void;
  onOpenPresets?: () => void;
  onOpenSavePreset?: () => void;
  onCopyProposal?: () => void;
  hasItems?: boolean;
  presetsCount?: number;
}

export const EstimateTopBar: React.FC<EstimateTopBarProps> = ({
  onAddItem,
  onOpenPresets,
  onOpenSavePreset,
  onCopyProposal,
  hasItems = false,
  presetsCount = 0,
}) => {
  return (
    <div className="shrink-0 p-3 sm:px-6 bg-white border-b border-slate-100 shadow-2xs z-10">
      <div className="flex items-center justify-between gap-3">
        {/* Кнопки быстрого добавления типов */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1 shrink-0 hidden sm:inline">
            Добавить:
          </span>
          {(Object.keys(ITEM_TYPE_LABELS) as EstimateItemType[]).map((type) => {
            const config = ITEM_TYPE_LABELS[type];
            const Icon = config.icon;
            return (
              <button
                key={type}
                type="button"
                onClick={() => onAddItem(type)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80 transition cursor-pointer active:scale-95 shadow-2xs shrink-0"
              >
                <Plus className="w-3 h-3 text-orange-500" />
                <Icon className="w-3.5 h-3.5 text-slate-500" />
                <span>{config.label}</span>
              </button>
            );
          })}
        </div>

        {/* Действия с шаблонами и экспорт */}
        <div className="flex items-center gap-2 shrink-0">
          {onOpenPresets && (
            <button
              type="button"
              onClick={onOpenPresets}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-orange-900 bg-orange-50 hover:bg-orange-100 border border-orange-200 transition cursor-pointer active:scale-95 shadow-2xs shrink-0"
              title="Открыть библиотеку готовых шаблонов вывесок"
            >
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span>Шаблоны</span>
              {presetsCount > 0 && (
                <span className="text-[10px] bg-white px-1.5 py-0.2 rounded-md font-mono text-orange-700">
                  {presetsCount}
                </span>
              )}
            </button>
          )}

          {hasItems && onCopyProposal && (
            <button
              type="button"
              onClick={onCopyProposal}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 transition cursor-pointer active:scale-95 shadow-2xs shrink-0"
              title="Скопировать коммерческое предложение для клиента"
            >
              <Copy className="w-3.5 h-3.5 text-emerald-600" />
              <span>КП в WhatsApp</span>
            </button>
          )}

          {hasItems && onOpenSavePreset && (
            <button
              type="button"
              onClick={onOpenSavePreset}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition cursor-pointer active:scale-95 shadow-2xs shrink-0"
              title="Сохранить текущие строки как новый шаблон"
            >
              <BookmarkPlus className="w-3.5 h-3.5 text-orange-500" />
              <span>В шаблон</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
