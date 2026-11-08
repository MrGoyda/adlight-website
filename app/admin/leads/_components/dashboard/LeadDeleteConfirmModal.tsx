"use client";

import React from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { LEADS_DICTIONARY } from "../../_data/leadsDictionary";

interface LeadDeleteConfirmModalProps {
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isPermanent?: boolean;
}

export default function LeadDeleteConfirmModal({
  onClose,
  onConfirm,
  isPermanent = false,
}: LeadDeleteConfirmModalProps) {
  const dict = LEADS_DICTIONARY.deleteModal;

  const title = isPermanent ? dict.permanentTitle : dict.title;
  const description = isPermanent ? dict.permanentDescription : dict.description;
  const warning = isPermanent ? dict.permanentWarning : dict.warning;
  const confirmBtn = isPermanent ? dict.permanentConfirmBtn : dict.confirmBtn;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-sm shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 leading-tight">
              {title}
            </h3>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
              {warning}
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          {description}
        </p>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="text-xs font-bold py-2"
          >
            {dict.cancelBtn}
          </Button>
          <Button
            type="button"
            variant="solid"
            onClick={onConfirm}
            className="text-xs font-black py-2 px-4 bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20"
          >
            {confirmBtn}
          </Button>
        </div>
      </div>
    </div>
  );
}
