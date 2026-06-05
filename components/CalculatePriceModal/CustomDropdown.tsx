"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

export interface DropdownOption {
  label: string;
  value: string;
  price: string;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  selectedOption: DropdownOption | null;
  onChange: (option: DropdownOption) => void;
  label: string;
}

export default React.memo(function CustomDropdown({
  options,
  selectedOption,
  onChange,
  label,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync activeIndex with selected option when opening
  useEffect(() => {
    if (isOpen && selectedOption) {
      const idx = options.findIndex((opt) => opt.value === selectedOption.value);
      setActiveIndex(idx);
    }
  }, [isOpen, selectedOption, options]);

  // Keyboard navigation inside custom dropdown
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        buttonRef.current?.focus();
        break;
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % options.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + options.length) % options.length);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < options.length) {
          onChange(options[activeIndex]);
          setIsOpen(false);
          buttonRef.current?.focus();
        }
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      case "Tab":
        // Allow default Tab tabIndex but close dropdown
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <div className="mb-6" ref={dropdownRef}>
      <label className="block text-xs font-bold text-slate-405 text-slate-400 uppercase tracking-wider mb-2 pl-1">
        {label}
      </label>
      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={`${label}, выбран вариант: ${selectedOption?.label || "не выбран"}`}
          className="w-full bg-white border border-slate-200/80 text-slate-800 rounded-2xl py-4 px-4 flex items-center justify-between text-sm font-semibold transition hover:border-orange-500 outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500/50"
        >
          <span>{selectedOption?.label || "Выберите вариант..."}</span>
          <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? "rotate-180 text-orange-500" : ""}`} />
        </button>

        {isOpen && (
          <div
            role="listbox"
            aria-label={label}
            className="absolute left-0 right-0 mt-2 bg-white border border-slate-200/80 rounded-2xl shadow-xl z-[100] overflow-hidden max-h-60 overflow-y-auto outline-none"
          >
            {options.map((option, idx) => {
              const isSelected = selectedOption?.value === option.value;
              const isActive = activeIndex === idx;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                    buttonRef.current?.focus();
                  }}
                  className={`w-full text-left px-4 py-3 text-sm transition font-semibold flex items-center justify-between cursor-pointer outline-none ${
                    isSelected ? "bg-orange-50/50 text-orange-600" : "text-slate-700"
                  } ${isActive ? "bg-slate-50" : ""}`}
                >
                  <span>{option.label}</span>
                  <span className="text-xs font-extrabold text-slate-450 bg-slate-100 py-1 px-2.5 rounded-lg">
                    {option.price}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
});
