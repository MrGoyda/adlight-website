import Link from "next/link";
import Image from "next/image";
import { 
  Calculator, 
  CheckCircle, 
  ArrowRight, 
  ChevronRight, 
  Map,            // Карта
  Signpost,       // Указатель
  User,           // Табличка
  Layers,         // Материалы
  PenTool,        // Дизайн
  Printer,        // Печать
  Scan,           // Гравировка
  Building,
  MessageCircle,
  Layout,         // Схема
  ArrowUpRight,   // Направление
  Repeat,         // Сменная информация
  ShieldCheck,
  MapPin
} from "lucide-react";

// --- ИМПОРТ КОМПОНЕНТОВ ---
import ClientsMarquee from "@/components/ClientsMarquee";
import CallToAction from "@/components/CallToAction";
import ProjectsBento from "@/components/ProjectsBento";
import ServicesCarousel from "@/components/ServicesCarousel";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import DesignCodeBlock from "@/components/DesignCodeBlock";
import ImageGallery from "@/components/ImageGallery";
import HeroSlideshow from "@/components/HeroSlideshow";

// --- СЕРВЕРНАЯ УТИЛИТА ---
import { getImagesFromFolder } from "@/lib/serverUtils";

// --- ДАННЫЕ СТРАНИЦЫ ---
const PAGE_DATA = {
  slug: "navigation", // Папка public/images/navigation
  title: "Системы навигации и таблички",
  subtitle: "Понятная логистика для ваших клиентов. От таблички на дверь до комплексной навигации бизнес-центра.",
  price: "5 000" // Цена от
};

export const metadata = {
  title: "Изготовление табличек и навигации в Астане | ADLight",
  description: "Офисные таблички, навигационные указатели, стенды. Металл, акрил, гравировка. Wayfinding системы для БЦ и ТРЦ.",
};

// --- ТИПЫ НАВИГАЦИИ (С ФОТО) ---
const NAV_TYPES = [
  {
    title: "Кабинетные таблички",
    desc: "Именные или номерные таблички на дверь. ПВХ, акрил, двухслойный пластик (золото/серебро).",
    image: "/images/navigation/type-door.jpg", 
    tag: "Офис"
  },
  {
    title: "Настенные указатели",
    desc: "Стрелки, списки компаний в холле, поэтажные планы. Помогают найти путь от входа до двери.",
    image: "/images/navigation/type-wall.jpg", 
    tag: "Логистика"
  },
  {
    title: "Подвесные системы",
    desc: "Двухсторонние указатели под потолком. Идеальны для коридоров, супермаркетов и паркингов.",
    image: "/images/navigation/type-hanging.jpg", 
    tag: "Видимость"
  },
  {
    title: "Модульные стенды",
    desc: "Реечные системы из алюминия. Позволяют легко менять названия компаний при смене арендаторов.",
    image: "/images/navigation/type-wall.jpg", // Можно повторить или свое
    tag: "Сменные"
  },
  {
    title: "Интерьерные пилоны",
    desc: "Отдельно стоящие стелы в лобби или холле. Премиальный вид, возможность встроенной подсветки.",
    image: "/images/navigation/type-pylon.jpg", 
    tag: "Премиум"
  },
  {
    title: "Знаки безопасности",
    desc: "Планы эвакуации, пожарные знаки, 'Выход'. Фотолюминесцентная пленка (светится в темноте).",
    image: "/images/navigation/type-safety.jpg", 
    tag: "ГОСТ"
  },
];

