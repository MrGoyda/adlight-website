// app/services/lightboxes/_components/LightboxesConcept.tsx

import { Sun, Zap } from "lucide-react";
import Image from "next/image";
import { lightboxesDetails } from "@/dictionaries/services/details/lightboxes";

interface LightboxesConceptProps {
  fallbackImage: string;
}

export default function LightboxesConcept({ fallbackImage }: LightboxesConceptProps) {
  return (
    <section id="concept" className="py-24 bg-slate-50 border-t border-slate-200/80">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm relative overflow-hidden">
          {/* Subtle accent glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-[80px] rounded-full pointer-events-none"></div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-6 tracking-tight">
                Преимущества световых коробов: максимум яркости и привлечение клиентов 24/7
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                {lightboxesDetails.conceptDesc}
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-orange-50 rounded-xl text-orange-600 border border-orange-100 shrink-0">
                    <Sun className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-slate-800 font-bold mb-1">
                      Заметность 24/7
                    </h4>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      Яркая светодиодная подсветка обеспечивает отличную читаемость вывески ночью и в плохую погоду.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-orange-50 rounded-xl text-orange-600 border border-orange-100 shrink-0">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-slate-800 font-bold mb-1">
                      Энергоэффективность
                    </h4>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      Мы устанавливаем светодиоды Samsung с высоким КПД, которые потребляют минимум электроэнергии.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video group shadow-md">
              <Image 
                src={fallbackImage} 
                alt={lightboxesDetails.title} 
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
