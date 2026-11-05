"use client";

import React from "react";
import { Image as ImageIcon } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { pricingDict } from "@/dictionaries/pricing";
import { cn } from "@/lib/utils";

interface SidebarPhotoFilterProps {
  onlyWithPhoto: boolean;
  onToggleOnlyWithPhoto: () => void;
  withPhotoCount: number;
}

export default function SidebarPhotoFilter({
  onlyWithPhoto,
  onToggleOnlyWithPhoto,
  withPhotoCount,
}: SidebarPhotoFilterProps) {
  const t = pricingDict.sidebar.photoFilter;

  return (
    <div className="bg-slate-50/90 rounded-2xl p-3 border border-slate-200/70 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 min-w-0">
        <div
          className={cn(
            "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition",
            onlyWithPhoto
              ? "bg-orange-500 text-white shadow-xs"
              : "bg-slate-200/80 text-slate-500"
          )}
        >
          <ImageIcon className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <div className="text-xs font-black text-slate-900 truncate flex items-center gap-1.5">
            <span>{t.title}</span>
            <span className="text-[10px] font-extrabold text-orange-600 bg-orange-100/80 px-1.5 py-0.2 rounded-md">
              {withPhotoCount}
            </span>
          </div>
          <div className="text-[10px] text-slate-400 font-medium truncate">
            {t.subtitle}
          </div>
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={onlyWithPhoto}
        onClick={() => {
          triggerHaptic("medium");
          onToggleOnlyWithPhoto();
        }}
        className={cn(
          "w-11 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer focus:outline-hidden",
          onlyWithPhoto ? "bg-orange-500" : "bg-slate-300"
        )}
      >
        <div
          className={cn(
            "w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ease-in-out",
            onlyWithPhoto ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}
