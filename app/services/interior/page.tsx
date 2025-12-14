import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next"; // Типизация
import { 
  Calculator, 
  CheckCircle, 
  ArrowRight, 
  ChevronRight, 
  Gem,            
  ScanEye,        
  Zap,
  Clock,
  Plug,           
  Scissors,       
  Palette,
  Briefcase,      
  MapPin,         
  Building2,      
  Drill,
  HelpCircle,     // New
  ChevronDown     // New
} from "lucide-react";

// --- ИМПОРТ КЛИЕНТСКИХ КОМПОНЕНТОВ ---
import ClientsMarquee from "@/components/ClientsMarquee";
import CallToAction from "@/components/CallToAction";
import ServicesCarousel from "@/components/ServicesCarousel";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import DesignCodeBlock from "@/components/DesignCodeBlock";
import ImageGallery from "@/components/ImageGallery";
import HeroSlideshow from "@/components/HeroSlideshow";
import HeroButtons from "@/components/HeroButtons";

// --- СЕРВЕРНАЯ УТИЛИТА ---
import { getImagesFromFolder } from "@/lib/serverUtils";

// --- ДАННЫЕ СТРАНИЦЫ ---
const PAGE_DATA = {
  slug: "interior", 
  title: "Интерьерные вывески",
  subtitle: "Логотипы для зоны ресепшн и офиса. Безупречное качество сборки для взгляда с расстояния вытянутой руки.",
  // ВАЖНО: Цена 45 000
  price: "45 000" 
};

// 1. УЛУЧШЕННЫЕ METADATA
export const metadata: Metadata = {
  title: "Интерьерные вывески Астана | Логотип в офис от 45 000 тг",
  description: "Изготовление вывесок для зоны ресепшн и офисов. Объемные логотипы, акрил, нержавеющая сталь. Скрытый монтаж без проводов.",
  keywords: ["интерьерная вывеска", "логотип в офис", "вывеска на ресепшн", "офисная навигация", "брендирование офиса астана"],
  openGraph: {
    title: "Логотипы для офиса | Премиум качество",
    description: "Безупречная детализация для вашего бренда.",
    images: ["/images/interior/interior-09.webp"]
  }
};

// --- ТИПЫ ИНТЕРЬЕРНЫХ РЕШЕНИЙ ---
const INTERIOR_TYPES = [
  {
    title: "Логотип на Ресепшн",
    desc: "Визитная карточка офиса. Обычно это световые буквы или контражур на стене за стойкой администратора.",
    image: "/images/interior/interior-09.webp",
    tag: "Must Have"
  },
  {
    title: "Тонкие буквы (Акрил)",
    desc: "Изящные плоские буквы из цветного акрила (3-10 мм). Крепятся вплотную к стене. Бюджетно и стильно.",
    image: "/images/interior/interior-10.webp",
    tag: "Минимализм"
  },
  {
    title: "Металлические буквы",
    desc: "Нержавеющая сталь (золото/серебро). Подчеркивают статус и надежность компании. Часто используют юристы и банки.",
    image: "/images/interior/interior-05.webp",
    tag: "Премиум"
  },
  {
    title: "Офисная навигация",
    desc: "Таблички кабинетов, указатели зон, поэтажные планы. Единый стиль для всего бизнес-центра.",
    image: "/images/interior/interior-08.webp",
    tag: "Удобство"
  },
  {
    title: "Неоновый декор",
    desc: "Мотивирующие надписи или абстракции для зон отдыха, кофе-поинтов и креативных пространств.",
    image: "/images/interior/interior-07.webp",
    tag: "Атмосфера"
  },
  {
    title: "Панель-кронштейны",
    desc: "Маленькие двухсторонние флажки в коридорах. Помогают найти нужную дверь, идя вдоль длинного холла.",
    image: "/images/interior/interior-06.webp",
    tag: "Трафик"
  },
];

