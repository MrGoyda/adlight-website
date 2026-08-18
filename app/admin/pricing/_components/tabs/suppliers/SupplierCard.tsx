"use client";

import React from "react";
import { SupplierData } from "../../../_types/pricingTypes";
import { Phone, MapPin, Edit2, Trash2, Package } from "lucide-react";
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
  const cleanPhone = getCleanPhone(supplier.phone || "");
  const waUrl = getWhatsAppUrl(supplier.whatsapp || supplier.phone || "");

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs space-y-3.5 flex flex-col justify-between hover:border-slate-300 transition">
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-black text-sm shrink-0">
              {supplier.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm">{supplier.name}</h4>
              <span className="text-[10px] text-slate-400 font-bold">
                {supplier._count?.prices || 0} товаров в каталоге
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
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

        {/* Контакты */}
        <div className="mt-3 space-y-1.5 text-xs text-slate-600 font-medium">
          {supplier.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <a href={`tel:${cleanPhone}`} className="font-bold hover:text-orange-600">
                {supplier.phone}
              </a>
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
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
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
