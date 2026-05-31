// app/services/_components/ServicesFAQ.tsx

"use client";

import { ChevronDown, Store, Coins, FileCheck, Wrench, HelpCircle } from "lucide-react";
import { SERVICES_CATALOG_UI } from "@/dictionaries/services/catalog-ui";

const IconMap = {
  Store,
  Coins,
  FileCheck,
  Wrench
};

function renderIcon(iconName: string, className = "w-5 h-5") {
  const IconComponent = IconMap[iconName as keyof typeof IconMap] || HelpCircle;
  return <IconComponent className={className} />;
}

export default function ServicesFAQ() {
  const faq = SERVICES_CATALOG_UI.faq;

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200/50">
       <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-left space-y-4 mb-12">
             <div className="inline-flex">
               <span className="px-3.5 py-1 text-xs font-black uppercase tracking-wider text-orange-600 bg-orange-50 border border-orange-200/50 rounded-full">
                 F.A.Q.
               </span>
             </div>
             <h2 className="text-3xl md:text-4xl font-black text-slate-950 tracking-tight leading-none">
                {faq.title}
             </h2>
             <p className="text-slate-600 text-sm sm:text-base font-medium">
                {faq.subtitle}
             </p>
          </div>

          <div className="space-y-4">
             {faq.items.map((item, index) => (
                <details 
                  key={index} 
                  className="group bg-white border border-slate-200/80 rounded-2xl overflow-hidden transition-all duration-300 open:border-orange-500/20 open:shadow-[0_15px_40px_rgba(15,23,42,0.04)]"
                >
                   <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-slate-50/50 transition select-none">
                      <div className="flex items-center gap-4">
                         <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-550 group-open:text-orange-600 group-open:bg-orange-50 group-open:border-orange-200/30 transition-colors duration-300">
                            {renderIcon(item.iconName)}
                         </div>
                         <span className="font-black text-slate-900 text-base sm:text-lg group-open:text-orange-600 transition-colors duration-300 pr-4">
                            {item.question}
                         </span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-150 flex items-center justify-center text-slate-400 group-open:rotate-180 group-open:text-orange-600 group-open:border-orange-500/30 transition-all duration-300 ml-4 shrink-0">
                         <ChevronDown className="w-4 h-4"/>
                      </div>
                   </summary>
                   <div className="px-6 pb-6 pl-[4.5rem] text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4 animate-in fade-in slide-in-from-top-2 duration-200 font-medium">
                      {item.answer}
                   </div>
                </details>
             ))}
          </div>
       </div>
    </section>
  );
}
