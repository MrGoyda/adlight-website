"use client";

import React from "react";
import { SupplierPriceItem } from "../../../_types/pricingTypes";
import MaterialTableRow from "./MaterialTableRow";

interface MaterialTableViewProps {
  items: SupplierPriceItem[];
  selectedItemId: string | null;
  onSelectItem: (item: SupplierPriceItem) => void;
  onOpenEditModal: (item: SupplierPriceItem) => void;
  onQuickUpdatePrice: (id: string, newPrice: number) => Promise<void>;
  onDeleteItem: (id: string) => Promise<void>;
}

export default function MaterialTableView({
  items,
  selectedItemId,
  onSelectItem,
  onOpenEditModal,
  onQuickUpdatePrice,
  onDeleteItem,
}: MaterialTableViewProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Шапка колонок таблицы */}
      <div className="hidden md:grid md:grid-cols-12 md:gap-4 px-5 py-3 bg-slate-50/90 border-b border-slate-200/80 text-[11px] font-black text-slate-400 uppercase tracking-wider">
        <div className="col-span-5">Материал / Услуга</div>
        <div className="col-span-2">Подкатегория</div>
        <div className="col-span-2">Поставщик</div>
        <div className="col-span-2 text-right">Себестоимость</div>
        <div className="col-span-1 text-center">Действия</div>
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
          />
        ))}
      </div>
    </div>
  );
}
