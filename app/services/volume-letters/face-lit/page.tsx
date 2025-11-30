import Link from "next/link";
import Image from "next/image";
import { 
  Calculator, 
  CheckCircle, 
  ChevronRight, 
  FileCheck,
  MessageCircle,
  Eye,          
  Zap,          
  Shield,       
  Layers,
  Info,
  ChevronDown,
  Store,        
  Building,     
  ShoppingBag,  
  Briefcase,
  Palette,      // New
  Sun,          // New
  Moon,         // New
  BatteryCharging, // New
  Clock,
  ArrowRight         // New
} from "lucide-react";

// --- ИМПОРТ КЛИЕНТСКИХ КОМПОНЕНТОВ ---
import CallToAction from "@/components/CallToAction";
import ServicesCarousel from "@/components/ServicesCarousel"; // Если используется в layout, тут можно убрать, но оставим для структуры
import ReviewsCarousel from "@/components/ReviewsCarousel";
import ImageGallery from "@/components/ImageGallery";
import HeroSlideshow from "@/components/HeroSlideshow";

// --- СЕРВЕРНАЯ УТИЛИТА (Сбор фото) ---
import { getImagesFromFolder } from "@/lib/serverUtils";

// --- ДАННЫЕ КАТАЛОГА ---
import { volumeLettersCatalog } from "@/lib/volumeLettersData";

// --- ДАННЫЕ ТЕКУЩЕЙ СТРАНИЦЫ ---
const PAGE_DATA = {
  slug: "face-lit", 
  title: "Объемные буквы со световым лицом",
  subtitle: "Классика наружной рекламы. Самый яркий и читаемый вид вывесок в Астане.",
  price: "450" 
};

export const metadata = {
  title: "Объемные буквы со световым лицом | Изготовление в Астане",
  description: "Световые буквы с лицевой подсветкой. Акрил Plexiglas, герметичные модули. Расчет стоимости.",
};

// --- FAQ ДАННЫЕ ---
const FAQ_ITEMS = [
  {
    question: "Какой срок изготовления?",
    answer: "Стандартный срок производства — от 3 до 5 рабочих дней. Если проект сложный (крышная установка или большой объем) — до 7-10 дней. Мы работаем на собственном оборудовании, поэтому не зависим от подрядчиков.",
    icon: <Clock className="w-5 h-5 text-blue-500"/>
  },
  {
    question: "Сколько электричества потребляет вывеска?",
    answer: "Современные LED-модули очень экономичны. Средняя вывеска потребляет как 1-2 обычные лампочки накаливания (около 60-100 Вт). Мы используем блоки питания с запасом мощности +20% для долговечности.",
    icon: <BatteryCharging className="w-5 h-5 text-green-500"/>
  },
  {
    question: "Из чего складывается гарантия?",
    answer: "Мы даем гарантию 2 года на светодиодные модули и блоки питания (IP67 влагозащита). Акрил Plexiglas имеет заводскую гарантию от выгорания на солнце — 10 лет.",
    icon: <Shield className="w-5 h-5 text-orange-500"/>
  }
];

