"use client";

import React from "react";
import * as Icons from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";

interface StepItem {
  step: string;
  title: string;
  desc: string;
  icon?: React.ReactNode;
  iconName?: string;
  color?: string;
}

interface StepsSectionProps {
  steps?: StepItem[];
  title?: string;
  subtitle?: string;
}

const DEFAULT_STEPS: StepItem[] = [
  {
    step: "01",
    title: "Бесплатный замер & Экспертный аудит",
    desc: "Наш инженер выезжает на ваш объект в Астане со всем необходимым измерительным ЧПУ-оборудованием. Делаем точные замеры, фотографируем фасад здания для фотопривязки и анализируем его архитектурные особенности по паспорту здания.",
    iconName: "MapPin",
    color: "text-orange-600 bg-orange-50 border-orange-100",
  },
  {
    step: "02",
    title: "Дизайн-проект & Фотопривязка «до / после»",
    desc: "Креативные дизайнеры разрабатывают детальный 3D-макет вашей будущей вывески в масштабе. Вы видите фотореалистичную визуализацию объекта еще до оплаты. Подбираем цвета, материалы и рассчитываем точный размер объемных букв.",
    iconName: "PenTool",
    color: "text-blue-600 bg-blue-50 border-blue-100",
  },
  {
    step: "03",
    title: "Согласование в e-Otinish под ключ",
    desc: "Наши штатные архитекторы формируют полный эскизный проект вывески по стандартам Дизайн-кода Астаны. Полностью сопровождаем процесс государственной подачи документов через систему e-Otinish до получения официального одобрения Управления архитектуры.",
    iconName: "FileCheck",
    color: "text-purple-600 bg-purple-50 border-purple-100",
  },
  {
    step: "04",
    title: "Высокоточный ЧПУ-раскрой листовых материалов",
    desc: "Запускаем производство на ул. Аспара 7. Раскрой акрила и композита на лазерных и фрезерных ЧПУ станках с точностью до 0.1 мм. Сгибаем алюминиевые и стальные профили бортов букв на автоматическом бортогибе без щелей и зазоров.",
    iconName: "Settings",
    color: "text-amber-600 bg-amber-50 border-amber-100",
  },
  {
    step: "05",
    title: "Сборка & 100% Тестирование светотехники",
    desc: "Сборщики-макетчики склеивают монолитные акриловые лица букв с бортами. Паяем и устанавливаем оригинальные влагозащищенные светодиоды Samsung IP67. Готовая вывеска проходит обязательный 24-часовой тест под нагрузкой на специальном стенде.",
    iconName: "CheckSquare",
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
  },
  {
    step: "06",
    title: "Чистовой монтаж & Выдача паспорта изделия",
    desc: "Опытная монтажная бригада аккуратно привозит конструкцию на объект. Производим надежный чистовой монтаж на несущий металлокаркас, подключаем электрику и герметизируем выходы. Сдаем объект с предоставлением официального паспорта вывески.",
    iconName: "Sparkles",
    color: "text-cyan-600 bg-cyan-50 border-cyan-100",
  }
];

export default function StepsSection({
  steps = DEFAULT_STEPS,
  title = "6 шагов до идеальной световой вывески",
  subtitle = "Отлаженный до мелочей процесс работы: от первой встречи на замере фасада до чистового монтажа без посредников."
}: StepsSectionProps) {
  return (
    <section className="py-20 lg:py-28 bg-white relative overflow-hidden border-t border-slate-200/60">
      {/* Decorative background ambient light glow */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/[0.012] rounded-full pointer-events-none -z-10" />
      
      <div className="container mx-auto px-4">
        
        {/* Header Block with Outfit premium typography */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-black uppercase tracking-wider">
             <Icons.ClipboardList className="w-3.5 h-3.5 text-orange-500"/> Наша технология работы
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5.5xl font-black text-slate-950 tracking-tight leading-none">
             {title.includes(" идеальной ") ? (
               <>
                 6 шагов до идеальной <br className="hidden sm:inline"/>
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-600 to-red-600">световой вывески</span>
               </>
             ) : title}
          </h2>
          <p className="text-slate-500 text-base sm:text-lg font-semibold max-w-xl mx-auto leading-relaxed">
             {subtitle}
          </p>
        </div>

        {/* Responsive Steps Layout: Mobile Swipeable Horizontal Slider, Desktop Bento Grid */}
        <ol className="flex overflow-x-auto gap-6 pb-8 hide-scrollbar -mx-4 px-4 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-3 md:mx-0 md:px-0">
          
          {steps.map((item, i) => {
            const itemColor = item.color || "text-orange-600 bg-orange-50 border-orange-100";

            return (
              <li
                key={i} 
                className="relative flex-none w-[82vw] sm:w-[340px] md:w-auto snap-center bg-slate-50/50 hover:bg-white p-8 rounded-3xl border border-slate-200/50 hover:border-slate-300 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-md transition duration-300 group flex flex-col justify-between"
              >
                {/* Step indicator */}
                <div className="flex items-center justify-between mb-6">
                   <span className={`px-3 py-1 rounded-xl text-xs font-bold border tracking-wider uppercase ${itemColor} flex items-center`}>
                      <span>Шаг {item.step}</span>
                   </span>
                   <span className="text-slate-200 group-hover:text-orange-500/20 font-black text-5xl tracking-tighter leading-none transition-colors duration-300">
                      {item.step}
                   </span>
                </div>

                {/* Title & Description */}
                <div className="space-y-3 mb-4">
                   <h3 className="text-slate-900 font-extrabold text-base sm:text-lg tracking-tight group-hover:text-orange-600 transition-colors leading-snug">
                      {item.title}
                   </h3>
                   <p className="text-slate-500 text-xs sm:text-sm font-semibold leading-relaxed">
                      {item.desc}
                   </p>
                </div>

                {/* Connecting line / arrow indicator for flow direction */}
                <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest pt-2 border-t border-slate-100">
                   <span>Шаг {item.step} из 0{steps.length}</span>
                   {i < steps.length - 1 && <Icons.ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:translate-x-0.5 transition-transform"/>}
                </div>
              </li>
            );
          })}

        </ol>
      </div>
    </section>
  );
}