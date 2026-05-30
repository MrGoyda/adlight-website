// components/services/ServicesHero.tsx

import Link from "next/link";
import { Store, Zap, Building, ChevronRight } from "lucide-react";

export default function ServicesHero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020617]/80 to-[#020617]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
         {/* ХЛЕБНЫЕ КРОШКИ */}
         <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-white transition">Главная</Link>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4"/>
            <span className="text-blue-500 font-medium">Услуги</span>
         </div>

         <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Текст */}
            <div className="max-w-2xl relative z-20">
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-[0.95] tracking-tight">
                   Комплексное оформление <br/>
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">бизнеса в Астане</span>
                </h1>
                <p className="text-gray-400 text-lg md:text-xl mb-12 leading-relaxed border-l-2 border-blue-500/30 pl-6">
                   От таблички на дверь до крышной установки. Собственное производство. Делаем рекламу, которая переживет зиму и пройдет согласование в Акимате.
                </p>
                
                {/* Навигация (Якоря) */}
                <div className="flex flex-wrap gap-3">
                    <a href="#facade" className="group px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-orange-500/50 transition flex items-center gap-3 text-white text-sm sm:text-base">
                       <div className="p-1.5 bg-orange-500/20 rounded-lg text-orange-500 group-hover:text-white group-hover:bg-orange-500 transition"><Store className="w-4 h-4"/></div>
                       <span className="font-bold">Фасадные</span>
                    </a>
                    <a href="#interior" className="group px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/50 transition flex items-center gap-3 text-white text-sm sm:text-base">
                       <div className="p-1.5 bg-purple-500/20 rounded-lg text-purple-500 group-hover:text-white group-hover:bg-purple-500 transition"><Zap className="w-4 h-4"/></div>
                       <span className="font-bold">Интерьер</span>
                    </a>
                    <a href="#scale" className="group px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/50 transition flex items-center gap-3 text-white text-sm sm:text-base">
                       <div className="p-1.5 bg-blue-500/20 rounded-lg text-blue-500 group-hover:text-white group-hover:bg-blue-500 transition"><Building className="w-4 h-4"/></div>
                       <span className="font-bold">Крупные</span>
                    </a>
                </div>
            </div>

            {/* 3D Город (Скрыт на моб) */}
            <div className="hidden lg:flex relative h-[500px] w-full items-center justify-center">
                <div className="absolute inset-0 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none"></div>
                <img 
                  src="/images/pages/services-hero.webp" 
                  alt="Комплексное оформление города наружной рекламой"
                  className="relative w-full h-full object-contain drop-shadow-2xl z-10"
                />
            </div>
         </div>
      </div>
    </section>
  );
}
