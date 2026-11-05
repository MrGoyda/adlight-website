"use client";

import React, { useState } from "react";
import { Check, X, Edit2 } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { toast } from "@/lib/toast";
import { pricingDict } from "@/dictionaries/pricing";

interface MaterialRowQuickPriceProps {
  itemId: string;
  price: number;
  unitShort: string;
  onQuickUpdatePrice: (id: string, newPrice: number) => Promise<void>;
}

export default function MaterialRowQuickPrice({
  itemId,
  price,
  unitShort,
  onQuickUpdatePrice,
}: MaterialRowQuickPriceProps) {
  const [isInline, setIsInline] = useState(false);
  const [inlinePriceValue, setInlinePriceValue] = useState<number | "">(price);
  const [isSavingInline, setIsSavingInline] = useState(false);

  const handleStartInlineEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic("light");
    setIsInline(true);
    setInlinePriceValue(price);
  };

  const handleSaveInlineEdit = async (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.stopPropagation();
    if (inlinePriceValue === "" || isNaN(Number(inlinePriceValue))) {
      setIsInline(false);
      return;
    }

    setIsSavingInline(true);
    triggerHaptic("medium");
    try {
      await onQuickUpdatePrice(itemId, Number(inlinePriceValue));
      setIsInline(false);
    } catch {
      toast.error(pricingDict.toasts.priceUpdateError);
    } finally {
      setIsSavingInline(false);
    }
  };

  if (isInline) {
    return (
      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
        <input
          type="number"
          autoFocus
          value={inlinePriceValue}
          onChange={(e) =>
            setInlinePriceValue(e.target.value ? Number(e.target.value) : "")
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSaveInlineEdit(e);
            if (e.key === "Escape") setIsInline(false);
          }}
          className="w-24 px-2 py-1 rounded-lg border border-orange-400 bg-white text-xs font-black text-slate-900 outline-none text-right"
        />
        <button
          type="button"
          onClick={handleSaveInlineEdit}
          disabled={isSavingInline}
          className="p-1 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition cursor-pointer"
          title={pricingDict.table.tooltips.savePrice}
        >
          <Check className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => setIsInline(false)}
          className="p-1 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition cursor-pointer"
          title={pricingDict.table.tooltips.cancelPrice}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleStartInlineEdit}
      className="group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 hover:bg-orange-50 border border-slate-200/80 hover:border-orange-200 transition-colors cursor-pointer"
      title="Нажмите, чтобы быстро изменить цену"
    >
      <span className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-orange-600">
        {Number(price).toLocaleString("ru-RU")} ₸
      </span>
      <span className="text-[10px] font-bold text-slate-400">/ {unitShort}</span>
      <Edit2 className="w-2.5 h-2.5 text-slate-300 group-hover:text-orange-500 transition-colors ml-0.5" />
    </button>
  );
}
