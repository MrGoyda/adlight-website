// app/services/volume-letters/[slug]/_components/FaceLitOtherTypes.tsx
'use client';

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { VolumeLetterTechItem } from "@/dictionaries/services/volume-letters";

interface FaceLitOtherTypesProps {
  otherTypes: VolumeLetterTechItem[];
}

export default function FaceLitOtherTypes({ otherTypes }: FaceLitOtherTypesProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Рефы для Drag-to-scroll без дерганий
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const isDragging = useRef(false);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 420;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    isDown.current = true;
    isDragging.current = false;
    
    // Apple Smooth Physics: отключаем smooth behavior и snap-scroll во время драга
    scrollContainerRef.current.style.cursor = 'grabbing';
    scrollContainerRef.current.style.scrollBehavior = 'auto';
    scrollContainerRef.current.style.scrollSnapType = 'none';

    startX.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeft.current = scrollContainerRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDown.current = false;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab';
      scrollContainerRef.current.style.scrollBehavior = 'smooth';
      scrollContainerRef.current.style.scrollSnapType = 'x mandatory'; // Возвращаем привязку скролла
    }
  };

  const handleMouseUp = () => {
    isDown.current = false;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab';
      scrollContainerRef.current.style.scrollBehavior = 'smooth';
      scrollContainerRef.current.style.scrollSnapType = 'x mandatory'; // Возвращаем привязку скролла
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !scrollContainerRef.current) return;
    e.preventDefault();
    isDragging.current = true;
    
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.6; // Высокая чувствительность и плавность
    scrollContainerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    if (isDragging.current) {
      e.preventDefault();
    }
  };

  const triggerHaptic = () => {
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const handleScrollClick = (direction: 'left' | 'right') => {
    triggerHaptic();
    scroll(direction);
  };

  return (
    <section className="py-24 bg-white border-t border-slate-200/80 relative select-none">
      <div className="container mx-auto px-4">
        
        {/* Шапка с кнопками управления */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-orange-600 font-extrabold text-sm uppercase tracking-widest mb-2 block">Альтернативные варианты</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-950 tracking-tight">Другие типы объемных букв</h2>
          </div>
          
          <div className="flex gap-3 shrink-0">
            <button 
              onClick={() => handleScrollClick('left')}
              className="p-3.5 rounded-xl border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 transition active:scale-95 shadow-sm cursor-pointer"
              aria-label="Листать влево"
            >
              <ChevronLeft className="w-5 h-5"/>
            </button>
            <button 
              onClick={() => handleScrollClick('right')}
              className="p-3.5 rounded-xl bg-orange-600 text-white hover:bg-orange-700 transition shadow-md shadow-orange-600/10 active:scale-95 cursor-pointer"
              aria-label="Листать вправо"
            >
              <ChevronRight className="w-5 h-5"/>
            </button>
          </div>
        </div>

        {/* Скролл-контейнер с физикой сглаживания Apple */}
        <div 
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-none hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 cursor-grab active:cursor-grabbing"
          style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          {otherTypes.map((type) => (
            <Link 
              key={type.id} 
              href={`/services/volume-letters/${type.slug}`}
              onClick={handleLinkClick}
              className="group snap-start bg-slate-50 rounded-[2rem] overflow-hidden border border-slate-200/60 hover:border-orange-500/40 transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.01)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:-translate-y-1 cursor-pointer flex flex-col h-full min-w-[280px] sm:min-w-[310px] max-w-[310px] shrink-0"
              draggable="false"
            >
              {/* Превью со сменой дня и ночи при наведении */}
              <div className="h-48 relative bg-slate-950 shrink-0 overflow-hidden rounded-t-[2rem]" draggable="false">
                <Image 
                  src={type.images.night} 
                  alt={`${type.title} ночью`} 
                  fill 
                  className="object-cover opacity-90 group-hover:opacity-0 transition-opacity duration-700"
                  draggable="false"
                />
                <Image 
                  src={type.images.day} 
                  alt={`${type.title} днем`} 
                  fill 
                  className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  draggable="false"
                />
              </div>

              {/* Текстовая панель */}
              <div className="p-6 flex flex-col flex-1" draggable="false">
                <h4 className="text-slate-950 font-bold text-lg mb-2 group-hover:text-orange-600 transition-colors duration-300 line-clamp-2">
                  {type.title}
                </h4>
                <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
                  {type.description}
                </p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-200/60">
                  <span className="text-slate-400 text-xs font-semibold">Базовая ставка</span>
                  <span className="text-orange-600 font-extrabold text-base">{type.price}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
