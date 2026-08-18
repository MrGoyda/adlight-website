"use client";

import React from "react";
import { SupplierData } from "../../_types/pricingTypes";
import { Building2, Plus } from "lucide-react";
import SupplierCard from "./suppliers/SupplierCard";

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
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Добавить поставщика</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suppliers.map((sup) => (
            <SupplierCard
              key={sup.id}
              supplier={sup}
              onOpenEditSupplierModal={onOpenEditSupplierModal}
              onDeleteSupplier={onDeleteSupplier}
              onSelectSupplierForMaterials={onSelectSupplierForMaterials}
            />
          ))}
        </div>
      )}
    </div>
  );
}
