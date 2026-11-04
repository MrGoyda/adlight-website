"use client";

import React from "react";
import { SupplierData, SupplierPriceItem } from "../../_types/pricingTypes";
import { useMaterialFilters } from "../../_hooks/useMaterialFilters";
import MaterialsSidebar from "./materials/MaterialsSidebar";
import MaterialToolbar from "./materials/MaterialToolbar";
import MaterialBreadcrumbs from "./materials/MaterialBreadcrumbs";
import MaterialTableView from "./materials/MaterialTableView";
import MaterialGridView from "./materials/MaterialGridView";
import MaterialEmptyState from "./materials/MaterialEmptyState";
import MaterialInspectorDrawer from "./materials/MaterialInspectorDrawer";

interface MaterialsCatalogTabProps {
  supplierPrices: SupplierPriceItem[];
  suppliers: SupplierData[];
  onOpenCreateModal: () => void;
  onOpenEditModal: (item: SupplierPriceItem) => void;
  onQuickUpdatePrice: (id: string, newPrice: number) => Promise<void>;
  onDeleteItem: (id: string) => Promise<void>;
}

export default function MaterialsCatalogTab({
  supplierPrices,
  suppliers,
  onOpenCreateModal,
  onOpenEditModal,
  onQuickUpdatePrice,
  onDeleteItem,
}: MaterialsCatalogTabProps) {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    handleCategorySelect,
    selectedSubcategory,
    setSelectedSubcategory,
    selectedSupplier,
    setSelectedSupplier,
    sortBy,
    setSortBy,
    onlyWithPhoto,
    setOnlyWithPhoto,
    viewMode,
    setViewMode,
    inspectingItem,
    setInspectingItem,
    facets,
    handleFacetChange,
    handleResetFacets,
    hasActiveFacets,
    handleResetAllFilters,
    handleQuickUpdateAndSync,
    searchInputRef,
    uniqueSuppliersFromPrices,
    categoryCounts,
    subcategoryCounts,
    supplierCounts,
    withPhotoCount,
    currentCategoryDef,
    processedPrices,
  } = useMaterialFilters({
    supplierPrices,
    suppliers,
    onQuickUpdatePrice,
  });

  // Автосинхронизация данных в открытом инспекторе при обновлении цен/свойств
  React.useEffect(() => {
    if (inspectingItem) {
      const fresh = supplierPrices.find((p) => p.id === inspectingItem.id);
      if (fresh) {
        if (fresh.price !== inspectingItem.price || fresh.name !== inspectingItem.name || fresh.category !== inspectingItem.category) {
          setInspectingItem(fresh);
        }
      } else {
        // Позиция была удалена
        setInspectingItem(null);
      }
    }
  }, [supplierPrices, inspectingItem]);

  const handleDeleteWithCleanup = async (id: string) => {
    await onDeleteItem(id);
    if (inspectingItem?.id === id) {
      setInspectingItem(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] xl:grid-cols-[280px_1fr] gap-6 items-start w-full">
      {/* 1. Левый macOS-сайдбар навигации */}
      <MaterialsSidebar
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
        selectedSubcategory={selectedSubcategory}
        onSelectSubcategory={setSelectedSubcategory}
        subcategoryCounts={subcategoryCounts}
        selectedSupplier={selectedSupplier}
        onSelectSupplier={setSelectedSupplier}
        onlyWithPhoto={onlyWithPhoto}
        onToggleOnlyWithPhoto={() => setOnlyWithPhoto((prev) => !prev)}
        categoryCounts={categoryCounts}
        supplierCounts={supplierCounts}
        withPhotoCount={withPhotoCount}
        totalCount={supplierPrices.length}
        suppliers={suppliers}
        uniqueSuppliersFromPrices={uniqueSuppliersFromPrices}
        facets={facets}
        onFacetChange={handleFacetChange}
        onResetFacets={handleResetFacets}
        hasActiveFacets={hasActiveFacets}
      />

      {/* 2. Основная рабочая зона */}
      <main className="w-full min-w-0 space-y-4">
        {/* Компактный Pro Toolbar & Хлебные крошки */}
        <div className="bg-white/90 backdrop-blur-md p-3 sm:p-4 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
          <MaterialToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchInputRef={searchInputRef}
            sortBy={sortBy}
            onSortChange={setSortBy}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onOpenCreateModal={onOpenCreateModal}
          />

          <MaterialBreadcrumbs
            selectedCategory={selectedCategory}
            selectedSubcategory={selectedSubcategory}
            categoryLabel={currentCategoryDef?.label}
            onResetCategory={() => handleCategorySelect("all")}
            onResetSubcategory={() => setSelectedSubcategory("all")}
            facets={facets}
            hasActiveFacets={hasActiveFacets}
            onFacetChange={handleFacetChange}
            onResetFacets={handleResetFacets}
          />
        </div>

        {/* Информационная строка счетчика */}
        <div className="flex items-center justify-between px-2 text-xs font-bold text-slate-500">
          <span>
            Показано: <b className="text-slate-900">{processedPrices.length}</b> из {supplierPrices.length} позиций
          </span>
          {inspectingItem && (
            <span className="text-[11px] text-orange-600 font-extrabold truncate max-w-[280px]">
              Выбрано: {inspectingItem.name}
            </span>
          )}
        </div>

        {/* Контент: Таблица или Сетка */}
        {processedPrices.length === 0 ? (
          <MaterialEmptyState
            onResetFilters={handleResetAllFilters}
            onOpenCreateModal={onOpenCreateModal}
          />
        ) : viewMode === "table" ? (
          <MaterialTableView
            items={processedPrices}
            selectedItemId={inspectingItem?.id || null}
            onSelectItem={setInspectingItem}
            onOpenEditModal={onOpenEditModal}
            onQuickUpdatePrice={handleQuickUpdateAndSync}
            onDeleteItem={handleDeleteWithCleanup}
          />
        ) : (
          <MaterialGridView
            items={processedPrices}
            selectedItemId={inspectingItem?.id || null}
            onSelectItem={setInspectingItem}
            onOpenEditModal={onOpenEditModal}
            onQuickUpdatePrice={handleQuickUpdateAndSync}
            onDeleteItem={handleDeleteWithCleanup}
          />
        )}
      </main>

      {/* 3. Боковой инспектор материала */}
      <MaterialInspectorDrawer
        item={inspectingItem}
        onClose={() => setInspectingItem(null)}
        onOpenEditModal={onOpenEditModal}
        onQuickUpdatePrice={handleQuickUpdateAndSync}
        onDeleteItem={handleDeleteWithCleanup}
      />
    </div>
  );
}
