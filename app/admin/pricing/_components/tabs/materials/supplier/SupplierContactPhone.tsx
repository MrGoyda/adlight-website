"use client";

import React from "react";
import { Phone, Copy, Check } from "lucide-react";
import { getCleanPhone } from "@/lib/phoneUtils";
import { pricingDict } from "@/dictionaries/pricing";

interface SupplierContactPhoneProps {
  phone?: string | null;
  phones?: string[];
  copiedField: string | null;
  onCopy: (text: string, fieldId: string, label: string) => void;
}

export default function SupplierContactPhone({
  phone,
  phones,
  copiedField,
  onCopy,
}: SupplierContactPhoneProps) {
  const t = pricingDict.modals.supplierInfo;

  const phoneList =
    phones && phones.length > 0
      ? phones.filter(Boolean)
      : phone
      ? [phone]
      : [];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5 text-slate-500" />
          {t.phoneLabel}
          {phoneList.length > 1 && (
            <span className="text-[10px] font-extrabold text-slate-400">
              ({phoneList.length})
            </span>
          )}
        </span>
      </div>

      {phoneList.length > 0 ? (
        <div className="space-y-2 pt-0.5 divide-y divide-slate-100">
          {phoneList.map((num, idx) => {
            const cleanPhone = getCleanPhone(num);
            const fieldId = `phone_${idx}`;
            const isCopied = copiedField === fieldId;

            return (
              <div
                key={idx}
                className={`flex items-center justify-between gap-2 ${
                  idx > 0 ? "pt-2" : ""
                }`}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <a
                    href={`tel:${cleanPhone}`}
                    className="text-sm sm:text-base font-black text-slate-900 hover:text-orange-600 transition truncate"
                  >
                    {num}
                  </a>
                  <button
                    type="button"
                    onClick={() => onCopy(num, fieldId, `Телефон ${idx + 1}`)}
                    className="p-1 text-slate-400 hover:text-slate-700 transition cursor-pointer shrink-0"
                    title="Копировать номер"
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <a
                  href={`tel:${cleanPhone}`}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 active:scale-95"
                >
                  <Phone className="w-3 h-3" />
                  <span>{t.callButton}</span>
                </a>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-xs text-slate-400 italic">{t.noPhone}</p>
      )}
    </div>
  );
}
