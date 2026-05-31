// app/services/volume-letters/[slug]/_components/FaceLitGallery.tsx
'use client';

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight, Maximize2, ChevronDown, ChevronUp } from "lucide-react";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";

interface FaceLitGalleryProps {
  images?: string[];
  projectTitle?: string;
}

export default function FaceLitGallery({ images = [], projectTitle }: FaceLitGalleryProps) {
  const safeImages = Array.isArray(images) ? images : [];
  const galleryTopRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  
  const INITIAL_COUNT = 8;
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  
  const visibleImages = safeImages.slice(0, visibleCount);
  const hasMore = visibleCount < safeImages.length;
  const canCollapse = visibleCount > INITIAL_COUNT;

  const showMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  const showLess = () => {
    galleryTopRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setVisibleCount(INITIAL_COUNT);
  };

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      lockScroll("face-lit-gallery");
    } else {
      unlockScroll("face-lit-gallery");
    }
    return () => {
      unlockScroll("face-lit-gallery");
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
    return (
      <div className="text-center text-slate-400 py-16 border border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
        Фотографии выполненных проектов появятся в ближайшее время...
      </div>
    ); 
  }

  const modalContent = (
    <div 
      className="fixed inset-0 z-[99999] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300"
      onClick={closeLightbox}
    >
      <button className="absolute top-6 right-6 p-3 text-white/70 hover:text-white transition rounded-full bg-white/5 hover:bg-white/15 z-50">
        <X className="w-6 h-6"/>
      </button>

      <div 
        className="relative max-w-5xl w-full h-full flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img 
          src={safeImages[currentIndex]} 
          alt="Full screen project" 
          className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-300"
        />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-xs font-bold font-mono bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full shadow-lg">
          {currentIndex + 1} / {safeImages.length}
        </div>
      </div>

      {safeImages.length > 1 && (
        <>
          <button onClick={showPrev} className="absolute left-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/5 hover:bg-white/15 text-white transition backdrop-blur-md z-50 group border border-white/5">
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform"/>
          </button>
          <button onClick={showNext} className="absolute right-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/5 hover:bg-white/15 text-white transition backdrop-blur-md z-50 group border border-white/5">
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform"/>
          </button>
        </>
      )}
    </div>
  );

  return (
    <>
      <div ref={galleryTopRef} className="scroll-mt-32">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {visibleImages.map((img, i) => (
            <div 
              key={i} 
              onClick={() => openLightbox(i)}
              className="aspect-[4/3] relative group cursor-pointer overflow-hidden rounded-3xl bg-white border border-slate-200/60 hover:border-orange-500/30 transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] hover:-translate-y-1 animate-in fade-in duration-300 fill-mode-both"
              style={{ animationDelay: `${(i % 8) * 60}ms` }}
            >
              <Image 
                src={img} 
                alt={projectTitle ? `${projectTitle} — ${i + 1}` : `Фото ${i + 1}`} 
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              
              <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/20 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="w-12 h-12 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-slate-900 border border-white shadow-xl transform scale-75 group-hover:scale-100 transition-all duration-500">
                  <Maximize2 className="w-5 h-5"/>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {(hasMore || canCollapse) && (
        <div className="mt-12 flex flex-col items-center gap-4">
          <div className="flex flex-wrap justify-center gap-4">
            {hasMore && (
              <button 
                onClick={showMore}
                className="group flex items-center gap-2 px-6 py-3 font-bold text-slate-700 bg-white border border-slate-200 hover:border-orange-500 hover:text-orange-600 transition-all duration-300 rounded-2xl shadow-sm hover:shadow-md"
              >
                Показать еще
                <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform"/>
              </button>
            )}
            
            {canCollapse && (
              <button 
                onClick={showLess}
                className="group flex items-center gap-2 px-6 py-3 font-bold text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition-all duration-300 rounded-2xl"
              >
                Свернуть
                <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform"/>
              </button>
            )}
          </div>

          <p className="text-slate-400 text-xs font-semibold">
            Показано {visibleCount > safeImages.length ? safeImages.length : visibleCount} из {safeImages.length}
          </p>
        </div>
      )}

      {mounted && isOpen && createPortal(modalContent, document.body)}
    </>
  );
}
