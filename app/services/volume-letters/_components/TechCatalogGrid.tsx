// app/services/volume-letters/_components/TechCatalogGrid.tsx

import Link from "next/link";
import Image from "next/image";
import { Moon, Sun, MousePointerClick, ArrowRight } from "lucide-react";
import { VOLUME_LETTERS_CATALOG, VOLUME_LETTERS_DICT } from "@/dictionaries/services/volume-letters";

export default function TechCatalogGrid() {
  const notice = VOLUME_LETTERS_DICT.techCatalogNotice;

  return (
    <section id="technologies" className="py-24 bg-slate-50 border-y border-slate-200/80 relative w-full overflow-hidden">
      {/* Subtle background aura */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[500px] bg-orange-500/5 blur-[120px] pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            {notice.heading}
          </h2>
          <p className="text-slate-700 font-semibold text-lg max-w-2xl mx-auto mb-3 leading-relaxed">
            {notice.title}
          </p>
          <p className="text-slate-500 text-base max-w-xl mx-auto leading-relaxed">
            {notice.description}
          </p>
        </div>
        
        {/* Robust mobile scroll wrapper (no negative margins to prevent page overflow leaks) */}
        <ul className="flex overflow-x-auto w-full pb-8 gap-4 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 md:overflow-visible md:pb-0 hide-scrollbar">
          {VOLUME_LETTERS_CATALOG.map((type) => {
            const numericPrice = type.price.replace(/\D/g, "");
            return (
              <li 
                key={type.id}
                itemScope
                itemType="https://schema.org/Product"
                className="w-[82vw] max-w-[320px] md:w-auto md:max-w-none md:min-w-0 snap-center shrink-0"
              >
                <Link 
                  href={`/services/volume-letters/${type.slug}`} 
                  className="group relative flex flex-col w-full rounded-3xl bg-white border border-slate-200 overflow-hidden hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 cursor-pointer h-[420px]"
                >
                  <div className="relative h-[220px] w-full overflow-hidden bg-slate-100 shrink-0">
                    {type.badge && (
                      <div className="absolute top-3 right-3 z-20 bg-orange-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-lg">
                        {type.badge}
                      </div>
                    )}

                    <div className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-0 z-10">
                      <Image 
                        src={type.images.night} 
                        alt={`${type.title} - ночная подсветка`} 
                        fill 
                        itemProp="image"
                        className="object-cover" 
                      />
                      <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-[10px] text-white flex items-center gap-1 font-semibold">
                        <Moon className="w-3 h-3 text-blue-400" /> {notice.night}
                      </div>
                    </div>

                    <div className="absolute inset-0">
                      <Image 
                        src={type.images.day} 
                        alt={`${type.title} - вид днем`} 
                        fill 
                        className="object-cover" 
                      />
                      <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] text-slate-800 flex items-center gap-1 font-semibold border border-slate-200/50">
                        <Sun className="w-3 h-3 text-orange-500" /> {notice.day}
                      </div>
                    </div>
                    
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 bg-black/50 backdrop-blur rounded-full p-3 shadow-lg">
                      <MousePointerClick className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1 justify-between bg-white">
                    <div>
                      <h3 
                        itemProp="name" 
                        className="text-xl font-bold text-slate-900 mb-2 leading-tight group-hover:text-orange-600 transition-colors"
                      >
                        {type.title}
                      </h3>
                      <p 
                        itemProp="description" 
                        className="text-sm text-slate-500 line-clamp-3 leading-relaxed"
                      >
                        {type.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                      <span 
                        itemProp="offers"
                        itemScope
                        itemType="https://schema.org/Offer"
                        className="text-slate-800 font-bold text-sm bg-slate-50 border border-slate-100 px-3 py-1 rounded-lg"
                      >
                        <meta itemProp="price" content={numericPrice} />
                        <meta itemProp="priceCurrency" content="KZT" />
                        <link itemProp="availability" href="https://schema.org/InStock" />
                        {type.price}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
