"use client";

import React from "react";
import { SupplierPriceItem } from "../../../_types/pricingTypes";
import MaterialGridCard from "./MaterialGridCard";

interface MaterialGridViewProps {
  items: SupplierPriceItem[];
  selectedItemId: string | null;
  onSelectItem: (item: SupplierPriceItem) => void;
  onOpenEditModal: (item: SupplierPriceItem) => void;
  onQuickUpdatePrice: (id: string, newPrice: number) => Promise<void>;
  onDeleteItem: (id: string) => Promise<void>;
}

export default function MaterialGridView({
  items,
  selectedItemId,
  onSelectItem,
  onOpenEditModal,
  onQuickUpdatePrice,
  onDeleteItem,
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
        />
      ))}
    </div>
  );
}
