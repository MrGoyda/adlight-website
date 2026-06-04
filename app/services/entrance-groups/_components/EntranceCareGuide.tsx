// app/services/entrance-groups/_components/EntranceCareGuide.tsx
"use client";

export default function EntranceCareGuide() {
  const data = {
    title: "Правила ухода и сезонного обслуживания",
    subtitle: "Как продлить первозданный вид облицовки, козырька и световых элементов на долгие годы",
    tips: [
      {
        step: "01",
        title: "Очистка панелей АКП",
        desc: "Алюминиевый композит отлично моется струей воды под давлением. Для сильных загрязнений используйте мыльные растворы. Запрещено тереть абразивами или использовать кислоты."
      },
      {
        step: "02",
        title: "Очистка водостока навеса",
        desc: "Регулярно перед наступлением зимы очищайте внутренние желоба и сливные трубы козырька от листвы и уличного мусора, чтобы избежать образования ледяных пробок."
      },
      {
        step: "03",
        title: "Защитная обработка дерева",
        desc: "Если при оформлении использовались деревянные рейки или панели HPL, покрывайте их специализированным защитным маслом каждые 2 года для предотвращения высыхания и гниения."
      },
      {
        step: "04",
        title: "Контроль уплотнителей",
        desc: "Раз в год проверяйте целостность резиновых уплотнителей в зонах примыкания козырька к стене здания, чтобы исключить затекание воды по стыкам на вывеску."
      }
    ]
  };

  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200/80">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-3 font-semibold">
            Эксплуатация фасада
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
