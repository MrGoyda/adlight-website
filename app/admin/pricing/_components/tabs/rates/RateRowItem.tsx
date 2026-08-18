"use client";

import React from "react";
import { WorkOperationItem } from "../../../_types/pricingTypes";
import { INVENTORY_UNITS } from "../../../_data/pricingDictionary";
import { Edit2, Trash2 } from "lucide-react";

interface RateRowItemProps {
  item: WorkOperationItem;
  onOpenEditRateModal: (rate: WorkOperationItem) => void;
  onDeleteRate: (id: string) => Promise<void>;
}

export default function RateRowItem({
  item,
  onOpenEditRateModal,
  onDeleteRate,
}: RateRowItemProps) {
  const unitShort = INVENTORY_UNITS[item.unit]?.short || "ед.";
  const margin = item.defaultPrice - item.defaultCost;
  const markupPercent =
    item.defaultCost > 0 ? Math.round((margin / item.defaultCost) * 100) : 0;

  return (
    <div className="p-4 sm:px-6 sm:py-3.5 hover:bg-slate-50/80 transition flex flex-col md:grid md:grid-cols-12 md:gap-4 md:items-center gap-2">
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
      <div className="md:col-span-2 flex items-center justify-between md:justify-end gap-2">
        <span className="text-[11px] font-bold text-slate-400 md:hidden">ЗП мастера:</span>
        <div className="text-right">
          <span className="text-xs sm:text-sm font-black text-slate-700">
            {Number(item.defaultCost).toLocaleString("ru-RU")} ₸
          </span>
          <span className="text-[10px] text-slate-400 font-bold block">/ {unitShort}</span>
        </div>
      </div>

      {/* Цена в смете */}
      <div className="md:col-span-2 flex items-center justify-between md:justify-end gap-2">
        <span className="text-[11px] font-bold text-slate-400 md:hidden">В смете:</span>
        <div className="text-right">
          <span className="text-xs sm:text-sm font-black text-emerald-600">
            {Number(item.defaultPrice).toLocaleString("ru-RU")} ₸
          </span>
          <span className="text-[10px] text-slate-400 font-bold block">/ {unitShort}</span>
        </div>
      </div>

      {/* Маржа и Наценка */}
      <div className="md:col-span-2 flex items-center justify-between md:justify-end gap-2">
        <span className="text-[11px] font-bold text-slate-400 md:hidden">Маржа компании:</span>
        <div className="text-right">
          <span className="text-xs font-black text-indigo-600">
            +{Number(margin).toLocaleString("ru-RU")} ₸
          </span>
          <span className="text-[10px] font-bold text-indigo-400 block">
            (+{markupPercent}%)
          </span>
        </div>
      </div>

      {/* Действия */}
      <div className="md:col-span-1 flex items-center justify-end md:justify-center gap-1 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
        <button
          type="button"
          onClick={() => onOpenEditRateModal(item)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          title="Редактировать тариф"
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
}
