"use client";

import { useState } from "react";
import { SupplierData, SupplierPriceItem, WorkOperationItem, PricingTabType } from "../_types/pricingTypes";
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

interface UsePricingStateProps {
  initialSuppliers: SupplierData[];
  initialSupplierPrices: SupplierPriceItem[];
  initialWorkOperations: WorkOperationItem[];
}

export function usePricingState({
  initialSuppliers,
  initialSupplierPrices,
  initialWorkOperations,
}: UsePricingStateProps) {
  const [activeTab, setActiveTab] = useState<PricingTabType>("materials");

  // Данные
  const [suppliers, setSuppliers] = useState<SupplierData[]>(initialSuppliers);
  const [supplierPrices, setSupplierPrices] = useState<SupplierPriceItem[]>(initialSupplierPrices);
  const [workOperations, setWorkOperations] = useState<WorkOperationItem[]>(initialWorkOperations);

  // Модальные окна
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
      const res = await updateSupplierPrice(data.id, data);
      if (res.error) {
        toast.error(res.error);
      } else if (res.data) {
        setSupplierPrices((prev) => prev.map((p) => (p.id === data.id ? res.data : p)));
        toast.success("Товар успешно обновлен");
      }
    } else {
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
        setSuppliers((prev) => [...prev, res.data]);
        toast.success("Поставщик добавлен");
      }
    }
  };

  const handleDeleteSupplier = async (id: string) => {
    if (!confirm("Удалить поставщика? Товары этого поставщика останутся в каталоге, но привязка будет снята.")) return;
    triggerHaptic("medium");

    const res = await deleteSupplier(id);
    if (res.error) {
      toast.error(res.error);
    } else {
      setSuppliers((prev) => prev.filter((s) => s.id !== id));
      toast.success("Поставщик удален");
    }
  };

  return {
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
  };
}
