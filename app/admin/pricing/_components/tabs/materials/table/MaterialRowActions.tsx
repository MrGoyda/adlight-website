"use client";

import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import { pricingDict } from "@/dictionaries/pricing";
import { SupplierPriceItem } from "../../../../_types/pricingTypes";

interface MaterialRowActionsProps {
  item: SupplierPriceItem;
  onOpenEditModal: (item: SupplierPriceItem) => void;
  onDeleteItem: (id: string) => Promise<void>;
}

export default function MaterialRowActions({
  item,
  onOpenEditModal,
  onDeleteItem,
}: MaterialRowActionsProps) {
  return (
    <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => onOpenEditModal(item)}
        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
        title={pricingDict.table.tooltips.edit}
      >
        <Edit2 className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={() => onDeleteItem(item.id)}
        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
        title={pricingDict.table.tooltips.delete}
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
