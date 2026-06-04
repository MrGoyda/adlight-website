// app/services/entrance-groups/_components/EntranceRules.tsx
"use client";

import { CheckCircle, XCircle } from "lucide-react";

export default function EntranceRules() {
  const rules = {
    allowed: [
      {
        title: "Сохранение архитектурных осей",
        desc: "Элементы облицовки и вывески должны выравниваться по границам оконных проемов, пилонов фасада и горизонтальным осям здания."
      },
      {
        title: "Облицовка всей плоскости секции",
        desc: "Разрешается облицовывать фасад в пределах границ вашего помещения, формируя единый аккуратный короб, гармонирующий с фасадом."
      },
      {
        title: "Установка защитного козырька",
        desc: "Допускается монтаж навеса над дверью с вылетом не более 1.2-1.5м, со скрытым водоотводом и обшивкой негорючими материалами."
      }
    ],
    forbidden: [
      {
        title: "Разношерстная облицовка 'кусками'",
        desc: "Запрещается использовать кардинально разные материалы облицовки (например, яркий красный пластик рядом с гранитным цоколем здания)."
      },
      {
        title: "Захламление пешеходных путей",
        desc: "Нельзя монтировать входные лестницы, пандусы или декоративные колонны, перекрывающие ширину тротуара и мешающие пешеходам."
      },
      {
        title: "Дешевые баннеры на рамах фасада",
        desc: "Категорически запрещено закрывать фасад здания баннерным полотном на дюбелях без жесткого металлокаркаса и аккуратных бортов."
      }
    ]
  };

  return (
    <section className="py-24 bg-white border-t border-slate-200/80">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-3 font-semibold">
            Дизайн-код Астаны
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Правила оформления входных групп
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Как правильно и законно оформить фасад коммерческого помещения в Астане
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Разрешено */}
          <div className="bg-emerald-50/50 p-8 rounded-3xl border border-emerald-100/80 shadow-sm">
            <h3 className="text-emerald-800 font-extrabold text-xl mb-6 flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
              Разрешено по регламенту
            </h3>
            <ul className="space-y-6">
              {rules.allowed.map((item, idx) => (
                <li key={idx} className="flex gap-4">
                  <span className="text-emerald-500 font-bold mt-1 text-lg">✓</span>
                  <div>
                    <h4 className="text-slate-900 font-bold text-base mb-1">{item.title}</h4>
                    <p className="text-slate-650 text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Запрещено */}
          <div className="bg-red-50/50 p-8 rounded-3xl border border-red-100/80 shadow-sm">
            <h3 className="text-red-800 font-extrabold text-xl mb-6 flex items-center gap-3">
              <XCircle className="w-6 h-6 text-red-500 shrink-0" />
              Запрещено (демонтаж и предписания)
            </h3>
            <ul className="space-y-6">
              {rules.forbidden.map((item, idx) => (
                <li key={idx} className="flex gap-4">
                  <span className="text-red-500 font-bold mt-1 text-lg">✕</span>
                  <div>
                    <h4 className="text-slate-900 font-bold text-base mb-1">{item.title}</h4>
                    <p className="text-slate-650 text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
