"use client";

import { cn } from "@/lib/utils";
import { triggerHaptic } from "@/lib/haptics";
import { CALC_MODES, type CalcMode } from "@/dictionaries/calculator";

interface ModeTabBarProps {
  active: CalcMode;
  onChange: (mode: CalcMode) => void;
}

export default function ModeTabBar({ active, onChange }: ModeTabBarProps) {
  return (
    <div
      role="tablist"
      aria-label="Режим калькулятора"
      className="flex gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 w-full"
    >
      {CALC_MODES.map((mode) => {
        const isActive = active === mode.id;
        return (
          <button
            key={mode.id}
            role="tab"
            aria-selected={isActive}
            type="button"
            onClick={() => {
              triggerHaptic("light");
              onChange(mode.id);
            }}
            className={cn(
              // flex-1 — равные доли, min-w-0 — не позволяет расти за пределы
              "flex-1 min-w-0 py-2.5 px-2 sm:px-4 rounded-xl",
              // Адаптивный шрифт: xs на мобиле, sm на планшете+
              "text-xs sm:text-sm font-semibold whitespace-nowrap overflow-hidden text-ellipsis",
              "transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500",
              isActive
                ? "bg-white text-slate-900 shadow-sm border border-slate-200/80"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            {mode.label}
          </button>
        );
      })}
    </div>
  );
}
