"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";
import { MaterialCartItem } from "../../../../_hooks/useMaterialCart";
import { triggerHaptic } from "@/lib/haptics";
import { toast } from "@/lib/toast";
import { pricingDict } from "@/dictionaries/pricing";

interface CartDrawerFooterProps {
  groupedBySupplier: Array<{
    supplierName: string;
    items: MaterialCartItem[];
    subtotal: number;
    positionsCount: number;
  }>;
  totalSum: number;
  uniquePositionsCount: number;
  totalQuantity: number;
  onClose: () => void;
}

export default function CartDrawerFooter({
  groupedBySupplier,
  totalSum,
  uniquePositionsCount,
  totalQuantity,
  onClose,
}: CartDrawerFooterProps) {
  const [copiedAll, setCopiedAll] = useState(false);
  const t = pricingDict.modals.cart;

  const handleCopyFullReport = () => {
    triggerHaptic("medium");
    const lines = [
      `СВОДНАЯ ВЕДОМОСТЬ ЗАКУПКИ МАТЕРИАЛОВ — ADLight`,
      `Дата: ${new Date().toLocaleDateString("ru-RU")}`,
      `Всего позиций: ${uniquePositionsCount} (${totalQuantity} ед.)`,
      `═════════════════════════════════════════════════`,
      ``,
    ];

    groupedBySupplier.forEach((group, gIdx) => {
      lines.push(`ПОСТАВЩИК ${gIdx + 1}: ${group.supplierName.toUpperCase()}`);
      lines.push(`-------------------------------------------------`);
      group.items.forEach((it, idx) => {
        lines.push(`  ${idx + 1}. ${it.name} — ${it.quantity} ${it.unitShort}`);
      });
      lines.push(``);
    });

    lines.push(`═════════════════════════════════════════════════`);
    lines.push(`Ожидаем подтверждения наличия и счетов на оплату.`);

    navigator.clipboard.writeText(lines.join("\n"));
    setCopiedAll(true);
    toast.success(t.copiedFullReport);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="p-4 sm:p-5 border-t border-slate-200/90 bg-white shrink-0 space-y-3.5 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
            {t.fullReportTitle}
          </span>
          <span className="text-xs text-slate-500 font-semibold">
            {t.suppliersCount(groupedBySupplier.length, uniquePositionsCount, totalQuantity)}
          </span>
        </div>
        <div className="text-right">
          <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight block">
            {Number(totalSum).toLocaleString("ru-RU")} ₸
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleCopyFullReport}
          className="flex-1 py-3 px-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-black transition cursor-pointer flex items-center justify-center gap-2"
        >
          {copiedAll ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{t.copiedFullReport}</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-slate-500" />
              <span>{t.copyFullReport}</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onClose}
          className="py-3 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition cursor-pointer shrink-0"
        >
          {t.closeButton}
        </button>
      </div>
    </div>
  );
}
