// app/services/volume-letters/_components/VolumeLettersSteps.tsx

import { VOLUME_LETTERS_STEPS } from "@/dictionaries/services/volume-letters";

export default function VolumeLettersSteps() {
  return (
    <section className="py-24 bg-slate-950">
      <div className="container mx-auto px-4">
         <h2 className="text-3xl md:text-4xl font-bold text-white mb-16 text-center">Как мы работаем</h2>
         <div className="grid md:grid-cols-5 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-slate-800 -z-10"></div>
            {VOLUME_LETTERS_STEPS.map((item, i) => (
               <div key={i} className="relative group bg-slate-950 p-4 pt-0">
                  <div className="w-16 h-16 bg-slate-900 border-2 border-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-6 mx-auto shadow-lg shadow-orange-900/20 group-hover:scale-110 transition-transform">{item.step}</div>
                  <h3 className="text-lg font-bold text-white text-center mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-center text-xs leading-relaxed">{item.desc}</p>
               </div>
            ))}
         </div>
      </div>
    </section>
  );
}
