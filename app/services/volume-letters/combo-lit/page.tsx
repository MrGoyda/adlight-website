import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next"; // Типизация
import { 
  Calculator, 
  CheckCircle, 
  ChevronRight, 
  Crown,          
  Gem,            
  Layers,         
  Zap,            
  Shield,         
  Anchor,         
  Settings,       
  ArrowRight,
  ChevronDown,
  Briefcase
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
  slug: "combo-lit", 
  title: "Комбинированная подсветка",
  subtitle: "Лицо + Контражур. Двойной световой эффект для брендов, которые привыкли доминировать.",
  // ВАЖНО: Обновил цену до 950 (было 850)
  price: "950" 
};

// 1. УЛУЧШЕННЫЕ METADATA
export const metadata: Metadata = {
  title: "Комбинированные буквы (Лицо + Контражур) | VIP Вывески Астана",
  description: "Изготовление букв с двойной подсветкой (Double Lit) в Астане. Максимальная яркость: лицевое свечение + ореол. Цена от 950 тг/см.",
  keywords: ["комбинированные буквы", "лицо и контражур", "double lit channel letters", "элитная вывеска астана", "дорогая реклама"],
  openGraph: {
    title: "Комбинированные вывески | Premium Segment",
    description: "Двойной световой эффект для максимального внимания.",
    images: ["/images/letters/combo-lit-night.webp"]
  }
};

// --- FAQ ДАННЫЕ ---
const FAQ_ITEMS = [
  {
    question: "Почему они такие дорогие?",
    answer: "Это 'двойная' буква. Мы тратим в 2 раза больше акрила и светодиодов. Внутри устанавливается сложная перегородка, чтобы свет от лица не перебивал контражур. Сборка занимает в 3 раза больше времени.",
    icon: <Gem className="w-5 h-5 text-yellow-500"/>
  },
  {
    question: "На какую стену можно вешать?",
    answer: "Только на несущие конструкции или усиленный металлокаркас. Комбинированные буквы тяжелее обычных на 40-50% из-за количества материала внутри.",
    icon: <Anchor className="w-5 h-5 text-blue-500"/>
  },
  {
    question: "Нужна ли подложка?",
    answer: "Желательно. Так как есть контражур, нам нужна ровная матовая поверхность для отражения света. Если фасад глянцевый или неровный, мы рекомендуем делать подложку из композита.",
    icon: <Layers className="w-5 h-5 text-purple-500"/>
  }
];

