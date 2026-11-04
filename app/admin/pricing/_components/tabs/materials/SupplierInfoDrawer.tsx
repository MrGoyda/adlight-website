"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { SupplierData } from "../../../_types/pricingTypes";
import {
  X,
  Phone,
  MapPin,
  FileText,
  Copy,
  Check,
  Building2,
  ExternalLink,
  Layers,
  ArrowRight,
} from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { getCleanPhone, getWhatsAppUrl } from "@/lib/phoneUtils";
import { triggerHaptic } from "@/lib/haptics";
import { toast } from "@/lib/toast";

interface SupplierInfoDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  supplierName: string | null;
  suppliers: SupplierData[];
  onFilterBySupplier?: (supplierName: string) => void;
  catalogCount?: number;
}

// Известные контакты крупных поставщиков рекламных материалов РК (если в БД не заполнено)
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

  if (!mounted || !isOpen || !supplierName) return null;

  // Ищем поставщика в списке из БД
  const matchedSupplier = suppliers.find(
    (s) => s.name.trim().toLowerCase() === supplierName.trim().toLowerCase()
  );

  const defaults = KNOWN_SUPPLIER_DEFAULTS[supplierName.trim().toLowerCase()] || null;

  const phone = matchedSupplier?.phone || defaults?.phone || null;
  const whatsapp = matchedSupplier?.whatsapp || defaults?.whatsapp || phone;
  const address = matchedSupplier?.address || defaults?.address || null;
  const notes = matchedSupplier?.notes || defaults?.notes || null;

  const cleanPhone = phone ? getCleanPhone(phone) : "";
  const waUrl = whatsapp ? getWhatsAppUrl(whatsapp, "Здравствуйте! Обращаюсь от компании ADLight по поводу закупки материалов.") : "";

  const handleCopy = (text: string, fieldId: string, label: string) => {
    triggerHaptic("light");
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    toast.success(`${label} скопирован`);
    setTimeout(() => {
      setCopiedField((curr) => (curr === fieldId ? null : curr));
    }, 2000);
  };

  const handleSelectInCatalog = () => {
    triggerHaptic("medium");
    onFilterBySupplier?.(supplierName);
    onClose();
  };

  const drawerContent = (
    <div
      className="fixed inset-0 z-[9990] flex justify-end bg-black/40 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in"
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
                Карточка поставщика
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
                  {catalogCount > 0 ? `${catalogCount} товаров в каталоге` : "Товары в базе CRM"}
                </span>
                <span className="text-[10px] text-slate-400 font-bold block">
                  Актуальные цены и остатки на складе
                </span>
              </div>
            </div>

            {onFilterBySupplier && (
              <button
                type="button"
                onClick={handleSelectInCatalog}
                className="px-2.5 py-1.5 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-800 text-[11px] font-black transition cursor-pointer flex items-center gap-1 shrink-0"
              >
                <span>Фильтр</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Телефон для связи */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                Телефон для связи
              </span>
              {phone && (
                <button
                  type="button"
                  onClick={() => handleCopy(phone, "phone", "Телефон")}
                  className="text-slate-400 hover:text-slate-700 transition cursor-pointer"
                  title="Копировать номер"
                >
                  {copiedField === "phone" ? (
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
                  <span>Позвонить</span>
                </a>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Телефон не указан</p>
            )}
          </div>

          {/* WhatsApp чат */}
          <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-4 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <WhatsAppIcon className="w-3.5 h-3.5" />
                WhatsApp отдел продаж
              </span>
              {whatsapp && (
                <button
                  type="button"
                  onClick={() => handleCopy(whatsapp, "whatsapp", "WhatsApp")}
                  className="text-emerald-600 hover:text-emerald-900 transition cursor-pointer"
                  title="Копировать номер WhatsApp"
                >
                  {copiedField === "whatsapp" ? (
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
                  <span>Написать в WhatsApp</span>
                </a>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">WhatsApp не указан</p>
            )}
          </div>

          {/* Адрес склада / офиса */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                Адрес склада / Самовывоз
              </span>
              {address && (
                <button
                  type="button"
                  onClick={() => handleCopy(address, "address", "Адрес")}
                  className="text-slate-400 hover:text-slate-700 transition cursor-pointer"
                  title="Копировать адрес"
                >
                  {copiedField === "address" ? (
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
                    <span>Открыть в 2GIS</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                  <span className="text-slate-300">•</span>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-extrabold text-slate-500 hover:underline"
                  >
                    <span>Google Карты</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Адрес не заполнен</p>
            )}
          </div>

          {/* Примечание и график */}
          {notes && (
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                Условия и примечание
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
                phone ? `Тел: ${phone}` : "",
                whatsapp ? `WhatsApp: ${whatsapp}` : "",
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
                <span>Скопировано!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Скопировать контакты</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition cursor-pointer"
          >
            Готово
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(drawerContent, document.body);
}
