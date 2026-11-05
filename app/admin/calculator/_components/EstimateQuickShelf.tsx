"use client";

import React, { useState, useMemo } from "react";
import { Star, Zap, Package, Search, Boxes, Layers, Scissors, Wrench } from "lucide-react";
import { 
  CalculatorSupplierPrice, 
  CalculatorWorkOperation, 
  CalculatorWarehouseItem 
} from "../_types/calculatorTypes";
import { UNIT_LABELS } from "../_data/estimateSpreadsheetDictionary";
import { matchSearchQuery } from "@/lib/search";
import { recordSearchSelectionAction } from "@/lib/search/actions";

interface EstimateQuickShelfProps {
  supplierPrices: CalculatorSupplierPrice[];
  workOperations: CalculatorWorkOperation[];
  warehouseItems: CalculatorWarehouseItem[];
  onAddSupplierMaterial: (price: CalculatorSupplierPrice) => void;
  onAddWorkOperation: (op: CalculatorWorkOperation) => void;
  onAddWarehouseItem: (item: CalculatorWarehouseItem) => void;
}

type TabType = "favorites" | "catalog" | "rates" | "warehouse";

const SHELF_CATEGORIES = [
  { id: "all", label: "Все", icon: Boxes },
  { id: "sheets", label: "Листовые", matchWord: "лист", icon: Layers },
  { id: "lighting", label: "Светотехника", matchWord: "свето", icon: Zap },
  { id: "profiles", label: "Профили", matchWord: "профил", icon: Package },
  { id: "vinyl", label: "Пленки", matchWord: "пленк", icon: Scissors },
  { id: "hardware", label: "Химия/Скотч", matchWord: "клей", icon: Wrench },
];

