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
            className={`pointer-events-auto p-4 rounded-2xl border shadow-2xl flex items-start justify-between gap-3 animate-in slide-in-from-bottom-5 fade-in duration-200 backdrop-blur-2xl ${
              isSuccess
                ? "bg-slate-900/95 border-emerald-500/40 text-white"
                : isError
                ? "bg-slate-900/95 border-rose-500/40 text-white"
                : "bg-slate-900/95 border-slate-700/60 text-white"
            }`}
          >
            <div className="flex items-start gap-3 min-w-0 flex-1">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
              {isError && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
              {!isSuccess && !isError && <Info className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />}
              <p className="text-xs font-bold leading-relaxed text-slate-100 break-words whitespace-pre-wrap">
                {toast.text}
              </p>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 text-slate-400 hover:text-white transition cursor-pointer shrink-0"
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
