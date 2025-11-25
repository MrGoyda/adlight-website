"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom"; // <-- ВАЖНЫЙ ИМПОРТ
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false); // Проверка, что мы на клиенте

  // Убеждаемся, что компонент смонтирован на клиенте, прежде чем использовать портал
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Блокировка скролла
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

  // --- JSX ДЛЯ МОДАЛЬНОГО ОКНА ---
  const modalContent = (
    <div 
        className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300"
        onClick={closeLightbox}
    >
        {/* Кнопка Закрыть */}
        <button className="absolute top-6 right-6 p-2 text-white/60 hover:text-white transition rounded-full hover:bg-white/10 z-50">
            <X className="w-8 h-8"/>
        </button>

        {/* Контейнер картинки */}
        <div 
            className="relative max-w-7xl w-full h-full flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
        >
            <img 
                src={images[currentIndex]} 
                alt="Full screen" 
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
            />
        </div>

        {/* Навигация */}
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
      {/* СЕТКА КАРТИНОК (Остается на месте в потоке страницы) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((img, i) => (
          <div 
            key={i} 
            onClick={() => openLightbox(i)}
            className="aspect-video md:aspect-[4/3] relative group cursor-pointer overflow-hidden rounded-2xl bg-slate-800 border border-slate-700 hover:border-orange-500/30 transition duration-300"
          >
            <img 
                src={img} 
                alt={`Фото ${i + 1}`} 
                className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="w-14 h-14 bg-white/10 backdrop-blur rounded-full flex items-center justify-center text-white border border-white/20">
                    <Maximize2 className="w-7 h-7"/>
                </div>
            </div>
          </div>
        ))}
      </div>

      {/* МОДАЛЬНОЕ ОКНО (Рендерится через портал прямо в body) */}
      {mounted && isOpen && createPortal(modalContent, document.body)}
    </>
  );
}