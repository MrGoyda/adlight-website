"use client";

import React from "react";
import { Wallet, BarChart3, Target, Users } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { FINANCE_DICTIONARY } from "../_data/financeDictionary";

export type FinanceTabType = "TREASURY" | "ANALYTICS" | "PROJECTS" | "PARTNERS";

interface FinanceTabBarProps {
  activeTab: FinanceTabType;
  onChangeTab: (tab: FinanceTabType) => void;
}

const TABS = [
  { id: "TREASURY" as FinanceTabType, labelKey: "treasury" as const, icon: Wallet },
  { id: "ANALYTICS" as FinanceTabType, labelKey: "analytics" as const, icon: BarChart3 },
  { id: "PROJECTS" as FinanceTabType, labelKey: "projects" as const, icon: Target },
  { id: "PARTNERS" as FinanceTabType, labelKey: "partners" as const, icon: Users },
];

export default function FinanceTabBar({
  activeTab,
  onChangeTab,
}: FinanceTabBarProps) {
  const dict = FINANCE_DICTIONARY.tabs;

  return (
    <div className="bg-white rounded-3xl p-2 border border-slate-200/90 shadow-2xs">
      <div className="inline-flex bg-slate-100 p-1 rounded-2xl select-none max-w-full overflow-x-auto no-scrollbar w-full sm:w-auto">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                triggerHaptic("light");
                onChangeTab(tab.id);
              }}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap active:scale-98 touch-manipulation ${
                isActive
                  ? "bg-white text-slate-900 shadow-2xs font-extrabold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-orange-600" : "text-slate-400"}`} />
              <span>{dict[tab.labelKey]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
