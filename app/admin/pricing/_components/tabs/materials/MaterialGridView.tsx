"use client";

import React, { memo } from "react";
import { SupplierPriceItem } from "../../../_types/pricingTypes";
import MaterialGridCard from "./MaterialGridCard";

interface MaterialGridViewProps {
  items: SupplierPriceItem[];
  selectedItemId: string | null;
  onSelectItem: (item: SupplierPriceItem) => void;
  onOpenEditModal: (item: SupplierPriceItem) => void;
  onQuickUpdatePrice: (id: string, newPrice: number) => Promise<void>;
  onDeleteItem: (id: string) => Promise<void>;
  onOpenSupplierInfo?: (supplierName: string) => void;
  onAddToCart?: (item: SupplierPriceItem, quantity?: number) => void;
  onRemoveFromCart?: (id: string) => void;
  onUpdateCartQuantity?: (priceItemId: string, newQty: number) => void;
  onToggleFavorite?: (id: string, currentStatus?: boolean) => void;
  isItemInCart?: (priceItemId: string) => boolean;
  getItemQuantity?: (priceItemId: string) => number;
}

function MaterialGridView({
  items,
  selectedItemId,
  onSelectItem,
  onOpenEditModal,
  onQuickUpdatePrice,
  onDeleteItem,
  onOpenSupplierInfo,
  onAddToCart,
  onRemoveFromCart,
  onUpdateCartQuantity,
  onToggleFavorite,
  isItemInCart,
  getItemQuantity,
}: MaterialGridViewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {items.map((item) => (
        <MaterialGridCard
          key={item.id}
          item={item}
          isSelected={selectedItemId === item.id}
          onSelect={onSelectItem}
          onOpenEditModal={onOpenEditModal}
          onQuickUpdatePrice={onQuickUpdatePrice}
          onDeleteItem={onDeleteItem}
          onOpenSupplierInfo={onOpenSupplierInfo}
          onAddToCart={onAddToCart}
          onRemoveFromCart={onRemoveFromCart}
          onUpdateCartQuantity={onUpdateCartQuantity}
          onToggleFavorite={onToggleFavorite}
          isInCart={isItemInCart?.(item.id)}
          cartQuantity={getItemQuantity?.(item.id)}
        />
      ))}
    </div>
  );
}

export default memo(MaterialGridView);
