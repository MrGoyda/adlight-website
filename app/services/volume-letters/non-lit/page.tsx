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
  Sun, 
  Moon, 
  Palette,      // Палитра
  Feather,      // Легкость
  DollarSign,   // Цена
  Briefcase,    // Офис
  Factory,      // Завод
  MapPin,       // Навигация
  Hammer,       // Монтаж
  Info,
  CloudRain
} from "lucide-react";

// --- ИМПОРТ КОМПОНЕНТОВ ---
import CallToAction from "@/components/CallToAction";
import ServicesCarousel from "@/components/ServicesCarousel";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import ProjectsBento from "@/components/ProjectsBento";

// Данные страницы
const PAGE_DATA = {
  title: "Объемные буквы без подсветки",
  subtitle: "Визуальный объем и ничего лишнего. Практичное решение для интерьеров и светлых помещений.",
  price: "200", // Цена за см
  images: {
    day: "/images/letters/non-lit-day.png",
    night: "/images/letters/non-lit-night.png"
  }
};

// Палитра Oracal (примеры популярных цветов)
const ORACAL_COLORS = [
  { code: "010", name: "Белый (White)", hex: "#FFFFFF", desc: "Классика. Идеален для темных стен." },
  { code: "070", name: "Черный (Black)", hex: "#000000", desc: "Строгость. Для лофт-интерьеров и светлых фонов." },
  { code: "031", name: "Красный (Red)", hex: "#DC2626", desc: "Внимание. Для распродаж и акций." },
  { code: "049", name: "Королевский синий", hex: "#1E3A8A", desc: "Доверие. Часто выбирают банки и юристы." },
  { code: "063", name: "Лайм (Lime)", hex: "#84CC16", desc: "Свежесть. Эко-магазины и аптеки." },
  { code: "021", name: "Желтый (Yellow)", hex: "#FACC15", desc: "Энергия. Детские центры и фастфуд." },
];

