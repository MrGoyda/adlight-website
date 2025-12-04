"use client";

import Link from "next/link";
import Image from "next/image";
import { 
  Zap, 
  ShieldCheck, 
  Settings, 
  PaintBucket, 
  Factory, 
  ArrowRight,
  Cpu
} from "lucide-react";

const FEATURES = [
  {
    icon: <Zap className="w-6 h-6"/>,
    title: "Запас мощности +30%",
    desc: "Ставим блоки питания с запасом. Вывеска не перегреется и прослужит 50 000 часов.",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10"
  },
  {
    icon: <PaintBucket className="w-6 h-6"/>,
    title: "Покраска Flame",
    desc: "Автомобильная технология покраски. Устойчива к сколам, морозу -40°C и выцветанию.",
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    icon: <Settings className="w-6 h-6"/>,
    title: "ЧПУ Точность",
    desc: "Лазерная резка акрила и металла. Идеальная геометрия букв без зазоров и кривых стыков.",
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  },
  {
    icon: <ShieldCheck className="w-6 h-6"/>,
    title: "Договор и Гарантия",
    desc: "Юридическая ответственность за сроки и качество. Паспорт изделия при сдаче.",
    color: "text-green-500",
    bg: "bg-green-500/10"
  }
];

export default function ProductionSection() {
  return (
    <section className="py-24 bg-[#0B1120] relative overflow-hidden border-y border-slate-800">
      {/* Фоновый паттерн (Сетка) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* ЛЕВАЯ КОЛОНКА: ТЕКСТ И ФИЧИ */}
          <div className="space-y-8">
             <div data-aos="fade-right">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold uppercase tracking-wider mb-6">
                   <Factory className="w-4 h-4"/> Собственный цех
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                   Мы не перекупы. <br/>
                   Мы — <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">производители.</span>
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed">
                   Полный цикл производства в Астане: от фрезеровки листа до пайки последнего диода. Мы контролируем каждый этап, поэтому уверены в качестве и не срываем сроки.
                </p>
             </div>

             <div className="grid sm:grid-cols-2 gap-4">
                {FEATURES.map((item, i) => (
                   <div 
                     key={i} 
                     data-aos="fade-up" 
                     data-aos-delay={i * 100}
                     className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-600 transition group"
                   >
                      <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                         {item.icon}
                      </div>
                      <h4 className="text-white font-bold text-lg mb-2">{item.title}</h4>
                      <p className="text-slate-400 text-xs leading-relaxed">
                         {item.desc}
                      </p>
                   </div>
                ))}
             </div>

             <div data-aos="fade-up" data-aos-delay="400" className="pt-4">
                <Link 
                   href="/calculator" 
                   className="inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 font-bold text-lg rounded-xl hover:bg-orange-500 hover:text-white transition-all shadow-xl shadow-white/5 active:scale-95"
                >
                   Рассчитать стоимость <ArrowRight className="w-5 h-5"/>
                </Link>
             </div>
          </div>

          {/* ПРАВАЯ КОЛОНКА: ФОТО ЦЕХА */}
          <div data-aos="fade-left" className="relative">
             <div className="relative h-[600px] rounded-3xl overflow-hidden border border-slate-700 bg-slate-800 shadow-2xl group">
                {/* Основное фото */}
                <Image 
                   src="/ceh.jpg" 
                   alt="Цех наружной рекламы ADLight"
                   fill
                   className="object-cover transition duration-1000 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                   sizes="(max-width: 1024px) 100vw, 50vw" // <--- ИСПРАВЛЕНИЕ ОШИБКИ
                />
                
                {/* Градиент снизу */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent"></div>

                {/* ПЛАШКА "LIVE" */}
                <div className="absolute top-6 left-6 bg-red-500/90 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg animate-pulse">
                   <span className="w-2 h-2 bg-white rounded-full"></span>
                   LIVE PRODUCTION
                </div>

                {/* ПЛАШКА С АДРЕСОМ */}
                <div className="absolute bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur border border-slate-600 p-5 rounded-2xl">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shrink-0">
                         <Cpu className="w-6 h-6"/>
                      </div>
                      <div>
                         <div className="text-white font-bold text-lg">Цех в Астане</div>
                         <div className="text-slate-400 text-sm">ул. Акжол 110 (Район Байконур)</div>
                      </div>
                   </div>
                   <div className="mt-4 flex justify-between items-center border-t border-slate-700 pt-3">
                      <div className="text-xs text-slate-500">Оборудование:</div>
                      <div className="text-xs text-white font-mono">Лазер / Фрезер / Бортогиб</div>
                   </div>
                </div>
             </div>

             {/* ДЕКОРАТИВНЫЙ ЭЛЕМЕНТ СЗАДИ */}
             <div className="absolute -top-10 -right-10 w-64 h-64 bg-orange-500/20 blur-[80px] rounded-full pointer-events-none"></div>
          </div>

        </div>
      </div>
    </section>
  );
}