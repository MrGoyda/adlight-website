// app/services/navigation/_components/NavigationRules.tsx

import { CheckCircle, XCircle } from "lucide-react";

export default function NavigationRules() {
  const rules = {
    allowed: [
      {
        title: "Контрастное сочетание цветов",
        desc: "Использование темного шрифта на светлом фоне или наоборот. Это гарантирует быстрое считывание указателей под любым углом."
      },
      {
        title: "Модульные реечные системы",
        desc: "Установка наборных стендов из алюминиевых профилей в холлах БЦ, позволяющая оперативно заменять информацию."
      },
      {
        title: "Интуитивно понятная пиктографика",
        desc: "Применение стандартных международных пиктограмм (лифт, уборная, выход) для понимания навигации без чтения текста."
      }
    ],
    forbidden: [
      {
        title: "Слишком мелкий шрифт",
        desc: "Запрещается использовать высоту букв менее 15 мм на настенных указателях, так как их невозможно разобрать на расстоянии."
      },
      {
        title: "Глянцевое оргстекло без матовой пленки",
        desc: "Не рекомендуется применять полностью глянцевые поверхности в местах с ярким точечным светом — блики ослепляют текст."
      },
      {
        title: "Хаотичное расположение",
        desc: "Размещение указателей вне поля зрения (слишком высоко или низко) делает всю систему навигации бесполезной."
      }
    ]
  };

  return (
    <section className="py-24 bg-white border-t border-slate-200/80">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-3 font-semibold">
            Регламент разработки
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Правила проектирования навигации
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Как создать систему указателей, которая действительно работает и украшает интерьер здания
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Зеленая колонка: Разрешено */}
          <div className="bg-emerald-50/50 p-8 rounded-3xl border border-emerald-100/80 shadow-sm">
            <h3 className="text-emerald-800 font-extrabold text-xl mb-6 flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
              Эффективные решения
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
              Ошибки проектирования
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
