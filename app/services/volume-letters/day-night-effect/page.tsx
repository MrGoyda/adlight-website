"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, 
  ChevronRight, 
  Calculator, 
  MessageCircle, 
  CheckCircle, 
  Sun, 
  Moon, 
  Zap,          
  Eye,          
  Layers,       
  Scissors,     
  Car,          
  ScissorsLineDashed, 
  Scale,        
  ShieldCheck,
  MoveHorizontal
} from "lucide-react";

// --- ИМПОРТ КОМПОНЕНТОВ ---
import CallToAction from "@/components/CallToAction";
import ServicesCarousel from "@/components/ServicesCarousel";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import ProjectsBento from "@/components/ProjectsBento";

const PAGE_DATA = {
  title: "Световые буквы «День / Ночь»",
  subtitle: "Черный глянец днем, ярко-белое свечение ночью. Магия технологий для стильного брендинга.",
  price: "700",
  images: {
    day: "/images/letters/day-night-effect-day.png",
    night: "/images/letters/day-night-effect-night.png"
  }
};

// --- КОМПОНЕНТ СЛАЙДЕРА СРАВНЕНИЯ (ИСПРАВЛЕННЫЙ) ---
const CompareSlider = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Обработчик движения (общий для мыши и тача)
  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const { left, width } = containerRef.current.getBoundingClientRect();
    const position = ((clientX - left) / width) * 100;
    setSliderPosition(Math.min(100, Math.max(0, position)));
  }, []);

  // События для window (чтобы не терять фокус при выходе за пределы блока)
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) handleMove(e.clientX);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (isDragging) handleMove(e.touches[0].clientX);
    };
    const onUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('mouseup', onUp);
      window.addEventListener('touchend', onUp);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
    };
  }, [isDragging, handleMove]);

  // Старт перетаскивания
  const startDrag = (clientX: number) => {
    setIsDragging(true);
    handleMove(clientX);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden cursor-ew-resize border border-slate-700 shadow-2xl shadow-white/5 select-none group touch-none"
      onMouseDown={(e) => startDrag(e.clientX)}
      onTouchStart={(e) => startDrag(e.touches[0].clientX)}
    >
      {/* ИЗОБРАЖЕНИЕ 1 (НОЧЬ) - НИЖНИЙ СЛОЙ */}
      <div className="absolute inset-0 pointer-events-none">
        <Image 
            src={PAGE_DATA.images.night} 
            alt="Ночной вид" 
            fill 
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            draggable={false}
        />
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur px-3 py-1 rounded text-xs font-bold text-white flex items-center gap-2 z-10">
            <Moon className="w-3 h-3"/> Ночь (Светится)
        </div>
      </div>

      {/* ИЗОБРАЖЕНИЕ 2 (ДЕНЬ) - ВЕРХНИЙ СЛОЙ С CLIP-PATH */}
      {/* FIX: Используем clip-path вместо ширины div, чтобы картинка не сжималась */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ 
           clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` 
        }}
      >
        <Image 
            src={PAGE_DATA.images.day} 
            alt="Дневной вид" 
            fill 
            className="object-cover" // Картинка всегда на 100% ширины
            sizes="(max-width: 768px) 100vw, 50vw"
            draggable={false}
        />
        <div className="absolute top-4 left-4 bg-white/80 backdrop-blur px-3 py-1 rounded text-xs font-bold text-black flex items-center gap-2 z-10">
            <Sun className="w-3 h-3"/> День (Черный)
        </div>
      </div>

      {/* ПОЛЗУНОК */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(0,0,0,0.8)] z-30 cursor-ew-resize"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-2xl text-slate-900 transition-transform ${isDragging ? 'scale-110' : 'scale-100'}`}>
            <MoveHorizontal className="w-6 h-6"/>
        </div>
      </div>
      
      {/* ПОДСКАЗКА (Исчезает при клике) */}
      {!isDragging && (
        <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none animate-pulse">
            <span className="bg-black/50 text-white text-xs px-4 py-2 rounded-full backdrop-blur border border-white/10">
                ↔ Потяните слайдер
            </span>
        </div>
      )}
    </div>
  );
};

