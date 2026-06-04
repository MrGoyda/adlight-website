// app/services/panel-brackets/_components/PanelBracketsExpertTips.tsx

import { Maximize2, Compass, Layers, Lightbulb } from "lucide-react";

const IconMap = {
  Maximize2,
  Compass,
  Layers,
};

function renderIcon(iconName: string, className = "w-5 h-5") {
  const IconComponent = IconMap[iconName as keyof typeof IconMap] || Lightbulb;
  return <IconComponent className={className} />;
}

export default function PanelBracketsExpertTips() {
  const data = {
    title: "Советы главного технолога ADLight",
    subtitle: "Как правильно подобрать размер и тип панель-кронштейна под ваш фасад",
    expertName: "Парчевин Даниил",
    expertRole: "Главный технолог производства ADLight",
    tips: [
      {
        facade: "Узкий пешеходный тротуар",
        recommendation: "Выбирайте классический круглый панель-кронштейн диаметром 50 см с небольшим выносом (до 20 см). Консоль будет видна издалека, но не помешает пешеходам с раскрытыми зонтами и коммунальной технике.",
        iconName: "Maximize2"
      },
      {
        facade: "Широкий проспект с боковым движением авто",
        recommendation: "Рекомендуем установить прямоугольную консоль размера 60х80 см или яркий фигурный логотип с линзованными модулями Samsung. Такой формат улавливает взгляд водителей за 150 метров.",
        iconName: "Compass"
      },
      {
        facade: "Монтаж на вентилируемый фасад (керамогранит)",
        recommendation: "При установке на вентфасад крепление производится исключительно через швы плитки в несущую бетонную или кирпичную стену с помощью шпилек. Крепить вывеску к самому керамограниту категорически запрещено из-за риска обрушения плитки.",
        iconName: "Layers"
      }
    ]
  };

  return (
    <section className="py-24 bg-white border-t border-slate-200/80">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center md:text-left md:flex md:items-end md:justify-between gap-8">
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-3 font-semibold">
              Мнение эксперта
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              {data.title}
            </h2>
            <p className="text-slate-500 text-lg mt-3 leading-relaxed">
              {data.subtitle}
            </p>
          </div>
          <div className="mt-6 md:mt-0 shrink-0 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 inline-flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
              ДП
            </div>
            <div>
              <div className="text-slate-800 font-bold text-sm">{data.expertName}</div>
              <div className="text-slate-500 text-xs font-medium">{data.expertRole}</div>
            </div>
          </div>
        </div>

        {/* Tips Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {data.tips.map((item, idx) => (
            <div key={idx} className="bg-slate-50 p-8 rounded-3xl border border-slate-200/80 flex flex-col hover:shadow-md transition duration-300">
              <div className="w-11 h-11 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100 mb-6 shrink-0">
                {renderIcon(item.iconName, "w-5 h-5")}
              </div>
              <h3 className="text-slate-900 font-bold text-lg mb-3">
                {item.facade}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {item.recommendation}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
