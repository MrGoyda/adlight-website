import React from "react";

export default function WarehouseLoading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-pulse select-none">
      {/* ── 1. ШАПКА СКЛАДА ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div className="flex items-center gap-3">
          {/* Иконка */}
          <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center shrink-0" />
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-6 w-56 bg-slate-200 rounded-lg" />
              <div className="h-5 w-20 bg-slate-100 rounded-full" />
            </div>
            <div className="h-3.5 w-72 bg-slate-100 rounded-md" />
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="h-10 w-44 rounded-2xl bg-orange-200/80" />
          <div className="h-10 w-36 rounded-2xl bg-slate-200/80" />
          <div className="h-10 w-10 rounded-2xl bg-slate-200/70" />
        </div>
      </div>

      {/* ── 2. СЕТКА МЕТРИК (KPIs) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-4 sm:p-5 bg-white border border-slate-200/80 rounded-3xl shadow-2xs flex items-center justify-between"
          >
            <div className="space-y-2 flex-1 mr-3">
              <div className="h-3 w-28 bg-slate-100 rounded-md" />
              <div className="h-7 w-32 bg-slate-200 rounded-lg" />
              <div className="h-3 w-40 bg-slate-100 rounded-md" />
            </div>
            <div className="w-11 h-11 rounded-2xl bg-slate-100 shrink-0" />
          </div>
        ))}
      </div>

      {/* ── 3. ВКЛАДКИ (Остатки vs История) ── */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <div className="h-9 w-44 bg-slate-900/90 rounded-2xl" />
        <div className="h-9 w-48 bg-slate-200/80 rounded-2xl" />
      </div>

      {/* ── 4. ПАНЕЛЬ ФИЛЬТРОВ И КАТЕГОРИЙ ── */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Поисковая строка */}
            <div className="h-9 max-w-md w-full bg-slate-100 rounded-xl" />
            {/* Статус + сортировка */}
            <div className="flex items-center gap-2 justify-end">
              <div className="h-8 w-44 bg-slate-100 rounded-2xl" />
              <div className="h-8 w-36 bg-slate-100 rounded-xl" />
            </div>
          </div>

          {/* Горизонтальные чипсы категорий */}
          <div className="flex items-center gap-1.5 overflow-x-hidden pt-1">
            <div className="h-7 w-28 rounded-xl bg-slate-900/80 shrink-0" />
            <div className="h-7 w-36 rounded-xl bg-slate-100 shrink-0" />
            <div className="h-7 w-32 rounded-xl bg-slate-100 shrink-0" />
            <div className="h-7 w-36 rounded-xl bg-slate-100 shrink-0" />
            <div className="h-7 w-28 rounded-xl bg-slate-100 shrink-0" />
            <div className="h-7 w-32 rounded-xl bg-slate-100 shrink-0" />
          </div>
        </div>

        {/* ── 5. ТАБЛИЦА НОМЕНКЛАТУРЫ ── */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center">№</th>
                <th className="py-3 px-4">Материал / Категория</th>
                <th className="py-3 px-3 w-36">Локация в цехе</th>
                <th className="py-3 px-3 w-32 text-right">В наличии</th>
                <th className="py-3 px-3 w-28 text-right">Закупка, ₸</th>
                <th className="py-3 px-3 w-32 text-right">Сумма запаса</th>
                <th className="py-3 px-4 w-36 text-center">Операции</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[1, 2, 3, 4, 5, 6, 7].map((idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 text-center">
                    <div className="h-3 w-4 bg-slate-200 rounded mx-auto" />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="space-y-1.5">
                      <div
                        className={`h-4 bg-slate-200 rounded-md ${
                          idx % 2 === 0 ? "w-48" : "w-64"
                        }`}
                      />
                      <div className="h-3 w-28 bg-slate-100 rounded-md" />
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="h-6 w-24 bg-slate-100 rounded-lg" />
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <div className="space-y-1 inline-flex flex-col items-end">
                      <div className="h-4 w-16 bg-slate-200 rounded-md" />
                      <div className="h-2.5 w-12 bg-slate-100 rounded" />
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <div className="h-4 w-20 bg-slate-200 rounded-md ml-auto" />
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <div className="h-4 w-24 bg-slate-200 rounded-md ml-auto" />
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <div className="w-7 h-7 rounded-lg bg-slate-100" />
                      <div className="w-7 h-7 rounded-lg bg-slate-100" />
                      <div className="w-7 h-7 rounded-lg bg-slate-100" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
