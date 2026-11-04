"use client";

import React from "react";
import { MATERIAL_TAXONOMY } from "../../../_data/pricingDictionary";
import {
  MATERIAL_FACETS,
  MaterialFacetState,
  FACET_CONFIG_MAP,
  FACET_LABELS,
} from "../../../_data/materialFacets";
import { SupplierData } from "../../../_types/pricingTypes";
import {
  Layers,
  SquareStack,
  Zap,
  Scroll,
  Columns3,
  Wrench,
  Handshake,
  Building2,
  Image as ImageIcon,
  SlidersHorizontal,
  RotateCcw,
  ChevronDown,
  CircleDot,
  Info,
} from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";

// Хелпер для монохромных Lucide-иконок
export function renderCategoryIcon(iconType: string, className = "w-4 h-4") {
  switch (iconType) {
    case "square-stack":
      return <SquareStack className={className} />;
    case "zap":
      return <Zap className={className} />;
    case "scroll":
      return <Scroll className={className} />;
    case "columns-3":
      return <Columns3 className={className} />;
    case "wrench":
      return <Wrench className={className} />;
    case "handshake":
      return <Handshake className={className} />;
    case "layers":
    default:
      return <Layers className={className} />;
  }
}

interface MaterialsSidebarProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedSubcategory: string;
  onSelectSubcategory: (sub: string) => void;
  subcategoryCounts: Record<string, number>;
  selectedSupplier: string;
  onSelectSupplier: (sup: string) => void;
  onlyWithPhoto: boolean;
  onToggleOnlyWithPhoto: () => void;
  categoryCounts: Record<string, number>;
  supplierCounts: Record<string, number>;
  withPhotoCount: number;
  totalCount: number;
  suppliers: SupplierData[];
  uniqueSuppliersFromPrices: string[];
  // Характеристики со строгой изоляцией
  facets: MaterialFacetState;
  applicableFacetKeys: (keyof MaterialFacetState)[];
  onFacetChange: (key: keyof MaterialFacetState, value: string) => void;
  onResetFacets: () => void;
  hasActiveFacets: boolean;
  onOpenSupplierInfo?: (supplierName: string) => void;
}

