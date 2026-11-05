"use client";

import React, { useState, memo } from "react";
import { SupplierPriceItem } from "../../../_types/pricingTypes";
import { INVENTORY_UNITS } from "../../../_data/pricingDictionary";
import { Edit2 } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { pricingDict } from "@/dictionaries/pricing";

import MaterialCardMedia from "./grid/MaterialCardMedia";
import MaterialCardQuickPrice from "./grid/MaterialCardQuickPrice";
import MaterialCardCartControl from "./grid/MaterialCardCartControl";

interface MaterialGridCardProps {
  item: SupplierPriceItem;
  isSelected: boolean;
  onSelect: (item: SupplierPriceItem) => void;
  onOpenEditModal: (item: SupplierPriceItem) => void;
  onQuickUpdatePrice: (id: string, newPrice: number) => Promise<void>;
  onDeleteItem: (id: string) => Promise<void>;
  onOpenSupplierInfo?: (supplierName: string) => void;
  onAddToCart?: (item: SupplierPriceItem, quantity?: number) => void;
  onRemoveFromCart?: (id: string) => void;
  onUpdateCartQuantity?: (priceItemId: string, newQty: number) => void;
  onToggleFavorite?: (id: string, currentStatus?: boolean) => void;
  isInCart?: boolean;
  cartQuantity?: number;
}

function MaterialGridCard({
  item,
  isSelected,
  onSelect,
  onOpenEditModal,
  onQuickUpdatePrice,
  onOpenSupplierInfo,
  onAddToCart,
  onRemoveFromCart,
  onUpdateCartQuantity,
  onToggleFavorite,
  isInCart = false,
  cartQuantity = 0,
}: MaterialGridCardProps) {
  const [isInline, setIsInline] = useState(false);
  const unitShort = INVENTORY_UNITS[item.unit]?.short || "ед.";

  const handleSupplierClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic("light");
    onOpenSupplierInfo?.(item.supplier);
  };

  return (
    <div
      onClick={() => {
        triggerHaptic("light");
        onSelect(item);
      }}
      style={{ contentVisibility: "auto", containIntrinsicSize: "0 310px" }}
      className={`group relative bg-white rounded-3xl border transition-colors duration-150 cursor-pointer flex flex-col overflow-hidden text-left ${
        isSelected
          ? "border-orange-500 ring-2 ring-orange-500/20 shadow-md"
          : "border-slate-200/80 hover:border-slate-300 hover:shadow-md"
      }`}
    >
      {/* Медиа превью с бейджами и кнопкой избранного */}
      <MaterialCardMedia
        item={item}
        onSupplierClick={handleSupplierClick}
        onToggleFavorite={onToggleFavorite}
      />

      {/* Текстовая информация */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
        <div className="space-y-1">
          {item.subcategory && (
            <span className="text-[10px] font-extrabold text-orange-600 truncate block">
              {item.subcategory}
            </span>
          )}

          <h3 className="text-xs sm:text-sm font-black text-slate-900 leading-snug line-clamp-2">
            {item.name}
          </h3>
        </div>

        {/* Цена и действия */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <MaterialCardQuickPrice
            itemId={item.id}
            price={item.price}
            unitShort={unitShort}
            onQuickUpdatePrice={onQuickUpdatePrice}
            isInline={isInline}
            setIsInline={setIsInline}
          />

          {!isInline && (
            <div
              className="flex items-center gap-1.5 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <MaterialCardCartControl
                item={item}
                isInCart={isInCart}
                cartQuantity={cartQuantity}
                onAddToCart={onAddToCart}
                onRemoveFromCart={onRemoveFromCart}
                onUpdateCartQuantity={onUpdateCartQuantity}
              />

              <button
                type="button"
                onClick={() => onOpenEditModal(item)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer shrink-0"
                title={pricingDict.table.tooltips.edit}
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(MaterialGridCard);
