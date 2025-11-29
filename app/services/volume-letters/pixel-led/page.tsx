import Link from "next/link";
import Image from "next/image";
import { 
  Calculator, 
  CheckCircle, 
  ChevronRight, 
  MessageCircle,
  Grid3X3,        // Пиксели
  Zap,            // Энергия
  Cpu,            // Контроллер
  Smartphone,     // Управление
  Settings,       
  Lightbulb,
  Shield,
  Layers,
  Activity,       // Ритм
  ArrowRight,
  ChevronDown,
  Briefcase,
  MousePointerClick
} from "lucide-react";

// --- ИМПОРТ КЛИЕНТСКИХ КОМПОНЕНТОВ ---
import CallToAction from "@/components/CallToAction";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import ImageGallery from "@/components/ImageGallery";
import HeroSlideshow from "@/components/HeroSlideshow";

// --- СЕРВЕРНАЯ УТИЛИТА ---
import { getImagesFromFolder } from "@/lib/serverUtils";

// --- ДАННЫЕ КАТАЛОГА ---
import { volumeLettersCatalog } from "@/lib/volumeLettersData";

// --- ДАННЫЕ ТЕКУЩЕЙ СТРАНИЦЫ ---
const PAGE_DATA = {
  slug: "pixel-led", 
  title: "Пиксельные буквы (Smart LED)",
  subtitle: "Рекордная яркость и динамические спецэффекты. Открытые диоды, которые работают как магнит для глаз.",
  price: "800" 
};

export const metadata = {
  title: "Пиксельные буквы (Smart LED) | Живая реклама Астана",
  description: "Изготовление вывесок с открытыми светодиодами. Программируемая динамика, RGB эффекты, контроллеры. Самые яркие буквы.",
};

// --- FAQ ДАННЫЕ ---
const FAQ_ITEMS = [
  {
    question: "Как управлять цветом?",
    answer: "Мы устанавливаем специальный контроллер. Простые модели управляются с пульта (как гирлянда), продвинутые — через приложение на телефоне или ПК. Вы можете менять программы мигания хоть каждый день.",
    icon: <Smartphone className="w-5 h-5 text-green-500"/>
  },
  {
    question: "Не перегорят ли они от дождя?",
    answer: "Нет. Мы используем пиксельные модули с классом защиты IP67. Каждый диод залит силиконом, а контакты герметичны. Они созданы специально для уличной эксплуатации.",
    icon: <Shield className="w-5 h-5 text-blue-500"/>
  },
  {
    question: "Как это выглядит вблизи?",
    answer: "Это важно: пиксельные буквы предназначены для просмотра с расстояния (минимум 3-5 метров). Вблизи видны отдельные лампочки и отверстия. Для интерьера на уровне глаз лучше выбрать Жидкий акрил или Full Lit.",
    icon: <Grid3X3 className="w-5 h-5 text-yellow-500"/>
  }
];

