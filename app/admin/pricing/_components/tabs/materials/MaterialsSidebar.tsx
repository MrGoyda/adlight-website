"use client";

import React from "react";
import { MATERIAL_TAXONOMY } from "../../../_data/pricingDictionary";
import {
  MATERIAL_FACETS,
  MaterialFacetState,
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
  // Характеристики
  facets: MaterialFacetState;
  onFacetChange: (key: keyof MaterialFacetState, value: string) => void;
  onResetFacets: () => void;
  hasActiveFacets: boolean;
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
  onFacetChange,
  onResetFacets,
  hasActiveFacets,
}: MaterialsSidebarProps) {
  // Список уникальных поставщиков
  const allSupplierNames = React.useMemo(() => {
    return Array.from(
      new Set([...suppliers.map((s) => s.name), ...uniqueSuppliersFromPrices])
    )
      .filter(Boolean)
      .sort();
  }, [suppliers, uniqueSuppliersFromPrices]);

  const subLower = (selectedSubcategory || "").toLowerCase();

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

      {/* 3. Раздел: Характеристики (Apple Pro Dynamic Contextual Facets 2026) */}
      {(selectedCategory === "sheets" ||
        selectedCategory === "vinyl" ||
        selectedCategory === "lighting" ||
        selectedCategory === "all") && (
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

          {/* ═══════════════ А. СВЕТОТЕХНИКА И ЭЛЕКТРИКА ═══════════════ */}
          {selectedCategory === "lighting" && (
            <div className="space-y-2.5">
              {/* 1. Светодиодные модули: Линзы/точки */}
              {subLower.includes("модул") && (
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-400 px-2 block">
                    Количество линз (диодов)
                  </span>
                  <div className="flex flex-wrap gap-1 px-1">
                    {MATERIAL_FACETS.lensCounts.map((lc) => {
                      const isAct = facets.lensCount === lc.id;
                      return (
                        <button
                          key={lc.id}
                          type="button"
                          onClick={() => {
                            triggerHaptic("light");
                            onFacetChange("lensCount", lc.id);
                          }}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                            isAct
                              ? "bg-orange-500 text-white font-black shadow-2xs"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {lc.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. Трансформаторы: Исполнение корпуса */}
              {(subLower.includes("трансформатор") || subLower.includes("блок")) && (
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-400 px-2 block">
                    Исполнение корпуса
                  </span>
                  <div className="flex flex-wrap gap-1 px-1">
                    {MATERIAL_FACETS.housingTypes.map((ht) => {
                      const isAct = facets.housingType === ht.id;
                      return (
                        <button
                          key={ht.id}
                          type="button"
                          onClick={() => {
                            triggerHaptic("light");
                            onFacetChange("housingType", ht.id);
                          }}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                            isAct
                              ? "bg-slate-900 text-white font-black shadow-2xs"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {ht.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. Неон: Формат поставки */}
              {subLower.includes("неон") && (
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-400 px-2 block">
                    Формат поставки
                  </span>
                  <div className="flex flex-wrap gap-1 px-1">
                    {MATERIAL_FACETS.deliveryFormats.map((df) => {
                      const isAct = facets.deliveryFormat === df.id;
                      return (
                        <button
                          key={df.id}
                          type="button"
                          onClick={() => {
                            triggerHaptic("light");
                            onFacetChange("deliveryFormat", df.id);
                          }}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                            isAct
                              ? "bg-orange-500 text-white font-black shadow-2xs"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {df.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4. Мощность (Диоды, Блоки, Ленты) */}
              {(!subLower.includes("неон") || facets.wattage !== "all") && (
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-400 px-2 block">
                    {subLower.includes("трансформатор") || subLower.includes("блок")
                      ? "Мощность блока (W)"
                      : "Мощность (W)"}
                  </span>
                  <div className="flex flex-wrap gap-1 px-1">
                    {MATERIAL_FACETS.wattages
                      .filter((w) => {
                        if (subLower.includes("трансформатор") || subLower.includes("блок")) {
                          return w.id === "all" || w.id.includes("60-100w") || w.id.includes("150-200w") || w.id.includes("300-400w");
                        }
                        if (subLower.includes("модул")) {
                          return w.id === "all" || w.id === "0.5w" || w.id === "1.2w";
                        }
                        return true;
                      })
                      .map((w) => {
                        const isAct = facets.wattage === w.id;
                        return (
                          <button
                            key={w.id}
                            type="button"
                            onClick={() => {
                              triggerHaptic("light");
                              onFacetChange("wattage", w.id);
                            }}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                              isAct
                                ? "bg-orange-500 text-white font-black shadow-2xs"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                          >
                            {w.label}
                          </button>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* 5. Свечение светодиодов и цветовая t° (для модулей, лент, неона, всех) */}
              {!subLower.includes("трансформатор") && !subLower.includes("блок") && (
                <div className="space-y-1 pt-0.5">
                  <span className="text-[10px] font-extrabold text-slate-400 px-2 block">
                    Свечение и цветовая t°
                  </span>
                  <div className="flex flex-wrap gap-1 px-1">
                    {MATERIAL_FACETS.glowColors.map((g) => {
                      const isAct = facets.glowColor === g.id;
                      return (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => {
                            triggerHaptic("light");
                            onFacetChange("glowColor", g.id);
                          }}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                            isAct
                              ? "bg-amber-500 text-white font-black shadow-2xs"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {g.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 6. Влагозащита (IP) */}
              {(subLower.includes("модул") || subLower.includes("лент") || subLower === "all") && (
                <div className="space-y-1 pt-0.5">
                  <span className="text-[10px] font-extrabold text-slate-400 px-2 block">
                    Степень защиты (IP)
                  </span>
                  <div className="flex flex-wrap gap-1 px-1">
                    {MATERIAL_FACETS.ipRatings.map((ip) => {
                      const isAct = facets.ipRating === ip.id;
                      return (
                        <button
                          key={ip.id}
                          type="button"
                          onClick={() => {
                            triggerHaptic("light");
                            onFacetChange("ipRating", ip.id);
                          }}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                            isAct
                              ? "bg-slate-900 text-white font-black shadow-2xs"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {ip.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 7. Напряжение питания (12V, 24V, 220V) */}
              <div className="space-y-1 pt-0.5">
                <span className="text-[10px] font-extrabold text-slate-400 px-2 block">
                  Напряжение питания
                </span>
                <div className="flex flex-wrap gap-1 px-1">
                  {MATERIAL_FACETS.voltages.map((volt) => {
                    const isAct = facets.voltage === volt.id;
                    return (
                      <button
                        key={volt.id}
                        type="button"
                        onClick={() => {
                          triggerHaptic("light");
                          onFacetChange("voltage", volt.id);
                        }}
                        className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                          isAct
                            ? "bg-slate-900 text-white font-black shadow-2xs"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {volt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════ Б. ЛИСТОВЫЕ МАТЕРИАЛЫ ═══════════════ */}
          {(selectedCategory === "sheets" || selectedCategory === "all") && (
            <div className="space-y-2.5">
              {/* Толщина */}
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 px-2 block">
                  Толщина листа
                </span>
                <div className="flex flex-wrap gap-1 px-1">
                  {MATERIAL_FACETS.thicknesses.map((t) => {
                    const isAct = facets.thickness === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          triggerHaptic("light");
                          onFacetChange("thickness", t.id);
                        }}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                          isAct
                            ? "bg-orange-500 text-white font-black shadow-2xs"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Плотность ПВХ */}
              {selectedCategory === "sheets" && (subLower.includes("пвх") || subLower === "all") && (
                <div className="space-y-1 pt-0.5">
                  <span className="text-[10px] font-extrabold text-slate-400 px-2 block">
                    Плотность ПВХ
                  </span>
                  <div className="flex flex-wrap gap-1 px-1">
                    {MATERIAL_FACETS.pvcDensities.map((p) => {
                      const isAct = facets.pvcDensity === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            triggerHaptic("light");
                            onFacetChange("pvcDensity", p.id);
                          }}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                            isAct
                              ? "bg-slate-900 text-white font-black shadow-2xs"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {p.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Стенка АКП */}
              {selectedCategory === "sheets" &&
                (subLower.includes("акп") || subLower.includes("алюмокомпозит") || subLower === "all") && (
                  <div className="space-y-1 pt-0.5">
                    <span className="text-[10px] font-extrabold text-slate-400 px-2 block">
                      Стенка алюминия АКП
                    </span>
                    <div className="flex flex-wrap gap-1 px-1">
                      {MATERIAL_FACETS.compositeSkins.map((cs) => {
                        const isAct = facets.compositeSkin === cs.id;
                        return (
                          <button
                            key={cs.id}
                            type="button"
                            onClick={() => {
                              triggerHaptic("light");
                              onFacetChange("compositeSkin", cs.id);
                            }}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                              isAct
                                ? "bg-slate-900 text-white font-black shadow-2xs"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                          >
                            {cs.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

              {/* Цвет / Оптика (для Листовых) */}
              {selectedCategory === "sheets" && (
                <div className="space-y-1 pt-0.5">
                  <span className="text-[10px] font-extrabold text-slate-400 px-2 block">
                    Цвет и Оптика
                  </span>
                  <div className="flex flex-wrap gap-1 px-1">
                    {MATERIAL_FACETS.colors.map((c) => {
                      const isAct = facets.color === c.id;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            triggerHaptic("light");
                            onFacetChange("color", c.id);
                          }}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                            isAct
                              ? "bg-slate-900 text-white font-black shadow-2xs"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {c.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Формат листа (для Листовых) */}
              {selectedCategory === "sheets" && (
                <div className="space-y-1 pt-0.5">
                  <span className="text-[10px] font-extrabold text-slate-400 px-2 block">
                    Размер листа
                  </span>
                  <div className="flex flex-wrap gap-1 px-1">
                    {MATERIAL_FACETS.sheetSizes.map((s) => {
                      const isAct = facets.sheetSize === s.id;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            triggerHaptic("light");
                            onFacetChange("sheetSize", s.id);
                          }}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                            isAct
                              ? "bg-slate-900 text-white font-black shadow-2xs"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {s.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══════════════ В. ПЛЕНКИ И БАННЕРЫ ═══════════════ */}
          {selectedCategory === "vinyl" && (
            <div className="space-y-2.5">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 px-2 block">
                  Тип поверхности
                </span>
                <div className="flex flex-wrap gap-1 px-1">
                  {MATERIAL_FACETS.vinylSurfaces.map((v) => {
                    const isAct = facets.vinylSurface === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => {
                          triggerHaptic("light");
                          onFacetChange("vinylSurface", v.id);
                        }}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                          isAct
                            ? "bg-orange-500 text-white font-black shadow-2xs"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {v.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1 pt-0.5">
                <span className="text-[10px] font-extrabold text-slate-400 px-2 block">
                  Плотность баннера
                </span>
                <div className="flex flex-wrap gap-1 px-1">
                  {MATERIAL_FACETS.bannerDensities.map((b) => {
                    const isAct = facets.bannerDensity === b.id;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => {
                          triggerHaptic("light");
                          onFacetChange("bannerDensity", b.id);
                        }}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                          isAct
                            ? "bg-slate-900 text-white font-black shadow-2xs"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {b.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
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
              <button
                key={supName}
                type="button"
                onClick={() => {
                  triggerHaptic("light");
                  onSelectSupplier(supName);
                }}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-bold transition text-left cursor-pointer active:scale-98 ${
                  isAct
                    ? "bg-slate-800 text-white font-black"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span className="truncate flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      supName.toLowerCase().includes("signtech")
                        ? "bg-orange-500"
                        : "bg-blue-500"
                    }`}
                  />
                  <span className="truncate">{supName}</span>
                </span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    isAct ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {supCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

export default React.memo(MaterialsSidebar);
