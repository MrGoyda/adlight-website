// app/contacts/_components/ContactsHeader.tsx

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import BlueprintGrid from "@/components/ui/BlueprintGrid";
import { CONTACTS_DICT } from "@/dictionaries/contacts";

export default function ContactsHeader() {
  const dict = CONTACTS_DICT.header;

  return (
    <section className="relative pt-36 pb-16 overflow-hidden border-b border-slate-200 bg-white">
      {/* Инженерная сетка на фоне для премиального стиля */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
        <BlueprintGrid />
      </div>
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-orange-500/[0.04] to-transparent blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
         {/* Хлебные крошки с микроразметкой семантики */}
         <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-slate-900 transition-colors">{dict.breadcrumbHome}</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300"/>
            <span className="text-orange-600 font-extrabold">{dict.breadcrumbCurrent}</span>
         </nav>
         <FadeIn direction="up" delay={0.1}>
           <h1 className="text-4xl md:text-6xl font-black text-slate-955 tracking-tight mb-6 leading-none">
             {dict.title}
           </h1>
         </FadeIn>
         
         <FadeIn direction="up" delay={0.2}>
           <p className="text-slate-500 text-lg max-w-2xl leading-relaxed">
             {dict.description}
           </p>
         </FadeIn>
      </div>
    </section>
  );
}
