"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Inbox, 
  Wallet, 
  FolderKanban, 
  Plus, 
  Menu, 
  X, 
  UserPlus, 
  DollarSign, 
  Building2, 
  Calculator, 
  Warehouse, 
  Tags, 
  Users, 
  BarChart3, 
  MousePointer, 
  LogOut 
} from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { CRM_EVENTS, dispatchCrmEvent } from "@/lib/crmEvents";
import { createClient } from "@/lib/supabase/client";
import BottomSheet from "@/components/ui/BottomSheet";

export default function CrmBottomBar({
  isMenuOpen,
  setIsMenuOpen,
}: {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);

  const handleAction = (type: "lead" | "expense" | "client" | "estimate") => {
    triggerHaptic("medium");
    setIsActionSheetOpen(false);

    if (type === "lead") {
      if (pathname === "/admin/leads") {
        dispatchCrmEvent(CRM_EVENTS.OPEN_CREATE_LEAD);
      } else {
        router.push("/admin/leads?action=create-lead");
      }
    } else if (type === "expense") {
      router.push("/admin/finance?action=add-expense");
    } else if (type === "client") {
      if (pathname === "/admin/clients" || pathname === "/admin/leads") {
        dispatchCrmEvent(CRM_EVENTS.OPEN_CREATE_CLIENT);
      } else {
        router.push("/admin/clients?action=create-client");
      }
    } else if (type === "estimate") {
      if (pathname === "/admin/leads") {
        dispatchCrmEvent(CRM_EVENTS.OPEN_ESTIMATE);
      } else {
        router.push("/admin/leads?action=estimate");
      }
    }
  };

  const handleLogout = async () => {
    triggerHaptic("medium");
    setIsMenuOpen(false);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const moreNavItems = [
    { label: "Склад материалов", href: "/admin/warehouse", icon: Warehouse },
    { label: "Тарифы и прайсы", href: "/admin/pricing", icon: Tags },
    { label: "База клиентов", href: "/admin/clients", icon: Users },
    { label: "Компании / Реквизиты", href: "/admin/companies", icon: Building2 },
    { label: "Сквозная аналитика", href: "/admin/analytics", icon: BarChart3 },
    { label: "Реестр кликов", href: "/admin/clicks", icon: MousePointer },
  ];

  return (
    <>
      {/* ── Нижний фиксированный нативный док (только на мобильных) ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 border-t border-slate-200/80 backdrop-blur-xl px-2 py-1 pb-safe select-none shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-around relative max-w-md mx-auto">
          {/* 1. Заявки */}
          <Link
            href="/admin/leads"
            onClick={() => triggerHaptic("light")}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors cursor-pointer ${
              pathname === "/admin/leads"
                ? "text-orange-600 font-semibold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Inbox className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">Заявки</span>
          </Link>

          {/* 2. Касса */}
          <Link
            href="/admin/finance"
            onClick={() => triggerHaptic("light")}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors cursor-pointer ${
              pathname === "/admin/finance"
                ? "text-orange-600 font-semibold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Wallet className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">Касса</span>
          </Link>

          {/* 3. Центральная приподнятая кнопка [+] */}
          <div className="relative -top-3 flex items-center justify-center">
            <button
              type="button"
              onClick={() => {
                triggerHaptic("medium");
                setIsActionSheetOpen(!isActionSheetOpen);
              }}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-xl shadow-orange-500/30 transition-transform duration-200 active:scale-90 border-2 border-white cursor-pointer ${
                isActionSheetOpen
                  ? "bg-slate-800 rotate-45"
                  : "bg-gradient-to-tr from-orange-500 to-amber-500"
              }`}
              aria-label="Быстрое действие"
            >
              <Plus className="w-6 h-6 stroke-[3]" />
            </button>
          </div>

          {/* 4. Проекты */}
          <Link
            href="/admin/projects"
            onClick={() => triggerHaptic("light")}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors cursor-pointer ${
              pathname === "/admin/projects"
                ? "text-orange-600 font-semibold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <FolderKanban className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">Проекты</span>
          </Link>

          {/* 5. Еще (Меню) */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic("light");
              setIsMenuOpen(!isMenuOpen);
            }}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors cursor-pointer ${
              isMenuOpen
                ? "text-orange-600 font-semibold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Menu className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">Еще</span>
          </button>
        </div>
      </nav>

      {/* ── Нижняя шторка быстрых действий (Action Sheet) ── */}
      <BottomSheet
        isOpen={isActionSheetOpen}
        onClose={() => setIsActionSheetOpen(false)}
      >
        <div className="p-4 space-y-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base">Быстрое действие</h3>
            <button
              type="button"
              onClick={() => setIsActionSheetOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => handleAction("lead")}
            className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl bg-orange-50/70 border border-orange-200/60 text-left active:scale-[0.98] transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 shrink-0">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-slate-900 text-sm">Новая заявка (Лид)</div>
              <div className="text-xs text-slate-500">Добавить обращение от клиента</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleAction("expense")}
            className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl bg-red-50/70 border border-red-200/60 text-left active:scale-[0.98] transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center shadow-md shadow-red-500/20 shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-slate-900 text-sm">Внести расход в кассу</div>
              <div className="text-xs text-slate-500">Закуп материалов, аренда, крепеж</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleAction("estimate")}
            className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/60 text-left active:scale-[0.98] transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-slate-900 text-sm">Быстрая смета</div>
              <div className="text-xs text-slate-500">Расчет вывески и конструкций</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleAction("client")}
            className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 text-left active:scale-[0.98] transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-slate-900 text-sm">Новый клиент</div>
              <div className="text-xs text-slate-500">Занесение в постоянную базу</div>
            </div>
          </button>
        </div>
      </BottomSheet>

      {/* ── Нижняя шторка «Еще» (Все остальные разделы CRM) ── */}
      <BottomSheet
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      >
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base">Все разделы CRM</h3>
            <button
              type="button"
              onClick={() => setIsMenuOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {moreNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    triggerHaptic("light");
                    setIsMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                    isActive
                      ? "bg-orange-50 border-orange-200 text-orange-600 font-semibold"
                      : "bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="text-xs font-medium truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl text-red-600 bg-red-50 hover:bg-red-100 text-xs font-semibold transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Выйти из учетной записи</span>
            </button>
          </div>
        </div>
      </BottomSheet>
    </>
  );
}
