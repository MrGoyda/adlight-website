// app/services/_components/ServicesHero.tsx

import Image from "next/image";
import Link from "next/link";
import { Store, Zap, Building, ChevronRight, Wrench } from "lucide-react";
import { SERVICES_CATALOG_UI } from "@/dictionaries/services/catalog-ui";
import { getCdnUrl } from "@/lib/serverUtils";

export default function ServicesHero() {
  const t = SERVICES_CATALOG_UI.hero;
  
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-[#FAF9F6] border-b border-slate-200/60">
      {/* Light slate grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:24px_24px] opacity-75"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FAF9F6]/80 to-[#FAF9F6]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
         {/* BREADCRUMBS */}
         <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-8 select-none">
            <Link href="/" className="hover:text-slate-900 transition-colors font-medium">
              {SERVICES_CATALOG_UI.breadcrumbs.home}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0"/>
            <span className="text-slate-400 font-medium">
              {SERVICES_CATALOG_UI.breadcrumbs.services}
            </span>
         </div>

         <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text details */}
            <div className="max-w-2xl relative z-20">
                <div className="inline-flex mb-5">
                  <span className="px-3.5 py-1 text-xs font-black uppercase tracking-wider text-orange-600 bg-orange-50 border border-orange-200/50 rounded-full select-none shadow-[0_2px_8px_rgba(249,115,22,0.04)]">
                    {t.badge}
                  </span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl md:text-6.5xl font-black text-slate-950 mb-8 leading-[0.95] tracking-tight">
                   {t.titlePart1} <br/>
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-600 to-red-600">
                      {t.titleAccent}
                   </span>
                </h1>
                
                <p className="text-slate-700 text-lg md:text-xl mb-12 leading-relaxed border-l-2 border-orange-500/30 pl-6 font-medium">
                   {t.subtitle}
                </p>
                
                {/* Navigation anchors */}
                <div className="flex flex-wrap gap-3">
                    <a href="#facade" className="group px-5 py-3.5 rounded-2xl bg-white border border-slate-200/80 hover:bg-slate-50 hover:border-orange-500/30 transition-all duration-300 flex items-center gap-3 text-slate-800 text-sm sm:text-base shadow-sm hover:shadow-md">
                       <div className="p-1.5 bg-orange-50 rounded-xl text-orange-600 group-hover:text-white group-hover:bg-orange-500 transition-colors duration-300">
                          <Store className="w-4 h-4"/>
                       </div>
                       <span className="font-black text-slate-900 uppercase tracking-wider text-xs">{t.anchors.facade}</span>
                    </a>
                    <a href="#interior" className="group px-5 py-3.5 rounded-2xl bg-white border border-slate-200/80 hover:bg-slate-50 hover:border-purple-500/30 transition-all duration-300 flex items-center gap-3 text-slate-800 text-sm sm:text-base shadow-sm hover:shadow-md">
                       <div className="p-1.5 bg-purple-50 rounded-xl text-purple-600 group-hover:text-white group-hover:bg-purple-500 transition-colors duration-300">
                          <Zap className="w-4 h-4"/>
                       </div>
                       <span className="font-black text-slate-900 uppercase tracking-wider text-xs">{t.anchors.interior}</span>
                    </a>
                    <a href="#scale" className="group px-5 py-3.5 rounded-2xl bg-white border border-slate-200/80 hover:bg-slate-50 hover:border-blue-500/30 transition-all duration-300 flex items-center gap-3 text-slate-800 text-sm sm:text-base shadow-sm hover:shadow-md">
                       <div className="p-1.5 bg-blue-50 rounded-xl text-blue-600 group-hover:text-white group-hover:bg-blue-500 transition-colors duration-300">
                          <Building className="w-4 h-4"/>
                       </div>
                       <span className="font-black text-slate-900 uppercase tracking-wider text-xs">{t.anchors.scale}</span>
                    </a>
                    <a href="#service" className="group px-5 py-3.5 rounded-2xl bg-white border border-slate-200/80 hover:bg-slate-50 hover:border-green-500/30 transition-all duration-300 flex items-center gap-3 text-slate-800 text-sm sm:text-base shadow-sm hover:shadow-md">
                       <div className="p-1.5 bg-green-50 rounded-xl text-green-600 group-hover:text-white group-hover:bg-green-500 transition-colors duration-300">
                          <Wrench className="w-4 h-4"/>
                       </div>
                       <span className="font-black text-slate-900 uppercase tracking-wider text-xs">{t.anchors.service}</span>
                    </a>
                </div>
            </div>

            {/* Premium visual image */}
            <div className="hidden lg:flex relative h-[500px] w-full items-center justify-center">
                <div className="absolute inset-0 bg-orange-500/5 blur-[100px] rounded-full pointer-events-none"></div>
                <Image 
                  src={getCdnUrl("/images/pages/services-hero.webp")} 
                  alt={t.heroAlt}
                  width={600}
                  height={500}
                  priority
                  className="relative w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.06)] z-10 select-none pointer-events-none"
                />
            </div>
         </div>
      </div>
    </section>
  );
}
