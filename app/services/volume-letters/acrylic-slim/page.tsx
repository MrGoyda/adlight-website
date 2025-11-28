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
  Droplets,     // Жидкость
  Minimize,     // Тонкость/Компактность
  ShieldCheck,  // Прочность
  Zap,          // Яркость
  Sun, 
  Moon, 
  Smartphone,   // Сравнение с iPhone
  Scan,         // Детализация
  XCircle,      // Для "Запретов" в сравнении
  Check         // Галочка
} from "lucide-react";

// --- ИМПОРТ КОМПОНЕНТОВ ---
import CallToAction from "@/components/CallToAction";
import ServicesCarousel from "@/components/ServicesCarousel";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import ProjectsBento from "@/components/ProjectsBento";

// Данные страницы
const PAGE_DATA = {
  title: "Буквы из жидкого акрила (Безрамочные)",
  subtitle: "Технология нового поколения. Монолитная прочность, максимальная яркость и полное отсутствие пластиковых рамок.",
  price: "900", // Цена за см
  images: {
    day: "/images/letters/acrylic-slim-day.png",
    night: "/images/letters/acrylic-slim-night.png"
  }
};

export default function LiquidAcrylicPage() {
  const [isNightMode, setIsNightMode] = useState(true);

  return (
    <div className="min-h-screen bg-[#0F172A] font-sans selection:bg-cyan-500/30">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F172A]/80 to-[#0F172A]"></div>
        {/* Циановое техно-свечение */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
           
           {/* Навигация */}
           <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 mb-8">
              <Link href="/" className="hover:text-white transition">Главная</Link>
              <ChevronRight className="w-3 h-3"/>
              <Link href="/services/volume-letters" className="hover:text-white transition">Объемные буквы</Link>
              <ChevronRight className="w-3 h-3"/>
              <span className="text-cyan-500 font-medium">Жидкий акрил</span>
           </div>

           <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Текст */}
              <div>
                 <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 rounded-full uppercase tracking-wider">
                    <Droplets className="w-4 h-4"/> Технология 2025
                 </div>
                 <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    {PAGE_DATA.title}
                 </h1>
                 <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                    {PAGE_DATA.subtitle}
                 </p>
                 
                 <ul className="space-y-3 mb-10">
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-cyan-500"/> <strong>Без рамок:</strong> Лицевая часть не имеет кантов
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-cyan-500"/> <strong>Супер-яркость:</strong> На 30% ярче листового акрила
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-cyan-500"/> <strong>Герметичность:</strong> Монолитная заливка IP67
                    </li>
                 </ul>

                 <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/calculator" className="flex items-center justify-center gap-2 bg-cyan-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-cyan-700 transition shadow-lg shadow-cyan-900/20 active:scale-95">
                       <Calculator className="w-5 h-5"/> Хочу современную вывеску
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
                    <button onClick={() => setIsNightMode(true)} className={`p-2 rounded-full transition-all ${isNightMode ? 'bg-cyan-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                       <Moon className="w-5 h-5"/>
                    </button>
                 </div>

                 <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-slate-700 relative shadow-2xl shadow-cyan-500/10 bg-slate-900">
                    <Image 
                       src={isNightMode ? PAGE_DATA.images.night : PAGE_DATA.images.day} 
                       alt="Буквы из жидкого акрила" 
                       fill 
                       className="object-cover transition-all duration-500"
                    />
                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-medium text-white border border-white/10">
                       {isNightMode ? "Свечение без пятен" : "Идеальный глянец днем"}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 2. CONCEPT (ИННОВАЦИЯ) */}
      <section className="py-24 bg-slate-950">
         <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
               <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/10 text-cyan-500 mb-6">
                  <Smartphone className="w-8 h-8"/>
               </div>
               <h2 className="text-3xl font-bold text-white mb-6">iPhone в мире наружной рекламы</h2>
               <p className="text-gray-400 text-lg leading-relaxed mb-8">
                  Забудьте о клееных швах и пластиковых профилях. Технология жидкого акрила — это процесс, при котором лицевая часть буквы не вырезается из листа, а заливается в алюминиевую форму и застывает под ультрафиолетом.
               </p>
               <p className="text-white font-medium text-lg">
                  Происходит химическая адгезия (сцепление) акрила с металлом. Буква становится единым монолитом.
               </p>
            </div>

            {/* СРАВНЕНИЕ (VS) */}
            <div className="grid md:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto">
                {/* Старая */}
                <div className="bg-[#0B1120] p-8 rounded-3xl border border-slate-800 opacity-60 hover:opacity-100 transition">
                    <h3 className="text-xl font-bold text-gray-400 mb-4 flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-500"/> Обычная буква
                    </h3>
                    <div className="aspect-video relative rounded-xl overflow-hidden mb-6 grayscale">
                        <Image src="/images/letters/face-lit-day.png" alt="Обычная буква" fill className="object-cover"/>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-500">
                        <li>• Пластиковый F-профиль по периметру</li>
                        <li>• Виден стык (кант) 2-3 мм</li>
                        <li>• Со временем внутрь попадает пыль</li>
                    </ul>
                </div>

                {/* Новая */}
                <div className="bg-slate-900 p-8 rounded-3xl border border-cyan-500/50 shadow-2xl shadow-cyan-500/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">ВЫБОР ADLIGHT</div>
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-cyan-500"/> Жидкий акрил
                    </h3>
                    <div className="aspect-video relative rounded-xl overflow-hidden mb-6 border border-cyan-500/20">
                        <Image src="/images/letters/acrylic-slim-day.png" alt="Жидкий акрил" fill className="object-cover"/>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-300">
                        <li className="flex gap-2"><Check className="w-4 h-4 text-cyan-500"/> Лицо вровень с бортом (без рамки)</li>
                        <li className="flex gap-2"><Check className="w-4 h-4 text-cyan-500"/> Монолитная герметичность</li>
                        <li className="flex gap-2"><Check className="w-4 h-4 text-cyan-500"/> +30% к яркости свечения</li>
                    </ul>
                </div>
            </div>
         </div>
      </section>

      {/* 3. SPECS (ХАРАКТЕРИСТИКИ) */}
      <section className="py-24 bg-[#0F172A]">
         <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Инновации в деталях</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
               <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/30 transition group">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 text-blue-500 group-hover:scale-110 transition"><ShieldCheck className="w-6 h-6"/></div>
                  <h3 className="text-lg font-bold text-white mb-2">Алюминиевый борт</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">Окрашивается в любой цвет. Не ржавеет, придает букве жесткость и отводит тепло от диодов.</p>
               </div>
               <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/30 transition group">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4 text-purple-500 group-hover:scale-110 transition"><Minimize className="w-6 h-6"/></div>
                  <h3 className="text-lg font-bold text-white mb-2">Ultra Slim</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">Толщина буквы всего 30 мм (против 60-80 мм у обычных). Выглядит изящно и не громоздко.</p>
               </div>
               <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/30 transition group">
                  <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-4 text-orange-500 group-hover:scale-110 transition"><Zap className="w-6 h-6"/></div>
                  <h3 className="text-lg font-bold text-white mb-2">Люминофор</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">В состав акрила входят частицы люминофора, которые рассеивают свет лучше, чем обычное оргстекло.</p>
               </div>
               <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/30 transition group">
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4 text-green-500 group-hover:scale-110 transition"><Droplets className="w-6 h-6"/></div>
                  <h3 className="text-lg font-bold text-white mb-2">Неубиваемость</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">Лицо и борт спаяны на молекулярном уровне. Внутрь никогда не попадет вода или пыль.</p>
               </div>
            </div>
         </div>
      </section>

      {/* 4. USE CASES & INSTALLATION */}
      <section className="py-24 bg-slate-950 border-y border-slate-800">
         <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-16 items-start">
               
               {/* Левая колонка: Применение */}
               <div className="lg:w-1/2">
                  <h2 className="text-3xl font-bold text-white mb-8">Идеальное применение</h2>
                  <div className="space-y-6">
                     <div className="flex gap-4">
                        <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-cyan-500 shrink-0"><Scan className="w-6 h-6"/></div>
                        <div>
                           <h4 className="text-white font-bold mb-1">Салоны красоты и Клиники</h4>
                           <p className="text-gray-400 text-sm">Тонкие линии без грубых рамок подчеркивают стерильность и эстетику.</p>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-cyan-500 shrink-0"><Minimize className="w-6 h-6"/></div>
                        <div>
                           <h4 className="text-white font-bold mb-1">Интерьеры ТРЦ</h4>
                           <p className="text-gray-400 text-sm">С близкого расстояния (1 метр) обычные буквы выглядят грубовато. Жидкий акрил идеален даже под лупой.</p>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Правая колонка: Монтаж */}
               <div className="lg:w-1/2 bg-[#0B1120] p-8 rounded-3xl border border-slate-800">
                  <h3 className="text-xl font-bold text-white mb-4">Особенности монтажа</h3>
                  <p className="text-gray-400 text-sm mb-6">
                     Так как буквы тонкие и изящные, мы не рекомендуем крепить их на грубую металлическую раму.
                  </p>
                  <div className="space-y-4">
                     <div className="flex items-center gap-3 p-3 bg-slate-900 rounded-lg border border-slate-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-white text-sm">Дистанционные держатели (1-2 см от стены)</span>
                     </div>
                     <div className="flex items-center gap-3 p-3 bg-slate-900 rounded-lg border border-slate-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-white text-sm">Скрытые штифты (вплотную)</span>
                     </div>
                  </div>
               </div>

            </div>
         </div>
      </section>

      {/* 5. PRICING */}
      <section className="py-24 bg-[#0F172A]">
         <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-12">
               <h2 className="text-3xl font-bold text-white mb-4">Стоимость технологий</h2>
               <p className="text-gray-400">Это золотая середина: дороже стандарта, но дешевле сложной "нержавейки".</p>
            </div>

            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
               <div className="grid grid-cols-3 bg-slate-950 p-4 text-xs text-gray-500 font-bold uppercase tracking-wider border-b border-slate-800">
                  <div>Технология</div>
                  <div className="text-center">Яркость</div>
                  <div className="text-right">Цена за 1 см</div>
               </div>
               <div className="divide-y divide-slate-800">
                  <div className="grid grid-cols-3 p-4 items-center opacity-60">
                     <div className="font-medium text-white">Клееный пластик</div>
                     <div className="text-center text-xs">⭐⭐⭐</div>
                     <div className="text-right text-gray-400">~450 ₸</div>
                  </div>
                  <div className="grid grid-cols-3 p-4 items-center bg-cyan-900/10">
                     <div className="font-bold text-white flex items-center gap-2">
                        Жидкий акрил
                        <span className="bg-cyan-500 text-white text-[10px] px-2 rounded-full">TOP</span>
                     </div>
                     <div className="text-center text-xs">⭐⭐⭐⭐⭐</div>
                     <div className="text-right text-cyan-400 font-bold">от {PAGE_DATA.price} ₸</div>
                  </div>
               </div>
            </div>

            <div className="mt-8 text-center">
               <Link href="/calculator" className="inline-flex items-center gap-2 text-white border-b border-cyan-500 pb-1 hover:text-cyan-400 transition">
                  Рассчитать точную стоимость <ArrowRight className="w-4 h-4"/>
               </Link>
            </div>
         </div>
      </section>

      {/* 6. SEO TEXT (ЖУРНАЛЬНЫЙ СТИЛЬ) */}
      <section className="py-20 bg-[#0B1120] border-t border-slate-800">
         <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto bg-slate-900/30 border border-slate-800 rounded-3xl p-8 md:p-12 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 opacity-50"></div>
               <div className="grid md:grid-cols-3 gap-12">
                  <div className="md:col-span-1">
                     <h2 className="text-2xl font-bold text-white mb-4 leading-tight">
                        Liquid Acrylic в Астане
                     </h2>
                     <div className="w-12 h-1 bg-cyan-500 rounded-full mb-6"></div>
                     <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                        Техническая справка
                     </p>
                  </div>
                  <div className="md:col-span-2 text-sm text-gray-400 leading-relaxed">
                     <p className="mb-4">
                        Безрамочные световые буквы (технология Liquid Acrylic) — современный стандарт качественной рекламы. Компания ADLight одной из первых в Астане внедрела технологию заливки акрила. Мы используем алюминиевый борт с полимерным покрытием, который формируется на автоматическом станке.
                     </p>
                     <p>
                        Жидкий акрил заливается в форму и полимеризуется, образуя ударопрочное соединение с металлом. Такие вывески выдерживают ветровые нагрузки и перепады температур от -50°C до +50°C. Глубина корпуса всего 30 мм позволяет использовать их в интерьерах с высокими требованиями к эстетике.
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 7. OTHER COMPONENTS */}
      <ProjectsBento title="Наши работы" subtitle="Современные вывески" />
      <ReviewsCarousel />
      <ServicesCarousel title="Другие виды" subtitle="Варианты исполнения" hiddenLink="/services/volume-letters"/>
      <CallToAction source="Услуга: Жидкий акрил" />

    </div>
  );
}