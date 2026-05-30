// app/services/volume-letters/_components/VolumeLettersHero.tsx

import Link from "next/link";
import { ChevronRight, FileCheck } from "lucide-react";
import HeroSlideshow from "@/components/HeroSlideshow";
import HeroButtons from "@/components/HeroButtons";

interface VolumeLettersHeroProps {
  heroImages: string[];
}

export default function VolumeLettersHero({ heroImages }: VolumeLettersHeroProps) {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden border-b border-slate-800">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F172A]/80 to-[#0F172A]"></div>
      {/* Оранжевый акцент */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
         {/* Хлебные крошки */}
         <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-white transition">Главная</Link>
            <ChevronRight className="w-3 h-3"/>
            <Link href="/services" className="hover:text-white transition">Услуги</Link>
            <ChevronRight className="w-3 h-3"/>
            <span className="text-orange-500 font-medium">Объемные буквы</span>
         </div>

         <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
               <div className="inline-block px-4 py-1.5 mb-6 text-xs font-bold text-orange-500 bg-orange-500/10 border border-orange-500/20 rounded-full uppercase tracking-wider">
                  Производство в Астане
               </div>
               <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                  Объемные буквы <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">любой сложности</span>
               </h1>
               <p className="text-gray-400 text-lg mb-8 leading-relaxed max-w-xl">
                  От бюджетных решений до премиальных вывесок из цельноклееного премиум-акрила. 
                  Делаем ярко, надежно и <strong>строго по Дизайн-коду</strong> города.
               </p>
               
               <HeroButtons source="Услуга: Объемные буквы (Общая)" priceColor="orange" />
            </div>

            {/* Визуал: СЛАЙДЕР */}
            <div className="relative aspect-square rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden group shadow-2xl">
               <HeroSlideshow images={heroImages} />
               
               <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none"></div>
               <div className="absolute bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur border border-slate-700 p-4 rounded-xl flex items-center gap-4 pointer-events-none z-20">
                  <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center text-green-500"><FileCheck className="w-6 h-6"/></div>
                  <div><div className="text-white font-bold">Гарантия качества</div><div className="text-gray-400 text-xs">Договор, Сроки, Документы</div></div>
               </div>
            </div>
         </div>
      </div>
    </section>
  );
}
