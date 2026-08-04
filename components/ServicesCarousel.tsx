"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useMotionValue, animate } from "framer-motion";
import FadeIn from "@/components/ui/FadeIn";
import { CATALOG_SERVICES } from "@/dictionaries/services/catalog-services";

// Динамически получаем все услуги из общего каталога
const services = CATALOG_SERVICES.flatMap(group => 
  group.items.map(item => ({
    title: item.title,
    desc: item.description,
    price: item.price,
    link: item.link,
    image: item.image
  }))
);

interface ServicesCarouselProps {
  title?: string;
  subtitle?: string;
  hiddenLink?: string;
  headingLevel?: "h2" | "h3";
}

export default function ServicesCarousel({ 
  title = "Изготовление наружной рекламы в Астане", 
  subtitle = "Собственное производство вывесок полного цикла с гарантией до 3 лет",
  hiddenLink,
  headingLevel = "h2"
}: ServicesCarouselProps) {
  
  const displayedServices = services.filter(s => s.link !== hiddenLink);

  const containerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const [dragWidth, setDragWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const clickStartCoords = useRef({ x: 0, y: 0 });

  const x = useMotionValue(0);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (carouselRef.current && containerRef.current) {
        setDragWidth(Math.max(0, carouselRef.current.scrollWidth - containerRef.current.offsetWidth));
      }
    };
    
    const timer = setTimeout(handleResize, 100);
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [displayedServices]);

  const triggerHaptic = () => {
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;
    triggerHaptic();

    if (isMobile) {
      const scrollAmount = 350;
      containerRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
      return;
    }

    const viewportWidth = containerRef.current.offsetWidth;
    const currentX = x.get();
    const scrollAmount = viewportWidth * 0.75;
    let targetX = direction === 'left' ? currentX + scrollAmount : currentX - scrollAmount;

    if (targetX > 0) targetX = 0;
    if (targetX < -dragWidth) targetX = -dragWidth;

    animate(x, targetX, {
      type: "spring",
      stiffness: 150,
      damping: 22,
      mass: 0.8,
    });
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

  // Динамически рендерим нужный уровень заголовка для правильной SEO/AI иерархии
  const HeadingTag = headingLevel;

  return (
    <section 
      className="py-20 lg:py-28 bg-white relative overflow-hidden border-t border-slate-200/60"
      aria-label={title}
    >
       {/* Decorative subtle ambient light glow */}
       <div className="absolute left-0 bottom-0 w-[500px] h-[500px] bg-blue-500/[0.01] rounded-full pointer-events-none -z-10" />

       <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
            <div className="text-left space-y-4">
              <HeadingTag className="text-3xl sm:text-4xl md:text-5.5xl font-black text-slate-950 tracking-tight leading-none">
                 {title.includes("услуги") ? (
                   <>
                     Наши{" "}
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-600 to-red-600">услуги в Астане</span>
                   </>
                 ) : title}
              </HeadingTag>
              <p className="text-slate-500 text-sm md:text-base font-semibold">{subtitle}</p>
            </div>
            
            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end self-start md:self-end">
               <Link href="/services" className="text-orange-600 font-bold text-sm flex items-center gap-2 hover:text-orange-500 transition whitespace-nowrap">
                  Смотреть все <ArrowRight className="w-4 h-4"/>
               </Link>

               <div className="hidden md:flex gap-2.5">
                  <button 
                    onClick={() => scroll('left')} 
                    className="p-3.5 rounded-xl border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 transition active:scale-95 shadow-sm cursor-pointer"
                    aria-label="Предыдущий слайд"
                  >
                     <ChevronLeft className="w-5 h-5"/>
                  </button>
                  <button 
                    onClick={() => scroll('right')} 
                    className="p-3.5 rounded-xl bg-orange-600 text-white hover:bg-orange-700 transition shadow-md shadow-orange-600/10 active:scale-95 cursor-pointer"
                    aria-label="Следующий слайд"
                  >
                     <ChevronRight className="w-5 h-5"/>
                  </button>
               </div>
            </div>
          </div>
          
          {/* СЛАЙДЕР КОНТЕЙНЕР (С разметкой Schema.org ItemList для поисковиков и ИИ-ботов) */}
          <div 
            ref={containerRef}
            className="overflow-x-auto md:overflow-hidden -mx-4 px-4 md:mx-0 md:px-0 select-none cursor-grab active:cursor-grabbing scroll-smooth snap-x snap-mandatory hide-scrollbar"
            itemScope 
            itemType="https://schema.org/ItemList"
          >
              <motion.div
                ref={carouselRef}
                drag={isMobile ? false : "x"}
                dragConstraints={{ right: 0, left: -dragWidth }}
                dragElastic={0.1}
                dragTransition={{ power: 0.2, timeConstant: 300 }} // Мягкая инерция (momentum скролл)
                style={isMobile ? undefined : { x }}
                className="flex gap-6 pb-8 w-max"
              >
                {displayedServices.map((service, i) => (
                  <FadeIn
                    key={i}
                    delay={i * 50}
                    threshold={0.1}
                    className="flex-none snap-center"
                  >
                    <div
                      itemProp="itemListElement"
                      itemScope
                      itemType="https://schema.org/ListItem"
                      className="relative block"
                    >
                      {/* Метаданные для ИИ и Поисковых систем */}
                      <meta itemProp="position" content={String(i + 1)} />
                      <span itemProp="name" className="hidden">{service.title}</span>
                      
                      <Link 
                        href={service.link} 
                        draggable={false} 
                        onMouseDown={handleMouseDown}
                        onClick={handleCardClick}
                        className="relative group block w-[85vw] sm:w-[380px] h-[400px] md:h-[450px] rounded-3xl overflow-hidden [transform:translateZ(0)] border border-slate-200/80 hover:border-orange-500/30 transition duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.01)] hover:shadow-lg select-none"
                        itemProp="url"
                      >
                        {/* Картинка */}
                        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                          <Image
                            src={service.image}
                            alt={service.title}
                            fill
                            className="object-cover group-hover:scale-105 transition duration-700 rounded-3xl"
                            sizes="(max-width: 768px) 100vw, 380px"
                            loading="lazy"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent opacity-90 pointer-events-none rounded-3xl"></div>
                        
                        {/* Текст */}
                        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 pointer-events-none">
                          <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-orange-400 transition tracking-tight">{service.title}</h3>
                          <p className="text-gray-300 text-xs md:text-sm mb-6 line-clamp-2">{service.desc}</p>
                          <div className="flex justify-between items-center pt-4 border-t border-white/10">
                              <span className="text-orange-400 font-bold text-sm md:text-base">{service.price}</span>
                              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition">
                                 <ArrowRight className="w-4 h-4 md:w-5 md:h-5"/>
                              </div>
                          </div>
                        </div>
                     </Link>
                    </div>
                  </FadeIn>
                ))}
              </motion.div>
          </div>
       </div>
    </section>
  );
}