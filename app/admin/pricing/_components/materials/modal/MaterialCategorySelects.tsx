"use client";

import React from "react";
import { MaterialCategoryItem } from "../../../_data/pricingDictionary";

interface MaterialCategorySelectsProps {
  taxonomy: MaterialCategoryItem[];
  categoryId: string;
  onCategoryChange: (catId: string) => void;
  subcategory: string;
  onSubcategoryChange: (sub: string) => void;
  customSubcategory: string;
  onCustomSubcategoryChange: (custom: string) => void;
  currentCategoryDef?: MaterialCategoryItem;
}

export default function MaterialCategorySelects({
  taxonomy,
  categoryId,
  onCategoryChange,
  subcategory,
  onSubcategoryChange,
  customSubcategory,
  onCustomSubcategoryChange,
  currentCategoryDef,
}: MaterialCategorySelectsProps) {
  return (
    <div className="space-y-3 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
        {/* Категория 1-го уровня */}
        <div className="min-w-0 w-full">
          <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5">
            Категория (1-й уровень)
          </label>
          <select
            value={categoryId}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white focus:border-orange-500 outline-none cursor-pointer box-border"
          >
            {taxonomy.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Подкатегория 2-го уровня */}
        <div className="min-w-0 w-full">
          <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5">
            Подкатегория (2-й уровень)
          </label>
          <select
            value={subcategory}
            onChange={(e) => onSubcategoryChange(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white focus:border-orange-500 outline-none cursor-pointer box-border"
          >
            {currentCategoryDef?.subcategories.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
            <option value="custom">+ Своя подкатегория...</option>
          </select>
        </div>
      </div>

      {subcategory === "custom" && (
        <div>
          <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1">
            Название своей подкатегории
          </label>
          <input
            type="text"
            required
            value={customSubcategory}
            onChange={(e) => onCustomSubcategoryChange(e.target.value)}
            placeholder="Напр. Листовой вспененный ПВХ 5мм"
            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white focus:border-orange-500 outline-none box-border"
          />
        </div>
      )}
    </div>
  );
}
