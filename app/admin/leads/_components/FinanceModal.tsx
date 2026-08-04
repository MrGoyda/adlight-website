"use client";

import React from "react";
import { motion } from "framer-motion";
import { XCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import { triggerHaptic } from "@/lib/haptics";
import { crmDict } from "@/dictionaries/crm";

interface FinanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadName: string;
  revenueInput: string;
  setRevenueInput: (val: string) => void;
  expenseInput: string;
  setExpenseInput: (val: string) => void;
  isFinancing: boolean;
  onSubmit: (e: React.FormEvent) => void;
  prepayment: number;
  isPrepaymentPaid: boolean;
  setIsPrepaymentPaid: (val: boolean) => void;
  isBalancePaid: boolean;
  setIsBalancePaid: (val: boolean) => void;
}

import { lockScroll, unlockScroll } from "@/lib/scroll-lock";

export default function FinanceModal({
  isOpen,
  onClose,
  leadName,
  revenueInput,
  setRevenueInput,
  expenseInput,
  setExpenseInput,
  isFinancing,
  onSubmit,
  prepayment,
  isPrepaymentPaid,
  setIsPrepaymentPaid,
  isBalancePaid,
  setIsBalancePaid,
}: FinanceModalProps) {
  React.useEffect(() => {
    if (isOpen) {
      lockScroll("finance-modal");
      return () => unlockScroll("finance-modal");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const revenue = parseFloat(revenueInput) || 0;
  const balance = Math.max(0, revenue - prepayment);

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 pb-safe">
      {/* Overlay с анимацией и блюром */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity duration-300"
        onClick={() => { triggerHaptic("light"); onClose(); }}
      />

      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        transition={{ type: "spring", stiffness: 500, damping: 25 }}
        className="w-full max-w-md bg-white/90 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 p-8 shadow-apple-modal relative z-10"
      >
        <button
          type="button"
          onClick={() => { triggerHaptic("light"); onClose(); }}
          className="absolute top-4 right-4 p-2 text-slate-450 hover:text-slate-700 hover:bg-slate-100/85 rounded-full transition cursor-pointer active:scale-95"
        >
          <XCircle className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-black text-slate-900 mb-2">{crmDict.financeModal.title}</h3>
        <p className="text-slate-500 text-xs mb-6">
          {crmDict.financeModal.subtitle} **{leadName}**.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              {crmDict.financeModal.revenueLabel}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₸</span>
              <input
                type="number"
                required
                value={revenueInput}
                onChange={(e) => setRevenueInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-8 pr-4 text-slate-900 font-semibold focus:border-orange-500/50 focus:outline-none transition text-sm focus:ring-2 focus:ring-orange-500/20"
                placeholder="500 000"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              {crmDict.financeModal.expenseLabel}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₸</span>
              <input
                type="number"
                required
                value={expenseInput}
                onChange={(e) => setExpenseInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-8 pr-4 text-slate-900 font-semibold focus:border-orange-500/50 focus:outline-none transition text-sm focus:ring-2 focus:ring-orange-500/20"
                placeholder="150 000"
              />
            </div>
          </div>

          {/* Блок взаиморасчетов */}
          <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-2.5">
            <div className="flex justify-between text-xs font-semibold text-slate-500">
              <span>Предоплата (аванс):</span>
              <span className="text-slate-800">{prepayment.toLocaleString("ru")} ₸</span>
            </div>
            
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-500">Статус аванса:</span>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isPrepaymentPaid}
                  onChange={(e) => { triggerHaptic("light"); setIsPrepaymentPaid(e.target.checked); }}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-305 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                <span className={`ml-2 text-[10px] font-bold uppercase ${isPrepaymentPaid ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {isPrepaymentPaid ? 'Оплачен' : 'Не оплачен'}
                </span>
              </label>
            </div>

            <div className="h-[1px] bg-slate-200/60 my-2" />

            <div className="flex justify-between text-xs font-bold text-slate-700">
              <span>Остаток после сдачи:</span>
              <span className="text-slate-900">{balance.toLocaleString("ru")} ₸</span>
            </div>

            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-500">Зафиксировать получение остатка:</span>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isBalancePaid}
                  onChange={(e) => { triggerHaptic("light"); setIsBalancePaid(e.target.checked); }}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-305 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                <span className={`ml-2 text-[10px] font-bold uppercase ${isBalancePaid ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {isBalancePaid ? 'Получен' : 'Не получен'}
                </span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={() => { triggerHaptic("light"); onClose(); }}
              variant="lightOutline"
              className="flex-1 py-3 text-xs font-bold text-slate-650"
            >
              {crmDict.financeModal.cancel}
            </Button>
            <Button
              type="submit"
              disabled={isFinancing}
              variant="solid"
              className="flex-1 py-3 text-xs font-extrabold"
            >
              {isFinancing ? crmDict.financeModal.submitting : crmDict.financeModal.submitBtn}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
