import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next"; // Типизация
import { 
  Calculator, 
  CheckCircle, 
  ArrowRight, 
  ChevronRight, 
  MapPin,         
  Navigation,     
  Construction,   
  Car,            
  Zap,
  Fuel,           
  Building,       
  Landmark,       
  ShieldCheck,
  Anchor,
  HelpCircle,     // New for FAQ
  ChevronDown     // New for FAQ
} from "lucide-react";

// --- ИМПОРТ КОМПОНЕНТОВ ---
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
  slug: "pylons", 
  title: "Рекламные стелы и пилоны",
  subtitle: "Навигация городского масштаба. От придорожных указателей до монументальных въездных групп.",
  price: "30 000" // Цена за м2 обшивки или старт за проект
};

// 1. УЛУЧШЕННЫЕ METADATA
export const metadata: Metadata = {
  title: "Рекламные стелы и пилоны в Астане | Изготовление и Монтаж",
  description: "Производство уличных стел для АЗС, ТРЦ, автосалонов. Расчет фундамента и ветровых нагрузок. Согласование с городом. Цена от 30 000 тг/м².",
  keywords: ["рекламная стела", "пилон уличный", "стела азс цена", "въездная группа", "навигационный пилон", "рекламная конструкция"],
  openGraph: {
    title: "Стелы и Пилоны | Навигация XL формата",
    description: "Монументальные конструкции, которые видно за 300 метров.",
    images: ["/images/pylons/pylons-05.webp"]
  }
};

// --- ТИПЫ КОНСТРУКЦИЙ ---
const PYLON_TYPES = [
  {
    title: "Стела для ТРЦ",
    desc: "Гигантские конструкции (10-30м) с логотипом молла и лайтбоксами арендаторов. Маяк для покупателей.",
    image: "/images/pylons/pylons-05.webp", 
    icon: <Building className="w-6 h-6 text-blue-500"/>,
    tag: "Масштаб"
  },
  {
    title: "Стела АЗС",
    desc: "Информационное табло с ценами на топливо. Встраиваем яркие LED-модули для смены цен с пульта.",
    image: "/images/pylons/pylons-04.webp", 
    icon: <Fuel className="w-6 h-6 text-orange-500"/>,
    tag: "Функционал"
  },
  {
    title: "Автосалоны (Бренд-пилон)",
    desc: "Строгое соответствие брендбуку автодилера. Идеальная геометрия, композитные материалы, статус.",
    image: "/images/pylons/pylons-01.webp", 
    icon: <Car className="w-6 h-6 text-red-500"/>,
    tag: "Статус"
  },
  {
    title: "Пилон Бизнес-Центра",
    desc: "Навигационная конструкция у входа. Список компаний, схема проезда. Обычно 2-4 метра высотой.",
    image: "/images/pylons/pylons-02.webp", 
    icon: <MapPin className="w-6 h-6 text-purple-500"/>,
    tag: "Навигация"
  },
  {
    title: "Въездная группа (Город)",
    desc: "Монументальные бетонные или металлические стелы с названием города/поселка и гербом.",
    image: "/images/pylons/pylons-03.webp", 
    icon: <Landmark className="w-6 h-6 text-yellow-500"/>,
    tag: "Символ"
  },
  {
    title: "Уличный указатель",
    desc: "Компактные пилоны-стрелки. Помогают найти заезд на парковку или вход в здание.",
    image: "/images/pylons/pylons-06.webp", 
    icon: <Navigation className="w-6 h-6 text-green-500"/>,
    tag: "Трафик"
  },
];

