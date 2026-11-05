"use client";

import React from "react";
import { Star } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { pricingDict } from "@/dictionaries/pricing";
import { cn } from "@/lib/utils";

interface SidebarFavoritesFilterProps {
  onlyFavorites: boolean;
  onToggleOnlyFavorites: () => void;
  favoritesCount: number;
}

export default function SidebarFavoritesFilter({
  onlyFavorites,
  onToggleOnlyFavorites,
  favoritesCount,
}: SidebarFavoritesFilterProps) {
  const t = pricingDict.sidebar.favoritesFilter;

  return (
    <div className="bg-slate-50/90 rounded-2xl p-3 border border-slate-200/70 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className={cn(
            "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition",
            onlyFavorites
              ? "bg-amber-400 text-slate-900 shadow-xs"
              : "bg-slate-200/80 text-slate-500"
          )}
        >
          <Star className={cn("w-4 h-4", onlyFavorites && "fill-slate-900")} />
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-black text-slate-900 truncate">
            {t.title}
          </span>
          <span className="text-[10px] font-extrabold text-amber-700 bg-amber-100/90 px-2 py-0.5 rounded-full shrink-0">
            {favoritesCount}
          </span>
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={onlyFavorites}
        onClick={() => {
          triggerHaptic("medium");
          onToggleOnlyFavorites();
        }}
        className={cn(
          "w-11 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer focus:outline-hidden",
          onlyFavorites ? "bg-amber-500" : "bg-slate-300"
        )}
      >
        <div
          className={cn(
            "w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ease-in-out",
            onlyFavorites ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}
