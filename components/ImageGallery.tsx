"use client";

import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setIsOpen(false);
    document.body.style.overflow = "auto";
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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!images || images.length === 0) return null;

  return (
    <>
      {/* СЕТКА КАРТИНОК (ИСПРАВЛЕННАЯ, РОВНАЯ) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((img, i) => (
          <div 
            key={i} 
            onClick={() => openLightbox(i)}
            // Все карточки одинаковые и ровные
            className="aspect-video md:aspect-[4/3] relative group cursor-pointer overflow-hidden rounded-2xl bg-slate-800 border border-slate-700 hover:border-orange-500/30 transition duration-300"
          >
            <img 
                src={img} 
                alt={`Фото ${i + 1}`} 
                className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
            />
            
            {/* Оверлей и иконка при наведении */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="w-14 h-14 bg-white/10 backdrop-blur rounded-full flex items-center justify-center text-white border border-white/20">
                    <Maximize2 className="w-7 h-7"/>
                </div>
            </div>
          </div>
        ))}
      </div>

      {/* МОДАЛЬНОЕ ОКНО (LIGHTBOX) */}
      {isOpen && (
        <div 
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={closeLightbox}
        >
            <button className="absolute top-6 right-6 p-2 text-white/50 hover:text-white transition rounded-full hover:bg-white/10 z-50">
                <X className="w-8 h-8"/>
            </button>

            <div 
                className="relative max-w-7xl w-full max-h-[90vh] flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
            >
                <img 
                    src={images[currentIndex]} 
                    alt="Full screen" 
                    className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                />
            </div>

            {images.length > 1 && (
                <>
                    <button 
                        onClick={showPrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition backdrop-blur-md"
                    >
                        <ChevronLeft className="w-8 h-8"/>
                    </button>
                    <button 
                        onClick={showNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition backdrop-blur-md"
                    >
                        <ChevronRight className="w-8 h-8"/>
                    </button>
                </>
            )}
        </div>
      )}
    </>
  );
}