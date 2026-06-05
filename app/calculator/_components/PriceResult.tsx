"use client";

import { MessageCircle, Phone, Clock, Ruler } from "lucide-react";
import Button from "@/components/ui/Button";
import PriceBreakdown from "./PriceBreakdown";
import { CALC_UI } from "@/dictionaries/calculator";

interface BreakdownItem {
  label: string;
  value: string;
}

interface PriceResultProps {
  min: number;
  max: number;
  breakdown: BreakdownItem[];
  whatsappLink: string;
  onOpenModal: () => void;
}

export default function PriceResult({
  min,
  max,
  breakdown,
  whatsappLink,
  onOpenModal,
}: PriceResultProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 space-y-5">
      {/* Заголовок и сумма */}
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          {CALC_UI.resultLabel}
        </p>
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-3xl font-black text-slate-900 tabular-nums tracking-tight">
            {min.toLocaleString("ru")}
          </span>
          <span className="text-xl text-slate-400 font-medium">–</span>
          <span className="text-3xl font-black text-slate-900 tabular-nums tracking-tight">
            {max.toLocaleString("ru")}
          </span>
          <span className="text-xl text-slate-500 font-bold">₸</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-2.5 leading-relaxed">
          {CALC_UI.resultDisclaimer}
        </p>
      </div>

      {/* Детализация */}
      <PriceBreakdown items={breakdown} />

      {/* Доп. строки */}
      <div className="space-y-2 pt-4 border-t border-slate-100">
        <div className="flex justify-between text-sm">
          <span className="flex items-center gap-1.5 text-slate-500">
            <Clock className="w-3.5 h-3.5" />
            {CALC_UI.productionTime}
          </span>
          <span className="text-slate-800 font-medium">{CALC_UI.productionTimeValue}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="flex items-center gap-1.5 text-slate-500">
            <Ruler className="w-3.5 h-3.5" />
            {CALC_UI.measureFree}
          </span>
          <span className="text-emerald-600 font-bold">{CALC_UI.measureFreeValue}</span>
        </div>
      </div>

      {/* Две кнопки */}
      <div className="flex flex-col gap-3 pt-2">
        <Button
          type="button"
          variant="solid"
          size="lg"
          className="w-full bg-orange-500 hover:bg-orange-600 border-transparent text-white font-bold rounded-xl"
          leftIcon={<Phone className="w-4 h-4" />}
          onClick={onOpenModal}
        >
          {CALC_UI.ctaModal}
        </Button>

        <Button
          href={whatsappLink}
          variant="outline"
          size="lg"
          className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50 font-bold rounded-xl"
          leftIcon={<MessageCircle className="w-4 h-4" />}
        >
          {CALC_UI.ctaWhatsapp}
        </Button>
      </div>
    </div>
  );
}
