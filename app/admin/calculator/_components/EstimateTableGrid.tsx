"use client";

import React, { useState, useRef, useEffect } from "react";
import { EstimateItemType, InventoryUnit } from "@prisma/client";
import { Trash2, Plus, Search, Layers, Cpu } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { 
  SpreadsheetItem, 
  CalculatorSupplierPrice, 
  CalculatorWorkOperation, 
  CalculatorWarehouseItem 
} from "../_types/calculatorTypes";
import { ITEM_TYPE_META, UNIT_LABELS } from "../_data/estimateSpreadsheetDictionary";

interface EstimateTableGridProps {
  items: SpreadsheetItem[];
  supplierPrices: CalculatorSupplierPrice[];
  workOperations: CalculatorWorkOperation[];
  warehouseItems: CalculatorWarehouseItem[];
  onUpdateItem: (id: string, field: keyof SpreadsheetItem, value: string | number | InventoryUnit) => void;
  onRemoveItem: (id: string) => void;
  onAddEmptyRow: (type?: EstimateItemType) => void;
  onAddSupplierMaterial: (price: CalculatorSupplierPrice) => void;
  onAddWorkOperation: (op: CalculatorWorkOperation) => void;
}

export default function EstimateTableGrid({
  items,
  supplierPrices,
  workOperations,
  onUpdateItem,
  onRemoveItem,
  onAddEmptyRow,
  onAddSupplierMaterial,
  onAddWorkOperation,
}: EstimateTableGridProps) {
  const [inlineSearch, setInlineSearch] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Фильтрация подсказок инлайн-поиска
  const searchResults = React.useMemo(() => {
    if (!inlineSearch.trim() || inlineSearch.length < 2) return [];
    const q = inlineSearch.toLowerCase().trim();

    const matchedMaterials = supplierPrices
      .filter((p) => p.name.toLowerCase().includes(q) || (p.category && p.category.toLowerCase().includes(q)))
      .slice(0, 5)
      .map((p) => ({
        type: "material" as const,
        id: p.id,
        name: p.name,
        badge: p.supplier,
        price: p.price,
        unit: p.unit,
        raw: p,
      }));

    const matchedWorks = workOperations
      .filter((w) => w.name.toLowerCase().includes(q))
      .slice(0, 4)
      .map((w) => ({
        type: "work" as const,
        id: w.id,
        name: w.name,
        badge: w.type === "ASSEMBLY" ? "Сборка" : "Монтаж",
        price: w.defaultCost,
        unit: w.unit,
        raw: w,
      }));

    return [...matchedMaterials, ...matchedWorks];
  }, [inlineSearch, supplierPrices, workOperations]);

  // Закрытие подсказок по клику вне
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden transition-all duration-200">
      {/* Десктопная ультралегкая таблица */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[760px]">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider select-none">
              <th className="py-3 px-4 w-12 text-center">№</th>
              <th className="py-3 px-4">Позиция / Наименование</th>
              <th className="py-3 px-3 w-32">Категория</th>
              <th className="py-3 px-3 w-24 text-right">Кол-во</th>
              <th className="py-3 px-3 w-20">Ед.</th>
              <th className="py-3 px-3 w-28 text-right">Закупка, ₸</th>
              <th className="py-3 px-3 w-28 text-right">Продажа, ₸</th>
              <th className="py-3 px-3 w-28 text-right">Сумма, ₸</th>
              <th className="py-3 px-3 w-20 text-center">Маржа</th>
              <th className="py-3 px-3 w-10 text-center"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {items.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-slate-400">
                  <div className="max-w-xs mx-auto space-y-2">
                    <p className="text-sm font-medium text-slate-500">Смета пока пуста</p>
                    <p className="text-xs text-slate-400">
                      Используйте строку быстрого ввода ниже или выберите позиции из полки справа
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              items.map((item, idx) => {
                const totalItemCost = (Number(item.quantity) || 0) * (Number(item.costPrice) || 0);
                const totalItemSell = (Number(item.quantity) || 0) * (Number(item.sellPrice) || 0);
                const itemMargin = totalItemSell - totalItemCost;
                const itemMarginPercent = totalItemSell > 0 ? Math.round((itemMargin / totalItemSell) * 100) : 0;

                const meta = ITEM_TYPE_META[item.type] || ITEM_TYPE_META.CUSTOM;
                const TypeIcon = meta.icon;

                return (
                  <tr
                    key={item.id}
                    className="group hover:bg-slate-50/70 transition-colors duration-150"
                  >
                    {/* Номер */}
                    <td className="py-2.5 px-4 text-center text-slate-400 font-mono text-[11px]">
                      {idx + 1}
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

                    {/* Цена продажи */}
                    <td className="py-2.5 px-3 text-right">
                      <input
                        type="number"
                        min="0"
                        value={item.sellPrice === 0 ? "" : item.sellPrice}
                        onChange={(e) => onUpdateItem(item.id, "sellPrice", parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        className="w-24 text-right font-mono font-semibold text-slate-900 bg-transparent focus:bg-white focus:ring-1 focus:ring-orange-500/30 rounded-lg px-1.5 py-1 focus:outline-none transition"
                      />
                    </td>

                    {/* Итоговая сумма по строке */}
                    <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-900">
                      {totalItemSell.toLocaleString("ru-RU")} ₸
                    </td>

                    {/* Маржа бейдж */}
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                          itemMarginPercent >= 35
                            ? "bg-emerald-50 text-emerald-700"
                            : itemMarginPercent >= 20
                            ? "bg-amber-50 text-amber-700"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {itemMarginPercent > 0 ? `+${itemMarginPercent}%` : `${itemMarginPercent}%`}
                      </span>
                    </td>

                    {/* Удаление */}
                    <td className="py-2.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition"
                        title="Удалить строку"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Быстрая строка добавления снизу (Quick Add / Smart Autocomplete) */}
      <div className="p-3 bg-slate-50/50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 relative">
        <div ref={searchContainerRef} className="flex-1 min-w-[260px] relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={inlineSearch}
              onChange={(e) => {
                setInlineSearch(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Начните вводить название материала или работы для авто-вставки..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition"
            />
          </div>

          {/* Всплывающие результаты автокомплита */}
          {isSearchOpen && searchResults.length > 0 && (
            <div className="absolute left-0 bottom-full mb-2 w-full max-h-72 bg-white rounded-2xl border border-slate-200/90 shadow-xl overflow-y-auto z-40 p-1 divide-y divide-slate-50">
              <div className="p-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Быстрое добавление в 1 клик
              </div>
              {searchResults.map((res) => (
                <button
                  key={`${res.type}_${res.id}`}
                  type="button"
                  onClick={() => {
                    if (res.type === "material") {
                      onAddSupplierMaterial(res.raw as CalculatorSupplierPrice);
                    } else {
                      onAddWorkOperation(res.raw as CalculatorWorkOperation);
                    }
                    setInlineSearch("");
                    setIsSearchOpen(false);
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-orange-50/60 transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="p-1.5 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-orange-100 group-hover:text-orange-700 transition">
                      {res.type === "material" ? <Layers className="w-3.5 h-3.5" /> : <Cpu className="w-3.5 h-3.5" />}
                    </span>
                    <div className="truncate">
                      <div className="text-xs font-semibold text-slate-800 truncate">{res.name}</div>
                      <div className="text-[10px] text-slate-400">{res.badge}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <span className="text-xs font-mono font-bold text-orange-600">
                      {res.price.toLocaleString("ru-RU")} ₸
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1">/{UNIT_LABELS[res.unit] || "ед"}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Кнопка добавления пустой строки вручную */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic("light");
            onAddEmptyRow("CUSTOM");
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition shadow-2xs cursor-pointer active:scale-95"
        >
          <Plus className="w-3.5 h-3.5 text-orange-500" />
          <span>Пустая строка</span>
        </button>
      </div>
    </div>
  );
}
