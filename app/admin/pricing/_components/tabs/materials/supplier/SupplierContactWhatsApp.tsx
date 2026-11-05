"use client";

import React from "react";
import { Copy, Check } from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { getWhatsAppUrl } from "@/lib/phoneUtils";
import { pricingDict } from "@/dictionaries/pricing";

interface SupplierContactWhatsAppProps {
  whatsapp: string | null;
  copied: boolean;
  onCopy: (text: string, fieldId: string, label: string) => void;
}

export default function SupplierContactWhatsApp({
  whatsapp,
  copied,
  onCopy,
}: SupplierContactWhatsAppProps) {
  const t = pricingDict.modals.supplierInfo;
  const waUrl = whatsapp
    ? getWhatsAppUrl(
        whatsapp,
        "Здравствуйте! Обращаюсь от компании ADLight по поводу закупки материалов."
      )
    : "";

  return (
    <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-4 shadow-2xs space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
          <WhatsAppIcon className="w-3.5 h-3.5" />
          {t.whatsAppLabel}
        </span>
        {whatsapp && (
          <button
            type="button"
            onClick={() => onCopy(whatsapp, "whatsapp", "WhatsApp")}
            className="text-emerald-600 hover:text-emerald-900 transition cursor-pointer"
            title="Копировать номер WhatsApp"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-700" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        )}
      </div>

      {whatsapp ? (
        <div className="flex items-center justify-between gap-2 pt-1">
          <span className="text-sm font-black text-emerald-950 truncate">
            {whatsapp}
          </span>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <WhatsAppIcon className="w-3.5 h-3.5" />
            <span>{t.whatsAppButton}</span>
          </a>
        </div>
      ) : (
        <p className="text-xs text-slate-400 italic">{t.noWhatsApp}</p>
      )}
    </div>
  );
}
