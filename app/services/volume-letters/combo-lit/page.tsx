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
  Crown,        // Корона (Статус)
  Gem,          // Драгоценность
  Thermometer,
  Settings,     // Настройки/Монтаж
  Palette,      // Цвета
  Lightbulb,
  Ruler    // Идея
} from "lucide-react";

// --- ИМПОРТ КОМПОНЕНТОВ ---
import CallToAction from "@/components/CallToAction";
import ServicesCarousel from "@/components/ServicesCarousel";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import ProjectsBento from "@/components/ProjectsBento";

// Данные страницы
const PAGE_DATA = {
  title: "Комбинированная подсветка: Лицо + Контражур",
  subtitle: "Двойной световой эффект для брендов, которые привыкли доминировать. Максимальный статус и читаемость.",
  price: "850", // Цена за см
  images: {
    day: "/images/letters/combo-lit-day.png",
    night: "/images/letters/combo-lit-night.png"
  }
};

export default function ComboLitLettersPage() {
  const [isNightMode, setIsNightMode] = useState(true);
  const [demoMode, setDemoMode] = useState<'face' | 'back' | 'combo'>('combo');

  // CSS стили для симуляции режимов
  const getDemoStyle = () => {
    switch (demoMode) {
      case 'face':
        return { 
          color: '#ffffff', 
          textShadow: '0 0 20px rgba(255,255,255,0.5)',
          filter: 'drop-shadow(0 0 0 transparent)' 
        };
      case 'back':
        return { 
          color: '#1e293b', // Темно-серый (не светится)
          textShadow: 'none',
          filter: 'drop-shadow(0 0 30px rgba(255,165,0,0.8)) drop-shadow(0 0 60px rgba(255,140,0,0.5))' // Ореол
        };
      case 'combo':
        return { 
          color: '#ffffff', 
          textShadow: '0 0 20px rgba(255,255,255,0.5)',
          filter: 'drop-shadow(0 0 30px rgba(255,165,0,0.8)) drop-shadow(0 0 60px rgba(255,140,0,0.5))'
        };
    }
  };

  const getDemoDescription = () => {
    switch (demoMode) {
      case 'face': return "Горит только лицевая часть. Четкость и яркость.";
      case 'back': return "Горит только задняя часть. Объем и парение.";
      case 'combo': return "Включены оба контура. Максимальный эффект 'Роллс-Ройса'.";
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] font-sans selection:bg-yellow-500/30">
      
      {/* 1. PRODUCT HERO */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F172A]/80 to-[#0F172A]"></div>
        {/* Золотое свечение для "Премиум" */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-yellow-600/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
           
           {/* Навигация */}
           <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 mb-8">
              <Link href="/" className="hover:text-white transition">Главная</Link>
              <ChevronRight className="w-3 h-3"/>
              <Link href="/services/volume-letters" className="hover:text-white transition">Объемные буквы</Link>
              <ChevronRight className="w-3 h-3"/>
              <span className="text-yellow-500 font-medium">Комбинированная</span>
           </div>

           <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Текст */}
              <div>
                 <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-bold text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 rounded-full uppercase tracking-wider">
                    <Crown className="w-4 h-4"/> Premium Segment
                 </div>
                 <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    {PAGE_DATA.title}
                 </h1>
                 <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                    {PAGE_DATA.subtitle}
                 </p>
                 
                 <ul className="space-y-3 mb-10">
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-yellow-500"/> Сочетает яркость лица и магию ореола
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-yellow-500"/> Самая сложная технология производства
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-yellow-500"/> Эксклюзивный дизайн 360°
                    </li>
                 </ul>

                 <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/calculator" className="flex items-center justify-center gap-2 bg-yellow-600 text-black px-8 py-4 rounded-xl font-bold hover:bg-yellow-500 transition shadow-lg shadow-yellow-900/20 active:scale-95">
                       <Calculator className="w-5 h-5"/> Получить VIP-предложение
                    </Link>
                    <a href="https://wa.me/77071356701" target="_blank" className="flex items-center justify-center gap-2 border border-slate-700 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition">
                       <MessageCircle className="w-5 h-5 text-green-500"/> WhatsApp
                    </a>
                 </div>
              </div>

              {/* Интерактивное фото */}
              <div className="relative">
                 <div className="absolute top-4 right-4 z-20 bg-slate-900/80 backdrop-blur-md border border-white/10 p-1 rounded-full flex gap-1">
                    <button onClick={() => setIsNightMode(false)} className={`p-2 rounded-full transition-all ${!isNightMode ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                       <Sun className="w-5 h-5"/>
                    </button>
                    <button onClick={() => setIsNightMode(true)} className={`p-2 rounded-full transition-all ${isNightMode ? 'bg-yellow-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                       <Moon className="w-5 h-5"/>
                    </button>
                 </div>

                 <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-slate-700 relative shadow-2xl shadow-yellow-500/10 bg-slate-900">
                    <Image 
                       src={isNightMode ? PAGE_DATA.images.night : PAGE_DATA.images.day} 
                       alt="Комбинированная вывеска" 
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

      {/* 2. CONCEPT (ЧТО ЭТО ТАКОЕ) */}
      <section className="py-24 bg-slate-950">
         <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
               <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-500/10 text-yellow-500 mb-6">
                  <Gem className="w-8 h-8"/>
               </div>
               <h2 className="text-3xl font-bold text-white mb-6">Когда компромиссы неуместны</h2>
               <p className="text-gray-400 text-lg leading-relaxed mb-8">
                  Это гибридная технология, объединяющая два типа засветки в одной букве. Лицевое свечение обеспечивает 100% читаемость бренда. Контражур создает мягкий сияющий ореол на фасаде, добавляя объем.
               </p>
               <p className="text-white font-medium text-lg">
                  Такие вывески выбирают флагманы рынка: банки, штаб-квартиры корпораций, премиальные рестораны. Это сигнал для клиента: "Здесь всё на высшем уровне".
               </p>
            </div>
         </div>
      </section>

      {/* 3. ИНТЕРАКТИВНЫЙ КОНСТРУКТОР (UI/UX IDEA) */}
      <section className="py-24 bg-[#0F172A] relative overflow-hidden">
         <div className="container mx-auto px-4 relative z-10">
             <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-3xl p-8 md:p-12 flex flex-col lg:flex-row gap-12 items-center shadow-2xl">
                 
                 <div className="lg:w-1/2 w-full">
                    <h2 className="text-3xl font-bold text-white mb-6">Управляйте светом</h2>
                    <p className="text-gray-400 mb-8">
                       Мы можем настроить разные сценарии включения для вашей вывески. Посмотрите, как меняется восприятие.
                    </p>
                    
                    <div className="space-y-3">
                       <button 
                          onClick={() => setDemoMode('face')}
                          className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${demoMode === 'face' ? 'bg-blue-500/20 border-blue-500 text-white' : 'bg-slate-950/50 border-slate-700 text-gray-400 hover:border-slate-600'}`}
                       >
                          <span className="font-bold">Только лицо</span>
                          <span className="text-xs uppercase tracking-widest opacity-60">Читаемость</span>
                       </button>
                       <button 
                          onClick={() => setDemoMode('back')}
                          className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${demoMode === 'back' ? 'bg-orange-500/20 border-orange-500 text-white' : 'bg-slate-950/50 border-slate-700 text-gray-400 hover:border-slate-600'}`}
                       >
                          <span className="font-bold">Только контражур</span>
                          <span className="text-xs uppercase tracking-widest opacity-60">Стиль</span>
                       </button>
                       <button 
                          onClick={() => setDemoMode('combo')}
                          className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${demoMode === 'combo' ? 'bg-gradient-to-r from-yellow-600 to-orange-600 border-orange-400 text-white shadow-lg' : 'bg-slate-950/50 border-slate-700 text-gray-400 hover:border-slate-600'}`}
                       >
                          <span className="font-bold">COMBO! (Всё сразу)</span>
                          <span className="text-xs uppercase tracking-widest opacity-100 font-bold">MAX эффект</span>
                       </button>
                    </div>
                 </div>

                 {/* ВИЗУАЛИЗАТОР */}
                 <div className="lg:w-1/2 w-full flex flex-col items-center">
                     <div className="relative w-full aspect-video bg-[#1e293b] rounded-2xl border border-slate-700 flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')]"></div>
                        
                        {/* Текст с динамическими стилями */}
                        <h3 
                           className="relative z-10 text-8xl md:text-9xl font-black tracking-widest select-none transition-all duration-500 ease-out"
                           style={getDemoStyle()}
                        >
                           AD
                        </h3>
                     </div>
                     <p className="mt-6 text-center text-gray-400 text-sm animate-pulse">
                        {getDemoDescription()}
                     </p>
                 </div>

             </div>
         </div>
      </section>

      {/* 4. WHY SO EXPENSIVE (ТЕХНИЧЕСКИЙ РАЗБОР) */}
      <section className="py-24 bg-slate-950 border-y border-slate-800">
         <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">Почему это стоит своих денег?</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
               <div className="bg-[#0B1120] p-8 rounded-3xl border border-slate-800 relative group hover:border-yellow-500/30 transition">
                  <div className="w-14 h-14 bg-yellow-500/10 flex items-center justify-center mb-6 text-yellow-500 rounded-xl"><Zap className="w-7 h-7"/></div>
                  <h3 className="text-xl font-bold text-white mb-4">Двойной свет</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                     Внутри устанавливается в 2 раза больше светодиодов: один контур светит на лицо, второй — на стену. Используем мощные модули 360°.
                  </p>
               </div>
               <div className="bg-[#0B1120] p-8 rounded-3xl border border-slate-800 relative group hover:border-yellow-500/30 transition">
                  <div className="w-14 h-14 bg-yellow-500/10 flex items-center justify-center mb-6 text-yellow-500 rounded-xl"><Settings className="w-7 h-7"/></div>
                  <h3 className="text-xl font-bold text-white mb-4">Сложность сборки</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                     Внутри буквы создается светоблокирующая перегородка, чтобы свет от лица не перебивал ореол. Это ювелирная ручная работа.
                  </p>
               </div>
               <div className="bg-[#0B1120] p-8 rounded-3xl border border-slate-800 relative group hover:border-yellow-500/30 transition">
                  <div className="w-14 h-14 bg-yellow-500/10 flex items-center justify-center mb-6 text-yellow-500 rounded-xl"><Thermometer className="w-7 h-7"/></div>
                  <h3 className="text-xl font-bold text-white mb-4">Инженерная надежность</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                     Соединение металла и акрила — риск при перепадах температур. Мы используем технологию «плавающего крепления» и клеи, устойчивые к -40°C.
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* 5. ЦЕНА И РАСЧЕТ */}
      <section className="py-24 bg-[#0F172A]">
         <div className="container mx-auto px-4">
             <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center">
                 
                 <div className="md:w-1/2">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Идеи для дизайна</h2>
                    <p className="text-gray-400 mb-8">
                       Комбинированные буквы дают простор для творчества. Вот популярные связки материалов.
                    </p>
                    
                    <div className="space-y-3">
                       <div className="flex items-center gap-4 p-4 bg-slate-900 rounded-xl border border-slate-800">
                           <div className="w-3 h-3 bg-white rounded-full shadow-[0_0_10px_white]"></div>
                           <div>
                              <h4 className="text-white font-bold text-sm">Классика</h4>
                              <p className="text-xs text-gray-500">Белое лицо + Белый ореол. Максимально ярко.</p>
                           </div>
                       </div>
                       <div className="flex items-center gap-4 p-4 bg-slate-900 rounded-xl border border-slate-800">
                           <div className="w-3 h-3 bg-white rounded-full shadow-[0_0_10px_red]"></div>
                           <div>
                              <h4 className="text-white font-bold text-sm">Контраст</h4>
                              <p className="text-xs text-gray-500">Белое лицо + Красный/Синий ореол. Агрессивно.</p>
                           </div>
                       </div>
                       <div className="flex items-center gap-4 p-4 bg-slate-900 rounded-xl border border-slate-800">
                           <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-[0_0_10px_yellow]"></div>
                           <div>
                              <h4 className="text-white font-bold text-sm">Gold Premium</h4>
                              <p className="text-xs text-gray-500">Золотой борт + Белое лицо + Теплый ореол.</p>
                           </div>
                       </div>
                    </div>
                 </div>

                 <div className="md:w-1/2 w-full">
                    <div className="bg-slate-900 rounded-3xl p-8 border border-slate-700">
                        <h3 className="text-white font-bold mb-6 flex justify-between">
                            Пример: <span className="text-yellow-500">"LUXURY"</span> (6 букв)
                        </h3>
                        <div className="space-y-3 font-mono text-sm">
                           <div className="flex justify-between text-gray-400">
                              <span>Высота:</span> <span className="text-white">40 см</span>
                           </div>
                           <div className="flex justify-between text-gray-400">
                              <span>Цена:</span> <span className="text-white">{PAGE_DATA.price} ₸/см</span>
                           </div>
                           <div className="h-px bg-slate-700 my-2"></div>
                           <div className="flex justify-between items-end">
                              <span className="text-gray-400">Расчет:</span>
                              <span className="text-white">6 × 40 × {PAGE_DATA.price}</span>
                           </div>
                           <div className="flex justify-between items-end pt-2">
                              <span className="text-gray-400">Итого:</span>
                              <span className="text-2xl font-bold text-yellow-500">204 000 ₸</span>
                           </div>
                        </div>
                        <Link href="/calculator" className="mt-6 w-full py-3 bg-yellow-600 hover:bg-yellow-700 text-black font-bold rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-yellow-900/20">
                            <Calculator className="w-4 h-4"/> Рассчитать свою вывеску
                        </Link>
                    </div>
                 </div>

             </div>
         </div>
      </section>

      {/* 7. ИНФОРМАЦИЯ О ПРОИЗВОДСТВЕ (SEO-FRIENDLY) */}
      <section className="py-20 bg-[#0B1120] border-t border-slate-800">
         <div className="container mx-auto px-4">
            
            <div className="max-w-5xl mx-auto bg-slate-900/30 border border-slate-800 rounded-3xl p-8 md:p-12 relative overflow-hidden">
               {/* Фоновый декор */}
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-purple-500 to-blue-500 opacity-50"></div>
               <div className="absolute -right-10 -top-10 w-64 h-64 bg-blue-500/5 blur-[80px] rounded-full pointer-events-none"></div>

               <div className="grid md:grid-cols-3 gap-12">
                  
                  {/* Заголовок (Левая колонка) */}
                  <div className="md:col-span-1">
                     <h2 className="text-2xl font-bold text-white mb-4 leading-tight">
                        Изготовление букв в Астане
                     </h2>
                     <div className="w-12 h-1 bg-orange-500 rounded-full mb-6"></div>
                     {/* ИСПРАВЛЕНО ТУТ: */}
                     <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                        Техническая справка
                     </p>
                  </div>

                  {/* Текст (Правые 2 колонки) */}
                  <div className="md:col-span-2 grid sm:grid-cols-2 gap-8 text-sm text-gray-400 leading-relaxed">
                     <div>
                        <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                           <Thermometer className="w-4 h-4 text-blue-500"/> Климат-контроль
                        </h4>
                        <p>
                           Объемные буквы со световым лицом — стандарт наружной рекламы в Казахстане. Мы учитываем климат Астаны: используем морозостойкий акрил и герметичную коммутацию. Вывеска работает бесперебойно от -40°C до +40°C.
                        </p>
                     </div>
                     <div>
                        <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                           <Ruler className="w-4 h-4 text-green-500"/> Геометрия
                        </h4>
                        <p>
                           Каждая буква — отдельный световой элемент, что повышает статус заведения. Мы производим конструкции на собственном ЧПУ-оборудовании, что гарантирует идеальную стыковку бортов и отсутствие световых зазоров.
                        </p>
                     </div>
                  </div>

               </div>
            </div>

         </div>
      </section>

      {/* 7. OTHER COMPONENTS */}
      <ProjectsBento title="Примеры наших работ" subtitle="Сложные проекты" />
      <ReviewsCarousel />
      <ServicesCarousel title="Другие виды" subtitle="Варианты исполнения" hiddenLink="/services/volume-letters"/>
      <CallToAction source="Услуга: Комбо (Full+Back)" />

    </div>
  );
}