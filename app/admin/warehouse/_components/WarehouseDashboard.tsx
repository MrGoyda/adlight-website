"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  Package, 
  History 
} from "lucide-react";
import * as XLSX from "xlsx";
import { 
  WarehouseItemData, 
  WarehouseSupplierPriceData, 
  WarehouseTransactionData, 
  WarehouseBreakdown, 
  StockStatusFilter 
} from "../_types/warehouseTypes";
import { SupplierData, SupplierPriceItem } from "@/app/admin/pricing/_types/pricingTypes";
import { UNIT_LABELS } from "../constants";
import WarehouseHeader from "./WarehouseHeader";
import WarehouseMetrics from "./WarehouseMetrics";
import WarehouseStockTable from "./WarehouseStockTable";
import WarehouseHistoryTab from "./WarehouseHistoryTab";
import MaterialModal, { MaterialModalSavePayload } from "@/app/admin/pricing/_components/materials/MaterialModal";
import WarehouseAdjustModal from "./WarehouseAdjustModal";
import WarehouseSupplierIntakeModal from "./WarehouseSupplierIntakeModal";
import { deleteWarehouseItem, saveWarehouseMaterialUnified } from "../actions";
import { toast } from "@/lib/toast";
import { triggerHaptic } from "@/lib/haptics";

interface WarehouseDashboardProps {
  initialItems: WarehouseItemData[];
  initialSupplierPrices: WarehouseSupplierPriceData[];
  initialTransactions: WarehouseTransactionData[];
  initialSuppliers: SupplierData[];
}

