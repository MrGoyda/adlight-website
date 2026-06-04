// app/services/interior/_components/InteriorRules.tsx

import { CheckCircle, XCircle } from "lucide-react";

export default function InteriorRules() {
  const rules = {
    allowed: [
      {
        title: "Контражурная подсветка",
        desc: "Разрешено и рекомендуется использовать мягкий свет, падающий на стену из-под букв. Создает премиальный эффект объема."
      },
      {
        title: "Зеркальные и металлические основы",
        desc: "Шлифованная нержавеющая сталь или зеркальный акрил идеально подходят для офисной айдентики, подчеркивая статус компании."
      },
      {
        title: "Дистанционные держатели",
        desc: "Монтаж букв с небольшим отступом от плоскости стены (1-2 см) создает естественные тени и улучшает читаемость."
      }
    ],
    forbidden: [
      {
        title: "Видимые провода",
        desc: "Нельзя оставлять висящие кабели питания или блоки питания на виду в зоне ресепшен. Все подключения должны быть скрыты."
      },
      {
        title: "Слишком яркие светодиоды",
        desc: "Запрещается использовать сверхъяркие светодиоды прямого свечения без рассеивателей, так как они слепят сотрудников и клиентов."
      },
      {
        title: "Сквозной крепеж саморезами",
        desc: "Не допускается грубое крепление букв саморезами насквозь через лицевую поверхность. Монтаж должен быть скрытым."
      }
    ]
  };

  return (
    <section className="py-24 bg-white border-t border-slate-200/80">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-3 font-semibold">
            Стандарты оформления
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Правила оформления офисных логотипов
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Как сделать интерьерную вывеску аккуратной и долговечной, избежав визуального мусора
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Зеленая колонка: Разрешено */}
          <div className="bg-emerald-50/50 p-8 rounded-3xl border border-emerald-100/80 shadow-sm">
            <h3 className="text-emerald-800 font-extrabold text-xl mb-6 flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
              Правильные решения
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
              Недопустимые ошибки
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
