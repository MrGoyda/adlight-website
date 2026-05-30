import Image from "next/image";
import Link from "next/link";
import { Store, Zap, Building, ArrowRight } from "lucide-react";
import { CATALOG_SERVICES } from "@/dictionaries/services/catalog-services";
import Card from "@/components/ui/Card";
import Typography from "@/components/ui/Typography";

export default function ServicesGrid() {
  return (
    <div className="container mx-auto px-4 pb-24">
       {CATALOG_SERVICES.map((group, idx) => (
          <div key={idx} id={group.id} className="mb-16 last:mb-0 scroll-mt-24">
             
             {/* Заголовок группы */}
             <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                <div className={`p-2 rounded-lg bg-white/5 ${group.color}`}>
                   {group.iconName === "Store" && <Store className="w-5 h-5"/>}
                   {group.iconName === "Zap" && <Zap className="w-5 h-5"/>}
                   {group.iconName === "Building" && <Building className="w-5 h-5"/>}
                </div>
                <Typography variant="h2" className="text-2xl font-bold text-white">{group.category}</Typography>
             </div>

             {/* Сетка карточек */}
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.items.map((item, i) => (
                   <Link 
                      href={item.link} 
                      key={i}
                      className="group block relative h-[280px]"
                   >
                      <Card 
                         hover 
                         rounded="2xl" 
                         className="w-full h-full border border-white/10 hover:border-orange-500/50 bg-[#0B1221]"
                      >
                         <div className="absolute inset-0">
                             <Image 
                                src={item.image} 
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-cover opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700" 
                                alt={`Заказать ${item.title} в Астане - пример работы ADLight`}
                             />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/60 to-transparent"></div>
                         </div>

                         <div className="absolute inset-0 p-6 flex flex-col justify-between z-20">
                            <div className="flex flex-wrap gap-2">
                               {item.tags.map((tag, t) => (
                                  <span key={t} className="px-2 py-1 rounded-md bg-white/10 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-white/90 border border-white/5">
                                     {tag}
                                  </span>
                               ))}
                            </div>
                            <div>
                               <Typography variant="h3" className="text-xl font-bold text-white mb-1 group-hover:text-orange-400 transition-colors">
                                  {item.title}
                               </Typography>
                               <div className="flex items-center justify-between mt-2">
                                  <span className="text-gray-400 text-sm font-medium">{item.price}</span>
                                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-orange-500 transition-colors">
                                     <ArrowRight className="w-4 h-4"/>
                                  </div>
                               </div>
                            </div>
                         </div>
                      </Card>
                   </Link>
                ))}
             </div>
          </div>
       ))}
    </div>
  );
}
