"use client";

import React, { useState, useMemo, useDeferredValue } from "react";
import { 
  X, 
  ArrowDownLeft, 
  Search, 
  Check, 
  Sparkles 
} from "lucide-react";
import BottomSheet from "@/components/ui/BottomSheet";
import { 
  WarehouseSupplierPriceData, 
  WarehouseItemData 
} from "../_types/warehouseTypes";
import { STOCK_LOCATIONS, UNIT_LABELS } from "../constants";
import { intakeFromSupplierPrice } from "../actions";
import { matchSearchQuery } from "@/lib/search";
import { toast } from "@/lib/toast";
import { triggerHaptic } from "@/lib/haptics";

interface WarehouseSupplierIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplierPrices: WarehouseSupplierPriceData[];
  existingWarehouseItems: WarehouseItemData[];
  onSuccess: () => void;
}

export default function WarehouseSupplierIntakeModal({
  isOpen,
  onClose,
  supplierPrices,
  existingWarehouseItems,
  onSuccess,
}: WarehouseSupplierIntakeModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearch = useDeferredValue(searchQuery);
  const [selectedPrice, setSelectedPrice] = useState<WarehouseSupplierPriceData | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [location, setLocation] = useState<string>(STOCK_LOCATIONS[0]);
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Фильтрация позиций поставщиков для выбора
  const searchResults = useMemo(() => {
    if (!deferredSearch.trim() || deferredSearch.trim().length < 2) {
      return supplierPrices.slice(0, 15);
    }
    return supplierPrices
      .filter((p) =>
        matchSearchQuery(
          {
            name: p.name,
            supplier: p.supplier,
            category: p.category,
            subcategory: p.subcategory,
          },
          deferredSearch
        )
      )
      .slice(0, 20);
  }, [supplierPrices, deferredSearch]);

  // Проверяем, есть ли уже этот материал на складе
  const matchedExisting = useMemo(() => {
    if (!selectedPrice) return null;
    return existingWarehouseItems.find(
      (w) => w.name.toLowerCase() === selectedPrice.name.toLowerCase()
    );
  }, [selectedPrice, existingWarehouseItems]);

  const handleSelectPrice = (price: WarehouseSupplierPriceData) => {
    triggerHaptic("light");
    setSelectedPrice(price);
    const existing = existingWarehouseItems.find(
      (w) => w.name.toLowerCase() === price.name.toLowerCase()
    );
    if (existing && existing.location) {
      setLocation(existing.location);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPrice) {
      toast.error("Выберите позицию из прайса поставщика");
      return;
    }
    if (quantity <= 0) {
      toast.error("Укажите количество больше 0");
      return;
    }

    setIsSubmitting(true);
    triggerHaptic("medium");

    const res = await intakeFromSupplierPrice({
      supplierPriceId: selectedPrice.id,
      quantity: Number(quantity) || 1,
      location: location || null,
      notes: notes.trim() || undefined,
    });

    setIsSubmitting(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success(
        `Оприходовано ${quantity} ${UNIT_LABELS[selectedPrice.unit] || selectedPrice.unit} (${selectedPrice.name})`
      );
      triggerHaptic("success");
      onSuccess();
      onClose();
    }
  };

  const unitLabel = selectedPrice
    ? UNIT_LABELS[selectedPrice.unit] || selectedPrice.unit
    : "ед.";

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-xl"
      desktopVariant="modal"
      desktopWidth="lg:w-[600px]"
    >
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-600 flex items-center justify-center shrink-0">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">
              Оприходование от поставщика
            </h3>
            <p className="text-xs text-slate-400">
              Поступление материала на склад напрямую из каталога цен
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
        {/* Шаг 1: Поиск и выбор товара из прайсов */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
            <span>1. Выберите товар из каталога поставщиков:</span>
            {selectedPrice && (
              <button
                type="button"
                onClick={() => setSelectedPrice(null)}
                className="text-[11px] text-orange-600 hover:underline font-medium"
              >
                Выбрать другой
              </button>
            )}
          </label>

          {selectedPrice ? (
            <div className="p-3 bg-orange-50/50 border border-orange-200/80 rounded-2xl flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white text-orange-800 border border-orange-200 shadow-2xs">
                    {selectedPrice.supplier}
                  </span>
                  <span className="text-xs font-bold text-slate-900 truncate">
                    {selectedPrice.name}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-1">
                  Цена закупки: <strong className="text-slate-900">{selectedPrice.price.toLocaleString("ru-RU")} ₸</strong> / {unitLabel}
                </div>
              </div>
              <span className="w-7 h-7 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0">
                <Check className="w-4 h-4" />
              </span>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Начните вводить название товара (акрил, светодиоды, профиль)..."
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-orange-500 transition"
                />
              </div>

              {/* Список совпадений */}
              <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-2xl bg-white p-1">
                {searchResults.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">
                    По запросу ничего не найдено в прайсах
                  </div>
                ) : (
                  searchResults.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectPrice(p)}
                      className="w-full p-2 text-left hover:bg-slate-50 rounded-xl transition flex items-center justify-between group cursor-pointer"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="text-xs font-semibold text-slate-900 group-hover:text-orange-600 truncate">
                          {p.name}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                          <span className="font-bold text-slate-600">{p.supplier}</span>
                          <span>•</span>
                          <span>{p.category || "Общее"}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs font-mono font-bold text-slate-800">
                          {p.price.toLocaleString("ru-RU")} ₸
                        </div>
                        <div className="text-[10px] text-slate-400">
                          / {UNIT_LABELS[p.unit] || p.unit}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Индикатор связи с существующим остатком */}
        {selectedPrice && (
          <div
            className={`p-3 rounded-2xl border text-xs flex items-center gap-2.5 ${
              matchedExisting
                ? "bg-blue-50/70 border-blue-200 text-blue-800"
                : "bg-slate-50 border-slate-200 text-slate-600"
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0 text-blue-500" />
            <div>
              {matchedExisting ? (
                <span>
                  Позиция уже есть на складе (текущий остаток:{" "}
                  <strong>
                    {matchedExisting.quantity} {unitLabel}
                  </strong>
                  ). Остаток увеличится, а цена обновится.
                </span>
              ) : (
                <span>
                  Этого товара еще нет на складе. Будет создана новая складская карточка.
                </span>
              )}
            </div>
          </div>
        )}

        {/* Шаг 2: Количество и Локация */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Количество ({unitLabel}):
            </label>
            <input
              type="number"
              min="0.01"
              step="any"
              value={quantity === 0 ? "" : quantity}
              onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
              required
              placeholder="1"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-orange-500 transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Локация в цехе:
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:bg-white cursor-pointer"
            >
              {STOCK_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Номер накладной / Комментарий */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">
            Основание / Номер накладной:
          </label>
          <input
            type="text"
            placeholder="Например: Накладная №4812 от 08.11.2026 (закупка под проект)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-orange-500 transition"
          />
        </div>

        {/* Кнопки */}
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
            disabled={isSubmitting || !selectedPrice || quantity <= 0}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 shadow-md shadow-orange-600/20 transition active:scale-95 disabled:opacity-40 cursor-pointer"
          >
            {isSubmitting ? "Оприходование..." : "Оприходовать на склад"}
          </button>
        </div>
      </form>
    </BottomSheet>
  );
}
