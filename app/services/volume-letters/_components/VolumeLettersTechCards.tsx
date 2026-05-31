// app/services/volume-letters/_components/VolumeLettersTechCards.tsx

import { Layers, Zap, ShieldCheck, Hammer } from "lucide-react";
import { VOLUME_LETTERS_TECH_CARDS, VOLUME_LETTERS_DICT } from "@/dictionaries/services/volume-letters";

export default function VolumeLettersTechCards() {
  const specs = VOLUME_LETTERS_DICT.specifications;

  return (
    <section id="specifications" className="py-24 bg-slate-50 border-t border-slate-200/80 w-full overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            {specs.title}
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
            {specs.subtitle}
          </p>
        </div>

        {/* Robust edge-to-edge mobile horizontal scroll list */}
        <div className="flex overflow-x-auto w-auto -mx-4 px-4 pb-8 gap-4 snap-x snap-mandatory md:grid md:grid-cols-4 md:gap-6 md:overflow-visible md:pb-0 hide-scrollbar">
          {VOLUME_LETTERS_TECH_CARDS.map((card, idx) => (
            <div 
              key={idx} 
              className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-orange-500/30 shadow-sm hover:shadow-md transition-all duration-300 group w-[82vw] max-w-[320px] md:w-auto md:max-w-none md:min-w-0 snap-center flex flex-col shrink-0"
            >
              <div className="w-12 h-12 bg-orange-50 flex items-center justify-center mb-4 text-orange-600 border border-orange-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                {idx === 0 && <Layers className="w-6 h-6" />}
                {idx === 1 && <Zap className="w-6 h-6" />}
                {idx === 2 && <ShieldCheck className="w-6 h-6" />}
                {idx === 3 && <Hammer className="w-6 h-6" />}
              </div>
              <h3 className="text-slate-800 font-bold text-lg mb-2 whitespace-normal break-words">{card.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed whitespace-normal break-words">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
