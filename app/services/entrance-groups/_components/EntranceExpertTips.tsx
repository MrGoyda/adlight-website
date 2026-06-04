// app/services/entrance-groups/_components/EntranceExpertTips.tsx
"use client";

import { CheckSquare, Star, Lightbulb, UserCheck } from "lucide-react";

export default function EntranceExpertTips() {
  const tips = [
    {
      title: "Используйте композит 4 мм с алюминием 0.3 мм",
      desc: "Для наружной облицовки фасада используйте только качественные панели. Дешевый композит 3 мм со временем прогибается на жаре, создавая некрасивый эффект 'линзы' или волн на солнце.",
      icon: Star
    },
    {
      title: "Выбирайте нейтральный белый свет (4000К)",
      desc: "Нейтральная цветовая температура выглядит наиболее дорого и естественно. Слишком холодный свет (6500К) дешевит вывеску, а теплый желтый (3000К) искажает цвета фасада.",
      icon: Lightbulb
    },
    {
      title: "Проектируйте козырек со скрытым наклоном",
      desc: "Плоские козырьки быстро скапливают грязь, снег и воду. Мы всегда закладываем уклон 3-5 градусов назад к стене со скрытым внутренним водостоком, чтобы фасад всегда оставался чистым.",
      icon: CheckSquare
    }
  ];

  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200/80">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-3 font-semibold">
            Советы эксперта
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Секреты безупречной входной группы
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            На чем нельзя экономить при оформлении фасада, чтобы конструкция сохранила премиальный вид на 10+ лет
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-stretch">
          {/* Левая часть: карточки советов */}
          <div className="lg:col-span-7 flex flex-col gap-6 justify-between">
            {tips.map((tip, idx) => {
              const Icon = tip.icon;
              return (
                <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition duration-300 flex gap-6 items-start">
                  <div className="p-3.5 bg-orange-50 rounded-2xl text-orange-600 border border-orange-100 shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-slate-900 font-bold text-lg mb-2">
                      {tip.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      {tip.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Правая часть: Блок дизайнера */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-10 text-white relative overflow-hidden flex flex-col justify-between shadow-xl">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.webp')] opacity-5"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-orange-600 rounded-2xl flex items-center justify-center text-white shrink-0">
                  <UserCheck className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-extrabold text-lg text-white">Бахтияр Серикович</h4>
                  <p className="text-orange-400 text-xs font-semibold uppercase tracking-wider">Ведущий дизайнер фасадов ADLight</p>
                </div>
              </div>

              <blockquote className="text-slate-350 text-base italic leading-relaxed mb-8">
                &ldquo;Входная группа — это архитектурное продолжение вашего бренда. Красивый стык углов композита, аккуратно замаскированный шов, утопленные споты подсветки — именно эти мелочи создают ощущение качества и высокого статуса бизнеса. Мы продумываем эргономику входа до миллиметра.&rdquo;
              </blockquote>
            </div>

            <div className="relative z-10 pt-6 border-t border-slate-700 flex justify-between items-center text-xs text-slate-400">
              <span>Более 150 оформленных фасадов</span>
              <span className="font-bold text-orange-400">3D-визуализация бесплатно</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
