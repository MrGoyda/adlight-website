// app/services/roof-installations/_components/RoofRules.tsx
"use client";

import { CheckCircle, XCircle } from "lucide-react";

export default function RoofRules() {
  const rules = {
    allowed: [
      {
        title: "Соразмерность архитектуре",
        desc: "Высота букв должна строго соответствовать этажности здания (например, до 3 метров для зданий до 10 этажей). Это гарантирует гармоничное вписание в городскую среду."
      },
      {
        title: "Только объемные элементы",
        desc: "Разрешено устанавливать отдельные объемные световые буквы и логотипы без сплошной фоновой подложки. Конструкция должна быть проницаемой для ветра."
      },
      {
        title: "Согласование проекта в Урбанистике",
        desc: "Обязательное получение Паспорта рекламы на основании согласованного эскизного проекта и раздела КМ/КМД с лицензией ГАСК."
      }
    ],
    forbidden: [
      {
        title: "Крепление сквозь мягкую кровлю",
        desc: "Запрещается сквозное сверление гидроизоляции крыши. Несущая ферма должна монтироваться исключительно на систему бетонных пригрузов."
      },
      {
        title: "Динамическая анимация высокой частоты",
        desc: "Не допускается мерцание, мигание и стробоскопический эффект светодиодов, которые могут слепить водителей на дорогах или мешать жильцам соседних домов."
      },
      {
        title: "Установка на жилые дома без согласия ОСИ",
        desc: "Запрещается монтаж рекламы на крышах жилых комплексов без официального протокола собрания жильцов (ОСИ/КСК) и согласования аренды."
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
            Правила размещения рекламы на крыше
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Как установить крупноформатную крышную вывеску в Астане в соответствии с законом, избежав демонтажа
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
