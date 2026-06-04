// app/services/panel-brackets/_components/PanelBracketsRules.tsx

import { CheckCircle2, XCircle, FileText } from "lucide-react";

export default function PanelBracketsRules() {
  const data = {
    title: "Дизайн-код Астаны для панель-кронштейнов",
    subtitle: "Изготавливаем и монтируем консольные вывески в строгом соответствии с регламентом Акимата Астаны",
    badgeAllowed: "Разрешено Акиматом",
    badgeForbidden: "Запрещено законом",
    allowed: [
      {
        title: "Размещение перпендикулярно фасаду",
        desc: "Консольные конструкции крепятся строго перпендикулярно стене здания для пешеходного обзора."
      },
      {
        title: "Минимальная высота 2.5м",
        desc: "Нижний край консоли должен находиться на высоте от 2.5 до 3.5 метров от земли."
      },
      {
        title: "Максимальный диаметр 50-80 см",
        desc: "Размеры большинства круглых и фигурных консолей для жилых комплексов ограничены 80 см."
      },
      {
        title: "Монтаж на уровне 1-го этажа",
        desc: "Все коммерческие панель-кронштейны крепятся между окнами первого этажа или над входом."
      }
    ],
    forbidden: [
      {
        title: "Вылет более 100 см",
        desc: "Запрещено делать ножку крепления слишком длинной. Максимальный вынос от стены — до 1 метра."
      },
      {
        title: "Перекрытие окон и декора",
        desc: "Консоль не должна закрывать фасадный лепной декор, водосточные трубы и остекление."
      },
      {
        title: "Мерцающие эффекты снаружи",
        desc: "Запрещена агрессивная стробоскопическая динамика (допускается только плавное свечение)."
      },
      {
        title: "Размещение выше первого этажа",
        desc: "Запрещено крепить консольные вывески на уровне жилых квартир второго этажа и выше."
      }
    ]
  };

  return (
    <section id="rules" className="py-24 bg-slate-50 border-t border-slate-200/80 relative">
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 rounded-full uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5" />
            Дизайн-код Астаны
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            {data.title}
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
            {data.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Allowed Column */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
              <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                {data.badgeAllowed}
              </span>
            </h3>
            <div className="space-y-6">
              {data.allowed.map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0 font-bold text-xs border border-green-100 mt-1">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-slate-800 font-bold text-base mb-1">{item.title}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Forbidden Column */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
              <XCircle className="w-6 h-6 text-red-500 shrink-0" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-600">
                {data.badgeForbidden}
              </span>
            </h3>
            <div className="space-y-6">
              {data.forbidden.map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center text-red-600 shrink-0 font-bold text-xs border border-red-100 mt-1">
                    ✕
                  </div>
                  <div>
                    <h4 className="text-slate-800 font-bold text-base mb-1">{item.title}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
