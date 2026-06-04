// app/services/navigation/_components/NavigationSteps.tsx

export default function NavigationSteps() {
  const steps = [
    {
      step: "01",
      title: "Аудит и Маршруты",
      desc: "Выезжаем на объект, изучаем планировку и строим схемы движения людей (карту путей клиента)."
    },
    {
      step: "02",
      title: "Разработка дизайна",
      desc: "Определяем цветовую схему, подбираем пиктограммы, шрифты и отрисовываем фотопривязки к стенам."
    },
    {
      step: "03",
      title: "Выбор конструктива",
      desc: "Подбираем оптимальные материалы (композит, Rowmark, стекло, сталь, алюминиевый клик-профиль)."
    },
    {
      step: "04",
      title: "Производство",
      desc: "Наносим лазерную гравировку, выполняем УФ-печать, фрезеруем подложки и собираем модульные блоки."
    },
    {
      step: "05",
      title: "Монтаж на объекте",
      desc: "Установка всех табличек и указателей по лазерному нивелиру на анкера, скотч 3M или дистанционные ножки."
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
            Этапы создания системы навигации
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            От анализа логистики здания до готовых указателей на дверях и стенах
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-8 relative">
          {steps.map((item, idx) => (
            <div key={idx} className="relative flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center font-black text-2xl mb-6 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300 shadow-sm">
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
