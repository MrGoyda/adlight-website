"use client";

import React from "react";
import { Calendar } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { FinancePeriod } from "../../_types/financeTypes";
import { FINANCE_DICTIONARY } from "../../_data/financeDictionary";

interface FinancePeriodPickerProps {
  currentPeriod: FinancePeriod;
  onSelectPeriod: (period: FinancePeriod) => void;
}

const PERIOD_KEYS: FinancePeriod[] = [
  "TODAY",
  "THIS_WEEK",
  "THIS_MONTH",
  "LAST_MONTH",
  "THIS_QUARTER",
  "THIS_YEAR",
  "ALL",
];

export default function FinancePeriodPicker({
  currentPeriod,
  onSelectPeriod,
}: FinancePeriodPickerProps) {
  const dict = FINANCE_DICTIONARY.periods;

  return (
    <div className="inline-flex bg-slate-100 p-1 rounded-2xl select-none max-w-full overflow-x-auto no-scrollbar shrink-0">
      {PERIOD_KEYS.map((key) => {
        const isActive = currentPeriod === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => {
              triggerHaptic("light");
              onSelectPeriod(key);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer whitespace-nowrap ${
              isActive
                ? "bg-white text-slate-900 shadow-2xs font-extrabold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            {dict[key] || key}
          </button>
        );
      })}
    </div>
  );
}
