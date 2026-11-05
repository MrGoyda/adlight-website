"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { SupplierData, SupplierPriceItem } from "../../_types/pricingTypes";
import { useMaterialFilters } from "../../_hooks/useMaterialFilters";
import { useMaterialCart } from "../../_hooks/useMaterialCart";
import MaterialsSidebar from "./materials/MaterialsSidebar";
import MaterialToolbar from "./materials/MaterialToolbar";
import MaterialBreadcrumbs from "./materials/MaterialBreadcrumbs";
import MaterialTableView from "./materials/MaterialTableView";
import MaterialGridView from "./materials/MaterialGridView";
import MaterialEmptyState from "./materials/MaterialEmptyState";
import MaterialInspectorDrawer from "./materials/MaterialInspectorDrawer";
import SupplierInfoDrawer from "./materials/SupplierInfoDrawer";
import MaterialCartDrawer from "./materials/MaterialCartDrawer";
import TaxonomyManagerModal from "../materials/TaxonomyManagerModal";
import { MaterialCategoryItem } from "../../_data/pricingDictionary";
import { MaterialFacetState } from "../../_data/materialFacets";
import { SynonymRule } from "../../_data/synonymsDictionary";
import { ZeroResultQuery } from "../../_hooks/useCustomSynonyms";
import { Sparkles, ChevronDown } from "lucide-react";
import { pricingDict } from "@/dictionaries/pricing";

interface MaterialsCatalogTabProps {
  supplierPrices: SupplierPriceItem[];
  suppliers: SupplierData[];
  onOpenCreateModal: () => void;
  onOpenEditModal: (item: SupplierPriceItem) => void;
  onQuickUpdatePrice: (id: string, newPrice: number) => Promise<void>;
  onDeleteItem: (id: string) => Promise<void>;
  taxonomy: MaterialCategoryItem[];
  addSubcategory: (catId: string, subName: string) => boolean;
  renameSubcategory: (catId: string, oldName: string, newName: string) => boolean;
  deleteSubcategory: (catId: string, subName: string) => boolean;
  addCategory: (cat: MaterialCategoryItem) => boolean;
  deleteCategory: (catId: string) => boolean;
  getSubcategoryFacetKeys: (catId: string, subName: string) => (keyof MaterialFacetState)[];
  updateSubcategoryFacets: (
    catId: string,
    subName: string,
    keys: (keyof MaterialFacetState)[]
  ) => void;
  resetToDefaults: () => void;
  // Умный поиск и синонимы
  synonymMap?: Map<string, string[]>;
  onZeroResultQuery?: (q: string) => void;
  synonymRules?: SynonymRule[];
  zeroQueries?: ZeroResultQuery[];
  onAddCustomSynonym?: (target: string, aliases: string[], description?: string) => boolean;
  onDeleteCustomSynonym?: (ruleId: string) => boolean;
  onClearZeroQueries?: () => void;
}

const BATCH_SIZE = 40;

