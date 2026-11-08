"use client";

import React, { useState } from "react";
import { X, Package } from "lucide-react";
import BottomSheet from "@/components/ui/BottomSheet";
import { WarehouseItemData } from "../_types/warehouseTypes";
import { WAREHOUSE_CATEGORIES, STOCK_LOCATIONS, UNIT_LABELS } from "../constants";
import { InventoryUnit } from "@prisma/client";
import { createWarehouseItem, updateWarehouseItem } from "../actions";
import { toast } from "@/lib/toast";
import { triggerHaptic } from "@/lib/haptics";

interface WarehouseItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: WarehouseItemData | null;
  onSuccess: () => void;
}

export default function WarehouseItemModal({
  isOpen,
  onClose,
  item,
  onSuccess,
}: WarehouseItemModalProps) {
  const isEdit = Boolean(item);

  const initialCat = item?.category
    ? WAREHOUSE_CATEGORIES.includes(item.category)
      ? item.category
      : "OTHER"
    : WAREHOUSE_CATEGORIES[0];
  const initialCustomCat = item?.category && !WAREHOUSE_CATEGORIES.includes(item.category)
    ? item.category
    : "";

  const initialLoc = item?.location
    ? STOCK_LOCATIONS.includes(item.location)
      ? item.location
      : "OTHER"
    : STOCK_LOCATIONS[0];
  const initialCustomLoc = item?.location && !STOCK_LOCATIONS.includes(item.location)
    ? item.location
    : "";

  const [name, setName] = useState(item?.name || "");
  const [category, setCategory] = useState(initialCat);
  const [customCategory, setCustomCategory] = useState(initialCustomCat);
  const [unit, setUnit] = useState<InventoryUnit>(item?.unit || "PIECE");
  const [price, setPrice] = useState<number>(item?.price || 0);
  const [quantity, setQuantity] = useState<number>(item?.quantity || 0);
  const [location, setLocation] = useState(initialLoc);
  const [customLocation, setCustomLocation] = useState(initialCustomLoc);
  const [minStock, setMinStock] = useState<number>(item?.minStock || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Укажите наименование материала");
      return;
    }

    const finalCategory = category === "OTHER" ? customCategory.trim() : category;
    if (!finalCategory) {
      toast.error("Укажите категорию материала");
      return;
    }

    const finalLocation = location === "OTHER" ? customLocation.trim() : location;

    setIsSubmitting(true);
    triggerHaptic("medium");

    let res;
    if (isEdit && item) {
      res = await updateWarehouseItem(item.id, {
        name: name.trim(),
        category: finalCategory,
        unit,
        price: Number(price) || 0,
        location: finalLocation || null,
        minStock: Number(minStock) || 0,
      });
    } else {
      res = await createWarehouseItem({
        name: name.trim(),
        category: finalCategory,
        quantity: Number(quantity) || 0,
        unit,
        price: Number(price) || 0,
        location: finalLocation || null,
        minStock: Number(minStock) || 0,
      });
    }

    setIsSubmitting(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success(isEdit ? "Карточка материала обновлена" : "Новый материал добавлен на склад");
      triggerHaptic("success");
      onSuccess();
      onClose();
    }
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-lg"
      desktopVariant="modal"
      desktopWidth="lg:w-[540px]"
    >
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-600 flex items-center justify-center shrink-0">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">
              {isEdit ? "Редактирование материала" : "Новый материал на складе"}
            </h3>
            <p className="text-xs text-slate-400">
              {isEdit ? "Изменение характеристик и локации" : "Создание новой учетной позиции цеха"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        {/* Название */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">
            Наименование материала:
          </label>
          <input
            type="text"
            required
            placeholder="Например: Акрил белый светорассеивающий 3 мм 2050x3050"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition"
          />
        </div>

        {/* Категория и единица измерения */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Категория:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:bg-white cursor-pointer"
            >
              {WAREHOUSE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
              <option value="OTHER">Другая категория...</option>
            </select>
            {category === "OTHER" && (
              <input
                type="text"
                placeholder="Введите название категории"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs mt-1"
                required
              />
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Единица измерения:
            </label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as InventoryUnit)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:bg-white cursor-pointer"
            >
              {(Object.keys(UNIT_LABELS) as InventoryUnit[]).map((u) => (
                <option key={u} value={u}>
                  {UNIT_LABELS[u]} ({u})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Начальный остаток (только при создании) и Себестоимость */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {!isEdit && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Начальный остаток:
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={quantity === 0 ? "" : quantity}
                onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                placeholder="0"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-orange-500 transition"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Себестоимость за ед. (₸):
            </label>
            <input
              type="number"
              min="0"
              value={price === 0 ? "" : price}
              onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
              placeholder="0"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-orange-500 transition"
            />
          </div>
        </div>

        {/* Локация и минимальный порог */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Локация в цехе:
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:bg-white cursor-pointer"
            >
              {STOCK_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
              <option value="OTHER">Своя локация...</option>
            </select>
            {location === "OTHER" && (
              <input
                type="text"
                placeholder="Например: Стеллаж Д, ряд 3"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs mt-1"
              />
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Критический порог (minStock):
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={minStock === 0 ? "" : minStock}
              onChange={(e) => setMinStock(parseFloat(e.target.value) || 0)}
              placeholder="0 (без оповещений)"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:bg-white focus:border-orange-500 transition"
            />
          </div>
        </div>

        {/* Кнопки */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !name.trim()}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 shadow-md shadow-orange-600/20 transition active:scale-95 disabled:opacity-40 cursor-pointer"
          >
            {isSubmitting ? "Сохранение..." : isEdit ? "Сохранить изменения" : "Создать карточку"}
          </button>
        </div>
      </form>
    </BottomSheet>
  );
}
