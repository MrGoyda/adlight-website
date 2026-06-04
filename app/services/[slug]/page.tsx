// app/services/[slug]/page.tsx

import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import { getImagesFromFolder } from "@/lib/serverUtils";
import { SERVICES_DETAILS } from "@/dictionaries/services/service-details";

import { 
  Repeat, ShieldCheck, Maximize, Zap, Plug, Eye, Clock, 
  Drill, Scissors, Construction, Layers, Anchor, FileText, 
  Shield, Calculator, Umbrella, Lightbulb, Signpost, MapPin, 
  Store, Coins, FileCheck, HelpCircle, ChevronDown, CheckCircle,
  Play, ChevronRight, Sun, LayoutDashboard, Frame, Landmark,
  Navigation, Car, Fuel, Utensils, Monitor, Heart, Camera, Briefcase
} from "lucide-react";

// --- ИМПОРТ ГЛОБАЛЬНЫХ КОМПОНЕНТОВ ---
import ClientsMarquee from "@/components/ClientsMarquee";
import CallToAction from "@/components/CallToAction";
import ServicesCarousel from "@/components/ServicesCarousel";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import DesignCodeBlock from "@/components/DesignCodeBlock";
import ImageGallery from "@/components/ImageGallery";
import HeroSlideshow from "@/components/HeroSlideshow";
import HeroButtons from "@/components/HeroButtons";

const IconMap = {
  Repeat, ShieldCheck, Maximize, Zap, Plug, Eye, Clock, 
  Drill, Scissors, Construction, Layers, Anchor, FileText, 
  Shield, Calculator, Umbrella, Lightbulb, Signpost, MapPin, 
  Store, Coins, FileCheck, HelpCircle, ChevronDown, CheckCircle,
  Play, ChevronRight, Sun, LayoutDashboard, Frame, Landmark,
  Navigation, Car, Fuel, Utensils, Monitor, Heart, Camera
};

function renderIcon(iconName: string, className = "w-6 h-6") {
  const IconComponent = IconMap[iconName as keyof typeof IconMap] || HelpCircle;
  return <IconComponent className={className} />;
}

// Light theme color schemes mapping
const colorSchemes = {
  blue: {
    selectionBg: "selection:bg-blue-500/10 selection:text-blue-600",
    text600: "text-blue-600",
    text500: "text-blue-500",
    text400: "text-blue-400",
    bg50: "bg-blue-50",
    border200: "border-blue-200",
    gradientFromTo: "from-blue-500 via-blue-600 to-indigo-600",
    bg100_55: "from-blue-50/80 to-blue-100/55",
    border100: "border-blue-100",
  },
  indigo: {
    selectionBg: "selection:bg-indigo-500/10 selection:text-indigo-600",
    text600: "text-indigo-600",
    text500: "text-indigo-500",
    text400: "text-indigo-400",
    bg50: "bg-indigo-50",
    border200: "border-indigo-200",
    gradientFromTo: "from-indigo-500 via-indigo-600 to-violet-600",
    bg100_55: "from-indigo-50/80 to-indigo-100/55",
    border100: "border-indigo-100",
  },
  purple: {
    selectionBg: "selection:bg-purple-500/10 selection:text-purple-600",
    text600: "text-purple-600",
    text500: "text-purple-500",
    text400: "text-purple-400",
    bg50: "bg-purple-50",
    border200: "border-purple-200",
    gradientFromTo: "from-purple-500 via-purple-600 to-pink-600",
    bg100_55: "from-purple-50/80 to-purple-100/55",
    border100: "border-purple-100",
  },
  teal: {
    selectionBg: "selection:bg-teal-500/10 selection:text-teal-600",
    text600: "text-teal-600",
    text500: "text-teal-500",
    text400: "text-teal-400",
    bg50: "bg-teal-50",
    border200: "border-teal-200",
    gradientFromTo: "from-teal-500 via-teal-600 to-emerald-600",
    bg100_55: "from-teal-50/80 to-teal-100/55",
    border100: "border-teal-100",
  },
  orange: {
    selectionBg: "selection:bg-orange-500/10 selection:text-orange-600",
    text600: "text-orange-600",
    text500: "text-orange-500",
    text400: "text-orange-400",
    bg50: "bg-orange-50",
    border200: "border-orange-200",
    gradientFromTo: "from-orange-500 via-orange-600 to-red-600",
    bg100_55: "from-orange-50/80 to-orange-100/55",
    border100: "border-orange-100",
  },
  green: {
    selectionBg: "selection:bg-green-500/10 selection:text-green-600",
    text600: "text-green-600",
    text500: "text-green-500",
    text400: "text-green-400",
    bg50: "bg-green-50",
    border200: "border-green-200",
    gradientFromTo: "from-green-500 via-green-600 to-emerald-600",
    bg100_55: "from-green-50/80 to-green-100/55",
    border100: "border-green-100",
  }
};

