"use client";

import React, { useState, useEffect } from "react";
import { Search, X, ArrowUpDown, List, LayoutGrid, Plus, ShoppingBag, SlidersHorizontal } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { SortOption, ViewMode } from "./types";
import { pricingDict } from "@/dictionaries/pricing";

interface MaterialToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onOpenCreateModal: () => void;
  onOpenTaxonomyManager?: () => void;
  cartCount?: number;
  cartTotalSum?: number;
  onOpenCart?: () => void;
}

function MaterialToolbar({
  searchQuery,
  onSearchChange,
  searchInputRef,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onOpenCreateModal,
  onOpenTaxonomyManager,
  cartCount = 0,
  cartTotalSum = 0,
  onOpenCart,
}: MaterialToolbarProps) {
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const t = pricingDict.toolbar;

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localQuery !== searchQuery) {
        onSearchChange(localQuery);
      }
    }, 90);
    return () => clearTimeout(handler);
  }, [localQuery, searchQuery, onSearchChange]);

  const handleClear = () => {
    setLocalQuery("");
    onSearchChange("");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
      {/* Живой поиск */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          ref={searchInputRef}
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          className="w-full pl-10 pr-16 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-slate-900 focus:bg-white focus:border-orange-500 outline-none transition"
        />
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {localQuery ? (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 cursor-pointer"
              title={t.clearSearchTooltip}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-400 bg-slate-200/60 rounded border border-slate-300/60">
              ⌘K
            </kbd>
          )}
        </div>
      </div>

      {/* Правая панель действий */}
      <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap justify-end">
        {/* Кнопка Корзины закупа */}
        {onOpenCart && (
          <button
            type="button"
            onClick={() => {
              triggerHaptic("medium");
              onOpenCart();
            }}
            className={`relative inline-flex items-center gap-2 px-3.5 py-2.5 rounded-2xl border text-xs font-black transition cursor-pointer active:scale-95 ${
              cartCount > 0
                ? "bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-900/10 hover:bg-slate-800"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
            }`}
            title={t.cartButton}
          >
            <ShoppingBag
              className={`w-4 h-4 transition-transform ${
                cartCount > 0 ? "text-orange-400 animate-bounce duration-1000" : "text-slate-500"
              }`}
            />
            <span className="hidden md:inline">{t.cartButton}</span>
            {cartCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-orange-500 text-white text-[10px] font-black">
                {cartCount}
              </span>
            )}
            {cartTotalSum > 0 && (
              <span className="hidden lg:inline text-orange-300 font-extrabold text-[11px]">
                {cartTotalSum.toLocaleString("ru-RU")} ₸
              </span>
            )}
          </button>
        )}

        {/* Сортировка */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="appearance-none pl-8 pr-7 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 focus:bg-white focus:border-orange-500 outline-none transition cursor-pointer"
          >
            <option value="default">{t.sort.default}</option>
            <option value="price_asc">{t.sort.priceAsc}</option>
            <option value="price_desc">{t.sort.priceDesc}</option>
            <option value="name_asc">{t.sort.nameAsc}</option>
            <option value="name_desc">{t.sort.nameDesc}</option>
          </select>
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Переключатель вида (Segmented Control) */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-2xl border border-slate-200/80">
          <button
            type="button"
            onClick={() => {
              triggerHaptic("light");
              onViewModeChange("table");
            }}
            className={`p-2 rounded-xl transition cursor-pointer ${
              viewMode === "table"
                ? "bg-white text-slate-900 shadow-2xs font-extrabold"
                : "text-slate-400 hover:text-slate-700"
            }`}
            title={t.viewMode.table}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              triggerHaptic("light");
              onViewModeChange("grid");
            }}
            className={`p-2 rounded-xl transition cursor-pointer ${
              viewMode === "grid"
                ? "bg-white text-slate-900 shadow-2xs font-extrabold"
                : "text-slate-400 hover:text-slate-700"
            }`}
            title={t.viewMode.grid}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>

        {/* Кнопка открытия Центра управления категориями и фильтрами */}
        {onOpenTaxonomyManager && (
          <button
            type="button"
            onClick={() => {
              triggerHaptic("light");
              onOpenTaxonomyManager();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 hover:text-slate-900 border border-slate-200/80 text-xs font-bold transition active:scale-95 cursor-pointer shrink-0"
            title={t.taxonomyButton}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden xl:inline">{t.taxonomyButton}</span>
          </button>
        )}

        {/* Кнопка создания позиции */}
        <button
          type="button"
          onClick={onOpenCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-black shadow-md shadow-orange-600/20 transition active:scale-95 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">{t.addMaterialButton}</span>
          <span className="sm:hidden">{t.createShort}</span>
        </button>
      </div>
    </div>
  );
}

export default React.memo(MaterialToolbar);
