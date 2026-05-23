"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image"; 
import { ArrowUpRight, Layers, ChevronRight, ChevronLeft } from "lucide-react";
import AOS from "aos";

import { PROJECTS, CATEGORIES, ProjectCategory } from "@/lib/projectsData";
import CallToAction from "@/components/CallToAction";
import { getFeatureFlags } from "@/lib/featureFlags";

// Выносим утилиту наружу, чтобы не создавать её при каждом рендере
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' };
  return new Date(dateString).toLocaleDateString('ru-RU', options);
};

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | 'all'>('all');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // --- 1. ЛЕНИВАЯ ПОДГРУЗКА (ВИРТУАЛИЗАЦИЯ) ---
  const [visibleCount, setVisibleCount] = useState(9);

  // Сброс видимого количества при смене категории
  useEffect(() => {
    setVisibleCount(9);
  }, [activeCategory]);

  // --- 2. ОПТИМИЗИРОВАННАЯ ФИЛЬТРАЦИЯ (useMemo) ---
  const sortedProjects = useMemo(() => {
    const filtered = activeCategory === 'all' 
      ? PROJECTS 
      : PROJECTS.filter(project => project.categories.includes(activeCategory));

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [activeCategory]);

  // Видимые проекты на основе флага виртуализации
  const visibleProjects = useMemo(() => {
    const flags = getFeatureFlags();
    if (flags.enablePortfolioVirtualization) {
      return sortedProjects.slice(0, visibleCount);
    }
    return sortedProjects;
  }, [sortedProjects, visibleCount]);

  // Наблюдение за триггером внизу страницы
  useEffect(() => {
    const flags = getFeatureFlags();
    if (!flags.enablePortfolioVirtualization) return;

    const currentTrigger = triggerRef.current;
    if (!currentTrigger) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && visibleCount < sortedProjects.length) {
          // Имитируем плавный LCP-подгруз
          setVisibleCount((prev) => Math.min(prev + 9, sortedProjects.length));
        }
      },
      { threshold: 0.1, rootMargin: "100px" } // Начинаем подгрузку заранее за 100px
    );

    observer.observe(currentTrigger);

    return () => {
      observer.unobserve(currentTrigger);
    };
  }, [sortedProjects.length, visibleCount]);

  // --- 3. ОБНОВЛЕНИЕ AOS ПРИ СМЕНЕ ФИЛЬТРА ИЛИ ПОДГРУЗКЕ ---
  useEffect(() => {
    const timeout = setTimeout(() => {
      AOS.refresh();
    }, 150);
    return () => clearTimeout(timeout);
  }, [activeCategory, visibleCount]);

  // --- 4. ЛОГИКА СКРОЛЛА КАТЕГОРИЙ ---
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      const onWheel = (e: WheelEvent) => {
        if (e.deltaY === 0) return;
        e.preventDefault();
        el.scrollBy({ left: e.deltaY, behavior: "smooth" });
      };
      
      const checkScroll = () => {
        const { scrollLeft, scrollWidth, clientWidth } = el;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
      };

      el.addEventListener("wheel", onWheel);
      el.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
      
      // Инициализация
      checkScroll();

      return () => {
        el.removeEventListener("wheel", onWheel);
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

  // --- 5. SCHEMA.ORG (JSON-LD) ---
  // Генерируем разметку для полного списка проектов, чтобы поисковые роботы видели все работы сразу!
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Портфолио ADLight",
    "description": "Примеры выполненных работ по наружной рекламе в Астане.",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": sortedProjects.map((project, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "CreativeWork",
          "name": project.title,
          "description": project.description,
          "image": `https://adlight.kz${project.image}`,
          "dateCreated": project.date,
          "url": `https://adlight.kz/portfolio/${project.slug}`
        }
      }))
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] font-sans selection:bg-orange-500/30">
      
      {/* Внедряем JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 overflow-hidden">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020617]/80 to-[#020617]"></div>
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none"></div>

         <div className="container mx-auto px-4 relative z-10 text-center">
            <div data-aos="fade-down" className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-500 mb-8">
               <Link href="/" className="hover:text-white transition">Главная</Link>
               <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4"/>
               <span className="text-orange-500 font-medium">Портфолио</span>
            </div>

            <div data-aos="fade-down" data-aos-delay="100" className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs font-medium mb-6 backdrop-blur-md">
               <Layers className="w-3 h-3 text-orange-500"/> Галерея проектов ADLight
            </div>
            
            <h1 data-aos="fade-up" data-aos-delay="200" className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight">
               Наши <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">работы</span>
            </h1>
            
            <p data-aos="fade-up" data-aos-delay="300" className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
               Более 300 реализованных проектов в Астане. От интерьерных логотипов до крышных установок.
            </p>
         </div>
      </section>

      {/* 2. STICKY FILTER (С НАВИГАЦИЕЙ) */}
      <section className="sticky top-20 z-40 mb-12 px-4">
         <div className="container mx-auto max-w-4xl relative">
            
            {/* Кнопка ВЛЕВО */}
            <button 
               onClick={() => scrollFilter('left')}
               className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-[#0B1221] border border-white/10 rounded-full shadow-xl text-white hover:bg-orange-600 hover:border-orange-600 transition-all duration-300 transform ${showLeftArrow ? "opacity-100 scale-100 translate-x-[-50%]" : "opacity-0 scale-0 pointer-events-none"}`}
               aria-label="Скролл фильтра влево"
            >
               <ChevronLeft className="w-5 h-5"/>
            </button>

            {/* Кнопка ВПРАВО */}
            <button 
               onClick={() => scrollFilter('right')}
               className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-[#0B1221] border border-white/10 rounded-full shadow-xl text-white hover:bg-orange-600 hover:border-orange-600 transition-all duration-300 transform ${showRightArrow ? "opacity-100 scale-100 translate-x-[50%]" : "opacity-0 scale-0 pointer-events-none"}`}
               aria-label="Скролл фильтра вправо"
            >
               <ChevronRight className="w-5 h-5"/>
            </button>

            {/* Контейнер фильтра */}
            <div className="bg-[#0B1221]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl shadow-black/50 overflow-hidden relative">
               
               {/* Градиентные шторки */}
               <div className={`absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#0B1221] to-transparent z-10 pointer-events-none transition-opacity ${showLeftArrow ? 'opacity-100' : 'opacity-0'}`} />
               <div className={`absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#0B1221] to-transparent z-10 pointer-events-none transition-opacity ${showRightArrow ? 'opacity-100' : 'opacity-0'}`} />

               <div 
                  ref={scrollContainerRef}
                  className="flex gap-2 overflow-x-auto hide-scrollbar items-center justify-start w-full scroll-smooth px-2"
               >
                  {CATEGORIES.map((cat) => (
                     <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`shrink-0 px-5 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 border ${
                           activeCategory === cat.id 
                              ? "bg-white text-black border-white shadow-lg" 
                              : "bg-transparent text-gray-400 border-transparent hover:bg-white/10 hover:text-white"
                        }`}
                     >
                        {cat.label}
                     </button>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* 3. СЕТКА ПРОЕКТОВ */}
      <section className="container mx-auto px-4 pb-32">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleProjects.map((project, i) => (
               <Link 
                  href={`/portfolio/${project.slug}`} 
                  key={project.id}
                  data-aos="fade-up"
                  // Сбрасываем задержку при фильтрации для UX
                  data-aos-delay={i % 3 * 100} 
                  className="group relative flex flex-col gap-4 cursor-pointer"
               >
                  {/* Картинка */}
                  <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-slate-800 border border-white/5">
                     <div className="absolute inset-0 bg-slate-800 animate-pulse" /> 
                     
                     <Image 
                        src={project.image} 
                        alt={project.seoAlt || project.title} 
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition duration-700 group-hover:scale-110"
                     />
                     
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition duration-500" />

                     <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        {project.categories.slice(0, 2).map(catId => {
                           const catLabel = CATEGORIES.find(c => c.id === catId)?.label;
                           return (
                              <span key={catId} className="px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-wider text-white">
                                 {catLabel}
                              </span>
                           );
                        })}
                     </div>

                     <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-500">
                        <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transform translate-y-4 group-hover:translate-y-0 transition duration-500">
                           <ArrowUpRight className="w-8 h-8"/>
                        </div>
                     </div>
                  </div>

                  {/* Информация */}
                  <div className="px-2">
                     <div className="flex justify-between items-start mb-1">
                        <h3 className="text-xl font-bold text-white group-hover:text-orange-500 transition-colors leading-tight">
                           {project.title}
                        </h3>
                        <span className="text-xs font-mono text-gray-500 pt-1 whitespace-nowrap">
                           {formatDate(project.date)}
                        </span>
                     </div>
                     <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
                        {project.description}
                     </p>
                  </div>
               </Link>
            ))}

            {/* Триггер скролла для подгрузки */}
            {getFeatureFlags().enablePortfolioVirtualization && visibleCount < sortedProjects.length && (
               <div ref={triggerRef} className="col-span-full h-24 flex items-center justify-center mt-6">
                  <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
               </div>
            )}
         </div>

         {sortedProjects.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 border border-dashed border-white/10 rounded-3xl bg-white/5">
               <div className="text-6xl mb-4 grayscale opacity-50">📂</div>
               <h3 className="text-xl font-bold text-white mb-2">Проектов не найдено</h3>
               <p className="text-gray-400">Попробуйте выбрать другую категорию</p>
            </div>
         )}
      </section>

      {/* 4. CTA */}
      <CallToAction source="Страница: Портфолио" />
    </div>
  );
}