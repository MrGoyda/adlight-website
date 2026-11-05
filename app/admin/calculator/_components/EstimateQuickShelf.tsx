"use client";

import React, { useState, useMemo } from "react";
import { Star, Zap, Package, Search } from "lucide-react";
import { 
  CalculatorSupplierPrice, 
  CalculatorWorkOperation, 
  CalculatorWarehouseItem 
} from "../_types/calculatorTypes";
import { UNIT_LABELS } from "../_data/estimateSpreadsheetDictionary";

interface EstimateQuickShelfProps {
  supplierPrices: CalculatorSupplierPrice[];
  workOperations: CalculatorWorkOperation[];
  warehouseItems: CalculatorWarehouseItem[];
  onAddSupplierMaterial: (price: CalculatorSupplierPrice) => void;
  onAddWorkOperation: (op: CalculatorWorkOperation) => void;
  onAddWarehouseItem: (item: CalculatorWarehouseItem) => void;
}

type TabType = "favorites" | "rates" | "warehouse";

export default function EstimateQuickShelf({
  supplierPrices,
  workOperations,
  warehouseItems,
  onAddSupplierMaterial,
  onAddWorkOperation,
  onAddWarehouseItem,
}: EstimateQuickShelfProps) {
  const [activeTab, setActiveTab] = useState<TabType>("favorites");
  const [filterQuery, setFilterQuery] = useState("");

  // Избранные материалы поставщиков
  const favoritePrices = useMemo(() => {
    return supplierPrices.filter((p) => p.isFavorite);
  }, [supplierPrices]);

  // Фильтрация текущего списка
  const filteredFavorites = useMemo(() => {
    if (!filterQuery.trim()) return favoritePrices;
    const q = filterQuery.toLowerCase();
    return favoritePrices.filter((p) => p.name.toLowerCase().includes(q) || p.supplier.toLowerCase().includes(q));
  }, [favoritePrices, filterQuery]);

  const filteredRates = useMemo(() => {
    if (!filterQuery.trim()) return workOperations;
    const q = filterQuery.toLowerCase();
    return workOperations.filter((w) => w.name.toLowerCase().includes(q));
  }, [workOperations, filterQuery]);

  const filteredWarehouse = useMemo(() => {
    if (!filterQuery.trim()) return warehouseItems;
    const q = filterQuery.toLowerCase();
    return warehouseItems.filter((w) => w.name.toLowerCase().includes(q));
  }, [warehouseItems, filterQuery]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-4 flex flex-col h-full min-h-[420px]">
      {/* Шапка полки */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Полка быстрого накидывания
        </h3>
        <span className="text-[10px] font-medium text-slate-400">1 клик = позиция в смету</span>
      </div>

      {/* Сегментированные вкладки */}
      <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-2xl mt-3">
        <button
          type="button"
          onClick={() => setActiveTab("favorites")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === "favorites"
              ? "bg-white text-slate-900 shadow-2xs"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>Избранное</span>
          <span className="text-[10px] px-1 rounded-full bg-slate-100 text-slate-500 font-mono">
            {favoritePrices.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("rates")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === "rates"
              ? "bg-white text-slate-900 shadow-2xs"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-indigo-500" />
          <span>Тарифы</span>
          <span className="text-[10px] px-1 rounded-full bg-slate-100 text-slate-500 font-mono">
            {workOperations.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("warehouse")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === "warehouse"
              ? "bg-white text-slate-900 shadow-2xs"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <Package className="w-3.5 h-3.5 text-blue-500" />
          <span>Склад</span>
          <span className="text-[10px] px-1 rounded-full bg-slate-100 text-slate-500 font-mono">
            {warehouseItems.length}
          </span>
        </button>
      </div>

      {/* Быстрый фильтр по текущей вкладке */}
      <div className="relative mt-2.5">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          placeholder="Фильтр элементов..."
          className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200/80 rounded-xl placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-orange-500 transition"
        />
      </div>

      {/* Список элементов */}
      <div className="flex-1 overflow-y-auto mt-2.5 space-y-1.5 max-h-[460px] pr-1">
        {activeTab === "favorites" && (
          filteredFavorites.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">
              {filterQuery ? "Ничего не найдено" : "Пока нет избранных товаров. Отметьте их звездочкой в разделе Тарифы и прайсы."}
            </p>
          ) : (
            filteredFavorites.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onAddSupplierMaterial(p)}
                className="w-full text-left p-2.5 rounded-2xl border border-slate-100 hover:border-orange-300 hover:bg-orange-50/40 transition group flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-800 truncate group-hover:text-orange-950">
                    {p.name}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {p.supplier} • {p.category || "Материал"}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-mono font-bold text-slate-900 group-hover:text-orange-600">
                    {p.price.toLocaleString("ru-RU")} ₸
                  </div>
                  <div className="text-[9px] text-slate-400">за {UNIT_LABELS[p.unit] || "ед"}</div>
                </div>
              </button>
            ))
          )
        )}

        {activeTab === "rates" && (
          filteredRates.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">Ничего не найдено</p>
          ) : (
            filteredRates.map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => onAddWorkOperation(w)}
                className="w-full text-left p-2.5 rounded-2xl border border-slate-100 hover:border-indigo-300 hover:bg-indigo-50/40 transition group flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-800 truncate group-hover:text-indigo-950">
                    {w.name}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {w.type === "ASSEMBLY" ? "Сборка цеха" : "Монтажные работы"}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-mono font-bold text-slate-900 group-hover:text-indigo-600">
                    {w.defaultCost.toLocaleString("ru-RU")} ₸
                  </div>
                  <div className="text-[9px] text-slate-400">за {UNIT_LABELS[w.unit] || "ед"}</div>
                </div>
              </button>
            ))
          )
        )}

        {activeTab === "warehouse" && (
          filteredWarehouse.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">На складе пусто</p>
          ) : (
            filteredWarehouse.map((wh) => (
              <button
                key={wh.id}
                type="button"
                onClick={() => onAddWarehouseItem(wh)}
                className="w-full text-left p-2.5 rounded-2xl border border-slate-100 hover:border-blue-300 hover:bg-blue-50/40 transition group flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-800 truncate group-hover:text-blue-950">
                    {wh.name}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    В наличии: {wh.quantity} {UNIT_LABELS[wh.unit]}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-mono font-bold text-slate-900 group-hover:text-blue-600">
                    {wh.price.toLocaleString("ru-RU")} ₸
                  </div>
                  <div className="text-[9px] text-slate-400">себест.</div>
                </div>
              </button>
            ))
          )
        )}
      </div>
    </div>
  );
}
