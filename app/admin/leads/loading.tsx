import React from "react";

export default function LeadsLoading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-pulse select-none">
      {/* ── 1. ПАНЕЛЬ БЫСТРЫХ ДЕЙСТВИЙ (Десктоп) ── */}
      <div className="hidden md:flex flex-wrap items-center justify-between gap-2.5 pb-1">
        <div className="flex flex-wrap items-center gap-2">
          {/* Кнопка "Новая сделка / Лид" */}
          <div className="h-10 w-44 rounded-2xl bg-orange-200/80" />
          {/* Кнопка "Создать смету" */}
          <div className="h-10 w-36 rounded-2xl bg-slate-200/80" />
          {/* Кнопка "Новый клиент" */}
          <div className="h-10 w-36 rounded-2xl bg-slate-200/80" />
        </div>

        <div className="flex items-center gap-2">
          {/* Импорт базы */}
          <div className="h-9 w-32 rounded-xl bg-slate-200/70" />
          {/* Аудитории */}
          <div className="h-9 w-28 rounded-xl bg-slate-200/70" />
        </div>
      </div>

      {/* ── 2. СЕГМЕНТИРОВАННЫЙ ПЕРЕКЛЮЧАТЕЛЬ 3 ПРОСТРАНСТВ ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="grid grid-cols-3 sm:inline-flex bg-slate-200/70 p-1 rounded-2xl w-full sm:w-auto gap-1">
          <div className="h-9 sm:w-32 bg-white rounded-xl shadow-xs" />
          <div className="h-9 sm:w-32 rounded-xl" />
          <div className="h-9 sm:w-32 rounded-xl" />
        </div>
      </div>

      {/* ── 3. СТРОКА ПОИСКА И ФИЛЬТРАЦИОННЫЕ ЧИПСЫ ── */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2">
          {/* Поле поиска */}
          <div className="h-11 flex-1 bg-white border border-slate-200 rounded-2xl px-4 flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-slate-300 shrink-0" />
            <div className="h-3.5 w-48 bg-slate-200 rounded-md" />
          </div>
          {/* Кнопка подробнее/компактно */}
          <div className="h-11 w-28 bg-white border border-slate-200 rounded-2xl shrink-0" />
        </div>

        {/* Горизонтальный скролл чипсов статусов */}
        <div className="flex items-center gap-1.5 overflow-x-hidden pb-1">
          <div className="h-8 w-20 rounded-xl bg-slate-900/90 shrink-0" />
          <div className="h-8 w-36 rounded-xl bg-slate-200 shrink-0" />
          <div className="h-8 w-32 rounded-xl bg-slate-200 shrink-0" />
          <div className="h-8 w-28 rounded-xl bg-slate-200 shrink-0" />
          <div className="h-8 w-32 rounded-xl bg-slate-200 shrink-0" />
          <div className="h-8 w-28 rounded-xl bg-slate-200 shrink-0" />
        </div>
      </div>

      {/* ── 4. СПИСОК СМАРТ-КАРТОЧЕК СДЕЛОК ── */}
      <div className="w-full space-y-3">
        {[1, 2, 3, 4, 5].map((idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs space-y-3 relative overflow-hidden"
          >
            {/* Верхняя строка: Статус + Рейтинг + Время */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {/* Статус-бейдж */}
                <div
                  className={`h-6 rounded-full ${
                    idx % 3 === 0
                      ? "w-28 bg-orange-100"
                      : idx % 2 === 0
                      ? "w-32 bg-blue-100"
                      : "w-24 bg-emerald-100"
                  }`}
                />
                {/* Рейтинг */}
                <div className="w-6 h-6 rounded-full bg-slate-100" />
              </div>

              {/* Дата / Время */}
              <div className="h-3.5 w-20 bg-slate-200 rounded-md" />
            </div>

            {/* Средняя строка: Имя клиента + Телефон + Менеджер */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <div className="sm:col-span-6 space-y-1.5">
                {/* Имя заказчика */}
                <div
                  className={`h-4.5 bg-slate-200 rounded-md ${
                    idx % 2 === 0 ? "w-3/5" : "w-4/5"
                  }`}
                />
                {/* Телефон */}
                <div className="h-3.5 w-36 bg-slate-100 rounded-md" />
              </div>

              {/* Менеджер и адрес */}
              <div className="sm:col-span-3 space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-200" />
                  <div className="h-3.5 w-24 bg-slate-200 rounded-md" />
                </div>
                <div className="h-3 w-40 bg-slate-100 rounded-md" />
              </div>

              {/* Правая часть: Сумма сметы */}
              <div className="sm:col-span-3 flex sm:flex-col items-center sm:items-end justify-between gap-1">
                <div className="h-5 w-28 bg-slate-200 rounded-lg" />
                <div className="h-3 w-16 bg-slate-100 rounded-md" />
              </div>
            </div>

            {/* Нижняя строка: Теги тех-спецификации (вывески, габариты) */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <div className="h-6 w-32 rounded-lg bg-slate-100" />
                <div className="h-6 w-24 rounded-lg bg-slate-100" />
                <div className="h-6 w-20 rounded-lg bg-slate-100 hidden sm:block" />
              </div>

              {/* Кнопки действий */}
              <div className="flex items-center gap-1.5 shrink-0">
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
