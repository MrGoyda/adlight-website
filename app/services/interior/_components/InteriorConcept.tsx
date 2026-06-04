// app/services/interior/_components/InteriorConcept.tsx

import { Scissors, Drill, HelpCircle } from "lucide-react";
import Image from "next/image";
import { interiorDetails } from "@/dictionaries/services/details/interior";

interface InteriorConceptProps {
  fallbackImage: string;
}

const IconMap = {
  Scissors,
  Drill,
};

function renderIcon(iconName: string, className = "w-6 h-6") {
  const IconComponent = IconMap[iconName as keyof typeof IconMap] || HelpCircle;
  return <IconComponent className={className} />;
}

export default function InteriorConcept({ fallbackImage }: InteriorConceptProps) {
  return (
    <section id="concept" className="py-24 bg-slate-50 border-t border-slate-200/80">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm relative overflow-hidden">
          {/* Subtle accent glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-[80px] rounded-full pointer-events-none"></div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-6 tracking-tight">
                {interiorDetails.conceptTitle}
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                {interiorDetails.conceptDesc}
              </p>

              <div className="space-y-6">
                {interiorDetails.conceptHighlights.map((hl, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="p-3 bg-orange-50 rounded-xl text-orange-600 border border-orange-100 shrink-0">
                      {renderIcon(hl.iconName, "w-6 h-6")}
                    </div>
                    <div>
                      <h4 className="text-slate-800 font-bold mb-1">
                        {hl.title}
                      </h4>
                      <p className="text-slate-500 text-sm leading-relaxed">
                        {hl.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video group shadow-md">
              <Image 
                src={fallbackImage} 
                alt={interiorDetails.title} 
                fill 
                className="object-cover opacity-90 transition duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
