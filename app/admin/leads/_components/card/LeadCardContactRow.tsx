"use client";

import React from "react";
import { Phone, DollarSign } from "lucide-react";
import { StatusConfig } from "../../_data/leadsDictionary";

function WhatsAppIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.04 14.69 2 12.04 2M12.04 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.67 12.04 3.67M9.53 7.57C9.38 7.57 9.13 7.63 8.92 7.85C8.71 8.08 8.13 8.63 8.13 9.74C8.13 10.86 8.95 11.93 9.06 12.08C9.18 12.24 10.66 14.52 12.92 15.5C13.46 15.73 13.88 15.87 14.21 15.97C14.75 16.14 15.24 16.12 15.63 16.06C16.06 16 16.95 15.52 17.14 15C17.32 14.47 17.32 14.02 17.27 13.93C17.21 13.83 17.06 13.78 16.83 13.67C16.61 13.56 15.51 13.02 15.31 12.94C15.1 12.87 14.95 12.83 14.8 13.06C14.65 13.28 14.22 13.78 14.09 13.93C13.96 14.08 13.83 14.1 13.61 13.99C13.38 13.88 12.65 13.64 11.79 12.87C11.11 12.27 10.66 11.53 10.53 11.31C10.4 11.08 10.52 10.96 10.63 10.85C10.74 10.74 10.87 10.57 10.99 10.44C11.1 10.31 11.15 10.22 11.23 10.07C11.3 9.92 11.26 9.79 11.21 9.68C11.15 9.57 10.7 8.47 10.52 8C10.34 7.55 10.15 7.61 10.01 7.61C9.88 7.6 9.71 7.58 9.53 7.57Z" />
    </svg>
  );
}

interface LeadCardContactRowProps {
  status: StatusConfig;
  source?: string | null;
  phone: string;
  offeredPrice?: number | null;
  isDiscounted?: boolean;
  revenue?: number | null;
}

export default function LeadCardContactRow({
  status,
  source,
  phone,
  offeredPrice,
  isDiscounted,
  revenue,
}: LeadCardContactRowProps) {
  const cleanPhone = phone.replace(/[^0-9+]/g, "");

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
          href={`https://wa.me/${cleanPhone.replace("+", "")}`}
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
      {offeredPrice && offeredPrice > 0 ? (
        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 font-extrabold border border-amber-200 shadow-2xs">
          <span className="text-[10px] text-amber-600 font-medium">Озвучено:</span>
          <span>{Number(offeredPrice).toLocaleString("ru-RU")} ₸</span>
          {isDiscounted && (
            <span
              className="text-[9px] px-1 py-0.2 bg-amber-200 text-amber-800 rounded font-black uppercase tracking-tight ml-0.5"
              title="Озвучено со скидкой"
            >
              🏷️ Скидка
            </span>
          )}
        </div>
      ) : null}

      {/* 5. Выручка (если зафиксирована) */}
      {revenue && revenue > 0 ? (
        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-black border border-emerald-200">
          <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
          <span>{Number(revenue).toLocaleString("ru-RU")} ₸</span>
        </div>
      ) : null}
    </div>
  );
}
