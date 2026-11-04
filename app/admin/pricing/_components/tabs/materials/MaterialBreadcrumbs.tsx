"use client";

import React from "react";
import { ChevronRight, X, SlidersHorizontal } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { MaterialFacetState, MATERIAL_FACETS } from "../../../_data/materialFacets";

interface MaterialBreadcrumbsProps {
  selectedCategory: string;
  selectedSubcategory: string;
  categoryLabel?: string;
  onResetCategory: () => void;
  onResetSubcategory: () => void;
  facets: MaterialFacetState;
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
            Все материалы
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

          {facets.thickness !== "all" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-orange-100 text-orange-800 text-[11px] font-bold">
              {facets.thickness} мм
              <button
                type="button"
                onClick={() => onFacetChange("thickness", facets.thickness)}
                className="hover:text-orange-950 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {facets.color !== "all" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-200/80 text-slate-800 text-[11px] font-bold">
              Цвет: {facets.color}
              <button
                type="button"
                onClick={() => onFacetChange("color", facets.color)}
                className="hover:text-slate-950 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {facets.sheetSize !== "all" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-200/80 text-slate-800 text-[11px] font-bold">
              {facets.sheetSize}
              <button
                type="button"
                onClick={() => onFacetChange("sheetSize", facets.sheetSize)}
                className="hover:text-slate-950 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {facets.vinylSurface !== "all" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-orange-100 text-orange-800 text-[11px] font-bold">
              {facets.vinylSurface}
              <button
                type="button"
                onClick={() => onFacetChange("vinylSurface", facets.vinylSurface)}
                className="hover:text-orange-950 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {facets.bannerDensity !== "all" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-200/80 text-slate-800 text-[11px] font-bold">
              {facets.bannerDensity}
              <button
                type="button"
                onClick={() => onFacetChange("bannerDensity", facets.bannerDensity)}
                className="hover:text-slate-950 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {facets.glowColor !== "all" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-yellow-100 text-yellow-900 text-[11px] font-bold">
              {MATERIAL_FACETS.glowColors.find((g) => g.id === facets.glowColor)?.label || facets.glowColor}
              <button
                type="button"
                onClick={() => onFacetChange("glowColor", facets.glowColor)}
                className="hover:text-yellow-950 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {facets.voltage !== "all" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-100 text-amber-900 text-[11px] font-bold">
              {facets.voltage}
              <button
                type="button"
                onClick={() => onFacetChange("voltage", facets.voltage)}
                className="hover:text-amber-950 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={onResetFacets}
            className="text-[11px] font-extrabold text-slate-500 hover:text-slate-800 hover:underline ml-auto cursor-pointer"
          >
            Сбросить всё
          </button>
        </div>
      )}
    </div>
  );
}

export default React.memo(MaterialBreadcrumbs);
