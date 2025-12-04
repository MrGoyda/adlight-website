"use client";

export default function StepsSection() {
  const steps = [
    { n: 1, t: "Заявка", d: "Вы оставляете заявку или звоните. Мы договариваемся о бесплатном замере." },
    { n: 2, t: "Дизайн", d: "Делаем фотопривязку к вашему фасаду. Вы видите результат до оплаты." },
    { n: 3, t: "Цех", d: "Изготовление на ЧПУ станках. Сварка, покраска, сборка электрики." },
    { n: 4, t: "Монтаж", d: "Доставка и установка в любое время суток. Подключение и гарантия." }
  ];

  return (
    <section data-aos="fade-up" className="py-24 bg-slate-950 border-t border-slate-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-16 text-center">Как мы работаем</h2>
        
        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* Линия соединения (скрыта на мобильных) */}
          <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-slate-800 -z-10"></div>
          
          {steps.map((step, i) => (
            <div key={i} data-aos="fade-up" data-aos-delay={i * 100} className="relative bg-slate-950 p-4 rounded-2xl border border-transparent hover:border-slate-800 transition duration-300">
              <div className="w-16 h-16 bg-slate-900 border-2 border-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-6 mx-auto z-10 shadow-lg shadow-orange-900/20 relative">
                {step.n}
              </div>
              <h3 className="text-xl font-bold text-white text-center mb-3">{step.t}</h3>
              <p className="text-gray-400 text-center text-sm leading-relaxed">{step.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}