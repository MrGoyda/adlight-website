"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
  Search, 
  Inbox, 
  Wallet, 
  FolderKanban, 
  BarChart3, 
  Warehouse, 
  Tags, 
  Users, 
  Building2, 
  MousePointer, 
  Plus, 
  UserPlus, 
  Calculator, 
  DollarSign, 
  X,
  ArrowRight
} from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { CRM_EVENTS, dispatchCrmEvent } from "@/lib/crmEvents";

interface CommandItem {
  id: string;
  title: string;
  category: "Навигация" | "Действия";
  icon: React.ElementType;
  shortcut?: string;
  onSelect: () => void;
}

export default function CrmCommandPalette({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Список всех команд
  const commands: CommandItem[] = [
    // Навигация
    {
      id: "nav-leads",
      title: "Перейти: Заявки (Лиды)",
      category: "Навигация",
      icon: Inbox,
      shortcut: "1",
      onSelect: () => router.push("/admin/leads"),
    },
    {
      id: "nav-finance",
      title: "Перейти: Финансы и Касса",
      category: "Навигация",
      icon: Wallet,
      shortcut: "2",
      onSelect: () => router.push("/admin/finance"),
    },
    {
      id: "nav-projects",
      title: "Перейти: Проекты цеха и монтажи",
      category: "Навигация",
      icon: FolderKanban,
      shortcut: "3",
      onSelect: () => router.push("/admin/projects"),
    },
    {
      id: "nav-warehouse",
      title: "Перейти: Склад материалов",
      category: "Навигация",
      icon: Warehouse,
      onSelect: () => router.push("/admin/warehouse"),
    },
    {
      id: "nav-pricing",
      title: "Перейти: База товаров и Тарифы",
      category: "Навигация",
      icon: Tags,
      onSelect: () => router.push("/admin/pricing"),
    },
    {
      id: "nav-clients",
      title: "Перейти: База Клиентов",
      category: "Навигация",
      icon: Users,
      onSelect: () => router.push("/admin/clients"),
    },
    {
      id: "nav-companies",
      title: "Перейти: Компании и Реквизиты",
      category: "Навигация",
      icon: Building2,
      onSelect: () => router.push("/admin/companies"),
    },
    {
      id: "nav-analytics",
      title: "Перейти: Сквозная Аналитика",
      category: "Навигация",
      icon: BarChart3,
      onSelect: () => router.push("/admin/analytics"),
    },
    {
      id: "nav-clicks",
      title: "Перейти: Реестр кликов рекламы",
      category: "Навигация",
      icon: MousePointer,
      onSelect: () => router.push("/admin/clicks"),
    },
    // Быстрые действия
    {
      id: "act-create-lead",
      title: "Создать новую заявку (Лид)",
      category: "Действия",
      icon: UserPlus,
      shortcut: "N",
      onSelect: () => {
        if (pathname === "/admin/leads") {
          dispatchCrmEvent(CRM_EVENTS.OPEN_CREATE_LEAD);
        } else {
          router.push("/admin/leads?action=create-lead");
        }
      },
    },
    {
      id: "act-estimate",
      title: "Открыть быстрый калькулятор сметы",
      category: "Действия",
      icon: Calculator,
      onSelect: () => {
        if (pathname === "/admin/leads") {
          dispatchCrmEvent(CRM_EVENTS.OPEN_ESTIMATE);
        } else {
          router.push("/admin/leads?action=estimate");
        }
      },
    },
    {
      id: "act-create-client",
      title: "Добавить клиента в базу",
      category: "Действия",
      icon: Building2,
      onSelect: () => {
        if (pathname === "/admin/clients" || pathname === "/admin/leads") {
          dispatchCrmEvent(CRM_EVENTS.OPEN_CREATE_CLIENT);
        } else {
          router.push("/admin/clients?action=create-client");
        }
      },
    },
    {
      id: "act-add-expense",
      title: "Внести расход компании в кассу",
      category: "Действия",
      icon: DollarSign,
      onSelect: () => {
        router.push("/admin/finance?action=add-expense");
      },
    },
  ];

  // Фильтрация команд по поиску
  const filtered = commands.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  // Навигация с клавиатуры
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          triggerHaptic("medium");
          filtered[selectedIndex].onSelect();
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Palette Modal */}
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск разделов, клиентов, действий... (Cmd+K)"
            className="w-full text-sm sm:text-base outline-none bg-transparent text-slate-800 placeholder:text-slate-400 font-medium"
            autoFocus
          />
          <button 
            type="button" 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 divide-y divide-slate-50">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              Ничего не найдено по запросу «{search}»
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    triggerHaptic("medium");
                    item.onSelect();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                    isSelected 
                      ? "bg-orange-50/80 text-orange-950 font-medium" 
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected 
                        ? "bg-orange-500 text-white shadow-sm shadow-orange-500/30" 
                        : "bg-slate-100 text-slate-500"
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="text-sm font-medium leading-none">{item.title}</div>
                      <div className="text-[11px] text-slate-400 mt-1">{item.category}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.shortcut && (
                      <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 bg-slate-100 border border-slate-200/80 rounded">
                        {item.shortcut}
                      </kbd>
                    )}
                    {isSelected && (
                      <ArrowRight className="w-4 h-4 text-orange-500 animate-in slide-in-from-left-1 duration-150" />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer Hints */}
        <div className="px-4 py-2 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 select-none">
          <div className="flex items-center gap-2">
            <span>↑↓ Навигация</span>
            <span>•</span>
            <span>↵ Выбрать</span>
          </div>
          <span>Esc чтобы закрыть</span>
        </div>
      </div>
    </div>
  );
}
