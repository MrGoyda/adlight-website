"use client";

import React, { useState } from "react";
import { X, BookmarkPlus } from "lucide-react";
import BottomSheet from "@/components/ui/BottomSheet";
import { SpreadsheetItem, EstimatePresetItem } from "../_types/calculatorTypes";
import { saveEstimatePreset } from "../calculatorActions";
import { toast } from "@/lib/toast";
import { triggerHaptic } from "@/lib/haptics";

interface SavePresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: SpreadsheetItem[];
  onSavedSuccess: () => void;
}

export default function SavePresetModal({
  isOpen,
  onClose,
  items,
  onSavedSuccess,
}: SavePresetModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Лайтбоксы");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Укажите название шаблона");
      return;
    }
    if (items.length === 0) {
      toast.error("Смета пуста, нечего сохранять");
      return;
    }

    setIsSubmitting(true);
    triggerHaptic("medium");

    const presetItems: EstimatePresetItem[] = items.map((i) => ({
      type: i.type,
      name: i.name,
      quantity: Number(i.quantity) || 1,
      unit: i.unit,
      costPrice: Number(i.costPrice) || 0,
      sellPrice: Number(i.sellPrice) || 0,
      supplierPriceId: i.supplierPriceId,
      warehouseItemId: i.warehouseItemId,
    }));

    const res = await saveEstimatePreset({
      name: name.trim(),
      category: category.trim(),
      description: description.trim() || undefined,
      items: presetItems,
      isFavorite: false,
    });

    setIsSubmitting(false);

    if (res.success) {
      toast.success(`Шаблон "${name}" сохранен!`);
      setName("");
      setDescription("");
      onSavedSuccess();
      onClose();
    } else {
      toast.error(res.error || "Не удалось сохранить шаблон");
    }
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-md"
      desktopVariant="modal"
      desktopWidth="w-[480px]"
    >
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <BookmarkPlus className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Сохранить как шаблон проекта</h3>
            <p className="text-[11px] text-slate-500">
              Позиции сметы ({items.length} шт.) будут сохранены в пресет
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSave} className="p-5 space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Название шаблона *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Например: Лайтбокс 2×1м двухсторонний"
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Категория конструкции
          </label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Лайтбоксы, Объемные буквы, Неон, Вывески..."
            list="preset-categories-list"
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 transition"
          />
          <datalist id="preset-categories-list">
            <option value="Лайтбоксы" />
            <option value="Объемные буквы" />
            <option value="Вывески из композита" />
            <option value="Неоновые вывески" />
            <option value="Крышные установки" />
            <option value="Таблички и оформление" />
          </datalist>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Примечание / спецификация (опционально)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Краткие заметки по расходу материалов или технологии изготовления..."
            rows={2}
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 transition resize-none"
          />
        </div>

        <div className="pt-2 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition shadow-xs disabled:opacity-50"
          >
            {isSubmitting ? "Сохранение..." : "Сохранить шаблон"}
          </button>
        </div>
      </form>
    </BottomSheet>
  );
}
