"use client";

import React, { useState, useMemo, useDeferredValue } from "react";
import { WorkOperationItem } from "../../_types/pricingTypes";
import { RATE_CATEGORIES } from "../../_data/pricingDictionary";
import { EstimateItemType } from "@prisma/client";
import { triggerHaptic } from "@/lib/haptics";
import RateCategorySection from "./rates/RateCategorySection";
import { renderRateCategoryIcon } from "../rates/RateCategoryIcon";
import { pricingDict } from "@/dictionaries/pricing";
import { Search, X, Plus, Wrench } from "lucide-react";

interface EstimateRatesTabProps {
  workOperations: WorkOperationItem[];
  onOpenCreateRateModal: (type: EstimateItemType) => void;
  onOpenEditRateModal: (rate: WorkOperationItem) => void;
  onDeleteRate: (id: string) => Promise<void>;
}

const CATEGORIES_TO_RENDER: EstimateItemType[] = [
  "LOGISTICS",
  "EQUIPMENT",
  "ASSEMBLY",
  "INSTALLATION",
  "CUSTOM",
];

export default function EstimateRatesTab({
  workOperations,
  onOpenCreateRateModal,
  onOpenEditRateModal,
  onDeleteRate,
}: EstimateRatesTabProps) {
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearch = useDeferredValue(searchQuery);

  const filteredWorkOperations = useMemo(() => {
    if (!deferredSearch.trim()) return workOperations;
    const q = deferredSearch.toLowerCase().trim();
    return workOperations.filter((op) => op.name.toLowerCase().includes(q));
  }, [workOperations, deferredSearch]);

  const visibleCategories = useMemo(() => {
    const list =
      filterType === "all"
        ? CATEGORIES_TO_RENDER
        : CATEGORIES_TO_RENDER.filter((cat) => cat === filterType);

    // Если есть поиск, показываем только категории, в которых есть совпадения
    if (deferredSearch.trim()) {
      return list.filter((catKey) =>
        filteredWorkOperations.some((o) => o.type === catKey)
      );
    }
    return list;
  }, [filterType, deferredSearch, filteredWorkOperations]);

  return (
    <div className="space-y-4">
      {/* Поиск и фильтры по категориям */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        {/* Строка поиска по названию тарифа */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по названию тарифа (монтаж, фрезеровка, автовышка)..."
            className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200/80 rounded-xl placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                triggerHaptic("light");
                setSearchQuery("");
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded-md"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Быстрое добавление тарифа */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic("medium");
            onOpenCreateRateModal("ASSEMBLY");
          }}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md shadow-orange-600/20 transition active:scale-95 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Новый тариф</span>
        </button>
      </div>

      {/* Переключатель категорий тарифов */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-2xs">
        <button
          type="button"
          onClick={() => {
            triggerHaptic("light");
            setFilterType("all");
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-black transition shrink-0 cursor-pointer ${
            filterType === "all"
              ? "bg-slate-900 text-white shadow-2xs"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          {pricingDict.ratesTab.allCategories(filteredWorkOperations.length)}
        </button>

        {CATEGORIES_TO_RENDER.map((catKey) => {
          const catMeta = RATE_CATEGORIES[catKey];
          const count = filteredWorkOperations.filter((o) => o.type === catKey).length;
          const isActive = filterType === catKey;

          return (
            <button
              key={catKey}
              type="button"
              onClick={() => {
                triggerHaptic("light");
                setFilterType(catKey);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                isActive
                  ? "bg-orange-600 text-white shadow-2xs font-black"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <span className={`shrink-0 ${isActive ? "text-white" : "text-slate-500"}`}>
                {renderRateCategoryIcon(catKey, "w-3.5 h-3.5")}
              </span>
              <span>{catMeta.label}</span>
              <span className="opacity-70 text-[10px]">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Блоки по категориям */}
      {visibleCategories.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Wrench className="w-5 h-5" />
          </div>
          <p className="text-sm font-bold text-slate-800">
            {searchQuery ? `По запросу "${searchQuery}" тарифов не найдено` : "Тарифы не найдены"}
          </p>
          <p className="text-xs text-slate-400">
            Попробуйте изменить поисковый запрос или выберите другую категорию
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {visibleCategories.map((catKey) => (
            <RateCategorySection
              key={catKey}
              categoryKey={catKey}
              items={filteredWorkOperations.filter((o) => o.type === catKey)}
              onOpenCreateRateModal={onOpenCreateRateModal}
              onOpenEditRateModal={onOpenEditRateModal}
              onDeleteRate={onDeleteRate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