export default function WarehouseDashboard({
  initialItems,
  initialSupplierPrices,
  initialTransactions,
  initialSuppliers,
}: WarehouseDashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"stock" | "history">("stock");
  const [statusFilter, setStatusFilter] = useState<StockStatusFilter>("all");

  // Состояние модальных окон
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WarehouseItemData | null>(null);

  const [adjustModalState, setAdjustModalState] = useState<{
    isOpen: boolean;
    item: WarehouseItemData | null;
    mode: "in" | "out";
  }>({
    isOpen: false,
    item: null,
    mode: "in",
  });

  const [isSupplierIntakeOpen, setIsSupplierIntakeOpen] = useState(false);

  // Сводные метрики склада (KPIs)
  const breakdown = useMemo<WarehouseBreakdown>(() => {
    let inStock = 0;
    let lowStock = 0;
    let outOfStock = 0;
    let totalValue = 0;

    for (const item of initialItems) {
      const q = Number(item.quantity) || 0;
      const p = Number(item.price) || 0;
      totalValue += q * p;

      if (q > 0) inStock++;
      if (q <= 0) outOfStock++;
      if (q <= 0 || (item.minStock > 0 && q <= item.minStock)) {
        lowStock++;
      }
    }

    const recentIntake = initialTransactions.filter((t) => t.quantityChanged > 0).length;
    const recentOutflow = initialTransactions.filter((t) => t.quantityChanged < 0).length;

    return {
      totalItemsCount: initialItems.length,
      inStockCount: inStock,
      lowStockCount: lowStock,
      outOfStockCount: outOfStock,
      totalInventoryValue: totalValue,
      recentIntakeCount: recentIntake,
      recentOutflowCount: recentOutflow,
    };
  }, [initialItems, initialTransactions]);

  // Выгрузка ведомости инвентаризации в Excel
  const handleExportExcel = useCallback(() => {
    triggerHaptic("medium");
    if (initialItems.length === 0) {
      toast.error("Склад пуст, нечего выгружать");
      return;
    }

    try {
      const rows = initialItems.map((item, idx) => ({
        "№": idx + 1,
        "Наименование материала": item.name,
        "Категория": item.category,
        "Локация в цехе": item.location || "Не указана",
        "Учетный остаток": item.quantity,
        "Единица измерения": UNIT_LABELS[item.unit] || item.unit,
        "Себестоимость, ₸": item.price,
        "Сумма на складе, ₸": item.quantity * item.price,
        "Фактический остаток (переучет)": "",
        "Расхождение (+/-)": "",
        "Подпись": "",
      }));

      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Складская ведомость");

      const dateStr = new Date().toISOString().split("T")[0];
      XLSX.writeFile(workbook, `Инвентаризационная_ведомость_ADLight_${dateStr}.xlsx`);
      toast.success("Ведомость инвентаризации скачана!");
    } catch (err) {
      console.error("Export error:", err);
      toast.error("Не удалось сформировать файл Excel");
    }
  }, [initialItems]);

  // Удаление позиции
  const handleDeleteItem = useCallback((id: string, name: string) => {
    if (!confirm(`Удалить материал "${name}" со склада? Вся история движения также будет очищена.`)) {
      return;
    }

    triggerHaptic("medium");
    deleteWarehouseItem(id).then((res) => {
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(`Материал "${name}" удален`);
        router.refresh();
      }
    });
  }, [router]);

  // Преобразование редактируемого элемента склада в формат SupplierPriceItem для унифицированной модалки
  const modalEditingItem = useMemo<SupplierPriceItem | null>(() => {
    if (!editingItem) return null;
    const match = initialSupplierPrices.find(
      (sp) => sp.name.toLowerCase() === editingItem.name.toLowerCase()
    );
    const defaultSupplier = initialSuppliers[0]?.name || "Демер";
    return {
      id: editingItem.id,
      name: editingItem.name,
      supplier: match?.supplier || defaultSupplier,
      supplierId: match?.supplierId || null,
      price: editingItem.price,
      unit: editingItem.unit,
      category: match?.category || editingItem.category,
      subcategory: match?.subcategory || null,
      imageUrl: match?.imageUrl || null,
      description: match?.description || null,
      sourceUrl: match?.sourceUrl || null,
      createdAt: editingItem.createdAt,
      updatedAt: editingItem.updatedAt,
    };
  }, [editingItem, initialSupplierPrices, initialSuppliers]);

  // Сохранение материала через унифицированное действие
  const handleSaveMaterial = async (payload: MaterialModalSavePayload) => {
    const res = await saveWarehouseMaterialUnified(payload);
    if (res.error) {
      toast.error(res.error);
      throw new Error(res.error);
    } else {
      toast.success(
        editingItem
          ? `Карточка "${payload.name}" обновлена`
          : `Материал "${payload.name}" добавлен на склад`
      );
      setIsItemModalOpen(false);
      setEditingItem(null);
      router.refresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Шапка страницы */}
      <WarehouseHeader
        onOpenCreateModal={() => {
          setEditingItem(null);
          setIsItemModalOpen(true);
        }}
        onOpenSupplierIntakeModal={() => setIsSupplierIntakeOpen(true)}
        onExportExcel={handleExportExcel}
        totalSku={initialItems.length}
      />

      {/* 2. Сводные метрики склада */}
      <WarehouseMetrics
        breakdown={breakdown}
        currentStatusFilter={statusFilter}
        onSelectStatusFilter={setStatusFilter}
      />

      {/* 3. Переключатель основных вкладок: Остатки vs История */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => {
            triggerHaptic("light");
            setActiveTab("stock");
          }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer ${
            activeTab === "stock"
              ? "bg-slate-900 text-white shadow-2xs font-extrabold"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Остатки на складе</span>
          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-full bg-white/20">
            {initialItems.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            triggerHaptic("light");
            setActiveTab("history");
          }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer ${
            activeTab === "history"
              ? "bg-slate-900 text-white shadow-2xs font-extrabold"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
          }`}
        >
          <History className="w-4 h-4" />
          <span>Журнал движений (Аудит)</span>
          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {initialTransactions.length}
          </span>
        </button>
      </div>

      {/* 4. Контент активной вкладки */}
      {activeTab === "stock" ? (
        <WarehouseStockTable
          items={initialItems}
          currentStatusFilter={statusFilter}
          onSelectStatusFilter={setStatusFilter}
          onOpenCreateModal={() => {
            setEditingItem(null);
            setIsItemModalOpen(true);
          }}
          onOpenEditModal={(item) => {
            setEditingItem(item);
            setIsItemModalOpen(true);
          }}
          onOpenAdjustModal={(item, mode) => {
            setAdjustModalState({ isOpen: true, item, mode });
          }}
          onDeleteItem={handleDeleteItem}
        />
      ) : (
        <WarehouseHistoryTab transactions={initialTransactions} />
      )}

      {/* 5. Унифицированное модальное окно создания / редактирования карточки */}
      {isItemModalOpen && (
        <MaterialModal
          key={editingItem?.id || "new"}
          isOpen={isItemModalOpen}
          onClose={() => {
            setIsItemModalOpen(false);
            setEditingItem(null);
          }}
          onSave={handleSaveMaterial}
          editingItem={modalEditingItem}
          suppliers={initialSuppliers}
          showWarehouseFields={true}
          initialWarehouseData={
            editingItem
              ? {
                  quantity: editingItem.quantity,
                  location: editingItem.location,
                  minStock: editingItem.minStock,
                }
              : undefined
          }
        />
      )}

      {/* 6. Модалка быстрого прихода / списания */}
      {adjustModalState.isOpen && (
        <WarehouseAdjustModal
          isOpen={adjustModalState.isOpen}
          onClose={() =>
            setAdjustModalState({ isOpen: false, item: null, mode: "in" })
          }
          item={adjustModalState.item}
          initialMode={adjustModalState.mode}
          onSuccess={() => router.refresh()}
        />
      )}

      {/* 7. Модалка оприходования от поставщика */}
      {isSupplierIntakeOpen && (
        <WarehouseSupplierIntakeModal
          isOpen={isSupplierIntakeOpen}
          onClose={() => setIsSupplierIntakeOpen(false)}
          supplierPrices={initialSupplierPrices}
          existingWarehouseItems={initialItems}
          onSuccess={() => router.refresh()}
        />
      )}
    </div>
  );
}
