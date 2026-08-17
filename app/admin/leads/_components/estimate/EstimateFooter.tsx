"use client";

import React from "react";
import { 
  Package, 
  ArrowRight, 
  DollarSign, 
  Wrench, 
  Truck, 
  Layers, 
  TrendingUp, 
  Users,
  Check
} from "lucide-react";
import { EstimateCategoryBreakdown } from "./utils";

interface EstimateFooterProps {
  breakdown: EstimateCategoryBreakdown;
  leadId: string | null;
  selectedLeadId: string | null;
  setSelectedLeadId: (id: string | null) => void;
  leads?: Array<{ id: string; name: string; phone: string }>;
  stockDeducted: boolean;
  isPending: boolean;
  hasStockMaterials: boolean;
  onDeductStock: () => void;
  onClose: () => void;
  onSave: () => void;
}

export const EstimateFooter: React.FC<EstimateFooterProps> = ({
  breakdown,
  leadId,
  selectedLeadId,
  setSelectedLeadId,
  leads = [],
  stockDeducted,
  isPending,
  hasStockMaterials,
  onDeductStock,
  onClose,
  onSave,
}) => {
  const {
    totalCost,
    totalSell,
    margin,
    marginPercent,
    itemCount,
    materialCost,
    assemblyCost,
    installationCost,
    equipmentCost,
    logisticsCost,
    totalSalary,
  } = breakdown;

  return (
    <div className="mt-6 pt-5 border-t border-slate-200/90 space-y-4">
      {/* ── 1. ГЛАВНЫЕ ФИНАНСОВЫЕ ИТОГИ (СВЕТЛАЯ ТЕМА) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* Себестоимость */}
        <div className="p-3.5 bg-slate-50/90 rounded-2xl border border-slate-200/90 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              Себестоимость:
            </span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-slate-200/70 text-slate-700">
              {itemCount} поз.
            </span>
          </div>
          <span className="text-lg sm:text-xl font-black text-slate-900 mt-1">
            {totalCost.toLocaleString()} ₸
          </span>
        </div>

        {/* Выручка */}
        <div className="p-3.5 bg-orange-50/60 rounded-2xl border border-orange-200/80 flex flex-col justify-between shadow-2xs">
          <span className="text-[10px] text-orange-900/70 font-bold uppercase tracking-wider">
            Цена для клиента:
          </span>
          <span className="text-lg sm:text-xl font-black text-orange-600 mt-1">
            {totalSell.toLocaleString()} ₸
          </span>
        </div>

        {/* Прибыль с наценки */}
        <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 flex flex-col justify-between shadow-2xs">
          <span className="text-[10px] text-emerald-900/70 font-bold uppercase tracking-wider">
            Прибыль с наценки:
          </span>
          <span
            className={`text-lg sm:text-xl font-black mt-1 ${
              margin >= 0 ? "text-emerald-700" : "text-rose-600"
            }`}
          >
            {margin >= 0 ? `+${margin.toLocaleString()}` : margin.toLocaleString()} ₸
          </span>
        </div>
      </div>

      {/* ── 2. ПОДРОБНАЯ СТРУКТУРА РАСХОДОВ (ГДЕ И СКОЛЬКО ТРАТИМ) ── */}
      <div className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
          Подробная структура расходов сметы:
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {/* Материалы */}
          <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100">
            <div className="flex items-center gap-1 text-[10px] font-bold text-purple-700 truncate mb-0.5">
              <Layers className="w-3 h-3 shrink-0" />
              <span>Материалы</span>
            </div>
            <span className="text-xs sm:text-sm font-black text-slate-900 block">
              {materialCost.toLocaleString()} ₸
            </span>
          </div>

          {/* Сборка цеха */}
          <div className="p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-100">
            <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-700 truncate mb-0.5">
              <DollarSign className="w-3 h-3 shrink-0" />
              <span>Сборка (ЗП)</span>
            </div>
            <span className="text-xs sm:text-sm font-black text-slate-900 block">
              {assemblyCost.toLocaleString()} ₸
            </span>
          </div>

          {/* Монтаж */}
          <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 truncate mb-0.5">
              <Wrench className="w-3 h-3 shrink-0" />
              <span>Монтаж (ЗП)</span>
            </div>
            <span className="text-xs sm:text-sm font-black text-slate-900 block">
              {installationCost.toLocaleString()} ₸
            </span>
          </div>

          {/* Спецтехника */}
          <div className="p-2.5 rounded-xl bg-orange-50/60 border border-orange-100">
            <div className="flex items-center gap-1 text-[10px] font-bold text-orange-700 truncate mb-0.5">
              <Wrench className="w-3 h-3 shrink-0" />
              <span>Автовышка</span>
            </div>
            <span className="text-xs sm:text-sm font-black text-slate-900 block">
              {equipmentCost.toLocaleString()} ₸
            </span>
          </div>

          {/* Логистика */}
          <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-100">
            <div className="flex items-center gap-1 text-[10px] font-bold text-amber-700 truncate mb-0.5">
              <Truck className="w-3 h-3 shrink-0" />
              <span>Газель / Доставка</span>
            </div>
            <span className="text-xs sm:text-sm font-black text-slate-900 block">
              {logisticsCost.toLocaleString()} ₸
            </span>
          </div>
        </div>

        {totalSalary > 0 && (
          <div className="pt-1 flex items-center justify-between text-[11px] font-bold text-slate-500 border-t border-slate-100">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-indigo-500" />
              Итого фонд оплаты труда мастерам (Сборка + Монтаж):
            </span>
            <span className="font-black text-slate-900">
              {totalSalary.toLocaleString()} ₸
            </span>
          </div>
        )}
      </div>

      {/* ── 3. ПРИВЯЗКА К СДЕЛКЕ (ЕСЛИ ОТКРЫТО БЕЗ ЛИДА) ── */}
      {!leadId && leads.length > 0 && (
        <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          <span className="text-xs font-black text-amber-950">
            Привязать эту смету к сделке CRM:
          </span>
          <select
            value={selectedLeadId || ""}
            onChange={(e) => setSelectedLeadId(e.target.value || null)}
            className="w-full sm:w-auto px-3 py-1.5 text-xs font-bold bg-white border border-amber-300 rounded-lg outline-none focus:border-orange-500 shadow-2xs"
          >
            <option value="">Без привязки (Черновик)</option>
            {leads.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name} ({l.phone})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* ── 4. СПИСАНИЕ ОСТАТКОВ СО СКЛАДА ── */}
      {hasStockMaterials && (
        <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="text-xs font-bold text-slate-700">
              {stockDeducted
                ? "Материалы уже списаны со склада ✅"
                : "В смете есть материалы со склада"}
            </span>
          </div>
          {!stockDeducted && (
            <button
              type="button"
              disabled={isPending}
              onClick={onDeductStock}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-black transition cursor-pointer active:scale-95 disabled:opacity-50"
            >
              Списать остатки
            </button>
          )}
        </div>
      )}

      {/* ── 5. АККУРАТНЫЕ ЭЛЕГАНТНЫЕ КНОПКИ ДЕЙСТВИЯ ── */}
      <div className="flex items-center justify-end gap-2 pt-1 pb-1">
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold transition cursor-pointer active:scale-95 disabled:opacity-50"
        >
          Отмена
        </button>

        <button
          type="button"
          onClick={onSave}
          disabled={isPending}
          className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs shadow-sm transition active:scale-95 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          {isPending ? (
            "Сохранение..."
          ) : (
            <>
              <span>Сохранить смету</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
