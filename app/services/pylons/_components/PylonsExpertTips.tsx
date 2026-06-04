// app/services/pylons/_components/PylonsExpertTips.tsx
"use client";

import { CheckCircle, ShieldAlert, Sparkles, UserCheck } from "lucide-react";

export default function PylonsExpertTips() {
  const tips = [
    {
      title: "Глубина заложения фундамента ниже 1.8м",
      desc: "В Астане глубина промерзания грунта составляет около 1.7-1.8 метра. Фундамент монументальной стелы должен заливаться ниже этой отметки с обязательной песчано-гравийной подушкой для предотвращения выдавливания морозным пучением грунта.",
      icon: ShieldAlert
    },
    {
      title: "Линзованная LED оптика с углом рассеивания 160°",
      desc: "Для равномерного засвета лайтбоксов на стелах мы используем диоды с широким углом рассеивания. Это позволяет избежать эффекта 'зебры' (чередование светлых и темных полос) и снизить энергопотребление на 30%.",
      icon: Sparkles
    },
    {
      title: "Защита электроники от скачков напряжения",
      desc: "Уличные отдельно стоящие стелы подключены к сетям общего пользования, где часты скачки напряжения. Мы всегда комплектуем щиты реле напряжения и фазными контакторами, защищающими светодиоды от перегорания.",
      icon: CheckCircle
    }
  ];

  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200/80">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-3 font-semibold">
            Советы инженера
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Секреты надежности отдельно стоящей стелы
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Особенности проектирования тяжелых придорожных конструкций в сложных климатических условиях
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

          {/* Правая часть: Блок технолога */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-10 text-white relative overflow-hidden flex flex-col justify-between shadow-xl">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.webp')] opacity-5"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-orange-600 rounded-2xl flex items-center justify-center text-white shrink-0">
                  <UserCheck className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-extrabold text-lg text-white">Данияр Бауржанович</h4>
                  <p className="text-orange-400 text-xs font-semibold uppercase tracking-wider">Главный технолог ADLight</p>
                </div>
              </div>

              <blockquote className="text-slate-350 text-base italic leading-relaxed mb-8">
                &ldquo;Стела АЗС или ТРЦ испытывает колоссальные ветровые нагрузки в Астане. Мы изготавливаем внутренние рамы только из горячекатаного металлопроката и обрабатываем их двухкомпонентным цинковым грунтом. Это гарантирует, что конструкция простоит десятилетия, не подвергаясь коррозии и деформации.&rdquo;
              </blockquote>
            </div>

            <div className="relative z-10 pt-6 border-t border-slate-700 flex justify-between items-center text-xs text-slate-400">
              <span>Собственный сварочный и сборочный цех</span>
              <span className="font-bold text-orange-400">Гарантия до 3 лет по договору</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
