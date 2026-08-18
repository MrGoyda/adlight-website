"use client";

import React from "react";
import { DETAIL_TABS, DetailTabType } from "../../_data/leadDetailDictionary";
import { triggerHaptic } from "@/lib/haptics";

interface LeadDetailTabsProps {
  activeTab: DetailTabType;
  onChangeTab: (tab: DetailTabType) => void;
  filesCount?: number;
  activitiesCount?: number;
}

export default function LeadDetailTabs({
  activeTab,
  onChangeTab,
  filesCount = 0,
  activitiesCount = 0,
}: LeadDetailTabsProps) {
  return (
    <div className="px-3 sm:px-6 pt-3 pb-2 bg-slate-50/90 border-b border-slate-200/80 sticky top-[57px] sm:top-[65px] z-20 backdrop-blur-md">
      <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-2xl overflow-x-auto no-scrollbar shadow-inner">
        {DETAIL_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const badgeCount =
            tab.id === "files" && filesCount > 0
              ? filesCount
              : tab.id === "timeline" && activitiesCount > 0
              ? activitiesCount
              : null;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                triggerHaptic("light");
                onChangeTab(tab.id);
              }}
              className={`flex-1 min-w-max py-2 px-3 sm:px-4 rounded-xl font-black text-xs transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5 active:scale-98 select-none ${
                isActive
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200/60"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {badgeCount !== null && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    isActive ? "bg-orange-100 text-orange-700" : "bg-slate-300 text-slate-700"
                  }`}
                >
                  {badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
