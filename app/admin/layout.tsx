import React from "react";
import CrmAppShell from "@/components/admin/CrmAppShell";
import ToastProvider from "@/components/ui/ToastProvider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Глобальный менеджер адаптивных всплывающих уведомлений и алертов */}
      <ToastProvider />

      {/* Новый адаптивный каркас CRM: Desktop Sidebar + Mobile Dock + Cmd+K */}
      <CrmAppShell>{children}</CrmAppShell>
    </>
  );
}
