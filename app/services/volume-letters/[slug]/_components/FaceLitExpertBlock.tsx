// app/services/volume-letters/[slug]/_components/FaceLitExpertBlock.tsx
'use client';

import { Check, ClipboardList, ThermometerSnowflake, ShieldAlert, Award } from "lucide-react";
import { VolumeLetterDetailData } from "@/dictionaries/services/volume-letters";

interface FaceLitExpertBlockProps {
  data: VolumeLetterDetailData;
}

export default function FaceLitExpertBlock({ data }: FaceLitExpertBlockProps) {
  // Безопасная инициализация на случай отсутствия экспертных полей на других страницах
  const author = data.expertAuthor || { name: "Парчевин Даниил", role: "Главный технолог производства ADLight", experience: "9+ лет" };
  const quote = data.expertQuote || {
    title: "«Тонкости подбора вывески под фасад здания»",
    text: "При выборе технологии важно учитывать тип фасадного материала. В зависимости от текстуры (кирпич, керамогранит, остекление) мы подберем оптимальный вариант рассеивания света.",
    subtext: "Совет технолога"
  };
  const regulations = data.expertRegulations || {
    title: "Согласование вывески без штрафов",
    desc: "Акимат Астаны строго следит за соответствием вывесок городскому Дизайн-коду. Чтобы вашу вывеску не демонтировали, проверьте:",
    items: [
      "Только объемные буквы на металлораме в цвет фасада (без сплошных подложек на первом этаже).",
      "Высота букв не должна превышать 50 см согласно городским правилам благоустройства.",
      "Отсутствие агрессивной мигающей динамики и стробоскопических эффектов.",
      "Подача эскизного проекта с фотопривязкой 3D (день/ночь) через e-Otinish."
    ]
  };
  const specs = data.expertSpecifications || {
    title: "Технические спецификации и климат Астаны",
    subtitle: "Используемые материалы, стандарты ГОСТ и адаптация к нагрузкам",
    rows: []
  };
  const disclaimer = data.expertBudgetDisclaimer || {
    title: "Гибкий выбор под ваш бюджет",
    text: "Мы предлагаем как премиальные комплектации на базе европейских и корейских комплектующих, так и качественные заводские китайские аналоги. Это позволяет вам сэкономить до 30-40% от стоимости вывески без ущерба для ее внешнего вида."
  };

  return (
    <section className="py-24 bg-white border-b border-slate-200 relative overflow-hidden">
      {/* Мягкий рассеянный фоновый свет */}
      <div className="absolute top-[10%] right-[5%] w-[400px] h-[400px] bg-orange-100/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] left-[5%] w-[450px] h-[450px] bg-blue-50/30 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        
        {/* Заголовок секции */}
        <div className="text-center mb-20">
          <span className="text-orange-600 font-extrabold text-sm uppercase tracking-widest mb-2 block">Экспертный гайд</span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-950 tracking-tight max-w-3xl mx-auto">
            Что нужно знать перед заказом световых букв
          </h2>
          <p className="text-slate-500 text-base md:text-lg mt-4 max-w-xl mx-auto">
            Технические подробности, советы производства и регламенты Акимата Астаны в одном месте.
          </p>
        </div>

        {/* Сетка экспертного контента */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20 items-stretch">
          
          {/* Блок 1: Советы главного технолога */}
          <div className="bg-slate-50 rounded-[2.5rem] p-8 md:p-10 border border-slate-200/80 shadow-[0_10px_35px_rgba(0,0,0,0.01)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
                  <Award className="w-6 h-6"/>
                </div>
                <div>
                  <h3 className="text-slate-950 font-bold text-lg leading-none">{author.name}</h3>
                  <span className="text-slate-400 text-xs font-semibold">{author.role}</span>
                </div>
              </div>

              <h4 className="text-slate-900 font-extrabold text-xl mb-4 tracking-tight">
                {quote.title}
              </h4>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                {quote.text}
              </p>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap gap-4 items-center justify-between text-xs font-bold text-slate-500">
              <span>Опыт работы: {author.experience}</span>
              <span className="text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full">{quote.subtext}</span>
            </div>
          </div>

          {/* Блок 2: Чек-лист по согласованию с Акиматом */}
          <div className="bg-slate-50 rounded-[2.5rem] p-8 md:p-10 border border-slate-200/80 shadow-[0_10px_35px_rgba(0,0,0,0.01)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
                  <ClipboardList className="w-6 h-6"/>
                </div>
                <h3 className="text-slate-950 font-black text-xl tracking-tight">
                  {regulations.title}
                </h3>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                {regulations.desc}
              </p>

              <ul className="space-y-4">
                {regulations.items.map((step, idx) => (
                  <li key={idx} className="flex gap-3 text-slate-700 text-sm leading-relaxed font-semibold">
                    <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5"/> {step}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 text-xs font-bold text-slate-400">
              * Разрабатываем паспорт вывески строго под регламент Акимата.
            </div>
          </div>

        </div>

        {/* Экспертная таблица спецификаций */}
        {specs.rows && specs.rows.length > 0 && (
          <div className="bg-slate-50 rounded-[2.5rem] border border-slate-200/80 p-8 md:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.01)] mb-16 overflow-hidden">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
                <ThermometerSnowflake className="w-6 h-6"/>
              </div>
              <div>
                <h3 className="text-slate-950 font-black text-xl tracking-tight">{specs.title}</h3>
                <p className="text-slate-500 text-xs font-semibold mt-1">{specs.subtitle}</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
                    <th className="py-4 px-2">Характеристика / Узел</th>
                    <th className="py-4 px-2">Премиум-комплектация</th>
                    <th className="py-4 px-2">Качественный заводской Китай</th>
                    <th className="py-4 px-2">Назначение для вывески</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
                  {specs.rows.map((row, index) => (
                    <tr key={index}>
                      <td className="py-4 px-2 text-slate-950 font-bold">{row.label}</td>
                      <td className="py-4 px-2">{row.premium}</td>
                      <td className="py-4 px-2">{row.chineseAlternative}</td>
                      <td className="py-4 px-2 text-slate-500 font-medium">{row.purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Небольшой дисклеймер о бюджете */}
        <div className="flex gap-4 p-6 bg-orange-50 border border-orange-100 rounded-3xl items-start">
          <ShieldAlert className="w-6 h-6 text-orange-600 shrink-0 mt-0.5"/>
          <div>
            <h4 className="text-orange-950 font-bold text-sm mb-1">{disclaimer.title}</h4>
            <p className="text-orange-800 text-xs md:text-sm leading-relaxed">
              {disclaimer.text}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
