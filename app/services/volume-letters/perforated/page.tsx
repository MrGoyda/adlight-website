import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next"; // Типизация
import { 
  Calculator, 
  CheckCircle, 
  ChevronRight, 
  Sparkles,       
  Gem,            
  Cpu,            
  Hammer,         
  PaintBucket,    
  Sun,
  ArrowRight,
  ChevronDown,
  Briefcase,
  Star,
  Shield // Используем стандартную иконку из библиотеки
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
  slug: "perforated", 
  title: "Объемные буквы с перфорацией",
  subtitle: "Wow-эффект «Бриллиантовая пыль». Алюминиевый борт с тысячами отверстий создает сияние, которое невозможно не заметить.",
  // ВАЖНО: Цена 750 согласно прайсу
  price: "750" 
};

// 1. УЛУЧШЕННЫЕ METADATA
export const metadata: Metadata = {
  title: "Перфорированные буквы (Perforated) | Эффект мерцания | ADLight",
  description: "Изготовление букв с перфорированным алюминиевым бортом в Астане. Эффект звездного неба и бриллиантового блеска. Цена от 750 тг/см.",
  keywords: ["перфорированные буквы", "вывеска с блестками", "алюминиевые буквы астана", "perforated channel letters", "буквы с дырочками"],
  openGraph: {
    title: "Вывески с перфорацией | Diamond Effect",
    description: "Сияние бриллиантов на вашем фасаде. Алюминиевый корпус.",
    images: ["/images/letters/perforated-night.webp"]
  }
};

// --- FAQ ДАННЫЕ ---
const FAQ_ITEMS = [
  {
    question: "Не забиваются ли дырочки грязью?",
    answer: "Диаметр перфорации — около 1.5-2 мм. Пыль там не задерживается (продувается ветром). Даже если со временем вывеска запылится, её легко помыть струей воды (Керхер), так как это металл, а не хрупкий пластик.",
    icon: <Sparkles className="w-5 h-5 text-pink-500"/>
  },
  {
    question: "Будет ли она ржаветь?",
    answer: "Нет. Мы используем специальный анодированный алюминий с заводской полимерной покраской. Он не боится ни дождя, ни снега, ни реагентов.",
    icon: <Shield className="w-5 h-5 text-blue-500"/>
  },
  {
    question: "Можно ли сделать свой цвет?",
    answer: "Стандартные цвета профиля — Золото, Серебро, Черный, Белый. Если нужен уникальный цвет (например, Тиффани), мы можем покрасить профиль порошковой краской (+15% к стоимости).",
    icon: <PaintBucket className="w-5 h-5 text-yellow-500"/>
  }
];

