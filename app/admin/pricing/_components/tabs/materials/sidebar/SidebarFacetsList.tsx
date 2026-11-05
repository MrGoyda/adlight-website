"use client";

import React from "react";
import { SlidersHorizontal, RotateCcw } from "lucide-react";
import {
  MaterialFacetState,
  FACET_LABELS,
  FACET_CONFIG_MAP,
} from "../../../../_data/materialFacets";
import { triggerHaptic } from "@/lib/haptics";
import { pricingDict } from "@/dictionaries/pricing";
import { cn } from "@/lib/utils";

interface SidebarFacetsListProps {
  facets: MaterialFacetState;
  applicableFacetKeys: (keyof MaterialFacetState)[];
  onFacetChange: (key: keyof MaterialFacetState, value: string) => void;
  onResetFacets: () => void;
  hasActiveFacets: boolean;
}

export default function SidebarFacetsList({
  facets,
  applicableFacetKeys,
  onFacetChange,
  onResetFacets,
  hasActiveFacets,
}: SidebarFacetsListProps) {
  if (applicableFacetKeys.length === 0) return null;

  const t = pricingDict.sidebar.facets;

  return (
    <div className="space-y-3 pt-3 border-t border-slate-100">
      <div className="px-2 flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-slate-400">
        <span className="flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          {t.title}
        </span>
        {hasActiveFacets && (
          <button
            type="button"
            onClick={() => {
              triggerHaptic("light");
              onResetFacets();
            }}
            className="text-[10px] font-bold text-orange-600 hover:underline flex items-center gap-0.5 cursor-pointer"
            title={t.resetTooltip}
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>{t.resetButton}</span>
          </button>
        )}
      </div>

      <div className="space-y-3">
        {applicableFacetKeys.map((key) => {
          const title = FACET_LABELS[key] || key;
          const options = FACET_CONFIG_MAP[key] || [];
          const currentValue = facets[key];

          return (
            <div key={key} className="space-y-1">
              <span className="text-[10px] font-extrabold text-slate-400 px-2 block">
                {title}
              </span>
              <div className="flex flex-wrap gap-1 px-1">
                {options.map((opt) => {
                  const isAct = currentValue === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        triggerHaptic("light");
                        onFacetChange(key, opt.id);
                      }}
                      className={cn(
                        "px-2 py-0.5 rounded-lg text-[10px] font-bold transition cursor-pointer",
                        isAct
                          ? "bg-orange-500 text-white font-black shadow-2xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      )}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
