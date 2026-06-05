// app/services/volume-letters/[slug]/_components/FaceLitAnatomy.tsx
'use client';

import { useRef } from "react";
import { Layers, Shield, Zap, HelpCircle, Activity, Compass, Hammer } from "lucide-react";
import { VolumeLetterDetailData } from "@/dictionaries/services/volume-letters";

const IconHelper = ({ name, className }: { name: string; className: string }) => {
  switch (name) {
    case "Layers":
      return <Layers className={className} />;
    case "Shield":
      return <Shield className={className} />;
    case "Zap":
      return <Zap className={className} />;
    case "Compass":
      return <Compass className={className} />;
    case "Hammer":
      return <Hammer className={className} />;
    case "Activity":
      return <Activity className={className} />;
    default:
      return <HelpCircle className={className} />;
  }
};

interface FaceLitAnatomyProps {
  data: VolumeLetterDetailData;
}

export default function FaceLitAnatomy({ data }: FaceLitAnatomyProps) {
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
    <section className="py-24 bg-slate-50 relative overflow-hidden border-t border-b border-slate-200">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:40px_40px] opacity-40"></div>
      
      <div className="container mx-auto px-4 max-w-[1400px] relative z-10">
        <div className="text-center mb-16">
          <span className="text-orange-600 font-extrabold text-sm uppercase tracking-widest mb-2 block">Технический разбор</span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-950 tracking-tight">Анатомия безупречного качества ADLight</h2>
        </div>
        
        <div 
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className="flex overflow-x-auto gap-6 pb-8 hide-scrollbar -mx-4 px-4 select-none cursor-grab active:cursor-grabbing snap-x snap-mandatory md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 md:overflow-x-visible md:pb-0"
        >
          {data.anatomy.map((part, index) => (
            <div key={index} className="group relative bg-white p-8 rounded-[2rem] border border-slate-200 hover:border-orange-500/50 transition-all duration-500 flex flex-col shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex-none snap-center w-[85vw] sm:w-[360px] md:w-auto md:flex-initial">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 text-orange-600 group-hover:scale-110 transition-all duration-300">
                <IconHelper name={part.iconName} className="w-8 h-8"/>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{part.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed flex-1">{part.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
