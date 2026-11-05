"use client";

import React, { memo } from "react";
import { InventoryUnit } from "@prisma/client";
import { Trash2 } from "lucide-react";
import { SpreadsheetItem } from "../_types/calculatorTypes";
import { ITEM_TYPE_META, UNIT_LABELS } from "../_data/estimateSpreadsheetDictionary";

interface EstimateTableRowProps {
  item: SpreadsheetItem;
  index: number;
  onUpdateItem: (id: string, field: keyof SpreadsheetItem, value: string | number | InventoryUnit) => void;
  onRemoveItem: (id: string) => void;
}

export const EstimateTableRow = memo(function EstimateTableRow({
  item,
  index,
  onUpdateItem,
  onRemoveItem,
}: EstimateTableRowProps) {
  const totalItemCost = (Number(item.quantity) || 0) * (Number(item.costPrice) || 0);
  const totalItemSell = (Number(item.quantity) || 0) * (Number(item.sellPrice) || 0);
  const itemMargin = totalItemSell - totalItemCost;
  const itemMarginPercent = totalItemSell > 0 ? Math.round((itemMargin / totalItemSell) * 100) : 0;

  const meta = ITEM_TYPE_META[item.type] || ITEM_TYPE_META.CUSTOM;
  const TypeIcon = meta.icon;

  return (
    <tr className="group hover:bg-slate-50/70 transition-colors duration-150">
      {/* Номер */}
      <td className="py-2.5 px-4 text-center text-slate-400 font-mono text-[11px]">
        {index + 1}
      </td>

      {/* Название */}
      <td className="py-2.5 px-4">
        <input
          type="text"
          value={item.name}
          onChange={(e) => onUpdateItem(item.id, "name", e.target.value)}
          placeholder="Введите название материала или услуги..."
          className="w-full bg-transparent font-medium text-slate-900 placeholder:text-slate-300 focus:outline-none focus:bg-white focus:ring-1 focus:ring-orange-500/30 rounded-lg px-2 py-1 -ml-2 transition"
        />
      </td>

      {/* Категория */}
      <td className="py-2.5 px-3">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold border ${meta.badgeColor}`}>
          <TypeIcon className="w-3 h-3" />
          <span>{meta.shortLabel}</span>
        </span>
      </td>

      {/* Количество */}
      <td className="py-2.5 px-3 text-right">
        <input
          type="number"
          min="0"
          step="any"
          value={item.quantity === 0 ? "" : item.quantity}
          onChange={(e) => onUpdateItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
          className="w-20 text-right font-medium text-slate-900 bg-transparent focus:bg-white focus:ring-1 focus:ring-orange-500/30 rounded-lg px-1.5 py-1 focus:outline-none transition"
        />
      </td>

      {/* Единица измерения */}
      <td className="py-2.5 px-3">
        <select
          value={item.unit}
          onChange={(e) => onUpdateItem(item.id, "unit", e.target.value as InventoryUnit)}
          className="bg-transparent text-[11px] font-medium text-slate-600 focus:outline-none focus:bg-white rounded-lg px-1 py-1 cursor-pointer"
        >
          {(Object.keys(UNIT_LABELS) as InventoryUnit[]).map((u) => (
            <option key={u} value={u}>
              {UNIT_LABELS[u]}
            </option>
          ))}
        </select>
      </td>

      {/* Себестоимость (закупка) */}
      <td className="py-2.5 px-3 text-right">
        <input
          type="number"
          min="0"
          value={item.costPrice === 0 ? "" : item.costPrice}
          onChange={(e) => onUpdateItem(item.id, "costPrice", parseFloat(e.target.value) || 0)}
          placeholder="0"
          className="w-24 text-right font-mono text-slate-600 bg-transparent focus:bg-white focus:ring-1 focus:ring-orange-500/30 rounded-lg px-1.5 py-1 focus:outline-none transition"
        />
      </td>

      {/* Цена продажи клиенту */}
      <td className="py-2.5 px-3 text-right">
        <input
          type="number"
          min="0"
          value={item.sellPrice === 0 ? "" : item.sellPrice}
          onChange={(e) => onUpdateItem(item.id, "sellPrice", parseFloat(e.target.value) || 0)}
          placeholder="0"
          className="w-24 text-right font-mono font-bold text-slate-900 bg-transparent focus:bg-white focus:ring-1 focus:ring-orange-500/30 rounded-lg px-1.5 py-1 focus:outline-none transition"
        />
      </td>

      {/* Сумма по строке */}
      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
        {totalItemSell.toLocaleString("ru-RU")} ₸
      </td>

      {/* Маржинальность строки */}
      <td className="py-2.5 px-3 text-center">
        <span
          className={`inline-block font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
            itemMarginPercent >= 40
              ? "bg-emerald-50 text-emerald-700"
              : itemMarginPercent >= 20
              ? "bg-amber-50 text-amber-700"
              : "bg-rose-50 text-rose-700"
          }`}
        >
          {itemMarginPercent > 0 ? `+${itemMarginPercent}%` : `${itemMarginPercent}%`}
        </span>
      </td>

      {/* Действия */}
      <td className="py-2.5 px-3 text-center">
        <button
          type="button"
          onClick={() => onRemoveItem(item.id)}
          className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition cursor-pointer"
          title="Удалить строку"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </td>
    </tr>
  );
});
