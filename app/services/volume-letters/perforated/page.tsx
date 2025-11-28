"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, 
  ChevronRight, 
  Calculator, 
  MessageCircle, 
  CheckCircle, 
  Sparkles,     // Иконка блеска
  Gem,          // Драгоценность
  Cpu,          // Процессор/ЧПУ
  Hammer,       // Прочность
  PaintBucket, 
  Sun, 
  Moon,
  Wind,
  Thermometer,
  ScanLine      // Точность
} from "lucide-react";

// --- ИМПОРТ КОМПОНЕНТОВ ---
import CallToAction from "@/components/CallToAction";
import ServicesCarousel from "@/components/ServicesCarousel";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import ProjectsBento from "@/components/ProjectsBento";

// Данные страницы
const PAGE_DATA = {
  title: "Объемные буквы с перфорированным бортом",
  subtitle: "Трендовое решение с эффектом «бриллиантового свечения». Заставьте ваш бренд сиять.",
  price: "750", // Цена за см
  images: {
    day: "/images/letters/perforated-day.png",
    night: "/images/letters/perforated-night.png"
  }
};

export default function PerforatedLettersPage() {
  const [isNightMode, setIsNightMode] = useState(true);

  return (
    <div className="min-h-screen bg-[#0F172A] font-sans selection:bg-pink-500/30">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden border-b border-slate-800">
        {/* Фон с эффектом "пыльцы" или блеска */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F172A]/90 to-[#0F172A]"></div>
        {/* Розовое/Золотое свечение */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-pink-500/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
           
           {/* Навигация */}
           <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 mb-8">
              <Link href="/" className="hover:text-white transition">Главная</Link>
              <ChevronRight className="w-3 h-3"/>
              <Link href="/services/volume-letters" className="hover:text-white transition">Объемные буквы</Link>
              <ChevronRight className="w-3 h-3"/>
              <span className="text-pink-500 font-medium">Перфорация</span>
           </div>

           <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Текст */}
              <div>
                 <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-bold text-pink-400 bg-pink-500/10 border border-pink-500/20 rounded-full uppercase tracking-wider">
                    <Sparkles className="w-4 h-4"/> Wow-эффект
                 </div>
                 <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    {PAGE_DATA.title}
                 </h1>
                 <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                    {PAGE_DATA.subtitle}
                 </p>
                 
                 <ul className="space-y-3 mb-10">
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-pink-500"/> Уникальный эффект мерцания боковой грани
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-pink-500"/> Заводская покраска алюминия
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-pink-500"/> Зеркальное золото и серебро в наличии
                    </li>
                 </ul>

                 <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/calculator" className="flex items-center justify-center gap-2 bg-pink-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-pink-700 transition shadow-lg shadow-pink-900/20 active:scale-95">
                       <Calculator className="w-5 h-5"/> Хочу яркую вывеску
                    </Link>
                    <a href="https://wa.me/77071356701" target="_blank" className="flex items-center justify-center gap-2 border border-slate-700 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition">
                       <MessageCircle className="w-5 h-5 text-green-500"/> Написать в WhatsApp
                    </a>
                 </div>
              </div>

              {/* Интерактивное фото */}
              <div className="relative">
                 <div className="absolute top-4 right-4 z-20 bg-slate-900/80 backdrop-blur-md border border-white/10 p-1 rounded-full flex gap-1">
                    <button onClick={() => setIsNightMode(false)} className={`p-2 rounded-full transition-all ${!isNightMode ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                       <Sun className="w-5 h-5"/>
                    </button>
                    <button onClick={() => setIsNightMode(true)} className={`p-2 rounded-full transition-all ${isNightMode ? 'bg-pink-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                       <Moon className="w-5 h-5"/>
                    </button>
                 </div>

                 <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-slate-700 relative shadow-2xl shadow-pink-500/10 bg-slate-900">
                    <Image 
                       src={isNightMode ? PAGE_DATA.images.night : PAGE_DATA.images.day} 
                       alt="Перфорированные буквы" 
                       fill 
                       className="object-cover transition-all duration-500"
                    />
                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-medium text-white border border-white/10">
                       {isNightMode ? "Эффект «Бриллианты» ночью" : "Стильный металл днем"}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 2. CONCEPT (МАГИЯ) */}
      <section className="py-24 bg-slate-950">
         <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
               <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-500/10 text-pink-500 mb-6">
                  <Gem className="w-8 h-8"/>
               </div>
               <h2 className="text-3xl font-bold text-white mb-6">В чем магия?</h2>
               <p className="text-gray-400 text-lg leading-relaxed mb-8">
                  Это новинка на рынке Астаны. Борт буквы изготовлен из специального алюминиевого профиля с тысячами микро-отверстий.
               </p>
               <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800">
                  <p className="text-white font-medium">
                     Днем это стильная металлическая буква с фактурой. Но с наступлением темноты свет пробивается сквозь перфорацию, создавая эффект искрящихся кристаллов или звездного неба. Вывеска выглядит как ювелирное украшение.
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* 3. PRODUCTION (РОБОТИЗИРОВАННАЯ ТОЧНОСТЬ) */}
      <section className="py-24 bg-[#0F172A]">
         <div className="container mx-auto px-4">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Роботизированная точность ADLight</h2>
               <p className="text-gray-400">В отличие от пластиковых букв, которые клеятся вручную, эти буквы создает машина.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
               <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 hover:border-blue-500/30 transition group">
                  <div className="w-14 h-14 bg-blue-500/10 flex items-center justify-center mb-6 text-blue-500 rounded-xl"><Cpu className="w-7 h-7"/></div>
                  <h3 className="text-xl font-bold text-white mb-4">ЧПУ-бортогиб</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                     Файл с дизайном загружается в компьютер, и станок автоматически гнет алюминиевый профиль с точностью до микрона. Идеальные углы даже в сложных шрифтах.
                  </p>
               </div>
               <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 hover:border-orange-500/30 transition group">
                  <div className="w-14 h-14 bg-orange-500/10 flex items-center justify-center mb-6 text-orange-500 rounded-xl"><Hammer className="w-7 h-7"/></div>
                  <h3 className="text-xl font-bold text-white mb-4">Алюминий 0.8 мм</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                     Заводской алюминиевый профиль: легкий, жесткий и не ржавеет. Лучше пластика держит форму на жаре.
                  </p>
               </div>
               <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 hover:border-green-500/30 transition group">
                  <div className="w-14 h-14 bg-green-500/10 flex items-center justify-center mb-6 text-green-500 rounded-xl"><PaintBucket className="w-7 h-7"/></div>
                  <h3 className="text-xl font-bold text-white mb-4">Заводская покраска</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                     Алюминий окрашен порошковым методом на заводе. Нет пленки — значит, ничего не отклеится и не пойдет «пузырями». Цвет насыщенный годами.
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* 4. PALETTE (ЦВЕТА) */}
      <section className="py-24 bg-slate-950 border-y border-slate-800">
         <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">Складская программа</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               {/* ЗОЛОТО */}
               <div className="p-6 rounded-2xl bg-[#1a1500] border border-yellow-500/30 text-center group cursor-pointer hover:scale-105 transition">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 mx-auto mb-4 shadow-lg shadow-yellow-500/20"></div>
                  <h4 className="text-white font-bold">Зеркальное Золото</h4>
                  <p className="text-gray-400 text-xs mt-1">Топ продаж</p>
               </div>
               
               {/* СЕРЕБРО */}
               <div className="p-6 rounded-2xl bg-[#101010] border border-gray-500/30 text-center group cursor-pointer hover:scale-105 transition">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-200 to-gray-500 mx-auto mb-4 shadow-lg shadow-white/10"></div>
                  <h4 className="text-white font-bold">Зеркальное Серебро</h4>
                  <p className="text-gray-400 text-xs mt-1">Hi-Tech стиль</p>
               </div>

               {/* ЧЕРНЫЙ */}
               <div className="p-6 rounded-2xl bg-slate-900 border border-slate-700 text-center group cursor-pointer hover:scale-105 transition">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-800 to-black mx-auto mb-4 shadow-lg border border-gray-700"></div>
                  <h4 className="text-white font-bold">Черный Муар</h4>
                  <p className="text-gray-400 text-xs mt-1">Строгость</p>
               </div>

               {/* БЕЛЫЙ */}
               <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700 text-center group cursor-pointer hover:scale-105 transition">
                  <div className="w-16 h-16 rounded-full bg-white mx-auto mb-4 shadow-lg"></div>
                  <h4 className="text-white font-bold">Белый Глянец</h4>
                  <p className="text-gray-400 text-xs mt-1">Универсальность</p>
               </div>
            </div>
            
            <p className="text-center text-gray-500 text-sm mt-8">
               * Если вам нужен редкий оттенок (например, Тиффани), мы можем покрасить профиль под заказ.
            </p>
         </div>
      </section>

      {/* 5. ПРЕИМУЩЕСТВА */}
      <section className="py-24 bg-[#0F172A]">
         <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid md:grid-cols-3 gap-8">
               <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-blue-500 mb-4 border border-slate-700"><Wind className="w-6 h-6"/></div>
                  <h3 className="text-white font-bold mb-2">Легкий вес</h3>
                  <p className="text-gray-400 text-sm">Алюминий легче акрила. Снижает нагрузку на фасад.</p>
               </div>
               <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-red-500 mb-4 border border-slate-700"><Thermometer className="w-6 h-6"/></div>
                  <h3 className="text-white font-bold mb-2">Теплоотвод</h3>
                  <p className="text-gray-400 text-sm">Алюминиевый борт работает как радиатор. Диоды живут дольше.</p>
               </div>
               <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-pink-500 mb-4 border border-slate-700"><Sparkles className="w-6 h-6"/></div>
                  <h3 className="text-white font-bold mb-2">Вау-эффект</h3>
                  <p className="text-gray-400 text-sm">Перфорация создает динамику света без сложной электроники.</p>
               </div>
            </div>
         </div>
      </section>

      {/* 6. ЦЕНА И РАСЧЕТ */}
      <section className="py-24 bg-slate-950 border-t border-slate-800">
         <div className="container mx-auto px-4">
             <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center">
                 
                 <div className="md:w-1/2">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Доступная роскошь</h2>
                    <p className="text-gray-400 mb-8">
                       Часто клиенты думают, что это безумно дорого из-за "металла", но благодаря автоматизации (станок гнет сам) это вполне доступно.
                    </p>
                    
                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                        <div className="flex items-center gap-3 text-white mb-2">
                           <ScanLine className="w-5 h-5 text-green-500"/>
                           <span className="font-bold">Глубина борта:</span>
                        </div>
                        <p className="text-gray-400 text-sm pl-8">
                           Мы можем изготовить буквы любой глубины: 60 мм, 80 мм, 100 мм (для крупных вывесок).
                        </p>
                    </div>
                 </div>

                 <div className="md:w-1/2 w-full">
                    <div className="bg-slate-900 rounded-3xl p-8 border border-slate-700 relative overflow-hidden">
                        {/* Блик */}
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-pink-500/20 blur-[60px] rounded-full pointer-events-none"></div>
                        
                        <h3 className="text-white font-bold mb-6 flex justify-between relative z-10">
                            Пример: <span className="text-pink-500">"BEAUTY"</span> (6 букв)
                        </h3>
                        <div className="space-y-3 font-mono text-sm relative z-10">
                           <div className="flex justify-between text-gray-400">
                              <span>Высота:</span> <span className="text-white">40 см</span>
                           </div>
                           <div className="flex justify-between text-gray-400">
                              <span>Материал:</span> <span className="text-white">Золотой борт</span>
                           </div>
                           <div className="flex justify-between text-gray-400">
                              <span>Цена:</span> <span className="text-white">{PAGE_DATA.price} ₸/см</span>
                           </div>
                           <div className="h-px bg-slate-700 my-2"></div>
                           <div className="flex justify-between items-end pt-2">
                              <span className="text-gray-400">Итого:</span>
                              <span className="text-2xl font-bold text-pink-500">180 000 ₸</span>
                           </div>
                        </div>
                        <Link href="/calculator" className="mt-6 w-full py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-pink-900/20 relative z-10">
                            <Calculator className="w-4 h-4"/> Рассчитать свою вывеску
                        </Link>
                    </div>
                 </div>

             </div>
         </div>
      </section>

      {/* 7. SEO TEXT (ЖУРНАЛЬНЫЙ СТИЛЬ) */}
      <section className="py-20 bg-[#0F172A] border-t border-slate-800">
         <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto bg-slate-900/30 border border-slate-800 rounded-3xl p-8 md:p-12 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-50"></div>
               
               <div className="grid md:grid-cols-3 gap-12">
                  <div className="md:col-span-1">
                     <h2 className="text-2xl font-bold text-white mb-4 leading-tight">
                        Производство в Астане
                     </h2>
                     <div className="w-12 h-1 bg-pink-500 rounded-full mb-6"></div>
                     <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                        Техническая справка
                     </p>
                  </div>
                  <div className="md:col-span-2 text-sm text-gray-400 leading-relaxed">
                     <p className="mb-4">
                        Ищете способ выделиться среди конкурентов? Буквы с перфорацией — это свежий тренд в наружной рекламе. Компания ADLight производит вывески на собственном автоматическом бортогибочном станке, что позволяет работать с алюминиевым профилем и нержавеющей сталью толщиной до 1.2 мм.
                     </p>
                     <p>
                        Мы предлагаем широкий выбор профилей: от зеркального золота до классического черного муара. Перфорированные борта не только красивы, но и практичны: алюминиевая основа не боится коррозии, перепадов температур и ультрафиолета.
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 8. OTHER COMPONENTS */}
      <ProjectsBento title="Наши работы" subtitle="Яркие проекты в Астане" />
      <ReviewsCarousel />
      <ServicesCarousel title="Другие виды" subtitle="Варианты исполнения" hiddenLink="/services/volume-letters"/>
      <CallToAction source="Услуга: Перфорация" />

    </div>
  );
}