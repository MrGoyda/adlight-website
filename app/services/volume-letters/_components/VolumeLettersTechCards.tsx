// app/services/volume-letters/_components/VolumeLettersTechCards.tsx

import { Layers, Zap, ShieldCheck, Hammer } from "lucide-react";
import { VOLUME_LETTERS_TECH_CARDS } from "@/dictionaries/services/volume-letters";

export default function VolumeLettersTechCards() {
  return (
    <section className="py-24 bg-slate-950">
       <div className="container mx-auto px-4">
          <div className="text-center mb-16">
             <h2 className="text-3xl font-bold text-white mb-4">Качество не на словах</h2>
             <p className="text-gray-400">Мы даем гарантию, потому что уверены в материалах</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
             {VOLUME_LETTERS_TECH_CARDS.map((card, idx) => (
                <div key={idx} className="bg-[#0B1120] p-6 rounded-2xl border border-slate-800 hover:border-blue-500/30 transition group">
                   <div className="w-12 h-12 bg-blue-500/10 flex items-center justify-center mb-4 text-blue-500 rounded-xl group-hover:scale-110 transition">
                      {idx === 0 && <Layers className="w-6 h-6"/>}
                      {idx === 1 && <Zap className="w-6 h-6"/>}
                      {idx === 2 && <ShieldCheck className="w-6 h-6"/>}
                      {idx === 3 && <Hammer className="w-6 h-6"/>}
                   </div>
                   <h3 className="text-white font-bold mb-2">{card.title}</h3>
                   <p className="text-gray-400 text-sm">{card.desc}</p>
                </div>
             ))}
          </div>
       </div>
    </section>
  );
}
