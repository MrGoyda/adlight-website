import Link from "next/link";
import Image from "next/image";
import { 
  Calculator, 
  CheckCircle, 
  ArrowRight, 
  ChevronRight, 
  Layers, 
  FileCheck,
  // MessageCircle убрал, теперь он внутри HeroButtons
  Signpost,       
  Rotate3d,       
  ArrowLeftRight, 
  MapPin,         
  Zap,            
  ShieldCheck,  
  Maximize,
  Building2,      
  Store,          
  Construction,
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
import HeroButtons from "@/components/HeroButtons"; // <--- НАШ НОВЫЙ КОМПОНЕНТ

// --- СЕРВЕРНАЯ УТИЛИТА ---
import { getImagesFromFolder } from "@/lib/serverUtils";

// --- ДАННЫЕ СТРАНИЦЫ ---
const PAGE_DATA = {
  slug: "panel-brackets", 
  title: "Панель-кронштейны",
  subtitle: "Двухсторонняя реклама, работающая перпендикулярно потоку людей. Ловит взгляд пешеходов и водителей.",
  price: "45 000" 
};

export const metadata = {
  title: "Панель-кронштейны и Консольные вывески | ADLight Астана",
  description: "Изготовление двухсторонних световых коробов на кронштейнах. Аптечные кресты, круглые лайтбоксы, навигационные указатели.",
};

// --- ТИПЫ КРОНШТЕЙНОВ (С ФОТО) ---
const BRACKET_TYPES = [
  {
    title: "Круглый световой",
    desc: "Классика для кофеен и барбершопов. Идеальная форма, которая вписывается в любую архитектуру.",
    image: "/images/panel-brackets/type-round.jpg", 
    tag: "Хит продаж"
  },
  {
    title: "Прямоугольный",
    desc: "Максимум информации. Подходит для банков, нотариусов и названий улиц. Вертикальный или горизонтальный.",
    image: "/images/panel-brackets/type-rect.jpg", 
    tag: "Информативно"
  },
  {
    title: "Фигурный (Логотип)",
    desc: "Короб в форме вашего логотипа (зуб, ножницы, бургер). Вырезается на фрезере. Запоминается лучше всего.",
    image: "/images/panel-brackets/type-shaped.jpg", 
    tag: "Креатив"
  },
  {
    title: "Аптечный крест",
    desc: "Специфический вид с открытыми зелеными диодами. Часто делаем динамическим (мерцание, бегущая строка).",
    image: "/images/panel-brackets/type-pharmacy.jpg", 
    tag: "Яркость"
  },
  {
    title: "Динамический (Вращение)",
    desc: "Вывеска с мотором, которая вращается вокруг своей оси. Привлекает в 3 раза больше внимания за счет движения.",
    image: "/images/panel-brackets/type-dynamic.jpg", 
    tag: "Wow-эффект"
  },
  {
    title: "Интерьерный указатель",
    desc: "Тонкие таблички для навигации внутри ТРЦ и БЦ. Указывают на туалеты, выходы или офисы.",
    image: "/images/panel-brackets/type-interior.jpg", 
    tag: "Навигация"
  },
];

export default async function PanelBracketsPage() {
  
  // 1. ПОЛУЧАЕМ ФОТО
  const galleryImages = getImagesFromFolder(PAGE_DATA.slug);

  // 2. ФОТО ДЛЯ HERO
  const heroImages = [...galleryImages].sort(() => 0.5 - Math.random()).slice(0, 15);
  // Заглушки, если папка пуста
  const displayHeroImages = heroImages.length > 0 
    ? heroImages 
    : ["/images/panel-brackets/type-round.jpg", "/images/panel-brackets/type-rect.jpg"]; 

  return (
    <div className="min-h-screen bg-[#0F172A] font-sans selection:bg-indigo-500/30">
      
      {/* === 1. HERO SECTION === */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F172A]/80 to-[#0F172A]"></div>
        {/* Индиго свечение */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
           {/* Навигация */}
           <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 mb-8">
              <Link href="/" className="hover:text-white transition">Главная</Link>
              <ChevronRight className="w-3 h-3"/>
              <Link href="/services" className="hover:text-white transition">Услуги</Link>
              <ChevronRight className="w-3 h-3"/>
              <span className="text-indigo-500 font-medium">Панель-кронштейны</span>
           </div>

           <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Текст */}
              <div>
                 <div className="inline-block px-4 py-1.5 mb-6 text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full uppercase tracking-wider">
                    Работает на 2 стороны
                 </div>
                 <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    Консольные вывески <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Панель-кронштейны</span>
                 </h1>
                 <p className="text-gray-400 text-lg mb-8 leading-relaxed max-w-xl">
                    Идеальное решение для узких улиц и торговых рядов. Крепится перпендикулярно стене, "ловит" взгляд пешехода как шлагбаум.
                 </p>
                 
                 {/* --- НОВЫЙ ИЗОЛИРОВАННЫЙ КОМПОНЕНТ КНОПОК --- */}
                 <HeroButtons source={PAGE_DATA.title} priceColor="indigo" />
                 
              </div>

              {/* Визуал: СЛАЙДЕР */}
              <div className="relative aspect-square rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden group shadow-2xl shadow-indigo-900/10">
                 <HeroSlideshow images={displayHeroImages} />
                 
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none"></div>
                 <div className="absolute bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur border border-slate-700 p-4 rounded-xl flex items-center gap-4 pointer-events-none z-20">
                    <div className="w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-500"><ArrowLeftRight className="w-6 h-6"/></div>
                    <div><div className="text-white font-bold">Двухсторонний обзор</div><div className="text-gray-400 text-xs">Перпендикулярный монтаж</div></div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 2. КЛИЕНТЫ */}
      <ClientsMarquee />

      {/* 3. CONCEPT (ГЕОМЕТРИЯ ВНИМАНИЯ) */}
      <section className="py-24 bg-slate-950">
         <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
               <div className="lg:w-1/2">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Почему обычную вывеску не видно?</h2>
                  <p className="text-gray-400 text-lg leading-relaxed mb-8">
                     Представьте: вы идете по тротуару вдоль здания. Вывески над входами находятся параллельно вашему движению — вы их просто не замечаете, пока не повернете голову на 90 градусов.
                  </p>
                  
                  <div className="bg-indigo-900/20 border border-indigo-500/30 p-6 rounded-2xl">
                     <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                        <Signpost className="w-5 h-5 text-indigo-400"/> Решение: Консоль
                     </h4>
                     <p className="text-sm text-indigo-200">
                        Панель-кронштейн устанавливается <strong>поперек</strong> потока людей. Человек упирается в неё взглядом. Это повышает проходимость точки на 30-40%.
                     </p>
                  </div>
               </div>
               
               {/* СХЕМА (CSS Grid) */}
               <div className="lg:w-1/2 w-full grid grid-cols-2 gap-4">
                   <div className="bg-[#0B1120] p-6 rounded-2xl border border-slate-800 text-center opacity-60">
                      <div className="h-32 flex items-center justify-center border-b border-slate-700 mb-4 relative">
                         <div className="w-full h-8 bg-slate-700 rounded"></div> {/* Фасад */}
                         <div className="absolute w-24 h-6 bg-slate-500 rounded top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">Вывеска</div>
                      </div>
                      <h4 className="text-slate-400 font-bold">Обычная</h4>
                      <p className="text-xs text-slate-500">Видна только с дороги</p>
                   </div>

                   <div className="bg-[#0B1120] p-6 rounded-2xl border border-indigo-500/50 text-center relative overflow-hidden shadow-lg shadow-indigo-900/20">
                      <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">WINNER</div>
                      <div className="h-32 flex items-center justify-center border-b border-slate-700 mb-4 relative perspective-1000">
                         <div className="w-full h-8 bg-slate-700 rounded"></div> {/* Фасад */}
                         <div className="absolute w-4 h-16 bg-indigo-500 rounded top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_20px_#6366f1]"></div> {/* Консоль */}
                      </div>
                      <h4 className="text-white font-bold">Консоль</h4>
                      <p className="text-xs text-indigo-300">Видна всем пешеходам</p>
                   </div>
               </div>
            </div>
         </div>
      </section>

      {/* 4. КАТАЛОГ ТИПОВ (С ФОТО) */}
      <section className="py-24 bg-[#0F172A]">
         <div className="container mx-auto px-4">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Виды консольных вывесок</h2>
               <p className="text-gray-400">Мы производим любые формы и размеры</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
               {BRACKET_TYPES.map((type, i) => (
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
                     />
                     
                     {/* ГРАДИЕНТ */}
                     <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

                     {/* КОНТЕНТ */}
                     <div className="absolute inset-0 p-8 flex flex-col justify-end">
                        <div className="absolute top-4 right-4 bg-indigo-600/90 backdrop-blur text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                           {type.tag}
                        </div>
                        
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">{type.title}</h3>
                        <p className="text-sm text-gray-300 leading-relaxed opacity-90">
                           {type.desc}
                        </p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 5. ТЕХНИЧЕСКИЙ БЛОК */}
      <section className="py-24 bg-slate-950 border-y border-slate-800">
         <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">Особенности конструкции</h2>
            
            <div className="grid md:grid-cols-3 gap-8 items-start">
               {/* Силовой каркас */}
               <div className="flex flex-col gap-4">
                   <div className="h-48 bg-[#0B1120] rounded-2xl border border-slate-800 flex items-center justify-center relative group overflow-hidden">
                      <Construction className="w-16 h-16 text-slate-600 group-hover:text-indigo-500 transition"/>
                   </div>
                   <div>
                      <h3 className="text-white font-bold text-lg">Силовой каркас</h3>
                      <p className="text-gray-400 text-sm mt-2">
                         Кронштейн испытывает сильные ветровые нагрузки (парусность). Внутри мы всегда варим металлическую раму из профильной трубы, которая крепится к стене анкерами.
                      </p>
                   </div>
               </div>

               {/* Материалы */}
               <div className="flex flex-col gap-4">
                   <div className="h-48 bg-[#0B1120] rounded-2xl border border-slate-800 flex items-center justify-center relative group overflow-hidden">
                      <Layers className="w-16 h-16 text-slate-600 group-hover:text-blue-500 transition"/>
                   </div>
                   <div>
                      <h3 className="text-white font-bold text-lg">Материалы</h3>
                      <p className="text-gray-400 text-sm mt-2">
                         Лицевые панели — молочный акрил или сотовый поликарбонат (для бюджетных вариантов). Борт — алюминиевый профиль или ПВХ.
                      </p>
                   </div>
               </div>

               {/* Подсветка */}
               <div className="flex flex-col gap-4">
                   <div className="h-48 bg-[#0B1120] rounded-2xl border border-slate-800 flex items-center justify-center relative group overflow-hidden">
                      <Zap className="w-16 h-16 text-slate-600 group-hover:text-yellow-500 transition"/>
                   </div>
                   <div>
                      <h3 className="text-white font-bold text-lg">Двухсторонняя подсветка</h3>
                      <p className="text-gray-400 text-sm mt-2">
                         Внутри устанавливаются специальные торцевые модули или лента по периметру, чтобы равномерно засветить обе стороны короба без теней в центре.
                      </p>
                   </div>
               </div>
            </div>
         </div>
      </section>

      {/* 6. ЦЕНЫ */}
      <section className="py-24 bg-[#0F172A]">
         <div className="container mx-auto px-4">
             <div className="max-w-5xl mx-auto bg-indigo-900/10 border border-indigo-500/20 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row gap-12 items-center">
                <div className="md:w-1/2">
                   <h2 className="text-3xl font-bold text-white mb-4">Сколько стоит?</h2>
                   <p className="text-indigo-200 mb-6">
                      Цена зависит от размера, формы и типа подсветки. Вот ориентиры для популярных размеров.
                   </p>
                   <ul className="space-y-3">
                      <li className="flex justify-between text-sm border-b border-indigo-500/20 pb-2">
                         <span className="text-gray-300">Круг D=50см (Односторонний)</span>
                         <span className="text-white font-bold">от 35 000 ₸</span>
                      </li>
                      <li className="flex justify-between text-sm border-b border-indigo-500/20 pb-2">
                         <span className="text-gray-300">Круг D=50см (Двухсторонний)</span>
                         <span className="text-white font-bold">от 45 000 ₸</span>
                      </li>
                      <li className="flex justify-between text-sm border-b border-indigo-500/20 pb-2">
                         <span className="text-gray-300">Аптечный крест (Динамика)</span>
                         <span className="text-white font-bold">от 60 000 ₸</span>
                      </li>
                   </ul>
                </div>

                <div className="md:w-1/2 text-center">
                   <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/30 animate-pulse">
                      <Calculator className="w-10 h-10 text-white"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-2">Нужен точный расчет?</h3>
                   <p className="text-gray-400 text-sm mb-6">Мы учтем длину ножек, материал стены и сложность монтажа.</p>
                   <Link href="/calculator" className="inline-flex items-center justify-center px-8 py-3 bg-white text-indigo-900 font-bold rounded-xl hover:bg-indigo-50 transition">
                      Рассчитать стоимость
                   </Link>
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
              <p className="text-gray-400">Примеры консольных вывесок</p>
          </div>
          <div className="container mx-auto px-4">
              {/* Проверяем наличие картинок */}
              {galleryImages.length > 0 ? (
                 <ImageGallery images={galleryImages} /> 
              ) : (
                 <div className="text-center text-gray-500 py-12 border border-dashed border-slate-800 rounded-2xl">
                    Загрузите фото в папку public/images/panel-brackets
                 </div>
              )}
              
              {/* ССЫЛКА НА ПОРТФОЛИО */}
              <div className="mt-16 flex justify-center">
                 <Link href="/portfolio" className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#0B1221] border border-slate-700 rounded-full text-white font-bold hover:bg-slate-800 transition overflow-hidden">
                    <span className="relative z-10 flex items-center gap-2">
                       <Briefcase className="w-5 h-5 text-indigo-500"/>
                       Посмотреть все работы в Портфолио
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition duration-500"></div>
                 </Link>
              </div>
          </div>
      </section>

      {/* 9. ОТЗЫВЫ И CTA */}
      <ReviewsCarousel />
      <ServicesCarousel title="Другие услуги" subtitle="Комплексное оформление" hiddenLink="/services/panel-brackets"/>
      <CallToAction source="Услуга: Панель-кронштейны" />

    </div>
  );
}