// --- ОСНОВНОЙ КОМПОНЕНТ (SERVER SIDE) ---
export default async function ComboLitLettersPage() {
  
  // 1. ПОЛУЧАЕМ ФОТО
  const galleryImages = getImagesFromFolder(PAGE_DATA.slug);

  // 2. ФОТО ДЛЯ HERO
  const heroImages = [...galleryImages].sort(() => 0.5 - Math.random()).slice(0, 15);
  const displayHeroImages = heroImages.length > 0 
    ? heroImages 
    : ["/images/letters/combo-lit-night.png", "/images/letters/combo-lit-day.png"];

  // 3. "ДРУГИЕ ВИДЫ"
  const otherTypes = volumeLettersCatalog.filter(item => item.slug !== PAGE_DATA.slug);

  // 4. ГЕНЕРАЦИЯ SCHEMA (Product + FAQ)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "name": "Комбинированные объемные буквы (Double Lit)",
        "image": displayHeroImages[0],
        "description": "Премиальные вывески с двойным свечением: лицевая часть и контражур одновременно.",
        "brand": {
          "@type": "Brand",
          "name": "ADLight"
        },
        "offers": {
          "@type": "Offer",
          "url": "https://adlight.kz/services/volume-letters/combo-lit",
          "priceCurrency": "KZT",
          "price": "950",
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
    <div className="min-h-screen bg-[#0F172A] font-sans selection:bg-yellow-500/30">
      
      {/* Вставляем Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* === 1. HERO SECTION === */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F172A]/80 to-[#0F172A]"></div>
        {/* Золотое свечение */}
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-[800px] h-[500px] bg-yellow-600/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
           {/* Навигация */}
           <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 mb-8">
              <Link href="/" className="hover:text-white transition">Главная</Link>
              <ChevronRight className="w-3 h-3"/>
              <Link href="/services/volume-letters" className="hover:text-white transition">Объемные буквы</Link>
              <ChevronRight className="w-3 h-3"/>
              <span className="text-yellow-500 font-medium">Комбо (Лицо+Бэк)</span>
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
                       <CheckCircle className="w-5 h-5 text-yellow-500"/> Максимальная яркость и объем
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-yellow-500"/> Самая сложная технология сборки
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-yellow-500"/> Эффект "парения" + Читаемость 100%
                    </li>
                 </ul>

                 <HeroButtons source={PAGE_DATA.title} priceColor="yellow" />
                 
              </div>

              {/* Визуал: СЛАЙДЕР */}
              <div className="relative aspect-square rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden group shadow-2xl shadow-yellow-900/10">
                 <HeroSlideshow images={displayHeroImages} />
                 
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none"></div>
                 <div className="absolute bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur border border-slate-700 p-4 rounded-xl flex items-center gap-4 pointer-events-none z-20">
                    <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center text-yellow-500"><Gem className="w-6 h-6"/></div>
                    <div><div className="text-white font-bold">Двойной свет</div><div className="text-gray-400 text-xs">Лицо + Ореол</div></div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* === БЛОК 2: CONCEPT (STATIC VISUALIZATION) === */}
      <section className="py-20 lg:py-32 bg-[#020617] relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-yellow-600/10 rounded-full blur-[120px] mix-blend-screen"></div>
         </div>

         <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
               
               <div className="lg:w-5/12 lg:sticky lg:top-32">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 font-bold mb-6 text-xs uppercase tracking-widest">
                     <Layers className="w-3.5 h-3.5"/> Гибридная технология
                  </div>
                  
                  <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                     Когда <br/>
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-white">компромиссы неуместны.</span>
                  </h2>
                  
                  <p className="text-slate-400 text-lg leading-relaxed mb-10 border-l-2 border-yellow-900 pl-6">
                     Обычная буква светит либо вперед (читаемость), либо назад (стиль). Мы объединили эти технологии. Вы получаете четкий, яркий текст, окруженный мягким ореолом, который визуально отрывает вывеску от стены.
                  </p>

                  <div className="grid gap-4">
                     <div className="group p-5 bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800 hover:border-yellow-500/30 transition-all duration-300">
                        <div className="flex items-start gap-4">
                           <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-500 shrink-0"><Crown className="w-5 h-5"/></div>
                           <div>
                              <h4 className="text-white font-bold text-base mb-1">Статусность</h4>
                              <p className="text-slate-500 text-sm">Выбор банков, головных офисов и премиальных ресторанов.</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Правая колонка: 3 КАРТОЧКИ (СЛОИ) */}
               <div className="w-full lg:w-7/12 grid gap-6">
                  
                  {/* Layer 1: Face */}
                  <div className="flex items-center gap-6 p-6 rounded-3xl border border-slate-800 bg-slate-900/50 hover:border-blue-500/50 transition duration-500 group">
                      <div className="w-20 h-20 bg-black rounded-xl border border-slate-700 flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                         <span className="text-4xl font-black text-white">A</span>
                      </div>
                      <div>
                         <h4 className="text-white font-bold text-lg mb-1 group-hover:text-blue-400 transition">1. Лицевое свечение</h4>
                         <p className="text-slate-400 text-sm">Обеспечивает 100% читаемость бренда с дальнего расстояния.</p>
                      </div>
                  </div>

                  {/* Layer 2: Partition (Tech) */}
                  <div className="flex items-center gap-6 p-6 rounded-3xl border border-slate-800 bg-slate-900/50 hover:border-slate-500/50 transition duration-500 group">
                      <div className="w-20 h-20 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-center shrink-0">
                         <Layers className="w-8 h-8 text-slate-400"/>
                      </div>
                      <div>
                         <h4 className="text-white font-bold text-lg mb-1 group-hover:text-slate-300 transition">2. Светоблокировка</h4>
                         <p className="text-slate-400 text-sm">Внутри буквы стоит перегородка. Она не дает свету смешиваться. Это сложная ручная работа.</p>
                      </div>
                  </div>

                  {/* Layer 3: Back */}
                  <div className="flex items-center gap-6 p-6 rounded-3xl border border-slate-800 bg-slate-900/50 hover:border-orange-500/50 transition duration-500 group">
                      <div className="w-20 h-20 bg-black rounded-xl border border-slate-700 flex items-center justify-center shrink-0 shadow-[0_0_40px_rgba(249,115,22,0.4)]">
                         <span className="text-4xl font-black text-slate-900" style={{textShadow: "0 0 15px #f97316"}}>A</span>
                      </div>
                      <div>
                         <h4 className="text-white font-bold text-lg mb-1 group-hover:text-orange-400 transition">3. Контражур</h4>
                         <p className="text-slate-400 text-sm">Создает мягкое облако света вокруг, добавляя визуальный объем и "воздух".</p>
                      </div>
                  </div>

                  {/* RESULT */}
                  <div className="mt-4 p-6 rounded-3xl bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-500/30 text-center">
                      <h4 className="text-yellow-400 font-bold uppercase tracking-widest text-sm mb-2">Результат</h4>
                      <p className="text-white font-medium">Безупречная синергия яркости и стиля.</p>
                  </div>

               </div>
            </div>
         </div>
      </section>

      {/* === БЛОК 3: ANATOMY === */}
      <section className="py-24 bg-[#0B1221] relative overflow-hidden">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]"></div>
         
         <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
               <span className="text-yellow-500 font-bold text-sm uppercase tracking-widest mb-2 block">Инженерный шедевр</span>
               <h2 className="text-3xl md:text-5xl font-black text-white">Анатомия качества</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <div className="group relative bg-slate-900/80 backdrop-blur-sm p-8 rounded-[2rem] border border-slate-800 hover:border-yellow-500/50 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(234,179,8,0.2)] flex flex-col">
                  <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center mb-6 text-yellow-500 group-hover:scale-110 transition-all duration-300"><Gem className="w-8 h-8"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">Двойной акрил</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">Используем акрил и спереди, и сзади. Это удорожает конструкцию, но дает вау-эффект.</p>
               </div>
               <div className="group relative bg-slate-900/80 backdrop-blur-sm p-8 rounded-[2rem] border border-slate-800 hover:border-blue-500/50 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.2)] flex flex-col">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-500 group-hover:scale-110 transition-all duration-300"><Settings className="w-8 h-8"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">Перегородка</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">Внутри вклеена "шторка", разделяющая световые потоки. Свет лица не смешивается с контражуром.</p>
               </div>
               <div className="group relative bg-slate-900/80 backdrop-blur-sm p-8 rounded-[2rem] border border-slate-800 hover:border-orange-500/50 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(249,115,22,0.2)] flex flex-col">
                  <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6 text-orange-500 group-hover:scale-110 transition-all duration-300"><Zap className="w-8 h-8"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">2 цепи питания</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">В два раза больше диодов. Можно включать контуры по отдельности (требуется спец. проводка).</p>
               </div>
               <div className="group relative bg-slate-900/80 backdrop-blur-sm p-8 rounded-[2rem] border border-slate-800 hover:border-green-500/50 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(34,197,94,0.2)] flex flex-col">
                  <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 text-green-500 group-hover:scale-110 transition-all duration-300"><Shield className="w-8 h-8"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">Борт: Алюминий</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">Для таких букв часто используем алюминиевый борт с полимерной покраской для жесткости.</p>
               </div>
            </div>
         </div>
      </section>

      {/* === БЛОК 4: ЦЕНА === */}
      <section className="py-24 bg-[#0F172A] border-y border-slate-800 relative overflow-hidden">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-yellow-500/5 blur-[120px] rounded-full pointer-events-none"></div>
         <div className="container mx-auto px-4 relative z-10">
             <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16 items-stretch">
                 
                 <div className="md:w-5/12 bg-slate-900 rounded-3xl p-8 border border-slate-700 flex flex-col justify-between relative overflow-hidden group hover:border-yellow-500/50 transition-all duration-300">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><Calculator className="w-32 h-32 text-white"/></div>
                    <div>
                       <div className="inline-flex items-center gap-2 text-yellow-500 font-bold text-sm uppercase tracking-wider mb-4"><CheckCircle className="w-4 h-4"/> Двойной расход</div>
                       <h2 className="text-3xl font-bold text-white mb-4">Стоимость изготовления</h2>
                       <p className="text-gray-400 text-sm leading-relaxed mb-8">
                          Самый дорогой тип букв в прайсе. Это обусловлено расходом материалов (x2) и трудоемкостью ручной сборки.
                       </p>
                    </div>
                    <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800/50">
                        <p className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">Базовая ставка</p>
                        <div className="flex items-baseline gap-2"><span className="text-white text-sm">от</span><span className="text-5xl font-black text-white">{PAGE_DATA.price}</span><span className="text-yellow-500 text-xl font-bold">₸ / см</span></div>
                        <div className="h-1 w-full bg-slate-800 rounded-full mt-4 overflow-hidden"><div className="h-full w-3/4 bg-yellow-500 rounded-full"></div></div>
                    </div>
                 </div>

                 <div className="md:w-7/12 bg-slate-900/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-800 flex flex-col">
                    <div className="flex items-center justify-between mb-8 border-b border-slate-700/50 pb-6">
                       <div><h3 className="text-white font-bold text-xl">Пример сметы</h3><p className="text-gray-400 text-sm">Вывеска <span className="text-white font-bold">"LUXURY"</span></p></div>
                       <div className="px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 text-white font-mono text-sm">6 букв</div>
                    </div>
                    <div className="space-y-4 flex-1">
                       <div className="flex justify-between items-center text-sm group hover:bg-slate-800/50 p-2 rounded transition">
                          <span className="text-gray-400">Высота букв</span>
                          <div className="flex-1 mx-4 border-b border-dashed border-slate-700/50 relative top-1"></div>
                          <span className="text-white font-mono">40 см</span>
                       </div>
                       <div className="flex justify-between items-center text-sm group hover:bg-slate-800/50 p-2 rounded transition">
                          <span className="text-gray-400">Материалы</span>
                          <div className="flex-1 mx-4 border-b border-dashed border-slate-700/50 relative top-1"></div>
                          <span className="text-white font-mono">Акрил + Акрил</span>
                       </div>
                       <div className="flex justify-between items-center text-sm group hover:bg-slate-800/50 p-2 rounded transition">
                          <span className="text-gray-400">Подсветка</span>
                          <div className="flex-1 mx-4 border-b border-dashed border-slate-700/50 relative top-1"></div>
                          <span className="text-yellow-400 font-mono text-xs">Combo (Face + Halo)</span>
                       </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-slate-700">
                       <div className="flex justify-between items-end mb-6">
                          <span className="text-gray-400 text-sm">Итоговая стоимость:</span>
                          <span className="text-3xl font-black text-white tracking-tight">228 000 ₸</span>
                       </div>
                       <Link href="/calculator" className="group block w-full py-4 bg-yellow-600 hover:bg-yellow-700 text-black font-bold rounded-xl text-center transition-all shadow-lg shadow-yellow-900/20 flex items-center justify-center gap-3 active:scale-95">
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
               
               {/* Карточка 1: ВЕС */}
               <div className="bg-[#0B1221] p-8 rounded-3xl border border-slate-800 hover:border-blue-500/30 transition flex gap-6">
                  <div className="shrink-0">
                     <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500"><Anchor className="w-7 h-7"/></div>
                  </div>
                  <div>
                     <h3 className="text-xl font-bold text-white mb-3">Внимание: Вес!</h3>
                     <p className="text-sm text-gray-400 leading-relaxed mb-4">
                        Из-за двойного слоя акрила и перегородок эти буквы в 1.5-2 раза тяжелее обычных. Обычный гипсокартон их не выдержит.
                     </p>
                     <div className="p-3 bg-blue-900/20 border border-blue-500/20 rounded-xl">
                        <p className="text-xs text-blue-200 font-medium">
                           <span className="text-blue-400 font-bold">Решение:</span> Нужны закладные в стене или монтаж на несущий металлокаркас.
                        </p>
                     </div>
                  </div>
               </div>

               {/* Карточка 2: ТОЛЩИНА */}
               <div className="bg-[#0B1221] p-8 rounded-3xl border border-slate-800 hover:border-purple-500/30 transition flex gap-6">
                  <div className="shrink-0">
                     <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500"><Layers className="w-7 h-7"/></div>
                  </div>
                  <div>
                     <h3 className="text-xl font-bold text-white mb-3">Глубина буквы</h3>
                     <p className="text-sm text-gray-400 leading-relaxed mb-4">
                        Чтобы свет равномерно рассеялся и вперед, и назад, буква должна быть глубокой (минимум 8-10 см).
                     </p>
                     <div className="p-3 bg-purple-900/20 border border-purple-500/20 rounded-xl">
                        <p className="text-xs text-purple-200 font-medium">
                           <span className="text-purple-400 font-bold">Эстетика:</span> Учитывайте это, если вывеска висит в узком коридоре (будет сильно выступать).
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
               <h2 className="text-3xl font-bold text-white mb-4">Вопросы о Combo Lit</h2>
            </div>

            <div className="space-y-4">
               {FAQ_ITEMS.map((item, index) => (
                  <details key={index} className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-300 open:border-yellow-500/30 open:bg-slate-900/80">
                     <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-slate-800/50 transition">
                        <div className="flex items-center gap-4">
                           <div className="p-2 bg-slate-800 rounded-lg group-open:bg-yellow-500/10 transition">
                              {item.icon}
                           </div>
                           <span className="font-bold text-white text-base md:text-lg group-open:text-yellow-500 transition">{item.question}</span>
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
              <h2 className="text-3xl font-bold text-white mb-4">Галерея проектов</h2>
              <p className="text-gray-400">Премиальные работы ADLight</p>
          </div>
          <div className="container mx-auto px-4">
              {galleryImages.length > 0 ? <ImageGallery images={galleryImages} /> : <div className="text-center text-gray-500 py-12 border border-dashed border-slate-800 rounded-2xl">Загрузите фото в папку public/images/letters-galery/combo-lit</div>}
              
              <div className="mt-16 flex justify-center">
                 <Link href="/portfolio" className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#0B1221] border border-slate-700 rounded-full text-white font-bold hover:bg-slate-800 transition overflow-hidden">
                    <span className="relative z-10 flex items-center gap-2">
                       <Briefcase className="w-5 h-5 text-yellow-500"/>
                       Посмотреть все работы в Портфолио
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition duration-500"></div>
                 </Link>
              </div>
          </div>
      </section>

      {/* === БЛОК 8: СМОТРИТЕ ТАКЖЕ (REDESIGNED) === */}
      <section className="py-24 bg-[#0F172A] border-t border-slate-800 relative">
         <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-500/5 blur-[100px] rounded-full pointer-events-none"></div>

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
                                <h4 className="text-white font-bold text-lg leading-snug group-hover:text-yellow-400 transition-colors line-clamp-2">
                                    {type.title}
                                </h4>
                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-yellow-600 group-hover:text-black transition-all duration-300 shrink-0 group-hover:rotate-[-45deg]">
                                   <ArrowRight className="w-4 h-4"/>
                                </div>
                             </div>
                             <div className="mt-auto pt-4">
                                <div className="w-full h-0.5 bg-slate-800 group-hover:bg-slate-700 transition-colors relative overflow-hidden rounded-full">
                                   <div className="absolute top-0 left-0 h-full w-0 bg-yellow-500 group-hover:w-full transition-all duration-700 ease-out"></div>
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