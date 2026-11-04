"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/lib/toast";
import { triggerHaptic } from "@/lib/haptics";

/**
 * Проигрывает мягкий гармоничный звук уведомления (Web Audio API)
 * Не требует внешних mp3-файлов, работает автономно.
 */
function playChime() {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(880, ctx.currentTime); // A5
    osc2.frequency.exponentialRampToValueAtTime(1174.66, ctx.currentTime + 0.2); // D6

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.45);
    osc2.stop(ctx.currentTime + 0.45);

    // Предотвращение утечки AudioContext в Chromium (закрываем после воспроизведения)
    setTimeout(() => {
      ctx.close().catch(() => {});
    }, 550);
  } catch {
    // Аудио контекст может блокироваться браузером до первого клика — тихо игнорируем
  }
}

/**
 * Глобальный Realtime хук для CRM.
 * Подписывается на изменения таблиц Lead, DbTransaction, Project в Supabase
 * и автоматически обновляет данные через router.refresh() без перезагрузки страницы.
 */
export function useCrmRealtime() {
  const router = useRouter();
  const pathname = usePathname();
  const lastRefreshRef = useRef<number>(0);
  const pathnameRef = useRef<string | null>(pathname);

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    // Троттлинг обновлений, чтобы не спамить рендерами при пакетных операциях
    const safeRefresh = () => {
      const now = Date.now();
      if (now - lastRefreshRef.current > 1500) {
        lastRefreshRef.current = now;
        router.refresh();
      }
    };

    // Подписка на канал Realtime для CRM
    const channel = supabase
      .channel("crm-live-sync")
      // 1. События по Лидам
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "Lead" },
        (payload: any) => {
          const lead = payload.new;
          triggerHaptic("success");
          playChime();
          toast.success(
            `🔔 Новая заявка: ${lead.name || "Клиент"} (${lead.phone || ""})`
          );
          safeRefresh();
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "Lead" },
        () => {
          safeRefresh();
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "Lead" },
        () => {
          safeRefresh();
        }
      )
      // 2. События по Финансам (DbTransaction)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "DbTransaction" },
        () => {
          if (pathnameRef.current?.includes("/admin/finance")) {
            safeRefresh();
          }
        }
      )
      // 3. События по Проектам (Project)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Project" },
        () => {
          if (pathnameRef.current?.includes("/admin/projects")) {
            safeRefresh();
          }
        }
      )
      .subscribe();

    // Фоновая синхронизация при возвращении на вкладку (Focus / Visibility Sync)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        safeRefresh();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", safeRefresh);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", safeRefresh);
      supabase.removeChannel(channel);
    };
  }, [router]);
}
