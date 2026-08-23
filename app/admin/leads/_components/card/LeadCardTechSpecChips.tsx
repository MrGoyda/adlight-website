"use client";

import React from "react";
import { 
  SIGN_TYPES, 
  MOUNTING_HEIGHTS, 
  FACADE_WALL_TYPES, 
  POWER_SUPPLY_OPTIONS, 
  APPROVAL_STATUSES 
} from "../../_data/leadDetailDictionary";
import { LeadTechSpec } from "../../_types/leadDetailTypes";
import { Wrench, Zap, Moon, ShieldCheck, Maximize, Layers } from "lucide-react";

interface LeadCardTechSpecChipsProps {
  techSpec?: LeadTechSpec | null;
}

export default function LeadCardTechSpecChips({ techSpec }: LeadCardTechSpecChipsProps) {
  if (!techSpec) return null;

  // Список конструкций из items или signTypes
  const items = techSpec.items && techSpec.items.length > 0
    ? techSpec.items
    : (techSpec.signTypes || []).map((st) => ({
        signType: st,
        title: SIGN_TYPES.find((s) => s.id === st)?.label,
        lengthMm: techSpec.lengthMm || (techSpec.lengthMeters ? Math.round(techSpec.lengthMeters * 1000) : null),
        heightMm: techSpec.heightMm || (techSpec.heightMeters ? Math.round(techSpec.heightMeters * 1000) : null),
        letterHeightMm: techSpec.letterHeightMm || (techSpec.letterHeightCm ? Math.round(techSpec.letterHeightCm * 10) : null),
      }));

  const mountingHeightObj = MOUNTING_HEIGHTS.find((h) => h.id === techSpec.mountingHeight);
  const facadeTypeObj = FACADE_WALL_TYPES.find((w) => w.id === techSpec.facadeType);
  const powerSupplyObj = POWER_SUPPLY_OPTIONS.find((p) => p.id === techSpec.powerSupply);
  const approvalStatusObj = APPROVAL_STATUSES.find((a) => a.id === techSpec.approvalStatus);

  const hasSpec =
    items.length > 0 ||
    mountingHeightObj ||
    facadeTypeObj ||
    powerSupplyObj ||
    approvalStatusObj ||
    techSpec.nightMountingOnly;

  if (!hasSpec) return null;

  return (
    <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
      {/* Список конструкций с размерами в мм */}
      {items.map((item, idx) => {
        const stObj = SIGN_TYPES.find((st) => st.id === item.signType);
        const title = stObj?.label || item.title || "Конструкция";
        const dims = item.lengthMm || item.heightMm 
          ? `${item.lengthMm || "?"}×${item.heightMm || "?"} мм`
          : null;

        return (
          <span
            key={idx}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black bg-orange-100 text-orange-900 border border-orange-200 shadow-2xs"
          >
            <Layers className="w-2.5 h-2.5 text-orange-600" />
            <span>{title}</span>
            {dims && <span className="text-orange-700 font-mono font-bold">({dims})</span>}
          </span>
        );
      })}

      {/* Материал фасада */}
      {facadeTypeObj && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
          <span>{facadeTypeObj.label}</span>
        </span>
      )}

      {/* Высота монтажа */}
      {mountingHeightObj && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
          <Wrench className="w-2.5 h-2.5 text-amber-600" />
          {mountingHeightObj.label}
        </span>
      )}

      {/* Питание 220V */}
      {powerSupplyObj && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <Zap className="w-2.5 h-2.5 text-emerald-600" />
          {powerSupplyObj.label}
        </span>
      )}

      {/* Ночной монтаж */}
      {techSpec.nightMountingOnly && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black bg-purple-50 text-purple-800 border border-purple-200">
          <Moon className="w-2.5 h-2.5 text-purple-600" />
          Ночной монтаж
        </span>
      )}

      {/* Согласование */}
      {approvalStatusObj && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
          <ShieldCheck className="w-2.5 h-2.5 text-teal-600" />
          {approvalStatusObj.label}
        </span>
      )}
    </div>
  );
}