// --- [NEW] FAQ ДАННЫЕ (Добавил, так как в исходнике не было) ---
const FAQ_ITEMS = [
  {
    question: "Как спрятать провода?",
    answer: "Это самое важное в интерьере. Мы используем три метода: 1) Монтаж на стадии ремонта (закладка кабеля в стену), 2) Использование фальш-стены или подложки, 3) Микро-кабель-каналы в цвет стены или прозрачные провода.",
    icon: <Plug className="w-5 h-5 text-purple-500"/>
  },
  {
    question: "Можно ли клеить на обои или стекло?",
    answer: "Да. Для стекла мы используем специальный УФ-клей (невидим) или двусторонний скотч 3M. Для обоев и окрашенных стен — монтаж на дистанционные держатели или клей-герметик, который не портит поверхность.",
    icon: <Drill className="w-5 h-5 text-blue-500"/>
  },
  {
    question: "Какой срок изготовления?",
    answer: "Интерьерные вывески требуют ювелирной точности, поэтому срок — от 4 до 7 рабочих дней. Срочные заказы (например, к открытию офиса) обсуждаются индивидуально.",
    icon: <Clock className="w-5 h-5 text-pink-500"/>
  }
];

export default async function InteriorPage() {
  
  // 1. ПОЛУЧАЕМ ФОТО
  const galleryImages = getImagesFromFolder(PAGE_DATA.slug);

  // 2. ФОТО ДЛЯ HERO
  const heroImages = [...galleryImages].sort(() => 0.5 - Math.random()).slice(0, 15);
  const displayHeroImages = heroImages.length > 0 
    ? heroImages 
    : ["/images/calc/lightbox-1.jpg", "/images/calc/acryl.jpg"]; 

  // 3. ГЕНЕРАЦИЯ SCHEMA
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "name": "Интерьерная вывеска / Логотип в офис",
        "image": displayHeroImages[0],
        "description": "Изготовление логотипов для зоны ресепшн. Акрил, металл, световые буквы.",
        "brand": {
          "@type": "Brand",
          "name": "ADLight"
        },
        "offers": {
          "@type": "Offer",
          "url": "https://adlight.kz/services/interior",
          "priceCurrency": "KZT",
          "price": "45000",
          "availability": "https://schema.org/InStock"
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
    <div className="min-h-screen bg-[#0F172A] font-sans selection:bg-purple-500/30">
      
      {/* Вставляем Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* === 1. HERO SECTION === */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F172A]/80 to-[#0F172A]"></div>
        {/* Фиолетовое сияние */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
           {/* Навигация */}
           <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 mb-8">
              <Link href="/" className="hover:text-white transition">Главная</Link>
              <ChevronRight className="w-3 h-3"/>
              <Link href="/services" className="hover:text-white transition">Услуги</Link>
              <ChevronRight className="w-3 h-3"/>
              <span className="text-purple-500 font-medium">Интерьер</span>
           </div>

           <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div>
                 <div className="inline-block px-4 py-1.5 mb-6 text-xs font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 rounded-full uppercase tracking-wider">
                    Лицо вашего офиса
                 </div>
                 <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    Вывески для офиса <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">и зоны ресепшн</span>
                 </h1>
                 <p className="text-gray-400 text-lg mb-8 leading-relaxed max-w-xl">
                    Ювелирная работа с материалами. Изготавливаем логотипы, которые выглядят идеально даже с расстояния вытянутой руки. Никаких видимых проводов и клея.
                 </p>
                 
                 <HeroButtons source={PAGE_DATA.title} priceColor="purple" />

              </div>

              {/* Визуал: СЛАЙДЕР */}
              <div className="relative aspect-square rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden group shadow-2xl shadow-purple-900/10">
                 <HeroSlideshow images={displayHeroImages} />
                 
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none"></div>
                 <div className="absolute bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur border border-slate-700 p-4 rounded-xl flex items-center gap-4 pointer-events-none z-20">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-500"><ScanEye className="w-6 h-6"/></div>
                    <div><div className="text-white font-bold">Макро-качество</div><div className="text-gray-400 text-xs">Идеальная детализация</div></div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 2. КЛИЕНТЫ */}
      <ClientsMarquee />

      {/* 3. CONCEPT (КАЧЕСТВО ВБЛИЗИ) */}
      <section className="py-24 bg-slate-950">
         <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
               <div className="lg:w-1/2">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Здесь нельзя ошибиться</h2>
                  <p className="text-gray-400 text-lg leading-relaxed mb-8">
                     Уличная вывеска висит высоко — мелкие огрехи там не видны. В офисе клиент подходит к логотипу вплотную. 
                  </p>
                  <p className="text-white text-lg font-medium border-l-4 border-purple-500 pl-4 mb-8">
                     Кривой стык, капля клея или торчащий провод на стене ресепшена могут испортить впечатление о компании сильнее, чем плохой кофе.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center gap-3">
                        <Scissors className="w-5 h-5 text-blue-500"/>
                        <span className="text-sm text-gray-300">Лазерная резка 0.01мм</span>
                     </div>
                     <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center gap-3">
                        <Zap className="w-5 h-5 text-yellow-500"/>
                        <span className="text-sm text-gray-300">Полировка торцов</span>
                     </div>
                  </div>
               </div>
               
               {/* Сравнение (Схематично) */}
               <div className="lg:w-1/2 w-full grid grid-cols-2 gap-6">
                   <div className="bg-[#0B1120] p-6 rounded-3xl border border-slate-800 text-center opacity-50">
                      <div className="aspect-square bg-slate-800 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl grayscale">❌</div>
                      <h4 className="text-slate-400 font-bold">Обычная</h4>
                      <p className="text-xs text-slate-500 mt-2">Видны саморезы, стыки, провода поверх стены.</p>
                   </div>

                   <div className="bg-[#0B1120] p-6 rounded-3xl border border-purple-500/50 text-center relative overflow-hidden shadow-lg shadow-purple-900/20">
                      <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">ADLIGHT</div>
                      <div className="aspect-square bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl shadow-lg">💎</div>
                      <h4 className="text-white font-bold">Интерьерная</h4>
                      <p className="text-xs text-purple-200 mt-2">Скрытый крепеж, идеальный глянец, чистота.</p>
                   </div>
               </div>
            </div>
         </div>
      </section>

      {/* 4. КАТАЛОГ ТИПОВ (С ФОТО) */}
      <section className="py-24 bg-[#0F172A]">
         <div className="container mx-auto px-4">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Виды интерьерных вывесок</h2>
               <p className="text-gray-400">От таблички на дверь до светящегося бренда</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
               {INTERIOR_TYPES.map((type, i) => (
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
                        <div className="absolute top-4 right-4 bg-purple-600/90 backdrop-blur text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                           {type.tag}
                        </div>
                        
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">{type.title}</h3>
                        <p className="text-sm text-gray-300 leading-relaxed opacity-90">
                           {type.desc}
                        </p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 5. ТЕХНИЧЕСКИЙ БЛОК (МОНТАЖ) */}
      <section className="py-24 bg-slate-950 border-y border-slate-800">
         <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
               
               {/* Проблема: Провода */}
               <div className="bg-[#0B1120] p-8 rounded-3xl border border-slate-800 hover:border-blue-500 transition group">
                  <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-500"><Plug className="w-7 h-7"/></div>
                  <h3 className="text-xl font-bold text-white mb-4">Скрытая проводка</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                     Самое сложное в интерьерной вывеске — спрятать провода. Мы делаем микро-штробы или прячем коммуникации за фальш-стеной.
                  </p>
                  <div className="bg-blue-900/20 border border-blue-500/20 p-4 rounded-xl">
                     <p className="text-xs text-blue-200 font-bold">
                        Совет: Планируйте вывеску на этапе ремонта! Закладывайте вывод кабеля 220В в месте логотипа.
                     </p>
                  </div>
               </div>

               {/* Проблема: Стены */}
               <div className="bg-[#0B1120] p-8 rounded-3xl border border-slate-800 hover:border-orange-500 transition group">
                  <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6 text-orange-500"><Drill className="w-7 h-7"/></div>
                  <h3 className="text-xl font-bold text-white mb-4">Бережный монтаж</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                     Часто мы монтируем на дорогие венецианские штукатурки или деревянные панели. Наши монтажники работают в белых перчатках и с пылесосом.
                  </p>
                  <div className="bg-orange-900/20 border border-orange-500/20 p-4 rounded-xl">
                     <p className="text-xs text-orange-200 font-bold">
                        Опыт: Умеем крепить на стекло, зеркало и керамогранит без сверления (на спец. скотч 3M).
                     </p>
                  </div>
               </div>

            </div>
         </div>
      </section>

      {/* 6. ЦЕНЫ */}
      <section className="py-24 bg-[#0F172A]">
         <div className="container mx-auto px-4">
             <div className="max-w-5xl mx-auto bg-purple-900/10 border border-purple-500/20 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row gap-12 items-center">
                <div className="md:w-1/2">
                   <h2 className="text-3xl font-bold text-white mb-4">Сколько это стоит?</h2>
                   <p className="text-purple-200 mb-6">
                      Цена зависит от материала и высоты букв. Вот примеры для логотипа шириной 1 метр.
                   </p>
                   <ul className="space-y-3">
                      <li className="flex justify-between text-sm border-b border-purple-500/20 pb-2">
                         <span className="text-gray-300">Плоский акрил 5мм (без света)</span>
                         <span className="text-white font-bold">~35 000 ₸</span>
                      </li>
                      <li className="flex justify-between text-sm border-b border-purple-500/20 pb-2">
                         <span className="text-gray-300">Световой короб (логотип)</span>
                         <span className="text-white font-bold">~55 000 ₸</span>
                      </li>
                      <li className="flex justify-between text-sm border-b border-purple-500/20 pb-2">
                         <span className="text-gray-300">Отдельные световые буквы</span>
                         <span className="text-white font-bold">~95 000 ₸</span>
                      </li>
                   </ul>
                </div>

                <div className="md:w-1/2 text-center">
                   <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-purple-500/30 animate-pulse">
                      <Calculator className="w-10 h-10 text-white"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-2">Пришлите фото стены</h3>
                   <p className="text-gray-400 text-sm mb-6">Мы сделаем бесплатную фотопривязку (покажем, как логотип будет смотреться в интерьере).</p>
                   <Link href="/calculator" className="inline-flex items-center justify-center px-8 py-3 bg-white text-purple-900 font-bold rounded-xl hover:bg-purple-50 transition">
                      Заказать макет
                   </Link>
                </div>
             </div>
         </div>
      </section>

      {/* === [NEW] БЛОК 6.5: FAQ === */}
      <section className="py-24 bg-[#0B1221]">
         <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-center mb-12">
               <h2 className="text-3xl font-bold text-white mb-4">Важные вопросы</h2>
               <p className="text-gray-400">Что нужно знать перед заказом</p>
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

      {/* 7. ГАЛЕРЕЯ */}
      <section className="py-24 bg-slate-950">
         <div className="container mx-auto px-4 mb-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Примеры в интерьере</h2>
            <p className="text-gray-400">Офисы, магазины и салоны Астаны</p>
         </div>
         <div className="container mx-auto px-4">
            {/* Проверяем наличие картинок */}
            {galleryImages.length > 0 ? (
               <ImageGallery images={galleryImages} /> 
            ) : (
               <div className="text-center text-gray-500 py-12 border border-dashed border-slate-800 rounded-2xl">
                  Загрузите фото в папку public/images/interior
               </div>
            )}
         </div>
      </section>

      {/* 8. ОТЗЫВЫ И CTA */}
      <ReviewsCarousel />
      <ServicesCarousel title="Другие услуги" subtitle="Комплексное оформление" hiddenLink="/services/interior"/>
      <CallToAction source="Услуга: Интерьер" />

    </div>
  );
}