// --- [NEW] FAQ ДАННЫЕ ---
const FAQ_ITEMS = [
  {
    question: "Нужно ли разрешение?",
    answer: "Да, стела — это отдельно стоящая рекламная конструкция. Требуется получение АПЗ (Архитектурно-планировочное задание), согласование эскиза и отвод земли (если стоит на городской территории). Мы помогаем с документами.",
    icon: <ShieldCheck className="w-5 h-5 text-green-500"/>
  },
  {
    question: "Какой нужен фундамент?",
    answer: "Зависит от высоты и парусности. Для пилонов до 3м достаточно бетонной подушки. Для стел 10м+ мы заливаем армированный фундамент с закладными анкерами на глубину промерзания (обязателен проект КМ/КЖ).",
    icon: <Anchor className="w-5 h-5 text-blue-500"/>
  },
  {
    question: "Из чего сделан каркас?",
    answer: "Только толстостенный металл (швеллер, двутавр, профильная труба). Каркас покрывается антикоррозийным грунтом. Обшивка — алюминиевый композит, который не выгорает и держит форму.",
    icon: <Construction className="w-5 h-5 text-orange-500"/>
  }
];

export default async function PylonsPage() {
  
  // 1. ПОЛУЧАЕМ ФОТО
  const galleryImages = getImagesFromFolder(PAGE_DATA.slug);

  // 2. ФОТО ДЛЯ HERO
  const heroImages = [...galleryImages].sort(() => 0.5 - Math.random()).slice(0, 15);
  const displayHeroImages = heroImages.length > 0 
    ? heroImages 
    : ["/kmg.jpeg", "/images/calc/lightbox-1.jpg"];

  // 3. ГЕНЕРАЦИЯ SCHEMA (Service + FAQ)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "name": "Изготовление рекламных стел и пилонов",
        "provider": {
          "@type": "LocalBusiness",
          "name": "ADLight"
        },
        "description": "Проектирование и монтаж уличных стел, пилонов для АЗС и ТРЦ.",
        "offers": {
          "@type": "Offer",
          "url": "https://adlight.kz/services/pylons",
          "priceCurrency": "KZT",
          "price": "30000", // Базовая цена за м2 обшивки
          "priceValidUntil": "2026-12-31",
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
    <div className="min-h-screen bg-[#0F172A] font-sans selection:bg-blue-500/30">
      
      {/* Вставляем Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* === 1. HERO SECTION === */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F172A]/80 to-[#0F172A]"></div>
        {/* Синее свечение */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
           {/* Навигация */}
           <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 mb-8">
              <Link href="/" className="hover:text-white transition">Главная</Link>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4"/>
              <Link href="/services" className="hover:text-white transition">Услуги</Link>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4"/>
              <span className="text-blue-500 font-medium">Стелы и Пилоны</span>
           </div>

           <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div>
                 <div className="inline-block px-4 py-1.5 mb-6 text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full uppercase tracking-wider">
                    Навигация XL формата
                 </div>
                 <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    Рекламные стелы <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">и пилоны</span>
                 </h1>
                 <p className="text-gray-400 text-lg mb-8 leading-relaxed max-w-xl">
                    Крупногабаритные конструкции, которые видно за 300 метров. Обозначают въезд, показывают цены и статус компании.
                 </p>
                 
                 <HeroButtons source={PAGE_DATA.title} priceColor="blue" />

              </div>

              {/* Визуал: СЛАЙДЕР */}
              <div className="relative aspect-[4/5] md:aspect-square rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden group shadow-2xl shadow-blue-900/10">
                 <HeroSlideshow images={displayHeroImages} />
                 
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none"></div>
                 <div className="absolute bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur border border-slate-700 p-4 rounded-xl flex items-center gap-4 pointer-events-none z-20">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500"><MapPin className="w-6 h-6"/></div>
                    <div><div className="text-white font-bold">Точка на карте</div><div className="text-gray-400 text-xs">Заметность 100%</div></div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 2. КЛИЕНТЫ */}
      <ClientsMarquee />

      {/* 3. CONCEPT (ФУНКЦИИ) */}
      <section className="py-24 bg-slate-950">
         <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
               <div className="lg:w-1/2">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Зачем нужна стела?</h2>
                  <p className="text-gray-400 text-lg leading-relaxed mb-8">
                     Когда вывеска на фасаде не видна с дороги, на помощь приходит стела. Это отдельно стоящий "маяк", который сообщает водителю: <span className="text-white font-medium">"Мы здесь, поворачивай!"</span>.
                  </p>
                  
                  <div className="grid gap-4">
                     <div className="bg-slate-900/50 border border-blue-500/20 p-4 rounded-xl flex items-center gap-4">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><Car className="w-6 h-6"/></div>
                        <div>
                           <h4 className="text-white font-bold">Ловит автомобильный трафик</h4>
                           <p className="text-gray-400 text-sm">Водитель замечает стелу за 10-15 секунд до поворота.</p>
                        </div>
                     </div>
                     <div className="bg-slate-900/50 border border-blue-500/20 p-4 rounded-xl flex items-center gap-4">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><Navigation className="w-6 h-6"/></div>
                        <div>
                           <h4 className="text-white font-bold">Указывает путь</h4>
                           <p className="text-gray-400 text-sm">Помогает найти заезд на парковку или вход в ТРЦ.</p>
                        </div>
                     </div>
                  </div>
               </div>
               
               {/* Схема */}
               <div className="lg:w-1/2 w-full">
                  <div className="relative aspect-video bg-[#0B1120] rounded-3xl border border-slate-800 p-8 flex items-center justify-center overflow-hidden">
                     {/* Дорога */}
                     <div className="absolute bottom-0 w-full h-24 bg-slate-800 transform -skew-x-12 origin-bottom-left"></div>
                     <div className="absolute bottom-10 w-full h-0 border-t-2 border-dashed border-slate-500/50 transform -skew-x-12 origin-bottom-left"></div>
                     
                     {/* Стела */}
                     <div className="relative z-10 w-16 h-48 bg-blue-600 rounded-t-lg shadow-[0_0_50px_rgba(37,99,235,0.4)] flex flex-col items-center justify-start pt-4">
                        <div className="w-10 h-10 bg-white rounded-full mb-4"></div>
                        <div className="w-12 h-2 bg-white/30 rounded mb-1"></div>
                        <div className="w-12 h-2 bg-white/30 rounded mb-1"></div>
                        <div className="w-12 h-2 bg-white/30 rounded"></div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 4. КАТАЛОГ РЕШЕНИЙ (С ФОТО) */}
      <section className="py-24 bg-[#0F172A]">
         <div className="container mx-auto px-4">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Типы конструкций</h2>
               <p className="text-gray-400">От небольшого пилона до гиганта на трассе</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
               {PYLON_TYPES.map((type, i) => (
                  <div 
                    key={i} 
                    className="group relative h-[350px] rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 cursor-default"
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
                        <div className="mb-auto bg-slate-900/50 backdrop-blur w-12 h-12 rounded-xl flex items-center justify-center border border-white/10 group-hover:bg-blue-500/20 group-hover:border-blue-500/50 transition">
                           {type.icon}
                        </div>
                        
                        <div className="absolute top-4 right-4 bg-blue-600/90 backdrop-blur text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                           {type.tag}
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{type.title}</h3>
                        <p className="text-sm text-gray-300 leading-relaxed opacity-90">
                           {type.desc}
                        </p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 5. ТЕХНИЧЕСКИЙ БЛОК (СТРОЙКА) */}
      <section className="py-24 bg-slate-950 border-y border-slate-800">
         <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">Серьезная инженерия</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
               <div className="bg-[#0B1120] p-8 rounded-3xl border border-slate-800 hover:border-blue-500/30 transition group">
                  <div className="w-14 h-14 bg-blue-500/10 flex items-center justify-center mb-6 text-blue-500 rounded-xl"><Anchor className="w-7 h-7"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">Фундамент</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                     Стела испытывает огромные ветровые нагрузки. Мы заливаем армированный бетонный фундамент на глубину промерзания или используем сваи.
                  </p>
               </div>
               <div className="bg-[#0B1120] p-8 rounded-3xl border border-slate-800 hover:border-orange-500/30 transition group">
                  <div className="w-14 h-14 bg-orange-500/10 flex items-center justify-center mb-6 text-orange-500 rounded-xl"><Construction className="w-7 h-7"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">Силовой каркас</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                     В основе — пространственная ферма из швеллера или профильной трубы. Металл грунтуется и красится для защиты от коррозии.
                  </p>
               </div>
               <div className="bg-[#0B1120] p-8 rounded-3xl border border-slate-800 hover:border-green-500/30 transition group">
                  <div className="w-14 h-14 bg-green-500/10 flex items-center justify-center mb-6 text-green-500 rounded-xl"><ShieldCheck className="w-7 h-7"/></div>
                  <h3 className="text-xl font-bold text-white mb-3">Обшивка</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                     Используем алюминиевый композит (Алюкобонд). Он не деформируется на солнце, легко моется и имеет идеальную плоскость.
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* 6. ЦЕНЫ */}
      <section className="py-24 bg-[#0F172A]">
         <div className="container mx-auto px-4">
             <div className="max-w-5xl mx-auto bg-blue-900/10 border border-blue-500/20 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row gap-12 items-center">
                <div className="md:w-1/2">
                   <h2 className="text-3xl font-bold text-white mb-4">Стоимость изготовления</h2>
                   <p className="text-blue-200 mb-6">
                      Цена зависит от высоты, площади и типа фундамента.
                   </p>
                   <ul className="space-y-3">
                      <li className="flex justify-between text-sm border-b border-blue-500/20 pb-2">
                         <span className="text-gray-300">Средняя цена за м² (обшивка)</span>
                         <span className="text-white font-bold">от {PAGE_DATA.price} ₸</span>
                      </li>
                      <li className="flex justify-between text-sm border-b border-blue-500/20 pb-2">
                         <span className="text-gray-300">Навигационный пилон (2м)</span>
                         <span className="text-white font-bold">от 180 000 ₸</span>
                      </li>
                      <li className="flex justify-between text-sm border-b border-blue-500/20 pb-2">
                         <span className="text-gray-300">Рекламная стела (6м)</span>
                         <span className="text-white font-bold">от 850 000 ₸</span>
                      </li>
                   </ul>
                </div>

                <div className="md:w-1/2 text-center">
                   <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/30 animate-pulse">
                      <Calculator className="w-10 h-10 text-white"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-2">Точный расчет</h3>
                   <p className="text-gray-400 text-sm mb-6">Нужен проект фундамента и конструктив. Мы сделаем расчет бесплатно.</p>
                   <Link href="/calculator" className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-900 font-bold rounded-xl hover:bg-blue-50 transition">
                      Рассчитать стелу
                   </Link>
                </div>
             </div>
         </div>
      </section>

      {/* 7. ДИЗАЙН КОД */}
      <DesignCodeBlock />

      {/* === [NEW] БЛОК 7.5: FAQ === */}
      <section className="py-24 bg-[#0B1221]">
         <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-center mb-12">
               <h2 className="text-3xl font-bold text-white mb-4">Вопросы о стелах</h2>
            </div>
            <div className="space-y-4">
               {FAQ_ITEMS.map((item, index) => (
                  <details key={index} className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-300 open:border-blue-500/30 open:bg-slate-900/80">
                     <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-slate-800/50 transition">
                        <div className="flex items-center gap-4">
                           <div className="p-2 bg-slate-800 rounded-lg group-open:bg-blue-500/10 transition">
                              {item.icon}
                           </div>
                           <span className="font-bold text-white text-base md:text-lg group-open:text-blue-500 transition">{item.question}</span>
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

      {/* 8. ГАЛЕРЕЯ */}
      <section className="py-24 bg-slate-950">
         <div className="container mx-auto px-4 mb-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Фотогалерея</h2>
            <p className="text-gray-400">Стелы и пилоны в Астане</p>
         </div>
         <div className="container mx-auto px-4">
            {galleryImages.length > 0 ? (
               <ImageGallery images={galleryImages} /> 
            ) : (
               <div className="text-center text-gray-500 py-12 border border-dashed border-slate-800 rounded-2xl">
                  Загрузите фото в папку public/images/pylons
               </div>
            )}
         </div>
      </section>

      {/* 9. ОТЗЫВЫ И CTA */}
      <ReviewsCarousel />
      <ServicesCarousel title="Другие услуги" subtitle="Комплексное оформление" hiddenLink="/services/pylons"/>
      <CallToAction source="Услуга: Стелы" />

    </div>
  );
}