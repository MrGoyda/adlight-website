"use client";

import React from "react";
import { 
  DollarSign, 
  PackageCheck, 
  AlertTriangle, 
  Activity 
} from "lucide-react";
import { WarehouseBreakdown, StockStatusFilter } from "../_types/warehouseTypes";
import { triggerHaptic } from "@/lib/haptics";

interface WarehouseMetricsProps {
  breakdown: WarehouseBreakdown;
  currentStatusFilter: StockStatusFilter;
  onSelectStatusFilter: (status: StockStatusFilter) => void;
}

export default function WarehouseMetrics({
  breakdown,
  currentStatusFilter,
  onSelectStatusFilter,
}: WarehouseMetricsProps) {
  const {
    totalItemsCount,
    inStockCount,
    lowStockCount,
    totalInventoryValue,
    recentIntakeCount,
    recentOutflowCount,
  } = breakdown;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Общая капитализация склада */}
      <div className="p-4 sm:p-5 bg-white border border-slate-200/80 rounded-3xl shadow-2xs flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Капитализация склада
          </span>
          <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight">
            {totalInventoryValue.toLocaleString("ru-RU")}&nbsp;₸
          </span>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Оценочная стоимость сырья на балансе
          </p>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200/70 text-emerald-600 flex items-center justify-center shrink-0">
          <DollarSign className="w-5 h-5" />
        </div>
      </div>

      {/* 2. Позиций в наличии */}
      <button
        type="button"
        onClick={() => {
          triggerHaptic("light");
          onSelectStatusFilter(currentStatusFilter === "in_stock" ? "all" : "in_stock");
        }}
        className={`p-4 sm:p-5 bg-white border rounded-3xl shadow-2xs flex items-center justify-between text-left transition cursor-pointer active:scale-98 ${
          currentStatusFilter === "in_stock"
            ? "border-orange-500 ring-2 ring-orange-500/10"
            : "border-slate-200/80 hover:border-slate-300"
        }`}
      >
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            В наличии
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
              {inStockCount}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              из {totalItemsCount} SKU
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {totalItemsCount - inStockCount > 0
              ? `${totalItemsCount - inStockCount} поз. требуют закупки`
              : "Все позиции в наличии"}
          </p>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200/70 text-blue-600 flex items-center justify-center shrink-0">
          <PackageCheck className="w-5 h-5" />
        </div>
      </button>

      {/* 3. Критический остаток (кликабельно) */}
      <button
        type="button"
        onClick={() => {
          triggerHaptic("medium");
          onSelectStatusFilter(currentStatusFilter === "low_stock" ? "all" : "low_stock");
        }}
        className={`p-4 sm:p-5 bg-white border rounded-3xl shadow-2xs flex items-center justify-between text-left transition cursor-pointer active:scale-98 ${
          currentStatusFilter === "low_stock"
            ? "border-amber-500 ring-2 ring-amber-500/10 bg-amber-50/20"
            : lowStockCount > 0
            ? "border-amber-200/80 hover:border-amber-300"
            : "border-slate-200/80 hover:border-slate-300"
        }`}
      >
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Критический остаток
          </span>
          <div className="flex items-baseline gap-1.5">
            <span
              className={`text-xl sm:text-2xl font-black font-mono ${
                lowStockCount > 0 ? "text-amber-600" : "text-slate-900"
              }`}
            >
              {lowStockCount}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              ниже лимита
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {lowStockCount > 0 ? "Нажмите для фильтрации" : "Запасы в норме"}
          </p>
        </div>
        <div
          className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 ${
            lowStockCount > 0
              ? "bg-amber-50 border-amber-200 text-amber-600"
              : "bg-slate-50 border-slate-200 text-slate-400"
          }`}
        >
          <AlertTriangle className="w-5 h-5" />
        </div>
      </button>

      {/* 4. Оборот операций */}
      <div className="p-4 sm:p-5 bg-white border border-slate-200/80 rounded-3xl shadow-2xs flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Движение склада
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200/60">
              +{recentIntakeCount} приход
            </span>
            <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200/60">
              -{recentOutflowCount} списано
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Операций в журнале аудита
          </p>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-200/70 text-indigo-600 flex items-center justify-center shrink-0">
          <Activity className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
