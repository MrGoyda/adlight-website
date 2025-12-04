"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import HeroGrid from "@/components/HeroGrid";
import ConsultationModal from "@/components/ConsultationModal";

interface HeroSectionProps {
  lettersImages: string[];
  largeImages: string[];
  interiorImages: string[];
  navImages: string[];
}

export default function HeroSection({ 
  lettersImages, 
  largeImages, 
  interiorImages, 
  navImages 
}: HeroSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className="relative w-full py-16 lg:py-24 overflow-hidden border-b border-slate-800 flex items-center min-h-[calc(100vh-64px)]">
        <div className="absolute top-0 right-0 w-2/3 h-full bg-orange-600/10 blur-[150px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-blue-600/5 blur-[150px] rounded-full pointer-events-none"></div>
        
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
          
          {/* ТЕКСТ */}
          <div className="space-y-8 flex flex-col justify-center">
            <div data-aos="fade-up" className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-sm font-medium w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              Работаем в Астане и области
            </div>
            
            <h1 data-aos="fade-up" data-aos-delay="100" className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight">
              Производство рекламных конструкций<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              полного цикла.
              </span>
            </h1>
            
            <p data-aos="fade-up" data-aos-delay="200" className="text-gray-400 text-lg md:text-xl max-w-lg leading-relaxed">
              Комплексное оформление фасадов, премиальные вывески и архитектурная подсветка. Берем на себя сложные технические задачи, чтобы ваш бизнес был заметен.
            </p>
            
            <div data-aos="fade-up" data-aos-delay="300" className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link href="/calculator" className="h-14 px-8 flex items-center justify-center bg-orange-600 rounded-xl text-white font-bold text-lg hover:bg-orange-700 transition shadow-lg shadow-orange-900/20 hover:scale-105 active:scale-95">
                Рассчитать стоимость
              </Link>
              
              {/* КНОПКА ОТКРЫТИЯ МОДАЛКИ */}
              <button 
                onClick={() => setIsModalOpen(true)}
                className="h-14 px-8 flex items-center justify-center border border-slate-700 rounded-xl text-white font-medium hover:bg-slate-800 transition gap-2"
              >
                <MessageCircle className="w-5 h-5 text-green-500"/>
                Задать вопрос
              </button>
            </div>
          </div>
          
          {/* ЖИВАЯ СЕТКА */}
          <div className="relative w-full aspect-square lg:h-auto" data-aos="fade-left">
             <div className="absolute inset-0 bg-orange-500/5 blur-3xl -z-10 rounded-full transform rotate-12"></div>
             <HeroGrid 
                imagesLetters={lettersImages}
                imagesLarge={largeImages}
                imagesInterior={interiorImages}
                imagesNav={navImages}
             />
          </div>

        </div>
      </section>

      {/* САМА МОДАЛКА */}
      <ConsultationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        source="Главная (Hero Section)"
      />
    </>
  );
}