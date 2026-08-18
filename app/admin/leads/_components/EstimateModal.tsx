"use client";

import React from "react";
import { X, Calculator, AlertTriangle, Clock } from "lucide-react";
import { EstimateModalProps } from "./estimate/types";
import { useEstimateState } from "./estimate/useEstimateState";
import { EstimateTopBar } from "./estimate/EstimateTopBar";
import { EstimateCardItem } from "./estimate/EstimateCardItem";
import { EstimateTable } from "./estimate/EstimateTable";
import { EstimateFloatingSummary } from "./estimate/EstimateFloatingSummary";
import { EstimateFooter } from "./estimate/EstimateFooter";
import { SupplierPricePickerModal } from "./estimate/SupplierPricePickerModal";
import { WorkOperationPickerModal } from "./estimate/WorkOperationPickerModal";
import BottomSheet from "@/components/ui/BottomSheet";

export default function EstimateModal({
  isOpen,
  onClose,
  leadId,
  leadName,
  initialItems,
  isStockDeducted,
  warehouseItems,
  supplierPrices,
  onSaveSuccess,
  leads = [],
  estimateId,
}: EstimateModalProps) {
  const {
    items,
    setItems,
    stockDeducted,
    selectedLeadId,
    setSelectedLeadId,
    error,
    isPending,
    isAtBottom,
    restoredDraftInfo,
    scrollContainerRef,
    itemsEndRef,
    workOperations,
    setWorkOperations,
    activePickerIdx,
    setActivePickerIdx,
    activeWorkOperationPickerIdx,
    setActiveWorkOperationPickerIdx,
    parsedPrices,
    breakdown,
    handleScroll,
    handleAddItem,
    handleRemoveItem,
    handleUpdateItemField,
    handleSave,
    handleDiscardDraft,
    handleDeductStock,
  } = useEstimateState({
    isOpen,
    onClose,
    leadId,
    initialItems,
    isStockDeducted,
    warehouseItems,
    supplierPrices,
    onSaveSuccess,
    estimateId,
  });

  const { totalCost, totalSell, margin, marginPercent } = breakdown;
  const hasStockMaterials = items.some((i) => i.type === "MATERIAL_STOCK" && i.warehouseItemId);

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-5xl"
      maxHeight="max-h-[92dvh]"
    >
      {/* Шапка */}
      <div className="p-4 sm:px-6 sm:py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-600 flex items-center justify-center shadow-2xs">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-slate-900 text-sm sm:text-base leading-tight">
                Калькулятор сметы
              </h3>
              {items.length > 0 && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[9px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Автосохранение
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 font-medium truncate max-w-[240px] sm:max-w-md">
              {leadName ? `Сделка: ${leadName}` : "Расчет себестоимости и маржинальности"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer active:scale-90"
          title="Закрыть (Esc)"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Топ-бар кнопок добавления категорий */}
      <EstimateTopBar onAddItem={handleAddItem} />

      {/* Оповещение о восстановлении несохраненного черновика из кэша */}
      {restoredDraftInfo && (
        <div className="mx-4 sm:mx-6 mt-2.5 p-2.5 sm:px-4 bg-amber-50/90 border border-amber-200/90 rounded-2xl flex items-center justify-between gap-3 text-amber-900 text-xs font-bold shrink-0 animate-in fade-in">
          <div className="flex items-center gap-2 min-w-0">
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="truncate">
              Восстановлен черновик ({restoredDraftInfo.count} поз., автосохранен в {restoredDraftInfo.time})
            </span>
          </div>
          <button
            type="button"
            onClick={handleDiscardDraft}
            className="text-[11px] text-rose-600 hover:text-rose-700 hover:underline font-black cursor-pointer shrink-0"
          >
            Сбросить
          </button>
        </div>
      )}

      {/* Ошибка */}
      {error && (
        <div className="mx-4 sm:mx-6 mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-bold shrink-0">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Основной скроллируемый список сметы */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-3 sm:p-6 pb-6 sm:pb-8 overscroll-contain relative"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {/* МОБИЛЬНЫЙ ВИД: КАРТОЧКИ (< 1024px) */}
        <div className="block lg:hidden space-y-3">
          {items.length === 0 ? (
            <div className="p-8 text-center bg-slate-50/70 border border-dashed border-slate-200 rounded-2xl text-slate-400">
              <Calculator className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-bold text-xs">Смета пуста</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Нажмите кнопку в панели сверху, чтобы добавить материал или работу
              </p>
            </div>
          ) : (
            items.map((item, idx) => (
              <EstimateCardItem
                key={idx}
                item={item}
                index={idx}
                warehouseItems={warehouseItems}
                supplierPrices={supplierPrices}
                onRemove={handleRemoveItem}
                onUpdateField={handleUpdateItemField}
                onOpenSupplierPicker={setActivePickerIdx}
                onOpenWorkOperationPicker={setActiveWorkOperationPickerIdx}
              />
            ))
          )}
        </div>

        {/* ДЕСКТОПНЫЙ ВИД: ТАБЛИЦА (≥ 1024px) */}
        <EstimateTable
          items={items}
          warehouseItems={warehouseItems}
          supplierPrices={supplierPrices}
          onRemove={handleRemoveItem}
          onUpdateField={handleUpdateItemField}
          onOpenSupplierPicker={setActivePickerIdx}
          onOpenWorkOperationPicker={setActiveWorkOperationPickerIdx}
        />

        {/* Итоговый футер в конце контента */}
        <EstimateFooter
          breakdown={breakdown}
          leadId={leadId}
          selectedLeadId={selectedLeadId}
          setSelectedLeadId={setSelectedLeadId}
          leads={leads}
          stockDeducted={stockDeducted}
          isPending={isPending}
          hasStockMaterials={hasStockMaterials}
          onDeductStock={handleDeductStock}
          onClose={onClose}
          onSave={handleSave}
        />

        {/* Якорь для автоприскролла */}
        <div ref={itemsEndRef} className="h-2" />
      </div>

      {/* Плавающая плашка итогов */}
      <EstimateFloatingSummary
        isVisible={!isAtBottom}
        itemCount={items.length}
        totalSell={totalSell}
        totalCost={totalCost}
        margin={margin}
        marginPercent={marginPercent}
        onScrollToBottom={() => itemsEndRef.current?.scrollIntoView({ behavior: "smooth" })}
      />

      {/* Модалка выбора материалов поставщика */}
      <SupplierPricePickerModal
        isOpen={activePickerIdx !== null}
        itemIndex={activePickerIdx}
        parsedPrices={parsedPrices}
        onSelect={(p) => {
          if (activePickerIdx !== null) {
            const updated = [...items];
            updated[activePickerIdx].supplierPriceId = p.id;
            updated[activePickerIdx].name = `${p.supplier}: ${p.originalName}`;
            updated[activePickerIdx].costPrice = p.price;
            updated[activePickerIdx].unit = p.unit;
            updated[activePickerIdx].sellPrice = p.price * 1.3;
            setItems(updated);
            setActivePickerIdx(null);
          }
        }}
        onClose={() => setActivePickerIdx(null)}
      />

      {/* Модалка выбора операций сборки и монтажа */}
      <WorkOperationPickerModal
        isOpen={activeWorkOperationPickerIdx !== null}
        itemIndex={activeWorkOperationPickerIdx}
        currentItem={activeWorkOperationPickerIdx !== null ? items[activeWorkOperationPickerIdx] : null}
        workOperations={workOperations}
        onSelect={(op) => {
          if (activeWorkOperationPickerIdx !== null) {
            const updated = [...items];
            updated[activeWorkOperationPickerIdx].name = op.name;
            updated[activeWorkOperationPickerIdx].unit = op.unit;
            updated[activeWorkOperationPickerIdx].costPrice = op.defaultCost;
            updated[activeWorkOperationPickerIdx].sellPrice = op.defaultPrice;
            setItems(updated);
            setActiveWorkOperationPickerIdx(null);
          }
        }}
        onSaveNewOperation={(newOp) => {
          setWorkOperations((prev) => [...prev.filter((p) => p.name !== newOp.name), newOp]);
        }}
        onClose={() => setActiveWorkOperationPickerIdx(null)}
      />
    </BottomSheet>
  );
}
