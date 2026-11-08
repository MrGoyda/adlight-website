"use client";

import React, { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Archive, Trash2, X, CheckSquare, Square, RotateCcw } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { LEADS_DICTIONARY } from "../../_data/leadsDictionary";

interface LeadBulkActionDockProps {
  selectedCount: number;
  totalFilteredCount: number;
  isAllSelected: boolean;
  onToggleSelectAll: () => void;
  onBulkArchive: () => void;
  onBulkDelete: () => void;
  onClearSelection: () => void;
  isProcessing?: boolean;
  isArchiveMode?: boolean;
  onBulkReactivate?: () => void;
}

const emptySubscribe = () => () => {};

export default function LeadBulkActionDock({
  selectedCount,
  totalFilteredCount,
  isAllSelected,
  onToggleSelectAll,
  onBulkArchive,
  onBulkDelete,
  onClearSelection,
  isProcessing = false,
  isArchiveMode = false,
  onBulkReactivate,
}: LeadBulkActionDockProps) {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const dict = LEADS_DICTIONARY.bulkActions;

  if (!isClient || selectedCount === 0) return null;

  return createPortal(
    <div className="fixed bottom-6 inset-x-0 z-[9000] flex justify-center pointer-events-none px-4 animate-in slide-in-from-bottom-6 duration-200">
      <div 
        className="pointer-events-auto bg-slate-900/95 backdrop-blur-md text-white rounded-3xl px-4 py-2.5 sm:px-5 sm:py-3 shadow-2xl border border-slate-700/80 flex items-center gap-3 sm:gap-4 max-w-xl w-full justify-between select-none"
        role="toolbar"
        aria-label="Массовые операции"
      >
        {/* Индикатор выбора + Выбрать все */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={() => {
              triggerHaptic("light");
              onToggleSelectAll();
            }}
            className="flex items-center gap-1.5 text-xs font-black text-slate-300 hover:text-white transition cursor-pointer"
            title={isAllSelected ? dict.deselectAll : dict.selectAll}
          >
            {isAllSelected ? (
              <CheckSquare className="w-4 h-4 text-orange-400" />
            ) : (
              <Square className="w-4 h-4 text-slate-400" />
            )}
            <span className="truncate">
              {dict.selectedCount}: <span className="text-orange-400 font-extrabold">{selectedCount}</span>
              <span className="hidden sm:inline text-slate-400 font-medium"> / {totalFilteredCount}</span>
            </span>
          </button>
        </div>

        {/* Разделитель */}
        <div className="h-5 w-px bg-slate-700 shrink-0 hidden sm:block" />

        {/* Кнопки массовых действий */}
        <div className="flex items-center gap-2 shrink-0">
          {isArchiveMode && onBulkReactivate ? (
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => {
                triggerHaptic("medium");
                onBulkReactivate();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 font-black text-xs transition cursor-pointer active:scale-95 border border-orange-500/30 disabled:opacity-50"
              title={LEADS_DICTIONARY.archive.bulkReactivateBtn}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{LEADS_DICTIONARY.archive.bulkReactivateBtn}</span>
            </button>
          ) : (
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => {
                triggerHaptic("medium");
                onBulkArchive();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-black text-xs transition cursor-pointer active:scale-95 border border-amber-500/30 disabled:opacity-50"
              title={dict.archiveBtn}
            >
              <Archive className="w-3.5 h-3.5" />
              <span>{dict.archiveBtn}</span>
            </button>
          )}

          <button
            type="button"
            disabled={isProcessing}
            onClick={() => {
              triggerHaptic("medium");
              onBulkDelete();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-black text-xs transition cursor-pointer active:scale-95 border border-rose-500/30 disabled:opacity-50"
            title={dict.trashBtn}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{dict.trashBtn}</span>
          </button>

          {/* Снять выбор */}
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => {
              triggerHaptic("light");
              onClearSelection();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title={dict.deselectAll}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
