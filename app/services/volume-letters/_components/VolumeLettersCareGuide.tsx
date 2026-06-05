// app/services/volume-letters/_components/VolumeLettersCareGuide.tsx

import { ShieldAlert } from "lucide-react";
import { VOLUME_LETTERS_EXPERT, VOLUME_LETTERS_DICT } from "@/dictionaries/services/volume-letters";

export default function VolumeLettersCareGuide() {
  const data = VOLUME_LETTERS_EXPERT.careGuide;

  return (
    <section id="care-guide" className="py-24 bg-slate-50 border-t border-slate-200/80 relative w-full overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 rounded-full uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5" />
            {VOLUME_LETTERS_DICT.careGuide.badge}
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            {data.title}
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
            {data.subtitle}
          </p>
        </div>

        {/* Robust edge-to-edge mobile horizontal scroll list */}
        <div className="flex overflow-x-auto w-auto -mx-4 px-4 pb-8 gap-4 snap-x snap-mandatory md:grid md:grid-cols-4 md:gap-6 md:overflow-visible md:pb-0 hide-scrollbar">
          {data.tips.map((item, idx) => (
            <div 
              key={idx} 
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-orange-500/20 transition-all duration-300 relative group overflow-hidden w-[82vw] max-w-[320px] md:w-auto md:max-w-none md:min-w-0 snap-center flex flex-col shrink-0"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-bl-full pointer-events-none group-hover:bg-orange-500/10 transition-colors"></div>
              
              <div className="text-orange-600 font-extrabold text-xs mb-3 tracking-widest uppercase">
                {VOLUME_LETTERS_DICT.careGuide.tipPrefix} {item.step}
              </div>
              <h3 className="text-slate-800 font-bold text-lg mb-2 whitespace-normal break-words">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed whitespace-normal break-words">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