// --- ОСНОВНОЙ КОМПОНЕНТ (SERVER SIDE) ---
export default async function PixelLedPage() {
  
  // 1. ПОЛУЧАЕМ ФОТО
  const galleryImages = getImagesFromFolder(PAGE_DATA.slug);

  // 2. ФОТО ДЛЯ HERO
  const heroImages = [...galleryImages].sort(() => 0.5 - Math.random()).slice(0, 15);
  const displayHeroImages = heroImages.length > 0 
    ? heroImages 
    : ["/images/letters/pixel-led-night.png", "/images/letters/pixel-led-day.png"];

  // 3. "ДРУГИЕ ВИДЫ"
  const otherTypes = volumeLettersCatalog.filter(item => item.slug !== PAGE_DATA.slug);

  return (
    <div className="min-h-screen bg-[#0F172A] font-sans selection:bg-green-500/30">
      
      {/* === 1. HERO SECTION === */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff10_1px,transparent_1px)] [background-size:20px_20px] opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F172A]/90 to-[#0F172A]"></div>
        {/* Зеленое RGB свечение */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-500/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
           {/* Навигация */}
           <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 mb-8">
              <Link href="/" className="hover:text-white transition">Главная</Link>
              <ChevronRight className="w-3 h-3"/>
              <Link href="/services/volume-letters" className="hover:text-white transition">Объемные буквы</Link>
              <ChevronRight className="w-3 h-3"/>
              <span className="text-green-500 font-medium">Открытые пиксели</span>
           </div>

           <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Текст */}
              <div>
                 <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/20 rounded-full uppercase tracking-wider">
                    <Zap className="w-4 h-4"/> Самые яркие
                 </div>
                 <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    {PAGE_DATA.title}
                 </h1>
                 <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                    {PAGE_DATA.subtitle}
                 </p>
                 
                 <ul className="space-y-3 mb-10">
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-green-500"/> Яркость x3 (нет преграды в виде акрила)
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-green-500"/> Программируемая анимация (RGB)
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-green-500"/> Экономия на замене пластика
                    </li>
                 </ul>

                 <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/calculator" className="flex items-center justify-center gap-2 bg-green-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-700 transition shadow-lg shadow-green-900/20 active:scale-95">
                       <Calculator className="w-5 h-5"/> Рассчитать динамику
                    </Link>
                    <a href="https://wa.me/77071356701" target="_blank" className="flex items-center justify-center gap-2 border border-slate-700 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition">
                       <MessageCircle className="w-5 h-5 text-green-500"/> WhatsApp
                    </a>
                 </div>
              </div>

              {/* Визуал: СЛАЙДЕР */}
              <div className="relative aspect-square rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden group shadow-2xl shadow-green-900/10">
                 <HeroSlideshow images={displayHeroImages} />
                 
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none"></div>
                 <div className="absolute bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur border border-slate-700 p-4 rounded-xl flex items-center gap-4 pointer-events-none z-20">
                    <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center text-green-500"><Activity className="w-6 h-6"/></div>
                    <div><div className="text-white font-bold">Живая вывеска</div><div className="text-gray-400 text-xs">RGB Контроллер</div></div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* === БЛОК 2: CONCEPT (ТЕХНОЛОГИЯ) === */}
      <section className="py-20 lg:py-32 bg-[#020617] relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-green-600/10 rounded-full blur-[120px] mix-blend-screen"></div>
         </div>

         <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center mb-16">
               <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 text-green-500 mb-6">
                  <Grid3X3 className="w-8 h-8"/>
               </div>
               <h2 className="text-3xl font-bold text-white mb-6">Нет стекла — нет потерь</h2>
               <p className="text-gray-400 text-lg leading-relaxed mb-8">
                  В классических буквах диоды спрятаны за матовым акрилом, который «съедает» до 30% света. В пиксельных буквах мы убираем эту преграду. Светодиоды монтируются прямо в лицевую панель.
               </p>
               <div className="bg-slate-900/50 p-6 rounded-2xl border border-green-500/20 inline-block">
                  <p className="text-green-400 font-bold text-xl">Результат: Вывеску видно за 500 метров</p>
               </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto">
               
               {/* STATIC MODE */}
               <div className="bg-[#0B1120] p-8 rounded-3xl border border-slate-800 group hover:border-slate-600 transition">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                     <Lightbulb className="w-5 h-5 text-yellow-500"/> Монохром (Статика)
                  </h3>
                  <div className="h-40 bg-slate-900 rounded-xl mb-4 flex items-center justify-center border border-slate-800">
                     <div className="flex gap-2">
                        {[1,2,3,4].map(i => <div key={i} className="w-4 h-4 rounded-full bg-white shadow-[0_0_15px_white]"></div>)}
                     </div>
                  </div>
                  <p className="text-sm text-gray-400">
                     Используются одноцветные диоды (Белый, Красный, Желтый). Светят постоянно. Самый бюджетный и надежный вариант.
                  </p>
               </div>

               {/* DYNAMIC MODE */}
               <div className="bg-[#0B1120] p-8 rounded-3xl border border-slate-800 group hover:border-green-500 transition relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-green-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition duration-500"></div>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                     <Cpu className="w-5 h-5 text-green-500"/> Smart RGB (Динамика)
                  </h3>
                  <div className="h-40 bg-slate-900 rounded-xl mb-4 flex items-center justify-center border border-slate-800">
                     <div className="flex gap-2">
                        <div className="w-4 h-4 rounded-full bg-red-500 shadow-[0_0_15px_red] animate-pulse"></div>
                        <div className="w-4 h-4 rounded-full bg-green-500 shadow-[0_0_15px_green] animate-pulse delay-75"></div>
                        <div className="w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_15px_blue] animate-pulse delay-150"></div>
                        <div className="w-4 h-4 rounded-full bg-yellow-500 shadow-[0_0_15px_yellow] animate-pulse delay-200"></div>
                     </div>
                  </div>
                  <p className="text-sm text-gray-400">
                     Умные пиксели + Контроллер. Позволяют запускать "волну", "стробоскоп", смену цветов. Управляются с пульта.
                  </p>
               </div>

            </div>
         </div>
      </section>

      {/* === БЛОК 3: ANATOMY === */}
      <section className="py-24 bg-[#0B1221] relative overflow-hidden">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]"></div>
         
         <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
               <span className="text-green-500 font-bold text-sm uppercase tracking-widest mb-2 block">Как это устроено</span>
               <h2 className="text-3xl md:text-5xl font-black text-white">Анатомия пикселя</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <div className="group relative bg-slate-900/80 backdrop-blur-sm p-8 rounded-[2rem] border border-slate-800 hover:border-green-500/50 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(34,197,94,0.2)] flex flex-col">
                  <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 text-green-500 group-hover:scale-110 transition-all duration-300"><Layers className="w-8 h-8"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">Лицо: Композит</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">Алюминиевый композит или ПВХ. В нем на ЧПУ сверлятся отверстия под каждый диод.</p>
               </div>
               <div className="group relative bg-slate-900/80 backdrop-blur-sm p-8 rounded-[2rem] border border-slate-800 hover:border-blue-500/50 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.2)] flex flex-col">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-500 group-hover:scale-110 transition-all duration-300"><Lightbulb className="w-8 h-8"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">Пиксель 9мм</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">Герметичная "лампочка" с силиконовым уплотнителем. Вставляется в отверстие с натягом.</p>
               </div>
               <div className="group relative bg-slate-900/80 backdrop-blur-sm p-8 rounded-[2rem] border border-slate-800 hover:border-purple-500/50 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.2)] flex flex-col">
                  <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 text-purple-500 group-hover:scale-110 transition-all duration-300"><Cpu className="w-8 h-8"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">Контроллер</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">Мозг вывески. Хранит программы анимации. Прячется внутри буквы или в помещении.</p>
               </div>
               <div className="group relative bg-slate-900/80 backdrop-blur-sm p-8 rounded-[2rem] border border-slate-800 hover:border-orange-500/50 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(249,115,22,0.2)] flex flex-col">
                  <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6 text-orange-500 group-hover:scale-110 transition-all duration-300"><Grid3X3 className="w-8 h-8"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">Шаг установки</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">Шаг (расстояние) между диодами влияет на цену. Обычно 20-30 мм.</p>
               </div>
            </div>
         </div>
      </section>

      {/* === [NEW] БЛОК 5: PRO TIPS === */}
      <section className="py-20 bg-slate-950 border-b border-slate-800">
         <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
               
               {/* Карточка 1: ДИСТАНЦИЯ */}
               <div className="bg-[#0B1221] p-8 rounded-3xl border border-slate-800 hover:border-yellow-500/30 transition flex gap-6">
                  <div className="shrink-0">
                     <div className="w-14 h-14 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-500"><MousePointerClick className="w-7 h-7"/></div>
                  </div>
                  <div>
                     <h3 className="text-xl font-bold text-white mb-3">Важно: Расстояние</h3>
                     <p className="text-sm text-gray-400 leading-relaxed mb-4">
                        Вблизи (ближе 3 метров) пиксели выглядят как отдельные яркие точки. Картинка "собирается" только на расстоянии.
                     </p>
                     <div className="p-3 bg-yellow-900/20 border border-yellow-500/20 rounded-xl">
                        <p className="text-xs text-yellow-200 font-medium">
                           <span className="text-yellow-400 font-bold">Совет:</span> Не используйте для интерьера или узких улиц. Идеально для крыш и фасадов 2+ этажа.
                        </p>
                     </div>
                  </div>
               </div>

               {/* Карточка 2: РЕМОНТ */}
               <div className="bg-[#0B1221] p-8 rounded-3xl border border-slate-800 hover:border-green-500/30 transition flex gap-6">
                  <div className="shrink-0">
                     <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500"><Settings className="w-7 h-7"/></div>
                  </div>
                  <div>
                     <h3 className="text-xl font-bold text-white mb-3">Легкий ремонт</h3>
                     <p className="text-sm text-gray-400 leading-relaxed mb-4">
                        В отличие от закрытых букв, здесь диод можно заменить снаружи, просто вытащив его из гнезда.
                     </p>
                     <div className="p-3 bg-green-900/20 border border-green-500/20 rounded-xl">
                        <p className="text-xs text-green-200 font-medium">
                           <span className="text-green-400 font-bold">Плюс:</span> Дешевле в обслуживании. Не нужно разбирать всю букву.
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
               <h2 className="text-3xl font-bold text-white mb-4">Частые вопросы</h2>
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
              <h2 className="text-3xl font-bold text-white mb-4">Примеры работ</h2>
              <p className="text-gray-400">Яркость, которую видно из космоса</p>
          </div>
          <div className="container mx-auto px-4">
             {galleryImages.length > 0 ? <ImageGallery images={galleryImages} /> : <div className="text-center text-gray-500 py-12 border border-dashed border-slate-800 rounded-2xl">Загрузите фото в папку public/images/letters-galery/pixel-led</div>}
             
             <div className="mt-16 flex justify-center">
                <Link href="/portfolio" className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#0B1221] border border-slate-700 rounded-full text-white font-bold hover:bg-slate-800 transition overflow-hidden">
                   <span className="relative z-10 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-green-500"/>
                      Посмотреть все работы в Портфолио
                   </span>
                   <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition duration-500"></div>
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