"use client";

import React, { useState } from "react";
import { X, ArrowDownLeft, ArrowUpRight, AlertCircle } from "lucide-react";
import BottomSheet from "@/components/ui/BottomSheet";
import { WarehouseItemData } from "../_types/warehouseTypes";
import { UNIT_LABELS } from "../constants";
import { adjustWarehouseStock } from "../actions";
import { toast } from "@/lib/toast";
import { triggerHaptic } from "@/lib/haptics";

interface WarehouseAdjustModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: WarehouseItemData | null;
  initialMode?: "in" | "out";
  onSuccess: () => void;
}

const COMMON_REASONS_IN = [
  "Поставка от поставщика",
  "Возврат остатков с объекта",
  "Корректировка после переучета (+)",
  "Начальное оприходование",
];

const COMMON_REASONS_OUT = [
  "Списание в производство рекламной конструкции",
  "Списание в проект по заказу клиента",
  "Брак при фрезеровке / повреждение",
  "Корректировка после инвентаризации (-)",
];

const QUICK_AMOUNTS = [1, 5, 10, 25, 50, 100];

export default function WarehouseAdjustModal({
  isOpen,
  onClose,
  item,
  initialMode = "in",
  onSuccess,
}: WarehouseAdjustModalProps) {
  const [direction, setDirection] = useState<"in" | "out">(initialMode);
  const [amount, setAmount] = useState<number>(1);
  const [reason, setReason] = useState<string>(
    initialMode === "in" ? COMMON_REASONS_IN[0] : COMMON_REASONS_OUT[0]
  );
  const [customReason, setCustomReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!item) return null;

  const unitLabel = UNIT_LABELS[item.unit] || item.unit;
  const quantityChange = direction === "in" ? Math.abs(amount) : -Math.abs(amount);
  const projectedQuantity = item.quantity + quantityChange;
  const isInvalid = direction === "out" && projectedQuantity < 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      toast.error("Количество должно быть больше нуля");
      return;
    }
    if (isInvalid) {
      toast.error(`Недостаточно товара на складе! В наличии: ${item.quantity} ${unitLabel}`);
      return;
    }

    const finalDescription = customReason.trim() || reason;
    if (!finalDescription.trim()) {
      toast.error("Укажите причину операции");
      return;
    }

    setIsSubmitting(true);
    triggerHaptic("medium");

    const res = await adjustWarehouseStock(item.id, quantityChange, finalDescription);
    setIsSubmitting(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success(
        direction === "in"
          ? `Оприходовано +${amount} ${unitLabel} (${item.name})`
          : `Списано -${amount} ${unitLabel} (${item.name})`
      );
      triggerHaptic("success");
      onSuccess();
      onClose();
    }
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-lg"
      desktopVariant="modal"
      desktopWidth="lg:w-[500px]"
    >
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
              direction === "in"
                ? "bg-emerald-50 text-emerald-600 border border-emerald-200/60"
                : "bg-amber-50 text-amber-600 border border-amber-200/60"
            }`}
          >
            {direction === "in" ? (
              <ArrowDownLeft className="w-5 h-5" />
            ) : (
              <ArrowUpRight className="w-5 h-5" />
            )}
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
              {direction === "in" ? "Оприходование на склад" : "Списание со склада"}
            </h3>
            <p className="text-xs text-slate-400 truncate max-w-[280px]">
              {item.name}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        {/* Переключатель направления: Приход / Расход */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => {
              triggerHaptic("light");
              setDirection("in");
              setReason(COMMON_REASONS_IN[0]);
            }}
            className={`py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              direction === "in"
                ? "bg-white text-emerald-700 shadow-2xs font-extrabold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>+ Приход</span>
          </button>
          <button
            type="button"
            onClick={() => {
              triggerHaptic("light");
              setDirection("out");
              setReason(COMMON_REASONS_OUT[0]);
            }}
            className={`py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              direction === "out"
                ? "bg-white text-amber-700 shadow-2xs font-extrabold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>- Списание</span>
          </button>
        </div>

        {/* Ввод количества */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
            <span>Количество ({unitLabel}):</span>
            <span className="text-[11px] text-slate-400 font-normal">
              В наличии: <strong className="text-slate-700 font-mono">{item.quantity}</strong> {unitLabel}
            </span>
          </label>
          <div className="relative">
            <input
              type="number"
              min="0.01"
              step="any"
              value={amount === 0 ? "" : amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              required
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-lg font-mono font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-orange-500 transition"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
              {unitLabel}
            </span>
          </div>

          {/* Быстрые пресеты количества */}
          <div className="flex items-center gap-1.5 pt-1 overflow-x-auto no-scrollbar">
            {QUICK_AMOUNTS.map((qty) => (
              <button
                key={qty}
                type="button"
                onClick={() => {
                  triggerHaptic("light");
                  setAmount(qty);
                }}
                className={`px-2.5 py-1 text-[11px] font-mono font-semibold rounded-lg border transition cursor-pointer ${
                  amount === qty
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                +{qty}
              </button>
            ))}
          </div>
        </div>

        {/* Причина операции */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">
            Основание / Причина:
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:bg-white cursor-pointer"
          >
            {(direction === "in" ? COMMON_REASONS_IN : COMMON_REASONS_OUT).map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Или введите свой комментарий (номер накладной, имя проекта)..."
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-orange-500 transition mt-1"
          />
        </div>

        {/* Превью изменения остатка */}
        <div
          className={`p-3 rounded-2xl border text-xs flex items-center justify-between ${
            isInvalid
              ? "bg-rose-50 border-rose-200 text-rose-700"
              : "bg-slate-50 border-slate-200 text-slate-600"
          }`}
        >
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">
              Расчет остатка:
            </div>
            <div className="font-mono font-bold mt-0.5">
              <span>{item.quantity}</span>
              <span className={direction === "in" ? "text-emerald-600" : "text-amber-600"}>
                {" "}
                {direction === "in" ? `+ ${amount}` : `- ${amount}`}
              </span>
              <span> = </span>
              <span className={`text-sm ${isInvalid ? "text-rose-600" : "text-slate-900"}`}>
                {projectedQuantity.toLocaleString("ru-RU")} {unitLabel}
              </span>
            </div>
          </div>
          {isInvalid && (
            <div className="flex items-center gap-1 text-rose-600 font-bold text-[11px]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Остаток уйдет в минус!</span>
            </div>
          )}
        </div>

        {/* Кнопки действий */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isInvalid || amount <= 0}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition active:scale-95 disabled:opacity-40 cursor-pointer ${
              direction === "in"
                ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"
                : "bg-amber-600 hover:bg-amber-700 shadow-amber-600/20"
            }`}
          >
            {isSubmitting ? "Сохранение..." : direction === "in" ? "Оприходовать" : "Списать"}
          </button>
        </div>
      </form>
    </BottomSheet>
  );
}
