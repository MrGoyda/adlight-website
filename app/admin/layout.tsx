import React from "react";
import CrmHeader from "@/components/admin/CrmHeader";
import CrmBottomBar from "@/components/admin/CrmBottomBar";
import ToastProvider from "@/components/ui/ToastProvider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-[100dvh] w-full bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-orange-500 selection:text-white overflow-hidden relative">
      {/* Глобальный менеджер адаптивных всплывающих уведомлений и алертов */}
      <ToastProvider />

      {/* Изолированная шапка CRM */}
      <CrmHeader />

      {/* Основное прокручиваемое пространство админки с воздухом по бокам */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 overflow-y-auto overscroll-contain pb-24 lg:pb-8">
        {children}
      </main>

      {/* Мобильный единый таббар (Bottom Dock) */}
      <CrmBottomBar />
    </div>
  );
}
