"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";

interface EstimateFloatingSummaryProps {
  isVisible: boolean;
  itemCount: number;
  totalSell: number;
  totalCost: number;
  margin: number;
  marginPercent: number;
  onScrollToBottom: () => void;
}

export const EstimateFloatingSummary: React.FC<EstimateFloatingSummaryProps> = ({
  isVisible,
  itemCount,
  totalSell,
  totalCost,
  margin,
  marginPercent,
  onScrollToBottom,
}) => {
  return (
    <AnimatePresence>
      {isVisible && itemCount > 0 && (
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.96 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          onClick={() => {
            triggerHaptic("light");
            onScrollToBottom();
          }}
          className="fixed sm:absolute bottom-3.5 left-3 right-3 sm:left-1/2 sm:-translate-x-1/2 sm:w-[500px] z-[130] bg-white/95 hover:bg-white text-slate-900 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.12)] border border-slate-200/90 flex items-center justify-between cursor-pointer transition-all active:scale-98 select-none"
        >
          {/* Левая часть: кол-во позиций + Выручка */}
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-[11px] font-black uppercase px-2.5 py-1 rounded-xl bg-orange-50 text-orange-600 border border-orange-200/80 shrink-0">
              {itemCount} поз.
            </span>
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                Выручка:
              </span>
              <span className="text-sm font-black text-slate-900 truncate tracking-tight">
                {totalSell.toLocaleString()} ₸
              </span>
            </div>
          </div>

          {/* Правая часть: Прибыль с наценки + стрелка вниз */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="flex flex-col items-end">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                Прибыль с наценки:
              </span>
              <span
                className={`text-xs sm:text-sm font-black px-2.5 py-0.5 rounded-xl border ${
                  margin >= 0
                    ? "text-emerald-700 bg-emerald-50 border-emerald-200/80"
                    : "text-rose-700 bg-rose-50 border-rose-200/80"
                }`}
              >
                {margin >= 0 ? `+${margin.toLocaleString()}` : margin.toLocaleString()} ₸
              </span>
            </div>

            <div className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition shrink-0">
              <ChevronDown className="w-4 h-4 animate-bounce" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
