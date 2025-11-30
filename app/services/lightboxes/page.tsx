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
  Box,            
  Maximize,       
  Zap,            
  ShieldCheck,  
  Utensils,       
  Monitor,        
  Repeat,         
  MoveHorizontal, 
  Scissors,       
  Briefcase
} from "lucide-react";

// --- ИМПОРТ КОМПОНЕНТОВ ---
import ClientsMarquee from "@/components/ClientsMarquee";
import CallToAction from "@/components/CallToAction";
import ServicesCarousel from "@/components/ServicesCarousel";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import DesignCodeBlock from "@/components/DesignCodeBlock";
import ImageGallery from "@/components/ImageGallery";
import HeroSlideshow from "@/components/HeroSlideshow";

// --- СЕРВЕРНАЯ УТИЛИТА ---
import { getImagesFromFolder } from "@/lib/serverUtils";

// --- ДАННЫЕ СТРАНИЦЫ ---
const PAGE_DATA = {
  slug: "lightboxes", 
  title: "Световые короба (Лайтбоксы)",
  subtitle: "От простых вывесок до сверхтонких меню-бордов. Максимальная площадь свечения по лучшей цене.",
  price: "35 000" 
};

export const metadata = {
  title: "Световые короба и Лайтбоксы в Астане | ADLight",
  description: "Изготовление лайтбоксов: акриловые, баннерные, композитные, фигурные. Тонкие панели Magnet и меню-борды. Собственное производство.",
};

// --- КАТАЛОГ ВИДОВ (С ФОТО) ---
const LIGHTBOX_TYPES = [
  {
    title: "Акриловый короб",
    desc: "Лицевая часть из оргстекла. Идеально ровная глянцевая поверхность. Самый популярный вариант для магазинов.",
    image: "/images/lightboxes/type-acrylic.jpg", 
    tag: "Стандарт"
  },
  {
    title: "Баннерный короб",
    desc: "Для гигантских размеров (более 3м). Лицо — транслюцентный баннер. Никаких стыков.",
    image: "/images/lightboxes/type-banner.jpg", 
    tag: "XXL Размер"
  },
  {
    title: "Фигурный лайтбокс",
    desc: "Короб в форме логотипа, круга или любой сложной фигуры. Вырезается на фрезерном станке.",
    image: "/images/lightboxes/type-shaped.jpg", 
    tag: "Логотип"
  },
  {
    title: "Композитный короб",
    desc: "Непрозрачный короб с прорезными буквами (инкрустация). Светится только текст. Премиальный вид.",
    image: "/images/lightboxes/type-composite.jpg", 
    tag: "Премиум"
  },
  {
    title: "Алюминиевый профиль",
    desc: "Сверхпрочный каркас. Борта из анодированного алюминия. Не боится ударов и вандализма.",
    image: "/images/lightboxes/type-aluminum.jpg", 
    tag: "Прочность"
  },
  {
    title: "Двухсторонний (Панель)",
    desc: "Торцевой лайтбокс (консоль). Крепится перпендикулярно стене. Работает на пешеходный трафик.",
    image: "/images/lightboxes/type-panel.jpg", 
    tag: "Трафик"
  },
];

// --- SMART РЕШЕНИЯ ---
const SMART_SOLUTIONS = [
  {
    title: "Magnet Bar",
    desc: "Сверхтонкая панель с магнитным креплением. Постер меняется за 30 секунд присоской.",
    icon: <Repeat className="w-8 h-8"/>,
    bg: "bg-purple-900"
  },
  {
    title: "Меню-борды",
    desc: "Яркие панели для фудкортов. Сочные цвета блюд, вызывающие аппетит.",
    icon: <Utensils className="w-8 h-8"/>,
    bg: "bg-orange-900"
  },
  {
    title: "Crystal Slim",
    desc: "Тонкие световые рамки из прозрачного акрила. Эффект парящего изображения.",
    icon: <Monitor className="w-8 h-8"/>,
    bg: "bg-blue-900"
  }
];

