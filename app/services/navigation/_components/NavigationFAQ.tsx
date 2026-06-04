// app/services/navigation/_components/NavigationFAQ.tsx

import { HelpCircle, ChevronDown, ShieldCheck, Repeat, PenTool } from "lucide-react";
import { navigationDetails } from "@/dictionaries/services/details/navigation";

const IconMap = {
  ShieldCheck,
  Repeat,
  PenTool,
};

function renderIcon(iconName: string, className = "w-5 h-5") {
  const IconComponent = IconMap[iconName as keyof typeof IconMap] || HelpCircle;
  return <IconComponent className={className} />;
}

export default function NavigationFAQ() {
  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200/80">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-3 font-semibold">
            Часто задаваемые вопросы
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Популярные вопросы о навигации
          </h2>
          <p className="text-slate-500">
            Всё, что нужно знать о материалах, способах крепления и проектировании табличек
          </p>
        </div>

        <div className="space-y-4">
          {navigationDetails.faqs.map((item, index) => (
            <details 
              key={index} 
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
              className="group bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300 open:border-orange-500/30 open:shadow-sm"
            >
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-slate-50/50 transition">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-100 rounded-lg group-open:bg-orange-50 group-open:text-orange-600 transition shrink-0">
                    {renderIcon(item.iconName, "w-5 h-5 text-orange-600")}
                  </div>
                  <span 
                    itemProp="name" 
                    className="font-bold text-slate-800 text-base md:text-lg group-open:text-orange-600 transition"
                  >
                    {item.question}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-open:rotate-180 transition ml-4 shrink-0">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </summary>
              <div 
                itemProp="acceptedAnswer"
                itemScope
                itemType="https://schema.org/Answer"
                className="px-6 pb-6 pl-[4.5rem] text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4 animate-in fade-in slide-in-from-top-2 duration-200"
              >
                <div itemProp="text">
                  {item.answer}
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
