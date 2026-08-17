"use client";

import React from "react";
import { EstimateItem, WarehouseItem, SupplierPrice } from "./types";
import { 
  ITEM_TYPE_LABELS, 
  UNIT_LABELS, 
  EQUIPMENT_PRESETS, 
  LONG_TRUCK_PRESETS, 
  STANDARD_TRUCK_PRESETS 
} from "./constants";
import { Trash2, Wrench } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { InventoryUnit } from "@prisma/client";

interface EstimateCardItemProps {
  item: EstimateItem;
  index: number;
  warehouseItems: WarehouseItem[];
  supplierPrices: SupplierPrice[];
  onRemove: (index: number) => void;
  onUpdateField: (index: number, field: keyof EstimateItem, value: any) => void;
  onOpenSupplierPicker: (index: number) => void;
  onOpenWorkOperationPicker: (index: number) => void;
}

export const EstimateCardItem: React.FC<EstimateCardItemProps> = ({
  item,
  index: idx,
  warehouseItems,
  supplierPrices,
  onRemove,
  onUpdateField,
  onOpenSupplierPicker,
  onOpenWorkOperationPicker,
}) => {
  const typeInfo = ITEM_TYPE_LABELS[item.type];
  const TypeIcon = typeInfo.icon;
  const itemCostTotal = Number(item.costPrice || 0) * Number(item.quantity || 0);
  const itemSellTotal = Number(item.sellPrice || 0) * Number(item.quantity || 0);
  const itemProfit = itemSellTotal - itemCostTotal;
  const selectedPrice = supplierPrices.find((p) => p.id === item.supplierPriceId);

  const is6mTruck =
    item.type === "LOGISTICS" &&
    (item.name.toLowerCase().includes("6м") ||
      item.name.toLowerCase().includes("6-м") ||
      item.name.toLowerCase().includes("длинномер"));

  return (
    <div
      id={`estimate-item-${idx}`}
      className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/90 space-y-3 shadow-2xs animate-in fade-in slide-in-from-bottom-2 duration-150 scroll-mt-3"
    >
      {/* Шапка карточки */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black border ${typeInfo.bg}`}
        >
          <TypeIcon className="w-3 h-3 shrink-0" />
          <span>{typeInfo.label}</span>
        </span>

        <button
          type="button"
          onClick={() => onRemove(idx)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer active:scale-90"
          title="Удалить строку"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Наименование / Селектор */}
      <div className="w-full">
        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
          Наименование позиции:
        </label>
        {item.type === "MATERIAL_STOCK" ? (
          <select
            value={item.warehouseItemId || ""}
            onChange={(e) => onUpdateField(idx, "warehouseItemId", e.target.value)}
            className="w-full px-3 py-2 text-base sm:text-xs font-bold border border-slate-200 bg-white rounded-xl focus:border-orange-500 outline-none shadow-2xs"
          >
            {warehouseItems.map((wi) => (
              <option key={wi.id} value={wi.id}>
                {wi.name} (остаток {wi.quantity} {UNIT_LABELS[wi.unit]}) —{" "}
                {wi.price.toLocaleString()} ₸
              </option>
            ))}
          </select>
        ) : item.type === "MATERIAL_SUPPLIER" ? (
          <button
            type="button"
            onClick={() => onOpenSupplierPicker(idx)}
            className="w-full p-2.5 text-left border border-slate-200 bg-white hover:bg-slate-50 rounded-xl transition cursor-pointer flex items-center justify-between shadow-2xs active:scale-98"
          >
            <div className="flex flex-col truncate pr-2">
              {selectedPrice && (
                <span className="text-[9px] text-purple-600 font-black uppercase">
                  [{selectedPrice.supplier}]
                </span>
              )}
              <span className="text-slate-900 font-extrabold text-xs truncate">
                {item.name || "Выберите материал из прайса..."}
              </span>
            </div>
            <span className="text-[11px] font-black text-orange-600 bg-orange-50 px-2 py-1 rounded-lg border border-orange-100 shrink-0">
              {selectedPrice ? "Сменить" : "Выбрать ▾"}
            </span>
          </button>
        ) : item.type === "ASSEMBLY" || item.type === "INSTALLATION" ? (
          <button
            type="button"
            onClick={() => onOpenWorkOperationPicker(idx)}
            className="w-full p-2.5 text-left border border-slate-200 bg-white hover:bg-slate-50 rounded-xl transition cursor-pointer flex items-center justify-between shadow-2xs active:scale-98"
          >
            <div className="flex flex-col truncate pr-2">
              <span
                className={`text-[9px] font-black uppercase ${
                  item.type === "ASSEMBLY" ? "text-indigo-600" : "text-emerald-600"
                }`}
              >
                [{item.type === "ASSEMBLY" ? "Сборка цеха" : "Монтаж / Демонтаж"}]
              </span>
              <span className="text-slate-900 font-extrabold text-xs truncate">
                {item.name || "Выберите вид работы..."}
              </span>
            </div>
            <span
              className={`text-[11px] font-black px-2.5 py-1 rounded-lg border shrink-0 ${
                item.type === "ASSEMBLY"
                  ? "text-indigo-600 bg-indigo-50 border-indigo-100"
                  : "text-emerald-600 bg-emerald-50 border-emerald-100"
              }`}
            >
              Выбрать ▾
            </span>
          </button>
        ) : (
          <input
            type="text"
            value={item.name}
            onChange={(e) => onUpdateField(idx, "name", e.target.value)}
            className="w-full px-3 py-2 text-base sm:text-xs font-bold border border-slate-200 bg-white rounded-xl focus:border-orange-500 outline-none shadow-2xs"
          />
        )}
      </div>

      {/* Спец-тариф: Автовышка */}
      {item.type === "EQUIPMENT" && (
        <div className="bg-orange-50/80 p-2.5 rounded-xl border border-orange-200/80 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-orange-950 uppercase tracking-wider flex items-center gap-1">
              <Wrench className="w-3 h-3 text-orange-600" />
              Тариф вышки (мин. 2 ч = 20 000 ₸, далее +10k/ч)
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {EQUIPMENT_PRESETS.map((preset) => {
              const isSelected = Number(item.quantity) === preset.h;
              return (
                <button
                  key={preset.h}
                  type="button"
                  onClick={() => {
                    triggerHaptic("light");
                    onUpdateField(idx, "quantity", preset.h);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-black transition cursor-pointer active:scale-95 ${
                    isSelected
                      ? "bg-orange-600 text-white shadow-2xs"
                      : "bg-white text-slate-700 border border-orange-200 hover:bg-orange-100/50"
                  }`}
                >
                  {preset.label}: {preset.costTotal.toLocaleString()} ₸
                </button>
              );
            })}
          </div>
          <p className="text-[9px] text-orange-800 font-medium">
            Выбрано: {Number(item.quantity) || 0} ч • Итого себес: {itemCostTotal.toLocaleString()} ₸
          </p>
        </div>
      )}

      {/* Спец-тариф: Логистика / Газель */}
      {item.type === "LOGISTICS" && (
        <div className="bg-amber-50/80 p-2.5 rounded-xl border border-amber-200/80 space-y-2">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={is6mTruck}
              onChange={(e) => {
                triggerHaptic("light");
                const is6m = e.target.checked;
                if (is6m) {
                  onUpdateField(idx, "name", "Аренда 6-метровой газели (2 ч)");
                  onUpdateField(idx, "quantity", 2);
                  onUpdateField(idx, "costPrice", 10000);
                  onUpdateField(idx, "sellPrice", 13000);
                } else {
                  onUpdateField(idx, "name", "Аренда газели (город 1 рейс)");
                  onUpdateField(idx, "quantity", 1);
                  onUpdateField(idx, "costPrice", 15000);
                  onUpdateField(idx, "sellPrice", 20000);
                }
              }}
              className="w-4 h-4 rounded text-amber-600 border-amber-300 focus:ring-amber-500 cursor-pointer"
            />
            <span className="text-xs font-black text-amber-950">
              6-метровая газель (неделимые 2 часа)
            </span>
          </label>

          {is6mTruck ? (
            <div className="space-y-1">
              <div className="flex flex-wrap gap-1.5">
                {LONG_TRUCK_PRESETS.map((preset) => {
                  const isSelected = Number(item.quantity) === preset.h;
                  return (
                    <button
                      key={preset.h}
                      type="button"
                      onClick={() => {
                        triggerHaptic("light");
                        onUpdateField(idx, "quantity", preset.h);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-black transition cursor-pointer active:scale-95 ${
                        isSelected
                          ? "bg-amber-600 text-white shadow-2xs"
                          : "bg-white text-slate-700 border border-amber-200 hover:bg-amber-100/50"
                      }`}
                    >
                      {preset.label}: {preset.costTotal.toLocaleString()} ₸
                    </button>
                  );
                })}
              </div>
              <p className="text-[9px] text-amber-800 font-medium">
                6м длинномер: минимум 2 часа (20 000 ₸), далее +10 000 ₸/час
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {STANDARD_TRUCK_PRESETS.map((preset) => {
                const isSelected = Number(item.quantity) === preset.trips;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      triggerHaptic("light");
                      onUpdateField(idx, "quantity", preset.trips);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-black transition cursor-pointer active:scale-95 ${
                      isSelected
                        ? "bg-amber-600 text-white shadow-2xs"
                        : "bg-white text-slate-700 border border-amber-200 hover:bg-amber-100/50"
                    }`}
                  >
                    {preset.label}: {preset.costTotal.toLocaleString()} ₸
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Сетка ввода: Количество + Единица */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[10px] font-bold text-slate-500 mb-1">
            {item.type === "EQUIPMENT" || is6mTruck
              ? "Часов аренды (мин. 2):"
              : item.type === "LOGISTICS"
              ? "Кол-во рейсов:"
              : "Количество:"}
          </label>
          <input
            type="number"
            step="any"
            placeholder="0"
            value={item.quantity === 0 ? "" : item.quantity ?? ""}
            onChange={(e) => onUpdateField(idx, "quantity", e.target.value)}
            className="w-full px-3 py-2 text-base sm:text-xs font-black text-slate-900 bg-white border border-slate-200 rounded-xl focus:border-orange-500 outline-none shadow-2xs"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 mb-1">
            Ед. измерения:
          </label>
          {item.type === "MATERIAL_STOCK" || item.type === "MATERIAL_SUPPLIER" ? (
            <div className="w-full px-3 py-2 text-base sm:text-xs font-extrabold text-slate-600 bg-slate-100 border border-slate-200 rounded-xl truncate">
              {UNIT_LABELS[item.unit || "PIECE"]}
            </div>
          ) : item.type === "EQUIPMENT" || is6mTruck ? (
            <div className="w-full px-3 py-2 text-base sm:text-xs font-black text-orange-700 bg-orange-50/80 border border-orange-200/80 rounded-xl truncate">
              ч (час)
            </div>
          ) : item.type === "LOGISTICS" ? (
            <div className="w-full px-3 py-2 text-base sm:text-xs font-black text-amber-700 bg-amber-50/80 border border-amber-200/80 rounded-xl truncate">
              рейс
            </div>
          ) : (
            <select
              value={item.unit || "PIECE"}
              onChange={(e) => onUpdateField(idx, "unit", e.target.value as InventoryUnit)}
              className="w-full px-2 py-2 text-base sm:text-xs font-bold bg-white border border-slate-200 rounded-xl focus:border-orange-500 outline-none shadow-2xs"
            >
              {Object.entries(UNIT_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Сетка цен: Себестоимость + Продажа */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[10px] font-bold text-slate-500 mb-1">
            Себестоимость (₸):
          </label>
          <input
            type="number"
            step="any"
            placeholder="0"
            disabled={item.type === "MATERIAL_STOCK" || item.type === "MATERIAL_SUPPLIER"}
            value={item.costPrice === 0 ? "" : item.costPrice ?? ""}
            onChange={(e) => onUpdateField(idx, "costPrice", e.target.value)}
            className="w-full px-3 py-2 text-base sm:text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl focus:border-orange-500 outline-none disabled:bg-slate-100 disabled:text-slate-400 shadow-2xs"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 mb-1">
            Цена продажи (₸):
          </label>
          <input
            type="number"
            step="any"
            placeholder="0"
            value={item.sellPrice === 0 ? "" : item.sellPrice ?? ""}
            onChange={(e) => onUpdateField(idx, "sellPrice", e.target.value)}
            className="w-full px-3 py-2 text-base sm:text-xs font-black text-slate-900 bg-white border border-slate-200 rounded-xl focus:border-orange-500 outline-none shadow-2xs"
          />
        </div>
      </div>

      {/* Итог по позиции */}
      <div className="bg-white p-2.5 rounded-xl border border-slate-200/70 flex items-center justify-between text-xs">
        <div>
          <span className="text-[9px] font-bold text-slate-400 uppercase block">Итого клиенту:</span>
          <span className="font-black text-slate-900">{itemSellTotal.toLocaleString()} ₸</span>
        </div>
        <div className="text-right">
          <span className="text-[9px] font-bold text-slate-400 uppercase block">Наценка (Прибыль):</span>
          <span
            className={`font-black ${itemProfit >= 0 ? "text-emerald-600" : "text-rose-600"}`}
          >
            {itemProfit >= 0 ? `+${itemProfit.toLocaleString()}` : itemProfit.toLocaleString()} ₸
          </span>
        </div>
      </div>
    </div>
  );
};
