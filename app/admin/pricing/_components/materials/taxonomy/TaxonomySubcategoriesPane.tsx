"use client";

import React, { useState } from "react";
import { Plus, Edit2, Trash2, Check, X } from "lucide-react";
import { MaterialCategoryItem } from "../../../_data/pricingDictionary";
import { triggerHaptic } from "@/lib/haptics";
import { pricingDict } from "@/dictionaries/pricing";

interface TaxonomySubcategoriesPaneProps {
  activeCategory?: MaterialCategoryItem;
  subcategoryCounts: Record<string, number>;
  onAddSubcategory: (catId: string, subName: string) => boolean;
  onRenameSubcategory: (catId: string, oldName: string, newName: string) => boolean;
  onRequestDeleteSubcategory: (subName: string) => void;
}

export default function TaxonomySubcategoriesPane({
  activeCategory,
  subcategoryCounts,
  onAddSubcategory,
  onRenameSubcategory,
  onRequestDeleteSubcategory,
}: TaxonomySubcategoriesPaneProps) {
  const [newSubName, setNewSubName] = useState("");
  const [editingSubOldName, setEditingSubOldName] = useState<string | null>(null);
  const [editingSubNewName, setEditingSubNewName] = useState("");

  if (!activeCategory) return null;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim()) return;
    const ok = onAddSubcategory(activeCategory.id, newSubName.trim());
    if (ok) {
      setNewSubName("");
    }
  };

  const handleStartRename = (oldName: string) => {
    triggerHaptic("light");
    setEditingSubOldName(oldName);
    setEditingSubNewName(oldName);
  };

  const handleSaveRename = (oldName: string) => {
    if (!editingSubNewName.trim() || editingSubNewName.trim() === oldName) {
      setEditingSubOldName(null);
      return;
    }
    onRenameSubcategory(activeCategory.id, oldName, editingSubNewName.trim());
    setEditingSubOldName(null);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
      {/* Форма добавления подкатегории */}
      <form onSubmit={handleAddSubmit} className="flex gap-2">
        <input
          type="text"
          value={newSubName}
          onChange={(e) => setNewSubName(e.target.value)}
          placeholder={pricingDict.modals.taxonomy.subcategories.addPlaceholder(activeCategory.label)}
          className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white focus:border-orange-500 outline-none transition"
        />
        <button
          type="submit"
          disabled={!newSubName.trim()}
          className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-black transition cursor-pointer active:scale-98 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{pricingDict.modals.taxonomy.subcategories.addButton}</span>
        </button>
      </form>

      {/* Список подкатегорий */}
      <div className="space-y-1.5">
        {activeCategory.subcategories.map((sub) => {
          const count = subcategoryCounts[sub] ?? 0;
          const isEditing = editingSubOldName === sub;

          return (
            <div
              key={sub}
              className="flex items-center justify-between gap-3 p-2.5 rounded-2xl border border-slate-200/80 bg-white hover:border-slate-300 transition"
            >
              {isEditing ? (
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <input
                    type="text"
                    autoFocus
                    value={editingSubNewName}
                    onChange={(e) => setEditingSubNewName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveRename(sub);
                      if (e.key === "Escape") setEditingSubOldName(null);
                    }}
                    className="flex-1 px-2.5 py-1 rounded-lg border border-orange-400 bg-white text-xs font-bold text-slate-900 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleSaveRename(sub)}
                    className="p-1 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition cursor-pointer"
                    title={pricingDict.modals.taxonomy.subcategories.saveTooltip}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingSubOldName(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                    title={pricingDict.modals.taxonomy.subcategories.cancelTooltip}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                    <span className="text-xs font-bold text-slate-800 leading-snug break-words">
                      {sub}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-600"
                      title={pricingDict.modals.taxonomy.subcategories.itemsCount(count)}
                    >
                      {pricingDict.modals.taxonomy.subcategories.itemsCount(count)}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleStartRename(sub)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                      title={pricingDict.modals.taxonomy.subcategories.renameTooltip}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onRequestDeleteSubcategory(sub)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      title={pricingDict.modals.taxonomy.subcategories.deleteTooltip}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
