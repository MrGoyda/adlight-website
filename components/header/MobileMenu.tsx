"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { triggerHaptic } from "@/lib/haptics";
import { useSwipeToClose } from "./mobile-menu/useSwipeToClose";
import MobileMenuHeader from "./mobile-menu/MobileMenuHeader";
import MobileMenuNavLinks from "./mobile-menu/MobileMenuNavLinks";
import MobileMenuCatalog from "./mobile-menu/MobileMenuCatalog";
import MobileMenuLetters from "./mobile-menu/MobileMenuLetters";
import MobileMenuContacts from "./mobile-menu/MobileMenuContacts";
import MobileMenuFooter from "./mobile-menu/MobileMenuFooter";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  registerClose?: (fn: () => void) => void;
}

export default function MobileMenu({
  isOpen,
  onClose,
  registerClose,
}: MobileMenuProps) {
  const [mounted, setMounted] = useState(false);
  const { drawerRef, handleTouchStart, handleTouchMove, handleTouchEnd } = useSwipeToClose(onClose);

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

  const handleLinkClick = useCallback(() => {
    triggerHaptic("light");
    onClose();
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9990] pointer-events-none"
      aria-hidden={!isOpen}
    >
      {/* Затемняющий оверлей */}
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

      {/* Выдвижная шторка */}
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
        {/* Индикатор-хватка свайпа для мобильных */}
        <div
          className="sm:hidden absolute left-0 top-0 bottom-0 w-5 flex items-center justify-center z-10"
          aria-hidden="true"
        >
          <div className="relative flex items-center justify-center h-full w-full">
            <div
              className={`w-1 rounded-full bg-slate-300 transition-all duration-500 ${
                isOpen ? "h-16 opacity-100" : "h-8 opacity-0"
              }`}
            >
              <div
                className={`absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-orange-400 transition-opacity duration-700 ${
                  isOpen ? "opacity-100 animate-pulse" : "opacity-0"
                }`}
              />
            </div>
          </div>
        </div>

        <MobileMenuHeader onClose={onClose} />

        {/* Прокручиваемый контент */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 space-y-6">
          <MobileMenuNavLinks onLinkClick={handleLinkClick} />
          <MobileMenuCatalog onLinkClick={handleLinkClick} />
          <MobileMenuLetters onLinkClick={handleLinkClick} />
          <MobileMenuContacts onLinkClick={handleLinkClick} />
        </div>

        <MobileMenuFooter onClose={onClose} onLinkClick={handleLinkClick} />
      </div>
    </div>,
    document.body
  );
}
