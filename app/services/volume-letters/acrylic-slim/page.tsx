import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next"; // Типизация
import { 
  Calculator, 
  CheckCircle, 
  ChevronRight, 
  Droplets,       
  Minimize,       
  ShieldCheck,    
  Zap,            
  Smartphone,     
  Scan,           
  XCircle,        
  Check,          
  ArrowRight,
  ChevronDown,
  Briefcase,
  Sun
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
  slug: "acrylic-slim", 
  title: "Буквы из жидкого акрила",
  subtitle: "Технология 2025 года. Монолитная заливка, отсутствие рамок и максимальная яркость.",
  // ВАЖНО: Обновил цену до 1000, чтобы совпадало с общим каталогом
  price: "1000" 
};

// 1. УЛУЧШЕННЫЕ METADATA
export const metadata: Metadata = {
  title: "Жидкий акрил (Liquid Acrylic) | Самые яркие вывески Астаны | ADLight",
  description: "Изготовление букв по технологии жидкого акрила в Астане. На 30% ярче обычных, алюминиевый борт, гарантия 3 года. Цена от 1000 тг/см.",
  keywords: ["жидкий акрил вывеска", "liquid acrylic sign", "безрамочные буквы", "акриловые буквы астана", "яркая реклама"],
  openGraph: {
    title: "Жидкий акрил | Технология 2025 года",
    description: "Монолитная заливка и максимальная яркость. Узнайте цену.",
    images: ["/images/letters/acrylic-slim-night.webp"]
  }
};

// --- FAQ ДАННЫЕ ---
const FAQ_ITEMS = [
  {
    question: "Почему они ярче обычных?",
    answer: "Обычный листовой акрил содержит примеси для прочности, которые 'съедают' свет. Жидкий акрил — это чистый полимер с люминофором, который застывает под УФ-лампой. Его светопропускаемость на 30% выше.",
    icon: <Zap className="w-5 h-5 text-yellow-500"/>
  },
  {
    question: "Можно ли их ремонтировать?",
    answer: "Это монолитная конструкция (лицо намертво спаяно с бортом). Если перегорит диод, замена сложнее, чем в обычных буквах (нужно вырезать заднюю стенку). Но благодаря герметичности IP67 диоды в них перегорают крайне редко.",
    icon: <ShieldCheck className="w-5 h-5 text-green-500"/>
  },
  {
    question: "Не выцветет ли борт?",
    answer: "Нет. Борт выполнен из алюминия с заводской полимерной покраской. В отличие от пластиковых букв, оклеенных пленкой, алюминий не выгорает и не отслаивается на солнце.",
    icon: <Sun className="w-5 h-5 text-cyan-500"/>
  }
];

