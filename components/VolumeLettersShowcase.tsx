"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Moon, Sun, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useMotionValue, animate } from "framer-motion";
import { VOLUME_LETTERS_CATALOG } from "@/dictionaries/services/volume-letters";
import { cn } from "@/lib/utils";
import BlueprintGrid from "@/components/ui/BlueprintGrid";

export default function VolumeLettersShowcase() {
  const [isNightMode, setIsNightMode] = useState<boolean>(true);
  
  // Рефы для расчета ограничений перетаскивания во Framer Motion
  const viewportRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });

  // MotionValue для плавных пружинных перемещений карусели
  const x = useMotionValue(0);

  // Тактильный отклик (iOS)
  const triggerHaptic = (type: "light" | "medium" = "light") => {
    if (typeof window !== "undefined" && navigator.vibrate) {
      const duration = type === "light" ? 10 : 20;
      navigator.vibrate(duration);
    }
  };

  const handleToggle = () => {
    setIsNightMode((prev) => !prev);
    triggerHaptic("medium");
  };

  // Измерение ограничений драга при изменении размеров
  useEffect(() => {
    const handleResize = () => {
      if (!viewportRef.current || !innerRef.current) return;
      const viewportWidth = viewportRef.current.offsetWidth;
      const innerWidth = innerRef.current.scrollWidth;
      const limit = viewportWidth - innerWidth;
      setDragConstraints({ left: limit < 0 ? limit : 0, right: 0 });
    };

    // Слушатель через ResizeObserver для точного отслеживания
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    if (viewportRef.current) resizeObserver.observe(viewportRef.current);
    if (innerRef.current) resizeObserver.observe(innerRef.current);

    // Дополнительный вызов для первоначальной засечки
    handleResize();

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Функция для прокрутки карусели кнопками (с помощью пружинной анимации Framer Motion)
  const scroll = (direction: "left" | "right") => {
    if (!viewportRef.current) return;
    triggerHaptic("light");
    
    const viewportWidth = viewportRef.current.offsetWidth;
    const currentX = x.get();
    const scrollAmount = viewportWidth * 0.75; // Сдвиг на 75% экрана
    let targetX = direction === "left" ? currentX + scrollAmount : currentX - scrollAmount;

    // Ограничение по границам перетаскивания
    if (targetX > 0) targetX = 0;
    if (targetX < dragConstraints.left) targetX = dragConstraints.left;

    animate(x, targetX, {
      type: "spring",
      stiffness: 150,
      damping: 22,
      mass: 0.8,
    });
  };

  return (
    <section className="relative py-16 md:py-24 bg-white text-slate-900 overflow-hidden border-b border-slate-200">
      {/* Чертежная сетка на фоне (Blueprint Grid) */}
      <BlueprintGrid showGradients={false} className="opacity-80" />

      {/* Декоративные мягкие градиенты глубины в светлой теме */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.03)_0%,transparent_70%)] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.02)_0%,transparent_70%)] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        
        {/* ШАПКА, ПЕРЕКЛЮЧАТЕЛЬ ДЕНЬ/НОЧЬ И НАВИГАЦИОННЫЕ КНОПКИ */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 md:mb-14">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex">
              <span className="px-3.5 py-1 text-xs font-black uppercase tracking-wider text-orange-600 bg-orange-50 border border-orange-200/50 rounded-full">
                Технологии вывесок
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-slate-950">
              Премиальные технологии <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600">
                изготовления объемных букв
              </span>
            </h2>
            <p className="text-slate-600 text-base sm:text-lg font-medium leading-relaxed">
              Каждая технология создает уникальный характер бренда. Посмотрите, как меняется внешний вид вывески при включении ночной подсветки.
            </p>
          </div>

          {/* Панель управления: День/Ночь + Стрелки навигации */}
          <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-start">
            
            {/* Интерактивный мастер-переключатель день/ночь в светлой теме */}
            <button
              onClick={handleToggle}
              className="relative inline-flex h-12 w-28 items-center justify-between rounded-full bg-white border border-slate-200 p-1.5 transition-colors duration-300 focus:outline-none select-none active:scale-95 shadow-sm"
              aria-label="Переключить день и ночь"
            >
              {/* Подвижная круглая плашка */}
              <span
                className={cn(
                  "absolute top-1.5 bottom-1.5 left-1.5 w-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600 shadow-[0_2px_8px_rgba(249,115,22,0.35)] transition-all duration-500 ease-out",
                  isNightMode ? "translate-x-12" : "translate-x-0"
                )}
              />
              
              {/* Иконки */}
              <span className="z-10 flex w-12 justify-center transition-colors">
                <Sun className={cn("w-5 h-5", !isNightMode ? "text-white" : "text-slate-400")} />
              </span>
              <span className="z-10 flex w-12 justify-center transition-colors">
                <Moon className={cn("w-5 h-5", isNightMode ? "text-white" : "text-slate-400")} />
              </span>
            </button>

            {/* Навигационные кнопки для карусели */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => scroll("left")}
                className="w-12 h-12 rounded-full bg-white border border-slate-200 hover:border-slate-300 flex items-center justify-center text-slate-600 hover:text-slate-900 shadow-sm active:scale-95 transition-all"
                aria-label="Листать назад"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-12 h-12 rounded-full bg-white border border-slate-200 hover:border-slate-300 flex items-center justify-center text-slate-600 hover:text-slate-900 shadow-sm active:scale-95 transition-all"
                aria-label="Листать вперед"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* ГОРИЗОНТАЛЬНАЯ КАРУСЕЛЬ С КАРТОЧКАМИ ЧЕРЕЗ FRAMER MOTION DRAG */}
        <div 
          ref={viewportRef}
          className="w-full overflow-hidden pb-8 cursor-grab active:cursor-grabbing select-none"
        >
          <motion.div
            ref={innerRef}
            drag="x"
            dragConstraints={dragConstraints}
            dragElastic={0.08}
            style={{ x }}
            className="flex gap-6 md:gap-8 w-max px-4 md:px-8"
          >
            {VOLUME_LETTERS_CATALOG.map((tech) => {
              return (
                <div 
                  key={tech.id}
                  className="group flex flex-col justify-between rounded-3xl bg-white border border-slate-200/80 hover:border-orange-500/25 p-5 md:p-6 shadow-sm hover:shadow-[0_20px_50px_rgba(15,23,42,0.06)] transition-all duration-500 relative shrink-0 w-[290px] sm:w-[350px]"
                >
                  {/* Картинка с днем и ночью */}
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-5 bg-slate-50 border border-slate-100 pointer-events-none">
                    {/* Дневная картинка */}
                    <Image
                      src={tech.images.day}
                      alt={`${tech.title} - День`}
                      fill
                      className={cn(
                        "object-cover rounded-2xl transition-all duration-700 ease-in-out",
                        isNightMode ? "opacity-0 scale-98" : "opacity-100 scale-100"
                      )}
                      sizes="(max-width: 768px) 100vw, 30vw"
                      loading="lazy"
                    />
                    {/* Ночная картинка */}
                    <Image
                      src={tech.images.night}
                      alt={`${tech.title} - Ночь`}
                      fill
                      className={cn(
                        "object-cover rounded-2xl transition-all duration-700 ease-in-out",
                        isNightMode ? "opacity-100 scale-100" : "opacity-0 scale-98"
                      )}
                      sizes="(max-width: 768px) 100vw, 30vw"
                      loading="lazy"
                    />
                    {/* Мягкий контур */}
                    <div className="absolute inset-0 rounded-2xl border border-black/[0.03] z-20" />
                  </div>

                  {/* Описание технологии */}
                  <div className="space-y-3 flex-grow mb-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 group-hover:text-orange-600 transition-colors">
                          {tech.title}
                        </h3>
                      </div>
                      
                      <Link
                        href={`/services/volume-letters/${tech.slug}`}
                        onClick={() => triggerHaptic("light")}
                        className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center shrink-0 text-slate-400 group-hover:text-slate-900 group-hover:border-orange-500 transition-all hover:scale-105"
                        aria-label={`Подробнее о ${tech.title}`}
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </div>

                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-medium">
                      {tech.description}
                    </p>
                  </div>

                  {/* Цена и кнопка перехода */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="text-xs sm:text-sm font-black text-slate-900">
                      {tech.price}
                    </span>
                    
                    <Link 
                      href={`/services/volume-letters/${tech.slug}`}
                      onClick={() => triggerHaptic("light")}
                      className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-orange-600 hover:text-orange-700 transition-colors"
                    >
                      Подробнее
                      <span className="inline-block transform group-hover:translate-x-0.5 transition-transform">→</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Навигационные кнопки снизу только на мобилках */}
        <div className="flex sm:hidden items-center justify-center gap-4 mt-4">
          <button
            onClick={() => scroll("left")}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm active:scale-95"
            aria-label="Листать назад"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm active:scale-95"
            aria-label="Листать вперед"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
