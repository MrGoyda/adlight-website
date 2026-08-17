"use client";

import React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { createPortal } from "react-dom";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  text: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export default function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0 || typeof window === "undefined") return null;

  return createPortal(
    <div className="fixed bottom-6 right-6 z-[999999] flex flex-col gap-3 max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const isSuccess = toast.type === "success";
        const isError = toast.type === "error";

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 sm:p-4 rounded-2xl border shadow-2xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom-5 fade-in duration-200 backdrop-blur-2xl ${
              isSuccess
                ? "bg-slate-900/95 border-emerald-500/40 text-white shadow-emerald-950/20"
                : isError
                ? "bg-slate-900/95 border-rose-500/40 text-white shadow-rose-950/20"
                : "bg-slate-900/95 border-slate-700/60 text-white shadow-slate-950/20"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
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
                {!isSuccess && !isError && (
                  <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30 shrink-0">
                    <Info className="w-4 h-4" />
                  </div>
                )}
              </div>
              <p className="text-xs sm:text-[13px] font-bold leading-snug text-slate-100 break-words flex-1">
                {toast.text}
              </p>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer shrink-0 flex items-center justify-center"
              aria-label="Закрыть"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>,
    document.body
  );
}
