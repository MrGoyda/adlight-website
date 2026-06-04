// app/services/roof-installations/_components/RoofExpertTips.tsx
"use client";

import { ShieldCheck, Wind, Zap, UserCheck } from "lucide-react";

export default function RoofExpertTips() {
  const tips = [
    {
      title: "Обязательный ветровой расчет",
      desc: "Астана известна своими экстремальными ветрами. Конструкция рассчитывается с учетом пиковых ветровых нагрузок конкретного района города. Запас прочности несущей фермы составляет не менее 1.5x.",
      icon: Wind
    },
    {
      title: "Монтаж на систему пригрузов",
      desc: "Чтобы не нарушать гидроизоляцию кровли здания, мы крепим силовую металлическую ферму к бетонным блокам-якорям (пригрузам). Это полностью исключает протечки крыши и сохраняет гарантию застройщика.",
      icon: ShieldCheck
    },
    {
      title: "Автоматический щит управления (АЩУ)",
      desc: "Крышные конструкции потребляют значительную мощность. Мы комплектуем их шкафами автоматики с УЗО, реле напряжения, контакторами и фотореле для плавного автоматического включения строго на закате.",
      icon: Zap
    }
  ];

  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200/80">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-3 font-semibold">
            Инженерия и безопасность
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Секреты надежной крышной конструкции
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            На что обратить внимание перед началом проектирования рекламы на крыше, чтобы избежать предписаний ГАСК и ЧС
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-stretch">
          {/* Левая часть: карточки советов */}
          <div className="lg:col-span-7 flex flex-col gap-6 justify-between">
            {tips.map((tip, idx) => {
              const Icon = tip.icon;
              return (
                <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition duration-300 flex gap-6 items-start">
                  <div className="p-3.5 bg-orange-50 rounded-2xl text-orange-600 border border-orange-100 shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-slate-900 font-bold text-lg mb-2">
                      {tip.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      {tip.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Правая часть: Блок инженера */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-10 text-white relative overflow-hidden flex flex-col justify-between shadow-xl">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.webp')] opacity-5"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-orange-600 rounded-2xl flex items-center justify-center text-white shrink-0">
                  <UserCheck className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-extrabold text-lg text-white">Виктор Александрович</h4>
                  <p className="text-orange-400 text-xs font-semibold uppercase tracking-wider">Главный инженер-конструктор ADLight</p>
                </div>
              </div>

              <blockquote className="text-slate-350 text-base italic leading-relaxed mb-8">
                &ldquo;Безопасность крышной установки — наш главный приоритет. Мы не начинаем работу без детального обследования плит покрытия здания и составления проекта КМ/КЖ. Каждое сварное соединение проверяется ультразвуком, а металлокаркас проходит обязательное горячее цинкование, защищающее от ржавчины на 25+ лет.&rdquo;
              </blockquote>
            </div>

            <div className="relative z-10 pt-6 border-t border-slate-700 flex justify-between items-center text-xs text-slate-400">
              <span>Лицензия ГАСК I категории</span>
              <span className="font-bold text-orange-400">Гарантия до 3 лет</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
