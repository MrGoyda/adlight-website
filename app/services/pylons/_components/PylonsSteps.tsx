// app/services/pylons/_components/PylonsSteps.tsx
"use client";

export default function PylonsSteps() {
  const steps = [
    {
      step: "01",
      title: "Топосъемка и Проект",
      desc: "Исследуем грунт, сканируем подземные сети, разрабатываем проекты КМ и КЖ с подписями лицензированного инженера."
    },
    {
      step: "02",
      title: "Согласование АПЗ",
      desc: "Подаем документы в Управление архитектуры, согласовываем эскиз и получаем официальный Паспорт рекламы."
    },
    {
      step: "03",
      title: "Фундаментные работы",
      desc: "Копаем котлован ниже 1.8м, вяжем арматурную сетку, устанавливаем анкерную корзину и заливаем бетон М300."
    },
    {
      step: "04",
      title: "Сборка конструкции",
      desc: "Свариваем стальной силовой столб, обшиваем его композитными панелями АКП и монтируем световые элементы."
    },
    {
      step: "05",
      title: "Выездной монтаж",
      desc: "Транспортируем стелу тралом, поднимаем краном, прикручиваем к закладным фундамента и подключаем питание."
    }
  ];

  return (
    <section className="py-24 bg-white border-t border-slate-200/80">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="text-center mb-16">
          <span className="text-sm font-bold text-orange-600 uppercase tracking-widest block mb-3 font-semibold">
            Процесс работы
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Этапы строительства стелы
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            От геодезического анализа участка до высотного монтажа тяжелой рамы под ключ
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-8 relative">
          {steps.map((item, idx) => (
            <div key={idx} className="relative flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center font-black text-2xl mb-6 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300 shadow-sm">
                {item.step}
              </div>
              <h3 className="text-slate-900 font-extrabold text-lg mb-2 group-hover:text-orange-600 transition-colors">
                {item.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed max-w-[240px]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
