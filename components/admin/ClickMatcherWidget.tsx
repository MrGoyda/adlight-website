"use client";

import React, { useState, useEffect } from "react";
import { Link as LinkIcon, Check, MousePointer, RefreshCw, Smartphone, Monitor, Tablet, Globe, Clock, FileText } from "lucide-react";
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
  leadId: string;
  onMatched?: () => void;
}

export default function ClickMatcherWidget({ leadId, onMatched }: ClickMatcherWidgetProps) {
  const [clicks, setClicks] = useState<ClickItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [matchingId, setMatchingId] = useState<string | null>(null);
  const [matchedSuccess, setMatchedSuccess] = useState(false);

  const fetchRecentClicks = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/clicks/recent");
      const data = await res.json();
      if (data.clicks) setClicks(data.clicks);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentClicks();
  }, []);

  const handleMatch = async (clickId: string) => {
    setMatchingId(clickId);
    try {
      const res = await fetch("/api/clicks/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, clickId }),
      });
      const data = await res.json();
      if (data.success) {
        setMatchedSuccess(true);
        fetchRecentClicks();
        if (onMatched) onMatched();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setMatchingId(null);
    }
  };

  return (
    <div className="bg-slate-900 text-white p-5 rounded-3xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider">
          <MousePointer className="w-4 h-4 text-orange-500" />
          Привязать клик (100% матчинг)
        </div>
        <button
          onClick={fetchRecentClicks}
          className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          title="Обновить"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {matchedSuccess && (
        <div className="bg-emerald-500/10 text-emerald-400 p-3 rounded-xl text-xs flex items-center gap-2 border border-emerald-500/20">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          Клик успешно привязан! Маркетинговые метки сохранены в карточку.
        </div>
      )}

      {clicks.length === 0 ? (
        <p className="text-xs text-slate-400 py-2 text-center">
          {loading ? "Загрузка кликов..." : "Нет нераспределенных кликов за 48 часов"}
        </p>
      ) : (
        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {clicks.map((click) => {
            const dateStr = new Date(click.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={click.id}
                className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60 flex items-center justify-between text-xs hover:border-orange-500/50 transition-colors"
              >
                <div className="space-y-1.5 min-w-0 pr-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-orange-400">{click.code}</span>
                    <span className="text-[10px] text-slate-400 font-mono">[{dateStr}]</span>
                    <span className="uppercase text-[9px] bg-slate-700 px-1.5 py-0.5 rounded text-slate-300 font-bold">
                      {click.type}
                    </span>
                    {click.deviceType && (
                      <span className="text-slate-400" title={`${click.deviceType} - ${click.os}`}>
                        {click.deviceType === 'Mobile' ? <Smartphone className="w-3 h-3" /> : click.deviceType === 'Tablet' ? <Tablet className="w-3 h-3" /> : <Monitor className="w-3 h-3" />}
                      </span>
                    )}
                  </div>
                  
                  <div className="text-[10px] text-slate-400 space-y-0.5">
                    {click.pageUrl && (
                      <div className="flex items-center gap-1.5 truncate">
                        <Globe className="w-3 h-3 text-slate-500 shrink-0" />
                        <span className="truncate" title={click.pageUrl}>{click.pageUrl.replace(/^https?:\/\/[^/]+/, '') || '/'}</span>
                      </div>
                    )}
                    
                    {click.timeOnSiteSeconds !== undefined && click.timeOnSiteSeconds !== null && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-slate-500 shrink-0" />
                        <span>Время на сайте: <strong className="text-slate-300">{Math.floor(click.timeOnSiteSeconds / 60)}м {click.timeOnSiteSeconds % 60}с</strong> до клика</span>
                      </div>
                    )}
                    
                    {(click.utmSource || click.browser) && (
                      <div className="flex items-center gap-1.5 truncate">
                        <FileText className="w-3 h-3 text-slate-500 shrink-0" />
                        <span className="truncate">
                          {click.utmSource ? `utm_source: ${click.utmSource}` : 'Прямой'} 
                          {click.browser ? ` • ${click.browser}` : ''}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {leadId ? (
                  <Button
                    size="sm"
                    variant="solid"
                    onClick={() => handleMatch(click.id)}
                    isLoading={matchingId === click.id}
                    className="shrink-0 text-[11px] py-1 px-3"
                  >
                    <LinkIcon className="w-3 h-3 mr-1" />
                    Связать
                  </Button>
                ) : (
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
                    Ожидает сообщения с кодом {click.code}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
