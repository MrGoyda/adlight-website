"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface LeadCardHeaderProps {
  name: string;
  createdAt: string | Date;
  isExpanded: boolean;
  onToggleExpand: (e: React.MouseEvent) => void;
}

export default function LeadCardHeader({
  name,
  createdAt,
  isExpanded,
  onToggleExpand,
}: LeadCardHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <h3 className="font-extrabold text-slate-900 text-base leading-snug break-words">
          {name}
        </h3>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[11px] text-slate-400 font-semibold pt-0.5" suppressHydrationWarning>
          {new Date(createdAt).toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>

        <button
          type="button"
          onClick={onToggleExpand}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer active:scale-95"
          title={isExpanded ? "Свернуть карточку" : "Развернуть детали"}
        >
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </button>
      </div>
    </div>
  );
}
