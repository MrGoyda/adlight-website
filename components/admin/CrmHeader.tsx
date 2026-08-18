"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Building2, 
  Users, 
  Warehouse, 
  LogOut, 
  ChevronDown, 
  Layers,
  Sparkles,
  MousePointer,
  Inbox,
  Wallet,
  FolderKanban,
  BarChart3,
  Plus,
  UserPlus,
  FileText,
  Tags,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { triggerHaptic } from "@/lib/haptics";

const MAIN_NAV_ITEMS = [
  { label: "Заявки", href: "/admin/leads", icon: Inbox },
  { label: "Финансы", href: "/admin/finance", icon: Wallet },
  { label: "Проекты", href: "/admin/projects", icon: FolderKanban },
  { label: "Аналитика", href: "/admin/analytics", icon: BarChart3 },
];

const SECTION_NAMES: Record<string, string> = {
  "/admin/leads": "Заявки",
  "/admin/clicks": "Реестр кликов",
  "/admin/finance": "Финансы и Касса",
  "/admin/projects": "Проекты и Монтажи",
  "/admin/analytics": "Сквозная Аналитика",
  "/admin/warehouse": "Склад материалов",
  "/admin/pricing": "База товаров и Тарифы",
  "/admin/clients": "База Клиентов",
  "/admin/companies": "Компании и Реквизиты",
};