export default function EstimateQuickShelf({
  supplierPrices,
  workOperations,
  warehouseItems,
  onAddSupplierMaterial,
  onAddWorkOperation,
  onAddWarehouseItem,
}: EstimateQuickShelfProps) {
  const [activeTab, setActiveTab] = useState<TabType>("favorites");
  const [shelfCategory, setShelfCategory] = useState("all");
  const [filterQuery, setFilterQuery] = useState("");

  // Избранные материалы поставщиков
  const favoritePrices = useMemo(() => {
    return supplierPrices.filter((p) => p.isFavorite);
  }, [supplierPrices]);

  // Фильтрация избранного
  const filteredFavorites = useMemo(() => {
    if (!filterQuery.trim()) return favoritePrices;
    return favoritePrices.filter((p) =>
      matchSearchQuery(
        {
          name: p.name,
          supplier: p.supplier,
          category: p.category,
          subcategory: p.subcategory,
          description: p.description,
        },
        filterQuery
      )
    );
  }, [favoritePrices, filterQuery]);

  // Фильтрация полного каталога прайсов
  const filteredCatalog = useMemo(() => {
    return supplierPrices.filter((p) => {
      // 1. Фильтр категории
      if (shelfCategory !== "all") {
        const cat = SHELF_CATEGORIES.find((c) => c.id === shelfCategory);
        if (cat?.matchWord) {
          const fullCat = `${p.category || ""} ${p.subcategory || ""} ${p.name}`.toLowerCase();
          if (!fullCat.includes(cat.matchWord)) return false;
        }
      }
      // 2. Фильтр поисковой строки
      if (filterQuery.trim()) {
        return matchSearchQuery(
          {
            name: p.name,
            supplier: p.supplier,
            category: p.category,
            subcategory: p.subcategory,
            description: p.description,
          },
          filterQuery
        );
      }
      return true;
    });
  }, [supplierPrices, shelfCategory, filterQuery]);

  const filteredRates = useMemo(() => {
    if (!filterQuery.trim()) return workOperations;
    return workOperations.filter((w) => matchSearchQuery({ name: w.name }, filterQuery));
  }, [workOperations, filterQuery]);

  const filteredWarehouse = useMemo(() => {
    if (!filterQuery.trim()) return warehouseItems;
    return warehouseItems.filter((w) =>
      matchSearchQuery({ name: w.name, category: w.category }, filterQuery)
    );
  }, [warehouseItems, filterQuery]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-4 flex flex-col h-full min-h-[440px]">
      {/* Шапка полки */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Полка быстрого накидывания
        </h3>
        <span className="text-[10px] font-medium text-slate-400">1 клик = строка в смету</span>
      </div>

      {/* Сегментированные 4 вкладки */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100/80 rounded-2xl mt-3 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab("favorites")}
          className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-xl transition cursor-pointer ${
            activeTab === "favorites"
              ? "bg-white text-slate-900 shadow-2xs"
              : "text-slate-500 hover:text-slate-900"
          }`}
          title="Избранные позиции"
        >
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span className="hidden sm:inline">Топ</span>
          <span className="text-[10px] px-1 rounded-full bg-slate-100 text-slate-500 font-mono">
            {favoritePrices.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("catalog")}
          className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-xl transition cursor-pointer ${
            activeTab === "catalog"
              ? "bg-white text-slate-900 shadow-2xs"
              : "text-slate-500 hover:text-slate-900"
          }`}
          title="Весь каталог прайсов"
        >
          <Boxes className="w-3.5 h-3.5 text-orange-500" />
          <span>Прайс</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("rates")}
          className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-xl transition cursor-pointer ${
            activeTab === "rates"
              ? "bg-white text-slate-900 shadow-2xs"
              : "text-slate-500 hover:text-slate-900"
          }`}
          title="Работы цеха и монтаж"
        >
          <Zap className="w-3.5 h-3.5 text-indigo-500" />
          <span>Цех</span>
          <span className="text-[10px] px-1 rounded-full bg-slate-100 text-slate-500 font-mono">
            {workOperations.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("warehouse")}
          className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-xl transition cursor-pointer ${
            activeTab === "warehouse"
              ? "bg-white text-slate-900 shadow-2xs"
              : "text-slate-500 hover:text-slate-900"
          }`}
          title="Остатки на складе"
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
          placeholder={
            activeTab === "catalog"
              ? "Поиск по прайсам поставщиков..."
              : activeTab === "rates"
              ? "Поиск операций цеха..."
              : "Фильтр элементов..."
          }
          className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200/80 rounded-xl placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-orange-500 transition"
        />
      </div>

      {/* Под-категории для вкладки "Каталог" */}
      {activeTab === "catalog" && (
        <div className="flex items-center gap-1 overflow-x-auto pb-1 mt-2 text-[10px] font-medium scrollbar-none">
          {SHELF_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = shelfCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setShelfCategory(cat.id)}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg shrink-0 transition cursor-pointer ${
                  isSelected
                    ? "bg-orange-500 text-white shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Icon className="w-2.5 h-2.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      )}

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
                onClick={() => {
                  onAddSupplierMaterial(p);
                  if (filterQuery.trim()) {
                    recordSearchSelectionAction({
                      query: filterQuery,
                      entityId: p.id,
                      entityType: "supplier_price",
                      selectedTitle: p.name,
                      context: "calculator_shelf_fav",
                    });
                  }
                }}
                className="w-full text-left p-2.5 rounded-2xl border border-slate-100 hover:border-orange-300 hover:bg-orange-50/40 transition group flex items-center justify-between gap-2 cursor-pointer"
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

        {activeTab === "catalog" && (
          filteredCatalog.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">Ничего не найдено</p>
          ) : (
            filteredCatalog.slice(0, 50).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  onAddSupplierMaterial(p);
                  if (filterQuery.trim()) {
                    recordSearchSelectionAction({
                      query: filterQuery,
                      entityId: p.id,
                      entityType: "supplier_price",
                      selectedTitle: p.name,
                      context: "calculator_shelf_catalog",
                    });
                  }
                }}
                className="w-full text-left p-2.5 rounded-2xl border border-slate-100 hover:border-orange-300 hover:bg-orange-50/40 transition group flex items-center justify-between gap-2 cursor-pointer"
              >
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-800 truncate group-hover:text-orange-950">
                    {p.name}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    <span className="font-semibold text-slate-600">{p.supplier}</span>
                    {p.category ? ` • ${p.category}` : ""}
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
                onClick={() => {
                  onAddWorkOperation(w);
                  if (filterQuery.trim()) {
                    recordSearchSelectionAction({
                      query: filterQuery,
                      entityId: w.id,
                      entityType: "work_operation",
                      selectedTitle: w.name,
                      context: "calculator_shelf_rates",
                    });
                  }
                }}
                className="w-full text-left p-2.5 rounded-2xl border border-slate-100 hover:border-indigo-300 hover:bg-indigo-50/40 transition group flex items-center justify-between gap-2 cursor-pointer"
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
                className="w-full text-left p-2.5 rounded-2xl border border-slate-100 hover:border-blue-300 hover:bg-blue-50/40 transition group flex items-center justify-between gap-2 cursor-pointer"
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
