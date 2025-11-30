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
  ChevronDown,
  Store,        
  Building,     
  ShoppingBag,  
  Briefcase,
  Gem,             // Для "Премиум"
  Maximize,        // Для "360 обзор"
  Droplets,        // Для "Влагозащита/Мойка"
  ArrowRight,
  Sun,
  Palette
} from "lucide-react";

// --- ИМПОРТ КЛИЕНТСКИХ КОМПОНЕНТОВ ---
import CallToAction from "@/components/CallToAction";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import ImageGallery from "@/components/ImageGallery";
import HeroSlideshow from "@/components/HeroSlideshow";

// --- СЕРВЕРНАЯ УТИЛИТА (Сбор фото) ---
import { getImagesFromFolder } from "@/lib/serverUtils";

// --- ДАННЫЕ КАТАЛОГА ---
import { volumeLettersCatalog } from "@/lib/volumeLettersData";

// --- ДАННЫЕ ТЕКУЩЕЙ СТРАНИЦЫ ---
const PAGE_DATA = {
  slug: "full-lit", // Папка в public/images/letters-galery/
  title: "Объемные буквы с полным свечением",
  subtitle: "Технология Full Glow. Светится и лицо, и борта. Максимальная заметность 360° и эффект «световой капсулы».",
  price: "650" 
};

export const metadata = {
  title: "Световые буквы (Full Lit) | Полное свечение в Астане",
  description: "Изготовление букв со светящимися бортами. Цельноклееный акрил, эффект леденца. Премиальная вывеска под ключ.",
};

// --- FAQ ДАННЫЕ ---
const FAQ_ITEMS = [
  {
    question: "Насколько они хрупкие?",
    answer: "Корпус полностью состоит из акрила, поэтому они требуют бережной транспортировки. Однако после монтажа они выдерживают ветровые нагрузки и перепады температур так же хорошо, как и стандартные вывески.",
    icon: <Shield className="w-5 h-5 text-purple-500"/>
  },
  {
    question: "Можно ли регулировать яркость?",
    answer: "Да, и мы это рекомендуем! Буквы Full Lit светят очень ярко (во все стороны). Для интерьера или вечернего времени мы часто устанавливаем диммер, чтобы вывеска не слепила глаза.",
    icon: <Sun className="w-5 h-5 text-yellow-500"/>
  },
  {
    question: "Как часто их нужно мыть?",
    answer: "Чаще, чем обычные. Так как борт светится, пыль и потеки на нем заметны сильнее (как пятна на экране телефона). Мы рекомендуем мойку 2 раза в год.",
    icon: <Droplets className="w-5 h-5 text-blue-500"/>
  }
];

