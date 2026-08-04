"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Clock, MapPin, ShieldCheck, Folder, ChevronLeft, ChevronRight } from "lucide-react";
import { PROJECTS, CATEGORIES } from "@/lib/projectsData";
import FadeIn from "@/components/ui/FadeIn";
import BlueprintGrid from "@/components/ui/BlueprintGrid";

interface ProjectsBentoProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function ProjectsBento({ 
  title = "Наши выполненные проекты", 
  subtitle = "Гордость нашего производства в Астане",
  className = ""
}: ProjectsBentoProps) {

  const containerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLUListElement>(null);
  const clickStartCoords = useRef({ x: 0, y: 0 });
  
  const [dragWidth, setDragWidth] = useState(0);
  const [positionX, setPositionX] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Сортируем и дублируем проекты для бесконечной наполненности
  const sortedProjects = [...PROJECTS].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const displayProjects = [...sortedProjects, ...sortedProjects]; // 20 карточек в сумме

  // Вычисляем ширину контейнера для ограничений перетаскивания (bounds) без forced reflow
  useEffect(() => {
    const handleResize = () => {
      requestAnimationFrame(() => {
        setIsMobile(window.innerWidth < 768);
        if (carouselRef.current && containerRef.current) {
          setDragWidth(Math.max(0, carouselRef.current.scrollWidth - containerRef.current.offsetWidth));
        }
      });
    };
    
    // Небольшая задержка, чтобы все изображения и элементы успели отрендериться
    const timer = setTimeout(handleResize, 100);
    
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [displayProjects]);

  // Получить название категории
  const getCategoryLabel = (catId: string) => {
    const cat = CATEGORIES.find((c) => c.id === catId);
    return cat ? cat.label : "Вывеска";
  };

  // Клик по кнопкам навигации с чтением текущей матрицы трансформации (работает синхронно с ручным драгом!)
  const handleScrollClick = (direction: 'left' | 'right') => {
    triggerHaptic();
    if (!containerRef.current) return;
    
    if (isMobile) {
      const scrollAmount = 300;
      containerRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
      return;
    }

    if (!carouselRef.current) return;
    const step = 400;
    
    // Считываем текущее положение x из матрицы трансформации
    const style = window.getComputedStyle(carouselRef.current);
    const matrix = style.transform && style.transform !== 'none' 
      ? new DOMMatrix(style.transform) 
      : { m41: 0 };
    
    const currentX = matrix.m41;
    let newX = direction === 'right' ? currentX - step : currentX + step;
    
    // Ограничение движения по границам слайдера
    if (newX > 0) newX = 0;
    if (newX < -dragWidth) newX = -dragWidth;
    
    setPositionX(newX);
  };

  const triggerHaptic = () => {
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    clickStartCoords.current = { x: e.screenX, y: e.screenY };
  };

  const handleCardClick = (e: React.MouseEvent) => {
    const distanceX = Math.abs(e.screenX - clickStartCoords.current.x);
    const distanceY = Math.abs(e.screenY - clickStartCoords.current.y);
    if (distanceX > 10 || distanceY > 10) {
      e.preventDefault();
    } else {
      triggerHaptic();
    }
  };

  return (
    <section className={`py-20 lg:py-28 bg-slate-50/50 relative overflow-hidden border-t border-slate-200/60 ${className}`}>
      {/* Чертежная сетка на фоне (Blueprint Grid) */}
      <BlueprintGrid showGradients={false} className="opacity-80" />

      {/* Decorative ambient light glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-orange-500/[0.01] rounded-full pointer-events-none -z-10" />
      
      <div className="container mx-auto px-4">
        
        {/* Header Block with Navigation Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="text-left space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-black uppercase tracking-wider">
               <Folder className="w-3.5 h-3.5 text-orange-500"/> Галерея работ
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5.5xl font-black text-slate-950 tracking-tight leading-none">
               {title}
            </h2>
            <p className="text-slate-500 text-base sm:text-lg font-semibold leading-relaxed">
               {subtitle}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Link to Full Portfolio */}
            <Link 
              href="/portfolio" 
              onClick={triggerHaptic}
              className="group hidden sm:inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white hover:bg-slate-50 text-slate-800 rounded-xl font-bold text-xs uppercase tracking-wider border border-slate-200 shadow-sm active:scale-97 transition duration-200"
            >
              <span>Все работы</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"/>
            </Link>

            {/* Navigation Buttons */}
            <div className="flex gap-2.5">
               <button 
                  onClick={() => handleScrollClick('left')} 
                  className="p-3.5 rounded-xl border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 transition active:scale-95 shadow-sm cursor-pointer"
                  aria-label="Предыдущий проект"
               >
                  <ChevronLeft className="w-5 h-5"/>
               </button>
               <button 
                  onClick={() => handleScrollClick('right')} 
                  className="p-3.5 rounded-xl bg-orange-600 text-white hover:bg-orange-700 transition shadow-md shadow-orange-600/10 active:scale-95 cursor-pointer"
                  aria-label="Следующий проект"
               >
                  <ChevronRight className="w-5 h-5"/>
               </button>
            </div>
          </div>
        </div>

         {/* Framer Motion Draggable Slider Container with Inertia Physics */}
         <div 
           ref={containerRef}
           className="overflow-x-auto md:overflow-hidden -mx-4 px-4 md:mx-0 md:px-0 select-none cursor-grab active:cursor-grabbing scroll-smooth snap-x snap-mandatory hide-scrollbar"
         >
            <motion.ul
               ref={carouselRef}
               drag={isMobile ? false : "x"}
               dragConstraints={{ right: 0, left: -dragWidth }}
               dragElastic={0.15}
               dragTransition={{ power: 0.2, timeConstant: 300 }} // Мягкая инерция (momentum скролл)
               animate={isMobile ? undefined : { x: positionX }}
               transition={{ type: "spring", stiffness: 220, damping: 28 }}
               className="flex gap-6 pb-8 w-max"
            >
               {displayProjects.map((project, i) => {
                 const mainCategoryLabel = getCategoryLabel(project.categories[0]);
                 const completionDate = project.date || "2026-01-01";

                 return (
                   <FadeIn
                     key={`${project.id}-${i}`}
                     delay={(i % sortedProjects.length) * 40}
                     threshold={0.05}
                     as="li"
                     className="relative group flex-none w-[82vw] sm:w-[380px] h-[460px] bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.015)] hover:shadow-lg hover:border-slate-350 transition duration-500 select-none flex flex-col justify-end snap-center"
                   >
                     <Link
                       href={`/portfolio/${project.slug}`}
                       onMouseDown={handleMouseDown}
                       onClick={handleCardClick}
                       className="absolute inset-0 block w-full h-full text-left"
                       draggable={false}
                     >
                       {/* Background Image with Zoom */}
                       <div className="absolute inset-0 overflow-hidden rounded-3xl">
                         <Image 
                           src={project.image} 
                           alt={project.seoAlt || project.title}
                           fill
                           className="object-cover transition duration-700 group-hover:scale-[1.02] rounded-3xl" 
                           sizes="(max-width: 768px) 100vw, 380px"
                           loading="lazy"
                         />
                       </div>
                       
                       {/* Dark overlay for contrast */}
                       <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent transition duration-300 opacity-90 group-hover:opacity-95 pointer-events-none rounded-3xl"></div>
                       
                       {/* Category badge */}
                       <div className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white font-extrabold text-[10px] uppercase tracking-wider">
                          {mainCategoryLabel}
                       </div>

                       {/* Details panel */}
                       <div className="absolute bottom-0 left-0 right-0 z-10 w-full p-7 space-y-3.5 text-left">
                          
                          <h3 className="font-black text-white text-xl sm:text-2xl group-hover:text-orange-400 transition-colors leading-tight line-clamp-1">
                             {project.title}
                          </h3>
                          
                          <p className="text-slate-300 text-xs font-semibold leading-relaxed line-clamp-2">
                             {project.description}
                          </p>

                          {/* Stats badges */}
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                             {project.completionTime && (
                                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur text-white text-[10px] font-bold">
                                   <Clock className="w-3 h-3 text-orange-400"/>
                                   <time dateTime={completionDate}>{project.completionTime}</time>
                                </div>
                             )}
                             
                             {project.techSpecs.warranty && (
                                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur text-white text-[10px] font-bold">
                                   <ShieldCheck className="w-3 h-3 text-emerald-400"/>
                                   <span>Гарантия {project.techSpecs.warranty}</span>
                                </div>
                             )}

                             {project.location && (
                                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur text-white text-[10px] font-bold max-w-[180px] truncate">
                                   <MapPin className="w-3 h-3 text-blue-400 shrink-0"/>
                                   <span className="truncate">{project.location.split(',')[1] || project.location}</span>
                                </div>
                             )}
                          </div>

                       </div>
                     </Link>
                   </FadeIn>
                 );
               })}
            </motion.ul>
        </div>
      </div>
    </section>
  );
}