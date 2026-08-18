"use client";

import React from "react";
import { WorkOperationItem } from "../../../_types/pricingTypes";
import { RATE_CATEGORIES } from "../../../_data/pricingDictionary";
import { EstimateItemType } from "@prisma/client";
import { Plus } from "lucide-react";
import RateRowItem from "./RateRowItem";

interface RateCategorySectionProps {
  categoryKey: EstimateItemType;
  items: WorkOperationItem[];
  onOpenCreateRateModal: (type: EstimateItemType) => void;
  onOpenEditRateModal: (rate: WorkOperationItem) => void;
  onDeleteRate: (id: string) => Promise<void>;
}

export default function RateCategorySection({
  categoryKey,
  items,
  onOpenCreateRateModal,
  onOpenEditRateModal,
  onDeleteRate,
}: RateCategorySectionProps) {
  const catMeta = RATE_CATEGORIES[categoryKey];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
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
          onClick={() => onOpenCreateRateModal(categoryKey)}
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

          {items.map((item) => (
            <RateRowItem
              key={item.id}
              item={item}
              onOpenEditRateModal={onOpenEditRateModal}
              onDeleteRate={onDeleteRate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
