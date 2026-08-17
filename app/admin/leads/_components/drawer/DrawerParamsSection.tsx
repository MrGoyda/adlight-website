"use client";

import React from "react";
import { UserCheck, ChevronDown, Calendar, CalendarCheck } from "lucide-react";
import { PartnerName } from "@prisma/client";
import { LEADS_DICTIONARY } from "../../_data/leadsDictionary";

interface DrawerParamsSectionProps {
  editName: string;
  setEditName: (val: string) => void;
  editPhone: string;
  setEditPhone: (val: string) => void;
  editManager: string;
  setEditManager: (val: string) => void;
  editAppDate: string;
  setEditAppDate: (val: string) => void;
  editDeadline: string;
  setEditDeadline: (val: string) => void;
}

export default function DrawerParamsSection({
  editName,
  setEditName,
  editPhone,
  setEditPhone,
  editManager,
  setEditManager,
  editAppDate,
  setEditAppDate,
  editDeadline,
  setEditDeadline,
}: DrawerParamsSectionProps) {
  const dict = LEADS_DICTIONARY.drawer;

  return (
    <div className="bg-slate-50/70 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 space-y-3.5">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
        Параметры клиента и сделки
      </span>

      {/* ФИО и Телефон */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] text-slate-500 font-bold mb-1">
            {dict.fioLabel}
          </label>
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:border-orange-500 outline-none text-xs shadow-2xs transition"
          />
        </div>

        <div>
          <label className="block text-[10px] text-slate-500 font-bold mb-1">
            {dict.phoneLabel}
          </label>
          <input
            type="text"
            value={editPhone}
            onChange={(e) => setEditPhone(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:border-orange-500 outline-none text-xs shadow-2xs transition"
          />
        </div>
      </div>

      {/* Даты встречи и сдачи */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] text-slate-500 font-bold mb-1 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-orange-500" />
            {dict.dateLabel}
          </label>
          <input
            type="datetime-local"
            value={editAppDate}
            onChange={(e) => setEditAppDate(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-slate-900 font-bold focus:border-orange-500 outline-none text-xs shadow-2xs transition"
          />
        </div>

        <div>
          <label className="block text-[10px] text-slate-500 font-bold mb-1 flex items-center gap-1">
            <CalendarCheck className="w-3 h-3 text-emerald-600" />
            {dict.deadlineLabel}
          </label>
          <input
            type="date"
            value={editDeadline}
            onChange={(e) => setEditDeadline(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-slate-900 font-bold focus:border-orange-500 outline-none text-xs shadow-2xs transition"
          />
        </div>
      </div>

      {/* Менеджер */}
      <div>
        <label className="block text-[10px] text-slate-500 font-bold mb-1">
          {dict.managerLabel}
        </label>
        <div className="relative">
          <select
            value={editManager || ""}
            onChange={(e) => setEditManager(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-8 py-2.5 text-slate-900 font-bold focus:border-orange-500 outline-none text-xs transition shadow-2xs appearance-none cursor-pointer"
          >
            <option value="">Не назначен</option>
            <option value={PartnerName.DANIIL}>Даниил</option>
            <option value={PartnerName.ELISEY}>Елисей</option>
          </select>
          <UserCheck className="w-4 h-4 text-orange-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
