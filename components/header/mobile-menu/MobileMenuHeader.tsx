"use client";

import React from "react";
import { X } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";

interface MobileMenuHeaderProps {
  onClose: () => void;
}

export default function MobileMenuHeader({ onClose }: MobileMenuHeaderProps) {
  return (
    <>
      {/* Drag handle сверху (для мобильных) */}
      <div className="sm:hidden flex justify-center pt-2.5 pb-0 shrink-0">
        <div className="w-10 h-1 rounded-full bg-slate-300" aria-hidden="true" />
      </div>

      {/* Шапка */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
        <span className="text-sm font-black text-slate-900 tracking-widest uppercase">
          Навигация по сайту
        </span>
        <button
          type="button"
          onClick={() => {
            triggerHaptic("light");
            onClose();
          }}
          className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer active:scale-95"
          aria-label="Закрыть меню"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </>
  );
}