export default function DayNightLettersPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] font-sans selection:bg-white/30">
      
      {/* 1. PRODUCT HERO */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F172A]/90 to-[#0F172A]"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
           
           <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 mb-8">
              <Link href="/" className="hover:text-white transition">Главная</Link>
              <ChevronRight className="w-3 h-3"/>
              <Link href="/services/volume-letters" className="hover:text-white transition">Объемные буквы</Link>
              <ChevronRight className="w-3 h-3"/>
              <span className="text-white font-medium">День / Ночь</span>
           </div>

           <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div>
                 <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-bold text-white bg-white/10 border border-white/20 rounded-full uppercase tracking-wider">
                    <Sun className="w-4 h-4"/> Технология Oracal 8870
                 </div>
                 <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    {PAGE_DATA.title}
                 </h1>
                 <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                    {PAGE_DATA.subtitle}
                 </p>
                 
                 <ul className="space-y-3 mb-10">
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-white"/> Решение для брендов с черным логотипом
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-white"/> Специальная перфорированная пленка
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-white"/> Идеальная читаемость 24 часа в сутки
                    </li>
                 </ul>

                 <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/calculator" className="flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-gray-200 transition shadow-lg shadow-white/10 active:scale-95">
                       <Calculator className="w-5 h-5"/> Заказать расчет
                    </Link>
                    <a href="https://wa.me/77071356701" target="_blank" className="flex items-center justify-center gap-2 border border-slate-700 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition">
                       <MessageCircle className="w-5 h-5 text-green-500"/> Задать вопрос
                    </a>
                 </div>
              </div>

              <div className="relative">
                 <CompareSlider />
              </div>
           </div>
        </div>
      </section>

      {/* 2. PROBLEM & SOLUTION */}
      <section className="py-24 bg-slate-950">
         <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
               <h2 className="text-3xl font-bold text-white mb-6">Черный не светится?</h2>
               <p className="text-gray-400 text-lg leading-relaxed mb-8">
                  Черный цвет — это стиль. Но в рекламе это проблема: он не пропускает свет. 
                  Раньше приходилось выбирать: либо контражур, либо нечитаемая ночью вывеска.
               </p>
               <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 rounded-3xl border border-slate-700 flex flex-col md:flex-row items-center gap-6">
                  <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center shrink-0 shadow-[0_0_30px_white]">
                     <Zap className="w-8 h-8"/>
                  </div>
                  <div className="text-left">
                     <h3 className="text-white font-bold text-xl mb-2">Решение от ADLight</h3>
                     <p className="text-gray-400 text-sm">
                        Технология «День/Ночь». Ваша вывеска будет угольно-черной при солнечном свете и ярко-белой при включении подсветки. Никаких компромиссов.
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 3. THE SCIENCE */}
      <section className="py-24 bg-[#0F172A]">
         <div className="container mx-auto px-4">
            <div className="text-center mb-16">
               <h2 className="text-3xl font-bold text-white mb-4">Секрет в перфорации</h2>
               <p className="text-gray-400">Мы используем пленку Oracal 8870 (Германия) или 3M Scotchcal</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
               <div className="bg-white p-8 rounded-3xl text-slate-900 relative overflow-hidden shadow-xl">
                  <div className="absolute top-0 right-0 p-4"><Sun className="w-12 h-12 text-orange-500"/></div>
                  <h3 className="text-2xl font-bold mb-4">Днем: Черный</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                     Свет падает снаружи. Глаз видит поверхность пленки, которая имеет черный цвет. Микро-дырочки не видны с расстояния 1 метр.
                  </p>
                  <div className="mt-6 h-20 bg-black rounded-xl flex items-center justify-center text-white font-bold border border-slate-200">
                     ВЫВЕСКА
                  </div>
               </div>

               <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 relative overflow-hidden shadow-2xl shadow-white/5">
                  <div className="absolute top-0 right-0 p-4"><Moon className="w-12 h-12 text-blue-400"/></div>
                  <h3 className="text-2xl font-bold text-white mb-4">Ночью: Белый</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                     Свет идет изнутри. Он проходит сквозь тысячи микро-отверстий в пленке. Глаз смешивает потоки света, и буква воспринимается как светящаяся белым.
                  </p>
                  <div className="mt-6 h-20 bg-white rounded-xl flex items-center justify-center text-black font-bold shadow-[0_0_30px_rgba(255,255,255,0.5)]">
                     ВЫВЕСКА
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 4. SPECS & AUDIENCE */}
      <section className="py-24 bg-slate-950 border-y border-slate-800">
         <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16">
               
               <div>
                  <h3 className="text-2xl font-bold text-white mb-8">Важно знать при заказе</h3>
                  <div className="space-y-6">
                     <div className="flex gap-4">
                        <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500 shrink-0"><Zap className="w-6 h-6"/></div>
                        <div>
                           <h4 className="text-white font-bold mb-1">Сверхъяркие диоды</h4>
                           <p className="text-gray-400 text-sm">Пленка задерживает часть света. Чтобы пробить "сетку", мы ставим усиленные модули с повышенной светоотдачей.</p>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500 shrink-0"><Layers className="w-6 h-6"/></div>
                        <div>
                           <h4 className="text-white font-bold mb-1">Материалы</h4>
                           <p className="text-gray-400 text-sm">Лицо — акрил. Борт — не световой (черный пластик или металл), чтобы поддержать стиль.</p>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500 shrink-0"><Scissors className="w-6 h-6"/></div>
                        <div>
                           <h4 className="text-white font-bold mb-1">Не только черный</h4>
                           <p className="text-gray-400 text-sm">Технология работает и с другими цветами: темно-синий, зеленый, бордовый превращаются в белый.</p>
                        </div>
                     </div>
                  </div>
               </div>

               <div>
                  <h3 className="text-2xl font-bold text-white mb-8">Кому это нужно?</h3>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-[#0B1120] p-6 rounded-2xl border border-slate-800">
                        <Car className="w-8 h-8 text-white mb-3"/>
                        <h4 className="font-bold text-white">Автосалоны и СТО</h4>
                        <p className="text-xs text-gray-500 mt-1">Строгие логотипы</p>
                     </div>
                     <div className="bg-[#0B1120] p-6 rounded-2xl border border-slate-800">
                        <ScissorsLineDashed className="w-8 h-8 text-white mb-3"/>
                        <h4 className="font-bold text-white">Барбершопы</h4>
                        <p className="text-xs text-gray-500 mt-1">Брутальный стиль Black Star</p>
                     </div>
                     <div className="bg-[#0B1120] p-6 rounded-2xl border border-slate-800">
                        <Scale className="w-8 h-8 text-white mb-3"/>
                        <h4 className="font-bold text-white">Юристы</h4>
                        <p className="text-xs text-gray-500 mt-1">Строгость днем, заметность ночью</p>
                     </div>
                     <div className="bg-[#0B1120] p-6 rounded-2xl border border-slate-800">
                        <Eye className="w-8 h-8 text-white mb-3"/>
                        <h4 className="font-bold text-white">Сложные фасады</h4>
                        <p className="text-xs text-gray-500 mt-1">Где нельзя сделать контражур</p>
                     </div>
                  </div>
               </div>

            </div>
         </div>
      </section>

      {/* 5. ЦЕНА И РАСЧЕТ */}
      <section className="py-24 bg-[#0F172A]">
         <div className="container mx-auto px-4">
             <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center">
                 
                 <div className="md:w-1/2">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Стоимость</h2>
                    <p className="text-gray-400 mb-8">
                       Это дороже обычных букв из-за стоимости спец-пленки (она в 3-4 раза дороже обычной) и мощных диодов.
                    </p>
                    
                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                        <div className="flex items-center gap-3 text-white mb-2">
                           <Zap className="w-5 h-5 text-white"/>
                           <span className="font-bold">В цену включено:</span>
                        </div>
                        <ul className="text-gray-400 text-sm pl-8 list-disc space-y-1">
                           <li>Оригинальная пленка Oracal 8870</li>
                           <li>Усиленные линзованные модули</li>
                           <li>Герметичный блок питания</li>
                        </ul>
                    </div>
                 </div>

                 <div className="md:w-1/2 w-full">
                    <div className="bg-slate-900 rounded-3xl p-8 border border-slate-700 relative overflow-hidden">
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 blur-[60px] rounded-full"></div>
                        <h3 className="text-white font-bold mb-6 flex justify-between">
                            Пример: <span className="text-white bg-black px-2 rounded">"BLACK"</span> (5 букв)
                        </h3>
                        <div className="space-y-3 font-mono text-sm relative z-10">
                           <div className="flex justify-between text-gray-400">
                              <span>Высота:</span> <span className="text-white">40 см</span>
                           </div>
                           <div className="flex justify-between text-gray-400">
                              <span>Материал:</span> <span className="text-white">Акрил + Спец.пленка</span>
                           </div>
                           <div className="flex justify-between text-gray-400">
                              <span>Цена:</span> <span className="text-white">{PAGE_DATA.price} ₸/см</span>
                           </div>
                           <div className="h-px bg-slate-700 my-2"></div>
                           <div className="flex justify-between items-end pt-2">
                              <span className="text-gray-400">Итого:</span>
                              <span className="text-2xl font-bold text-white">140 000 ₸</span>
                           </div>
                        </div>
                        <Link href="/calculator" className="mt-6 w-full py-3 bg-white hover:bg-gray-200 text-black font-bold rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-white/10 relative z-10">
                            <Calculator className="w-4 h-4"/> Рассчитать проект
                        </Link>
                    </div>
                 </div>

             </div>
         </div>
      </section>

      {/* 6. SEO TEXT (ЖУРНАЛЬНЫЙ СТИЛЬ) */}
      <section className="py-20 bg-[#0B1120] border-t border-slate-800">
         <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto bg-slate-900/30 border border-slate-800 rounded-3xl p-8 md:p-12 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-white via-slate-500 to-white opacity-50"></div>
               <div className="grid md:grid-cols-3 gap-12">
                  <div className="md:col-span-1">
                     <h2 className="text-2xl font-bold text-white mb-4 leading-tight">
                        Технология День/Ночь в Астане
                     </h2>
                     <div className="w-12 h-1 bg-white rounded-full mb-6"></div>
                     <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                        Техническая справка
                     </p>
                  </div>
                  <div className="md:col-span-2 text-sm text-gray-400 leading-relaxed">
                     <p className="mb-4">
                        Уникальная технология производства вывесок с переменным цветом свечения. Компания ADLight использует оригинальные пленки Oracal серии 8870 (Translucent Film), обладающие эффектом односторонней прозрачности.
                     </p>
                     <p>
                        Благодаря микроперфорации мембраны, мы создаем вывески, которые соответствуют брендбуку (черный цвет) в дневное время, но обеспечивают 100% видимость ночью за счет белого свечения. Мы гарантируем равномерную прикатку пленки на широкоформатном ламинаторе.
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 7. OTHER COMPONENTS */}
      <ProjectsBento title="Наши работы" subtitle="Стильные проекты" />
      <ReviewsCarousel />
      <ServicesCarousel title="Другие виды" subtitle="Варианты исполнения" hiddenLink="/services/volume-letters"/>
      <CallToAction source="Услуга: День/Ночь" />

    </div>
  );
}