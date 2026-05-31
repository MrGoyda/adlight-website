// app/services/_components/ServicesGrid.tsx

import Image from "next/image";
import Link from "next/link";
import { Store, Zap, Building, Wrench, ArrowRight } from "lucide-react";
import { CATALOG_SERVICES } from "@/dictionaries/services/catalog-services";
import { SERVICES_CATALOG_UI } from "@/dictionaries/services/catalog-ui";
import PremiumCard from "@/components/ui/PremiumCard";

export default function ServicesGrid() {
  return (
    <div className="container mx-auto px-4 pb-24 bg-white">
       {CATALOG_SERVICES.map((group, idx) => (
          <div key={idx} id={group.id} className="mb-20 last:mb-0 scroll-mt-28">
             
             {/* Category Header */}
             <div className="flex items-center gap-3.5 mb-8 border-b border-slate-150 pb-5">
                <div className={`p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 ${group.color}`}>
                   {group.iconName === "Store" && <Store className="w-5 h-5"/>}
                   {group.iconName === "Zap" && <Zap className="w-5 h-5"/>}
                   {group.iconName === "Building" && <Building className="w-5 h-5"/>}
                   {group.iconName === "Wrench" && <Wrench className="w-5 h-5"/>}
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{group.category}</h2>
             </div>

             {/* Cards Grid */}
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {group.items.map((item, i) => (
                   <Link 
                      href={item.link} 
                      key={i}
                      className="group block relative"
                   >
                      <PremiumCard 
                         hoverEffect="lift"
                         className="flex flex-col justify-between p-5 bg-white border border-slate-200/80 hover:border-orange-500/20 shadow-sm hover:shadow-[0_20px_50px_rgba(15,23,42,0.065)] transition-all duration-500 w-full h-full min-h-[380px]"
                      >
                         <div>
                            {/* Image wrapper */}
                            <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden mb-5 bg-slate-50 border border-slate-100/80">
                               <Image 
                                  src={item.image} 
                                  fill
                                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                  className="object-cover rounded-2xl group-hover:scale-[1.03] transition-transform duration-700 ease-out" 
                                  alt={SERVICES_CATALOG_UI.grid.serviceAltTemplate.replace("{title}", item.title)}
                                  loading="lazy"
                               />
                               <div className="absolute inset-0 rounded-2xl border border-black/[0.03] pointer-events-none" />
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1.5 mb-4">
                               {item.tags.map((tag, t) => (
                                  <span key={t} className="px-2.5 py-1 rounded-lg bg-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-600 border border-slate-200/40 select-none">
                                     {tag}
                                  </span>
                               ))}
                            </div>

                            {/* Titles and Descriptions */}
                            <div className="space-y-2 mb-4">
                               <h3 className="text-xl font-black text-slate-950 group-hover:text-orange-600 transition-colors tracking-tight leading-tight">
                                  {item.title}
                               </h3>
                               <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-medium">
                                  {item.description}
                               </p>
                            </div>
                         </div>

                         {/* Price and action button */}
                         <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-4">
                            <span className="text-sm font-black text-slate-900">
                               {item.price}
                            </span>
                            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-600 group-hover:text-orange-700 transition-colors">
                               {SERVICES_CATALOG_UI.grid.moreBtn}
                               <div className="w-8 h-8 rounded-full border border-slate-100 bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-orange-500 group-hover:border-orange-500 transition-all duration-300">
                                  <ArrowRight className="w-4 h-4"/>
                               </div>
                            </div>
                         </div>
                      </PremiumCard>
                   </Link>
                ))}
             </div>
          </div>
       ))}
    </div>
  );
}
