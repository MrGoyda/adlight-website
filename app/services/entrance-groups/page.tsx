import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next"; // Типизация
import { 
  Calculator, 
  CheckCircle, 
  ArrowRight, 
  ChevronRight, 
  Umbrella,       
  Store,          
  Frame,          
  Lightbulb,      
  Signpost,       
  LayoutDashboard, 
  Search,        
  PenTool,       
  FileText,      
  Hammer,        
  Flag,
  HelpCircle,    // New for FAQ
  ChevronDown    // New for FAQ
} from "lucide-react";

// --- ИМПОРТ КОМПОНЕНТОВ ---
import ClientsMarquee from "@/components/ClientsMarquee";
import DesignCodeBlock from "@/components/DesignCodeBlock";
import CallToAction from "@/components/CallToAction";
import ServicesCarousel from "@/components/ServicesCarousel";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import ImageGallery from "@/components/ImageGallery";
import HeroSlideshow from "@/components/HeroSlideshow";
import HeroButtons from "@/components/HeroButtons";

// --- СЕРВЕРНАЯ УТИЛИТА ---
import { getImagesFromFolder } from "@/lib/serverUtils";

// --- ДАННЫЕ СТРАНИЦЫ ---
const PAGE_DATA = {
  slug: "entrance-groups", 
  title: "Комплексные входные группы",
  subtitle: "Не просто вывеска, а полноценная рекламная оболочка. Создаем вход, в который хочется войти.",
  price: "Проектно" 
};

// 1. УЛУЧШЕННЫЕ METADATA
export const metadata: Metadata = {
  title: "Входные группы в Астане | Оформление фасадов под ключ | ADLight",
  description: "Комплексное оформление входной группы: обшивка композитом (алюкобонд), козырьки, вывески, архитектурная подсветка. Дизайн-проект и согласование в Акимате.",
  keywords: ["входная группа астана", "оформление фасада", "обшивка алюкобондом", "козырек над входом", "рекламное оформление магазина"],
  openGraph: {
    title: "Входные группы под ключ | ADLight",
    description: "Проектирование, производство и монтаж имиджевых входных групп.",
    images: ["/images/entrance-groups/entrance-groups-06.webp"]
  }
};

// --- СОСТАВ ВХОДНОЙ ГРУППЫ (Service Catalog) ---
const ENTRANCE_COMPONENTS = [
  {
    title: "Фасадная вывеска",
    desc: "Основной элемент идентификации. Объемные буквы или световой короб, который сообщает 'кто вы'.",
    image: "/images/entrance-groups/entrance-groups-06.webp", 
    icon: <LayoutDashboard className="w-6 h-6 text-blue-400"/>
  },
  {
    title: "Облицовка фасада",
    desc: "Композит, дерево или металлокассеты. Скрывает дефекты стены и создает фирменный фон.",
    image: "/images/entrance-groups/entrance-groups-04.webp", 
    icon: <Frame className="w-6 h-6 text-slate-400"/>
  },
  {
    title: "Козырек / Навес",
    desc: "Защита от снега и дождя + место для рекламы. Часто встраиваем в него точечное освещение.",
    image: "/images/entrance-groups/entrance-groups-03.webp", 
    icon: <Umbrella className="w-6 h-6 text-orange-400"/>
  },
  {
    title: "Оформление витрин",
    desc: "Пленки, постеры или инсталляции за стеклом. Работают на уровне глаз пешехода.",
    image: "/images/entrance-groups/entrance-groups-07.webp", 
    icon: <Store className="w-6 h-6 text-green-400"/>
  },
  {
    title: "Панель-кронштейн",
    desc: "Торцевой флажок, который ловит поток людей, идущих вдоль здания. Виден издалека.",
    image: "/images/entrance-groups/entrance-groups-02.webp", 
    icon: <Signpost className="w-6 h-6 text-purple-400"/>
  },
  {
    title: "Архитектурная подсветка",
    desc: "Контурный неон или прожекторы. Делает вход заметным и безопасным в темное время суток.",
    image: "/images/entrance-groups/entrance-groups-05.webp", 
    icon: <Lightbulb className="w-6 h-6 text-yellow-400"/>
  },
];

// --- [NEW] FAQ ДАННЫЕ (Для сложных услуг это критично) ---
const FAQ_ITEMS = [
  {
    question: "Нужно ли разрешение на входную группу?",
    answer: "Обязательно. Любое изменение фасада (обшивка, козырек) требует согласования эскизного проекта в Управлении Урбанистики. Мы разрабатываем проект и помогаем пройти процедуру согласования.",
    icon: <FileText className="w-5 h-5 text-red-500"/>
  },
  {
    question: "Чем лучше обшить фасад?",
    answer: "Самый популярный материал — алюминиевый композит (АКП / Алюкобонд). Он долговечен, не выцветает и имеет идеально ровную поверхность. Для эконом-вариантов используем профлист, для премиум — HPL панели или дерево.",
    icon: <Frame className="w-5 h-5 text-blue-500"/>
  },
  {
    question: "Делаете ли вы металлоконструкции?",
    answer: "Да, у нас свой сварочный цех. Мы варим каркасы для козырьков, входных порталов, лестниц и пандусов. Все рассчитывается с учетом ветровых и снеговых нагрузок Астаны.",
    icon: <Hammer className="w-5 h-5 text-orange-500"/>
  }
];

