"use client";

import { Slider } from "@/components/ui/slider";
import { CALC_UI, CALC_CONSTANTS } from "@/dictionaries/calculator";

interface LightboxFormProps {
  boxWidth: number;
  onWidthChange: (v: number) => void;
  boxHeight: number;
  onHeightChange: (v: number) => void;
}

export default function LightboxForm({
  boxWidth, onWidthChange,
  boxHeight, onHeightChange,
}: LightboxFormProps) {
  const { BOX_WIDTH, BOX_HEIGHT } = CALC_CONSTANTS;
  const area = ((boxWidth * boxHeight) / 10000).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Ширина */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {CALC_UI.widthLabel}
          </span>
          <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 tabular-nums">
            {boxWidth} см
          </span>
        </div>
        <Slider
          id="calc-box-width"
          min={BOX_WIDTH.min}
          max={BOX_WIDTH.max}
          step={BOX_WIDTH.step}
          value={[boxWidth]}
          onValueChange={([v]) => onWidthChange(v)}
          className="[&_[data-radix-slider-range]]:bg-blue-500 [&_[data-radix-slider-thumb]]:border-blue-500"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 font-mono">
          <span>{BOX_WIDTH.min} см</span>
          <span>{BOX_WIDTH.max} см</span>
        </div>
      </div>

      {/* Высота */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {CALC_UI.boxHeightLabel}
          </span>
          <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 tabular-nums">
            {boxHeight} см
          </span>
        </div>
        <Slider
          id="calc-box-height"
          min={BOX_HEIGHT.min}
          max={BOX_HEIGHT.max}
          step={BOX_HEIGHT.step}
          value={[boxHeight]}
          onValueChange={([v]) => onHeightChange(v)}
          className="[&_[data-radix-slider-range]]:bg-blue-500 [&_[data-radix-slider-thumb]]:border-blue-500"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 font-mono">
          <span>{BOX_HEIGHT.min} см</span>
          <span>{BOX_HEIGHT.max} см</span>
        </div>
      </div>

      {/* Итоговая площадь */}
      <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
        <span className="text-sm text-slate-500">Площадь короба</span>
        <span className="text-base font-bold text-slate-800 tabular-nums">{area} м²</span>
      </div>
    </div>
  );
}
