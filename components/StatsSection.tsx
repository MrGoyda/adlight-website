import { HOME_STATS } from "@/dictionaries/home";
import BlueprintGrid from "@/components/ui/BlueprintGrid";

export default function StatsSection() {
  return (
    <section className="py-20 bg-[#F8FAFB] border-y border-slate-200 relative overflow-hidden">
      {/* Чертежная сетка на фоне (Blueprint Grid) */}
      <BlueprintGrid showGradients={false} className="opacity-80" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Grid Container с тонкими границами (gap-px создает эффект тонких линий) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 border border-slate-200 rounded-2xl overflow-hidden shadow-xl shadow-slate-200/30">
          {HOME_STATS.map((stat, index) => (
            <div
              key={index}
              className="group bg-white p-8 hover:bg-slate-50/50 transition-colors duration-300 flex flex-col justify-between min-h-[220px]"
            >
              {/* Верхняя строка: только порядковый номер в инженерном моноширинном стиле (иконки убраны) */}
              <div className="flex justify-end mb-6">
                <span className="text-[10px] font-mono text-slate-400 group-hover:text-slate-500 transition-colors">
                  0{index + 1}
                </span>
              </div>

              {/* Значения и описания (SEO-оптимизированные для ИИ-поисковиков) */}
              <div className="space-y-2">
                {/* Значение */}
                <div className="text-3xl lg:text-4xl font-black text-slate-950 tracking-tight group-hover:scale-[1.02] transition-transform duration-300 origin-left">
                  {stat.value}
                </div>
                {/* Заголовок */}
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  {stat.label}
                </div>
                {/* Описание сильных сторон */}
                <p className="text-sm text-slate-500 leading-relaxed pt-3 border-t border-slate-100 mt-4 font-medium">
                  {stat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}