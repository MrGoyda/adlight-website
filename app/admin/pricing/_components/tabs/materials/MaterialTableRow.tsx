"use client";

import React, { useState, memo } from "react";
import { SupplierPriceItem } from "../../../_types/pricingTypes";
import { INVENTORY_UNITS } from "../../../_data/pricingDictionary";
import {
  Package,
  Edit2,
  Trash2,
  Check,
  X,
  Handshake,
  ZoomIn,
  Building2,
  ShoppingBag,
  Plus,
} from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { toast } from "@/lib/toast";

interface MaterialTableRowProps {
  item: SupplierPriceItem;
  isSelected?: boolean;
  onSelect?: (item: SupplierPriceItem) => void;
  onOpenEditModal: (item: SupplierPriceItem) => void;
  onQuickUpdatePrice: (id: string, newPrice: number) => Promise<void>;
  onDeleteItem: (id: string) => Promise<void>;
  onOpenSupplierInfo?: (supplierName: string) => void;
  onAddToCart?: (item: SupplierPriceItem) => void;
  isInCart?: boolean;
  cartQuantity?: number;
}

function MaterialTableRow({
  item,
  isSelected,
  onSelect,
  onOpenEditModal,
  onQuickUpdatePrice,
  onDeleteItem,
  onOpenSupplierInfo,
  onAddToCart,
  isInCart = false,
  cartQuantity = 0,
}: MaterialTableRowProps) {
  const [isInline, setIsInline] = useState(false);
  const [inlinePriceValue, setInlinePriceValue] = useState<number | "">(item.price);
  const [isSavingInline, setIsSavingInline] = useState(false);
  const [imgError, setImgError] = useState(false);

  const unitShort = INVENTORY_UNITS[item.unit]?.short || "ед.";

  const handleStartInlineEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic("light");
    setIsInline(true);
    setInlinePriceValue(item.price);
  };

  const handleSaveInlineEdit = async (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.stopPropagation();
    if (inlinePriceValue === "" || isNaN(Number(inlinePriceValue))) {
      setIsInline(false);
      return;
    }

    setIsSavingInline(true);
    triggerHaptic("medium");
    try {
      await onQuickUpdatePrice(item.id, Number(inlinePriceValue));
      setIsInline(false);
    } catch {
      toast.error("Не удалось сохранить цену");
    } finally {
      setIsSavingInline(false);
    }
  };

  const handleSupplierClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic("light");
    onOpenSupplierInfo?.(item.supplier);
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(item);
  };

  const isService = Boolean(item.isService);

  return (
    <div
      onClick={() => onSelect?.(item)}
      style={{ contentVisibility: "auto", containIntrinsicSize: "0 60px" }}
      className={`p-3 sm:px-5 sm:py-3 transition-colors flex flex-col md:grid md:grid-cols-12 md:gap-4 md:items-center gap-2.5 cursor-pointer select-none ${
        isSelected
          ? "bg-orange-50/70 border-l-4 border-l-orange-500"
          : "hover:bg-slate-50/90 border-l-4 border-l-transparent"
      }`}
    >
      {/* Фото и Наименование */}
      <div className="md:col-span-5 flex items-center gap-3">
        {/* Превью фото позиции */}
        <div
          className={`w-11 h-11 rounded-xl border overflow-hidden shrink-0 flex items-center justify-center relative shadow-xs group ${
            item.imageUrl && !imgError
              ? "border-slate-200/90 bg-slate-900/5 group-hover:border-orange-400 transition-colors"
              : "border-slate-200/80 bg-slate-100"
          }`}
        >
          {item.imageUrl && !imgError ? (
            <>
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105 transform-gpu will-change-transform"
                loading="lazy"
                decoding="async"
                onError={() => setImgError(true)}
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <ZoomIn className="w-3.5 h-3.5 drop-shadow" />
              </div>
            </>
          ) : isService ? (
            <div className="w-full h-full bg-purple-50 text-purple-600 flex items-center justify-center">
              <Handshake className="w-5 h-5" />
            </div>
          ) : (
            <div className="w-full h-full bg-orange-50 text-orange-500 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          )}
        </div>

        {/* Заголовок, категория и метка */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            {isService ? (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-purple-100 text-purple-700 border border-purple-200">
                <Handshake className="w-2.5 h-2.5" />
                Перезаказ
              </span>
            ) : null}

            {item.category ? (
              <span className="inline-block px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200/60 truncate max-w-[160px]">
                {item.category}
              </span>
            ) : null}
          </div>

          <div className="text-xs sm:text-sm font-black text-slate-900 break-words leading-tight mt-0.5">
            {item.name}
          </div>

          {item.description ? (
            <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
              {item.description}
            </p>
          ) : null}

          {/* Мобильный поставщик */}
          <div className="text-[10px] text-slate-400 font-semibold md:hidden mt-1 flex items-center gap-1.5">
            <span>Поставщик:</span>
            <button
              type="button"
              onClick={handleSupplierClick}
              className="inline-flex items-center gap-1 text-slate-800 font-bold hover:text-orange-600 hover:underline cursor-pointer bg-slate-100 px-1.5 py-0.2 rounded"
            >
              <Building2 className="w-2.5 h-2.5 text-slate-400" />
              <span>{item.supplier}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Подкатегория и Категория (десктоп) */}
      <div className="hidden md:block md:col-span-2">
        <span className="text-xs font-bold text-slate-800 truncate block">
          {item.subcategory || item.category || "—"}
        </span>
        {item.subcategory && item.category && (
          <span className="text-[10px] text-slate-400 font-medium truncate block">
            {item.category}
          </span>
        )}
      </div>

      {/* Поставщик (десктоп - кликабельный с открытием карточки контактов) */}
      <div className="hidden md:flex md:col-span-2 items-center min-w-0">
        <button
          type="button"
          onClick={handleSupplierClick}
          className="group/sup inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-100 hover:bg-orange-50 text-slate-700 hover:text-orange-700 border border-slate-200 hover:border-orange-200 transition cursor-pointer max-w-full"
          title="Нажмите, чтобы посмотреть контакты и адрес поставщика"
        >
          <Building2 className="w-3 h-3 text-slate-400 group-hover/sup:text-orange-500 shrink-0" />
          <span className="truncate">{item.supplier}</span>
        </button>
      </div>

      {/* Цена (с возможностью inline-редактирования) */}
      <div className="md:col-span-2 flex items-center justify-between md:justify-end gap-2">
        <span className="text-[11px] font-bold text-slate-400 md:hidden">Стоимость:</span>

        {isInline ? (
          <div
            className="flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="number"
              autoFocus
              value={inlinePriceValue}
              onChange={(e) =>
                setInlinePriceValue(e.target.value ? Number(e.target.value) : "")
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveInlineEdit(e);
                if (e.key === "Escape") setIsInline(false);
              }}
              className="w-24 px-2 py-1 rounded-lg border border-orange-400 bg-white text-xs font-black text-slate-900 outline-none text-right"
            />
            <button
              type="button"
              onClick={handleSaveInlineEdit}
              disabled={isSavingInline}
              className="p-1 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition cursor-pointer"
              title="Сохранить цену"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setIsInline(false)}
              className="p-1 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition cursor-pointer"
              title="Отмена"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleStartInlineEdit}
            className="group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 hover:bg-orange-50 border border-slate-200/80 hover:border-orange-200 transition-colors cursor-pointer"
            title="Нажмите, чтобы быстро изменить цену"
          >
            <span className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-orange-600">
              {Number(item.price).toLocaleString("ru-RU")} ₸
            </span>
            <span className="text-[10px] font-bold text-slate-400">/ {unitShort}</span>
            <Edit2 className="w-2.5 h-2.5 text-slate-300 group-hover:text-orange-500 transition-colors ml-0.5" />
          </button>
        )}
      </div>

      {/* Кнопки действий: Корзина, Редактирование, Удаление */}
      <div
        className="md:col-span-1 flex items-center justify-between md:justify-end gap-1.5 pt-1 md:pt-0 border-t md:border-t-0 border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Кнопка "В корзину" */}
        {onAddToCart && (
          <button
            type="button"
            onClick={handleAddToCartClick}
            className={`p-1.5 rounded-xl transition cursor-pointer flex items-center gap-1 ${
              isInCart
                ? "bg-slate-900 text-orange-400 shadow-2xs"
                : "bg-slate-100 hover:bg-orange-500 hover:text-white text-slate-600"
            }`}
            title={isInCart ? `В корзине (${cartQuantity} ${unitShort})` : "Добавить в корзину закупки"}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            {isInCart && (
              <span className="text-[10px] font-black pr-0.5">{cartQuantity}</span>
            )}
          </button>
        )}

        <button
          type="button"
          onClick={() => onOpenEditModal(item)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          title="Редактировать позицию"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => onDeleteItem(item.id)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
          title="Удалить позицию"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default memo(MaterialTableRow);