export default function NonLitLettersPage() {
  const [isNightMode, setIsNightMode] = useState(false); // По умолчанию ДЕНЬ, т.к. они не светятся
  const [selectedColor, setSelectedColor] = useState(ORACAL_COLORS[0]);

  return (
    <div className="min-h-screen bg-[#0F172A] font-sans selection:bg-slate-500/30">
      
      {/* 1. PRODUCT HERO */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F172A]/90 to-[#0F172A]"></div>
        {/* Серое спокойное свечение */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-slate-500/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
           
           {/* Навигация */}
           <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 mb-8">
              <Link href="/" className="hover:text-white transition">Главная</Link>
              <ChevronRight className="w-3 h-3"/>
              <Link href="/services/volume-letters" className="hover:text-white transition">Объемные буквы</Link>
              <ChevronRight className="w-3 h-3"/>
              <span className="text-slate-400 font-medium">Без подсветки</span>
           </div>

           <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Текст */}
              <div>
                 <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-bold text-slate-400 bg-slate-500/10 border border-slate-500/20 rounded-full uppercase tracking-wider">
                    <DollarSign className="w-4 h-4"/> Лучшая цена
                 </div>
                 <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    {PAGE_DATA.title}
                 </h1>
                 <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                    {PAGE_DATA.subtitle}
                 </p>
                 
                 <ul className="space-y-3 mb-10">
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-slate-500"/> В 2-3 раза дешевле световых
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-slate-500"/> Срок изготовления от 2 дней
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-slate-500"/> Идеальны для офисов и торговых залов
                    </li>
                 </ul>

                 <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/calculator" className="flex items-center justify-center gap-2 bg-slate-100 text-slate-900 px-8 py-4 rounded-xl font-bold hover:bg-white transition shadow-lg shadow-white/10 active:scale-95">
                       <Calculator className="w-5 h-5"/> Узнать стоимость
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
                    <button onClick={() => setIsNightMode(true)} className={`p-2 rounded-full transition-all ${isNightMode ? 'bg-slate-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                       <Moon className="w-5 h-5"/>
                    </button>
                 </div>

                 <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-slate-700 relative shadow-2xl shadow-slate-500/10 bg-slate-900">
                    <Image 
                       src={isNightMode ? PAGE_DATA.images.night : PAGE_DATA.images.day} 
                       alt="Несветовые буквы" 
                       fill 
                       className="object-cover transition-all duration-500"
                    />
                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-medium text-white border border-white/10">
                       {isNightMode ? "Ночью (нужна внешняя подсветка)" : "Дневной вид"}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 2. CONCEPT */}
      <section className="py-24 bg-slate-950">
         <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
               <h2 className="text-3xl font-bold text-white mb-6">Почему выбирают без света?</h2>
               <p className="text-gray-400 text-lg leading-relaxed mb-8">
                  Несветовые буквы — это классика 3D-рекламы. Они имеют тот же объем и форму, что и световые, но лишены электрической начинки. Вы получаете солидную рельефную вывеску, не переплачивая за диоды, блоки питания и сложную коммутацию.
               </p>
               
               <div className="grid md:grid-cols-3 gap-6 text-left">
                  <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                     <h4 className="text-white font-bold mb-2">Внутри ТРЦ</h4>
                     <p className="text-gray-500 text-sm">Где и так много общего света.</p>
                  </div>
                  <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                     <h4 className="text-white font-bold mb-2">Дневной бизнес</h4>
                     <p className="text-gray-500 text-sm">Работаете только в светлое время.</p>
                  </div>
                  <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                     <h4 className="text-white font-bold mb-2">Офис / Ресепшн</h4>
                     <p className="text-gray-500 text-sm">Брендинг стен и навигация.</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 3. MATERIALS */}
      <section className="py-24 bg-[#0F172A]">
         <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-16 text-center">Варианты исполнения</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
               {/* ПВХ */}
               <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 hover:border-white/20 transition group">
                  <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center mb-6 text-white font-bold border border-slate-700">PVC</div>
                  <h3 className="text-xl font-bold text-white mb-4">ПВХ (Стандарт)</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                     Лицо, борт и задник из пластика ПВХ. Оклейка пленкой Oracal 641 (матовая или глянцевая).
                  </p>
                  <span className="text-xs font-bold text-green-500 uppercase tracking-wider">Популярно</span>
               </div>

               {/* Акрил */}
               <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 hover:border-blue-500/30 transition group">
                  <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 text-blue-500"><Layers className="w-7 h-7"/></div>
                  <h3 className="text-xl font-bold text-white mb-4">Акрил + ПВХ</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                     Борт из ПВХ, а лицо из цветного глянцевого акрила. Выглядит дороже, имеет красивый стеклянный блеск.
                  </p>
                  <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">Глянец</span>
               </div>

               {/* Псевдообъем */}
               <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 hover:border-slate-500/30 transition group">
                  <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center mb-6 text-gray-400 border border-slate-700"><Layers className="w-7 h-7"/></div>
                  <h3 className="text-xl font-bold text-white mb-4">Псевдообъем</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                     Плоские буквы из толстого пластика (3-10 мм), установленные на дистанционные держатели.
                  </p>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Бюджетно</span>
               </div>
            </div>
         </div>
      </section>

      {/* 4. PALETTE SELECTOR (ЦВЕТА) */}
      <section className="py-24 bg-slate-950 border-y border-slate-800">
         <div className="container mx-auto px-4 max-w-5xl">
             <div className="flex flex-col lg:flex-row gap-12 items-center">
                 
                 <div className="lg:w-1/2">
                    <div className="inline-flex items-center gap-2 text-slate-400 font-bold mb-4">
                        <Palette className="w-5 h-5"/> Палитра Oracal 641
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Главное — это ЦВЕТ</h2>
                    <p className="text-gray-400 mb-8 text-lg">
                       Так как подсветки нет, цвет пленки играет ключевую роль. Выберите оттенок, который подходит вашему бизнесу.
                    </p>
                    
                    <div className="grid grid-cols-3 gap-4">
                       {ORACAL_COLORS.map((color) => (
                          <button 
                             key={color.code}
                             onClick={() => setSelectedColor(color)}
                             className={`flex flex-col items-center p-3 rounded-xl border transition-all ${selectedColor.code === color.code ? 'bg-slate-800 border-white' : 'border-slate-800 hover:bg-slate-900'}`}
                          >
                             <div 
                                className="w-10 h-10 rounded-full shadow-lg mb-2 border border-white/10"
                                style={{ backgroundColor: color.hex }}
                             ></div>
                             <span className="text-xs font-bold text-white">Oracal {color.code}</span>
                          </button>
                       ))}
                    </div>
                 </div>

                 {/* Инфо о цвете */}
                 <div className="lg:w-1/2 w-full">
                     <div className="bg-[#0F172A] p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
                        <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full blur-[60px] transition-colors duration-500" style={{ backgroundColor: selectedColor.hex, opacity: 0.2 }}></div>
                        
                        <h3 className="text-2xl font-bold text-white mb-2">{selectedColor.name}</h3>
                        <p className="text-gray-400 text-sm mb-6">{selectedColor.desc}</p>
                        
                        <div className="h-32 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center">
                           <span 
                              className="text-6xl font-black transition-colors duration-300"
                              style={{ color: selectedColor.hex }}
                           >
                              LOGO
                           </span>
                        </div>
                        <div className="mt-4 text-center text-xs text-gray-600">
                           * Примерный вид цвета на темном фоне
                        </div>
                     </div>
                 </div>

             </div>
         </div>
      </section>

      {/* 5. ПРЕИМУЩЕСТВА (WHY CHOOSE) */}
      <section className="py-24 bg-[#0F172A]">
         <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
               <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800">
                  <div className="mb-4 text-green-500"><DollarSign className="w-8 h-8"/></div>
                  <h3 className="text-white font-bold mb-2">Цена</h3>
                  <p className="text-gray-400 text-sm">Нет диодов, нет пайки, нет блоков питания. Экономия бюджета до 50%.</p>
               </div>
               <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800">
                  <div className="mb-4 text-blue-500"><Shield className="w-8 h-8"/></div>
                  <h3 className="text-white font-bold mb-2">Надежность</h3>
                  <p className="text-gray-400 text-sm">В них нечему ломаться. Нет электрики = нет риска перегорания или замыкания.</p>
               </div>
               <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800">
                  <div className="mb-4 text-white"><Feather className="w-8 h-8"/></div>
                  <h3 className="text-white font-bold mb-2">Легкость</h3>
                  <p className="text-gray-400 text-sm">Вес в 2 раза меньше. Можно монтировать на гипсокартон или стекло.</p>
               </div>
               <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800">
                  <div className="mb-4 text-orange-500"><CloudRain className="w-8 h-8"/></div>
                  <h3 className="text-white font-bold mb-2">Всепогодность</h3>
                  <p className="text-gray-400 text-sm">ПВХ и пленка Oracal не боятся дождя, снега и мойки.</p>
               </div>
            </div>
         </div>
      </section>

      {/* 6. USE CASES */}
      <section className="py-24 bg-slate-950 border-t border-slate-800">
         <div className="container mx-auto px-4 text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Где это работает?</h2>
            <p className="text-gray-400">Это не "бедно", а умно.</p>
         </div>
         <div className="container mx-auto px-4 grid md:grid-cols-4 gap-4">
            {[
               {t: "Интерьер", d: "Логотип на стене", i: <Briefcase/>},
               {t: "Навигация", d: "ВХОД, КАССА, СКЛАД", i: <MapPin/>},
               {t: "Промышленность", d: "Названия цехов и ангаров", i: <Factory/>},
               {t: "Фотозоны", d: "Мобильные буквы для ивентов", i: <Sun/>},
            ].map((item, i) => (
               <div key={i} className="flex flex-col items-center p-6 bg-[#0F172A] rounded-2xl border border-slate-800">
                  <div className="text-slate-400 mb-3">{item.i}</div>
                  <h4 className="text-white font-bold">{item.t}</h4>
                  <p className="text-gray-500 text-xs mt-1">{item.d}</p>
               </div>
            ))}
         </div>
      </section>

      {/* 7. ЦЕНА И РАСЧЕТ */}
      <section className="py-24 bg-[#0F172A]">
         <div className="container mx-auto px-4">
             <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center">
                 
                 <div className="md:w-1/2">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Стоимость</h2>
                    <p className="text-gray-400 mb-8">
                       Самая доступная цена на рынке. Отличный старт для малого бизнеса.
                    </p>
                    
                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                        <div className="flex items-center gap-3 text-white mb-2">
                           <Hammer className="w-5 h-5 text-slate-500"/>
                           <span className="font-bold">Легкий монтаж:</span>
                        </div>
                        <p className="text-gray-400 text-sm pl-8">
                           Небольшие буквы можно клеить на силикон или двусторонний скотч. Экономия на монтажных работах.
                        </p>
                    </div>
                 </div>

                 <div className="md:w-1/2 w-full">
                    <div className="bg-white rounded-3xl p-8 border border-slate-200 relative overflow-hidden text-slate-900">
                        <h3 className="font-bold mb-6 flex justify-between text-xl">
                            Пример: <span className="text-blue-600">"ОФИС"</span>
                        </h3>
                        <div className="space-y-3 font-mono text-sm relative z-10">
                           <div className="flex justify-between text-slate-600">
                              <span>Высота:</span> <span className="text-black font-bold">30 см</span>
                           </div>
                           <div className="flex justify-between text-slate-600">
                              <span>Материал:</span> <span className="text-black font-bold">ПВХ 5мм</span>
                           </div>
                           <div className="flex justify-between text-slate-600">
                              <span>Кол-во:</span> <span className="text-black font-bold">4 буквы</span>
                           </div>
                           <div className="h-px bg-slate-300 my-2"></div>
                           <div className="flex justify-between items-end pt-2">
                              <span className="text-slate-600">Итого:</span>
                              <span className="text-3xl font-black text-blue-600">24 000 ₸</span>
                           </div>
                        </div>
                        <Link href="/calculator" className="mt-6 w-full py-3 bg-slate-900 hover:bg-black text-white font-bold rounded-xl flex items-center justify-center gap-2 transition shadow-lg relative z-10">
                            <Calculator className="w-4 h-4"/> Рассчитать
                        </Link>
                    </div>
                 </div>

             </div>
         </div>
      </section>

      {/* 8. SEO TEXT (ЖУРНАЛЬНЫЙ СТИЛЬ) */}
      <section className="py-20 bg-slate-950 border-t border-slate-800">
         <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto bg-slate-900/30 border border-slate-800 rounded-3xl p-8 md:p-12 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-slate-700 opacity-50"></div>
               <div className="grid md:grid-cols-3 gap-12">
                  <div className="md:col-span-1">
                     <h2 className="text-2xl font-bold text-white mb-4 leading-tight">
                        Несветовые буквы в Астане
                     </h2>
                     <div className="w-12 h-1 bg-slate-500 rounded-full mb-6"></div>
                     <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                        Техническая справка
                     </p>
                  </div>
                  <div className="md:col-span-2 text-sm text-gray-400 leading-relaxed">
                     <p className="mb-4">
                        Объемные буквы без подсветки — рациональное решение для внутреннего оформления и бюджетной наружной рекламы. Компания ADLight производит буквы из ПВХ пластика, полистирола и оргстекла. Мы используем фрезерную резку для создания идеального контура.
                     </p>
                     <p>
                        Для придания цвета используется аппликация виниловыми пленками Oracal серии 641 (Германия), которая устойчива к выцветанию. Несветовые вывески не требуют согласования электрической части и просты в обслуживании.
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 9. OTHER COMPONENTS */}
      <ReviewsCarousel />
      <ServicesCarousel title="Другие виды" subtitle="Варианты исполнения" hiddenLink="/services/volume-letters"/>
      <CallToAction source="Услуга: Несветовые буквы" />

    </div>
  );
}