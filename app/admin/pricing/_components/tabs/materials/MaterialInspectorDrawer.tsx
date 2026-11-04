"use client";

import React, { useState, useEffect, memo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { SupplierPriceItem } from "../../../_types/pricingTypes";
import { INVENTORY_UNITS } from "../../../_data/pricingDictionary";
import {
  X,
  ExternalLink,
  Edit2,
  Trash2,
  Copy,
  Check,
  Package,
  Handshake,
  ZoomIn,
} from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { toast } from "@/lib/toast";

interface MaterialInspectorDrawerProps {
  item: SupplierPriceItem | null;
  onClose: () => void;
  onOpenEditModal: (item: SupplierPriceItem) => void;
  onQuickUpdatePrice: (id: string, newPrice: number) => Promise<void>;
  onDeleteItem: (id: string) => Promise<void>;
}

function MaterialInspectorDrawer({
  item,
  onClose,
  onOpenEditModal,
  onQuickUpdatePrice,
  onDeleteItem,
}: MaterialInspectorDrawerProps) {
  const [copied, setCopied] = useState(false);
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [priceInput, setPriceInput] = useState<number | "">("");
  const [isSavingPrice, setIsSavingPrice] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (item) {
      setPriceInput(item.price);
      setIsEditingPrice(false);
      setIsZoomOpen(false);
    }
  }, [item]);

  // Закрытие по клавише Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isZoomOpen) {
          setIsZoomOpen(false);
        } else if (item) {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, isZoomOpen, item]);

  if (!mounted) return null;

  const handleCopyName = () => {
    if (!item) return;
    triggerHaptic("light");
    navigator.clipboard.writeText(item.name);
    setCopied(true);
    toast.success("Название скопировано");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSavePrice = async () => {
    if (!item) return;
    if (priceInput === "" || isNaN(Number(priceInput))) {
      setIsEditingPrice(false);
      return;
    }
    setIsSavingPrice(true);
    triggerHaptic("medium");
    try {
      await onQuickUpdatePrice(item.id, Number(priceInput));
      setIsEditingPrice(false);
      toast.success("Цена успешно обновлена");
    } catch {
      toast.error("Ошибка при сохранении цены");
    } finally {
      setIsSavingPrice(false);
    }
  };

  const fullScreenPhotoModal =
    isZoomOpen && item?.imageUrl
      ? createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200 cursor-zoom-out"
            onClick={() => setIsZoomOpen(false)}
          >
            <div
              className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative cursor-default border border-white/20 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Кнопка закрытия */}
              <button
                type="button"
                onClick={() => setIsZoomOpen(false)}
                className="absolute top-3.5 right-3.5 z-10 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition cursor-pointer shadow-md"
                title="Закрыть (Esc)"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Полноразмерное изображение */}
              <div className="bg-slate-100 aspect-4/3 flex items-center justify-center overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-contain max-h-[75vh]"
                  decoding="async"
                />
              </div>

              {/* Детали под фото */}
              <div className="p-4 sm:p-5 flex items-center justify-between gap-3 bg-white border-t border-slate-100">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-orange-100 text-orange-700">
                      {item.category}
                    </span>
                    {item.subcategory && (
                      <span className="text-xs font-bold text-slate-500">
                        • {item.subcategory}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-black text-slate-900 truncate">
                    {item.name}
                  </h3>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-base font-black text-slate-900 block">
                    {Number(item.price).toLocaleString("ru-RU")} ₸
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold block">
                    за {INVENTORY_UNITS[item.unit]?.short || "ед."}
                  </span>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      {createPortal(
        <AnimatePresence>
          {item && (
            <>
              {/* Затемнение фона для шторки (клик в любую точку закрывает инспектор) */}
              <motion.div
                key="inspector-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                onClick={onClose}
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity cursor-pointer"
              />

              {/* Выдвижная шторка инспектора */}
              <motion.div
                key="inspector-drawer"
                initial={{ x: "100%", opacity: 0.8 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{ type: "spring", damping: 28, stiffness: 300 }}
                className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[420px] bg-white border-l border-slate-200/90 shadow-2xl flex flex-col pointer-events-auto"
              >
                {/* 1. Шапка инспектора */}
                <div className="p-4 sm:px-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white/90 backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                      Инспектор материала
                    </span>
                    {item.isService ? (
                      <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase bg-purple-100 text-purple-700">
                        Услуга
                      </span>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onOpenEditModal(item)}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                      title="Редактировать полностью"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                      title="Закрыть (Esc или клик вне шторки)"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 2. Скроллируемое тело инспектора */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
                  {/* Большое фото с кнопкой зума */}
                  <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 flex items-center justify-center group shadow-xs">
                    {item.imageUrl ? (
                      <>
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          decoding="async"
                        />
                        <button
                          type="button"
                          onClick={() => setIsZoomOpen(true)}
                          className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-xl bg-black/60 hover:bg-black/80 text-white text-[11px] font-bold backdrop-blur-sm flex items-center gap-1 transition cursor-pointer"
                        >
                          <ZoomIn className="w-3.5 h-3.5" />
                          <span>Увеличить</span>
                        </button>
                      </>
                    ) : item.isService ? (
                      <div className="flex flex-col items-center gap-2 text-purple-500">
                        <Handshake className="w-12 h-12" />
                        <span className="text-xs font-black uppercase">Услуга подрядчика</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <Package className="w-12 h-12" />
                        <span className="text-xs font-bold">Фотография не загружена</span>
                      </div>
                    )}
                  </div>

                  {/* Блок цены с быстрым редактированием */}
                  <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-slate-400">
                      <span>Базовая себестоимость</span>
                      <span>{INVENTORY_UNITS[item.unit]?.label || "Единица измерения"}</span>
                    </div>

                    {isEditingPrice ? (
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="number"
                          autoFocus
                          value={priceInput}
                          onChange={(e) =>
                            setPriceInput(e.target.value ? Number(e.target.value) : "")
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSavePrice();
                            if (e.key === "Escape") setIsEditingPrice(false);
                          }}
                          className="flex-1 px-3 py-2 rounded-xl bg-white border-2 border-orange-500 text-base font-black text-slate-900 outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleSavePrice}
                          disabled={isSavingPrice}
                          className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black transition cursor-pointer"
                        >
                          Сохранить
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingPrice(false)}
                          className="p-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 transition cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-baseline justify-between pt-1">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-2xl font-black text-slate-900 tracking-tight">
                            {Number(item.price).toLocaleString("ru-RU")} ₸
                          </span>
                          <span className="text-xs font-bold text-slate-400">
                            / {INVENTORY_UNITS[item.unit]?.short || "ед."}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            triggerHaptic("light");
                            setIsEditingPrice(true);
                          }}
                          className="text-xs font-extrabold text-orange-600 hover:text-orange-700 hover:underline cursor-pointer"
                        >
                          Изменить
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Название и быстрое копирование */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                        Наименование
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyName}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-slate-900 cursor-pointer"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span className="text-emerald-600 font-black">Скопировано</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Копировать</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="text-sm font-black text-slate-900 leading-snug bg-slate-50/60 p-3 rounded-2xl border border-slate-200/60">
                      {item.name}
                    </div>
                  </div>

                  {/* Классификация и Метаданные */}
                  <div className="space-y-2 pt-1 border-t border-slate-100">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                      Классификация и поставка
                    </span>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                        <span className="text-[10px] font-bold text-slate-400 block">Категория</span>
                        <span className="font-extrabold text-slate-800 truncate block mt-0.5">
                          {item.category || "—"}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                        <span className="text-[10px] font-bold text-slate-400 block">Подкатегория</span>
                        <span className="font-extrabold text-slate-800 truncate block mt-0.5">
                          {item.subcategory || "—"}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                        <span className="text-[10px] font-bold text-slate-400 block">Поставщик</span>
                        <span className="font-extrabold text-slate-800 truncate block mt-0.5">
                          {item.supplier}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                        <span className="text-[10px] font-bold text-slate-400 block">Источник</span>
                        {item.sourceUrl ? (
                          <a
                            href={item.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-extrabold text-orange-600 hover:underline inline-flex items-center gap-1 mt-0.5 truncate"
                          >
                            <span>Перейти</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        ) : (
                          <span className="font-extrabold text-slate-400 block mt-0.5">
                            Внутренний
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Описание позиции */}
                  {item.description && (
                    <div className="space-y-1.5 pt-1 border-t border-slate-100">
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                        Описание и спецификация
                      </span>
                      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/60 p-3 rounded-2xl border border-slate-200/60">
                        {item.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* 3. Подвал инспектора */}
                <div className="p-4 border-t border-slate-100 flex items-center justify-between gap-3 bg-white shrink-0">
                  <button
                    type="button"
                    onClick={() => onDeleteItem(item.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-black transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Удалить</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenEditModal(item)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition cursor-pointer active:scale-95"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Редактировать всё</span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Полноэкранный зум фото через React Portal в document.body */}
      {fullScreenPhotoModal}
    </>
  );
}

export default memo(MaterialInspectorDrawer);
