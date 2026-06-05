// app/services/volume-letters/_components/VolumeLettersHero.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, FileCheck, Calculator, MessageCircle } from "lucide-react";
import HeroSlideshow from "@/components/HeroSlideshow";
import Button from "@/components/ui/Button";
import ConsultationModal from "@/components/ConsultationModal";
import { VOLUME_LETTERS_DICT } from "@/dictionaries/services/volume-letters";

interface VolumeLettersHeroProps {
  heroImages: string[];
}

export default function VolumeLettersHero({ heroImages }: VolumeLettersHeroProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const heroData = VOLUME_LETTERS_DICT.hero;

  return (
    <section id="hero" className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden border-b border-slate-200/80 bg-slate-50">
      {/* Premium Apple Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f080_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f080_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/80 to-slate-50"></div>
      
      {/* Soft Orange Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Breadcrumbs */}
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500 mb-8 font-medium">
          <Link href="/" className="hover:text-slate-900 transition-colors">{VOLUME_LETTERS_DICT.breadcrumbs.home}</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/services" className="hover:text-slate-900 transition-colors">{VOLUME_LETTERS_DICT.breadcrumbs.services}</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-orange-600 font-semibold">{heroData.title}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <div className="inline-block px-4 py-1.5 mb-6 text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 rounded-full uppercase tracking-wider">
              {heroData.badge}
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
              {heroData.title} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
                {heroData.titleAccent}
              </span>
            </h1>
            <p className="text-slate-600 text-lg mb-8 leading-relaxed max-w-xl">
              {heroData.description}
            </p>
            
            {/* Interactive Actions using `@/components/ui/Button` */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="solid" 
                size="lg" 
                href="/calculator"
                leftIcon={<Calculator className="w-5 h-5" />}
                className="w-full sm:w-auto"
              >
                {heroData.btnCalculate}
              </Button>
              <Button 
                variant="lightOutline" 
                size="lg" 
                onClick={() => setIsModalOpen(true)}
                leftIcon={<MessageCircle className="w-5 h-5 text-green-600" />}
                className="w-full sm:w-auto"
              >
                {heroData.btnRequest}
              </Button>
            </div>
          </div>

          {/* Visual: SLIDESHOW */}
          <div className="relative aspect-square rounded-3xl bg-slate-100 border border-slate-200/80 overflow-hidden group shadow-xl">
            <HeroSlideshow images={heroImages} />
            
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none"></div>
            <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md border border-slate-200/80 p-4 rounded-2xl flex items-center gap-4 pointer-events-none z-20 shadow-lg">
              <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center text-green-600 shrink-0">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="text-slate-900 font-bold text-base">{heroData.badgeContract}</div>
                <div className="text-slate-500 text-xs font-medium">{heroData.badgeContractDesc}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* consultation modal integration */}
      <ConsultationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        source="Услуга: Объемные буквы (Общая)"
        title={heroData.modalTitle}
        subtitle={heroData.modalSubtitle}
        buttonText={heroData.modalButton}
      />
    </section>
  );
}
