// app/services/roof-installations/_components/RoofSteps.tsx
"use client";

export default function RoofSteps() {
  const steps = [
    {
      step: "01",
      title: "Экспертиза кровли",
      desc: "Наши инженеры выезжают на объект для обследования перекрытий, несущих балок и состояния кровли здания."
    },
    {
      step: "02",
      title: "Проект КМ/КМД",
      desc: "Разрабатываем конструкторские чертежи, проводим ветровой расчет и согласовываем проект в госорганах."
    },
    {
      step: "03",
      title: "Сварка каркаса",
      desc: "В собственном цеху свариваем мощный силовой каркас из стали высокой марки с антикоррозийной обработкой."
    },
    {
      step: "04",
      title: "Сборка букв",
      desc: "Изготавливаем световые объемные буквы из прочного акрила Plexiglas и влагозащитных диодов IP67."
    },
    {
      step: "05",
      title: "Высотный монтаж",
      desc: "Доставляем конструкцию спецтехникой, поднимаем краном и фиксируем на крыше силами промышленных альпинистов."
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
            Этапы реализации проекта
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Как мы создаем монументальную рекламу на крышах зданий Астаны
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
