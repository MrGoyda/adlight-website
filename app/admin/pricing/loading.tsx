import React from "react";

export default function PricingLoading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-pulse select-none">
      {/* ── 1. ШАПКА РАЗДЕЛА ТАРИФОВ И ПРАЙСОВ ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center shrink-0" />
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-6 w-60 bg-slate-200 rounded-lg" />
              <div className="h-5 w-24 bg-slate-100 rounded-full" />
            </div>
            <div className="h-3.5 w-80 bg-slate-100 rounded-md" />
          </div>
        </div>

        {/* Кнопки создания */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="h-10 w-44 rounded-2xl bg-orange-200/80" />
          <div className="h-10 w-36 rounded-2xl bg-slate-200/80" />
          <div className="h-10 w-32 rounded-2xl bg-slate-200/70" />
        </div>
      </div>

      {/* ── 2. ВКЛАДКИ (Материалы vs Тарифы работ vs Поставщики) ── */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <div className="h-9 w-48 bg-slate-900/90 rounded-2xl" />
        <div className="h-9 w-36 bg-slate-200/80 rounded-2xl" />
        <div className="h-9 w-36 bg-slate-200/80 rounded-2xl" />
      </div>

      {/* ── 3. ПАНЕЛЬ ПОИСКА, ФИЛЬТРОВ И КАТЕГОРИЙ ── */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Поле поиска */}
          <div className="h-9 max-w-md w-full bg-slate-100 rounded-xl" />
          {/* Селектор поставщика + Сортировка */}
          <div className="flex items-center gap-2 justify-end">
            <div className="h-8 w-44 bg-slate-100 rounded-xl" />
            <div className="h-8 w-36 bg-slate-100 rounded-xl" />
          </div>
        </div>

        {/* Чипсы категорий таксономии */}
        <div className="flex items-center gap-1.5 overflow-x-hidden pt-1">
          <div className="h-7 w-28 rounded-xl bg-slate-900/80 shrink-0" />
          <div className="h-7 w-36 rounded-xl bg-slate-100 shrink-0" />
          <div className="h-7 w-32 rounded-xl bg-slate-100 shrink-0" />
          <div className="h-7 w-36 rounded-xl bg-slate-100 shrink-0" />
          <div className="h-7 w-32 rounded-xl bg-slate-100 shrink-0" />
          <div className="h-7 w-36 rounded-xl bg-slate-100 shrink-0" />
        </div>
      </div>

      {/* ── 4. СЕТКА КАРТОЧЕК МАТЕРИАЛОВ ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-2xs space-y-3 relative overflow-hidden"
          >
            {/* Фото или плейсхолдер */}
            <div className="w-full h-36 rounded-2xl bg-slate-100 flex items-center justify-center" />

            {/* Заголовок и поставщик */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="h-5 w-24 bg-slate-100 rounded-full" />
                <div className="h-4 w-12 bg-slate-100 rounded" />
              </div>
              <div
                className={`h-4.5 bg-slate-200 rounded-md ${
                  idx % 2 === 0 ? "w-3/4" : "w-5/6"
                }`}
              />
              <div className="h-3 w-1/2 bg-slate-100 rounded-md" />
            </div>

            {/* Нижняя часть: цена и действия */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div className="space-y-1">
                <div className="h-5 w-24 bg-slate-200 rounded-md" />
                <div className="h-2.5 w-16 bg-slate-100 rounded" />
              </div>
              <div className="flex items-center gap-1">
                <div className="w-8 h-8 rounded-xl bg-slate-100" />
                <div className="w-8 h-8 rounded-xl bg-slate-100" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
