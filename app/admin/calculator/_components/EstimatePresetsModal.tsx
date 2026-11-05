"use client";

import React, { useState } from "react";
import { X, Sparkles, Star, Trash2, ArrowRight } from "lucide-react";
import BottomSheet from "@/components/ui/BottomSheet";
import { EstimatePresetData } from "../_types/calculatorTypes";
import { UNIT_LABELS } from "../_data/estimateSpreadsheetDictionary";
import { deleteEstimatePreset, togglePresetFavorite } from "../calculatorActions";
import { toast } from "@/lib/toast";
import { triggerHaptic } from "@/lib/haptics";

interface EstimatePresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  presets: EstimatePresetData[];
  onApplyPreset: (preset: EstimatePresetData, mode: "replace" | "append") => void;
  onRefreshPresets?: () => void;
}

export default function EstimatePresetsModal({
  isOpen,
  onClose,
  presets,
  onApplyPreset,
  onRefreshPresets,
}: EstimatePresetsModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [inspectingPreset, setInspectingPreset] = useState<EstimatePresetData | null>(
    presets[0] || null
  );

  const categories = React.useMemo(() => {
    const set = new Set<string>();
    presets.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [presets]);

  const filteredPresets = React.useMemo(() => {
    if (selectedCategory === "all") return presets;
    return presets.filter((p) => p.category === selectedCategory);
  }, [presets, selectedCategory]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Удалить шаблон "${name}"?`)) return;
    triggerHaptic("medium");
    const res = await deleteEstimatePreset(id);
    if (res.success) {
      toast.success("Шаблон удален");
      if (inspectingPreset?.id === id) {
        setInspectingPreset(null);
      }
      onRefreshPresets?.();
    } else {
      toast.error(res.error || "Ошибка удаления");
    }
  };

  const handleToggleFavorite = async (id: string, currentFav: boolean) => {
    triggerHaptic("light");
    const res = await togglePresetFavorite(id, !currentFav);
    if (res.success) {
      toast.success(res.isFavorite ? "Добавлено в избранные шаблоны" : "Убрано из избранного");
      onRefreshPresets?.();
    }
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-4xl"
      maxHeight="max-h-[90dvh]"
      desktopVariant="modal"
      desktopWidth="lg:w-[920px]"
    >
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Шаблоны типовых проектов (Пресеты)</h3>
            <p className="text-xs text-slate-500">
              Готовые наборы материалов и работ для наружной рекламы
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-5 flex flex-col md:flex-row gap-5 max-h-[70vh] overflow-y-auto">
        {/* Левая колонка: категории и список пресетов */}
        <div className="w-full md:w-5/12 space-y-3">
          {/* Фильтр категорий */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition shrink-0 ${
                selectedCategory === "all"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Все ({presets.length})
            </button>
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedCategory(c)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition shrink-0 ${
                  selectedCategory === c
                    ? "bg-orange-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Список шаблонов */}
          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {filteredPresets.map((preset) => {
              const isSelected = inspectingPreset?.id === preset.id;
              return (
                <div
                  key={preset.id}
                  onClick={() => setInspectingPreset(preset)}
                  className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? "border-orange-500 bg-orange-50/50 shadow-2xs"
                      : "border-slate-200/80 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {preset.name}
                      </span>
                      {preset.isFavorite && (
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {preset.category || "Общий"} • {preset.items.length} позиций
                    </div>
                  </div>

                  <ArrowRight className={`w-4 h-4 shrink-0 transition ${isSelected ? "text-orange-600" : "text-slate-300"}`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Правая колонка: просмотр выбранного пресета и действия */}
        <div className="w-full md:w-7/12 flex flex-col justify-between bg-slate-50/80 rounded-3xl p-4 border border-slate-200/70">
          {inspectingPreset ? (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-100/60 px-2 py-0.5 rounded-full">
                    {inspectingPreset.category || "Шаблон"}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleToggleFavorite(inspectingPreset.id, inspectingPreset.isFavorite)}
                      className="p-1.5 text-slate-400 hover:text-amber-500 rounded-lg hover:bg-white transition"
                      title="Избранный шаблон"
                    >
                      <Star className={`w-4 h-4 ${inspectingPreset.isFavorite ? "text-amber-500 fill-amber-500" : ""}`} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(inspectingPreset.id, inspectingPreset.name)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white transition"
                      title="Удалить шаблон"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h4 className="text-base font-bold text-slate-900 mt-1">
                  {inspectingPreset.name}
                </h4>
                {inspectingPreset.description && (
                  <p className="text-xs text-slate-500 mt-1">
                    {inspectingPreset.description}
                  </p>
                )}
              </div>

              {/* Содержимое позиций шаблона */}
              <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1 bg-white p-2.5 rounded-2xl border border-slate-200/60">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-100">
                  Состав комплекта ({inspectingPreset.items.length}):
                </div>
                {inspectingPreset.items.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between py-1 text-xs border-b border-slate-50 last:border-0">
                    <span className="text-slate-700 font-medium truncate max-w-[240px]">
                      {it.name}
                    </span>
                    <span className="font-mono text-slate-500 shrink-0 text-[11px]">
                      {it.quantity} {UNIT_LABELS[it.unit]}
                    </span>
                  </div>
                ))}
              </div>

              {/* Кнопки применения */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onApplyPreset(inspectingPreset, "replace");
                    onClose();
                  }}
                  className="flex-1 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-2xl transition shadow-xs active:scale-95 text-center"
                >
                  Заменить текущую смету
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onApplyPreset(inspectingPreset, "append");
                    onClose();
                  }}
                  className="flex-1 py-2.5 px-3 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold rounded-2xl transition active:scale-95 text-center"
                >
                  + Добавить к смете
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400 text-xs">
              Выберите шаблон слева для предпросмотра
            </div>
          )}
        </div>
      </div>
    </BottomSheet>
  );
}
