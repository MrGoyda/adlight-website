// Server Component — нет хуков/браузерных API

import { CheckCircle, Info, MapPin, Layout, Ruler } from "lucide-react";
import Card from "@/components/ui/Card";
import Typography from "@/components/ui/Typography";
import FadeIn from "@/components/ui/FadeIn";
import { DESIGN_CODE_RULES, DESIGN_CODE_TEXTS } from "@/dictionaries/design-code";

const IconMap = {
  MapPin,
  Layout,
  Ruler
};

function renderIcon(iconName: string, className = "w-7 h-7") {
  const IconComponent = IconMap[iconName as keyof typeof IconMap] || Info;
  return <IconComponent className={className} />;
}

export default function DesignCodeRules() {
  return (
    <section
      id="rules"
      className="py-24 bg-slate-50 border-b border-slate-100 scroll-mt-20"
      aria-labelledby="rules-heading"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <FadeIn direction="up">
            <h2 id="rules-heading" className="text-3xl md:text-4xl font-bold text-slate-950 mb-4 tracking-tight">
              {DESIGN_CODE_TEXTS.rules.title}
            </h2>
          </FadeIn>
          <FadeIn direction="up" delay={100}>
            <p className="text-slate-600">{DESIGN_CODE_TEXTS.rules.subtitle}</p>
          </FadeIn>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {DESIGN_CODE_RULES.map((rule, idx) => (
            <FadeIn key={rule.id} direction="up" delay={idx * 100}>
              <Card hover className="p-8 bg-white border border-slate-200/60 transition-all duration-300 hover:y-[-4px] shadow-[0_8px_30px_rgba(0,0,0,0.01)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.03)] rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition">
                  {renderIcon(rule.iconName, "w-20 h-20 text-orange-600")}
                </div>
                
                <div className="inline-block px-3.5 py-1 bg-orange-50 text-orange-600 rounded-full text-xs font-bold mb-6 tracking-wide border border-orange-200/30">
                  {rule.badge}
                </div>
                
                <Typography variant="h3" className="mb-6 text-xl tracking-tight text-slate-950 font-bold">
                  {rule.title}
                </Typography>
                
                <ul className="space-y-4 relative z-10">
                  {rule.items.map((item, idx) => {
                    const isBold = item.includes(":");
                    const parts = isBold ? item.split(":") : [item];
                    return (
                      <li key={`${rule.id}-${idx}`} className="flex gap-3">
                        <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5"/>
                        <span className="text-slate-600 text-sm leading-relaxed">
                          {isBold ? (
                            <><strong>{parts[0]}:</strong>{parts[1]}</>
                          ) : (
                            item
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
