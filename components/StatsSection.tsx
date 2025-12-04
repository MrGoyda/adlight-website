"use client";

import { 
  Trophy, 
  Briefcase, 
  Zap, 
  ShieldCheck 
} from "lucide-react";

const STATS = [
  { 
    value: "5 лет", 
    label: "Опыт работы", 
    desc: "Безупречная репутация на рынке Астаны",
    icon: <Trophy className="w-5 h-5 text-orange-500"/>,
  },
  { 
    value: "300+", 
    label: "Проектов", 
    desc: "От табличек до крышных установок",
    icon: <Briefcase className="w-5 h-5 text-blue-500"/>,
  },
  { 
    value: "3 дня", 
    label: "Срок сдачи", 
    desc: "Собственное производство 24/7",
    icon: <Zap className="w-5 h-5 text-green-500"/>,
  },
  { 
    value: "0 ₸", 
    label: "Штрафов", 
    desc: "Строгое соблюдение Дизайн-кода",
    icon: <ShieldCheck className="w-5 h-5 text-purple-500"/>,
  },
];

export default function StatsSection() {
  return (
    <section className="py-20 bg-[#0B1120] border-y border-slate-800 relative">
      {/* Техническая сетка на фоне (еле заметная) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Grid Container с тонкими границами (gap-px создает эффект тонких линий) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-800 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          {STATS.map((stat, index) => (
            <div 
              key={index} 
              className="group bg-[#0F172A] p-8 hover:bg-slate-900/80 transition-colors duration-300"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="flex justify-between items-start mb-6">
                {/* Иконка в "инженерном" боксе */}
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 group-hover:border-slate-700 transition-colors shadow-sm">
                    {stat.icon}
                </div>
                <span className="text-[10px] font-mono text-slate-600 group-hover:text-slate-500 transition-colors">
                    0{index + 1}
                </span>
              </div>

              <div className="space-y-2">
                {/* Значение */}
                <div className="text-3xl lg:text-4xl font-black text-white tracking-tight group-hover:scale-105 transition-transform duration-300 origin-left">
                    {stat.value}
                </div>
                {/* Заголовок */}
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {stat.label}
                </div>
                {/* Описание */}
                <p className="text-sm text-slate-500 leading-relaxed pt-3 border-t border-slate-800/50 mt-4">
                    {stat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}