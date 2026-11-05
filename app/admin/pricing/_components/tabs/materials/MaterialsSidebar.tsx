"use client";

import React, { useMemo, memo } from "react";
import { SupplierData } from "../../../_types/pricingTypes";
import { MATERIAL_TAXONOMY, MaterialCategoryItem } from "../../../_data/pricingDictionary";
import { MaterialFacetState } from "../../../_data/materialFacets";

import SidebarPhotoFilter from "./sidebar/SidebarPhotoFilter";
import SidebarFavoritesFilter from "./sidebar/SidebarFavoritesFilter";
import SidebarCategoriesTree from "./sidebar/SidebarCategoriesTree";
import SidebarFacetsList from "./sidebar/SidebarFacetsList";
import SidebarSuppliersList from "./sidebar/SidebarSuppliersList";

export { renderCategoryIcon } from "./sidebar/SidebarCategoriesTree";

interface MaterialsSidebarProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedSubcategory: string;
  onSelectSubcategory: (sub: string) => void;
  subcategoryCounts: Record<string, number>;
  selectedSupplier: string;
  onSelectSupplier: (sup: string) => void;
  onlyWithPhoto: boolean;
  onToggleOnlyWithPhoto: () => void;
  onlyFavorites: boolean;
  onToggleOnlyFavorites: () => void;
  categoryCounts: Record<string, number>;
  supplierCounts: Record<string, number>;
  withPhotoCount: number;
  favoritesCount: number;
  totalCount: number;
  suppliers: SupplierData[];
  uniqueSuppliersFromPrices: string[];
  facets: MaterialFacetState;
  applicableFacetKeys: (keyof MaterialFacetState)[];
  onFacetChange: (key: keyof MaterialFacetState, value: string) => void;
  onResetFacets: () => void;
  hasActiveFacets: boolean;
  onOpenSupplierInfo?: (supplierName: string) => void;
  taxonomy?: MaterialCategoryItem[];
}

function MaterialsSidebar({
  selectedCategory,
  onSelectCategory,
  selectedSubcategory,
  onSelectSubcategory,
  subcategoryCounts,
  selectedSupplier,
  onSelectSupplier,
  onlyWithPhoto,
  onToggleOnlyWithPhoto,
  onlyFavorites,
  onToggleOnlyFavorites,
  categoryCounts,
  supplierCounts,
  withPhotoCount,
  favoritesCount,
  totalCount,
  suppliers,
  uniqueSuppliersFromPrices,
  facets,
  applicableFacetKeys,
  onFacetChange,
  onResetFacets,
  hasActiveFacets,
  onOpenSupplierInfo,
  taxonomy = MATERIAL_TAXONOMY,
}: MaterialsSidebarProps) {
  // Список уникальных поставщиков
  const allSupplierNames = useMemo(() => {
    return Array.from(
      new Set([...suppliers.map((s) => s.name), ...uniqueSuppliersFromPrices])
    )
      .filter(Boolean)
      .sort();
  }, [suppliers, uniqueSuppliersFromPrices]);

  return (
    <aside className="w-full space-y-5 bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs">
      {/* 1. Тумблеры быстрых фильтров */}
      <div className="space-y-2">
        <SidebarFavoritesFilter
          onlyFavorites={onlyFavorites}
          onToggleOnlyFavorites={onToggleOnlyFavorites}
          favoritesCount={favoritesCount}
        />
        <SidebarPhotoFilter
          onlyWithPhoto={onlyWithPhoto}
          onToggleOnlyWithPhoto={onToggleOnlyWithPhoto}
          withPhotoCount={withPhotoCount}
        />
      </div>

      {/* 2. Раздел: Категории и дерево подкатегорий */}
      <SidebarCategoriesTree
        taxonomy={taxonomy}
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
        selectedSubcategory={selectedSubcategory}
        onSelectSubcategory={onSelectSubcategory}
        categoryCounts={categoryCounts}
        subcategoryCounts={subcategoryCounts}
        totalCount={totalCount}
      />

      {/* 3. Раздел: Характеристики (Изолированные фасеты) */}
      <SidebarFacetsList
        facets={facets}
        applicableFacetKeys={applicableFacetKeys}
        onFacetChange={onFacetChange}
        onResetFacets={onResetFacets}
        hasActiveFacets={hasActiveFacets}
      />

      {/* 4. Раздел: Поставщики */}
      <SidebarSuppliersList
        supplierNames={allSupplierNames}
        selectedSupplier={selectedSupplier}
        onSelectSupplier={onSelectSupplier}
        supplierCounts={supplierCounts}
        totalCount={totalCount}
        onOpenSupplierInfo={onOpenSupplierInfo}
      />
    </aside>
  );
}

export default memo(MaterialsSidebar);
