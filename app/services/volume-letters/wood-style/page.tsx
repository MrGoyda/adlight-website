"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, 
  ChevronRight, 
  Calculator, 
  MessageCircle, 
  CheckCircle, 
  Trees,        
  Brush,        
  Sun,          
  Moon,
  CloudRain,    
  Leaf,         
  Scissors,     
  Lightbulb,    
  Palette,
  Zap,
  Layers
} from "lucide-react";

// --- ИМПОРТ КОМПОНЕНТОВ ---
import CallToAction from "@/components/CallToAction";
import ServicesCarousel from "@/components/ServicesCarousel";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import ProjectsBento from "@/components/ProjectsBento";

// Данные страницы
const PAGE_DATA = {
  title: "Объемные буквы из дерева (Эко-стиль)",
  subtitle: "Живая фактура в мире пластика. Вывески, которые вызывают доверие и уют.",
  price: "350", 
  images: {
    day: "/images/letters/wood-style-day.png",
    night: "/images/letters/wood-style-night.png"
  }
};

// ТЕКСТУРЫ ДЕРЕВА (С КАРТИНКАМИ)
const WOOD_TEXTURES = {
  pine: { 
    name: "Натуральная сосна", 
    color: "#E4CFA5", 
    image: "/images/letters/wood-style-day.png" // <-- Новая картинка (пока заглушка)
  },
  oak: { 
    name: "Золотой Дуб", 
    color: "#C29A66", 
    image: "/images/letters/wood-style-day.png" 
  },
  walnut: { 
    name: "Темный Орех", 
    color: "#5C4033", 
    image: "/images/letters/wood-style-day.png" 
  },
  wenge: { 
    name: "Венге (Черное)", 
    color: "#2C2420", 
    image: "/images/letters/wood-style-day.png" 
  },
  graphite: { 
    name: "Графит (Краска)", 
    color: "#4B5563", 
    image: "/images/letters/wood-style-day.png" 
  },
};

type WoodType = keyof typeof WOOD_TEXTURES;

