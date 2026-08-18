"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Package } from "lucide-react";
import { InventoryUnit } from "@prisma/client";
import { SupplierData, SupplierPriceItem } from "../../_types/pricingTypes";
import { INVENTORY_UNITS } from "../../_data/pricingDictionary";
import { triggerHaptic } from "@/lib/haptics";
import BottomSheet from "@/components/ui/BottomSheet";

interface MaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    id?: string;
    name: string;
    supplier: string;
    price: number;
    unit: InventoryUnit;
    supplierId?: string | null;
  }) => Promise<void>;
  editingItem?: SupplierPriceItem | null;
  suppliers: SupplierData[];
}

export default function MaterialModal({
  isOpen,
  onClose,
  onSave,
  editingItem,
  suppliers,
}: MaterialModalProps) {
  const [name, setName] = useState("");
  const [supplier, setSupplier] = useState("");
  const [supplierId, setSupplierId] = useState<string | "">("");
  const [price, setPrice] = useState<number | "">("");
  const [unit, setUnit] = useState<InventoryUnit>("SQUARE_METER");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name || "");
      setSupplier(editingItem.supplier || "");
      setSupplierId(editingItem.supplierId || "");
      setPrice(editingItem.price || "");
      setUnit(editingItem.unit || "SQUARE_METER");
    } else {
      setName("");
      setSupplier(suppliers[0]?.name || "Демер");
      setSupplierId(suppliers[0]?.id || "");
      setPrice("");
      setUnit("SQUARE_METER");
    }
  }, [editingItem, suppliers, isOpen]);

  const handleSupplierSelect = (supId: string) => {
    setSupplierId(supId);
    const found = suppliers.find((s) => s.id === supId);
    if (found) {
      setSupplier(found.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !supplier.trim()) return;

    setIsSubmitting(true);
    triggerHaptic("medium");

    try {
      await onSave({
        id: editingItem?.id,
        name: name.trim(),
        supplier: supplier.trim(),
        supplierId: supplierId || null,
        price: Number(price) || 0,
        unit,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-md"
      maxHeight="max-h-[92dvh]"
      className="bg-white"
    >
      <div className="flex flex-col h-full w-full max-w-full overflow-hidden overflow-x-hidden">
        {/* Шапка */}
        <div className="p-4 sm:px-6 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-white/95 backdrop-blur-md sticky top-0 z-20 shrink-0 w-full">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
              <Package className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight truncate">
                {editingItem ? "Редактировать материал" : "Новый товар / материал"}
              </h3>
              <p className="text-[11px] text-slate-400 font-semibold truncate">Позиция в каталоге поставщика</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Форма */}
        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 space-y-4 overflow-y-auto overflow-x-hidden w-full max-w-full touch-pan-y [touch-action:pan-y] overscroll-contain flex-1"
        >
          <div>
            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5">
              Название материала / товара *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Напр. Акрил 3мм молочный Plexiglas"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:bg-white focus:border-orange-500 outline-none transition box-border"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            <div className="min-w-0 w-full">
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5">
                Поставщик *
              </label>
              {suppliers.length > 0 ? (
                <select
                  value={supplierId}
                  onChange={(e) => handleSupplierSelect(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white focus:border-orange-500 outline-none cursor-pointer box-border"
                >
                  <option value="">Другой / Вручную</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              ) : null}
              {(!supplierId || suppliers.length === 0) && (
                <input
                  type="text"
                  required
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  placeholder="Имя поставщика"
                  className="w-full mt-1.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white focus:border-orange-500 outline-none box-border"
                />
              )}
            </div>

            <div className="min-w-0 w-full">
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5">
                Единица измерения
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as InventoryUnit)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white focus:border-orange-500 outline-none cursor-pointer box-border"
              >
                {Object.entries(INVENTORY_UNITS).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.label} ({val.short})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5">
              Цена за единицу (₸) *
            </label>
            <div className="relative w-full">
              <input
                type="number"
                min="0"
                step="1"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : "")}
                placeholder="0"
                className="w-full pl-3.5 pr-12 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-black text-slate-900 focus:bg-white focus:border-orange-500 outline-none transition box-border"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400 pointer-events-none">
                ₸ / {INVENTORY_UNITS[unit]?.short || "ед."}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold text-xs transition cursor-pointer active:scale-95"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs shadow-md shadow-orange-600/20 transition active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? "Сохранение..." : editingItem ? "Обновить" : "Добавить товар"}</span>
            </button>
          </div>
        </form>
      </div>
    </BottomSheet>
  );
}
