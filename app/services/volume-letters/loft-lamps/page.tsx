import Link from "next/link";
import Image from "next/image";
import { 
  Calculator, 
  CheckCircle, 
  ChevronRight, 
  MessageCircle,
  Lightbulb,      // Лампа
  Flame,          // Тепло/Ржавчина
  Trees,          // Дерево
  Zap,            
  Sliders,        // Диммер
  Umbrella,       // Влагозащита
  ArrowRight,
  ChevronDown,
  Briefcase,
  Coffee,         // Для кофеен
  Music,          // Для баров
  Settings
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
  slug: "loft-lamps", 
  title: "Ретро-буквы с лампами",
  subtitle: "Стиль Loft & Vintage. Атмосфера Бродвея 50-х годов в вашем интерьере. Вывески, которые создают настроение.",
  price: "1 200" 
};

export const metadata = {
  title: "Ретро буквы с лампами (Loft) | Marquee Letters Астана",
  description: "Изготовление букв в стиле лофт с открытыми лампами. Корпус из металла, дерева или с эффектом ржавчины. Диммируемые вывески.",
};

// --- FAQ ДАННЫЕ ---
const FAQ_ITEMS = [
  {
    question: "Какие лампы вы ставите?",
    answer: "Мы используем современные филаментные LED-лампы (цоколь E14 или E27). Они выглядят как старые лампы Эдисона (видна красивая спираль), но потребляют в 10 раз меньше энергии и не нагреваются.",
    icon: <Lightbulb className="w-5 h-5 text-yellow-500"/>
  },
  {
    question: "Можно ли ставить на улицу?",
    answer: "Да, но с нюансами. Для улицы мы используем специальные герметичные патроны с резиновой 'юбкой', которая плотно облегает лампу и не дает воде попасть внутрь. Корпус из металла покрывается порошковой краской или лаком.",
    icon: <Umbrella className="w-5 h-5 text-blue-500"/>
  },
  {
    question: "Сильно ли они яркие?",
    answer: "Очень. 10-15 ламп в одной букве могут ослепить. Поэтому мы ВСЕГДА рекомендуем устанавливать диммер, чтобы вечером убавлять яркость до комфортного 'интимного' свечения.",
    icon: <Sliders className="w-5 h-5 text-orange-500"/>
  }
];

