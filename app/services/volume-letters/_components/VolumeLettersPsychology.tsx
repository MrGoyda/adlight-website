// app/services/volume-letters/_components/VolumeLettersPsychology.tsx

import { Eye } from "lucide-react";
import { VOLUME_LETTERS_ADVANTAGES } from "@/dictionaries/services/volume-letters";

export default function VolumeLettersPsychology() {
  return (
    <section id="psychology" className="py-24 bg-slate-50 border-t border-slate-200/80">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm relative overflow-hidden">
          {/* Subtle accent glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-[80px] rounded-full pointer-events-none"></div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-6 tracking-tight">
                {VOLUME_LETTERS_ADVANTAGES.title}
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-6 font-medium">
                {VOLUME_LETTERS_ADVANTAGES.subtitle}
              </p>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-50 rounded-xl text-orange-600 border border-orange-100 shrink-0">
                  <Eye className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-slate-800 font-bold mb-1">
                    {VOLUME_LETTERS_ADVANTAGES.eyeMagnet.title}
                  </h4>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {VOLUME_LETTERS_ADVANTAGES.eyeMagnet.desc}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50/80 backdrop-blur p-8 rounded-2xl border border-slate-200 text-center relative shadow-sm">
              <div className="text-sm text-slate-500 uppercase tracking-widest mb-2 font-bold">
                Эффективность
              </div>
              <div className="text-7xl font-black text-slate-900 mb-2 tracking-tighter">
                +{VOLUME_LETTERS_ADVANTAGES.efficiencyPercent}
              </div>
              <p className="text-slate-600 font-semibold leading-relaxed">
                {VOLUME_LETTERS_ADVANTAGES.efficiencyText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