export default function MaterialsCatalogTab({
  supplierPrices,
  suppliers,
  onOpenCreateModal,
  onOpenEditModal,
  onQuickUpdatePrice,
  onDeleteItem,
  taxonomy,
  addSubcategory,
  renameSubcategory,
  deleteSubcategory,
  addCategory,
  deleteCategory,
  getSubcategoryFacetKeys,
  updateSubcategoryFacets,
  resetToDefaults,
  synonymMap,
  onZeroResultQuery,
  synonymRules = [],
  zeroQueries = [],
  onAddCustomSynonym,
  onDeleteCustomSynonym,
  onClearZeroQueries,
}: MaterialsCatalogTabProps) {
  const [isTaxonomyManagerOpen, setIsTaxonomyManagerOpen] = useState(false);

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
    applicableFacetKeys,
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
    taxonomy,
    getFacetKeys: getSubcategoryFacetKeys,
    synonymMap,
    onZeroResultQuery,
  });

  // Управление корзиной закупки (снабжение)
  const {
    items: cartItems,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearSupplierItems,
    clearCart,
    uniquePositionsCount,
    totalQuantity,
    totalSum: cartTotalSum,
    groupedBySupplier,
    isItemInCart,
    getItemQuantity,
  } = useMaterialCart();

  // Состояние карточки поставщика
  const [infoSupplierName, setInfoSupplierName] = useState<string | null>(null);

  const handleOpenSupplierInfo = useCallback((supplierName: string) => {
    setInfoSupplierName(supplierName);
  }, []);

  const handleCloseSupplierInfo = useCallback(() => {
    setInfoSupplierName(null);
  }, []);

  const handleFilterBySupplierFromDrawer = useCallback(
    (supName: string) => {
      setSelectedSupplier(supName);
    },
    [setSelectedSupplier]
  );

  // Прогрессивная подгрузка элементов (60 штук за раз) для мгновенного скролла и 120 FPS
  const [visibleLimit, setVisibleLimit] = useState(BATCH_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Сброс лимита при изменении поискового запроса или фильтрации
  useEffect(() => {
    setVisibleLimit(BATCH_SIZE);
  }, [
    searchQuery,
    selectedCategory,
    selectedSubcategory,
    selectedSupplier,
    sortBy,
    onlyWithPhoto,
    facets,
  ]);

  const visiblePrices = useMemo(() => {
    return processedPrices.slice(0, visibleLimit);
  }, [processedPrices, visibleLimit]);

  const hasMore = visibleLimit < processedPrices.length;

  const handleLoadMore = useCallback(() => {
    setVisibleLimit((prev) => Math.min(prev + BATCH_SIZE, processedPrices.length));
  }, [processedPrices.length]);

  const handleLoadAll = useCallback(() => {
    setVisibleLimit(processedPrices.length);
  }, [processedPrices.length]);

  // Аппаратный IntersectionObserver для плавной догрузки при приближении к концу списка
  useEffect(() => {
    if (!hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      { rootMargin: "400px" }
    );
    const el = sentinelRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasMore, handleLoadMore]);

  // Автосинхронизация данных в открытом инспекторе при обновлении цен/свойств
  useEffect(() => {
    if (inspectingItem) {
      const fresh = supplierPrices.find((p) => p.id === inspectingItem.id);
      if (fresh) {
        if (
          fresh.price !== inspectingItem.price ||
          fresh.name !== inspectingItem.name ||
          fresh.category !== inspectingItem.category
        ) {
          setInspectingItem(fresh);
        }
      } else {
        setInspectingItem(null);
      }
    }
  }, [supplierPrices, inspectingItem, setInspectingItem]);

  const handleDeleteWithCleanup = useCallback(
    async (id: string) => {
      await onDeleteItem(id);
      setInspectingItem((curr) => (curr?.id === id ? null : curr));
    },
    [onDeleteItem, setInspectingItem]
  );

  const handleToggleOnlyWithPhoto = useCallback(() => {
    setOnlyWithPhoto((prev) => !prev);
  }, [setOnlyWithPhoto]);

  const handleOpenTaxonomyManager = useCallback(() => {
    setIsTaxonomyManagerOpen(true);
  }, []);

  const handleOpenCart = useCallback(() => {
    setIsCartOpen(true);
  }, [setIsCartOpen]);

  const handleResetCategory = useCallback(() => {
    handleCategorySelect("all");
  }, [handleCategorySelect]);

  const handleResetSubcategory = useCallback(() => {
    setSelectedSubcategory("all");
  }, [setSelectedSubcategory]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[290px_1fr] xl:grid-cols-[310px_1fr] 2xl:grid-cols-[330px_1fr] gap-6 items-start w-full">
      {/* 1. Левый macOS-сайдбар навигации */}
      <MaterialsSidebar
        taxonomy={taxonomy}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
        selectedSubcategory={selectedSubcategory}
        onSelectSubcategory={setSelectedSubcategory}
        subcategoryCounts={subcategoryCounts}
        selectedSupplier={selectedSupplier}
        onSelectSupplier={setSelectedSupplier}
        onlyWithPhoto={onlyWithPhoto}
        onToggleOnlyWithPhoto={handleToggleOnlyWithPhoto}
        categoryCounts={categoryCounts}
        supplierCounts={supplierCounts}
        withPhotoCount={withPhotoCount}
        totalCount={supplierPrices.length}
        suppliers={suppliers}
        uniqueSuppliersFromPrices={uniqueSuppliersFromPrices}
        facets={facets}
        applicableFacetKeys={applicableFacetKeys}
        onFacetChange={handleFacetChange}
        onResetFacets={handleResetFacets}
        hasActiveFacets={hasActiveFacets}
        onOpenSupplierInfo={handleOpenSupplierInfo}
      />

      {/* 2. Основная рабочая зона */}
      <main className="w-full min-w-0 space-y-4">
        {/* Компактный Pro Toolbar & Хлебные крошки */}
        <div className="bg-white/95 p-3 sm:p-4 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
          <MaterialToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchInputRef={searchInputRef}
            sortBy={sortBy}
            onSortChange={setSortBy}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onOpenCreateModal={onOpenCreateModal}
            onOpenTaxonomyManager={handleOpenTaxonomyManager}
            cartCount={uniquePositionsCount}
            cartTotalSum={cartTotalSum}
            onOpenCart={handleOpenCart}
          />

          <MaterialBreadcrumbs
            selectedCategory={selectedCategory}
            selectedSubcategory={selectedSubcategory}
            categoryLabel={currentCategoryDef?.label}
            onResetCategory={handleResetCategory}
            onResetSubcategory={handleResetSubcategory}
            facets={facets}
            applicableFacetKeys={applicableFacetKeys}
            hasActiveFacets={hasActiveFacets}
            onFacetChange={handleFacetChange}
            onResetFacets={handleResetFacets}
          />
        </div>

        {/* Информационная строка счетчика */}
        <div className="flex items-center justify-between px-2 text-xs font-bold text-slate-500">
          <span>
            {pricingDict.toolbar.counter.shown(visiblePrices.length, processedPrices.length)}
          </span>
          {inspectingItem && (
            <span className="text-[11px] text-orange-600 font-extrabold truncate max-w-[280px]">
              {pricingDict.toolbar.counter.selected(inspectingItem.name)}
            </span>
          )}
        </div>

        {/* Контент: Таблица или Сетка с прогрессивным рендерингом */}
        {processedPrices.length === 0 ? (
          <MaterialEmptyState
            onResetFilters={handleResetAllFilters}
            onOpenCreateModal={onOpenCreateModal}
          />
        ) : viewMode === "table" ? (
          <MaterialTableView
            items={visiblePrices}
            selectedItemId={inspectingItem?.id || null}
            onSelectItem={setInspectingItem}
            onOpenEditModal={onOpenEditModal}
            onQuickUpdatePrice={handleQuickUpdateAndSync}
            onDeleteItem={handleDeleteWithCleanup}
            onOpenSupplierInfo={handleOpenSupplierInfo}
            onAddToCart={addToCart}
            onRemoveFromCart={removeFromCart}
            onUpdateCartQuantity={updateQuantity}
            isItemInCart={isItemInCart}
            getItemQuantity={getItemQuantity}
          />
        ) : (
          <MaterialGridView
            items={visiblePrices}
            selectedItemId={inspectingItem?.id || null}
            onSelectItem={setInspectingItem}
            onOpenEditModal={onOpenEditModal}
            onQuickUpdatePrice={handleQuickUpdateAndSync}
            onDeleteItem={handleDeleteWithCleanup}
            onOpenSupplierInfo={handleOpenSupplierInfo}
            onAddToCart={addToCart}
            onRemoveFromCart={removeFromCart}
            onUpdateCartQuantity={updateQuantity}
            isItemInCart={isItemInCart}
            getItemQuantity={getItemQuantity}
          />
        )}

        {/* Сентинел плавной догрузки и кнопка раскрытия всех элементов */}
        {hasMore && (
          <div
            ref={sentinelRef}
            className="py-4 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-slate-500"
          >
            <button
              type="button"
              onClick={handleLoadMore}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white border border-slate-200/90 font-bold text-slate-700 hover:border-orange-300 hover:text-orange-600 shadow-2xs transition cursor-pointer active:scale-95"
            >
              <ChevronDown className="w-3.5 h-3.5" />
              <span>{pricingDict.toolbar.pagination.loadMore(BATCH_SIZE)}</span>
            </button>

            <button
              type="button"
              onClick={handleLoadAll}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-slate-400 hover:text-slate-700 font-medium hover:underline cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-orange-500" />
              <span>{pricingDict.toolbar.pagination.loadAll(processedPrices.length)}</span>
            </button>
          </div>
        )}
      </main>

      {/* 3. Боковой инспектор материала */}
      <MaterialInspectorDrawer
        item={inspectingItem}
        onClose={() => setInspectingItem(null)}
        onOpenEditModal={onOpenEditModal}
        onQuickUpdatePrice={handleQuickUpdateAndSync}
        onDeleteItem={handleDeleteWithCleanup}
        onOpenSupplierInfo={handleOpenSupplierInfo}
        onAddToCart={addToCart}
        onRemoveFromCart={removeFromCart}
        onUpdateCartQuantity={updateQuantity}
        isInCart={inspectingItem ? isItemInCart(inspectingItem.id) : false}
        cartQuantity={inspectingItem ? getItemQuantity(inspectingItem.id) : 0}
      />

      {/* 4. Выезжающая карточка контактов поставщика */}
      <SupplierInfoDrawer
        isOpen={Boolean(infoSupplierName)}
        onClose={handleCloseSupplierInfo}
        supplierName={infoSupplierName}
        suppliers={suppliers}
        onFilterBySupplier={handleFilterBySupplierFromDrawer}
        catalogCount={infoSupplierName ? (supplierCounts[infoSupplierName] || 0) : 0}
      />

      {/* 5. Выезжающая корзина закупки с группировкой по поставщику и WhatsApp */}
      <MaterialCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        suppliers={suppliers}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onClearSupplier={clearSupplierItems}
        onClearCart={clearCart}
        groupedBySupplier={groupedBySupplier}
        totalSum={cartTotalSum}
        uniquePositionsCount={uniquePositionsCount}
        totalQuantity={totalQuantity}
        onOpenSupplierInfo={handleOpenSupplierInfo}
      />

      {/* 6. Центр управления категориями и умными фильтрами */}
      <TaxonomyManagerModal
        isOpen={isTaxonomyManagerOpen}
        onClose={() => setIsTaxonomyManagerOpen(false)}
        taxonomy={taxonomy}
        categoryCounts={categoryCounts}
        subcategoryCounts={subcategoryCounts}
        onAddSubcategory={addSubcategory}
        onRenameSubcategory={renameSubcategory}
        onDeleteSubcategory={deleteSubcategory}
        onAddCategory={addCategory}
        onDeleteCategory={deleteCategory}
        getSubcategoryFacetKeys={getSubcategoryFacetKeys}
        onUpdateSubcategoryFacets={updateSubcategoryFacets}
        onResetToDefaults={resetToDefaults}
        synonymRules={synonymRules}
        zeroQueries={zeroQueries}
        onAddCustomSynonym={onAddCustomSynonym}
        onDeleteCustomSynonym={onDeleteCustomSynonym}
        onClearZeroQueries={onClearZeroQueries}
      />
    </div>
  );
}
