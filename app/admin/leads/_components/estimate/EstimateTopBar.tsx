"use client";

import React from "react";
import { EstimateItemType } from "@prisma/client";
import { ITEM_TYPE_LABELS } from "./constants";
import { Plus } from "lucide-react";

interface EstimateTopBarProps {
  onAddItem: (type: EstimateItemType) => void;
}

export const EstimateTopBar: React.FC<EstimateTopBarProps> = ({ onAddItem }) => {
  return (
    <div className="shrink-0 p-3 sm:px-6 bg-slate-50/90 border-b border-slate-200/80 shadow-2xs backdrop-blur-xs z-10">
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        <span className="text-[10px] font-black uppercase text-slate-400 mr-1 shrink-0 hidden sm:inline">
          Добавить:
        </span>
        {(Object.keys(ITEM_TYPE_LABELS) as EstimateItemType[]).map((type) => {
          const config = ITEM_TYPE_LABELS[type];
          const Icon = config.icon;
          return (
            <button
              key={type}
              type="button"
              onClick={() => onAddItem(type)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border transition cursor-pointer active:scale-95 shadow-2xs shrink-0 ${config.color}`}
            >
              <Plus className="w-3.5 h-3.5" />
              <Icon className="w-3.5 h-3.5" />
              <span>{config.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
