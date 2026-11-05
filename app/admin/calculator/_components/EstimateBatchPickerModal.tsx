"use client";

import React, { useState, useMemo, useEffect, useCallback, useDeferredValue } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Search,
  Plus,
  Check,
  Layers,
  Sparkles,
  Package,
  Boxes,
  Zap,
  Scissors,
  Wrench,
} from "lucide-react";
import {
  CalculatorSupplierPrice,
  CalculatorWorkOperation,
} from "../_types/calculatorTypes";
import { UNIT_LABELS } from "../_data/estimateSpreadsheetDictionary";
import { matchSearchQuery } from "@/lib/search";
import { recordSearchSelectionAction } from "@/lib/search/actions";
import { triggerHaptic } from "@/lib/haptics";

interface EstimateBatchPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplierPrices: CalculatorSupplierPrice[];
  workOperations: CalculatorWorkOperation[];
  onAddSupplierMaterial: (price: CalculatorSupplierPrice) => void;
  onAddWorkOperation: (op: CalculatorWorkOperation) => void;
}

const QUICK_CATEGORIES = [
  { id: "all", label: "Все материалы", icon: Boxes },
  { id: "sheets", label: "Листовые (Акрил/ПВХ/АКП)", matchWord: "лист", icon: Layers },
  { id: "lighting", label: "Светотехника (Диоды/БП/Неон)", matchWord: "свето", icon: Zap },
  { id: "profiles", label: "Профили и металл", matchWord: "профил", icon: Package },
  { id: "vinyl", label: "Пленки и баннеры", matchWord: "пленк", icon: Scissors },
  { id: "hardware", label: "Клеи, скотч, крепеж", matchWord: "клей", icon: Wrench },
];

