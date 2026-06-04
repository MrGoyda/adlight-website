// app/services/facade-decoration/_components/FacadeDecorationCatalog.tsx

import Image from "next/image";
import { facade_decorationDetails } from "@/dictionaries/services/details/facade-decoration";

// Детализированные SEO/AI характеристики для типов оформления фасадов
const facadeCatalogTypes = [
  {
    title: "Облицовка композитными панелями (Алюкобонд)",
    desc: "Алюминиевый композит (алюкобонд) — это идеальное сочетание прочности, эстетики и легкости. Панели состоят из двух слоев предварительно окрашенного алюминия со средним слоем из полимерного наполнителя. Создают идеально ровную, бесшовную поверхность фасада. Устойчивы к коррозии, агрессивным воздействиям окружающей среды, резким температурным перепадам и выгоранию цвета под прямыми солнечными лучами.",
    image: "/images/pages/services-facade.png",
    tag: "Популярно",
    specs: "Толщина листа: 3-4 мм; Слой алюминия: 0.21-0.4 мм; Горючесть: Г1 (слабогорючие); Подсистема: профильный каркас из оцинкованной стали или алюминия.",
    bestFor: "Облицовка наружных стен магазинов, автосалонов, АЗС, офисных зданий, торговых и бизнес-центров."
  },
  {
    title: "Брендирование витрин и остекления",
    desc: "Эффективная оклейка стекол витрин рекламной и солнцезащитной пленкой. Мы осуществляем печать высокого разрешения на качественной пленке Orajet/Oracal, плоттерную резку аппликаций и монтаж перфорированной пленки (One Way Vision), которая пропускает свет в помещение, но отображает яркую рекламу снаружи. Защищает интерьер от перегрева.",
    image: "/images/calc/face.jpg",
    tag: "Бюджетно",
    specs: "Материал: мономерная/полимерная виниловая пленка Oracal; Печать: УФ или экосольвент 1440 dpi; Ламинация: глянцевая/матовая УФ-защитная.",
    bestFor: "Оформление сезонных скидок, оклейка окон ресторанов, бутиков, аптек, банков, салонов связи."
  },
  {
    title: "Проектирование и монтаж входных групп",
    desc: "Входная группа — сложная инженерная конструкция, состоящая из козырька, опорных колонн, остекления, дверей и лестничной площадки. Мы проектируем входные группы в едином архитектурном стиле вашего бренда с учетом норм безопасности и регламентов Акимата Астаны. Внутренний металлокаркас рассчитывается на снеговые и ветровые нагрузки.",
    image: "/images/pages/services-entrance-groups.webp",
    tag: "Премиум",
    specs: "Несущая конструкция: стальной каркас из профильных труб с антикоррозийной обработкой; Облицовка: композит/алюкобонд; Остекление: закаленное стекло / триплекс.",
    bestFor: "Создание парадного входа для банков, медицинских центров, отелей, ресторанов, крупных супермаркетов."
  },
  {
    title: "Архитектурная контурная LED подсветка",
    desc: "Художественное фасадное освещение с помощью светодиодного гибкого неона или влагозащищенных LED-линеек. Выделяет архитектурные особенности здания в темное время суток, привлекает взгляды водителей и пешеходов. Интеллектуальные контроллеры позволяют создавать динамические эффекты, регулировать яркость и включать свет по таймеру.",
    image: "/images/pages/led_glow.png",
    tag: "Эффектно",
    specs: "Источники света: светодиодный неон Neon Flex IP68 / заливающие фасадные прожекторы; Напряжение: 12V / 24V; Светодиоды: Epistar / Samsung повышенного ресурса.",
    bestFor: "Декоративное оформление отелей, ресторанов, бизнес-центров, развлекательных комплексов и отдельно стоящих магазинов."
  }
];

export default function FacadeDecorationCatalog() {
  return (
    <section 
      id="catalog" 
      aria-labelledby="catalog-heading" 
      className="py-24 bg-white border-t border-slate-200/80"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-3 font-semibold">Наши решения</span>
          <h2 
            id="catalog-heading" 
            className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight"
          >
            Оформление фасадов и витрин: технологии и виды конструкций
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
            {facade_decorationDetails.typesSubtitle}. Каждое изделие проходит строгий инженерный расчет прочности по СНиП РК.
          </p>
        </div>

        <ul className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {facadeCatalogTypes.map((type, i) => (
            <li 
              key={i} 
              itemScope 
              itemType="https://schema.org/Product"
              className="group flex flex-col rounded-3xl overflow-hidden border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-orange-500/30 cursor-default shadow-sm hover:shadow-md transition-all duration-300"
            >
              <article className="flex flex-col h-full">
                {/* Image Header */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 border-b border-slate-150">
                  {type.tag && (
                    <span className="absolute top-4 left-4 z-10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-orange-600 text-white rounded-md shadow-md">
                      {type.tag}
                    </span>
                  )}
                  <Image 
                    src={type.image} 
                    alt={type.title}
                    fill
                    itemProp="image"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>

                {/* Card Body */}
                <div className="p-6 md:p-8 flex flex-col flex-grow">
                  <h3 
                    itemProp="name" 
                    className="text-xl font-bold text-slate-900 mb-3 group-hover:text-orange-600 transition-colors duration-300"
                  >
                    {type.title}
                  </h3>
                  <p 
                    itemProp="description" 
                    className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow"
                  >
                    {type.desc}
                  </p>

                  {/* AI & SEO Rich Metadata Details */}
                  <div className="mt-auto pt-4 border-t border-slate-100/80 space-y-2.5">
                    <div className="text-xs text-slate-500">
                      <strong className="text-slate-700 font-semibold block mb-0.5">Технические параметры (Спецификация):</strong>
                      <span className="leading-relaxed">{type.specs}</span>
                    </div>
                    <div className="text-xs text-slate-500">
                      <strong className="text-slate-700 font-semibold block mb-0.5">Рекомендуемая сфера применения:</strong>
                      <span className="leading-relaxed">{type.bestFor}</span>
                    </div>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