// --- ОСНОВНОЙ КОМПОНЕНТ (SERVER SIDE) ---
export default async function LiquidAcrylicPage() {
  
  // 1. ПОЛУЧАЕМ ФОТО
  const galleryImages = getImagesFromFolder(PAGE_DATA.slug);

  // 2. ФОТО ДЛЯ HERO
  const heroImages = [...galleryImages].sort(() => 0.5 - Math.random()).slice(0, 15);
  const displayHeroImages = heroImages.length > 0 
    ? heroImages 
    : ["/images/letters/acrylic-slim-night.png", "/images/letters/acrylic-slim-day.png"];

  // 3. "ДРУГИЕ ВИДЫ"
  const otherTypes = volumeLettersCatalog.filter(item => item.slug !== PAGE_DATA.slug);

  // 4. ГЕНЕРАЦИЯ SCHEMA (Product + FAQ)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "name": "Объемные буквы из Жидкого Акрила",
        "image": displayHeroImages[0],
        "description": "Монолитные световые буквы без рамок. Технология Liquid Acrylic. Алюминиевый борт.",
        "brand": {
          "@type": "Brand",
          "name": "ADLight"
        },
        "offers": {
          "@type": "Offer",
          "url": "https://adlight.kz/services/volume-letters/acrylic-slim",
          "priceCurrency": "KZT",
          "price": "1000",
          "priceValidUntil": "2026-12-31",
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
    <div className="min-h-screen bg-[#0F172A] font-sans selection:bg-cyan-500/30">
      
      {/* Вставляем Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* === 1. HERO SECTION === */}
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
                    <Droplets className="w-4 h-4"/> Innovation 2025
                 </div>
                 <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    {PAGE_DATA.title}
                 </h1>
                 <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                    {PAGE_DATA.subtitle}
                 </p>
                 
                 <ul className="space-y-3 mb-10">
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-cyan-500"/> <strong>Без рамок:</strong> Лицо вровень с бортом
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-cyan-500"/> <strong>Супер-яркость:</strong> +30% к свечению
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-cyan-500"/> <strong>Монолит:</strong> Герметичная заливка IP67
                    </li>
                 </ul>

                 <HeroButtons source={PAGE_DATA.title} priceColor="cyan" />
                 
              </div>

              {/* Визуал: СЛАЙДЕР */}
              <div className="relative aspect-square rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden group shadow-2xl shadow-cyan-900/10">
                 <HeroSlideshow images={displayHeroImages} />
                 
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none"></div>
                 <div className="absolute bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur border border-slate-700 p-4 rounded-xl flex items-center gap-4 pointer-events-none z-20">
                    <div className="w-12 h-12 bg-cyan-500/10 rounded-full flex items-center justify-center text-cyan-500"><ShieldCheck className="w-6 h-6"/></div>
                    <div><div className="text-white font-bold">Вечная конструкция</div><div className="text-gray-400 text-xs">Алюминиевый борт</div></div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* === БЛОК 2: CONCEPT (СРАВНЕНИЕ) === */}
      <section className="py-20 lg:py-32 bg-[#020617] relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] mix-blend-screen"></div>
         </div>

         <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center mb-16">
               <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/10 text-cyan-500 mb-6">
                  <Smartphone className="w-8 h-8"/>
               </div>
               <h2 className="text-3xl font-bold text-white mb-6">iPhone в мире рекламы</h2>
               <p className="text-gray-400 text-lg leading-relaxed mb-8">
                  Вспомните старые телефоны с пластиковыми кнопками и щелями. А теперь посмотрите на современный смартфон: стекло и металл, единый монолит. Технология жидкого акрила сделала с вывесками ту же революцию.
               </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto">
               
               {/* OLD WAY */}
               <div className="bg-[#0B1120] p-8 rounded-3xl border border-slate-800 opacity-60 hover:opacity-100 transition group">
                  <h3 className="text-xl font-bold text-gray-400 mb-4 flex items-center gap-2">
                     <XCircle className="w-5 h-5 text-red-500"/> Обычная буква
                  </h3>
                  <div className="aspect-video relative rounded-xl overflow-hidden mb-6 grayscale bg-black">
                     <Image src="/images/letters/face-lit-day.webp" alt="Обычная буква" fill className="object-cover"/>
                  </div>
                  <ul className="space-y-3 text-sm text-gray-500">
                     <li className="flex gap-2"><XCircle className="w-4 h-4 shrink-0"/> Пластиковый кант по периметру</li>
                     <li className="flex gap-2"><XCircle className="w-4 h-4 shrink-0"/> Пленка выгорает за 3 года</li>
                     <li className="flex gap-2"><XCircle className="w-4 h-4 shrink-0"/> Негерметична (пыль внутри)</li>
                  </ul>
               </div>

               {/* NEW WAY */}
               <div className="bg-slate-900 p-8 rounded-3xl border border-cyan-500/50 shadow-2xl shadow-cyan-500/10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 bg-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">ВЫБОР ADLIGHT</div>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                     <CheckCircle className="w-5 h-5 text-cyan-500"/> Жидкий акрил
                  </h3>
                  <div className="aspect-video relative rounded-xl overflow-hidden mb-6 border border-cyan-500/20 bg-black">
                     <Image src="/images/letters/acrylic-slim-day.webp" alt="Жидкий акрил" fill className="object-cover"/>
                  </div>
                  <ul className="space-y-3 text-sm text-gray-300">
                     <li className="flex gap-2"><Check className="w-4 h-4 text-cyan-500 shrink-0"/> Лицо вровень с бортом (без рамки)</li>
                     <li className="flex gap-2"><Check className="w-4 h-4 text-cyan-500 shrink-0"/> Алюминиевый крашеный борт</li>
                     <li className="flex gap-2"><Check className="w-4 h-4 text-cyan-500 shrink-0"/> Монолитная герметичность IP67</li>
                  </ul>
               </div>

            </div>
         </div>
      </section>

      {/* === БЛОК 3: ANATOMY === */}
      <section className="py-24 bg-[#0B1221] relative overflow-hidden">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]"></div>
         
         <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
               <span className="text-cyan-500 font-bold text-sm uppercase tracking-widest mb-2 block">Технический разбор</span>
               <h2 className="text-3xl md:text-5xl font-black text-white">Инновации в деталях</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <div className="group relative bg-slate-900/80 backdrop-blur-sm p-8 rounded-[2rem] border border-slate-800 hover:border-blue-500/50 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(6,182,212,0.2)] flex flex-col">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-500 group-hover:scale-110 transition-all duration-300"><ShieldCheck className="w-8 h-8"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">Алюминиевый борт</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">Окрашивается в любой цвет. Не ржавеет, придает букве жесткость и отводит тепло от диодов.</p>
               </div>
               <div className="group relative bg-slate-900/80 backdrop-blur-sm p-8 rounded-[2rem] border border-slate-800 hover:border-purple-500/50 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.2)] flex flex-col">
                  <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 text-purple-500 group-hover:scale-110 transition-all duration-300"><Minimize className="w-8 h-8"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">Ultra Slim</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">Толщина буквы всего 30-40 мм. Она выглядит изящно, не как громоздкий короб.</p>
               </div>
               <div className="group relative bg-slate-900/80 backdrop-blur-sm p-8 rounded-[2rem] border border-slate-800 hover:border-orange-500/50 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(249,115,22,0.2)] flex flex-col">
                  <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6 text-orange-500 group-hover:scale-110 transition-all duration-300"><Zap className="w-8 h-8"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">Люминофор</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">В состав жидкого акрила входят частицы люминофора, рассеивающие свет ярче обычного пластика.</p>
               </div>
               <div className="group relative bg-slate-900/80 backdrop-blur-sm p-8 rounded-[2rem] border border-slate-800 hover:border-green-500/50 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(34,197,94,0.2)] flex flex-col">
                  <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 text-green-500 group-hover:scale-110 transition-all duration-300"><Droplets className="w-8 h-8"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">Неубиваемость</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">Лицо и борт спаяны химически. Внутрь никогда не попадет вода, пыль или насекомые.</p>
               </div>
            </div>
         </div>
      </section>

      {/* === БЛОК 4: USE CASES === */}
      <section className="py-24 bg-[#0F172A] border-y border-slate-800">
         <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16 items-start">
               
               <div className="md:w-1/2">
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

               <div className="md:w-1/2 bg-[#0B1120] p-8 rounded-3xl border border-slate-800">
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

      {/* === БЛОК 5: ЦЕНА === */}
      <section className="py-24 bg-[#0F172A]">
         <div className="container mx-auto px-4 relative z-10">
             <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16 items-stretch">
                 
                 <div className="md:w-5/12 bg-slate-900 rounded-3xl p-8 border border-slate-700 flex flex-col justify-between relative overflow-hidden group hover:border-cyan-500/50 transition-all duration-300">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><Calculator className="w-32 h-32 text-white"/></div>
                    <div>
                       <div className="inline-flex items-center gap-2 text-cyan-500 font-bold text-sm uppercase tracking-wider mb-4"><CheckCircle className="w-4 h-4"/> Лучшее качество</div>
                       <h2 className="text-3xl font-bold text-white mb-4">Стоимость изготовления</h2>
                       <p className="text-gray-400 text-sm leading-relaxed mb-8">
                          Это золотая середина: дороже стандартных букв всего на 20%, но выглядит на 200% дороже и служит в 2 раза дольше.
                       </p>
                    </div>
                    <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800/50">
                        <p className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">Базовая ставка</p>
                        <div className="flex items-baseline gap-2"><span className="text-white text-sm">от</span><span className="text-5xl font-black text-white">{PAGE_DATA.price}</span><span className="text-cyan-500 text-xl font-bold">₸ / см</span></div>
                        <div className="h-1 w-full bg-slate-800 rounded-full mt-4 overflow-hidden"><div className="h-full w-4/5 bg-cyan-500 rounded-full"></div></div>
                    </div>
                 </div>

                 <div className="md:w-7/12 bg-slate-900/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-800 flex flex-col">
                    <div className="flex items-center justify-between mb-8 border-b border-slate-700/50 pb-6">
                       <div><h3 className="text-white font-bold text-xl">Пример сметы</h3><p className="text-gray-400 text-sm">Вывеска <span className="text-white font-bold">"CLINIC"</span></p></div>
                       <div className="px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 text-white font-mono text-sm">6 букв</div>
                    </div>
                    <div className="space-y-4 flex-1">
                       <div className="flex justify-between items-center text-sm group hover:bg-slate-800/50 p-2 rounded transition">
                          <span className="text-gray-400">Высота букв</span>
                          <div className="flex-1 mx-4 border-b border-dashed border-slate-700/50 relative top-1"></div>
                          <span className="text-white font-mono">30 см</span>
                       </div>
                       <div className="flex justify-between items-center text-sm group hover:bg-slate-800/50 p-2 rounded transition">
                          <span className="text-gray-400">Технология</span>
                          <div className="flex-1 mx-4 border-b border-dashed border-slate-700/50 relative top-1"></div>
                          <span className="text-white font-mono">Жидкий акрил (Slim)</span>
                       </div>
                       <div className="flex justify-between items-center text-sm group hover:bg-slate-800/50 p-2 rounded transition">
                          <span className="text-gray-400">Материал борта</span>
                          <div className="flex-1 mx-4 border-b border-dashed border-slate-700/50 relative top-1"></div>
                          <span className="text-cyan-400 font-mono text-xs">Алюминий (Белый)</span>
                       </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-slate-700">
                       <div className="flex justify-between items-end mb-6">
                          <span className="text-gray-400 text-sm">Итоговая стоимость:</span>
                          <span className="text-3xl font-black text-white tracking-tight">180 000 ₸</span>
                       </div>
                       <Link href="/calculator" className="group block w-full py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl text-center transition-all shadow-lg shadow-cyan-900/20 flex items-center justify-center gap-3 active:scale-95">
                           <Calculator className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform"/> Точный расчет
                       </Link>
                       <p className="text-center text-[10px] text-gray-500 mt-3">* Предварительный расчет. Точная цена после замера.</p>
                    </div>
                 </div>
             </div>
         </div>
      </section>

      {/* === БЛОК 6: FAQ === */}
      <section className="py-24 bg-[#0B1221]">
         <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-center mb-12">
               <h2 className="text-3xl font-bold text-white mb-4">Вопросы о технологии</h2>
            </div>

            <div className="space-y-4">
               {FAQ_ITEMS.map((item, index) => (
                  <details key={index} className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-300 open:border-cyan-500/30 open:bg-slate-900/80">
                     <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-slate-800/50 transition">
                        <div className="flex items-center gap-4">
                           <div className="p-2 bg-slate-800 rounded-lg group-open:bg-cyan-500/10 transition">
                              {item.icon}
                           </div>
                           <span className="font-bold text-white text-base md:text-lg group-open:text-cyan-500 transition">{item.question}</span>
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
              <h2 className="text-3xl font-bold text-white mb-4">Примеры работ</h2>
              <p className="text-gray-400">Идеальная гладкость в каждом проекте</p>
          </div>
          <div className="container mx-auto px-4">
              {galleryImages.length > 0 ? <ImageGallery images={galleryImages} /> : <div className="text-center text-gray-500 py-12 border border-dashed border-slate-800 rounded-2xl">Загрузите фото в папку public/images/letters-galery/acrylic-slim</div>}
              
              <div className="mt-16 flex justify-center">
                 <Link href="/portfolio" className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#0B1221] border border-slate-700 rounded-full text-white font-bold hover:bg-slate-800 transition overflow-hidden">
                    <span className="relative z-10 flex items-center gap-2">
                       <Briefcase className="w-5 h-5 text-cyan-500"/>
                       Посмотреть все работы в Портфолио
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition duration-500"></div>
                 </Link>
              </div>
          </div>
      </section>

      {/* === БЛОК 8: СМОТРИТЕ ТАКЖЕ === */}
      <section className="py-24 bg-[#0F172A] border-t border-slate-800 relative">
         <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none"></div>

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
                                <h4 className="text-white font-bold text-lg leading-snug group-hover:text-cyan-400 transition-colors line-clamp-2">
                                    {type.title}
                                </h4>
                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-cyan-600 group-hover:text-white transition-all duration-300 shrink-0 group-hover:rotate-[-45deg]">
                                   <ArrowRight className="w-4 h-4"/>
                                </div>
                             </div>
                             <div className="mt-auto pt-4">
                                <div className="w-full h-0.5 bg-slate-800 group-hover:bg-slate-700 transition-colors relative overflow-hidden rounded-full">
                                   <div className="absolute top-0 left-0 h-full w-0 bg-cyan-500 group-hover:w-full transition-all duration-700 ease-out"></div>
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