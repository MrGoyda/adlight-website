// app/services/interior/_components/InteriorCareGuide.tsx

export default function InteriorCareGuide() {
  const data = {
    title: "Правила ухода и эксплуатации",
    subtitle: "Как сохранить ювелирный внешний вид интерьерных букв на ресепшене долгие годы",
    tips: [
      {
        step: "01",
        title: "Сухая чистка акрила",
        desc: "Акрил легко притягивает пылинки статическим электричеством. Очищайте его только сухой салфеткой из мягкой микрофибры без сильного давления, чтобы не поцарапать глянцевые грани."
      },
      {
        step: "02",
        title: "Без спирта и ацетона",
        desc: "Категорически запрещено использовать спиртосодержащие растворы, очистители стекол и ацетон. Химические реагенты вызывают помутнение и микротрещины на акриловых деталях."
      },
      {
        step: "03",
        title: "Уход за нержавеющей сталью",
        desc: "Для букв из нержавеющей стали используйте специальные полироли без абразивов. Это поможет легко устранить следы отпечатков пальцев и вернуть зеркальный металлический блеск."
      },
      {
        step: "04",
        title: "Режим работы блоков питания",
        desc: "Выключайте подсветку логотипа на ночь или выходные дни, когда в офисе никого нет. Это продлит срок службы светодиодных модулей и блоков питания на 30-40%."
      }
    ]
  };

  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200/80">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-3 font-semibold">
            Долговечность логотипа
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
