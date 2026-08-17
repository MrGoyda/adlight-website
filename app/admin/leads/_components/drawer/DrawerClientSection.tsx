"use client";

import React, { useState } from "react";
import { UserCheck, Sparkles, AlertCircle, Search, UserPlus, ExternalLink, Link as LinkIcon } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { Lead, Client } from "../../_types/leadTypes";
import { LEADS_DICTIONARY } from "../../_data/leadsDictionary";

interface DrawerClientSectionProps {
  activeLead: Lead;
  clients: Client[];
  onLinkLeadToClient: (leadId: string, clientId: string | null) => void;
  onCreateClientFromLead: (lead: Lead) => void;
  onOpenClientsPage: () => void;
}

export default function DrawerClientSection({
  activeLead,
  clients,
  onLinkLeadToClient,
  onCreateClientFromLead,
  onOpenClientsPage,
}: DrawerClientSectionProps) {
  const dict = LEADS_DICTIONARY.drawer;
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");

  const filteredClients = clients.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.phone.includes(query)
  );

  return (
    <div className="bg-slate-50/70 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <UserCheck className="w-3.5 h-3.5 text-orange-500" />
          {dict.clientSectionTitle}
        </span>

        <button
          type="button"
          onClick={onOpenClientsPage}
          className="text-[10px] font-bold text-orange-600 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>{dict.openClientCard}</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {activeLead.client ? (
        <div className="bg-white p-3 rounded-xl border border-emerald-200/80 flex items-center justify-between gap-3 shadow-2xs">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-extrabold text-slate-900 text-xs truncate">
                {activeLead.client.name}
              </span>
              {activeLead.client.companyName && (
                <span className="text-[10px] font-bold text-slate-500">
                  ({activeLead.client.companyName})
                </span>
              )}
            </div>
            <span className="text-[11px] font-medium text-slate-500 block">
              {activeLead.client.phone}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onLinkLeadToClient(activeLead.id, null)}
            className="px-2.5 py-1 text-[11px] font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer shrink-0"
          >
            {dict.unlinkClientBtn}
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {!showSearch ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic("light");
                  onCreateClientFromLead(activeLead);
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs transition flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/20 cursor-pointer active:scale-98"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{dict.createClientBtn}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  triggerHaptic("light");
                  setShowSearch(true);
                }}
                className="py-2 px-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-xs transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                title="Найти в базе"
              >
                <LinkIcon className="w-3.5 h-3.5 text-slate-500" />
                <span>Привязать</span>
              </button>
            </div>
          ) : (
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Поиск по имени или телефону..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 outline-none focus:border-orange-500"
                  autoFocus
                />
              </div>

              <div className="max-h-36 overflow-y-auto space-y-1">
                {filteredClients.slice(0, 5).map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      onLinkLeadToClient(activeLead.id, c.id);
                      setShowSearch(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-orange-50 text-slate-800 hover:text-orange-700 text-xs font-bold transition flex items-center justify-between"
                  >
                    <span className="truncate">{c.name} ({c.phone})</span>
                    <span className="text-[10px] font-black text-orange-600 uppercase">Выбрать</span>
                  </button>
                ))}
                {filteredClients.length === 0 && (
                  <span className="block text-center text-xs text-slate-400 py-2">
                    Клиент не найден
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => setShowSearch(false)}
                className="w-full py-1 text-center text-xs text-slate-500 hover:text-slate-700 font-bold"
              >
                Отмена
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
