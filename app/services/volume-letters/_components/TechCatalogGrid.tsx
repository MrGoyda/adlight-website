// app/services/volume-letters/_components/TechCatalogGrid.tsx

import Link from "next/link";
import Image from "next/image";
import { Moon, Sun, MousePointerClick, ArrowRight } from "lucide-react";
import { VOLUME_LETTERS_CATALOG } from "@/dictionaries/services/volume-letters";

export default function TechCatalogGrid() {
  return (
    <section className="py-24 bg-[#0F172A] border-y border-slate-800 relative">
       <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[500px] bg-blue-500/5 blur-[120px] pointer-events-none"></div>
       
       <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
             <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Выберите технологию</h2>
             <p className="text-gray-400">Нажмите на карточку, чтобы узнать подробности и цены</p>
          </div>
          
          <div className="flex overflow-x-auto pb-8 -mx-4 px-4 gap-4 snap-x snap-mandatory scroll-pl-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 md:overflow-visible md:pb-0 md:px-0 hide-scrollbar">
             {VOLUME_LETTERS_CATALOG.map((type) => (
                <Link 
                   href={`/services/volume-letters/${type.slug}`} 
                   key={type.id}
                   className="group relative flex flex-col min-w-[85vw] sm:min-w-[320px] md:min-w-0 snap-center rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 cursor-pointer h-[420px]"
                >
                   <div className="relative h-[220px] w-full overflow-hidden bg-black shrink-0">
                      {type.badge && (
                         <div className="absolute top-3 right-3 z-20 bg-orange-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-lg">
                            {type.badge}
                         </div>
                      )}

                      <div className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-0 z-10">
                         <Image src={type.images.night} alt={`${type.title} - ночная подсветка`} fill className="object-cover"/>
                         <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-[10px] text-white flex items-center gap-1">
                            <Moon className="w-3 h-3 text-blue-400"/> Ночь
                         </div>
                      </div>

                      <div className="absolute inset-0">
                         <Image src={type.images.day} alt={`${type.title} - вид днем`} fill className="object-cover"/>
                         <div className="absolute bottom-2 left-2 bg-white/80 backdrop-blur px-2 py-1 rounded text-[10px] text-black flex items-center gap-1">
                            <Sun className="w-3 h-3 text-orange-500"/> День
                         </div>
                      </div>
                      
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 bg-black/50 backdrop-blur rounded-full p-3">
                         <MousePointerClick className="w-6 h-6 text-white"/>
                      </div>
                   </div>

                   <div className="p-6 flex flex-col flex-1 justify-between">
                      <div>
                         <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-orange-500 transition-colors">
                            {type.title}
                         </h3>
                         <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">
                            {type.description}
                         </p>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800">
                         <span className="text-white font-medium text-sm bg-slate-800 px-3 py-1 rounded-lg">
                            {type.price}
                         </span>
                         <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-orange-600 group-hover:text-white transition-all">
                            <ArrowRight className="w-4 h-4"/>
                         </div>
                      </div>
                   </div>
                </Link>
             ))}
          </div>
       </div>
    </section>
  );
}
