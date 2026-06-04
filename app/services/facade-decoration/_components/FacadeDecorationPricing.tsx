// app/services/facade-decoration/_components/FacadeDecorationPricing.tsx

import Link from "next/link";
import { Calculator } from "lucide-react";
import { facade_decorationDetails } from "@/dictionaries/services/details/facade-decoration";

export default function FacadeDecorationPricing() {
  const { pricingTitle, pricingDesc, pricingItems, pricingCalculatorPlaceholder, pricingActionText } = facade_decorationDetails;

  return (
    <section className="py-24 bg-white border-t border-slate-200/80">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto bg-gradient-to-r from-orange-55/80 to-orange-100/55 border border-orange-100 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row gap-12 items-center shadow-sm">
          <div className="md:w-1/2 w-full">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">{pricingTitle}</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              {pricingDesc}
            </p>

            {/* Семантическая HTML5 Таблица цен */}
            <div className="overflow-hidden rounded-2xl border border-orange-200/60 bg-white shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-orange-50/50 border-b border-orange-100">
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-700">Вид работы / Услуга</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-orange-600 text-right">Стоимость</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                  {pricingItems.map((pr, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition duration-155">
                      <td className="p-4 font-medium text-slate-800">{pr.label}</td>
                      <td className="p-4 text-right font-bold text-orange-600 whitespace-nowrap">{pr.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="md:w-1/2 text-center w-full">
            <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md hover:scale-105 transition-transform duration-300">
              <Calculator className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Нужен проект или точный расчет?</h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">Например: {pricingCalculatorPlaceholder}. Консультация инженера бесплатно.</p>
            <Link 
              href="/calculator" 
              className="inline-flex items-center justify-center px-8 py-3.5 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition shadow-sm active:scale-95"
            >
              {pricingActionText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
