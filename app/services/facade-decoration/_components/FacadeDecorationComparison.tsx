// app/services/facade-decoration/_components/FacadeDecorationComparison.tsx

import { Construction, Zap, CheckCircle, HelpCircle } from "lucide-react";
import { facade_decorationDetails } from "@/dictionaries/services/details/facade-decoration";

const IconMap = {
  Construction,
  Zap,
};

function renderIcon(iconName: string, className = "w-6 h-6") {
  const IconComponent = IconMap[iconName as keyof typeof IconMap] || HelpCircle;
  return <IconComponent className={className} />;
}

export default function FacadeDecorationComparison() {
  const { comparisonTitle, comparisonDesc, comparisonA, comparisonB } = facade_decorationDetails;

  return (
    <section id="comparison" className="py-24 bg-slate-50 border-t border-slate-200/80">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-3 font-semibold">Надежность и качество</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            {comparisonTitle}
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
            {comparisonDesc}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-stretch max-w-7xl mx-auto">
          {/* Сторона А - Композит */}
          <div className="bg-white p-8 md:p-10 rounded-3xl border border-orange-100 relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
            {comparisonA.badge && (
              <span className="absolute top-0 right-0 bg-orange-600 text-white text-[10px] font-bold px-3.5 py-1.5 rounded-bl-2xl uppercase tracking-wider">
                {comparisonA.badge}
              </span>
            )}
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3.5 bg-orange-50 rounded-2xl text-orange-600 border border-orange-100">
                {renderIcon(comparisonA.iconName || "Construction")}
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{comparisonA.title}</h3>
            </div>
            <ul className="space-y-4 text-slate-600">
              {comparisonA.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    <strong className="text-slate-800 font-semibold">{item.bold}</strong> {item.normal}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Сторона Б - Дешевые панели */}
          <div className="bg-white p-8 md:p-10 rounded-3xl border border-orange-100 relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3.5 bg-orange-50 rounded-2xl text-orange-600 border border-orange-100">
                {renderIcon(comparisonB.iconName || "Zap")}
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{comparisonB.title}</h3>
            </div>
            <ul className="space-y-4 text-slate-600">
              {comparisonB.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full border border-red-500/50 flex items-center justify-center text-red-500 text-xs shrink-0 font-bold mt-0.5">✕</div>
                  <span className="leading-relaxed text-slate-500">
                    <strong className="text-slate-700 font-semibold">{item.bold}</strong> {item.normal}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
