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
  Layers, 
  Shield, 
  Zap, 
  Sun, 
  Moon, 
  Palette,
  PenTool,
  BoxSelect,    // Иконка "Выделение/Контур"
  Wrench,       // Обслуживание
  AlertTriangle,
  Eye,
  Lightbulb,
  PaintBucket,
  Gem
} from "lucide-react";

// --- ИМПОРТ КОМПОНЕНТОВ ---
import CallToAction from "@/components/CallToAction";
import ServicesCarousel from "@/components/ServicesCarousel";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import ProjectsBento from "@/components/ProjectsBento";

// Данные страницы
const PAGE_DATA = {
  title: "Объемные буквы с подсветкой бортов",
  subtitle: "Нестандартное решение: темное лицо, сияющий профиль. Вывеска, которая подчеркивает объем и архитектуру шрифта.",
  price: "600", // Цена за см
  images: {
    day: "/images/letters/side-lit-day.png",
    night: "/images/letters/side-lit-night.png"
  }
};

export default function SideLitLettersPage() {
  const [isNightMode, setIsNightMode] = useState(true);

  return (
    <div className="min-h-screen bg-[#0F172A] font-sans selection:bg-blue-500/30">
      
      {/* 1. PRODUCT HERO */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F172A]/80 to-[#0F172A]"></div>
        {/* Синее свечение */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
           
           {/* Навигация */}
           <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 mb-8">
              <Link href="/" className="hover:text-white transition">Главная</Link>
              <ChevronRight className="w-3 h-3"/>
              <Link href="/services/volume-letters" className="hover:text-white transition">Объемные буквы</Link>
              <ChevronRight className="w-3 h-3"/>
              <span className="text-blue-500 font-medium">Боковое свечение</span>
           </div>

           <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Текст */}
              <div>
                 <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    {PAGE_DATA.title}
                 </h1>
                 <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                    {PAGE_DATA.subtitle}
                 </p>
                 
                 <ul className="space-y-3 mb-10">
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-blue-500"/> Светится только боковая грань (торец)
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-blue-500"/> Лицо — любой цвет (матовый/глянец)
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-blue-500"/> Уникальный эффект «инверсии»
                    </li>
                 </ul>

                 <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/calculator" className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-900/20 active:scale-95">
                       <Calculator className="w-5 h-5"/> Обсудить проект
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
                    <button onClick={() => setIsNightMode(true)} className={`p-2 rounded-full transition-all ${isNightMode ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                       <Moon className="w-5 h-5"/>
                    </button>
                 </div>

                 <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-slate-700 relative shadow-2xl shadow-blue-500/10 bg-slate-900">
                    <Image 
                       src={isNightMode ? PAGE_DATA.images.night : PAGE_DATA.images.day} 
                       alt="Боковое свечение" 
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

      {/* 2. CONCEPT (КОНЦЕПЦИЯ) */}
      <section className="py-24 bg-slate-950">
         <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
               <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 text-blue-500 mb-6">
                  <BoxSelect className="w-8 h-8"/>
               </div>
               <h2 className="text-3xl font-bold text-white mb-6">Переворачиваем правила</h2>
               <p className="text-gray-400 text-lg leading-relaxed mb-8">
                  Обычно в рекламе всё наоборот: лицо светится, борт — нет. В этой технологии лицевая панель остается глухой, а весь световой поток направляется через акриловые борта.
               </p>
               <p className="text-white font-medium text-lg">
                  Это создает эффектный контраст. Буквы выглядят как монолитные объекты, очерченные светом.
               </p>
            </div>

            {/* USE CASES (ГДЕ РАБОТАЕТ) */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-[#0B1120] p-8 rounded-3xl border border-slate-800 hover:border-blue-500/30 transition group">
                    <h3 className="text-xl font-bold text-white mb-3">Интерьеры и Офисы</h3>
                    <p className="text-gray-400 text-sm">С близкого расстояния выглядят как арт-объект. Круто смотрятся темные буквы с белым бортом на светлой стене.</p>
                </div>
                <div className="bg-[#0B1120] p-8 rounded-3xl border border-slate-800 hover:border-blue-500/30 transition group">
                    <h3 className="text-xl font-bold text-white mb-3">Бутики в ТРЦ</h3>
                    <p className="text-gray-400 text-sm">Выделяются на фоне стандартных «светящихся лиц» конкурентов своей строгостью.</p>
                </div>
                {/* NEGATIVE CASE (ВАЖНО!) */}
                <div className="bg-[#0B1120] p-8 rounded-3xl border border-red-900/20 hover:border-red-500/30 transition group">
                    <div className="flex items-center gap-2 text-red-400 font-bold mb-3">
                        <AlertTriangle className="w-5 h-5"/> Не рекомендуем
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Крышные установки</h3>
                    <p className="text-gray-400 text-sm">На большой высоте тонкая полоска света теряется. Там лучше использовать полное световое лицо.</p>
                </div>
            </div>
         </div>
      </section>

      {/* 3. ANATOMY (ТЕХНИЧЕСКИЙ РАЗБОР) */}
      <section className="py-24 bg-[#0F172A]">
         <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">Конструктив ADLight</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
               {/* ЛИЦО */}
               <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-blue-500/30 transition group">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 text-blue-500"><Layers className="w-6 h-6"/></div>
                  <h3 className="text-lg font-bold text-white mb-2">Лицевая часть</h3>
                  <p className="text-gray-400 text-sm mb-3">ПВХ пластик 3–5 мм + пленка Oracal 641.</p>
                  <div className="text-xs text-slate-500 bg-slate-950 p-2 rounded border border-slate-800">
                     <span className="text-white font-bold">Нюанс:</span> Остается аккуратный белый кант (1.5 мм) на стыке.
                  </div>
               </div>

               {/* БОРТ */}
               <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-blue-500/30 transition group">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 text-blue-500"><Zap className="w-6 h-6"/></div>
                  <h3 className="text-lg font-bold text-white mb-2">Световой борт</h3>
                  <p className="text-gray-400 text-sm mb-3">Молочный акрил 3–5 мм.</p>
                  <div className="text-xs text-slate-500 bg-slate-950 p-2 rounded border border-slate-800">
                     Формуем методом термогибки для идеальной геометрии.
                  </div>
               </div>

               {/* ЗАДНИК */}
               <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-blue-500/30 transition group">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 text-blue-500"><Wrench className="w-6 h-6"/></div>
                  <h3 className="text-lg font-bold text-white mb-2">Задняя стенка</h3>
                  <p className="text-gray-400 text-sm mb-3">ПВХ 6–8 мм.</p>
                  <div className="text-xs text-slate-500 bg-slate-950 p-2 rounded border border-slate-800">
                     Крепится на <strong>саморезы</strong>. Легкий доступ к электрике для ремонта.
                  </div>
               </div>

               {/* СВЕТ */}
               <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-blue-500/30 transition group">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 text-blue-500"><Lightbulb className="w-6 h-6"/></div>
                  <h3 className="text-lg font-bold text-white mb-2">Начинка</h3>
                  <p className="text-gray-400 text-sm mb-3">Модули на задней стенке.</p>
                  <div className="text-xs text-slate-500 bg-slate-950 p-2 rounded border border-slate-800">
                     Светят в бока, пробивая акрил насквозь.
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 4. ДИЗАЙНЕРСКИЕ СОЧЕТАНИЯ (ВИЗУАЛИЗАЦИЯ) */}
      <section className="py-24 bg-slate-950 border-y border-slate-800">
         <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">Популярные сочетания</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
               
               {/* Строгий стиль */}
               <div className="group bg-[#0B1120] p-8 rounded-3xl border border-slate-800 text-center hover:border-white/20 transition">
                  <div className="w-24 h-24 mx-auto mb-6 bg-black rounded-xl border-4 border-white shadow-[0_0_20px_rgba(255,255,255,0.5)] flex items-center justify-center text-white font-black text-3xl">
                     AD
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Строгий стиль</h3>
                  <p className="text-gray-400 text-sm">Черное матовое лицо + Белый борт.</p>
               </div>

               {/* Brand Color */}
               <div className="group bg-[#0B1120] p-8 rounded-3xl border border-slate-800 text-center hover:border-blue-500/20 transition">
                  <div className="w-24 h-24 mx-auto mb-6 bg-blue-600 rounded-xl border-4 border-white shadow-[0_0_20px_rgba(255,255,255,0.5)] flex items-center justify-center text-white font-black text-3xl">
                     AD
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Brand Color</h3>
                  <p className="text-gray-400 text-sm">Лицо в цвет бренда (Oracal) + Белый борт.</p>
               </div>

               {/* Full Color */}
               <div className="group bg-[#0B1120] p-8 rounded-3xl border border-slate-800 text-center hover:border-red-500/20 transition">
                  <div className="w-24 h-24 mx-auto mb-6 bg-black rounded-xl border-4 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.6)] flex items-center justify-center text-white font-black text-3xl">
                     AD
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Full Color</h3>
                  <p className="text-gray-400 text-sm">Темное лицо + Цветной светящийся борт.</p>
               </div>

            </div>
         </div>
      </section>

      {/* 5. ЦЕНА И РАСЧЕТ */}
      <section className="py-24 bg-[#0F172A]">
         <div className="container mx-auto px-4">
             <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center">
                 
                 <div className="md:w-1/2">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Стоимость и Уход</h2>
                    <div className="space-y-6">
                       <div className="flex gap-4 items-start text-gray-400 text-sm">
                          <Wrench className="w-5 h-5 text-blue-500 mt-1 shrink-0"/>
                          <p><strong>Обслуживание:</strong> Конструкция на саморезах позволяет легко открыть букву и заменить блок питания без демонтажа всей вывески. Это экономит бюджет.</p>
                       </div>
                       <div className="flex gap-4 items-start text-gray-400 text-sm">
                          <PaintBucket className="w-5 h-5 text-blue-500 mt-1 shrink-0"/>
                          <p><strong>Чистка:</strong> На светящемся борту видна уличная пыль. Рекомендуем мойку 2 раза в год, иначе борт "потускнеет".</p>
                       </div>
                    </div>
                 </div>

                 <div className="md:w-1/2 w-full">
                    <div className="bg-slate-900 rounded-3xl p-8 border border-slate-700">
                        <h3 className="text-white font-bold mb-6 flex justify-between">
                            Пример расчета <span className="text-blue-500">"OFFICE"</span>
                        </h3>
                        <div className="space-y-3 font-mono text-sm">
                           <div className="flex justify-between text-gray-400">
                              <span>Высота:</span> <span className="text-white">40 см</span>
                           </div>
                           <div className="flex justify-between text-gray-400">
                              <span>Кол-во:</span> <span className="text-white">6 букв</span>
                           </div>
                           <div className="flex justify-between text-gray-400">
                              <span>Цена:</span> <span className="text-white">{PAGE_DATA.price} ₸/см</span>
                           </div>
                           <div className="h-px bg-slate-700 my-2"></div>
                           <div className="flex justify-between items-end">
                              <span className="text-gray-400">Итого:</span>
                              <span className="text-2xl font-bold text-blue-500">144 000 ₸</span>
                           </div>
                        </div>
                        <Link href="/calculator" className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-blue-900/20">
                            <Calculator className="w-4 h-4"/> Рассчитать свою вывеску
                        </Link>
                    </div>
                 </div>

             </div>
         </div>
      </section>

      {/* 6. SEO BLOCK (Журнальный стиль) */}
      <section className="py-20 bg-[#0B1120] border-t border-slate-800">
         <div className="container mx-auto px-4">
            
            <div className="max-w-5xl mx-auto bg-slate-900/30 border border-slate-800 rounded-3xl p-8 md:p-12 relative overflow-hidden">
               {/* Декор */}
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 opacity-50"></div>
               <div className="absolute -right-10 -top-10 w-64 h-64 bg-purple-500/5 blur-[80px] rounded-full pointer-events-none"></div>

               <div className="grid md:grid-cols-3 gap-12">
                  
                  {/* Левая колонка: Заголовок */}
                  <div className="md:col-span-1">
                     <h2 className="text-2xl font-bold text-white mb-4 leading-tight">
                        Цельносветовые буквы в Астане
                     </h2>
                     <div className="w-12 h-1 bg-purple-500 rounded-full mb-6"></div>
                     <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                        Техническая справка
                     </p>
                  </div>

                  {/* Правая часть: Текст в 2 колонки */}
                  <div className="md:col-span-2 grid sm:grid-cols-2 gap-8 text-sm text-gray-400 leading-relaxed">
                     <div>
                        <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                           <Gem className="w-4 h-4 text-purple-500"/> Премиум тренд
                        </h4>
                        <p>
                           Буквы со световым бортом — стандарт оформления бутиков, салонов красоты и аптек в 2025 году. В отличие от классики, здесь нет темных рамок — конструкция выглядит монолитной, словно отлитой из света.
                        </p>
                     </div>
                     <div>
                        <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                           <Wrench className="w-4 h-4 text-blue-500"/> Производство
                        </h4>
                        <p>
                           Мы используем автоматические бортогибы и лазерную резку акрила. Это гарантирует идеальную геометрию углов без щелей и «световых пятен». Клей и материалы устойчивы к перепадам температур Астаны.
                        </p>
                     </div>
                  </div>

               </div>
            </div>

         </div>
      </section>

      {/* 7. OTHER COMPONENTS */}
      <ProjectsBento title="Примеры наших работ" subtitle="Вывески в Астане" />
      <ReviewsCarousel />
      <ServicesCarousel title="Другие виды" subtitle="Варианты исполнения" hiddenLink="/services/volume-letters"/>
      <CallToAction source="Услуга: Боковое свечение" />

    </div>
  );
}