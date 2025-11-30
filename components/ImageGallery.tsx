"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight, Maximize2, ChevronDown, ChevronUp } from "lucide-react";

interface ImageGalleryProps {
  images?: string[];
}

export default function ImageGallery({ images = [] }: ImageGalleryProps) {
  // 1. Безопасный массив данных
  const safeImages = Array.isArray(images) ? images : [];
  
  // 2. Реф для скролла к началу галереи
  const galleryTopRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  
  const INITIAL_COUNT = 10;
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  
  // 3. Вычисления на основе безопасного массива
  const visibleImages = safeImages.slice(0, visibleCount);
  const hasMore = visibleCount < safeImages.length;
  const canCollapse = visibleCount > INITIAL_COUNT;

  const showMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  const showLess = () => {
    // Сначала скроллим, потом сворачиваем (или одновременно), 
    // чтобы пользователь не потерял контекст
    galleryTopRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    
    // Небольшая задержка или сразу сворачиваем — React обработает это быстро.
    // Сворачиваем список обратно
    setVisibleCount(INITIAL_COUNT);
  };

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Блокировка скролла при открытом модальном окне
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeLightbox = () => {
    setIsOpen(false);
  };

  const showNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % safeImages.length);
  };

  const showPrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, safeImages.length]);

  if (safeImages.length === 0) {
    return null; 
  }

  // Модальное окно (Лайтбокс)
  const modalContent = (
    <div 
        className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300"
        onClick={closeLightbox}
    >
        <button className="absolute top-6 right-6 p-2 text-white/60 hover:text-white transition rounded-full hover:bg-white/10 z-50">
            <X className="w-8 h-8"/>
        </button>

        <div 
            className="relative max-w-7xl w-full h-full flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
        >
            <img 
                src={safeImages[currentIndex]} 
                alt="Full screen" 
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-sm bg-black/50 px-3 py-1 rounded-full">
               {currentIndex + 1} / {safeImages.length}
            </div>
        </div>

        {safeImages.length > 1 && (
            <>
                <button onClick={showPrev} className="absolute left-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/20 hover:bg-black/50 text-white transition backdrop-blur-md z-50 group">
                    <ChevronLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform"/>
                </button>
                <button onClick={showNext} className="absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/20 hover:bg-black/50 text-white transition backdrop-blur-md z-50 group">
                    <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform"/>
                </button>
            </>
        )}
    </div>
  );

  return (
    <>
      {/* Этот div служит "якорем" для скролла. 
          scroll-mt-24 добавляет отступ сверху (чтобы не перекрывалось хедером) 
      */}
      <div ref={galleryTopRef} className="scroll-mt-32">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {visibleImages.map((img, i) => (
            <div 
                key={i} 
                onClick={() => openLightbox(i)}
                className="aspect-square relative group cursor-pointer overflow-hidden rounded-xl bg-slate-800 border border-slate-700 hover:border-orange-500/30 transition-all duration-300 animate-in fade-in slide-in-from-bottom-8 fill-mode-both"
                style={{ 
                    animationDelay: `${(i % 10) * 50}ms` 
                }}
            >
                <img 
                    src={img} 
                    alt={`Фото ${i + 1}`} 
                    className="w-full h-full object-cover transition duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                    loading="lazy" 
                />
                
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="w-10 h-10 bg-white/10 backdrop-blur rounded-full flex items-center justify-center text-white border border-white/20 transform scale-75 group-hover:scale-100 transition">
                        <Maximize2 className="w-5 h-5"/>
                    </div>
                </div>
            </div>
            ))}
        </div>
      </div>

      {/* ПАНЕЛЬ УПРАВЛЕНИЯ */}
      {(hasMore || canCollapse) && (
        <div className="mt-12 flex flex-col items-center gap-4">
           <div className="flex flex-wrap justify-center gap-4">
              {hasMore && (
                <button 
                  onClick={showMore}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-xl border border-slate-700 text-white hover:bg-slate-800 hover:border-slate-600 transition active:scale-95 group"
                >
                   Показать еще <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform"/>
                </button>
              )}
              
              {canCollapse && (
                <button 
                  onClick={showLess}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-600 transition active:scale-95 group"
                >
                   Свернуть <ChevronUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform"/>
                </button>
              )}
           </div>

           <p className="text-slate-500 text-xs animate-pulse">
              Показано {visibleCount > safeImages.length ? safeImages.length : visibleCount} из {safeImages.length}
           </p>
        </div>
      )}

      {mounted && isOpen && createPortal(modalContent, document.body)}
    </>
  );
}