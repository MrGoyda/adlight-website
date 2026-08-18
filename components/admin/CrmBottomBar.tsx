"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Inbox, 
  Wallet, 
  Plus, 
  FolderKanban, 
  BarChart3, 
  X, 
  UserPlus, 
  Calculator, 
  Building2 
} from "lucide-react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { triggerHaptic } from "@/lib/haptics";
import { CRM_EVENTS, dispatchCrmEvent } from "@/lib/crmEvents";

export default function CrmBottomBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);

  const navItems = [
    {
      label: "Заявки",
      href: "/admin/leads",
      icon: Inbox,
      badge: "3",
    },
    {
      label: "Финансы",
      href: "/admin/finance",
      icon: Wallet,
    },
    // Кнопка ПЛЮС (Action Button)
    {
      isAction: true,
    },
    {
      label: "Проекты",
      href: "/admin/projects",
      icon: FolderKanban,
    },
    {
      label: "Аналитика",
      href: "/admin/analytics",
      icon: BarChart3,
    },
  ];

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 100 || info.velocity.y > 500) {
      triggerHaptic("light");
      setIsActionSheetOpen(false);
    }
  };

  const handleAction = (action: "lead" | "estimate" | "client") => {
    triggerHaptic("light");
    setIsActionSheetOpen(false);

    if (action === "lead") {
      if (pathname === "/admin/leads") {
        dispatchCrmEvent(CRM_EVENTS.OPEN_CREATE_LEAD);
      } else {
        router.push("/admin/leads?action=create-lead");
      }
    } else if (action === "estimate") {
      if (pathname === "/admin/leads") {
        dispatchCrmEvent(CRM_EVENTS.OPEN_ESTIMATE);
      } else {
        router.push("/admin/leads?action=estimate");
      }
    } else if (action === "client") {
      if (pathname === "/admin/leads" || pathname === "/admin/clients") {
        dispatchCrmEvent(CRM_EVENTS.OPEN_CREATE_CLIENT);
      } else {
        router.push("/admin/clients?action=create-client");
      }
    }
  };

  return (
    <>
      {/* ── Нижний фиксированный нативный таббар в светлой теме ── */}
      <div className="fixed bottom-0 left-0 right-0 z-[80] lg:hidden bg-white/95 border-t border-slate-200/80 backdrop-blur-md px-2 py-1.5 pb-safe select-none shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-around relative max-w-md mx-auto">
          {navItems.map((item) => {
            if (item.isAction) {
              return (
                <div key="action-plus" className="relative -top-4 flex items-center justify-center">
                  <button
                    onClick={() => {
                      triggerHaptic("light");
                      setIsActionSheetOpen(!isActionSheetOpen);
                    }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-transform duration-300 active:scale-90 border-2 border-white cursor-pointer ${
                      isActionSheetOpen 
                        ? "bg-slate-800 rotate-45" 
                        : "bg-gradient-to-tr from-orange-500 to-amber-500 shadow-orange-500/30"
                    }`}
                    aria-label="Быстрое действие"
                  >
                    <Plus className="w-6 h-6 stroke-[3]" />
                  </button>
                </div>
              );
            }

            const Icon = item.icon!;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href!}
                onClick={() => {
                  triggerHaptic("light");
                  setIsActionSheetOpen(false);
                }}
                className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition duration-150 relative ${
                  isActive ? "text-orange-600" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {item.badge && pathname !== item.href && (
                    <span className="absolute -top-1.5 -right-2 bg-orange-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] mt-1 tracking-tight ${isActive ? "font-black" : "font-semibold"}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Плавная мобильная шторка (iOS Bottom Sheet) с поддержкой свайпа вниз ── */}
      <AnimatePresence>
        {isActionSheetOpen && (
          <>
            {/* Оверлей с блюром */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[90] lg:hidden bg-slate-900/40 backdrop-blur-xs cursor-pointer"
              onClick={() => setIsActionSheetOpen(false)}
            />

            {/* Выдвигающаяся снизу шторка */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 32, mass: 0.8 }}
              drag="y"
              dragDirectionLock
              dragConstraints={{ top: 0, bottom: 300 }}
              dragElastic={{ top: 0, bottom: 0.2 }}
              onDragEnd={handleDragEnd}
              className="fixed bottom-0 left-0 right-0 z-[100] lg:hidden bg-white rounded-t-3xl border-t border-slate-200 shadow-2xl p-4 pb-safe select-none space-y-3 touch-pan-y"
            >
              {/* Полоска-индикатор для свайпа закрытия */}
              <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto" />

              <div className="flex items-center justify-between px-2 pb-1">
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                  Быстрые действия
                </span>
                <button 
                  onClick={() => setIsActionSheetOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid gap-2">
                {/* Новая сделка */}
                <button
                  type="button"
                  onClick={() => handleAction("lead")}
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-orange-50 border border-orange-200/80 text-orange-600 font-extrabold text-xs hover:bg-orange-100/60 transition text-left cursor-pointer active:scale-[0.98]"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/20">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-sm font-extrabold text-slate-900">Новая Заявка (Лид)</span>
                    <span className="text-[11px] text-slate-500 font-medium block">Зарегистрировать сделку или замер</span>
                  </div>
                </button>

                {/* Создать смету */}
                <button
                  type="button"
                  onClick={() => handleAction("estimate")}
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-900 font-extrabold text-xs hover:bg-amber-100/60 transition text-left cursor-pointer active:scale-[0.98]"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-sm font-extrabold text-slate-900">Калькулятор Сметы</span>
                    <span className="text-[11px] text-slate-500 font-medium block">Расчет материалов, ЗП и наценки</span>
                  </div>
                </button>

                {/* Новый клиент */}
                <button
                  type="button"
                  onClick={() => handleAction("client")}
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-blue-900 font-extrabold text-xs hover:bg-blue-100/60 transition text-left cursor-pointer active:scale-[0.98]"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-sm font-extrabold text-slate-900">Новый Клиент</span>
                    <span className="text-[11px] text-slate-500 font-medium block">Внести контакт или компанию в базу</span>
                  </div>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
