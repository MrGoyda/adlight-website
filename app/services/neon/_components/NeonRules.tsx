// app/services/neon/_components/NeonRules.tsx

import { CheckCircle, XCircle } from "lucide-react";

export default function NeonRules() {
  const rules = {
    allowed: [
      {
        title: "Размещение внутри витрины",
        desc: "Неон за стеклом витрины (на расстоянии от 15 см) считается элементом интерьера. Не требует паспорта вывески и налога."
      },
      {
        title: "Статичное свечение",
        desc: "Разрешено постоянное ровное свечение вывески. Выглядит стильно и читается на расстоянии до 100 метров."
      },
      {
        title: "Прозрачная подложка",
        desc: "Монтаж неона на фигурный прозрачный акриловый задник. Он незаметен на стене и сохраняет эстетику фасада."
      }
    ],
    forbidden: [
      {
        title: "Динамическое мигание",
        desc: "Запрещены любые вывески с режимом стробоскопа или частым миганием. Это отвлекает водителей и пешеходов."
      },
      {
        title: "Открытая проводка на улице",
        desc: "Нельзя оставлять висящие кабели питания снаружи фасада. Все провода должны быть уложены в кабель-каналы в цвет фасада."
      },
      {
        title: "Выход за пределы витрин",
        desc: "Запрещается монтировать неоновые консоли без металлического силового каркаса на вентилируемые фасады."
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
            Правила размещения неоновых вывесок
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Как установить неоновую надпись в Астане по закону, избежав штрафов и демонтажа
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Зеленая колонка: Разрешено */}
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
                    <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Красная колонка: Запрещено */}
          <div className="bg-red-50/50 p-8 rounded-3xl border border-red-100/80 shadow-sm">
            <h3 className="text-red-800 font-extrabold text-xl mb-6 flex items-center gap-3">
              <XCircle className="w-6 h-6 text-red-500 shrink-0" />
              Запрещено (демонтаж и штраф)
            </h3>
            <ul className="space-y-6">
              {rules.forbidden.map((item, idx) => (
                <li key={idx} className="flex gap-4">
                  <span className="text-red-500 font-bold mt-1 text-lg">✕</span>
                  <div>
                    <h4 className="text-slate-900 font-bold text-base mb-1">{item.title}</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
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
