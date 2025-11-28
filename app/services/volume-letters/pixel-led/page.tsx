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
  Grid3X3,      // Пиксели/Сетка
  Zap,          // Яркость/Энергия
  Cpu,          // Контроллер/Управление
  Smartphone,   // Управление с телефона
  Settings,     // Ремонтопригодность
  Wrench,
  Lightbulb,
  Shield,
  Layers,
  Activity,     // Динамика/Ритм
  Sun,
  Moon
} from "lucide-react";

// --- ИМПОРТ КОМПОНЕНТОВ ---
import CallToAction from "@/components/CallToAction";
import ServicesCarousel from "@/components/ServicesCarousel";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import ProjectsBento from "@/components/ProjectsBento";
import DesignCodeBlock from "@/components/DesignCodeBlock";

// Данные страницы
const PAGE_DATA = {
  title: "Пиксельные буквы (Открытые светодиоды)",
  subtitle: "Рекордная яркость и динамические спецэффекты. Вывеска, которая работает как магнит для глаз.",
  price: "800", // Цена за см
  images: {
    day: "/images/letters/pixel-led-day.png",
    night: "/images/letters/pixel-led-night.png"
  }
};

export default function PixelLedPage() {
  const [isNightMode, setIsNightMode] = useState(true);

  return (
    <div className="min-h-screen bg-[#0F172A] font-sans selection:bg-green-500/30">
      
      {/* 1. PRODUCT HERO */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden border-b border-slate-800">
        {/* Фон с точками (пикселями) */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff10_1px,transparent_1px)] [background-size:20px_20px] opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F172A]/90 to-[#0F172A]"></div>
        {/* Зеленое/RGB свечение */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-500/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
           
           {/* Навигация */}
           <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 mb-8">
              <Link href="/" className="hover:text-white transition">Главная</Link>
              <ChevronRight className="w-3 h-3"/>
              <Link href="/services/volume-letters" className="hover:text-white transition">Объемные буквы</Link>
              <ChevronRight className="w-3 h-3"/>
              <span className="text-green-500 font-medium">Открытые пиксели</span>
           </div>

           <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Текст */}
              <div>
                 <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/20 rounded-full uppercase tracking-wider">
                    <Zap className="w-4 h-4"/> Самые яркие в линейке
                 </div>
                 <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    {PAGE_DATA.title}
                 </h1>
                 <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                    {PAGE_DATA.subtitle}
                 </p>
                 
                 <ul className="space-y-3 mb-10">
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-green-500"/> В 3 раза ярче акриловых букв
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-green-500"/> Программируемая анимация
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-green-500"/> Экономия на лицевом пластике
                    </li>
                 </ul>

                 <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/calculator" className="flex items-center justify-center gap-2 bg-green-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-700 transition shadow-lg shadow-green-900/20 active:scale-95">
                       <Calculator className="w-5 h-5"/> Хочу динамичную вывеску
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
                    <button onClick={() => setIsNightMode(true)} className={`p-2 rounded-full transition-all ${isNightMode ? 'bg-green-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                       <Moon className="w-5 h-5"/>
                    </button>
                 </div>

                 <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-slate-700 relative shadow-2xl shadow-green-500/10 bg-slate-900">
                    <Image 
                       src={isNightMode ? PAGE_DATA.images.night : PAGE_DATA.images.day} 
                       alt="Пиксельные буквы" 
                       fill 
                       className="object-cover transition-all duration-500"
                    />
                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-medium text-white border border-white/10">
                       {isNightMode ? "Активный режим (Свечение)" : "Выключено (Видны диоды)"}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 2. CONCEPT (ТЕХНОЛОГИЯ) */}
      <section className="py-24 bg-slate-950">
         <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
               <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 text-green-500 mb-6">
                  <Grid3X3 className="w-8 h-8"/>
               </div>
               <h2 className="text-3xl font-bold text-white mb-6">Нет стекла — нет преград свету</h2>
               <p className="text-gray-400 text-lg leading-relaxed mb-8">
                  В классических буквах диоды спрятаны за матовым акрилом, который «съедает» до 30% яркости. В пиксельных буквах мы убираем эту преграду.
               </p>
               <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800">
                  <p className="text-white font-medium">
                     Светодиодные пиксели монтируются прямо в лицевую панель через просверленные отверстия. Вы получаете прямой, жесткий и очень мощный свет, который виден за сотни метров.
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* 3. DYNAMICS (ГЛАВНАЯ ФИШКА) */}
      <section className="py-24 bg-[#0F172A] relative overflow-hidden">
         <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
               
               <div className="lg:w-1/2">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Ваша вывеска — это шоу</h2>
                  <div className="space-y-6">
                     <div className="flex gap-4">
                        <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-purple-500 shrink-0 border border-slate-700"><Cpu className="w-6 h-6"/></div>
                        <div>
                           <h4 className="text-white font-bold mb-1">Smart-эффекты</h4>
                           <p className="text-gray-400 text-sm">Благодаря RGB-контроллерам мы можем «оживить» статику: переливы цвета, бегущая волна, стробоскоп, эффект салюта.</p>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-blue-500 shrink-0 border border-slate-700"><Smartphone className="w-6 h-6"/></div>
                        <div>
                           <h4 className="text-white font-bold mb-1">Управление</h4>
                           <p className="text-gray-400 text-sm">Меняйте режимы, скорость и яркость с компактного пульта или даже со смартфона (опция).</p>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-orange-500 shrink-0 border border-slate-700"><Activity className="w-6 h-6"/></div>
                        <div>
                           <h4 className="text-white font-bold mb-1">Для кого?</h4>
                           <p className="text-gray-400 text-sm">Идеально для ночных клубов, обменных пунктов (табло), аптек (крест), казино и магазинов 24/7.</p>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Визуал Динамики (Схематичный) */}
               <div className="lg:w-1/2 w-full">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-center">
                         <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 mb-2 animate-pulse">RGB</div>
                         <div className="text-gray-400 text-xs uppercase font-bold">Полноцвет</div>
                      </div>
                      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-center">
                         <div className="text-4xl font-black text-white mb-2 animate-bounce">AUTO</div>
                         <div className="text-gray-400 text-xs uppercase font-bold">Анимация</div>
                      </div>
                      <div className="col-span-2 bg-slate-900 p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
                         <span className="text-gray-400 text-sm">Яркость:</span>
                         <div className="flex gap-1">
                            {[1,2,3,4,5].map(i => <div key={i} className={`w-8 h-3 rounded-full ${i===5 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>)}
                         </div>
                      </div>
                   </div>
               </div>

            </div>
         </div>
      </section>

      {/* 4. ANATOMY (КОНСТРУКТИВ) */}
      <section className="py-24 bg-slate-950 border-y border-slate-800">
         <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">Как мы это собираем</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
               <div className="bg-[#0B1120] p-8 rounded-3xl border border-slate-800 group hover:border-green-500/30 transition">
                  <div className="w-14 h-14 bg-green-500/10 flex items-center justify-center mb-6 text-green-500 rounded-xl"><Layers className="w-7 h-7"/></div>
                  <h3 className="text-xl font-bold text-white mb-4">Композитное лицо</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                     Используем алюминиевый композит или толстый ПВХ. Материал не пропускает свет сам по себе. Сверлим отверстия на ЧПУ под размер пикселя (9/12 мм).
                  </p>
               </div>
               <div className="bg-[#0B1120] p-8 rounded-3xl border border-slate-800 group hover:border-green-500/30 transition">
                  <div className="w-14 h-14 bg-green-500/10 flex items-center justify-center mb-6 text-green-500 rounded-xl"><Lightbulb className="w-7 h-7"/></div>
                  <h3 className="text-xl font-bold text-white mb-4">Герметичные пиксели</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                     Модули IP67/IP68, соединенные шлейфом. Каждый диод в силиконовой оболочке. Не боятся ливней и моек высокого давления.
                  </p>
               </div>
               <div className="bg-[#0B1120] p-8 rounded-3xl border border-slate-800 group hover:border-green-500/30 transition">
                  <div className="w-14 h-14 bg-green-500/10 flex items-center justify-center mb-6 text-green-500 rounded-xl"><Grid3X3 className="w-7 h-7"/></div>
                  <h3 className="text-xl font-bold text-white mb-4">Шаг пикселя</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                     Ставим диоды плотно (через 20 мм) для «сплошного» залива или редко (через 40-50 мм) для экономии. Выбор за вами.
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* 5. ПРЕИМУЩЕСТВА (WHY BUY) */}
      <section className="py-24 bg-[#0F172A]">
         <div className="container mx-auto px-4 max-w-4xl">
            <div className="space-y-6">
               <div className="flex gap-6 p-6 rounded-2xl bg-slate-900/50 border border-slate-800 items-start">
                  <div className="p-3 bg-blue-500/20 rounded-full text-blue-400 shrink-0"><Zap className="w-6 h-6"/></div>
                  <div>
                     <h4 className="text-white font-bold text-lg mb-2">Феноменальная яркость</h4>
                     <p className="text-gray-400 text-sm">Нет рассеивателя = нет потерь света. Это самый яркий вид наружной рекламы на рынке.</p>
                  </div>
               </div>
               <div className="flex gap-6 p-6 rounded-2xl bg-slate-900/50 border border-slate-800 items-start">
                  <div className="p-3 bg-green-500/20 rounded-full text-green-400 shrink-0"><Settings className="w-6 h-6"/></div>
                  <div>
                     <h4 className="text-white font-bold text-lg mb-2">Ремонтопригодность за 2 минуты</h4>
                     <p className="text-gray-400 text-sm">Если перегорит один диод, не нужно разбирать букву. Пиксель меняется снаружи — он просто "выщелкивается".</p>
                  </div>
               </div>
               <div className="flex gap-6 p-6 rounded-2xl bg-slate-900/50 border border-slate-800 items-start">
                  <div className="p-3 bg-yellow-500/20 rounded-full text-yellow-400 shrink-0"><Shield className="w-6 h-6"/></div>
                  <div>
                     <h4 className="text-white font-bold text-lg mb-2">Энергоэффективность</h4>
                     <p className="text-gray-400 text-sm">Несмотря на яркость, пиксели потребляют мало энергии (12В). Безопасно и экономно.</p>
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
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Честная цена</h2>
                    <p className="text-gray-400 mb-8">
                       Стоимость зависит не только от высоты, но и от количества "дырок" (плотности диодов) и типа контроллера.
                    </p>
                    
                    <div className="bg-[#0B1120] p-6 rounded-2xl border border-slate-800 space-y-4">
                        <div className="flex justify-between border-b border-slate-700 pb-2">
                           <span className="text-white font-bold">Монохром (1 цвет)</span>
                           <span className="text-green-500">Дешевле</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-700 pb-2">
                           <span className="text-white font-bold">RGB (Разноцветные)</span>
                           <span className="text-orange-500">+ Контроллер</span>
                        </div>
                        <div className="flex justify-between">
                           <span className="text-white font-bold">Шаг пикселя</span>
                           <span className="text-gray-400">Влияет на бюджет</span>
                        </div>
                    </div>
                 </div>

                 <div className="md:w-1/2 w-full">
                    <div className="bg-[#0B1120] rounded-3xl p-8 border border-slate-700 relative overflow-hidden">
                        {/* Блик */}
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-green-500/20 blur-[60px] rounded-full pointer-events-none"></div>
                        
                        <h3 className="text-white font-bold mb-6 flex justify-between relative z-10">
                            Пример: <span className="text-green-500">"OPEN"</span> (4 буквы)
                        </h3>
                        <div className="space-y-3 font-mono text-sm relative z-10">
                           <div className="flex justify-between text-gray-400">
                              <span>Высота:</span> <span className="text-white">30 см</span>
                           </div>
                           <div className="flex justify-between text-gray-400">
                              <span>Тип:</span> <span className="text-white">RGB Динамика</span>
                           </div>
                           <div className="flex justify-between text-gray-400">
                              <span>Цена:</span> <span className="text-white">{PAGE_DATA.price} ₸/см</span>
                           </div>
                           <div className="h-px bg-slate-700 my-2"></div>
                           <div className="flex justify-between items-end pt-2">
                              <span className="text-gray-400">Итого:</span>
                              <span className="text-2xl font-bold text-green-500">96 000 ₸</span>
                           </div>
                        </div>
                        <Link href="/calculator" className="mt-6 w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-green-900/20 relative z-10">
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
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-blue-500 to-green-500 opacity-50"></div>
               
               <div className="grid md:grid-cols-3 gap-12">
                  <div className="md:col-span-1">
                     <h2 className="text-2xl font-bold text-white mb-4 leading-tight">
                        Smart LED в Астане
                     </h2>
                     <div className="w-12 h-1 bg-green-500 rounded-full mb-6"></div>
                     <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                        Техническая справка
                     </p>
                  </div>
                  <div className="md:col-span-2 text-sm text-gray-400 leading-relaxed">
                     <p className="mb-4">
                        Пиксельные вывески (Smart LED) — выбор бизнеса, работающего в сфере развлечений и ритейла. Компания ADLight проектирует динамические вывески любой сложности. Мы используем полноцветные RGB-модули и влагозащищенные пиксели диаметром 9-12 мм.
                     </p>
                     <p>
                        Главное преимущество технологии — возможность программирования световых сценариев. Контроллеры позволяют регулировать скорость мерцания, яркость и гамму. Алюмокомпозитная основа букв гарантирует жесткость конструкции.
                     </p>
                  </div>
               </div>
            </div>

         </div>
      </section>

      {/* 8. OTHER COMPONENTS */}
      <ProjectsBento title="Наши работы" subtitle="Динамика и свет" />
      <ReviewsCarousel />
      <ServicesCarousel title="Другие виды" subtitle="Варианты исполнения" hiddenLink="/services/volume-letters"/>
      <CallToAction source="Услуга: Пиксели (LED)" />

    </div>
  );
}