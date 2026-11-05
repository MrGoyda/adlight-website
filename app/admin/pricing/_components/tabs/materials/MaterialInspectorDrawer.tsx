"use client";

import React, { useState, useEffect, memo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { SupplierPriceItem } from "../../../_types/pricingTypes";
import { X, Trash2, Edit2, ShoppingBag } from "lucide-react";
import { pricingDict } from "@/dictionaries/pricing";

import InspectorPhotoSection from "./inspector/InspectorPhotoSection";
import InspectorPriceSection from "./inspector/InspectorPriceSection";
import InspectorCartSection from "./inspector/InspectorCartSection";
import InspectorMetaSection from "./inspector/InspectorMetaSection";

interface MaterialInspectorDrawerProps {
  item: SupplierPriceItem | null;
  onClose: () => void;
  onOpenEditModal: (item: SupplierPriceItem) => void;
  onQuickUpdatePrice: (id: string, newPrice: number) => Promise<void>;
  onDeleteItem: (id: string) => Promise<void>;
  onOpenSupplierInfo?: (supplierName: string) => void;
  onAddToCart?: (item: SupplierPriceItem, quantity?: number) => void;
  onRemoveFromCart?: (id: string) => void;
  onUpdateCartQuantity?: (priceItemId: string, newQty: number) => void;
  isInCart?: boolean;
  cartQuantity?: number;
}

function MaterialInspectorDrawer({
  item,
  onClose,
  onOpenEditModal,
  onQuickUpdatePrice,
  onDeleteItem,
  onOpenSupplierInfo,
  onAddToCart,
  onRemoveFromCart,
  onUpdateCartQuantity,
  isInCart = false,
  cartQuantity = 0,
}: MaterialInspectorDrawerProps) {
  const [mounted, setMounted] = useState(false);
  const t = pricingDict.modals.inspector;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Закрытие по клавише Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && item) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [item, onClose]);

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {item && (
        <>
          {/* Затемняющий оверлей */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 z-[9980] bg-black/50"
          />

          {/* Выезжающая панель инспектора */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
            className="fixed top-0 right-0 z-[9985] w-full max-w-md h-full bg-white shadow-2xl flex flex-col justify-between overflow-hidden border-l border-slate-200"
          >
            {/* 1. Шапка инспектора */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-3 bg-white shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-orange-100 text-orange-800">
                  {t.badge}
                </span>
                {isInCart && (
                  <div className="flex items-center gap-1">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-900 text-orange-400 flex items-center gap-1">
                      <ShoppingBag className="w-3 h-3" />
                      <span>{t.inCartBadge(cartQuantity)}</span>
                    </span>
                    {onRemoveFromCart && (
                      <button
                        type="button"
                        onClick={() => onRemoveFromCart(item.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        title={t.removeFromCartTooltip}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition cursor-pointer"
                title="Закрыть (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 2. Тело инспектора */}
            <div className="p-5 flex-1 overflow-y-auto space-y-5">
              <InspectorPhotoSection item={item} />

              <InspectorPriceSection
                item={item}
                onQuickUpdatePrice={onQuickUpdatePrice}
              />

              <InspectorCartSection
                item={item}
                isInCart={isInCart}
                cartQuantity={cartQuantity}
                onAddToCart={onAddToCart}
                onRemoveFromCart={onRemoveFromCart}
                onUpdateCartQuantity={onUpdateCartQuantity}
              />

              <InspectorMetaSection
                item={item}
                onOpenSupplierInfo={onOpenSupplierInfo}
              />
            </div>

            {/* 3. Подвал инспектора */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between gap-3 bg-white shrink-0">
              <button
                type="button"
                onClick={() => onDeleteItem(item.id)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-black transition cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>{t.deleteButton}</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenEditModal(item)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition cursor-pointer active:scale-95"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>{t.editButton}</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default memo(MaterialInspectorDrawer);
