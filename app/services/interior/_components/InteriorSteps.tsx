// app/services/interior/_components/InteriorSteps.tsx

export default function InteriorSteps() {
  const steps = [
    {
      step: "01",
      title: "Замеры стен",
      desc: "Оцениваем тип покрытия стены (краска, обои, рейки, гипс) и способ прокладки электрического кабеля."
    },
    {
      step: "02",
      title: "3D-привязка",
      desc: "Дизайнер подготавливает фотопривязку логотипа к вашей стене ресепшена с учетом реальных пропорций."
    },
    {
      step: "03",
      title: "Вырезка на ЧПУ",
      desc: "Лазерная ЧПУ резка акрила, нержавеющей стали AISI 304 или композита с ювелирным полированием торцов."
    },
    {
      step: "04",
      title: "Сборка электрики",
      desc: "Распайка качественных линзованных диодов с равномерным светорассеиванием сзади или внутри букв."
    },
    {
      step: "05",
      title: "Чистовой монтаж",
      desc: "Установка букв строго по лазерному уровню с уборкой пыли строительным пылесосом. Никаких следов клея."
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
            Этапы изготовления интерьерной вывески
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Как мы создаем офисный логотип от эскиза на бумаге до сияющих букв за вашей стойкой ресепшена
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
