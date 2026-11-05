"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { SupplierPriceItem } from "../../../../_types/pricingTypes";
import { INVENTORY_UNITS } from "../../../../_data/pricingDictionary";
import { triggerHaptic } from "@/lib/haptics";
import { toast } from "@/lib/toast";
import { pricingDict } from "@/dictionaries/pricing";

interface InspectorPriceSectionProps {
  item: SupplierPriceItem;
  onQuickUpdatePrice: (id: string, newPrice: number) => Promise<void>;
}

export default function InspectorPriceSection({
  item,
  onQuickUpdatePrice,
}: InspectorPriceSectionProps) {
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [priceInput, setPriceInput] = useState<number | "">(item.price);
  const [isSavingPrice, setIsSavingPrice] = useState(false);
  const t = pricingDict.modals.inspector;

  useEffect(() => {
    setPriceInput(item.price);
    setIsEditingPrice(false);
  }, [item.price]);

  const handleSavePrice = async () => {
    if (priceInput === "" || isNaN(Number(priceInput))) {
      setIsEditingPrice(false);
      return;
    }
    setIsSavingPrice(true);
    triggerHaptic("medium");
    try {
      await onQuickUpdatePrice(item.id, Number(priceInput));
      setIsEditingPrice(false);
      toast.success(pricingDict.toasts.priceUpdated);
    } catch {
      toast.error(pricingDict.toasts.priceUpdateError);
    } finally {
      setIsSavingPrice(false);
    }
  };

  return (
    <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-2">
      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
        {t.basePrice}
      </span>

      {isEditingPrice ? (
        <div className="flex items-center gap-2 pt-1">
          <input
            type="number"
            autoFocus
            value={priceInput}
            onChange={(e) =>
              setPriceInput(e.target.value ? Number(e.target.value) : "")
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSavePrice();
              if (e.key === "Escape") setIsEditingPrice(false);
            }}
            className="flex-1 px-3 py-2 rounded-xl bg-white border-2 border-orange-500 text-base font-black text-slate-900 outline-none"
          />
          <button
            type="button"
            onClick={handleSavePrice}
            disabled={isSavingPrice}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black transition cursor-pointer"
          >
            {t.priceSave}
          </button>
          <button
            type="button"
            onClick={() => setIsEditingPrice(false)}
            className="p-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-baseline justify-between pt-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {Number(item.price).toLocaleString("ru-RU")} ₸
            </span>
            <span className="text-xs font-bold text-slate-400">
              / {INVENTORY_UNITS[item.unit]?.short || "ед."}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              triggerHaptic("light");
              setIsEditingPrice(true);
            }}
            className="text-xs font-extrabold text-orange-600 hover:text-orange-700 hover:underline cursor-pointer"
          >
            {t.changePrice}
          </button>
        </div>
      )}
    </div>
  );
}
