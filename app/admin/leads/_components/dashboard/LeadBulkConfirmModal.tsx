"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Button from "@/components/ui/Button";
import { LEADS_DICTIONARY } from "../../_data/leadsDictionary";

interface LeadBulkConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  count: number;
  confirmBtnText: string;
  confirmBtnVariant?: "danger" | "warning" | "primary";
  icon?: React.ReactNode;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isProcessing?: boolean;
}

export default function LeadBulkConfirmModal({
  isOpen,
  title,
  description,
  count,
  confirmBtnText,
  confirmBtnVariant = "warning",
  icon,
  onClose,
  onConfirm,
  isProcessing = false,
}: LeadBulkConfirmModalProps) {
  const [mounted, setMounted] = useState(false);
  const deleteDict = LEADS_DICTIONARY.deleteModal;

  useEffect(() => {
    setMounted(true);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isProcessing) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, isProcessing]);

  if (!mounted || !isOpen) return null;

  const btnColor =
    confirmBtnVariant === "danger"
      ? "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20"
      : confirmBtnVariant === "warning"
      ? "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20"
      : "bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/20";

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 animate-in fade-in duration-200"
      onClick={isProcessing ? undefined : onClose}
    >
      <div
        className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-sm shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center gap-3">
          {icon && (
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
              {icon}
            </div>
          )}
          <div>
            <h3 className="text-base font-black text-slate-900 leading-tight">
              {title}
            </h3>
            <span className="text-[11px] font-bold text-slate-400">
              Количество: <span className="font-extrabold text-slate-700">{count} шт.</span>
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          {description}
        </p>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            disabled={isProcessing}
            onClick={onClose}
            className="text-xs font-bold py-2"
          >
            {deleteDict.cancelBtn}
          </Button>
          <Button
            type="button"
            variant="solid"
            disabled={isProcessing}
            onClick={onConfirm}
            className={`text-xs font-black py-2 px-4 shadow-md ${btnColor}`}
          >
            {isProcessing ? LEADS_DICTIONARY.bulkActions.processing : confirmBtnText}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
