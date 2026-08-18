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

  const selectedTypes = techSpec.signTypes || [];
  const selectedTypeLabels = selectedTypes
    .map((id) => SIGN_TYPES.find((st) => st.id === id)?.label)
    .filter(Boolean);

  const mountingHeightObj = MOUNTING_HEIGHTS.find((h) => h.id === techSpec.mountingHeight);
  const facadeTypeObj = FACADE_WALL_TYPES.find((w) => w.id === techSpec.facadeType);
  const powerSupplyObj = POWER_SUPPLY_OPTIONS.find((p) => p.id === techSpec.powerSupply);
  const approvalStatusObj = APPROVAL_STATUSES.find((a) => a.id === techSpec.approvalStatus);

  const hasDims = Boolean(techSpec.lengthMeters || techSpec.heightMeters || techSpec.letterHeightCm);
  const hasSpec =
    selectedTypeLabels.length > 0 ||
    hasDims ||
    mountingHeightObj ||
    facadeTypeObj ||
    powerSupplyObj ||
    approvalStatusObj ||
    techSpec.nightMountingOnly;

  if (!hasSpec) return null;

  return (
    <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
      {/* Тип конструкции */}
      {selectedTypeLabels.map((lbl, idx) => (
        <span
          key={idx}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black bg-orange-100 text-orange-800 border border-orange-200 shadow-2xs"
        >
          <Layers className="w-2.5 h-2.5 text-orange-600" />
          {lbl}
        </span>
      ))}

      {/* Габариты */}
      {hasDims && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black bg-slate-100 text-slate-800 border border-slate-200">
          <Maximize className="w-2.5 h-2.5 text-slate-500" />
          {techSpec.lengthMeters ? `${techSpec.lengthMeters}м` : ""}
          {techSpec.heightMeters ? ` × ${techSpec.heightMeters}м` : ""}
          {techSpec.letterHeightCm ? ` (буквы ${techSpec.letterHeightCm}см)` : ""}
        </span>
      )}

      {/* Материал фасада */}
      {facadeTypeObj && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
          🏢 {facadeTypeObj.label}
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