export default async function EntranceGroupsPage() {
  
  // 1. ПОЛУЧАЕМ ФОТО
  const galleryImages = getImagesFromFolder(PAGE_DATA.slug);

  // 2. ФОТО ДЛЯ HERO
  const heroImages = [...galleryImages].sort(() => 0.5 - Math.random()).slice(0, 15);
  const displayHeroImages = heroImages.length > 0 
    ? heroImages 
    : ["/images/calc/lightbox-1.jpg", "/images/calc/face.jpg"]; 

  // 3. ГЕНЕРАЦИЯ SCHEMA (Service + OfferCatalog + FAQ)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "name": "Оформление входных групп под ключ",
        "provider": {
            "@type": "LocalBusiness",
            "name": "ADLight"
        },
        "areaServed": "Астана",
        "description": "Проектирование, производство и монтаж входных групп: вывески, композит, козырьки.",
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Элементы входной группы",
            "itemListElement": ENTRANCE_COMPONENTS.map(item => ({
                "@type": "Offer",
                "itemOffered": {
                    "@type": "Service",
                    "name": item.title,
                    "description": item.desc
                }
            }))
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
              <span className="text-blue-500 font-medium">Входные группы</span>
           </div>

           <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div>
                 <div className="inline-block px-4 py-1.5 mb-6 text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full uppercase tracking-wider">
                    Архитектура продаж
                 </div>
                 <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    Оформляем так, что <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">хочется войти</span>
                 </h1>
                 <p className="text-gray-400 text-lg mb-8 leading-relaxed max-w-xl">
                    Входная группа — это не просто вывеска. Это система визуального контакта, которая работает, даже когда у вас нет другой рекламы. Мы проектируем, строим и подсвечиваем лицо вашего бизнеса.
                 </p>
                 
                 <HeroButtons source={PAGE_DATA.title} priceColor="blue" />

              </div>

              {/* Визуал: СЛАЙДЕР */}
              <div className="relative aspect-square rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden group shadow-2xl shadow-blue-900/10">
                 <HeroSlideshow images={displayHeroImages} />
                 
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none"></div>
                 <div className="absolute bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur border border-slate-700 p-4 rounded-xl flex items-center gap-4 pointer-events-none z-20">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500"><Store className="w-6 h-6"/></div>
                    <div><div className="text-white font-bold">Комплексный подход</div><div className="text-gray-400 text-xs">От дизайна до монтажа</div></div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 2. КЛИЕНТЫ */}
      <ClientsMarquee />

      {/* 3. ФИЛОСОФИЯ (ATMOSPHERE) */}
      <section className="py-24 bg-slate-950">
         <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-[#0B1120] to-[#1a2035] rounded-3xl p-8 md:p-12 border border-slate-800 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none"></div>
               
               <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
                  <div>
                     <h2 className="text-3xl font-bold text-white mb-6">Вывески не читают — их чувствуют</h2>
                     <p className="text-gray-400 text-lg leading-relaxed mb-6">
                        Иногда одного взгляда на вход достаточно, чтобы понять: "сюда стоит зайти". Или наоборот — пройти мимо.
                     </p>

                     <p className="text-gray-300 mb-8 border-l-4 border-blue-500 pl-4 italic">
                        "То, как оформлен вход, решает судьбу первой покупки. Если оформление вызывает доверие — человек заходит. Если нет — уходит к конкуренту."
                     </p>
                     
                     <div className="flex flex-wrap gap-4">
                        <div className="bg-slate-900/80 px-4 py-2 rounded-full border border-slate-700 text-sm text-white flex items-center gap-2">
                           <CheckCircle className="w-4 h-4 text-green-500"/> Навигация
                        </div>
                        <div className="bg-slate-900/80 px-4 py-2 rounded-full border border-slate-700 text-sm text-white flex items-center gap-2">
                           <CheckCircle className="w-4 h-4 text-green-500"/> Имидж
                        </div>
                        <div className="bg-slate-900/80 px-4 py-2 rounded-full border border-slate-700 text-sm text-white flex items-center gap-2">
                           <CheckCircle className="w-4 h-4 text-green-500"/> Трафик
                        </div>
                     </div>
                  </div>
                  
                  {/* Схематичное изображение */}
                  <div className="relative h-[300px] bg-black rounded-2xl overflow-hidden border border-slate-700">
                     <Image 
                        src="/images/entrance-groups/3.webp" 
                        alt="Красивый вход в магазин" 
                        fill 
                        className="object-cover opacity-60"
                     />
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl text-center">
                           <div className="text-4xl font-bold text-white mb-1">24/7</div>
                           <div className="text-xs text-blue-200 uppercase tracking-wider">Работает на вас</div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 4. ЭКОСИСТЕМА ВХОДА (КАТАЛОГ) */}
      <section className="py-24 bg-[#0F172A] border-y border-slate-800">
         <div className="container mx-auto px-4">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Из чего состоит идеальный вход?</h2>
               <p className="text-gray-400">Мы собираем эти элементы в единую гармоничную систему</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
               {ENTRANCE_COMPONENTS.map((item, i) => (
                  <div 
                    key={i} 
                    className="group relative h-[320px] rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 cursor-default"
                  >
                     {/* ФОТО ФОНОМ */}
                     <Image 
                        src={item.image} 
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-50 group-hover:opacity-30"
                     />
                     
                     {/* ГРАДИЕНТ */}
                     <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/60 to-transparent"></div>

                     {/* КОНТЕНТ */}
                     <div className="absolute inset-0 p-8 flex flex-col justify-end">
                        <div className="mb-auto bg-slate-900/50 backdrop-blur w-12 h-12 rounded-xl flex items-center justify-center border border-white/10 group-hover:bg-blue-500/20 group-hover:border-blue-500/50 transition">
                           {item.icon}
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{item.title}</h3>
                        <p className="text-sm text-gray-300 leading-relaxed opacity-90">
                           {item.desc}
                        </p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 5. ПРОЦЕСС РАБОТЫ (TIMELINE) */}
      <section className="py-24 bg-slate-950">
         <div className="container mx-auto px-4">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Как мы работаем</h2>
               <p className="text-gray-400">6 шагов к обновлению вашего бизнеса</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
               {[
                  { id: 1, icon: <Search className="w-6 h-6"/>, title: "Анализ объекта", desc: "Выезжаем на замер, оцениваем фасад, потоки людей и видимость с дороги. Ищем 'слепые зоны'." },
                  { id: 2, icon: <Lightbulb className="w-6 h-6"/>, title: "Концепция", desc: "Подбираем материалы и цвета, которые соответствуют вашему бренду и архитектуре здания." },
                  { id: 3, icon: <PenTool className="w-6 h-6"/>, title: "Визуализация", desc: "Создаем 3D-макет. Вы увидите, как будет выглядеть вход днем и ночью, с разных ракурсов." },
                  { id: 4, icon: <FileText className="w-6 h-6"/>, title: "Смета и Договор", desc: "Честный расчет материалов и работ. Никаких скрытых доплат в процессе." },
                  { id: 5, icon: <Hammer className="w-6 h-6"/>, title: "Производство", desc: "Изготавливаем все элементы в своем цехе в Астане. Контроль качества на каждом этапе." },
                  { id: 6, icon: <Flag className="w-6 h-6"/>, title: "Монтаж и Сдача", desc: "Установка, подключение электрики, фотоотчет. Выдаем инструкцию по уходу." },
               ].map((step) => (
                  <div key={step.id} className="flex gap-4 p-6 rounded-2xl bg-[#0B1120] border border-slate-800 hover:border-blue-500/30 transition group">
                     <div className="shrink-0 w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-blue-500 font-bold text-lg border border-slate-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        {step.id}
                     </div>
                     <div>
                        <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                           {step.title}
                        </h4>
                        <p className="text-sm text-gray-400 leading-relaxed">{step.desc}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 6. ДИЗАЙН КОД */}
      <DesignCodeBlock />

      {/* === [NEW] БЛОК FAQ === */}
      <section className="py-24 bg-[#0B1221]">
         <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-center mb-12">
               <h2 className="text-3xl font-bold text-white mb-4">Частые вопросы</h2>
               <p className="text-gray-400">Что важно знать о входных группах</p>
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

      {/* 7. ГАЛЕРЕЯ */}
      <section className="py-24 bg-[#0F172A] border-t border-slate-800">
         <div className="container mx-auto px-4 mb-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Примеры работ</h2>
            <p className="text-gray-400">Входные группы, которые мы сделали</p>
         </div>
         <div className="container mx-auto px-4">
            {galleryImages.length > 0 ? (
               <ImageGallery images={galleryImages} /> 
            ) : (
               <div className="text-center text-gray-500 py-12 border border-dashed border-slate-800 rounded-2xl">
                  Загрузите фото в папку public/images/entrance-groups
               </div>
            )}
         </div>
      </section>

      {/* 8. ОТЗЫВЫ И CTA */}
      <ReviewsCarousel />
      <ServicesCarousel title="Другие услуги" subtitle="Комплексное оформление" hiddenLink="/services/entrance-groups"/>
      <CallToAction source="Услуга: Входные группы" />

    </div>
  );
}