"use client";

import React, { useState, memo } from "react";
import Image from "next/image";
import { SupplierPriceItem } from "../../../_types/pricingTypes";
import { INVENTORY_UNITS } from "../../../_data/pricingDictionary";
import {
  Package,
  Handshake,
  ZoomIn,
  Building2,
  Star,
} from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { pricingDict } from "@/dictionaries/pricing";
import { cn } from "@/lib/utils";

import MaterialRowQuickPrice from "./table/MaterialRowQuickPrice";
import MaterialRowCartControl from "./table/MaterialRowCartControl";
import MaterialRowActions from "./table/MaterialRowActions";

interface MaterialTableRowProps {
  item: SupplierPriceItem;
  isSelected?: boolean;
  onSelect?: (item: SupplierPriceItem) => void;
  onOpenEditModal: (item: SupplierPriceItem) => void;
  onQuickUpdatePrice: (id: string, newPrice: number) => Promise<void>;
  onDeleteItem: (id: string) => Promise<void>;
  onOpenSupplierInfo?: (supplierName: string) => void;
  onAddToCart?: (item: SupplierPriceItem, quantity?: number) => void;
  onRemoveFromCart?: (id: string) => void;
  onUpdateCartQuantity?: (priceItemId: string, newQty: number) => void;
  onToggleFavorite?: (id: string, currentStatus?: boolean) => void;
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
  onRemoveFromCart,
  onUpdateCartQuantity,
  onToggleFavorite,
  isInCart = false,
  cartQuantity = 0,
}: MaterialTableRowProps) {
  const [imgError, setImgError] = useState(false);
  const unitShort = INVENTORY_UNITS[item.unit]?.short || "ед.";
  const isService = Boolean(item.isService);

  const handleSupplierClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic("light");
    onOpenSupplierInfo?.(item.supplier);
  };

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
      <div className="md:col-span-4 flex items-center gap-2.5">
        {/* Кнопка быстрого добавления в избранное (часто закупаем) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(item.id, item.isFavorite);
          }}
          className={cn(
            "p-1.5 rounded-xl transition cursor-pointer shrink-0",
            item.isFavorite
              ? "text-amber-500 hover:text-amber-600 bg-amber-50/90"
              : "text-slate-300 hover:text-amber-400 hover:bg-slate-100"
          )}
          title={
            item.isFavorite
              ? pricingDict.table.tooltips.favoriteRemove
              : pricingDict.table.tooltips.favoriteAdd
          }
        >
          <Star className={cn("w-4 h-4", item.isFavorite && "fill-amber-400")} />
        </button>

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
              <Image
                src={item.imageUrl}
                alt={item.name}
                width={44}
                height={44}
                unoptimized
                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105 transform-gpu will-change-transform"
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
            {item.isFavorite ? (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200/80">
                <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-500" />
                {pricingDict.table.badges.favorite}
              </span>
            ) : null}

            {isService ? (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-purple-100 text-purple-700 border border-purple-200">
                <Handshake className="w-2.5 h-2.5" />
                {pricingDict.table.badges.service}
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
      <div className="md:col-span-2 flex items-center justify-between md:justify-end gap-2 pr-3">
        <span className="text-[11px] font-bold text-slate-400 md:hidden">Стоимость:</span>
        <MaterialRowQuickPrice
          itemId={item.id}
          price={item.price}
          unitShort={unitShort}
          onQuickUpdatePrice={onQuickUpdatePrice}
        />
      </div>

      {/* Кнопки действий: Корзина, Редактирование, Удаление */}
      <div
        className="md:col-span-2 flex items-center justify-between md:justify-end gap-1.5 pt-1 md:pt-0 border-t md:border-t-0 border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <MaterialRowCartControl
          item={item}
          isInCart={isInCart}
          cartQuantity={cartQuantity}
          onAddToCart={onAddToCart}
          onRemoveFromCart={onRemoveFromCart}
          onUpdateCartQuantity={onUpdateCartQuantity}
        />

        <MaterialRowActions
          item={item}
          onOpenEditModal={onOpenEditModal}
          onDeleteItem={onDeleteItem}
        />
      </div>
    </div>
  );
}

export default memo(MaterialTableRow);
