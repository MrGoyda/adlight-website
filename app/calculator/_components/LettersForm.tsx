"use client";

import { Slider } from "@/components/ui/slider";
import Input from "@/components/ui/Input";
import { CALC_UI, CALC_CONSTANTS } from "@/dictionaries/calculator";

interface LettersFormProps {
  titleText: string;
  onTitleChange: (v: string) => void;
  subTextRu: string;
  onSubRuChange: (v: string) => void;
  subTextKz: string;
  onSubKzChange: (v: string) => void;
  height: number;
  onHeightChange: (v: number) => void;
  subHeight: number;
  onSubHeightChange: (v: number) => void;
}

export default function LettersForm({
  titleText, onTitleChange,
  subTextRu, onSubRuChange,
  subTextKz, onSubKzChange,
  height, onHeightChange,
  subHeight, onSubHeightChange,
}: LettersFormProps) {
  const { HEIGHT, SUB_HEIGHT } = CALC_CONSTANTS;

  return (
    <div className="space-y-6">
      {/* Главная надпись */}
      <Input
        label={CALC_UI.mainText}
        id="calc-main-text"
        name="mainText"
        autoComplete="off"
        value={titleText}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder={CALC_UI.mainTextPlaceholder}
        variant="light"
      />

      {/* Высота главных букв */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {CALC_UI.heightLabel}
          </span>
          <span className="text-sm font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-100 tabular-nums">
            {height} см
          </span>
        </div>
        <Slider
          id="calc-height-range"
          min={HEIGHT.min}
          max={HEIGHT.max}
          step={HEIGHT.step}
          value={[height]}
          onValueChange={([v]) => onHeightChange(v)}
          aria-label={CALC_UI.heightLabel}
          className="[&_[data-radix-slider-range]]:bg-orange-500 [&_[data-radix-slider-thumb]]:border-orange-500"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 font-mono">
          <span>{HEIGHT.min} см</span>
          <span>{HEIGHT.max} см</span>
        </div>
      </div>

      {/* Блок подписей */}
      <div className="pt-5 border-t border-slate-100">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
          Подписи (RU / KZ) — опционально
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <Input
            label={CALC_UI.subTextRuLabel}
            id="calc-sub-ru"
            name="subRu"
            autoComplete="off"
            value={subTextRu}
            onChange={(e) => onSubRuChange(e.target.value)}
            placeholder={CALC_UI.subTextRuPlaceholder}
            variant="light"
          />
          <Input
            label={CALC_UI.subTextKzLabel}
            id="calc-sub-kz"
            name="subKz"
            autoComplete="off"
            value={subTextKz}
            onChange={(e) => onSubKzChange(e.target.value)}
            placeholder={CALC_UI.subTextKzPlaceholder}
            variant="light"
          />
        </div>

        {/* Высота подписи */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {CALC_UI.subHeightLabel}
            </span>
            <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 tabular-nums">
              {subHeight} см
            </span>
          </div>
          <Slider
            id="calc-sub-height"
            min={SUB_HEIGHT.min}
            max={SUB_HEIGHT.max}
            step={SUB_HEIGHT.step}
            value={[subHeight]}
            onValueChange={([v]) => onSubHeightChange(v)}
            aria-label={CALC_UI.subHeightLabel}
            className="[&_[data-radix-slider-range]]:bg-blue-500 [&_[data-radix-slider-thumb]]:border-blue-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 font-mono">
            <span>{SUB_HEIGHT.min} см</span>
            <span>{SUB_HEIGHT.max} см</span>
          </div>
        </div>
      </div>
    </div>
  );
}
