import React from "react";
import { getCalculatorData } from "./calculatorActions";
import EstimateSpreadsheet from "./_components/EstimateSpreadsheet";
import { Calculator } from "lucide-react";

export const metadata = {
  title: "Калькулятор просчета проекта | ADLight CRM",
  description: "Интерактивный верстак сметы, пресеты проектов и расчет маржинальности",
};

export default async function CalculatorPage() {
  const result = await getCalculatorData();

  if (!result.success || !result.data) {
    return (
      <div className="p-8 text-center">
        <div className="max-w-md mx-auto bg-white p-6 rounded-3xl border border-rose-200 shadow-sm">
          <p className="text-sm font-bold text-rose-600 mb-2">Ошибка загрузки калькулятора</p>
          <p className="text-xs text-slate-500">{result.error || "Не удалось получить данные с сервера"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-4">
      {/* Заголовок страницы */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-600 flex items-center justify-center shadow-2xs">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Калькулятор сметы
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Оперативный расчет себестоимости, пресеты типовых конструкций и экспорт КП
            </p>
          </div>
        </div>
      </div>

      {/* Интерактивный верстак сметы */}
      <EstimateSpreadsheet initialData={result.data} />
    </div>
  );
}
