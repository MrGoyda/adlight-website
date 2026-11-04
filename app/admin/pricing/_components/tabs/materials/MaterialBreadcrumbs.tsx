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

          {/* Листовые */}
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
              {MATERIAL_FACETS.colors.find((c) => c.id === facets.color)?.label || facets.color}
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
              Формат: {MATERIAL_FACETS.sheetSizes.find((s) => s.id === facets.sheetSize)?.label || facets.sheetSize}
              <button
                type="button"
                onClick={() => onFacetChange("sheetSize", facets.sheetSize)}
                className="hover:text-slate-950 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {facets.pvcDensity !== "all" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-200/80 text-slate-800 text-[11px] font-bold">
              Плотность: {MATERIAL_FACETS.pvcDensities.find((p) => p.id === facets.pvcDensity)?.label || facets.pvcDensity}
              <button
                type="button"
                onClick={() => onFacetChange("pvcDensity", facets.pvcDensity)}
                className="hover:text-slate-950 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {facets.compositeSkin !== "all" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-200/80 text-slate-800 text-[11px] font-bold">
              Стенка: {MATERIAL_FACETS.compositeSkins.find((cs) => cs.id === facets.compositeSkin)?.label || facets.compositeSkin}
              <button
                type="button"
                onClick={() => onFacetChange("compositeSkin", facets.compositeSkin)}
                className="hover:text-slate-950 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {/* Пленки / баннеры */}
          {facets.vinylSurface !== "all" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-orange-100 text-orange-800 text-[11px] font-bold">
              {MATERIAL_FACETS.vinylSurfaces.find((v) => v.id === facets.vinylSurface)?.label || facets.vinylSurface}
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
              {MATERIAL_FACETS.bannerDensities.find((b) => b.id === facets.bannerDensity)?.label || facets.bannerDensity}
              <button
                type="button"
                onClick={() => onFacetChange("bannerDensity", facets.bannerDensity)}
                className="hover:text-slate-950 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {/* Светотехника */}
          {facets.lensCount !== "all" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-orange-100 text-orange-900 text-[11px] font-bold">
              {MATERIAL_FACETS.lensCounts.find((lc) => lc.id === facets.lensCount)?.label || facets.lensCount}
              <button
                type="button"
                onClick={() => onFacetChange("lensCount", facets.lensCount)}
                className="hover:text-orange-950 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {facets.wattage !== "all" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-100 text-amber-900 text-[11px] font-bold">
              {MATERIAL_FACETS.wattages.find((w) => w.id === facets.wattage)?.label || facets.wattage}
              <button
                type="button"
                onClick={() => onFacetChange("wattage", facets.wattage)}
                className="hover:text-amber-950 cursor-pointer"
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

          {facets.ipRating !== "all" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-100 text-blue-900 text-[11px] font-bold">
              {MATERIAL_FACETS.ipRatings.find((ip) => ip.id === facets.ipRating)?.label || facets.ipRating}
              <button
                type="button"
                onClick={() => onFacetChange("ipRating", facets.ipRating)}
                className="hover:text-blue-950 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {facets.housingType !== "all" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-200/90 text-slate-800 text-[11px] font-bold">
              {MATERIAL_FACETS.housingTypes.find((ht) => ht.id === facets.housingType)?.label || facets.housingType}
              <button
                type="button"
                onClick={() => onFacetChange("housingType", facets.housingType)}
                className="hover:text-slate-950 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {facets.deliveryFormat !== "all" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-orange-100 text-orange-900 text-[11px] font-bold">
              {MATERIAL_FACETS.deliveryFormats.find((df) => df.id === facets.deliveryFormat)?.label || facets.deliveryFormat}
              <button
                type="button"
                onClick={() => onFacetChange("deliveryFormat", facets.deliveryFormat)}
                className="hover:text-orange-950 cursor-pointer"
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
