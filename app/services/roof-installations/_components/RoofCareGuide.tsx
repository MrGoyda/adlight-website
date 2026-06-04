// app/services/roof-installations/_components/RoofCareGuide.tsx
"use client";

export default function RoofCareGuide() {
  const data = {
    title: "Правила ухода и ежегодного обслуживания",
    subtitle: "Как обеспечить безопасность крупноформатной рекламы на крыше и продлить её ресурс до 15-20 лет",
    tips: [
      {
        step: "01",
        title: "Осмотр швов и крепежей",
        desc: "Рекомендуется проводить визуальный осмотр сварных соединений рамы и протяжку болтовых соединений раз в год (весной после схода снега и сильных зимних ветров)."
      },
      {
        step: "02",
        title: "Проверка автоматики щитка",
        desc: "Регулярно тестируйте кнопку 'Тест' на УЗО в щите управления. Проверяйте настройки астрономического реле времени, чтобы включение световых букв происходило точно в сумерках."
      },
      {
        step: "03",
        title: "Очистка световых элементов",
        desc: "Акрил и светодиоды со временем покрываются пылью и гарью от дорог. Мытье букв осуществляется раз в 2 года силами промышленных альпинистов мягкими моющими средствами без растворителей."
      },
      {
        step: "04",
        title: "Контроль кровли и пригрузов",
        desc: "Проверяйте состояние защитных матов под бетонными блоками. Сами блоки не должны смещаться. Сохранение проектного веса пригрузов критично для устойчивости к ураганному ветру."
      }
    ]
  };

  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200/80">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-3 font-semibold">
            Безопасная эксплуатация
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
