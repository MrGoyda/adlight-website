// app/services/volume-letters/[slug]/_components/FaceLitHero.tsx
'use client';

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, CheckCircle, Gem, Calculator, MessageCircle } from "lucide-react";
import HeroSlideshow from "@/components/HeroSlideshow";
import Button from "@/components/ui/Button";
import ConsultationModal from "@/components/ConsultationModal";
import { VolumeLetterDetailData } from "@/dictionaries/services/volume-letters";

interface FaceLitHeroProps {
  data: VolumeLetterDetailData;
  displayHeroImages: string[];
}

export default function FaceLitHero({ data, displayHeroImages }: FaceLitHeroProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden border-b border-slate-200/80 bg-slate-50">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/80 to-slate-50"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Хлебные крошки */}
        <nav className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500 mb-8 font-medium" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-slate-950 transition-colors">Главная</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400"/>
          <Link href="/services" className="hover:text-slate-950 transition-colors">Услуги</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400"/>
          <Link href="/services/volume-letters" className="hover:text-slate-950 transition-colors">Объемные буквы</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400"/>
          <span className="text-orange-600 font-semibold">{data.title}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Текст */}
          <div>
            <div className="inline-block px-4 py-1.5 mb-6 text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 rounded-full uppercase tracking-wider">
              {data.badge || "Технология 2026"}
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-950 mb-6 leading-tight tracking-tight">
              {data.title}
            </h1>
            <p className="text-slate-600 text-lg mb-8 leading-relaxed max-w-xl">
              {data.subtitle}
            </p>
            
            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3 text-slate-700 font-semibold">
                <CheckCircle className="w-5 h-5 text-green-600 shrink-0"/> Гарантия соответствия Дизайн-коду Астаны
              </li>
              <li className="flex items-center gap-3 text-slate-700 font-semibold">
                <CheckCircle className="w-5 h-5 text-green-600 shrink-0"/> Немецкие акриловые материалы Plexiglas GS
              </li>
              <li className="flex items-center gap-3 text-slate-700 font-semibold">
                <CheckCircle className="w-5 h-5 text-green-600 shrink-0"/> Собственный сертифицированный цех в Астане
              </li>
            </ul>

            {/* Фирменные кнопки Button в светлом стиле */}
            <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
              <Button 
                href="/calculator" 
                variant="solid" 
                size="lg"
                leftIcon={<Calculator className="w-5 h-5"/>}
                className="shadow-lg shadow-orange-600/10 hover:shadow-xl hover:shadow-orange-600/20 transition-all duration-300"
              >
                Рассчитать стоимость
              </Button>
              <Button 
                onClick={() => setIsModalOpen(true)}
                variant="lightOutline" 
                size="lg"
                leftIcon={<MessageCircle className="w-5 h-5 text-green-600"/>}
              >
                Оставить заявку
              </Button>
            </div>
          </div>

          {/* Слайдер с тёмной подложкой для контраста подсветки */}
          <div className="relative aspect-square rounded-3xl bg-slate-950 border border-slate-900 overflow-hidden group shadow-[0_25px_60px_rgba(0,0,0,0.2)]">
            <HeroSlideshow images={displayHeroImages} />
            
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 pointer-events-none"></div>
            <div className="absolute bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-4 rounded-2xl flex items-center gap-4 pointer-events-none z-20 shadow-lg">
              <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center text-orange-500 shrink-0"><Gem className="w-6 h-6"/></div>
              <div>
                <div className="text-white font-bold text-base">Премиальное качество</div>
                <div className="text-slate-400 text-xs font-medium">Гарантия 24 месяца по официальному договору</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConsultationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        source={`Hero Section: ${data.title}`}
        title={`Заявка на ${data.title}`}
        subtitle={`Оставьте контакты. Рассчитаем стоимость производства конструкции "${data.title}" за 15 минут.`}
        buttonText="Получить расчет"
      />
    </section>
  );
}
