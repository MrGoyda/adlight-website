"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight, Maximize2, ChevronDown } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  
  // ПАГИНАЦИЯ
  const [visibleCount, setVisibleCount] = useState(10);
  const visibleImages = images.slice(0, visibleCount);
  const hasMore = visibleCount < images.length;

  const showMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

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
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const showPrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
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
  }, [isOpen]);

  if (!images || images.length === 0) return null;

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
                src={images[currentIndex]} 
                alt="Full screen" 
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-sm bg-black/50 px-3 py-1 rounded-full">
               {currentIndex + 1} / {images.length}
            </div>
        </div>

        {images.length > 1 && (
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
      {/* СЕТКА: 
          grid-cols-2 (моб)
          md:grid-cols-4 (планшет/малый ноут)
          lg:grid-cols-5 (ПК - 5 в ряд!)
      */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {visibleImages.map((img, i) => (
          <div 
            key={i} 
            onClick={() => openLightbox(i)}
            // duration-500: анимация длится 0.5с
            // fill-mode-both: сохраняет состояние анимации
            className="aspect-square relative group cursor-pointer overflow-hidden rounded-xl bg-slate-800 border border-slate-700 hover:border-orange-500/30 transition-all duration-300 animate-in fade-in slide-in-from-bottom-8 fill-mode-both"
            style={{ 
                // Умная задержка: каждые новые 10 картинок анимируются с нуля
                animationDelay: `${(i % 10) * 50}ms` 
            }}
          >
            <img 
                src={img} 
                alt={`Фото ${i + 1}`} 
                className="w-full h-full object-cover transition duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
            />
            
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="w-10 h-10 bg-white/10 backdrop-blur rounded-full flex items-center justify-center text-white border border-white/20 transform scale-75 group-hover:scale-100 transition">
                    <Maximize2 className="w-5 h-5"/>
                </div>
            </div>
          </div>
        ))}
      </div>

      {/* КНОПКА ПОКАЗАТЬ ЕЩЕ */}
      {hasMore && (
        <div className="mt-12 text-center">
           <button 
             onClick={showMore}
             className="inline-flex items-center gap-2 px-8 py-3 rounded-xl border border-slate-700 text-white hover:bg-slate-800 hover:border-slate-600 transition active:scale-95 group"
           >
              Показать еще <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform"/>
           </button>
           <p className="text-slate-500 text-xs mt-3 animate-pulse">
              Показано {visibleCount} из {images.length}
           </p>
        </div>
      )}

      {mounted && isOpen && createPortal(modalContent, document.body)}
    </>
  );
}