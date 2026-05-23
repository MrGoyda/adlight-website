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

const colorSchemes = {
  blue: {
    selectionBg: "selection:bg-blue-500/30",
    bg600_10: "bg-blue-600/10",
    text500: "text-blue-500",
    text400: "text-blue-400",
    bg500_10: "bg-blue-500/10",
    border500_20: "border-blue-500/20",
    text400ToCyan: "from-blue-400 to-cyan-400",
    shadow900_10: "shadow-blue-900/10",
    border500: "border-blue-500",
    bg900_20: "bg-blue-900/20",
    border500_30: "border-blue-500/30",
    bg600_90: "bg-blue-600/90",
    groupHoverText400: "group-hover:text-blue-400",
    bg600: "bg-blue-600",
    from900_20: "from-blue-900/20",
    text200: "text-blue-200",
    shadow500_30: "shadow-blue-500/30",
    text900: "text-blue-900",
    openBorder500_30: "open:border-blue-500/30",
    groupOpenBg500_10: "group-open:bg-blue-500/10",
    groupOpenText500: "group-open:text-blue-500",
    from500_10: "from-blue-500/10"
  },
  indigo: {
    selectionBg: "selection:bg-indigo-500/30",
    bg600_10: "bg-indigo-600/10",
    text500: "text-indigo-500",
    text400: "text-indigo-400",
    bg500_10: "bg-indigo-500/10",
    border500_20: "border-indigo-500/20",
    text400ToCyan: "from-indigo-400 to-cyan-400",
    shadow900_10: "shadow-indigo-900/10",
    border500: "border-indigo-500",
    bg900_20: "bg-indigo-900/20",
    border500_30: "border-indigo-500/30",
    bg600_90: "bg-indigo-600/90",
    groupHoverText400: "group-hover:text-indigo-400",
    bg600: "bg-indigo-600",
    from900_20: "from-indigo-900/20",
    text200: "text-indigo-200",
    shadow500_30: "shadow-indigo-500/30",
    text900: "text-indigo-900",
    openBorder500_30: "open:border-indigo-500/30",
    groupOpenBg500_10: "group-open:bg-indigo-500/10",
    groupOpenText500: "group-open:text-indigo-500",
    from500_10: "from-indigo-500/10"
  },
  purple: {
    selectionBg: "selection:bg-purple-500/30",
    bg600_10: "bg-purple-600/10",
    text500: "text-purple-500",
    text400: "text-purple-400",
    bg500_10: "bg-purple-500/10",
    border500_20: "border-purple-500/20",
    text400ToCyan: "from-purple-400 to-cyan-400",
    shadow900_10: "shadow-purple-900/10",
    border500: "border-purple-500",
    bg900_20: "bg-purple-900/20",
    border500_30: "border-purple-500/30",
    bg600_90: "bg-purple-600/90",
    groupHoverText400: "group-hover:text-purple-400",
    bg600: "bg-purple-600",
    from900_20: "from-purple-900/20",
    text200: "text-purple-200",
    shadow500_30: "shadow-purple-500/30",
    text900: "text-purple-900",
    openBorder500_30: "open:border-purple-500/30",
    groupOpenBg500_10: "group-open:bg-purple-500/10",
    groupOpenText500: "group-open:text-purple-500",
    from500_10: "from-purple-500/10"
  },
  teal: {
    selectionBg: "selection:bg-teal-500/30",
    bg600_10: "bg-teal-600/10",
    text500: "text-teal-500",
    text400: "text-teal-400",
    bg500_10: "bg-teal-500/10",
    border500_20: "border-teal-500/20",
    text400ToCyan: "from-teal-400 to-cyan-400",
    shadow900_10: "shadow-teal-900/10",
    border500: "border-teal-500",
    bg900_20: "bg-teal-900/20",
    border500_30: "border-teal-500/30",
    bg600_90: "bg-teal-600/90",
    groupHoverText400: "group-hover:text-teal-400",
    bg600: "bg-teal-600",
    from900_20: "from-teal-900/20",
    text200: "text-teal-200",
    shadow500_30: "shadow-teal-500/30",
    text900: "text-teal-900",
    openBorder500_30: "open:border-teal-500/30",
    groupOpenBg500_10: "group-open:bg-teal-500/10",
    groupOpenText500: "group-open:text-teal-500",
    from500_10: "from-teal-500/10"
  },
  orange: {
    selectionBg: "selection:bg-orange-500/30",
    bg600_10: "bg-orange-600/10",
    text500: "text-orange-500",
    text400: "text-orange-400",
    bg500_10: "bg-orange-500/10",
    border500_20: "border-orange-500/20",
    text400ToCyan: "from-orange-400 to-cyan-400",
    shadow900_10: "shadow-orange-900/10",
    border500: "border-orange-500",
    bg900_20: "bg-orange-900/20",
    border500_30: "border-orange-500/30",
    bg600_90: "bg-orange-600/90",
    groupHoverText400: "group-hover:text-orange-400",
    bg600: "bg-orange-600",
    from900_20: "from-orange-900/20",
    text200: "text-orange-200",
    shadow500_30: "shadow-orange-500/30",
    text900: "text-orange-900",
    openBorder500_30: "open:border-orange-500/30",
    groupOpenBg500_10: "group-open:bg-orange-500/10",
    groupOpenText500: "group-open:text-orange-500",
    from500_10: "from-orange-500/10"
  },
  green: {
    selectionBg: "selection:bg-green-500/30",
    bg600_10: "bg-green-600/10",
    text500: "text-green-500",
    text400: "text-green-400",
    bg500_10: "bg-green-500/10",
    border500_20: "border-green-500/20",
    text400ToCyan: "from-green-400 to-cyan-400",
    shadow900_10: "shadow-green-900/10",
    border500: "border-green-500",
    bg900_20: "bg-green-900/20",
    border500_30: "border-green-500/30",
    bg600_90: "bg-green-600/90",
    groupHoverText400: "group-hover:text-green-400",
    bg600: "bg-green-600",
    from900_20: "from-green-900/20",
    text200: "text-green-200",
    shadow500_30: "shadow-green-500/30",
    text900: "text-green-900",
    openBorder500_30: "open:border-green-500/30",
    groupOpenBg500_10: "group-open:bg-green-500/10",
    groupOpenText500: "group-open:text-green-500",
    from500_10: "from-green-500/10"
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
  return Object.keys(SERVICES_DETAILS).map((slug) => ({
     slug: slug
  }));
}

export default async function DynamicServicePage({ params }: Props) {
  const resolvedParams = await params;
  const service = SERVICES_DETAILS[resolvedParams.slug];

  if (!service) {
    notFound();
  }

  const scheme = colorSchemes[service.priceColor as keyof typeof colorSchemes] || colorSchemes.blue;

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
        "@type": "Service",
        "name": service.title,
        "provider": { "@type": "LocalBusiness", "name": "ADLight" },
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
    <div className={`min-h-screen bg-[#0F172A] font-sans ${scheme.selectionBg}`}>
      {/* Внедряем JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* === 1. HERO SECTION === */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F172A]/80 to-[#0F172A]"></div>
        <div className={`absolute top-0 right-0 w-[600px] h-[600px] ${scheme.bg600_10} blur-[120px] rounded-full pointer-events-none`}></div>

        <div className="container mx-auto px-4 relative z-10">
           {/* Хлебные крошки */}
           <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 mb-8">
              <Link href="/" className="hover:text-white transition">Главная</Link>
              <ChevronRight className="w-3 h-3"/>
              <Link href="/services" className="hover:text-white transition">Услуги</Link>
              <ChevronRight className="w-3 h-3"/>
              <span className={`${scheme.text500} font-medium`}>{service.badge}</span>
           </div>

           <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Левая колонка */}
              <div>
                 <div className={`inline-block px-4 py-1.5 mb-6 text-xs font-bold ${scheme.text400} ${scheme.bg500_10} border ${scheme.border500_20} rounded-full uppercase tracking-wider`}>
                    {service.heroTag}
                 </div>
                 <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    {service.title.split(" (")[0]} <br/>
                    <span className={`text-transparent bg-clip-text bg-gradient-to-r ${scheme.text400ToCyan}`}>
                       {service.title.includes("(") ? service.title.slice(service.title.indexOf("(")) : "для бизнеса"}
                    </span>
                 </h1>
                 <p className="text-gray-400 text-lg mb-8 leading-relaxed max-w-xl">
                    {service.subtitle}
                 </p>
                 
                 <HeroButtons source={service.title} priceColor={service.priceColor as any} />
              </div>

              {/* Правая колонка: Слайдер */}
              <div className={`relative aspect-square rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden group shadow-2xl ${scheme.shadow900_10}`}>
                 <HeroSlideshow images={displayHeroImages} />
                 
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none"></div>
                 <div className="absolute bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur border border-slate-700 p-4 rounded-xl flex items-center gap-4 pointer-events-none z-20">
                    <div className={`w-12 h-12 ${scheme.bg500_10} rounded-full flex items-center justify-center ${scheme.text500}`}>
                       {renderIcon(service.heroVisualType === "box" ? "Box" : service.heroVisualType === "zap" ? "Zap" : service.heroVisualType === "map" ? "Map" : service.heroVisualType === "wind" ? "Wind" : "Store")}
                    </div>
                    <div>
                       <div className="text-white font-bold">{service.heroTag}</div>
                       <div className="text-gray-400 text-xs">Гарантированное соответствие СНиП</div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* === 2. БЕГУЩАЯ СТРОКА === */}
      <ClientsMarquee />

      {/* === 3. CONCEPT SECTION === */}
      <section className="py-24 bg-slate-950">
         <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
               <div className="lg:w-1/2">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{service.conceptTitle}</h2>
                  <p className="text-gray-400 text-lg leading-relaxed mb-8">
                     {service.conceptDesc}
                  </p>
                  
                  {service.conceptQuote && (
                     <p className={`text-gray-300 mb-8 border-l-4 ${scheme.border500} pl-4 italic`}>
                        {service.conceptQuote}
                     </p>
                  )}

                  <div className="flex flex-wrap gap-4">
                     {service.conceptHighlights.map((hl, i) => (
                        <div key={i} className={`${scheme.bg900_20} border ${scheme.border500_30} px-4 py-3 rounded-xl flex items-center gap-3`}>
                           {renderIcon(hl.iconName, `w-5 h-5 ${scheme.text400}`)}
                           <span className="text-white font-medium">{hl.title}</span>
                        </div>
                     ))}
                  </div>
               </div>
               
               <div className="lg:w-1/2 w-full">
                  <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-black aspect-video group">
                     {service.conceptVisualType === "window" ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                           <div className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 drop-shadow-[0_0_30px_rgba(168,85,247,0.6)] animate-pulse" style={{fontFamily: 'cursive'}}>
                              OPEN
                           </div>
                           <div className="mt-4 inline-block px-4 py-1 bg-green-600/90 text-white text-xs font-bold rounded uppercase">
                              100% За стеклом (В витрине)
                           </div>
                        </div>
                     ) : service.conceptVisualType === "road" ? (
                        <div className="absolute inset-0 p-8 flex items-center justify-center">
                           <div className="relative z-10 w-16 h-48 bg-blue-600 rounded-t-lg shadow-[0_0_50px_rgba(37,99,235,0.4)] flex flex-col items-center justify-start pt-4">
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
                           className="object-cover opacity-60 transition duration-700 group-hover:scale-105"
                           sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                     )}
                     <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-slate-950 to-transparent blur-xl"></div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* === 4. КАТАЛОГ РЕШЕНИЙ === */}
      <section className="py-24 bg-slate-900 border-y border-slate-800">
         <div className="container mx-auto px-4">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{service.typesTitle}</h2>
               <p className="text-gray-400">{service.typesSubtitle}</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
               {service.types.map((type, i) => (
                  <div 
                    key={i} 
                    className="group relative h-[320px] rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 cursor-default"
                  >
                     <Image 
                        src={type.image} 
                        alt={type.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

                     <div className="absolute inset-0 p-8 flex flex-col justify-end">
                        {type.tag && (
                           <div className={`absolute top-4 right-4 ${scheme.bg600_90} backdrop-blur text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg`}>
                              {type.tag}
                           </div>
                        )}
                        
                        <h3 className={`text-2xl font-bold text-white mb-2 ${scheme.groupHoverText400} transition-colors`}>{type.title}</h3>
                        <p className="text-sm text-gray-300 leading-relaxed opacity-90">
                           {type.desc}
                        </p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* === 5. ТЕХНИЧЕСКИЙ СРАВНИТЕЛЬНЫЙ БЛОК === */}
      <section className="py-24 bg-slate-950">
         <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">{service.comparisonTitle}</h2>
            <p className="text-gray-400 text-center mb-16 max-w-xl mx-auto">{service.comparisonDesc}</p>

            <div className="grid md:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto">
               {/* Сторона А (Наша) */}
               <div className={`bg-slate-900 p-8 rounded-3xl border ${scheme.border500_30} relative overflow-hidden shadow-lg ${scheme.shadow900_10}`}>
                  {service.comparisonA.badge && (
                     <div className={`absolute top-0 right-0 ${scheme.bg600} text-white text-xs font-bold px-3 py-1 rounded-bl-xl`}>
                        {service.comparisonA.badge}
                     </div>
                  )}
                  <div className="flex items-center gap-4 mb-6">
                     <div className={`p-3 ${scheme.bg500_10} rounded-xl ${scheme.text400}`}>
                        {renderIcon(service.comparisonA.iconName || "ShieldCheck")}
                     </div>
                     <h3 className="text-2xl font-bold text-white">{service.comparisonA.title}</h3>
                  </div>
                  <ul className="space-y-4 text-gray-300">
                     {service.comparisonA.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                           <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5"/>
                           <span><strong>{item.bold}</strong> {item.normal}</span>
                        </li>
                     ))}
                  </ul>
               </div>

               {/* Сторона Б (Конкурентная или другое сравнение) */}
               <div className="bg-[#0B1120] p-8 rounded-3xl border border-slate-800 opacity-80 hover:opacity-100 transition">
                  <div className="flex items-center gap-4 mb-6">
                     <div className="p-3 bg-red-500/10 rounded-xl text-red-400">
                        {renderIcon(service.comparisonB.iconName || "AlertTriangle")}
                     </div>
                     <h3 className="text-2xl font-bold text-gray-400">{service.comparisonB.title}</h3>
                  </div>
                  <ul className="space-y-4 text-gray-500">
                     {service.comparisonB.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                           <div className="w-5 h-5 rounded-full border border-red-500/50 flex items-center justify-center text-red-500 text-xs shrink-0 font-bold">✕</div>
                           <span><strong>{item.bold}</strong> {item.normal}</span>
                        </li>
                     ))}
                  </ul>
               </div>
            </div>
         </div>
      </section>

      {/* === 6. ЦЕНЫ И ПРИМЕР СМЕТЫ === */}
      <section className="py-24 bg-[#0F172A] border-t border-slate-800">
         <div className="container mx-auto px-4">
             <div className={`max-w-5xl mx-auto bg-gradient-to-r ${scheme.from900_20} to-transparent border ${scheme.border500_20} rounded-3xl p-8 md:p-12 flex flex-col md:flex-row gap-12 items-center shadow-xl`}>
                <div className="md:w-1/2">
                   <h2 className="text-3xl font-bold text-white mb-4">{service.pricingTitle}</h2>
                   <p className={`${scheme.text200} mb-6`}>
                      {service.pricingDesc}
                   </p>
                   <ul className="space-y-3">
                      {service.pricingItems.map((pr, i) => (
                         <li key={i} className={`flex justify-between text-sm border-b ${scheme.border500_20} pb-2`}>
                            <span className="text-gray-300">{pr.label}</span>
                            <span className="text-white font-bold">{pr.value}</span>
                         </li>
                      ))}
                   </ul>
                </div>

                <div className="md:w-1/2 text-center">
                   <div className={`w-20 h-20 ${scheme.bg600} rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl ${scheme.shadow500_30} animate-pulse`}>
                      <Calculator className="w-10 h-10 text-white"/>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-2">Нужен проект или точный расчет?</h3>
                   <p className="text-gray-400 text-sm mb-6">{service.pricingCalculatorPlaceholder}. Консультация инженера бесплатно.</p>
                   <Link href="/calculator" className={`inline-flex items-center justify-center px-8 py-3 bg-white ${scheme.text900} font-bold rounded-xl hover:bg-slate-100 transition shadow-lg active:scale-95`}>
                      {service.pricingActionText}
                   </Link>
                </div>
             </div>
         </div>
      </section>

      {/* === 7. ДИЗАЙН-КОД === */}
      <DesignCodeBlock />

      {/* === 8. FAQ === */}
      <section className="py-24 bg-[#0B1221]">
         <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-center mb-12">
               <h2 className="text-3xl font-bold text-white mb-4">Популярные вопросы</h2>
            </div>
            <div className="space-y-4">
               {service.faqs.map((item, index) => (
                  <details key={index} className={`group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-300 ${scheme.openBorder500_30} open:bg-slate-900/80`}>
                     <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-slate-800/50 transition">
                        <div className="flex items-center gap-4">
                           <div className={`p-2 bg-slate-800 rounded-lg ${scheme.groupOpenBg500_10} transition`}>
                              {renderIcon(item.iconName, `w-5 h-5 ${scheme.text400}`)}
                           </div>
                           <span className={`font-bold text-white text-base md:text-lg ${scheme.groupOpenText500} transition`}>{item.question}</span>
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

      {/* === 9. ГАЛЕРЕЯ === */}
      <section className="py-24 bg-slate-950 border-t border-slate-800">
         <div className="container mx-auto px-4 mb-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Живые примеры работ</h2>
            <p className="text-gray-400">Наше собственное производство в Астане</p>
         </div>
         <div className="container mx-auto px-4">
            {galleryImages.length > 0 ? (
               <ImageGallery images={galleryImages} /> 
            ) : (
               <div className="text-center text-gray-500 py-12 border border-dashed border-slate-800 rounded-2xl max-w-md mx-auto">
                  Загрузите фото в папку public/images/{service.slug}
               </div>
            )}
            
            <div className="mt-16 flex justify-center">
               <Link href="/portfolio" className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#0B1221] border border-slate-700 rounded-full text-white font-bold hover:bg-slate-800 transition overflow-hidden">
                  <span className="relative z-10 flex items-center gap-2">
                     <Briefcase className={`w-5 h-5 ${scheme.text500}`}/>
                     Посмотреть все работы в Портфолио
                  </span>
                  <div className={`absolute inset-0 bg-gradient-to-r ${scheme.from500_10} to-cyan-500/10 opacity-0 group-hover:opacity-100 transition duration-500`}></div>
               </Link>
            </div>
         </div>
      </section>

      {/* === 10. ОТЗЫВЫ И CTA === */}
      <ReviewsCarousel />
      <ServicesCarousel title="Другие услуги" subtitle="Комплексный подход к вашему бренду" hiddenLink={`/services/${service.slug}`}/>
      <CallToAction source={`Услуга: ${service.title}`} />
    </div>
  );
}
