// app/services/facade-decoration/_components/FacadeDecorationCareGuide.tsx

export default function FacadeDecorationCareGuide() {
  const data = {
    title: "Климатическая стойкость и уход за фасадом",
    subtitle: "Как оформленный фасад и оклеенные витрины ведут себя в суровых климатических условиях Астаны",
    tips: [
      {
        step: "01",
        title: "Защита от температурных швов",
        desc: "Алюкобонд расширяется на жаре и сжимается в мороз. Мы монтируем панели со специальным технологическим зазором в 8-10 мм. Это предотвращает деформацию, выгибание и коробление фасада летом."
      },
      {
        step: "02",
        title: "Уход за композитными панелями",
        desc: "Композит имеет пылеотталкивающее покрытие. Для поддержания идеального внешнего вида достаточно раз в год проводить мойку фасада обычной водой под давлением (Karcher) без использования абразивов."
      },
      {
        step: "03",
        title: "Ветроустойчивость витрин",
        desc: "При брендировании окон мы используем праймеры повышенной адгезии по периметру стекол. Это предотвращает задирание краев виниловой пленки при шквальном астанинском ветре."
      },
      {
        step: "04",
        title: "Контроль конденсата",
        desc: "При проектировании входных групп мы рассчитываем вентиляционные зазоры в подсистеме. Это предотвращает скопление влаги и появление плесени между композитом и основной стеной здания."
      }
    ]
  };

  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200/80">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-3 font-semibold">
            Эксплуатация в Астане
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            {data.title}
          </h2>
          <p className="text-slate-500 text-lg max-w-3xl mx-auto leading-relaxed">
            {data.subtitle}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {data.tips.map((item, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition duration-300">
              <span className="text-4xl font-black text-orange-100 mb-4 block leading-none">
                {item.step}
              </span>
              <h3 className="text-slate-900 font-bold text-lg mb-3">
                {item.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
