// app/services/entrance-groups/_components/EntranceComparison.tsx
"use client";

import { Layers, Store, CheckCircle, HelpCircle } from "lucide-react";
import { entrance_groupsDetails } from "@/dictionaries/services/details/entrance-groups";

const IconMap = {
  Layers,
  Store,
};

function renderIcon(iconName: string, className = "w-6 h-6") {
  const IconComponent = IconMap[iconName as keyof typeof IconMap] || HelpCircle;
  return <IconComponent className={className} />;
}

export default function EntranceComparison() {
  return (
    <section id="comparison" className="py-24 bg-slate-50 border-t border-slate-200/80">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-3 font-semibold">
            Материалы облицовки
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            {entrance_groupsDetails.comparisonTitle}
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
            {entrance_groupsDetails.comparisonDesc}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {/* Блок А (Алюминиевый композит) */}
          <div className="bg-white p-8 md:p-10 rounded-3xl border border-orange-100 relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
            {entrance_groupsDetails.comparisonA.badge && (
              <span className="absolute top-0 right-0 bg-orange-600 text-white text-[10px] font-bold px-3.5 py-1.5 rounded-bl-2xl uppercase tracking-wider">
                {entrance_groupsDetails.comparisonA.badge}
              </span>
            )}
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3.5 bg-orange-50 rounded-2xl text-orange-600 border border-orange-100 shrink-0">
                {renderIcon(entrance_groupsDetails.comparisonA.iconName || "Layers", "w-6 h-6 text-orange-600")}
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{entrance_groupsDetails.comparisonA.title}</h3>
            </div>
            <ul className="space-y-4 text-slate-600 text-sm md:text-base">
              {entrance_groupsDetails.comparisonA.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    <strong className="text-slate-800 font-bold">{item.bold}</strong> {item.normal}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Блок Б (HPL-панели / Эко-дерево) */}
          <div className="bg-white p-8 md:p-10 rounded-3xl border border-orange-100 relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3.5 bg-orange-50 rounded-2xl text-orange-600 border border-orange-100 shrink-0">
                {renderIcon(entrance_groupsDetails.comparisonB.iconName || "Store", "w-6 h-6 text-orange-600")}
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{entrance_groupsDetails.comparisonB.title}</h3>
            </div>
            <ul className="space-y-4 text-slate-600 text-sm md:text-base">
              {entrance_groupsDetails.comparisonB.items.map((item, idx) => (
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
