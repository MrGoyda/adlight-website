// components/services/ServicePricing.tsx
"use client";

import { Calculator } from "lucide-react";
import { ServiceDetailData } from "@/dictionaries/services/service-details";
import Button from "@/components/ui/Button";

interface ServicePricingProps {
  data: ServiceDetailData;
}

export default function ServicePricing({ data }: ServicePricingProps) {
  return (
    <section id="pricing" className="py-24 bg-white border-t border-slate-200/80">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 border border-orange-100 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row gap-12 items-center shadow-sm">
          <div className="md:w-1/2 w-full">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">
              {data.pricingTitle}
            </h2>
            <p className="text-slate-655 text-sm md:text-base mb-6 leading-relaxed">
              {data.pricingDesc}
            </p>
            
            {/* Семантическая HTML5 Таблица */}
            <div className="overflow-hidden rounded-2xl border border-orange-200/60 bg-white shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-orange-50/50 border-b border-orange-100">
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-700">Услуга / Конструкция</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-orange-600 text-right">Стоимость</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                  {data.pricingItems.map((pr, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition duration-150">
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
            <h3 className="text-xl font-bold text-slate-900 mb-2">Хотите точный расчет или смету?</h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Консультация инженера и выезд на замер бесплатно.
            </p>
            <Button 
              href="/calculator" 
              variant="solid" 
              size="lg"
            >
              {data.pricingActionText}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
