// app/services/volume-letters/_components/VolumeLettersExpertTips.tsx

import { Maximize2, Compass, Layers, UserCheck } from "lucide-react";
import { VOLUME_LETTERS_EXPERT } from "@/dictionaries/services/volume-letters";

export default function VolumeLettersExpertTips() {
  const data = VOLUME_LETTERS_EXPERT.technologistTips;

  return (
    <section id="expert-tips" className="py-24 bg-slate-50 border-t border-slate-200/80 relative">
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 rounded-full uppercase tracking-wider">
            <UserCheck className="w-3.5 h-3.5" />
            Экспертное мнение
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            {data.title}
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
            {data.subtitle}
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white border border-slate-200 shadow-sm rounded-3xl p-8 md:p-12 relative overflow-hidden">
          {/* Technologist Badge */}
          <div className="flex flex-col md:flex-row items-center gap-6 border-b border-slate-100 pb-8 mb-8">
            <div className="w-20 h-20 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 font-extrabold text-2xl shrink-0 uppercase">
              {data.expertName.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="text-center md:text-left">
              <h4 className="text-slate-900 font-extrabold text-xl mb-1">{data.expertName}</h4>
              <p className="text-slate-500 text-sm font-semibold">{data.expertRole}</p>
            </div>
          </div>

          {/* Facade Match Cards */}
          <div className="grid gap-6">
            {data.tips.map((item, idx) => (
              <div key={idx} className="bg-slate-50/80 border border-slate-200/60 p-6 rounded-2xl flex flex-col md:flex-row gap-4 items-start hover:border-orange-500/20 hover:bg-slate-50 transition-colors duration-200">
                <div className="p-3 bg-white border border-slate-200 rounded-xl text-orange-600 shrink-0 shadow-sm">
                  {idx === 0 && <Maximize2 className="w-6 h-6" />}
                  {idx === 1 && <Compass className="w-6 h-6" />}
                  {idx === 2 && <Layers className="w-6 h-6" />}
                </div>
                <div>
                  <h5 className="text-slate-800 font-extrabold text-base mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0"></span>
                    Тип фасада: {item.facade}
                  </h5>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium">
                    {item.recommendation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
