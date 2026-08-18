"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Calculator } from "lucide-react";
import { EstimateItemType, InventoryUnit } from "@prisma/client";
import { WorkOperationItem } from "../../_types/pricingTypes";
import { INVENTORY_UNITS, RATE_CATEGORIES } from "../../_data/pricingDictionary";
import { triggerHaptic } from "@/lib/haptics";

interface RateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    id?: string;
    type: EstimateItemType;
    name: string;
    unit: InventoryUnit;
    defaultCost: number;
    defaultPrice: number;
  }) => Promise<void>;
  editingRate?: WorkOperationItem | null;
  defaultType?: EstimateItemType;
}

export default function RateModal({
  isOpen,
  onClose,
  onSave,
  editingRate,
  defaultType = "ASSEMBLY",
}: RateModalProps) {
  const [type, setType] = useState<EstimateItemType>(defaultType);
  const [name, setName] = useState("");
  const [unit, setUnit] = useState<InventoryUnit>("PIECE");
  const [defaultCost, setDefaultCost] = useState<number | "">("");
  const [defaultPrice, setDefaultPrice] = useState<number | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingRate) {
      setType(editingRate.type);
      setName(editingRate.name);
      setUnit(editingRate.unit);
      setDefaultCost(editingRate.defaultCost);
      setDefaultPrice(editingRate.defaultPrice);
    } else {
      setType(defaultType);
      setName("");
      setUnit("PIECE");
      setDefaultCost("");
      setDefaultPrice("");
    }
  }, [editingRate, defaultType, isOpen]);

  if (!isOpen) return null;

  const costNum = Number(defaultCost) || 0;
  const priceNum = Number(defaultPrice) || 0;
  const marginNum = priceNum - costNum;
  const markupPercent = costNum > 0 ? Math.round((marginNum / costNum) * 100) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    triggerHaptic("medium");

    try {
      await onSave({
        id: editingRate?.id,
        type,
        name: name.trim(),
        unit,
        defaultCost: costNum,
        defaultPrice: priceNum,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentCategory = RATE_CATEGORIES[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        {/* Шапка */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                {editingRate ? "Редактировать тариф" : "Новый тариф сметы"}
              </h3>
              <p className="text-[11px] text-slate-400">Ставки работ, логистики или спецтехники</p>
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
              Категория тарифа
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as EstimateItemType)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-black text-slate-900 focus:border-indigo-500 outline-none bg-white"
            >
              <option value="LOGISTICS">🚚 Газель и Доставка (Логистика)</option>
              <option value="EQUIPMENT">🏗️ Автовышка и Спецтехника</option>
              <option value="ASSEMBLY">🛠️ ЗП Сборщиков (Цех и Производство)</option>
              <option value="INSTALLATION">🪜 ЗП Монтажников (Монтаж и Демонтаж)</option>
              <option value="CUSTOM">⚙️ Прочие индивидуальные услуги</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5">
              Название услуги / операции *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Напр. Сборка объемных световых букв"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5">
              Единица расчета
            </label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as InventoryUnit)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:border-indigo-500 outline-none bg-white"
            >
              {Object.entries(INVENTORY_UNITS).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.label} ({val.short})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-black text-rose-600 uppercase tracking-wider mb-1.5">
                Себестоимость (ЗП) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={defaultCost}
                  onChange={(e) => setDefaultCost(e.target.value ? Number(e.target.value) : "")}
                  placeholder="0"
                  className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-rose-200 bg-rose-50/30 text-sm font-black text-slate-900 focus:border-rose-500 outline-none transition"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">
                  ₸
                </span>
              </div>
              <span className="text-[10px] text-slate-400">Оплата работникам</span>
            </div>

            <div>
              <label className="block text-[11px] font-black text-emerald-600 uppercase tracking-wider mb-1.5">
                Цена в смете *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={defaultPrice}
                  onChange={(e) => setDefaultPrice(e.target.value ? Number(e.target.value) : "")}
                  placeholder="0"
                  className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50/30 text-sm font-black text-slate-900 focus:border-emerald-500 outline-none transition"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">
                  ₸
                </span>
              </div>
              <span className="text-[10px] text-slate-400">Для заказчика</span>
            </div>
          </div>

          {/* Плашка маржинальности */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs font-bold">
            <span className="text-slate-500">Маржа компании:</span>
            <span className={marginNum >= 0 ? "text-emerald-700 font-black" : "text-rose-600 font-black"}>
              +{marginNum.toLocaleString()} ₸ ({markupPercent}%)
            </span>
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
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md shadow-indigo-600/20 transition active:scale-95 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? "Сохранение..." : editingRate ? "Обновить" : "Создать тариф"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
