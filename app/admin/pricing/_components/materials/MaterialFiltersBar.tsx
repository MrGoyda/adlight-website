"use client";

import React from "react";
import { MATERIAL_CATEGORIES } from "../../_data/pricingDictionary";
import { SupplierData } from "../../_types/pricingTypes";
import { Building2, Search, X } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";

interface MaterialFiltersBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedSupplier: string;
  onSelectSupplier: (sup: string) => void;
  suppliers: SupplierData[];
  uniqueSuppliersFromPrices: string[];
}

export default function MaterialFiltersBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  selectedSupplier,
  onSelectSupplier,
  suppliers,
  uniqueSuppliersFromPrices,
}: MaterialFiltersBarProps) {
  // Объединяем поставщиков
  const allSupplierNames = Array.from(
    new Set([
      ...suppliers.map((s) => s.name),
      ...uniqueSuppliersFromPrices,
    ])
  ).filter(Boolean).sort();

  return (
    <div className="space-y-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs">
      {/* 1. Строка поиска */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Живой поиск материалов (акрил, пвх, диоды, 12V, oracal, профиль)..."
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          suppressHydrationWarning
          className="w-full pl-10 pr-9 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-slate-900 focus:bg-white focus:border-orange-500 outline-none transition"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 2. Фильтр по поставщикам */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
          <Building2 className="w-3 h-3 text-orange-500" />
          Поставщик:
        </span>
        <button
          type="button"
          onClick={() => {
            triggerHaptic("light");
            onSelectSupplier("all");
          }}
          className={`px-2.5 py-1 rounded-lg text-xs font-black transition shrink-0 cursor-pointer ${
            selectedSupplier === "all"
              ? "bg-slate-900 text-white shadow-2xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Все ({allSupplierNames.length})
        </button>
        {allSupplierNames.map((supName) => (
          <button
            key={supName}
            type="button"
            onClick={() => {
              triggerHaptic("light");
              onSelectSupplier(supName);
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition shrink-0 cursor-pointer ${
              selectedSupplier === supName
                ? "bg-orange-600 text-white shadow-2xs font-black"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {supName}
          </button>
        ))}
      </div>

      {/* 3. Фильтр по категориям материалов */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 border-t border-slate-100">
        {MATERIAL_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                triggerHaptic("light");
                onSelectCategory(cat.id);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                isActive
                  ? "bg-orange-50 text-orange-800 border border-orange-200 shadow-2xs font-extrabold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
