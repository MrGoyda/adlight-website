// app/services/roof-installations/_components/RoofComparison.tsx
"use client";

import { FileText, Zap, CheckCircle, HelpCircle } from "lucide-react";
import { roof_installationsDetails } from "@/dictionaries/services/details/roof-installations";

const IconMap = {
  FileText,
  Zap,
};

function renderIcon(iconName: string, className = "w-6 h-6") {
  const IconComponent = IconMap[iconName as keyof typeof IconMap] || HelpCircle;
  return <IconComponent className={className} />;
}

export default function RoofComparison() {
  return (
    <section id="comparison" className="py-24 bg-slate-50 border-t border-slate-200/80">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-3 font-semibold">
            Инженерия и безопасность
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            {roof_installationsDetails.comparisonTitle}
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
            {roof_installationsDetails.comparisonDesc}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {/* Блок А (Проектные расчеты) */}
          <div className="bg-white p-8 md:p-10 rounded-3xl border border-orange-100 relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
            {roof_installationsDetails.comparisonA.badge && (
              <span className="absolute top-0 right-0 bg-orange-600 text-white text-[10px] font-bold px-3.5 py-1.5 rounded-bl-2xl uppercase tracking-wider">
                {roof_installationsDetails.comparisonA.badge}
              </span>
            )}
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3.5 bg-orange-50 rounded-2xl text-orange-600 border border-orange-100 shrink-0">
                {renderIcon(roof_installationsDetails.comparisonA.iconName || "FileText", "w-6 h-6 text-orange-600")}
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{roof_installationsDetails.comparisonA.title}</h3>
            </div>
            <ul className="space-y-4 text-slate-600 text-sm md:text-base">
              {roof_installationsDetails.comparisonA.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    <strong className="text-slate-800 font-bold">{item.bold}</strong> {item.normal}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Блок Б (Электробезопасность) */}
          <div className="bg-white p-8 md:p-10 rounded-3xl border border-orange-100 relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3.5 bg-orange-50 rounded-2xl text-orange-600 border border-orange-100 shrink-0">
                {renderIcon(roof_installationsDetails.comparisonB.iconName || "Zap", "w-6 h-6 text-orange-600")}
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{roof_installationsDetails.comparisonB.title}</h3>
            </div>
            <ul className="space-y-4 text-slate-600 text-sm md:text-base">
              {roof_installationsDetails.comparisonB.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    <strong className="text-slate-850 font-bold text-slate-800">{item.bold}</strong> {item.normal}
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
