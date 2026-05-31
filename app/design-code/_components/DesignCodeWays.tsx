// Server Component — нет хуков/браузерных API

import { CheckCircle, Clock, Info, Languages, FileText, Copyright } from "lucide-react";
import Card from "@/components/ui/Card";
import Typography from "@/components/ui/Typography";
import FadeIn from "@/components/ui/FadeIn";
import { DESIGN_CODE_WAYS, DESIGN_CODE_TEXTS } from "@/dictionaries/design-code";

const IconMap = {
  Languages,
  FileText,
  Copyright
};

function renderIcon(iconName: string, className = "w-7 h-7") {
  const IconComponent = IconMap[iconName as keyof typeof IconMap] || Info;
  return <IconComponent className={className} />;
}

export default function DesignCodeWays() {
  return (
    <section id="check" className="py-24 bg-white scroll-mt-20 border-b border-slate-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <FadeIn direction="up">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-950 mb-4 tracking-tight">
              {DESIGN_CODE_TEXTS.ways.title}
            </h2>
          </FadeIn>
          <FadeIn direction="up" delay={100}>
            <p className="text-slate-600 max-w-2xl mx-auto">
              {DESIGN_CODE_TEXTS.ways.subtitle}
            </p>
          </FadeIn>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {DESIGN_CODE_WAYS.map((way, idx) => (
            <FadeIn key={way.title} direction="up" delay={idx * 100}>
              <Card hover className="p-8 border border-slate-200/60 bg-white transition-all duration-300 hover:y-[-4px] shadow-[0_8px_30px_rgba(0,0,0,0.01)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.03)] rounded-3xl">
                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 text-orange-600">
                  {renderIcon(way.iconName, "w-7 h-7")}
                </div>
                <Typography variant="h3" className="mb-4 text-xl tracking-tight text-slate-950 font-bold">
                  {way.title}
                </Typography>
                <Typography variant="body" className="mb-6 min-h-[60px] text-slate-600">
                  {way.desc}
                </Typography>
                {/* example отдельным элементом — убран br из p */}
                <p className="mb-6 text-slate-400 text-xs font-medium">{way.example}</p>
                <div className="pt-6 border-t border-slate-100">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-900 font-bold flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-orange-600"/> 
                      {way.badge}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-3 text-xs text-slate-400 font-mono font-medium">
                    <Clock className="w-4 h-4"/> 
                    {way.term}
                  </div>
                </div>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
