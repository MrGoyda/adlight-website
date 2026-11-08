"use client";

import React from "react";
import { Clock, Archive } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { LEADS_DICTIONARY } from "../../_data/leadsDictionary";

interface LeadStaleBannerProps {
  staleCount: number;
  onArchiveStale: () => void;
}

export default function LeadStaleBanner({
  staleCount,
  onArchiveStale,
}: LeadStaleBannerProps) {
  if (staleCount <= 0) return null;

  const dict = LEADS_DICTIONARY.bulkActions;

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg border border-slate-800 animate-in fade-in duration-200">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-sm font-black text-white">
            {dict.staleBannerTitle} ({staleCount})
          </h3>
          <p className="text-xs text-slate-300 font-medium mt-0.5">
            {dict.staleBannerDesc}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
        <button
          type="button"
          onClick={() => {
            triggerHaptic("medium");
            onArchiveStale();
          }}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-black text-xs shadow-md shadow-orange-600/30 transition active:scale-95 cursor-pointer"
        >
          <Archive className="w-4 h-4" />
          <span>{dict.archiveStaleBtn}</span>
        </button>
      </div>
    </div>
  );
}
