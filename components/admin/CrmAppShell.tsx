"use client";

import React, { useState, useEffect } from "react";
import CrmSidebar from "./CrmSidebar";
import CrmTopBar from "./CrmTopBar";
import CrmBottomBar from "./CrmBottomBar";
import CrmCommandPalette from "./CrmCommandPalette";
import { useCrmRealtime } from "@/lib/useCrmRealtime";

export default function CrmAppShell({ children }: { children: React.ReactNode }) {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Подключение фонового Realtime слушателя событий Supabase
  useCrmRealtime();

  // Глобальный перехват Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="h-[100dvh] w-full bg-slate-50 text-slate-900 flex overflow-hidden font-sans selection:bg-orange-500 selection:text-white antialiased">
      {/* ── Левый сайдбар (Linear style, десктоп) ── */}
      <CrmSidebar onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />

      {/* ── Центральная рабочая область ── */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        {/* Верхняя тонкая статус-строка с хлебными крошками и действиями */}
        <CrmTopBar 
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} 
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)} 
        />

        {/* Прокручиваемый рабочий контент с аппаратным ускорением скролла */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain [transform:translateZ(0)] p-3 sm:p-5 lg:p-6 pb-24 lg:pb-6">
          {children}
        </main>
      </div>

      {/* ── Мобильный нативный Bottom Dock ── */}
      <CrmBottomBar 
        isMenuOpen={isMobileMenuOpen} 
        setIsMenuOpen={setIsMobileMenuOpen} 
      />

      {/* ── Глобальная командная строка Cmd+K ── */}
      <CrmCommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)} 
      />
    </div>
  );
}
