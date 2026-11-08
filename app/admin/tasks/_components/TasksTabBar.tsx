"use client";

import React from "react";
import { Sun, Kanban, Calendar, Plus } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { TasksViewMode } from "../_types/taskTypes";
import { TASKS_DICTIONARY } from "../_data/tasksDictionary";

interface TasksTabBarProps {
  currentTab: TasksViewMode;
  onChangeTab: (tab: TasksViewMode) => void;
  onOpenCreate: () => void;
}

const TABS: { id: TasksViewMode; labelKey: "agenda" | "kanban" | "calendar"; icon: any }[] = [
  { id: "AGENDA", labelKey: "agenda", icon: Sun },
  { id: "KANBAN", labelKey: "kanban", icon: Kanban },
  { id: "CALENDAR", labelKey: "calendar", icon: Calendar },
];

export default function TasksTabBar({
  currentTab,
  onChangeTab,
  onOpenCreate,
}: TasksTabBarProps) {
  const dict = TASKS_DICTIONARY.tabs;

  return (
    <div className="bg-white rounded-3xl p-3 sm:p-4 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
      {/* Сегментированный переключатель */}
      <div className="inline-flex bg-slate-100 p-1 rounded-2xl select-none max-w-full overflow-x-auto no-scrollbar w-full sm:w-auto">
        {TABS.map((tab) => {
          const isActive = currentTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                triggerHaptic("light");
                onChangeTab(tab.id);
              }}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap active:scale-98 touch-manipulation ${
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

      {/* Кнопка создания новой задачи */}
      <button
        type="button"
        onClick={() => {
          triggerHaptic("medium");
          onOpenCreate();
        }}
        className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs shadow-md shadow-orange-600/25 active:scale-95 transition cursor-pointer touch-manipulation"
      >
        <Plus className="w-4 h-4 stroke-[3]" />
        <span>{TASKS_DICTIONARY.header.createBtn}</span>
      </button>
    </div>
  );
}
