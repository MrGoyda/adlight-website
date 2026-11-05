"use client";

import React from "react";
import Image from "next/image";
import { Package, Plus, Minus, X } from "lucide-react";
import { MaterialCartItem } from "../../../../_hooks/useMaterialCart";

interface CartItemRowProps {
  item: MaterialCartItem;
  onUpdateQuantity: (priceItemId: string, newQty: number) => void;
  onRemoveItem: (priceItemId: string) => void;
}

export default function CartItemRow({
  item,
  onUpdateQuantity,
  onRemoveItem,
}: CartItemRowProps) {
  const lineSum = item.price * item.quantity;

  return (
    <div className="p-3.5 flex items-center gap-3 hover:bg-slate-50/60 transition-colors">
      {/* Фото товара */}
      <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200/80 overflow-hidden shrink-0 flex items-center justify-center">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            width={48}
            height={48}
            unoptimized
            className="w-full h-full object-cover"
          />
        ) : (
          <Package className="w-5 h-5 text-slate-400" />
        )}
      </div>

      {/* Наименование и цена */}
      <div className="flex-1 min-w-0">
        <h5 className="text-xs font-black text-slate-900 leading-snug line-clamp-2">
          {item.name}
        </h5>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] font-bold text-slate-500">
            {Number(item.price).toLocaleString("ru-RU")} ₸ / {item.unitShort}
          </span>
          {item.subcategory && (
            <span className="text-[9px] font-extrabold text-orange-600 bg-orange-50 px-1.5 py-0.2 rounded-md truncate max-w-[120px]">
              {item.subcategory}
            </span>
          )}
        </div>
      </div>

      {/* Степпер количества */}
      <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl border border-slate-200/80 shrink-0">
        <button
          type="button"
          onClick={() => onUpdateQuantity(item.priceItemId, item.quantity - 1)}
          className="w-6 h-6 rounded-lg bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer shadow-2xs"
          title="Уменьшить"
        >
          <Minus className="w-3 h-3" />
        </button>
        <input
          type="number"
          min="1"
          value={item.quantity}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            if (!isNaN(val) && val > 0) {
              onUpdateQuantity(item.priceItemId, val);
            }
          }}
          className="w-8 text-center bg-transparent text-xs font-black text-slate-900 outline-none"
        />
        <button
          type="button"
          onClick={() => onUpdateQuantity(item.priceItemId, item.quantity + 1)}
          className="w-6 h-6 rounded-lg bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer shadow-2xs"
          title="Увеличить"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>

      {/* Сумма по строке */}
      <div className="text-right shrink-0 min-w-[70px]">
        <span className="text-xs font-black text-slate-900 block">
          {Number(lineSum).toLocaleString("ru-RU")} ₸
        </span>
        <span className="text-[9px] text-slate-400 font-bold block">
          {item.quantity} {item.unitShort}
        </span>
      </div>

      {/* Удалить позицию */}
      <button
        type="button"
        onClick={() => onRemoveItem(item.priceItemId)}
        className="p-1.5 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer shrink-0"
        title="Удалить из корзины"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
