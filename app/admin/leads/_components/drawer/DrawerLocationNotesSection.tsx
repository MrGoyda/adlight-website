"use client";

import React from "react";
import { MapPin, MessageSquare, ExternalLink, Calculator } from "lucide-react";
import { Lead } from "../../_types/leadTypes";
import { LEADS_DICTIONARY } from "../../_data/leadsDictionary";
import AutoResizeTextarea from "@/components/ui/AutoResizeTextarea";

interface DrawerLocationNotesSectionProps {
  activeLead: Lead;
  editAddress: string;
  setEditAddress: (val: string) => void;
  editComment: string;
  setEditComment: (val: string) => void;
}

export default function DrawerLocationNotesSection({
  activeLead,
  editAddress,
  setEditAddress,
  editComment,
  setEditComment,
}: DrawerLocationNotesSectionProps) {
  const dict = LEADS_DICTIONARY.drawer;

  return (
    <div className="bg-slate-50/70 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 space-y-3.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-orange-500" />
          Локация и Заметки
        </span>

        {editAddress && (
          <a
            href={`https://2gis.kz/astana/search/${encodeURIComponent(editAddress)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-bold text-orange-600 hover:underline flex items-center gap-1"
          >
            <span>2GIS Карта</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      {/* Адрес */}
      <div>
        <label className="block text-[10px] text-slate-500 font-bold mb-1">
          {dict.addressLabel}
        </label>
        <input
          type="text"
          value={editAddress}
          onChange={(e) => setEditAddress(e.target.value)}
          placeholder="г. Астана, ул. Достык 1..."
          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:border-orange-500 outline-none text-xs shadow-2xs transition"
        />
      </div>

      {/* Заметка менеджера с автоматическим расширением */}
      <div>
        <label className="block text-[10px] text-slate-500 font-bold mb-1 flex items-center gap-1">
          <MessageSquare className="w-3 h-3 text-amber-500" />
          {dict.commentLabel}
        </label>
        <AutoResizeTextarea
          rows={2}
          value={editComment}
          onChange={(e) => setEditComment(e.target.value)}
          placeholder="Укажите важные детали сделки..."
          className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium focus:border-orange-500 outline-none text-xs shadow-2xs transition-all"
        />
      </div>

      {/* Первичный запрос с сайта */}
      {activeLead.message && (
        <div className="bg-orange-50/50 p-3 rounded-xl border border-orange-200/60 w-full min-w-0 max-w-full overflow-hidden">
          <span className="block text-[10px] font-extrabold text-orange-700 uppercase tracking-wider mb-1">
            {dict.initialRequestLabel}
          </span>
          <p className="text-xs text-slate-700 leading-relaxed break-words break-all [overflow-wrap:anywhere] whitespace-pre-wrap max-w-full">
            {activeLead.message}
          </p>
        </div>
      )}
    </div>
  );
}
