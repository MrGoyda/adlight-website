"use client";

import React from "react";
import { PricingTabType } from "../_types/pricingTypes";
import { Package, Calculator, Building2, Plus, Sparkles } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";

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

export default function PricingHeader({
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
      label: "Каталог товаров и материалов",
      shortLabel: "Материалы",
      icon: Package,
      count: materialsCount,
      color: "text-orange-600",
    },
    {
      id: "rates" as PricingTabType,
      label: "Тарифы сметы (Газель, Вышка, ЗП)",
      shortLabel: "Тарифы сметы",
      icon: Calculator,
      count: ratesCount,
      color: "text-indigo-600",
    },
    {
      id: "suppliers" as PricingTabType,
      label: "База поставщиков",
      shortLabel: "Поставщики",
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
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              База товаров и Тарифы сметы
            </h1>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
            Единый центр управления себестоимостью, прайсами поставщиков, логистикой и ставками ЗП
          </p>
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
              <span>Добавить материал</span>
            </button>
          )}

          {activeTab === "rates" && (
            <button
              type="button"
              onClick={onOpenCreateRate}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-black shadow-md shadow-indigo-600/20 transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Новый тариф сметы</span>
            </button>
          )}

          {activeTab === "suppliers" && (
            <button
              type="button"
              onClick={onOpenCreateSupplier}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-black shadow-md shadow-blue-600/20 transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Новый поставщик</span>
            </button>
          )}
        </div>
      </div>

      {/* Табы переключения */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-200/80 rounded-2xl overflow-x-auto no-scrollbar shadow-inner">
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
