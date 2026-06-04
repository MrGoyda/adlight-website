// app/services/lightboxes/_components/LightboxesPricing.tsx

import Link from "next/link";
import { Calculator } from "lucide-react";
import { lightboxesDetails } from "@/dictionaries/services/details/lightboxes";

export default function LightboxesPricing() {
  return (
    <section id="pricing" className="py-24 bg-white border-t border-slate-200/80">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row gap-12 items-center shadow-xl relative overflow-hidden">
          {/* Decorative carbon texture overlay */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.webp')] opacity-5 pointer-events-none"></div>

          <div className="md:w-1/2 relative z-10">
            <h2 className="text-3xl font-extrabold text-white mb-4 tracking-tight">
              Цены на изготовление лайтбоксов и расчет сметы в Астане
            </h2>
            <p className="text-orange-100 mb-8 font-medium">
              {lightboxesDetails.pricingDesc}
            </p>
            <ul className="space-y-4">
              {lightboxesDetails.pricingItems.map((pr, i) => {
                // Извлекаем цифры для микроразметки, например "от 80 000 ₸ / м²" -> "80000"
                const numericPrice = pr.value.replace(/\D/g, "");
                return (
                  <li 
                    key={i} 
                    itemScope 
                    itemProp="offers" 
                    itemType="https://schema.org/Offer"
                    className="flex justify-between text-sm border-b border-white/20 pb-2"
                  >
                    <span itemProp="name" className="text-orange-50 font-medium">{pr.label}</span>
                    <span className="text-white font-bold">
                      <meta itemProp="price" content={numericPrice} />
                      <meta itemProp="priceCurrency" content="KZT" />
                      <link itemProp="availability" href="https://schema.org/InStock" />
                      {pr.value}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="md:w-1/2 text-center relative z-10">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border border-white/20">
              <Calculator className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Нужен проект или точный расчет?</h3>
            <p className="text-orange-100 text-sm mb-6">
              Мы бесплатно подготовим индивидуальный расчет и эскиз конструкции.
            </p>
            <Link 
              href="/calculator" 
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-orange-600 font-bold rounded-xl hover:bg-slate-100 transition shadow-md active:scale-95"
            >
              {lightboxesDetails.pricingActionText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
