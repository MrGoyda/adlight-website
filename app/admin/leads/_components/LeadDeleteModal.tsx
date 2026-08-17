"use client";

import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { LEADS_DICTIONARY } from "../_data/leadsDictionary";

interface LeadDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LeadDeleteModal({
  isOpen,
  onClose,
  onConfirm,
}: LeadDeleteModalProps) {
  if (!isOpen) return null;

  const dict = LEADS_DICTIONARY.deleteModal;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-white/90 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 p-6 shadow-apple-modal relative z-10 text-center animate-in fade-in zoom-in-95"
      >
        <h3 className="text-lg font-black text-slate-900 mb-2">{dict.title}</h3>
        <p className="text-slate-500 text-xs mb-6 font-medium">
          {dict.description}
          <br />
          <strong className="text-rose-600 block mt-2">
            {dict.warning}
          </strong>
        </p>

        <div className="flex gap-3">
          <Button
            type="button"
            onClick={onClose}
            variant="lightOutline"
            className="flex-1 py-3 text-xs font-bold text-slate-650"
          >
            {dict.cancelBtn}
          </Button>
          <Button
            onClick={onConfirm}
            variant="secondary"
            className="flex-1 py-3 text-xs font-bold bg-rose-600 border-rose-500 text-white hover:bg-rose-700 shadow-lg shadow-rose-500/10 hover:shadow-rose-500/20 active:scale-95"
          >
            {dict.confirmBtn}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
