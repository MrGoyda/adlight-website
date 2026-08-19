"use client";

import { getCdnUrl } from "@/lib/serverUtils";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  Menu, 
  X, 
  Phone, 
  Instagram, 
  Send, 
  User, 
  MapPin
} from "lucide-react";
import { motion } from "framer-motion";

import dynamic from "next/dynamic";
import Button from "@/components/ui/Button";
import { useModalStore } from "@/lib/store/useModalStore";

const MobileMenu = dynamic(() => import("@/components/header/MobileMenu"), { ssr: false });

// --- ИМПОРТ СЛОВАРЕЙ И КОНФИГА ---
import { COMPANY_NAP } from "@/dictionaries/common";
import { CATALOG_SERVICES } from "@/dictionaries/services/catalog-services";
import { SITE_URL } from "@/config/site";

import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import { trackClientConversion } from "@/lib/clientAnalytics";

export default function Header() {
  const pathname = usePathname();
  const isAdminActive = pathname?.startsWith("/admin");
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { openConsultation } = useModalStore();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      lockScroll('mobile-menu');
    } else {
      unlockScroll('mobile-menu');
    }
    return () => {
      unlockScroll('mobile-menu');
    };
  }, [isOpen]);

  // SCHEMA.ORG для Навигации (Динамический с использованием SITE_URL)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    "name": [
      "Главная",
      ...CATALOG_SERVICES.flatMap(cat => cat.items.map(item => item.title)),
      "Портфолио",
      "Дизайн-код",
      "Контакты"
    ],
    "url": [
      SITE_URL,
      ...CATALOG_SERVICES.flatMap(cat => cat.items.map(item => `${SITE_URL}${item.link}`)),
      `${SITE_URL}/portfolio`,
      `${SITE_URL}/design-code`,
      `${SITE_URL}/contacts`
    ]
  };

  const burgerAnimation = {
    whileTap: { scale: 0.95 },
    whileHover: { y: -2, scale: 1.03 },
    transition: { type: "spring" as const, stiffness: 500, damping: 14, mass: 0.8 },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled 
          ? 'border-slate-200/80 shadow-xl shadow-slate-200/20 bg-white/95 backdrop-blur-md' 
          : 'border-slate-200/40 bg-white'
      }`}>
        <div className="absolute inset-0 z-[-1] bg-white rounded-inherit pointer-events-none" />
        
        <div className="container mx-auto px-4 h-16 sm:h-20 flex items-center justify-between relative">
          
          {/* Логотип */}
          <Link href="/" className="relative z-[55] flex items-center" onClick={() => setIsOpen(false)} aria-label="ADLight - Наружная реклама Астана">
             <div className="relative w-36 h-10 md:w-44 md:h-12 active:scale-98 transition-transform">
                <Image 
                   src="/adlight-logo-full.webp" 
                   alt="ADLight - Изготовление вывесок и наружной рекламы в Астане" 
                   fill
                   className="object-contain object-left"
                   sizes="(max-width: 768px) 144px, 176px"
                   priority
                   loading="eager"
                />
             </div>
          </Link>

          {/* ДЕСКТОПНЫЕ ЭЛЕМЕНТЫ (Адрес, Соцсети, Контакты) */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8 relative z-[55]">
             
             {/* 1. Адрес с иконкой */}
             <div className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition duration-250 text-xs font-semibold border-r border-slate-200 pr-5">
                <div className="p-2 bg-slate-100 rounded-lg border border-slate-200 text-orange-500">
                   <MapPin className="w-3.5 h-3.5"/>
                </div>
                <div className="text-left leading-tight">
                   <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-bold">Наше производство</span>
                   <span className="text-slate-700">г. {COMPANY_NAP.locality}, {COMPANY_NAP.address}</span>
                </div>
             </div>

             {/* 2. Соцсети с реальными иконками */}
             <div className="flex items-center gap-2.5 border-r border-slate-200 pr-5">
                <a 
                   href={COMPANY_NAP.socials.instagram} 
                   target="_blank" 
                   rel="nofollow noreferrer" 
                   onClick={() => trackClientConversion('click_instagram', { page_location: typeof window !== 'undefined' ? window.location.href : '', form_name: 'Header Instagram' })}
                   className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-pink-500 hover:bg-pink-500/5 hover:border-pink-500/30 transition duration-300" 
                   aria-label="Наш Instagram"
                >
                   <Instagram className="w-4 h-4"/>
                </a>
                <a 
                   href={COMPANY_NAP.socials.telegram} 
                   target="_blank" 
                   rel="nofollow noreferrer" 
                   onClick={() => trackClientConversion('click_telegram', { page_location: typeof window !== 'undefined' ? window.location.href : '', form_name: 'Header Telegram' })}
                   className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-400 hover:bg-blue-400/5 hover:border-blue-400/30 transition duration-300" 
                   aria-label="Наш Telegram"
                >
                   <Send className="w-4 h-4 ml-0.5"/>
                </a>
                <a 
                   href={COMPANY_NAP.socials.whatsapp} 
                   target="_blank" 
                   rel="nofollow noreferrer" 
                   onClick={async (e) => {
                     e.preventDefault();
                     const { getTrackedWhatsappUrl } = await import("@/lib/clickTracker");
                     const url = await getTrackedWhatsappUrl("77071356701", "Здравствуйте! Хочу заказать вывеску.", "Header");
                     window.open(url, "_blank");
                   }}
                   className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-green-500 hover:bg-green-500/5 hover:border-green-500/30 transition duration-300 cursor-pointer" 
                   aria-label="Наш WhatsApp"
                >
                   <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M12.004 2C6.48 2 2 6.48 2 12c0 2.17.7 4.19 1.89 5.83L2.03 22l4.31-1.83c1.55.98 3.39 1.54 5.37 1.54 5.52 0 10-4.48 10-10S17.52 2 12.004 2zm5.72 13.91c-.24.68-1.2 1.24-1.93 1.39-.49.1-1.13.17-3.29-.71-2.76-1.12-4.53-3.93-4.67-4.12-.14-.19-1.14-1.51-1.14-2.87a3 3 0 01.91-2.22c.26-.26.56-.33.75-.33h.49c.16 0 .37.01.53.39.17.41.59 1.43.64 1.54.05.11.09.24.01.39-.08.15-.12.24-.24.38-.12.14-.25.31-.36.42-.12.12-.25.25-.11.49.14.24.63 1.03 1.35 1.67.92.82 1.7 1.07 1.94 1.19.24.12.38.1.52-.06.14-.16.59-.69.75-.92.16-.23.32-.19.53-.11.22.08 1.37.65 1.61.76.24.12.4.17.46.28.06.11.06.64-.18 1.32z"/>
                   </svg>
                </a>
             </div>

             {/* 3. Кликабельный номер телефона */}
             <a 
                href={`tel:${COMPANY_NAP.phoneRaw}`} 
                onClick={async () => {
                   const { handleTrackedClick } = await import("@/lib/clickTracker");
                   handleTrackedClick({ type: "phone", source: "Header" });
                }}
                className="group flex items-center gap-2.5 font-bold text-slate-800 transition duration-300 border-r border-slate-200 pr-5 whitespace-nowrap text-sm hover:scale-[1.02] active:scale-[0.98]"
             >
                <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-orange-500 transition-all duration-300 group-hover:bg-orange-500/10 group-hover:border-orange-500/30 group-hover:text-orange-600 group-hover:rotate-[15deg]">
                   <Phone className="w-3.5 h-3.5"/>
                </div>
                <div className="text-left leading-tight">
                   <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-bold transition-colors duration-300 group-hover:text-slate-500">Связь круглосуточно</span>
                   <span className="text-slate-800 transition-colors duration-300 group-hover:text-orange-600">{COMPANY_NAP.phone}</span>
                </div>
             </a>

             <Button 
                onClick={() => openConsultation({
                  source: "Хедер (Кнопка заявки)",
                  title: "Быстрая консультация",
                  subtitle: "Оставьте ваши контакты. Наш специалист перезвонит в течение 15 минут для консультации.",
                  buttonText: "Получить консультацию"
                })}
                variant="solid"
                className="py-2.5 px-5 text-xs uppercase tracking-wider whitespace-nowrap font-extrabold"
             >
                Получить консультацию
             </Button>

             {/* 5. Иконка входа в личный кабинет */}
             <Button 
                href="/admin/leads"
                variant="lightGlass"
                className={`w-9 h-9 p-0 rounded-xl flex items-center justify-center group shadow-sm hover:shadow-md transition duration-300 ${
                  isAdminActive 
                    ? "bg-orange-50 border-orange-500/50 text-orange-600 shadow-orange-100/50" 
                    : "bg-white border-slate-200 text-slate-700 hover:text-orange-500 hover:border-orange-500/30"
                }`}
                title="Панель администратора"
                aria-label="Панель администратора"
              >
                <User className={`w-4 h-4 transition-all duration-300 group-hover:scale-110 ${
                  isAdminActive ? "text-orange-600 scale-110" : "group-hover:text-orange-500"
                }`}/>
             </Button>

             {/* 6. Кнопка меню на десктопе */}
             {/* 6. Кнопка меню на десктопе */}
             <button 
                className="flex items-center gap-2 py-2 px-4 bg-white border border-slate-200 text-slate-800 hover:text-orange-600 hover:border-orange-500/30 rounded-xl transition-colors duration-300 group shadow-sm hover:shadow-md cursor-pointer select-none active:scale-95"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
             >
                <span className="text-xs font-extrabold uppercase tracking-wider transition-colors duration-300 group-hover:text-orange-600">МЕНЮ</span>
                {isOpen ? (
                   <X className="w-4 h-4 text-orange-500 transition-transform duration-300 group-hover:rotate-90"/>
                ) : (
                   <Menu className="w-4 h-4 text-slate-600 group-hover:text-orange-500 transition-colors duration-300"/>
                )}
             </button>
          </div>

          {/* МОБИЛЬНЫЕ КНОПКИ БЫСТРОЙ СВЯЗИ (WhatsApp, Instagram, Звонок) — видны до lg:hidden */}
          <div className="flex lg:hidden items-center gap-2">
            {/* WhatsApp */}
            <a
              href={COMPANY_NAP.socials.whatsapp}
              target="_blank"
              rel="nofollow noreferrer"
              onClick={async (e) => {
                e.preventDefault();
                const { getTrackedWhatsappUrl } = await import("@/lib/clickTracker");
                const url = await getTrackedWhatsappUrl("77071356701", "Здравствуйте! Хочу заказать вывеску.", "Header Mobile Quick Icon");
                window.open(url, "_blank");
              }}
              className="w-9 h-9 rounded-xl bg-green-50 border border-green-200/80 flex items-center justify-center text-green-600 hover:bg-green-500 hover:text-white transition-all active:scale-95 shadow-xs"
              aria-label="WhatsApp"
              title="Написать в WhatsApp"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M12.004 2C6.48 2 2 6.48 2 12c0 2.17.7 4.19 1.89 5.83L2.03 22l4.31-1.83c1.55.98 3.39 1.54 5.37 1.54 5.52 0 10-4.48 10-10S17.52 2 12.004 2zm5.72 13.91c-.24.68-1.2 1.24-1.93 1.39-.49.1-1.13.17-3.29-.71-2.76-1.12-4.53-3.93-4.67-4.12-.14-.19-1.14-1.51-1.14-2.87a3 3 0 01.91-2.22c.26-.26.56-.33.75-.33h.49c.16 0 .37.01.53.39.17.41.59 1.43.64 1.54.05.11.09.24.01.39-.08.15-.12.24-.24.38-.12.14-.25.31-.36.42-.12.12-.25.25-.11.49.14.24.63 1.03 1.35 1.67.92.82 1.7 1.07 1.94 1.19.24.12.38.1.52-.06.14-.16.59-.69.75-.92.16-.23.32-.19.53-.11.22.08 1.37.65 1.61.76.24.12.4.17.46.28.06.11.06.64-.18 1.32z" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href={COMPANY_NAP.socials.instagram}
              target="_blank"
              rel="nofollow noreferrer"
              onClick={() => trackClientConversion('click_instagram', { page_location: typeof window !== 'undefined' ? window.location.href : '', form_name: 'Header Mobile Quick Instagram' })}
              className="w-9 h-9 rounded-xl bg-pink-50 border border-pink-200/80 flex items-center justify-center text-pink-600 hover:bg-pink-600 hover:text-white transition-all active:scale-95 shadow-xs"
              aria-label="Instagram"
              title="Наш Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>

            {/* Звонок */}
            <a
              href={`tel:${COMPANY_NAP.phoneRaw}`}
              onClick={async () => {
                const { handleTrackedClick } = await import("@/lib/clickTracker");
                handleTrackedClick({ type: "phone", source: "Header Mobile Quick Phone" });
              }}
              className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200/80 flex items-center justify-center text-orange-600 hover:bg-orange-500 hover:text-white transition-all active:scale-95 shadow-xs"
              aria-label="Позвонить"
              title="Позвонить"
            >
              <Phone className="w-4 h-4" />
            </a>

            {/* КНОПКА МЕНЮ (БУРГЕР) */}
            <button 
               className="flex items-center gap-2.5 py-2 px-3 sm:py-2.5 sm:px-5 bg-white border border-slate-200 text-slate-800 hover:text-orange-600 hover:border-orange-500/30 rounded-xl transition-colors duration-300 group shadow-sm hover:shadow-md cursor-pointer select-none active:scale-95 ml-1"
               onClick={() => setIsOpen((prev) => !prev)}
               aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
            >
               <span className="hidden sm:inline text-xs font-extrabold uppercase tracking-wider transition-colors duration-300 group-hover:text-orange-600">Меню</span>
               {isOpen ? (
                  <X className="w-4 h-4 text-orange-500 transition-transform duration-300 group-hover:rotate-90"/>
               ) : (
                  <Menu className="w-4 h-4 text-slate-600 group-hover:text-orange-500 transition-colors duration-300"/>
               )}
            </button>
          </div>
        </div>
      </header>

      {/* Выносной подкомпонент мобильного меню */}
      <MobileMenu 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}