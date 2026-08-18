"use client";

import React from "react";
import { Phone, DollarSign, CheckCircle2, Clock } from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { StatusConfig } from "../../_data/leadsDictionary";
import { getCleanPhone, getWhatsAppUrl } from "@/lib/phoneUtils";

interface LeadCardContactRowProps {
  status: StatusConfig;
  source?: string | null;
  phone: string;
  offeredPrice?: number | null;
  isDiscounted?: boolean;
  prepayment?: number | null;
  isPrepaymentPaid?: boolean;
  isBalancePaid?: boolean;
  revenue?: number | null;
}

export default function LeadCardContactRow({
  status,
  source,
  phone,
  offeredPrice,
  isDiscounted,
  prepayment,
  isPrepaymentPaid,
  isBalancePaid,
  revenue,
}: LeadCardContactRowProps) {
  const cleanPhone = getCleanPhone(phone);
  const waUrl = getWhatsAppUrl(phone);

  const numOffered = offeredPrice ? Number(offeredPrice) : 0;
  const numPrepayment = prepayment ? Number(prepayment) : 0;
  const balanceDue = numOffered > 0 && numPrepayment > 0 ? numOffered - numPrepayment : 0;

  return (
    <div className="flex items-center gap-2 flex-wrap text-xs">
      {/* 1. Статус сделки */}
      <span
        className={`px-2.5 py-1 rounded-lg font-bold border shadow-2xs ${status.bg} ${status.color}`}
      >
        {status.label}
      </span>

      {/* 2. Источник (если не сайт) */}
      {source && source !== "Сайт" && (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
          {source}
        </span>
      )}

      {/* 3. Телефон с кнопкой WhatsApp */}
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100/90 text-slate-700 font-bold border border-slate-200">
        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <a
          href={`tel:${cleanPhone}`}
          onClick={(e) => e.stopPropagation()}
          className="hover:text-orange-600 transition"
        >
          {phone}
        </a>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          title="Написать в WhatsApp"
          className="ml-0.5 p-1 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white transition cursor-pointer active:scale-95 shadow-2xs inline-flex items-center justify-center"
        >
          <WhatsAppIcon className="w-3 h-3" />
        </a>
      </div>

      {/* 4. Озвученная стоимость */}
      {numOffered > 0 && (
        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 font-extrabold border border-amber-200 shadow-2xs">
          <span className="text-[10px] text-amber-600 font-medium">Озвучено:</span>
          <span>{numOffered.toLocaleString("ru-RU")} ₸</span>
          {isDiscounted && (
            <span
              className="text-[9px] px-1 py-0.2 bg-amber-200 text-amber-800 rounded font-black uppercase tracking-tight ml-0.5"
              title="Озвучено со скидкой"
            >
              🏷️ Скидка
            </span>
          )}
        </div>
      )}

      {/* 5. Статус оплат и предоплаты */}
      {isBalancePaid ? (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 font-black border border-blue-200 shadow-2xs">
          <CheckCircle2 className="w-3 h-3 text-blue-600" />
          <span>Оплачено 100%</span>
        </span>
      ) : isPrepaymentPaid && numPrepayment > 0 ? (
        <>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 font-black border border-emerald-200 shadow-2xs text-[11px]">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Аванс {numPrepayment.toLocaleString("ru-RU")} ₸</span>
          </span>
          {balanceDue > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-bold border border-slate-200 text-[11px]">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>Остаток {balanceDue.toLocaleString("ru-RU")} ₸</span>
            </span>
          )}
        </>
      ) : numPrepayment > 0 ? (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50/80 text-amber-800 font-bold border border-amber-200 text-[11px]">
          <Clock className="w-3 h-3 text-amber-500" />
          <span>Аванс {numPrepayment.toLocaleString("ru-RU")} ₸ (ожидается)</span>
        </span>
      ) : revenue && revenue > 0 ? (
        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-black border border-emerald-200">
          <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
          <span>{Number(revenue).toLocaleString("ru-RU")} ₸</span>
        </div>
      ) : null}
    </div>
  );
}
