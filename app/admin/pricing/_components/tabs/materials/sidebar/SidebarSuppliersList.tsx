"use client";

import React from "react";
import { Building2, Info } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { pricingDict } from "@/dictionaries/pricing";
import { cn } from "@/lib/utils";

interface SidebarSuppliersListProps {
  supplierNames: string[];
  selectedSupplier: string;
  onSelectSupplier: (sup: string) => void;
  supplierCounts: Record<string, number>;
  totalCount: number;
  onOpenSupplierInfo?: (supplierName: string) => void;
}

export default function SidebarSuppliersList({
  supplierNames,
  selectedSupplier,
  onSelectSupplier,
  supplierCounts,
  totalCount,
  onOpenSupplierInfo,
}: SidebarSuppliersListProps) {
  const t = pricingDict.sidebar.suppliers;

  return (
    <div className="space-y-1.5 pt-3 border-t border-slate-100">
      <div className="px-2 pb-1 text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-slate-400" />
          {t.title}
        </span>
        <span className="text-[10px] font-extrabold text-slate-400">
          {supplierNames.length}
        </span>
      </div>

      <button
        type="button"
        onClick={() => {
          triggerHaptic("light");
          onSelectSupplier("all");
        }}
        className={cn(
          "w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-bold transition text-left cursor-pointer active:scale-98",
          selectedSupplier === "all"
            ? "bg-slate-800 text-white font-black"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        )}
      >
        <span className="truncate">{t.all}</span>
        <span
          className={cn(
            "px-1.5 py-0.2 rounded-full text-[10px] font-black",
            selectedSupplier === "all"
              ? "bg-white/20 text-white"
              : "bg-slate-100 text-slate-500"
          )}
        >
          {supplierCounts["all"] ?? totalCount}
        </span>
      </button>

      <div className="space-y-0.5">
        {supplierNames.map((supName) => {
          const isAct = selectedSupplier === supName;
          const supCount = supplierCounts[supName] ?? 0;
          return (
            <div
              key={supName}
              className={cn(
                "w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-bold transition text-left group",
                isAct
                  ? "bg-slate-800 text-white font-black"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <button
                type="button"
                onClick={() => {
                  triggerHaptic("light");
                  onSelectSupplier(supName);
                }}
                className="flex-1 truncate flex items-center gap-2 cursor-pointer text-left mr-1"
              >
                <span
                  className={cn(
                    "w-2 h-2 rounded-full shrink-0",
                    supName.toLowerCase().includes("signtech")
                      ? "bg-orange-500"
                      : "bg-blue-500"
                  )}
                />
                <span className="truncate">{supName}</span>
              </button>

              <div className="flex items-center gap-1 shrink-0">
                <span
                  className={cn(
                    "px-1.5 py-0.2 rounded-full text-[10px] font-black",
                    isAct ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                  )}
                >
                  {supCount}
                </span>
                {onOpenSupplierInfo && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerHaptic("light");
                      onOpenSupplierInfo(supName);
                    }}
                    className={cn(
                      "p-1 rounded-lg transition cursor-pointer",
                      isAct
                        ? "text-slate-300 hover:text-white hover:bg-white/20"
                        : "text-slate-400 hover:text-orange-600 hover:bg-slate-200/70"
                    )}
                    title={t.contactInfoTooltip}
                  >
                    <Info className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
