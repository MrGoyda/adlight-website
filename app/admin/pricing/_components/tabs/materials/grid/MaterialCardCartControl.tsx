"use client";

import React from "react";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { pricingDict } from "@/dictionaries/pricing";
import { SupplierPriceItem } from "../../../../_types/pricingTypes";

interface MaterialCardCartControlProps {
  item: SupplierPriceItem;
  isInCart: boolean;
  cartQuantity: number;
  onAddToCart?: (item: SupplierPriceItem, quantity?: number) => void;
  onRemoveFromCart?: (id: string) => void;
  onUpdateCartQuantity?: (priceItemId: string, newQty: number) => void;
}

export default function MaterialCardCartControl({
  item,
  isInCart,
  cartQuantity,
  onAddToCart,
  onRemoveFromCart,
  onUpdateCartQuantity,
}: MaterialCardCartControlProps) {
  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(item, 1);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic("light");
    onUpdateCartQuantity?.(item.id, (cartQuantity || 0) + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ((cartQuantity || 0) <= 1) {
      triggerHaptic("medium");
      onRemoveFromCart?.(item.id);
    } else {
      triggerHaptic("light");
      onUpdateCartQuantity?.(item.id, (cartQuantity || 0) - 1);
    }
  };

  const handleQuantityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val > 0) {
      onUpdateCartQuantity?.(item.id, val);
    }
  };

  if (isInCart) {
    return (
      <div
        className="inline-flex items-center bg-slate-900 text-white rounded-xl p-0.5 shadow-2xs border border-slate-800 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleDecrement}
          className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-400 hover:bg-white/10 transition cursor-pointer"
          title={cartQuantity <= 1 ? "Удалить из корзины" : "Уменьшить на 1"}
        >
          {cartQuantity <= 1 ? (
            <Trash2 className="w-3 h-3 text-rose-400" />
          ) : (
            <Minus className="w-3 h-3" />
          )}
        </button>

        <input
          type="number"
          min="1"
          max="99999"
          value={cartQuantity}
          onChange={handleQuantityInputChange}
          onClick={(e) => e.stopPropagation()}
          className="w-8 text-center bg-transparent text-white font-black text-xs outline-none py-0.5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          title="Введите количество"
        />

        <button
          type="button"
          onClick={handleIncrement}
          className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-400 hover:text-orange-400 hover:bg-white/10 transition cursor-pointer"
          title="Увеличить на 1"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
    );
  }

  if (!onAddToCart) return null;

  return (
    <button
      type="button"
      onClick={handleAddToCartClick}
      className="p-2 rounded-xl bg-orange-50 hover:bg-orange-500 hover:text-white text-orange-600 transition cursor-pointer shrink-0"
      title={pricingDict.table.tooltips.addToCart}
    >
      <ShoppingBag className="w-3.5 h-3.5" />
    </button>
  );
}
