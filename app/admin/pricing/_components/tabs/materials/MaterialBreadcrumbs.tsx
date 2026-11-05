"use client";

import React from "react";
import { ChevronRight, X, SlidersHorizontal } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { pricingDict } from "@/dictionaries/pricing";
import {
  MaterialFacetState,
  FACET_LABELS,
  FACET_CONFIG_MAP,
} from "../../../_data/materialFacets";

interface MaterialBreadcrumbsProps {
  selectedCategory: string;
  selectedSubcategory: string;
  categoryLabel?: string;
  onResetCategory: () => void;
  onResetSubcategory: () => void;
  facets: MaterialFacetState;
  applicableFacetKeys: (keyof MaterialFacetState)[];
  hasActiveFacets: boolean;
  onFacetChange: (key: keyof MaterialFacetState, value: string) => void;
  onResetFacets: () => void;
}

function MaterialBreadcrumbs({
  selectedCategory,
  selectedSubcategory,
  categoryLabel,
  onResetCategory,
  onResetSubcategory,
  facets,
  applicableFacetKeys,
  hasActiveFacets,
  onFacetChange,
  onResetFacets,
}: MaterialBreadcrumbsProps) {
  if (selectedCategory === "all" && !hasActiveFacets) return null;

  return (
    <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
      {/* Хлебные крошки дерева категорий */}
      {selectedCategory !== "all" && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => {
              triggerHaptic("light");
              onResetCategory();
            }}
            className="text-slate-400 hover:text-slate-700 transition font-bold cursor-pointer"
          >
            {pricingDict.breadcrumbs.allMaterials}
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
          <button
            type="button"
            onClick={() => {
              triggerHaptic("light");
              onResetSubcategory();
            }}
            className={`font-bold transition cursor-pointer ${
              selectedSubcategory === "all"
                ? "text-slate-900 font-extrabold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {categoryLabel || selectedCategory}
          </button>

          {selectedSubcategory !== "all" && (
            <>
              <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-orange-100 text-orange-900 font-extrabold text-[11px]">
                <span>{selectedSubcategory}</span>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic("light");
                    onResetSubcategory();
                  }}
                  className="text-orange-700 hover:text-orange-950 cursor-pointer"
                  title="Вернуться ко всей категории"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            </>
          )}
        </div>
      )}

      {/* Плашка активных характеристик */}
      {hasActiveFacets && (
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3 text-orange-500" />
            Характеристики:
          </span>

          {applicableFacetKeys.map((key) => {
            const val = facets[key];
            if (!val || val === "all") return null;

            const label = FACET_LABELS[key] || key;
            const option = FACET_CONFIG_MAP[key]?.find((o) => o.id === val);
            const displayVal = option?.label || val;

            return (
              <span
                key={key}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-orange-100 text-orange-900 text-[11px] font-bold"
              >
                <span>
                  {label}: {displayVal}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic("light");
                    onFacetChange(key, val);
                  }}
                  className="text-orange-700 hover:text-orange-950 cursor-pointer ml-0.5"
                  title={`Сбросить ${label}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })}

          <button
            type="button"
            onClick={() => {
              triggerHaptic("medium");
              onResetFacets();
            }}
            className="text-[11px] font-extrabold text-slate-500 hover:text-slate-800 hover:underline ml-auto cursor-pointer"
          >
            {pricingDict.breadcrumbs.resetAllFilters}
          </button>
        </div>
      )}
    </div>
  );
}

export default React.memo(MaterialBreadcrumbs);
