"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Search, 
  Plus, 
  UserPlus, 
  DollarSign, 
  Calculator, 
  Building2, 
  ChevronRight,
  Menu,
  Sparkles
} from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { CRM_EVENTS, dispatchCrmEvent } from "@/lib/crmEvents";

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/admin/leads": { title: "Заявки", subtitle: "Воронка обращений и расчеты" },
  "/admin/finance": { title: "Финансы и Касса", subtitle: "Учет доходов, расходов и выплат" },
  "/admin/projects": { title: "Проекты цеха", subtitle: "Производство вывесок и монтажи" },
  "/admin/warehouse": { title: "Склад материалов", subtitle: "Остатки сырья и списания" },
  "/admin/pricing": { title: "Тарифы и Прайсы", subtitle: "Себестоимость и поставщики" },
  "/admin/clients": { title: "База Клиентов", subtitle: "Постоянные клиенты и рейтинги" },
  "/admin/companies": { title: "Компании и Реквизиты", subtitle: "Юр. лица для договоров и счетов" },
  "/admin/analytics": { title: "Сквозная Аналитика", subtitle: "Конверсии и стоимость лида" },
  "/admin/clicks": { title: "Реестр кликов", subtitle: "Логи взаимодействий с рекламой" },
};

export default function CrmTopBar({
  onOpenCommandPalette,
  onOpenMobileMenu,
}: {
  onOpenCommandPalette: () => void;
  onOpenMobileMenu: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  const pageInfo = PAGE_TITLES[pathname] || { 
    title: "Панель управления", 
    subtitle: "ADLight CRM" 
  };

  const handleQuickLead = () => {
    triggerHaptic("medium");
    setIsActionsOpen(false);
    if (pathname === "/admin/leads") {
      dispatchCrmEvent(CRM_EVENTS.OPEN_CREATE_LEAD);
    } else {
      router.push("/admin/leads?action=create-lead");
    }
  };

  const handleQuickExpense = () => {
    triggerHaptic("medium");
    setIsActionsOpen(false);
    router.push("/admin/finance?action=add-expense");
  };

  const handleQuickClient = () => {
    triggerHaptic("medium");
    setIsActionsOpen(false);
    if (pathname === "/admin/clients" || pathname === "/admin/leads") {
      dispatchCrmEvent(CRM_EVENTS.OPEN_CREATE_CLIENT);
    } else {
      router.push("/admin/clients?action=create-client");
    }
  };

  return (
    <header className="h-14 lg:h-16 px-4 lg:px-6 bg-white/95 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between z-20 shrink-0 select-none">
      {/* ── Левая часть: Мобильное лого / Десктопные Хлебные крошки ── */}
      <div className="flex items-center gap-3">
        {/* Мобильная кнопка меню */}
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Открыть меню"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Заголовок текущего раздела */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs font-medium text-slate-400">CRM</span>
            <ChevronRight className="hidden sm:inline w-3 h-3 text-slate-300" />
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
              {pageInfo.title}
            </h1>
          </div>
          <span className="hidden sm:block text-[11px] text-slate-400 font-medium leading-none mt-0.5">
            {pageInfo.subtitle}
          </span>
        </div>
      </div>

      {/* ── Правая часть: Быстрый поиск и Быстрые действия ── */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Кнопка открытия поиска Cmd+K */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic("light");
            onOpenCommandPalette();
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 transition-colors cursor-pointer"
          title="Быстрый поиск (Cmd+K)"
        >
          <Search className="w-4 h-4 text-slate-400" />
          <span className="hidden md:inline">Поиск...</span>
          <kbd className="hidden md:inline text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded px-1">
            ⌘K
          </kbd>
        </button>

        {/* Дропдаун «+ Создать» */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              triggerHaptic("light");
              setIsActionsOpen(!isActionsOpen);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Создать</span>
          </button>

          {/* Всплывающее меню быстрых действий */}
          {isActionsOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsActionsOpen(false)} 
              />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200/80 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <button
                  type="button"
                  onClick={handleQuickLead}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-950 transition-colors text-left cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Новая заявка</div>
                    <div className="text-[10px] text-slate-400">Входящий лид с сайта</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={handleQuickExpense}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-red-50 hover:text-red-950 transition-colors text-left cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Внести расход</div>
                    <div className="text-[10px] text-slate-400">Списание из кассы</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={handleQuickClient}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-950 transition-colors text-left cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Новый клиент</div>
                    <div className="text-[10px] text-slate-400">В постоянную базу</div>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
