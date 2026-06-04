// app/services/lightboxes/_components/LightboxesCatalog.tsx

import Image from "next/image";
import { lightboxesDetails } from "@/dictionaries/services/details/lightboxes";

export default function LightboxesCatalog() {
  return (
    <section 
      id="catalog" 
      aria-labelledby="catalog-heading" 
      className="py-24 bg-white border-t border-slate-200/80"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-3">Виды коробов</span>
          <h2 
            id="catalog-heading" 
            className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight"
          >
            Каталог световых коробов: технологии производства и виды конструкций
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
            {lightboxesDetails.typesSubtitle}
          </p>
        </div>

        <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lightboxesDetails.types.map((type, i) => (
            <li 
              key={i} 
              itemScope 
              itemType="https://schema.org/Product"
              className="group flex flex-col rounded-3xl overflow-hidden border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-orange-500/30 cursor-default shadow-sm hover:shadow-md transition-all duration-300"
            >
              <article className="flex flex-col h-full">
                {/* Image Header */}
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
                    itemProp="image"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>

                {/* Card Body */}
                <div className="p-6 md:p-8 flex flex-col flex-grow">
                  <h3 
                    itemProp="name" 
                    className="text-xl font-bold text-slate-900 mb-3 group-hover:text-orange-600 transition-colors duration-300"
                  >
                    {type.title}
                  </h3>
                  <p 
                    itemProp="description" 
                    className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow"
                  >
                    {type.desc}
                  </p>

                  {/* AI & SEO Rich Metadata Details */}
                  {(type.specs || type.bestFor) && (
                    <div className="mt-auto pt-4 border-t border-slate-100/80 space-y-2.5">
                      {type.specs && (
                        <div className="text-xs text-slate-500">
                          <strong className="text-slate-700 font-semibold block mb-0.5">Технические параметры (Спецификация):</strong>
                          <span className="leading-relaxed">{type.specs}</span>
                        </div>
                      )}
                      {type.bestFor && (
                        <div className="text-xs text-slate-500">
                          <strong className="text-slate-700 font-semibold block mb-0.5">Рекомендуемая сфера применения:</strong>
                          <span className="leading-relaxed">{type.bestFor}</span>
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
