"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Package, Handshake, ZoomIn, Building2, Star } from "lucide-react";
import { SupplierPriceItem } from "../../../../_types/pricingTypes";
import { pricingDict } from "@/dictionaries/pricing";
import { cn } from "@/lib/utils";

interface MaterialCardMediaProps {
  item: SupplierPriceItem;
  onSupplierClick: (e: React.MouseEvent) => void;
  onToggleFavorite?: (id: string, currentStatus?: boolean) => void;
}

export default function MaterialCardMedia({
  item,
  onSupplierClick,
  onToggleFavorite,
}: MaterialCardMediaProps) {
  const [imgError, setImgError] = useState(false);
  const isService = Boolean(item.isService);

  return (
    <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
      {item.imageUrl && !imgError ? (
        <Image
          src={item.imageUrl}
          alt={item.name}
          width={400}
          height={300}
          unoptimized
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105 transform-gpu will-change-transform"
          onError={() => setImgError(true)}
        />
      ) : isService ? (
        <div className="w-full h-full bg-purple-50 text-purple-600 flex flex-col items-center justify-center gap-1.5">
          <Handshake className="w-8 h-8" />
          <span className="text-[10px] font-black uppercase tracking-wider text-purple-700">
            {pricingDict.table.badges.service}
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

      {/* Бейджи в верхних углах и кнопка избранного */}
      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={onSupplierClick}
            className="px-2 py-0.5 rounded-lg text-[10px] font-black tracking-wide bg-white/95 hover:bg-orange-50 text-slate-800 hover:text-orange-700 shadow-2xs border border-slate-100 transition cursor-pointer flex items-center gap-1"
            title="Контакты поставщика"
          >
            <Building2 className="w-2.5 h-2.5 text-slate-400" />
            <span className="truncate max-w-[120px]">{item.supplier}</span>
          </button>

          {item.isFavorite && (
            <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-xs flex items-center gap-0.5">
              <Star className="w-2.5 h-2.5 fill-slate-950" />
              {pricingDict.table.badges.favorite}
            </span>
          )}

          {isService && (
            <span className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-purple-600 text-white shadow-xs">
              Услуга
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(item.id, item.isFavorite);
          }}
          className={cn(
            "w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs",
            item.isFavorite
              ? "bg-amber-400 text-slate-950 shadow-amber-400/40"
              : "bg-white/90 backdrop-blur-md text-slate-400 hover:text-amber-500 hover:bg-white"
          )}
          title={
            item.isFavorite
              ? pricingDict.table.tooltips.favoriteRemove
              : pricingDict.table.tooltips.favoriteAdd
          }
        >
          <Star className={cn("w-3.5 h-3.5", item.isFavorite && "fill-slate-950")} />
        </button>
      </div>
    </div>
  );
}
