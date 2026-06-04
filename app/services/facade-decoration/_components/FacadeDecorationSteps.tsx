// app/services/facade-decoration/_components/FacadeDecorationSteps.tsx

export default function FacadeDecorationSteps() {
  const steps = [
    {
      step: "01",
      title: "Замеры и Нивелировка",
      desc: "Бесплатный выезд инженера-конструктора для замера лазерным дальномером неровностей и отклонений плоскости стен."
    },
    {
      step: "02",
      title: "3D-проект и Раскладка",
      desc: "Создание фотопривязки и раскладки фасадных кассет композита для минимизации обрезков и красивых швов."
    },
    {
      step: "03",
      title: "Эскиз для Архитектуры",
      desc: "Подготовка чертежей, паспорта внешней отделки фасада и подача документов на согласование в Акимат Астаны."
    },
    {
      step: "04",
      title: "Раскрой и Сборка кассет",
      desc: "Фрезеровка и вальцовка композитных панелей на ЧПУ станке в нашем цехе с формированием угловых кассет."
    },
    {
      step: "05",
      title: "Монтаж на объекте",
      desc: "Установка несущих кронштейнов, утеплителя, направляющих профилей и крепление готовых кассет алюкобонда."
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
            Этапы оформления фасада
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">От лазерного замера до идеального обновленного облика вашего здания</p>
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
