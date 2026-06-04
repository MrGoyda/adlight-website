// app/services/entrance-groups/_components/EntranceCatalog.tsx
"use client";

import Image from "next/image";
import { entrance_groupsDetails } from "@/dictionaries/services/details/entrance-groups";

const solutionDetails = {
  "Фасадная вывеска": {
    specs: "Лицевой литой акрил Plexiglas 3-4мм, боковины — ПВХ с жидким акрилом, светодиодные модули 12V с линзой 160°, герметичный блок питания IP67.",
    bestFor: "Главный элемент идентификации бизнеса на фасадной плоскости. Подходит для магазинов, ресторанов, аптек и клиник."
  },
  "Облицовка фасада": {
    specs: "Алюминиевые композитные панели (АКП) толщиной 3-4мм с алюминиевым слоем 0.3мм, стальной или алюминиевый несущий каркас.",
    bestFor: "Выравнивание старых стен, маскировка коммуникаций и дефектов. Создание премиального фона в фирменных цветах."
  },
  "Козырек / Навес": {
    specs: "Силовая рама из профильной трубы, покрытие монолитным поликарбонатом или композитом, интегрированная система водостока.",
    bestFor: "Защита входной группы от осадков и падения сосулек. Дополнительная площадь для размещения торцевой подсветки."
  },
  "Оформление витрин": {
    specs: "Пленки Oracal 641/551 с интерьерной УФ-печатью высокой четкости (1440 dpi), плоттерная резка, клик-профили для плакатов.",
    bestFor: "Брендирование стеклянных плоскостей. Информирование об акциях, режиме работы или внутреннем ассортименте."
  },
  "Панель-кронштейн": {
    specs: "Двусторонний световой короб на металлическом кронштейне с вылетом до 50-80 см, светодиоды Elf повышенной яркости.",
    bestFor: "Захват внимания пешеходов и автомобильного потока, движущихся вдоль тротуара перпендикулярно вывеске."
  },
  "Архитектурная подсветка": {
    specs: "Уличный гибкий неон IP68, фасадные прожекторы узконаправленного света, влагозащитные алюминиевые светодиодные профили.",
    bestFor: "Создание эффектного вечернего образа здания. Повышение безопасности и привлекательности в ночное время."
  }
};

export default function EntranceCatalog() {
  return (
    <section id="catalog" aria-labelledby="catalog-heading" className="py-24 bg-white border-t border-slate-200/80">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-3 font-semibold">
            Элементы оформления
          </span>
          <h2 id="catalog-heading" className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            {entrance_groupsDetails.typesTitle}
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
            {entrance_groupsDetails.typesSubtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {entrance_groupsDetails.types.map((type, i) => {
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
