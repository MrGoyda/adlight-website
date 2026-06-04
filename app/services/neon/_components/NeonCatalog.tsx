// app/services/neon/_components/NeonCatalog.tsx

import { neonDetails } from "@/dictionaries/services/details/neon";

export default function NeonCatalog() {
  return (
    <section id="catalog" aria-labelledby="catalog-heading" className="py-24 bg-white border-t border-slate-200/80">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-3 font-semibold">
            Варианты и Цвета
          </span>
          <h2 id="catalog-heading" className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            {neonDetails.typesTitle}
          </h2>
          <p className="text-slate-500 text-lg max-w-3xl mx-auto leading-relaxed">
            {neonDetails.typesSubtitle}
          </p>
        </div>

        <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {neonDetails.types.map((type, i) => (
            <li 
              key={i} 
              className="group flex flex-col rounded-3xl overflow-hidden border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-orange-500/30 cursor-default shadow-sm hover:shadow-md transition-all duration-300"
            >
              <article className="flex flex-col h-full">
                {/* HEX Color Neon Glow Visual Preview */}
                <div className="relative aspect-[16/10] w-full flex items-center justify-center bg-slate-950 overflow-hidden border-b border-slate-900 p-8 select-none">
                  {/* Glowing Tube Container */}
                  <div className="relative w-full max-w-[180px] h-3.5 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                    {/* Outer Neon Glow */}
                    <div 
                      className="absolute inset-0 rounded-full blur-[6px] opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ 
                        backgroundColor: type.hex, 
                        boxShadow: `0 0 20px 6px ${type.hex}, 0 0 40px 12px ${type.hex}` 
                      }}
                    />
                    {/* Main Tube Body */}
                    <div 
                      className="absolute inset-0 rounded-full"
                      style={{ backgroundColor: type.hex }}
                    />
                    {/* Bright Inner Core */}
                    <div 
                      className="absolute top-[2.5px] left-[3px] right-[3px] bottom-[2.5px] bg-white/95 rounded-full blur-[0.5px]"
                    />
                  </div>
                  {type.tag && (
                    <span className="absolute top-4 left-4 z-10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-orange-600 text-white rounded-md shadow-md">
                      {type.tag}
                    </span>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors duration-300">
                    {type.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed flex-grow">
                    {type.desc}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
