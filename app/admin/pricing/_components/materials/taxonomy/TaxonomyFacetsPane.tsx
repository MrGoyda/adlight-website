"use client";

import React from "react";
import { Check } from "lucide-react";
import { MaterialCategoryItem } from "../../../_data/pricingDictionary";
import {
  MaterialFacetState,
  FACET_LABELS,
  FACET_CONFIG_MAP,
} from "../../../_data/materialFacets";
import { triggerHaptic } from "@/lib/haptics";

interface TaxonomyFacetsPaneProps {
  activeCategory?: MaterialCategoryItem;
  subcategoryCounts: Record<string, number>;
  selectedSubForFacets: string;
  onSelectSubForFacets: (sub: string) => void;
  currentSubFacets: (keyof MaterialFacetState)[];
  onToggleFacet: (facetKey: keyof MaterialFacetState) => void;
  allFacetKeys: (keyof MaterialFacetState)[];
}

export default function TaxonomyFacetsPane({
  activeCategory,
  subcategoryCounts,
  selectedSubForFacets,
  onSelectSubForFacets,
  currentSubFacets,
  onToggleFacet,
  allFacetKeys,
}: TaxonomyFacetsPaneProps) {
  if (!activeCategory) return null;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
      {/* Выбор подкатегории для настройки */}
      <div>
        <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
          Выберите подкатегорию для настройки фильтров:
        </label>
        <select
          value={selectedSubForFacets}
          onChange={(e) => {
            triggerHaptic("light");
            onSelectSubForFacets(e.target.value);
          }}
          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white focus:border-orange-500 outline-none cursor-pointer"
        >
          {activeCategory.subcategories.map((s) => (
            <option key={s} value={s}>
              {s} ({subcategoryCounts[s] ?? 0} товаров)
            </option>
          ))}
        </select>
      </div>

      {/* Активные фильтры */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
            Активные фильтры в сайдбаре:
          </span>
          <span className="text-[10px] font-extrabold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-md">
            {currentSubFacets.length} активно
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {allFacetKeys.map((key) => {
            const isEnabled = currentSubFacets.includes(key);
            const label = FACET_LABELS[key] || key;
            const optionsCount = FACET_CONFIG_MAP[key]?.length || 0;

            return (
              <button
                key={key}
                type="button"
                onClick={() => onToggleFacet(key)}
                className={`flex items-center justify-between p-2.5 rounded-xl border text-xs text-left transition cursor-pointer active:scale-98 ${
                  isEnabled
                    ? "bg-orange-50 border-orange-200 text-orange-950 font-bold"
                    : "bg-slate-50/70 border-slate-200/80 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <div className="min-w-0 pr-2">
                  <p className="leading-snug break-words">{label}</p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {optionsCount} знач.
                  </p>
                </div>

                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition ${
                    isEnabled
                      ? "bg-orange-500 border-orange-500 text-white"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {isEnabled && <Check className="w-3.5 h-3.5" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
