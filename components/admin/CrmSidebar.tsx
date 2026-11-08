"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Inbox, 
  Wallet, 
  FolderKanban, 
  Warehouse, 
  Tags, 
  Users, 
  Building2, 
  BarChart3, 
  MousePointer, 
  LogOut, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Radio,
  ExternalLink,
  Calculator,
  CheckSquare
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { triggerHaptic } from "@/lib/haptics";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export default function CrmSidebar({
  onOpenCommandPalette,
}: {
  onOpenCommandPalette: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("admin@adlight.kz");

  // Чтение состояния сайдбара из localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("adlight_crm_sidebar_collapsed");
      if (saved !== null) {
        setIsCollapsed(saved === "true");
      }
    } catch {
      // Игнорируем в SSR
    }
  }, []);

  // Получаем текущего пользователя из Supabase
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) {
        setUserEmail(data.user.email);
      }
    });
  }, []);

  const toggleSidebar = () => {
    triggerHaptic("light");
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    try {
      localStorage.setItem("adlight_crm_sidebar_collapsed", String(nextState));
    } catch {
      // Игнорируем
    }
  };

  const handleLogout = async () => {
    triggerHaptic("medium");
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const navGroups: NavGroup[] = [
    {
      title: "ОСНОВНОЕ",
      items: [
        { label: "Заявки", href: "/admin/leads", icon: Inbox },
        { label: "Задачи цеха", href: "/admin/tasks", icon: CheckSquare },
        { label: "Финансы", href: "/admin/finance", icon: Wallet },
        { label: "Проекты цеха", href: "/admin/projects", icon: FolderKanban },
      ],
    },
    {
      title: "ПРОИЗВОДСТВО",
      items: [
        { label: "Склад материалов", href: "/admin/warehouse", icon: Warehouse },
        { label: "Тарифы и прайсы", href: "/admin/pricing", icon: Tags },
        { label: "Калькулятор смет", href: "/admin/calculator", icon: Calculator },
      ],
    },
    {
      title: "БАЗА ДАННЫХ",
      items: [
        { label: "Клиенты", href: "/admin/clients", icon: Users },
        { label: "Компании / Реквизиты", href: "/admin/companies", icon: Building2 },
        { label: "Аналитика", href: "/admin/analytics", icon: BarChart3 },
        { label: "Реестр кликов", href: "/admin/clicks", icon: MousePointer },
      ],
    },
  ];

  return (
    <aside
      className={`hidden lg:flex flex-col bg-white border-r border-slate-200/80 select-none z-30 transition-all duration-300 ease-in-out shrink-0 ${
        isCollapsed ? "w-[76px]" : "w-64"
      }`}
    >
      {/* ── Верхний брендовый блок ── */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100">
        <Link 
          href="/admin/leads"
          className="flex items-center gap-3 overflow-hidden group focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-orange-500/20 shrink-0 group-hover:scale-105 transition-transform">
            AD
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0 transition-opacity duration-200">
              <span className="font-bold text-slate-900 tracking-tight text-base leading-none">
                ADLight
              </span>
              <span className="text-[11px] font-medium text-orange-600/90 tracking-wide mt-1">
                CRM & ERP
              </span>
            </div>
          )}
        </Link>

        {/* Кнопка сворачивания сайдбара */}
        <button
          type="button"
          onClick={toggleSidebar}
          title={isCollapsed ? "Развернуть сайдбар" : "Свернуть сайдбар (Cmd+B)"}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* ── Кнопка быстрого поиска (Cmd+K) ── */}
      <div className="px-3 pt-3 pb-2">
        <button
          type="button"
          onClick={() => {
            triggerHaptic("light");
            onOpenCommandPalette();
          }}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-500 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/60 transition-all cursor-pointer group ${
            isCollapsed ? "justify-center px-0" : "justify-between"
          }`}
          title="Быстрый поиск (Cmd+K)"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
            {!isCollapsed && <span>Поиск...</span>}
          </div>
          {!isCollapsed && (
            <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
              ⌘K
            </kbd>
          )}
        </button>
      </div>

      {/* ── Основная навигация ── */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-5 scrollbar-thin">
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            {!isCollapsed && (
              <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                {group.title}
              </div>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => triggerHaptic("light")}
                  title={isCollapsed ? item.label : undefined}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all group cursor-pointer ${
                    isActive
                      ? "bg-orange-50 text-orange-600 font-semibold shadow-2xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  } ${isCollapsed ? "justify-center px-0" : ""}`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? "text-orange-600" : "text-slate-400 group-hover:text-slate-600"
                    }`}
                  />
                  {!isCollapsed && (
                    <span className="truncate flex-1">{item.label}</span>
                  )}
                  {!isCollapsed && item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        item.badgeColor || "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* ── Подвал: Realtime-статус и Профиль пользователя ── */}
      <div className="p-3 border-t border-slate-100 space-y-2 bg-slate-50/50">
        {/* Индикатор Live статуса */}
        {!isCollapsed ? (
          <div className="flex items-center justify-between px-2.5 py-1.5 bg-white rounded-lg border border-slate-200/50 text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="font-medium text-slate-600">Supabase Live</span>
            </div>
            <a
              href="https://adlight.kz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-600 p-0.5"
              title="Перейти на сайт adlight.kz"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ) : (
          <div className="flex justify-center py-1" title="Realtime активен">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
          </div>
        )}

        {/* Профиль и выход */}
        <div className={`flex items-center gap-2.5 ${isCollapsed ? "justify-center" : "justify-between"}`}>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold shrink-0">
              {userEmail.slice(0, 2).toUpperCase()}
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <div className="text-xs font-semibold text-slate-800 truncate">
                  {userEmail.split("@")[0]}
                </div>
                <div className="text-[10px] text-slate-400 truncate">Администратор</div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleLogout}
            title="Выйти из системы"
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
