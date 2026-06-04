// app/services/navigation/_components/NavigationCatalog.tsx

import Image from "next/image";
import { navigationDetails } from "@/dictionaries/services/details/navigation";

export default function NavigationCatalog() {
  return (
    <section id="catalog" aria-labelledby="catalog-heading" className="py-24 bg-white border-t border-slate-200/80">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-3 font-semibold">
            Элементы навигации
          </span>
          <h2 id="catalog-heading" className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            {navigationDetails.typesTitle}
          </h2>
          <p className="text-slate-500 text-lg max-w-3xl mx-auto leading-relaxed">
            {navigationDetails.typesSubtitle}
          </p>
        </div>

        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {navigationDetails.types.map((type, i) => (
            <li 
              key={i} 
              className="group flex flex-col rounded-3xl overflow-hidden border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-orange-500/30 cursor-default shadow-sm hover:shadow-md transition-all duration-300"
            >
              <article className="flex flex-col h-full">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 border-b border-slate-150">
                  {type.tag && (
                    <span className="absolute top-4 left-4 z-10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-orange-600 text-white rounded-md shadow-md">
                      {type.tag}
                    </span>
                  )}
                  <Image 
                    src={type.image} 
                    alt={type.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>

                <div className="p-6 md:p-8 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-orange-600 transition-colors duration-300">
                    {type.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow">
                    {type.desc}
                  </p>

                  {/* Спецификации и область применения для улучшения SEO/AI-индексации */}
                  {(type.specs || type.bestFor) && (
                    <div className="mt-auto pt-5 border-t border-slate-150 space-y-3 text-xs leading-relaxed text-slate-500">
                      {type.specs && (
                        <div>
                          <span className="text-slate-800 font-bold block mb-0.5">⚙️ Технические характеристики:</span>
                          <span>{type.specs}</span>
                        </div>
                      )}
                      {type.bestFor && (
                        <div>
                          <span className="text-slate-800 font-bold block mb-0.5">🎯 Рекомендуемое применение:</span>
                          <span>{type.bestFor}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
