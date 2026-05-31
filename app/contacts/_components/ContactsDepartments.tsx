// app/contacts/_components/ContactsDepartments.tsx

import Link from "next/link";
import { Users, HardHat, FileText, ChevronRight } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import BlueprintGrid from "@/components/ui/BlueprintGrid";
import { COMPANY_NAP } from "@/dictionaries/common";
import { CONTACTS_DICT } from "@/dictionaries/contacts";

export default function ContactsDepartments() {
  const dict = CONTACTS_DICT.departments;

  return (
    <section className="py-16 bg-white border-y border-slate-200/60 relative overflow-hidden">
       <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
         <BlueprintGrid />
       </div>
       <div className="container mx-auto px-4 relative z-10">
          <FadeIn direction="up">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-955 tracking-tight mb-8">{dict.title}</h2>
          </FadeIn>
          
          <div className="grid md:grid-cols-3 gap-6">
             {/* Продажи */}
             <FadeIn direction="up" delay={0.1}>
               <div className="flex items-start gap-4 p-6 bg-slate-50/50 rounded-2xl border border-slate-200/80 hover:border-orange-500/30 transition-colors h-full">
                  <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-700 shrink-0 shadow-sm"><Users className="w-6 h-6 text-orange-500"/></div>
                  <div>
                     <h3 className="text-slate-955 font-black mb-1 text-base">{dict.sales.title}</h3>
                     <p className="text-slate-700 text-sm mb-4 leading-relaxed font-semibold">{dict.sales.description}</p>
                     <Link href={`tel:${COMPANY_NAP.phoneRaw}`} className="text-orange-600 text-xs font-black uppercase tracking-wider hover:text-orange-700 inline-flex items-center gap-1.5 transition-colors">
                       {dict.sales.linkText} <ChevronRight className="w-3.5 h-3.5"/>
                     </Link>
                  </div>
               </div>
             </FadeIn>
             
             {/* Производство */}
             <FadeIn direction="up" delay={0.2}>
               <div className="flex items-start gap-4 p-6 bg-slate-50/50 rounded-2xl border border-slate-200/80 hover:border-orange-500/30 transition-colors h-full">
                  <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-700 shrink-0 shadow-sm"><HardHat className="w-6 h-6 text-purple-500"/></div>
                  <div>
                     <h3 className="text-slate-955 font-black mb-1 text-base">{dict.production.title}</h3>
                     <p className="text-slate-700 text-sm mb-4 leading-relaxed font-semibold">{dict.production.description}</p>
                     <Link href={COMPANY_NAP.socials.whatsapp} target="_blank" className="text-orange-600 text-xs font-black uppercase tracking-wider hover:text-orange-700 inline-flex items-center gap-1.5 transition-colors">
                       {dict.production.linkText} <ChevronRight className="w-3.5 h-3.5"/>
                     </Link>
                  </div>
               </div>
             </FadeIn>

             {/* Бухгалтерия */}
             <FadeIn direction="up" delay={0.3}>
               <div className="flex items-start gap-4 p-6 bg-slate-50/50 rounded-2xl border border-slate-200/80 hover:border-orange-500/30 transition-colors h-full">
                  <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-700 shrink-0 shadow-sm"><FileText className="w-6 h-6 text-pink-500"/></div>
                  <div>
                     <h3 className="text-slate-955 font-black mb-1 text-base">{dict.accounting.title}</h3>
                     <p className="text-slate-700 text-sm mb-4 leading-relaxed font-semibold">{dict.accounting.description}</p>
                     <Link href={`mailto:${COMPANY_NAP.emailPersonal}`} className="text-orange-600 text-xs font-black uppercase tracking-wider hover:text-orange-700 inline-flex items-center gap-1.5 transition-colors">
                       {dict.accounting.linkText} <ChevronRight className="w-3.5 h-3.5"/>
                     </Link>
                  </div>
               </div>
             </FadeIn>
          </div>
       </div>
    </section>
  );
}
