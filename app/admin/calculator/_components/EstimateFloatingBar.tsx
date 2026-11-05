"use client";

import React from "react";
import { 
  Copy, 
  BookmarkPlus, 
  Link2, 
} from "lucide-react";
import { CalculationBreakdown } from "../_types/calculatorTypes";

interface EstimateFloatingBarProps {
  breakdown: CalculationBreakdown;
  targetMultiplier: number;
  onApplyMultiplier: (multiplier: number) => void;
  onCopyProposal: () => void;
  onOpenSavePreset: () => void;
  onOpenLeadBinder: () => void;
}

export default function EstimateFloatingBar({
  breakdown,
  targetMultiplier,
  onApplyMultiplier,
  onCopyProposal,
  onOpenSavePreset,
  onOpenLeadBinder,
}: EstimateFloatingBarProps) {
  const { totalCost, totalSell, margin, marginPercent, itemsCount } = breakdown;

  return (
    <div className="sticky bottom-4 z-30 w-full max-w-5xl mx-auto px-2 pointer-events-none">
      <div className="pointer-events-auto bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-3xl p-3 sm:p-4 shadow-xl shadow-slate-900/10 flex flex-col md:flex-row items-center justify-between gap-3.5 transition-all">
        {/* Левая часть: 4 ключевые цифры с чистой типографикой */}
        <div className="flex items-center gap-4 sm:gap-6 w-full md:w-auto justify-between md:justify-start">
          {/* Себестоимость */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Себестоимость
            </div>
            <div className="text-xs sm:text-sm font-mono font-bold text-slate-600">
              {totalCost.toLocaleString("ru-RU")} ₸
            </div>
          </div>

          <div className="w-px h-8 bg-slate-200" />

          {/* Цена для клиента */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Цена клиенту
            </div>
            <div className="text-sm sm:text-base font-mono font-extrabold text-slate-900">
              {totalSell.toLocaleString("ru-RU")} ₸
            </div>
          </div>

          <div className="w-px h-8 bg-slate-200" />

          {/* Чистая маржа */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Прибыль
            </div>
            <div className="text-xs sm:text-sm font-mono font-bold text-emerald-600">
              +{margin.toLocaleString("ru-RU")} ₸
            </div>
          </div>

          <div className="w-px h-8 bg-slate-200" />

          {/* Маржинальность % */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Маржа
            </div>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono font-extrabold ${
                marginPercent >= 35
                  ? "bg-emerald-100 text-emerald-800"
                  : marginPercent >= 20
                  ? "bg-amber-100 text-amber-800"
                  : "bg-rose-100 text-rose-800"
              }`}
            >
              {Math.round(marginPercent)}%
            </span>
          </div>
        </div>

        {/* Правая часть: быстрое управление наценкой и экспорт */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end overflow-x-auto no-scrollbar">
          {/* Быстрые коэффициенты наценки */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-2xl mr-1">
            {[1.25, 1.35, 1.5, 1.8].map((mult) => (
              <button
                key={mult}
                type="button"
                onClick={() => onApplyMultiplier(mult)}
                className={`px-2 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer ${
                  targetMultiplier === mult
                    ? "bg-white text-slate-900 shadow-2xs font-extrabold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                title={`Наценка x${mult}`}
              >
                x{mult}
              </button>
            ))}
          </div>

          {/* Копировать КП для WhatsApp */}
          <button
            type="button"
            onClick={onCopyProposal}
            disabled={itemsCount === 0}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-2xl transition active:scale-95 disabled:opacity-40 cursor-pointer shadow-2xs"
            title="Скопировать коммерческое предложение для WhatsApp"
          >
            <Copy className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">КП в WhatsApp</span>
          </button>

          {/* Сохранить как шаблон */}
          <button
            type="button"
            onClick={onOpenSavePreset}
            disabled={itemsCount === 0}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl transition active:scale-95 disabled:opacity-40 cursor-pointer shadow-2xs"
            title="Сохранить текущую смету в пресет"
          >
            <BookmarkPlus className="w-3.5 h-3.5 text-orange-500" />
            <span className="hidden sm:inline">В шаблон</span>
          </button>

          {/* Привязать к сделке / Сохранить в CRM */}
          <button
            type="button"
            onClick={onOpenLeadBinder}
            disabled={itemsCount === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-2xl transition active:scale-95 disabled:opacity-40 cursor-pointer shadow-sm shadow-orange-500/20"
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>В сделку</span>
          </button>
        </div>
      </div>
    </div>
  );
}
