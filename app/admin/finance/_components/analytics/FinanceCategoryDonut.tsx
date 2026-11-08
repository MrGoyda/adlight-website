"use client";

import React, { useMemo } from "react";
import { FINANCE_DICTIONARY } from "../../_data/financeDictionary";

interface CategoryStat {
  id: string;
  name: string;
  amount: number;
  percent: number;
  color: string;
}

interface FinanceCategoryDonutProps {
  categories: CategoryStat[];
  totalExpenses: number;
}

const PALETTE = [
  "#3b82f6", // blue
  "#f59e0b", // amber
  "#6366f1", // indigo
  "#a855f7", // purple
  "#ec4899", // pink
  "#14b8a6", // teal
  "#06b6d4", // cyan
  "#f43f5e", // rose
  "#64748b", // slate
];

function FinanceCategoryDonut({
  categories,
  totalExpenses,
}: FinanceCategoryDonutProps) {
  const dict = FINANCE_DICTIONARY.analytics;

  const radius = 60;
  const circumference = 2 * Math.PI * radius;

  const slices = useMemo(() => {
    let accumulatedAngle = 0;
    return categories.map((cat, idx) => {
      const strokeDasharray = `${(cat.percent / 100) * circumference} ${circumference}`;
      const strokeDashoffset = -accumulatedAngle;
      accumulatedAngle += (cat.percent / 100) * circumference;
      const color = PALETTE[idx % PALETTE.length];

      return {
        ...cat,
        color,
        strokeDasharray,
        strokeDashoffset,
      };
    });
  }, [categories, circumference]);

  if (categories.length === 0 || totalExpenses <= 0) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs font-semibold bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
        {dict.noExpenses}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
      <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-tight">
        {dict.donutTitle}
      </h3>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* SVG Donut */}
        <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
            <circle
              cx="80"
              cy="80"
              r={radius}
              className="text-slate-100"
              strokeWidth="22"
              stroke="currentColor"
              fill="transparent"
            />
            {slices.map((slice) => (
              <circle
                key={slice.id}
                cx="80"
                cy="80"
                r={radius}
                stroke={slice.color}
                strokeWidth="22"
                strokeDasharray={slice.strokeDasharray}
                strokeDashoffset={slice.strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-300"
              />
            ))}
          </svg>

          {/* Центр пончика */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Всего затрат
            </span>
            <span className="text-sm font-black font-mono text-slate-900 mt-0.5">
              {totalExpenses.toLocaleString("ru-RU")}&nbsp;₸
            </span>
          </div>
        </div>

        {/* Легенда категорий */}
        <div className="flex-1 w-full space-y-2">
          {slices.map((slice) => (
            <div
              key={slice.id}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition text-xs"
            >
              <div className="flex items-center gap-2 min-w-0 mr-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: slice.color }}
                />
                <span className="font-bold text-slate-800 truncate block">
                  {slice.name}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="font-black font-mono text-slate-900">
                  {slice.amount.toLocaleString("ru-RU")}&nbsp;₸
                </span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 font-mono">
                  {slice.percent}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default React.memo(FinanceCategoryDonut);
