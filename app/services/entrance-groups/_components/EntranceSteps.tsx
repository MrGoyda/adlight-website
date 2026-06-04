// app/services/entrance-groups/_components/EntranceSteps.tsx
"use client";

export default function EntranceSteps() {
  const steps = [
    {
      step: "01",
      title: "Замер и Фотофиксация",
      desc: "Выезжаем на объект, сканируем лазером размеры проемов, перепады высот фасада и делаем фото для привязки."
    },
    {
      step: "02",
      title: "3D Дизайн-проект",
      desc: "Создаем фотореалистичный эскиз будущей входной группы с учетом фирменных цветов и Дизайн-кода Астаны."
    },
    {
      step: "03",
      title: "Сварка козырька",
      desc: "Свариваем прочный каркас навеса из толстостенных профильных труб со строгим расчетом снеговой нагрузки."
    },
    {
      step: "04",
      title: "Раскрой композита",
      desc: "На крупноформатном ЧПУ станке фрезеруем кассеты из алюкобонда с идеальной геометрией углов."
    },
    {
      step: "05",
      title: "Монтаж фасада",
      desc: "Устанавливаем металлокаркас, навешиваем композит, монтируем вывеску, подключаем свет и сдаем объект."
    }
  ];

  return (
    <section className="py-24 bg-white border-t border-slate-200/80">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="text-center mb-16">
          <span className="text-sm font-bold text-orange-600 uppercase tracking-widest block mb-3 font-semibold">
            Этапы реализации
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Как строится процесс оформления входа
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            От чертежей и бесплатной фотопривязки до полной сдачи готового объекта под ключ
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
