"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Package } from "lucide-react";
import { InventoryUnit } from "@prisma/client";
import { SupplierData, SupplierPriceItem } from "../../_types/pricingTypes";
import { INVENTORY_UNITS } from "../../_data/pricingDictionary";
import { triggerHaptic } from "@/lib/haptics";

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

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        {/* Шапка */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                {editingItem ? "Редактировать материал" : "Новый товар/материал"}
              </h3>
              <p className="text-[11px] text-slate-400">Позиция в прайсе поставщика</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto">
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
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5">
                Поставщик *
              </label>
              {suppliers.length > 0 ? (
                <select
                  value={supplierId}
                  onChange={(e) => handleSupplierSelect(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:border-orange-500 outline-none bg-white"
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
                  className="w-full mt-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:border-orange-500 outline-none"
                />
              )}
            </div>

            <div>
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5">
                Единица измерения
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as InventoryUnit)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:border-orange-500 outline-none bg-white"
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
            <div className="relative">
              <input
                type="number"
                min="0"
                step="1"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : "")}
                placeholder="0"
                className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 text-base font-black text-slate-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">
                ₸ / {INVENTORY_UNITS[unit]?.short || "ед."}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold text-xs transition"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs shadow-md shadow-orange-600/20 transition active:scale-95 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? "Сохранение..." : editingItem ? "Обновить" : "Добавить товар"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
