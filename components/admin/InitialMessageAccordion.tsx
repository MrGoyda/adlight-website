"use client";

import React, { useState } from "react";
import { MessageSquareQuote, ChevronDown } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";

interface InitialMessageAccordionProps {
  message?: string | null;
  title?: string;
  className?: string;
}

/**
 * Атомарный компонент-аккордеон для отображения исходного запроса клиента с сайта.
 * Изначально свернут, плавно раскрывается по клику, надежно переносит любые длинные строки.
 */
export default function InitialMessageAccordion({
  message,
  title = "Исходный запрос с сайта",
  className = "",
}: InitialMessageAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!message || !message.trim()) return null;

  return (
    <div className={`bg-orange-50/70 rounded-2xl border border-orange-200/80 w-full min-w-0 max-w-full overflow-hidden transition shadow-2xs ${className}`}>
      <button
        type="button"
        onClick={() => {
          triggerHaptic("light");
          setIsExpanded((prev) => !prev);
        }}
        className="w-full p-3 sm:p-3.5 flex items-center justify-between text-left cursor-pointer select-none hover:bg-orange-100/60 transition"
      >
        <div className="flex items-center gap-2 min-w-0">
          <MessageSquareQuote className="w-4 h-4 text-orange-600 shrink-0" />
          <span className="text-[10px] sm:text-[11px] font-black text-orange-950 uppercase tracking-wider truncate">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          <span className="text-[10px] font-bold text-orange-700">
            {isExpanded ? "Свернуть" : "Показать"}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-orange-600 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {isExpanded && (
        <div className="px-3.5 pb-3.5 pt-1 border-t border-orange-200/60 animate-in fade-in duration-150">
          <p className="text-xs font-semibold text-slate-800 whitespace-pre-wrap break-words break-all [overflow-wrap:anywhere] leading-relaxed max-w-full">
            {message}
          </p>
        </div>
      )}
    </div>
  );
}
