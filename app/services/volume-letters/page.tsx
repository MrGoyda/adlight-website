import Link from "next/link";
import Image from "next/image";
import { 
  Calculator, 
  CheckCircle, 
  ArrowRight, 
  ChevronRight, 
  Layers, 
  FileCheck,
  MessageCircle,
  Eye,          
  Sun,          
  Zap,          
  ShieldCheck,  
  Hammer,
  Moon,
  Star,
  MousePointerClick
} from "lucide-react";

// --- ИМПОРТ КОМПОНЕНТОВ ---
import ClientsMarquee from "@/components/ClientsMarquee";
import CallToAction from "@/components/CallToAction";
import ServicesCarousel from "@/components/ServicesCarousel";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import DesignCodeBlock from "@/components/DesignCodeBlock";
import ImageGallery from "@/components/ImageGallery";
import HeroSlideshow from "@/components/HeroSlideshow";
import HeroButtons from "@/components/HeroButtons"; // <-- Новый импорт

// --- УТИЛИТА ДЛЯ СБОРА ФОТО (СЕРВЕРНАЯ) ---
import { getImagesFromFolder } from "@/lib/serverUtils";

// --- КАТАЛОГ ТИПОВ ---
const volumeLettersCatalog = [
  {
    id: 1,
    slug: 'face-lit',
    title: 'Световое лицо', 
    description: 'Классика. Самый популярный выбор. Светится только лицевая часть, борта в цвет фасада.',
    price: "от 450 ₸/см",
    images: { day: '/images/letters/face-lit-day.png', night: '/images/letters/face-lit-night.png' },
    badge: "Хит продаж"
  },
  {
    id: 2,
    slug: 'full-lit',
    title: 'Полное свечение',
    description: 'Эффект «леденца». Буква светится целиком (лицо + борта). Максимальный угол обзора 360°.',
    price: "от 650 ₸/см",
    images: { day: '/images/letters/full-lit-day.png', night: '/images/letters/full-lit-night.png' },
    badge: "Premium"
  },
  {
    id: 3,
    slug: 'back-lit',
    title: 'Контражур',
    description: 'Эффект парения. Свет направлен на стену, создавая мягкий ореол вокруг темной буквы.',
    price: "от 550 ₸/см",
    images: { day: '/images/letters/back-lit-day.png', night: '/images/letters/back-lit-night.png' },
    badge: "Стиль"
  },
  {
    id: 4,
    slug: 'combo-lit',
    title: 'Комбо (Лицо + Бэк)',
    description: 'Двойной удар. Читаемость лицевого свечения + премиальный ореол контражура.',
    price: "от 850 ₸/см",
    images: { day: '/images/letters/combo-lit-day.png', night: '/images/letters/combo-lit-night.png' },
    badge: "VIP"
  },
  {
    id: 5,
    slug: 'side-lit',
    title: 'Светятся борта',
    description: 'Инверсия. Лицо темное, а контур (борт) светится. Строгий, архитектурный стиль.',
    price: "от 600 ₸/см",
    images: { day: '/images/letters/side-lit-day.png', night: '/images/letters/side-lit-night.png' },
  },
  {
    id: 6,
    slug: 'perforated',
    title: 'Перфорация',
    description: 'Wow-эффект. Алюминиевый борт с тысячами отверстий создает эффект мерцания кристаллов.',
    price: "от 750 ₸/см",
    images: { day: '/images/letters/perforated-day.png', night: '/images/letters/perforated-night.png' },
    badge: "Тренд"
  },
  {
    id: 7,
    slug: 'acrylic-slim',
    title: 'Жидкий акрил',
    description: 'Технология 2025. Монолитная заливка без рамок и кантов. На 30% ярче обычных.',
    price: "от 900 ₸/см",
    images: { day: '/images/letters/acrylic-slim-day.png', night: '/images/letters/acrylic-slim-night.png' },
    badge: "New"
  },
  {
    id: 8,
    slug: 'loft-lamps',
    title: 'Ретро с лампами',
    description: 'Стиль Лофт / Бродвей. Открытые винтажные лампы для создания атмосферы.',
    price: "от 1200 ₸/см",
    images: { day: '/images/letters/loft-lamps-day.png', night: '/images/letters/loft-lamps-night.png' },
  },
  {
    id: 9,
    slug: 'pixel-led',
    title: 'Пиксельные LED',
    description: 'Открытые диоды. Рекордная яркость и динамические спецэффекты (анимация).',
    price: "от 800 ₸/см",
    images: { day: '/images/letters/pixel-led-day.png', night: '/images/letters/pixel-led-night.png' },
  },
  {
    id: 10,
    slug: 'wood-style',
    title: 'Эко / Дерево',
    description: 'Натуральные материалы. Лазерная резка фанеры или массива с пропиткой маслом.',
    price: "от 350 ₸/см",
    images: { day: '/images/letters/wood-style-day.png', night: '/images/letters/wood-style-night.png' },
  },
  {
    id: 11,
    slug: 'non-lit',
    title: 'Без подсветки',
    description: 'Бюджетное решение для интерьеров. Объемные буквы из ПВХ или пенопласта.',
    price: "от 200 ₸/см",
    images: { day: '/images/letters/non-lit-day.png', night: '/images/letters/non-lit-night.png' },
  },
  {
    id: 12,
    slug: 'day-night-effect',
    title: 'День / Ночь',
    description: 'Магия пленки: днем буквы черные, ночью светятся ярко-белым.',
    price: "от 700 ₸/см",
    images: { day: '/images/letters/day-night-effect-day.png', night: '/images/letters/day-night-effect-night.png' },
  },
];

