"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WorkOperationItem, EstimateItem } from "./types";
import { UNIT_LABELS } from "./constants";
import { DollarSign, Wrench, X, Search, Check, Sparkles, Plus } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { InventoryUnit } from "@prisma/client";
import { saveWorkOperation } from "../../workOperationActions";

interface WorkOperationPickerModalProps {
  isOpen: boolean;
  itemIndex: number | null;
  currentItem: EstimateItem | null;
  workOperations: WorkOperationItem[];
  onSelect: (op: WorkOperationItem) => void;
  onSaveNewOperation: (op: WorkOperationItem) => void;
  onClose: () => void;
}

export const WorkOperationPickerModal: React.FC<WorkOperationPickerModalProps> = ({
  isOpen,
  itemIndex,
  currentItem,
  workOperations,
  onSelect,
  onSaveNewOperation,
  onClose,
}) => {
  const [operationSearch, setOperationSearch] = useState("");
  const [newOpName, setNewOpName] = useState("");
  const [newOpCost, setNewOpCost] = useState<number | string>("");
  const [newOpUnit, setNewOpUnit] = useState<InventoryUnit>("PIECE");
  const [isSavingOp, setIsSavingOp] = useState(false);

  const filteredOperations = useMemo(() => {
    if (!currentItem) return [];
    const list = workOperations.filter((o) => o.type === currentItem.type);
    if (!operationSearch.trim()) return list;
    const s = operationSearch.toLowerCase().trim();
    return list.filter((o) => o.name.toLowerCase().includes(s));
  }, [currentItem, workOperations, operationSearch]);

  if (!isOpen || !currentItem) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-4">
        {/* Клик мимо (Backdrop) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs cursor-pointer"
        />

        {/* Модальное окно */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ type: "spring", damping: 26, stiffness: 300 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden z-10 flex flex-col max-h-[85dvh]"
        >
          {/* Шапка с крестиком */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  currentItem.type === "ASSEMBLY"
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}>
                {currentItem.type === "ASSEMBLY" ? (
                  <DollarSign className="w-5 h-5" />
                ) : (
                  <Wrench className="w-5 h-5" />
                )}
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-sm">
                  {currentItem.type === "ASSEMBLY" ? "Вид сборки цеха" : "Вид монтажа / демонтажа"}
                </h4>
                <p className="text-[11px] text-slate-500 font-medium">
                  Позиция #{itemIndex !== null ? itemIndex + 1 : ""} • выберите операцию или введите
                  свою
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer active:scale-90"
              title="Закрыть"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Поиск */}
          <div className="p-3 border-b border-slate-100 bg-white">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Поиск по названию операции..."
                value={operationSearch}
                onChange={(e) => setOperationSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-base sm:text-xs font-semibold bg-slate-100 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white transition text-slate-900"
              />
              {operationSearch && (
                <button
                  type="button"
                  onClick={() => setOperationSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Список операций из базы данных */}
          <div
            className="flex-1 overflow-y-auto p-3 space-y-1.5 overscroll-contain"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {filteredOperations.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs italic bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                Операций не найдено. Вы можете добавить свою ниже ⬇
              </div>
            ) : (
              filteredOperations.map((op) => {
                const isSelected =
                  currentItem.name.toLowerCase().trim() === op.name.toLowerCase().trim();
                return (
                  <button
                    key={op.id || op.name}
                    type="button"
                    onClick={() => {
                      triggerHaptic("light");
                      onSelect(op);
                    }}
                    className={`w-full p-3 rounded-2xl border text-left transition flex items-center justify-between cursor-pointer active:scale-98 ${
                      isSelected
                        ? currentItem.type === "ASSEMBLY"
                          ? "border-indigo-500 bg-indigo-50/70 shadow-2xs"
                          : "border-emerald-500 bg-emerald-50/70 shadow-2xs"
                        : "border-slate-100 hover:border-slate-200 hover:bg-slate-50 bg-white"
                    }`}
                  >
                    <div className="flex flex-col pr-2">
                      <span className="font-extrabold text-xs text-slate-900">{op.name}</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        Ед. изм: {UNIT_LABELS[op.unit || "PIECE"]}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-right">
                        <span className="text-xs font-black text-slate-900 block">
                          {op.defaultCost.toLocaleString()} ₸
                        </span>
                        <span className="text-[10px] text-slate-400 block font-bold">
                          продажа: {op.defaultPrice.toLocaleString()} ₸
                        </span>
                      </div>
                      {isSelected && (
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-white ${
                            currentItem.type === "ASSEMBLY" ? "bg-indigo-600" : "bg-emerald-600"
                          }`}
                        >
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Блок добавления кастомной операции в базу */}
          <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200/80 space-y-2.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Добавить новую операцию в базу данных:
            </span>

            <div className="space-y-2">
              <input
                type="text"
                placeholder="Название (напр. Сварка кронштейна 40x40)"
                value={newOpName}
                onChange={(e) => setNewOpName(e.target.value)}
                className="w-full px-3 py-2 text-base sm:text-xs font-bold bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-slate-900 shadow-2xs"
              />

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Оплата рабочим (₸)"
                  value={newOpCost}
                  onChange={(e) => setNewOpCost(e.target.value)}
                  className="w-full px-3 py-2 text-base sm:text-xs font-bold bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-slate-900 shadow-2xs"
                />
                <select
                  value={newOpUnit}
                  onChange={(e) => setNewOpUnit(e.target.value as InventoryUnit)}
                  className="w-full px-2 py-2 text-base sm:text-xs font-bold bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-slate-900 shadow-2xs"
                >
                  {Object.entries(UNIT_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                disabled={!newOpName.trim() || isSavingOp}
                onClick={async () => {
                  if (!newOpName.trim()) return;
                  setIsSavingOp(true);
                  triggerHaptic("medium");
                  const currentType = currentItem.type;
                  const cost = Number(newOpCost) || 0;
                  const sell = Math.round(cost * 1.3);

                  const res = await saveWorkOperation({
                    type: currentType,
                    name: newOpName.trim(),
                    unit: newOpUnit,
                    defaultCost: cost,
                    defaultPrice: sell,
                  });

                  setIsSavingOp(false);

                  if (res?.data) {
                    onSaveNewOperation(res.data as WorkOperationItem);
                    onSelect(res.data as WorkOperationItem);
                    triggerHaptic("success");
                  }
                }}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white rounded-xl text-xs font-black transition cursor-pointer active:scale-98 shadow-sm flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Сохранить в базу и выбрать
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
