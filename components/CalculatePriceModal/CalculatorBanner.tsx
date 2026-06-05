"use client";

import React from "react";
import Link from "next/link";
import { Calculator } from "lucide-react";

interface CalculatorBannerProps {
  onClose: () => void;
}

export default React.memo(function CalculatorBanner({ onClose }: CalculatorBannerProps) {
  return (
    <div className="mt-6 p-4 rounded-2xl bg-orange-50/50 border border-orange-100/70 text-center flex items-center justify-center gap-3">
      <Calculator className="w-5 h-5 text-orange-500 shrink-0" aria-hidden="true" />
      <div className="text-left leading-tight">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
          Быстрый расчет
        </span>
        <Link 
          href="/calculator"
          onClick={onClose}
          className="text-xs font-extrabold text-orange-600 hover:text-orange-700 transition underline decoration-orange-200 hover:decoration-orange-400"
        >
          Воспользоваться онлайн-калькулятором &rarr;
        </Link>
      </div>
    </div>
  );
});
