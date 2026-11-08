"use client";

import React, { useState, useMemo, useDeferredValue } from "react";
import { 
  Search, 
  X, 
  PackageX 
} from "lucide-react";
import { 
  WarehouseItemData, 
  StockSortOption, 
  StockStatusFilter 
} from "../_types/warehouseTypes";
import { WarehouseTableRow } from "./WarehouseTableRow";
import { WAREHOUSE_CATEGORIES } from "../constants";
import { triggerHaptic } from "@/lib/haptics";

interface WarehouseStockTableProps {
  items: WarehouseItemData[];
  currentStatusFilter: StockStatusFilter;
  onSelectStatusFilter: (status: StockStatusFilter) => void;
  onOpenCreateModal: () => void;
  onOpenEditModal: (item: WarehouseItemData) => void;
  onOpenAdjustModal: (item: WarehouseItemData, mode: "in" | "out") => void;
  onDeleteItem: (id: string, name: string) => void;
}

const PAGE_SIZE = 50;

export default function WarehouseStockTable({
  items,
  currentStatusFilter,
  onSelectStatusFilter,
  onOpenCreateModal,
  onOpenEditModal,
  onOpenAdjustModal,
  onDeleteItem,
}: WarehouseStockTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearch = useDeferredValue(searchQuery);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState<StockSortOption>("name_asc");
  const [visibleLimit, setVisibleLimit] = useState(PAGE_SIZE);

  // Фильтрация элементов
  const filteredItems = useMemo(() => {
    let result = items;

    // 1. Поиск по тексту (название или локация)
    if (deferredSearch.trim()) {
      const q = deferredSearch.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          (item.location && item.location.toLowerCase().includes(q)) ||
          item.category.toLowerCase().includes(q)
      );
    }

    // 2. Фильтр по категории
    if (categoryFilter !== "all") {
      result = result.filter((item) => item.category === categoryFilter);
    }

    // 3. Фильтр по статусу остатка
    if (currentStatusFilter === "in_stock") {
      result = result.filter((item) => item.quantity > 0);
    } else if (currentStatusFilter === "low_stock") {
      result = result.filter(
        (item) =>
          item.quantity <= 0 || (item.minStock > 0 && item.quantity <= item.minStock)
      );
    } else if (currentStatusFilter === "out_of_stock") {
      result = result.filter((item) => item.quantity <= 0);
    }

    // 4. Сортировка
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "name_asc":
          return a.name.localeCompare(b.name, "ru");
        case "name_desc":
          return b.name.localeCompare(a.name, "ru");
        case "qty_asc":
          return a.quantity - b.quantity;
        case "qty_desc":
          return b.quantity - a.quantity;
        case "total_desc":
          return b.quantity * b.price - a.quantity * a.price;
        case "updated_desc":
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        default:
          return 0;
      }
    });

    return result;
  }, [items, deferredSearch, categoryFilter, currentStatusFilter, sortBy]);

  const visibleItems = useMemo(() => {
    return filteredItems.slice(0, visibleLimit);
  }, [filteredItems, visibleLimit]);

  const hasMore = visibleLimit < filteredItems.length;

  const handleResetFilters = () => {
    triggerHaptic("light");
    setSearchQuery("");
    setCategoryFilter("all");
    onSelectStatusFilter("all");
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
      {/* 1. Панель управления и фильтров */}
      <div className="p-4 border-b border-slate-100 flex flex-col gap-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Поисковая строка */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по названию, стеллажу или полке..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200/80 rounded-xl placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  triggerHaptic("light");
                  setSearchQuery("");
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded-md"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Правая панель: фильтр статуса и сортировка */}
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {/* Статус остатка */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic("light");
                  onSelectStatusFilter("all");
                }}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer ${
                  currentStatusFilter === "all"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Все
              </button>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic("light");
                  onSelectStatusFilter("in_stock");
                }}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer ${
                  currentStatusFilter === "in_stock"
                    ? "bg-white text-blue-700 shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                В наличии
              </button>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic("light");
                  onSelectStatusFilter("low_stock");
                }}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer ${
                  currentStatusFilter === "low_stock"
                    ? "bg-white text-amber-700 shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Мало
              </button>
            </div>

            {/* Выпадающий список сортировки */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => {
                  triggerHaptic("light");
                  setSortBy(e.target.value as StockSortOption);
                }}
                className="pl-3 pr-7 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:bg-white cursor-pointer"
              >
                <option value="name_asc">По имени (А-Я)</option>
                <option value="name_desc">По имени (Я-А)</option>
                <option value="qty_desc">Остаток: больше → меньше</option>
                <option value="qty_asc">Остаток: меньше → больше</option>
                <option value="total_desc">Сумма на складе (₸)</option>
                <option value="updated_desc">Свежие поступления</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. Горизонтальные чипсы категорий */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          <button
            type="button"
            onClick={() => {
              triggerHaptic("light");
              setCategoryFilter("all");
            }}
            className={`px-3 py-1 rounded-xl text-[11px] font-bold transition shrink-0 cursor-pointer ${
              categoryFilter === "all"
                ? "bg-slate-900 text-white shadow-2xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Все категории ({items.length})
          </button>

          {WAREHOUSE_CATEGORIES.map((cat) => {
            const count = items.filter((i) => i.category === cat).length;
            const isActive = categoryFilter === cat;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  triggerHaptic("light");
                  setCategoryFilter(cat);
                }}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold transition shrink-0 cursor-pointer flex items-center gap-1 ${
                  isActive
                    ? "bg-orange-600 text-white shadow-2xs font-black"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <span>{cat}</span>
                <span className="opacity-70 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Основная таблица */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[760px]">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider select-none">
              <th className="py-3 px-4 w-12 text-center">№</th>
              <th className="py-3 px-4">Материал / Категория</th>
              <th className="py-3 px-3 w-36">Локация в цехе</th>
              <th className="py-3 px-3 w-32 text-right">В наличии</th>
              <th className="py-3 px-3 w-28 text-right">Закупка, ₸</th>
              <th className="py-3 px-3 w-32 text-right">Сумма запаса</th>
              <th className="py-3 px-4 w-36 text-center">Операции</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center text-slate-400">
                  <div className="max-w-xs mx-auto space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                      <PackageX className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-slate-700">Позиций не найдено</p>
                    <p className="text-xs text-slate-400">
                      Попробуйте сбросить фильтры или добавьте новый материал на склад
                    </p>
                    <div className="flex items-center justify-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
                      >
                        Сбросить фильтры
                      </button>
                      <button
                        type="button"
                        onClick={onOpenCreateModal}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 transition cursor-pointer"
                      >
                        Добавить материал
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              visibleItems.map((item, idx) => (
                <WarehouseTableRow
                  key={item.id}
                  item={item}
                  index={idx}
                  onOpenEditModal={onOpenEditModal}
                  onOpenAdjustModal={onOpenAdjustModal}
                  onDeleteItem={onDeleteItem}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 4. Пагинация / Показать еще */}
      {hasMore && (
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-center">
          <button
            type="button"
            onClick={() => {
              triggerHaptic("light");
              setVisibleLimit((prev) => prev + PAGE_SIZE);
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-2xs transition active:scale-95 cursor-pointer"
          >
            Показать еще ({filteredItems.length - visibleLimit} поз.)
          </button>
        </div>
      )}
    </div>
  );
}
