// app/services/panel-brackets/_components/PanelBracketsSteps.tsx

export default function PanelBracketsSteps() {
  const steps = [
    {
      step: "01",
      title: "Выезд и Замеры",
      desc: "Инженер делает лазерный замер фасада, оценивает прочность стены и определяет возможность подвода кабеля питания."
    },
    {
      step: "02",
      title: "Эскиз и Дизайн",
      desc: "Дизайнер готовит фотопривязку консоли к вашему фасаду в дневное и ночное время по правилам Дизайн-кода Астаны."
    },
    {
      step: "03",
      title: "Проект согласования",
      desc: "Оформляем правильный паспорт вывески и эскизный проект для быстрой и успешной подачи документов в Акимат."
    },
    {
      step: "04",
      title: "Производство в цехе",
      desc: "Сварка внутреннего металлокаркаса, фрезеровка ЧПУ, пайка герметичных светодиодов и сборка конструкции."
    },
    {
      step: "05",
      title: "Монтаж под ключ",
      desc: "Бригада монтажников надежно фиксирует панель-кронштейн на анкеры, аккуратно заводит питание и дает гарантию 1 год."
    }
  ];

  return (
    <section className="py-24 bg-white border-t border-slate-200/80">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-3 font-semibold">
            Процесс работы
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Этапы изготовления панель-кронштейна
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">От первого звонка до светящейся консоли на вашем фасаде</p>
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
