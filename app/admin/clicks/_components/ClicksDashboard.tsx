"use client";

import React, { useState } from "react";
import { 
  MousePointer, 
  Search, 
  RefreshCw, 
  Smartphone, 
  Monitor, 
  Tablet, 
  Clock, 
  ChevronDown, 
  Check, 
  UserPlus, 
  Tag, 
  Trash2, 
  Link as LinkIcon, 
  ArrowLeft,
  Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { triggerHaptic } from "@/lib/haptics";
import { toast } from "@/lib/toast";
import { useRouter } from "next/navigation";

interface ClickItem {
  id: string;
  createdAt: string;
  code: string;
  type: string;
  status: string;
  pageUrl: string | null;
  utmSource: string | null;
  utmCampaign: string | null;
  deviceType?: string | null;
  browser?: string | null;
  os?: string | null;
  timeOnSiteSeconds?: number | null;
  landingPage?: string | null;
  matchedLeadId?: string | null;
}

interface ClicksDashboardProps {
  initialClicks: ClickItem[];
}

export default function ClicksDashboard({ initialClicks }: ClicksDashboardProps) {
  const router = useRouter();
  const [clicks, setClicks] = useState<ClickItem[]>(initialClicks);
  const [activeTab, setActiveTab] = useState<"PENDING" | "MATCHED" | "DISCARDED" | "ALL">("PENDING");
  
  // Пагинация по 10 кликов
  const [visibleCount, setVisibleCount] = useState<number>(10);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Форма быстрой привязки
  const [targetName, setTargetName] = useState("");
  const [targetPhone, setTargetPhone] = useState("");
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [discardingId, setDiscardingId] = useState<string | null>(null);

  // Поиск по коду или UTM
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClicks = clicks.filter((click) => {
    // Фильтр по статусу
    if (activeTab === "PENDING" && click.status !== "PENDING") return false;
    if (activeTab === "MATCHED" && click.status !== "MATCHED") return false;
    if (activeTab === "DISCARDED" && click.status !== "DISCARDED") return false;

    // Поиск
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCode = click.code.toLowerCase().includes(q);
      const matchType = click.type.toLowerCase().includes(q);
      const matchUtm = (click.utmSource || "").toLowerCase().includes(q);
      return matchCode || matchType || matchUtm;
    }

    return true;
  });

  const displayedClicks = filteredClicks.slice(0, visibleCount);
  const hasMore = filteredClicks.length > visibleCount;

  // Очистка URL
  const formatCleanUrl = (rawUrl?: string | null) => {
    if (!rawUrl) return "/";
    try {
      const urlObj = new URL(rawUrl, "https://adlight.kz");
      return urlObj.pathname || "/";
    } catch {
      return rawUrl.split("?")[0] || "/";
    }
  };

  // Удаление клика (перевод в DISCARDED)
  const handleDiscard = async (clickId: string) => {
    setDiscardingId(clickId);
    triggerHaptic("light");
    try {
      const res = await fetch("/api/clicks/discard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clickId }),
      });
      if (res.ok) {
        triggerHaptic("success");
        setClicks((prev) =>
          prev.map((c) => (c.id === clickId ? { ...c, status: "DISCARDED" } : c))
        );
        setExpandedId(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDiscardingId(null);
    }
  };

  // Создание заявки из клика
  const handleCreateLead = async (e: React.FormEvent, click: ClickItem) => {
    e.preventDefault();
    if (!targetName || !targetPhone) return;

    setSubmittingId(click.id);
    triggerHaptic("light");

    try {
      const res = await fetch("/api/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: targetName,
          phone: targetPhone,
          source: `Клик ${click.code} (${click.type})`,
          message: `Страница входа: ${click.pageUrl || "/"}`,
        }),
      });

      if (res.ok) {
        toast.success(`Сделка успешно создана по клику ${click.code}!`);
        setTargetName("");
        setTargetPhone("");
        setClicks((prev) =>
          prev.map((c) => (c.id === click.id ? { ...c, status: "MATCHED" } : c))
        );
        setExpandedId(null);
      } else {
        toast.error("Ошибка создания заявки");
      }
    } catch (err) {
      console.error(err);
      toast.error("Ошибка соединения");
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className="space-y-6 text-slate-900 pb-20 select-none w-full max-w-full overflow-x-hidden">
      
      {/* ── Верхний информационный блок ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/admin/leads")}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition active:scale-95 cursor-pointer shrink-0"
            title="Вернуться к заявкам"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <MousePointer className="w-6 h-6 text-orange-500 shrink-0" />
              Входящие клики
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Полный реестр обращений с фиксированием UTM, устройств и источника
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            triggerHaptic("light");
            router.refresh();
          }}
          className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition flex items-center gap-2 active:scale-95 cursor-pointer self-start sm:self-auto shrink-0"
        >
          <RefreshCw className="w-4 h-4 text-orange-500" />
          Обновить реестр
        </button>
      </div>

      {/* ── Табы фильтрации и строка поиска ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 w-full max-w-full">
        
        {/* Табы с эффектом плавной горизонтальной прокрутки */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 w-full max-w-full scroll-smooth no-scrollbar touch-pan-x">
          <button
            onClick={(e) => {
              triggerHaptic("light");
              e.currentTarget.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
              setActiveTab("PENDING");
              setVisibleCount(10);
            }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition cursor-pointer whitespace-nowrap flex items-center gap-2 shrink-0 ${
              activeTab === "PENDING"
                ? "bg-orange-500 text-white shadow-xs"
                : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50"
            }`}
          >
            Нераспределенные
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              activeTab === "PENDING" ? "bg-white/20 text-white" : "bg-orange-50 text-orange-600"
            }`}>
              {clicks.filter((c) => c.status === "PENDING").length}
            </span>
          </button>

          <button
            onClick={(e) => {
              triggerHaptic("light");
              e.currentTarget.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
              setActiveTab("MATCHED");
              setVisibleCount(10);
            }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition cursor-pointer whitespace-nowrap flex items-center gap-2 shrink-0 ${
              activeTab === "MATCHED"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50"
            }`}
          >
            Привязаны
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              activeTab === "MATCHED" ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-600"
            }`}>
              {clicks.filter((c) => c.status === "MATCHED").length}
            </span>
          </button>

          <button
            onClick={(e) => {
              triggerHaptic("light");
              e.currentTarget.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
              setActiveTab("DISCARDED");
              setVisibleCount(10);
            }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition cursor-pointer whitespace-nowrap flex items-center gap-2 shrink-0 ${
              activeTab === "DISCARDED"
                ? "bg-rose-600 text-white shadow-xs"
                : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50"
            }`}
          >
            Удаленные / Спам
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              activeTab === "DISCARDED" ? "bg-white/20 text-white" : "bg-rose-50 text-rose-600"
            }`}>
              {clicks.filter((c) => c.status === "DISCARDED").length}
            </span>
          </button>

          <button
            onClick={(e) => {
              triggerHaptic("light");
              e.currentTarget.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
              setActiveTab("ALL");
              setVisibleCount(10);
            }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === "ALL"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50"
            }`}
          >
            Все клики ({clicks.length})
          </button>
        </div>

        {/* Поиск с text-base sm:text-xs для убирания мобильного зума */}
        <div className="relative min-w-[240px] w-full md:w-auto">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Поиск по коду (AD-XXXX) или UTM..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-base sm:text-xs font-medium placeholder:text-slate-400 outline-none focus:border-orange-500 shadow-2xs transition"
            suppressHydrationWarning
          />
        </div>
      </div>

      {/* ── Основной список кликов ── */}
      {displayedClicks.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto">
            <Check className="w-6 h-6" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900">
            {activeTab === "PENDING"
              ? "Все клики распределены! Чистота 100% ✨"
              : "Клики не найдены"}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {activeTab === "PENDING"
              ? "Новые входящие клики с сайта будут появляться здесь автоматически."
              : "Попробуйте изменить параметры поиска или переключить вкладку фильтра."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedClicks.map((click) => {
            const isExpanded = expandedId === click.id;
            const isWhatsapp = click.type.toUpperCase().includes("WHATSAPP");
            const cleanPath = formatCleanUrl(click.pageUrl);

            const isMobile = click.deviceType === "Mobile";
            const isTablet = click.deviceType === "Tablet";
            
            const dateObj = new Date(click.createdAt);
            const timeStr = dateObj.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
            const dateStr = dateObj.toLocaleDateString("ru-RU", { day: "2-digit", month: "short" });

            const isPending = click.status === "PENDING";
            const isMatched = click.status === "MATCHED";
            const isDiscarded = click.status === "DISCARDED";

            return (
              <div
                key={click.id}
                className={`bg-white border rounded-3xl transition-all duration-200 overflow-hidden shadow-2xs ${
                  isExpanded ? "border-orange-300 ring-2 ring-orange-100" : "border-slate-200/80 hover:border-slate-300"
                }`}
              >
                {/* ── Заголовок карточки (Компактный мобильный ряд) ── */}
                <div
                  onClick={() => {
                    triggerHaptic("light");
                    setExpandedId(isExpanded ? null : click.id);
                  }}
                  className="p-3.5 sm:p-4 flex items-center justify-between gap-2 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 flex-1 overflow-hidden">
                    {/* Код клика */}
                    <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-xl bg-orange-500 text-white font-black text-xs tracking-tight shadow-xs shrink-0">
                      {click.code}
                    </span>

                    {/* Статус клика */}
                    <span className={`px-2 py-0.5 rounded-lg text-[9px] sm:text-[10px] font-black uppercase shrink-0 border ${
                      isPending 
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : isMatched
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-rose-50 text-rose-700 border-rose-200"
                    }`}>
                      {isPending ? "Ожидает" : isMatched ? "Привязан" : "Удален"}
                    </span>

                    {/* Тип источника */}
                    <span className={`px-2 py-0.5 rounded-lg text-[9px] sm:text-[10px] font-extrabold uppercase shrink-0 border ${
                      isWhatsapp ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-orange-50 text-orange-700 border-orange-200"
                    }`}>
                      {isWhatsapp ? "WA" : "Звонок"}
                    </span>

                    {/* Время и Дата */}
                    <span className="text-xs font-bold text-slate-800 shrink-0" suppressHydrationWarning>
                      {timeStr} <span className="text-[10px] font-medium text-slate-400 hidden xs:inline">({dateStr})</span>
                    </span>

                    {/* Устройство */}
                    <div className="text-slate-400 shrink-0 flex items-center gap-1" title={`Устройство: ${click.deviceType || "Desktop"}`}>
                      {isMobile ? (
                        <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                      ) : isTablet ? (
                        <Tablet className="w-3.5 h-3.5 text-slate-500" />
                      ) : (
                        <Monitor className="w-3.5 h-3.5 text-slate-500" />
                      )}
                    </div>

                    {/* Страница */}
                    <span className="text-xs text-slate-500 font-medium truncate max-w-xs hidden lg:inline" title={click.pageUrl || ""}>
                      {cleanPath}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 pl-1">
                    <span className="text-xs font-extrabold text-orange-600 hidden xs:inline">
                      {isExpanded ? "Свернуть" : "Открыть"}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                        isExpanded ? "rotate-180 text-orange-500" : ""
                      }`}
                    />
                  </div>
                </div>

                {/* ── Детали и управление кликом ── */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-slate-100 bg-slate-50/70 p-4 sm:p-5 space-y-4 text-xs"
                    >
                      {/* Аналитическая сетка */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 font-medium shadow-2xs">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Время до клика</span>
                          <span className="text-slate-900 font-bold flex items-center gap-1 mt-0.5 text-sm">
                            <Clock className="w-3.5 h-3.5 text-orange-500" />
                            {click.timeOnSiteSeconds ? `${click.timeOnSiteSeconds} сек` : "Мгновенно"}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Источник (UTM)</span>
                          <span className="text-slate-900 font-bold flex items-center gap-1 mt-0.5 truncate text-sm">
                            <Tag className="w-3.5 h-3.5 text-amber-500" />
                            {click.utmSource || "Прямой заход"}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Браузер / ОС</span>
                          <span className="text-slate-900 font-bold truncate block mt-0.5 text-sm">
                            {click.browser || "Safari"} ({click.os || "iOS"})
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Страница входа</span>
                          <span className="text-slate-900 font-bold truncate block mt-0.5 text-sm" title={click.pageUrl || ""}>
                            {cleanPath}
                          </span>
                        </div>
                      </div>

                      {/* Если клик еще не распределен (PENDING) */}
                      {isPending && (
                        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-3 shadow-2xs">
                          <h4 className="font-extrabold text-slate-900 flex items-center gap-2 text-xs">
                            <UserPlus className="w-4 h-4 text-orange-500" />
                            Создать и привязать лид к коду {click.code}
                          </h4>

                          <form onSubmit={(e) => handleCreateLead(e, click)} className="space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              <input
                                type="text"
                                required
                                placeholder="Имя клиента *"
                                value={targetName}
                                onChange={(e) => setTargetName(e.target.value)}
                                className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-orange-500 outline-none text-base sm:text-xs font-medium transition"
                                suppressHydrationWarning
                              />
                              <input
                                type="tel"
                                required
                                placeholder="Телефон клиента *"
                                value={targetPhone}
                                onChange={(e) => setTargetPhone(e.target.value)}
                                className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-orange-500 outline-none text-base sm:text-xs font-medium transition"
                                suppressHydrationWarning
                              />
                            </div>

                            <div className="flex items-center justify-between pt-1 gap-2">
                              <button
                                type="button"
                                onClick={() => handleDiscard(click.id)}
                                disabled={discardingId === click.id}
                                className="px-3.5 py-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                {discardingId === click.id ? "Удаление..." : "Удалить как нерелевантный"}
                              </button>

                              <button
                                type="submit"
                                disabled={submittingId === click.id}
                                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold shadow-sm hover:opacity-95 active:scale-95 transition text-xs flex items-center gap-1.5 cursor-pointer"
                              >
                                <Check className="w-4 h-4" />
                                {submittingId === click.id ? "Привязка..." : `Создать заявку с кодом ${click.code}`}
                              </button>
                            </div>
                          </form>
                        </div>
                      )}

                      {/* Если уже привязан */}
                      {isMatched && (
                        <div className="bg-emerald-50 text-emerald-800 p-3.5 rounded-2xl border border-emerald-200 flex items-center justify-between">
                          <span className="font-extrabold flex items-center gap-2">
                            <Check className="w-4 h-4 text-emerald-600" />
                            Клик успешно привязан к сделке в CRM.
                          </span>
                        </div>
                      )}

                      {/* Если удален */}
                      {isDiscarded && (
                        <div className="bg-rose-50 text-rose-800 p-3.5 rounded-2xl border border-rose-200 flex items-center justify-between">
                          <span className="font-extrabold flex items-center gap-2">
                            <Trash2 className="w-4 h-4 text-rose-600" />
                            Помечен как спам / недошедший клик.
                          </span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Кнопка Пагинации «Загрузить еще 10 кликов» ── */}
      {hasMore && (
        <div className="pt-4 flex justify-center">
          <button
            onClick={() => {
              triggerHaptic("light");
              setVisibleCount((prev) => prev + 10);
            }}
            className="px-6 py-3 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 text-slate-800 font-extrabold text-xs shadow-xs transition active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <span>Загрузить ещё 10 кликов</span>
            <ChevronDown className="w-4 h-4 text-orange-500" />
          </button>
        </div>
      )}
    </div>
  );
}
