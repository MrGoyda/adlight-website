"use client";

import React, { useState } from "react";
import { Check, X } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { toast } from "@/lib/toast";
import { pricingDict } from "@/dictionaries/pricing";

interface MaterialCardQuickPriceProps {
  itemId: string;
  price: number;
  unitShort: string;
  onQuickUpdatePrice: (id: string, newPrice: number) => Promise<void>;
  isInline: boolean;
  setIsInline: (val: boolean) => void;
}

export default function MaterialCardQuickPrice({
  itemId,
  price,
  unitShort,
  onQuickUpdatePrice,
  isInline,
  setIsInline,
}: MaterialCardQuickPriceProps) {
  const [inlinePriceValue, setInlinePriceValue] = useState<number | "">(price);
  const [isSavingInline, setIsSavingInline] = useState(false);

  const handleSaveInline = async (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
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
      <div
        className="flex items-center gap-1 w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="number"
          autoFocus
          value={inlinePriceValue}
          onChange={(e) =>
            setInlinePriceValue(e.target.value ? Number(e.target.value) : "")
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSaveInline(e);
            if (e.key === "Escape") setIsInline(false);
          }}
          className="w-full px-2 py-1 rounded-lg border border-orange-400 bg-white text-xs font-black text-slate-900 outline-none"
        />
        <button
          type="button"
          onClick={handleSaveInline}
          disabled={isSavingInline}
          className="p-1 rounded-lg bg-emerald-500 text-white cursor-pointer"
          title={pricingDict.table.tooltips.savePrice}
        >
          <Check className="w-3 h-3" />
        </button>
        <button
          type="button"
          onClick={() => setIsInline(false)}
          className="p-1 rounded-lg bg-slate-100 text-slate-500 cursor-pointer"
          title={pricingDict.table.tooltips.cancelPrice}
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <span className="text-xs sm:text-sm font-black text-slate-900 block leading-none">
        {Number(price).toLocaleString("ru-RU")} ₸
      </span>
      <span className="text-[10px] font-bold text-slate-400 block mt-0.5">
        / {unitShort}
      </span>
    </div>
  );
}
