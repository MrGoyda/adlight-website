"use client";

import React, { useState } from "react";
import { ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import { SupplierPriceItem } from "../../../../_types/pricingTypes";
import { INVENTORY_UNITS } from "../../../../_data/pricingDictionary";
import { triggerHaptic } from "@/lib/haptics";
import { pricingDict } from "@/dictionaries/pricing";

interface InspectorCartSectionProps {
  item: SupplierPriceItem;
  isInCart: boolean;
  cartQuantity: number;
  onAddToCart?: (item: SupplierPriceItem, quantity?: number) => void;
  onRemoveFromCart?: (id: string) => void;
  onUpdateCartQuantity?: (priceItemId: string, newQty: number) => void;
}

export default function InspectorCartSection({
  item,
  isInCart,
  cartQuantity,
  onAddToCart,
  onRemoveFromCart,
  onUpdateCartQuantity,
}: InspectorCartSectionProps) {
  const [quantityToAdd, setQuantityToAdd] = useState(1);
  const t = pricingDict.modals.inspector;
  const unitShort = INVENTORY_UNITS[item.unit]?.short || "ед.";

  if (!onAddToCart) return null;

  const handleAddToCart = () => {
    onAddToCart(item, quantityToAdd);
  };

  const handleRemoveFromCart = () => {
    triggerHaptic("medium");
    onRemoveFromCart?.(item.id);
  };

  const handleDirectCartQtyChange = (newVal: number) => {
    if (newVal <= 0) {
      handleRemoveFromCart();
    } else {
      triggerHaptic("light");
      onUpdateCartQuantity?.(item.id, newVal);
    }
  };

  return (
    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
          {t.supplySection}
        </span>
        {isInCart && (
          <span className="text-[11px] font-extrabold text-orange-600 bg-orange-100/80 px-2 py-0.5 rounded-md">
            {t.inCartStatus(cartQuantity, unitShort)}
          </span>
        )}
      </div>

      {isInCart ? (
        <div className="flex items-center gap-2">
          {/* Прямой степпер текущего количества в корзине */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shrink-0">
            <button
              type="button"
              onClick={() => handleDirectCartQtyChange(cartQuantity - 1)}
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer"
              title={cartQuantity <= 1 ? t.removeFromCartButton : "Уменьшить на 1"}
            >
              {cartQuantity <= 1 ? (
                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
              ) : (
                <Minus className="w-3.5 h-3.5" />
              )}
            </button>
            <input
              type="number"
              min="1"
              max="99999"
              value={cartQuantity}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val) && val > 0) handleDirectCartQtyChange(val);
              }}
              className="w-12 text-center font-black text-sm text-slate-900 outline-none"
              title="Количество в корзине"
            />
            <button
              type="button"
              onClick={() => handleDirectCartQtyChange(cartQuantity + 1)}
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer"
              title="Увеличить на 1"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Кнопка полного удаления из корзины */}
          {onRemoveFromCart && (
            <button
              type="button"
              onClick={handleRemoveFromCart}
              className="flex-1 py-2.5 px-3 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 font-extrabold text-xs transition cursor-pointer flex items-center justify-center gap-2 active:scale-95"
              title={t.removeFromCartTooltip}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.removeFromCartButton}</span>
            </button>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {/* Степпер количества для добавления */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shrink-0">
            <button
              type="button"
              onClick={() => setQuantityToAdd((q) => Math.max(1, q - 1))}
              className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer"
              title="Уменьшить"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <input
              type="number"
              min="1"
              value={quantityToAdd}
              onChange={(e) =>
                setQuantityToAdd(Math.max(1, parseInt(e.target.value, 10) || 1))
              }
              className="w-10 text-center font-black text-xs text-slate-900 outline-none"
            />
            <button
              type="button"
              onClick={() => setQuantityToAdd((q) => q + 1)}
              className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer"
              title="Увеличить"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Кнопка добавления в корзину */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-black transition cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-orange-600/20 active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{t.addToCartWithQty(quantityToAdd, unitShort)}</span>
          </button>
        </div>
      )}
    </div>
  );
}
