"use client";

import React, { useState } from "react";
import { Copy, Check, ArrowRight } from "lucide-react";
import { SupplierPriceItem } from "../../../../_types/pricingTypes";
import { triggerHaptic } from "@/lib/haptics";
import { toast } from "@/lib/toast";
import { pricingDict } from "@/dictionaries/pricing";

interface InspectorMetaSectionProps {
  item: SupplierPriceItem;
  onOpenSupplierInfo?: (supplierName: string) => void;
}

export default function InspectorMetaSection({
  item,
  onOpenSupplierInfo,
}: InspectorMetaSectionProps) {
  const [copied, setCopied] = useState(false);
  const t = pricingDict.modals.inspector;

  const handleCopyName = () => {
    triggerHaptic("light");
    navigator.clipboard.writeText(item.name);
    setCopied(true);
    toast.success(t.copiedNotice);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Название и быстрое копирование */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
            {t.nameLabel}
          </span>
          <button
            type="button"
            onClick={handleCopyName}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-slate-900 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-500" />
                <span className="text-emerald-600 font-black">{t.copiedButton}</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>{t.copyButton}</span>
              </>
            )}
          </button>
        </div>
        <div className="text-sm font-black text-slate-900 leading-snug bg-slate-50/60 p-3 rounded-2xl border border-slate-200/60">
          {item.name}
        </div>
      </div>

      {/* Классификация и Поставщик */}
      <div className="space-y-2 pt-1 border-t border-slate-100">
        <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
          {t.classificationSection}
        </span>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-[10px] font-bold text-slate-400 block">
              {t.categoryLabel}
            </span>
            <span className="font-extrabold text-slate-800 truncate block mt-0.5">
              {item.category || "—"}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-[10px] font-bold text-slate-400 block">
              {t.subcategoryLabel}
            </span>
            <span className="font-extrabold text-slate-800 truncate block mt-0.5">
              {item.subcategory || "—"}
            </span>
          </div>

          {/* Поставщик (кликабельный с переходом к карточке) */}
          <button
            type="button"
            onClick={() => onOpenSupplierInfo?.(item.supplier)}
            className="col-span-2 p-3 rounded-xl bg-slate-50 hover:bg-orange-50 border border-slate-200/60 hover:border-orange-200 text-left transition cursor-pointer group flex items-center justify-between"
          >
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-slate-400 block">
                {t.supplierLabel}
              </span>
              <span className="font-black text-slate-900 group-hover:text-orange-600 truncate block mt-0.5">
                {item.supplier}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-extrabold text-orange-600 shrink-0">
              <span>{t.contactsButton}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      </div>

      {/* Описание позиции */}
      {item.description && (
        <div className="space-y-1.5 pt-1 border-t border-slate-100">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
            {t.descriptionSection}
          </span>
          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/60 p-3 rounded-2xl border border-slate-200/60">
            {item.description}
          </p>
        </div>
      )}
    </div>
  );
}
