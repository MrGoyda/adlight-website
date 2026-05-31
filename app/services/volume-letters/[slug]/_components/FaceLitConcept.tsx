// app/services/volume-letters/[slug]/_components/FaceLitConcept.tsx
'use client';

import Image from "next/image";
import { VolumeLetterDetailData } from "@/dictionaries/services/volume-letters";

// Helper to map icon names to Lucide icons
import { Sun, CheckCircle, Eye, Gem, Utensils, Building2, HelpCircle } from "lucide-react";

const IconHelper = ({ name, className }: { name: string; className: string }) => {
  switch (name) {
    case "CheckCircle":
      return <CheckCircle className={className} />;
    case "Eye":
      return <Eye className={className} />;
    case "Utensils":
      return <Utensils className={className} />;
    case "Building2":
      return <Building2 className={className} />;
    case "Gem":
      return <Gem className={className} />;
    default:
      return <HelpCircle className={className} />;
  }
};

interface FaceLitConceptProps {
  data: VolumeLetterDetailData;
  galleryImages: string[];
}

export default function FaceLitConcept({ data, galleryImages }: FaceLitConceptProps) {
  return (
    <section className="py-20 lg:py-32 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-orange-100 rounded-full blur-[120px] opacity-40"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
          
          <div className="lg:w-5/12 lg:sticky lg:top-32">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 border border-orange-200 text-orange-700 font-bold mb-6 text-xs uppercase tracking-widest">
              <Sun className="w-3.5 h-3.5 text-orange-600"/> {data.conceptSubtitle}
            </span>
            
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-950 mb-6 leading-tight tracking-tight">
              {data.conceptTitle}
            </h2>
            
            <p className="text-slate-600 text-lg leading-relaxed mb-10 border-l-2 border-slate-300 pl-6">
              {data.conceptDesc}
            </p>

            <div className="grid gap-4">
              {data.conceptHighlights.map((highlight, idx) => (
                <div key={idx} className="group p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-orange-500/30 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 shrink-0">
                      <IconHelper name={highlight.iconName} className="w-5 h-5"/>
                    </div>
                    <div>
                      <h4 className="text-slate-900 font-bold text-base mb-1">{highlight.title}</h4>
                      <p className="text-slate-500 text-sm leading-relaxed">{highlight.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Правая Bento-сетка картинок */}
          <div className="w-full lg:w-7/12">
            <div className="flex overflow-x-auto pb-8 -mx-4 px-4 lg:grid lg:grid-cols-2 lg:gap-5 lg:overflow-visible lg:pb-0 lg:px-0 hide-scrollbar snap-x snap-mandatory">
              <div className="min-w-[85vw] sm:min-w-[300px] lg:min-w-0 lg:col-span-2 relative h-[280px] lg:h-[420px] rounded-3xl overflow-hidden group border border-slate-100 hover:border-orange-500/30 transition-all duration-500 snap-center bg-slate-950 shadow-xl">
                <Image 
                  src={galleryImages[0] || "/images/pages/face-lit-04.webp"} 
                  alt="Пример световой объемной буквы со световым лицом" 
                  fill 
                  className="object-cover transition duration-700 group-hover:scale-105 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">Архитектурный стандарт Астаны</h3>
                  <p className="text-slate-300 text-sm max-w-md">Вывески соответствуют климатическим нагрузкам столицы и полностью согласуются с городским Акиматом.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