export default function EstimateBatchPickerModal({
  isOpen,
  onClose,
  supplierPrices,
  workOperations,
  onAddSupplierMaterial,
  onAddWorkOperation,
}: EstimateBatchPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearch = useDeferredValue(searchQuery);
  const [activeTab, setActiveTab] = useState<"materials" | "works">("materials");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSupplier, setSelectedSupplier] = useState("all");
  const [addedCounts, setAddedCounts] = useState<Record<string, number>>({});
  const [visibleCount, setVisibleCount] = useState(40);

  const handleClose = useCallback(() => {
    setAddedCounts({});
    setSearchQuery("");
    setVisibleCount(40);
    onClose();
  }, [onClose]);

  // Закрытие по клавише Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  // Список уникальных поставщиков
  const suppliers = useMemo(() => {
    const set = new Set<string>();
    for (const p of supplierPrices) {
      if (p.supplier) set.add(p.supplier);
    }
    return Array.from(set);
  }, [supplierPrices]);

  // Фильтрация материалов на базе отложенного поиска useDeferredValue
  const filteredMaterials = useMemo(() => {
    return supplierPrices.filter((p) => {
      // 1. Поставщик
      if (selectedSupplier !== "all" && p.supplier !== selectedSupplier) {
        return false;
      }
      // 2. Категория
      if (selectedCategory !== "all") {
        const catConfig = QUICK_CATEGORIES.find((c) => c.id === selectedCategory);
        if (catConfig?.matchWord) {
          const fullCat = `${p.category || ""} ${p.subcategory || ""} ${p.name}`.toLowerCase();
          if (!fullCat.includes(catConfig.matchWord)) return false;
        }
      }
      // 3. Поисковый запрос
      if (deferredSearch.trim()) {
        return matchSearchQuery(
          {
            name: p.name,
            supplier: p.supplier,
            category: p.category,
            subcategory: p.subcategory,
            description: p.description,
          },
          deferredSearch
        );
      }
      return true;
    });
  }, [supplierPrices, selectedSupplier, selectedCategory, deferredSearch]);

  const displayedMaterials = useMemo(() => {
    return filteredMaterials.slice(0, visibleCount);
  }, [filteredMaterials, visibleCount]);

  // Фильтрация работ цеха
  const filteredWorks = useMemo(() => {
    return workOperations.filter((w) => {
      if (deferredSearch.trim()) {
        return matchSearchQuery(
          {
            name: w.name,
            description: w.type === "ASSEMBLY" ? "Сборка цеха" : "Монтажные работы",
          },
          deferredSearch
        );
      }
      return true;
    });
  }, [workOperations, deferredSearch]);

  const totalAdded = Object.values(addedCounts).reduce((acc, c) => acc + c, 0);

  const handleAddMaterial = (price: CalculatorSupplierPrice) => {
    triggerHaptic("light");
    onAddSupplierMaterial(price);
    setAddedCounts((prev) => ({
      ...prev,
      [price.id]: (prev[price.id] || 0) + 1,
    }));

    if (searchQuery.trim()) {
      recordSearchSelectionAction({
        query: searchQuery,
        entityId: price.id,
        entityType: "supplier_price",
        selectedTitle: price.name,
        context: "calculator_batch_modal",
      });
    }
  };

  const handleAddWork = (work: CalculatorWorkOperation) => {
    triggerHaptic("light");
    onAddWorkOperation(work);
    setAddedCounts((prev) => ({
      ...prev,
      [work.id]: (prev[work.id] || 0) + 1,
    }));

    if (searchQuery.trim()) {
      recordSearchSelectionAction({
        query: searchQuery,
        entityId: work.id,
        entityType: "work_operation",
        selectedTitle: work.name,
        context: "calculator_batch_modal",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-4xl max-h-[88vh] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden z-10"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-orange-500/10 text-orange-600">
                  <Boxes className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    Каталог материалов и работ
                  </h2>
                  <p className="text-xs text-slate-400">
                    Добавляйте в смету сразу несколько позиций без закрытия окна
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search and Filters Bar */}
          <div className="p-3 sm:p-4 border-b border-slate-100 space-y-3 bg-white">
            {/* Search + Tab toggle */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setVisibleCount(40);
                  }}
                  placeholder="Поиск по названию, толщине, цвету, бренду (например: акрил 3мм молочный)..."
                  className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setVisibleCount(40);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Переключатель вкладки Материалы / Работы цеха */}
              <div className="flex p-1 bg-slate-100 rounded-2xl shrink-0 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("materials");
                    setVisibleCount(40);
                  }}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                    activeTab === "materials"
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Материалы ({filteredMaterials.length})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("works");
                    setVisibleCount(40);
                  }}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                    activeTab === "works"
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Работы цеха ({filteredWorks.length})
                </button>
              </div>
            </div>

            {/* Быстрые фильтры по категориям (только для материалов) */}
            {activeTab === "materials" && (
              <div className="space-y-2 pt-1">
                {/* Категории */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
                  {QUICK_CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          setVisibleCount(40);
                        }}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl font-medium shrink-0 transition cursor-pointer ${
                          isSelected
                            ? "bg-orange-500 text-white shadow-2xs shadow-orange-500/20"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        <Icon className="w-3 h-3" />
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Поставщики */}
                {suppliers.length > 1 && (
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className="text-slate-400 font-medium">Поставщик:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSupplier("all");
                        setVisibleCount(40);
                      }}
                      className={`px-2 py-0.5 rounded-lg font-medium transition cursor-pointer ${
                        selectedSupplier === "all"
                          ? "bg-slate-800 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      Все
                    </button>
                    {suppliers.map((sup) => (
                      <button
                        key={sup}
                        type="button"
                        onClick={() => {
                          setSelectedSupplier(sup);
                          setVisibleCount(40);
                        }}
                        className={`px-2 py-0.5 rounded-lg font-medium transition cursor-pointer ${
                          selectedSupplier === sup
                            ? "bg-slate-800 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {sup}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2">
            {activeTab === "materials" ? (
              filteredMaterials.length === 0 ? (
                <div className="py-16 text-center text-slate-400">
                  <p className="text-sm font-semibold">По вашему запросу ничего не найдено</p>
                  <p className="text-xs mt-1">Попробуйте изменить категорию или очистить поисковый запрос</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {displayedMaterials.map((p) => {
                    const count = addedCounts[p.id] || 0;
                    return (
                      <div
                        key={p.id}
                        className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                          count > 0
                            ? "border-orange-300 bg-orange-50/40 shadow-xs"
                            : "border-slate-100 bg-white hover:border-slate-300 hover:shadow-2xs"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600">
                              {p.supplier}
                            </span>
                            {p.category && (
                              <span className="text-[10px] text-slate-400 truncate max-w-[140px]">
                                {p.category}
                              </span>
                            )}
                            {p.isFavorite && (
                              <span className="text-[10px] text-amber-500 font-bold flex items-center gap-0.5">
                                <Sparkles className="w-3 h-3" /> Топ
                              </span>
                            )}
                          </div>
                          <div className="text-xs font-semibold text-slate-800 line-clamp-2" title={p.name}>
                            {p.name}
                          </div>
                          <div className="mt-1 flex items-baseline gap-1">
                            <span className="text-xs font-mono font-bold text-slate-900">
                              {p.price.toLocaleString("ru-RU")} ₸
                            </span>
                            <span className="text-[10px] text-slate-400">
                              за {UNIT_LABELS[p.unit] || "ед"}
                            </span>
                          </div>
                        </div>

                        {/* Кнопка добавления с бейджем количества */}
                        <button
                          type="button"
                          onClick={() => handleAddMaterial(p)}
                          className={`shrink-0 h-9 px-3 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer active:scale-95 ${
                            count > 0
                              ? "bg-orange-600 text-white shadow-xs hover:bg-orange-700"
                              : "bg-slate-100 text-slate-700 hover:bg-orange-500 hover:text-white"
                          }`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{count > 0 ? `+${count}` : "В смету"}</span>
                        </button>
                      </div>
                    );
                  })}

                  {visibleCount < filteredMaterials.length && (
                    <div className="col-span-full pt-2 pb-1 text-center">
                      <button
                        type="button"
                        onClick={() => setVisibleCount((prev) => prev + 40)}
                        className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                      >
                        Показать ещё (+40 из {filteredMaterials.length - visibleCount} ост.)
                      </button>
                    </div>
                  )}
                </div>
              )
            ) : (
              filteredWorks.length === 0 ? (
                <div className="py-16 text-center text-slate-400">
                  <p className="text-sm font-semibold">Операции не найдены</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {filteredWorks.map((w) => {
                    const count = addedCounts[w.id] || 0;
                    return (
                      <div
                        key={w.id}
                        className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                          count > 0
                            ? "border-indigo-300 bg-indigo-50/40 shadow-xs"
                            : "border-slate-100 bg-white hover:border-slate-300 hover:shadow-2xs"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="text-[10px] font-bold text-indigo-600 mb-0.5">
                            {w.type === "ASSEMBLY" ? "Сборка цеха" : "Монтажные работы"}
                          </div>
                          <div className="text-xs font-semibold text-slate-800 line-clamp-2">
                            {w.name}
                          </div>
                          <div className="mt-1 flex items-baseline gap-1">
                            <span className="text-xs font-mono font-bold text-slate-900">
                              {w.defaultCost.toLocaleString("ru-RU")} ₸
                            </span>
                            <span className="text-[10px] text-slate-400">
                              за {UNIT_LABELS[w.unit] || "ед"}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAddWork(w)}
                          className={`shrink-0 h-9 px-3 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer active:scale-95 ${
                            count > 0
                              ? "bg-indigo-600 text-white shadow-xs hover:bg-indigo-700"
                              : "bg-slate-100 text-slate-700 hover:bg-indigo-600 hover:text-white"
                          }`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{count > 0 ? `+${count}` : "В смету"}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )
            )}
          </div>

          {/* Footer Bar */}
          <div className="p-3 sm:p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between gap-3">
            <div className="text-xs text-slate-600 font-medium">
              {totalAdded > 0 ? (
                <span className="text-emerald-600 font-bold flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500" />
                  Добавлено в смету: {totalAdded} поз.
                </span>
              ) : (
                <span className="text-slate-400">Кликайте «В смету» для вставки строк</span>
              )}
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white transition shadow-sm cursor-pointer active:scale-95"
            >
              {totalAdded > 0 ? `Готово (${totalAdded})` : "Закрыть"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
