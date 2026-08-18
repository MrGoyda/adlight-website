"use client";

import React from "react";
import { SupplierData, SupplierPriceItem, WorkOperationItem } from "../_types/pricingTypes";
import PricingHeader from "./PricingHeader";
import MaterialsCatalogTab from "./tabs/MaterialsCatalogTab";
import EstimateRatesTab from "./tabs/EstimateRatesTab";
import SuppliersTab from "./tabs/SuppliersTab";
import MaterialModal from "./materials/MaterialModal";
import RateModal from "./rates/RateModal";
import SupplierModal from "./suppliers/SupplierModal";
import { usePricingState } from "../_hooks/usePricingState";

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
    handleSaveRate,
    handleDeleteRate,
    handleSaveSupplier,
    handleDeleteSupplier,
  } = usePricingState({
    initialSuppliers,
    initialSupplierPrices,
    initialWorkOperations,
  });

  return (
    <div className="space-y-6">
      {/* Шапка и переключатель вкладок */}
      <PricingHeader
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        materialsCount={supplierPrices.length}
        ratesCount={workOperations.length}
        suppliersCount={suppliers.length}
        onOpenCreateMaterial={() => {
          setEditingMaterial(null);
          setIsMaterialModalOpen(true);
        }}
        onOpenCreateRate={() => {
          setEditingRate(null);
          setDefaultRateType("ASSEMBLY");
          setIsRateModalOpen(true);
        }}
        onOpenCreateSupplier={() => {
          setEditingSupplier(null);
          setIsSupplierModalOpen(true);
        }}
      />

      {/* Содержимое активной вкладки */}
      {activeTab === "materials" && (
        <MaterialsCatalogTab
          supplierPrices={supplierPrices}
          suppliers={suppliers}
          onOpenCreateModal={() => {
            setEditingMaterial(null);
            setIsMaterialModalOpen(true);
          }}
          onOpenEditModal={(item) => {
            setEditingMaterial(item);
            setIsMaterialModalOpen(true);
          }}
          onQuickUpdatePrice={handleQuickUpdatePrice}
          onDeleteItem={handleDeleteMaterial}
        />
      )}

      {activeTab === "rates" && (
        <EstimateRatesTab
          workOperations={workOperations}
          onOpenCreateRateModal={(type) => {
            setEditingRate(null);
            setDefaultRateType(type);
            setIsRateModalOpen(true);
          }}
          onOpenEditRateModal={(rate) => {
            setEditingRate(rate);
            setIsRateModalOpen(true);
          }}
          onDeleteRate={handleDeleteRate}
        />
      )}

      {activeTab === "suppliers" && (
        <SuppliersTab
          suppliers={suppliers}
          onOpenCreateSupplierModal={() => {
            setEditingSupplier(null);
            setIsSupplierModalOpen(true);
          }}
          onOpenEditSupplierModal={(sup) => {
            setEditingSupplier(sup);
            setIsSupplierModalOpen(true);
          }}
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
