import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next"; // Типизация
import { 
  Calculator, 
  CheckCircle, 
  ChevronRight, 
  Sun, 
  Moon, 
  Zap,            
  Eye,            
  Layers,         
  Scissors,       
  Car,            
  Scale,          
  ShieldCheck,
  ArrowRight,
  Briefcase,
  ChevronDown,
  Contrast,       
  Scan            
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
  slug: "day-night-effect", 
  title: "Световые буквы «День / Ночь»",
  subtitle: "Черный глянец днем — ярко-белое свечение ночью. Магия технологий для стильного брендинга.",
  price: "700" 
};

// 1. УЛУЧШЕННЫЕ METADATA
export const metadata: Metadata = {
  title: "Вывески День/Ночь (Day/Night) | Черные днем, Белые ночью | ADLight",
  description: "Изготовление вывесок по технологии День/Ночь (Oracal 8870) в Астане. Черные буквы, которые светятся белым. Цена от 700 тг/см.",
  keywords: ["вывеска день ночь", "день ночь буквы", "oracal 8870", "черная вывеска светится белым", "перфорированная пленка"],
  openGraph: {
    title: "Технология День/Ночь | Магия света",
    description: "Черный логотип днем, ярко-белый ночью. Идеально для строгих брендов.",
    images: ["/images/letters/day-night-effect-night.webp"]
  }
};

// --- FAQ ДАННЫЕ ---
const FAQ_ITEMS = [
  {
    question: "Как черный цвет может светиться?",
    answer: "Секрет в специальной перфорированной пленке (Oracal 8870). Днем вы видите черный винил (50% поверхности). Ночью мощный свет изнутри проходит сквозь тысячи микро-отверстий (остальные 50%), и глаз воспринимает это как белый свет.",
    icon: <Contrast className="w-5 h-5 text-white"/>
  },
  {
    question: "Видны ли дырочки на пленке?",
    answer: "С расстояния 1-1.5 метра текстура 'в сеточку' заметна. Но вывески обычно висят выше или дальше, поэтому для прохожего поверхность кажется однородной. Для интерьера (где смотрят в упор) мы рекомендуем другие технологии.",
    icon: <Scan className="w-5 h-5 text-slate-400"/>
  },
  {
    question: "Можно ли использовать другие цвета?",
    answer: "Да, технология работает не только с черным. Есть пленки, которые днем выглядят темно-синими, темно-зелеными или серыми, а ночью светятся белым.",
    icon: <PaletteIcon className="w-5 h-5 text-blue-400"/>
  }
];

