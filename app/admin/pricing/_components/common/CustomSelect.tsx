"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, Check } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";

export interface CustomSelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  description?: string;
}

export interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: CustomSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  ariaLabel?: string;
  align?: "left" | "right";
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Выберите...",
  disabled = false,
  className = "",
  buttonClassName = "",
  menuClassName = "",
  ariaLabel,
  align = "left",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Закрытие при клике снаружи и по клавише Escape
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleToggle = useCallback(() => {
    if (disabled) return;
    triggerHaptic("light");
    setIsOpen((prev) => !prev);
  }, [disabled]);

  const handleSelect = useCallback(
    (val: string) => {
      triggerHaptic("light");
      onChange(val);
      setIsOpen(false);
    },
    [onChange]
  );

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Кнопка-триггер выпадающего списка */}
      <button
        type="button"
        disabled={disabled}
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border text-xs transition cursor-pointer select-none outline-none ${
          disabled
            ? "opacity-50 cursor-not-allowed bg-slate-100 border-slate-200 text-slate-400"
            : isOpen
            ? "bg-white border-slate-900 shadow-xs ring-1 ring-slate-900/10 text-slate-900 font-bold"
            : "bg-slate-50 hover:bg-white border-slate-200 text-slate-900 hover:border-slate-300 font-bold"
        } ${buttonClassName}`}
      >
        <span className="flex items-center gap-2 min-w-0 truncate">
          {selectedOption?.icon && (
            <span className="shrink-0 text-slate-600">{selectedOption.icon}</span>
          )}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.badge !== undefined && (
            <span className="px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600 text-[10px] font-black shrink-0">
              {selectedOption.badge}
            </span>
          )}
        </span>

        <ChevronDown
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ease-out ${
            isOpen ? "rotate-180 text-slate-900" : ""
          }`}
        />
      </button>

      {/* Выпадающее меню с опциями */}
      {isOpen && (
        <div
          role="listbox"
          className={`absolute ${
            align === "right" ? "right-0" : "left-0"
          } top-full mt-1.5 min-w-full z-[9990] bg-white rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden py-1 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-150 ease-out ${menuClassName}`}
        >
          {options.length === 0 ? (
            <div className="p-3 text-center text-xs text-slate-400 font-medium">
              Нет доступных вариантов
            </div>
          ) : (
            options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(opt.value)}
                  className={`w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 text-xs text-left transition cursor-pointer ${
                    isSelected
                      ? "bg-slate-900 text-white font-extrabold"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-950 font-medium"
                  }`}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    {opt.icon && (
                      <span
                        className={`shrink-0 ${
                          isSelected ? "text-orange-400" : "text-slate-400"
                        }`}
                      >
                        {opt.icon}
                      </span>
                    )}
                    <span className="truncate leading-tight">{opt.label}</span>
                    {opt.badge !== undefined && (
                      <span
                        className={`px-1.5 py-0.2 rounded-md text-[10px] font-black shrink-0 ${
                          isSelected
                            ? "bg-white/20 text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {opt.badge}
                      </span>
                    )}
                  </span>

                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-orange-400 shrink-0 ml-1" />
                  )}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
