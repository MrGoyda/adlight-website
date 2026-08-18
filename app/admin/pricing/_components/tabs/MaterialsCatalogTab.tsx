"use client";

import React, { useState, useMemo } from "react";
import { SupplierData, SupplierPriceItem } from "../../_types/pricingTypes";
import { MATERIAL_CATEGORIES } from "../../_data/pricingDictionary";
import MaterialFiltersBar from "../materials/MaterialFiltersBar";
import MaterialTableRow from "./materials/MaterialTableRow";
import { Plus, Package } from "lucide-react";

interface MaterialsCatalogTabProps {
  supplierPrices: SupplierPriceItem[];
  suppliers: SupplierData[];
  onOpenCreateModal: () => void;
  onOpenEditModal: (item: SupplierPriceItem) => void;
  onQuickUpdatePrice: (id: string, newPrice: number) => Promise<void>;
  onDeleteItem: (id: string) => Promise<void>;
}

export default function MaterialsCatalogTab({
  supplierPrices,
  suppliers,
  onOpenCreateModal,
  onOpenEditModal,
  onQuickUpdatePrice,
  onDeleteItem,
}: MaterialsCatalogTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSupplier, setSelectedSupplier] = useState("all");

  // Список уникальных поставщиков из цен
  const uniqueSuppliersFromPrices = useMemo(() => {
    return Array.from(new Set(supplierPrices.map((p) => p.supplier))).filter(Boolean);
  }, [supplierPrices]);

  // Фильтрация
  const filteredPrices = useMemo(() => {
    return supplierPrices.filter((item) => {
      // 1. Поиск
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesSupplier = item.supplier.toLowerCase().includes(q);
        if (!matchesName && !matchesSupplier) return false;
      }

      // 2. Поставщик
      if (selectedSupplier !== "all") {
        if (item.supplier.toLowerCase() !== selectedSupplier.toLowerCase()) return false;
      }

      // 3. Категория
      if (selectedCategory !== "all") {
        const categoryObj = MATERIAL_CATEGORIES.find((c) => c.id === selectedCategory);
        if (categoryObj?.keywords) {
          const lowerName = item.name.toLowerCase();
          const hasKeyword = categoryObj.keywords.some((k) => lowerName.includes(k));
          if (!hasKeyword) return false;
        }
      }

      return true;
    });
  }, [supplierPrices, searchQuery, selectedSupplier, selectedCategory]);

  return (
    <div className="space-y-4">
      {/* Панель фильтров */}
      <MaterialFiltersBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedSupplier={selectedSupplier}
        onSelectSupplier={setSelectedSupplier}
        suppliers={suppliers}
        uniqueSuppliersFromPrices={uniqueSuppliersFromPrices}
      />

      {/* Панель информации и счетчиков */}
      <div className="flex items-center justify-between gap-2 px-1">
        <span className="text-xs font-black text-slate-500">
          Найдено: <b className="text-slate-900">{filteredPrices.length}</b> из {supplierPrices.length} позиций
        </span>

        <button
          type="button"
          onClick={onOpenCreateModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-black shadow-md shadow-orange-600/20 transition active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Добавить товар</span>
        </button>
      </div>

      {/* Список / Таблица товаров */}
      {filteredPrices.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
          <p className="text-sm font-extrabold text-slate-700">Материалы не найдены</p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Попробуйте изменить поисковый запрос или сбросить фильтры поставщика/категории
          </p>
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Создать первый товар</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
          {/* Десктопная шапка таблицы */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-slate-50 border-b border-slate-200/80 text-[10px] font-black text-slate-400 uppercase tracking-wider">
            <div className="col-span-6">Наименование товара / материала</div>
            <div className="col-span-2">Поставщик</div>
            <div className="col-span-3 text-right">Цена за ед.</div>
            <div className="col-span-1 text-center">Действия</div>
          </div>

          {/* Список позиций */}
          <div className="divide-y divide-slate-100">
            {filteredPrices.map((item) => (
              <MaterialTableRow
                key={item.id}
                item={item}
                onOpenEditModal={onOpenEditModal}
                onQuickUpdatePrice={onQuickUpdatePrice}
                onDeleteItem={onDeleteItem}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
