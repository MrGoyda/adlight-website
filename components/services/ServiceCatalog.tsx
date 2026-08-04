// components/services/ServiceCatalog.tsx
"use client";

import { useRef } from "react";
import Image from "next/image";
import { ServiceDetailData } from "@/dictionaries/services/service-details";
import { getCdnUrl } from "@/lib/serverUtils";

interface ServiceCatalogProps {
  data: ServiceDetailData;
}

export default function ServiceCatalog({ data }: ServiceCatalogProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    isDown.current = true;
    sliderRef.current.style.cursor = 'grabbing';
    sliderRef.current.style.scrollBehavior = 'auto';
    sliderRef.current.style.scrollSnapType = 'none';
    startX.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeft.current = sliderRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDown.current = false;
    if (sliderRef.current) {
      sliderRef.current.style.cursor = 'grab';
      sliderRef.current.style.scrollBehavior = 'smooth';
      sliderRef.current.style.scrollSnapType = 'x mandatory';
    }
  };

  const handleMouseUp = () => {
    isDown.current = false;
    if (sliderRef.current) {
      sliderRef.current.style.cursor = 'grab';
      sliderRef.current.style.scrollBehavior = 'smooth';
      sliderRef.current.style.scrollSnapType = 'x mandatory';
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
    <section id="catalog" aria-labelledby="catalog-heading" className="py-24 bg-white border-t border-slate-200/80">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-3 font-semibold">
            Варианты и типы
          </span>
          <h2 id="catalog-heading" className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            {data.typesTitle}
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
            {data.typesSubtitle}
          </p>
        </div>

        <div 
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className="flex overflow-x-auto gap-6 pb-8 hide-scrollbar -mx-4 px-4 select-none cursor-grab active:cursor-grabbing snap-x snap-mandatory md:cursor-default md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 md:overflow-x-visible md:pb-0"
        >
          {data.types.map((type, i) => (
            <div 
              key={i} 
              className="group flex flex-col rounded-3xl overflow-hidden border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-orange-500/30 cursor-default shadow-sm hover:shadow-md transition-all duration-300 flex-none snap-center w-[85vw] sm:w-[360px] md:w-auto md:flex-initial md:snap-align-none"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 border-b border-slate-200">
                {type.tag && (
                  <span className="absolute top-4 left-4 z-10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-orange-600 text-white rounded-md shadow-md">
                    {type.tag}
                  </span>
                )}
                {type.hex && !type.image ? (
                  /* Имитация неонового свечения на темной подложке если нет фото */
                  <div className="absolute inset-0 bg-slate-950 flex items-center justify-center p-6">
                    {/* Текстура темного карбонового или акрилового задника */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.webp')] opacity-20"></div>
                    
                    {/* Держатель неона (оргстекло-подложка) */}
                    <div className="relative w-3/4 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.05)]">
                      {/* Сам светящийся силиконовый шнур */}
                      <div 
                        className="w-11/12 h-3.5 rounded-full transition-all duration-500 group-hover:scale-y-110"
                        style={{
                          backgroundColor: '#ffffff',
                          border: `1px solid ${type.hex}`,
                          boxShadow: `0 0 8px #fff, 0 0 15px ${type.hex}, 0 0 30px ${type.hex}, 0 0 40px ${type.hex}`,
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <Image 
                    src={getCdnUrl(type.image || "/images/pages/assembly_workshop.png")} 
                    alt={type.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                )}
              </div>

              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-orange-600 transition-colors duration-300">
                  {type.title}
                </h3>
                <p className="text-slate-655 text-slate-600 text-sm leading-relaxed mb-6 flex-grow">
                  {type.desc}
                </p>

                <div className="mt-auto pt-6 border-t border-slate-150/80 space-y-4 text-sm">
                  {type.specs && (
                    <div className="text-slate-600">
                      <strong className="text-slate-800 font-semibold block mb-1">
                        ⚙️ Технические характеристики:
                      </strong>
                      <span className="leading-relaxed">{type.specs}</span>
                    </div>
                  )}
                  {type.bestFor && (
                    <div className="text-slate-600">
                      <strong className="text-slate-800 font-semibold block mb-1">
                        🎯 Рекомендуемое применение:
                      </strong>
                      <span className="leading-relaxed">{type.bestFor}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
