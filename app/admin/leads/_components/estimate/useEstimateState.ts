"use client";

import { useState, useEffect, useTransition, useMemo, useRef } from "react";
import { EstimateItemType, InventoryUnit } from "@prisma/client";
import { triggerHaptic } from "@/lib/haptics";
import { toast } from "@/lib/toast";
import { saveLeadEstimate, deductEstimateStock } from "../../estimateActions";
import { getWorkOperations, saveWorkOperation } from "../../workOperationActions";
import {
  EstimateItem,
  WorkOperationItem,
  ParsedSupplierPrice,
  WarehouseItem,
  SupplierPrice,
} from "./types";
import { 
  parseSupplierPrices, 
  calcEstimateBreakdown,
  calcEquipmentRates,
  calcLongTruckRates,
  calcStandardTruckRates,
  saveEstimateDraft,
  loadEstimateDraft,
  clearEstimateDraft,
} from "./utils";
import { DEFAULT_MARGIN_MULTIPLIER } from "./constants";

interface UseEstimateStateProps {
  isOpen: boolean;
  onClose: () => void;
  leadId?: string | null;
  initialItems: EstimateItem[];
  isStockDeducted?: boolean;
  warehouseItems: WarehouseItem[];
  supplierPrices: SupplierPrice[];
  onSaveSuccess: (totalSell: number, totalCost: number, estimateData?: any) => void;
  estimateId?: string | null;
}

