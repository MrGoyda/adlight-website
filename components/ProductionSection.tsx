import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Factory, Settings, Printer, Users, Maximize2, ArrowRight } from "lucide-react";
import { PRODUCTION_DETAILS } from "@/dictionaries/production";
import Button from "@/components/ui/Button";
import { getCdnUrl } from "@/lib/serverUtils";

const ICON_COMPONENTS: Record<string, React.ComponentType<{ className?: string }>> = {
  Settings,
  Printer,
  Users,
  Maximize2,
  Factory,
};

export default function ProductionSection() {
  return (
    <section className="py-20 lg:py-28 bg-white relative overflow-hidden border-y border-slate-200/60">
      {/* Soft ambient background glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/[0.015] rounded-full pointer-events-none -z-10" />
      
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* LEFT COLUMN: TEXT & HIGH-TECH DETAIL CARDS */}
          <div className="lg:col-span-7 space-y-8 text-left">
             <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200/40 text-orange-600 text-xs font-black uppercase tracking-wider">
                   <Factory className="w-4 h-4"/> Собственное производство в Астане
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5.5xl font-black text-slate-950 tracking-tight leading-none">
                   Мы не перекупщики. <br/>
                   Мы — <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-600 to-red-600">производители!</span>
                </h2>
                <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-medium max-w-2xl">
                   Полный производственный цикл в Астане: от высокоточного ЧПУ-раскроя листовых материалов до интерьерной УФ-печати и монтажа. Никаких посредников, строгое соблюдение сроков.
                </p>
             </div>
  
             <div className="grid sm:grid-cols-2 gap-4">
                {PRODUCTION_DETAILS.map((item, i) => {
                    const IconComponent = ICON_COMPONENTS[item.iconName] || Settings;

                   return (
                      <div 
                         key={i}
                         className="p-6 rounded-2xl bg-white border border-slate-200/70 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-md hover:border-slate-300 transition duration-300 group"
                      >
                         <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 group-hover:scale-105 transition-transform ${item.color}`}>
                            <IconComponent className="w-5 h-5" />
                         </div>
                         <h4 className="text-slate-950 font-extrabold text-sm mb-1.5">{item.title}</h4>
                         <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                            {item.desc}
                         </p>
                      </div>
                   );
                })}
             </div>
  
             {/* DUAL ACTIONS */}
             <div className="flex flex-wrap items-center gap-4 pt-4">
                <Button 
                   href="/calculator" 
                   variant="solid"
                   rightIcon={<ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"/>}
                >
                   Рассчитать вывеску
                </Button>

                <Button 
                   href="/production" 
                   variant="lightOutline"
                >
                   О нашем производстве
                </Button>
             </div>
          </div>
  
          {/* RIGHT COLUMN: DETAILED WORKSHOP AND STAFF SPECIMEN CARD */}
          <div className="lg:col-span-5 relative">
             <div className="relative bg-white border border-slate-200 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] transform lg:-rotate-1 hover:rotate-0 transition duration-500">
                <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                   <div>
                      <div className="text-slate-950 font-black text-sm">Паспорт производства</div>
                      <div className="text-orange-600 text-[10px] font-black uppercase tracking-wider">ул. Аспара 7, г. Астана</div>
                   </div>
                </div>
                
                {/* Visual Spec Image Container */}
                <div className="aspect-[4/3] bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden relative group">
                   <Image 
                      src={getCdnUrl("/images/pages/assembly_workshop.png")} 
                      alt="Производственный цех рекламной компании ADLight в Астане"
                      fill
                      className="object-cover transition duration-700 group-hover:scale-[1.02]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                   />
                </div>

                {/* Highly Informative Equipment & Staff Specifications list */}
                <div className="mt-6 bg-slate-50 border border-slate-200/60 rounded-2xl p-4 space-y-3.5">
                   <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">Оборудование ЧПУ и печати:</span>
                      <div className="flex flex-wrap gap-1.5">
                         <span className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 font-mono text-[10px] font-bold rounded-lg">Лазер</span>
                         <span className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 font-mono text-[10px] font-bold rounded-lg">Фрезер ЧПУ</span>
                         <span className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 font-mono text-[10px] font-bold rounded-lg">Бортогиб</span>
                         <span className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 font-mono text-[10px] font-bold rounded-lg">Сольвент</span>
                         <span className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 font-mono text-[10px] font-bold rounded-lg">Экосольвент</span>
                         <span className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 font-mono text-[10px] font-bold rounded-lg">УФ планшет</span>
                         <span className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 font-mono text-[10px] font-bold rounded-lg">УФ рулон</span>
                         <span className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 font-mono text-[10px] font-bold rounded-lg">УФ DTF</span>
                      </div>
                   </div>
                   
                   <div className="border-t border-slate-200/60 pt-3">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">Команда (15 штатных специалистов):</span>
                      <div className="flex flex-wrap gap-1.5">
                         <span className="px-2.5 py-1 bg-slate-900 text-white text-[10px] font-extrabold rounded-lg">Архитекторы</span>
                         <span className="px-2.5 py-1 bg-slate-900 text-white text-[10px] font-extrabold rounded-lg">Дизайнеры</span>
                         <span className="px-2.5 py-1 bg-slate-900 text-white text-[10px] font-extrabold rounded-lg">Сборщики-макетчики</span>
                         <span className="px-2.5 py-1 bg-slate-900 text-white text-[10px] font-extrabold rounded-lg">Монтажники</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>
  
        </div>
      </div>
    </section>
  );
}