"use client";

import React from "react";
import { SupplierData } from "../../../_types/pricingTypes";
import { Phone, MapPin, Edit2, Trash2, Package, Globe, Instagram, ExternalLink } from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { getCleanPhone, getWhatsAppUrl } from "@/lib/phoneUtils";

interface SupplierCardProps {
  supplier: SupplierData;
  onOpenEditSupplierModal: (supplier: SupplierData) => void;
  onDeleteSupplier: (id: string) => Promise<void>;
  onSelectSupplierForMaterials: (supplierName: string) => void;
}

export default function SupplierCard({
  supplier,
  onOpenEditSupplierModal,
  onDeleteSupplier,
  onSelectSupplierForMaterials,
}: SupplierCardProps) {
  const phoneList =
    supplier.phones && supplier.phones.length > 0
      ? supplier.phones.filter(Boolean)
      : supplier.phone
      ? [supplier.phone]
      : [];

  const primaryPhone = phoneList[0] || supplier.phone || "";
  const waUrl = getWhatsAppUrl(supplier.whatsapp || primaryPhone || "");

  const getCleanWebsiteUrl = (url: string) => {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return `https://${url}`;
    }
    return url;
  };

  const getInstagramUrl = (handle: string) => {
    const clean = handle.trim().replace(/^@/, "");
    if (clean.startsWith("http://") || clean.startsWith("https://")) {
      return clean;
    }
    return `https://instagram.com/${clean}`;
  };

  const cleanInstagramHandle = (handle: string) => {
    const clean = handle.trim().replace(/^https?:\/\/(www\.)?instagram\.com\//, "").replace(/\/$/, "");
    return clean.startsWith("@") ? clean : `@${clean}`;
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs space-y-3.5 flex flex-col justify-between hover:border-slate-300 transition">
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-black text-sm shrink-0">
              {supplier.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm leading-snug">
                {supplier.name}
              </h4>
              <span className="text-[10px] text-slate-400 font-bold">
                {supplier._count?.prices || 0} товаров в каталоге
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => onOpenEditSupplierModal(supplier)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              title="Редактировать"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDeleteSupplier(supplier.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
              title="Удалить"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Контакты: телефоны, сайт, инстаграм, адрес, заметки */}
        <div className="mt-3.5 space-y-2 text-xs text-slate-600 font-medium">
          {phoneList.length > 0 && (
            <div className="space-y-1">
              {phoneList.map((num, idx) => {
                const clean = getCleanPhone(num);
                return (
                  <div key={idx} className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <a
                      href={`tel:${clean}`}
                      className="font-bold hover:text-orange-600 transition"
                    >
                      {num}
                    </a>
                  </div>
                );
              })}
            </div>
          )}

          {/* Соцсети: Сайт и Инстаграм */}
          {(supplier.website || supplier.instagram) && (
            <div className="flex items-center gap-2.5 flex-wrap pt-0.5">
              {supplier.website && (
                <a
                  href={getCleanWebsiteUrl(supplier.website)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline bg-blue-50/80 px-2 py-0.5 rounded-lg"
                  title="Официальный сайт"
                >
                  <Globe className="w-3 h-3 text-blue-500" />
                  <span className="truncate max-w-[140px]">
                    {supplier.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                  </span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              )}

              {supplier.instagram && (
                <a
                  href={getInstagramUrl(supplier.instagram)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-pink-600 hover:text-pink-800 hover:underline bg-pink-50/80 px-2 py-0.5 rounded-lg"
                  title="Instagram"
                >
                  <Instagram className="w-3 h-3 text-pink-500" />
                  <span className="truncate max-w-[120px]">
                    {cleanInstagramHandle(supplier.instagram)}
                  </span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              )}
            </div>
          )}

          {supplier.address && (
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{supplier.address}</span>
            </div>
          )}

          {supplier.notes && (
            <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-100">
              {supplier.notes}
            </p>
          )}
        </div>
      </div>

      {/* Нижняя плашка действий */}
      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
        {waUrl ? (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-black text-xs transition active:scale-95 cursor-pointer"
          >
            <WhatsAppIcon className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>
        ) : (
          <div />
        )}

        <button
          type="button"
          onClick={() => onSelectSupplierForMaterials(supplier.name)}
          className="inline-flex items-center gap-1 text-xs font-black text-orange-600 hover:text-orange-700 p-1.5 cursor-pointer"
        >
          <span>Товары прайса</span>
          <Package className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
