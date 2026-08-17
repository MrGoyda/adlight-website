"use client";

import React, { useRef, useEffect } from "react";
import { triggerHaptic } from "@/lib/haptics";
import { LeadStatus } from "@prisma/client";
import { STATUS_MAP } from "../../_data/leadsDictionary";

interface LeadsTabBarProps {
  activeTab: LeadStatus | "ALL";
  onTabChange: (status: LeadStatus | "ALL") => void;
  statusCounts: Record<string, number>;
  totalCount: number;
}

export default function LeadsTabBar({
  activeTab,
  onTabChange,
  statusCounts,
  totalCount,
}: LeadsTabBarProps) {
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  // Порядок табов: UNPROCESSED (Ждут ответа) -> NEW -> IN_PROGRESS -> ESTIMATE -> PROCESSED -> COMPLETED -> CANCELLED
  const statusTabs: (LeadStatus | "ALL")[] = [
    "ALL",
    LeadStatus.UNPROCESSED,
    LeadStatus.NEW,
    LeadStatus.IN_PROGRESS,
    LeadStatus.ESTIMATE,
    LeadStatus.PROCESSED,
    LeadStatus.COMPLETED,
    LeadStatus.CANCELLED,
  ];

  // Плавная авто-прокрутка к активному табу
  useEffect(() => {
    if (activeTabRef.current && tabsContainerRef.current) {
      const container = tabsContainerRef.current;
      const tab = activeTabRef.current;
      const scrollLeft = tab.offsetLeft - container.offsetWidth / 2 + tab.offsetWidth / 2;
      container.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
    }
  }, [activeTab]);

  return (
    <div
      ref={tabsContainerRef}
      className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 select-none scroll-smooth"
    >
      {statusTabs.map((tab) => {
        const isActive = activeTab === tab;
        const count = tab === "ALL" ? totalCount : statusCounts[tab] || 0;
        const label = tab === "ALL" ? "Все заявки" : STATUS_MAP[tab]?.label || tab;

        return (
          <button
            key={tab}
            ref={isActive ? activeTabRef : null}
            onClick={() => {
              triggerHaptic("light");
              onTabChange(tab);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer shadow-2xs ${
              isActive
                ? "bg-slate-900 text-white shadow-md shadow-slate-900/20"
                : "bg-white hover:bg-slate-50 text-slate-600 border border-slate-200"
            }`}
          >
            <span>{label}</span>
            <span
              className={`px-1.5 py-0.2 text-[10px] rounded-full font-black ${
                isActive
                  ? "bg-white/20 text-white"
                  : tab === LeadStatus.UNPROCESSED && count > 0
                  ? "bg-rose-100 text-rose-700 font-extrabold"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
