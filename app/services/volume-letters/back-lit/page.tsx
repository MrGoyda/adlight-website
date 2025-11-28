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
  Gem,          // Для "Статуса/Роскоши"
  Utensils,     // Для ресторанов
  Building2,    // Для офисов
  Landmark,     // Для исторических зданий
  AlertTriangle, // Для предупреждения
  Sun,
  Moon
} from "lucide-react";

// --- ИМПОРТ КОМПОНЕНТОВ ---
import CallToAction from "@/components/CallToAction";
import ServicesCarousel from "@/components/ServicesCarousel";
import ReviewsCarousel from "@/components/ReviewsCarousel";

// Данные страницы
const PAGE_DATA = {
  title: "Объемные буквы с контражурной подсветкой",
  subtitle: "Эффект «парения» и деликатная роскошь. Идеальное решение для тех, кто ценит стиль выше простой яркости.",
  price: "550", // Цена за см
  images: {
    day: "/images/letters/back-lit-day.png",
    night: "/images/letters/back-lit-night.png"
  }
};

export default function BackLitLettersPage() {
  const [isNightMode, setIsNightMode] = useState(true);
  const [lightTemp, setLightTemp] = useState<'warm' | 'cold' | 'rgb'>('warm');

  // --- НОВЫЕ НАСТРОЙКИ СВЕЧЕНИЯ (REALISTIC TEXT SHADOWS) ---
  // Используем многослойные тени для имитации мягкого ореола
  const glowStyles = {
    warm: {
      textShadow: "0 0 15px rgba(255,180,80, 0.8), 0 0 50px rgba(255,160,50, 0.5), 0 0 120px rgba(255,140,0, 0.3)",
      color: "#1e293b" // Темный цвет лица буквы (Slate-800)
    },
    cold: {
      textShadow: "0 0 15px rgba(200,230,255, 0.9), 0 0 60px rgba(180,220,255, 0.6), 0 0 150px rgba(150,200,255, 0.4)",
      color: "#1e293b"
    },
    rgb: {
      textShadow: "0 0 20px rgba(255,0,255, 0.7), 0 0 70px rgba(220,0,255, 0.5), 0 0 150px rgba(180,0,255, 0.3)",
      color: "#1e293b"
    },
  };

  const glowText = {
    warm: "Уютная атмосфера. Идеально для ресторанов, пекарен и лаунж-зон.",
    cold: "Строгость и чистота. Выбор банков, клиник и IT-офисов.",
    rgb: "Драйв и внимание. Для баров, клубов и креативных пространств.",
  };

  return (
    <div className="min-h-screen bg-[#0F172A] font-sans selection:bg-cyan-500/30">
      
      {/* 1. PRODUCT HERO */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F172A]/80 to-[#0F172A]"></div>
        {/* Голубое свечение для "воздушности" */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
           
           {/* Навигация */}
           <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 mb-8">
              <Link href="/" className="hover:text-white transition">Главная</Link>
              <ChevronRight className="w-3 h-3"/>
              <Link href="/services/volume-letters" className="hover:text-white transition">Объемные буквы</Link>
              <ChevronRight className="w-3 h-3"/>
              <span className="text-cyan-500 font-medium">Контражур</span>
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
                       <CheckCircle className="w-5 h-5 text-cyan-500"/> Мягкий световой ореол вокруг буквы
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-cyan-500"/> Читаемость без ослепления глаз
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-cyan-500"/> Премиальный вид для фасадов и интерьеров
                    </li>
                 </ul>

                 <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/calculator" className="flex items-center justify-center gap-2 bg-cyan-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-cyan-700 transition shadow-lg shadow-cyan-900/20 active:scale-95">
                       <Calculator className="w-5 h-5"/> Заказать дизайн-макет
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
                    <button onClick={() => setIsNightMode(true)} className={`p-2 rounded-full transition-all ${isNightMode ? 'bg-cyan-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                       <Moon className="w-5 h-5"/>
                    </button>
                 </div>

                 <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-slate-700 relative shadow-2xl shadow-cyan-500/10 bg-slate-900">
                    <Image 
                       src={isNightMode ? PAGE_DATA.images.night : PAGE_DATA.images.day} 
                       alt="Контражурная вывеска" 
                       fill 
                       className="object-cover transition-all duration-500"
                    />
                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-medium text-white border border-white/10">
                       {isNightMode ? "Эффект «Парения» ночью" : "Строгий вид днем"}
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
               <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/10 text-cyan-500 mb-6">
                  <Gem className="w-8 h-8"/>
               </div>
               <h2 className="text-3xl font-bold text-white mb-6">Магия света</h2>
               <p className="text-gray-400 text-lg leading-relaxed mb-8">
                  Контражур (от фр. <span className="italic text-white">contre-jour</span> — против света) — это технология, при которой лицевая часть буквы остается темной, а свет направлен назад. Отражаясь от поверхности, свет создает мягкий сияющий ореол, который визуально отрывает вывеску от стены.
               </p>
               <p className="text-white font-medium text-lg">
                  Такая вывеска не кричит. Она шепчет о надежности и вкусе.
               </p>
            </div>

            {/* СЕГМЕНТАЦИЯ (ДЛЯ КОГО) */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-[#0B1120] p-8 rounded-3xl border border-slate-800 hover:border-cyan-500/30 transition group text-center">
                    <div className="w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-500 group-hover:scale-110 transition"><Utensils className="w-7 h-7"/></div>
                    <h3 className="text-xl font-bold text-white mb-3">Рестораны и Бары</h3>
                    <p className="text-gray-400 text-sm">Создает уютную атмосферу, не слепит посетителей на летних террасах.</p>
                </div>
                <div className="bg-[#0B1120] p-8 rounded-3xl border border-slate-800 hover:border-cyan-500/30 transition group text-center">
                    <div className="w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-500 group-hover:scale-110 transition"><Building2 className="w-7 h-7"/></div>
                    <h3 className="text-xl font-bold text-white mb-3">Офисы и Ресепшн</h3>
                    <p className="text-gray-400 text-sm">Идеально смотрится в интерьере, подчеркивая логотип на стене за стойкой.</p>
                </div>
                <div className="bg-[#0B1120] p-8 rounded-3xl border border-slate-800 hover:border-cyan-500/30 transition group text-center">
                    <div className="w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-purple-500 group-hover:scale-110 transition"><Landmark className="w-7 h-7"/></div>
                    <h3 className="text-xl font-bold text-white mb-3">Исторические здания</h3>
                    <p className="text-gray-400 text-sm">Мягкий свет деликатно подчеркивает архитектуру, не нарушая облик фасада.</p>
                </div>
            </div>
         </div>
      </section>

      {/* 3. COLOR PICKER (ОБНОВЛЕННАЯ РЕАЛИСТИЧНАЯ ИМИТАЦИЯ) */}
      <section className="py-24 bg-[#0F172A] relative overflow-hidden">
         <div className="container mx-auto px-4 relative z-10">
             <div className="flex flex-col lg:flex-row gap-12 items-center">
                 
                 <div className="lg:w-1/2">
                    <h2 className="text-3xl font-bold text-white mb-6">Выберите настроение</h2>
                    <p className="text-gray-400 mb-8">
                       Цвет ореола кардинально меняет восприятие бренда. Выберите температуру свечения, чтобы увидеть разницу.
                    </p>

                    <div className="space-y-4">
                        {/* Кнопка WARM */}
                        <button 
                           onClick={() => setLightTemp('warm')}
                           className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${lightTemp === 'warm' ? 'bg-orange-900/20 border-orange-500/50 text-white' : 'bg-slate-900 border-slate-800 text-gray-400 hover:border-slate-700'}`}
                        >
                           <div className="flex items-center gap-3">
                              <div className="w-4 h-4 rounded-full bg-orange-300 shadow-[0_0_10px_rgba(253,186,116,0.8)]"></div>
                              <span className="font-bold">Теплый белый (3000K)</span>
                           </div>
                           {lightTemp === 'warm' && <CheckCircle className="w-5 h-5 text-orange-500"/>}
                        </button>

                        {/* Кнопка COLD */}
                        <button 
                           onClick={() => setLightTemp('cold')}
                           className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${lightTemp === 'cold' ? 'bg-blue-900/20 border-blue-500/50 text-white' : 'bg-slate-900 border-slate-800 text-gray-400 hover:border-slate-700'}`}
                        >
                           <div className="flex items-center gap-3">
                              <div className="w-4 h-4 rounded-full bg-blue-100 shadow-[0_0_10px_rgba(219,234,254,0.8)]"></div>
                              <span className="font-bold">Холодный белый (6000K)</span>
                           </div>
                           {lightTemp === 'cold' && <CheckCircle className="w-5 h-5 text-blue-500"/>}
                        </button>

                        {/* Кнопка RGB */}
                        <button 
                           onClick={() => setLightTemp('rgb')}
                           className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${lightTemp === 'rgb' ? 'bg-purple-900/20 border-purple-500/50 text-white' : 'bg-slate-900 border-slate-800 text-gray-400 hover:border-slate-700'}`}
                        >
                           <div className="flex items-center gap-3">
                              <div className="w-4 h-4 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]"></div>
                              <span className="font-bold">Цветной (RGB)</span>
                           </div>
                           {lightTemp === 'rgb' && <CheckCircle className="w-5 h-5 text-purple-500"/>}
                        </button>
                    </div>
                 </div>

                 <div className="lg:w-1/2 w-full flex flex-col items-center">
                     {/* Демо-карточка с РЕАЛИСТИЧНОЙ подсветкой */}
                     <div className="relative w-full aspect-video bg-[#0F172A] rounded-3xl border border-slate-800 flex items-center justify-center overflow-hidden">
                        {/* Текстура стены (фон) - используем качественную бетонную текстуру */}
                        <div 
                          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center opacity-40 mix-blend-overlay"
                          style={{ filter: 'contrast(120%) brightness(80%)' }} // Немного затемним и добавим контраста стене
                        ></div>

                        {/* Сама имитация буквы (Текст с тенями) */}
                        <h3 
                           className="relative z-10 text-8xl sm:text-9xl md:text-[10rem] font-black tracking-widest select-none transition-all duration-500"
                           style={glowStyles[lightTemp]} // Применяем стили из объекта
                        >
                           AD
                        </h3>
                     </div>
                     
                     {/* Описание выбранного цвета */}
                     <div className="mt-6 text-center animate-in fade-in slide-in-from-bottom-2 duration-300" key={lightTemp}>
                        <p className="text-cyan-400 font-bold text-lg mb-1">Эффект:</p>
                        <p className="text-gray-400">{glowText[lightTemp]}</p>
                     </div>
                 </div>

             </div>
         </div>
      </section>

      {/* 4. EXPERT ADVICE (ПРЕДУПРЕЖДЕНИЕ О ГЛЯНЦЕ) */}
      <section className="py-24 bg-slate-950 border-y border-slate-800">
         <div className="container mx-auto px-4 max-w-5xl">
            <div className="bg-yellow-900/10 border border-yellow-500/20 p-8 md:p-12 rounded-3xl flex flex-col md:flex-row gap-8 items-start">
               <div className="p-4 bg-yellow-500/10 rounded-2xl text-yellow-500 shrink-0">
                  <AlertTriangle className="w-10 h-10"/>
               </div>
               <div>
                  <h3 className="text-2xl font-bold text-white mb-4">Требования к поверхности монтажа</h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                     Для идеального контражура важен фон!
                     <br/><br/>
                     <span className="text-white">❌ Глянцевые поверхности</span> (стекло, керамогранит) отражают диоды как зеркало. Вы увидите не ореол, а "точки" света.
                     <br/>
                     <span className="text-white">✅ Матовые поверхности</span> (кирпич, бетон, дерево) идеально рассеивают свет.
                  </p>
                  <div className="p-4 bg-slate-900/80 rounded-xl border border-yellow-500/10 text-sm text-gray-300">
                     <strong className="text-yellow-500">Решение от ADLight:</strong> Если у вас глянцевый фасад, мы используем специальные матовые подложки-рассеиватели под каждую букву.
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
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Стоимость и Материалы</h2>
                    <p className="text-gray-400 mb-8">
                       Цена немного выше лицевой подсветки из-за использования дистанционных держателей и задней стенки из прозрачного акрила.
                    </p>
                    
                    <div className="space-y-0 divide-y divide-slate-800 rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
                       {[
                          {type: "ПВХ + Пленка", effect: "Классический матовый", rec: "Бюджетно"},
                          {type: "Черный Акрил", effect: "Глубокий глянец", rec: "Стильно"},
                          {type: "Нержавейка", effect: "Золото / Серебро", rec: "Premium"},
                       ].map((row, i) => (
                          <div key={i} className="flex justify-between p-4 text-sm hover:bg-slate-800 transition">
                             <span className="text-white font-bold">{row.type}</span>
                             <span className="text-gray-400 hidden sm:block">{row.effect}</span>
                             <span className="text-cyan-500 text-xs uppercase font-bold border border-cyan-500/30 px-2 py-0.5 rounded bg-cyan-500/10">{row.rec}</span>
                          </div>
                       ))}
                    </div>
                 </div>

                 <div className="md:w-1/2 w-full">
                    <div className="bg-slate-900 rounded-3xl p-8 border border-slate-700">
                        <h3 className="text-white font-bold mb-6 flex justify-between">
                            Пример: <span className="text-cyan-500">"BAR"</span> (3 буквы)
                        </h3>
                        <div className="space-y-3 font-mono text-sm">
                           <div className="flex justify-between text-gray-400">
                              <span>Высота:</span> <span className="text-white">50 см</span>
                           </div>
                           <div className="flex justify-between text-gray-400">
                              <span>Цена:</span> <span className="text-white">{PAGE_DATA.price} ₸/см</span>
                           </div>
                           <div className="h-px bg-slate-700 my-2"></div>
                           <div className="flex justify-between items-end">
                              <span className="text-gray-400">Расчет:</span>
                              <span className="text-white">3 × 50 × {PAGE_DATA.price}</span>
                           </div>
                           <div className="flex justify-between items-end pt-2">
                              <span className="text-gray-400">Итого:</span>
                              <span className="text-2xl font-bold text-cyan-500">82 500 ₸</span>
                           </div>
                        </div>
                        <Link href="/calculator" className="mt-6 w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-cyan-900/20">
                            <Calculator className="w-4 h-4"/> Рассчитать свою вывеску
                        </Link>
                    </div>
                 </div>

             </div>
         </div>
      </section>

      {/* 6. SEO TEXT (MINIMALIST) */}
      <section className="py-20 bg-[#0B1120] border-t border-slate-800">
         <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">
               
               <div className="space-y-4">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                     <span className="w-1 h-6 bg-cyan-500 rounded-full"></span>
                     Эффект парения (Halo Lit)
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                     Мы производим вывески с обратным свечением, используя влагозащищенные модули IP67. Лицевая панель может быть выполнена из нержавеющей стали, черного акрила или пластика с пленкой.
                  </p>
               </div>

               <div className="space-y-4">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                     <span className="w-1 h-6 bg-cyan-500 rounded-full"></span>
                     Монтаж в Астане
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                     Критически важен правильный монтаж. Наши специалисты подбирают оптимальную длину дистанционных держателей (от 20 до 50 мм) в зависимости от типа фасада, чтобы добиться идеально ровного светового ореола без теней от креплений.
                  </p>
               </div>

            </div>
         </div>
      </section>

      {/* 7. OTHER COMPONENTS */}
      <ReviewsCarousel />
      <ServicesCarousel title="Другие виды" subtitle="Варианты исполнения" hiddenLink="/services/volume-letters"/>
      <CallToAction source="Услуга: Контражур" />

    </div>
  );
}