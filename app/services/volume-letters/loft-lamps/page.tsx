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
  Lightbulb,    
  Flame,        
  Hammer,       
  Trees,        
  Zap,
  Sun,
  Moon,
  Sliders,      
  PartyPopper,  
  Utensils,     
  Music,
  ShieldCheck   // Для блока безопасности
} from "lucide-react";

// --- ИМПОРТ КОМПОНЕНТОВ ---
import CallToAction from "@/components/CallToAction";
import ServicesCarousel from "@/components/ServicesCarousel";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import ProjectsBento from "@/components/ProjectsBento";
import { Slider } from "@/components/ui/slider"; 

// Данные страницы
const PAGE_DATA = {
  title: "Ретро-буквы с лампами (Стиль Лофт)",
  subtitle: "Атмосфера Бродвея 50-х годов в вашем интерьере. Вывески, которые создают настроение.",
  price: "1 200", 
  images: {
    day: "/images/letters/loft-lamps-day.png",
    night: "/images/letters/loft-lamps-night.png"
  }
};

export default function LoftLettersPage() {
  const [isNightMode, setIsNightMode] = useState(true);
  const [brightness, setBrightness] = useState([100]); 

  return (
    <div className="min-h-screen bg-[#0F172A] font-sans selection:bg-orange-500/30">
      
      {/* 1. PRODUCT HERO */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F172A]/90 to-[#0F172A]"></div>
        {/* Теплое оранжевое свечение */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-600/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
           
           {/* Навигация */}
           <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 mb-8">
              <Link href="/" className="hover:text-white transition">Главная</Link>
              <ChevronRight className="w-3 h-3"/>
              <Link href="/services/volume-letters" className="hover:text-white transition">Объемные буквы</Link>
              <ChevronRight className="w-3 h-3"/>
              <span className="text-orange-500 font-medium">Лофт / Ретро</span>
           </div>

           <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Текст */}
              <div>
                 <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded-full uppercase tracking-wider">
                    <Lightbulb className="w-4 h-4"/> Marquee Letters
                 </div>
                 <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    {PAGE_DATA.title}
                 </h1>
                 <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                    {PAGE_DATA.subtitle}
                 </p>
                 
                 <ul className="space-y-3 mb-10">
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-orange-500"/> Винтажные лампы или экономные LED
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-orange-500"/> Корпус: Сталь (ржавчина/золото) или Дерево
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-orange-500"/> Регулировка яркости (Диммер)
                    </li>
                 </ul>

                 <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/calculator" className="flex items-center justify-center gap-2 bg-orange-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-700 transition shadow-lg shadow-orange-900/20 active:scale-95">
                       <Calculator className="w-5 h-5"/> Рассчитать проект
                    </Link>
                    <a href="https://wa.me/77071356701" target="_blank" className="flex items-center justify-center gap-2 border border-slate-700 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition">
                       <MessageCircle className="w-5 h-5 text-green-500"/> Задать вопрос
                    </a>
                 </div>
              </div>

              {/* Интерактивное фото */}
              <div className="relative">
                 <div className="absolute top-4 right-4 z-20 bg-slate-900/80 backdrop-blur-md border border-white/10 p-1 rounded-full flex gap-1">
                    <button onClick={() => setIsNightMode(false)} className={`p-2 rounded-full transition-all ${!isNightMode ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                       <Sun className="w-5 h-5"/>
                    </button>
                    <button onClick={() => setIsNightMode(true)} className={`p-2 rounded-full transition-all ${isNightMode ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                       <Moon className="w-5 h-5"/>
                    </button>
                 </div>

                 <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-slate-700 relative shadow-2xl shadow-orange-500/10 bg-slate-900">
                    <Image 
                       src={isNightMode ? PAGE_DATA.images.night : PAGE_DATA.images.day} 
                       alt="Ретро буквы" 
                       fill 
                       className="object-cover transition-all duration-500"
                    />
                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-medium text-white border border-white/10">
                       {isNightMode ? "Вид в ночное время" : "Вид в дневное время"}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 2. VIBE (АТМОСФЕРА) */}
      <section className="py-24 bg-slate-950">
         <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
               <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-500/10 text-orange-500 mb-6">
                  <Lightbulb className="w-8 h-8"/>
               </div>
               <h2 className="text-3xl font-bold text-white mb-6">Больше, чем вывеска</h2>
               <p className="text-gray-400 text-lg leading-relaxed mb-8">
                  Это элемент декора. Стиль, пришедший к нам из старого американского кино. Открытые лампы дают теплый, мягкий свет, который не слепит, а притягивает взгляд.
               </p>
               <p className="text-white font-medium text-lg border-l-4 border-orange-500 pl-4 text-left md:text-center md:border-l-0 md:border-t-4 md:pt-4">
                  В Астане это стандарт для модных заведений: крафтовых баров, барбершопов и лофт-пространств.
               </p>
            </div>
         </div>
      </section>

      {/* 3. MATERIALS (МАТЕРИАЛЫ КОРПУСА) */}
      <section className="py-24 bg-[#0F172A]">
         <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-16 text-center">Производственная магия</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
               {/* Металл */}
               <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 hover:border-blue-500/30 transition group">
                  <div className="w-14 h-14 bg-blue-500/10 flex items-center justify-center mb-6 text-blue-500 rounded-xl"><Hammer className="w-7 h-7"/></div>
                  <h3 className="text-xl font-bold text-white mb-4">Нержавеющая сталь</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                     Сваривается лазером (шов незаметен). Может быть зеркальной (хром), матовой или с покрытием под золото (нитрид титана). Не тускнеет.
                  </p>
               </div>

               {/* Ржавчина */}
               <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 hover:border-orange-500/30 transition group">
                  <div className="w-14 h-14 bg-orange-500/10 flex items-center justify-center mb-6 text-orange-500 rounded-xl"><Flame className="w-7 h-7"/></div>
                  <h3 className="text-xl font-bold text-white mb-4">Эффект ржавчины</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                     Corten Steel effect. Мы специально обрабатываем сталь кислотами для создания натуральной коррозии, а затем фиксируем лаком. Брутальный лофт.
                  </p>
               </div>

               {/* Дерево */}
               <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 hover:border-green-500/30 transition group">
                  <div className="w-14 h-14 bg-green-500/10 flex items-center justify-center mb-6 text-green-500 rounded-xl"><Trees className="w-7 h-7"/></div>
                  <h3 className="text-xl font-bold text-white mb-4">Натуральное дерево</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                     Массив сосны или фанера, пропитанная маслом и морилками. Идеально для уютных кофеен и магазинов эко-товаров.
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* 4. DIMMER SIMULATOR */}
      <section className="py-24 bg-slate-950 border-y border-slate-800 relative overflow-hidden">
         <div className="container mx-auto px-4 relative z-10">
             <div className="flex flex-col lg:flex-row gap-12 items-center">
                 
                 <div className="lg:w-1/2">
                    <div className="inline-flex items-center gap-2 text-orange-500 font-bold mb-4">
                        <Sliders className="w-5 h-5"/> Управление атмосферой
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Диммер в комплекте</h2>
                    <p className="text-gray-400 mb-8 text-lg">
                       Вывеска не должна слепить вечером. Мы устанавливаем диммер, чтобы вы могли менять яркость под настроение заведения.
                    </p>
                    
                    <div className="bg-[#0B1120] p-6 rounded-2xl border border-slate-800">
                        <div className="flex justify-between text-white font-mono mb-4">
                            <span>Яркость:</span>
                            <span className="text-orange-500">{brightness}%</span>
                        </div>
                        {/* Слайдер */}
                        <Slider 
                           defaultValue={[100]} 
                           max={100} 
                           step={1} 
                           onValueChange={(v) => setBrightness(v)}
                           className="cursor-pointer"
                        />
                        <p className="text-xs text-gray-500 mt-4">
                           * Потяните ползунок, чтобы проверить эффект
                        </p>
                    </div>
                 </div>

                 {/* Визуализация диммирования */}
                 <div className="lg:w-1/2 w-full">
                     <div className="relative aspect-video bg-black rounded-3xl overflow-hidden border border-slate-700 shadow-2xl">
                        {/* Базовая картинка (Ночь) */}
                        <Image 
                           src="/images/letters/loft-lamps-night.png" 
                           alt="Диммер тест" 
                           fill 
                           className="object-cover transition-all duration-100"
                           style={{ 
                               // Меняем фильтр яркости
                               filter: `brightness(${brightness[0]}%)` 
                           }}
                        />
                        {/* НАДПИСЬ LOFT УБРАНА, ЧТОБЫ НЕ МЕШАЛА */}
                     </div>
                 </div>

             </div>
         </div>
      </section>

      {/* 5. USE CASES */}
      <section className="py-24 bg-[#0F172A]">
         <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">Где это работает?</h2>
            <div className="grid md:grid-cols-3 gap-6">
               <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 flex items-start gap-4">
                  <Utensils className="w-8 h-8 text-orange-500 shrink-0"/>
                  <div>
                     <h4 className="font-bold text-white mb-1">Бары и Рестораны</h4>
                     <p className="text-gray-400 text-sm">Интерьер за барной стойкой или фотозона.</p>
                  </div>
               </div>
               <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 flex items-start gap-4">
                  <Zap className="w-8 h-8 text-yellow-500 shrink-0"/>
                  <div>
                     <h4 className="font-bold text-white mb-1">Входная группа</h4>
                     <p className="text-gray-400 text-sm">Используем влагозащищенные патроны IP65 для улицы.</p>
                  </div>
               </div>
               <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 flex items-start gap-4">
                  <PartyPopper className="w-8 h-8 text-pink-500 shrink-0"/>
                  <div>
                     <h4 className="font-bold text-white mb-1">Event и Свадьбы</h4>
                     <p className="text-gray-400 text-sm">Гигантские инициалы или цифры в аренду.</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 6. ЦЕНА И РАСЧЕТ */}
      <section className="py-24 bg-slate-950 border-t border-slate-800">
         <div className="container mx-auto px-4">
             <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center">
                 
                 <div className="md:w-1/2">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Стоимость</h2>
                    <p className="text-gray-400 mb-8">
                       Цена зависит от материала корпуса (дерево дешевле, сталь дороже) и количества ламп.
                    </p>
                    <div className="space-y-4">
                       <div className="flex justify-between p-4 bg-[#0F172A] rounded-xl border border-slate-800">
                           <span className="text-white">Лампы</span>
                           <span className="text-orange-500 font-bold">Считаются отдельно</span>
                       </div>
                       <div className="flex justify-between p-4 bg-[#0F172A] rounded-xl border border-slate-800">
                           <span className="text-white">Диммер</span>
                           <span className="text-orange-500 font-bold">Опция (+ 8 000 ₸)</span>
                       </div>
                    </div>
                 </div>

                 <div className="md:w-1/2 w-full">
                    <div className="bg-[#0F172A] rounded-3xl p-8 border border-slate-700 relative overflow-hidden">
                        <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-orange-500/10 blur-[50px] rounded-full"></div>
                        <h3 className="text-white font-bold mb-6 flex justify-between">
                            Пример: <span className="text-orange-500">Буква "А"</span> (Дерево)
                        </h3>
                        <div className="space-y-3 font-mono text-sm relative z-10">
                           <div className="flex justify-between text-gray-400">
                              <span>Высота:</span> <span className="text-white">50 см</span>
                           </div>
                           <div className="flex justify-between text-gray-400">
                              <span>Корпус:</span> <span className="text-white">Фанера + Морилка</span>
                           </div>
                           <div className="flex justify-between text-gray-400">
                              <span>Начинка:</span> <span className="text-white">10 LED-ламп</span>
                           </div>
                           <div className="h-px bg-slate-700 my-2"></div>
                           <div className="flex justify-between items-end pt-2">
                              <span className="text-gray-400">Итого:</span>
                              <span className="text-2xl font-bold text-orange-500">45 000 ₸</span>
                           </div>
                        </div>
                        <Link href="/calculator" className="mt-6 w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-orange-900/20 relative z-10">
                            <Calculator className="w-4 h-4"/> Рассчитать свою
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
               {/* Декор */}
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 opacity-50"></div>
               
               <div className="grid md:grid-cols-3 gap-12">
                  <div className="md:col-span-1">
                     <h2 className="text-2xl font-bold text-white mb-4 leading-tight">
                        Изготовление ретро-вывесок в Астане
                     </h2>
                     <div className="w-12 h-1 bg-orange-500 rounded-full mb-6"></div>
                     <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                        Техническая справка
                     </p>
                  </div>
                  <div className="md:col-span-2 grid sm:grid-cols-2 gap-8 text-sm text-gray-400 leading-relaxed">
                     <div>
                        <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                           <Hammer className="w-4 h-4 text-blue-500"/> Производство
                        </h4>
                        <p>
                           Наш цех оборудован лазерной сваркой, что позволяет работать с нержавеющей сталью, создавая идеальные герметичные короба. Предлагаем уникальные финишные покрытия: искусственное старение (ржавчина), порошковая покраска, золочение.
                        </p>
                     </div>
                     <div>
                        <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                           <ShieldCheck className="w-4 h-4 text-green-500"/> Безопасность
                        </h4>
                        <p>
                           Используем только сертифицированные керамические ретро-патроны и пожаробезопасную проводку. Для уличного размещения применяем влагозащищенные компоненты IP65.
                        </p>
                     </div>
                  </div>
               </div>
            </div>

         </div>
      </section>

      {/* 8. OTHER COMPONENTS */}
      <ReviewsCarousel />
      <ServicesCarousel title="Другие виды" subtitle="Варианты исполнения" hiddenLink="/services/volume-letters"/>
      <CallToAction source="Услуга: Лофт/Ретро" />

    </div>
  );
}