export default function CrmHeader() {
  const pathname = usePathname();
  const router = useRouter();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isActionDropdownOpen, setIsActionDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const actionDropdownRef = useRef<HTMLDivElement>(null);

  const currentTitle = SECTION_NAMES[pathname] || "Панель управления";

  // Закрытие при клике или тапе вне контейнеров dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsDropdownOpen(false);
      }
      if (actionDropdownRef.current && !actionDropdownRef.current.contains(target)) {
        setIsActionDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const handleAction = (action: "lead" | "estimate" | "client") => {
    triggerHaptic("light");
    setIsActionDropdownOpen(false);

    if (action === "lead") {
      if (pathname === "/admin/leads") {
        window.dispatchEvent(new CustomEvent("crm:open-create-lead"));
      } else {
        router.push("/admin/leads?action=create-lead");
      }
    } else if (action === "estimate") {
      if (pathname === "/admin/leads") {
        window.dispatchEvent(new CustomEvent("crm:open-estimate"));
      } else {
        router.push("/admin/leads?action=estimate");
      }
    } else if (action === "client") {
      if (pathname === "/admin/leads" || pathname === "/admin/clients") {
        window.dispatchEvent(new CustomEvent("crm:open-create-client"));
      } else {
        router.push("/admin/clients?action=create-client");
      }
    }
  };

  const handleLogout = async () => {
    triggerHaptic("light");
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 border-b border-slate-200/80 backdrop-blur-md text-slate-900 select-none shadow-xs">
        <div className="mx-auto px-4 h-14 sm:h-16 flex items-center justify-between gap-3 max-w-7xl">
          
          {/* Бренд + Текущий раздел */}
          <div className="flex items-center gap-3 min-w-0 shrink-0">
            <Link 
              href="/admin/leads" 
              className="flex items-center gap-2 font-black text-slate-900 text-base tracking-tight shrink-0 hover:opacity-90 transition active:scale-95"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://media.adlight.kz/branding/adlight-mark.png"
                alt="ADLight"
                className="w-8 h-8 rounded-xl object-contain shadow-2xs"
              />
              <span className="font-extrabold text-sm sm:text-base hidden xs:inline tracking-tight">ADLight</span>
            </Link>

            <span className="text-slate-300 font-light hidden sm:inline">/</span>
            
            <span className="text-xs sm:text-sm font-extrabold text-slate-700 truncate hidden sm:inline">
              {currentTitle}
            </span>
          </div>

          {/* Десктопная основная навигация */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/60 shadow-2xs">
            {MAIN_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => triggerHaptic("light")}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 ${
                    isActive
                      ? "bg-white text-orange-600 shadow-xs font-black"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-orange-600" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Правая часть: Быстрые действия + Справочники + Выход */}
          <div className="flex items-center gap-2">
            
            {/* Кнопка "Быстрое создание" dropdown */}
            <div className="relative" ref={actionDropdownRef}>
              <button
                onClick={() => {
                  triggerHaptic("light");
                  setIsActionDropdownOpen(!isActionDropdownOpen);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-black shadow-sm transition active:scale-95 cursor-pointer"
              >
                <Plus className={`w-4 h-4 stroke-[3] transition-transform duration-200 ${isActionDropdownOpen ? "rotate-45" : ""}`} />
                <span className="hidden sm:inline">Создать</span>
                <ChevronDown className={`w-3 h-3 text-orange-200 transition-transform duration-200 ${isActionDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {isActionDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 z-50 text-xs font-semibold animate-in fade-in zoom-in-95 duration-150 space-y-1">
                  <div className="px-2 py-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Быстрое создание
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAction("lead")}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-orange-50 hover:text-orange-600 font-bold transition text-left cursor-pointer active:scale-95"
                  >
                    <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                      <UserPlus className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-xs font-extrabold text-slate-900">Новая Заявка (Лид)</span>
                      <span className="text-[10px] text-slate-400 font-normal">Зарегистрировать входящий контакт</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAction("estimate")}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-amber-50 hover:text-amber-600 font-bold transition text-left cursor-pointer active:scale-95"
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-xs font-extrabold text-slate-900">Создать Смету</span>
                      <span className="text-[10px] text-slate-400 font-normal">Рассчитать стоимость и наценку</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAction("client")}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-blue-50 hover:text-blue-600 font-bold transition text-left cursor-pointer active:scale-95"
                  >
                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-xs font-extrabold text-slate-900">Новый Клиент</span>
                      <span className="text-[10px] text-slate-400 font-normal">Внести контакт или компанию</span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Справочники dropdown (Склад, Клиенты, Компании, Клики) */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => {
                  triggerHaptic("light");
                  setIsDropdownOpen(!isDropdownOpen);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/80 hover:bg-slate-100 border border-slate-200/80 text-slate-700 hover:text-slate-900 text-xs font-bold transition active:scale-95 cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-orange-500" />
                <span className="hidden sm:inline">Базы</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 z-50 text-xs font-semibold animate-in fade-in zoom-in-95 duration-150 space-y-1">
                  <div className="px-2 py-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Реестры и Справочники
                  </div>

                  <Link
                    href="/admin/clients"
                    onClick={() => setIsDropdownOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition ${
                      pathname === "/admin/clients" ? "bg-orange-50 text-orange-600 font-bold" : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Users className="w-4 h-4 text-orange-500" />
                    <span>База Клиентов</span>
                  </Link>

                  <Link
                    href="/admin/companies"
                    onClick={() => setIsDropdownOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition ${
                      pathname === "/admin/companies" ? "bg-orange-50 text-orange-600 font-bold" : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-amber-500" />
                    <span>Компании и Реквизиты</span>
                  </Link>

                  <Link
                    href="/admin/pricing"
                    onClick={() => setIsDropdownOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition ${
                      pathname === "/admin/pricing" ? "bg-orange-50 text-orange-600 font-bold" : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Tags className="w-4 h-4 text-orange-500" />
                    <span>База товаров и Тарифы</span>
                  </Link>

                  <Link
                    href="/admin/warehouse"
                    onClick={() => setIsDropdownOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition ${
                      pathname === "/admin/warehouse" ? "bg-orange-50 text-orange-600 font-bold" : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Warehouse className="w-4 h-4 text-blue-500" />
                    <span>Склад материалов</span>
                  </Link>

                  <Link
                    href="/admin/clicks"
                    onClick={() => setIsDropdownOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition ${
                      pathname === "/admin/clicks" ? "bg-orange-50 text-orange-600 font-bold" : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <MousePointer className="w-4 h-4 text-purple-500" />
                    <span>Входящие клики</span>
                  </Link>

                  <div className="h-px bg-slate-100 my-1" />

                  <Link
                    href="/"
                    target="_blank"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition"
                  >
                    <Sparkles className="w-4 h-4 text-slate-400" />
                    <span>Открыть публичный сайт</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Кнопка выхода */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-slate-100/80 hover:bg-rose-50 border border-slate-200/80 hover:border-rose-200 text-slate-500 hover:text-rose-600 transition active:scale-95 cursor-pointer"
              title="Выйти из системы"
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>
        </div>
      </header>
    </>
  );
}
