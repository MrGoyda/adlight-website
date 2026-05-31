import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next"; 
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  Calculator,
  Clock,
  ChevronRight,
  Info,
  Play,
  CheckCircle2,
  Layers,
  Zap,
  ShieldCheck,
  Hammer
} from "lucide-react";

import { PROJECTS, CATEGORIES } from "@/lib/projectsData";
import CallToAction from "@/components/CallToAction";
import ImageGallery from "@/components/ImageGallery";
import VideoModalWrapper from "@/components/VideoModalWrapper";
import { PORTFOLIO_DICT } from "@/dictionaries/portfolio";

// --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---

const getCategoryLabels = (catIds: string[]) => {
  return catIds.map(id => {
    const category = CATEGORIES.find(c => c.id === id);
    return category ? category.label : id;
  });
};

const getRelatedProjects = (currentId: string, categories: string[]) => {
  const others = PROJECTS.filter(p => p.id !== currentId);
  return others
    .map(p => {
      const overlap = p.categories.filter(cat => categories.includes(cat)).length;
      return { project: p, overlap };
    })
    .sort((a, b) => b.overlap - a.overlap)
    .map(item => item.project)
    .slice(0, 3);
};

type Props = {
  params: Promise<{ slug: string }>;
};

// 1. ДИНАМИЧЕСКИЕ METADATA ДЛЯ СОЦСЕТЕЙ И ПОИСКОВИКОВ (SEO)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const project = PROJECTS.find((p) => p.slug === resolvedParams.slug);
  
  if (!project) return { title: "Проект не найден" };
  
  const pageUrl = `https://adlight.kz/portfolio/${project.slug}`;
  
  return {
    title: `${project.title} | Портфолио ADLight Астана`,
    description: project.description.slice(0, 160) + "...",
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${project.title} — Реализованный проект ADLight`,
      description: project.description,
      url: pageUrl,
      siteName: "ADLight",
      images: [
        {
          url: project.image,
          width: 1200,
          height: 630,
          alt: project.seoAlt || project.title,
        }
      ],
      locale: "ru_RU",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description.slice(0, 160) + "...",
      images: [project.image],
    }
  };
}

export default async function ProjectPage({ params }: Props) {
  const resolvedParams = await params;
  const project = PROJECTS.find((p) => p.slug === resolvedParams.slug);

  if (!project) {
    notFound();
  }

  const relatedProjects = getRelatedProjects(project.id, project.categories);
  const categoryLabels = getCategoryLabels(project.categories);

  // 2. ГЕНЕРАЦИЯ SCHEMA.ORG JSON-LD (ДЛЯ ПОИСКОВЫХ СНИППЕТОВ)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.title,
    "description": project.description,
    "image": `https://adlight.kz${project.image}`,
    "dateCreated": project.date,
    "author": {
      "@type": "Organization",
      "name": "ADLight"
    },
    "locationCreated": {
      "@type": "Place",
      "name": project.location || "Астана"
    },
    "keywords": categoryLabels.join(", ")
  };

  // Хлебные крошки для Google SERP
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": PORTFOLIO_DICT.breadcrumbs.home,
        "item": "https://adlight.kz"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": PORTFOLIO_DICT.breadcrumbs.current,
        "item": "https://adlight.kz/portfolio"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": project.title,
        "item": `https://adlight.kz/portfolio/${project.slug}`
      }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans selection:bg-orange-500/30" itemScope itemType="http://schema.org/CreativeWork">
      
      {/* Вставляем разметку JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Скрытый ИИ-дайджест для LLM-агентов */}
      <aside className="sr-only" aria-hidden="true" data-ai-context="CaseDetailsSummary">
        Проект: {project.title}. Место реализации: {project.location || "Астана, Казахстан"}. 
        Технические характеристики объекта: Лицевая сторона: {project.techSpecs.face}, Боковины: {project.techSpecs.body}, 
        Подсветка: {project.techSpecs.light}, Предоставленная гарантия: {project.techSpecs.warranty || "12 месяцев"}.
        Задача: {project.challenge}. Решение ADLight: {project.solution}.
      </aside>

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-12 lg:pt-40 lg:pb-20 overflow-hidden">
         {/* Системная фоновая сетка 24px */}
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:24px_24px] opacity-40"></div>
         <div className="absolute inset-0 bg-gradient-to-b from-slate-50/10 via-white/80 to-slate-50/50"></div>
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/[0.03] blur-[120px] rounded-full pointer-events-none"></div>

         <div className="container mx-auto px-4 relative z-10">
            {/* Хлебные крошки */}
            <div className="flex flex-wrap items-center gap-2 text-slate-400 text-sm mb-8">
               <Link href="/" className="hover:text-slate-900 transition font-semibold">{PORTFOLIO_DICT.breadcrumbs.home}</Link>
               <ChevronRight className="w-3 h-3 text-slate-300"/>
               <Link href="/portfolio" className="hover:text-slate-900 transition font-semibold">{PORTFOLIO_DICT.breadcrumbs.current}</Link>
               <ChevronRight className="w-3 h-3 text-slate-300"/>
               <span className="text-orange-600 font-extrabold truncate max-w-[200px]" itemProp="name">{project.title}</span>
            </div>

            <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
               {/* Левая колонка */}
               <div className="lg:col-span-6 flex flex-col justify-center">
                  <div className="flex flex-wrap gap-2.5 mb-6">
                     {categoryLabels.map((label, i) => (
                        <span key={i} className="px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 text-slate-600 text-xs font-black uppercase tracking-wider shadow-2xs">
                           {label}
                        </span>
                     ))}
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 leading-[1.1] tracking-tight">
                     {project.title}
                  </h1>

                  <div className="flex flex-wrap gap-y-3.5 gap-x-6 text-slate-500 text-sm font-bold mb-8 border-b border-slate-200/50 pb-6">
                     {project.location && (
                        <div className="flex items-center gap-2" itemProp="locationCreated" itemScope itemType="http://schema.org/Place">
                           <MapPin className="w-4.5 h-4.5 text-orange-600"/> <span itemProp="name" className="text-slate-700">{project.location}</span>
                        </div>
                     )}
                     <div className="flex items-center gap-2">
                        <Calendar className="w-4.5 h-4.5 text-orange-600"/> <span className="text-slate-700">{project.year} год</span>
                     </div>
                     {project.completionTime && (
                        <div className="flex items-center gap-2">
                           <Clock className="w-4.5 h-4.5 text-orange-600"/> <span className="text-slate-700">{project.completionTime}</span>
                        </div>
                     )}
                  </div>

                  <p className="text-lg md:text-xl text-slate-500 leading-relaxed font-medium mb-8" itemProp="description">
                     {project.description}
                  </p>

                  {project.videoUrl && (
                     <div className="mb-4">
                        <VideoModalWrapper videoUrl={project.videoUrl} />
                     </div>
                  )}
               </div>

               {/* Правая колонка: Фото с премиальной тенью */}
               <div className="lg:col-span-6 relative aspect-[4/3] lg:aspect-square rounded-4xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xl shadow-slate-200/40 group">
                  <Image 
                     src={project.image} 
                     alt={project.seoAlt || project.title} 
                     fill 
                     className="object-cover transition-transform duration-1000 group-hover:scale-103"
                     priority
                     sizes="(max-width: 1024px) 100vw, 50vw"
                     itemProp="image"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent pointer-events-none"></div>
               </div>
            </div>
         </div>
      </section>

      {/* 2. MAIN CONTENT */}
      <section className="py-16 lg:py-24 bg-white border-t border-slate-250/30">
         <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-12 gap-12 items-start">
               
               <div className="lg:col-span-8 space-y-14">
                  <div className="group" data-ai-block="Challenge">
                     <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-orange-500/10 transition-transform duration-300 group-hover:scale-105">01</div>
                        <h2 className="text-3xl font-black text-slate-900 leading-none">{PORTFOLIO_DICT.caseDetails.challengeTitle}</h2>
                     </div>
                     <p className="text-slate-600 text-lg leading-relaxed pl-6 border-l-3 border-orange-500/30 font-medium">
                        {project.challenge}
                      </p>
                  </div>

                  {project.process && (
                     <div className="group" data-ai-block="Process">
                        <div className="flex items-center gap-4 mb-6">
                           <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-orange-500/10 transition-transform duration-300 group-hover:scale-105">02</div>
                           <h2 className="text-3xl font-black text-slate-900 leading-none">{PORTFOLIO_DICT.caseDetails.processTitle}</h2>
                        </div>
                        <p className="text-slate-600 text-lg leading-relaxed pl-6 border-l-3 border-orange-500/30 font-medium">
                           {project.process}
                        </p>
                     </div>
                  )}

                  <div className="group" data-ai-block="Solution">
                     <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-orange-500/10 transition-transform duration-300 group-hover:scale-105">
                           {project.process ? '03' : '02'}
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 leading-none">{PORTFOLIO_DICT.caseDetails.solutionTitle}</h2>
                     </div>
                     <div className="bg-slate-50/50 backdrop-blur-xs border border-slate-200/70 rounded-3xl p-8 shadow-xs hover:border-orange-500/15 transition duration-300">
                        <p className="text-slate-700 text-lg leading-relaxed font-semibold">
                           {project.solution}
                        </p>
                     </div>
                  </div>

                  {/* Высококонтрастный премиальный CTA блок в стиле темной темы Apple */}
                  <div className="py-8">
                     <Link 
                        href={project.relatedServiceSlug ? `/services/${project.relatedServiceSlug}` : "/calculator"}
                        className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-8 rounded-3xl bg-slate-900 text-white hover:bg-slate-950 transition-all duration-300 shadow-xl shadow-slate-900/10 cursor-pointer"
                     >
                        <div className="flex items-center gap-4">
                           <div className="p-4 bg-orange-600 rounded-2xl text-white shadow-lg shadow-orange-600/20 group-hover:scale-105 transition duration-300 shrink-0">
                              <Calculator className="w-6.5 h-6.5"/>
                           </div>
                           <div className="text-left">
                              <h4 className="font-black text-xl group-hover:text-orange-400 transition-colors mb-1">{PORTFOLIO_DICT.caseDetails.cta.title}</h4>
                              <p className="text-slate-400 text-sm font-semibold">{PORTFOLIO_DICT.caseDetails.cta.subtitle}</p>
                           </div>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur border border-white/15 flex items-center justify-center text-white group-hover:bg-orange-600 group-hover:border-transparent transition-all duration-300 shrink-0 self-end sm:self-center">
                           <ArrowRight className="w-5.5 h-5.5"/>
                        </div>
                     </Link>
                  </div>
               </div>

               {/* Правая колонка: Характеристики */}
               <div className="lg:col-span-4 lg:sticky lg:top-32">
                  <div className="space-y-8">
                     <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-md shadow-slate-100/50 rounded-4xl p-8 hover:shadow-lg transition-all duration-500">
                        <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2 border-b border-slate-100 pb-4">
                           <Info className="w-5 h-5 text-orange-600"/> {PORTFOLIO_DICT.caseDetails.specs.title}
                        </h3>
                        
                        <div className="space-y-6">
                           <div className="flex gap-4 items-start">
                              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                                 <Layers className="w-5 h-5"/>
                              </div>
                              <div>
                                 <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider mb-0.5">{PORTFOLIO_DICT.caseDetails.specs.face}</p>
                                 <p className="text-slate-800 text-sm font-extrabold leading-snug">{project.techSpecs.face}</p>
                              </div>
                           </div>
                           
                           <div className="flex gap-4 items-start">
                              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                                 <Hammer className="w-5 h-5"/>
                              </div>
                              <div>
                                 <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider mb-0.5">{PORTFOLIO_DICT.caseDetails.specs.body}</p>
                                 <p className="text-slate-800 text-sm font-extrabold leading-snug">{project.techSpecs.body}</p>
                              </div>
                           </div>
 
                           <div className="flex gap-4 items-start">
                              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                                 <Zap className="w-5 h-5"/>
                              </div>
                              <div>
                                 <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider mb-0.5">{PORTFOLIO_DICT.caseDetails.specs.light}</p>
                                 <p className="text-slate-800 text-sm font-extrabold leading-snug">{project.techSpecs.light}</p>
                              </div>
                           </div>
 
                           <div className="flex gap-4 items-start">
                              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                                 <ShieldCheck className="w-5 h-5"/>
                              </div>
                              <div>
                                 <p className="text-[10px] text-emerald-600 uppercase font-black tracking-wider mb-0.5">{PORTFOLIO_DICT.caseDetails.specs.warranty}</p>
                                 <p className="text-emerald-600 text-sm font-black leading-snug">{project.techSpecs.warranty || PORTFOLIO_DICT.caseDetails.specs.defaultWarranty}</p>
                              </div>
                           </div>
                        </div>
                     </div>
 
                     <div className="bg-white border border-slate-200/80 shadow-xs rounded-3xl p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-sm text-orange-600 font-extrabold shrink-0">AD</div> 
                        <div className="text-left">
                           <p className="text-slate-900 font-black text-sm mb-0.5">{PORTFOLIO_DICT.caseDetails.questions.title}</p>
                           <a href="https://wa.me/77071356701" target="_blank" rel="noopener noreferrer" className="text-green-600 text-xs font-bold hover:underline">{PORTFOLIO_DICT.caseDetails.questions.whatsapp}</a>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 3. ГАЛЕРЕЯ */}
      {project.gallery && project.gallery.length > 0 && (
         <section className="pb-24 bg-white border-t border-slate-200/60">
            <div className="container mx-auto px-4">
               <h2 className="text-3xl font-black text-slate-900 mb-8 border-l-4 border-orange-500 pl-4 leading-none">{PORTFOLIO_DICT.caseDetails.galleryTitle}</h2>
               <ImageGallery images={project.gallery} projectTitle={project.title} />
            </div>
         </section>
      )}

      {/* 4. СМОТРИТЕ ТАКЖЕ (ДРУГИЕ КЕЙСЫ) */}
      <section className="py-24 bg-slate-50 border-t border-slate-200/80">
         <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-12">
               <div className="text-left">
                  <h2 className="text-3xl font-black text-slate-900 mb-2">{PORTFOLIO_DICT.caseDetails.related.title}</h2>
                  <p className="text-slate-500 font-semibold">{PORTFOLIO_DICT.caseDetails.related.subtitle}</p>
               </div>
               <Link href="/portfolio" className="hidden md:flex items-center gap-2 text-orange-600 font-black hover:text-orange-700 transition">
                  {PORTFOLIO_DICT.caseDetails.related.button} <ArrowRight className="w-4 h-4"/>
               </Link>
            </div>
 
            <div className="grid md:grid-cols-3 gap-8">
               {relatedProjects.map((p) => (
                  <Link 
                     key={p.id} 
                     href={`/portfolio/${p.slug}`} 
                     className="group relative flex flex-col gap-4 cursor-pointer"
                  >
                     <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-xs group-hover:shadow-md group-hover:border-orange-500/20 transition-all duration-300">
                        <Image 
                           src={p.image} 
                           alt={p.seoAlt || p.title} 
                           fill 
                           className="object-cover transition-transform duration-700 group-hover:scale-104"
                           sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/15 to-transparent opacity-85 group-hover:opacity-75 transition duration-500 pointer-events-none" />
                        
                        <div className="absolute top-4 left-4 z-10 flex gap-2">
                           {getCategoryLabels(p.categories).slice(0, 1).map((cat, idx) => (
                              <span key={idx} className="px-2.5 py-1 rounded-lg bg-white/95 border border-slate-200/80 text-[10px] font-black uppercase tracking-wider text-slate-700 shadow-xs">
                                 {cat}
                              </span>
                           ))}
                        </div>
                     </div>
                     
                     <div className="px-2 text-left">
                        <h3 className="text-xl font-black text-slate-900 group-hover:text-orange-600 transition-colors leading-tight line-clamp-1 mb-1">{p.title}</h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 font-bold">
                           <MapPin className="w-3.5 h-3.5 text-orange-600"/> {p.location}
                        </p>
                     </div>
                  </Link>
               ))}
            </div>
            
            <div className="mt-8 text-center md:hidden">
               <Link href="/portfolio" className="inline-flex items-center gap-2 text-white font-black bg-gradient-to-r from-orange-600 to-red-600 px-6 py-3.5 rounded-xl shadow-md">
                  {PORTFOLIO_DICT.caseDetails.related.button} <ArrowRight className="w-4 h-4"/>
               </Link>
            </div>
         </div>
      </section>
 
      <CallToAction source={`Кейс: ${project.title}`} />
    </div>
  );
}