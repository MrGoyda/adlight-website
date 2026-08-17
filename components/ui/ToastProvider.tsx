"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  X, 
  AlertTriangle, 
  ArrowRight,
  Trash2 
} from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  isExiting?: boolean;
}

export interface ConfirmDialogOptions {
  id?: string;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
}

export default function ToastProvider() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogOptions | null>(null);
  const [confirmExiting, setConfirmExiting] = useState(false);
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const removeToast = useCallback((id: string) => {
    // Очищаем существующий таймер
    const existingTimer = timersRef.current.get(id);
    if (existingTimer) {
      clearTimeout(existingTimer);
      timersRef.current.delete(id);
    }

    // 1. Помечаем как закрывающийся (запуск плавной CSS анимации выхода)
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isExiting: true } : t))
    );

    // 2. Через 200ms полностью удаляем из DOM
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 200);
  }, []);

  const addToast = useCallback((toast: Omit<ToastItem, "id"> & { id?: string }) => {
    const id = toast.id || `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const duration = toast.duration || (toast.type === "error" ? 4000 : 2800);

    const newItem: ToastItem = {
      ...toast,
      id,
      duration,
      isExiting: false,
    };

    if (toast.type === "success") triggerHaptic("success");
    else if (toast.type === "error") triggerHaptic("error");
    else triggerHaptic("light");

    // Оставляем максимум 3 активных тоста, чтобы не загромождать экран
    setToasts((prev) => [...prev.filter((t) => !t.isExiting).slice(-2), newItem]);

    // Таймер авто-закрытия
    const timer = setTimeout(() => {
      removeToast(id);
    }, duration);

    timersRef.current.set(id, timer);
  }, [removeToast]);

  const closeConfirm = useCallback((callback?: () => void) => {
    triggerHaptic("light");
    setConfirmExiting(true);
    setTimeout(() => {
      if (callback) callback();
      setConfirmDialog(null);
      setConfirmExiting(false);
    }, 200);
  }, []);

  useEffect(() => {
    const handleToastEvent = (e: Event) => {
      const customEvent = e as CustomEvent<Omit<ToastItem, "id"> & { id?: string }>;
      if (customEvent.detail) {
        addToast(customEvent.detail);
      }
    };

    const handleConfirmEvent = (e: Event) => {
      const customEvent = e as CustomEvent<ConfirmDialogOptions>;
      if (customEvent.detail) {
        triggerHaptic("warning");
        setConfirmDialog(customEvent.detail);
        setConfirmExiting(false);
      }
    };

    window.addEventListener("crm:toast", handleToastEvent);
    window.addEventListener("crm:confirm", handleConfirmEvent);

    return () => {
      window.removeEventListener("crm:toast", handleToastEvent);
      window.removeEventListener("crm:confirm", handleConfirmEvent);
      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current.clear();
    };
  }, [addToast]);

  return (
    <>
      <style>{`
        @keyframes adlightToastIn {
          0% {
            opacity: 0;
            transform: translateY(-14px) scale(0.96);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes adlightToastOut {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-10px) scale(0.96);
          }
        }
        .adlight-toast-enter {
          animation: adlightToastIn 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform, opacity;
        }
        .adlight-toast-exit {
          animation: adlightToastOut 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform, opacity;
        }
      `}</style>

      {/* ── Всплывающие уведомления (Native CSS GPU-accelerated Toasts) ── */}
      <div 
        className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0 z-[999999] flex flex-col gap-2 max-w-sm w-[calc(100%-2rem)] sm:w-96 pointer-events-none"
      >
        {toasts.map((toast) => {
          const isSuccess = toast.type === "success";
          const isError = toast.type === "error";
          const isWarning = toast.type === "warning";

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto p-3 sm:p-3.5 rounded-2xl border shadow-xl flex ${
                toast.title ? "items-start" : "items-center"
              } gap-3 backdrop-blur-2xl transition-all ${
                toast.isExiting ? "adlight-toast-exit" : "adlight-toast-enter"
              } ${
                isSuccess
                  ? "bg-slate-900/95 border-emerald-500/40 text-white shadow-emerald-950/20"
                  : isError
                  ? "bg-slate-900/95 border-rose-500/40 text-white shadow-rose-950/20"
                  : isWarning
                  ? "bg-slate-900/95 border-amber-500/40 text-white shadow-amber-950/20"
                  : "bg-slate-900/95 border-slate-700/60 text-white shadow-slate-950/20"
              }`}
            >
              {/* Иконка */}
              <div className="shrink-0 flex items-center justify-center">
                {isSuccess && (
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
                {isError && (
                  <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30 shrink-0">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                )}
                {isWarning && (
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 shrink-0">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                )}
                {!isSuccess && !isError && !isWarning && (
                  <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30 shrink-0">
                    <Info className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Текст */}
              <div className="flex-1 min-w-0">
                {toast.title && (
                  <h4 className="text-xs font-black text-white leading-tight mb-0.5">
                    {toast.title}
                  </h4>
                )}
                <p className="text-xs sm:text-[13px] font-bold leading-snug text-slate-100 break-words">
                  {toast.message}
                </p>
              </div>

              {/* Крестик закрытия */}
              <button
                type="button"
                onClick={() => {
                  triggerHaptic("light");
                  removeToast(toast.id);
                }}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer shrink-0 flex items-center justify-center"
                aria-label="Закрыть"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* ── Кастомный модальный диалог подтверждения (Confirm Dialog) ── */}
      {confirmDialog && (
        <div className="fixed inset-0 z-[1000000] flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Затемнение с блюром */}
          <div
            onClick={() => closeConfirm(confirmDialog.onCancel)}
            className={`absolute inset-0 bg-slate-950/60 backdrop-blur-xs cursor-pointer transition-opacity duration-200 ${
              confirmExiting ? "opacity-0" : "opacity-100"
            }`}
          />

          {/* Карточка диалога */}
          <div
            className={`relative w-full max-w-md bg-white rounded-t-[32px] sm:rounded-3xl shadow-2xl border border-slate-200 p-6 z-10 text-slate-900 space-y-4 select-none transition-all duration-200 ${
              confirmExiting 
                ? "translate-y-full sm:scale-95 opacity-0" 
                : "translate-y-0 sm:scale-100 opacity-100"
            }`}
          >
            {/* Полоска свайпа для смартфонов */}
            <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto sm:hidden" />

            <div className="flex items-start gap-3.5">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                confirmDialog.isDestructive 
                  ? "bg-rose-50 text-rose-600 border border-rose-200" 
                  : "bg-amber-50 text-amber-600 border border-amber-200"
              }`}>
                {confirmDialog.isDestructive ? (
                  <Trash2 className="w-5 h-5" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-base font-black text-slate-900 leading-tight">
                  {confirmDialog.title}
                </h3>
                {confirmDialog.message && (
                  <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                    {confirmDialog.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => closeConfirm(confirmDialog.onCancel)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold transition active:scale-95 cursor-pointer"
              >
                {confirmDialog.cancelText || "Отмена"}
              </button>

              <button
                type="button"
                onClick={() => {
                  triggerHaptic(confirmDialog.isDestructive ? "error" : "success");
                  closeConfirm(confirmDialog.onConfirm);
                }}
                className={`px-5 py-2.5 rounded-xl text-white text-xs font-black shadow-md transition active:scale-95 flex items-center gap-1.5 cursor-pointer ${
                  confirmDialog.isDestructive
                    ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20"
                    : "bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 shadow-orange-500/20"
                }`}
              >
                <span>{confirmDialog.confirmText || "Подтвердить"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
