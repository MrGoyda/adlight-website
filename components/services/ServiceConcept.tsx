// components/services/ServiceConcept.tsx
"use client";

import { 
  Wind, Anchor, Umbrella, Lightbulb, MapPin, Zap, 
  Frame, Construction, Layers, Store, Camera, Coins, HelpCircle 
} from "lucide-react";
import Image from "next/image";
import { ServiceDetailData } from "@/dictionaries/services/service-details";

interface ServiceConceptProps {
  data: ServiceDetailData;
  fallbackImage: string;
}

const IconMap = {
  Wind, Anchor, Umbrella, Lightbulb, MapPin, Zap, 
  Frame, Construction, Layers, Store, Camera, Coins
};

function renderIcon(iconName: string, className = "w-6 h-6") {
  const IconComponent = IconMap[iconName as keyof typeof IconMap] || HelpCircle;
  return <IconComponent className={className} />;
}

export default function ServiceConcept({ data, fallbackImage }: ServiceConceptProps) {
  return (
    <section id="concept" className="py-24 bg-slate-50 border-t border-slate-200/80">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm relative overflow-hidden">
          {/* Subtle accent glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-[80px] rounded-full pointer-events-none"></div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-6 tracking-tight">
                {data.conceptTitle}
              </h2>
              <p className="text-slate-655 text-slate-600 text-sm md:text-base leading-relaxed mb-8">
                {data.conceptDesc}
              </p>

              <div className="space-y-6 mb-8">
                {data.conceptHighlights.map((hl, i) => (
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

              {data.conceptQuote && (
                <div className="bg-amber-50 border-l-4 border-orange-500 p-5 rounded-r-2xl text-slate-700 text-sm leading-relaxed shadow-sm">
                  <span className="font-extrabold text-orange-600 block mb-1">💡 Полезная информация:</span>
                  {data.conceptQuote.replace("💡 Полезный лайфхак:", "").replace("💡 Идея для бизнеса:", "").replace("💡 Информационное преимущество:", "")}
                </div>
              )}
            </div>
            
            {/* Visual Scheme / Image */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 aspect-video group shadow-md flex items-center justify-center">
              {data.conceptVisualType === "scheme" ? (
                <div className="absolute inset-0 p-8 flex flex-col items-center justify-center bg-slate-950 text-center">
                  <div className="w-16 h-16 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500 mb-4 animate-pulse">
                    <Wind className="w-8 h-8" />
                  </div>
                  <div className="text-white font-bold text-lg mb-2">Инженерная схема прочности</div>
                  <p className="text-slate-400 text-sm max-w-sm">
                    Все конструкции проходят симуляцию ветровых нагрузок с запасом прочности 1.5x по СНиП РК.
                  </p>
                  <div className="mt-4 px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-semibold rounded-full uppercase tracking-wider">
                    СНиП РК Сертифицировано
                  </div>
                </div>
              ) : (
                <>
                  <Image 
                    src={fallbackImage} 
                    alt={data.title} 
                    fill 
                    className="object-cover opacity-90 transition duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent"></div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