export const metadata = {
  title: "Объемные буквы в Астане | Производство вывесок ADLight",
  description: "Изготовление всех видов объемных букв: световые, контражур, жидкий акрил, ретро-лампы. Собственный цех, монтаж по Дизайн-коду.",
};

export default async function VolumeLettersPage() {
  
  // 1. СБОР ВСЕХ ФОТО ДЛЯ ОБЩЕЙ ГАЛЕРЕИ
  const allSlugs = volumeLettersCatalog.map(i => i.slug);
  let allGalleryImages: string[] = [];
  
  allSlugs.forEach(slug => {
    const images = getImagesFromFolder(slug);
    if (images.length > 0) {
        // Берем по 3 лучших фото из каждой папки
        allGalleryImages = [...allGalleryImages, ...images.slice(0, 3)]; 
    }
  });

  // 2. HERO SLIDER (Топ-15 рандомных)
  let heroImages = [...allGalleryImages].sort(() => 0.5 - Math.random()).slice(0, 15);
  if (heroImages.length === 0) {
    heroImages = volumeLettersCatalog.map(item => item.images.night);
  }

  return (
    <div className="min-h-screen bg-[#0F172A] font-sans selection:bg-orange-500/30">
      
      {/* === 1. HERO SECTION === */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F172A]/80 to-[#0F172A]"></div>
        {/* Оранжевый акцент */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-600/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
           {/* Хлебные крошки */}
           <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 mb-8">
              <Link href="/" className="hover:text-white transition">Главная</Link>
              <ChevronRight className="w-3 h-3"/>
              <Link href="/services" className="hover:text-white transition">Услуги</Link>
              <ChevronRight className="w-3 h-3"/>
              <span className="text-orange-500 font-medium">Объемные буквы</span>
           </div>

           <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div>
                 <div className="inline-block px-4 py-1.5 mb-6 text-xs font-bold text-orange-500 bg-orange-500/10 border border-orange-500/20 rounded-full uppercase tracking-wider">
                    Производство в Астане
                 </div>
                 <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    Объемные буквы <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">любой сложности</span>
                 </h1>
                 <p className="text-gray-400 text-lg mb-8 leading-relaxed max-w-xl">
                    От бюджетных решений до премиальных вывесок из жидкого акрила. 
                    Делаем ярко, надежно и <strong>строго по Дизайн-коду</strong> города.
                 </p>
                 
                 {/* НОВЫЕ КНОПКИ С МОДАЛКОЙ */}
                 <HeroButtons source="Услуга: Объемные буквы (Общая)" priceColor="orange" />

              </div>

              {/* Визуал: СЛАЙДЕР */}
              <div className="relative aspect-square rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden group shadow-2xl">
                 <HeroSlideshow images={heroImages} />
                 
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none"></div>
                 <div className="absolute bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur border border-slate-700 p-4 rounded-xl flex items-center gap-4 pointer-events-none z-20">
                    <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center text-green-500"><FileCheck className="w-6 h-6"/></div>
                    <div><div className="text-white font-bold">Гарантия качества</div><div className="text-gray-400 text-xs">Договор, Сроки, Документы</div></div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 2. КЛИЕНТЫ */}
      <ClientsMarquee />

      {/* 3. ПСИХОЛОГИЯ */}
      <section className="py-24 bg-slate-950">
         <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-[#0B1120] to-[#1a2035] rounded-3xl p-8 md:p-12 border border-slate-800 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none"></div>
               
               <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
                  <div>
                     <h2 className="text-3xl font-bold text-white mb-6">Почему объемные буквы работают лучше?</h2>
                     <p className="text-gray-400 text-lg leading-relaxed mb-6">
                        В визуальном шуме города плоская вывеска — невидимка. Объем, свет и тень создают "визуальный якорь".
                     </p>
                     <div className="flex items-start gap-4">
                        <div className="p-3 bg-orange-500/20 rounded-xl text-orange-500 shrink-0"><Eye className="w-6 h-6"/></div>
                        <div>
                           <h4 className="text-white font-bold mb-1">Магнит для глаз</h4>
                           <p className="text-gray-400 text-sm">Человеческий мозг эволюционно заточен замечать 3D-объекты. Объемная буква воспринимается как "реальный предмет", вызывая больше доверия.</p>
                        </div>
                     </div>
                  </div>
                  
                  <div className="bg-slate-900/50 backdrop-blur p-8 rounded-2xl border border-slate-700 text-center relative">
                     <div className="text-sm text-gray-500 uppercase tracking-widest mb-2 font-bold">Эффективность</div>
                     <div className="text-7xl font-black text-white mb-2 tracking-tighter">
                        +42<span className="text-orange-500 text-5xl">%</span>
                     </div>
                     <p className="text-gray-300 font-medium">
                        К вниманию прохожих по сравнению с плоскими коробами.
                     </p>
                     <div className="absolute -bottom-4 -right-4 text-slate-800 opacity-20 transform rotate-12">
                        <Star className="w-32 h-32"/>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 4. КАТАЛОГ ТИПОВ */}
      <section className="py-24 bg-[#0F172A] border-y border-slate-800 relative">
         <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[500px] bg-blue-500/5 blur-[120px] pointer-events-none"></div>
         
         <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Выберите технологию</h2>
               <p className="text-gray-400">Нажмите на карточку, чтобы узнать подробности и цены</p>
            </div>
            
            <div className="flex overflow-x-auto pb-8 -mx-4 px-4 gap-4 snap-x snap-mandatory scroll-pl-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 md:overflow-visible md:pb-0 md:px-0 hide-scrollbar">
               {volumeLettersCatalog.map((type) => (
                  <Link 
                     href={`/services/volume-letters/${type.slug}`} 
                     key={type.id}
                     className="group relative flex flex-col min-w-[85vw] sm:min-w-[320px] md:min-w-0 snap-center rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 cursor-pointer h-[420px]"
                  >
                     <div className="relative h-[220px] w-full overflow-hidden bg-black shrink-0">
                        {type.badge && (
                           <div className="absolute top-3 right-3 z-20 bg-orange-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-lg">
                              {type.badge}
                           </div>
                        )}

                        <div className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-0 z-10">
                           <Image src={type.images.night} alt={`${type.title} ночью`} fill className="object-cover"/>
                           <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-[10px] text-white flex items-center gap-1">
                              <Moon className="w-3 h-3 text-blue-400"/> Ночь
                           </div>
                        </div>

                        <div className="absolute inset-0">
                           <Image src={type.images.day} alt={`${type.title} днем`} fill className="object-cover"/>
                           <div className="absolute bottom-2 left-2 bg-white/80 backdrop-blur px-2 py-1 rounded text-[10px] text-black flex items-center gap-1">
                              <Sun className="w-3 h-3 text-orange-500"/> День
                           </div>
                        </div>
                        
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 bg-black/50 backdrop-blur rounded-full p-3">
                           <MousePointerClick className="w-6 h-6 text-white"/>
                        </div>
                     </div>

                     <div className="p-6 flex flex-col flex-1 justify-between">
                        <div>
                           <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-orange-500 transition-colors">
                              {type.title}
                           </h3>
                           <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">
                              {type.description}
                           </p>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800">
                           <span className="text-white font-medium text-sm bg-slate-800 px-3 py-1 rounded-lg">
                              {type.price}
                           </span>
                           <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-orange-600 group-hover:text-white transition-all">
                              <ArrowRight className="w-4 h-4"/>
                           </div>
                        </div>
                     </div>
                  </Link>
               ))}
            </div>
         </div>
      </section>

      {/* 5. ИНЖЕНЕРНАЯ ЧАСТЬ */}
      <section className="py-24 bg-slate-950">
         <div className="container mx-auto px-4">
            <div className="text-center mb-16">
               <h2 className="text-3xl font-bold text-white mb-4">Качество не на словах</h2>
               <p className="text-gray-400">Мы даем гарантию, потому что уверены в материалах</p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
               <div className="bg-[#0B1120] p-6 rounded-2xl border border-slate-800 hover:border-blue-500/30 transition group">
                  <div className="w-12 h-12 bg-blue-500/10 flex items-center justify-center mb-4 text-blue-500 rounded-xl group-hover:scale-110 transition"><Layers className="w-6 h-6"/></div>
                  <h3 className="text-white font-bold mb-2">Акрил Plexiglas</h3>
                  <p className="text-gray-400 text-sm">Немецкое оргстекло. Не желтеет 10 лет, пропускает 92% света.</p>
               </div>
               <div className="bg-[#0B1120] p-6 rounded-2xl border border-slate-800 hover:border-orange-500/30 transition group">
                  <div className="w-12 h-12 bg-orange-500/10 flex items-center justify-center mb-4 text-orange-500 rounded-xl group-hover:scale-110 transition"><Zap className="w-6 h-6"/></div>
                  <h3 className="text-white font-bold mb-2">Диоды с линзой</h3>
                  <p className="text-gray-400 text-sm">Широкий угол рассеивания 170°. Никаких "пятен" на лицевой части.</p>
               </div>
               <div className="bg-[#0B1120] p-6 rounded-2xl border border-slate-800 hover:border-green-500/30 transition group">
                  <div className="w-12 h-12 bg-green-500/10 flex items-center justify-center mb-4 text-green-500 rounded-xl group-hover:scale-110 transition"><ShieldCheck className="w-6 h-6"/></div>
                  <h3 className="text-white font-bold mb-2">Защита IP67</h3>
                  <p className="text-gray-400 text-sm">Герметичные блоки питания и модули. Работают в дождь и мороз -40°C.</p>
               </div>
               <div className="bg-[#0B1120] p-6 rounded-2xl border border-slate-800 hover:border-purple-500/30 transition group">
                  <div className="w-12 h-12 bg-purple-500/10 flex items-center justify-center mb-4 text-purple-500 rounded-xl group-hover:scale-110 transition"><Hammer className="w-6 h-6"/></div>
                  <h3 className="text-white font-bold mb-2">Свой цех</h3>
                  <p className="text-gray-400 text-sm">ЧПУ станки, лазерная сварка и бортогибы. Контроль каждого этапа.</p>
               </div>
            </div>
         </div>
      </section>

      {/* 6. ЦЕНА */}
      <section className="py-24 bg-[#0F172A] border-t border-slate-800">
         <div className="container mx-auto px-4">
             <div className="max-w-5xl mx-auto bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl p-8 md:p-12 relative overflow-hidden text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-orange-900/50">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                <div className="relative z-10 md:max-w-xl">
                   <h2 className="text-3xl font-bold text-white mb-4">Узнайте точную цену за 1 минуту</h2>
                   <p className="text-white/90 text-lg">
                      Не ждите менеджера. Наш умный калькулятор рассчитает стоимость вывески онлайн, учитывая шрифт, размеры и сложность монтажа.
                   </p>
                </div>
                <div className="relative z-10">
                   <Link href="/calculator" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-orange-600 font-bold text-lg rounded-xl hover:bg-gray-100 transition shadow-xl active:scale-95">
                      <Calculator className="w-5 h-5"/> Перейти в калькулятор
                   </Link>
                </div>
             </div>
         </div>
      </section>

      {/* 7. ДИЗАЙН КОД */}
      <DesignCodeBlock />

      {/* 8. ЭТАПЫ РАБОТЫ */}
      <section className="py-24 bg-slate-950">
        <div className="container mx-auto px-4">
           <h2 className="text-3xl md:text-4xl font-bold text-white mb-16 text-center">Как мы работаем</h2>
           <div className="grid md:grid-cols-5 gap-8 relative">
              <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-slate-800 -z-10"></div>
              {[
                 {step: "01", title: "Заявка", desc: "Фото места и размеры"},
                 {step: "02", title: "Макет", desc: "Визуализация на фасаде"},
                 {step: "03", title: "Смета", desc: "Прозрачный расчет"},
                 {step: "04", title: "Производство", desc: "3-7 дней в цехе"},
                 {step: "05", title: "Монтаж", desc: "Установка и подключение"}
              ].map((item, i) => (
                 <div key={i} className="relative group bg-slate-950 p-4 pt-0">
                    <div className="w-16 h-16 bg-slate-900 border-2 border-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-6 mx-auto shadow-lg shadow-orange-900/20 group-hover:scale-110 transition-transform">{item.step}</div>
                    <h3 className="text-lg font-bold text-white text-center mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-center text-xs leading-relaxed">{item.desc}</p>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 9. ГАЛЕРЕЯ + ССЫЛКА НА ПОРТФОЛИО */}
      <section className="py-24 bg-[#0F172A] border-t border-slate-800">
         <div className="container mx-auto px-4 mb-12 text-center">
             <h2 className="text-3xl font-bold text-white mb-4">Наши работы</h2>
             <p className="text-gray-400">Галерея реализованных проектов</p>
         </div>
         <div className="container mx-auto px-4">
            <ImageGallery images={allGalleryImages} />
            
            {/* БЛОК ССЫЛКИ НА ПОРТФОЛИО */}
            <div className="mt-16 flex justify-center">
               <Link href="/portfolio" className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#0B1221] border border-slate-700 rounded-full text-white font-bold hover:bg-slate-800 transition overflow-hidden">
                  <span className="relative z-10 flex items-center gap-2">
                     <BriefcaseIcon className="w-5 h-5 text-orange-500"/>
                     Посмотреть все работы в Портфолио
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition duration-500"></div>
               </Link>
            </div>
         </div>
      </section>

      {/* 10. КОМПОНЕНТЫ */}
      <ReviewsCarousel />
      <ServicesCarousel title="Другие услуги" subtitle="Комплексное оформление" hiddenLink="/services/volume-letters"/>
      <CallToAction source="Страница: Объемные буквы (Hub)" />

    </div>
  );
}

// --- ВСПОМОГАТЕЛЬНАЯ ИКОНКА (Если Briefcase не импортируется корректно) ---
function BriefcaseIcon(props: any) {
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
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  )
}