// --- ОСНОВНОЙ КОМПОНЕНТ (SERVER SIDE) ---
export default async function PerforatedLettersPage() {
  
  // 1. ПОЛУЧАЕМ ФОТО
  const galleryImages = getImagesFromFolder(PAGE_DATA.slug);

  // 2. ФОТО ДЛЯ HERO
  const heroImages = [...galleryImages].sort(() => 0.5 - Math.random()).slice(0, 15);
  const displayHeroImages = heroImages.length > 0 
    ? heroImages 
    : ["/images/letters/perforated-night.png", "/images/letters/perforated-day.png"];

  // 3. "ДРУГИЕ ВИДЫ"
  const otherTypes = volumeLettersCatalog.filter(item => item.slug !== PAGE_DATA.slug);

  // 4. ГЕНЕРАЦИЯ SCHEMA (Product + FAQ)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "name": "Объемные буквы с перфорацией (Perforated)",
        "image": displayHeroImages[0],
        "description": "Алюминиевые буквы с перфорированным бортом. Создают эффект мерцания (звездное небо).",
        "brand": {
          "@type": "Brand",
          "name": "ADLight"
        },
        "offers": {
          "@type": "Offer",
          "url": "https://adlight.kz/services/volume-letters/perforated",
          "priceCurrency": "KZT",
          "price": "750",
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
    <div className="min-h-screen bg-[#0F172A] font-sans selection:bg-pink-500/30">
      
      {/* Вставляем Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* === 1. HERO SECTION === */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F172A]/80 to-[#0F172A]"></div>
        {/* Розовое/Золотое свечение */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-pink-500/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
           {/* Навигация */}
           <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 mb-8">
              <Link href="/" className="hover:text-white transition">Главная</Link>
              <ChevronRight className="w-3 h-3"/>
              <Link href="/services/volume-letters" className="hover:text-white transition">Объемные буквы</Link>
              <ChevronRight className="w-3 h-3"/>
              <span className="text-pink-500 font-medium">Перфорация</span>
           </div>

           <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Текст */}
              <div>
                 <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-bold text-pink-400 bg-pink-500/10 border border-pink-500/20 rounded-full uppercase tracking-wider">
                    <Sparkles className="w-4 h-4"/> Diamond Effect
                 </div>
                 <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    {PAGE_DATA.title}
                 </h1>
                 <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                    {PAGE_DATA.subtitle}
                 </p>
                 
                 <ul className="space-y-3 mb-10">
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-pink-500"/> Алюминиевый борт (не ржавеет)
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-pink-500"/> Эффект мерцания кристаллов
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-pink-500"/> Заводская сборка на станке
                    </li>
                 </ul>

                 {/* --- НОВЫЙ ИЗОЛИРОВАННЫЙ КОМПОНЕНТ КНОПОК --- */}
                 <HeroButtons source={PAGE_DATA.title} priceColor="pink" />
                 
              </div>

              {/* Визуал: СЛАЙДЕР */}
              <div className="relative aspect-square rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden group shadow-2xl shadow-pink-900/10">
                 <HeroSlideshow images={displayHeroImages} />
                 
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none"></div>
                 <div className="absolute bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur border border-slate-700 p-4 rounded-xl flex items-center gap-4 pointer-events-none z-20">
                    <div className="w-12 h-12 bg-pink-500/10 rounded-full flex items-center justify-center text-pink-500"><Gem className="w-6 h-6"/></div>
                    <div><div className="text-white font-bold">Ювелирная работа</div><div className="text-gray-400 text-xs">Блеск без электрики</div></div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* === БЛОК 2: CONCEPT === */}
      <section className="py-20 lg:py-32 bg-[#020617] relative overflow-hidden">
         {/* Фоновый эффект */}
         <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[120px] mix-blend-screen"></div>
         </div>

         <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
               
               <div className="lg:w-5/12 lg:sticky lg:top-32">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 font-bold mb-6 text-xs uppercase tracking-widest">
                     <Star className="w-3.5 h-3.5"/> Магия физики
                  </div>
                  
                  <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                     Днем — металл. <br/>
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-white">Ночью — звезды.</span>
                  </h2>
                  
                  <p className="text-slate-400 text-lg leading-relaxed mb-10 border-l-2 border-pink-900 pl-6">
                     Секрет в специальном перфорированном борте. Тысячи микро-отверстий работают как линзы. Свет от внутренних диодов дробится и преломляется, создавая эффект искрящейся "алмазной пыли". Это выглядит намного дороже обычного пластика.
                  </p>

                  <div className="grid gap-4">
                     <div className="group p-5 bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800 hover:border-pink-500/30 transition-all duration-300">
                        <div className="flex items-start gap-4">
                           <div className="w-10 h-10 bg-pink-500/10 rounded-xl flex items-center justify-center text-pink-500 shrink-0"><Gem className="w-5 h-5"/></div>
                           <div>
                              <h4 className="text-white font-bold text-base mb-1">Beauty-индустрия</h4>
                              <p className="text-slate-500 text-sm">Салоны красоты, бутики косметики, ювелирные магазины.</p>
                           </div>
                        </div>
                     </div>
                     <div className="group p-5 bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800 hover:border-pink-500/30 transition-all duration-300">
                        <div className="flex items-start gap-4">
                           <div className="w-10 h-10 bg-pink-500/10 rounded-xl flex items-center justify-center text-pink-500 shrink-0"><Cpu className="w-5 h-5"/></div>
                           <div>
                              <h4 className="text-white font-bold text-base mb-1">Роботизированная гибка</h4>
                              <p className="text-slate-500 text-sm">Буквы гнет станок с ЧПУ. Идеальная геометрия даже сложных шрифтов.</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Правая колонка: ПАЛИТРА МЕТАЛЛОВ (STATIC BENTO) */}
               <div className="w-full lg:w-7/12">
                  <div className="mb-6"><h3 className="text-white font-bold text-xl">Складская программа (Алюминий)</h3></div>
                  <div className="grid grid-cols-2 gap-4">
                      
                      {/* GOLD */}
                      <div className="aspect-square bg-gradient-to-br from-[#FFD700] via-[#FDB931] to-[#9E7C0C] rounded-3xl p-6 flex flex-col justify-between group relative overflow-hidden">
                         <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-300"></div>
                         <span className="bg-black/50 backdrop-blur text-white text-xs font-bold px-2 py-1 rounded w-fit">Хит продаж</span>
                         <div>
                            <h4 className="text-white font-black text-2xl drop-shadow-md">GOLD</h4>
                            <p className="text-white/90 text-sm font-medium">Зеркальное золото</p>
                         </div>
                      </div>

                      {/* SILVER */}
                      <div className="aspect-square bg-gradient-to-br from-[#E0E0E0] via-[#C0C0C0] to-[#808080] rounded-3xl p-6 flex flex-col justify-between group relative overflow-hidden">
                         <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-300"></div>
                         <span className="bg-black/50 backdrop-blur text-white text-xs font-bold px-2 py-1 rounded w-fit">Классика</span>
                         <div>
                            <h4 className="text-white font-black text-2xl drop-shadow-md">SILVER</h4>
                            <p className="text-white/90 text-sm font-medium">Зеркальное серебро</p>
                         </div>
                      </div>

                      {/* BLACK */}
                      <div className="aspect-square bg-gradient-to-br from-[#434343] to-[#000000] rounded-3xl p-6 flex flex-col justify-between group border border-white/10">
                         <span className="bg-white/20 backdrop-blur text-white text-xs font-bold px-2 py-1 rounded w-fit">Стиль</span>
                         <div>
                            <h4 className="text-white font-black text-2xl">BLACK</h4>
                            <p className="text-gray-400 text-sm font-medium">Черный муар</p>
                         </div>
                      </div>

                      {/* WHITE */}
                      <div className="aspect-square bg-white rounded-3xl p-6 flex flex-col justify-between group">
                         <span className="bg-black/10 backdrop-blur text-black text-xs font-bold px-2 py-1 rounded w-fit">Clean</span>
                         <div>
                            <h4 className="text-black font-black text-2xl">WHITE</h4>
                            <p className="text-gray-600 text-sm font-medium">Белый глянец</p>
                         </div>
                      </div>

                  </div>
                  <p className="text-center text-gray-500 text-xs mt-4">* Возможна покраска в любой цвет RAL под заказ.</p>
               </div>

            </div>
         </div>
      </section>

      {/* === БЛОК 3: PRODUCTION === */}
      <section className="py-24 bg-[#0B1221] relative overflow-hidden">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]"></div>
         
         <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
               <span className="text-pink-500 font-bold text-sm uppercase tracking-widest mb-2 block">Без клея и паяльника</span>
               <h2 className="text-3xl md:text-5xl font-black text-white">Анатомия качества</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <div className="group relative bg-slate-900/80 backdrop-blur-sm p-8 rounded-[2rem] border border-slate-800 hover:border-pink-500/50 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(236,72,153,0.2)] flex flex-col">
                  <div className="w-16 h-16 bg-pink-500/10 rounded-2xl flex items-center justify-center mb-6 text-pink-500 group-hover:scale-110 transition-all duration-300"><Hammer className="w-8 h-8"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">Алюминий</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">Борт не пластиковый, а металлический (0.6-0.8 мм). Он не треснет на морозе и не поведет на жаре.</p>
               </div>
               <div className="group relative bg-slate-900/80 backdrop-blur-sm p-8 rounded-[2rem] border border-slate-800 hover:border-blue-500/50 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.2)] flex flex-col">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-500 group-hover:scale-110 transition-all duration-300"><Cpu className="w-8 h-8"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">ЧПУ гибка</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">Профиль гнет умный станок по файлу. Идеальное совпадение углов с лицом буквы.</p>
               </div>
               <div className="group relative bg-slate-900/80 backdrop-blur-sm p-8 rounded-[2rem] border border-slate-800 hover:border-orange-500/50 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(249,115,22,0.2)] flex flex-col">
                  <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6 text-orange-500 group-hover:scale-110 transition-all duration-300"><Sun className="w-8 h-8"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">Лицо: Акрил</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">Лицевая часть вклеивается в пазы или крепится жидким акрилом. Герметичность IP65.</p>
               </div>
               <div className="group relative bg-slate-900/80 backdrop-blur-sm p-8 rounded-[2rem] border border-slate-800 hover:border-green-500/50 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(34,197,94,0.2)] flex flex-col">
                  <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 text-green-500 group-hover:scale-110 transition-all duration-300"><PaintBucket className="w-8 h-8"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">Без пленки</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">Цвет борта — это заводская покраска металла. Никаких отклеивающихся пленок!</p>
               </div>
            </div>
         </div>
      </section>

      {/* === БЛОК 4: ЦЕНА === */}
      <section className="py-24 bg-[#0F172A] border-y border-slate-800 relative overflow-hidden">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-pink-500/5 blur-[120px] rounded-full pointer-events-none"></div>
         <div className="container mx-auto px-4 relative z-10">
             <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16 items-stretch">
                 
                 <div className="md:w-5/12 bg-slate-900 rounded-3xl p-8 border border-slate-700 flex flex-col justify-between relative overflow-hidden group hover:border-pink-500/50 transition-all duration-300">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><Calculator className="w-32 h-32 text-white"/></div>
                    <div>
                       <div className="inline-flex items-center gap-2 text-pink-500 font-bold text-sm uppercase tracking-wider mb-4"><CheckCircle className="w-4 h-4"/> Выбор 2025</div>
                       <h2 className="text-3xl font-bold text-white mb-4">Стоимость изготовления</h2>
                       <p className="text-gray-400 text-sm leading-relaxed mb-8">
                          Дороже обычных, но долговечнее. Вы платите за алюминий и отсутствие проблем с пленкой в будущем.
                       </p>
                    </div>
                    <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800/50">
                        <p className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">Базовая ставка</p>
                        <div className="flex items-baseline gap-2"><span className="text-white text-sm">от</span><span className="text-5xl font-black text-white">{PAGE_DATA.price}</span><span className="text-pink-500 text-xl font-bold">₸ / см</span></div>
                        <div className="h-1 w-full bg-slate-800 rounded-full mt-4 overflow-hidden"><div className="h-full w-2/3 bg-pink-500 rounded-full"></div></div>
                    </div>
                 </div>

                 <div className="md:w-7/12 bg-slate-900/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-800 flex flex-col">
                    <div className="flex items-center justify-between mb-8 border-b border-slate-700/50 pb-6">
                       <div><h3 className="text-white font-bold text-xl">Пример сметы</h3><p className="text-gray-400 text-sm">Вывеска <span className="text-white font-bold">"BEAUTY"</span></p></div>
                       <div className="px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 text-white font-mono text-sm">6 букв</div>
                    </div>
                    <div className="space-y-4 flex-1">
                       <div className="flex justify-between items-center text-sm group hover:bg-slate-800/50 p-2 rounded transition">
                          <span className="text-gray-400">Высота букв</span>
                          <div className="flex-1 mx-4 border-b border-dashed border-slate-700/50 relative top-1"></div>
                          <span className="text-white font-mono">40 см</span>
                       </div>
                       <div className="flex justify-between items-center text-sm group hover:bg-slate-800/50 p-2 rounded transition">
                          <span className="text-gray-400">Материал борта</span>
                          <div className="flex-1 mx-4 border-b border-dashed border-slate-700/50 relative top-1"></div>
                          <span className="text-white font-mono">Золото (Перфорация)</span>
                       </div>
                       <div className="flex justify-between items-center text-sm group hover:bg-slate-800/50 p-2 rounded transition">
                          <span className="text-gray-400">Подсветка</span>
                          <div className="flex-1 mx-4 border-b border-dashed border-slate-700/50 relative top-1"></div>
                          <span className="text-pink-400 font-mono text-xs">Лицо + Борт</span>
                       </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-slate-700">
                       <div className="flex justify-between items-end mb-6">
                          <span className="text-gray-400 text-sm">Итоговая стоимость:</span>
                          <span className="text-3xl font-black text-white tracking-tight">180 000 ₸</span>
                       </div>
                       <Link href="/calculator" className="group block w-full py-4 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl text-center transition-all shadow-lg shadow-pink-900/20 flex items-center justify-center gap-3 active:scale-95">
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
               
               {/* Карточка 1: Прочность */}
               <div className="bg-[#0B1221] p-8 rounded-3xl border border-slate-800 hover:border-blue-500/30 transition flex gap-6">
                  <div className="shrink-0">
                     <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500"><Shield className="w-7 h-7"/></div>
                  </div>
                  <div>
                     <h3 className="text-xl font-bold text-white mb-3">Забудьте про пленку</h3>
                     <p className="text-sm text-gray-400 leading-relaxed mb-4">
                        Обычные буквы оклеиваются пленкой, которая через 2-3 года начинает трескаться на бортах.
                     </p>
                     <div className="p-3 bg-blue-900/20 border border-blue-500/20 rounded-xl">
                        <p className="text-xs text-blue-200 font-medium">
                           <span className="text-blue-400 font-bold">Преимущество:</span> Перфорированный борт — это крашеный алюминий. Он вечен. Цвет не выгорит и не облезет.
                        </p>
                     </div>
                  </div>
               </div>

               {/* Карточка 2: Яркость */}
               <div className="bg-[#0B1221] p-8 rounded-3xl border border-slate-800 hover:border-pink-500/30 transition flex gap-6">
                  <div className="shrink-0">
                     <div className="w-14 h-14 bg-pink-500/10 rounded-2xl flex items-center justify-center text-pink-500"><Sparkles className="w-7 h-7"/></div>
                  </div>
                  <div>
                     <h3 className="text-xl font-bold text-white mb-3">Двойная заметность</h3>
                     <p className="text-sm text-gray-400 leading-relaxed mb-4">
                        За счет перфорации вывеска кажется больше. Светится не только лицо, но и ореол вокруг.
                     </p>
                     <div className="p-3 bg-pink-900/20 border border-pink-500/20 rounded-xl">
                        <p className="text-xs text-pink-200 font-medium">
                           <span className="text-pink-400 font-bold">Результат:</span> Вывеска привлекает на 40% больше внимания, чем стандартные варианты.
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
               <h2 className="text-3xl font-bold text-white mb-4">Вопросы о перфорации</h2>
            </div>

            <div className="space-y-4">
               {FAQ_ITEMS.map((item, index) => (
                  <details key={index} className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-300 open:border-pink-500/30 open:bg-slate-900/80">
                     <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-slate-800/50 transition">
                        <div className="flex items-center gap-4">
                           <div className="p-2 bg-slate-800 rounded-lg group-open:bg-pink-500/10 transition">
                              {item.icon}
                           </div>
                           <span className="font-bold text-white text-base md:text-lg group-open:text-pink-500 transition">{item.question}</span>
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
              <h2 className="text-3xl font-bold text-white mb-4">Живые фото</h2>
              <p className="text-gray-400">Посмотрите на этот блеск</p>
          </div>
          <div className="container mx-auto px-4">
              {galleryImages.length > 0 ? <ImageGallery images={galleryImages} /> : <div className="text-center text-gray-500 py-12 border border-dashed border-slate-800 rounded-2xl">Загрузите фото в папку public/images/letters-galery/perforated</div>}
              
              <div className="mt-16 flex justify-center">
                 <Link href="/portfolio" className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#0B1221] border border-slate-700 rounded-full text-white font-bold hover:bg-slate-800 transition overflow-hidden">
                    <span className="relative z-10 flex items-center gap-2">
                       <Briefcase className="w-5 h-5 text-pink-500"/>
                       Посмотреть все работы в Портфолио
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition duration-500"></div>
                 </Link>
              </div>
          </div>
      </section>

      {/* === БЛОК 8: СМОТРИТЕ ТАКЖЕ (REDESIGNED) === */}
      <section className="py-24 bg-[#0F172A] border-t border-slate-800 relative">
         <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/5 blur-[100px] rounded-full pointer-events-none"></div>

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
                                <h4 className="text-white font-bold text-lg leading-snug group-hover:text-pink-400 transition-colors line-clamp-2">
                                    {type.title}
                                </h4>
                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-pink-600 group-hover:text-white transition-all duration-300 shrink-0 group-hover:rotate-[-45deg]">
                                   <ArrowRight className="w-4 h-4"/>
                                </div>
                             </div>
                             <div className="mt-auto pt-4">
                                <div className="w-full h-0.5 bg-slate-800 group-hover:bg-slate-700 transition-colors relative overflow-hidden rounded-full">
                                   <div className="absolute top-0 left-0 h-full w-0 bg-pink-500 group-hover:w-full transition-all duration-700 ease-out"></div>
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