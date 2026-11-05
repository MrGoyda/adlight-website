"use client";

import React from "react";
import {
  Layers,
  ChevronDown,
  CircleDot,
  SquareStack,
  Zap,
  Scroll,
  Columns3,
  Wrench,
  Handshake,
} from "lucide-react";
import { MaterialCategoryItem } from "../../../../_data/pricingDictionary";
import { triggerHaptic } from "@/lib/haptics";
import { pricingDict } from "@/dictionaries/pricing";
import { cn } from "@/lib/utils";

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

interface SidebarCategoriesTreeProps {
  taxonomy: MaterialCategoryItem[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedSubcategory: string;
  onSelectSubcategory: (sub: string) => void;
  categoryCounts: Record<string, number>;
  subcategoryCounts: Record<string, number>;
  totalCount: number;
}

export default function SidebarCategoriesTree({
  taxonomy,
  selectedCategory,
  onSelectCategory,
  selectedSubcategory,
  onSelectSubcategory,
  categoryCounts,
  subcategoryCounts,
  totalCount,
}: SidebarCategoriesTreeProps) {
  const t = pricingDict.sidebar.categories;

  return (
    <div className="space-y-1.5">
      <div className="px-2 pb-1 text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
        <span>{t.title}</span>
        <span className="text-[10px] font-extrabold text-slate-400">
          {taxonomy.length}
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
        className={cn(
          "w-full flex items-center justify-between gap-2 px-3 py-2 rounded-2xl text-xs font-bold transition text-left cursor-pointer active:scale-98",
          selectedCategory === "all"
            ? "bg-slate-900 text-white font-extrabold shadow-sm"
            : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
        )}
      >
        <span className="flex items-center gap-2.5 min-w-0">
          <Layers
            className={cn(
              "w-4 h-4 shrink-0 transition",
              selectedCategory === "all" ? "text-orange-400" : "text-slate-400"
            )}
          />
          <span className="leading-snug break-words">{t.all}</span>
        </span>
        <span
          className={cn(
            "px-1.5 py-0.5 rounded-full text-[10px] font-black shrink-0",
            selectedCategory === "all"
              ? "bg-white/20 text-white"
              : "bg-slate-100 text-slate-500"
          )}
        >
          {totalCount}
        </span>
      </button>

      {/* Дерево категорий и раскрывающихся подкатегорий */}
      <div className="space-y-1">
        {taxonomy.map((cat) => {
          const isCategoryActive = selectedCategory === cat.id;
          const count = categoryCounts[cat.id] ?? 0;
          return (
            <div key={cat.id} className="space-y-0.5">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic("light");
                  onSelectCategory(cat.id);
                  onSelectSubcategory("all");
                }}
                className={cn(
                  "w-full flex items-center justify-between gap-2 px-3 py-2 rounded-2xl text-xs font-bold transition text-left cursor-pointer active:scale-98 group",
                  isCategoryActive
                    ? "bg-slate-900 text-white font-extrabold shadow-sm"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  {renderCategoryIcon(
                    cat.iconType,
                    cn(
                      "w-4 h-4 shrink-0 transition",
                      isCategoryActive
                        ? "text-orange-400"
                        : "text-slate-400 group-hover:text-slate-700"
                    )
                  )}
                  <span className="leading-snug break-words">{cat.label}</span>
                </span>

                <div className="flex items-center gap-1.5 shrink-0 ml-1">
                  <span
                    className={cn(
                      "px-1.5 py-0.5 rounded-full text-[10px] font-black",
                      isCategoryActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-500"
                    )}
                  >
                    {count}
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-3.5 h-3.5 transition-transform duration-200",
                      isCategoryActive
                        ? "rotate-180 text-orange-400"
                        : "text-slate-300 -rotate-90 group-hover:text-slate-400"
                    )}
                  />
                </div>
              </button>

              {/* Раскрывающийся список подкатегорий (CSS Grid Accordion) */}
              <div
                className={cn(
                  "grid transition-[grid-template-rows,opacity] duration-200 ease-out overflow-hidden pl-3 ml-3 border-l-2 border-slate-200/80",
                  isCategoryActive && cat.subcategories.length > 0
                    ? "grid-rows-[1fr] opacity-100 py-1"
                    : "grid-rows-[0fr] opacity-0 py-0"
                )}
              >
                <div className="min-h-0 space-y-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic("light");
                      onSelectSubcategory("all");
                    }}
                    className={cn(
                      "w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition text-left cursor-pointer",
                      selectedSubcategory === "all"
                        ? "bg-orange-500 text-white font-black shadow-2xs"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
                  >
                    <span className="min-w-0 leading-snug break-words">
                      {t.allPositions(count)}
                    </span>
                    <CircleDot
                      className={cn(
                        "w-2.5 h-2.5 shrink-0",
                        selectedSubcategory === "all"
                          ? "text-white"
                          : "text-transparent"
                      )}
                    />
                  </button>

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
                        className={cn(
                          "w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition text-left cursor-pointer group",
                          isSubActive
                            ? "bg-orange-500 text-white font-black shadow-2xs"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        )}
                      >
                        <span className="min-w-0 leading-snug break-words">
                          {sub}
                        </span>
                        <span
                          className={cn(
                            "px-1.5 py-0.5 rounded-full text-[9px] font-black shrink-0",
                            isSubActive
                              ? "bg-white/25 text-white"
                              : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                          )}
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
  );
}
