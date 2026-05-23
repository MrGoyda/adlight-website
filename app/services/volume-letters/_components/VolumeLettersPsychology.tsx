// app/services/volume-letters/_components/VolumeLettersPsychology.tsx

import { Eye } from "lucide-react";
import { VOLUME_LETTERS_ADVANTAGES } from "@/dictionaries/services/volume-letters";

export default function VolumeLettersPsychology() {
  return (
    <section className="py-24 bg-slate-950">
       <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-[#0B1120] to-[#1a2035] rounded-3xl p-8 md:p-12 border border-slate-800 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none"></div>
             
             <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
                <div>
                   <h2 className="text-3xl font-bold text-white mb-6">{VOLUME_LETTERS_ADVANTAGES.title}</h2>
                   <p className="text-gray-400 text-lg leading-relaxed mb-6">
                      {VOLUME_LETTERS_ADVANTAGES.subtitle}
                   </p>

                   <div className="flex items-start gap-4">
                      <div className="p-3 bg-orange-500/20 rounded-xl text-orange-500 shrink-0"><Eye className="w-6 h-6"/></div>
                      <div>
                         <h4 className="text-white font-bold mb-1">{VOLUME_LETTERS_ADVANTAGES.eyeMagnet.title}</h4>
                         <p className="text-gray-400 text-sm">{VOLUME_LETTERS_ADVANTAGES.eyeMagnet.desc}</p>
                      </div>
                   </div>
                </div>
                
                <div className="bg-slate-900/50 backdrop-blur p-8 rounded-2xl border border-slate-700 text-center relative">
                   <div className="text-sm text-gray-500 uppercase tracking-widest mb-2 font-bold">Эффективность</div>
                   <div className="text-7xl font-black text-white mb-2 tracking-tighter">
                      +42<span className="text-orange-500 text-5xl">%</span>
                   </div>
                   <p className="text-gray-300 font-medium">
                      {VOLUME_LETTERS_ADVANTAGES.efficiencyText}
                   </p>
                </div>
             </div>
          </div>
       </div>
    </section>
  );
}
