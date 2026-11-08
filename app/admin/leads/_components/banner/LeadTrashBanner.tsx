"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { LEADS_DICTIONARY } from "../../_data/leadsDictionary";

interface LeadTrashBannerProps {
  trashCount: number;
  onEmptyTrash: () => void;
}

export default function LeadTrashBanner({
  trashCount,
  onEmptyTrash,
}: LeadTrashBannerProps) {
  const dict = LEADS_DICTIONARY.trash;

  return (
    <div className="bg-rose-50/70 border border-rose-200 rounded-3xl p-4 flex items-center justify-between gap-4 flex-wrap animate-in fade-in duration-200">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
          <Trash2 className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-black text-slate-900">
            {dict.title} ({trashCount})
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            {dict.subtitle}
          </p>
        </div>
      </div>

      {trashCount > 0 && (
        <button
          type="button"
          onClick={() => {
            if (confirm(dict.confirmEmptyText)) {
              triggerHaptic("warning");
              onEmptyTrash();
            }
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-xs transition active:scale-95 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{dict.emptyTrashBtn}</span>
        </button>
      )}
    </div>
  );
}
