"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, ChevronDown, Calculator, Send, Edit3, Check } from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { triggerHaptic } from "@/lib/haptics";
import { LeadStatus, ClientRating } from "@prisma/client";
import { STATUS_MAP } from "../../_data/leadsDictionary";
import { CLIENT_RATINGS, getQuickWhatsAppTemplates } from "../../_data/leadDetailDictionary";
import { Lead } from "../../_types/leadTypes";
import { LeadFullDetails } from "../../_types/leadDetailTypes";
import { getWhatsAppUrl } from "@/lib/phoneUtils";

interface LeadDetailHeaderProps {
  lead: LeadFullDetails | Lead;
  rating: ClientRating;
  isEditing?: boolean;
  onToggleEditing?: () => void;
  onRatingChange: (newRating: ClientRating) => void;
  onStatusChange: (newStatus: LeadStatus) => void;
  onOpenEstimate: () => void;
  onClose: () => void;
}

export default function LeadDetailHeader({
  lead,
  rating,
  isEditing = false,
  onToggleEditing,
  onRatingChange,
  onStatusChange,
  onOpenEstimate,
  onClose,
}: LeadDetailHeaderProps) {
  const [showWhatsAppMenu, setShowWhatsAppMenu] = useState(false);
  const [showRatingMenu, setShowRatingMenu] = useState(false);

  const whatsappRef = useRef<HTMLDivElement>(null);
  const ratingRef = useRef<HTMLDivElement>(null);

  const status = STATUS_MAP[lead.status] || { label: lead.status, color: "", bg: "" };
  const currentRating = CLIENT_RATINGS[rating] || CLIENT_RATINGS.STANDARD;
  const quickMessages = getQuickWhatsAppTemplates(lead.name || "Клиент");

  const handleSendWhatsApp = (customText?: string) => {
    triggerHaptic("light");
    const waUrl = getWhatsAppUrl(lead.phone || "", customText);
    if (waUrl) window.open(waUrl, "_blank");
    setShowWhatsAppMenu(false);
  };

  useEffect(() => {
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (whatsappRef.current && !whatsappRef.current.contains(e.target as Node)) {
        setShowWhatsAppMenu(false);
      }
      if (ratingRef.current && !ratingRef.current.contains(e.target as Node)) {
        setShowRatingMenu(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, []);

  return (
    <div className="p-2.5 sm:px-6 sm:py-3.5 border-b border-slate-100 flex items-center justify-between gap-1.5 sm:gap-3 sticky top-0 bg-white/95 backdrop-blur-md z-30 shrink-0">
      {/* Левая часть: Статус + Рейтинг */}
      <div className="flex items-center gap-1.5 min-w-0 shrink">
        {/* Интерактивный этап сделки */}
        <div className="relative shrink-0">
          <select
            value={lead.status}
            onChange={(e) => {
              triggerHaptic("medium");
              onStatusChange(e.target.value as LeadStatus);
            }}
            className={`appearance-none pl-2.5 pr-6 py-1.5 rounded-full text-[11px] sm:text-xs font-extrabold uppercase tracking-wider border shadow-2xs cursor-pointer outline-none transition max-w-[130px] sm:max-w-none truncate ${status.bg} ${status.color}`}
            title="Сменить этап сделки"
          >
            {Object.entries(STATUS_MAP).map(([key, val]) => (
              <option key={key} value={key} className="bg-white text-slate-900 font-bold py-1">
                {val.label}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-70" />
        </div>

        {/* Рейтинг клиента */}
        <div className="relative shrink-0" ref={ratingRef}>
          <button
            type="button"
            onClick={() => {
              triggerHaptic("light");
              setShowRatingMenu((prev) => !prev);
            }}
            className={`inline-flex items-center gap-1 px-2 py-1.5 rounded-xl border text-[11px] sm:text-xs font-black shadow-2xs transition cursor-pointer active:scale-95 ${currentRating.badgeClass}`}
            title="Оценка сложности клиента"
          >
            <span>{currentRating.icon}</span>
            <span className="hidden md:inline">{currentRating.shortLabel}</span>
            <ChevronDown className="w-2.5 h-2.5 opacity-60" />
          </button>

          {showRatingMenu && (
            <div className="fixed inset-x-3 top-16 sm:absolute sm:inset-x-auto sm:left-0 sm:top-full sm:mt-2 w-auto sm:w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
              <span className="block px-2.5 py-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                Категория клиента
              </span>
              {Object.values(CLIENT_RATINGS).map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => {
                    triggerHaptic("medium");
                    onRatingChange(r.value);
                    setShowRatingMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-extrabold flex items-center justify-between transition cursor-pointer ${
                    rating === r.value ? "bg-slate-100 text-slate-900" : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{r.icon}</span>
                    <span>{r.label}</span>
                  </span>
                  {rating === r.value && <span className="text-orange-600 font-black">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Правая часть: WhatsApp, Редактировать, Смета, Закрыть */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        {/* Кнопка WhatsApp */}
        <div className="relative" ref={whatsappRef}>
          <button
            type="button"
            onClick={() => {
              triggerHaptic("light");
              setShowWhatsAppMenu((prev) => !prev);
            }}
            className="flex items-center gap-1 p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs transition cursor-pointer shadow-md shadow-emerald-500/20 active:scale-95"
            title="Быстрый WhatsApp"
          >
            <WhatsAppIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">WhatsApp</span>
            <ChevronDown className="w-3 h-3 opacity-80 hidden sm:inline" />
          </button>

          {showWhatsAppMenu && (
            <div className="fixed inset-x-3 top-16 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 w-auto sm:w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
              <span className="block px-3 py-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                Быстрые шаблоны
              </span>
              {quickMessages.map((m, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendWhatsApp(m.text)}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-xs font-bold transition flex items-center justify-between gap-2"
                >
                  <span className="truncate">{m.title}</span>
                  <Send className="w-3 h-3 text-emerald-500 shrink-0" />
                </button>
              ))}
              <div className="pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleSendWhatsApp()}
                  className="w-full text-center px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black transition"
                >
                  💬 Открыть пустой чат
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Кнопка переключения режима Редактирования / Просмотра */}
        {onToggleEditing && (
          <button
            type="button"
            onClick={() => {
              triggerHaptic("light");
              onToggleEditing();
            }}
            className={`flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl font-extrabold text-[11px] sm:text-xs transition cursor-pointer active:scale-95 shadow-2xs ${
              isEditing
                ? "bg-slate-900 text-white hover:bg-black"
                : "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200/80"
            }`}
            title={isEditing ? "Завершить редактирование" : "Редактировать поля"}
          >
            {isEditing ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Просмотр</span>
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                <span>Изменить</span>
              </>
            )}
          </button>
        )}

        {/* Кнопка сметы */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic("light");
            onOpenEstimate();
          }}
          className="flex items-center gap-1 p-2 sm:px-3 sm:py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs transition cursor-pointer shadow-md shadow-orange-500/20 active:scale-95"
          title="Открыть смету"
        >
          <Calculator className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Смета</span>
        </button>

        {/* Крестик закрытия */}
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer active:scale-90"
          title="Закрыть (Esc)"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
}