// --- ОСНОВНОЙ КОМПОНЕНТ (SERVER SIDE) ---
export default async function LoftLettersPage() {
  
  // 1. ПОЛУЧАЕМ ФОТО
  const galleryImages = getImagesFromFolder(PAGE_DATA.slug);

  // 2. ФОТО ДЛЯ HERO
  const heroImages = [...galleryImages].sort(() => 0.5 - Math.random()).slice(0, 15);
  const displayHeroImages = heroImages.length > 0 
    ? heroImages 
    : ["/images/letters/loft-lamps-night.png", "/images/letters/loft-lamps-day.png"];

  // 3. "ДРУГИЕ ВИДЫ"
  const otherTypes = volumeLettersCatalog.filter(item => item.slug !== PAGE_DATA.slug);

  return (
    <div className="min-h-screen bg-[#0F172A] font-sans selection:bg-orange-500/30">
      
      {/* === 1. HERO SECTION === */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F172A]/90 to-[#0F172A]"></div>
        {/* Теплое янтарное свечение */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-600/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
           {/* Навигация */}
           <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 mb-8">
              <Link href="/" className="hover:text-white transition">Главная</Link>
              <ChevronRight className="w-3 h-3"/>
              <Link href="/services/volume-letters" className="hover:text-white transition">Объемные буквы</Link>
              <ChevronRight className="w-3 h-3"/>
              <span className="text-orange-500 font-medium">Лофт / Ретро</span>
           </div>

           <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Текст */}
              <div>
                 <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded-full uppercase tracking-wider">
                    <Lightbulb className="w-4 h-4"/> Marquee Letters
                 </div>
                 <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    {PAGE_DATA.title}
                 </h1>
                 <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                    {PAGE_DATA.subtitle}
                 </p>
                 
                 <ul className="space-y-3 mb-10">
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-orange-500"/> Натуральные материалы (Металл / Дерево)
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-orange-500"/> Винтажные LED-лампы (Эдисона)
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-orange-500"/> Ручная работа и покраска
                    </li>
                 </ul>

                 <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/calculator" className="flex items-center justify-center gap-2 bg-orange-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-700 transition shadow-lg shadow-orange-900/20 active:scale-95">
                       <Calculator className="w-5 h-5"/> Рассчитать проект
                    </Link>
                    <a href="https://wa.me/77071356701" target="_blank" className="flex items-center justify-center gap-2 border border-slate-700 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition">
                       <MessageCircle className="w-5 h-5 text-green-500"/> WhatsApp
                    </a>
                 </div>
              </div>

              {/* Визуал: СЛАЙДЕР */}
              <div className="relative aspect-square rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden group shadow-2xl shadow-orange-500/10">
                 <HeroSlideshow images={displayHeroImages} />
                 
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none"></div>
                 <div className="absolute bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur border border-slate-700 p-4 rounded-xl flex items-center gap-4 pointer-events-none z-20">
                    <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center text-orange-500"><Flame className="w-6 h-6"/></div>
                    <div><div className="text-white font-bold">Ламповый уют</div><div className="text-gray-400 text-xs">Диммируемый свет</div></div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* === БЛОК 2: CONCEPT (АТМОСФЕРА) === */}
      <section className="py-20 lg:py-32 bg-[#020617] relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] mix-blend-screen"></div>
         </div>

         <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center mb-16">
               <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-500/10 text-orange-500 mb-6">
                  <Coffee className="w-8 h-8"/>
               </div>
               <h2 className="text-3xl font-bold text-white mb-6">Больше, чем вывеска</h2>
               <p className="text-gray-400 text-lg leading-relaxed mb-8">
                  Это элемент декора. Стиль, пришедший к нам из старого американского кино и гримерок Бродвея. Открытые лампы дают теплый, мягкий свет, который не просто информирует, а создает эмоциональную связь с гостем.
               </p>
               <div className="grid grid-cols-3 gap-4 text-sm font-medium text-slate-300">
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex flex-col items-center gap-2">
                     <Music className="w-5 h-5 text-orange-500"/>
                     Крафтовые бары
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex flex-col items-center gap-2">
                     <Coffee className="w-5 h-5 text-orange-500"/>
                     Кофейни
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex flex-col items-center gap-2">
                     <Briefcase className="w-5 h-5 text-orange-500"/>
                     Барбершопы
                  </div>
               </div>
            </div>

            {/* МАТЕРИАЛЫ (VISUAL CARDS) */}
            <div className="grid md:grid-cols-3 gap-6">
               
               {/* STEEL */}
               <div className="group bg-[#0B1120] p-8 rounded-3xl border border-slate-800 hover:border-slate-500 transition relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-700/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
                  <div className="relative z-10">
                     <h3 className="text-xl font-bold text-white mb-2">Нержавеющая сталь</h3>
                     <p className="text-sm text-gray-400 mb-4">Классика жанра. Зеркальный или матовый металл. Вечный материал.</p>
                     <div className="h-32 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl border border-gray-600 flex items-center justify-center">
                        <span className="text-4xl font-black text-gray-400 drop-shadow-lg">A</span>
                     </div>
                  </div>
               </div>

               {/* RUST */}
               <div className="group bg-[#0B1120] p-8 rounded-3xl border border-slate-800 hover:border-orange-500 transition relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-700/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
                  <div className="relative z-10">
                     <h3 className="text-xl font-bold text-white mb-2">Искусственная ржавчина</h3>
                     <p className="text-sm text-gray-400 mb-4">Эффект Corten. Металл окисляется кислотой и покрывается лаком. Брутально.</p>
                     <div className="h-32 bg-[url('https://www.transparenttextures.com/patterns/rust.png')] bg-orange-900 rounded-xl border border-orange-800 flex items-center justify-center">
                        <span className="text-4xl font-black text-orange-200/50 drop-shadow-lg">B</span>
                     </div>
                  </div>
               </div>

               {/* WOOD */}
               <div className="group bg-[#0B1120] p-8 rounded-3xl border border-slate-800 hover:border-amber-500 transition relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-700/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
                  <div className="relative z-10">
                     <h3 className="text-xl font-bold text-white mb-2">Натуральное дерево</h3>
                     <p className="text-sm text-gray-400 mb-4">Массив сосны или фанера. Пропитка маслом, обжиг, морилка. Эко-стиль.</p>
                     <div className="h-32 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] bg-amber-800 rounded-xl border border-amber-700 flex items-center justify-center">
                        <span className="text-4xl font-black text-amber-200/50 drop-shadow-lg">C</span>
                     </div>
                  </div>
               </div>

            </div>
         </div>
      </section>

      {/* === БЛОК 3: LIGHT CONTROL (STATIC DEMO) === */}
      <section className="py-24 bg-[#0B1221] relative overflow-hidden">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]"></div>
         
         <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
               
               <div className="lg:w-1/2">
                  <div className="inline-flex items-center gap-2 text-orange-500 font-bold mb-4">
                     <Sliders className="w-5 h-5"/> Управление настроением
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Зачем нужен диммер?</h2>
                  <p className="text-gray-400 text-lg leading-relaxed mb-8">
                     Ламповые буквы очень яркие. Днем это плюс, но вечером в помещении они могут слепить гостей. Мы устанавливаем регулятор яркости, чтобы вы могли менять сценарии.
                  </p>
                  
                  <div className="space-y-4">
                     <div className="flex items-center gap-4 p-4 bg-slate-900 rounded-xl border border-slate-800">
                        <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center text-yellow-500 font-bold">100%</div>
                        <div>
                           <h4 className="text-white font-bold text-sm">Режим "День"</h4>
                           <p className="text-gray-500 text-xs">Максимальная яркость, чтобы привлечь внимание с улицы.</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4 p-4 bg-slate-900 rounded-xl border border-slate-800">
                        <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-500 font-bold">30%</div>
                        <div>
                           <h4 className="text-white font-bold text-sm">Режим "Лаунж"</h4>
                           <p className="text-gray-500 text-xs">Мягкое свечение спиралей. Создает интимную атмосферу.</p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="lg:w-1/2 w-full">
                  <div className="relative aspect-video rounded-3xl overflow-hidden border border-slate-700 shadow-2xl bg-black group">
                     {/* Имитация сравнения */}
                     <div className="absolute inset-0 flex">
                        <div className="w-1/2 h-full bg-[url('/images/letters/loft-lamps-day.png')] bg-cover bg-center border-r border-white/20 relative">
                           <div className="absolute bottom-4 left-4 bg-black/60 text-white text-xs px-2 py-1 rounded">100% Яркость</div>
                        </div>
                        <div className="w-1/2 h-full bg-[url('/images/letters/loft-lamps-night.png')] bg-cover bg-center relative">
                           <div className="absolute inset-0 bg-black/40"></div> {/* Затемнение */}
                           <div className="absolute bottom-4 left-4 bg-black/60 text-orange-300 text-xs px-2 py-1 rounded">30% Яркость</div>
                        </div>
                     </div>
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/10 backdrop-blur border border-white/20 px-4 py-2 rounded-full text-white text-sm font-bold shadow-lg">
                        <Sliders className="w-4 h-4 inline mr-2"/>
                        Регулируемый свет
                     </div>
                  </div>
               </div>

            </div>
         </div>
      </section>

      {/* === [NEW] БЛОК 5: PRO TIPS === */}
      <section className="py-20 bg-slate-950 border-y border-slate-800">
         <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
               
               {/* Карточка 1: ЭКОНОМИЯ */}
               <div className="bg-[#0B1221] p-8 rounded-3xl border border-slate-800 hover:border-green-500/30 transition flex gap-6">
                  <div className="shrink-0">
                     <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500"><Zap className="w-7 h-7"/></div>
                  </div>
                  <div>
                     <h3 className="text-xl font-bold text-white mb-3">Лампы не жрут ток?</h3>
                     <p className="text-sm text-gray-400 leading-relaxed mb-4">
                        Раньше использовали лампы накаливания (40Вт), которые грелись и много потребляли.
                     </p>
                     <div className="p-3 bg-green-900/20 border border-green-500/20 rounded-xl">
                        <p className="text-xs text-green-200 font-medium">
                           <span className="text-green-400 font-bold">Решение:</span> Мы ставим филаментные LED-лампы (всего 4Вт). Вся вывеска потребляет как одна обычная лампочка!
                        </p>
                     </div>
                  </div>
               </div>

               {/* Карточка 2: УЛИЦА */}
               <div className="bg-[#0B1221] p-8 rounded-3xl border border-slate-800 hover:border-blue-500/30 transition flex gap-6">
                  <div className="shrink-0">
                     <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500"><Umbrella className="w-7 h-7"/></div>
                  </div>
                  <div>
                     <h3 className="text-xl font-bold text-white mb-3">А если дождь?</h3>
                     <p className="text-sm text-gray-400 leading-relaxed mb-4">
                        Обычный патрон E27 замкнет при первом ливне. Это опасно.
                     </p>
                     <div className="p-3 bg-blue-900/20 border border-blue-500/20 rounded-xl">
                        <p className="text-xs text-blue-200 font-medium">
                           <span className="text-blue-400 font-bold">Безопасность:</span> Для уличных вывесок мы используем специальные герметичные патроны с резиновой "юбкой".
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
               <h2 className="text-3xl font-bold text-white mb-4">Вопросы о ретро-буквах</h2>
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
              <h2 className="text-3xl font-bold text-white mb-4">Наши работы</h2>
              <p className="text-gray-400">Винтажный стиль в современном исполнении</p>
          </div>
          <div className="container mx-auto px-4">
             {galleryImages.length > 0 ? <ImageGallery images={galleryImages} /> : <div className="text-center text-gray-500 py-12 border border-dashed border-slate-800 rounded-2xl">Загрузите фото в папку public/images/letters-galery/loft-lamps</div>}
             
             <div className="mt-16 flex justify-center">
                <Link href="/portfolio" className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#0B1221] border border-slate-700 rounded-full text-white font-bold hover:bg-slate-800 transition overflow-hidden">
                   <span className="relative z-10 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-orange-500"/>
                      Посмотреть все работы в Портфолио
                   </span>
                   <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 opacity-0 group-hover:opacity-100 transition duration-500"></div>
                </Link>
             </div>
          </div>
      </section>

      {/* === БЛОК 8: СМОТРИТЕ ТАКЖЕ === */}
      <section className="py-24 bg-[#0F172A] border-t border-slate-800 relative">
         <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-orange-500/5 blur-[100px] rounded-full pointer-events-none"></div>

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
                                <h4 className="text-white font-bold text-lg leading-snug group-hover:text-orange-400 transition-colors line-clamp-2">
                                   {type.title}
                                </h4>
                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300 shrink-0 group-hover:rotate-[-45deg]">
                                   <ArrowRight className="w-4 h-4"/>
                                </div>
                             </div>
                             <div className="mt-auto pt-4">
                                <div className="w-full h-0.5 bg-slate-800 group-hover:bg-slate-700 transition-colors relative overflow-hidden rounded-full">
                                   <div className="absolute top-0 left-0 h-full w-0 bg-orange-500 group-hover:w-full transition-all duration-700 ease-out"></div>
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