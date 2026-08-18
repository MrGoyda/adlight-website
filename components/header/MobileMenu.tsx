"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  X,
  ChevronDown,
  ChevronRight,
  Calculator,
  Instagram,
  Send,
  User,
  FileText,
  MapPin,
  Phone,
  Clock,
  Mail,
} from "lucide-react";

import { CATALOG_SERVICES } from "@/dictionaries/services/catalog-services";
import { VOLUME_LETTERS_CATALOG } from "@/dictionaries/services/volume-letters";
import { COMPANY_NAP, COMMON_NAV_LINKS } from "@/dictionaries/common";
import Button from "@/components/ui/Button";
import { trackClientConversion } from "@/lib/clientAnalytics";
import { triggerHaptic } from "@/lib/haptics";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenConsultation: () => void;
  registerClose?: (fn: () => void) => void;
}

const SWIPE_CLOSE_THRESHOLD = 80; // px правее — закрыть
const SWIPE_CLOSE_VELOCITY = 0.4; // px/ms — быстрый свайп

export default function MobileMenu({
  isOpen,
  onClose,
  onOpenConsultation,
  registerClose,
}: MobileMenuProps) {
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isLettersOpen, setIsLettersOpen] = useState(false);

  // Ref на саму шторку — для нативного свайпа
  const drawerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);
  const isDragging = useRef(false);
  const isHorizontalSwipe = useRef<boolean | null>(null); // null = ещё не определено

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (registerClose) registerClose(onClose);
  }, [registerClose, onClose]);

  // Блокировка скролла страницы при открытом меню
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Закрытие по Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // ── Нативный свайп закрытия (без framer-motion) ──
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStartX.current = t.clientX;
    touchStartY.current = t.clientY;
    touchStartTime.current = Date.now();
    isDragging.current = false;
    isHorizontalSwipe.current = null;
    if (drawerRef.current) {
      drawerRef.current.style.transition = "none";
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    const dx = t.clientX - touchStartX.current;
    const dy = Math.abs(t.clientY - touchStartY.current);

    // Определяем направление свайпа один раз
    if (isHorizontalSwipe.current === null) {
      if (Math.abs(dx) > 8 || dy > 8) {
        isHorizontalSwipe.current = Math.abs(dx) > dy;
      }
      return;
    }

    // Если вертикальный скролл — не трогаем шторку
    if (!isHorizontalSwipe.current) return;

    // Разрешаем только вправо
    if (dx <= 0) {
      if (drawerRef.current) drawerRef.current.style.transform = "";
      return;
    }

    isDragging.current = true;
    e.preventDefault(); // предотвращаем bounce страницы
    if (drawerRef.current) {
      drawerRef.current.style.transform = `translateX(${dx}px)`;
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) {
      if (drawerRef.current) {
        drawerRef.current.style.transition = "";
        drawerRef.current.style.transform = "";
      }
      return;
    }

    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartX.current;
    const dt = Date.now() - touchStartTime.current;
    const velocity = dx / dt;

    if (drawerRef.current) {
      drawerRef.current.style.transition = "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)";
    }

    if (dx > SWIPE_CLOSE_THRESHOLD || velocity > SWIPE_CLOSE_VELOCITY) {
      // Закрыть
      triggerHaptic("medium");
      if (drawerRef.current) {
        drawerRef.current.style.transform = "translateX(100%)";
      }
      setTimeout(() => {
        if (drawerRef.current) {
          drawerRef.current.style.transform = "";
          drawerRef.current.style.transition = "";
        }
        onClose();
      }, 300);
    } else {
      // Snap back
      if (drawerRef.current) {
        drawerRef.current.style.transform = "";
        drawerRef.current.style.transition = "";
      }
    }

    isDragging.current = false;
  }, [onClose]);

  const handleLinkClick = useCallback(() => {
    triggerHaptic("light");
    onClose();
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    // Всегда в DOM, управляется CSS-классами — нет задержки монтирования
    <div
      className={`fixed inset-0 z-[9990] pointer-events-none`}
      aria-hidden={!isOpen}
    >
      {/* ── Затемняющий оверлей (без backdrop-blur — он убивает производительность) ── */}
      <div
        onClick={() => {
          triggerHaptic("light");
          onClose();
        }}
        className={`absolute inset-0 bg-slate-900/50 transition-opacity duration-300 ease-out cursor-pointer ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      {/* ── Выдвижная шторка ── */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Навигационное меню"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`absolute top-0 right-0 bottom-0 h-dvh w-full sm:w-[460px] bg-white border-l border-slate-200 shadow-2xl flex flex-col will-change-transform pointer-events-auto transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* ── Вертикальная полоска-хватка по левому краю (только мобильные) ── */}
        <div
          className="sm:hidden absolute left-0 top-0 bottom-0 w-5 flex items-center justify-center z-10"
          aria-hidden="true"
        >
          {/* Фоновая зона для удобного захвата — невидимая, но широкая */}
          <div className="relative flex items-center justify-center h-full w-full">
            {/* Сама полоска */}
            <div
              className={`w-1 rounded-full bg-slate-300 transition-all duration-500 ${
                isOpen ? "h-16 opacity-100" : "h-8 opacity-0"
              }`}
            >
              {/* Пульсирующая точка-подсказка сверху */}
              <div
                className={`absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-orange-400 transition-opacity duration-700 ${
                  isOpen ? "opacity-100 animate-pulse" : "opacity-0"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Drag handle сверху (горизонтальный, для совместимости) */}
        <div className="sm:hidden flex justify-center pt-2.5 pb-0 shrink-0">
          <div className="w-10 h-1 rounded-full bg-slate-300" aria-hidden="true" />
        </div>

        {/* ── Шапка ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <span className="text-sm font-black text-slate-900 tracking-widest uppercase">
            Навигация по сайту
          </span>
          <button
            type="button"
            onClick={() => {
              triggerHaptic("light");
              onClose();
            }}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer active:scale-95"
            aria-label="Закрыть меню"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Прокручиваемый контент ── */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 space-y-6">
          {/* Основные страницы */}
          <div className="space-y-2.5">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
              Основные страницы
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {COMMON_NAV_LINKS.filter((link) => link.href !== "/calculator").map((page) => (
                <Link
                  key={page.href}
                  href={page.href}
                  className="flex items-center justify-center text-sm font-extrabold text-slate-700 p-3 rounded-xl bg-slate-50 border border-slate-200/60 hover:border-orange-500/20 hover:bg-slate-100/50 hover:text-orange-600 transition duration-200 text-center active:scale-[0.97]"
                  onClick={handleLinkClick}
                >
                  {page.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Каталог конструкций */}
          <div className="space-y-2.5">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
              Каталог конструкций
            </h4>
            <div className="space-y-2">
              {CATALOG_SERVICES.map((group) => {
                const isActive = activeCategory === group.id;
                return (
                  <div
                    key={group.id}
                    className="border border-slate-200 rounded-2xl bg-slate-50/50 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic("light");
                        setActiveCategory(isActive ? null : group.id);
                      }}
                      className="w-full flex items-center justify-between p-3.5 hover:bg-slate-100/60 transition duration-200 text-left cursor-pointer"
                    >
                      <span className="font-extrabold text-sm text-slate-800">{group.category}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                          isActive ? "rotate-180 text-orange-600" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        isActive
                          ? "max-h-[500px] opacity-100 border-t border-slate-200"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="p-2.5 bg-white grid gap-1">
                        {group.items.map((item, idx) => (
                          <Link
                            key={idx}
                            href={item.link}
                            className="flex items-center justify-between p-2.5 rounded-lg text-xs font-bold text-slate-600 hover:text-orange-600 hover:bg-slate-50 transition duration-200"
                            onClick={handleLinkClick}
                          >
                            <span>{item.title}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Технологии объёмных букв */}
          <div className="border border-slate-200 rounded-2xl bg-slate-50/50 overflow-hidden">
            <button
              type="button"
              onClick={() => {
                triggerHaptic("light");
                setIsLettersOpen(!isLettersOpen);
              }}
              className="w-full flex items-center justify-between p-3.5 hover:bg-slate-100/60 transition duration-200 text-left cursor-pointer"
            >
              <span className="font-extrabold text-sm text-slate-800">Технологии объемных букв</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                  isLettersOpen ? "rotate-180 text-orange-600" : ""
                }`}
              />
            </button>
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isLettersOpen
                  ? "max-h-[600px] opacity-100 border-t border-slate-200"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="p-2.5 bg-white grid gap-1">
                <Link
                  href="/services/volume-letters"
                  className="flex items-center justify-between p-2.5 rounded-lg text-xs font-black text-orange-600 bg-orange-50/60 hover:text-orange-700 hover:bg-orange-50 transition duration-200"
                  onClick={handleLinkClick}
                >
                  <span>Все виды объемных букв</span>
                  <ChevronRight className="w-3.5 h-3.5 text-orange-500" />
                </Link>
                {VOLUME_LETTERS_CATALOG.map((tech) => (
                  <Link
                    key={tech.id}
                    href={`/services/volume-letters/${tech.slug}`}
                    className="flex items-center justify-between p-2.5 rounded-lg text-xs font-bold text-slate-600 hover:text-orange-600 hover:bg-slate-50 transition duration-200"
                    onClick={handleLinkClick}
                  >
                    <span>{tech.title}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Инструменты */}
          <div className="space-y-2.5">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
              Инструменты
            </h4>
            <Link
              href="/calculator"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-orange-50 border border-orange-200/50 text-orange-600 hover:text-orange-700 hover:bg-orange-100/50 transition duration-300 active:scale-[0.98]"
              onClick={handleLinkClick}
            >
              <span className="flex items-center gap-3 font-extrabold text-sm">
                <Calculator className="w-5 h-5" />
                Онлайн-калькулятор вывесок
              </span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Контактные данные */}
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3 text-left">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Контактная информация
            </h4>
            <div className="space-y-2.5 text-xs font-semibold text-slate-700">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-900 font-extrabold block">Наше производство:</span>
                  <span>г. {COMPANY_NAP.locality}, {COMPANY_NAP.address}</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                <div>
                  <span className="text-slate-900 font-extrabold block">Телефон:</span>
                  <a href={`tel:${COMPANY_NAP.phoneRaw}`} className="hover:text-orange-600 transition">
                    {COMPANY_NAP.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                <div>
                  <span className="text-slate-900 font-extrabold block">Email:</span>
                  <a href={`mailto:${COMPANY_NAP.email}`} className="hover:text-orange-600 transition">
                    {COMPANY_NAP.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-900 font-extrabold block">Часы работы цеха:</span>
                  <span>{COMPANY_NAP.workingHours}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer: Соцсети + CTA ── */}
        <div className="px-5 py-4 pb-safe-4 bg-white border-t border-slate-100 space-y-3 shrink-0">
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
              onClick={async (e) => {
                e.preventDefault();
                const { getTrackedWhatsappUrl } = await import("@/lib/clickTracker");
                const url = await getTrackedWhatsappUrl(
                  "77071356701",
                  "Здравствуйте! Хочу заказать вывеску.",
                  "Mobile Menu"
                );
                window.open(url, "_blank");
              }}
              className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-green-500 hover:text-white hover:border-transparent transition-all duration-200 active:scale-90 cursor-pointer"
              aria-label="Наш WhatsApp"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M12.004 2C6.48 2 2 6.48 2 12c0 2.17.7 4.19 1.89 5.83L2.03 22l4.31-1.83c1.55.98 3.39 1.54 5.37 1.54 5.52 0 10-4.48 10-10S17.52 2 12.004 2zm5.72 13.91c-.24.68-1.2 1.24-1.93 1.39-.49.1-1.13.17-3.29-.71-2.76-1.12-4.53-3.93-4.67-4.12-.14-.19-1.14-1.51-1.14-2.87a3 3 0 01.91-2.22c.26-.26.56-.33.75-.33h.49c.16 0 .37.01.53.39.17.41.59 1.43.64 1.54.05.11.09.24.01.39-.08.15-.12.24-.24.38-.12.14-.25.31-.36.42-.12.12-.25.25-.11.49.14.24.63 1.03 1.35 1.67.92.82 1.7 1.07 1.94 1.19.24.12.38.1.52-.06.14-.16.59-.69.75-.92.16-.23.32-.19.53-.11.22.08 1.37.65 1.61.76.24.12.4.17.46.28.06.11.06.64-.18 1.32z" />
              </svg>
            </a>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <Link href="/admin/leads" onClick={handleLinkClick} className="w-full">
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
              onClick={() => {
                triggerHaptic("medium");
                onClose();
                onOpenConsultation();
              }}
              className="w-full py-3 text-xs font-extrabold"
            >
              <span className="flex items-center gap-1.5 justify-center">
                <FileText className="w-3.5 h-3.5" /> Оставить заявку
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