export default function WoodLettersPage() {
  const [isNightMode, setIsNightMode] = useState(true);
  const [selectedWood, setSelectedWood] = useState<WoodType>('pine');

  return (
    <div className="min-h-screen bg-[#0F172A] font-sans selection:bg-green-500/30">
      
      {/* 1. PRODUCT HERO */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F172A]/90 to-[#0F172A]"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-600/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
           
           <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 mb-8">
              <Link href="/" className="hover:text-white transition">Главная</Link>
              <ChevronRight className="w-3 h-3"/>
              <Link href="/services/volume-letters" className="hover:text-white transition">Объемные буквы</Link>
              <ChevronRight className="w-3 h-3"/>
              <span className="text-green-500 font-medium">Эко-стиль</span>
           </div>

           <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div>
                 <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/20 rounded-full uppercase tracking-wider">
                    <Leaf className="w-4 h-4"/> 100% Натурально
                 </div>
                 <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    {PAGE_DATA.title}
                 </h1>
                 <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                    {PAGE_DATA.subtitle}
                 </p>
                 
                 <ul className="space-y-3 mb-10">
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-green-500"/> Массив, Фанера, МДФ
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-green-500"/> Идеально для кофеен и ресепшн
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-green-500"/> Лазерная резка и ручная обработка
                    </li>
                 </ul>

                 <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/calculator" className="flex items-center justify-center gap-2 bg-green-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-700 transition shadow-lg shadow-green-900/20 active:scale-95">
                       <Calculator className="w-5 h-5"/> Рассчитать эко-вывеску
                    </Link>
                    <a href="https://wa.me/77071356701" target="_blank" className="flex items-center justify-center gap-2 border border-slate-700 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition">
                       <MessageCircle className="w-5 h-5 text-green-500"/> Задать вопрос
                    </a>
                 </div>
              </div>

              <div className="relative">
                 <div className="absolute top-4 right-4 z-20 bg-slate-900/80 backdrop-blur-md border border-white/10 p-1 rounded-full flex gap-1">
                    <button onClick={() => setIsNightMode(false)} className={`p-2 rounded-full transition-all ${!isNightMode ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                       <Sun className="w-5 h-5"/>
                    </button>
                    <button onClick={() => setIsNightMode(true)} className={`p-2 rounded-full transition-all ${isNightMode ? 'bg-green-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                       <Moon className="w-5 h-5"/>
                    </button>
                 </div>

                 <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-slate-700 relative shadow-2xl shadow-green-500/10 bg-slate-900">
                    <Image 
                       src={isNightMode ? PAGE_DATA.images.night : PAGE_DATA.images.day} 
                       alt="Деревянные буквы" 
                       fill 
                       className="object-cover transition-all duration-500"
                    />
                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-medium text-white border border-white/10">
                       {isNightMode ? "Вечерняя подсветка" : "Фактура днем"}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 2. CONCEPT */}
      <section className="py-24 bg-slate-950">
         <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
               <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 text-green-500 mb-6">
                  <Trees className="w-8 h-8"/>
               </div>
               <h2 className="text-3xl font-bold text-white mb-6">Природа в интерьере</h2>
               <p className="text-gray-400 text-lg leading-relaxed mb-8">
                  Деревянная вывеска работает на подсознание. Она говорит: <span className="text-white font-medium">"Здесь всё настоящее"</span>. Это лучший выбор для брендов, транслирующих экологичность: фермерских лавок, цветочных салонов и уютных ресторанов.
               </p>
               <p className="text-white font-medium text-lg">
                  Дерево контрастирует с холодным городским бетоном и стеклом, заставляя взгляд остановиться.
               </p>
            </div>

            {/* MATERIALS */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-[#0B1120] p-8 rounded-3xl border border-slate-800 hover:border-green-500/30 transition group">
                    <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mb-4 text-orange-300"><Layers className="w-6 h-6"/></div>
                    <h3 className="text-xl font-bold text-white mb-3">Березовая фанера</h3>
                    <p className="text-gray-400 text-sm mb-4">Слоеный материал, очень прочный. При лазерной резке торец остается темно-коричневым (обожженным), создавая графичный контур.</p>
                    <span className="text-xs font-bold text-green-500 uppercase tracking-wider">Бюджетно</span>
                </div>
                <div className="bg-[#0B1120] p-8 rounded-3xl border border-slate-800 hover:border-green-500/30 transition group">
                    <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mb-4 text-yellow-600"><Trees className="w-6 h-6"/></div>
                    <h3 className="text-xl font-bold text-white mb-3">Массив Сосны/Ясеня</h3>
                    <p className="text-gray-400 text-sm mb-4">Цельное дерево с красивым, ярко выраженным рисунком волокон. Стиль "кантри" или "рустик". Идеально под лак.</p>
                    <span className="text-xs font-bold text-yellow-500 uppercase tracking-wider">Стандарт</span>
                </div>
                <div className="bg-[#0B1120] p-8 rounded-3xl border border-slate-800 hover:border-green-500/30 transition group">
                    <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mb-4 text-amber-800"><Trees className="w-6 h-6"/></div>
                    <h3 className="text-xl font-bold text-white mb-3">Дуб и Орех</h3>
                    <p className="text-gray-400 text-sm mb-4">Благородные ценные породы. Тяжелые, прочные, дорогие. Для кабинетов руководителей и бутиков.</p>
                    <span className="text-xs font-bold text-purple-500 uppercase tracking-wider">Premium</span>
                </div>
            </div>
         </div>
      </section>

      {/* 3. TEXTURE PICKER (СМЕНА КАРТИНОК) */}
      <section className="py-24 bg-[#0F172A] relative overflow-hidden">
         <div className="container mx-auto px-4 relative z-10">
             <div className="flex flex-col lg:flex-row gap-12 items-center">
                 
                 <div className="lg:w-1/2">
                    <div className="inline-flex items-center gap-2 text-green-500 font-bold mb-4">
                        <Palette className="w-5 h-5"/> Финишное покрытие
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Подберите оттенок</h2>
                    <p className="text-gray-400 mb-8 text-lg">
                       Дерево без обработки выглядит бледно. Мы используем масла и морилки, чтобы придать нужный тон.
                    </p>
                    
                    <div className="bg-[#0B1120] p-6 rounded-2xl border border-slate-800">
                        <p className="text-white font-bold mb-4">Выберите пропитку:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                           {Object.entries(WOOD_TEXTURES).map(([key, val]) => (
                              <button 
                                 key={key}
                                 onClick={() => setSelectedWood(key as WoodType)}
                                 className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${selectedWood === key ? 'bg-slate-800 border-green-500' : 'border-slate-700 hover:bg-slate-800/50'}`}
                              >
                                 <div 
                                    className="w-8 h-8 rounded-full shadow-inner"
                                    style={{ backgroundColor: val.color }}
                                 ></div>
                                 <span className={`text-sm font-medium ${selectedWood === key ? 'text-white' : 'text-gray-400'}`}>
                                    {val.name}
                                 </span>
                              </button>
                           ))}
                        </div>
                    </div>
                 </div>

                 {/* Визуализация */}
                 <div className="lg:w-1/2 w-full">
                     <div className="relative aspect-video bg-[#1e293b] rounded-2xl border border-slate-700 flex items-center justify-center overflow-hidden shadow-2xl">
                        {/* Фон (Стена) */}
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')] opacity-20"></div>
                        
                        {/* Изображение выбранной текстуры (Без CSS-фильтров, реальные картинки) */}
                        {/* Используем object-contain, чтобы буква была целиком */}
                        <div className="relative z-10 w-3/4 h-3/4">
                           <Image 
                              src={WOOD_TEXTURES[selectedWood].image}
                              alt={WOOD_TEXTURES[selectedWood].name}
                              fill
                              className="object-contain drop-shadow-2xl transition-opacity duration-500"
                              // Если картинки нет, покажем заглушку (день)
                              onError={(e) => {e.currentTarget.src = PAGE_DATA.images.day}}
                           />
                        </div>
                        
                        <div className="absolute bottom-4 left-0 right-0 text-center">
                           <span className="bg-black/50 backdrop-blur text-white text-xs px-3 py-1 rounded-full">
                              Цвет: {WOOD_TEXTURES[selectedWood].name}
                           </span>
                        </div>
                     </div>
                 </div>

             </div>
         </div>
      </section>

      {/* 4. LIGHTING & WARNING & PRICE */}
      {/* ... Остальной код без изменений ... */}
      <section className="py-24 bg-slate-950 border-y border-slate-800">
         <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">Как подсветить дерево?</h2>
            <div className="grid md:grid-cols-3 gap-8">
               <div className="p-6 bg-[#0B1120] rounded-2xl border border-slate-800">
                  <div className="mb-4 text-yellow-500"><Sun className="w-8 h-8"/></div>
                  <h3 className="text-white font-bold mb-2">Контражур</h3>
                  <p className="text-gray-400 text-sm">Диоды крепятся сзади. Темная деревянная буква в светящемся ореоле выглядит потрясающе.</p>
               </div>
               <div className="p-6 bg-[#0B1120] rounded-2xl border border-slate-800">
                  <div className="mb-4 text-orange-500"><Lightbulb className="w-8 h-8"/></div>
                  <h3 className="text-white font-bold mb-2">Ретро-лампы</h3>
                  <p className="text-gray-400 text-sm">Врезка ламп прямо в деревянный массив. Стиль Лофт. Очень тепло и уютно.</p>
               </div>
               <div className="p-6 bg-[#0B1120] rounded-2xl border border-slate-800">
                  <div className="mb-4 text-blue-500"><Zap className="w-8 h-8"/></div>
                  <h3 className="text-white font-bold mb-2">Внешняя подсветка</h3>
                  <p className="text-gray-400 text-sm">Ретро-софиты или трековые светильники, направленные на вывеску. Выделяет фактуру дерева.</p>
               </div>
            </div>
         </div>
      </section>

      <section className="py-16 bg-[#0F172A]">
         <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-red-900/10 border border-red-500/20 p-8 rounded-3xl flex flex-col md:flex-row gap-6 items-start">
               <div className="p-3 bg-red-500/10 rounded-xl text-red-500 shrink-0">
                  <CloudRain className="w-8 h-8"/>
               </div>
               <div>
                  <h3 className="text-xl font-bold text-white mb-2">Важно: Дерево на улице</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                     В климате Астаны (влажность, мороз) дерево — капризный материал. 
                     Даже с яхтным лаком его нужно обновлять раз в 1-2 года.
                  </p>
                  <div className="flex items-center gap-2 text-red-400 text-sm font-bold">
                     <CheckCircle className="w-4 h-4"/>
                     Совет: Если хотите эффект дерева на фасаде без забот — мы предложим имитацию из алюминия.
                  </div>
               </div>
            </div>
         </div>
      </section>

      <section className="py-24 bg-slate-950 border-t border-slate-800">
         <div className="container mx-auto px-4">
             <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center">
                 <div className="md:w-1/2">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Стоимость</h2>
                    <p className="text-gray-400 mb-8">
                       Цена сильно зависит от материала (фанера дешевая, дуб дорогой) и сложности обработки.
                    </p>
                    <div className="space-y-4">
                       <div className="flex justify-between p-4 bg-[#0F172A] rounded-xl border border-slate-800">
                           <span className="text-white">Лазерная резка</span>
                           <span className="text-green-500 font-bold">Включено</span>
                       </div>
                       <div className="flex justify-between p-4 bg-[#0F172A] rounded-xl border border-slate-800">
                           <span className="text-white">Покраска/Масло</span>
                           <span className="text-green-500 font-bold">Включено</span>
                       </div>
                    </div>
                 </div>
                 <div className="md:w-1/2 w-full">
                    <div className="bg-[#0F172A] rounded-3xl p-8 border border-slate-700 relative overflow-hidden">
                        <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-green-500/10 blur-[50px] rounded-full"></div>
                        <h3 className="text-white font-bold mb-6 flex justify-between">
                            Пример: <span className="text-green-500">#COFFEE</span>
                        </h3>
                        <div className="space-y-3 font-mono text-sm relative z-10">
                           <div className="flex justify-between text-gray-400">
                              <span>Высота:</span> <span className="text-white">30 см</span>
                           </div>
                           <div className="flex justify-between text-gray-400">
                              <span>Материал:</span> <span className="text-white">Фанера 10мм + Морилка</span>
                           </div>
                           <div className="flex justify-between text-gray-400">
                              <span>Начинка:</span> <span className="text-white">10 LED-ламп</span>
                           </div>
                           <div className="h-px bg-slate-700 my-2"></div>
                           <div className="flex justify-between items-end pt-2">
                              <span className="text-gray-400">Итого:</span>
                              <span className="text-2xl font-bold text-orange-500">18 000 ₸</span>
                           </div>
                        </div>
                        <Link href="/calculator" className="mt-6 w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-green-900/20 relative z-10">
                            <Calculator className="w-4 h-4"/> Рассчитать проект
                        </Link>
                    </div>
                 </div>
             </div>
         </div>
      </section>

      <section className="py-20 bg-[#0F172A] border-t border-slate-800">
         <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto bg-slate-900/30 border border-slate-800 rounded-3xl p-8 md:p-12 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-yellow-500 to-green-500 opacity-50"></div>
               <div className="grid md:grid-cols-3 gap-12">
                  <div className="md:col-span-1">
                     <h2 className="text-2xl font-bold text-white mb-4 leading-tight">
                        Деревянные вывески в Астане
                     </h2>
                     <div className="w-12 h-1 bg-green-500 rounded-full mb-6"></div>
                     <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                        Техническая справка
                     </p>
                  </div>
                  <div className="md:col-span-2 grid sm:grid-cols-2 gap-8 text-sm text-gray-400 leading-relaxed">
                     <div>
                        <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                           <Scissors className="w-4 h-4 text-blue-500"/> Технология
                        </h4>
                        <p>
                           Компания ADLight предлагает лазерную резку и фрезеровку букв из фанеры, массива сосны, дуба и МДФ. Высокая точность позволяет создавать сложные шрифты и логотипы.
                        </p>
                     </div>
                     <div>
                        <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                           <Brush className="w-4 h-4 text-green-500"/> Защита
                        </h4>
                        <p>
                           Мы не просто режем дерево, мы его защищаем. Используем профессиональные масла (Osmo, Borma) и полиуретановые лаки, чтобы предотвратить рассыхание и потерю цвета.
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      <ReviewsCarousel />
      <ServicesCarousel title="Другие виды" subtitle="Варианты исполнения" hiddenLink="/services/volume-letters"/>
      <CallToAction source="Услуга: Дерево/Эко" />

    </div>
  );
}