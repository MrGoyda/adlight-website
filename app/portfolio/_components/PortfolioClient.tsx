"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Layers, ChevronRight, ChevronLeft, Calendar, Clock, MapPin, Folder, ChevronDown } from "lucide-react";

import { Project, ProjectCategory, CATEGORIES } from "@/lib/projectsData";
import { PORTFOLIO_DICT } from "@/dictionaries/portfolio";
import FadeIn from "@/components/ui/FadeIn";
import FaqSection from "@/components/FaqSection";
import CallToAction from "@/components/CallToAction";
import Button from "@/components/ui/Button";

// Форматирование даты
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' };
  return new Date(dateString).toLocaleDateString('ru-RU', options);
};

interface PortfolioClientProps {
  initialProjects: Project[];
  activeCategory: ProjectCategory | 'all';
  currentPage: number;
  totalPages: number;
  totalProjectsCount: number;
}

export default function PortfolioClient({
  initialProjects,
  activeCategory,
  currentPage,
  totalPages,
  totalProjectsCount,
}: PortfolioClientProps) {
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLUListElement>(null);
  const casesSectionRef = useRef<HTMLDivElement>(null);

  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // --- ЛОГИКА СКРОЛЛА КАТЕГОРИЙ ---
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      const checkScroll = () => {
        const { scrollLeft, scrollWidth, clientWidth } = el;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
      };

      el.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
      
      checkScroll();

      return () => {
        el.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, []);

  const scrollFilter = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (el) {
      const scrollAmount = 200;
      el.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Обработка клика по категориям
  const handleCategoryChange = (e: React.MouseEvent<HTMLButtonElement>, catId: ProjectCategory | 'all') => {
    // 1. Отцентровка выбранного таба
    const button = e.currentTarget;
    const container = scrollContainerRef.current;
    if (button && container) {
      const containerWidth = container.clientWidth;
      const buttonWidth = button.clientWidth;
      const buttonLeft = button.offsetLeft;
      
      container.scrollTo({
        left: buttonLeft - (containerWidth / 2) + (buttonWidth / 2),
        behavior: 'smooth'
      });
    }

    // 2. Обновление URL через router.push (без полного рефреша страницы)
    router.push(`/portfolio?category=${catId}&page=1`, { scroll: false });

    // 3. Подскролл к началу кейсов с учетом хедера
    if (casesSectionRef.current) {
      const offsetTop = casesSectionRef.current.getBoundingClientRect().top + window.scrollY - 150;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  // Переключение страниц пагинации
  const handlePageChange = (page: number) => {
    router.push(`/portfolio?category=${activeCategory}&page=${page}`, { scroll: false });
    
    if (casesSectionRef.current) {
      const offsetTop = casesSectionRef.current.getBoundingClientRect().top + window.scrollY - 150;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans selection:bg-orange-500/30">
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 overflow-hidden">
         {/* Фоновые линии чертежа / сетка */}
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:24px_24px] opacity-40"></div>
         <div className="absolute inset-0 bg-gradient-to-b from-slate-50/20 via-white/80 to-slate-50/50"></div>
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/[0.03] blur-[120px] rounded-full pointer-events-none"></div>

         <div className="container mx-auto px-4 relative z-10 text-center">
            {/* Хлебные крошки */}
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-400 mb-8">
               <Link href="/" className="hover:text-slate-900 transition font-medium">{PORTFOLIO_DICT.breadcrumbs.home}</Link>
               <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-slate-300"/>
               <span className="text-orange-600 font-extrabold">{PORTFOLIO_DICT.breadcrumbs.current}</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold mb-6 shadow-xs">
               <Layers className="w-3 h-3 text-orange-600"/> {PORTFOLIO_DICT.badge}
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 mb-6 tracking-tight">
               {PORTFOLIO_DICT.title.prefix}<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">{PORTFOLIO_DICT.title.highlight}</span>
            </h1>
            
            <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
               {PORTFOLIO_DICT.subtitle}
            </p>
         </div>
      </section>

      {/* 2. STICKY FILTER (С НАВИГАЦИЕЙ) */}
      <section className="sticky top-20 z-40 mb-12 px-4">
         <div className="container mx-auto max-w-4xl relative">
            
            {/* Кнопка ВЛЕВО */}
            <button 
               onClick={() => scrollFilter('left')}
               className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-white border border-slate-200 shadow-md text-slate-700 hover:bg-orange-600 hover:border-orange-600 hover:text-white transition-all duration-300 transform rounded-full cursor-pointer ${showLeftArrow ? "opacity-100 scale-100 translate-x-[-50%]" : "opacity-0 scale-0 pointer-events-none"}`}
               aria-label={PORTFOLIO_DICT.filters.scrollLeft}
            >
               <ChevronLeft className="w-5 h-5"/>
            </button>

            {/* Кнопка ВПРАВО */}
            <button 
               onClick={() => scrollFilter('right')}
               className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-white border border-slate-200 shadow-md text-slate-700 hover:bg-orange-600 hover:border-orange-600 hover:text-white transition-all duration-300 transform rounded-full cursor-pointer ${showRightArrow ? "opacity-100 scale-100 translate-x-[50%]" : "opacity-0 scale-0 pointer-events-none"}`}
               aria-label={PORTFOLIO_DICT.filters.scrollRight}
            >
               <ChevronRight className="w-5 h-5"/>
            </button>

            {/* Контейнер фильтра */}
            <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-2 shadow-sm overflow-hidden relative">
               
               {/* Градиентные шторки */}
               <div className={`absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none transition-opacity ${showLeftArrow ? 'opacity-100' : 'opacity-0'}`} />
               <div className={`absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none transition-opacity ${showRightArrow ? 'opacity-100' : 'opacity-0'}`} />

               <ul 
                  ref={scrollContainerRef}
                  className="flex gap-2 overflow-x-auto hide-scrollbar items-center justify-start w-full scroll-smooth px-2"
               >
                  {CATEGORIES.map((cat) => (
                     <li key={cat.id} className="shrink-0">
                        <button
                           onClick={(e) => handleCategoryChange(e, cat.id)}
                           className={`px-5 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 border cursor-pointer ${
                              activeCategory === cat.id 
                                 ? "bg-gradient-to-r from-orange-600 to-red-600 text-white border-transparent shadow-md shadow-orange-500/10" 
                                 : "bg-transparent text-slate-500 border-transparent hover:bg-slate-100 hover:text-slate-900"
                           }`}
                        >
                           {cat.label}
                        </button>
                     </li>
                  ))}
                </ul>
             </div>
          </div>
       </section>

      {/* 3. СЕТКА ПРОЕКТОВ */}
      <section ref={casesSectionRef} className="container mx-auto px-4 pb-16">
         <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {initialProjects.map((project, i) => (
               <FadeIn 
                 key={`${activeCategory}-${project.id}`} 
                 direction="up" 
                 delay={i % 3 * 100} 
                 duration={500}
                 as="li"
               >
                  <article 
                     itemScope
                     itemType="https://schema.org/CreativeWork"
                     data-ai-entity="ProjectCard"
                     data-ai-category={project.categories.join(", ")}
                     data-ai-location="Казахстан, Астана"
                     data-ai-date={project.date}
                     className="flex flex-col gap-4"
                  >
                     <Link 
                        href={`/portfolio/${project.slug}`} 
                        className="group relative flex flex-col gap-4 cursor-pointer"
                        itemProp="url"
                     >
                        {/* Картинка */}
                        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-xs group-hover:shadow-md group-hover:border-orange-500/20 transition-all duration-300">
                           <div className="absolute inset-0 bg-slate-200/60 animate-pulse" /> 
                           
                           <Image 
                              src={project.image} 
                              alt={project.seoAlt || project.title} 
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover transition duration-700 group-hover:scale-105"
                              itemProp="image"
                              priority={i < 3 && currentPage === 1}
                           />
                           
                           <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent opacity-85 group-hover:opacity-75 transition duration-500" />

                           <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
                              {project.categories.slice(0, 2).map(catId => {
                                 const catLabel = CATEGORIES.find(c => c.id === catId)?.label;
                                 return (
                                    <span key={catId} className="px-2.5 py-1 rounded-lg bg-white/95 border border-slate-200/80 text-[10px] font-black uppercase tracking-wider text-slate-700 shadow-xs">
                                       {catLabel}
                                    </span>
                                 );
                              })}
                           </div>

                           <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-500 z-10">
                              <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 flex items-center justify-center text-slate-800 transform translate-y-4 group-hover:translate-y-0 transition duration-500 shadow-sm">
                                 <ArrowUpRight className="w-6 h-6 text-orange-600"/>
                              </div>
                           </div>
                        </div>

                        {/* Информация */}
                        <div className="px-2 text-left">
                           <div className="flex justify-between items-start gap-3 mb-1.5">
                              <h3 itemProp="name" className="text-xl font-black text-slate-900 group-hover:text-orange-600 transition-colors leading-tight">
                                 {project.title}
                              </h3>
                              <time itemProp="dateCreated" dateTime={project.date} className="text-xs font-mono text-slate-400 pt-1.5 whitespace-nowrap font-medium">
                                 {formatDate(project.date)}
                              </time>
                           </div>
                           <p itemProp="description" className="text-sm text-slate-500 line-clamp-2 leading-relaxed font-medium">
                              {project.description}
                           </p>
                        </div>
                     </Link>
                  </article>
               </FadeIn>
            ))}
         </ul>

         {initialProjects.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 border border-dashed border-slate-200 rounded-3xl bg-white shadow-xs">
               <div className="text-6xl mb-4 grayscale opacity-50">📂</div>
               <h3 className="text-xl font-bold text-slate-800 mb-2">{PORTFOLIO_DICT.notFound.title}</h3>
               <p className="text-slate-500">{PORTFOLIO_DICT.notFound.desc}</p>
            </div>
         )}
      </section>

      {/* 3.5. СЕРВЕРНАЯ ПАГИНАЦИЯ (Premium Apple Style) */}
      {totalPages > 1 && (
        <section className="container mx-auto px-4 pb-24">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 border-t border-slate-200/60 pt-10">
            <div className="flex items-center gap-2">
              {/* Кнопка "Назад" */}
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                variant="lightOutline"
                size="sm"
                leftIcon={<ChevronLeft className="w-4 h-4" />}
              >
                Назад
              </Button>

              {/* Номера страниц */}
              <div className="flex items-center gap-1.5 mx-2">
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  const isCurrent = pageNum === currentPage;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-extrabold transition-all duration-300 cursor-pointer ${
                        isCurrent
                          ? "bg-orange-600 text-white shadow-md shadow-orange-500/10 scale-105"
                          : "bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 shadow-2xs hover:border-slate-350"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              {/* Кнопка "Вперед" */}
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                variant="lightOutline"
                size="sm"
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                Вперед
              </Button>
            </div>
            
            <p className="text-xs font-semibold text-slate-400 tracking-wide uppercase sm:border-l sm:border-slate-200 sm:pl-6">
              Страница {currentPage} из {totalPages} ({totalProjectsCount} проектов всего)
            </p>
          </div>
        </section>
      )}

      {/* 3.6. SEO & AI FAQ SECTION */}
      <FaqSection 
         faqs={PORTFOLIO_DICT.seoBlocks.faqList}
         title={PORTFOLIO_DICT.seoBlocks.faqTitle}
         subtitle={PORTFOLIO_DICT.seoBlocks.faqSubtitle}
      />

      {/* 4. CTA */}
      <CallToAction source="Страница: Портфолио" />
    </div>
  );
}
