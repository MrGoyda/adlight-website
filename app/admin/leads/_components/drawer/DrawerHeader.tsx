"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  X, 
  FolderOpen, 
  MessageCircle, 
  ChevronDown, 
  Send, 
  Briefcase 
} from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { LeadStatus } from "@prisma/client";
import { STATUS_MAP, LEADS_DICTIONARY } from "../../_data/leadsDictionary";
import { Lead } from "../../_types/leadTypes";

interface DrawerHeaderProps {
  activeLead: Lead;
  onClose: () => void;
  onStatusChange: (leadId: string, newStatus: LeadStatus) => void;
  onOpenFullCard: (leadId: string) => void;
  onOpenCompanyConvert: () => void;
}

export default function DrawerHeader({
  activeLead,
  onClose,
  onStatusChange,
  onOpenFullCard,
  onOpenCompanyConvert,
}: DrawerHeaderProps) {
  const dict = LEADS_DICTIONARY.drawer;
  const status = STATUS_MAP[activeLead.status] || { label: activeLead.status, color: "", bg: "" };
  const [showWhatsAppMenu, setShowWhatsAppMenu] = useState(false);
  const whatsappMenuRef = useRef<HTMLDivElement>(null);

  const cleanPhone = activeLead.phone.replace(/[^0-9+]/g, "").replace("+", "");

  const quickMessages = [
    { title: "👋 Приветствие", text: `Здравствуйте, ${activeLead.name}! Вас приветствует компания ADLight.` },
    { title: "📐 Замер и встреча", text: `Здравствуйте, ${activeLead.name}! Хотим согласовать время бесплатного выезда специалиста на замер.` },
    { title: "📄 Смета готова", text: `Здравствуйте, ${activeLead.name}! Подготовили детальный расчет сметы по вашему запросу.` },
    { title: "🏢 Реквизиты компании", text: "Здравствуйте! Направляем реквизиты компании ADLight для оформления договора." },
  ];

  const handleSendWhatsApp = (customText?: string) => {
    triggerHaptic("light");
    const textParam = customText ? `?text=${encodeURIComponent(customText)}` : "";
    window.open(`https://wa.me/${cleanPhone}${textParam}`, "_blank");
    setShowWhatsAppMenu(false);
  };

  useEffect(() => {
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (whatsappMenuRef.current && !whatsappMenuRef.current.contains(e.target as Node)) {
        setShowWhatsAppMenu(false);
      }
    };
    if (showWhatsAppMenu) {
      document.addEventListener("mousedown", handleOutside);
      document.addEventListener("touchstart", handleOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [showWhatsAppMenu]);

  return (
    <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-3 sticky top-0 bg-white/95 backdrop-blur-md z-20">
      {/* Левая часть: статус и кнопка квалификации */}
      <div className="flex items-center gap-2 flex-wrap min-w-0">
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border shadow-2xs ${status.bg} ${status.color}`}>
          {status.label}
        </span>

        {activeLead.status !== "PROCESSED" && activeLead.status !== "COMPLETED" && (
          <button
            type="button"
            onClick={() => {
              triggerHaptic("light");
              onOpenCompanyConvert();
            }}
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200/80 transition cursor-pointer shadow-2xs"
            title="Конвертировать в Проект и Компанию"
          >
            <Briefcase className="w-3 h-3 text-orange-600" />
            <span>Квалифицировать в Проект</span>
          </button>
        )}
      </div>

      {/* Правая часть: WhatsApp меню, полная карточка, закрыть */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Выпадающее меню WhatsApp */}
        <div className="relative" ref={whatsappMenuRef}>
          <button
            type="button"
            onClick={() => {
              triggerHaptic("light");
              setShowWhatsAppMenu((prev) => !prev);
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs transition cursor-pointer shadow-md shadow-emerald-500/20 active:scale-95"
            title="Быстрый WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">WhatsApp</span>
            <ChevronDown className="w-3 h-3 opacity-80" />
          </button>

          {showWhatsAppMenu && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
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

        {/* Кнопка перехода в полную карточку */}
        <button
          type="button"
          onClick={() => onOpenFullCard(activeLead.id)}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
          title={dict.openFullCard}
        >
          <FolderOpen className="w-4 h-4" />
        </button>

        {/* Крестик закрытия */}
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
          title={dict.closeBtn}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