export default async function NavigationPage() {
  
  // 1. ПОЛУЧАЕМ ФОТО
  const galleryImages = getImagesFromFolder(PAGE_DATA.slug);

  // 2. ФОТО ДЛЯ HERO
  const heroImages = [...galleryImages].sort(() => 0.5 - Math.random()).slice(0, 15);
  // Заглушки
  const displayHeroImages = heroImages.length > 0 
    ? heroImages 
    : ["/images/navigation/type-wall.jpg", "/images/navigation/type-door.jpg"]; 

  return (
    <div className="min-h-screen bg-[#0F172A] font-sans selection:bg-teal-500/30">
      
      {/* === 1. HERO SECTION === */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F172A]/80 to-[#0F172A]"></div>
        {/* Бирюзовое свечение */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-600/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
           {/* Навигация */}
           <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 mb-8">
              <Link href="/" className="hover:text-white transition">Главная</Link>
              <ChevronRight className="w-3 h-3"/>
              <Link href="/services" className="hover:text-white transition">Услуги</Link>
              <ChevronRight className="w-3 h-3"/>
              <span className="text-teal-500 font-medium">Навигация</span>
           </div>

           <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div>
                 <div className="inline-block px-4 py-1.5 mb-6 text-xs font-bold text-teal-400 bg-teal-500/10 border border-teal-500/20 rounded-full uppercase tracking-wider">
                    Wayfinding Systems
                 </div>
                 <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    Понятная навигация <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">для вашего бизнеса</span>
                 </h1>
                 <p className="text-gray-400 text-lg mb-8 leading-relaxed max-w-xl">
                    Помогаем вашим клиентам не заблудиться. Разрабатываем и производим стильные системы навигации для БЦ, ТРЦ, отелей и офисов. От таблички на дверь до этажных планов.
                 </p>
                 
                 <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/calculator" className="flex items-center justify-center gap-2 bg-teal-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-teal-700 transition shadow-lg shadow-teal-900/20 active:scale-95">
                       <Calculator className="w-5 h-5"/> Рассчитать проект
                    </Link>
                    <a href="https://wa.me/77071356701" target="_blank" className="flex items-center justify-center gap-2 border border-slate-700 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition">
                       <MessageCircle className="w-5 h-5 text-green-500"/> Консультация
                    </a>
                 </div>
              </div>

              {/* Визуал: СЛАЙДЕР */}
              <div className="relative aspect-square rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden group shadow-2xl shadow-teal-900/10">
                 <HeroSlideshow images={displayHeroImages} />
                 
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none"></div>
                 <div className="absolute bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur border border-slate-700 p-4 rounded-xl flex items-center gap-4 pointer-events-none z-20">
                    <div className="w-12 h-12 bg-teal-500/10 rounded-full flex items-center justify-center text-teal-500"><Map className="w-6 h-6"/></div>
                    <div><div className="text-white font-bold">Умная логистика</div><div className="text-gray-400 text-xs">Удобство посетителей</div></div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 2. КЛИЕНТЫ */}
      <ClientsMarquee />

      {/* 3. CONCEPT (ПОЧЕМУ ЭТО ВАЖНО) */}
      <section className="py-24 bg-slate-950">
         <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
               <div className="lg:w-1/2">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Навигация — это не просто таблички</h2>
                  <p className="text-gray-400 text-lg leading-relaxed mb-8">
                     Это забота о клиенте. Если человек не может найти туалет или нужный кабинет за 30 секунд, он испытывает стресс.
                  </p>
                  
                  <div className="grid gap-4">
                     <div className="bg-slate-900/50 border border-teal-500/20 p-4 rounded-xl flex items-center gap-4">
                        <div className="p-2 bg-teal-500/10 rounded-lg text-teal-400"><Layout className="w-6 h-6"/></div>
                        <div>
                           <h4 className="text-white font-bold">Зонирование</h4>
                           <p className="text-gray-400 text-sm">Разделяем потоки людей, выделяем зоны ожидания и сервиса.</p>
                        </div>
                     </div>
                     <div className="bg-slate-900/50 border border-teal-500/20 p-4 rounded-xl flex items-center gap-4">
                        <div className="p-2 bg-teal-500/10 rounded-lg text-teal-400"><ArrowUpRight className="w-6 h-6"/></div>
                        <div>
                           <h4 className="text-white font-bold">Интуитивность</h4>
                           <p className="text-gray-400 text-sm">Указатели должны быть там, где возникает вопрос "куда идти?".</p>
                        </div>
                     </div>
                  </div>
               </div>
               
               {/* Схема (Абстракция) */}
               <div className="lg:w-1/2 w-full">
                  <div className="relative aspect-video bg-[#0B1120] rounded-3xl border border-slate-800 p-8 flex items-center justify-center overflow-hidden">
                     {/* Линии путей */}
                     <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M10,90 Q30,90 30,70 T50,50 T70,30 T90,10" stroke="#14b8a6" strokeWidth="1" fill="none" strokeDasharray="4 4"/>
                        <path d="M10,10 Q30,10 30,30 T50,50 T70,70 T90,90" stroke="#14b8a6" strokeWidth="1" fill="none" strokeDasharray="4 4"/>
                     </svg>
                     
                     <div className="relative z-10 grid grid-cols-3 gap-8 text-center">
                         <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-white mb-2 border border-slate-700">A</div>
                            <span className="text-xs text-gray-500">Вход</span>
                         </div>
                         <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center text-white mb-2 shadow-lg shadow-teal-500/20 animate-pulse">
                               <MapPin className="w-8 h-8"/>
                            </div>
                            <span className="text-xs text-teal-400 font-bold">Цель</span>
                         </div>
                         <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-white mb-2 border border-slate-700">B</div>
                            <span className="text-xs text-gray-500">Выход</span>
                         </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 4. КАТАЛОГ ТИПОВ (С ФОТО) */}
      <section className="py-24 bg-[#0F172A]">
         <div className="container mx-auto px-4">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Элементы навигации</h2>
               <p className="text-gray-400">Единый стиль для всего здания</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
               {NAV_TYPES.map((type, i) => (
                  <div 
                    key={i} 
                    className="group relative h-[300px] rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 cursor-default"
                  >
                     <Image 
                        src={type.image} 
                        alt={type.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                     <div className="absolute inset-0 p-8 flex flex-col justify-end">
                        <div className="absolute top-4 right-4 bg-teal-600/90 backdrop-blur text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                           {type.tag}
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-teal-400 transition-colors">{type.title}</h3>
                        <p className="text-sm text-gray-300 leading-relaxed opacity-90">
                           {type.desc}
                        </p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 5. МАТЕРИАЛЫ */}
      <section className="py-24 bg-slate-950 border-y border-slate-800">
         <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">Из чего мы это делаем</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
               <div className="bg-[#0B1120] p-8 rounded-3xl border border-slate-800 hover:border-teal-500/30 transition group">
                  <div className="w-14 h-14 bg-teal-500/10 flex items-center justify-center mb-6 text-teal-500 rounded-xl"><Scan className="w-7 h-7"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">Rowmark (Гравировка)</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                     Двухслойный пластик (США). Лазер выжигает верхний слой, открывая нижний цвет. Имитация металла (золото/серебро). Вечная классика.
                  </p>
               </div>
               <div className="bg-[#0B1120] p-8 rounded-3xl border border-slate-800 hover:border-blue-500/30 transition group">
                  <div className="w-14 h-14 bg-blue-500/10 flex items-center justify-center mb-6 text-blue-500 rounded-xl"><Layers className="w-7 h-7"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">Акрил и Оргстекло</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                     Прозрачный, цветной или молочный акрил. Выглядит как стекло, но безопаснее. Крепится на дистанционные держатели.
                  </p>
               </div>
               <div className="bg-[#0B1120] p-8 rounded-3xl border border-slate-800 hover:border-orange-500/30 transition group">
                  <div className="w-14 h-14 bg-orange-500/10 flex items-center justify-center mb-6 text-orange-500 rounded-xl"><Repeat className="w-7 h-7"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">Сменные модули</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                     Алюминиевые профили (Rainbow и др.). Позволяют легко менять бумажную вставку или пластину с именем сотрудника.
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* 6. ЦЕНЫ */}
      <section className="py-24 bg-[#0F172A]">
         <div className="container mx-auto px-4">
             <div className="max-w-5xl mx-auto bg-teal-900/10 border border-teal-500/20 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row gap-12 items-center">
                <div className="md:w-1/2">
                   <h2 className="text-3xl font-bold text-white mb-4">Популярные позиции</h2>
                   <p className="text-teal-200 mb-6">
                      Минимальный заказ от 15 000 ₸. Скидки на объем для бизнес-центров.
                   </p>
                   <ul className="space-y-3">
                      <li className="flex justify-between text-sm border-b border-teal-500/20 pb-2">
                         <span className="text-gray-300">Табличка на дверь (ПВХ + Пленка)</span>
                         <span className="text-white font-bold">от 2 500 ₸</span>
                      </li>
                      <li className="flex justify-between text-sm border-b border-teal-500/20 pb-2">
                         <span className="text-gray-300">Табличка Rowmark (Золото/Серебро)</span>
                         <span className="text-white font-bold">от 5 500 ₸</span>
                      </li>
                      <li className="flex justify-between text-sm border-b border-teal-500/20 pb-2">
                         <span className="text-gray-300">Указатель на дистанционерах (Акрил)</span>
                         <span className="text-white font-bold">от 8 000 ₸</span>
                      </li>
                   </ul>
                </div>

                <div className="md:w-1/2 text-center">
                   <div className="w-20 h-20 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-teal-500/30 animate-pulse">
                      <Calculator className="w-10 h-10 text-white"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-2">Комплексный расчет</h3>
                   <p className="text-gray-400 text-sm mb-6">Пришлите план помещения — мы расставим указатели и посчитаем смету.</p>
                   <Link href="/calculator" className="inline-flex items-center justify-center px-8 py-3 bg-white text-teal-900 font-bold rounded-xl hover:bg-teal-50 transition">
                      Отправить план
                   </Link>
                </div>
             </div>
         </div>
      </section>

      {/* 8. ГАЛЕРЕЯ */}
      <section className="py-24 bg-slate-950">
          <div className="container mx-auto px-4 mb-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Примеры навигации</h2>
              <p className="text-gray-400">Работы для офисов и клиник</p>
          </div>
          <div className="container mx-auto px-4">
             {/* Проверяем наличие картинок */}
             {galleryImages.length > 0 ? (
                <ImageGallery images={galleryImages} /> 
             ) : (
                <div className="text-center text-gray-500 py-12 border border-dashed border-slate-800 rounded-2xl">
                   Загрузите фото в папку public/images/navigation
                </div>
             )}
          </div>
      </section>

      {/* 9. ОТЗЫВЫ И CTA */}
      <ReviewsCarousel />
      <ServicesCarousel title="Другие услуги" subtitle="Комплексное оформление" hiddenLink="/services/navigation"/>
      <CallToAction source="Услуга: Навигация" />

    </div>
  );
}