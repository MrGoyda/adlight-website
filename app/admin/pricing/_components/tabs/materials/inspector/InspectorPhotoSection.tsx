"use client";

import React, { useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { ZoomIn, Handshake, Package, X } from "lucide-react";
import { SupplierPriceItem } from "../../../../_types/pricingTypes";
import { INVENTORY_UNITS } from "../../../../_data/pricingDictionary";
import { triggerHaptic } from "@/lib/haptics";
import { pricingDict } from "@/dictionaries/pricing";

interface InspectorPhotoSectionProps {
  item: SupplierPriceItem;
}

export default function InspectorPhotoSection({ item }: InspectorPhotoSectionProps) {
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const t = pricingDict.modals.inspector;

  return (
    <>
      <div className="relative aspect-16/10 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200/80 shadow-xs flex items-center justify-center group">
        {item.imageUrl ? (
          <>
            <Image
              src={item.imageUrl}
              alt={item.name}
              width={600}
              height={375}
              unoptimized
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
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
              <span>{t.zoomButton}</span>
            </button>
          </>
        ) : item.isService ? (
          <div className="flex flex-col items-center gap-2 text-purple-600">
            <Handshake className="w-12 h-12 stroke-[1.5]" />
            <span className="text-xs font-black uppercase tracking-wider">
              {t.serviceBadge}
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-400">
            <Package className="w-12 h-12 stroke-[1.5]" />
            <span className="text-xs font-bold">{t.noPhoto}</span>
          </div>
        )}
      </div>

      {isZoomOpen && item.imageUrl && typeof document !== "undefined"
        ? createPortal(
            <div
              className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200 cursor-zoom-out"
              onClick={() => setIsZoomOpen(false)}
            >
              <div
                className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative cursor-default border border-white/20 animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setIsZoomOpen(false)}
                  className="absolute top-3.5 right-3.5 z-10 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition cursor-pointer shadow-md"
                  title="Закрыть (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="bg-slate-100 aspect-4/3 flex items-center justify-center overflow-hidden">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    width={800}
                    height={600}
                    unoptimized
                    className="w-full h-full object-contain max-h-[75vh]"
                  />
                </div>

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
        : null}
    </>
  );
}
