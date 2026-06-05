// components/services/ServiceExpertTips.tsx
"use client";

import { useRef } from "react";
import { 
  Wind, ShieldCheck, Zap, Sparkles, Lightbulb, 
  ShieldAlert, CheckCircle, CheckSquare, Star, UserCheck, HelpCircle 
} from "lucide-react";
import { ServiceDetailData } from "@/dictionaries/services/service-details";
import { EXPERTS } from "@/dictionaries/experts";

interface ServiceExpertTipsProps {
  data: ServiceDetailData;
}

const IconMap = {
  Wind, ShieldCheck, Zap, Sparkles, Lightbulb, 
  ShieldAlert, CheckCircle, CheckSquare, Star
};

function renderIcon(iconName: string, className = "w-6 h-6") {
  const IconComponent = IconMap[iconName as keyof typeof IconMap] || HelpCircle;
  return <IconComponent className={className} />;
}

export default function ServiceExpertTips({ data }: ServiceExpertTipsProps) {
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

  if (!data.expertTips) return null;

  const expert = EXPERTS[data.expertTips.expertId] || {
    name: "Данияр Бауржанович",
    role: "Главный технолог ADLight",
    badge: "Собственное производство в Астане",
    guarantee: "Гарантия 1 год"
  };

  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200/80">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-3 font-semibold">
            Советы инженера
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            {data.expertTips.title}
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            {data.expertTips.subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-stretch">
          {/* Левая часть: карточки советов */}
          <div 
            ref={sliderRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className="lg:col-span-7 flex overflow-x-auto lg:overflow-x-visible gap-6 pb-8 lg:pb-0 hide-scrollbar -mx-4 px-4 select-none cursor-grab active:cursor-grabbing snap-x snap-mandatory lg:cursor-default lg:flex-col lg:justify-between lg:mx-0 lg:px-0"
          >
            {data.expertTips.tips.map((tip, idx) => (
              <div 
                key={idx} 
                className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition duration-300 flex gap-6 items-start flex-none snap-center w-[85vw] sm:w-[360px] lg:w-auto lg:flex-initial lg:snap-align-none"
              >
                <div className="p-3.5 bg-orange-50 rounded-2xl text-orange-600 border border-orange-100 shrink-0">
                  {renderIcon(tip.iconName, "w-6 h-6")}
                </div>
                <div>
                  <h3 className="text-slate-900 font-bold text-lg mb-2">
                    {tip.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-normal">
                    {tip.desc}
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
                <div className="w-14 h-14 bg-orange-600 rounded-2xl flex items-center justify-center text-white shrink-0">
                  <UserCheck className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-extrabold text-lg text-white">{expert.name}</h4>
                  <p className="text-orange-400 text-xs font-semibold uppercase tracking-wider">{expert.role}</p>
                </div>
              </div>

              <blockquote className="text-slate-350 text-base italic leading-relaxed mb-8">
                &ldquo;{data.expertTips.expertQuote}&rdquo;
              </blockquote>
            </div>

            <div className="relative z-10 pt-6 border-t border-slate-700 flex justify-between items-center text-xs text-slate-400">
              <span>{expert.badge}</span>
              <span className="font-bold text-orange-400">{expert.guarantee}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
