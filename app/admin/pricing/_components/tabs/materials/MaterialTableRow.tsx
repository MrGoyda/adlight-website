"use client";

import React, { useState } from "react";
import { SupplierPriceItem } from "../../../_types/pricingTypes";
import { INVENTORY_UNITS } from "../../../_data/pricingDictionary";
import { Package, Edit2, Trash2, Check, X } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { toast } from "@/lib/toast";

interface MaterialTableRowProps {
  item: SupplierPriceItem;
  onOpenEditModal: (item: SupplierPriceItem) => void;
  onQuickUpdatePrice: (id: string, newPrice: number) => Promise<void>;
  onDeleteItem: (id: string) => Promise<void>;
}

export default function MaterialTableRow({
  item,
  onOpenEditModal,
  onQuickUpdatePrice,
  onDeleteItem,
}: MaterialTableRowProps) {
  const [isInline, setIsInline] = useState(false);
  const [inlinePriceValue, setInlinePriceValue] = useState<number | "">(item.price);
  const [isSavingInline, setIsSavingInline] = useState(false);

  const unitShort = INVENTORY_UNITS[item.unit]?.short || "ед.";

  const handleStartInlineEdit = () => {
    triggerHaptic("light");
    setIsInline(true);
    setInlinePriceValue(item.price);
  };

  const handleSaveInlineEdit = async () => {
    if (inlinePriceValue === "" || isNaN(Number(inlinePriceValue))) {
      setIsInline(false);
      return;
    }

    setIsSavingInline(true);
    triggerHaptic("medium");
    try {
      await onQuickUpdatePrice(item.id, Number(inlinePriceValue));
      setIsInline(false);
    } catch {
      toast.error("Не удалось сохранить цену");
    } finally {
      setIsSavingInline(false);
    }
  };

  return (
    <div className="p-3.5 sm:px-5 sm:py-3.5 hover:bg-orange-50/20 transition flex flex-col md:grid md:grid-cols-12 md:gap-4 md:items-center gap-2">
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
                if (e.key === "Enter") handleSaveInlineEdit();
                if (e.key === "Escape") setIsInline(false);
              }}
              className="w-24 px-2 py-1 rounded-lg border border-orange-400 bg-white text-xs font-black text-slate-900 outline-none text-right"
            />
            <button
              type="button"
              onClick={handleSaveInlineEdit}
              disabled={isSavingInline}
              className="p-1 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition"
              title="Сохранить цену"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setIsInline(false)}
              className="p-1 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
              title="Отмена"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleStartInlineEdit}
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
}
