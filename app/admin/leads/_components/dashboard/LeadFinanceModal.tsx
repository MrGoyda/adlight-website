"use client";

import React, { useState } from "react";
import { CheckCircle2, TrendingUp, ArrowRight } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import Button from "@/components/ui/Button";
import { Lead } from "../../_types/leadTypes";
import { LEADS_DICTIONARY } from "../../_data/leadsDictionary";

interface LeadFinanceModalProps {
  lead: Lead;
  onClose: () => void;
  onSubmit: (revenue: number, expenses: number) => Promise<void>;
  isFinancing: boolean;
}

export default function LeadFinanceModal({
  lead,
  onClose,
  onSubmit,
  isFinancing,
}: LeadFinanceModalProps) {
  const dict = LEADS_DICTIONARY.financeModal;
  const initialEstimateTotal = lead.estimate?.items?.reduce(
    (sum, i) => sum + (i.totalCost || 0),
    0
  ) || lead.offeredPrice || 0;

  const [revenue, setRevenue] = useState(initialEstimateTotal ? String(initialEstimateTotal) : "");
  const [expenses, setExpenses] = useState("");

  const numRevenue = parseFloat(revenue) || 0;
  const numExpenses = parseFloat(expenses) || 0;
  const profit = numRevenue - numExpenses;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic("success");
    await onSubmit(numRevenue, numExpenses);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-md shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 leading-tight">
                {dict.title}
              </h3>
              <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                {lead.name}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-xs font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              {dict.revenueLabel} *
            </label>
            <input
              type="number"
              required
              value={revenue}
              onChange={(e) => setRevenue(e.target.value)}
              placeholder="Сумма договора..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-extrabold text-slate-900 outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              {dict.expenseLabel}
            </label>
            <input
              type="number"
              value={expenses}
              onChange={(e) => setExpenses(e.target.value)}
              placeholder="Себестоимость материалов, монтажа..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-extrabold text-slate-900 outline-none focus:border-emerald-500"
            />
          </div>

          {/* Расчетная прибыль */}
          <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200/80 flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              {dict.profitLabel}:
            </span>
            <span className="text-sm font-black text-emerald-700">
              {profit.toLocaleString("ru")} ₸
            </span>
          </div>

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
              type="submit"
              variant="solid"
              disabled={isFinancing}
              className="text-xs font-black py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <span>{isFinancing ? "Фиксация..." : dict.submitBtn}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 inline" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
