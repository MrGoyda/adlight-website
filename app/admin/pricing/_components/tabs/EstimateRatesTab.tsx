"use client";

import React, { useState } from "react";
import { WorkOperationItem } from "../../_types/pricingTypes";
import { RATE_CATEGORIES } from "../../_data/pricingDictionary";
import { EstimateItemType } from "@prisma/client";
import { triggerHaptic } from "@/lib/haptics";
import RateCategorySection from "./rates/RateCategorySection";

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

  const visibleCategories =
    filterType === "all"
      ? CATEGORIES_TO_RENDER
      : CATEGORIES_TO_RENDER.filter((cat) => cat === filterType);

  return (
    <div className="space-y-6">
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
          Все категории ({workOperations.length})
        </button>

        {CATEGORIES_TO_RENDER.map((catKey) => {
          const catMeta = RATE_CATEGORIES[catKey];
          const count = workOperations.filter((o) => o.type === catKey).length;
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
              <span>{catMeta.icon}</span>
              <span>{catMeta.label}</span>
              <span className="opacity-70 text-[10px]">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Блоки по категориям */}
      <div className="space-y-6">
        {visibleCategories.map((catKey) => (
          <RateCategorySection
            key={catKey}
            categoryKey={catKey}
            items={workOperations.filter((o) => o.type === catKey)}
            onOpenCreateRateModal={onOpenCreateRateModal}
            onOpenEditRateModal={onOpenEditRateModal}
            onDeleteRate={onDeleteRate}
          />
        ))}
      </div>
    </div>
  );
}