export function useEstimateState({
  isOpen,
  onClose,
  leadId,
  initialItems,
  isStockDeducted = false,
  warehouseItems,
  supplierPrices,
  onSaveSuccess,
  estimateId,
}: UseEstimateStateProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const itemsEndRef = useRef<HTMLDivElement>(null);

  // Ключ для черновика
  const draftKey = leadId || "general";
  const isInitializedRef = useRef(false);

  // Ленивая инициализация из кэша
  const [items, setItems] = useState<EstimateItem[]>(() => {
    if (typeof window !== "undefined") {
      const cached = loadEstimateDraft(draftKey);
      if (cached && cached.items && cached.items.length > 0) {
        return cached.items;
      }
    }
    return initialItems || [];
  });

  const [stockDeducted, setStockDeducted] = useState(isStockDeducted);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(leadId ?? null);
  const [currentEstimateId, setCurrentEstimateId] = useState<string | null>(estimateId ?? null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [restoredDraftInfo, setRestoredDraftInfo] = useState<{ time: string; count: number } | null>(() => {
    if (typeof window !== "undefined") {
      const cached = loadEstimateDraft(draftKey);
      if (cached && cached.items && cached.items.length > 0) {
        return { time: cached.timeStr, count: cached.items.length };
      }
    }
    return null;
  });

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

      // ── 1. ПРОВЕРКА ЛОКАЛЬНОГО КЭША ЧЕРНОВИКА ──
      const cachedDraft = loadEstimateDraft(draftKey);
      if (cachedDraft && cachedDraft.items && cachedDraft.items.length > 0) {
        setItems(cachedDraft.items);
        setRestoredDraftInfo({
          time: cachedDraft.timeStr,
          count: cachedDraft.items.length,
        });
      } else {
        const mappedInitial = (initialItems || []).map((item) => {
          if (item.type === "MATERIAL_SUPPLIER" && !item.supplierPriceId) {
            const found = supplierPrices.find((p) => `${p.supplier}: ${p.name}` === item.name);
            if (found) {
              return { ...item, supplierPriceId: found.id };
            }
          }
          return item;
        });
        setItems(mappedInitial);
        setRestoredDraftInfo(null);
      }

      setStockDeducted(isStockDeducted);
      isInitializedRef.current = true;

      getWorkOperations().then((res) => {
        if (res?.data) {
          setWorkOperations(res.data as WorkOperationItem[]);
        }
      });
    } else {
      isInitializedRef.current = false;
    }
  }, [isOpen, leadId, draftKey]);

  // ── 2. АВТОМАТИЧЕСКОЕ СОХРАНЕНИЕ ЧЕРНОВИКА В КЭШ ПРИ ЛЮБЫХ ИЗМЕНЕНИЯХ ──
  useEffect(() => {
    if (!isOpen || !isInitializedRef.current) return;
    if (items.length > 0) {
      saveEstimateDraft(draftKey, items, selectedLeadId);
    } else {
      clearEstimateDraft(draftKey);
    }
  }, [items, isOpen, draftKey, selectedLeadId]);

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
    triggerHaptic("medium");

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
      sellPrice = warehouseItems[0].price * DEFAULT_MARGIN_MULTIPLIER;
      unit = warehouseItems[0].unit;
      warehouseItemId = warehouseItems[0].id;
    } else if (type === "MATERIAL_SUPPLIER" && supplierPrices.length > 0) {
      name = `${supplierPrices[0].supplier}: ${supplierPrices[0].name}`;
      costPrice = supplierPrices[0].price;
      sellPrice = supplierPrices[0].price * DEFAULT_MARGIN_MULTIPLIER;
      unit = supplierPrices[0].unit;
      supplierPriceId = supplierPrices[0].id;
    } else if (type === "LOGISTICS") {
      const rate = calcStandardTruckRates(1);
      name = rate.name;
      costPrice = rate.costPrice;
      sellPrice = rate.sellPrice;
      unit = "PIECE";
    } else if (type === "EQUIPMENT") {
      const rate = calcEquipmentRates(2);
      name = rate.name;
      costPrice = rate.costPrice;
      sellPrice = rate.sellPrice;
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
      sellPrice: sellPrice || costPrice * DEFAULT_MARGIN_MULTIPLIER,
      warehouseItemId,
      supplierPriceId,
    };

    const newIdx = items.length;
    const nextItems = [...items, newItem];
    setItems(nextItems);
    saveEstimateDraft(draftKey, nextItems, selectedLeadId);

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
    const filtered = items.filter((_, i) => i !== index);
    setItems(filtered);
    if (filtered.length > 0) {
      saveEstimateDraft(draftKey, filtered, selectedLeadId);
    } else {
      clearEstimateDraft(draftKey);
    }
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
        updated[index].sellPrice = selectedItem.price * DEFAULT_MARGIN_MULTIPLIER;
      }
    } else if (field === "supplierPriceId") {
      const selectedPrice = supplierPrices.find((p) => p.id === value);
      if (selectedPrice) {
        updated[index].supplierPriceId = selectedPrice.id;
        updated[index].name = `${selectedPrice.supplier}: ${selectedPrice.name}`;
        updated[index].costPrice = selectedPrice.price;
        updated[index].unit = selectedPrice.unit;
        updated[index].sellPrice = selectedPrice.price * DEFAULT_MARGIN_MULTIPLIER;
      }
    } else if (field === "quantity") {
      updated[index].quantity = value;
      const numVal = Number(value) || 0;

      if (updated[index].type === "EQUIPMENT" && numVal > 0) {
        const rate = calcEquipmentRates(numVal);
        updated[index].costPrice = rate.costPrice;
        updated[index].sellPrice = rate.sellPrice;
        updated[index].name = rate.name;
      } else if (updated[index].type === "LOGISTICS" && numVal > 0) {
        const is6m =
          updated[index].name.toLowerCase().includes("6м") ||
          updated[index].name.toLowerCase().includes("6-м") ||
          updated[index].name.toLowerCase().includes("длинномер");
        if (is6m) {
          const rate = calcLongTruckRates(numVal);
          updated[index].costPrice = rate.costPrice;
          updated[index].sellPrice = rate.sellPrice;
          updated[index].name = rate.name;
        } else {
          const rate = calcStandardTruckRates(numVal);
          updated[index].costPrice = rate.costPrice;
          updated[index].sellPrice = rate.sellPrice;
          updated[index].name = rate.name;
        }
      }
    } else {
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
    }
    setItems(updated);
    saveEstimateDraft(draftKey, updated, selectedLeadId);
  };

  const breakdown = useMemo(() => {
    return calcEstimateBreakdown(items);
  }, [items]);

  const { totalCost, totalSell, margin, marginPercent } = breakdown;

  const handleSave = () => {
    setError(null);
    startTransition(async () => {
      const cleanItems = items.map((itm) => ({
        ...itm,
        quantity: Number(itm.quantity) || 0,
        costPrice: Number(itm.costPrice) || 0,
        sellPrice: Number(itm.sellPrice) || 0,
      }));

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
        clearEstimateDraft(draftKey);
        setRestoredDraftInfo(null);
        toast.success("Смета сохранена и зафиксирована!");
        onSaveSuccess(totalSell, totalCost, res.data);
        onClose();
      }
    });
  };

  const handleDiscardDraft = () => {
    clearEstimateDraft(draftKey);
    setItems(initialItems || []);
    setRestoredDraftInfo(null);
    toast.info("Черновик сметы сброшен");
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

  return {
    items,
    setItems,
    stockDeducted,
    selectedLeadId,
    setSelectedLeadId,
    error,
    isPending,
    isAtBottom,
    restoredDraftInfo,
    scrollContainerRef,
    itemsEndRef,
    workOperations,
    setWorkOperations,
    activePickerIdx,
    setActivePickerIdx,
    activeWorkOperationPickerIdx,
    setActiveWorkOperationPickerIdx,
    parsedPrices,
    breakdown,
    handleScroll,
    handleAddItem,
    handleRemoveItem,
    handleUpdateItemField,
    handleSave,
    handleDiscardDraft,
    handleDeductStock,
  };
}
