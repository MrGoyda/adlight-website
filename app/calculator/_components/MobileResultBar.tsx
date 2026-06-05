"use client";

import { MessageCircle, Phone } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { CALC_UI } from "@/dictionaries/calculator";

interface MobileResultBarProps {
  min: number;
  max: number;
  whatsappLink: string;
  onOpenModal: () => void;
}

/**
 * MobileResultBar — sticky CTA-бар снизу экрана для мобилей.
 * PriceResult (с полным расчётом) показывается инлайн выше.
 * Этот бар — быстрый доступ к действиям при скролле страницы.
 */
export default function MobileResultBar({
  min,
  max,
  whatsappLink,
  onOpenModal,
}: MobileResultBarProps) {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] pb-safe">
      <div className="grid grid-cols-2 gap-2 px-3 py-2.5">

        {/* Оставить заявку */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic("success");
            onOpenModal();
          }}
          className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white text-sm font-bold py-3 rounded-xl transition-all"
        >
          <Phone className="w-4 h-4 shrink-0" />
          <span>{CALC_UI.ctaModal}</span>
        </button>

        {/* Написать в WhatsApp */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => triggerHaptic("light")}
          className="flex items-center justify-center gap-2 border border-emerald-300 text-emerald-700 hover:bg-emerald-50 active:scale-[0.98] text-sm font-bold py-3 rounded-xl transition-all"
        >
          <MessageCircle className="w-4 h-4 shrink-0" />
          <span>{CALC_UI.ctaWhatsapp}</span>
        </a>
      </div>
    </div>
  );
}
