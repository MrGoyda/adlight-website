// components/DesignCodeTabs.tsx
// Данные вынесены в dictionaries/design-code.ts (паттерн словарей).
// WAI-ARIA Tabs Pattern. Все панели в DOM для SEO-индексации.
"use client";

import { useState } from "react";
import {
  Building, Layers, MapPin, Megaphone,
  Layout, Store, ArrowRight, Armchair, Info
} from "lucide-react";
import { motion, LayoutGroup } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  DESIGN_CODE_TABS_DATA,
  DESIGN_CODE_TABS_LIST,
  type DesignCodeTabId,
} from "@/dictionaries/design-code";

// --- IconMap: разрешает iconName → компонент Lucide ---
const IconMap: Record<string, React.ElementType> = {
  Building, Layers, MapPin, Megaphone,
  Layout, Store, ArrowRight, Armchair,
};

function TabIcon({ name }: { name: string }) {
  const Icon = IconMap[name] ?? Info;
  return <Icon className="w-6 h-6" aria-hidden="true" />;
}

export default function DesignCodeTabs() {
  const [activeTab, setActiveTab] = useState<DesignCodeTabId>("ads");

  return (
    <section
      className="py-24 bg-slate-50 border-y border-slate-200/60"
      aria-labelledby="tab-section-heading"
    >
      <div className="container mx-auto px-4">
        <h2
          id="tab-section-heading"
          className="text-3xl font-bold text-slate-950 mb-8 text-center tracking-tight"
        >
          Типы рекламных конструкций
        </h2>

        {/* TABLIST — WAI-ARIA Tabs Pattern */}
        <LayoutGroup>
          <div
            role="tablist"
            aria-label="Категории рекламных конструкций"
            className="flex justify-center gap-2 mb-12 overflow-x-auto hide-scrollbar p-1.5 bg-slate-100 rounded-full max-w-md mx-auto border border-slate-200/60"
          >
            {DESIGN_CODE_TABS_LIST.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "relative shrink-0 px-6 py-3 rounded-full font-bold text-sm transition-colors duration-200 select-none",
                    isActive ? "text-white" : "text-slate-600 hover:text-slate-950"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-full z-0 shadow-lg shadow-orange-500/15"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>

        {/*
          TABPANELS: все три панели в DOM для SEO.
          inactive: только "hidden" (без grid) — избегаем конфликта display:none vs display:grid
        */}
        {DESIGN_CODE_TABS_LIST.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <div
              key={tab.id}
              id={`panel-${tab.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${tab.id}`}
              className={isActive ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" : "hidden"}
            >
              {DESIGN_CODE_TABS_DATA[tab.id].map((item) => (
                <div
                  key={item.t}
                  className="bg-white p-6 rounded-2xl border border-slate-200/80 flex gap-4 items-start hover:border-orange-500/20 transition shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)]"
                >
                  <div className="p-3 bg-orange-50 rounded-xl text-orange-600 shrink-0">
                    <TabIcon name={item.iconName} />
                  </div>
                  <div>
                    <h3 className="text-slate-950 font-bold mb-1 text-base">{item.t}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}