export default async function LightboxesPage() {
  
  // 1. ПОЛУЧАЕМ ФОТО
  const galleryImages = getImagesFromFolder(PAGE_DATA.slug);

  // 2. ФОТО ДЛЯ HERO
  const heroImages = [...galleryImages].sort(() => 0.5 - Math.random()).slice(0, 15);
  // Используем дефолтные, если папка пуста
  const displayHeroImages = heroImages.length > 0 
    ? heroImages 
    : ["/images/lightboxes/type-acrylic.jpg", "/images/lightboxes/type-banner.jpg"]; // Исправил пути на существующие в массиве выше, чтобы наверняка

  return (
    <div className="min-h-screen bg-[#0F172A] font-sans selection:bg-blue-500/30">
      
      {/* === 1. HERO SECTION === */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F172A]/80 to-[#0F172A]"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
           {/* Навигация */}
           <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 mb-8">
              <Link href="/" className="hover:text-white transition">Главная</Link>
              <ChevronRight className="w-3 h-3"/>
              <Link href="/services" className="hover:text-white transition">Услуги</Link>
              <ChevronRight className="w-3 h-3"/>
              <span className="text-blue-500 font-medium">Световые короба</span>
           </div>

           <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div>
                 <div className="inline-block px-4 py-1.5 mb-6 text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full uppercase tracking-wider">
                    Производство любых форм
                 </div>
                 <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    Яркие лайтбоксы <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">для бизнеса</span>
                 </h1>
                 <p className="text-gray-400 text-lg mb-8 leading-relaxed max-w-xl">
                    От гигантских баннерных коробов на фасад до изящных меню-бордов в кофейню. 
                    Самый эффективный способ заявить о себе по соотношению <strong>Цена / Площадь</strong>.
                 </p>
                 
                 <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/calculator" className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-900/20 active:scale-95">
                       <Calculator className="w-5 h-5"/> Рассчитать стоимость
                    </Link>
                    <a href="https://wa.me/77071356701" target="_blank" className="flex items-center justify-center gap-2 border border-slate-700 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition">
                       <MessageCircle className="w-5 h-5 text-green-500"/> Написать в WhatsApp
                    </a>
                 </div>
              </div>

              {/* Визуал: СЛАЙДЕР */}
              <div className="relative aspect-square rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden group shadow-2xl shadow-blue-900/10">
                 <HeroSlideshow images={displayHeroImages} />
                 
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none"></div>
                 <div className="absolute bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur border border-slate-700 p-4 rounded-xl flex items-center gap-4 pointer-events-none z-20">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500"><Box className="w-6 h-6"/></div>
                    <div><div className="text-white font-bold">Любые размеры</div><div className="text-gray-400 text-xs">До 50 метров без стыков</div></div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 2. КЛИЕНТЫ */}
      <ClientsMarquee />

      {/* 3. КАТАЛОГ РЕШЕНИЙ (С ФОТО) */}
      <section className="py-24 bg-slate-950">
         <div className="container mx-auto px-4">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Виды световых коробов</h2>
               <p className="text-gray-400">Мы подберем технологию под ваш бюджет и задачи</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
               {LIGHTBOX_TYPES.map((type, i) => (
                  <div 
                    key={i} 
                    className="group relative h-[300px] rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 cursor-default"
                  >
                     {/* ФОТОГРАФИЯ ФОНОМ */}
                     <Image 
                        src={type.image} 
                        alt={type.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40"
                        // onError удален, так как это Server Component. 
                        // Если картинки нет, Next.js покажет placeholder или пустое место.
                     />
                     
                     {/* ГРАДИЕНТ (чтобы текст читался) */}
                     <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

                     {/* КОНТЕНТ */}
                     <div className="absolute inset-0 p-8 flex flex-col justify-end">
                        <div className="absolute top-4 right-4 bg-blue-600/90 backdrop-blur text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                           {type.tag}
                        </div>
                        
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{type.title}</h3>
                        <p className="text-sm text-gray-300 leading-relaxed opacity-90">
                           {type.desc}
                        </p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 4. SMART SOLUTIONS (ПРЕМИУМ/ИНТЕРЬЕР) */}
      <section className="py-24 bg-[#0F172A] relative overflow-hidden">
         <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-3xl font-bold text-white mb-12">Интерьерные решения</h2>
            
            <div className="grid lg:grid-cols-3 gap-8">
               {SMART_SOLUTIONS.map((item, i) => (
                  <div key={i} className={`rounded-3xl p-8 relative overflow-hidden group ${item.bg}`}>
                     <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition duration-500"></div>
                     <div className="relative z-10">
                        <div className="mb-6 text-white opacity-80">{item.icon}</div>
                        <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                        <p className="text-white/80 text-sm leading-relaxed">{item.desc}</p>
                     </div>
                     {/* Декор */}
                     <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 blur-[40px] rounded-full"></div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 5. ТЕХНИЧЕСКИЙ БЛОК (МАТЕРИАЛЫ) */}
      <section className="py-24 bg-slate-950 border-y border-slate-800">
         <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
               <div>
                  <h2 className="text-3xl font-bold text-white mb-4">Акрил или Баннер?</h2>
                  <p className="text-gray-400 max-w-xl text-lg">
                     Главный вопрос при выборе лайтбокса. Все зависит от размера.
                  </p>
               </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-stretch">
               {/* Акрил */}
               <div className="bg-[#0B1120] p-8 rounded-3xl border border-slate-800 flex gap-6">
                  <div className="shrink-0 p-4 bg-blue-500/10 rounded-2xl h-fit">
                     <Layers className="w-8 h-8 text-blue-500"/>
                  </div>
                  <div>
                     <h3 className="text-xl font-bold text-white mb-2">Акриловое лицо</h3>
                     <div className="inline-block bg-blue-900/30 text-blue-300 text-xs px-2 py-1 rounded mb-4">Размер до 3 метров</div>
                     <p className="text-sm text-gray-400 mb-4">
                        Листовой материал. Дает идеально ровную, глянцевую поверхность. Светится ярко и сочно.
                     </p>
                     <p className="text-xs text-slate-500">
                        <span className="text-red-400 font-bold">Ограничение:</span> Максимальный размер листа 3х2 метра. Если вывеска больше — будет виден стык.
                     </p>
                  </div>
               </div>

               {/* Баннер */}
               <div className="bg-[#0B1120] p-8 rounded-3xl border border-slate-800 flex gap-6">
                  <div className="shrink-0 p-4 bg-orange-500/10 rounded-2xl h-fit">
                     <Maximize className="w-8 h-8 text-orange-500"/>
                  </div>
                  <div>
                     <h3 className="text-xl font-bold text-white mb-2">Транслюцентный баннер</h3>
                     <div className="inline-block bg-orange-900/30 text-orange-300 text-xs px-2 py-1 rounded mb-4">Без ограничений</div>
                     <p className="text-sm text-gray-400 mb-4">
                        Светопропускающая ткань, которая натягивается на каркас как барабан. Позволяет делать короба длиной 10, 20, 50 метров без единого шва.
                     </p>
                     <p className="text-xs text-slate-500">
                        <span className="text-green-400 font-bold">Плюс:</span> Дешевле акрила на больших объемах.
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 6. ЦЕНА */}
      <section className="py-24 bg-[#0F172A]">
         <div className="container mx-auto px-4 relative z-10">
             <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16 items-stretch">
                 
                 <div className="md:w-5/12 bg-slate-900 rounded-3xl p-8 border border-slate-700 flex flex-col justify-between relative overflow-hidden group hover:border-blue-500/50 transition-all duration-300">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><Calculator className="w-32 h-32 text-white"/></div>
                    <div>
                       <div className="inline-flex items-center gap-2 text-blue-500 font-bold text-sm uppercase tracking-wider mb-4"><CheckCircle className="w-4 h-4"/> Оптимальный бюджет</div>
                       <h2 className="text-3xl font-bold text-white mb-4">Стоимость лайтбокса</h2>
                       <p className="text-gray-400 text-sm leading-relaxed mb-8">
                          Цена рассчитывается за квадратный метр (для простых форм) или индивидуально (для фигурных).
                       </p>
                    </div>
                    <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800/50">
                        <p className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">Средняя цена</p>
                        <div className="flex items-baseline gap-2"><span className="text-white text-sm">от</span><span className="text-5xl font-black text-white">35 000</span><span className="text-blue-500 text-xl font-bold">₸ / кв.м</span></div>
                        <div className="h-1 w-full bg-slate-800 rounded-full mt-4 overflow-hidden"><div className="h-full w-1/2 bg-blue-500 rounded-full"></div></div>
                    </div>
                 </div>

                 <div className="md:w-7/12 bg-slate-900/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-800 flex flex-col">
                    <div className="flex items-center justify-between mb-8 border-b border-slate-700/50 pb-6">
                       <div><h3 className="text-white font-bold text-xl">Пример сметы</h3><p className="text-gray-400 text-sm">Короб <span className="text-white font-bold">200 x 50 см</span></p></div>
                       <div className="px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 text-white font-mono text-sm">1 м²</div>
                    </div>
                    <div className="space-y-4 flex-1">
                       <div className="flex justify-between items-center text-sm group hover:bg-slate-800/50 p-2 rounded transition">
                          <span className="text-gray-400">Габариты</span>
                          <div className="flex-1 mx-4 border-b border-dashed border-slate-700/50 relative top-1"></div>
                          <span className="text-white font-mono">2000 x 500 мм</span>
                       </div>
                       <div className="flex justify-between items-center text-sm group hover:bg-slate-800/50 p-2 rounded transition">
                          <span className="text-gray-400">Материал</span>
                          <div className="flex-1 mx-4 border-b border-dashed border-slate-700/50 relative top-1"></div>
                          <span className="text-white font-mono">Акрил + ПВХ борт</span>
                       </div>
                       <div className="flex justify-between items-center text-sm group hover:bg-slate-800/50 p-2 rounded transition">
                          <span className="text-gray-400">Подсветка</span>
                          <div className="flex-1 mx-4 border-b border-dashed border-slate-700/50 relative top-1"></div>
                          <span className="text-blue-400 font-mono text-xs">LED Модули (Линза)</span>
                       </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-slate-700">
                       <div className="flex justify-between items-end mb-6">
                          <span className="text-gray-400 text-sm">Итоговая стоимость:</span>
                          <span className="text-3xl font-black text-white tracking-tight">35 000 ₸</span>
                       </div>
                       <Link href="/calculator" className="group block w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-center transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-3 active:scale-95">
                           <Calculator className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform"/> Точный расчет
                       </Link>
                       <p className="text-center text-[10px] text-gray-500 mt-3">* Цена может меняться от сложности формы.</p>
                    </div>
                 </div>
             </div>
         </div>
      </section>

      {/* 7. ДИЗАЙН КОД */}
      <DesignCodeBlock />

      {/* 8. ГАЛЕРЕЯ */}
      <section className="py-24 bg-slate-950">
          <div className="container mx-auto px-4 mb-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Фотогалерея</h2>
              <p className="text-gray-400">Наши работы по световым коробам</p>
          </div>
          <div className="container mx-auto px-4">
             {/* Проверяем, нашлись ли картинки. Если нет — показываем заглушку с путем */}
             {galleryImages.length > 0 ? (
                <ImageGallery images={galleryImages} /> 
             ) : (
                <div className="text-center text-gray-500 py-12 border border-dashed border-slate-800 rounded-2xl">
                   Загрузите фото в папку public/images/lightboxes
                </div>
             )}
             
             {/* ССЫЛКА НА ПОРТФОЛИО */}
             <div className="mt-16 flex justify-center">
                <Link href="/portfolio" className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#0B1221] border border-slate-700 rounded-full text-white font-bold hover:bg-slate-800 transition overflow-hidden">
                   <span className="relative z-10 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-blue-500"/>
                      Посмотреть все работы в Портфолио
                   </span>
                   <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition duration-500"></div>
                </Link>
             </div>
          </div>
      </section>

      {/* 9. ОТЗЫВЫ И CTA */}
      <ReviewsCarousel />
      <ServicesCarousel title="Другие услуги" subtitle="Комплексное оформление" hiddenLink="/services/lightboxes"/>
      <CallToAction source="Услуга: Лайтбоксы" />

    </div>
  );
}