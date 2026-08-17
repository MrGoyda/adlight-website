"use client";

import React, { useState, useEffect } from "react";
import { 
  MousePointer, 
  RefreshCw, 
  Smartphone, 
  Monitor, 
  Tablet, 
  Clock, 
  ChevronDown, 
  Check, 
  UserPlus, 
  Link as LinkIcon, 
  Tag,
  Trash2,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { triggerHaptic } from "@/lib/haptics";
import { toast } from "@/lib/toast";
import Button from "@/components/ui/Button";

interface ClickItem {
  id: string;
  createdAt: string;
  code: string;
  type: string;
  pageUrl: string | null;
  utmSource: string | null;
  utmCampaign: string | null;
  deviceType?: string | null;
  browser?: string | null;
  os?: string | null;
  timeOnSiteSeconds?: number | null;
  landingPage?: string | null;
}

interface ClickMatcherWidgetProps {
  leadId?: string;
  onMatched?: () => void;
}

export default function ClickMatcherWidget({ leadId, onMatched }: ClickMatcherWidgetProps) {
  const [allClicks, setAllClicks] = useState<ClickItem[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Изначально ВСЕ карточки свернуты
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // По умолчанию показываем ровно 3 клика
  const [visibleLimit, setVisibleLimit] = useState<number>(3);
  
  const [matchingId, setMatchingId] = useState<string | null>(null);
  const [discardingId, setDiscardingId] = useState<string | null>(null);
  const [matchedSuccess, setMatchedSuccess] = useState(false);

  // Поля привязки нового лида
  const [targetLeadName, setTargetLeadName] = useState("");
  const [targetLeadPhone, setTargetLeadPhone] = useState("");
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  const fetchRecentClicks = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/clicks/recent", { cache: "no-store" });
      const data = await res.json();
      if (data.clicks) {
        setAllClicks(data.clicks);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentClicks();
  }, []);

  const formatCleanUrl = (rawUrl?: string | null) => {
    if (!rawUrl) return "/";
    try {
      const urlObj = new URL(rawUrl, "https://adlight.kz");
      return urlObj.pathname || "/";
    } catch {
      return rawUrl.split("?")[0] || "/";
    }
  };

  // Привязка клика к существующему лиду
  const handleMatchExisting = async (clickId: string, targetId: string) => {
    setMatchingId(clickId);
    triggerHaptic("light");
    try {
      const res = await fetch("/api/clicks/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: targetId, clickId }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Клик успешно привязан к сделке!");
        setMatchedSuccess(true);
        // Моментально удаляем привязанный клик из нераспределенных
        setAllClicks((prev) => prev.filter((c) => c.id !== clickId));
        if (onMatched) onMatched();
        fetchRecentClicks();
      } else {
        toast.error(data.error || "Не удалось привязать клик");
      }
    } catch (e) {
      console.error(e);
      toast.error("Ошибка соединения");
    } finally {
      setMatchingId(null);
    }
  };

  // Создание нового лида и привязка клика
  const handleCreateAndMatch = async (e: React.FormEvent, click: ClickItem) => {
    e.preventDefault();
    if (!targetLeadName.trim() || !targetLeadPhone.trim()) {
      toast.error("Укажите имя и телефон клиента");
      return;
    }

    setIsSubmittingLead(true);
    triggerHaptic("light");

    try {
      const res = await fetch("/api/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: targetLeadName,
          phone: targetLeadPhone,
          source: `Клик ${click.code} (${click.type})`,
          message: `Страница входа: ${click.pageUrl || "/"}`,
          utmSource: click.utmSource,
          utmCampaign: click.utmCampaign,
          clickId: click.id,
        }),
      });

      if (res.ok) {
        toast.success(`Создана новая сделка по клику ${click.code}!`);
        setMatchedSuccess(true);
        // Моментально удаляем клик из нераспределенных
        setAllClicks((prev) => prev.filter((c) => c.id !== click.id));
        setTargetLeadName("");
        setTargetLeadPhone("");
        setExpandedId(null);
        if (onMatched) onMatched();
        fetchRecentClicks();
      } else {
        toast.error("Ошибка создания сделки по клику");
      }
    } catch (err) {
      console.error(err);
      toast.error("Ошибка соединения");
    } finally {
      setIsSubmittingLead(false);
    }
  };

  // Отклонить клик (спам / случайный)
  const handleDiscard = async (clickId: string) => {
    setDiscardingId(clickId);
    triggerHaptic("light");
    try {
      const res = await fetch("/api/clicks/discard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clickId }),
      });
      const data = await res.json();
      if (data.success) {
        toast.info("Клик убран из списка");
        setAllClicks((prev) => prev.filter((c) => c.id !== clickId));
      } else {
        toast.error(data.error || "Не удалось убрать клик");
      }
    } catch (e) {
      console.error(e);
      toast.error("Ошибка соединения");
    } finally {
      setDiscardingId(null);
    }
  };

  const visibleClicks = allClicks.slice(0, visibleLimit);

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-4 sm:p-5 shadow-xs select-none space-y-4 text-slate-900">
      
      {/* ── Заголовок виджета ── */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-black shadow-md shadow-orange-500/20">
            <MousePointer className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              Нераспределенные клики
              <span className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200/60 text-[10px] font-black">
                {allClicks.length}
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Обращения с сайта за последние 48 часов
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            triggerHaptic("light");
            fetchRecentClicks();
          }}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900 transition active:scale-95 cursor-pointer"
          title="Обновить входящие клики"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-orange-500" : ""}`} />
        </button>
      </div>

      {matchedSuccess && (
        <div className="bg-emerald-50 text-emerald-700 p-3 rounded-2xl text-xs flex items-center gap-2 border border-emerald-200 animate-in fade-in duration-200">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          Клик успешно привязан! Он перенесен в архив сделки.
        </div>
      )}

      {/* ── Список кликов с кастомным скроллбаром ── */}
      {allClicks.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-xs font-medium bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
          {loading ? "Загрузка кликов..." : "Все клики распределены по сделкам ✨"}
        </div>
      ) : (
        <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200">
          {visibleClicks.map((click) => {
            const isExpanded = expandedId === click.id;
            const isWhatsapp = click.type.toUpperCase().includes("WHATSAPP");
            const cleanPath = formatCleanUrl(click.pageUrl);

            const isMobile = click.deviceType === "Mobile";
            const isTablet = click.deviceType === "Tablet";
            
            const dateObj = new Date(click.createdAt);
            const timeStr = dateObj.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
            const dateStr = dateObj.toLocaleDateString("ru-RU", { day: "2-digit", month: "short" });

            return (
              <div
                key={click.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isExpanded 
                    ? "border-orange-300 bg-orange-50/30 shadow-xs" 
                    : "border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                {/* ── Свернутая первая строка (Компактная полоса) ── */}
                <div
                  onClick={() => {
                    triggerHaptic("light");
                    setExpandedId(isExpanded ? null : click.id);
                  }}
                  className="p-3 flex items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Код клика */}
                    <span className="px-2.5 py-1 rounded-xl bg-orange-500 text-white font-black text-xs tracking-tight shadow-xs shrink-0">
                      {click.code}
                    </span>

                    {/* Тип обращения */}
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase shrink-0 border ${
                      isWhatsapp 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                        : "bg-orange-50 text-orange-700 border-orange-200"
                    }`}>
                      {isWhatsapp ? "WhatsApp" : "Звонок"}
                    </span>

                    {/* Время и Дата */}
                    <span className="text-xs font-bold text-slate-800 shrink-0" suppressHydrationWarning>
                      {timeStr} <span className="text-[10px] font-medium text-slate-400">({dateStr})</span>
                    </span>

                    {/* Иконка устройства */}
                    <div className="text-slate-400 shrink-0 flex items-center gap-1" title={`Устройство: ${click.deviceType || "Desktop"}`}>
                      {isMobile ? (
                        <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                      ) : isTablet ? (
                        <Tablet className="w-3.5 h-3.5 text-slate-500" />
                      ) : (
                        <Monitor className="w-3.5 h-3.5 text-slate-500" />
                      )}
                    </div>

                    {/* Путь кликнутой страницы */}
                    <span className="text-xs text-slate-500 font-medium truncate hidden sm:inline" title={click.pageUrl || ""}>
                      {cleanPath}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Кнопка быстрого отклонения спам-клика с кастомным диалогом */}
                    <button
                      type="button"
                      disabled={discardingId === click.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.confirm({
                          title: `Убрать клик ${click.code}?`,
                          message: "Клик будет перенесен в архив отклоненных и скрыт из нераспределенных.",
                          confirmText: "Да, убрать",
                          cancelText: "Отмена",
                          isDestructive: true,
                          onConfirm: () => handleDiscard(click.id),
                        });
                      }}
                      className="p-1 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition"
                      title="Убрать как спам/неактуальный"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <span className="text-[11px] font-bold text-orange-600 hidden xs:inline">
                      {isExpanded ? "Свернуть" : "Открыть"}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                        isExpanded ? "rotate-180 text-orange-500" : ""
                      }`}
                    />
                  </div>
                </div>

                {/* ── Раскрывающееся тело (Детали + Форма привязки) ── */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-slate-200/80 bg-white p-4 space-y-3.5 text-xs text-slate-900"
                    >
                      {/* Сетка параметров */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50 p-3 rounded-2xl border border-slate-200/80 font-medium">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Время до клика</span>
                          <span className="text-slate-900 font-bold flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-orange-500" />
                            {click.timeOnSiteSeconds ? `${click.timeOnSiteSeconds} сек` : "Мгновенно"}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Источник (UTM)</span>
                          <span className="text-slate-900 font-bold flex items-center gap-1 mt-0.5 truncate">
                            <Tag className="w-3 h-3 text-amber-500" />
                            {click.utmSource || "Прямой заход"}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Браузер / ОС</span>
                          <span className="text-slate-900 font-bold truncate block mt-0.5">
                            {click.browser || "Safari"} ({click.os || "iOS"})
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Страница входа</span>
                          <span className="text-slate-900 font-bold truncate block mt-0.5" title={click.pageUrl || ""}>
                            {cleanPath}
                          </span>
                        </div>
                      </div>

                      {/* Если виджет передан в карточку лида */}
                      {leadId ? (
                        <div className="flex justify-end pt-1">
                          <Button
                            size="sm"
                            variant="solid"
                            onClick={() => handleMatchExisting(click.id, leadId)}
                            isLoading={matchingId === click.id}
                            className="text-xs font-black py-2 px-4 shadow-sm"
                          >
                            <LinkIcon className="w-3.5 h-3.5 mr-1" />
                            {matchingId === click.id ? "Привязка..." : `Привязать клик ${click.code} к этой карточке`}
                          </Button>
                        </div>
                      ) : (
                        /* Форма быстрой привязки / создания нового лида */
                        <form
                          onSubmit={(e) => handleCreateAndMatch(e, click)}
                          className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-slate-900 flex items-center gap-1.5 text-xs">
                              <UserPlus className="w-4 h-4 text-orange-500" />
                              Привязать клик {click.code} к новому клиенту
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input
                              type="text"
                              required
                              placeholder="Имя клиента *"
                              value={targetLeadName}
                              onChange={(e) => setTargetLeadName(e.target.value)}
                              className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 placeholder:text-slate-400 focus:border-orange-500 outline-none text-base sm:text-xs transition shadow-2xs"
                              suppressHydrationWarning
                            />
                            <input
                              type="tel"
                              required
                              placeholder="Телефон клиента *"
                              value={targetLeadPhone}
                              onChange={(e) => setTargetLeadPhone(e.target.value)}
                              className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 placeholder:text-slate-400 focus:border-orange-500 outline-none text-base sm:text-xs transition shadow-2xs"
                              suppressHydrationWarning
                            />
                          </div>

                          <div className="flex justify-end pt-1">
                            <button
                              type="submit"
                              disabled={isSubmittingLead}
                              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold shadow-sm hover:opacity-95 active:scale-95 transition text-xs flex items-center gap-1.5 cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              {isSubmittingLead ? "Сохранение..." : `Создать сделку с кодом ${click.code}`}
                            </button>
                          </div>
                        </form>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Ссылка на полный реестр кликов /admin/clicks ── */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
        <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
          До 3 нераспределенных
        </span>
        <button
          type="button"
          onClick={() => {
            triggerHaptic("light");
            if (typeof window !== "undefined") {
              window.location.href = "/admin/clicks";
            }
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-extrabold text-xs transition active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
        >
          <span className="whitespace-nowrap">Реестр кликов ({allClicks.length})</span>
          <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-orange-500 shrink-0" />
        </button>
      </div>
    </div>
  );
}
