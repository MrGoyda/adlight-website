"use client";

import React, { useState } from "react";
import { SupplierData, SupplierPriceItem, WorkOperationItem, PricingTabType } from "../_types/pricingTypes";
import PricingHeader from "./PricingHeader";
import MaterialsCatalogTab from "./tabs/MaterialsCatalogTab";
import EstimateRatesTab from "./tabs/EstimateRatesTab";
import SuppliersTab from "./tabs/SuppliersTab";
import MaterialModal from "./materials/MaterialModal";
import RateModal from "./rates/RateModal";
import SupplierModal from "./suppliers/SupplierModal";
import {
  createSupplierPrice,
  updateSupplierPrice,
  deleteSupplierPrice,
  createWorkOperation,
  updateWorkOperation,
  deleteWorkOperation,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../actions";
import { EstimateItemType, InventoryUnit } from "@prisma/client";
import { toast } from "@/lib/toast";
import { triggerHaptic } from "@/lib/haptics";

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
  const [activeTab, setActiveTab] = useState<PricingTabType>("materials");

  // Данные
  const [suppliers, setSuppliers] = useState<SupplierData[]>(initialSuppliers);
  const [supplierPrices, setSupplierPrices] = useState<SupplierPriceItem[]>(initialSupplierPrices);
  const [workOperations, setWorkOperations] = useState<WorkOperationItem[]>(initialWorkOperations);

  // Модалки
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<SupplierPriceItem | null>(null);

  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [editingRate, setEditingRate] = useState<WorkOperationItem | null>(null);
  const [defaultRateType, setDefaultRateType] = useState<EstimateItemType>("ASSEMBLY");

  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<SupplierData | null>(null);

  // ════════════════════════════════════════════════════════════════════
  // 1. ХЕНДЛЕРЫ ДЛЯ МАТЕРИАЛОВ (SupplierPrice)
  // ════════════════════════════════════════════════════════════════════

  const handleSaveMaterial = async (data: {
    id?: string;
    name: string;
    supplier: string;
    price: number;
    unit: InventoryUnit;
    supplierId?: string | null;
  }) => {
    if (data.id) {
      // Обновление
      const res = await updateSupplierPrice(data.id, data);
      if (res.error) {
        toast.error(res.error);
      } else if (res.data) {
        setSupplierPrices((prev) => prev.map((p) => (p.id === data.id ? res.data : p)));
        toast.success("Товар успешно обновлен");
      }
    } else {
      // Создание
      const res = await createSupplierPrice(data);
      if (res.error) {
        toast.error(res.error);
      } else if (res.data) {
        setSupplierPrices((prev) => [res.data, ...prev]);
        toast.success("Новый товар добавлен в каталог");
      }
    }
  };

  const handleQuickUpdatePrice = async (id: string, newPrice: number) => {
    const res = await updateSupplierPrice(id, { price: newPrice });
    if (res.error) {
      toast.error(res.error);
    } else if (res.data) {
      setSupplierPrices((prev) => prev.map((p) => (p.id === id ? res.data : p)));
      toast.success("Цена обновлена");
    }
  };

  const handleDeleteMaterial = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить этот материал из каталога?")) return;
    triggerHaptic("medium");

    const res = await deleteSupplierPrice(id);
    if (res.error) {
      toast.error(res.error);
    } else {
      setSupplierPrices((prev) => prev.filter((p) => p.id !== id));
      toast.success("Товар удален");
    }
  };

  // ════════════════════════════════════════════════════════════════════
  // 2. ХЕНДЛЕРЫ ДЛЯ ТАРИФОВ СМЕТЫ (WorkOperation)
  // ════════════════════════════════════════════════════════════════════

  const handleSaveRate = async (data: {
    id?: string;
    type: EstimateItemType;
    name: string;
    unit: InventoryUnit;
    defaultCost: number;
    defaultPrice: number;
  }) => {
    if (data.id) {
      const res = await updateWorkOperation(data.id, data);
      if (res.error) {
        toast.error(res.error);
      } else if (res.data) {
        setWorkOperations((prev) => prev.map((r) => (r.id === data.id ? res.data : r)));
        toast.success("Тариф сметы обновлен");
      }
    } else {
      const res = await createWorkOperation(data);
      if (res.error) {
        toast.error(res.error);
      } else if (res.data) {
        setWorkOperations((prev) => [...prev, res.data]);
        toast.success("Новый тариф добавлен в сметный калькулятор");
      }
    }
  };

  const handleDeleteRate = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить эту операцию из тарифов?")) return;
    triggerHaptic("medium");

    const res = await deleteWorkOperation(id);
    if (res.error) {
      toast.error(res.error);
    } else {
      setWorkOperations((prev) => prev.filter((r) => r.id !== id));
      toast.success("Тариф удален");
    }
  };

  // ════════════════════════════════════════════════════════════════════
  // 3. ХЕНДЛЕРЫ ДЛЯ ПОСТАВЩИКОВ (Supplier)
  // ════════════════════════════════════════════════════════════════════

  const handleSaveSupplier = async (data: {
    id?: string;
    name: string;
    address?: string;
    phone?: string;
    whatsapp?: string;
    notes?: string;
  }) => {
    if (data.id) {
      const res = await updateSupplier(data.id, data);
      if (res.error) {
        toast.error(res.error);
      } else if (res.data) {
        setSuppliers((prev) => prev.map((s) => (s.id === data.id ? res.data : s)));
        toast.success("Данные поставщика обновлены");
      }
    } else {
      const res = await createSupplier(data);
      if (res.error) {
        toast.error(res.error);
      } else if (res.data) {
        setSuppliers((prev) => [res.data, ...prev]);
        toast.success("Поставщик добавлен");
      }
    }
  };

  const handleDeleteSupplier = async (id: string) => {
    if (!confirm("Удалить поставщика? Привязанные товары останутся в базе.")) return;
    triggerHaptic("medium");

    const res = await deleteSupplier(id);
    if (res.error) {
      toast.error(res.error);
    } else {
      setSuppliers((prev) => prev.filter((s) => s.id !== id));
      toast.success("Поставщик удален");
    }
  };

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
          onSelectSupplierForMaterials={(supName) => {
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
