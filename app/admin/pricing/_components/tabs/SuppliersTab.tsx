"use client";

import React from "react";
import { SupplierData } from "../../_types/pricingTypes";
import { Building2, Phone, MapPin, MessageCircle, Plus, Edit2, Trash2, Package } from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

interface SuppliersTabProps {
  suppliers: SupplierData[];
  onOpenCreateSupplierModal: () => void;
  onOpenEditSupplierModal: (supplier: SupplierData) => void;
  onDeleteSupplier: (id: string) => Promise<void>;
  onSelectSupplierForMaterials: (supplierName: string) => void;
}

export default function SuppliersTab({
  suppliers,
  onOpenCreateSupplierModal,
  onOpenEditSupplierModal,
  onDeleteSupplier,
  onSelectSupplierForMaterials,
}: SuppliersTabProps) {
  return (
    <div className="space-y-4">
      {/* Шапка */}
      <div className="flex items-center justify-between gap-2 px-1">
        <div>
          <h3 className="font-extrabold text-slate-900 text-base">База поставщиков и партнеров</h3>
          <p className="text-xs text-slate-400">Контакты менеджеров, склады и привязанные прайсы</p>
        </div>

        <button
          type="button"
          onClick={onOpenCreateSupplierModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-black shadow-md shadow-orange-600/20 transition active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Новый поставщик</span>
        </button>
      </div>

      {/* Сетка поставщиков */}
      {suppliers.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <p className="text-sm font-extrabold text-slate-700">Поставщики пока не добавлены</p>
          <button
            type="button"
            onClick={onOpenCreateSupplierModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold transition"
          >
            <Plus className="w-4 h-4" />
            <span>Добавить поставщика</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suppliers.map((sup) => {
            const cleanPhone = (sup.phone || "").replace(/[^0-9+]/g, "");
            const cleanWhatsapp = (sup.whatsapp || sup.phone || "").replace(/[^0-9]/g, "");

            return (
              <div
                key={sup.id}
                className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs space-y-3.5 flex flex-col justify-between hover:border-slate-300 transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-black text-sm shrink-0">
                        {sup.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm">{sup.name}</h4>
                        <span className="text-[10px] text-slate-400 font-bold">
                          {sup._count?.prices || 0} товаров в каталоге
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onOpenEditSupplierModal(sup)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                        title="Редактировать"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteSupplier(sup.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Удалить"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Контакты */}
                  <div className="mt-3 space-y-1.5 text-xs text-slate-600 font-medium">
                    {sup.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <a href={`tel:${cleanPhone}`} className="font-bold hover:text-orange-600">
                          {sup.phone}
                        </a>
                      </div>
                    )}

                    {sup.address && (
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{sup.address}</span>
                      </div>
                    )}

                    {sup.notes && (
                      <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-100">
                        {sup.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Нижняя плашка действий */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  {cleanWhatsapp ? (
                    <a
                      href={`https://wa.me/${cleanWhatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-black text-xs transition active:scale-95"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  ) : <div />}

                  <button
                    type="button"
                    onClick={() => onSelectSupplierForMaterials(sup.name)}
                    className="inline-flex items-center gap-1 text-xs font-black text-orange-600 hover:text-orange-700 p-1.5"
                  >
                    <span>Товары прайса</span>
                    <Package className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
