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
    <div className="sticky bottom-4 z-30 w-full max-w-7xl mx-auto px-2 sm:px-4 pointer-events-none">
      <div className="pointer-events-auto bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-3xl p-3 sm:px-5 sm:py-3 shadow-xl shadow-slate-900/10 flex flex-wrap lg:flex-nowrap items-center justify-between gap-3 sm:gap-4 transition-all">
        {/* Левая часть: 4 ключевые цифры с чистой типографикой без разрывов */}
        <div className="flex items-center gap-3 sm:gap-5 lg:gap-6 flex-wrap sm:flex-nowrap shrink-0">
          {/* Себестоимость */}
          <div className="shrink-0 whitespace-nowrap">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap">
              Себестоимость
            </div>
            <div className="text-xs sm:text-sm font-mono font-bold text-slate-600 whitespace-nowrap">
              {totalCost.toLocaleString("ru-RU")}&nbsp;₸
            </div>
          </div>

          <div className="hidden sm:block w-px h-7 bg-slate-200 shrink-0" />

          {/* Цена для клиента */}
          <div className="shrink-0 whitespace-nowrap">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap">
              Цена клиенту
            </div>
            <div className="text-sm sm:text-base font-mono font-extrabold text-slate-900 whitespace-nowrap">
              {totalSell.toLocaleString("ru-RU")}&nbsp;₸
            </div>
          </div>

          <div className="hidden sm:block w-px h-7 bg-slate-200 shrink-0" />

          {/* Чистая маржа */}
          <div className="shrink-0 whitespace-nowrap">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap">
              Прибыль
            </div>
            <div className="text-xs sm:text-sm font-mono font-bold text-emerald-600 whitespace-nowrap">
              +{margin.toLocaleString("ru-RU")}&nbsp;₸
            </div>
          </div>

          <div className="hidden sm:block w-px h-7 bg-slate-200 shrink-0" />

          {/* Маржинальность % */}
          <div className="shrink-0 whitespace-nowrap">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap">
              Маржа
            </div>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono font-extrabold whitespace-nowrap ${
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

        {/* Правая часть: быстрое управление наценкой и экспорт в 1 строку без переносов */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap justify-end">
          {/* Быстрые коэффициенты наценки */}
          <div className="flex items-center gap-0.5 bg-slate-100 p-1 rounded-2xl shrink-0">
            {[1.25, 1.35, 1.5, 1.8].map((mult) => (
              <button
                key={mult}
                type="button"
                onClick={() => onApplyMultiplier(mult)}
                className={`px-2 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer whitespace-nowrap shrink-0 ${
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
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-2xl transition active:scale-95 disabled:opacity-40 cursor-pointer shadow-2xs whitespace-nowrap shrink-0"
            title="Скопировать коммерческое предложение для WhatsApp"
          >
            <Copy className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="whitespace-nowrap">КП в&nbsp;WhatsApp</span>
          </button>

          {/* Сохранить как шаблон */}
          <button
            type="button"
            onClick={onOpenSavePreset}
            disabled={itemsCount === 0}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl transition active:scale-95 disabled:opacity-40 cursor-pointer shadow-2xs whitespace-nowrap shrink-0"
            title="Сохранить текущую смету в пресет"
          >
            <BookmarkPlus className="w-3.5 h-3.5 text-orange-500 shrink-0" />
            <span className="whitespace-nowrap">В&nbsp;шаблон</span>
          </button>

          {/* Привязать к сделке / Сохранить в CRM */}
          <button
            type="button"
            onClick={onOpenLeadBinder}
            disabled={itemsCount === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-2xl transition active:scale-95 disabled:opacity-40 cursor-pointer shadow-sm shadow-orange-500/20 whitespace-nowrap shrink-0"
          >
            <Link2 className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">В&nbsp;сделку</span>
          </button>
        </div>
      </div>
    </div>
  );
}
