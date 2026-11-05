"use client";

import React from "react";
import { PricingTabType } from "../_types/pricingTypes";
import { Package, Calculator, Building2, Plus, Boxes } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { pricingDict } from "@/dictionaries/pricing";

interface PricingHeaderProps {
  activeTab: PricingTabType;
  onChangeTab: (tab: PricingTabType) => void;
  materialsCount: number;
  ratesCount: number;
  suppliersCount: number;
  onOpenCreateMaterial: () => void;
  onOpenCreateRate: () => void;
  onOpenCreateSupplier: () => void;
}

function PricingHeader({
  activeTab,
  onChangeTab,
  materialsCount,
  ratesCount,
  suppliersCount,
  onOpenCreateMaterial,
  onOpenCreateRate,
  onOpenCreateSupplier,
}: PricingHeaderProps) {
  const tabs = [
    {
      id: "materials" as PricingTabType,
      label: pricingDict.header.tabs.materials.label,
      shortLabel: pricingDict.header.tabs.materials.shortLabel,
      icon: Package,
      count: materialsCount,
      color: "text-orange-600",
    },
    {
      id: "rates" as PricingTabType,
      label: pricingDict.header.tabs.rates.label,
      shortLabel: pricingDict.header.tabs.rates.shortLabel,
      icon: Calculator,
      count: ratesCount,
      color: "text-indigo-600",
    },
    {
      id: "suppliers" as PricingTabType,
      label: pricingDict.header.tabs.suppliers.label,
      shortLabel: pricingDict.header.tabs.suppliers.shortLabel,
      icon: Building2,
      count: suppliersCount,
      color: "text-blue-600",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Верхний ряд: Заголовок + Главная кнопка действия */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xs shrink-0">
              <Boxes className="w-5 h-5 text-slate-100" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                {pricingDict.header.title}
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5">
                {pricingDict.header.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Быстрое добавление в текущей вкладке */}
        <div className="flex items-center gap-2 shrink-0">
          {activeTab === "materials" && (
            <button
              type="button"
              onClick={onOpenCreateMaterial}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm font-black shadow-md shadow-orange-600/20 transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{pricingDict.header.actions.addMaterial}</span>
            </button>
          )}

          {activeTab === "rates" && (
            <button
              type="button"
              onClick={onOpenCreateRate}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-black shadow-md shadow-indigo-600/20 transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{pricingDict.header.actions.addRate}</span>
            </button>
          )}

          {activeTab === "suppliers" && (
            <button
              type="button"
              onClick={onOpenCreateSupplier}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-black shadow-md shadow-blue-600/20 transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{pricingDict.header.actions.addSupplier}</span>
            </button>
          )}
        </div>
      </div>

      {/* Нижний ряд: Табы переключения секций */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl overflow-x-auto">
        {tabs.map((t) => {
          const isActive = activeTab === t.id;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                triggerHaptic("light");
                onChangeTab(t.id);
              }}
              className={`flex-1 min-w-max py-2.5 px-3 sm:px-5 rounded-xl font-black text-xs sm:text-sm transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 active:scale-98 select-none ${
                isActive
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200/60"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? t.color : "text-slate-400"}`} />
              <span className="hidden sm:inline">{t.label}</span>
              <span className="sm:hidden">{t.shortLabel}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                  isActive ? "bg-slate-900 text-white" : "bg-slate-300 text-slate-700"
                }`}
              >
                {t.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default React.memo(PricingHeader);
