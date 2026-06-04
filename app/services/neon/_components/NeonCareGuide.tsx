// app/services/neon/_components/NeonCareGuide.tsx

export default function NeonCareGuide() {
  const data = {
    title: "Правила ухода и эксплуатации",
    subtitle: "Как продлить срок службы неоновой вывески и сохранить её первозданный блеск",
    tips: [
      {
        step: "01",
        title: "Энергосбережение",
        desc: "LED-неон потребляет в 5-10 раз меньше электроэнергии, чем старый газовый неон. Вывеска длиной в 2 метра потребляет около 40 Вт — меньше обычной лампочки накаливания."
      },
      {
        step: "02",
        title: "Очистка оргстекла",
        desc: "Акрил легко притягивает пыль. Сдуйте пылинки или протрите мягкой салфеткой из микрофибры. Категорически запрещено использовать спиртовые очистители, чтобы избежать трещин."
      },
      {
        step: "03",
        title: "Безопасность питания",
        desc: "Неон работает от безопасного напряжения 12V. Всегда используйте оригинальный сетевой адаптер из комплекта. Не накрывайте блок питания тканью во избежание перегрева."
      },
      {
        step: "04",
        title: "Температурный диапазон",
        desc: "Силиконовая оболочка нашего неона выдерживает перепады температур от -40°C до +50°C. Вывеску можно спокойно вешать в неотапливаемых тамбурах или на крытых витринах."
      }
    ]
  };

  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200/80">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-3 font-semibold">
            Эксплуатация неона
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
