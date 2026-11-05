"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { SupplierData } from "../../../_types/pricingTypes";
import { X, FileText, Copy, Check, Layers, ArrowRight } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { toast } from "@/lib/toast";
import { pricingDict } from "@/dictionaries/pricing";

import SupplierContactPhone from "./supplier/SupplierContactPhone";
import SupplierContactWhatsApp from "./supplier/SupplierContactWhatsApp";
import SupplierContactAddress from "./supplier/SupplierContactAddress";
import SupplierContactSocial from "./supplier/SupplierContactSocial";

interface SupplierInfoDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  supplierName: string | null;
  suppliers: SupplierData[];
  onFilterBySupplier?: (supplierName: string) => void;
  catalogCount?: number;
}

const KNOWN_SUPPLIER_DEFAULTS: Record<
  string,
  { phone: string; whatsapp: string; address: string; notes: string }
> = {
  signtech: {
    phone: "+7 (771) 744-99-00",
    whatsapp: "+7 (771) 744-99-00",
    address: "г. Алматы, пр. Рыскулова 72",
    notes:
      "Крупный склад рекламных материалов в Алматы: листовой ПВХ, акрил, оргстекло, АКП, светотехника, блоки питания и неон. График: Пн–Пт с 09:00 до 18:00.",
  },
  сайнтек: {
    phone: "+7 (771) 744-99-00",
    whatsapp: "+7 (771) 744-99-00",
    address: "г. Алматы, пр. Рыскулова 72",
    notes: "Склад и офис SignTech. Пн–Пт 09:00–18:00.",
  },
};

export default function SupplierInfoDrawer({
  isOpen,
  onClose,
  supplierName,
  suppliers,
  onFilterBySupplier,
  catalogCount = 0,
}: SupplierInfoDrawerProps) {
  const [mounted, setMounted] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const t = pricingDict.modals.supplierInfo;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Закрытие по клавише Esc
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!mounted || !isOpen || !supplierName || typeof document === "undefined") return null;

  const matchedSupplier = suppliers.find(
    (s) => s.name.trim().toLowerCase() === supplierName.trim().toLowerCase()
  );
  const defaults = KNOWN_SUPPLIER_DEFAULTS[supplierName.trim().toLowerCase()] || null;

  const phone = matchedSupplier?.phone || defaults?.phone || null;
  const phones =
    matchedSupplier?.phones && matchedSupplier.phones.length > 0
      ? matchedSupplier.phones
      : phone
      ? [phone]
      : [];
  const whatsapp = matchedSupplier?.whatsapp || defaults?.whatsapp || phone;
  const website = matchedSupplier?.website || null;
  const instagram = matchedSupplier?.instagram || null;
  const address = matchedSupplier?.address || defaults?.address || null;
  const notes = matchedSupplier?.notes || defaults?.notes || null;

  const handleCopy = (text: string, fieldId: string, label: string) => {
    triggerHaptic("light");
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    toast.success(t.copiedToast(label));
    setTimeout(() => {
      setCopiedField((curr) => (curr === fieldId ? null : curr));
    }, 2000);
  };

  const handleSelectInCatalog = () => {
    triggerHaptic("medium");
    onFilterBySupplier?.(supplierName);
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9990] flex justify-end bg-black/50 transition-opacity duration-200 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden border-l border-slate-200 animate-in slide-in-from-right duration-250 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Шапка карточки поставщика */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-3 bg-white shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-black text-lg shrink-0 shadow-sm shadow-orange-500/20">
              {supplierName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 block">
                {t.badge}
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 truncate">
                {supplierName}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition cursor-pointer"
            title="Закрыть (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Тело с контактами и данными */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {/* Информационный бейдж каталога */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-slate-700 shrink-0">
                <Layers className="w-4 h-4 text-orange-500" />
              </div>
              <div>
                <span className="text-xs font-black text-slate-900 block">
                  {t.catalogCountBadge(catalogCount)}
                </span>
                <span className="text-[10px] text-slate-400 font-bold block">
                  {t.catalogSubtitle}
                </span>
              </div>
            </div>

            {onFilterBySupplier && (
              <button
                type="button"
                onClick={handleSelectInCatalog}
                className="px-2.5 py-1.5 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-800 text-[11px] font-black transition cursor-pointer flex items-center gap-1 shrink-0"
              >
                <span>{t.filterButton}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Телефоны для связи */}
          <SupplierContactPhone
            phones={phones}
            copiedField={copiedField}
            onCopy={handleCopy}
          />

          {/* WhatsApp чат */}
          <SupplierContactWhatsApp
            whatsapp={whatsapp}
            copied={copiedField === "whatsapp"}
            onCopy={handleCopy}
          />

          {/* Соцсети: Сайт и Инстаграм */}
          <SupplierContactSocial
            website={website}
            instagram={instagram}
          />

          {/* Адрес склада / офиса */}
          <SupplierContactAddress
            address={address}
            copied={copiedField === "address"}
            onCopy={handleCopy}
          />

          {/* Примечание и график */}
          {notes && (
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                {t.notesLabel}
              </span>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {notes}
              </p>
            </div>
          )}
        </div>

        {/* 3. Подвал карточки */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between gap-3 bg-white shrink-0">
          <button
            type="button"
            onClick={() => {
              const fullText = [
                `Поставщик: ${supplierName}`,
                phones.length > 0 ? `Тел: ${phones.join(", ")}` : "",
                whatsapp ? `WhatsApp: ${whatsapp}` : "",
                website ? `Сайт: ${website}` : "",
                instagram ? `Instagram: ${instagram}` : "",
                address ? `Адрес: ${address}` : "",
                notes ? `Примечание: ${notes}` : "",
              ]
                .filter(Boolean)
                .join("\n");
              handleCopy(fullText, "all", "Все контакты");
            }}
            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-black transition cursor-pointer flex items-center gap-1.5"
          >
            {copiedField === "all" ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t.copiedAllContacts}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{t.copyAllContacts}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition cursor-pointer"
          >
            {t.doneButton}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
