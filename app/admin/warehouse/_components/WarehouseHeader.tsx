"use client";

import React from "react";
import Link from "next/link";
import { 
  Package, 
  Plus, 
  ArrowDownLeft, 
  FileSpreadsheet, 
  ArrowUpRight 
} from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";

interface WarehouseHeaderProps {
  onOpenCreateModal: () => void;
  onOpenSupplierIntakeModal: () => void;
  onExportExcel: () => void;
  totalSku: number;
}

export default function WarehouseHeader({
  onOpenCreateModal,
  onOpenSupplierIntakeModal,
  onExportExcel,
  totalSku,
}: WarehouseHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs">
      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-600 flex items-center justify-center shadow-2xs shrink-0">
          <Package className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Склад материалов
            </h1>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200/60">
              {totalSku} позиций (SKU)
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Оперативный учет остатков цеха, оприходование по накладным и аудит списаний
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Кнопка оприходования от поставщика */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic("medium");
            onOpenSupplierIntakeModal();
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 shadow-sm shadow-orange-600/20 transition active:scale-95 cursor-pointer"
        >
          <ArrowDownLeft className="w-3.5 h-3.5" />
          <span>Оприходовать от поставщика</span>
        </button>

        {/* Кнопка создания новой произвольной карточки */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic("light");
            onOpenCreateModal();
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition active:scale-95 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-slate-500" />
          <span>Новый материал</span>
        </button>

        {/* Экспорт ведомости */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic("light");
            onExportExcel();
          }}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition active:scale-95 cursor-pointer shadow-2xs"
          title="Выгрузить инвентаризационную ведомость в Excel"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
          <span>Инвентаризация</span>
        </button>

        {/* Ссылка на базу цен и поставщиков */}
        <Link
          href="/admin/pricing"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition active:scale-95 cursor-pointer"
          title="Перейти в базу цен поставщиков и тарифов"
        >
          <span>Прайсы</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
