// app/services/roof-installations/_components/RoofCatalog.tsx
"use client";

import Image from "next/image";
import { roof_installationsDetails } from "@/dictionaries/services/details/roof-installations";

const solutionDetails = {
  "Объемные буквы на раме": {
    specs: "Лицевая часть — акрил Plexiglas 3-5мм, боковины — вспененный ПВХ 3-8мм, рама — профильная труба 40x40/60x60мм с полимерным антикоррозийным покрытием. Светодиодные линзованные модули 12V с влагозащитой IP67.",
    bestFor: "Брендирование штаб-квартир компаний, крупных офисных центров, банков и отелей. Идеально для логотипа и названия бренда на высоте от 3 до 20 этажей."
  },
  "Баннерные короба": {
    specs: "Транслюцентный баннер плотностью 510 г/м² с УФ-печатью, система равномерной натяжки на клипсах, силовой стальной каркас, светодиодная торцевая или задняя засветка модулями повышенной мощности.",
    bestFor: "Крупные торгово-развлекательные центры (ТРЦ), автосалоны, гипермаркеты. Оптимально для размещения крупноформатных логотипов с большой площадью сплошной заливки."
  },
  "Медиаэкраны": {
    specs: "LED-кабинеты уличного исполнения IP65, шаг пикселя P4-P10, яркость от 5500 до 8000 кд/м², датчик освещенности, интегрированная система принудительной вентиляции и климат-контроля.",
    bestFor: "Крупные рекламные площади на крышах вдоль оживленных проспектов, фасады развлекательных центров. Для трансляции динамического видеоконтента и рекламы."
  }
};

export default function RoofCatalog() {
  return (
    <section id="catalog" aria-labelledby="catalog-heading" className="py-24 bg-white border-t border-slate-200/80">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-3 font-semibold">
            Варианты и типы
          </span>
          <h2 id="catalog-heading" className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            {roof_installationsDetails.typesTitle}
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
            {roof_installationsDetails.typesSubtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {roof_installationsDetails.types.map((type, i) => {
            const extra = solutionDetails[type.title as keyof typeof solutionDetails] || { specs: type.specs, bestFor: type.bestFor };
            return (
              <div 
                key={i} 
                className="group flex flex-col rounded-3xl overflow-hidden border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-orange-500/30 cursor-default shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 border-b border-slate-200">
                  {type.tag && (
                    <span className="absolute top-4 left-4 z-10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-orange-600 text-white rounded-md shadow-md">
                      {type.tag}
                    </span>
                  )}
                  <Image 
                    src={type.image} 
                    alt={type.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>

                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-orange-600 transition-colors duration-300">
                    {type.title}
                  </h3>
                  <p className="text-slate-650 text-slate-600 text-sm leading-relaxed mb-6 flex-grow">
                    {type.desc}
                  </p>

                  <div className="mt-auto pt-6 border-t border-slate-150/80 space-y-4 text-sm">
                    {extra.specs && (
                      <div className="text-slate-600">
                        <strong className="text-slate-800 font-semibold block mb-1">
                          ⚙️ Технические характеристики:
                        </strong>
                        <span className="leading-relaxed">{extra.specs}</span>
                      </div>
                    )}
                    {extra.bestFor && (
                      <div className="text-slate-600">
                        <strong className="text-slate-800 font-semibold block mb-1">
                          🎯 Рекомендуемое применение:
                        </strong>
                        <span className="leading-relaxed">{extra.bestFor}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
