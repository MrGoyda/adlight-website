"use client";

import React from "react";
import { Phone, Copy, Check } from "lucide-react";
import { getCleanPhone } from "@/lib/phoneUtils";
import { pricingDict } from "@/dictionaries/pricing";

interface SupplierContactPhoneProps {
  phone: string | null;
  copied: boolean;
  onCopy: (text: string, fieldId: string, label: string) => void;
}

export default function SupplierContactPhone({
  phone,
  copied,
  onCopy,
}: SupplierContactPhoneProps) {
  const t = pricingDict.modals.supplierInfo;
  const cleanPhone = phone ? getCleanPhone(phone) : "";

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5 text-slate-500" />
          {t.phoneLabel}
        </span>
        {phone && (
          <button
            type="button"
            onClick={() => onCopy(phone, "phone", "Телефон")}
            className="text-slate-400 hover:text-slate-700 transition cursor-pointer"
            title="Копировать номер"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        )}
      </div>

      {phone ? (
        <div className="flex items-center justify-between gap-2 pt-1">
          <a
            href={`tel:${cleanPhone}`}
            className="text-base font-black text-slate-900 hover:text-orange-600 transition"
          >
            {phone}
          </a>
          <a
            href={`tel:${cleanPhone}`}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Phone className="w-3 h-3" />
            <span>{t.callButton}</span>
          </a>
        </div>
      ) : (
        <p className="text-xs text-slate-400 italic">{t.noPhone}</p>
      )}
    </div>
  );
}
