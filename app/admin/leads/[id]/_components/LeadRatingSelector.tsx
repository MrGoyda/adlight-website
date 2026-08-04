"use client";

import React from "react";
import { ClientRating } from "@prisma/client";
import { RATING_CONFIG } from "./config";
import { crmDict } from "@/dictionaries/crm";

interface LeadRatingSelectorProps {
  currentRating: ClientRating;
  onSelectRating: (rating: ClientRating) => void;
}

export default function LeadRatingSelector({
  currentRating,
  onSelectRating,
}: LeadRatingSelectorProps) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
        {crmDict.leadDetail.ratingSectionTitle}
      </span>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {(Object.keys(RATING_CONFIG) as ClientRating[]).map((rKey) => {
          const cfg = RATING_CONFIG[rKey];
          const Icon = cfg.icon;
          const isCurrent = currentRating === rKey;
          return (
            <button
              key={rKey}
              type="button"
              onClick={() => onSelectRating(rKey)}
              className={`p-4 rounded-2xl border text-left transition flex items-start gap-3 cursor-pointer ${
                isCurrent
                  ? `${cfg.bg} ${cfg.border} ring-2 ring-orange-500/20 shadow-sm`
                  : "bg-slate-50/50 border-slate-200 hover:bg-slate-100/70"
              }`}
            >
              <div className={`p-2 rounded-xl ${isCurrent ? cfg.bg : "bg-white"} ${cfg.color} shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className={`text-xs font-extrabold ${isCurrent ? cfg.color : "text-slate-800"}`}>
                  {cfg.label}
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">{cfg.sub}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
