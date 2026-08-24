"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, LucideIcon } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";

export interface CustomDropdownOption {
  value: string;
  label: string;
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  color?: string;
  bg?: string;
  badgeClass?: string;
  description?: string;
}

export interface CustomDropdownProps {
  value: string | null | undefined;
  onChange: (value: string) => void;
  options: CustomDropdownOption[];
  placeholder?: string;
  label?: string;
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  variant?: "default" | "pill" | "subtle";
  placement?: "auto" | "top" | "bottom";
  size?: "sm" | "md";
  className?: string;
  buttonClassName?: string;
  popoverClassName?: string;
  align?: "left" | "right";
}

export default function CustomDropdown({
  value,
  onChange,
  options,
  placeholder = "Выберите...",
  label,
  icon: LeadingIcon,
  disabled = false,
  variant = "default",
  placement = "auto",
  size = "md",
  className = "",
  buttonClassName = "",
  popoverClassName = "",
  align = "left",
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("touchstart", handleOutsideClick);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleToggle = () => {
    if (disabled) return;
    triggerHaptic("light");

    if (!isOpen && dropdownRef.current) {
      if (placement === "top") {
        setOpenUpward(true);
      } else if (placement === "bottom") {
        setOpenUpward(false);
      } else {
        // Автоматический расчет свободного пространства сверху и снизу
        const rect = dropdownRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        // Если снизу меньше 260px и сверху больше пространства — открываем наверх
        if (spaceBelow < 260 && spaceAbove > spaceBelow) {
          setOpenUpward(true);
        } else {
          setOpenUpward(false);
        }
      }
    }

    setIsOpen((prev) => !prev);
  };

  const handleSelect = (val: string) => {
    triggerHaptic("medium");
    onChange(val);
    setIsOpen(false);
  };

  const OptionIcon = selectedOption?.icon || LeadingIcon;

  // 1. ВАРИАНТ "PILL" (для статусов и этапов в шапке)
  if (variant === "pill") {
    const pillColor = selectedOption?.color || "text-slate-700";
    const pillBg = selectedOption?.bg || "bg-slate-100 border-slate-200";

    return (
      <div className={`relative inline-block ${className}`} ref={dropdownRef}>
        <button
          type="button"
          onClick={handleToggle}
          disabled={disabled}
          className={`appearance-none inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider border shadow-2xs cursor-pointer outline-none transition active:scale-95 select-none ${pillBg} ${pillColor} ${buttonClassName}`}
          title="Сменить этап сделки"
        >
          {OptionIcon && <OptionIcon className="w-3.5 h-3.5 shrink-0" />}
          <span className="truncate max-w-[140px] sm:max-w-none">
            {selectedOption?.label || placeholder}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 opacity-70 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div
            className={`absolute ${
              openUpward ? "bottom-full mb-1.5 origin-bottom" : "top-full mt-1.5 origin-top"
            } w-56 sm:w-64 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1 ${
              align === "right" ? "right-0" : "left-0"
            } ${popoverClassName}`}
          >
            {label && (
              <span className="block px-2.5 py-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                {label}
              </span>
            )}
            <div className="max-h-60 overflow-y-auto space-y-0.5 overscroll-contain">
              {options.map((opt) => {
                const ItemIcon = opt.icon;
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-extrabold flex items-center justify-between transition cursor-pointer active:scale-98 ${
                      isSelected
                        ? "bg-orange-50 text-orange-950 font-black border border-orange-200"
                        : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      {ItemIcon && (
                        <ItemIcon
                          className={`w-3.5 h-3.5 shrink-0 ${
                            isSelected ? "text-orange-600" : "text-slate-500"
                          }`}
                        />
                      )}
                      <span className="truncate">{opt.label}</span>
                    </span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-orange-600 stroke-[3] shrink-0 ml-1.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. ВАРИАНТ "DEFAULT" (для форм, карточек, параметров и монтажных условий)
  const isSm = size === "sm";

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`w-full bg-white border border-slate-200 hover:border-slate-300 rounded-xl px-3 text-slate-900 font-bold outline-none text-left flex items-center justify-between gap-2 shadow-2xs transition cursor-pointer active:scale-[0.99] select-none ${
          isSm ? "py-1.5 min-h-[36px] text-xs" : "py-2 min-h-[42px] text-base sm:text-xs"
        } ${isOpen ? "border-orange-500 ring-2 ring-orange-500/10" : ""} ${
          disabled ? "opacity-60 cursor-not-allowed bg-slate-50" : ""
        } ${buttonClassName}`}
      >
        <div className="flex items-center gap-2 min-w-0 truncate">
          {OptionIcon && (
            <OptionIcon
              className={`${isSm ? "w-3.5 h-3.5" : "w-4 h-4"} shrink-0 text-slate-500`}
            />
          )}
          <span
            className={`truncate ${
              selectedOption ? "text-slate-900 font-bold" : "text-slate-400 font-medium"
            }`}
          >
            {selectedOption?.label || placeholder}
          </span>
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-orange-600" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute ${
            openUpward ? "bottom-full mb-1.5 origin-bottom" : "top-full mt-1.5 origin-top"
          } w-full min-w-[220px] bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-0.5 ${
            align === "right" ? "right-0" : "left-0"
          } ${popoverClassName}`}
        >
          {label && (
            <span className="block px-2.5 py-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
              {label}
            </span>
          )}
          <div className="max-h-56 overflow-y-auto space-y-0.5 overscroll-contain">
            {options.map((opt) => {
              const ItemIcon = opt.icon;
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelect(opt.value)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-base sm:text-xs font-bold flex items-center justify-between transition cursor-pointer active:scale-98 ${
                    isSelected
                      ? "bg-orange-50 text-orange-950 font-black border border-orange-200"
                      : "hover:bg-slate-50 text-slate-700 font-medium"
                  }`}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    {ItemIcon && (
                      <ItemIcon
                        className={`w-4 h-4 shrink-0 ${
                          isSelected ? "text-orange-600" : "text-slate-400"
                        }`}
                      />
                    )}
                    <span className="truncate">{opt.label}</span>
                  </span>
                  {isSelected && (
                    <Check className="w-4 h-4 text-orange-600 stroke-[3] shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
