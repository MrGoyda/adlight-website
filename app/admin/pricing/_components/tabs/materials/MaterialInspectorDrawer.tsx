"use client";

import React, { useState, useEffect, memo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { SupplierPriceItem } from "../../../_types/pricingTypes";
import { INVENTORY_UNITS } from "../../../_data/pricingDictionary";
import {
  X,
  Package,
  Handshake,
  ZoomIn,
  Edit2,
  Trash2,
  Copy,
  Check,
  Building2,
  ShoppingBag,
  Plus,
  Minus,
  ArrowRight,
} from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { toast } from "@/lib/toast";
import { pricingDict } from "@/dictionaries/pricing";

interface MaterialInspectorDrawerProps {
  item: SupplierPriceItem | null;
  onClose: () => void;
  onOpenEditModal: (item: SupplierPriceItem) => void;
  onQuickUpdatePrice: (id: string, newPrice: number) => Promise<void>;
  onDeleteItem: (id: string) => Promise<void>;
  onOpenSupplierInfo?: (supplierName: string) => void;
  onAddToCart?: (item: SupplierPriceItem, quantity?: number) => void;
  onRemoveFromCart?: (id: string) => void;
  onUpdateCartQuantity?: (priceItemId: string, newQty: number) => void;
  isInCart?: boolean;
  cartQuantity?: number;
}

function MaterialInspectorDrawer({
  item,
  onClose,
  onOpenEditModal,
  onQuickUpdatePrice,
  onDeleteItem,
  onOpenSupplierInfo,
  onAddToCart,
  onRemoveFromCart,
  onUpdateCartQuantity,
  isInCart = false,
  cartQuantity = 0,
}: MaterialInspectorDrawerProps) {
  const [copied, setCopied] = useState(false);
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [priceInput, setPriceInput] = useState<number | "">("");
  const [isSavingPrice, setIsSavingPrice] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [quantityToAdd, setQuantityToAdd] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (item) {
      setPriceInput(item.price);
      setIsEditingPrice(false);
      setIsZoomOpen(false);
      setQuantityToAdd(1);
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
  }, [item, isZoomOpen, onClose]);

  const handleCopyName = () => {
    if (!item) return;
    triggerHaptic("light");
    navigator.clipboard.writeText(item.name);
    setCopied(true);
    toast.success(pricingDict.modals.inspector.copiedNotice);
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
      toast.success(pricingDict.toasts.priceUpdated);
    } catch {
      toast.error(pricingDict.toasts.priceUpdateError);
    } finally {
      setIsSavingPrice(false);
    }
  };

  const handleAddToCart = () => {
    if (!item) return;
    onAddToCart?.(item, quantityToAdd);
  };

  const handleRemoveFromCart = () => {
    if (!item) return;
    triggerHaptic("medium");
    onRemoveFromCart?.(item.id);
  };

  const handleDirectCartQtyChange = (newVal: number) => {
    if (!item) return;
    if (newVal <= 0) {
      handleRemoveFromCart();
    } else {
      triggerHaptic("light");
      onUpdateCartQuantity?.(item.id, newVal);
    }
  };

  const fullScreenPhotoModal =
    isZoomOpen && item?.imageUrl
      ? createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200 cursor-zoom-out"
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

  if (!mounted) return null;

  return (
    <>
      {createPortal(
        <AnimatePresence>
          {item && (
            <>
              {/* Затемняющий оверлей */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                onClick={onClose}
                className="fixed inset-0 z-[9980] bg-black/50"
              />

              {/* Выезжающая панель инспектора */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 350 }}
                className="fixed top-0 right-0 z-[9985] w-full max-w-md h-full bg-white shadow-2xl flex flex-col justify-between overflow-hidden border-l border-slate-200"
              >
                {/* 1. Шапка инспектора */}
                <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-3 bg-white shrink-0">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-orange-100 text-orange-800">
                      {pricingDict.modals.inspector.badge}
                    </span>
                    {isInCart && (
                      <div className="flex items-center gap-1">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-900 text-orange-400 flex items-center gap-1">
                          <ShoppingBag className="w-3 h-3" />
                          <span>{pricingDict.modals.inspector.inCartBadge(cartQuantity)}</span>
                        </span>
                        {onRemoveFromCart && (
                          <button
                            type="button"
                            onClick={handleRemoveFromCart}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                            title={pricingDict.modals.inspector.removeFromCartTooltip}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={onClose}
                    className="w-9 h-9 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition cursor-pointer"
                    title="Закрыть (Esc)"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* 2. Тело инспектора */}
                <div className="p-5 flex-1 overflow-y-auto space-y-5">
                  {/* Фото позиции */}
                  <div className="relative aspect-16/10 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200/80 shadow-xs flex items-center justify-center group">
                    {item.imageUrl ? (
                      <>
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                          decoding="async"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            triggerHaptic("medium");
                            setIsZoomOpen(true);
                          }}
                          className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-black/70 hover:bg-black text-white text-xs font-black flex items-center gap-1.5 transition cursor-pointer shadow-md active:scale-95"
                        >
                          <ZoomIn className="w-3.5 h-3.5" />
                          <span>Увеличить</span>
                        </button>
                      </>
                    ) : item.isService ? (
                      <div className="flex flex-col items-center gap-2 text-purple-600">
                        <Handshake className="w-12 h-12 stroke-[1.5]" />
                        <span className="text-xs font-black uppercase tracking-wider">
                          Услуга перезаказа
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <Package className="w-12 h-12 stroke-[1.5]" />
                        <span className="text-xs font-bold">Фото отсутствует</span>
                      </div>
                    )}
                  </div>

                  {/* Быстрое редактирование цены */}
                  <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                      Базовая цена
                    </span>

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
                          {pricingDict.modals.inspector.priceSave}
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

                  {/* Добавление в корзину закупки */}
                  {onAddToCart && (
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                          Снабжение и закупка
                        </span>
                        {isInCart && (
                          <span className="text-[11px] font-extrabold text-orange-600 bg-orange-100/80 px-2 py-0.5 rounded-md">
                            {pricingDict.modals.inspector.inCartStatus(
                              cartQuantity,
                              INVENTORY_UNITS[item.unit]?.short || "ед."
                            )}
                          </span>
                        )}
                      </div>

                      {isInCart ? (
                        <div className="flex items-center gap-2">
                          {/* Прямой степпер текущего количества в корзине */}
                          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleDirectCartQtyChange(cartQuantity - 1)}
                              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer"
                              title={cartQuantity <= 1 ? "Удалить из корзины" : "Уменьшить на 1"}
                            >
                              {cartQuantity <= 1 ? (
                                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                              ) : (
                                <Minus className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <input
                              type="number"
                              min="1"
                              max="99999"
                              value={cartQuantity}
                              onChange={(e) => {
                                const val = parseInt(e.target.value, 10);
                                if (!isNaN(val) && val > 0) handleDirectCartQtyChange(val);
                              }}
                              className="w-12 text-center font-black text-sm text-slate-900 outline-none"
                              title="Количество в корзине"
                            />
                            <button
                              type="button"
                              onClick={() => handleDirectCartQtyChange(cartQuantity + 1)}
                              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer"
                              title="Увеличить на 1"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Кнопка полного удаления из корзины */}
                          {onRemoveFromCart && (
                            <button
                              type="button"
                              onClick={handleRemoveFromCart}
                              className="flex-1 py-2.5 px-3 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 font-extrabold text-xs transition cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                              title={pricingDict.modals.inspector.removeFromCartTooltip}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>{pricingDict.modals.inspector.removeFromCartButton}</span>
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {/* Степпер количества для добавления */}
                          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shrink-0">
                            <button
                              type="button"
                              onClick={() => setQuantityToAdd((q) => Math.max(1, q - 1))}
                              className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer"
                              title="Уменьшить"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={quantityToAdd}
                              onChange={(e) =>
                                setQuantityToAdd(Math.max(1, parseInt(e.target.value, 10) || 1))
                              }
                              className="w-10 text-center font-black text-xs text-slate-900 outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => setQuantityToAdd((q) => q + 1)}
                              className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer"
                              title="Увеличить"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Кнопка добавления в корзину */}
                          <button
                            type="button"
                            onClick={handleAddToCart}
                            className="flex-1 py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-black transition cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-orange-600/20 active:scale-95"
                          >
                            <ShoppingBag className="w-4 h-4" />
                            <span>
                              В корзину ({quantityToAdd} {INVENTORY_UNITS[item.unit]?.short || "ед."})
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

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

                  {/* Классификация и Поставщик */}
                  <div className="space-y-2 pt-1 border-t border-slate-100">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                      Классификация и поставщик
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

                      {/* Поставщик (кликабельный с переходом к карточке) */}
                      <button
                        type="button"
                        onClick={() => onOpenSupplierInfo?.(item.supplier)}
                        className="col-span-2 p-3 rounded-xl bg-slate-50 hover:bg-orange-50 border border-slate-200/60 hover:border-orange-200 text-left transition cursor-pointer group flex items-center justify-between"
                      >
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-slate-400 block">
                            Поставщик (нажмите для контактов и адреса)
                          </span>
                          <span className="font-black text-slate-900 group-hover:text-orange-600 truncate block mt-0.5">
                            {item.supplier}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] font-extrabold text-orange-600 shrink-0">
                          <span>Контакты</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </button>
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
