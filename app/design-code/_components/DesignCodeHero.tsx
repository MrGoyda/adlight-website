// Server Component — нет хуков, DesignCodeHeroButtons изолирован как Client

import LinkNext from "next/link";
import Image from "next/image";
import { ChevronRight, BookOpen } from "lucide-react";
import DesignCodeHeroButtons from "@/components/DesignCodeHeroButtons";
import { DESIGN_CODE_TEXTS } from "@/dictionaries/design-code";
import FadeIn from "@/components/ui/FadeIn";

export default function DesignCodeHero() {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden border-b border-slate-100 bg-slate-50/50">
      <div className="absolute inset-0 bg-orange-50/5"></div>
      <div className="absolute top-0 right-0 w-1/2 h-full bg-orange-500/[0.02] blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
         <nav aria-label="Хлебные крошки">
           <ol 
             itemScope 
             itemType="https://schema.org/BreadcrumbList" 
             className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 mb-12"
           >
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <LinkNext itemProp="item" href="/" className="hover:text-slate-900 transition">
                  <span itemProp="name">{DESIGN_CODE_TEXTS.breadcrumbs.home}</span>
                </LinkNext>
                <meta itemProp="position" content="1" />
              </li>
              {/* Разделитель внутри li с aria-hidden — не нарушает семантику ol */}
              <li aria-hidden="true"><ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-slate-300"/></li>
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <LinkNext itemProp="item" href="/design-code">
                  <span itemProp="name" className="text-orange-600 font-medium">{DESIGN_CODE_TEXTS.breadcrumbs.current}</span>
                </LinkNext>
                <meta itemProp="position" content="2" />
              </li>
           </ol>
         </nav>

         <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* LEFT COLUMN: HERO CONTENT */}
            <div className="lg:col-span-7 space-y-6">
               <FadeIn direction="up" delay={100}>
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200/40 text-orange-600 text-xs font-bold uppercase tracking-wider">
                    <BookOpen className="w-4 h-4"/> {DESIGN_CODE_TEXTS.hero.badge}
                 </div>
               </FadeIn>
               
               <FadeIn direction="up" delay={200}>
                  {/* H1: содержит ключевые слова для SEO (Дизайн-код + Астана) */}
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-950 leading-tight tracking-tight">
                     {DESIGN_CODE_TEXTS.hero.titlePart1}{" "}
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-600 to-red-600">
                       {DESIGN_CODE_TEXTS.hero.titlePart2}
                     </span>
                  </h1>
                </FadeIn>
               
               <FadeIn direction="up" delay={300}>
                 <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl">
                    {DESIGN_CODE_TEXTS.hero.subtitle}
                 </p>
               </FadeIn>
               
               <FadeIn direction="up" delay={400}>
                 <DesignCodeHeroButtons />
               </FadeIn>
            </div>

            {/* RIGHT COLUMN: PRESTIGE BUILDING SPECIMEN CARD */}
            <div className="lg:col-span-5 relative w-full hidden lg:block">
               <div className="w-full opacity-0 animate-fade-in-left-fast">
                  <div className="relative bg-white border border-slate-200 p-4 rounded-[32px] shadow-[0_15px_40px_rgba(0,0,0,0.03)] transform hover:rotate-0 transition duration-500">
                     <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden relative border border-slate-100 bg-slate-100">
                        <Image
                           src="/images/pages/design-code-hero.jpg"
                           alt="Правильное оформление вывесок на фасаде здания по Дизайн-коду Астаны"
                           fill
                           priority
                           className="object-cover"
                           sizes="(max-width: 1024px) 100vw, 40vw"
                        />
                     </div>
                  </div>
               </div>
            </div>

         </div>
      </div>
    </section>
  );
}
