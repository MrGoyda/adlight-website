"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { useIsMounted } from "../../../_hooks/useIsMounted";
import { MaterialCartItem } from "../../../_hooks/useMaterialCart";
import { SupplierData } from "../../../_types/pricingTypes";
import { X, ShoppingBag, Trash2 } from "lucide-react";
import { pricingDict } from "@/dictionaries/pricing";

import CartSupplierGroup from "./cart/CartSupplierGroup";
import CartDrawerFooter from "./cart/CartDrawerFooter";

interface MaterialCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: MaterialCartItem[];
  suppliers: SupplierData[];
  onUpdateQuantity: (priceItemId: string, newQty: number) => void;
  onRemoveItem: (priceItemId: string) => void;
  onClearSupplier: (supplierName: string) => void;
  onClearCart: () => void;
  groupedBySupplier: Array<{
    supplierName: string;
    items: MaterialCartItem[];
    subtotal: number;
    positionsCount: number;
  }>;
  totalSum: number;
  uniquePositionsCount: number;
  totalQuantity: number;
  onOpenSupplierInfo?: (supplierName: string) => void;
}

export default function MaterialCartDrawer({
  isOpen,
  onClose,
  items,
  suppliers,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  groupedBySupplier,
  totalSum,
  uniquePositionsCount,
  totalQuantity,
  onOpenSupplierInfo,
}: MaterialCartDrawerProps) {
  const mounted = useIsMounted();
  const t = pricingDict.modals.cart;

  // Закрытие по клавише Esc
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!mounted || !isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9995] flex justify-end bg-black/50 transition-opacity duration-200 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden border-l border-slate-200 animate-in slide-in-from-right duration-250 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Шапка корзины закупа */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-3 bg-white shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black shrink-0 shadow-md shadow-slate-900/10">
              <ShoppingBag className="w-5 h-5 text-orange-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 truncate">
                  {t.title}
                </h3>
                {uniquePositionsCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-orange-100 text-orange-800">
                    {t.positionsBadge(uniquePositionsCount)}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400 font-bold block truncate">
                {t.subtitle}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {uniquePositionsCount > 0 && (
              <button
                type="button"
                onClick={onClearCart}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                title={t.clearCart}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition cursor-pointer"
              title="Закрыть (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. Список материалов, сгруппированный по поставщику */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400">
                <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
              </div>
              <div className="space-y-1 max-w-xs">
                <h4 className="text-base font-extrabold text-slate-800">
                  {t.emptyTitle}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {t.emptySubtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-black transition cursor-pointer shadow-sm"
              >
                {t.emptyAction}
              </button>
            </div>
          ) : (
            groupedBySupplier.map((group) => (
              <CartSupplierGroup
                key={group.supplierName}
                group={group}
                suppliers={suppliers}
                onUpdateQuantity={onUpdateQuantity}
                onRemoveItem={onRemoveItem}
                onOpenSupplierInfo={onOpenSupplierInfo}
              />
            ))
          )}
        </div>

        {/* 3. Подвал корзины с общей суммой */}
        {items.length > 0 && (
          <CartDrawerFooter
            groupedBySupplier={groupedBySupplier}
            totalSum={totalSum}
            uniquePositionsCount={uniquePositionsCount}
            totalQuantity={totalQuantity}
            onClose={onClose}
          />
        )}
      </div>
    </div>,
    document.body
  );
}
