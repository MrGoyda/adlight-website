"use client";

import React, { useState, useMemo } from "react";
import { SupplierData, SupplierPriceItem } from "../../_types/pricingTypes";
import { INVENTORY_UNITS, MATERIAL_CATEGORIES } from "../../_data/pricingDictionary";
import MaterialFiltersBar from "../materials/MaterialFiltersBar";
import { Edit2, Trash2, Check, X, Plus, Package } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { toast } from "@/lib/toast";

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

  // Inline editing state
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [inlinePriceValue, setInlinePriceValue] = useState<number | "">("");
  const [isSavingInline, setIsSavingInline] = useState(false);

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

  const handleStartInlineEdit = (item: SupplierPriceItem) => {
    triggerHaptic("light");
    setEditingPriceId(item.id);
    setInlinePriceValue(item.price);
  };

  const handleSaveInlineEdit = async (id: string) => {
    if (inlinePriceValue === "" || isNaN(Number(inlinePriceValue))) {
      setEditingPriceId(null);
      return;
    }

    setIsSavingInline(true);
    triggerHaptic("medium");
    try {
      await onQuickUpdatePrice(id, Number(inlinePriceValue));
      setEditingPriceId(null);
    } catch {
      toast.error("Не удалось сохранить цену");
    } finally {
      setIsSavingInline(false);
    }
  };

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
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold transition"
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
            {filteredPrices.map((item) => {
              const isInline = editingPriceId === item.id;
              const unitShort = INVENTORY_UNITS[item.unit]?.short || "ед.";

              return (
                <div
                  key={item.id}
                  className="p-3.5 sm:px-5 sm:py-3.5 hover:bg-orange-50/20 transition flex flex-col md:grid md:grid-cols-12 md:gap-4 md:items-center gap-2"
                >
                  {/* Наименование */}
                  <div className="md:col-span-6 flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Package className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs sm:text-sm font-extrabold text-slate-900 break-words">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-semibold md:hidden mt-0.5">
                        Поставщик: <b className="text-slate-700">{item.supplier}</b>
                      </div>
                    </div>
                  </div>

                  {/* Поставщик (десктоп) */}
                  <div className="hidden md:block md:col-span-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {item.supplier}
                    </span>
                  </div>

                  {/* Цена (с возможностью inline-редактирования) */}
                  <div className="md:col-span-3 flex items-center justify-between md:justify-end gap-2">
                    <span className="text-[11px] font-bold text-slate-400 md:hidden">Стоимость:</span>

                    {isInline ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          autoFocus
                          value={inlinePriceValue}
                          onChange={(e) =>
                            setInlinePriceValue(e.target.value ? Number(e.target.value) : "")
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveInlineEdit(item.id);
                            if (e.key === "Escape") setEditingPriceId(null);
                          }}
                          className="w-24 px-2 py-1 rounded-lg border border-orange-400 bg-white text-xs font-black text-slate-900 outline-none text-right"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveInlineEdit(item.id)}
                          disabled={isSavingInline}
                          className="p-1 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition"
                          title="Сохранить цену"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingPriceId(null)}
                          className="p-1 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
                          title="Отмена"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleStartInlineEdit(item)}
                        className="group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 hover:bg-orange-50 border border-slate-200/80 hover:border-orange-200 transition cursor-pointer"
                        title="Нажмите, чтобы быстро изменить цену"
                      >
                        <span className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-orange-600">
                          {Number(item.price).toLocaleString("ru-RU")} ₸
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">/ {unitShort}</span>
                        <Edit2 className="w-2.5 h-2.5 text-slate-300 group-hover:text-orange-500 transition ml-0.5" />
                      </button>
                    )}
                  </div>

                  {/* Кнопки действий */}
                  <div className="md:col-span-1 flex items-center justify-end md:justify-center gap-1 pt-1 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <button
                      type="button"
                      onClick={() => onOpenEditModal(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                      title="Редактировать товар"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteItem(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      title="Удалить позицию"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
