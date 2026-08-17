"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ParsedSupplierPrice } from "./types";
import { Layers, X, Search, Check, Phone, MessageCircle, MapPin } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";

interface SupplierPricePickerModalProps {
  isOpen: boolean;
  itemIndex: number | null;
  parsedPrices: ParsedSupplierPrice[];
  onSelect: (price: ParsedSupplierPrice) => void;
  onClose: () => void;
}

export const SupplierPricePickerModal: React.FC<SupplierPricePickerModalProps> = ({
  isOpen,
  itemIndex,
  parsedPrices,
  onSelect,
  onClose,
}) => {
  const [pickerSearch, setPickerSearch] = useState("");
  const [pickerCategory, setPickerCategory] = useState<string | null>(null);
  const [pickerType, setPickerType] = useState<string | null>(null);
  const [pickerSpec, setPickerSpec] = useState<string | null>(null);

  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(parsedPrices.map((p) => p.category)));
  }, [parsedPrices]);

  const uniqueTypes = useMemo(() => {
    if (!pickerCategory) return [];
    return Array.from(
      new Set(parsedPrices.filter((p) => p.category === pickerCategory).map((p) => p.materialType))
    );
  }, [pickerCategory, parsedPrices]);

  const uniqueSpecs = useMemo(() => {
    if (!pickerCategory || !pickerType) return [];
    return Array.from(
      new Set(
        parsedPrices
          .filter((p) => p.category === pickerCategory && p.materialType === pickerType)
          .map((p) => p.spec)
      )
    );
  }, [pickerCategory, pickerType, parsedPrices]);

  const searchResults = useMemo(() => {
    if (!pickerSearch.trim()) return [];
    const q = pickerSearch.toLowerCase().trim();
    return parsedPrices.filter(
      (p) =>
        p.originalName.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.materialType.toLowerCase().includes(q) ||
        p.spec.toLowerCase().includes(q) ||
        p.supplier.toLowerCase().includes(q)
    );
  }, [pickerSearch, parsedPrices]);

  const matchedOptions = useMemo(() => {
    if (!pickerCategory || !pickerType || !pickerSpec) return [];
    return parsedPrices.filter(
      (p) =>
        p.category === pickerCategory &&
        p.materialType === pickerType &&
        p.spec === pickerSpec
    );
  }, [pickerCategory, pickerType, pickerSpec, parsedPrices]);

  const listItems = pickerSearch ? searchResults : matchedOptions;

  // Инициализация первой категории при открытии
  React.useEffect(() => {
    if (isOpen && !pickerCategory && uniqueCategories.length > 0) {
      setPickerCategory(uniqueCategories[0]);
    }
  }, [isOpen, uniqueCategories, pickerCategory]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 260 }}
          className="absolute inset-0 lg:left-auto lg:right-0 lg:w-[480px] bg-white border-l border-slate-200 shadow-2xl z-[140] p-4 sm:p-6 flex flex-col"
        >
          {/* Шапка подборщика */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
            <div>
              <h4 className="font-black text-slate-900 text-sm tracking-tight flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-purple-600" />
                Подбор материала из прайсов
              </h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                Позиция сметы #{itemIndex !== null ? itemIndex + 1 : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer active:scale-90"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Поисковая строка */}
          <div className="my-3 shrink-0 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Поиск: ПВХ, Акрил, Светодиоды, Неон..."
              value={pickerSearch}
              onChange={(e) => setPickerSearch(e.target.value)}
              className="block w-full pl-10 pr-10 py-2.5 text-base sm:text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-purple-500 transition text-slate-900 shadow-2xs"
            />
            {pickerSearch && (
              <button
                type="button"
                onClick={() => setPickerSearch("")}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Скроллируемые категории и результаты */}
          <div
            className="flex-1 overflow-y-auto overscroll-contain space-y-4 pr-1"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {!pickerSearch && (
              <>
                {/* Шаг 1: Категории */}
                <div className="space-y-1.5">
                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">
                    1. Категория материала
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {uniqueCategories.map((cat) => {
                      const isActive = pickerCategory === cat;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            triggerHaptic("light");
                            setPickerCategory(cat);
                            const subTypes = Array.from(
                              new Set(
                                parsedPrices
                                  .filter((p) => p.category === cat)
                                  .map((p) => p.materialType)
                              )
                            );
                            setPickerType(subTypes[0] || null);
                            if (subTypes[0]) {
                              const subSpecs = Array.from(
                                new Set(
                                  parsedPrices
                                    .filter(
                                      (p) => p.category === cat && p.materialType === subTypes[0]
                                    )
                                    .map((p) => p.spec)
                                )
                              );
                              setPickerSpec(subSpecs[0] || null);
                            } else {
                              setPickerSpec(null);
                            }
                          }}
                          className={`px-3 py-1.5 text-xs font-extrabold rounded-xl transition cursor-pointer active:scale-95 ${
                            isActive
                              ? "bg-purple-600 text-white shadow-sm"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Шаг 2: Тип материала */}
                {pickerCategory && uniqueTypes.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">
                      2. Тип материала
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {uniqueTypes.map((t) => {
                        const isActive = pickerType === t;
                        return (
                          <button
                            key={t}
                            type="button"
                            onClick={() => {
                              triggerHaptic("light");
                              setPickerType(t);
                              const subSpecs = Array.from(
                                new Set(
                                  parsedPrices
                                    .filter(
                                      (p) => p.category === pickerCategory && p.materialType === t
                                    )
                                    .map((p) => p.spec)
                                )
                              );
                              setPickerSpec(subSpecs[0] || null);
                            }}
                            className={`px-2.5 py-2 text-xs font-bold rounded-xl border text-left transition cursor-pointer active:scale-95 ${
                              isActive
                                ? "border-purple-500 bg-purple-50 text-purple-700 font-black shadow-2xs"
                                : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                            }`}
                          >
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Шаг 3: Спецификации / Толщина */}
                {pickerCategory && pickerType && uniqueSpecs.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">
                      3. Параметры / Толщина
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {uniqueSpecs.map((s) => {
                        const isActive = pickerSpec === s;
                        return (
                          <button
                            key={s}
                            type="button"
                            onClick={() => {
                              triggerHaptic("light");
                              setPickerSpec(s);
                            }}
                            className={`px-2.5 py-1 text-xs font-extrabold rounded-lg border transition cursor-pointer active:scale-95 ${
                              isActive
                                ? "border-purple-500 bg-purple-50 text-purple-700"
                                : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700"
                            }`}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Шаг 4: Доступные варианты */}
            <div className="space-y-2 pt-2">
              <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">
                {pickerSearch
                  ? `Результаты поиска (${listItems.length})`
                  : "4. Доступные предложения поставщиков:"}
              </span>

              {listItems.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs italic bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  Материалов по заданным критериям не найдено
                </div>
              ) : (
                listItems.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      triggerHaptic("light");
                      onSelect(p);
                    }}
                    className="w-full p-3 rounded-2xl border border-slate-200/90 bg-white hover:border-purple-500 hover:bg-purple-50/40 text-left transition flex items-center justify-between group shadow-2xs cursor-pointer active:scale-98"
                  >
                    <div className="flex flex-col pr-2">
                      <span className="text-[9px] text-purple-600 font-black uppercase tracking-wider">
                        [{p.supplier}]
                      </span>
                      <span className="font-extrabold text-xs text-slate-900 group-hover:text-purple-700">
                        {p.detail}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-slate-900 block">
                        {p.price.toLocaleString()} ₸
                      </span>
                      <span className="text-[10px] text-slate-400 block font-bold">
                        за 1 ед.
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