function MaterialsSidebar({
  selectedCategory,
  onSelectCategory,
  selectedSubcategory,
  onSelectSubcategory,
  subcategoryCounts,
  selectedSupplier,
  onSelectSupplier,
  onlyWithPhoto,
  onToggleOnlyWithPhoto,
  categoryCounts,
  supplierCounts,
  withPhotoCount,
  totalCount,
  suppliers,
  uniqueSuppliersFromPrices,
  facets,
  applicableFacetKeys,
  onFacetChange,
  onResetFacets,
  hasActiveFacets,
  onOpenSupplierInfo,
}: MaterialsSidebarProps) {
  // Список уникальных поставщиков
  const allSupplierNames = React.useMemo(() => {
    return Array.from(
      new Set([...suppliers.map((s) => s.name), ...uniqueSuppliersFromPrices])
    )
      .filter(Boolean)
      .sort();
  }, [suppliers, uniqueSuppliersFromPrices]);

  return (
    <aside className="w-full space-y-5 bg-white/90 backdrop-blur-md p-4 rounded-3xl border border-slate-200/80 shadow-xs">
      {/* 1. Тумблер: Только с фото (iOS Switch) */}
      <div className="bg-slate-50/90 rounded-2xl p-3 border border-slate-200/70 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition ${
              onlyWithPhoto
                ? "bg-orange-500 text-white shadow-xs"
                : "bg-slate-200/80 text-slate-500"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-black text-slate-900 truncate flex items-center gap-1.5">
              <span>С фото</span>
              <span className="text-[10px] font-extrabold text-orange-600 bg-orange-100/80 px-1.5 py-0.2 rounded-md">
                {withPhotoCount}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium truncate">
              Cloudflare R2
            </div>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={onlyWithPhoto}
          onClick={() => {
            triggerHaptic("medium");
            onToggleOnlyWithPhoto();
          }}
          className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer focus:outline-hidden ${
            onlyWithPhoto ? "bg-orange-500" : "bg-slate-300"
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ease-in-out ${
              onlyWithPhoto ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* 2. Раздел: Категории и дерево подкатегорий */}
      <div className="space-y-1.5">
        <div className="px-2 pb-1 text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span>Каталог материалов</span>
          <span className="text-[10px] font-extrabold text-slate-400">
            {MATERIAL_TAXONOMY.length}
          </span>
        </div>

        {/* Кнопка "Все категории" */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic("light");
            onSelectCategory("all");
            onSelectSubcategory("all");
          }}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-bold transition text-left cursor-pointer active:scale-98 ${
            selectedCategory === "all"
              ? "bg-slate-900 text-white font-extrabold shadow-sm"
              : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          <span className="flex items-center gap-2.5 truncate">
            <Layers
              className={`w-4 h-4 shrink-0 transition ${
                selectedCategory === "all" ? "text-orange-400" : "text-slate-400"
              }`}
            />
            <span className="truncate">Все категории</span>
          </span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
              selectedCategory === "all"
                ? "bg-white/20 text-white"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {totalCount}
          </span>
        </button>

        {/* Дерево категорий и раскрывающихся подкатегорий */}
        <div className="space-y-1">
          {MATERIAL_TAXONOMY.map((cat) => {
            const isCategoryActive = selectedCategory === cat.id;
            const count = categoryCounts[cat.id] ?? 0;
            return (
              <div key={cat.id} className="space-y-0.5">
                {/* Заголовок категории */}
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic("light");
                    onSelectCategory(cat.id);
                    onSelectSubcategory("all");
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-bold transition text-left cursor-pointer active:scale-98 group ${
                    isCategoryActive
                      ? "bg-slate-900 text-white font-extrabold shadow-sm"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <span className="flex items-center gap-2.5 truncate">
                    {renderCategoryIcon(
                      cat.iconType,
                      `w-4 h-4 shrink-0 transition ${
                        isCategoryActive ? "text-orange-400" : "text-slate-400 group-hover:text-slate-700"
                      }`
                    )}
                    <span className="truncate">{cat.label}</span>
                  </span>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                        isCategoryActive
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {count}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isCategoryActive
                          ? "rotate-180 text-orange-400"
                          : "text-slate-300 -rotate-90 group-hover:text-slate-400"
                      }`}
                    />
                  </div>
                </button>

                {/* Раскрывающийся список подкатегорий (Аппаратный CSS Grid Accordion) */}
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out overflow-hidden pl-3 ml-3 border-l-2 border-slate-200/80 ${
                    isCategoryActive && cat.subcategories.length > 0
                      ? "grid-rows-[1fr] opacity-100 py-1"
                      : "grid-rows-[0fr] opacity-0 py-0"
                  }`}
                >
                  <div className="min-h-0 space-y-0.5">
                    {/* Все позиции данной категории */}
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic("light");
                        onSelectSubcategory("all");
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition text-left cursor-pointer ${
                        selectedSubcategory === "all"
                          ? "bg-orange-500 text-white font-black shadow-2xs"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <span className="truncate">Все позиции ({count})</span>
                      <CircleDot
                        className={`w-2.5 h-2.5 shrink-0 ${
                          selectedSubcategory === "all" ? "text-white" : "text-transparent"
                        }`}
                      />
                    </button>

                    {/* Каждая подкатегория с точным счетчиком */}
                    {cat.subcategories.map((sub) => {
                      const isSubActive = selectedSubcategory === sub;
                      const subCount = subcategoryCounts[sub] ?? 0;
                      return (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => {
                            triggerHaptic("light");
                            onSelectSubcategory(sub);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition text-left cursor-pointer group ${
                            isSubActive
                              ? "bg-orange-500 text-white font-black shadow-2xs"
                              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                          }`}
                        >
                          <span className="truncate pr-1">{sub}</span>
                          <span
                            className={`px-1.5 py-0.2 rounded-full text-[9px] font-black shrink-0 ${
                              isSubActive
                                ? "bg-white/25 text-white"
                                : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                            }`}
                          >
                            {subCount}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Раздел: Характеристики (Строго изолированные фасеты 2026) */}
      {applicableFacetKeys.length > 0 && (
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <div className="px-2 flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-slate-400">
            <span className="flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              Характеристики
            </span>
            {hasActiveFacets && (
              <button
                type="button"
                onClick={() => {
                  triggerHaptic("light");
                  onResetFacets();
                }}
                className="text-[10px] font-bold text-orange-600 hover:underline flex items-center gap-0.5 cursor-pointer"
                title="Сбросить фильтры характеристик"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span>Сброс</span>
              </button>
            )}
          </div>

          <div className="space-y-3">
            {applicableFacetKeys.map((key) => {
              const title = FACET_LABELS[key] || key;
              const options = FACET_CONFIG_MAP[key] || [];
              const currentValue = facets[key];

              return (
                <div key={key} className="space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-400 px-2 block">
                    {title}
                  </span>
                  <div className="flex flex-wrap gap-1 px-1">
                    {options.map((opt) => {
                      const isAct = currentValue === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            triggerHaptic("light");
                            onFacetChange(key, opt.id);
                          }}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                            isAct
                              ? "bg-orange-500 text-white font-black shadow-2xs"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Раздел: Поставщики */}
      <div className="space-y-1.5 pt-3 border-t border-slate-100">
        <div className="px-2 pb-1 text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            Поставщики
          </span>
          <span className="text-[10px] font-extrabold text-slate-400">
            {allSupplierNames.length}
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            triggerHaptic("light");
            onSelectSupplier("all");
          }}
          className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-bold transition text-left cursor-pointer active:scale-98 ${
            selectedSupplier === "all"
              ? "bg-slate-800 text-white font-black"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          <span className="truncate">Все поставщики</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
              selectedSupplier === "all"
                ? "bg-white/20 text-white"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {supplierCounts["all"] ?? totalCount}
          </span>
        </button>

        <div className="space-y-0.5">
          {allSupplierNames.map((supName) => {
            const isAct = selectedSupplier === supName;
            const supCount = supplierCounts[supName] ?? 0;
            return (
              <div
                key={supName}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-bold transition text-left group ${
                  isAct
                    ? "bg-slate-800 text-white font-black"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic("light");
                    onSelectSupplier(supName);
                  }}
                  className="flex-1 truncate flex items-center gap-2 cursor-pointer text-left mr-1"
                >
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      supName.toLowerCase().includes("signtech")
                        ? "bg-orange-500"
                        : "bg-blue-500"
                    }`}
                  />
                  <span className="truncate">{supName}</span>
                </button>

                <div className="flex items-center gap-1 shrink-0">
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      isAct ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {supCount}
                  </span>
                  {onOpenSupplierInfo && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerHaptic("light");
                        onOpenSupplierInfo(supName);
                      }}
                      className={`p-1 rounded-lg transition cursor-pointer ${
                        isAct
                          ? "text-slate-300 hover:text-white hover:bg-white/20"
                          : "text-slate-400 hover:text-orange-600 hover:bg-slate-200/70"
                      }`}
                      title="Контакты и адрес поставщика"
                    >
                      <Info className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

export default React.memo(MaterialsSidebar);
