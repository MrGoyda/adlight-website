"use client";

import React from "react";
import { RotateCcw } from "lucide-react";
import { MaterialCategoryItem } from "../../../_data/pricingDictionary";
import { renderCategoryIcon } from "../../tabs/materials/MaterialsSidebar";
import { triggerHaptic } from "@/lib/haptics";

interface TaxonomyCategorySidebarProps {
  taxonomy: MaterialCategoryItem[];
  selectedCatId: string;
  categoryCounts: Record<string, number>;
  onSelectCategory: (id: string) => void;
  onRequestResetDefaults: () => void;
}

export default function TaxonomyCategorySidebar({
  taxonomy,
  selectedCatId,
  categoryCounts,
  onSelectCategory,
  onRequestResetDefaults,
}: TaxonomyCategorySidebarProps) {
  return (
    <div className="p-3 sm:p-4 border-r border-slate-100 bg-slate-50/70 overflow-y-auto space-y-1.5 flex flex-col justify-between">
      <div className="space-y-1">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2 block mb-1">
          Категории ({taxonomy.length})
        </span>

        {taxonomy.map((cat) => {
          const isSelected = selectedCatId === cat.id;
          const count = categoryCounts[cat.id] ?? 0;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                triggerHaptic("light");
                onSelectCategory(cat.id);
              }}
              className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-2xl text-xs font-bold transition text-left cursor-pointer ${
                isSelected
                  ? "bg-slate-900 text-white font-extrabold shadow-sm"
                  : "text-slate-700 hover:bg-slate-200/60 hover:text-slate-900"
              }`}
            >
              <span className="flex items-center gap-2 min-w-0">
                {renderCategoryIcon(
                  cat.iconType,
                  `w-4 h-4 shrink-0 transition ${
                    isSelected ? "text-orange-400" : "text-slate-400"
                  }`
                )}
                <span className="truncate leading-tight">{cat.label}</span>
              </span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-black shrink-0 ${
                  isSelected ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Кнопка сброса к заводским */}
      <div className="pt-3 border-t border-slate-200/60 mt-3">
        <button
          type="button"
          onClick={onRequestResetDefaults}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
          title="Вернуть изначальную структуру"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Сбросить к заводским</span>
        </button>
      </div>
    </div>
  );
}
