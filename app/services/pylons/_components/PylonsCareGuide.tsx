// app/services/pylons/_components/PylonsCareGuide.tsx
"use client";

export default function PylonsCareGuide() {
  const data = {
    title: "Правила ухода и технического обслуживания",
    subtitle: "Как обеспечить безопасность уличного сооружения и сохранить эстетичный вид стелы на 15+ лет",
    tips: [
      {
        step: "01",
        title: "Контроль анкерных гаек",
        desc: "Раз в год (предпочтительно осенью) проводите осмотр гаек крепления опорной плиты к анкерам фундамента. Они должны быть плотно затянуты и покрыты защитной консистентной смазкой."
      },
      {
        step: "02",
        title: "Мойка композитных панелей",
        desc: "Стелы стоят близко к дороге и быстро покрываются копотью. Омывайте обшивку струей воды высокого давления раз в год. При сильном загрязнении допускается применение неабразивных автошампуней."
      },
      {
        step: "03",
        title: "Проверка герметичности люков",
        desc: "Раз в год проверяйте уплотнители сервисных люков стелы. Влага не должна проникать внутрь конструкции к светодиодным модулям, блокам питания и коммутационным коробкам."
      },
      {
        step: "04",
        title: "Защитное окрашивание цоколя",
        desc: "Бетонное основание фундамента (если оно выступает над землей) и металлическую опорную часть следует раз в 2 года подкрашивать уличной защитной краской для исключения коррозии."
      }
    ]
  };

  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200/80">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-3 font-semibold">
            Технический регламент
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
