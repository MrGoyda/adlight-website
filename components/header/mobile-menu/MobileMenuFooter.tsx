"use client";

import React from "react";
import Link from "next/link";
import { Instagram, Send, User, FileText } from "lucide-react";
import { COMPANY_NAP } from "@/dictionaries/common";
import Button from "@/components/ui/Button";
import { trackClientConversion } from "@/lib/clientAnalytics";
import { triggerHaptic } from "@/lib/haptics";
import { useModalStore } from "@/lib/store/useModalStore";

interface MobileMenuFooterProps {
  onClose: () => void;
  onLinkClick: () => void;
}

export default function MobileMenuFooter({ onClose, onLinkClick }: MobileMenuFooterProps) {
  const { openConsultation } = useModalStore();

  const handleOpenConsultation = () => {
    triggerHaptic("medium");
    onClose();
    openConsultation({
      source: "Мобильное меню",
      title: "Заявка на консультацию",
      subtitle: "Оставьте контактные данные, и мы свяжемся с вами в течение 5 минут",
    });
  };

  const handleWhatsappClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    const { getTrackedWhatsappUrl } = await import("@/lib/clickTracker");
    const url = await getTrackedWhatsappUrl(
      "77071356701",
      "Здравствуйте! Хочу заказать вывеску.",
      "Mobile Menu"
    );
    window.open(url, "_blank");
  };

  return (
    <div className="px-5 py-4 pb-safe-4 bg-white border-t border-slate-100 space-y-3 shrink-0">
      {/* Соцсети */}
      <div className="flex justify-center gap-4">
        <a
          href={COMPANY_NAP.socials.instagram}
          target="_blank"
          rel="nofollow noreferrer"
          onClick={() =>
            trackClientConversion("click_instagram", {
              page_location: typeof window !== "undefined" ? window.location.href : "",
              form_name: "Mobile Menu Instagram",
            })
          }
          className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-pink-600 hover:text-white hover:border-transparent transition-all duration-200 active:scale-90"
          aria-label="Наш Instagram"
        >
          <Instagram className="w-4 h-4" />
        </a>
        <a
          href={COMPANY_NAP.socials.telegram}
          target="_blank"
          rel="nofollow noreferrer"
          onClick={() =>
            trackClientConversion("click_telegram", {
              page_location: typeof window !== "undefined" ? window.location.href : "",
              form_name: "Mobile Menu Telegram",
            })
          }
          className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-blue-500 hover:text-white hover:border-transparent transition-all duration-200 active:scale-90"
          aria-label="Наш Telegram"
        >
          <Send className="w-4 h-4 ml-0.5" />
        </a>
        <a
          href={COMPANY_NAP.socials.whatsapp}
          target="_blank"
          rel="nofollow noreferrer"
          onClick={handleWhatsappClick}
          className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-green-500 hover:text-white hover:border-transparent transition-all duration-200 active:scale-90 cursor-pointer"
          aria-label="Наш WhatsApp"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M12.004 2C6.48 2 2 6.48 2 12c0 2.17.7 4.19 1.89 5.83L2.03 22l4.31-1.83c1.55.98 3.39 1.54 5.37 1.54 5.52 0 10-4.48 10-10S17.52 2 12.004 2zm5.72 13.91c-.24.68-1.2 1.24-1.93 1.39-.49.1-1.13.17-3.29-.71-2.76-1.12-4.53-3.93-4.67-4.12-.14-.19-1.14-1.51-1.14-2.87a3 3 0 01.91-2.22c.26-.26.56-.33.75-.33h.49c.16 0 .37.01.53.39.17.41.59 1.43.64 1.54.05.11.09.24.01.39-.08.15-.12.24-.24.38-.12.14-.25.31-.36.42-.12.12-.25.25-.11.49.14.24.63 1.03 1.35 1.67.92.82 1.7 1.07 1.94 1.19.24.12.38.1.52-.06.14-.16.59-.69.75-.92.16-.23.32-.19.53-.11.22.08 1.37.65 1.61.76.24.12.4.17.46.28.06.11.06.64-.18 1.32z" />
          </svg>
        </a>
      </div>

      {/* Кнопки CRM и Заявка */}
      <div className="grid grid-cols-2 gap-2.5">
        <Link href="/admin/leads" onClick={onLinkClick} className="w-full">
          <Button
            variant="lightGlass"
            className="w-full text-slate-800 border border-slate-200 text-xs py-3"
          >
            <span className="flex items-center gap-1.5 justify-center">
              <User className="w-3.5 h-3.5 text-orange-500" /> CRM Панель
            </span>
          </Button>
        </Link>
        <Button
          variant="solid"
          onClick={handleOpenConsultation}
          className="w-full py-3 text-xs font-extrabold"
        >
          <span className="flex items-center gap-1.5 justify-center">
            <FileText className="w-3.5 h-3.5" /> Оставить заявку
          </span>
        </Button>
      </div>
    </div>
  );
}
