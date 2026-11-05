"use client";

import React, { useMemo } from "react";
import { MaterialCategoryItem } from "../../../_data/pricingDictionary";
import CustomSelect from "../../common/CustomSelect";
import { renderCategoryIcon } from "../../tabs/materials/MaterialsSidebar";

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
  const categoryOptions = useMemo(
    () =>
      taxonomy.map((cat) => ({
        value: cat.id,
        label: cat.label,
        icon: renderCategoryIcon(cat.iconType, "w-4 h-4 text-slate-500"),
        badge: cat.subcategories.length > 0 ? cat.subcategories.length : undefined,
      })),
    [taxonomy]
  );

  const subcategoryOptions = useMemo(
    () => [
      ...(currentCategoryDef?.subcategories.map((sub) => ({
        value: sub,
        label: sub,
      })) || []),
      {
        value: "custom",
        label: "+ Своя подкатегория...",
      },
    ],
    [currentCategoryDef]
  );

  return (
    <div className="space-y-3 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
        {/* Категория 1-го уровня */}
        <div className="min-w-0 w-full">
          <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5">
            Категория (1-й уровень)
          </label>
          <CustomSelect
            value={categoryId}
            onChange={onCategoryChange}
            options={categoryOptions}
          />
        </div>

        {/* Подкатегория 2-го уровня */}
        <div className="min-w-0 w-full">
          <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5">
            Подкатегория (2-й уровень)
          </label>
          <CustomSelect
            value={subcategory}
            onChange={onSubcategoryChange}
            options={subcategoryOptions}
          />
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
