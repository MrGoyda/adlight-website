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
  ChevronUp,
  Check, 
  UserPlus, 
  Link as LinkIcon, 
  Tag,
  Trash2,
  X,
  ExternalLink,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { triggerHaptic } from "@/lib/haptics";
import { toast } from "@/lib/toast";
import Button from "@/components/ui/Button";
import PhoneInput from "@/components/ui/PhoneInput";

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
  
  // По умолчанию виджет свернут в компактный ненавязчивый стрип
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  
  // Изначально карточки внутри свернуты
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const [matchingId, setMatchingId] = useState<string | null>(null);
  const [discardingId, setDiscardingId] = useState<string | null>(null);

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
        body: JSON.stringify({ clickId, leadId: targetId }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Клик успешно привязан к сделке!");
        setAllClicks((prev) => prev.filter((c) => c.id !== clickId));
        if (onMatched) onMatched();
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

  // Если нет кликов или пользователь скрыл уведомление — не рендерим ничего (НОЛЬ шума)
  if (allClicks.length === 0 || isDismissed) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-amber-50/90 via-orange-50/60 to-white border border-amber-200/80 rounded-2xl shadow-xs overflow-hidden select-none transition-all duration-200">
      
      {/* ── КОМПАКТНЫЙ СТРИП-БАР (КОГДА СВЕРНУТ) ── */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
          </div>

          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-bold text-slate-900 truncate">
              Нераспределенные клики с сайта
            </span>
            <span className="px-2 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-black shrink-0">
              {allClicks.length}
            </span>
          </div>

          <span className="hidden sm:inline text-[11px] text-slate-500 truncate">
            — клиенты, нажавшие WhatsApp или звонок за 48 ч
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => {
              triggerHaptic("light");
              setIsOpen((prev) => !prev);
            }}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-white border border-amber-200 text-amber-900 text-xs font-bold hover:bg-amber-100/60 transition shadow-2xs cursor-pointer"
          >
            <span>{isOpen ? "Свернуть" : "Разобрать"}</span>
            {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          <a
            href="/admin/clicks"
            className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-slate-500 hover:text-slate-900 text-xs font-medium transition cursor-pointer"
            title="Открыть полный раздел кликов"
          >
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            onClick={() => {
              triggerHaptic("light");
              setIsDismissed(true);
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition cursor-pointer"
            title="Скрыть эту панель"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── РАСКРЫВАЮЩАЯСЯ ПАНЕЛЬ С КАРТОЧКАМИ КЛИКОВ ── */}
      {isOpen && (
        <div className="p-4 pt-1 border-t border-amber-200/60 bg-white/70 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
            <span>Выберите клик для привязки к сделке или создания нового лида:</span>
            <button
              onClick={() => {
                triggerHaptic("light");
                fetchRecentClicks();
              }}
              className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-semibold"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin text-orange-500" : ""}`} />
              <span>Обновить</span>
            </button>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {allClicks.map((click) => {
              const isExpanded = expandedId === click.id;
              const isWhatsapp = click.type.toUpperCase().includes("WHATSAPP");
              const cleanPath = formatCleanUrl(click.pageUrl);

              const isMobile = click.deviceType === "Mobile";
              const isTablet = click.deviceType === "Tablet";
              
              const dateObj = new Date(click.createdAt);
              const timeStr = dateObj.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Almaty" });
              const dateStr = dateObj.toLocaleDateString("ru-RU", { day: "2-digit", month: "short", timeZone: "Asia/Almaty" });

              return (
                <div
                  key={click.id}
                  className={`rounded-xl border transition-all duration-150 overflow-hidden ${
                    isExpanded 
                      ? "bg-white border-orange-300 shadow-sm" 
                      : "bg-white/90 border-slate-200/80 hover:border-slate-300"
                  }`}
                >
                  {/* Строка клика */}
                  <div
                    onClick={() => {
                      triggerHaptic("light");
                      setExpandedId(isExpanded ? null : click.id);
                    }}
                    className="p-3 flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        isWhatsapp ? "bg-emerald-500 text-white" : "bg-blue-500 text-white"
                      }`}>
                        {click.code.slice(0, 3)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-extrabold text-xs text-slate-900">{click.code}</span>
                          <span className="text-[10px] text-slate-400 font-medium">{dateStr}, {timeStr}</span>
                          <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded truncate">
                            {cleanPath}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDiscard(click.id);
                        }}
                        disabled={discardingId === click.id}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 transition"
                        title="Отклонить клик (спам)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </div>
                  </div>

                  {/* Раскрытая форма создания лида по клику */}
                  {isExpanded && (
                    <div className="p-3 pt-0 border-t border-slate-100 bg-slate-50/50 mt-1 space-y-2">
                      <form onSubmit={(e) => handleCreateAndMatch(e, click)} className="flex flex-col sm:flex-row gap-2 pt-2">
                        <input
                          type="text"
                          required
                          value={targetLeadName}
                          onChange={(e) => setTargetLeadName(e.target.value)}
                          placeholder="Имя клиента *"
                          className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                        />
                        <input
                          type="tel"
                          required
                          value={targetLeadPhone}
                          onChange={(e) => setTargetLeadPhone(e.target.value)}
                          placeholder="+7 (701) 000-00-00 *"
                          className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                        />
                        <button
                          type="submit"
                          disabled={isSubmittingLead}
                          className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold shrink-0 transition"
                        >
                          {isSubmittingLead ? "Создание..." : "+ Создать сделку"}
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
