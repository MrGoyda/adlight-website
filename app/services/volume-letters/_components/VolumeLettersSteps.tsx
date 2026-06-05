// app/services/volume-letters/_components/VolumeLettersSteps.tsx
"use client";

import { useRef } from "react";
import { VOLUME_LETTERS_STEPS, VOLUME_LETTERS_DICT } from "@/dictionaries/services/volume-letters";

export default function VolumeLettersSteps() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    isDown.current = true;
    sliderRef.current.style.cursor = "grabbing";
    sliderRef.current.style.scrollBehavior = "auto";
    sliderRef.current.style.scrollSnapType = "none";
    startX.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeft.current = sliderRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDown.current = false;
    if (sliderRef.current) {
      sliderRef.current.style.cursor = "grab";
      sliderRef.current.style.scrollBehavior = "smooth";
      sliderRef.current.style.scrollSnapType = "x mandatory";
    }
  };

  const handleMouseUp = () => {
    isDown.current = false;
    if (sliderRef.current) {
      sliderRef.current.style.cursor = "grab";
      sliderRef.current.style.scrollBehavior = "smooth";
      sliderRef.current.style.scrollSnapType = "x mandatory";
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.6;
    sliderRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200/80">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            {VOLUME_LETTERS_DICT.steps.title}
          </h2>
        </div>
        
        <div 
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className="flex overflow-x-auto gap-8 pb-8 hide-scrollbar -mx-4 px-4 select-none cursor-grab active:cursor-grabbing snap-x snap-mandatory md:grid md:grid-cols-5 md:gap-8 md:overflow-x-visible md:mx-0 md:px-0 md:pb-0"
        >
          {VOLUME_LETTERS_STEPS.map((item, i) => (
            <div key={i} className="relative flex flex-col items-center text-center group flex-none snap-center w-[70vw] sm:w-[240px] md:w-auto md:flex-initial">
              <div className="w-16 h-16 bg-white border-2 border-orange-500 rounded-full flex items-center justify-center text-orange-600 font-bold text-xl mb-6 mx-auto shadow-sm group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                {item.step}
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-orange-600 transition-colors">
                {item.title}
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed max-w-[240px]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
