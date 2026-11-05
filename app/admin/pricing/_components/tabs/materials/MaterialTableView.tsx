"use client";

import React, { memo } from "react";
import { SupplierPriceItem } from "../../../_types/pricingTypes";
import MaterialTableRow from "./MaterialTableRow";
import { pricingDict } from "@/dictionaries/pricing";

interface MaterialTableViewProps {
  items: SupplierPriceItem[];
  selectedItemId: string | null;
  onSelectItem: (item: SupplierPriceItem) => void;
  onOpenEditModal: (item: SupplierPriceItem) => void;
  onQuickUpdatePrice: (id: string, newPrice: number) => Promise<void>;
  onDeleteItem: (id: string) => Promise<void>;
  onOpenSupplierInfo?: (supplierName: string) => void;
  onAddToCart?: (item: SupplierPriceItem) => void;
  onRemoveFromCart?: (id: string) => void;
  isItemInCart?: (priceItemId: string) => boolean;
  getItemQuantity?: (priceItemId: string) => number;
}

function MaterialTableView({
  items,
  selectedItemId,
  onSelectItem,
  onOpenEditModal,
  onQuickUpdatePrice,
  onDeleteItem,
  onOpenSupplierInfo,
  onAddToCart,
  onRemoveFromCart,
  isItemInCart,
  getItemQuantity,
}: MaterialTableViewProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Шапка колонок таблицы */}
      <div className="hidden md:grid md:grid-cols-12 md:gap-4 px-5 py-3 bg-slate-50/90 border-b border-slate-200/80 text-[11px] font-black text-slate-400 uppercase tracking-wider">
        <div className="col-span-5">{pricingDict.table.columns.item}</div>
        <div className="col-span-2">{pricingDict.table.columns.subcategory}</div>
        <div className="col-span-2">{pricingDict.table.columns.supplier}</div>
        <div className="col-span-2 text-right">{pricingDict.table.columns.costPrice}</div>
        <div className="col-span-1 text-right">{pricingDict.table.columns.actions}</div>
      </div>

      {/* Список строк */}
      <div className="divide-y divide-slate-100">
        {items.map((item) => (
          <MaterialTableRow
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
            isInCart={isItemInCart?.(item.id)}
            cartQuantity={getItemQuantity?.(item.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default memo(MaterialTableView);
