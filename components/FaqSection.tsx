"use client";

import { useState } from "react";
import { ChevronDown, MessageSquare } from "lucide-react";
import { HOME_FAQ } from "@/dictionaries/home"; 
import BlueprintGrid from "@/components/ui/BlueprintGrid";

interface FaqItem {
  q: string;
  a: string;
}

interface FaqSectionProps {
  faqs?: FaqItem[];
  title?: string;
  subtitle?: string;
}

export default function FaqSection({
  faqs = HOME_FAQ,
  title = "Отвечаем на ваши вопросы",
  subtitle = "Вся правда об изготовлении наружной рекламы, ЧПУ технологиях, гарантиях и законном согласовании в Астане."
}: FaqSectionProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section className="py-20 lg:py-28 bg-slate-50 relative overflow-hidden border-t border-slate-200/60">
      {/* Чертежная сетка на фоне (Blueprint Grid) */}
      <BlueprintGrid showGradients={false} className="opacity-80" />

      {/* Subtle decorative warm ambient light glow */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/[0.01] rounded-full pointer-events-none -z-10" />
      
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        
        {/* Header section with Outfit premium typography */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200/60 text-slate-600 text-xs font-black uppercase tracking-wider">
             <MessageSquare className="w-3.5 h-3.5 text-orange-500"/> Полезно знать
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5.5xl font-black text-slate-950 tracking-tight leading-none">
             {title}
          </h2>
          <p className="text-slate-500 text-base sm:text-lg font-semibold max-w-xl mx-auto leading-relaxed">
             {subtitle}
          </p>
        </div>

        {/* Clean Accordion List */}
        <div className="space-y-4">
          {faqs.map((item, index) => {
            const isOpen = openFaq === index;
            return (
              <div 
                key={index} 
                className={`group rounded-2xl border transition-all duration-300 ${
                  isOpen 
                    ? 'bg-slate-50/40 border-orange-500/20 shadow-[0_8px_30px_rgb(0,0,0,0.01)]' 
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.005)]'
                }`}
              >
                <button 
                  onClick={() => toggleFaq(index)} 
                  className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none"
                >
                  <span className={`text-base sm:text-lg font-extrabold tracking-tight transition-colors duration-250 pr-4 leading-snug ${
                    isOpen ? 'text-orange-600' : 'text-slate-900 group-hover:text-orange-500'
                  }`}>
                    {item.q}
                  </span>
                  
                  <div className={`w-9 h-9 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${
                    isOpen 
                      ? 'bg-orange-600 text-white border-transparent rotate-180 shadow-md shadow-orange-600/10' 
                      : 'bg-white border-slate-200 text-slate-400 group-hover:border-slate-350 group-hover:text-slate-600'
                  }`}>
                    <ChevronDown className="w-4 h-4"/>
                  </div>
                </button>
                
                <div className={`grid transition-all duration-300 ease-in-out ${
                  isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}>
                  <div className="overflow-hidden">
                    <div className="px-6 md:px-8 pb-8 text-slate-600 leading-relaxed font-semibold text-sm sm:text-base border-t border-slate-100 pt-5">
                      {item.a}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}