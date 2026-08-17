"use client";

import React from "react";
import { EstimateItem, WarehouseItem, SupplierPrice } from "./types";
import { 
  ITEM_TYPE_LABELS, 
  UNIT_LABELS, 
  EQUIPMENT_PRESETS, 
  LONG_TRUCK_PRESETS 
} from "./constants";
import { Trash2 } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { InventoryUnit } from "@prisma/client";

interface EstimateTableProps {
  items: EstimateItem[];
  warehouseItems: WarehouseItem[];
  supplierPrices: SupplierPrice[];
  onRemove: (index: number) => void;
  onUpdateField: (index: number, field: keyof EstimateItem, value: any) => void;
  onOpenSupplierPicker: (index: number) => void;
  onOpenWorkOperationPicker: (index: number) => void;
}

export const EstimateTable: React.FC<EstimateTableProps> = ({
  items,
  warehouseItems,
  supplierPrices,
  onRemove,
  onUpdateField,
  onOpenSupplierPicker,
  onOpenWorkOperationPicker,
}) => {
  return (
    <div className="hidden lg:block border border-slate-200/80 rounded-2xl overflow-hidden bg-white shadow-2xs">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
            <th className="p-3.5 w-1/4">Название / Материал</th>
            <th className="p-3.5 w-28">Тип</th>
            <th className="p-3.5 w-24 text-right">Кол-во</th>
            <th className="p-3.5 w-24">Ед. изм.</th>
            <th className="p-3.5 w-28 text-right">Себестоимость</th>
            <th className="p-3.5 w-28 text-right">Цена продажи</th>
            <th className="p-3.5 w-28 text-right">Итого (Прод.)</th>
            <th className="p-3.5 w-12 text-center"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-xs font-semibold">
          {items.length === 0 ? (
            <tr>
              <td colSpan={8} className="p-8 text-center text-slate-400 italic">
                Добавьте позиции затрат по кнопкам выше
              </td>
            </tr>
          ) : (
            items.map((item, idx) => {
              const TypeIcon = ITEM_TYPE_LABELS[item.type].icon;
              const selectedPrice = supplierPrices.find((p) => p.id === item.supplierPriceId);
              const is6m =
                item.type === "LOGISTICS" &&
                (item.name.toLowerCase().includes("6м") ||
                  item.name.toLowerCase().includes("6-м") ||
                  item.name.toLowerCase().includes("длинномер"));

              return (
                <tr id={`estimate-row-${idx}`} key={idx} className="hover:bg-slate-50/50 transition scroll-mt-3">
                  <td className="p-3">
                    {item.type === "MATERIAL_STOCK" ? (
                      <select
                        value={item.warehouseItemId || ""}
                        onChange={(e) => onUpdateField(idx, "warehouseItemId", e.target.value)}
                        className="w-full px-2 py-1.5 text-xs font-bold border border-slate-200 bg-white rounded-lg focus:border-orange-500 outline-none"
                      >
                        {warehouseItems.map((wi) => (
                          <option key={wi.id} value={wi.id}>
                            {wi.name} ({wi.quantity} {UNIT_LABELS[wi.unit]}) — {wi.price} ₸
                          </option>
                        ))}
                      </select>
                    ) : item.type === "MATERIAL_SUPPLIER" ? (
                      <button
                        type="button"
                        onClick={() => onOpenSupplierPicker(idx)}
                        className="w-full px-3 py-1.5 text-xs font-bold text-left border border-slate-200 bg-white hover:bg-slate-50 rounded-lg transition cursor-pointer flex items-center justify-between"
                      >
                        <span className="truncate max-w-[200px] text-slate-900">
                          {item.name || "Выбрать материал..."}
                        </span>
                        <span className="text-[10px] text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded font-black">
                          Прайс ▾
                        </span>
                      </button>
                    ) : item.type === "ASSEMBLY" || item.type === "INSTALLATION" ? (
                      <button
                        type="button"
                        onClick={() => onOpenWorkOperationPicker(idx)}
                        className="w-full px-3 py-1.5 text-xs font-bold text-left border border-slate-200 bg-white hover:bg-slate-50 rounded-lg transition cursor-pointer flex items-center justify-between shadow-2xs"
                      >
                        <span className="truncate max-w-[200px] text-slate-900">
                          {item.name || "Выбрать работу..."}
                        </span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-black ${
                            item.type === "ASSEMBLY"
                              ? "text-indigo-600 bg-indigo-50"
                              : "text-emerald-600 bg-emerald-50"
                          }`}
                        >
                          Каталог ▾
                        </span>
                      </button>
                    ) : (
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => onUpdateField(idx, "name", e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs font-bold border border-slate-200 rounded-lg focus:border-orange-500 outline-none"
                      />
                    )}

                    {/* Пресеты автовышки */}
                    {item.type === "EQUIPMENT" && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {EQUIPMENT_PRESETS.map((p) => (
                          <button
                            key={p.h}
                            type="button"
                            onClick={() => {
                              triggerHaptic("light");
                              onUpdateField(idx, "quantity", p.h);
                              onUpdateField(idx, "costPrice", 10000);
                              onUpdateField(idx, "sellPrice", 13000);
                              onUpdateField(idx, "name", `Аренда автовышки (${p.h} ч)`);
                            }}
                            className={`px-1.5 py-0.5 text-[10px] font-black rounded-md border cursor-pointer transition ${
                              Number(item.quantity) === p.h
                                ? "bg-orange-600 text-white border-orange-600"
                                : "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
                            }`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Пресеты газели */}
                    {item.type === "LOGISTICS" && (
                      <div className="flex items-center gap-2 mt-1.5">
                        <label className="flex items-center gap-1.5 text-[10px] font-bold text-amber-900 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={is6m}
                            onChange={(e) => {
                              triggerHaptic("light");
                              const checked = e.target.checked;
                              if (checked) {
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
                            className="w-3.5 h-3.5 rounded text-amber-600 border-amber-300 focus:ring-amber-500 cursor-pointer"
                          />
                          <span>6м (неделимые 2 ч)</span>
                        </label>

                        {is6m && (
                          <div className="flex gap-1">
                            {LONG_TRUCK_PRESETS.map((p) => (
                              <button
                                key={p.h}
                                type="button"
                                onClick={() => {
                                  triggerHaptic("light");
                                  onUpdateField(idx, "quantity", p.h);
                                  onUpdateField(idx, "costPrice", 10000);
                                  onUpdateField(idx, "sellPrice", 13000);
                                  onUpdateField(idx, "name", `Аренда 6-метровой газели (${p.h} ч)`);
                                }}
                                className={`px-1.5 py-0.5 text-[10px] font-black rounded-md border cursor-pointer transition ${
                                  Number(item.quantity) === p.h
                                    ? "bg-amber-600 text-white border-amber-600"
                                    : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                                }`}
                              >
                                {p.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </td>

                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600">
                      <TypeIcon className="w-3.5 h-3.5 text-slate-400" />
                      {ITEM_TYPE_LABELS[item.type].label}
                    </span>
                  </td>

                  <td className="p-3">
                    <input
                      type="number"
                      step="any"
                      placeholder="0"
                      value={item.quantity === 0 ? "" : item.quantity ?? ""}
                      onChange={(e) => onUpdateField(idx, "quantity", e.target.value)}
                      className="w-full px-2 py-1.5 text-xs text-right font-black border border-slate-200 rounded-lg focus:border-orange-500 outline-none"
                    />
                  </td>

                  <td className="p-3">
                    {item.type === "MATERIAL_STOCK" || item.type === "MATERIAL_SUPPLIER" ? (
                      <span className="text-xs text-slate-500 font-bold px-1">
                        {UNIT_LABELS[item.unit || "PIECE"]}
                      </span>
                    ) : item.type === "EQUIPMENT" || is6m ? (
                      <span className="text-xs text-orange-700 font-black px-1">ч (час)</span>
                    ) : item.type === "LOGISTICS" ? (
                      <span className="text-xs text-amber-700 font-black px-1">рейс</span>
                    ) : (
                      <select
                        value={item.unit || "PIECE"}
                        onChange={(e) => onUpdateField(idx, "unit", e.target.value as InventoryUnit)}
                        className="w-full px-1 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg focus:border-orange-500 outline-none"
                      >
                        {Object.entries(UNIT_LABELS).map(([key, label]) => (
                          <option key={key} value={key}>
                            {label}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>

                  <td className="p-3">
                    <input
                      type="number"
                      step="any"
                      placeholder="0"
                      disabled={item.type === "MATERIAL_STOCK" || item.type === "MATERIAL_SUPPLIER"}
                      value={item.costPrice === 0 ? "" : item.costPrice ?? ""}
                      onChange={(e) => onUpdateField(idx, "costPrice", e.target.value)}
                      className="w-full px-2 py-1.5 text-xs text-right font-semibold border border-slate-200 rounded-lg focus:border-orange-500 outline-none disabled:bg-slate-50 disabled:text-slate-400"
                    />
                  </td>

                  <td className="p-3">
                    <input
                      type="number"
                      step="any"
                      placeholder="0"
                      value={item.sellPrice === 0 ? "" : item.sellPrice ?? ""}
                      onChange={(e) => onUpdateField(idx, "sellPrice", e.target.value)}
                      className="w-full px-2 py-1.5 text-xs text-right font-extrabold text-slate-900 border border-slate-200 rounded-lg focus:border-orange-500 outline-none"
                    />
                  </td>

                  <td className="p-3 text-right text-xs font-black text-slate-900">
                    {(Number(item.sellPrice || 0) * Number(item.quantity || 0)).toLocaleString()} ₸
                  </td>

                  <td className="p-3 text-center">
                    <button
                      type="button"
                      onClick={() => onRemove(idx)}
                      className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
