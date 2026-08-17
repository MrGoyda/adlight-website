"use client";

import React from "react";
import { DollarSign, Calculator } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { Lead } from "../../_types/leadTypes";
import { LEADS_DICTIONARY } from "../../_data/leadsDictionary";

interface DrawerFinancesSectionProps {
  activeLead: Lead;
  editOfferedPrice: string;
  setEditOfferedPrice: (val: string) => void;
  editIsDiscounted: boolean;
  setEditIsDiscounted: (val: boolean) => void;
  editPrepayment: string;
  setEditPrepayment: (val: string) => void;
  onOpenEstimateModal: () => void;
}

export default function DrawerFinancesSection({
  activeLead,
  editOfferedPrice,
  setEditOfferedPrice,
  editIsDiscounted,
  setEditIsDiscounted,
  editPrepayment,
  setEditPrepayment,
  onOpenEstimateModal,
}: DrawerFinancesSectionProps) {
  const dict = LEADS_DICTIONARY.drawer;

  return (
    <div className="bg-slate-50/70 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 space-y-3.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
          {dict.financesTitle}
        </span>
        {editOfferedPrice && (
          <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
            {Number(editOfferedPrice).toLocaleString("ru")} ₸
          </span>
        )}
      </div>

      {/* Озвученная клиенту стоимость и скидка */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
        <div className="w-full">
          <label className="block text-[10px] text-slate-500 font-bold mb-1">
            {dict.offeredPriceAmount}
          </label>
          <input
            type="number"
            value={editOfferedPrice}
            onChange={(e) => setEditOfferedPrice(e.target.value)}
            placeholder="Например: 250000"
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-extrabold focus:border-orange-500 outline-none text-xs shadow-2xs transition"
          />
        </div>

        <label className="flex items-center gap-2.5 p-2 rounded-xl border border-slate-200/80 bg-white cursor-pointer select-none transition hover:bg-slate-50 shadow-2xs">
          <input
            type="checkbox"
            checked={editIsDiscounted}
            onChange={(e) => {
              triggerHaptic("light");
              setEditIsDiscounted(e.target.checked);
            }}
            className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300 cursor-pointer accent-orange-500"
          />
          <div className="min-w-0">
            <span className="block text-xs font-black text-slate-800">
              {dict.discountCheckbox}
            </span>
            <span className="block text-[10px] text-slate-400 font-medium truncate">
              {dict.discountSubtext}
            </span>
          </div>
        </label>
      </div>

      {/* Предоплата и кнопка сметы */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end pt-1">
        <div>
          <label className="block text-[10px] text-slate-500 font-bold mb-1">
            {dict.prepaymentLabel} (₸)
          </label>
          <input
            type="number"
            value={editPrepayment}
            onChange={(e) => setEditPrepayment(e.target.value)}
            placeholder="Сумма аванса..."
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-extrabold focus:border-orange-500 outline-none text-xs shadow-2xs transition"
          />
        </div>

        <button
          type="button"
          onClick={() => {
            triggerHaptic("light");
            onOpenEstimateModal();
          }}
          className="w-full py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-extrabold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs active:scale-98"
        >
          <Calculator className="w-3.5 h-3.5 text-purple-600" />
          <span>{activeLead.estimate ? "Открыть смету" : dict.calculateCostBtn}</span>
        </button>
      </div>
    </div>
  );
}
