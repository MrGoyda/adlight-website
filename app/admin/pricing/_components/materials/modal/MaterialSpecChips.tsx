"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";

interface MaterialSpecChipsProps {
  description: string;
  onDescriptionChange: (desc: string) => void;
  suggestedChips: string[];
}

export default function MaterialSpecChips({
  description,
  onDescriptionChange,
  suggestedChips,
}: MaterialSpecChipsProps) {
  const handleToggleSpecChip = (chip: string) => {
    triggerHaptic("light");
    if (!description.trim()) {
      onDescriptionChange(chip);
      return;
    }
    if (description.includes(chip)) {
      // Удаляем чип, если уже есть
      const cleaned = description
        .replace(new RegExp(`(?:^|\\s*•\\s*)${chip}`, "gi"), "")
        .replace(/^\s*•\s*/, "")
        .trim();
      onDescriptionChange(cleaned);
    } else {
      // Добавляем чип через разделитель •
      onDescriptionChange(`${description} • ${chip}`);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-orange-500" />
          <span>Характеристики для умных фильтров</span>
        </label>
        <span className="text-[10px] text-slate-400 font-semibold">
          Кликните для добавления
        </span>
      </div>

      {/* Быстрые чипы */}
      {suggestedChips.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2 p-2 rounded-xl bg-slate-50 border border-slate-200/70">
          {suggestedChips.map((chip) => {
            const isSelected = description.includes(chip);
            return (
              <button
                key={chip}
                type="button"
                onClick={() => handleToggleSpecChip(chip)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition cursor-pointer active:scale-95 ${
                  isSelected
                    ? "bg-orange-500 text-white font-black shadow-2xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-orange-50 hover:text-orange-700"
                }`}
              >
                {isSelected ? `✓ ${chip}` : `+ ${chip}`}
              </button>
            );
          })}
        </div>
      )}

      <textarea
        rows={2}
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        placeholder="Размер листа 2.05х3.05м, толщина 3мм, плотность 0.60, цвет белый..."
        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:border-orange-500 outline-none resize-none box-border"
      />
    </div>
  );
}