// --- ОСНОВНОЙ КОМПОНЕНТ (SERVER SIDE) ---
export default async function DayNightLettersPage() {
  
  // 1. ПОЛУЧАЕМ ФОТО
  const galleryImages = getImagesFromFolder(PAGE_DATA.slug);

  // 2. ФОТО ДЛЯ HERO
  const heroImages = [...galleryImages].sort(() => 0.5 - Math.random()).slice(0, 15);
  const displayHeroImages = heroImages.length > 0 
    ? heroImages 
    : ["/images/letters/day-night-effect-night.png", "/images/letters/day-night-effect-day.png"];

  // 3. "ДРУГИЕ ВИДЫ"
  const otherTypes = volumeLettersCatalog.filter(item => item.slug !== PAGE_DATA.slug);

  // 4. ГЕНЕРАЦИЯ SCHEMA (Product + FAQ)
  // 
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "name": "Объемные буквы День/Ночь (Day/Night Effect)",
        "image": displayHeroImages[0],
        "description": "Световые буквы с эффектом смены цвета: черные днем, белые ночью. Технология Oracal 8870.",
        "brand": {
          "@type": "Brand",
          "name": "ADLight"
        },
        "offers": {
          "@type": "Offer",
          "url": "https://adlight.kz/services/volume-letters/day-night-effect",
          "priceCurrency": "KZT",
          "price": "700",
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
    <div className="min-h-screen bg-[#0F172A] font-sans selection:bg-white/30">
      
      {/* Вставляем Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* === 1. HERO SECTION === */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F172A]/90 to-[#0F172A]"></div>
        {/* Белое свечение */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
           {/* Навигация */}
           <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 mb-8">
              <Link href="/" className="hover:text-white transition">Главная</Link>
              <ChevronRight className="w-3 h-3"/>
              <Link href="/services/volume-letters" className="hover:text-white transition">Объемные буквы</Link>
              <ChevronRight className="w-3 h-3"/>
              <span className="text-white font-medium">День / Ночь</span>
           </div>

           <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Текст */}
              <div>
                 <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-bold text-white bg-white/10 border border-white/20 rounded-full uppercase tracking-wider">
                    <Sun className="w-4 h-4"/> Chameleon Tech
                 </div>
                 <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    {PAGE_DATA.title}
                 </h1>
                 <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                    {PAGE_DATA.subtitle}
                 </p>
                 
                 <ul className="space-y-3 mb-10">
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-white"/> Решение для черных логотипов
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-white"/> Специальная перфорированная пленка
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-white"/> 100% читаемость 24 часа в сутки
                    </li>
                 </ul>

                 <HeroButtons source={PAGE_DATA.title} priceColor="white" />
                 
              </div>

              {/* Визуал: СЛАЙДЕР */}
              <div className="relative aspect-square rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden group shadow-2xl shadow-white/10">
                 <HeroSlideshow images={displayHeroImages} />
                 
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none"></div>
                 <div className="absolute bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur border border-slate-700 p-4 rounded-xl flex items-center gap-4 pointer-events-none z-20">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white"><Contrast className="w-6 h-6"/></div>
                    <div><div className="text-white font-bold">Смена цвета</div><div className="text-gray-400 text-xs">Oracal 8870</div></div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* === БЛОК 2: CONCEPT (HOVER REVEAL) === */}
      <section className="py-24 bg-slate-950">
         <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
               <h2 className="text-3xl font-bold text-white mb-6">Черный не светится?</h2>
               <p className="text-gray-400 text-lg leading-relaxed mb-8">
                  Черный цвет поглощает свет. Раньше, если у компании был черный логотип, ей приходилось делать вывеску с контражуром или мириться с тем, что ночью буквы "пропадают". Мы решили эту проблему.
               </p>
               
               {/* ИНТЕРАКТИВНОЕ СРАВНЕНИЕ (CSS ONLY) */}
               <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden border border-slate-700 group cursor-crosshair">
                  {/* Слой НОЧЬ (Нижний) */}
                  <div className="absolute inset-0 bg-black flex items-center justify-center">
                     <span className="text-6xl md:text-9xl font-black text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.8)] transition-all duration-700 group-hover:scale-110">
                        BLACK
                     </span>
                     <div className="absolute bottom-6 right-6 flex items-center gap-2 text-white bg-slate-900/80 px-4 py-2 rounded-full backdrop-blur border border-white/10">
                        <Moon className="w-4 h-4 text-blue-400"/> Ночь (Белый свет)
                     </div>
                  </div>

                  {/* Слой ДЕНЬ (Верхний, исчезает при наведении) */}
                  <div className="absolute inset-0 bg-white flex items-center justify-center transition-opacity duration-700 opacity-100 group-hover:opacity-0">
                     <span className="text-6xl md:text-9xl font-black text-black">
                        BLACK
                     </span>
                     <div className="absolute bottom-6 left-6 flex items-center gap-2 text-black bg-white/80 px-4 py-2 rounded-full backdrop-blur border border-black/10">
                        <Sun className="w-4 h-4 text-orange-500"/> День (Черный винил)
                     </div>
                     
                     {/* Подсказка */}
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white px-6 py-3 rounded-full animate-pulse pointer-events-none">
                        Наведите курсор
                     </div>
                  </div>
               </div>
               
               <p className="mt-6 text-sm text-gray-500">
                  * Наведите на изображение, чтобы увидеть эффект включения подсветки.
               </p>
            </div>
         </div>
      </section>

      {/* === БЛОК 3: THE SCIENCE === */}
      <section className="py-24 bg-[#0F172A]">
         <div className="container mx-auto px-4">
            <div className="text-center mb-16">
               <h2 className="text-3xl font-bold text-white mb-4">Секрет в перфорации</h2>
               <p className="text-gray-400">Мы используем пленку Oracal 8870 (Германия) или 3M Scotchcal</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
               <div className="bg-white p-8 rounded-3xl text-slate-900 relative overflow-hidden shadow-xl">
                  <div className="absolute top-0 right-0 p-4"><Sun className="w-12 h-12 text-orange-500"/></div>
                  <h3 className="text-2xl font-bold mb-4">Днем: Черный</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                     Свет падает снаружи. Глаз видит поверхность пленки, которая имеет черный цвет (около 50% площади). Микро-дырочки слишком малы, чтобы их заметить с расстояния.
                  </p>
                  <div className="mt-6 h-20 bg-black rounded-xl flex items-center justify-center text-white font-bold border border-slate-200">
                     ВЫВЕСКА
                  </div>
               </div>

               <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 relative overflow-hidden shadow-2xl shadow-white/5">
                  <div className="absolute top-0 right-0 p-4"><Moon className="w-12 h-12 text-blue-400"/></div>
                  <h3 className="text-2xl font-bold text-white mb-4">Ночью: Белый</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                     Свет идет изнутри. Он проходит сквозь тысячи микро-отверстий в пленке. Из-за высокой яркости диодов, глаз "игнорирует" черную сетку и видит сплошной поток света.
                  </p>
                  <div className="mt-6 h-20 bg-white rounded-xl flex items-center justify-center text-black font-bold shadow-[0_0_30px_rgba(255,255,255,0.5)]">
                     ВЫВЕСКА
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* === БЛОК 4: SPECS & AUDIENCE === */}
      <section className="py-24 bg-slate-950 border-y border-slate-800">
         <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16">
               
               <div>
                  <h3 className="text-2xl font-bold text-white mb-8">Важно знать при заказе</h3>
                  <div className="space-y-6">
                     <div className="flex gap-4">
                        <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500 shrink-0"><Zap className="w-6 h-6"/></div>
                        <div>
                           <h4 className="text-white font-bold mb-1">Сверхъяркие диоды</h4>
                           <p className="text-gray-400 text-sm">Пленка задерживает часть света. Чтобы "пробить" сетку, мы ставим усиленные модули с повышенной светоотдачей.</p>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500 shrink-0"><Layers className="w-6 h-6"/></div>
                        <div>
                           <h4 className="text-white font-bold mb-1">Материалы</h4>
                           <p className="text-gray-400 text-sm">Лицевая панель — акрил. Борт — не световой (обычно черный пластик или металл), чтобы поддержать стиль.</p>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500 shrink-0"><Scissors className="w-6 h-6"/></div>
                        <div>
                           <h4 className="text-white font-bold mb-1">Не только черный</h4>
                           <p className="text-gray-400 text-sm">Технология работает и с другими цветами: темно-синий, зеленый, бордовый днем превращаются в белый ночью.</p>
                        </div>
                     </div>
                  </div>
               </div>

               <div>
                  <h3 className="text-2xl font-bold text-white mb-8">Кому это нужно?</h3>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-[#0B1120] p-6 rounded-2xl border border-slate-800">
                        <Car className="w-8 h-8 text-white mb-3"/>
                        <h4 className="font-bold text-white">Автосалоны</h4>
                        <p className="text-xs text-gray-500 mt-1">Строгие логотипы</p>
                     </div>
                     <div className="bg-[#0B1120] p-6 rounded-2xl border border-slate-800">
                        <Briefcase className="w-8 h-8 text-white mb-3"/>
                        <h4 className="font-bold text-white">Барбершопы</h4>
                        <p className="text-xs text-gray-500 mt-1">Стиль Black Star</p>
                     </div>
                     <div className="bg-[#0B1120] p-6 rounded-2xl border border-slate-800">
                        <Scale className="w-8 h-8 text-white mb-3"/>
                        <h4 className="font-bold text-white">Юристы</h4>
                        <p className="text-xs text-gray-500 mt-1">Строгость днем</p>
                     </div>
                     <div className="bg-[#0B1120] p-6 rounded-2xl border border-slate-800">
                        <Eye className="w-8 h-8 text-white mb-3"/>
                        <h4 className="font-bold text-white">Сложные фасады</h4>
                        <p className="text-xs text-gray-500 mt-1">Где нет контражура</p>
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
                 
                 <div className="md:w-5/12 bg-slate-900 rounded-3xl p-8 border border-slate-700 flex flex-col justify-between relative overflow-hidden group hover:border-white/50 transition-all duration-300">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><Calculator className="w-32 h-32 text-white"/></div>
                    <div>
                       <div className="inline-flex items-center gap-2 text-white font-bold text-sm uppercase tracking-wider mb-4"><CheckCircle className="w-4 h-4"/> Premium пленка</div>
                       <h2 className="text-3xl font-bold text-white mb-4">Стоимость изготовления</h2>
                       <p className="text-gray-400 text-sm leading-relaxed mb-8">
                          Это дороже обычных букв из-за стоимости спец-пленки (она в 3-4 раза дороже обычной) и необходимости использовать мощные диоды.
                       </p>
                    </div>
                    <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800/50">
                        <p className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">Базовая ставка</p>
                        <div className="flex items-baseline gap-2"><span className="text-white text-sm">от</span><span className="text-5xl font-black text-white">{PAGE_DATA.price}</span><span className="text-white text-xl font-bold">₸ / см</span></div>
                        <div className="h-1 w-full bg-slate-800 rounded-full mt-4 overflow-hidden"><div className="h-full w-4/5 bg-white rounded-full"></div></div>
                    </div>
                 </div>

                 <div className="md:w-7/12 bg-slate-900/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-800 flex flex-col">
                    <div className="flex items-center justify-between mb-8 border-b border-slate-700/50 pb-6">
                       <div><h3 className="text-white font-bold text-xl">Пример сметы</h3><p className="text-gray-400 text-sm">Вывеска <span className="text-white bg-black px-2 rounded">"BLACK"</span></p></div>
                       <div className="px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 text-white font-mono text-sm">5 букв</div>
                    </div>
                    <div className="space-y-4 flex-1">
                       <div className="flex justify-between items-center text-sm group hover:bg-slate-800/50 p-2 rounded transition">
                          <span className="text-gray-400">Высота букв</span>
                          <div className="flex-1 mx-4 border-b border-dashed border-slate-700/50 relative top-1"></div>
                          <span className="text-white font-mono">40 см</span>
                       </div>
                       <div className="flex justify-between items-center text-sm group hover:bg-slate-800/50 p-2 rounded transition">
                          <span className="text-gray-400">Технология</span>
                          <div className="flex-1 mx-4 border-b border-dashed border-slate-700/50 relative top-1"></div>
                          <span className="text-white font-mono">Day/Night Effect</span>
                       </div>
                       <div className="flex justify-between items-center text-sm group hover:bg-slate-800/50 p-2 rounded transition">
                          <span className="text-gray-400">Материалы</span>
                          <div className="flex-1 mx-4 border-b border-dashed border-slate-700/50 relative top-1"></div>
                          <span className="text-white font-mono">Акрил + Oracal 8870</span>
                       </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-slate-700">
                       <div className="flex justify-between items-end mb-6">
                          <span className="text-gray-400 text-sm">Итоговая стоимость:</span>
                          <span className="text-3xl font-black text-white tracking-tight">140 000 ₸</span>
                       </div>
                       <Link href="/calculator" className="group block w-full py-4 bg-white hover:bg-gray-200 text-black font-bold rounded-xl text-center transition-all shadow-lg shadow-white/10 flex items-center justify-center gap-3 active:scale-95">
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
                  <details key={index} className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-300 open:border-white/30 open:bg-slate-900/80">
                     <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-slate-800/50 transition">
                        <div className="flex items-center gap-4">
                           <div className="p-2 bg-slate-800 rounded-lg group-open:bg-white/10 transition">
                              {item.icon}
                           </div>
                           <span className="font-bold text-white text-base md:text-lg group-open:text-white transition">{item.question}</span>
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
              <p className="text-gray-400">Посмотрите, как меняется цвет</p>
          </div>
          <div className="container mx-auto px-4">
              {galleryImages.length > 0 ? <ImageGallery images={galleryImages} /> : <div className="text-center text-gray-500 py-12 border border-dashed border-slate-800 rounded-2xl">Загрузите фото в папку public/images/letters-galery/day-night-effect</div>}
              
              <div className="mt-16 flex justify-center">
                 <Link href="/portfolio" className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#0B1221] border border-slate-700 rounded-full text-white font-bold hover:bg-slate-800 transition overflow-hidden">
                    <span className="relative z-10 flex items-center gap-2">
                       <Briefcase className="w-5 h-5 text-white"/>
                       Посмотреть все работы в Портфолио
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-gray-500/10 opacity-0 group-hover:opacity-100 transition duration-500"></div>
                 </Link>
              </div>
          </div>
      </section>

      {/* === БЛОК 8: СМОТРИТЕ ТАКЖЕ (REDESIGNED) === */}
      <section className="py-24 bg-[#0F172A] border-t border-slate-800 relative">
         <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 blur-[100px] rounded-full pointer-events-none"></div>

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
                                <h4 className="text-white font-bold text-lg leading-snug group-hover:text-white transition-colors line-clamp-2">
                                    {type.title}
                                </h4>
                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-black transition-all duration-300 shrink-0 group-hover:rotate-[-45deg]">
                                   <ArrowRight className="w-4 h-4"/>
                                </div>
                             </div>
                             <div className="mt-auto pt-4">
                                <div className="w-full h-0.5 bg-slate-800 group-hover:bg-slate-700 transition-colors relative overflow-hidden rounded-full">
                                   <div className="absolute top-0 left-0 h-full w-0 bg-white group-hover:w-full transition-all duration-700 ease-out"></div>
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

function PaletteIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </svg>
  )
}