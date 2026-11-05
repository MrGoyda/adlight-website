"use client";

import React, { useState } from "react";
import { ArrowRight, Check, Copy } from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { MaterialCartItem } from "../../../../_hooks/useMaterialCart";
import { SupplierData } from "../../../../_types/pricingTypes";
import { getWhatsAppUrl } from "@/lib/phoneUtils";
import { triggerHaptic } from "@/lib/haptics";
import { toast } from "@/lib/toast";
import { pricingDict } from "@/dictionaries/pricing";
import CartItemRow from "./CartItemRow";

const KNOWN_SUPPLIER_PHONES: Record<string, string> = {
  signtech: "+7 (771) 744-99-00",
  сайнтек: "+7 (771) 744-99-00",
};

interface CartSupplierGroupProps {
  group: {
    supplierName: string;
    items: MaterialCartItem[];
    subtotal: number;
    positionsCount: number;
  };
  suppliers: SupplierData[];
  onUpdateQuantity: (priceItemId: string, newQty: number) => void;
  onRemoveItem: (priceItemId: string) => void;
  onOpenSupplierInfo?: (supplierName: string) => void;
}

export default function CartSupplierGroup({
  group,
  suppliers,
  onUpdateQuantity,
  onRemoveItem,
  onOpenSupplierInfo,
}: CartSupplierGroupProps) {
  const [copied, setCopied] = useState(false);
  const t = pricingDict.modals.cart;

  const supObj = suppliers.find(
    (s) => s.name.trim().toLowerCase() === group.supplierName.trim().toLowerCase()
  );

  const generateSupplierOrderText = () => {
    const lines = [
      `Здравствуйте! Заявка на закупку от компании ADLight:`,
      ``,
      `Позиции:`,
    ];
    group.items.forEach((it, idx) => {
      lines.push(`${idx + 1}. ${it.name} — ${it.quantity} ${it.unitShort}`);
    });
    lines.push(``);
    lines.push(`Всего позиций: ${group.items.length}`);
    lines.push(``);
    lines.push(`Подскажите, пожалуйста, по наличию на складе и актуальной стоимости (выставите счет / реквизиты на оплату).`);
    return lines.join("\n");
  };

  const handleCopySupplierOrder = () => {
    triggerHaptic("light");
    const text = generateSupplierOrderText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success(`Список товаров для «${group.supplierName}» скопирован`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendWhatsApp = () => {
    triggerHaptic("medium");
    const rawPhone =
      supObj?.whatsapp ||
      supObj?.phone ||
      KNOWN_SUPPLIER_PHONES[group.supplierName.trim().toLowerCase()] ||
      "";
    const text = generateSupplierOrderText();

    if (!rawPhone) {
      navigator.clipboard.writeText(text);
      toast.info(
        `Номер WhatsApp поставщика ${group.supplierName} не указан. Список скопирован в буфер обмена!`
      );
      return;
    }

    const waUrl = getWhatsAppUrl(rawPhone, text);
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all hover:border-slate-300">
      {/* Заголовок группы поставщика */}
      <div className="p-4 bg-slate-50/80 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center font-black text-sm shrink-0">
            {group.supplierName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => onOpenSupplierInfo?.(group.supplierName)}
                className="text-sm font-black text-slate-900 hover:text-orange-600 transition truncate text-left cursor-pointer flex items-center gap-1"
                title="Открыть контакты поставщика"
              >
                <span>{group.supplierName}</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </button>
              <span className="text-[10px] font-extrabold text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-200/70">
                {t.positionsBadge(group.positionsCount)}
              </span>
            </div>
            {supObj?.address && (
              <span className="text-[10px] text-slate-400 font-medium truncate block">
                {supObj.address}
              </span>
            )}
          </div>
        </div>

        {/* Быстрые действия по поставщику */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <button
            type="button"
            onClick={handleCopySupplierOrder}
            className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 text-[11px] font-bold transition cursor-pointer flex items-center gap-1"
            title="Скопировать список материалов"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-black">{t.supplierActionCopied}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{t.supplierActionCopyText}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleSendWhatsApp}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black transition cursor-pointer flex items-center gap-1.5 shadow-xs active:scale-95"
            title="Отправить заявку со списком материалов в WhatsApp"
          >
            <WhatsAppIcon className="w-3.5 h-3.5" />
            <span>{t.supplierActionWhatsApp}</span>
          </button>
        </div>
      </div>

      {/* Список товаров этой группы */}
      <div className="divide-y divide-slate-100">
        {group.items.map((it) => (
          <CartItemRow
            key={it.priceItemId}
            item={it}
            onUpdateQuantity={onUpdateQuantity}
            onRemoveItem={onRemoveItem}
          />
        ))}
      </div>

      {/* Итог по поставщику */}
      <div className="p-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600">
        <span className="text-[11px] text-slate-400">
          {t.supplierPositionsCount(group.items.length)}
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-500">
            {t.supplierSubtotal(group.supplierName)}
          </span>
          <span className="font-black text-slate-900 text-sm">
            {Number(group.subtotal).toLocaleString("ru-RU")} ₸
          </span>
        </div>
      </div>
    </div>
  );
}
