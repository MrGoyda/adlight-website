"use client";

import React from "react";
import { Phone, MessageCircle, DollarSign, Tag, Flame } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { Lead } from "../../_types/leadTypes";
import { LEADS_DICTIONARY } from "../../_data/leadsDictionary";
import { LeadTimingInfo } from "../../_utils/leadTimelineUtils";

interface LeadCardInfoProps {
  lead: Lead;
  timing: LeadTimingInfo;
}

export default function LeadCardInfo({ lead, timing }: LeadCardInfoProps) {
  const dict = LEADS_DICTIONARY.card;
  const cleanPhone = lead.phone.replace(/[^0-9+]/g, "");

  return (
    <div className="flex items-center justify-between gap-2 flex-wrap pt-0.5">
      {/* Телефон и быстрые кнопки связи */}
      <div className="flex items-center gap-1.5 min-w-0">
        <a
          href={`tel:${cleanPhone}`}
          onClick={(e) => {
            e.stopPropagation();
            triggerHaptic("light");
          }}
          className="inline-flex items-center gap-1 text-xs sm:text-[13px] font-black text-slate-700 hover:text-orange-600 transition truncate"
        >
          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{lead.phone}</span>
        </a>

        {/* Быстрый WhatsApp */}
        <a
          href={`https://wa.me/${cleanPhone.replace("+", "")}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            e.stopPropagation();
            triggerHaptic("light");
          }}
          className="p-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200/60 transition shadow-2xs"
          title="Написать в WhatsApp"
        >
          <MessageCircle className="w-3 h-3" />
        </a>
      </div>

      {/* Правая часть: Озвученная стоимость + Бейдж срочности */}
      <div className="flex items-center gap-1.5 flex-wrap shrink-0">
        {/* Озвученная клиенту стоимость */}
        {lead.offeredPrice !== undefined && lead.offeredPrice !== null && lead.offeredPrice > 0 && (
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-700 font-extrabold text-[11px] shadow-2xs">
            <DollarSign className="w-3 h-3 text-emerald-600 shrink-0" />
            <span>{dict.offeredPrice}: {lead.offeredPrice.toLocaleString("ru")} ₸</span>
            {lead.isDiscounted && (
              <span className="inline-flex items-center gap-0.5 ml-1 px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800 text-[9px] font-black uppercase">
                <Tag className="w-2.5 h-2.5" />
                {dict.discountBadge}
              </span>
            )}
          </div>
        )}

        {/* Бейдж остывания заявки (>2 часов) */}
        {timing.isLeadColdWarning && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs animate-pulse">
            <Flame className="w-3 h-3 text-rose-500 fill-rose-500" />
            <span>Ждет ответа</span>
          </span>
        )}

        {/* Бейдж замера / встречи */}
        {timing.appointmentBadge && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-orange-50 text-orange-700 border border-orange-200 shadow-2xs">
            <span>{timing.appointmentBadge.text}</span>
          </span>
        )}
      </div>
    </div>
  );
}
