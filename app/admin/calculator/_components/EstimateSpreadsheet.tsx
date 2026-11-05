"use client";

import React, { useState } from "react";
import { Sparkles, RotateCcw, Layers } from "lucide-react";
import { 
  CalculatorInitialData, 
  EstimatePresetData, 
  SpreadsheetItem 
} from "../_types/calculatorTypes";
import { useEstimateSpreadsheet } from "../_hooks/useEstimateSpreadsheet";
import EstimateTableGrid from "./EstimateTableGrid";
import EstimateQuickShelf from "./EstimateQuickShelf";
import EstimateFloatingBar from "./EstimateFloatingBar";
import EstimatePresetsModal from "./EstimatePresetsModal";
import SavePresetModal from "./SavePresetModal";
import EstimateLeadBinderModal from "./EstimateLeadBinderModal";
import { triggerHaptic } from "@/lib/haptics";

interface EstimateSpreadsheetProps {
  initialData: CalculatorInitialData;
  initialItems?: SpreadsheetItem[];
  contextLeadId?: string | null;
  contextLeadName?: string | null;
  isEmbedded?: boolean;
  onSaveSuccess?: (totalSell: number, totalCost: number) => void;
}

export default function EstimateSpreadsheet({
  initialData,
  initialItems,
  contextLeadId,
  contextLeadName,
  onSaveSuccess,
}: EstimateSpreadsheetProps) {
  const [presets] = useState<EstimatePresetData[]>(initialData.presets || []);
  const [isPresetsModalOpen, setIsPresetsModalOpen] = useState(false);
  const [isSavePresetModalOpen, setIsSavePresetModalOpen] = useState(false);
  const [isLeadBinderModalOpen, setIsLeadBinderModalOpen] = useState(false);
  const [isShelfVisible, setIsShelfVisible] = useState(true);

  const storageKey = contextLeadId
    ? `adlight_calc_draft_lead_${contextLeadId}`
    : "adlight_calc_draft_standalone";

  const {
    items,
    targetMultiplier,
    breakdown,
    handleAddEmptyRow,
    handleAddSupplierMaterial,
    handleAddWarehouseItem,
    handleAddWorkOperation,
    handleApplyPreset,
    handleUpdateItem,
    handleRemoveItem,
    handleClearAll,
    handleApplyMultiplierToAll,
    handleCopyClientProposal,
  } = useEstimateSpreadsheet({
    initialItems,
    storageKey,
  });

  return (
    <div className="space-y-4">
      {/* Верхняя компактная панель действий */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 sm:px-5 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">
                {contextLeadName ? `Смета: ${contextLeadName}` : "Интерактивный верстак сметы"}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                {items.length} поз.
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Быстрый просчет проекта, маржинальности и КП для клиента
            </p>
          </div>
        </div>

        {/* Кнопки управления пресетами и очисткой */}
        <div className="flex items-center gap-2">
          {/* Открыть каталог пресетов */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic("light");
              setIsPresetsModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 transition cursor-pointer active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>Шаблоны проектов</span>
            <span className="text-[10px] bg-white px-1.5 py-0.2 rounded-md font-mono text-slate-700">
              {presets.length}
            </span>
          </button>

          {/* Переключатель видимости полки накидывания */}
          <button
            type="button"
            onClick={() => setIsShelfVisible(!isShelfVisible)}
            className={`hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              isShelfVisible
                ? "bg-orange-50 text-orange-700 border border-orange-200"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
            title="Показать / скрыть полку быстрого накидывания"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Полка</span>
          </button>

          {/* Очистить смету */}
          {items.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (confirm("Очистить все строки сметы?")) {
                  handleClearAll();
                }
              }}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
              title="Очистить смету"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Основная рабочая область: Таблица + Полка */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
        {/* Табличная сетка */}
        <div className={`transition-all duration-200 ${isShelfVisible ? "xl:col-span-8 2xl:col-span-9" : "xl:col-span-12"}`}>
          <EstimateTableGrid
            items={items}
            supplierPrices={initialData.supplierPrices}
            workOperations={initialData.workOperations}
            warehouseItems={initialData.warehouseItems}
            onUpdateItem={handleUpdateItem}
            onRemoveItem={handleRemoveItem}
            onAddEmptyRow={handleAddEmptyRow}
            onAddSupplierMaterial={handleAddSupplierMaterial}
            onAddWorkOperation={handleAddWorkOperation}
          />
        </div>

        {/* Боковая полка быстрого накидывания */}
        {isShelfVisible && (
          <div className="xl:col-span-4 2xl:col-span-3 sticky top-4">
            <EstimateQuickShelf
              supplierPrices={initialData.supplierPrices}
              workOperations={initialData.workOperations}
              warehouseItems={initialData.warehouseItems}
              onAddSupplierMaterial={handleAddSupplierMaterial}
              onAddWorkOperation={handleAddWorkOperation}
              onAddWarehouseItem={handleAddWarehouseItem}
            />
          </div>
        )}
      </div>

      {/* Нижняя плавающая планка с моментальным пересчетом и экспортом */}
      <EstimateFloatingBar
        breakdown={breakdown}
        targetMultiplier={targetMultiplier}
        onApplyMultiplier={handleApplyMultiplierToAll}
        onCopyProposal={handleCopyClientProposal}
        onOpenSavePreset={() => setIsSavePresetModalOpen(true)}
        onOpenLeadBinder={() => setIsLeadBinderModalOpen(true)}
      />

      {/* Модальное окно просмотра и применения пресетов */}
      {isPresetsModalOpen && (
        <EstimatePresetsModal
          isOpen={isPresetsModalOpen}
          onClose={() => setIsPresetsModalOpen(false)}
          presets={presets}
          onApplyPreset={handleApplyPreset}
          onRefreshPresets={() => {
            // обновить список пресетов
          }}
        />
      )}

      {/* Модальное окно сохранения текущей сметы как пресет */}
      {isSavePresetModalOpen && (
        <SavePresetModal
          isOpen={isSavePresetModalOpen}
          onClose={() => setIsSavePresetModalOpen(false)}
          items={items}
          onSavedSuccess={() => {
            // обновить пресеты
          }}
        />
      )}

      {/* Модальное окно привязки к сделке или создания нового лида */}
      {isLeadBinderModalOpen && (
        <EstimateLeadBinderModal
          isOpen={isLeadBinderModalOpen}
          onClose={() => setIsLeadBinderModalOpen(false)}
          items={items}
          leads={initialData.leads}
          currentLeadId={contextLeadId}
          onSavedSuccess={() => {
            onSaveSuccess?.(breakdown.totalSell, breakdown.totalCost);
          }}
        />
      )}
    </div>
  );
}
