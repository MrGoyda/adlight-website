"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Play } from "lucide-react";
import ConsultationModal from "@/components/ConsultationModal";
import QuizModal from "@/components/QuizModal";
import VideoModal from "@/components/VideoModal";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/ui/FadeIn";

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
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // Слайдер картинок: собираем премиальные работы без визуального шума
  const sliderImages = [
    ...lettersImages.slice(0, 3),
    ...largeImages.slice(0, 3),
    ...interiorImages.slice(0, 2)
  ].filter(Boolean);

  // Надежные фоллбэки с реальными проектами
  if (sliderImages.length === 0) {
    sliderImages.push(
      "/images/portfolio/arustone/arustone-01.webp",
      "/images/portfolio/kmg/kmg-01.webp",
      "/images/portfolio/aigelova-beauty/aigelova-beauty-01.webp",
      "/images/portfolio/family-care/family-care-01.webp"
    );
  }

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (sliderImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000); // Медленная смена каждые 5 секунд
    return () => clearInterval(interval);
  }, [sliderImages.length]);

  // URL видеоприветствия на Cloudflare Stream
  const videoUrl = "https://customer-k57fhnmtl06s1m6v.cloudflarestream.com/5d5b305d05486d34bfda7cda928dfa57/iframe";

  return (
    <>
      <section className="relative w-full py-16 lg:py-28 overflow-hidden border-b border-slate-200 flex items-center min-h-[calc(100vh-80px)] bg-white">
        {/* --- ВИЗУАЛЬНЫЕ ДЕКОРАТИВНЫЕ ЭЛЕМЕНТЫ (Чертежная сетка и приглушенные градиенты) --- */}
        {/* Приглушенные Apple-градиенты */}
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-orange-500/[0.06] blur-[160px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/[0.04] blur-[160px] rounded-full pointer-events-none"></div>
        
        {/* Полупрозрачная чертежная сетка (Blueprint grid с основными рамками 100px и миллиметровыми делениями 20px) */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(15, 23, 42, 0.12) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(15, 23, 42, 0.12) 1px, transparent 1px),
              linear-gradient(to right, rgba(15, 23, 42, 0.04) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(15, 23, 42, 0.04) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px'
          }}
        />

        <div className="container mx-auto px-4 grid lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
          
          {/* ЛЕВАЯ КОЛОНКА: SEO/AI-ОПТИМИЗИРОВАННЫЙ ТЕКСТ (7 колонок) */}
          <div className="lg:col-span-7 space-y-8 flex flex-col justify-center text-left">
            
            {/* ПРЕМИУМ-ПЛАШКА (Более 300 отзывов, 4.8 рейтинг, Лучшие) */}
            <FadeIn>
              <div className="inline-flex flex-wrap items-center gap-3 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-md shadow-slate-100 text-xs font-bold text-slate-800 w-fit leading-tight">
                <div className="flex items-center gap-1 text-orange-500 font-extrabold text-sm">
                  ★★★★★
                </div>
                <span className="text-slate-600">более 300 отзывов</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                <span className="text-slate-950 font-black">Рейтинг 4.8</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                <span className="text-orange-655 font-black">Лучшие по Астане и регионам</span>
              </div>
            </FadeIn>
            
            {/* Восхитительный H1, оптимизированный под SEO и ИИ (AISO) */}
            <FadeIn delay={80}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-[68px] font-black text-slate-950 leading-[1.05] tracking-tight">
                Рекламное агентство <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-600 to-red-600">
                  полного цикла в Астане
                </span>
              </h1>
            </FadeIn>
            
            {/* Уникальный, продающий подзаголовок */}
            <FadeIn delay={160}>
              <p className="text-slate-700 text-base md:text-lg lg:text-xl max-w-xl leading-relaxed font-semibold">
                Оформляем фасады и изготавливаем световые вывески любой сложности от 3 дней. Беремся за нестандартные задачи и реализуем проекты по высшему технологическому стандарту СНиП РК с гарантией в договоре.
              </p>
            </FadeIn>
            
            {/* Кнопки действия (Подобрать услугу, Оставить заявку, Видеоприветствие с пружиной и бликом) */}
            <FadeIn delay={240}>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-2">
              <Button 
                onClick={() => setIsQuizOpen(true)}
                variant="solid"
                size="xl"
                className="bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 hover:from-orange-500 hover:to-red-400 border border-orange-500/20 shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 h-14 rounded-2xl text-base px-8 text-white font-bold"
              >
                Подобрать услугу
              </Button>
              
              <Button 
                onClick={() => setIsModalOpen(true)}
                variant="lightOutline"
                size="xl"
                className="h-14 rounded-2xl text-base px-8 border-slate-250 shadow-md hover:shadow-lg transition-all duration-300"
              >
                Оставить заявку
              </Button>

              <Button 
                onClick={() => setIsVideoOpen(true)}
                variant="lightGlass"
                size="xl"
                className="h-14 rounded-2xl text-base pl-4 pr-7 border-slate-200 shadow-md hover:shadow-lg transition-all duration-300"
                leftIcon={
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center relative">
                     <Play className="w-3.5 h-3.5 text-white fill-current ml-0.5"/>
                     <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-30"></div>
                  </div>
                }
              >
                Видеоприветствие
              </Button>
            </div>
            </FadeIn>
          </div>
          
          {/* ПРАВАЯ КОЛОНКА: УНИКАЛЬНЫЙ СЛИЯЮЩИЙСЯ СЛАЙДЕР БЕЗ ЛИШНЕГО ШУМА (5 колонок) */}
          <FadeIn direction="left" delay={100} className="lg:col-span-5 relative w-full aspect-[4/5] sm:max-w-md lg:max-w-none mx-auto">
          <div className="w-full h-full rounded-3xl overflow-hidden border border-slate-200/80 shadow-[0_30px_70px_rgba(0,0,0,0.12)] relative bg-slate-50">
                {sliderImages.map((src, idx) => (
                  <div 
                    key={src}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out transform-gpu will-change-[opacity] ${
                      idx === currentSlide 
                        ? "opacity-100 z-10" 
                        : "opacity-0 z-0 pointer-events-none"
                    }`}
                  >
                     <Image 
                        src={src}
                        alt="Выполненные проекты ADLight наружная реклама"
                        fill
                        className="object-cover rounded-3xl transform-gpu"
                        sizes="(max-width: 1024px) 100vw, 35vw"
                        priority={idx === 0}
                     />
                  </div>
                ))}
                
                {/* Мягкий градиент затемнения по нижнему краю для интеграции в темную тему */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent pointer-events-none z-20"></div>
             </div>
          </FadeIn>

        </div>
      </section>

      {/* МОДАЛЬНОЕ ОКНО КОНСУЛЬТАЦИИ */}
      <ConsultationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        source="Главная (Hero Section - Заявка)"
      />

      {/* ИНТЕРАКТИВНЫЙ КВИЗ-ПОДБОР УСЛУГИ */}
      <QuizModal 
        isOpen={isQuizOpen} 
        onClose={() => setIsQuizOpen(false)} 
      />

      {/* ВИДЕОПРИВЕТСТВИЕ С CLOUDFLARE */}
      <VideoModal 
        isOpen={isVideoOpen} 
        onClose={() => setIsVideoOpen(false)} 
        videoUrl={videoUrl} 
      />
    </>
  );
}