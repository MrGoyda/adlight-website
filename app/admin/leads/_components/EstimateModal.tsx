"use client";

import React, { useState, useEffect, useTransition, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Calculator, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { triggerHaptic } from "@/lib/haptics";
import { toast } from "@/lib/toast";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import { EstimateItemType, InventoryUnit } from "@prisma/client";
import { saveLeadEstimate, deductEstimateStock } from "../estimateActions";
import { getWorkOperations, saveWorkOperation } from "../workOperationActions";

import { 
  EstimateModalProps, 
  EstimateItem, 
  WorkOperationItem, 
  ParsedSupplierPrice 
} from "./estimate/types";
import { parseSupplierPrices, calcEstimateBreakdown } from "./estimate/utils";
import { EstimateTopBar } from "./estimate/EstimateTopBar";
import { EstimateCardItem } from "./estimate/EstimateCardItem";
import { EstimateTable } from "./estimate/EstimateTable";
import { EstimateFloatingSummary } from "./estimate/EstimateFloatingSummary";
import { EstimateFooter } from "./estimate/EstimateFooter";
import { SupplierPricePickerModal } from "./estimate/SupplierPricePickerModal";
import { WorkOperationPickerModal } from "./estimate/WorkOperationPickerModal";
import BottomSheet from "@/components/ui/BottomSheet";

export default function EstimateModal({
  isOpen,
  onClose,
  leadId,
  leadName,
  initialItems,
  isStockDeducted,
  warehouseItems,
  supplierPrices,
  onSaveSuccess,
  leads = [],
  estimateId,
}: EstimateModalProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const itemsEndRef = useRef<HTMLDivElement>(null);

  const [items, setItems] = useState<EstimateItem[]>(initialItems);
  const [stockDeducted, setStockDeducted] = useState(isStockDeducted);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(leadId ?? null);
  const [currentEstimateId, setCurrentEstimateId] = useState<string | null>(estimateId ?? null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isAtBottom, setIsAtBottom] = useState(false);

  // Справочник видов работ из БД
  const [workOperations, setWorkOperations] = useState<WorkOperationItem[]>([]);

  // Состояния для кастомных выпадающих списков
  const [activePickerIdx, setActivePickerIdx] = useState<number | null>(null);
  const [activeWorkOperationPickerIdx, setActiveWorkOperationPickerIdx] = useState<number | null>(null);

  // Каскадный парсер прайсов поставщиков
  const parsedPrices = useMemo<ParsedSupplierPrice[]>(() => {
    return parseSupplierPrices(supplierPrices);
  }, [supplierPrices]);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setSelectedLeadId(leadId ?? null);
      setCurrentEstimateId(estimateId ?? null);
      setIsAtBottom(false);

      const mapped = initialItems.map((item) => {
        if (item.type === "MATERIAL_SUPPLIER" && !item.supplierPriceId) {
          const found = supplierPrices.find((p) => `${p.supplier}: ${p.name}` === item.name);
          if (found) {
            return { ...item, supplierPriceId: found.id };
          }
        }
        return item;
      });

      setItems(mapped);
      setStockDeducted(isStockDeducted);

      getWorkOperations().then((res) => {
        if (res?.data) {
          setWorkOperations(res.data as WorkOperationItem[]);
        }
      });
    }
  }, [isOpen, initialItems, isStockDeducted, leadId, estimateId, supplierPrices]);

  // Обработка Escape с каскадным закрытием
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (activeWorkOperationPickerIdx !== null) {
          setActiveWorkOperationPickerIdx(null);
        } else if (activePickerIdx !== null) {
          setActivePickerIdx(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, activeWorkOperationPickerIdx, activePickerIdx]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const hasScroll = scrollHeight > clientHeight + 80;
    const atBottom = scrollHeight - scrollTop - clientHeight < 40;
    setIsAtBottom(hasScroll && atBottom);
  };

  const handleAddItem = (type: EstimateItemType) => {
    triggerHaptic("light");
    let name = "Новая позиция";
    let costPrice = 0;
    let sellPrice = 0;
    let unit: InventoryUnit | null = "PIECE";
    let quantity = 1;
    let warehouseItemId: string | null = null;
    let supplierPriceId: string | null = null;

    if (type === "MATERIAL_STOCK" && warehouseItems.length > 0) {
      name = warehouseItems[0].name;
      costPrice = warehouseItems[0].price;
      sellPrice = warehouseItems[0].price * 1.3;
      unit = warehouseItems[0].unit;
      warehouseItemId = warehouseItems[0].id;
    } else if (type === "MATERIAL_SUPPLIER" && supplierPrices.length > 0) {
      name = `${supplierPrices[0].supplier}: ${supplierPrices[0].name}`;
      costPrice = supplierPrices[0].price;
      sellPrice = supplierPrices[0].price * 1.3;
      unit = supplierPrices[0].unit;
      supplierPriceId = supplierPrices[0].id;
    } else if (type === "LOGISTICS") {
      name = "Аренда газели (город 1 рейс)";
      costPrice = 15000;
      sellPrice = 20000;
      unit = "PIECE";
    } else if (type === "EQUIPMENT") {
      name = "Аренда автовышки (2 ч)";
      costPrice = 10000;
      sellPrice = 13000;
      quantity = 2;
      unit = "PIECE";
    } else if (type === "ASSEMBLY") {
      const defaultAssembly = workOperations.find((o) => o.type === "ASSEMBLY");
      name = defaultAssembly?.name || "Сборка световой вывески / букв";
      costPrice = defaultAssembly?.defaultCost || 15000;
      sellPrice = defaultAssembly?.defaultPrice || 22000;
      unit = defaultAssembly?.unit || "PIECE";
    } else if (type === "INSTALLATION") {
      const defaultInstall = workOperations.find((o) => o.type === "INSTALLATION");
      name = defaultInstall?.name || "Монтаж фасадной вывески";
      costPrice = defaultInstall?.defaultCost || 25000;
      sellPrice = defaultInstall?.defaultPrice || 35000;
      unit = defaultInstall?.unit || "PIECE";
    }

    const newItem: EstimateItem = {
      type,
      name,
      quantity,
      unit,
      costPrice,
      sellPrice: sellPrice || costPrice * 1.3,
      warehouseItemId,
      supplierPriceId,
    };

    const newIdx = items.length;
    setItems((prev) => [...prev, newItem]);

    setTimeout(() => {
      const el = document.getElementById(`estimate-item-${newIdx}`) || document.getElementById(`estimate-row-${newIdx}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        itemsEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 100);
  };

  const handleRemoveItem = (index: number) => {
    triggerHaptic("light");
    setItems(items.filter((_, i) => i !== index));
  };

  const handleUpdateItemField = (index: number, field: keyof EstimateItem, value: any) => {
    const updated = [...items];

    if (field === "warehouseItemId") {
      const selectedItem = warehouseItems.find((i) => i.id === value);
      if (selectedItem) {
        updated[index].warehouseItemId = selectedItem.id;
        updated[index].name = selectedItem.name;
        updated[index].costPrice = selectedItem.price;
        updated[index].unit = selectedItem.unit;
        updated[index].sellPrice = selectedItem.price * 1.3;
      }
    } else if (field === "supplierPriceId") {
      const selectedPrice = supplierPrices.find((p) => p.id === value);
      if (selectedPrice) {
        updated[index].supplierPriceId = selectedPrice.id;
        updated[index].name = `${selectedPrice.supplier}: ${selectedPrice.name}`;
        updated[index].costPrice = selectedPrice.price;
        updated[index].unit = selectedPrice.unit;
        updated[index].sellPrice = selectedPrice.price * 1.3;
      }
    } else if (field === "quantity") {
      updated[index].quantity = value;
      const numVal = Number(value) || 0;

      if (updated[index].type === "EQUIPMENT" && numVal > 0) {
        const hours = numVal;
        updated[index].costPrice = hours <= 1 ? 20000 : 10000;
        updated[index].sellPrice = hours <= 1 ? 26000 : 13000;
        updated[index].name = `Аренда автовышки (${hours} ч)`;
      } else if (updated[index].type === "LOGISTICS" && numVal > 0) {
        const is6m =
          updated[index].name.toLowerCase().includes("6м") ||
          updated[index].name.toLowerCase().includes("6-м") ||
          updated[index].name.toLowerCase().includes("длинномер");
        if (is6m) {
          const hours = numVal;
          updated[index].costPrice = hours <= 1 ? 20000 : 10000;
          updated[index].sellPrice = hours <= 1 ? 26000 : 13000;
          updated[index].name = `Аренда 6-метровой газели (${hours} ч)`;
        } else {
          const trips = numVal;
          updated[index].costPrice = 15000;
          updated[index].sellPrice = 20000;
          updated[index].name = `Аренда газели (${trips} ${
            trips === 1 ? "рейс" : trips < 5 ? "рейса" : "рейсов"
          })`;
        }
      }
    } else {
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
    }
    setItems(updated);
  };

  const breakdown = useMemo(
    () => calcEstimateBreakdown(items),
    [items]
  );
  const { totalCost, totalSell, margin, marginPercent } = breakdown;

  const handleSave = () => {
    setError(null);
    startTransition(async () => {
      const cleanItems = items.map((item) => ({
        type: item.type,
        name: item.name,
        quantity: Number(item.quantity) || 0,
        unit: item.unit,
        costPrice: Number(item.costPrice) || 0,
        sellPrice: Number(item.sellPrice) || 0,
        warehouseItemId: item.warehouseItemId,
      }));

      // Авто-сохранение кастомных операций в базу данных
      for (const itm of cleanItems) {
        if ((itm.type === "ASSEMBLY" || itm.type === "INSTALLATION") && itm.name.trim()) {
          const exists = workOperations.some(
            (o) => o.name.toLowerCase().trim() === itm.name.toLowerCase().trim()
          );
          if (!exists) {
            saveWorkOperation({
              type: itm.type,
              name: itm.name,
              unit: itm.unit || "PIECE",
              defaultCost: itm.costPrice,
              defaultPrice: itm.sellPrice,
            });
          }
        }
      }

      const res = await saveLeadEstimate(selectedLeadId, cleanItems, currentEstimateId);
      if (res.error) {
        setError(res.error);
        toast.error(res.error || "Ошибка сохранения сметы");
      } else {
        toast.success("Смета сохранена и зафиксирована!");
        onSaveSuccess(totalSell, totalCost, res.data);
        onClose();
      }
    });
  };

  const handleDeductStock = () => {
    if (!selectedLeadId) {
      toast.warning("Сначала выберите сделку для списания остатков");
      return;
    }

    toast.confirm({
      title: "Списать материалы со склада?",
      message: "Количество позиций на складе будет автоматически уменьшено под эту смету.",
      confirmText: "Списать со склада",
      cancelText: "Отмена",
      isDestructive: false,
      onConfirm: () => {
        startTransition(async () => {
          const res = await deductEstimateStock(selectedLeadId);
          if (res.error) {
            toast.error(res.error);
          } else {
            setStockDeducted(true);
            toast.success("Материалы успешно списаны со склада!");
          }
        });
      },
    });
  };

  const hasStockMaterials = items.some((i) => i.type === "MATERIAL_STOCK" && i.warehouseItemId);

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-5xl"
      maxHeight="max-h-[92dvh]"
    >
      {/* Шапка */}
      <div className="p-4 sm:px-6 sm:py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-600 flex items-center justify-center shadow-2xs">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-slate-900 text-sm sm:text-base leading-tight">
              Калькулятор сметы
            </h3>
            <p className="text-[11px] text-slate-500 font-medium truncate max-w-[240px] sm:max-w-md">
              {leadName ? `Сделка: ${leadName}` : "Расчет себестоимости и маржинальности"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer active:scale-90"
          title="Закрыть (Esc)"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Топ-бар кнопок добавления категорий */}
      <EstimateTopBar onAddItem={handleAddItem} />

      {/* Ошибка */}
      {error && (
        <div className="mx-4 sm:mx-6 mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-bold shrink-0">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Основной скроллируемый список сметы */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-3 sm:p-6 pb-6 sm:pb-8 overscroll-contain relative"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {/* МОБИЛЬНЫЙ ВИД: КАРТОЧКИ (< 1024px) */}
        <div className="block lg:hidden space-y-3">
          {items.length === 0 ? (
            <div className="p-8 text-center bg-slate-50/70 border border-dashed border-slate-200 rounded-2xl text-slate-400">
              <Calculator className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-bold text-xs">Смета пуста</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Нажмите кнопку в панели сверху, чтобы добавить материал или работу
              </p>
            </div>
          ) : (
            items.map((item, idx) => (
              <EstimateCardItem
                key={idx}
                item={item}
                index={idx}
                warehouseItems={warehouseItems}
                supplierPrices={supplierPrices}
                onRemove={handleRemoveItem}
                onUpdateField={handleUpdateItemField}
                onOpenSupplierPicker={setActivePickerIdx}
                onOpenWorkOperationPicker={setActiveWorkOperationPickerIdx}
              />
            ))
          )}
        </div>

        {/* ДЕСКТОПНЫЙ ВИД: ТАБЛИЦА (≥ 1024px) */}
        <EstimateTable
          items={items}
          warehouseItems={warehouseItems}
          supplierPrices={supplierPrices}
          onRemove={handleRemoveItem}
          onUpdateField={handleUpdateItemField}
          onOpenSupplierPicker={setActivePickerIdx}
          onOpenWorkOperationPicker={setActiveWorkOperationPickerIdx}
        />

        {/* Итоговый футер в конце контента */}
        <EstimateFooter
          breakdown={breakdown}
          leadId={leadId}
          selectedLeadId={selectedLeadId}
          setSelectedLeadId={setSelectedLeadId}
          leads={leads}
          stockDeducted={stockDeducted}
          isPending={isPending}
          hasStockMaterials={hasStockMaterials}
          onDeductStock={handleDeductStock}
          onClose={onClose}
          onSave={handleSave}
        />

        {/* Якорь для автоприскролла */}
        <div ref={itemsEndRef} className="h-2" />
      </div>

      {/* Плавающая плашка итогов */}
      <EstimateFloatingSummary
        isVisible={!isAtBottom}
        itemCount={items.length}
        totalSell={totalSell}
        totalCost={totalCost}
        margin={margin}
        marginPercent={marginPercent}
        onScrollToBottom={() => itemsEndRef.current?.scrollIntoView({ behavior: "smooth" })}
      />

      {/* Модалка выбора материалов поставщика */}
      <SupplierPricePickerModal
        isOpen={activePickerIdx !== null}
        itemIndex={activePickerIdx}
        parsedPrices={parsedPrices}
        onSelect={(p) => {
          if (activePickerIdx !== null) {
            const updated = [...items];
            updated[activePickerIdx].supplierPriceId = p.id;
            updated[activePickerIdx].name = `${p.supplier}: ${p.originalName}`;
            updated[activePickerIdx].costPrice = p.price;
            updated[activePickerIdx].unit = p.unit;
            updated[activePickerIdx].sellPrice = p.price * 1.3;
            setItems(updated);
            setActivePickerIdx(null);
          }
        }}
        onClose={() => setActivePickerIdx(null)}
      />

      {/* Модалка выбора операций сборки и монтажа */}
      <WorkOperationPickerModal
        isOpen={activeWorkOperationPickerIdx !== null}
        itemIndex={activeWorkOperationPickerIdx}
        currentItem={activeWorkOperationPickerIdx !== null ? items[activeWorkOperationPickerIdx] : null}
        workOperations={workOperations}
        onSelect={(op) => {
          if (activeWorkOperationPickerIdx !== null) {
            const updated = [...items];
            updated[activeWorkOperationPickerIdx].name = op.name;
            updated[activeWorkOperationPickerIdx].unit = op.unit;
            updated[activeWorkOperationPickerIdx].costPrice = op.defaultCost;
            updated[activeWorkOperationPickerIdx].sellPrice = op.defaultPrice;
            setItems(updated);
            setActiveWorkOperationPickerIdx(null);
          }
        }}
        onSaveNewOperation={(newOp) => {
          setWorkOperations((prev) => [...prev.filter((p) => p.name !== newOp.name), newOp]);
        }}
        onClose={() => setActiveWorkOperationPickerIdx(null)}
      />
    </BottomSheet>
  );
}
