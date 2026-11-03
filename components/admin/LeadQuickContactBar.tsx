"use client";

import React from "react";
import { Phone } from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { getCleanPhone, getWhatsAppUrl, formatPhoneInput } from "@/lib/phoneUtils";
import { triggerHaptic } from "@/lib/haptics";

export default function LeadQuickContactBar({
  phone,
  name,
}: {
  phone: string;
  name: string;
}) {
  const cleanPhone = getCleanPhone(phone);
  if (!cleanPhone || cleanPhone.length < 6) return null;

  const firstName = name.trim().split(" ")[0] || "клиент";
  const defaultMessage = `Здравствуйте, ${firstName}! Рекламное агентство ADLight по поводу вашей заявки на вывеску. Подскажите, вам удобно сейчас обсудить детали?`;
  const waUrl = getWhatsAppUrl(phone, defaultMessage);
  const formattedPhone = formatPhoneInput(phone) || phone;

  return (
    <div className="flex items-center gap-2 pt-1 pb-0.5">
      {/* 1-Tap WhatsApp с готовым вежливым приветствием */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          e.stopPropagation();
          triggerHaptic("medium");
        }}
        className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white font-bold text-xs shadow-sm shadow-emerald-500/20 transition-all cursor-pointer select-none"
        title="Написать в WhatsApp с готовым шаблоном"
      >
        <WhatsAppIcon className="w-4 h-4 shrink-0 fill-current" />
        <span>WhatsApp</span>
      </a>

      {/* 1-Tap Прямой звонок */}
      <a
        href={`tel:${cleanPhone}`}
        onClick={(e) => {
          e.stopPropagation();
          triggerHaptic("light");
        }}
        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-700 font-semibold text-xs transition-colors cursor-pointer select-none"
        title={`Позвонить: ${formattedPhone}`}
      >
        <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        <span className="hidden sm:inline">Позвонить</span>
      </a>
    </div>
  );
}
