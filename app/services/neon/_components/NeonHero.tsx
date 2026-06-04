// app/services/neon/_components/NeonHero.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, FileCheck, Calculator, MessageCircle } from "lucide-react";
import HeroSlideshow from "@/components/HeroSlideshow";
import Button from "@/components/ui/Button";
import ConsultationModal from "@/components/ConsultationModal";
import { neonDetails } from "@/dictionaries/services/details/neon";

interface NeonHeroProps {
  heroImages: string[];
}

export default function NeonHero({ heroImages }: NeonHeroProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <header id="hero" className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden border-b border-slate-200/80 bg-slate-50">
      {/* Premium Apple Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f080_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f080_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/80 to-slate-50"></div>
      
      {/* Soft Orange Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-4 max-w-[1400px] relative z-10">
        {/* Breadcrumbs (SEO BreadcrumbList semantic markup helper) */}
        <nav aria-label="Хлебные крошки" className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500 mb-8 font-medium">
          <Link href="/" className="hover:text-slate-900 transition-colors">Главная</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/services" className="hover:text-slate-900 transition-colors">Услуги</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-orange-600 font-semibold">{neonDetails.badge}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <div className="inline-block px-4 py-1.5 mb-6 text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 rounded-full uppercase tracking-wider">
              {neonDetails.heroTag}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
              Неоновые вывески <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-600 to-red-600">
                из гибкого LED неона
              </span>
            </h1>
            <p className="text-slate-600 text-lg mb-8 leading-relaxed max-w-xl">
              {neonDetails.subtitle} Производство ярких неоновых надписей, логотипов и рисунков на прочной подложке. 100% безопасное напряжение 12V и срок службы до 5 лет.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="solid" 
                size="lg" 
                href="/calculator"
                leftIcon={<Calculator className="w-5 h-5" />}
                className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white border-none"
              >
                Рассчитать неон
              </Button>
              <Button 
                variant="lightOutline" 
                size="lg" 
                onClick={() => setIsModalOpen(true)}
                leftIcon={<MessageCircle className="w-5 h-5 text-green-600" />}
                className="w-full sm:w-auto border-slate-350 text-slate-700 hover:bg-slate-100"
              >
                Консультация дизайнера
              </Button>
            </div>
          </div>

          {/* Visual: SLIDESHOW */}
          <div className="relative aspect-square rounded-3xl bg-slate-100 border border-slate-200/80 overflow-hidden group shadow-xl">
            <HeroSlideshow images={heroImages} />
            
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none"></div>
            <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md border border-slate-200/80 p-4 rounded-2xl flex items-center gap-4 pointer-events-none z-20 shadow-lg">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 shrink-0">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="text-slate-900 font-bold text-base">Безопасность и Долговечность</div>
                <div className="text-slate-500 text-xs font-medium">Силиконовый Flex неон 2.0 без нагрева и шума</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConsultationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        source="Услуга: Неоновые вывески"
        title="Заказать консультацию дизайнера неона"
        subtitle="Оставьте ваши контакты, и мы перезвоним для обсуждения дизайна, шрифта и размеров вашей неоновой надписи."
        buttonText="Жду звонка"
      />
    </header>
  );
}
