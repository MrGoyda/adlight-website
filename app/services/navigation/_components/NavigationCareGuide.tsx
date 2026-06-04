// app/services/navigation/_components/NavigationCareGuide.tsx

export default function NavigationCareGuide() {
  const data = {
    title: "Правила ухода и эксплуатации",
    subtitle: "Как сохранить первоначальный аккуратный вид табличек и указателей на долгие годы",
    tips: [
      {
        step: "01",
        title: "Очистка Rowmark-пластика",
        desc: "Таблички Rowmark устойчивы к влаге и моющим средствам. Достаточно раз в неделю протирать их влажной тряпкой. Не используйте абразивные губки, чтобы не поцарапать гравировку."
      },
      {
        step: "02",
        title: "Уход за акриловыми сэндвичами",
        desc: "Акрил легко притягивает статическую пыль. Используйте салфетки из микрофибры. Спирт и ацетон запрещены — они вызывают растрескивание и помутнение краев оргстекла."
      },
      {
        step: "03",
        title: "Своевременная смена информации",
        desc: "Если у вас модульные алюминиевые рейки, храните запасные пластиковые вставки в сухом темном месте. При смене арендатора аккуратно снимайте боковую заглушку без резких рывков."
      },
      {
        step: "04",
        title: "Температурная эксплуатация",
        desc: "Наши системы навигации могут использоваться в неотапливаемых тамбурах, лифтовых шахтах и подземных паркингах. Они выдерживают колебания температур от -35°C до +50°C."
      }
    ]
  };

  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200/80">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-3 font-semibold">
            Долговечность навигации
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
