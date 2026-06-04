// app/services/volume-letters/[slug]/_components/FaceLitFAQ.tsx
'use client';

import { ChevronDown, Clock, BatteryCharging, Shield, Layers, HelpCircle } from "lucide-react";
import { VolumeLetterDetailData } from "@/dictionaries/services/volume-letters";

const IconHelper = ({ name, className }: { name: string; className: string }) => {
  switch (name) {
    case "Clock":
      return <Clock className={className} />;
    case "BatteryCharging":
      return <BatteryCharging className={className} />;
    case "Shield":
      return <Shield className={className} />;
    case "Layers":
      return <Layers className={className} />;
    default:
      return <HelpCircle className={className} />;
  }
};

interface FaceLitFAQProps {
  data: VolumeLetterDetailData;
}

export default function FaceLitFAQ({ data }: FaceLitFAQProps) {
  return (
    <section className="py-24 bg-slate-50 border-b border-slate-200">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <span className="text-orange-600 font-extrabold text-sm uppercase tracking-widest mb-2 block">Полезная информация</span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-950 tracking-tight">Популярные вопросы и ответы</h2>
        </div>

        <div className="space-y-4">
          {data.faqs.map((item, index) => (
            <details 
              key={index} 
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
              className="group bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300 open:border-orange-500/30 open:shadow-[0_15px_30px_rgba(0,0,0,0.02)]"
            >
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-slate-50 transition">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-orange-50 rounded-lg group-open:bg-orange-100 transition shrink-0">
                    <IconHelper name={item.iconName} className="w-5 h-5 text-orange-600"/>
                  </div>
                  <span 
                    itemProp="name" 
                    className="font-extrabold text-slate-900 text-base md:text-lg group-open:text-orange-600 transition"
                  >
                    {item.question}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-open:rotate-180 transition ml-4 shrink-0">
                  <ChevronDown className="w-4 h-4"/>
                </div>
              </summary>
              <div 
                itemProp="acceptedAnswer"
                itemScope
                itemType="https://schema.org/Answer"
                className="px-6 pb-6 pl-[4.5rem] text-slate-600 text-sm md:text-base leading-relaxed border-t border-slate-100 pt-4 animate-in fade-in duration-200"
              >
                <div itemProp="text">
                  {item.answer}
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
