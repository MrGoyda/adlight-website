"use client";

import React, { useCallback } from "react";
import { EstimateItemType } from "@prisma/client";
import { SupplierData, SupplierPriceItem, WorkOperationItem } from "../_types/pricingTypes";
import PricingHeader from "./PricingHeader";
import MaterialsCatalogTab from "./tabs/MaterialsCatalogTab";
import EstimateRatesTab from "./tabs/EstimateRatesTab";
import SuppliersTab from "./tabs/SuppliersTab";
import MaterialModal from "./materials/MaterialModal";
import RateModal from "./rates/RateModal";
import SupplierModal from "./suppliers/SupplierModal";
import { usePricingState } from "../_hooks/usePricingState";
import { useCustomTaxonomy } from "../_hooks/useCustomTaxonomy";
import { useCustomSynonyms } from "../_hooks/useCustomSynonyms";

interface PricingDashboardProps {
  initialSuppliers: SupplierData[];
  initialSupplierPrices: SupplierPriceItem[];
  initialWorkOperations: WorkOperationItem[];
}

export default function PricingDashboard({
  initialSuppliers,
  initialSupplierPrices,
  initialWorkOperations,
}: PricingDashboardProps) {
  const {
    taxonomy,
    addSubcategory,
    renameSubcategory,
    deleteSubcategory,
    addCategory,
    deleteCategory,
    getSubcategoryFacetKeys,
    updateSubcategoryFacets,
    resetToDefaults,
  } = useCustomTaxonomy();

  const {
    synonymMap,
    allRules: synonymRules,
    zeroQueries,
    addCustomSynonym,
    deleteCustomSynonym,
    logZeroResultQuery,
    clearZeroResultQueries,
  } = useCustomSynonyms();

  const {
    activeTab,
    setActiveTab,
    suppliers,
    supplierPrices,
    workOperations,
    // Модалки
    isMaterialModalOpen,
    setIsMaterialModalOpen,
    editingMaterial,
    setEditingMaterial,
    isRateModalOpen,
    setIsRateModalOpen,
    editingRate,
    setEditingRate,
    defaultRateType,
    setDefaultRateType,
    isSupplierModalOpen,
    setIsSupplierModalOpen,
    editingSupplier,
    setEditingSupplier,
    // Хендлеры
    handleSaveMaterial,
    handleQuickUpdatePrice,
    handleDeleteMaterial,
    handleToggleFavorite,
    handleSaveRate,
    handleDeleteRate,
    handleSaveSupplier,
    handleDeleteSupplier,
  } = usePricingState({
    initialSuppliers,
    initialSupplierPrices,
    initialWorkOperations,
  });

  const handleOpenCreateMaterial = useCallback(() => {
    setEditingMaterial(null);
    setIsMaterialModalOpen(true);
  }, [setEditingMaterial, setIsMaterialModalOpen]);

  const handleOpenEditMaterial = useCallback((item: SupplierPriceItem) => {
    setEditingMaterial(item);
    setIsMaterialModalOpen(true);
  }, [setEditingMaterial, setIsMaterialModalOpen]);

  const handleOpenCreateRate = useCallback((type?: EstimateItemType) => {
    setEditingRate(null);
    setDefaultRateType(type || "ASSEMBLY");
    setIsRateModalOpen(true);
  }, [setEditingRate, setDefaultRateType, setIsRateModalOpen]);

  const handleOpenEditRate = useCallback((rate: WorkOperationItem) => {
    setEditingRate(rate);
    setIsRateModalOpen(true);
  }, [setEditingRate, setIsRateModalOpen]);

  const handleOpenCreateSupplier = useCallback(() => {
    setEditingSupplier(null);
    setIsSupplierModalOpen(true);
  }, [setEditingSupplier, setIsSupplierModalOpen]);

  const handleOpenEditSupplier = useCallback((sup: SupplierData) => {
    setEditingSupplier(sup);
    setIsSupplierModalOpen(true);
  }, [setEditingSupplier, setIsSupplierModalOpen]);

  return (
    <div className="space-y-6">
      {/* Шапка и переключатель вкладок */}
      <PricingHeader
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        materialsCount={supplierPrices.length}
        ratesCount={workOperations.length}
        suppliersCount={suppliers.length}
        onOpenCreateMaterial={handleOpenCreateMaterial}
        onOpenCreateRate={() => handleOpenCreateRate("ASSEMBLY")}
        onOpenCreateSupplier={handleOpenCreateSupplier}
      />

      {/* Содержимое активной вкладки */}
      {activeTab === "materials" && (
        <MaterialsCatalogTab
          supplierPrices={supplierPrices}
          suppliers={suppliers}
          onOpenCreateModal={handleOpenCreateMaterial}
          onOpenEditModal={handleOpenEditMaterial}
          onQuickUpdatePrice={handleQuickUpdatePrice}
          onDeleteItem={handleDeleteMaterial}
          onToggleFavorite={handleToggleFavorite}
          taxonomy={taxonomy}
          addSubcategory={addSubcategory}
          renameSubcategory={renameSubcategory}
          deleteSubcategory={deleteSubcategory}
          addCategory={addCategory}
          deleteCategory={deleteCategory}
          getSubcategoryFacetKeys={getSubcategoryFacetKeys}
          updateSubcategoryFacets={updateSubcategoryFacets}
          resetToDefaults={resetToDefaults}
          synonymMap={synonymMap}
          onZeroResultQuery={logZeroResultQuery}
          synonymRules={synonymRules}
          zeroQueries={zeroQueries}
          onAddCustomSynonym={addCustomSynonym}
          onDeleteCustomSynonym={deleteCustomSynonym}
          onClearZeroQueries={clearZeroResultQueries}
        />
      )}

      {activeTab === "rates" && (
        <EstimateRatesTab
          workOperations={workOperations}
          onOpenCreateRateModal={handleOpenCreateRate}
          onOpenEditRateModal={handleOpenEditRate}
          onDeleteRate={handleDeleteRate}
        />
      )}

      {activeTab === "suppliers" && (
        <SuppliersTab
          suppliers={suppliers}
          onOpenCreateSupplierModal={handleOpenCreateSupplier}
          onOpenEditSupplierModal={handleOpenEditSupplier}
          onDeleteSupplier={handleDeleteSupplier}
          onSelectSupplierForMaterials={() => {
            setActiveTab("materials");
          }}
        />
      )}

      {/* Модальное окно создания/редактирования материала */}
      <MaterialModal
        isOpen={isMaterialModalOpen}
        onClose={() => setIsMaterialModalOpen(false)}
        onSave={handleSaveMaterial}
        editingItem={editingMaterial}
        suppliers={suppliers}
        taxonomy={taxonomy}
      />

      {/* Модальное окно создания/редактирования тарифа сметы */}
      <RateModal
        isOpen={isRateModalOpen}
        onClose={() => setIsRateModalOpen(false)}
        onSave={handleSaveRate}
        editingRate={editingRate}
        defaultType={defaultRateType}
      />

      {/* Модальное окно создания/редактирования поставщика */}
      <SupplierModal
        isOpen={isSupplierModalOpen}
        onClose={() => setIsSupplierModalOpen(false)}
        onSave={handleSaveSupplier}
        editingSupplier={editingSupplier}
      />
    </div>
  );
}
