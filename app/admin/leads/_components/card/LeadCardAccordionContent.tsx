"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Copy, Check, ExternalLink, MessageSquare, CalendarCheck, AlertCircle } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { copyToClipboard } from "@/lib/clipboard";
import { toast } from "@/lib/toast";
import { formatManagerName } from "../../_data/leadsDictionary";

interface LeadCardAccordionContentProps {
  isExpanded: boolean;
  address?: string | null;
  message?: string | null;
  comment?: string | null;
  appointmentDate?: string | Date | null;
  deadline?: string | Date | null;
  manager?: string | null;
}

export default function LeadCardAccordionContent({
  isExpanded,
  address,
  message,
  comment,
  appointmentDate,
  deadline,
  manager,
}: LeadCardAccordionContentProps) {
  const [copiedAddress, setCopiedAddress] = useState(false);

  const handleCopyAddress = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!address) return;
    triggerHaptic("light");
    const ok = await copyToClipboard(address);
    if (ok) {
      setCopiedAddress(true);
      toast.success("Адрес скопирован в буфер!");
      setTimeout(() => setCopiedAddress(false), 2000);
    } else {
      toast.error("Не удалось скопировать адрес");
    }
  };

  return (
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="pt-2 border-t border-slate-100 space-y-2.5 overflow-hidden text-xs"
        >
          {/* Адрес с кнопками быстрого действия */}
          {address && (
            <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/80 flex items-start justify-between gap-2">
              <div className="flex items-start gap-1.5 min-w-0">
                <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                <span className="font-semibold text-slate-800 break-words">
                  {address}
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="p-1 text-slate-400 hover:text-slate-700 hover:bg-white rounded-md transition cursor-pointer"
                  title="Скопировать адрес"
                >
                  {copiedAddress ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
                <a
                  href={`https://2gis.kz/astana/search/${encodeURIComponent(address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1 text-orange-500 hover:text-orange-700 hover:bg-white rounded-md transition cursor-pointer"
                  title="Открыть в 2GIS"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* Запрос с сайта */}
          {message && (
            <div className="bg-orange-50/40 p-2.5 rounded-xl border border-orange-200/60 w-full min-w-0 max-w-full overflow-hidden">
              <span className="block text-[10px] font-black uppercase tracking-wider text-orange-600 mb-0.5">
                Запрос с сайта:
              </span>
              <p className="text-slate-700 font-medium leading-relaxed whitespace-pre-wrap break-words break-all [overflow-wrap:anywhere] max-w-full">
                {message}
              </p>
            </div>
          )}

          {/* Заметка менеджера */}
          {comment && (
            <div className="bg-amber-50/50 p-2.5 rounded-xl border border-amber-200/70 w-full min-w-0 max-w-full overflow-hidden">
              <span className="block text-[10px] font-black uppercase tracking-wider text-amber-700 mb-0.5 flex items-center gap-1">
                <MessageSquare className="w-3 h-3 shrink-0" />
                Заметка:
              </span>
              <p className="text-slate-800 font-semibold leading-relaxed whitespace-pre-wrap break-words break-all [overflow-wrap:anywhere] max-w-full">
                {comment}
              </p>
            </div>
          )}

          {/* Даты замера и дедлайна */}
          {(appointmentDate || deadline) && (
            <div className="grid grid-cols-2 gap-2 pt-1">
              {appointmentDate && (
                <div className="bg-blue-50/60 p-2 rounded-xl border border-blue-200/60">
                  <span className="block text-[9px] font-bold text-blue-600 uppercase flex items-center gap-1">
                    <CalendarCheck className="w-3 h-3" />
                    Замер
                  </span>
                  <span className="font-extrabold text-slate-800 text-[11px]">
                    {new Date(appointmentDate).toLocaleDateString("ru-RU", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
              )}
              {deadline && (
                <div className="bg-rose-50/60 p-2 rounded-xl border border-rose-200/60">
                  <span className="block text-[9px] font-bold text-rose-600 uppercase flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Дедлайн
                  </span>
                  <span className="font-extrabold text-slate-800 text-[11px]">
                    {new Date(deadline).toLocaleDateString("ru-RU", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Менеджер */}
          {manager && (
            <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
              <span>Ответственный:</span>
              <span className="font-bold text-slate-800">
                {formatManagerName(manager)}
              </span>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