// --- ОСНОВНОЙ КОМПОНЕНТ (SERVER SIDE) ---
export default async function FullLitLettersPage() {
  
  // 1. ПОЛУЧАЕМ ФОТО
  const galleryImages = getImagesFromFolder(PAGE_DATA.slug);

  // 2. ФОТО ДЛЯ HERO
  const heroImages = [...galleryImages].sort(() => 0.5 - Math.random()).slice(0, 15);
  // Фоллбэк, если папка пуста
  const displayHeroImages = heroImages.length > 0 
    ? heroImages 
    : ["/images/letters/full-lit-night.png", "/images/letters/full-lit-day.png"];

  // 3. "ДРУГИЕ ВИДЫ" (Фильтруем текущий)
  const otherTypes = volumeLettersCatalog.filter(item => item.slug !== PAGE_DATA.slug);

  return (
    <div className="min-h-screen bg-[#0F172A] font-sans selection:bg-purple-500/30">
      
      {/* === 1. HERO SECTION === */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F172A]/80 to-[#0F172A]"></div>
        {/* Фиолетовое пятно для атмосферы */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none"></div>

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
                 <div className="inline-block px-4 py-1.5 mb-6 text-xs font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 rounded-full uppercase tracking-wider">
                    Premium Segment
                 </div>
                 <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    {PAGE_DATA.title}
                 </h1>
                 <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                    {PAGE_DATA.subtitle}
                 </p>
                 
                 <ul className="space-y-3 mb-10">
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-purple-500"/> Корпус на 100% из акрила (Plexiglas)
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-purple-500"/> Обзор 360 градусов (светится всё)
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-purple-500"/> Эффект «парящей капсулы»
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

              {/* Визуал: СЛАЙДЕР */}
              <div className="relative aspect-square rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden group shadow-2xl shadow-purple-900/20">
                 <HeroSlideshow images={displayHeroImages} />
                 
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none"></div>
                 <div className="absolute bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur border border-slate-700 p-4 rounded-xl flex items-center gap-4 pointer-events-none z-20">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-500"><Gem className="w-6 h-6"/></div>
                    <div><div className="text-white font-bold">Эффект леденца</div><div className="text-gray-400 text-xs">Бесшовная склейка</div></div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* === БЛОК 2: CONCEPT (UPGRADED) === */}
      <section className="py-20 lg:py-32 bg-[#020617] relative overflow-hidden">
         {/* Фоновый эффект свечения */}
         <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen"></div>
            <div className="absolute bottom-[10%] left-[10%] w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] mix-blend-screen"></div>
         </div>

         <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
               
               {/* Левая колонка */}
               <div className="lg:w-5/12 lg:sticky lg:top-32">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold mb-6 text-xs uppercase tracking-widest shadow-[0_0_20px_-5px_rgba(168,85,247,0.3)]">
                     <Gem className="w-3.5 h-3.5"/> Full Glow Technology
                  </div>
                  
                  <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                     Идеальная <br/>
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-white">световая форма.</span>
                  </h2>
                  
                  <p className="text-slate-400 text-lg leading-relaxed mb-10 border-l-2 border-purple-900 pl-6">
                     Мы убираем непрозрачные материалы. Буква изготавливается целиком из светорассеивающего акрила. Свет струится отовсюду, создавая эффект дорогого ювелирного изделия.
                  </p>

                  <div className="grid gap-4">
                     {/* Tech Card 1 */}
                     <div className="group p-5 bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800 hover:border-purple-500/30 transition-all duration-300">
                        <div className="flex items-start gap-4">
                           <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-500 shrink-0 group-hover:scale-110 transition-transform duration-300">
                              <Maximize className="w-5 h-5"/>
                           </div>
                           <div className="flex-1">
                              <h4 className="text-white font-bold text-base mb-1">Обзор 360 градусов</h4>
                              <p className="text-slate-500 text-sm mb-3">Ваш бренд заметен не только анфас, но и для тех, кто идет вдоль здания.</p>
                              {/* Fake Progress Bar */}
                              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                                 <span>Угол обзора</span>
                                 <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="w-[100%] h-full bg-purple-500 rounded-full"></div>
                                 </div>
                                 <span className="text-purple-500">MAX</span>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Tech Card 2 */}
                     <div className="group p-5 bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800 hover:border-blue-500/30 transition-all duration-300">
                        <div className="flex items-start gap-4">
                           <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 shrink-0 group-hover:scale-110 transition-transform duration-300">
                              <Droplets className="w-5 h-5"/>
                           </div>
                           <div className="flex-1">
                              <h4 className="text-white font-bold text-base mb-1">Герметичная капсула</h4>
                              <p className="text-slate-500 text-sm mb-3">Отсутствие щелей и стыков. Пыль и влага не попадают внутрь буквы.</p>
                              {/* Fake Progress Bar */}
                              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                                 <span>Защита IP</span>
                                 <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="w-[95%] h-full bg-blue-500 rounded-full"></div>
                                 </div>
                                 <span className="text-blue-500">67</span>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Правая колонка: Визуал */}
               <div className="w-full lg:w-7/12">
                  <div className="flex overflow-x-auto pb-8 -mx-4 px-4 lg:grid lg:grid-cols-2 lg:gap-5 lg:overflow-visible lg:pb-0 lg:px-0 hide-scrollbar snap-x snap-mandatory">
                      
                      {/* Большая карточка: БУТИКИ */}
                      <div className="min-w-[85vw] sm:min-w-[300px] lg:min-w-0 lg:col-span-2 relative h-[280px] lg:h-[360px] rounded-3xl overflow-hidden group border border-slate-800 hover:border-purple-500/50 transition-colors duration-500 snap-center bg-slate-900 shadow-2xl">
                         <Image src="/images/letters-galery/full-lit/5.jpg" alt="Интерьерные вывески" fill className="object-cover transition duration-700 group-hover:scale-105 group-hover:brightness-110"/>
                         <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500"></div>
                         
                         <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                            <div className="flex items-center gap-3 mb-3">
                               <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-600 text-white text-[10px] uppercase font-bold tracking-wider rounded-md shadow-lg shadow-purple-900/50">
                                  <ShoppingBag className="w-3 h-3"/> Boutique
                               </span>
                            </div>
                            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2 group-hover:text-purple-200 transition-colors">Интерьер бутиков</h3>
                            <p className="text-slate-400 text-sm max-w-md line-clamp-2 group-hover:text-slate-300 transition-colors">
                               Выбор №1 для торговых центров. Мягкий, рассеянный свет привлекает внимание, но не раздражает глаз.
                            </p>
                         </div>
                      </div>

                      {/* Малая карточка: КРЕАТИВ */}
                      <div className="min-w-[70vw] sm:min-w-[250px] lg:min-w-0 relative h-[240px] lg:h-[260px] rounded-3xl overflow-hidden group border border-slate-800 hover:border-blue-500/50 transition-colors duration-500 snap-center bg-slate-900 shadow-xl">
                         <Image src="/images/letters-galery/full-lit/3.jpg" alt="Креативные вывески" fill className="object-cover transition duration-700 group-hover:scale-105 group-hover:brightness-110"/>
                         <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-90"></div>
                         <div className="absolute bottom-0 left-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-600 text-white text-[10px] uppercase font-bold tracking-wider rounded-md mb-3 shadow-lg shadow-blue-900/50">
                               <Gem className="w-3 h-3"/> Design
                            </span>
                            <h3 className="text-xl font-bold text-white group-hover:text-blue-200 transition-colors">Логотипы</h3>
                         </div>
                      </div>

                      {/* Малая карточка: ОФИСЫ */}
                      <div className="min-w-[70vw] sm:min-w-[250px] lg:min-w-0 relative h-[240px] lg:h-[260px] rounded-3xl overflow-hidden group border border-slate-800 hover:border-green-500/50 transition-colors duration-500 snap-center bg-slate-900 shadow-xl">
                         <Image src="/kmg.jpeg" alt="Офисные вывески" fill className="object-cover transition duration-700 group-hover:scale-105 group-hover:brightness-110"/>
                         <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-90"></div>
                         <div className="absolute bottom-0 left-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-600 text-white text-[10px] uppercase font-bold tracking-wider rounded-md mb-3 shadow-lg shadow-green-900/50">
                               <Briefcase className="w-3 h-3"/> Office
                            </span>
                            <h3 className="text-xl font-bold text-white group-hover:text-green-200 transition-colors">Ресепшн зоны</h3>
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
               <span className="text-purple-500 font-bold text-sm uppercase tracking-widest mb-2 block">Без ПВХ и Металла</span>
               <h2 className="text-3xl md:text-5xl font-black text-white">Анатомия качества</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <div className="group relative bg-slate-900/80 backdrop-blur-sm p-8 rounded-[2rem] border border-slate-800 hover:border-purple-500/50 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.2)] flex flex-col">
                  <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 text-purple-500 group-hover:scale-110 transition-all duration-300"><Layers className="w-8 h-8"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">Лицевая панель</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">Акрил Plexiglas (Германия) 3–4 мм. Идеальное рассеивание без пятен.</p>
               </div>
               <div className="group relative bg-slate-900/80 backdrop-blur-sm p-8 rounded-[2rem] border border-slate-800 hover:border-blue-500/50 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.2)] flex flex-col">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-500 group-hover:scale-110 transition-all duration-300"><Gem className="w-8 h-8"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">Световой борт</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">Акрил 2-3 мм, изогнутый термометодом. Клеится к лицу химической сваркой.</p>
               </div>
               <div className="group relative bg-slate-900/80 backdrop-blur-sm p-8 rounded-[2rem] border border-slate-800 hover:border-orange-500/50 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(249,115,22,0.2)] flex flex-col">
                  <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6 text-orange-500 group-hover:scale-110 transition-all duration-300"><Zap className="w-8 h-8"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">Линзы 170°</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">Используем специальные линзы с широким углом, чтобы просветить борта.</p>
               </div>
               <div className="group relative bg-slate-900/80 backdrop-blur-sm p-8 rounded-[2rem] border border-slate-800 hover:border-green-500/50 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(34,197,94,0.2)] flex flex-col">
                  <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 text-green-500 group-hover:scale-110 transition-all duration-300"><Shield className="w-8 h-8"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">Задняя стенка</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">Утолщенный ПВХ 8 мм для жесткости, так как акриловый корпус хрупок.</p>
               </div>
            </div>
         </div>
      </section>

      {/* === БЛОК 4: ЦЕНА === */}
      <section className="py-24 bg-[#0F172A] border-y border-slate-800 relative overflow-hidden">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none"></div>
         <div className="container mx-auto px-4 relative z-10">
             <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16 items-stretch">
                 
                 <div className="md:w-5/12 bg-slate-900 rounded-3xl p-8 border border-slate-700 flex flex-col justify-between relative overflow-hidden group hover:border-purple-500/50 transition-all duration-300">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><Calculator className="w-32 h-32 text-white"/></div>
                    <div>
                       <div className="inline-flex items-center gap-2 text-purple-500 font-bold text-sm uppercase tracking-wider mb-4"><CheckCircle className="w-4 h-4"/> Ручная работа</div>
                       <h2 className="text-3xl font-bold text-white mb-4">Стоимость изготовления</h2>
                       <p className="text-gray-400 text-sm leading-relaxed mb-8">
                          Сложнейшая технология сборки. Каждая буква склеивается вручную мастером. Это дороже, но результат того стоит.
                       </p>
                    </div>
                    <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800/50">
                        <p className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">Базовая ставка</p>
                        <div className="flex items-baseline gap-2"><span className="text-white text-sm">от</span><span className="text-5xl font-black text-white">{PAGE_DATA.price}</span><span className="text-purple-500 text-xl font-bold">₸ / см</span></div>
                        <div className="h-1 w-full bg-slate-800 rounded-full mt-4 overflow-hidden"><div className="h-full w-2/3 bg-purple-500 rounded-full"></div></div>
                    </div>
                 </div>

                 <div className="md:w-7/12 bg-slate-900/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-800 flex flex-col">
                    <div className="flex items-center justify-between mb-8 border-b border-slate-700/50 pb-6">
                       <div><h3 className="text-white font-bold text-xl">Пример сметы</h3><p className="text-gray-400 text-sm">Вывеска <span className="text-white font-bold">"SALON"</span></p></div>
                       <div className="px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 text-white font-mono text-sm">5 букв</div>
                    </div>
                    <div className="space-y-4 flex-1">
                       <div className="flex justify-between items-center text-sm group hover:bg-slate-800/50 p-2 rounded transition">
                          <span className="text-gray-400">Высота букв</span>
                          <div className="flex-1 mx-4 border-b border-dashed border-slate-700/50 relative top-1"></div>
                          <span className="text-white font-mono">40 см</span>
                       </div>
                       <div className="flex justify-between items-center text-sm group hover:bg-slate-800/50 p-2 rounded transition">
                          <span className="text-gray-400">Материал</span>
                          <div className="flex-1 mx-4 border-b border-dashed border-slate-700/50 relative top-1"></div>
                          <span className="text-white font-mono">Акрил 100%</span>
                       </div>
                       <div className="flex justify-between items-center text-sm group hover:bg-slate-800/50 p-2 rounded transition">
                          <span className="text-gray-400">Подсветка</span>
                          <div className="flex-1 mx-4 border-b border-dashed border-slate-700/50 relative top-1"></div>
                          <span className="text-green-400 font-mono text-xs">Full Glow (360°)</span>
                       </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-slate-700">
                       <div className="flex justify-between items-end mb-6">
                          <span className="text-gray-400 text-sm">Итоговая стоимость:</span>
                          <span className="text-3xl font-black text-white tracking-tight">130 000 ₸</span>
                       </div>
                       <Link href="/calculator" className="group block w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-center transition-all shadow-lg shadow-purple-900/20 flex items-center justify-center gap-3 active:scale-95">
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
               
               {/* Карточка 1: Мойка */}
               <div className="bg-[#0B1221] p-8 rounded-3xl border border-slate-800 hover:border-blue-500/30 transition flex gap-6">
                  <div className="shrink-0">
                     <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500"><Droplets className="w-7 h-7"/></div>
                  </div>
                  <div>
                     <h3 className="text-xl font-bold text-white mb-3">Особенность эксплуатации</h3>
                     <p className="text-sm text-gray-400 leading-relaxed mb-4">
                        Поскольку бока буквы светятся, любая грязь или подтеки после дождя на них очень заметны (как на экране смартфона).
                     </p>
                     <div className="p-3 bg-blue-900/20 border border-blue-500/20 rounded-xl">
                        <p className="text-xs text-blue-200 font-medium">
                           <span className="text-blue-400 font-bold">Совет:</span> Рекомендуем для интерьеров ТРЦ. На улице потребуется мойка 2-3 раза в год.
                        </p>
                     </div>
                  </div>
               </div>

               {/* Карточка 2: Диммирование (ИСПРАВЛЕНО: удален лишний текст) */}
               <div className="bg-[#0B1221] p-8 rounded-3xl border border-slate-800 hover:border-yellow-500/30 transition flex gap-6">
                  <div className="shrink-0">
                     <div className="w-14 h-14 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-500"><Sun className="w-7 h-7"/></div>
                  </div>
                  <div>
                     <h3 className="text-xl font-bold text-white mb-3">Слишком ярко?</h3>
                     <p className="text-sm text-gray-400 leading-relaxed mb-4">
                        Буквы Full Lit выдают в 2 раза больше света, чем обычные. В маленьком помещении это может слепить.
                     </p>
                     <div className="p-3 bg-yellow-900/20 border border-yellow-500/20 rounded-xl">
                        <p className="text-xs text-yellow-200 font-medium">
                           <span className="text-yellow-400 font-bold">Решение:</span> Мы всегда предлагаем установить диммер (регулятор яркости) для комфорта глаз.
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
               <h2 className="text-3xl font-bold text-white mb-4">Вопросы о Full Lit</h2>
            </div>

            <div className="space-y-4">
               {FAQ_ITEMS.map((item, index) => (
                  <details key={index} className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-300 open:border-purple-500/30 open:bg-slate-900/80">
                     <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-slate-800/50 transition">
                        <div className="flex items-center gap-4">
                           <div className="p-2 bg-slate-800 rounded-lg group-open:bg-purple-500/10 transition">
                              {item.icon}
                           </div>
                           <span className="font-bold text-white text-base md:text-lg group-open:text-purple-500 transition">{item.question}</span>
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
              <p className="text-gray-400">Галерея проектов с полным свечением</p>
          </div>
          <div className="container mx-auto px-4">
             {galleryImages.length > 0 ? <ImageGallery images={galleryImages} /> : <div className="text-center text-gray-500 py-12 border border-dashed border-slate-800 rounded-2xl">Загрузите фото в папку public/images/letters-galery/full-lit</div>}
             
             <div className="mt-16 flex justify-center">
                <Link href="/portfolio" className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#0B1221] border border-slate-700 rounded-full text-white font-bold hover:bg-slate-800 transition overflow-hidden">
                   <span className="relative z-10 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-purple-500"/>
                      Посмотреть все работы в Портфолио
                   </span>
                   <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition duration-500"></div>
                </Link>
             </div>
          </div>
      </section>

      {/* === БЛОК 8: СМОТРИТЕ ТАКЖЕ (REDESIGNED) === */}
      <section className="py-24 bg-[#0F172A] border-t border-slate-800 relative">
         <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/5 blur-[100px] rounded-full pointer-events-none"></div>

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
                                <h4 className="text-white font-bold text-lg leading-snug group-hover:text-purple-400 transition-colors line-clamp-2">
                                   {type.title}
                                </h4>
                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 shrink-0 group-hover:rotate-[-45deg]">
                                   <ArrowRight className="w-4 h-4"/>
                                </div>
                             </div>
                             <div className="mt-auto pt-4">
                                <div className="w-full h-0.5 bg-slate-800 group-hover:bg-slate-700 transition-colors relative overflow-hidden rounded-full">
                                   <div className="absolute top-0 left-0 h-full w-0 bg-purple-500 group-hover:w-full transition-all duration-700 ease-out"></div>
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