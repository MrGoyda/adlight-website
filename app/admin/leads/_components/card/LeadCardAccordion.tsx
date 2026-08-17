"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, 
  Copy, 
  Check, 
  ExternalLink, 
  Calendar, 
  CalendarCheck, 
  DollarSign, 
  Tag, 
  Calculator, 
  FolderOpen 
} from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { copyToClipboard } from "@/lib/clipboard";
import { toast } from "@/lib/toast";
import { Lead } from "../../_types/leadTypes";
import { LEADS_DICTIONARY, formatManagerName } from "../../_data/leadsDictionary";

interface LeadCardAccordionProps {
  lead: Lead;
  isExpanded: boolean;
  onOpenEstimate: (lead: Lead) => void;
  onOpenFullCard: (leadId: string) => void;
}

export default function LeadCardAccordion({
  lead,
  isExpanded,
  onOpenEstimate,
  onOpenFullCard,
}: LeadCardAccordionProps) {
  const dict = LEADS_DICTIONARY.card;
  const [copiedAddress, setCopiedAddress] = useState(false);

  const handleCopyAddress = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!lead.address) return;
    triggerHaptic("light");
    const ok = await copyToClipboard(lead.address);
    if (ok) {
      setCopiedAddress(true);
      toast.success(dict.copyAddressSuccess);
      setTimeout(() => setCopiedAddress(false), 2000);
    } else {
      toast.error(dict.copyAddressError);
    }
  };

  return (
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.22, ease: "easeInOut" }}
          className="space-y-2.5 pt-2 border-t border-slate-100 overflow-hidden"
        >
          {/* Полный адрес объекта */}
          {lead.address ? (
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex items-start justify-between gap-2">
              <div className="flex items-start gap-2 min-w-0">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Адрес объекта
                  </span>
                  <p className="text-xs font-bold text-slate-800 break-words select-text">
                    {lead.address}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 transition shadow-2xs cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                  title={dict.copyAddressTooltip}
                >
                  {copiedAddress ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{copiedAddress ? "Скопировано" : "Копия"}</span>
                </button>
                <a
                  href={`https://2gis.kz/astana/search/${encodeURIComponent(lead.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200/80 transition shadow-2xs flex items-center gap-1 text-[11px] font-bold"
                  title={dict.openMap}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">2GIS</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50/60 p-2.5 rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-300 shrink-0" />
              <span>{dict.addressNotSpecified}</span>
            </div>
          )}

          {/* Исходный запрос с сайта */}
          {lead.message && (
            <div className="bg-orange-50/40 p-3 rounded-xl border border-orange-200/50">
              <span className="block text-[10px] font-extrabold text-orange-700/70 uppercase tracking-wider mb-1">
                {dict.initialSiteRequest}
              </span>
              <p className="text-xs text-slate-800 font-medium leading-relaxed break-words whitespace-pre-wrap">
                {lead.message}
              </p>
            </div>
          )}

          {/* Заметка менеджера */}
          {lead.comment && (
            <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-200/60">
              <span className="block text-[10px] font-extrabold text-amber-700/80 uppercase tracking-wider mb-1">
                Заметка менеджера
              </span>
              <p className="text-xs text-slate-800 font-medium leading-relaxed break-words whitespace-pre-wrap">
                {lead.comment}
              </p>
            </div>
          )}

          {/* Даты и ответственный */}
          {(lead.appointmentDate || lead.deadline || lead.manager) && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              {lead.appointmentDate && (
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/70">
                  <span className="block text-[9px] font-extrabold text-slate-400 uppercase flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-orange-500" /> Выезд / Замер
                  </span>
                  <span className="font-extrabold text-slate-800">
                    {new Date(lead.appointmentDate).toLocaleString("ru-RU", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>
                </div>
              )}

              {lead.deadline && (
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/70">
                  <span className="block text-[9px] font-extrabold text-slate-400 uppercase flex items-center gap-1">
                    <CalendarCheck className="w-3 h-3 text-emerald-600" /> Дедлайн
                  </span>
                  <span className="font-extrabold text-slate-800">
                    {new Date(lead.deadline).toLocaleDateString("ru-RU", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    })}
                  </span>
                </div>
              )}

              {lead.manager && (
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/70">
                  <span className="block text-[9px] font-extrabold text-slate-400 uppercase">{dict.responsibleLabel}</span>
                  <span className="font-extrabold text-orange-700">
                    {formatManagerName(lead.manager)}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Озвученная стоимость клиенту */}
          {lead.offeredPrice !== undefined && lead.offeredPrice !== null && lead.offeredPrice > 0 && (
            <div className={`p-3 rounded-xl border flex items-center justify-between gap-2 ${
              lead.isDiscounted ? "bg-amber-50/70 border-amber-200" : "bg-blue-50/60 border-blue-200"
            }`}>
              <div className="flex items-center gap-2">
                <DollarSign className={`w-4 h-4 shrink-0 ${lead.isDiscounted ? "text-amber-600" : "text-blue-600"}`} />
                <div>
                  <span className="block text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">
                    {dict.offeredPriceLabel}
                  </span>
                  <span className="text-sm font-black text-slate-900">
                    {lead.offeredPrice.toLocaleString("ru")} ₸
                  </span>
                </div>
              </div>
              {lead.isDiscounted && (
                <span className="px-2 py-0.5 rounded-lg bg-amber-100 border border-amber-300 text-amber-800 font-extrabold text-[10px] uppercase flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {dict.discountBadge}
                </span>
              )}
            </div>
          )}

          {/* Кнопки действий */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                triggerHaptic("light");
                onOpenEstimate(lead);
              }}
              className="flex-1 py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs active:scale-98"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>{dict.estimateBtn}</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                triggerHaptic("light");
                onOpenFullCard(lead.id);
              }}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:scale-98"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>{dict.cardBtn}</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
