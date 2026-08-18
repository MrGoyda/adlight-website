"use client";

import React, { useState } from "react";
import { WorkOperationItem } from "../../_types/pricingTypes";
import { INVENTORY_UNITS, RATE_CATEGORIES } from "../../_data/pricingDictionary";
import { EstimateItemType } from "@prisma/client";
import { Plus, Edit2, Trash2, ArrowUpRight, TrendingUp } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";

interface EstimateRatesTabProps {
  workOperations: WorkOperationItem[];
  onOpenCreateRateModal: (type: EstimateItemType) => void;
  onOpenEditRateModal: (rate: WorkOperationItem) => void;
  onDeleteRate: (id: string) => Promise<void>;
}

export default function EstimateRatesTab({
  workOperations,
  onOpenCreateRateModal,
  onOpenEditRateModal,
  onDeleteRate,
}: EstimateRatesTabProps) {
  const [filterType, setFilterType] = useState<string>("all");

  const categoriesToRender: EstimateItemType[] = [
    "LOGISTICS",
    "EQUIPMENT",
    "ASSEMBLY",
    "INSTALLATION",
    "CUSTOM",
  ];

  const visibleCategories =
    filterType === "all"
      ? categoriesToRender
      : categoriesToRender.filter((cat) => cat === filterType);

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

        {categoriesToRender.map((catKey) => {
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
        {visibleCategories.map((catKey) => {
          const catMeta = RATE_CATEGORIES[catKey];
          const items = workOperations.filter((o) => o.type === catKey);

          return (
            <div
              key={catKey}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden"
            >
              {/* Шапка блока */}
              <div className={`p-4 sm:px-6 sm:py-4 border-b border-slate-200/80 flex items-center justify-between gap-3 ${catMeta.bgLight}`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{catMeta.icon}</span>
                  <div>
                    <h3 className="font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
                      <span>{catMeta.label}</span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${catMeta.badgeColor}`}>
                        {items.length} позиций
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-500 hidden sm:block">{catMeta.description}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenCreateRateModal(catKey)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-black shadow-xs transition active:scale-95 cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Добавить тариф</span>
                  <span className="sm:hidden">+</span>
                </button>
              </div>

              {/* Таблица тарифов */}
              {items.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  Нет настроенных тарифов в этой категории. Нажмите «Добавить тариф».
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {/* Заголовки на десктопе */}
                  <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-2.5 bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    <div className="col-span-5">Операция / Вид работы</div>
                    <div className="col-span-2 text-right">ЗП (Себестоимость)</div>
                    <div className="col-span-2 text-right">Цена в смете</div>
                    <div className="col-span-2 text-right">Маржа / Наценка</div>
                    <div className="col-span-1 text-center">Действия</div>
                  </div>

                  {items.map((item) => {
                    const unitShort = INVENTORY_UNITS[item.unit]?.short || "ед.";
                    const margin = item.defaultPrice - item.defaultCost;
                    const markupPercent =
                      item.defaultCost > 0 ? Math.round((margin / item.defaultCost) * 100) : 0;

                    return (
                      <div
                        key={item.id}
                        className="p-4 sm:px-6 sm:py-3.5 hover:bg-slate-50/80 transition flex flex-col md:grid md:grid-cols-12 md:gap-4 md:items-center gap-2"
                      >
                        {/* Название */}
                        <div className="md:col-span-5 flex items-start gap-2">
                          <div className="min-w-0 flex-1">
                            <span className="text-xs sm:text-sm font-extrabold text-slate-900 block break-words">
                              {item.name}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400">
                              Ед. измерения: {INVENTORY_UNITS[item.unit]?.label || item.unit} ({unitShort})
                            </span>
                          </div>
                        </div>

                        {/* Себестоимость (ЗП) */}
                        <div className="md:col-span-2 flex items-center justify-between md:justify-end gap-1">
                          <span className="text-[11px] font-bold text-rose-600 md:hidden">ЗП мастера:</span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs font-black">
                            {Number(item.defaultCost).toLocaleString("ru-RU")} ₸
                          </span>
                        </div>

                        {/* Цена в смете */}
                        <div className="md:col-span-2 flex items-center justify-between md:justify-end gap-1">
                          <span className="text-[11px] font-bold text-emerald-600 md:hidden">В смете:</span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black">
                            {Number(item.defaultPrice).toLocaleString("ru-RU")} ₸
                          </span>
                        </div>

                        {/* Маржа */}
                        <div className="md:col-span-2 flex items-center justify-between md:justify-end gap-1">
                          <span className="text-[11px] font-bold text-slate-500 md:hidden">Маржа:</span>
                          <span className="inline-flex items-center gap-1 text-xs font-black text-slate-800">
                            <TrendingUp className="w-3 h-3 text-emerald-500" />
                            <span>+{margin.toLocaleString("ru-RU")} ₸</span>
                            <span className="text-[10px] text-slate-400">({markupPercent}%)</span>
                          </span>
                        </div>

                        {/* Кнопки */}
                        <div className="md:col-span-1 flex items-center justify-end md:justify-center gap-1 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                          <button
                            type="button"
                            onClick={() => onOpenEditRateModal(item)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                            title="Редактировать ставку"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteRate(item.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                            title="Удалить тариф"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
