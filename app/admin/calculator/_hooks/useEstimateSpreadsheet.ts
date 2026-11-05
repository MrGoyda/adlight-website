"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { EstimateItemType, InventoryUnit } from "@prisma/client";
import { triggerHaptic } from "@/lib/haptics";
import { toast } from "@/lib/toast";
import { 
  SpreadsheetItem, 
  EstimatePresetData, 
  EstimatePresetItem, 
  CalculatorSupplierPrice, 
  CalculatorWarehouseItem, 
  CalculatorWorkOperation, 
  CalculationBreakdown 
} from "../_types/calculatorTypes";
import { UNIT_LABELS } from "../_data/estimateSpreadsheetDictionary";

interface UseEstimateSpreadsheetProps {
  initialItems?: SpreadsheetItem[];
  storageKey?: string;
  defaultMultiplier?: number;
}

const DEFAULT_MULTIPLIER = 1.35;

function generateRowId(): string {
  return "row_" + Math.random().toString(36).substring(2, 9) + "_" + Date.now().toString(36);
}

export function useEstimateSpreadsheet({
  initialItems,
  storageKey = "adlight_calc_draft_main",
  defaultMultiplier = DEFAULT_MULTIPLIER,
}: UseEstimateSpreadsheetProps = {}) {
  const [items, setItems] = useState<SpreadsheetItem[]>(() => {
    if (initialItems && initialItems.length > 0) {
      return initialItems;
    }
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (err) {
        console.warn("Failed to load estimate draft from localStorage:", err);
      }
    }
    return [];
  });

  const [targetMultiplier, setTargetMultiplier] = useState<number>(defaultMultiplier);
  const [clientDiscount, setClientDiscount] = useState<number>(0); // в процентах (0-100)
  const [discountAmountManual, setDiscountAmountManual] = useState<number>(0); // в тенге
  const [discountMode, setDiscountMode] = useState<"percent" | "amount">("percent");

  // Автосохранение черновика
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (items.length > 0) {
        localStorage.setItem(storageKey, JSON.stringify(items));
      } else {
        localStorage.removeItem(storageKey);
      }
    } catch (err) {
      console.warn("Failed to save draft:", err);
    }
  }, [items, storageKey]);

  // Вычисления на лету
  const breakdown = useMemo<CalculationBreakdown>(() => {
    let totalCost = 0;
    let baseSell = 0;

    for (const item of items) {
      const q = Number(item.quantity) || 0;
      const c = Number(item.costPrice) || 0;
      const s = Number(item.sellPrice) || 0;
      totalCost += q * c;
      baseSell += q * s;
    }

    let discountTotal = 0;
    if (discountMode === "percent") {
      discountTotal = Math.round((baseSell * (clientDiscount || 0)) / 100);
    } else {
      discountTotal = discountAmountManual || 0;
    }

    const totalSell = Math.max(0, baseSell - discountTotal);
    const margin = totalSell - totalCost;
    const marginPercent = totalSell > 0 ? (margin / totalSell) * 100 : 0;

    return {
      totalCost,
      totalSell,
      margin,
      marginPercent,
      itemsCount: items.length,
    };
  }, [items, clientDiscount, discountAmountManual, discountMode]);

  // Добавление кастомной строки
  const handleAddEmptyRow = useCallback((type: EstimateItemType = "CUSTOM") => {
    triggerHaptic("light");
    const newItem: SpreadsheetItem = {
      id: generateRowId(),
      type,
      name: "",
      quantity: 1,
      unit: "PIECE",
      costPrice: 0,
      sellPrice: 0,
    };
    setItems((prev) => [...prev, newItem]);
  }, []);

  // Добавление из базы поставщиков
  const handleAddSupplierMaterial = useCallback((price: CalculatorSupplierPrice) => {
    triggerHaptic("medium");
    const cost = price.price || 0;
    const sell = Math.round(cost * targetMultiplier);

    const newItem: SpreadsheetItem = {
      id: generateRowId(),
      type: "MATERIAL_SUPPLIER",
      name: price.name,
      quantity: 1,
      unit: price.unit || "PIECE",
      costPrice: cost,
      sellPrice: sell,
      supplierPriceId: price.id,
    };
    setItems((prev) => [...prev, newItem]);
    toast.success(`Добавлен: ${price.name}`);
  }, [targetMultiplier]);

  // Добавление со склада
  const handleAddWarehouseItem = useCallback((item: CalculatorWarehouseItem) => {
    triggerHaptic("medium");
    const cost = item.price || 0;
    const sell = Math.round(cost * targetMultiplier);

    const newItem: SpreadsheetItem = {
      id: generateRowId(),
      type: "MATERIAL_STOCK",
      name: item.name,
      quantity: 1,
      unit: item.unit || "PIECE",
      costPrice: cost,
      sellPrice: sell,
      warehouseItemId: item.id,
    };
    setItems((prev) => [...prev, newItem]);
    toast.success(`Со склада добавлен: ${item.name}`);
  }, [targetMultiplier]);

  // Добавление тарифа работы
  const handleAddWorkOperation = useCallback((op: CalculatorWorkOperation) => {
    triggerHaptic("medium");
    const newItem: SpreadsheetItem = {
      id: generateRowId(),
      type: op.type,
      name: op.name,
      quantity: 1,
      unit: op.unit || "PIECE",
      costPrice: op.defaultCost || 0,
      sellPrice: op.defaultPrice || Math.round((op.defaultCost || 0) * targetMultiplier),
    };
    setItems((prev) => [...prev, newItem]);
    toast.success(`Добавлена работа: ${op.name}`);
  }, [targetMultiplier]);

  // Быстрое применение пресета
  const handleApplyPreset = useCallback((preset: EstimatePresetData, mode: "replace" | "append" = "append") => {
    triggerHaptic("success");
    const newItems: SpreadsheetItem[] = preset.items.map((pi: EstimatePresetItem) => ({
      id: generateRowId(),
      type: pi.type,
      name: pi.name,
      quantity: pi.quantity || 1,
      unit: pi.unit || "PIECE",
      costPrice: pi.costPrice || 0,
      sellPrice: pi.sellPrice || 0,
      supplierPriceId: pi.supplierPriceId,
      warehouseItemId: pi.warehouseItemId,
    }));

    if (mode === "replace") {
      setItems(newItems);
      toast.success(`Применен пресет: ${preset.name} (${newItems.length} поз.)`);
    } else {
      setItems((prev) => [...prev, ...newItems]);
      toast.success(`Добавлены позиции из пресета: ${preset.name}`);
    }
  }, []);

  // Инлайн обновление ячейки
  const handleUpdateItem = useCallback((id: string, field: keyof SpreadsheetItem, value: string | number | InventoryUnit) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        // Если обновили себестоимость и цена продажи еще 0 — авто-наценка
        if (field === "costPrice") {
          const numCost = Number(value) || 0;
          const currentSell = Number(item.sellPrice) || 0;
          if (currentSell === 0 || currentSell === Math.round(item.costPrice * targetMultiplier)) {
            return {
              ...item,
              costPrice: numCost,
              sellPrice: Math.round(numCost * targetMultiplier),
            };
          }
        }

        return { ...item, [field]: value };
      })
    );
  }, [targetMultiplier]);

  // Удаление строки
  const handleRemoveItem = useCallback((id: string) => {
    triggerHaptic("light");
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Очистка сметы
  const handleClearAll = useCallback(() => {
    triggerHaptic("medium");
    setItems([]);
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(storageKey);
      } catch {
        // ignore
      }
    }
    toast.info("Смета очищена");
  }, [storageKey]);

  // Массовое применение коэффициента наценки ко всей таблице
  const handleApplyMultiplierToAll = useCallback((multiplier: number) => {
    triggerHaptic("medium");
    setTargetMultiplier(multiplier);
    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        sellPrice: Math.round((Number(item.costPrice) || 0) * multiplier),
      }))
    );
    toast.success(`Применена наценка x${multiplier}`);
  }, []);

  // Генерация текста КП для клиента (для WhatsApp)
  const generateClientProposalText = useCallback((): string => {
    if (items.length === 0) return "";

    const lines: string[] = [
      "✨ *Коммерческое предложение | Рекламно-производственная компания ADLight*",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "📍 *Состав проекта и спецификация:*",
    ];

    items.forEach((item, idx) => {
      const q = Number(item.quantity) || 1;
      const u = UNIT_LABELS[item.unit] || "шт.";
      const s = (Number(item.sellPrice) || 0) * q;
      lines.push(`${idx + 1}. ${item.name} — ${q} ${u} (${s.toLocaleString("ru-RU")} ₸)`);
    });

    lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    if (discountMode === "percent" && clientDiscount > 0) {
      lines.push(`🎁 Ваша скидка: ${clientDiscount}%`);
    } else if (discountMode === "amount" && discountAmountManual > 0) {
      lines.push(`🎁 Ваша скидка: ${discountAmountManual.toLocaleString("ru-RU")} ₸`);
    }

    lines.push(`💰 *ИТОГО К ОПЛАТЕ: ${breakdown.totalSell.toLocaleString("ru-RU")} ₸*`);
    lines.push("⏱ Срок изготовления: 3–5 рабочих дней");
    lines.push("🛡 Гарантия на светотехнику и монтаж: 12 месяцев");
    lines.push("");
    lines.push("Будем рады реализовать проект на высшем уровне! Готовы запустить в производство?");

    return lines.join("\n");
  }, [items, clientDiscount, discountAmountManual, discountMode, breakdown.totalSell]);

  // Копирование КП в буфер обмена
  const handleCopyClientProposal = useCallback(async () => {
    triggerHaptic("success");
    const text = generateClientProposalText();
    if (!text) {
      toast.error("Смета пуста, нечего копировать");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      toast.success("Текст КП для WhatsApp скопирован в буфер обмена!");
    } catch {
      toast.error("Не удалось скопировать текст");
    }
  }, [generateClientProposalText]);

  return {
    items,
    setItems,
    targetMultiplier,
    clientDiscount,
    setClientDiscount,
    discountAmountManual,
    setDiscountAmountManual,
    discountMode,
    setDiscountMode,
    breakdown,
    handleAddEmptyRow,
    handleAddSupplierMaterial,
    handleAddWarehouseItem,
    handleAddWorkOperation,
    handleApplyPreset,
    handleUpdateItem,
    handleRemoveItem,
    handleClearAll,
    handleApplyMultiplierToAll,
    generateClientProposalText,
    handleCopyClientProposal,
  };
}
