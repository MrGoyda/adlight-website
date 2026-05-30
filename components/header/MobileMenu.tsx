"use client";

import React from "react";
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
import { motion, useMotionValue, useTransform, animate, type PanInfo } from "framer-motion";

import { CATALOG_SERVICES } from "@/dictionaries/services/catalog-services";
import { VOLUME_LETTERS_CATALOG } from "@/dictionaries/services/volume-letters";
import { COMPANY_NAP } from "@/dictionaries/common";
import Button from "@/components/ui/Button";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenConsultation: () => void;
  /** Позволяет родителю получить функцию закрытия с анимацией для вызова снаружи */
  registerClose?: (fn: () => void) => void;
}

// Порог: если сдвинуто правее — меню закрывается
const CLOSE_OFFSET = 110;
const CLOSE_VELOCITY = 400;

export default function MobileMenu({ isOpen, onClose, onOpenConsultation, registerClose }: MobileMenuProps) {
  const [shouldRender, setShouldRender] = React.useState(false);
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);
  const [isLettersOpen, setIsLettersOpen] = React.useState(false);

  // x — единственный источник истины.
  // Начинаем за пределами экрана (вправо), animate подтягивает к 0.
  const x = useMotionValue(500);

  // Оверлей: 0px → opacity 1,  300px → opacity 0
  const overlayOpacity = useTransform(x, [0, 300], [1, 0]);

  const triggerHaptic = (type: "light" | "medium" = "light") => {
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(type === "light" ? 10 : 25);
    }
  };

  // --- Анимация открытия ---
  React.useEffect(() => {
    if (isOpen) {
      // Сначала монтируем за экраном
      x.set(typeof window !== "undefined" ? window.innerWidth : 500);
      setShouldRender(true);
      triggerHaptic("light");
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Запускаем slide-in после рендера (через rAF чтобы не было флеша)
  React.useEffect(() => {
    if (shouldRender && isOpen) {
      const raf = requestAnimationFrame(() => {
        animate(x, 0, { type: "spring", stiffness: 380, damping: 32, mass: 0.9 });
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [shouldRender, isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // --- Анимация закрытия ---
  const isClosing = React.useRef(false);

  const closeDrawer = React.useCallback(() => {
    if (isClosing.current) return;
    isClosing.current = true;
    const target = typeof window !== "undefined" ? window.innerWidth : 500;
    animate(x, target, {
      type: "spring",
      stiffness: 380,
      damping: 32,
      mass: 0.9,
    }).then(() => {
      isClosing.current = false;
      setShouldRender(false);
      setActiveCategory(null);
      setIsLettersOpen(false);
      onClose();
    });
  }, [x, onClose]);

  // Регистрируем closeDrawer у родителя (для бургера)
  React.useEffect(() => {
    registerClose?.(closeDrawer);
  }, [registerClose, closeDrawer]);

  // Если родитель сбросил isOpen напрямую — анимируем закрытие
  React.useEffect(() => {
    if (!isOpen && shouldRender && !isClosing.current) {
      closeDrawer();
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // --- Drag обработчики ---
  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const { offset, velocity } = info;
    if (offset.x > CLOSE_OFFSET || velocity.x > CLOSE_VELOCITY) {
      triggerHaptic("medium");
      closeDrawer();
    } else {
      // Snap-back
      animate(x, 0, { type: "spring", stiffness: 450, damping: 35 });
    }
  };

  if (!shouldRender) return null;

  return (
    <>
      {/* ── Оверлей ── */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[90] h-dvh w-screen"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* ── Боковая шторка ── */}
      <motion.div
        style={{ x }}
        drag="x"
        dragDirectionLock
        dragConstraints={{ left: 0, right: Infinity }}
        dragElastic={{ left: 0.01, right: 0.12 }}
        onDragEnd={handleDragEnd}
        className="fixed top-0 right-0 h-dvh w-full sm:w-[460px] bg-white border-l border-slate-200 z-[100] shadow-2xl flex flex-col touch-pan-y will-change-transform"
        role="dialog"
        aria-modal="true"
        aria-label="Навигационное меню"
      >
        {/* Drag Handle — пилюля (только мобиле) */}
        <div className="sm:hidden flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-slate-300" aria-hidden="true" />
        </div>

        {/* ── Шапка ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white shrink-0">
          <span className="text-sm font-black text-slate-900 tracking-widest uppercase">
            Навигация по сайту
          </span>
          <button
            onClick={() => { triggerHaptic(); closeDrawer(); }}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer active:scale-95"
            aria-label="Закрыть меню"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Прокручиваемый контент ── */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-6 space-y-8 scrollbar-thin scrollbar-thumb-slate-200">

          {/* Основные страницы */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
              Основные страницы
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { href: "/",            label: "Главная" },
                { href: "/portfolio",   label: "Портфолио" },
                { href: "/design-code", label: "Дизайн-код" },
                { href: "/contacts",    label: "Контакты" },
              ].map((page) => (
                <Link
                  key={page.href}
                  href={page.href}
                  className="flex items-center justify-center text-sm font-extrabold text-slate-700 p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 hover:border-orange-500/20 hover:bg-slate-100/50 hover:text-orange-600 transition duration-200 text-center active:scale-[0.97]"
                  onClick={() => { triggerHaptic(); closeDrawer(); }}
                >
                  {page.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Каталог конструкций */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
              Каталог конструкций
            </h4>
            <div className="space-y-2.5">
              {CATALOG_SERVICES.map((group) => {
                const isActive = activeCategory === group.id;
                return (
                  <div key={group.id} className="border border-slate-200 rounded-2xl bg-slate-50/50 overflow-hidden">
                    <button
                      onClick={() => setActiveCategory(isActive ? null : group.id)}
                      className="w-full flex items-center justify-between p-4 hover:bg-slate-100/60 transition duration-200 text-left cursor-pointer"
                    >
                      <span className="font-extrabold text-sm text-slate-800">{group.category}</span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isActive ? "rotate-180 text-orange-600" : ""}`} />
                    </button>
                    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isActive ? "max-h-[500px] opacity-100 border-t border-slate-200" : "max-h-0 opacity-0"}`}>
                      <div className="p-3 bg-white grid gap-1">
                        {group.items.map((item, idx) => (
                          <Link
                            key={idx}
                            href={item.link}
                            className="flex items-center justify-between p-2.5 rounded-lg text-xs font-bold text-slate-600 hover:text-orange-600 hover:bg-slate-50 transition duration-200"
                            onClick={() => { triggerHaptic(); closeDrawer(); }}
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
              onClick={() => setIsLettersOpen(!isLettersOpen)}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-100/60 transition duration-200 text-left cursor-pointer"
            >
              <span className="font-extrabold text-sm text-slate-800">Технологии объемных букв</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isLettersOpen ? "rotate-180 text-orange-600" : ""}`} />
            </button>
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isLettersOpen ? "max-h-[500px] opacity-100 border-t border-slate-200" : "max-h-0 opacity-0"}`}>
              <div className="p-3 bg-white grid gap-1">
                <Link
                  href="/services/volume-letters"
                  className="flex items-center justify-between p-2.5 rounded-lg text-xs font-black text-orange-600 bg-orange-50/60 hover:text-orange-700 hover:bg-orange-50 transition duration-200"
                  onClick={() => { triggerHaptic(); closeDrawer(); }}
                >
                  <span>Все виды объемных букв</span>
                  <ChevronRight className="w-3.5 h-3.5 text-orange-500" />
                </Link>
                {VOLUME_LETTERS_CATALOG.map((tech) => (
                  <Link
                    key={tech.id}
                    href={`/services/volume-letters/${tech.slug}`}
                    className="flex items-center justify-between p-2.5 rounded-lg text-xs font-bold text-slate-600 hover:text-orange-600 hover:bg-slate-50 transition duration-200"
                    onClick={() => { triggerHaptic(); closeDrawer(); }}
                  >
                    <span>{tech.title}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Инструменты */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 font-sans">
              Инструменты
            </h4>
            <Link
              href="/calculator"
              className="flex items-center justify-between p-4 rounded-2xl bg-orange-50 border border-orange-200/50 text-orange-600 hover:text-orange-700 hover:bg-orange-100/50 transition duration-300 active:scale-[0.98]"
              onClick={() => { triggerHaptic(); closeDrawer(); }}
            >
              <span className="flex items-center gap-3 font-extrabold text-sm">
                <Calculator className="w-5 h-5" />
                Онлайн-калькулятор вывесок
              </span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Контактные данные */}
          <div className="p-5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-4 text-left">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Контактная информация
            </h4>
            <div className="space-y-3.5 text-xs font-semibold text-slate-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-900 font-extrabold block">Наше производство:</span>
                  <span>г. {COMPANY_NAP.locality}, {COMPANY_NAP.address}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                <div>
                  <span className="text-slate-900 font-extrabold block">Телефон:</span>
                  <a href={`tel:${COMPANY_NAP.phoneRaw}`} className="hover:text-orange-600 transition">
                    {COMPANY_NAP.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                <div>
                  <span className="text-slate-900 font-extrabold block">Email:</span>
                  <a href={`mailto:${COMPANY_NAP.email}`} className="hover:text-orange-600 transition">
                    {COMPANY_NAP.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
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
        <div className="p-6 pb-safe-6 bg-slate-50 border-t border-slate-200 space-y-4 shrink-0">
          <div className="flex justify-center gap-5">
            <a
              href={COMPANY_NAP.socials.instagram}
              target="_blank"
              rel="nofollow noreferrer"
              className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-pink-600 hover:text-white hover:border-transparent transition-all duration-300 shadow-sm active:scale-95"
              aria-label="Наш Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href={COMPANY_NAP.socials.telegram}
              target="_blank"
              rel="nofollow noreferrer"
              className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-blue-500 hover:text-white hover:border-transparent transition-all duration-300 shadow-sm active:scale-95"
              aria-label="Наш Telegram"
            >
              <Send className="w-5 h-5 ml-0.5" />
            </a>
            <a
              href={COMPANY_NAP.socials.whatsapp}
              target="_blank"
              rel="nofollow noreferrer"
              className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-green-500 hover:text-white hover:border-transparent transition-all duration-300 shadow-sm active:scale-95"
              aria-label="Наш WhatsApp"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12.004 2C6.48 2 2 6.48 2 12c0 2.17.7 4.19 1.89 5.83L2.03 22l4.31-1.83c1.55.98 3.39 1.54 5.37 1.54 5.52 0 10-4.48 10-10S17.52 2 12.004 2zm5.72 13.91c-.24.68-1.2 1.24-1.93 1.39-.49.1-1.13.17-3.29-.71-2.76-1.12-4.53-3.93-4.67-4.12-.14-.19-1.14-1.51-1.14-2.87a3 3 0 01.91-2.22c.26-.26.56-.33.75-.33h.49c.16 0 .37.01.53.39.17.41.59 1.43.64 1.54.05.11.09.24.01.39-.08.15-.12.24-.24.38-.12.14-.25.31-.36.42-.12.12-.25.25-.11.49.14.24.63 1.03 1.35 1.67.92.82 1.7 1.07 1.94 1.19.24.12.38.1.52-.06.14-.16.59-.69.75-.92.16-.23.32-.19.53-.11.22.08 1.37.65 1.61.76.24.12.4.17.46.28.06.11.06.64-.18 1.32z" />
              </svg>
            </a>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="lightGlass"
              className="w-full text-slate-800 border border-slate-200 text-xs py-3.5"
              onClick={() => { triggerHaptic(); closeDrawer(); }}
            >
              <span className="flex items-center gap-2 justify-center">
                <User className="w-4 h-4" /> Кабинет
              </span>
            </Button>
            <Button
              variant="solid"
              onClick={() => { triggerHaptic("medium"); closeDrawer(); onOpenConsultation(); }}
              className="w-full py-3.5 text-xs font-extrabold"
            >
              <span className="flex items-center gap-2 justify-center">
                <FileText className="w-4 h-4" /> Оставить заявку
              </span>
            </Button>
          </div>
        </div>

      </motion.div>
    </>
  );
}
