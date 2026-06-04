// app/services/pylons/_components/PylonsRules.tsx
"use client";

import { CheckCircle, XCircle } from "lucide-react";

export default function PylonsRules() {
  const rules = {
    allowed: [
      {
        title: "Размещение в границах участка",
        desc: "Конструкция должна располагаться на земельном участке, находящемся в собственности или аренде у предприятия, подтвержденном госактом."
      },
      {
        title: "Проверка подземных коммуникаций",
        desc: "Перед началом земляных работ обязательно проводится топосъемка участка и согласование координат фундамента с коммунальными службами."
      },
      {
        title: "Автоматическая регулировка яркости",
        desc: "Установка диммеров или датчиков освещенности для автоматического снижения яркости экранов и вывесок в ночные часы во избежание ослепления."
      }
    ],
    forbidden: [
      {
        title: "Самовольное возведение без проекта",
        desc: "Запрещается устанавливать отдельно стоящие объекты без получения АПЗ и согласования эскиза в управлении архитектуры — это ведет к сносу."
      },
      {
        title: "Перекрытие дорожных знаков",
        desc: "Не допускается монтаж стел и пилонов в зонах прямой видимости светофоров, пешеходных переходов и дорожных указателей."
      },
      {
        title: "Неглубокий кустарный фундамент",
        desc: "Категорически запрещено устанавливать тяжелые стелы высотой более 3 метров на мелкозаглубленную бетонную плитку без армирования."
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
            Правила размещения стел и пилонов
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Как законно установить рекламную стелу в Астане и защитить инвестиции
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
              Запрещено (демонтаж и снос)
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
