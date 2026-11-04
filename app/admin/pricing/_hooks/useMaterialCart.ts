"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { SupplierPriceItem } from "../_types/pricingTypes";
import { INVENTORY_UNITS } from "../_data/pricingDictionary";
import { triggerHaptic } from "@/lib/haptics";
import { toast } from "@/lib/toast";

export interface MaterialCartItem {
  id: string; // unique cart item id (priceItemId)
  priceItemId: string;
  name: string;
  supplier: string;
  price: number;
  unitShort: string;
  quantity: number;
  imageUrl?: string | null;
  category?: string | null;
  subcategory?: string | null;
  description?: string | null;
}

const CART_STORAGE_KEY = "adlight_material_procurement_cart_v1";

export function useMaterialCart() {
  const [items, setItems] = useState<MaterialCartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 1. Гидратация из localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // 2. Синхронизация с localStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [items, isInitialized]);

  // Добавление позиции в корзину
  const addToCart = useCallback((priceItem: SupplierPriceItem, quantity = 1) => {
    triggerHaptic("medium");
    const unitShort = INVENTORY_UNITS[priceItem.unit]?.short || "ед.";

    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.priceItemId === priceItem.id);
      if (existingIndex >= 0) {
        const next = [...prev];
        const updatedQty = next[existingIndex].quantity + quantity;
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: updatedQty,
          price: Number(priceItem.price) || next[existingIndex].price,
        };
        toast.success(`«${priceItem.name}»: ${updatedQty} ${unitShort} в корзине`);
        return next;
      } else {
        const newItem: MaterialCartItem = {
          id: priceItem.id,
          priceItemId: priceItem.id,
          name: priceItem.name,
          supplier: priceItem.supplier || "Не указан",
          price: Number(priceItem.price) || 0,
          unitShort,
          quantity,
          imageUrl: priceItem.imageUrl,
          category: priceItem.category,
          subcategory: priceItem.subcategory,
          description: priceItem.description,
        };
        toast.success(`Добавлено в корзину закупа: «${priceItem.name}» (${quantity} ${unitShort})`);
        return [...prev, newItem];
      }
    });
  }, []);

  // Изменение количества
  const updateQuantity = useCallback((priceItemId: string, newQty: number) => {
    if (newQty <= 0) {
      triggerHaptic("light");
      setItems((prev) => prev.filter((i) => i.priceItemId !== priceItemId));
      return;
    }
    triggerHaptic("light");
    setItems((prev) =>
      prev.map((i) => (i.priceItemId === priceItemId ? { ...i, quantity: newQty } : i))
    );
  }, []);

  // Удаление позиции
  const removeFromCart = useCallback((priceItemId: string) => {
    triggerHaptic("light");
    setItems((prev) => prev.filter((i) => i.priceItemId !== priceItemId));
  }, []);

  // Удаление всех позиций одного поставщика
  const clearSupplierItems = useCallback((supplierName: string) => {
    triggerHaptic("medium");
    setItems((prev) => prev.filter((i) => i.supplier.toLowerCase() !== supplierName.toLowerCase()));
    toast.info(`Позиции поставщика «${supplierName}» удалены из корзины`);
  }, []);

  // Полная очистка корзины
  const clearCart = useCallback(() => {
    triggerHaptic("medium");
    setItems([]);
    toast.info("Корзина закупа очищена");
  }, []);

  // Подсчет уникальных позиций и общего количества
  const uniquePositionsCount = items.length;

  const totalQuantity = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const totalSum = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  // Группировка позиций по поставщику
  const groupedBySupplier = useMemo(() => {
    const groups: Record<
      string,
      {
        supplierName: string;
        items: MaterialCartItem[];
        subtotal: number;
        positionsCount: number;
      }
    > = {};

    for (const item of items) {
      const sup = item.supplier || "Не указан";
      if (!groups[sup]) {
        groups[sup] = {
          supplierName: sup,
          items: [],
          subtotal: 0,
          positionsCount: 0,
        };
      }
      groups[sup].items.push(item);
      groups[sup].subtotal += item.price * item.quantity;
      groups[sup].positionsCount += 1;
    }

    return Object.values(groups).sort((a, b) => b.subtotal - a.subtotal);
  }, [items]);

  const isItemInCart = useCallback(
    (priceItemId: string) => {
      return items.some((i) => i.priceItemId === priceItemId);
    },
    [items]
  );

  const getItemQuantity = useCallback(
    (priceItemId: string) => {
      const found = items.find((i) => i.priceItemId === priceItemId);
      return found ? found.quantity : 0;
    },
    [items]
  );

  return {
    items,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearSupplierItems,
    clearCart,
    uniquePositionsCount,
    totalQuantity,
    totalSum,
    groupedBySupplier,
    isItemInCart,
    getItemQuantity,
  };
}
