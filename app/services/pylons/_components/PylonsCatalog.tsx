// app/services/pylons/_components/PylonsCatalog.tsx
"use client";

import Image from "next/image";
import { pylonsDetails } from "@/dictionaries/services/details/pylons";

const solutionDetails = {
  "Стела для ТРЦ": {
    specs: "Металлокаркас из двутавра/швеллера, облицовка композитными панелями 4мм, световые короба арендаторов с диодами ELF IP67, контурная защита и молниезащитный громоотвод.",
    bestFor: "Крупные торгово-развлекательные центры, моллы, ритейл-парки. Устанавливается на перекрестках или при съездах с магистралей."
  },
  "Стела АЗС": {
    specs: "Светодиодные ценовые LED-табло уличного исполнения IP65, управление ценами с пульта или по Wi-Fi/GSM, герметичные блоки питания, суперяркие светодиоды до 6000 кд/м².",
    bestFor: "Автозаправочные станции (АЗС) и зарядные станции для электромобилей. Читаемость цен водителями на высоких скоростях."
  },
  "Автосалоны (Бренд-пилон)": {
    specs: "Вакуумная формовка логотипов из акрила, бесшовная стыковка углов композита, полимерное порошковое покрытие, плотная внутренняя светодиодная засветка.",
    bestFor: "Официальные дилерские центры, автосалоны, брендовые шоурумы. Точное соответствие корпоративному брендбуку."
  },
  "Пилон Бизнес-Центра": {
    specs: "Композитная основа, сменные алюминиевые панели-информаторы на клипсах, внутренняя светодиодная подсветка, защитное закаленное стекло.",
    bestFor: "Навигация у входа. Список арендаторов, схема заезда, поэтажные указатели офисных и логистических центров."
  },
  "Въездная группа (Город)": {
    specs: "Монолитный железобетонный фундамент, сварная несущая конструкция из толстой конструкционной стали, гербы и буквы из нержавеющей стали с УФ-защитным лаком.",
    bestFor: "Обозначение въездов в города, районы, индустриальные зоны, а также на территорию коттеджных поселков."
  },
  "Уличный указатель": {
    specs: "Стальная опора 80x80мм, световой короб с внутренней подсветкой, стрелки-указатели из фрезерованного ПВХ или алюминия.",
    bestFor: "Придорожные указатели направления заезда на парковку, ко входам в рестораны, отели или клиники во дворах."
  }
};

export default function PylonsCatalog() {
  return (
    <section id="catalog" aria-labelledby="catalog-heading" className="py-24 bg-white border-t border-slate-200/80">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-3 font-semibold">
            Элементы навигации
          </span>
          <h2 id="catalog-heading" className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            {pylonsDetails.typesTitle}
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
            {pylonsDetails.typesSubtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pylonsDetails.types.map((type, i) => {
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
                  <p className="text-slate-655 text-slate-600 text-sm leading-relaxed mb-6 flex-grow">
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
