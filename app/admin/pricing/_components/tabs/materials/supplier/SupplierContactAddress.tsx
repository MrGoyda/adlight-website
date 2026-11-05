"use client";

import React from "react";
import { MapPin, Copy, Check, ExternalLink } from "lucide-react";
import { pricingDict } from "@/dictionaries/pricing";

interface SupplierContactAddressProps {
  address: string | null;
  copied: boolean;
  onCopy: (text: string, fieldId: string, label: string) => void;
}

export default function SupplierContactAddress({
  address,
  copied,
  onCopy,
}: SupplierContactAddressProps) {
  const t = pricingDict.modals.supplierInfo;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-slate-500" />
          {t.addressLabel}
        </span>
        {address && (
          <button
            type="button"
            onClick={() => onCopy(address, "address", "Адрес")}
            className="text-slate-400 hover:text-slate-700 transition cursor-pointer"
            title="Копировать адрес"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        )}
      </div>

      {address ? (
        <div className="space-y-2 pt-1">
          <p className="text-xs font-bold text-slate-800 leading-snug">
            {address}
          </p>
          <div className="flex items-center gap-2 pt-0.5">
            <a
              href={`https://2gis.kz/search/${encodeURIComponent(address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-extrabold text-orange-600 hover:underline"
            >
              <span>{t.open2Gis}</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
            <span className="text-slate-300">•</span>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-extrabold text-slate-500 hover:underline"
            >
              <span>{t.openGoogle}</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      ) : (
        <p className="text-xs text-slate-400 italic">{t.noAddress}</p>
      )}
    </div>
  );
}