type Props = {
  params: Promise<{ slug: string }>;
};

// 1. ДИНАМИЧЕСКИЙ ГЕНЕРАТОР METADATA (SEO/GEO API)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const service = SERVICES_DETAILS[resolvedParams.slug];
  
  if (!service) return { title: "Услуга не найдена" };
  
  return constructMetadata({
    title: service.seoTitle,
    description: service.seoDesc,
    canonicalUrl: `https://adlight.kz/services/${service.slug}`,
    keywords: service.keywords
  });
}

// 2. СТАТИЧЕСКАЯ ГЕНЕРАЦИЯ СТРАНИЦ (SSG)
export async function generateStaticParams() {
  const staticRoutes = ["panel-brackets", "facade-decoration", "neon", "volume-letters", "lightboxes", "interior", "navigation", "roof-installations", "entrance-groups", "pylons"];
  return Object.keys(SERVICES_DETAILS)
    .filter((slug) => !staticRoutes.includes(slug))
    .map((slug) => ({
       slug: slug
    }));
}

export default async function DynamicServicePage({ params }: Props) {
  const resolvedParams = await params;
  const service = SERVICES_DETAILS[resolvedParams.slug];

  if (!service) {
    notFound();
  }

  // Force orange brand colors or fall back safely to service specified colors
  const scheme = colorSchemes[service.priceColor as keyof typeof colorSchemes] || colorSchemes.orange;

  // Получаем фотографии из папки
  const galleryImages = getImagesFromFolder(service.slug);
  const heroImages = [...galleryImages].sort(() => 0.5 - Math.random()).slice(0, 15);
  
  const displayHeroImages = heroImages.length > 0 
    ? heroImages 
    : ["/images/calc/lightbox-1.jpg", "/images/calc/face.jpg"];

  // 3. JSON-LD SCHEMA ДЛЯ ПОИСКОВИКОВ И ИИ
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `https://adlight.kz/services/${service.slug}#product`,
        "name": service.title,
        "image": displayHeroImages[0].startsWith("/") ? `https://adlight.kz${displayHeroImages[0]}` : displayHeroImages[0],
        "description": service.subtitle,
        "brand": {
          "@type": "Brand",
          "name": "ADLight"
        },
        "offers": {
          "@type": "AggregateOffer",
          "priceCurrency": "KZT",
          "lowPrice": service.price === "Проектно" ? "5000" : service.price.replace(/\D/g, '') || "5000",
          "highPrice": service.price === "Проектно" ? "150000" : (parseInt(service.price.replace(/\D/g, '')) * 3).toString() || "150000",
          "offerCount": "3"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "21",
          "bestRating": "5",
          "worstRating": "1"
        }
      },
      {
        "@type": "Service",
        "@id": `https://adlight.kz/services/${service.slug}#service`,
        "name": service.title,
        "provider": { 
          "@type": "LocalBusiness", 
          "name": "ADLight",
          "image": "https://adlight.kz/icon.png",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "ул. Аспара 7",
            "addressLocality": "Астана",
            "addressCountry": "KZ"
          },
          "telephone": "+7 (707) 135-67-01"
        },
        "description": service.subtitle,
        "offers": {
          "@type": "Offer",
          "url": `https://adlight.kz/services/${service.slug}`,
          "priceCurrency": "KZT",
          "price": service.price === "Проектно" ? undefined : service.price.replace(/\D/g, '') || undefined,
          "availability": "https://schema.org/InStock"
        }
      },
      {
        "@type": "FAQPage",
        "@id": `https://adlight.kz/services/${service.slug}#faq`,
        "mainEntity": service.faqs.map(item => ({
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
    <main className={`min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-orange-500/10 selection:text-orange-600 overflow-x-clip`}>
      {/* Внедряем JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* === 1. HERO SECTION === */}
      <header className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden border-b border-slate-200/80 bg-slate-50">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f080_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f080_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/80 to-slate-50"></div>
        <div className={`absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/5 blur-[100px] rounded-full pointer-events-none`}></div>

        <div className="container mx-auto px-4 relative z-10">
           {/* Хлебные крошки */}
           <nav aria-label="Хлебные крошки" className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500 mb-8 font-medium">
              <Link href="/" className="hover:text-slate-900 transition-colors">Главная</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <Link href="/services" className="hover:text-slate-900 transition-colors">Услуги</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-orange-600 font-semibold">{service.badge}</span>
           </nav>

           <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Левая колонка */}
              <div>
                 <div className={`inline-block px-4 py-1.5 mb-6 text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 rounded-full uppercase tracking-wider`}>
                    {service.heroTag}
                 </div>
                 <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
                    {service.title.split(" (")[0]} <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-600 to-red-600">
                       {service.title.includes("(") ? service.title.slice(service.title.indexOf("(")) : "в Астане под ключ"}
                    </span>
                 </h1>
                 <p className="text-slate-600 text-lg mb-8 leading-relaxed max-w-xl">
                    {service.subtitle} Собственное производство, соответствие нормам Дизайн-кода и гарантия качества.
                 </p>
                 
                 <HeroButtons source={service.title} priceColor="orange" />
              </div>

              {/* Правая колонка: Слайдер */}
              <div className="relative aspect-square rounded-3xl bg-slate-100 border border-slate-200/80 overflow-hidden group shadow-xl">
                 <HeroSlideshow images={displayHeroImages} />
                 
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none"></div>
                 <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md border border-slate-200/80 p-4 rounded-2xl flex items-center gap-4 pointer-events-none z-20 shadow-lg">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 shrink-0">
                       {renderIcon(service.heroVisualType === "box" ? "Box" : service.heroVisualType === "zap" ? "Zap" : service.heroVisualType === "map" ? "Map" : service.heroVisualType === "wind" ? "Wind" : "Store")}
                    </div>
                    <div>
                       <div className="text-slate-900 font-bold text-base">{service.heroTag}</div>
                       <div className="text-slate-500 text-xs font-medium">Гарантированное соответствие СНиП</div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </header>

      {/* === 2. БЕГУЩАЯ СТРОКА === */}
      <ClientsMarquee />

      {/* === 3. CONCEPT SECTION === */}
      <section id="concept" className="py-24 bg-slate-50 border-t border-slate-200/80">
         <div className="container mx-auto px-4">
            <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-[80px] rounded-full pointer-events-none"></div>

               <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
                  <div>
                     <h2 className="text-3xl font-extrabold text-slate-900 mb-6 tracking-tight">{service.conceptTitle}</h2>
                     <p className="text-slate-600 text-lg leading-relaxed mb-8">
                        {service.conceptDesc}
                     </p>
                     
                     {service.conceptQuote && (
                        <p className="text-slate-700 mb-8 border-l-4 border-orange-500 pl-4 italic bg-slate-50/50 py-2 pr-4 rounded-r-xl">
                           {service.conceptQuote}
                        </p>
                     )}

                     <div className="space-y-6">
                        {service.conceptHighlights.map((hl, i) => (
                           <div key={i} className="flex items-start gap-4">
                              <div className="p-3 bg-orange-55 bg-orange-50 rounded-xl text-orange-600 border border-orange-100 shrink-0">
                                 {renderIcon(hl.iconName, "w-6 h-6 text-orange-600")}
                              </div>
                              <div>
                                 <h4 className="text-slate-800 font-bold mb-1">{hl.title}</h4>
                                 <p className="text-slate-500 text-sm leading-relaxed">{hl.desc}</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
                  
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video group shadow-md w-full">
                     {service.conceptVisualType === "window" ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900">
                           <div className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 drop-shadow-[0_0_30px_rgba(249,115,22,0.6)] animate-pulse" style={{fontFamily: 'cursive'}}>
                              OPEN
                           </div>
                           <div className="mt-4 inline-block px-4 py-1 bg-green-600/90 text-white text-xs font-bold rounded uppercase">
                              100% За стеклом (В витрине)
                           </div>
                        </div>
                     ) : service.conceptVisualType === "road" ? (
                        <div className="absolute inset-0 p-8 flex items-center justify-center bg-slate-900">
                           <div className="relative z-10 w-16 h-48 bg-orange-600 rounded-t-lg shadow-[0_0_50px_rgba(249,115,22,0.4)] flex flex-col items-center justify-start pt-4">
                              <div className="w-10 h-10 bg-white rounded-full mb-4"></div>
                              <div className="w-12 h-2 bg-white/30 rounded mb-1"></div>
                              <div className="w-12 h-2 bg-white/30 rounded mb-1"></div>
                           </div>
                        </div>
                     ) : (
                        <Image 
                           src={displayHeroImages[0]} 
                           alt={service.title} 
                           fill 
                           className="object-cover opacity-90 transition duration-700 group-hover:scale-105"
                           sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                     )}
                     <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-slate-950/20 to-transparent"></div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* === 4. КАТАЛОГ РЕШЕНИЙ === */}
      <section id="catalog" aria-labelledby="catalog-heading" className="py-24 bg-white border-t border-slate-200/80">
         <div className="container mx-auto px-4">
            <div className="text-center mb-16">
               <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-3 font-semibold">Варианты и типы</span>
               <h2 id="catalog-heading" className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">{service.typesTitle}</h2>
               <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">{service.typesSubtitle}</p>
            </div>

            <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
               {service.types.map((type, i) => (
                  <li 
                    key={i} 
                    itemScope
                    itemType="https://schema.org/Product"
                    className="group flex flex-col rounded-3xl overflow-hidden border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-orange-500/30 cursor-default shadow-sm hover:shadow-md transition-all duration-300"
                  >
                     <article className="flex flex-col h-full">
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 border-b border-slate-150">
                           {type.tag && (
                              <span className="absolute top-4 left-4 z-10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-orange-600 text-white rounded-md shadow-md">
                                 {type.tag}
                              </span>
                           )}
                           <Image 
                              src={type.image} 
                              alt={type.title}
                              fill
                              itemProp="image"
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                           />
                        </div>

                        <div className="p-6 md:p-8 flex flex-col flex-grow">
                           <h3 itemProp="name" className="text-xl font-bold text-slate-900 mb-3 group-hover:text-orange-600 transition-colors duration-300">{type.title}</h3>
                           <p itemProp="description" className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">
                              {type.desc}
                           </p>

                           {(type.specs || type.bestFor) && (
                              <div className="mt-auto pt-4 border-t border-slate-100/80 space-y-2.5">
                                 {type.specs && (
                                    <div className="text-xs text-slate-500">
                                       <strong className="text-slate-700 font-semibold block mb-0.5">Характеристики:</strong>
                                       <span className="leading-relaxed">{type.specs}</span>
                                    </div>
                                 )}
                                 {type.bestFor && (
                                    <div className="text-xs text-slate-500">
                                       <strong className="text-slate-700 font-semibold block mb-0.5">Применение:</strong>
                                       <span className="leading-relaxed">{type.bestFor}</span>
                                    </div>
                                 )}
                              </div>
                           )}
                        </div>
                     </article>
                   </li>
                ))}
             </ul>
         </div>
      </section>

      {/* === 5. ТЕХНИЧЕСКИЙ СРАВНИТЕЛЬНЫЙ БЛОК === */}
      <section id="comparison" className="py-24 bg-slate-50 border-t border-slate-200/80">
         <div className="container mx-auto px-4">
            <div className="text-center mb-16">
               <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-3 font-semibold font-medium">Сравнение и технологии</span>
               <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight text-center">{service.comparisonTitle}</h2>
               <p className="text-slate-500 text-lg text-center max-w-xl mx-auto leading-relaxed">{service.comparisonDesc}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-stretch max-w-[1400px] mx-auto">
               {/* Сторона А (Наша) */}
               <div className="bg-white p-8 md:p-10 rounded-3xl border border-orange-100 relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                  {service.comparisonA.badge && (
                     <span className="absolute top-0 right-0 bg-orange-600 text-white text-[10px] font-bold px-3.5 py-1.5 rounded-bl-2xl uppercase tracking-wider">
                        {service.comparisonA.badge}
                     </span>
                  )}
                  <div className="flex items-center gap-4 mb-6">
                     <div className="p-3.5 bg-orange-50 rounded-2xl text-orange-600 border border-orange-100">
                        {renderIcon(service.comparisonA.iconName || "ShieldCheck", "w-6 h-6 text-orange-600")}
                     </div>
                     <h3 className="text-2xl font-bold text-slate-900">{service.comparisonA.title}</h3>
                  </div>
                  <ul className="space-y-4 text-slate-600">
                     {service.comparisonA.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                           <CheckCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5"/>
                           <span className="leading-relaxed">
                              <strong className="text-slate-850 font-bold text-slate-800">{item.bold}</strong> {item.normal}
                           </span>
                        </li>
                     ))}
                  </ul>
               </div>

               {/* Сторона Б (Конкурентная) */}
               <div className="bg-white p-8 md:p-10 rounded-3xl border border-orange-100 relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-4 mb-6">
                     <div className="p-3.5 bg-orange-50 rounded-2xl text-orange-600 border border-orange-100">
                        {renderIcon(service.comparisonB.iconName || "AlertTriangle", "w-6 h-6 text-orange-600")}
                     </div>
                     <h3 className="text-2xl font-bold text-slate-900">{service.comparisonB.title}</h3>
                  </div>
                  <ul className="space-y-4 text-slate-650">
                     {service.comparisonB.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                           <div className="w-5 h-5 rounded-full border border-red-500/50 flex items-center justify-center text-red-500 text-xs shrink-0 font-bold mt-0.5">✕</div>
                           <span className="leading-relaxed text-slate-500">
                              <strong className="text-slate-700 font-semibold">{item.bold}</strong> {item.normal}
                           </span>
                        </li>
                     ))}
                  </ul>
               </div>
            </div>
         </div>
      </section>

      {/* === 6. ЦЕНЫ И ПРИМЕР СМЕТЫ === */}
      <section className="py-24 bg-white border-t border-slate-200/80">
         <div className="container mx-auto px-4">
             <div className="max-w-[1400px] mx-auto bg-gradient-to-r from-orange-55/80 to-orange-100/55 border border-orange-100 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row gap-12 items-center shadow-sm">
                <div className="md:w-1/2 w-full">
                   <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">{service.pricingTitle}</h2>
                   <p className="text-slate-600 mb-6 leading-relaxed">
                      {service.pricingDesc}
                   </p>
                   
                   {/* Семантическая HTML5 Таблица */}
                   <div className="overflow-hidden rounded-2xl border border-orange-200/60 bg-white shadow-sm">
                      <table className="w-full text-left border-collapse">
                         <thead>
                            <tr className="bg-orange-50/50 border-b border-orange-100">
                               <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-700">Параметр / Услуга</th>
                               <th className="p-4 text-xs font-bold uppercase tracking-wider text-orange-600 text-right">Стоимость</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                            {service.pricingItems.map((pr, i) => (
                               <tr key={i} className="hover:bg-slate-50/50 transition duration-155">
                                  <td className="p-4 font-medium text-slate-800">{pr.label}</td>
                                  <td className="p-4 text-right font-bold text-orange-600 whitespace-nowrap">{pr.value}</td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </div>

                <div className="md:w-1/2 text-center w-full">
                   <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md hover:scale-105 transition-transform duration-300">
                      <Calculator className="w-10 h-10 text-white"/>
                   </div>
                   <h3 className="text-xl font-bold text-slate-900 mb-2">Нужен проект или точный расчет?</h3>
                   <p className="text-slate-500 text-sm mb-6 leading-relaxed">Например: {service.pricingCalculatorPlaceholder}. Консультация инженера бесплатно.</p>
                   <Link href="/calculator" className="inline-flex items-center justify-center px-8 py-3.5 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition shadow-sm active:scale-95">
                      {service.pricingActionText}
                   </Link>
                </div>
             </div>
          </div>
       </section>

       {/* === 7. ДИЗАЙН-КОД === */}
       <DesignCodeBlock />

       {/* === 8. FAQ === */}
       <section className="py-24 bg-slate-50 border-t border-slate-200/80">
          <div className="container mx-auto px-4 max-w-3xl">
             <div className="text-center mb-12">
                <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-3 font-semibold">Часто задаваемые вопросы</span>
                <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Популярные вопросы</h2>
                <p className="text-slate-500">Всё, что нужно знать об изготовлении и правилах размещения вывески</p>
             </div>
             <div className="space-y-4">
                {service.faqs.map((item, index) => (
                   <details 
                     key={index} 
                     itemScope
                     itemProp="mainEntity"
                     itemType="https://schema.org/Question"
                     className="group bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300 open:border-orange-500/30 open:shadow-sm"
                   >
                      <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-slate-50/50 transition">
                         <div className="flex items-center gap-4">
                            <div className="p-2 bg-slate-100 rounded-lg group-open:bg-orange-50 group-open:text-orange-600 transition shrink-0">
                               {renderIcon(item.iconName, "w-5 h-5 text-orange-600")}
                            </div>
                            <span 
                              itemProp="name" 
                              className="font-bold text-slate-800 text-base md:text-lg group-open:text-orange-600 transition"
                            >
                               {item.question}
                            </span>
                         </div>
                         <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-open:rotate-180 transition ml-4 shrink-0"><ChevronDown className="w-4 h-4"/></div>
                      </summary>
                      <div 
                        itemProp="acceptedAnswer"
                        itemScope
                        itemType="https://schema.org/Answer"
                        className="px-6 pb-6 pl-[4.5rem] text-slate-650 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4 animate-in fade-in slide-in-from-top-2 duration-200"
                      >
                         <div itemProp="text">
                           {item.answer}
                         </div>
                      </div>
                   </details>
                ))}
             </div>
          </div>
       </section>

       {/* === 9. ГАЛЕРЕЯ === */}
       <section className="py-24 bg-slate-50 border-t border-slate-200/80">
          <div className="container mx-auto px-4 mb-12 text-center">
             <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Живые примеры работ</h2>
             <p className="text-slate-500">Наше собственное производство в Астане</p>
          </div>
          <div className="container mx-auto px-4">
             {galleryImages.length > 0 ? (
                <ImageGallery 
                  images={galleryImages} 
                  projectTitle={`Изготовление и монтаж ${service.title} в Астане`}
                /> 
             ) : (
                <div className="text-center text-slate-500 py-12 border border-dashed border-slate-200 rounded-2xl max-w-md mx-auto">
                   Загрузите фото в папку public/images/{service.slug}
                </div>
             )}
             
             <div className="mt-16 flex justify-center">
                <Link href="/portfolio" className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white border border-slate-300 rounded-full text-slate-700 font-bold hover:bg-slate-50 transition overflow-hidden">
                   <span className="relative z-10 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-orange-600"/>
                      Посмотреть все работы в Портфолио
                   </span>
                </Link>
             </div>
          </div>
       </section>

      {/* === 10. ОТЗЫВЫ И CTA === */}
      <ReviewsCarousel />
      <ServicesCarousel title="Другие услуги" subtitle="Комплексный подход к вашему бренду" hiddenLink={`/services/${service.slug}`}/>
      <CallToAction source={`Услуга: ${service.title}`} />
    </main>
  );
}
