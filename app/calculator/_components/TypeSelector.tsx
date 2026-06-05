"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { triggerHaptic } from "@/lib/haptics";
import { SITE_PRICES_NUMERIC } from "@/config/site";
import { CALC_UI, type CalcMode } from "@/dictionaries/calculator";
import type { LETTER_TYPES, BOX_TYPES } from "@/dictionaries/calculator";

type TypeItem =
  | typeof LETTER_TYPES[number]
  | typeof BOX_TYPES[number];

interface TypeSelectorProps {
  mode: CalcMode;
  types: readonly TypeItem[];
  selected: string;
  onSelect: (id: string) => void;
}

function getPriceLabel(mode: CalcMode, id: string): string {
  if (mode === "letters") {
    const price = SITE_PRICES_NUMERIC.letters[id as keyof typeof SITE_PRICES_NUMERIC.letters];
    return price ? `от ${price} ₸/см` : "";
  } else {
    const price = SITE_PRICES_NUMERIC.lightboxes[id as keyof typeof SITE_PRICES_NUMERIC.lightboxes];
    return price ? `от ${price.toLocaleString("ru")} ₸/м²` : "";
  }
}

export default function TypeSelector({ mode, types, selected, onSelect }: TypeSelectorProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const activeEl = container.querySelector('[data-active="true"]') as HTMLElement | null;
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [selected]);

  return (
    <div>
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          {CALC_UI.selectTechnology}
        </p>
        <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 lg:hidden select-none">
          {CALC_UI.scrollHint}
        </span>
      </div>

      {/*
        МОБИЛЬ: overflow-x-auto горизонтальный скролл.
        Используем -mx-4 px-4 чтобы скролл шёл от края карточки (p-4 у родителя).
        Родитель не должен иметь overflow-hidden — это блокирует дочерний скролл.

        ДЕСКТОП (lg): grid-сетка, overflow обычный.
      */}
      <div
        ref={scrollRef}
        className={cn(
          "flex gap-2 overflow-x-auto pb-3 hide-scrollbar snap-x snap-mandatory",
          "-mx-4 px-4 lg:mx-0 lg:px-0",
          "lg:grid lg:overflow-x-visible lg:pb-0",
          mode === "letters" ? "lg:grid-cols-3" : "lg:grid-cols-2"
        )}
      >
        {types.map((t) => {
          const isActive = selected === t.id;
          const priceLabel = getPriceLabel(mode, t.id);

          return (
            <button
              key={t.id}
              data-active={isActive}
              type="button"
              aria-pressed={isActive}
              onClick={() => {
                triggerHaptic("light");
                onSelect(t.id);
              }}
              className={cn(
                "snap-start shrink-0 flex flex-col text-left rounded-xl border",
                "transition-all duration-150 px-3 py-2.5",
                "active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500",
                // Фиксированная ширина только на мобиле
                "w-[136px] lg:w-auto",
                isActive
                  ? "border-orange-500 bg-orange-50 ring-2 ring-orange-500/20"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
              )}
            >
              <span className={cn(
                "text-sm font-semibold leading-tight",
                isActive ? "text-orange-700" : "text-slate-800"
              )}>
                {t.name}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                {t.desc}
              </span>
              {priceLabel && (
                <span className={cn(
                  "text-[11px] font-bold mt-1.5",
                  isActive ? "text-orange-600" : "text-slate-500"
                )}>
                  {priceLabel}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
