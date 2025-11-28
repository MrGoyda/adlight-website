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
  Ruler, 
  Palette,
  Lightbulb,
  Eye,
  Info,
  Droplets, // Иконка для мойки/влаги
  AlertTriangle
} from "lucide-react";

// --- ИМПОРТ КОМПОНЕНТОВ ---
import CallToAction from "@/components/CallToAction";
import ServicesCarousel from "@/components/ServicesCarousel";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import ImageGallery from "@/components/ImageGallery";

// Данные страницы
const PAGE_DATA = {
  title: "Объемные буквы со световым лицом и бортом",
  subtitle: "Технология «Full Glow». Максимальная яркость и обзор 360° для тех, кто хочет выделяться.",
  price: "650", // Цена за см
  images: {
    day: "/images/letters/full-lit-day.png",
    night: "/images/letters/full-lit-night.png"
  }
};

export default function FullLitLettersPage() {
  const [isNightMode, setIsNightMode] = useState(true);

  return (
    <div className="min-h-screen bg-[#0F172A] font-sans selection:bg-purple-500/30">
      
      {/* 1. PRODUCT HERO */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden border-b border-slate-800">
        {/* Фон (Фиолетовый акцент для премиальности) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F172A]/80 to-[#0F172A]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
           
           {/* Навигация */}
           <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 mb-8">
              <Link href="/" className="hover:text-white transition">Главная</Link>
              <ChevronRight className="w-3 h-3"/>
              <Link href="/services/volume-letters" className="hover:text-white transition">Объемные буквы</Link>
              <ChevronRight className="w-3 h-3"/>
              <span className="text-purple-400 font-medium">Полное свечение</span>
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
                       <CheckCircle className="w-5 h-5 text-purple-500"/> Светится вся поверхность (эффект «капсулы»)
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-purple-500"/> Изготовлены целиком из акрила
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-purple-500"/> Идеальны для интерьеров и фасадов
                    </li>
                 </ul>

                 <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/calculator" className="flex items-center justify-center gap-2 bg-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-purple-700 transition shadow-lg shadow-purple-900/20 active:scale-95">
                       <Calculator className="w-5 h-5"/> Рассчитать стоимость
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
                    <button onClick={() => setIsNightMode(true)} className={`p-2 rounded-full transition-all ${isNightMode ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                       <Moon className="w-5 h-5"/>
                    </button>
                 </div>

                 <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-slate-700 relative shadow-2xl shadow-purple-500/10 bg-slate-900">
                    <Image 
                       src={isNightMode ? PAGE_DATA.images.night : PAGE_DATA.images.day} 
                       alt="Объемные буквы полное свечение" 
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

      {/* 2. CONCEPT & COMPARISON (СРАВНЕНИЕ) */}
      <section className="py-24 bg-slate-950">
         <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
               <h2 className="text-3xl font-bold text-white mb-6">Чем отличаются от обычных?</h2>
               <p className="text-gray-400 text-lg leading-relaxed">
                  В отличие от классических букв, где светится только лицо, здесь световым является и корпус. 
                  Буква словно отлита из света. Это создает потрясающий визуальный объем.
               </p>
            </div>

            {/* БЛОК СРАВНЕНИЯ */}
            <div className="grid md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
                {/* Обычная */}
                <div className="relative group rounded-2xl overflow-hidden border border-slate-800">
                    <div className="absolute top-4 left-4 z-10 bg-slate-900/80 backdrop-blur px-3 py-1 rounded text-xs text-gray-400 font-bold">ОБЫЧНАЯ БУКВА</div>
                    <div className="aspect-video relative">
                        {/* Используем фото стандартной буквы (face-lit) */}
                        <Image src="/images/letters/face-lit-night.png" alt="Обычная буква" fill className="object-cover opacity-60 grayscale group-hover:grayscale-0 transition duration-500"/>
                    </div>
                    <div className="p-4 bg-slate-900">
                        <p className="text-sm text-gray-400">Светит только вперед (90°)</p>
                    </div>
                </div>

                {/* Полная (VS) */}
                <div className="relative group rounded-2xl overflow-hidden border border-purple-500/50 shadow-2xl shadow-purple-500/20 transform md:scale-110 z-10">
                    <div className="absolute top-4 left-4 z-10 bg-purple-600 text-white px-3 py-1 rounded text-xs font-bold shadow-lg">FULL GLOW</div>
                    <div className="aspect-video relative">
                         {/* Используем фото полной буквы (full-lit) */}
                        <Image src="/images/letters/full-lit-night.png" alt="Полное свечение" fill className="object-cover"/>
                    </div>
                    <div className="p-4 bg-purple-900/20 backdrop-blur">
                        <p className="text-sm text-white font-bold flex items-center gap-2">
                            <Eye className="w-4 h-4 text-purple-400"/> 
                            Заметна с любого угла (180°+)
                        </p>
                    </div>
                </div>
            </div>
         </div>
      </section>

      {/* 3. ANATOMY (ТЕХНИЧЕСКИЙ РАЗБОР) */}
      <section className="py-24 bg-[#0F172A]">
         <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">Анатомия качества</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
               <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-purple-500/30 transition group">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 text-blue-500"><Layers className="w-6 h-6"/></div>
                  <h3 className="text-lg font-bold text-white mb-2">Лицевая часть</h3>
                  <p className="text-gray-400 text-sm">Молочный акрил 3–4 мм. Равномерно рассеивает свет.</p>
               </div>
               <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-purple-500/30 transition group">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4 text-purple-500"><Zap className="w-6 h-6"/></div>
                  <h3 className="text-lg font-bold text-white mb-2">Световой борт</h3>
                  <p className="text-gray-400 text-sm">Светорассеивающий акрил или ПЭТ. Формуем методом термогибки.</p>
               </div>
               <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-purple-500/30 transition group">
                  <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-4 text-orange-500"><Lightbulb className="w-6 h-6"/></div>
                  <h3 className="text-lg font-bold text-white mb-2">Супер-яркость</h3>
                  <p className="text-gray-400 text-sm">Сверхъяркие линзованные модули с широким углом, чтобы пробить борта.</p>
               </div>
               <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-purple-500/30 transition group">
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4 text-green-500"><Shield className="w-6 h-6"/></div>
                  <h3 className="text-lg font-bold text-white mb-2">Задняя стенка</h3>
                  <p className="text-gray-400 text-sm">ПВХ пластик 5–8 мм. Основа жесткости конструкции.</p>
               </div>
            </div>
         </div>
      </section>

      {/* 4. MAINTENANCE (ОСОБЕННОСТИ ЭКСПЛУАТАЦИИ) */}
      <section className="py-20 bg-slate-950 border-y border-slate-800">
         <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-yellow-900/10 border border-yellow-500/20 p-8 rounded-3xl flex gap-6 items-start">
                <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500 shrink-0">
                    <AlertTriangle className="w-8 h-8"/>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white mb-2">Важно знать перед заказом</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">
                        Так как у буквы нет «глухих» частей, вся её поверхность светится. 
                        Пыль и грязь на бортах сразу видны (они работают как экран). Это снижает яркость на 20-30%.
                    </p>
                    <div className="flex items-center gap-2 text-yellow-400 text-sm font-bold">
                        <Droplets className="w-4 h-4"/>
                        Совет: Рекомендуем для интерьеров ТРЦ или мест с легким доступом для мойки (раз в 6 месяцев).
                    </div>
                </div>
            </div>
         </div>
      </section>

      {/* 5. ЦЕНООБРАЗОВАНИЕ */}
      <section className="py-24 bg-[#0F172A]">
         <div className="container mx-auto px-4">
             <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center">
                 
                 <div className="md:w-1/2">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Стоимость и Опции</h2>
                    <p className="text-gray-400 mb-8">
                       Ценник выше стандартных букв из-за сложности ручной сборки и дорогих материалов (цельный акрил).
                    </p>
                    
                    <div className="space-y-4">
                       <div className="flex items-center justify-between p-4 bg-slate-900 rounded-xl border border-slate-800">
                           <div className="flex items-center gap-3 text-white">
                               <Sun className="w-5 h-5 text-purple-500"/> Фотореле
                           </div>
                           <span className="text-sm text-gray-400">Авто-включение</span>
                       </div>
                       <div className="flex items-center justify-between p-4 bg-slate-900 rounded-xl border border-slate-800">
                           <div className="flex items-center gap-3 text-white">
                               <Zap className="w-5 h-5 text-purple-500"/> Диммер
                           </div>
                           <span className="text-sm text-gray-400">Регулировка яркость</span>
                       </div>
                    </div>
                 </div>

                 <div className="md:w-1/2 w-full">
                    <div className="bg-slate-900 rounded-3xl p-8 border border-slate-700">
                        <h3 className="text-white font-bold mb-6 flex justify-between">
                            Пример расчета <span className="text-purple-500">"SALON"</span>
                        </h3>
                        <div className="space-y-3 font-mono text-sm">
                           <div className="flex justify-between text-gray-400">
                              <span>Высота:</span> <span className="text-white">30 см</span>
                           </div>
                           <div className="flex justify-between text-gray-400">
                              <span>Кол-во:</span> <span className="text-white">5 букв</span>
                           </div>
                           <div className="flex justify-between text-gray-400">
                              <span>Цена:</span> <span className="text-white">{PAGE_DATA.price} ₸/см</span>
                           </div>
                           <div className="h-px bg-slate-700 my-2"></div>
                           <div className="flex justify-between items-end">
                              <span className="text-gray-400">Итого:</span>
                              <span className="text-2xl font-bold text-white">97 500 ₸</span>
                           </div>
                        </div>
                        <Link href="/calculator" className="mt-6 w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-purple-900/20">
                            <Calculator className="w-4 h-4"/> Рассчитать свою вывеску
                        </Link>
                    </div>
                 </div>

             </div>
         </div>
      </section>

      {/* 6. ГАЛЕРЕЯ */}
      <div className="py-12 bg-slate-950">
          <div className="container mx-auto px-4 mb-8">
              <h2 className="text-2xl font-bold text-white">Примеры работ</h2>
          </div>
          {/* Используем ImageGallery с фильтрацией или заглушками, если пока нет тегов */}
          <div className="container mx-auto px-4">
             <ImageGallery images={[
                "/images/letters/full-lit-night.png",
                "/images/letters/full-lit-day.png",
                "/1solution.jpg", // Пример из портфолио
                "/bagnaz.jpg"
             ]} />
          </div>
      </div>

      {/* 7. ИНФОРМАЦИЯ О ПРОИЗВОДСТВЕ (SEO-FRIENDLY) */}
      <section className="py-20 bg-[#0B1120] border-t border-slate-800">
         <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">
               
               <div className="space-y-4">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                     <span className="w-1 h-6 bg-orange-500 rounded-full"></span>
                     Производство в Астане
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                     Изготовление объемных букв со световым лицом — это наш профиль. Мы не перезаказываем у посредников: у нас свой цех на правом берегу (район Байконур). Это позволяет держать честные цены и контролировать каждый этап: от фрезеровки акрила до пайки диодов.
                  </p>
               </div>

               <div className="space-y-4">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                     <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                     Адаптация к климату
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                     В Астане суровый климат: ветры, морозы до -40°C и жара. Мы используем только морозостойкий пластик и герметичную коммутацию. Блоки питания защищены от влаги (IP67). Ваша вывеска не треснет зимой и не пожелтеет летом. Гарантия прописана в договоре.
                  </p>
               </div>

            </div>
         </div>
      </section>

      {/* 8. OTHER COMPONENTS */}
      <ReviewsCarousel />
      <ServicesCarousel title="Другие виды" subtitle="Варианты исполнения" hiddenLink="/services/volume-letters"/>
      <CallToAction source="Услуга: Буквы (Full Lit)" />

    </div>
  );
}