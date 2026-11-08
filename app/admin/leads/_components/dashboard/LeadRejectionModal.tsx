"use client";

import React, { useState } from "react";
import { AlertCircle, X, Check } from "lucide-react";
import Button from "@/components/ui/Button";
import { triggerHaptic } from "@/lib/haptics";
import { LEADS_DICTIONARY } from "../../_data/leadsDictionary";

interface LeadRejectionModalProps {
  isOpen: boolean;
  leadName: string;
  onClose: () => void;
  onConfirm: (reason: string | null) => Promise<void>;
}

export default function LeadRejectionModal({
  isOpen,
  leadName,
  onClose,
  onConfirm,
}: LeadRejectionModalProps) {
  const dict = LEADS_DICTIONARY.rejectionModal;
  const [selectedReasonId, setSelectedReasonId] = useState<string>("EXPENSIVE");
  const [customReason, setCustomReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSelectReason = (id: string) => {
    triggerHaptic("light");
    setSelectedReasonId(id);
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    triggerHaptic("medium");
    
    const chosenOption = dict.reasons.find((r) => r.id === selectedReasonId);
    let finalReason = chosenOption?.label || selectedReasonId;
    if (customReason.trim()) {
      finalReason = selectedReasonId === "OTHER" 
        ? customReason.trim() 
        : `${finalReason} (${customReason.trim()})`;
    }

    try {
      await onConfirm(finalReason);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = async () => {
    setIsSubmitting(true);
    triggerHaptic("light");
    try {
      await onConfirm(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-md shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Шапка */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 leading-tight">
                {dict.title}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {leadName ? `Клиент: ${leadName}` : dict.subtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Список типовых причин */}
        <div className="space-y-2 pt-1">
          {dict.reasons.map((r) => {
            const isSelected = selectedReasonId === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => handleSelectReason(r.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold text-left transition border ${
                  isSelected
                    ? "bg-orange-50/80 border-orange-500 text-orange-950 shadow-2xs"
                    : "bg-slate-50/70 hover:bg-slate-100/80 border-slate-200/80 text-slate-700"
                }`}
              >
                <span>{r.label}</span>
                {isSelected && (
                  <span className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Поле для уточнения */}
        <div>
          <input
            type="text"
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
            placeholder={dict.customReasonPlaceholder}
            className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
          />
        </div>

        {/* Кнопки действий */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={handleSkip}
            disabled={isSubmitting}
            className="text-xs font-bold text-slate-400 hover:text-slate-600 px-2 py-1.5 rounded-xl transition"
          >
            {dict.skipBtn}
          </button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-xs font-bold py-2"
            >
              Отмена
            </Button>
            <Button
              type="button"
              variant="solid"
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="text-xs font-black py-2 px-4 bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-600/20"
            >
              {isSubmitting ? "Сохранение..." : dict.confirmBtn}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
