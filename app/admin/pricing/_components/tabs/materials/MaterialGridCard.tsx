"use client";

import React, { useState, memo } from "react";
import { SupplierPriceItem } from "../../../_types/pricingTypes";
import { INVENTORY_UNITS } from "../../../_data/pricingDictionary";
import {
  Package,
  Handshake,
  ZoomIn,
  Edit2,
  Check,
  X,
  Building2,
  ShoppingBag,
} from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { toast } from "@/lib/toast";

interface MaterialGridCardProps {
  item: SupplierPriceItem;
  isSelected: boolean;
  onSelect: (item: SupplierPriceItem) => void;
  onOpenEditModal: (item: SupplierPriceItem) => void;
  onQuickUpdatePrice: (id: string, newPrice: number) => Promise<void>;
  onDeleteItem: (id: string) => Promise<void>;
  onOpenSupplierInfo?: (supplierName: string) => void;
  onAddToCart?: (item: SupplierPriceItem) => void;
  isInCart?: boolean;
  cartQuantity?: number;
}

function MaterialGridCard({
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
}: MaterialGridCardProps) {
  const [isInline, setIsInline] = useState(false);
  const [inlinePriceValue, setInlinePriceValue] = useState<number | "">(item.price);
  const [isSavingInline, setIsSavingInline] = useState(false);
  const [imgError, setImgError] = useState(false);

  const unitShort = INVENTORY_UNITS[item.unit]?.short || "ед.";
  const isService = Boolean(item.isService);

  const handleSaveInline = async (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
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

  return (
    <div
      onClick={() => {
        triggerHaptic("light");
        onSelect(item);
      }}
      style={{ contentVisibility: "auto", containIntrinsicSize: "0 310px" }}
      className={`group relative bg-white rounded-3xl border transition-colors duration-150 cursor-pointer flex flex-col overflow-hidden text-left ${
        isSelected
          ? "border-orange-500 ring-2 ring-orange-500/20 shadow-md"
          : "border-slate-200/80 hover:border-slate-300 hover:shadow-md"
      }`}
    >
      {/* Медиа превью */}
      <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
        {item.imageUrl && !imgError ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105 transform-gpu will-change-transform"
            loading="lazy"
            decoding="async"
            onError={() => setImgError(true)}
          />
        ) : isService ? (
          <div className="w-full h-full bg-purple-50 text-purple-600 flex flex-col items-center justify-center gap-1.5">
            <Handshake className="w-8 h-8" />
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-700">
              Подрядчик
            </span>
          </div>
        ) : (
          <div className="w-full h-full bg-orange-50/70 text-orange-500 flex flex-col items-center justify-center gap-1.5">
            <Package className="w-8 h-8" />
            <span className="text-[10px] font-bold text-slate-400">Фото отсутствует</span>
          </div>
        )}

        {/* Наложение при наведении */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3 text-white pointer-events-none">
          <span className="text-[11px] font-bold flex items-center gap-1">
            <ZoomIn className="w-3.5 h-3.5" />
            Инспектор
          </span>
        </div>

        {/* Бейджи в верхних углах */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
          <button
            type="button"
            onClick={handleSupplierClick}
            className="px-2 py-0.5 rounded-lg text-[10px] font-black tracking-wide bg-white/95 hover:bg-orange-50 text-slate-800 hover:text-orange-700 shadow-2xs border border-slate-100 transition cursor-pointer flex items-center gap-1"
            title="Контакты поставщика"
          >
            <Building2 className="w-2.5 h-2.5 text-slate-400" />
            <span className="truncate max-w-[120px]">{item.supplier}</span>
          </button>

          {isService && (
            <span className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-purple-600 text-white shadow-xs">
              Услуга
            </span>
          )}
        </div>
      </div>

      {/* Текстовая информация */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
        <div className="space-y-1">
          {item.subcategory && (
            <span className="text-[10px] font-extrabold text-orange-600 truncate block">
              {item.subcategory}
            </span>
          )}

          <h3 className="text-xs sm:text-sm font-black text-slate-900 leading-snug line-clamp-2">
            {item.name}
          </h3>
        </div>

        {/* Цена и действия */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          {isInline ? (
            <div
              className="flex items-center gap-1 w-full"
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
                  if (e.key === "Enter") handleSaveInline(e);
                  if (e.key === "Escape") setIsInline(false);
                }}
                className="w-full px-2 py-1 rounded-lg border border-orange-400 bg-white text-xs font-black text-slate-900 outline-none"
              />
              <button
                type="button"
                onClick={handleSaveInline}
                disabled={isSavingInline}
                className="p-1 rounded-lg bg-emerald-500 text-white cursor-pointer"
                title="Сохранить"
              >
                <Check className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => setIsInline(false)}
                className="p-1 rounded-lg bg-slate-100 text-slate-500 cursor-pointer"
                title="Отмена"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <>
              <div>
                <span className="text-xs sm:text-sm font-black text-slate-900 block leading-none">
                  {Number(item.price).toLocaleString("ru-RU")} ₸
                </span>
                <span className="text-[10px] font-bold text-slate-400 block mt-0.5">
                  / {unitShort}
                </span>
              </div>

              <div
                className="flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Кнопка "В корзину" */}
                {onAddToCart && (
                  <button
                    type="button"
                    onClick={handleAddToCartClick}
                    className={`p-2 rounded-xl transition cursor-pointer flex items-center gap-1 ${
                      isInCart
                        ? "bg-slate-900 text-orange-400 shadow-2xs"
                        : "bg-orange-50 hover:bg-orange-500 hover:text-white text-orange-600"
                    }`}
                    title={isInCart ? `В корзине (${cartQuantity} ${unitShort})` : "Добавить в корзину закупки"}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    {isInCart && (
                      <span className="text-[10px] font-black">{cartQuantity}</span>
                    )}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onOpenEditModal(item)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                  title="Редактировать"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(MaterialGridCard);
