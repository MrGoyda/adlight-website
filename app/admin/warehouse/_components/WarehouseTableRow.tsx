"use client";

import React, { memo } from "react";
import { 
  Plus, 
  Minus, 
  Edit3, 
  Trash2, 
  MapPin, 
  AlertTriangle 
} from "lucide-react";
import { WarehouseItemData } from "../_types/warehouseTypes";
import { UNIT_LABELS } from "../constants";
import { triggerHaptic } from "@/lib/haptics";

interface WarehouseTableRowProps {
  item: WarehouseItemData;
  index: number;
  onOpenEditModal: (item: WarehouseItemData) => void;
  onOpenAdjustModal: (item: WarehouseItemData, mode: "in" | "out") => void;
  onDeleteItem: (id: string, name: string) => void;
}

export const WarehouseTableRow = memo(function WarehouseTableRow({
  item,
  index,
  onOpenEditModal,
  onOpenAdjustModal,
  onDeleteItem,
}: WarehouseTableRowProps) {
  const isOutOfStock = item.quantity <= 0;
  const isLowStock = !isOutOfStock && item.minStock > 0 && item.quantity <= item.minStock;
  const totalValue = item.quantity * item.price;
  const unitLabel = UNIT_LABELS[item.unit] || item.unit;

  return (
    <tr className="group hover:bg-slate-50/80 transition-colors duration-150">
      {/* 1. Порядковый номер */}
      <td className="py-3 px-4 text-center text-slate-400 font-mono text-[11px] select-none">
        {index + 1}
      </td>

      {/* 2. Наименование и категория */}
      <td className="py-3 px-4">
        <div className="flex flex-col">
          <span className="font-semibold text-xs sm:text-sm text-slate-900 group-hover:text-orange-600 transition">
            {item.name}
          </span>
          <span className="text-[11px] text-slate-400 font-medium">
            {item.category}
          </span>
        </div>
      </td>

      {/* 3. Локация на складе / в цехе */}
      <td className="py-3 px-3">
        {item.location ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200/60">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate max-w-[120px]">{item.location}</span>
          </span>
        ) : (
          <span className="text-[11px] text-slate-300 italic">—</span>
        )}
      </td>

      {/* 4. Остаток и индикатор статуса */}
      <td className="py-3 px-3 text-right">
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1.5">
            {isLowStock && (
              <span title="Ниже минимального запаса" className="inline-flex">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              </span>
            )}
            <span
              className={`font-mono font-bold text-xs sm:text-sm ${
                isOutOfStock
                  ? "text-rose-600"
                  : isLowStock
                  ? "text-amber-600"
                  : "text-slate-900"
              }`}
            >
              {item.quantity.toLocaleString("ru-RU")}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              {unitLabel}
            </span>
          </div>

          {item.minStock > 0 && (
            <span className="text-[10px] text-slate-400 font-mono">
              мин: {item.minStock} {unitLabel}
            </span>
          )}
        </div>
      </td>

      {/* 5. Себестоимость за единицу */}
      <td className="py-3 px-3 text-right font-mono text-xs text-slate-600">
        {item.price > 0 ? `${item.price.toLocaleString("ru-RU")} ₸` : "—"}
      </td>

      {/* 6. Общая стоимость запаса */}
      <td className="py-3 px-3 text-right font-mono font-bold text-xs text-slate-900">
        {totalValue > 0 ? `${totalValue.toLocaleString("ru-RU")} ₸` : "0 ₸"}
      </td>

      {/* 7. Быстрые действия со складом */}
      <td className="py-3 px-4 text-center">
        <div className="flex items-center justify-end gap-1">
          {/* Быстрый приход (+) */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic("light");
              onOpenAdjustModal(item, "in");
            }}
            className="p-1.5 rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition active:scale-95 cursor-pointer shadow-2xs"
            title="Оприходовать (+ приход)"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>

          {/* Быстрое списание (-) */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic("light");
              onOpenAdjustModal(item, "out");
            }}
            disabled={item.quantity <= 0}
            className="p-1.5 rounded-lg text-amber-700 bg-amber-50 hover:bg-amber-100 transition active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
            title="Списать (- расход)"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          {/* Редактировать карточку */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic("light");
              onOpenEditModal(item);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition active:scale-95 cursor-pointer"
            title="Редактировать параметры"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>

          {/* Удалить карточку */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic("medium");
              onDeleteItem(item.id, item.name);
            }}
            className="p-1.5 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition active:scale-95 cursor-pointer"
            title="Удалить карточку"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
});
