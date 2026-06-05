"use client";

import React from "react";

interface PriceDisplayProps {
  price: string;
  label?: string;
}

export default React.memo(function PriceDisplay({
  price,
  label = "Ориентировочная стоимость",
}: PriceDisplayProps) {
  return (
    <div 
      className="my-8 bg-orange-500/5 border border-orange-500/10 rounded-2xl p-6 text-center shadow-[inset_0_1px_3px_rgba(249,115,22,0.02)]"
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="text-xs text-slate-450 block font-bold uppercase tracking-wider mb-1">
        {label}
      </span>
      <span className="text-lg font-black text-orange-600 block">
        {price || "по запросу"}
      </span>
    </div>
  );
});