// --- ОСНОВНОЙ КОМПОНЕНТ (SERVER SIDE) ---
export default async function FaceLitLettersPage() {
  
  // 1. ПОЛУЧАЕМ ФОТО
  const galleryImages = getImagesFromFolder(PAGE_DATA.slug);

  // 2. ФОТО ДЛЯ HERO
  const heroImages = [...galleryImages].sort(() => 0.5 - Math.random()).slice(0, 15);
  const displayHeroImages = heroImages.length > 0 
    ? heroImages 
    : ["/images/letters/face-lit-night.png", "/images/letters/face-lit-day.png"];

  // 3. "ДРУГИЕ ВИДЫ"
  const otherTypes = volumeLettersCatalog.filter(item => item.slug !== PAGE_DATA.slug);

  return (
    <div className="min-h-screen bg-[#0F172A] font-sans selection:bg-orange-500/30">
      
      {/* === 1. HERO SECTION === */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F172A]/80 to-[#0F172A]"></div>

        <div className="container mx-auto px-4 relative z-10">
           {/* Навигация */}
           <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 mb-8">
              <Link href="/" className="hover:text-white transition">Главная</Link>
              <ChevronRight className="w-3 h-3"/>
              <Link href="/services/volume-letters" className="hover:text-white transition">Объемные буквы</Link>
              <ChevronRight className="w-3 h-3"/>
              <span className="text-orange-500 font-medium">Световое лицо</span>
           </div>

           <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Текст */}
              <div>
                 <div className="inline-block px-4 py-1.5 mb-6 text-xs font-bold text-orange-500 bg-orange-500/10 border border-orange-500/20 rounded-full uppercase tracking-wider">
                    Хит продаж 2025
                 </div>
                 <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    {PAGE_DATA.title}
                 </h1>
                 <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                    {PAGE_DATA.subtitle}
                 </p>
                 
                 <ul className="space-y-3 mb-10">
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-green-500"/> Максимальная яркость лицевой панели
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-green-500"/> Читаемость с расстояния до 300 метров
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-green-500"/> Герметичность IP67 (защита от снега)
                    </li>
                 </ul>

                 <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/calculator" className="flex items-center justify-center gap-2 bg-orange-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-700 transition shadow-lg shadow-orange-900/20 active:scale-95">
                       <Calculator className="w-5 h-5"/> Рассчитать стоимость
                    </Link>
                    <a href="https://wa.me/77071356701" target="_blank" className="flex items-center justify-center gap-2 border border-slate-700 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition">
                       <MessageCircle className="w-5 h-5 text-green-500"/> Задать вопрос
                    </a>
                 </div>
              </div>

              {/* Визуал: СЛАЙДЕР */}
              <div className="relative aspect-square rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden group shadow-2xl">
                 <HeroSlideshow images={displayHeroImages} />
                 
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none"></div>
                 <div className="absolute bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur border border-slate-700 p-4 rounded-xl flex items-center gap-4 pointer-events-none z-20">
                    <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center text-green-500"><FileCheck className="w-6 h-6"/></div>
                    <div><div className="text-white font-bold">Гарантия качества</div><div className="text-gray-400 text-xs">Соблюдаем Дизайн-код</div></div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* === БЛОК 2: CONCEPT (UPGRADED) === */}
      <section className="py-20 lg:py-32 bg-[#020617] relative overflow-hidden">
         {/* Фоновый эффект свечения (Ambient Light) */}
         <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen"></div>
            <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px] mix-blend-screen"></div>
         </div>

         <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
               
               {/* Левая колонка: Описание и Преимущества */}
               <div className="lg:w-5/12 lg:sticky lg:top-32">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold mb-6 text-xs uppercase tracking-widest shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)]">
                     <Lightbulb className="w-3.5 h-3.5"/> Технология Face Lit
                  </div>
                  
                  <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                     Магия <br/>
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">чистого света.</span>
                  </h2>
                  
                  <p className="text-slate-400 text-lg leading-relaxed mb-10 border-l-2 border-slate-800 pl-6">
                     В этой технологии светятся <span className="text-white font-medium">только лицевые панели</span>. Борта остаются в тени, создавая естественный черный контур. Это повышает читаемость текста на 40% по сравнению с полностью светящимися буквами.
                  </p>

                  <div className="grid gap-4">
                     {/* Tech Card 1 */}
                     <div className="group p-5 bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800 hover:border-green-500/30 transition-all duration-300">
                        <div className="flex items-start gap-4">
                           <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500 shrink-0 group-hover:scale-110 transition-transform duration-300">
                              <CheckCircle className="w-5 h-5"/>
                           </div>
                           <div className="flex-1">
                              <h4 className="text-white font-bold text-base mb-1">Идеально для ТРЦ</h4>
                              <p className="text-slate-500 text-sm mb-3">Соответствует жестким регламентам пожарной безопасности и дизайн-кодам моллов.</p>
                              {/* Fake Progress Bar */}
                              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                                 <span>Совместимость</span>
                                 <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="w-[98%] h-full bg-green-500 rounded-full"></div>
                                 </div>
                                 <span className="text-green-500">98%</span>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Tech Card 2 */}
                     <div className="group p-5 bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800 hover:border-blue-500/30 transition-all duration-300">
                        <div className="flex items-start gap-4">
                           <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 shrink-0 group-hover:scale-110 transition-transform duration-300">
                              <Eye className="w-5 h-5"/>
                           </div>
                           <div className="flex-1">
                              <h4 className="text-white font-bold text-base mb-1">Максимальный контраст</h4>
                              <p className="text-slate-500 text-sm mb-3">Четкий контур без ореолов и засветов ("мыла"). Лучший выбор для логотипов со сложным шрифтом.</p>
                              {/* Fake Progress Bar */}
                              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                                 <span>Четкость</span>
                                 <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="w-[100%] h-full bg-blue-500 rounded-full"></div>
                                 </div>
                                 <span className="text-blue-500">HD</span>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Правая колонка: Визуал Bento Grid */}
               <div className="w-full lg:w-7/12">
                  <div className="flex overflow-x-auto pb-8 -mx-4 px-4 lg:grid lg:grid-cols-2 lg:gap-5 lg:overflow-visible lg:pb-0 lg:px-0 hide-scrollbar snap-x snap-mandatory">
                      
                      {/* Большая карточка: ФАСАДЫ */}
                      <div className="min-w-[85vw] sm:min-w-[300px] lg:min-w-0 lg:col-span-2 relative h-[280px] lg:h-[360px] rounded-3xl overflow-hidden group border border-slate-800 hover:border-blue-500/50 transition-colors duration-500 snap-center bg-slate-900 shadow-2xl">
                         <Image src="/images/letters-galery/face-lit/4.jpg" alt="Фасадные вывески" fill className="object-cover transition duration-700 group-hover:scale-105 group-hover:brightness-110"/>
                         {/* Градиент */}
                         <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500"></div>
                         
                         {/* Контент */}
                         <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                            <div className="flex items-center gap-3 mb-3">
                               <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-600 text-white text-[10px] uppercase font-bold tracking-wider rounded-md shadow-lg shadow-blue-900/50">
                                  <Store className="w-3 h-3"/> Retail
                               </span>
                               <span className="text-xs font-medium text-slate-300 backdrop-blur-md bg-white/5 px-2 py-1 rounded-md border border-white/10">
                                  Срок: 5 дней
                               </span>
                            </div>
                            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">Фасадные вывески</h3>
                            <p className="text-slate-400 text-sm max-w-md line-clamp-2 group-hover:text-slate-300 transition-colors">
                               Главный инструмент привлечения трафика. Лицевое свечение гарантирует читаемость названия бренда с расстояния до 300 метров.
                            </p>
                         </div>
                      </div>

                      {/* Малая карточка: КРЫШИ */}
                      <div className="min-w-[70vw] sm:min-w-[250px] lg:min-w-0 relative h-[240px] lg:h-[260px] rounded-3xl overflow-hidden group border border-slate-800 hover:border-orange-500/50 transition-colors duration-500 snap-center bg-slate-900 shadow-xl">
                         <Image src="/krisha.jpg" alt="Крышные установки" fill className="object-cover transition duration-700 group-hover:scale-105 group-hover:brightness-110"/>
                         <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-90"></div>
                         <div className="absolute bottom-0 left-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-orange-600 text-white text-[10px] uppercase font-bold tracking-wider rounded-md mb-3 shadow-lg shadow-orange-900/50">
                               <Building className="w-3 h-3"/> Scale
                            </span>
                            <h3 className="text-xl font-bold text-white group-hover:text-orange-200 transition-colors">Крышные установки</h3>
                         </div>
                      </div>

                      {/* Малая карточка: ИНТЕРЬЕР */}
                      <div className="min-w-[70vw] sm:min-w-[250px] lg:min-w-0 relative h-[240px] lg:h-[260px] rounded-3xl overflow-hidden group border border-slate-800 hover:border-purple-500/50 transition-colors duration-500 snap-center bg-slate-900 shadow-xl">
                         <Image src="/kmg.jpeg" alt="Интерьерные вывески" fill className="object-cover transition duration-700 group-hover:scale-105 group-hover:brightness-110"/>
                         <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-90"></div>
                         <div className="absolute bottom-0 left-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-600 text-white text-[10px] uppercase font-bold tracking-wider rounded-md mb-3 shadow-lg shadow-purple-900/50">
                               <ShoppingBag className="w-3 h-3"/> Indoor
                            </span>
                            <h3 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors">Интерьер и Офис</h3>
                         </div>
                      </div>

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
               <span className="text-blue-500 font-bold text-sm uppercase tracking-widest mb-2 block">Технологический разбор</span>
               <h2 className="text-3xl md:text-5xl font-black text-white">Анатомия качества ADLight</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <div className="group relative bg-slate-900/80 backdrop-blur-sm p-8 rounded-[2rem] border border-slate-800 hover:border-blue-500/50 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.2)] flex flex-col">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-500 group-hover:scale-110 transition-all duration-300"><Layers className="w-8 h-8"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">Лицевая панель</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">Литой акрил (Plexiglas) 3–4 мм. Идеально рассеивает свет.</p>
               </div>
               <div className="group relative bg-slate-900/80 backdrop-blur-sm p-8 rounded-[2rem] border border-slate-800 hover:border-purple-500/50 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.2)] flex flex-col">
                  <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 text-purple-500 group-hover:scale-110 transition-all duration-300"><Shield className="w-8 h-8"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">Боковой борт</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">ПВХ пластик или алюминиевый профиль с порошковой покраской.</p>
               </div>
               <div className="group relative bg-slate-900/80 backdrop-blur-sm p-8 rounded-[2rem] border border-slate-800 hover:border-orange-500/50 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(249,115,22,0.2)] flex flex-col">
                  <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6 text-orange-500 group-hover:scale-110 transition-all duration-300"><Zap className="w-8 h-8"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">Подсветка</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">Сверхъяркие линзованные модули с широким углом (160°).</p>
               </div>
               <div className="group relative bg-slate-900/80 backdrop-blur-sm p-8 rounded-[2rem] border border-slate-800 hover:border-green-500/50 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(34,197,94,0.2)] flex flex-col">
                  <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 text-green-500 group-hover:scale-110 transition-all duration-300"><Layers className="w-8 h-8"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">Задняя стенка</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">ПВХ пластик 8-10 мм или сталь. Основа жесткости.</p>
               </div>
            </div>
         </div>
      </section>

      {/* === БЛОК 4: ЦЕНА И РАСЧЕТ === */}
      <section className="py-24 bg-[#0F172A] border-y border-slate-800 relative overflow-hidden">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none"></div>
         <div className="container mx-auto px-4 relative z-10">
             <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16 items-stretch">
                 
                 <div className="md:w-5/12 bg-slate-900 rounded-3xl p-8 border border-slate-700 flex flex-col justify-between relative overflow-hidden group hover:border-orange-500/50 transition-all duration-300">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><Calculator className="w-32 h-32 text-white"/></div>
                    <div>
                       <div className="inline-flex items-center gap-2 text-orange-500 font-bold text-sm uppercase tracking-wider mb-4"><CheckCircle className="w-4 h-4"/> Честная цена</div>
                       <h2 className="text-3xl font-bold text-white mb-4">Стоимость изготовления</h2>
                       <p className="text-gray-400 text-sm leading-relaxed mb-8">Цена зависит от высоты букв и сложности шрифта. Мы работаем без посредников, поэтому даем лучшую цену на рынке.</p>
                    </div>
                    <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800/50">
                        <p className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">Базовая ставка</p>
                        <div className="flex items-baseline gap-2"><span className="text-white text-sm">от</span><span className="text-5xl font-black text-white">{PAGE_DATA.price}</span><span className="text-orange-500 text-xl font-bold">₸ / см</span></div>
                        <div className="h-1 w-full bg-slate-800 rounded-full mt-4 overflow-hidden"><div className="h-full w-1/3 bg-orange-500 rounded-full"></div></div>
                    </div>
                 </div>

                 <div className="md:w-7/12 bg-slate-900/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-800 flex flex-col">
                    <div className="flex items-center justify-between mb-8 border-b border-slate-700/50 pb-6">
                       <div><h3 className="text-white font-bold text-xl">Пример сметы</h3><p className="text-gray-400 text-sm">Вывеска <span className="text-white font-bold">"ЦВЕТЫ"</span></p></div>
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
                          <span className="text-white font-mono">Акрил + ПВХ</span>
                       </div>
                       <div className="flex justify-between items-center text-sm group hover:bg-slate-800/50 p-2 rounded transition">
                          <span className="text-gray-400">Подсветка</span>
                          <div className="flex-1 mx-4 border-b border-dashed border-slate-700/50 relative top-1"></div>
                          <span className="text-green-400 font-mono text-xs">Включено (IP67)</span>
                       </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-slate-700">
                       <div className="flex justify-between items-end mb-6">
                          <span className="text-gray-400 text-sm">Итоговая стоимость:</span>
                          <span className="text-3xl font-black text-white tracking-tight">90 000 ₸</span>
                       </div>
                       <Link href="/calculator" className="group block w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-center transition-all shadow-lg shadow-orange-900/20 flex items-center justify-center gap-3 active:scale-95">
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
               
               {/* Карточка 1: Цвета */}
               
               <div className="bg-[#0B1221] p-8 rounded-3xl border border-slate-800 hover:border-blue-500/30 transition flex gap-6">
                  <div className="shrink-0">
                     <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500"><Palette className="w-7 h-7"/></div>
                  </div>
                  <div>
                     <h3 className="text-xl font-bold text-white mb-3">Какие цвета лучше светятся?</h3>
                     <p className="text-sm text-gray-400 leading-relaxed mb-4">
                        Белый акрил пропускает 100% света и является самым ярким. Цветные пленки (красный, синий, зеленый) «съедают» часть яркости (до 20-30%).
                     </p>
                     <div className="p-3 bg-blue-900/20 border border-blue-500/20 rounded-xl">
                        <p className="text-xs text-blue-200 font-medium">
                           <span className="text-blue-400 font-bold">Совет:</span> Если нужна максимальная яркость — используйте цветной акрил, а не пленку (дороже на 15%, но ярче).
                        </p>
                     </div>
                  </div>
               </div>

               {/* Карточка 2: Черные буквы */}
               
               <div className="bg-[#0B1221] p-8 rounded-3xl border border-slate-800 hover:border-purple-500/30 transition flex gap-6">
                  <div className="shrink-0">
                     <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500"><Moon className="w-7 h-7"/></div>
                  </div>
                  <div>
                     <h3 className="text-xl font-bold text-white mb-3">Что насчет черных букв?</h3>
                     <p className="text-sm text-gray-400 leading-relaxed mb-4">
                        Обычный черный цвет не пропускает свет. Если у вас черный логотип, но вы хотите свечение ночью — есть решение.
                     </p>
                     <div className="p-3 bg-purple-900/20 border border-purple-500/20 rounded-xl">
                        <p className="text-xs text-purple-200 font-medium">
                           <span className="text-purple-400 font-bold">Технология «День/Ночь»:</span> Днем буквы выглядят черными (спец. акрил), а ночью при подсветке становятся белыми.
                        </p>
                     </div>
                  </div>
               </div>

            </div>
         </div>
      </section>

      {/* === БЛОК 6: FAQ (УЛУЧШЕННЫЙ) === */}
      <section className="py-24 bg-[#0B1221]">
         <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-center mb-12">
               <h2 className="text-3xl font-bold text-white mb-4">Часто задаваемые вопросы</h2>
               <p className="text-gray-400">Всё, что нужно знать перед заказом</p>
            </div>

            <div className="space-y-4">
               {FAQ_ITEMS.map((item, index) => (
                  <details key={index} className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-300 open:border-orange-500/30 open:bg-slate-900/80">
                     <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-slate-800/50 transition">
                        <div className="flex items-center gap-4">
                           <div className="p-2 bg-slate-800 rounded-lg group-open:bg-orange-500/10 transition">
                              {item.icon}
                           </div>
                           <span className="font-bold text-white text-base md:text-lg group-open:text-orange-500 transition">{item.question}</span>
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
              <p className="text-gray-400">Реализованные проекты этого типа</p>
          </div>
          <div className="container mx-auto px-4">
             {galleryImages.length > 0 ? <ImageGallery images={galleryImages} /> : <div className="text-center text-gray-500 py-12 border border-dashed border-slate-800 rounded-2xl">Фотографии скоро появятся...</div>}
             
             <div className="mt-16 flex justify-center">
                <Link href="/portfolio" className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#0B1221] border border-slate-700 rounded-full text-white font-bold hover:bg-slate-800 transition overflow-hidden">
                   <span className="relative z-10 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-blue-500"/>
                      Посмотреть все работы в Портфолио
                   </span>
                   <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition duration-500"></div>
                </Link>
             </div>
          </div>
      </section>

     {/* === БЛОК 8: СМОТРИТЕ ТАКЖЕ (REDESIGNED) === */}
      <section className="py-24 bg-[#0F172A] border-t border-slate-800 relative">
         {/* Фоновый декоративный элемент */}
         <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none"></div>

         <div className="container mx-auto px-4 relative z-10">
             <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                <div>
                   <h2 className="text-3xl font-bold text-white mb-2">Другие варианты букв</h2>
                   <p className="text-gray-400 text-sm">Подберите идеальную технологию под ваш бюджет и задачи</p>
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
                      {/* Карточка-контейнер */}
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 transition-all duration-300 group-hover:border-slate-600 group-hover:shadow-[0_0_30px_-10px_rgba(255,255,255,0.1)] h-full flex flex-col">
                         
                         {/* Изображение */}
                         <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black mb-4">
                             <Image 
                                src={type.images.night} 
                                alt={type.title} 
                                fill 
                                sizes="(max-width: 768px) 100vw, 25vw"
                                className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                             />
                             {/* Бейдж цены поверх фото */}
                             <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur border border-slate-700 px-3 py-1.5 rounded-lg">
                                <span className="text-orange-500 font-bold text-xs">{type.price}</span>
                             </div>
                         </div>

                         {/* Контент */}
                         <div className="px-2 pb-2 flex flex-col flex-1">
                             <div className="flex items-start justify-between gap-4">
                                <h4 className="text-white font-bold text-lg leading-snug group-hover:text-blue-400 transition-colors line-clamp-2">
                                   {type.title}
                                </h4>
                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shrink-0 group-hover:rotate-[-45deg]">
                                   <ArrowRight className="w-4 h-4"/>
                                </div>
                             </div>
                             
                             {/* Декоративная линия */}
                             <div className="mt-auto pt-4">
                                <div className="w-full h-0.5 bg-slate-800 group-hover:bg-slate-700 transition-colors relative overflow-hidden rounded-full">
                                   <div className="absolute top-0 left-0 h-full w-0 bg-blue-500 group-hover:w-full transition-all duration-700 ease-out"></div>
                                </div>
                             </div>
                         </div>
                      </div>
                   </Link>
                ))}
             </div>

             {/* Мобильная кнопка "Смотреть все" (внизу) */}
             <div className="mt-8 md:hidden text-center">
                <Link href="/services/volume-letters" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition bg-slate-900 border border-slate-800 px-6 py-3 rounded-xl">
                   Перейти в каталог <ArrowRight className="w-4 h-4"/>
                </Link>
             </div>
         </div>
      </section>

      <ReviewsCarousel />
      <CallToAction source={`Услуга: ${PAGE_DATA.title}`} />

    </div>
  );
}

function Lightbulb(props: any) {
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
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  )
}