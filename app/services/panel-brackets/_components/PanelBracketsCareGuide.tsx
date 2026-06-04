// app/services/panel-brackets/_components/PanelBracketsCareGuide.tsx

export default function PanelBracketsCareGuide() {
  const data = {
    title: "Эксплуатация в климате Астаны",
    subtitle: "Как наши панель-кронштейны выдерживают резкие перепады температур и шквальный ветер столицы",
    tips: [
      {
        step: "01",
        title: "Сопротивление ветру",
        desc: "Астана отличается мощными степными ветрами. Все крепления наших консолей рассчитываются с запасом прочности 1.5х. Мы используем стальные анкеры длиной не менее 120 мм."
      },
      {
        step: "02",
        title: "Герметизация проводки",
        desc: "Соединительные провода и блок питания надежно скрыты внутри герметичной рамы или фасадного короба с классом защиты IP67. Влага от растаявшего снега и дождя не вызовет замыкания."
      },
      {
        step: "03",
        title: "Очистка от пыли и копоти",
        desc: "Каждую весну мы рекомендуем аккуратно смывать накопившуюся дорожную пыль с двух сторон акриловой лицевой части теплой водой и мыльным раствором без спирта. Это повышает яркость вывески."
      },
      {
        step: "04",
        title: "УФ-стабильность",
        desc: "Мы используем литой акрил Plexiglas с UV-фильтром. Он не мутнеет и не желтеет под палящим летним солнцем, сохраняя идеальную белизну или яркость цвета."
      }
    ]
  };

  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200/80">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-3 font-semibold">
            Климатическая стойкость
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
