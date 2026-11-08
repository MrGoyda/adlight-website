import React from "react";

export default function CalculatorLoading() {
  return (
    <div className="max-w-[1600px] mx-auto space-y-4 pb-16 animate-pulse select-none">
      {/* ── 1. ЗАГОЛОВОК КАЛЬКУЛЯТОРА ── */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center shrink-0" />
          <div className="space-y-1.5">
            <div className="h-6 w-52 bg-slate-200 rounded-lg" />
            <div className="h-3 w-80 bg-slate-100 rounded-md" />
          </div>
        </div>
      </div>

      {/* ── 2. ПОЛОСА ШАБЛОНОВ (ПРЕСЕТЫ) ── */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-3.5 shadow-2xs flex items-center gap-2 overflow-x-hidden">
        <div className="h-4 w-32 bg-slate-200 rounded mr-2 shrink-0" />
        <div className="h-8 w-36 rounded-xl bg-orange-100 shrink-0" />
        <div className="h-8 w-44 rounded-xl bg-slate-100 shrink-0" />
        <div className="h-8 w-40 rounded-xl bg-slate-100 shrink-0" />
        <div className="h-8 w-36 rounded-xl bg-slate-100 shrink-0" />
        <div className="h-8 w-32 rounded-xl bg-slate-100 shrink-0" />
      </div>

      {/* ── 3. ПАНЕЛЬ УПРАВЛЕНИЯ ВЕРСТАКОМ ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs">
        {/* Привязка к сделке */}
        <div className="flex items-center gap-2">
          <div className="h-9 w-64 bg-slate-100 rounded-xl" />
          <div className="h-9 w-32 bg-slate-100 rounded-xl" />
        </div>

        {/* Кнопки добавления строк */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="h-9 w-36 rounded-xl bg-orange-200/80" />
          <div className="h-9 w-32 rounded-xl bg-slate-200/70" />
          <div className="h-9 w-28 rounded-xl bg-slate-200/70" />
          <div className="h-9 w-28 rounded-xl bg-slate-200/70" />
        </div>
      </div>

      {/* ── 4. ТАБЛИЦА ВЕРСТАКА СМЕТЫ ── */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-3 w-10 text-center">№</th>
                <th className="py-3 px-3 w-28">Статья</th>
                <th className="py-3 px-4">Наименование позиции</th>
                <th className="py-3 px-3 w-20 text-center">Ед. изм.</th>
                <th className="py-3 px-3 w-24 text-right">Кол-во</th>
                <th className="py-3 px-3 w-28 text-right">Себестоимость</th>
                <th className="py-3 px-3 w-24 text-right">Наценка %</th>
                <th className="py-3 px-3 w-28 text-right">Цена клиенту</th>
                <th className="py-3 px-4 w-32 text-right">Сумма продажи</th>
                <th className="py-3 px-3 w-16 text-center">Удалить</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <tr key={idx} className="hover:bg-slate-50/40">
                  <td className="py-3.5 px-3 text-center">
                    <div className="h-3 w-4 bg-slate-200 rounded mx-auto" />
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="h-6 w-20 bg-slate-100 rounded-lg" />
                  </td>
                  <td className="py-3.5 px-4">
                    <div
                      className={`h-4 bg-slate-200 rounded-md ${
                        idx % 2 === 0 ? "w-48" : "w-64"
                      }`}
                    />
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <div className="h-3 w-10 bg-slate-100 rounded mx-auto" />
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <div className="h-7 w-16 bg-slate-100 rounded-lg ml-auto" />
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <div className="h-4 w-20 bg-slate-200 rounded-md ml-auto" />
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <div className="h-7 w-14 bg-slate-100 rounded-lg ml-auto" />
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <div className="h-4 w-20 bg-slate-200 rounded-md ml-auto" />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="h-4 w-24 bg-slate-300 rounded-md ml-auto" />
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 mx-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 5. ИТОГОВАЯ ПАНЕЛЬ МАРЖИ И ЭКСПОРТА КП ── */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Финансовая сводка */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
          <div className="space-y-1">
            <div className="h-3 w-24 bg-slate-700 rounded" />
            <div className="h-6 w-28 bg-slate-800 rounded" />
          </div>
          <div className="space-y-1">
            <div className="h-3 w-20 bg-slate-700 rounded" />
            <div className="h-6 w-24 bg-slate-800 rounded" />
          </div>
          <div className="space-y-1">
            <div className="h-3 w-24 bg-slate-700 rounded" />
            <div className="h-6 w-24 bg-slate-800 rounded" />
          </div>
          <div className="space-y-1">
            <div className="h-3 w-24 bg-orange-950 rounded" />
            <div className="h-7 w-32 bg-orange-600/40 rounded" />
          </div>
        </div>

        {/* Кнопки выгрузки КП */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="h-11 w-40 rounded-2xl bg-orange-500/80" />
          <div className="h-11 w-32 rounded-2xl bg-slate-800" />
        </div>
      </div>
    </div>
  );
}
