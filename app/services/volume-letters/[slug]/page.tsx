// app/services/volume-letters/[slug]/page.tsx

import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { 
  Calculator, 
  CheckCircle, 
  ChevronRight, 
  Gem,            
  Utensils,       
  Building2,      
  AlertTriangle,  
  Sun,
  Palette,
  ArrowRight,
  Layers,
  Zap,
  Shield,
  Eye,
  ChevronDown,
  Briefcase,
  Clock,
  BatteryCharging,
  Moon,
  Sun as SunIcon,
  MousePointerClick
} from "lucide-react";

import { constructMetadata } from "@/lib/seo";
import { getImagesFromFolder } from "@/lib/serverUtils";
import { VOLUME_LETTERS_CATALOG, VOLUME_LETTERS_DETAILS } from "@/dictionaries/services/volume-letters";

// --- ИМПОРТ ГЛОБАЛЬНЫХ КОМПОНЕНТОВ ---
import CallToAction from "@/components/CallToAction";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import ImageGallery from "@/components/ImageGallery";
import HeroSlideshow from "@/components/HeroSlideshow";
import HeroButtons from "@/components/HeroButtons";

// Helper to map icon names to Lucide icons
const IconHelper = ({ name, className }: { name: string; className: string }) => {
  switch (name) {
    case "Clock":
      return <Clock className={className} />;
    case "BatteryCharging":
      return <BatteryCharging className={className} />;
    case "Shield":
      return <Shield className={className} />;
    case "Eye":
      return <Eye className={className} />;
    case "AlertTriangle":
      return <AlertTriangle className={className} />;
    case "Palette":
      return <Palette className={className} />;
    case "Utensils":
      return <Utensils className={className} />;
    case "Building2":
      return <Building2 className={className} />;
    case "CheckCircle":
      return <CheckCircle className={className} />;
    default:
      return <Gem className={className} />;
  }
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

// 1. ДИНАМИЧЕСКИЕ МЕТАДАННЫЕ (Next.js 15 Async params)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = VOLUME_LETTERS_DETAILS[slug];
  
  if (!data) return {};

  return constructMetadata({
    title: data.seoTitle,
    description: data.seoDesc,
    canonicalUrl: `https://adlight.kz/services/volume-letters/${slug}`,
    keywords: data.keywords
  });
}

// Позволяет генерировать статические пути для быстродействия (ISR/SSG)
export async function generateStaticParams() {
  return VOLUME_LETTERS_CATALOG.map((item) => ({
    slug: item.slug,
  }));
}

