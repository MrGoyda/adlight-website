import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next"; // Типизация
import { 
  Calculator, 
  CheckCircle, 
  ChevronRight, 
  Trees,          
  Leaf,           
  Brush,          
  Scissors,       
  Sun, 
  CloudRain,      
  ArrowRight,
  ChevronDown,
  Briefcase,
  Coffee,         
  Palette,
  Flower2
} from "lucide-react";

// --- ИМПОРТ КЛИЕНТСКИХ КОМПОНЕНТОВ ---
import CallToAction from "@/components/CallToAction";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import ImageGallery from "@/components/ImageGallery";
import HeroSlideshow from "@/components/HeroSlideshow";
import HeroButtons from "@/components/HeroButtons";

// --- СЕРВЕРНАЯ УТИЛИТА ---
import { getImagesFromFolder } from "@/lib/serverUtils";

// --- ДАННЫЕ КАТАЛОГА ---
import { volumeLettersCatalog } from "@/lib/volumeLettersData";

// --- ДАННЫЕ ТЕКУЩЕЙ СТРАНИЦЫ ---
const PAGE_DATA = {
  slug: "wood-style", 
  title: "Объемные буквы из дерева",
  subtitle: "Живая фактура в мире пластика. Эко-стиль, который вызывает доверие и создает уют.",
  // ВАЖНО: Цена 350
  price: "350" 
};

// 1. УЛУЧШЕННЫЕ METADATA
export const metadata: Metadata = {
  title: "Деревянные буквы (Eco Style) | Вывески из фанеры Астана",
  description: "Изготовление вывесок из дерева и фанеры. Лазерная резка, покрытие маслом Osmo. Идеально для кофеен и студий. Цена от 350 тг/см.",
  keywords: ["деревянные буквы", "вывеска из дерева", "буквы из фанеры", "эко вывеска астана", "лазерная резка дерева"],
  openGraph: {
    title: "Эко-вывески из дерева | Живая фактура",
    description: "Натуральные материалы для уютного бизнеса.",
    images: ["/images/letters/wood-style-day.png"] // Для дерева лучше дневное фото
  }
};

// --- FAQ ДАННЫЕ ---
const FAQ_ITEMS = [
  {
    question: "Можно ли вешать на улицу?",
    answer: "Можно, но с оговоркой. Дерево — живой материал. В климате Астаны (мороз, солнце, влага) оно требует ухода. Мы покрываем буквы яхтным лаком в 3 слоя, но раз в 1-2 года покрытие желательно обновлять.",
    icon: <CloudRain className="w-5 h-5 text-blue-500"/>
  },
  {
    question: "Какой материал выбрать?",
    answer: "Березовая фанера (10-18 мм) — самый прочный и недорогой вариант, идеально подходит для покраски. Массив сосны — красивая текстура, но мягкий. Дуб/Ясень — премиально, твердо, дорого.",
    icon: <Trees className="w-5 h-5 text-green-500"/>
  },
  {
    question: "Как они светятся?",
    answer: "Дерево не пропускает свет. Мы делаем либо контражурную подсветку (свет назад), либо врезаем ретро-лампы в лицевую часть. Также можно подсветить вывеску внешними прожекторами.",
    icon: <Sun className="w-5 h-5 text-yellow-500"/>
  }
];

