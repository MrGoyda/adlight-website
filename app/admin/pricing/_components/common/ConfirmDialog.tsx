"use client";

import React, { useEffect } from "react";
import { AlertTriangle, Trash2, X, Loader2 } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string | React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning";
  isLoading?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Удалить",
  cancelLabel = "Отмена",
  variant = "danger",
  isLoading = false,
}: ConfirmDialogProps) {
  // Закрытие по клавише Esc
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const handleConfirmClick = async () => {
    triggerHaptic(variant === "danger" ? "error" : "medium");
    await onConfirm();
  };

  const handleCancelClick = () => {
    if (isLoading) return;
    triggerHaptic("light");
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 animate-in fade-in duration-150"
      onClick={handleCancelClick}
    >
      <div
        className="w-full max-w-md bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-200/90 relative animate-in zoom-in-95 duration-150 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Кнопка закрытия */}
        <button
          type="button"
          disabled={isLoading}
          onClick={handleCancelClick}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer disabled:opacity-50"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Иконка и заголовок */}
        <div className="flex items-start gap-3.5 pt-1">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
              variant === "danger"
                ? "bg-rose-100 text-rose-600 ring-4 ring-rose-50"
                : "bg-amber-100 text-amber-600 ring-4 ring-amber-50"
            }`}
          >
            {variant === "danger" ? (
              <Trash2 className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
          </div>
          <div className="min-w-0 pr-6">
            <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
              {title}
            </h3>
            <div className="text-xs sm:text-sm text-slate-500 font-medium mt-1 leading-relaxed">
              {description}
            </div>
          </div>
        </div>

        {/* Действия */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <button
            type="button"
            disabled={isLoading}
            onClick={handleCancelClick}
            className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 transition cursor-pointer disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={handleConfirmClick}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black text-white transition flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-98 disabled:opacity-50 ${
              variant === "danger"
                ? "bg-rose-600 hover:bg-rose-700 shadow-rose-200"
                : "bg-amber-600 hover:bg-amber-700 shadow-amber-200"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Удаление...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>{confirmLabel}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
