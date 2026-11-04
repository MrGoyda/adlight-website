"use client";

import React from "react";
import { Package, Plus } from "lucide-react";

interface MaterialEmptyStateProps {
  onResetFilters: () => void;
  onOpenCreateModal: () => void;
}

export default function MaterialEmptyState({
  onResetFilters,
  onOpenCreateModal,
}: MaterialEmptyStateProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center space-y-3">
      <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
        <Package className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-base font-extrabold text-slate-800">Позиции не найдены</h3>
        <p className="text-xs text-slate-400 font-medium max-w-sm mx-auto mt-1">
          Попробуйте изменить поисковый запрос или сбросить фильтры
        </p>
      </div>
      <div className="pt-2 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={onResetFilters}
          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
        >
          Сбросить все фильтры
        </button>
        <button
          type="button"
          onClick={onOpenCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Добавить материал</span>
        </button>
      </div>
    </div>
  );
}
