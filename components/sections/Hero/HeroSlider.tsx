"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface HeroSliderProps {
  sliderImages: string[];
}

export default function HeroSlider({ sliderImages }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loadedSlides, setLoadedSlides] = useState<number[]>([0]);

  useEffect(() => {
    if (sliderImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        const next = (prev + 1) % sliderImages.length;
        setLoadedSlides((loaded) => loaded.includes(next) ? loaded : [...loaded, next]);
        return next;
      });
    }, 5000); // Медленная смена каждые 5 секунд
    return () => clearInterval(interval);
  }, [sliderImages.length]);

  return (
    <div className="w-full h-full rounded-3xl overflow-hidden border border-slate-200/80 shadow-[0_30px_70px_rgba(0,0,0,0.12)] relative bg-slate-50">
      {sliderImages.map((src, idx) => {
        // Рендерим только уже посещенные слайды и следующий предзагружаемый
        const isNeeded = loadedSlides.includes(idx) || idx === (currentSlide + 1) % sliderImages.length;
        if (!isNeeded) return null;

        return (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === currentSlide
                ? "opacity-100 z-10"
                : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <Image
              src={idx === 0 ? "/images/hero-first.webp" : src}
              alt="Выполненные проекты ADLight наружная реклама"
              fill
              className="object-cover rounded-3xl"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 450px, 550px"
              priority={idx === 0}
              loading={idx === 0 ? "eager" : "lazy"}
              // @ts-ignore
              fetchPriority={idx === 0 ? "high" : "auto"}
            />
          </div>
        );
      })}

      {/* Мягкий градиент затемнения по нижнему краю для интеграции в темную тему */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent pointer-events-none z-20"></div>
    </div>
  );
}