// --- ОСНОВНОЙ КОМПОНЕНТ (SERVER SIDE) ---
export default async function WoodLettersPage() {
  
  // 1. ПОЛУЧАЕМ ФОТО
  const galleryImages = getImagesFromFolder(PAGE_DATA.slug);

  // 2. ФОТО ДЛЯ HERO
  const heroImages = [...galleryImages].sort(() => 0.5 - Math.random()).slice(0, 15);
  const displayHeroImages = heroImages.length > 0 
    ? heroImages 
    : ["/images/letters/wood-style-day.png", "/images/letters/wood-style-night.png"];

  // 3. "ДРУГИЕ ВИДЫ"
  const otherTypes = volumeLettersCatalog.filter(item => item.slug !== PAGE_DATA.slug);

  // 4. ГЕНЕРАЦИЯ SCHEMA (Product + FAQ)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "name": "Объемные буквы из дерева (Eco Style)",
        "image": displayHeroImages[0],
        "description": "Интерьерные и фасадные вывески из натурального дерева, фанеры и массива.",
        "brand": {
          "@type": "Brand",
          "name": "ADLight"
        },
        "offers": {
          "@type": "Offer",
          "url": "https://adlight.kz/services/volume-letters/wood-style",
          "priceCurrency": "KZT",
          "price": "350",
          "availability": "https://schema.org/InStock",
          "itemCondition": "https://schema.org/NewCondition"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": FAQ_ITEMS.map(item => ({
          "@type": "Question",
          "name": item.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.answer
          }
        }))
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#0F172A] font-sans selection:bg-green-500/30">
      
      {/* Вставляем Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* === 1. HERO SECTION === */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F172A]/90 to-[#0F172A]"></div>
        {/* Зеленое ЭКО свечение */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-600/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
           {/* Навигация */}
           <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 mb-8">
              <Link href="/" className="hover:text-white transition">Главная</Link>
              <ChevronRight className="w-3 h-3"/>
              <Link href="/services/volume-letters" className="hover:text-white transition">Объемные буквы</Link>
              <ChevronRight className="w-3 h-3"/>
              <span className="text-green-500 font-medium">Эко-стиль</span>
           </div>

           <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Текст */}
              <div>
                 <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/20 rounded-full uppercase tracking-wider">
                    <Leaf className="w-4 h-4"/> 100% Natural
                 </div>
                 <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    {PAGE_DATA.title}
                 </h1>
                 <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                    {PAGE_DATA.subtitle}
                 </p>
                 
                 <ul className="space-y-3 mb-10">
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-green-500"/> Березовая фанера или массив дуба
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-green-500"/> Обработка маслами и воском (Osmo)
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-green-500"/> Лазерная резка с темным торцом
                    </li>
                 </ul>

                 {/* --- НОВЫЙ ИЗОЛИРОВАННЫЙ КОМПОНЕНТ КНОПОК --- */}
                 <HeroButtons source={PAGE_DATA.title} priceColor="green" />
                 
              </div>

              {/* Визуал: СЛАЙДЕР */}
              <div className="relative aspect-square rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden group shadow-2xl shadow-green-500/10">
                 <HeroSlideshow images={displayHeroImages} />
                 
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none"></div>
                 <div className="absolute bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur border border-slate-700 p-4 rounded-xl flex items-center gap-4 pointer-events-none z-20">
                    <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center text-green-500"><Trees className="w-6 h-6"/></div>
                    <div><div className="text-white font-bold">Живая фактура</div><div className="text-gray-400 text-xs">Защита от влаги</div></div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* === БЛОК 2: CONCEPT === */}
      <section className="py-20 lg:py-32 bg-[#020617] relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-green-600/10 rounded-full blur-[120px] mix-blend-screen"></div>
         </div>

         <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center mb-16">
               <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 text-green-500 mb-6">
                  <Trees className="w-8 h-8"/>
               </div>
               <h2 className="text-3xl font-bold text-white mb-6">Природа в интерьере</h2>
               <p className="text-gray-400 text-lg leading-relaxed mb-8">
                  Деревянная вывеска работает на подсознание. Она говорит клиенту: <span className="text-white font-medium">"Здесь всё настоящее, крафтовое и уютное"</span>. Дерево контрастирует с холодным городским пластиком и бетоном, заставляя взгляд остановиться.
               </p>
               <div className="grid grid-cols-3 gap-4 text-sm font-medium text-slate-300">
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex flex-col items-center gap-2">
                     <Coffee className="w-5 h-5 text-amber-600"/>
                     Кофейни
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex flex-col items-center gap-2">
                     <Flower2 className="w-5 h-5 text-pink-500"/>
                     Цветочные
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex flex-col items-center gap-2">
                     <Leaf className="w-5 h-5 text-green-500"/>
                     Эко-лавки
                  </div>
               </div>
            </div>

            {/* MATERIALS (STATIC CARDS) */}
            <div className="grid md:grid-cols-3 gap-6">
               
               {/* PLYWOOD */}
               <div className="group bg-[#0B1120] p-8 rounded-3xl border border-slate-800 hover:border-green-500 transition relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-700/5 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
                  <div className="relative z-10">
                     <h3 className="text-xl font-bold text-white mb-2">Березовая фанера</h3>
                     <p className="text-sm text-gray-400 mb-4">Самый популярный материал. Слоистая структура торца выглядит стильно после лазерной резки (темный край).</p>
                     <div className="h-32 bg-[#E4CFA5] rounded-xl border border-[#d4bca0] flex items-center justify-center opacity-80 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]">
                        <span className="text-2xl font-bold text-slate-800 bg-white/50 px-3 py-1 rounded">Натуральный</span>
                     </div>
                  </div>
               </div>

               {/* PINE */}
               <div className="group bg-[#0B1120] p-8 rounded-3xl border border-slate-800 hover:border-amber-500 transition relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-700/5 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
                  <div className="relative z-10">
                     <h3 className="text-xl font-bold text-white mb-2">Массив Сосны</h3>
                     <p className="text-sm text-gray-400 mb-4">Цельное дерево с ярко выраженным рисунком годовых колец. Идеально под браширование (старение).</p>
                     <div className="h-32 bg-[#C29A66] rounded-xl border border-[#b08855] flex items-center justify-center opacity-90 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]">
                        <span className="text-2xl font-bold text-white shadow-sm">Золотой дуб</span>
                     </div>
                  </div>
               </div>

               {/* WENGE */}
               <div className="group bg-[#0B1120] p-8 rounded-3xl border border-slate-800 hover:border-slate-500 transition relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-700/5 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
                  <div className="relative z-10">
                     <h3 className="text-xl font-bold text-white mb-2">Благородный Венге</h3>
                     <p className="text-sm text-gray-400 mb-4">Темное, почти черное покрытие. Выглядит строго и дорого. Подходит для барбершопов и стейк-хаусов.</p>
                     <div className="h-32 bg-[#3E3430] rounded-xl border border-[#2e2623] flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]">
                        <span className="text-2xl font-bold text-white/80">Венге</span>
                     </div>
                  </div>
               </div>

            </div>
         </div>
      </section>

      {/* === БЛОК 3: PRODUCTION === */}
      <section className="py-24 bg-[#0B1221] relative overflow-hidden">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]"></div>
         
         <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
               <span className="text-green-500 font-bold text-sm uppercase tracking-widest mb-2 block">Как мы это делаем</span>
               <h2 className="text-3xl md:text-5xl font-black text-white">Технология обработки</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <div className="group relative bg-slate-900/80 backdrop-blur-sm p-8 rounded-[2rem] border border-slate-800 hover:border-green-500/50 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(34,197,94,0.2)] flex flex-col">
                  <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 text-green-500 group-hover:scale-110 transition-all duration-300"><Scissors className="w-8 h-8"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">Лазерная резка</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">Луч прожигает дерево, оставляя идеально ровный, слегка обугленный (темный) край. Это придает графичность.</p>
               </div>
               <div className="group relative bg-slate-900/80 backdrop-blur-sm p-8 rounded-[2rem] border border-slate-800 hover:border-blue-500/50 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.2)] flex flex-col">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-500 group-hover:scale-110 transition-all duration-300"><Palette className="w-8 h-8"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">Тонировка</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">Используем профессиональные морилки, чтобы придать недорогой сосне вид дорогого ореха или дуба.</p>
               </div>
               <div className="group relative bg-slate-900/80 backdrop-blur-sm p-8 rounded-[2rem] border border-slate-800 hover:border-orange-500/50 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(249,115,22,0.2)] flex flex-col">
                  <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6 text-orange-500 group-hover:scale-110 transition-all duration-300"><Brush className="w-8 h-8"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">Масло и Воск</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">Финишное покрытие немецким маслом Osmo. Оно впитывается, проявляя текстуру, но не создает пленочного эффекта.</p>
               </div>
               <div className="group relative bg-slate-900/80 backdrop-blur-sm p-8 rounded-[2rem] border border-slate-800 hover:border-red-500/50 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(239,68,68,0.2)] flex flex-col">
                  <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 text-red-500 group-hover:scale-110 transition-all duration-300"><CloudRain className="w-8 h-8"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">Яхтный лак</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">Для уличных вывесок используем стойкий полиуретановый лак в 3 слоя для защиты от влаги.</p>
               </div>
            </div>
         </div>
      </section>

      {/* === БЛОК 4: ЦЕНА === */}
      <section className="py-24 bg-[#0F172A] border-y border-slate-800 relative overflow-hidden">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-green-500/5 blur-[120px] rounded-full pointer-events-none"></div>
         <div className="container mx-auto px-4 relative z-10">
             <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16 items-stretch">
                 
                 <div className="md:w-5/12 bg-slate-900 rounded-3xl p-8 border border-slate-700 flex flex-col justify-between relative overflow-hidden group hover:border-green-500/50 transition-all duration-300">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><Calculator className="w-32 h-32 text-white"/></div>
                    <div>
                       <div className="inline-flex items-center gap-2 text-green-500 font-bold text-sm uppercase tracking-wider mb-4"><CheckCircle className="w-4 h-4"/> Бюджетно и стильно</div>
                       <h2 className="text-3xl font-bold text-white mb-4">Стоимость изготовления</h2>
                       <p className="text-gray-400 text-sm leading-relaxed mb-8">
                          Фанера стоит дешевле акрила и пластика. Основная стоимость — это работа мастера (шлифовка, покраска в несколько слоев).
                       </p>
                    </div>
                    <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800/50">
                        <p className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">Базовая ставка</p>
                        <div className="flex items-baseline gap-2"><span className="text-white text-sm">от</span><span className="text-5xl font-black text-white">{PAGE_DATA.price}</span><span className="text-green-500 text-xl font-bold">₸ / см</span></div>
                        <div className="h-1 w-full bg-slate-800 rounded-full mt-4 overflow-hidden"><div className="h-full w-1/3 bg-green-500 rounded-full"></div></div>
                    </div>
                 </div>

                 <div className="md:w-7/12 bg-slate-900/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-800 flex flex-col">
                    <div className="flex items-center justify-between mb-8 border-b border-slate-700/50 pb-6">
                       <div><h3 className="text-white font-bold text-xl">Пример сметы</h3><p className="text-gray-400 text-sm">Вывеска <span className="text-white font-bold">"ECO"</span> (3 буквы)</p></div>
                       <div className="px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 text-white font-mono text-sm">30 см</div>
                    </div>
                    <div className="space-y-4 flex-1">
                       <div className="flex justify-between items-center text-sm group hover:bg-slate-800/50 p-2 rounded transition">
                          <span className="text-gray-400">Материал</span>
                          <div className="flex-1 mx-4 border-b border-dashed border-slate-700/50 relative top-1"></div>
                          <span className="text-white font-mono">Фанера 15 мм</span>
                       </div>
                       <div className="flex justify-between items-center text-sm group hover:bg-slate-800/50 p-2 rounded transition">
                          <span className="text-gray-400">Покрытие</span>
                          <div className="flex-1 mx-4 border-b border-dashed border-slate-700/50 relative top-1"></div>
                          <span className="text-white font-mono">Масло "Орех"</span>
                       </div>
                       <div className="flex justify-between items-center text-sm group hover:bg-slate-800/50 p-2 rounded transition">
                          <span className="text-gray-400">Крепление</span>
                          <div className="flex-1 mx-4 border-b border-dashed border-slate-700/50 relative top-1"></div>
                          <span className="text-green-400 font-mono text-xs">Дистанционное</span>
                       </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-slate-700">
                       <div className="flex justify-between items-end mb-6">
                          <span className="text-gray-400 text-sm">Итоговая стоимость:</span>
                          <span className="text-3xl font-black text-white tracking-tight">31 500 ₸</span>
                       </div>
                       <Link href="/calculator" className="group block w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-center transition-all shadow-lg shadow-green-900/20 flex items-center justify-center gap-3 active:scale-95">
                           <Calculator className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform"/> Точный расчет
                       </Link>
                       <p className="text-center text-[10px] text-gray-500 mt-3">* Предварительный расчет. Точная цена после замера.</p>
                    </div>
                 </div>
             </div>
         </div>
      </section>

      {/* === [NEW] БЛОК 5: PRO TIPS (ВАЖНЫЕ ДЕТАЛИ) === */}
      <section className="py-20 bg-slate-950 border-b border-slate-800">
         <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
               
               {/* Карточка 1: УЛИЦА */}
               <div className="bg-[#0B1221] p-8 rounded-3xl border border-red-900/20 hover:border-red-500/30 transition flex gap-6">
                  <div className="shrink-0">
                     <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500"><CloudRain className="w-7 h-7"/></div>
                  </div>
                  <div>
                     <h3 className="text-xl font-bold text-white mb-3">Дерево на улице</h3>
                     <p className="text-sm text-gray-400 leading-relaxed mb-4">
                        Будем честны: дерево — капризный материал. В Астане (мороз -40°C, жара +40°C) оно расширяется и сжимается. Лак со временем трескается.
                     </p>
                     <div className="p-3 bg-red-900/10 border border-red-500/20 rounded-xl">
                        <p className="text-xs text-red-200 font-medium">
                           <span className="text-red-400 font-bold">Совет:</span> Вывеску придется обновлять (шкурить и лачить) раз в 1-2 года. Либо вешать под козырек.
                        </p>
                     </div>
                  </div>
               </div>

               {/* Карточка 2: ИМИТАЦИЯ */}
               <div className="bg-[#0B1221] p-8 rounded-3xl border border-slate-800 hover:border-green-500/30 transition flex gap-6">
                  <div className="shrink-0">
                     <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500"><CheckCircle className="w-7 h-7"/></div>
                  </div>
                  <div>
                     <h3 className="text-xl font-bold text-white mb-3">Вечная альтернатива</h3>
                     <p className="text-sm text-gray-400 leading-relaxed mb-4">
                        Хотите вид дерева, но без проблем с гниением? Мы предлагаем сублимацию под дерево на алюминии.
                     </p>
                     <div className="p-3 bg-green-900/20 border border-green-500/20 rounded-xl">
                        <p className="text-xs text-green-200 font-medium">
                           <span className="text-green-400 font-bold">Решение:</span> С расстояния 1 метр не отличить от дуба, но простоит 10 лет без ухода.
                        </p>
                     </div>
                  </div>
               </div>

            </div>
         </div>
      </section>

      {/* === БЛОК 6: FAQ === */}
      <section className="py-24 bg-[#0B1221]">
         <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-center mb-12">
               <h2 className="text-3xl font-bold text-white mb-4">Вопросы о дереве</h2>
            </div>

            <div className="space-y-4">
               {FAQ_ITEMS.map((item, index) => (
                  <details key={index} className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-300 open:border-green-500/30 open:bg-slate-900/80">
                     <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-slate-800/50 transition">
                        <div className="flex items-center gap-4">
                           <div className="p-2 bg-slate-800 rounded-lg group-open:bg-green-500/10 transition">
                              {item.icon}
                           </div>
                           <span className="font-bold text-white text-base md:text-lg group-open:text-green-500 transition">{item.question}</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-gray-400 group-open:rotate-180 transition ml-4 shrink-0"><ChevronDown className="w-4 h-4"/></div>
                     </summary>
                     <div className="px-6 pb-6 pl-[4.5rem] text-gray-400 text-sm leading-relaxed border-t border-slate-800/50 pt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                        {item.answer}
                     </div>
                  </details>
               ))}
            </div>
         </div>
      </section>

      {/* === БЛОК 7: ГАЛЕРЕЯ === */}
      <section className="py-24 bg-slate-950">
          <div className="container mx-auto px-4 mb-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Наши работы</h2>
              <p className="text-gray-400">Натуральные материалы в деле</p>
          </div>
          <div className="container mx-auto px-4">
              {galleryImages.length > 0 ? <ImageGallery images={galleryImages} /> : <div className="text-center text-gray-500 py-12 border border-dashed border-slate-800 rounded-2xl">Загрузите фото в папку public/images/letters-galery/wood-style</div>}
              
              <div className="mt-16 flex justify-center">
                 <Link href="/portfolio" className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#0B1221] border border-slate-700 rounded-full text-white font-bold hover:bg-slate-800 transition overflow-hidden">
                    <span className="relative z-10 flex items-center gap-2">
                       <Briefcase className="w-5 h-5 text-green-500"/>
                       Посмотреть все работы в Портфолио
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-yellow-500/10 opacity-0 group-hover:opacity-100 transition duration-500"></div>
                 </Link>
              </div>
          </div>
      </section>

      {/* === БЛОК 8: СМОТРИТЕ ТАКЖЕ === */}
      <section className="py-24 bg-[#0F172A] border-t border-slate-800 relative">
         <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/5 blur-[100px] rounded-full pointer-events-none"></div>

         <div className="container mx-auto px-4 relative z-10">
             <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                <div>
                   <h2 className="text-3xl font-bold text-white mb-2">Другие варианты букв</h2>
                   <p className="text-gray-400 text-sm">Подберите идеальную технологию под ваш бюджет</p>
                </div>
                <Link href="/services/volume-letters" className="hidden md:flex items-center gap-2 text-sm font-bold text-orange-500 hover:text-orange-400 transition">
                   Смотреть весь каталог <ArrowRight className="w-4 h-4"/>
                </Link>
             </div>
             
             <div className="flex overflow-x-auto pb-8 -mx-4 px-4 md:grid md:grid-cols-4 gap-6 md:overflow-visible md:pb-0 md:px-0 hide-scrollbar snap-x snap-mandatory">
                {otherTypes.map((type) => (
                   <Link 
                      key={type.id} 
                      href={`/services/volume-letters/${type.slug}`}
                      className="group min-w-[280px] md:min-w-0 snap-center relative flex flex-col"
                   >
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 transition-all duration-300 group-hover:border-slate-600 group-hover:shadow-[0_0_30px_-10px_rgba(255,255,255,0.1)] h-full flex flex-col">
                         <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black mb-4">
                             <Image 
                                src={type.images.night} 
                                alt={type.title} 
                                fill 
                                sizes="(max-width: 768px) 100vw, 25vw"
                                className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                             />
                             <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur border border-slate-700 px-3 py-1.5 rounded-lg">
                                <span className="text-orange-500 font-bold text-xs">{type.price}</span>
                             </div>
                         </div>
                         <div className="px-2 pb-2 flex flex-col flex-1">
                             <div className="flex items-start justify-between gap-4">
                                <h4 className="text-white font-bold text-lg leading-snug group-hover:text-green-400 transition-colors line-clamp-2">
                                    {type.title}
                                </h4>
                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-green-600 group-hover:text-white transition-all duration-300 shrink-0 group-hover:rotate-[-45deg]">
                                   <ArrowRight className="w-4 h-4"/>
                                </div>
                             </div>
                             <div className="mt-auto pt-4">
                                <div className="w-full h-0.5 bg-slate-800 group-hover:bg-slate-700 transition-colors relative overflow-hidden rounded-full">
                                   <div className="absolute top-0 left-0 h-full w-0 bg-green-500 group-hover:w-full transition-all duration-700 ease-out"></div>
                                </div>
                             </div>
                         </div>
                      </div>
                   </Link>
                ))}
             </div>
         </div>
      </section>

      <ReviewsCarousel />
      <CallToAction source={`Услуга: ${PAGE_DATA.title}`} />

    </div>
  );
}