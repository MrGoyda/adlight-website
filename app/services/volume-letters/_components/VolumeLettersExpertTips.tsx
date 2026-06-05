"use client";

import { useRef } from "react";
import { Maximize2, Compass, Layers, UserCheck } from "lucide-react";
import { VOLUME_LETTERS_EXPERT, VOLUME_LETTERS_DICT } from "@/dictionaries/services/volume-letters";

export default function VolumeLettersExpertTips() {
  const data = VOLUME_LETTERS_EXPERT.technologistTips;
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
    <section id="expert-tips" className="py-24 bg-slate-50 border-t border-slate-200/80 relative">
      <div className="container mx-auto px-4 max-w-[1400px] relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 rounded-full uppercase tracking-wider">
            <UserCheck className="w-3.5 h-3.5" />
            {VOLUME_LETTERS_DICT.expertTips.badge}
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            {data.title}
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
            {data.subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-stretch">
          {/* Левая часть: карточки советов (горизонтальный скролл на мобильном) */}
          <div 
            ref={sliderRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className="lg:col-span-7 flex overflow-x-auto lg:overflow-x-visible gap-6 pb-8 lg:pb-0 hide-scrollbar -mx-4 px-4 select-none cursor-grab active:cursor-grabbing snap-x snap-mandatory lg:flex-col lg:justify-between lg:mx-0 lg:px-0"
          >
            {data.tips.map((item, idx) => (
              <div 
                key={idx} 
                className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition duration-300 flex gap-6 items-start flex-none snap-center w-[85vw] sm:w-[360px] lg:w-auto lg:flex-initial"
              >
                <div className="p-3.5 bg-orange-50 rounded-2xl text-orange-600 border border-orange-100 shrink-0">
                  {idx === 0 && <Maximize2 className="w-6 h-6" />}
                  {idx === 1 && <Compass className="w-6 h-6" />}
                  {idx === 2 && <Layers className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-slate-905 text-slate-900 font-bold text-lg mb-2">
                    {VOLUME_LETTERS_DICT.expertTips.facadeLabel}: {item.facade}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-normal">
                    {item.recommendation}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Правая часть: Блок специалиста */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-10 text-white relative overflow-hidden flex flex-col justify-between shadow-xl">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.webp')] opacity-5"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-orange-600 rounded-full flex items-center justify-center text-white font-black shrink-0 text-lg">
                  {data.expertName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-extrabold text-lg text-white">{data.expertName}</h4>
                  <p className="text-orange-400 text-xs font-semibold uppercase tracking-wider">{data.expertRole}</p>
                </div>
              </div>

              <blockquote className="text-slate-300 text-base italic leading-relaxed mb-8">
                &ldquo;{VOLUME_LETTERS_DICT.expertTips.quote}&rdquo;
              </blockquote>
            </div>

            <div className="relative z-10 pt-6 border-t border-slate-700 flex justify-between items-center text-xs text-slate-400">
              <span>{VOLUME_LETTERS_DICT.expertTips.footerProduction}</span>
              <span className="font-bold text-orange-400">{VOLUME_LETTERS_DICT.expertTips.footerWarranty}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