export default async function VolumeLetterSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const data = VOLUME_LETTERS_DETAILS[slug];

  if (!data) {
    notFound();
  }

  // 1. ПОЛУЧАЕМ ФОТО ГАЛЕРЕИ
  const galleryImages = getImagesFromFolder(data.slug);

  // 2. ФОТО ДЛЯ HERO СЛАЙДЕРА
  const heroImages = [...galleryImages].sort(() => 0.5 - Math.random()).slice(0, 15);
  const displayHeroImages = heroImages.length > 0 
    ? heroImages 
    : ["/images/letters/face-lit-night.png", "/images/letters/face-lit-day.png"];

  // 3. "ДРУГИЕ ВИДЫ"
  const otherTypes = VOLUME_LETTERS_CATALOG.filter(item => item.slug !== data.slug);

  // 4. ГЕНЕРАЦИЯ SCHEMA (Product + FAQPage)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "name": data.title,
        "image": displayHeroImages[0],
        "description": data.subtitle,
        "brand": {
          "@type": "Brand",
          "name": "ADLight"
        },
        "offers": {
          "@type": "Offer",
          "url": `https://adlight.kz/services/volume-letters/${data.slug}`,
          "priceCurrency": "KZT",
          "price": data.price,
          "availability": "https://schema.org/InStock",
          "itemCondition": "https://schema.org/NewCondition"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": data.faqs.map(item => ({
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
    <main className="min-h-screen bg-[#0F172A] font-sans selection:bg-orange-500/30">
      
      {/* Вставляем Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* === 1. HERO SECTION === */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F172A]/80 to-[#0F172A]"></div>
        {/* Мягкое свечение для воздуха */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
           {/* Навигация */}
           <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 mb-8">
              <Link href="/" className="hover:text-white transition">Главная</Link>
              <ChevronRight className="w-3 h-3"/>
              <Link href="/services/volume-letters" className="hover:text-white transition">Объемные буквы</Link>
              <ChevronRight className="w-3 h-3"/>
              <span className="text-orange-500 font-medium">{data.title}</span>
           </div>

           <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Текст */}
              <div>
                 {data.badge && (
                    <div className="inline-block px-4 py-1.5 mb-6 text-xs font-bold text-orange-500 bg-orange-500/10 border border-orange-500/20 rounded-full uppercase tracking-wider">
                       {data.badge}
                    </div>
                 )}
                 <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    {data.title}
                 </h1>
                 <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                    {data.subtitle}
                 </p>
                 
                 <ul className="space-y-3 mb-10">
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-green-500"/> Гарантия строгого соответствия Дизайн-коду
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-green-500"/> Качественные материалы от европейских производителей
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                       <CheckCircle className="w-5 h-5 text-green-500"/> Собственное сертифицированное производство в Астане
                    </li>
                 </ul>

                 <HeroButtons source={data.title} priceColor="orange" />
              </div>

              {/* Визуал: СЛАЙДЕР */}
              <div className="relative aspect-square rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden group shadow-2xl">
                 <HeroSlideshow images={displayHeroImages} />
                 
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none"></div>
                 <div className="absolute bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur border border-slate-700 p-4 rounded-xl flex items-center gap-4 pointer-events-none z-20">
                    <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center text-orange-500"><Gem className="w-6 h-6"/></div>
                    <div><div className="text-white font-bold">Элитная вывеска</div><div className="text-gray-400 text-xs">Гарантия 12 месяцев по договору</div></div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* === БЛОК 2: CONCEPT === */}
      <section className="py-20 lg:py-32 bg-[#020617] relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] mix-blend-screen"></div>
         </div>

         <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
               
               <div className="lg:w-5/12 lg:sticky lg:top-32">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 font-bold mb-6 text-xs uppercase tracking-widest">
                     <Sun className="w-3.5 h-3.5"/> {data.conceptSubtitle}
                  </div>
                  
                  <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                     {data.conceptTitle}
                  </h2>
                  
                  <p className="text-slate-400 text-lg leading-relaxed mb-10 border-l-2 border-slate-800 pl-6">
                     {data.conceptDesc}
                  </p>

                  <div className="grid gap-4">
                     {data.conceptHighlights.map((highlight, idx) => (
                        <div key={idx} className="group p-5 bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800 hover:border-orange-500/30 transition-all duration-300">
                           <div className="flex items-start gap-4">
                              <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500 shrink-0">
                                 <IconHelper name={highlight.iconName} className="w-5 h-5"/>
                              </div>
                              <div>
                                 <h4 className="text-white font-bold text-base mb-1">{highlight.title}</h4>
                                 <p className="text-slate-500 text-sm">{highlight.desc}</p>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Правая Bento-сетка картинок */}
               <div className="w-full lg:w-7/12">
                  <div className="flex overflow-x-auto pb-8 -mx-4 px-4 lg:grid lg:grid-cols-2 lg:gap-5 lg:overflow-visible lg:pb-0 lg:px-0 hide-scrollbar snap-x snap-mandatory">
                      <div className="min-w-[85vw] sm:min-w-[300px] lg:min-w-0 lg:col-span-2 relative h-[280px] lg:h-[360px] rounded-3xl overflow-hidden group border border-slate-800 hover:border-orange-500/50 transition-colors duration-500 snap-center bg-slate-900 shadow-2xl">
                         <Image src={galleryImages[0] || "/images/pages/face-lit-04.webp"} alt="Пример вывески 1" fill className="object-cover transition duration-700 group-hover:scale-105"/>
                         <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-80"></div>
                         <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">Архитектурный шедевр</h3>
                            <p className="text-slate-400 text-sm max-w-md">Высочайший стандарт исполнения, разработанный специально для климатических условий Астаны.</p>
                         </div>
                      </div>
                  </div>
               </div>

            </div>
         </div>
      </section>

      {/* === БЛОК 3: ANATOMY === */}
      <section className="py-24 bg-[#0B1221] relative overflow-hidden">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]"></div>
         
         <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
               <span className="text-orange-500 font-bold text-sm uppercase tracking-widest mb-2 block">Технический разбор</span>
               <h2 className="text-3xl md:text-5xl font-black text-white">Анатомия качества ADLight</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {data.anatomy.map((part, index) => (
                  <div key={index} className="group relative bg-slate-900/80 backdrop-blur-sm p-8 rounded-[2rem] border border-slate-800 hover:border-orange-500/50 transition-all duration-500 flex flex-col">
                     <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6 text-orange-500 group-hover:scale-110 transition-all duration-300">
                        <IconHelper name={part.iconName} className="w-8 h-8"/>
                     </div>
                     <h3 className="text-xl font-bold text-white mb-3">{part.title}</h3>
                     <p className="text-gray-400 text-sm leading-relaxed flex-1">{part.desc}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* === БЛОК 4: ЦЕНА === */}
      <section className="py-24 bg-[#0F172A] border-y border-slate-800 relative overflow-hidden">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none"></div>
         <div className="container mx-auto px-4 relative z-10">
             <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16 items-stretch">
                  
                  <div className="md:w-5/12 bg-slate-900 rounded-3xl p-8 border border-slate-700 flex flex-col justify-between relative overflow-hidden group hover:border-orange-500/50 transition-all duration-300">
                     <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><Calculator className="w-32 h-32 text-white"/></div>
                     <div>
                        <div className="inline-flex items-center gap-2 text-orange-500 font-bold text-sm uppercase tracking-wider mb-4"><CheckCircle className="w-4 h-4"/> Прозрачная смета</div>
                        <h2 className="text-3xl font-bold text-white mb-4">Стоимость изготовления</h2>
                        <p className="text-gray-400 text-sm leading-relaxed mb-8">
                           Собственное производство позволяет предоставлять честные цены без переплат посредникам.
                        </p>
                     </div>
                     <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800/50">
                         <p className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">Базовая ставка</p>
                         <div className="flex items-baseline gap-2"><span className="text-white text-sm">от</span><span className="text-5xl font-black text-white">{data.price}</span><span className="text-orange-500 text-xl font-bold">₸ / см</span></div>
                     </div>
                  </div>

                  <div className="md:w-7/12 bg-slate-900/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-800 flex flex-col">
                     <div className="flex items-center justify-between mb-8 border-b border-slate-700/50 pb-6">
                        <div><h3 className="text-white font-bold text-xl">Пример сметы</h3><p className="text-gray-400 text-sm">{data.priceExample.title}</p></div>
                        <div className="px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 text-white font-mono text-sm">{data.priceExample.quantity}</div>
                     </div>
                     <div className="space-y-4 flex-1">
                        <div className="flex justify-between items-center text-sm p-2 rounded">
                           <span className="text-gray-400">Высота букв</span>
                           <span className="text-white font-mono">{data.priceExample.height}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm p-2 rounded">
                           <span className="text-gray-400">Материал</span>
                           <span className="text-white font-mono">{data.priceExample.face}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm p-2 rounded">
                           <span className="text-gray-400">Светодиоды</span>
                           <span className="text-green-400 font-mono text-xs">Включено (IP67)</span>
                        </div>
                     </div>
                     <div className="mt-8 pt-6 border-t border-slate-700">
                        <div className="flex justify-between items-end mb-6">
                           <span className="text-gray-400 text-sm">Итоговая стоимость:</span>
                           <span className="text-3xl font-black text-white tracking-tight">{data.priceExample.total}</span>
                        </div>
                        <Link href="/calculator" className="group block w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-center transition-all flex items-center justify-center gap-3">
                            <Calculator className="w-5 h-5"/> Рассчитать вывеску онлайн
                        </Link>
                     </div>
                  </div>
              </div>
          </div>
      </section>

      {/* === БЛОК 5: FAQ === */}
      <section className="py-24 bg-[#0B1221]">
         <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-center mb-12">
               <h2 className="text-3xl font-bold text-white mb-4">Часто задаваемые вопросы</h2>
            </div>

            <div className="space-y-4">
               {data.faqs.map((item, index) => (
                  <details key={index} className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-300 open:border-orange-500/30 open:bg-slate-900/80">
                     <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-slate-800/50 transition">
                        <div className="flex items-center gap-4">
                           <div className="p-2 bg-slate-800 rounded-lg group-open:bg-orange-500/10 transition">
                              <IconHelper name={item.iconName} className="w-5 h-5 text-orange-500"/>
                           </div>
                           <span className="font-bold text-white text-base md:text-lg group-open:text-orange-500 transition">{item.question}</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-gray-400 group-open:rotate-180 transition ml-4 shrink-0"><ChevronDown className="w-4 h-4"/></div>
                     </summary>
                     <div className="px-6 pb-6 pl-[4.5rem] text-gray-400 text-sm leading-relaxed border-t border-slate-800/50 pt-4 animate-in fade-in duration-200">
                        {item.answer}
                     </div>
                  </details>
               ))}
            </div>
         </div>
      </section>

      {/* === БЛОК 6: ГАЛЕРЕЯ === */}
      <section className="py-24 bg-slate-950">
          <div className="container mx-auto px-4 mb-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Галерея проектов</h2>
              <p className="text-gray-400">Наши выполненные работы</p>
          </div>
          <div className="container mx-auto px-4">
              {galleryImages.length > 0 ? (
                 <ImageGallery images={galleryImages} />
              ) : (
                 <div className="text-center text-gray-500 py-12 border border-dashed border-slate-800 rounded-2xl">
                    Фотографии выполненных проектов появятся в ближайшее время...
                 </div>
              )}
          </div>
      </section>

      {/* === БЛОК 7: ДРУГИЕ ВАРИАНТЫ === */}
      <section className="py-24 bg-[#0F172A] border-t border-slate-800 relative">
         <div className="container mx-auto px-4">
             <h2 className="text-3xl font-bold text-white mb-12">Другие виды объемных букв</h2>
             
             <div className="flex overflow-x-auto pb-8 -mx-4 px-4 md:grid md:grid-cols-4 gap-6 md:overflow-visible md:pb-0 md:px-0 hide-scrollbar snap-x snap-mandatory">
                {otherTypes.slice(0, 4).map((type) => (
                   <Link 
                      key={type.id} 
                      href={`/services/volume-letters/${type.slug}`}
                      className="group min-w-[260px] md:min-w-0 snap-center bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-orange-500/50 transition cursor-pointer flex flex-col h-full"
                   >
                      <div className="h-40 relative bg-black shrink-0">
                          <Image src={type.images.night} alt={type.title} fill className="object-cover opacity-80 group-hover:opacity-100 transition"/>
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                          <h4 className="text-white font-bold mb-1 group-hover:text-orange-500 transition line-clamp-2">{type.title}</h4>
                          <p className="text-gray-500 text-xs mt-auto">{type.price}</p>
                      </div>
                   </Link>
                ))}
             </div>
         </div>
      </section>

      <ReviewsCarousel />
      <CallToAction source={`Услуга: ${data.title}`} />

    </main>
  );
}
