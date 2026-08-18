"use client";

import React from "react";
import { 
  SIGN_TYPES, 
  MOUNTING_HEIGHTS, 
  FACADE_WALL_TYPES, 
  POWER_SUPPLY_OPTIONS, 
  APPROVAL_STATUSES 
} from "../../../_data/leadDetailDictionary";
import { LeadTechSpec } from "../../../_types/leadDetailTypes";
import { triggerHaptic } from "@/lib/haptics";
import { Wrench, ShieldCheck, Zap, Maximize, Moon, Sparkles, Layers } from "lucide-react";

interface LeadTechSpecTabProps {
  isEditing: boolean;
  techSpec: LeadTechSpec;
  setTechSpec: (val: LeadTechSpec | ((prev: LeadTechSpec) => LeadTechSpec)) => void;
}

export default function LeadTechSpecTab({ isEditing, techSpec, setTechSpec }: LeadTechSpecTabProps) {
  const selectedTypes = techSpec.signTypes || [];

  const handleToggleSignType = (id: string) => {
    triggerHaptic("light");
    setTechSpec((prev) => {
      const current = prev.signTypes || [];
      const next = current.includes(id) ? current.filter((t) => t !== id) : [...current, id];
      return { ...prev, signTypes: next };
    });
  };

  const handleFieldChange = (field: keyof LeadTechSpec, value: any) => {
    setTechSpec((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const selectedSignTypeLabels = selectedTypes
    .map((id) => SIGN_TYPES.find((st) => st.id === id)?.label)
    .filter(Boolean);

  const mountingHeightLabel = MOUNTING_HEIGHTS.find((h) => h.id === techSpec.mountingHeight)?.label;
  const facadeTypeLabel = FACADE_WALL_TYPES.find((w) => w.id === techSpec.facadeType)?.label;
  const powerSupplyLabel = POWER_SUPPLY_OPTIONS.find((p) => p.id === techSpec.powerSupply)?.label;
  const approvalStatusLabel = APPROVAL_STATUSES.find((a) => a.id === techSpec.approvalStatus)?.label;

  const hasAnyData =
    selectedTypes.length > 0 ||
    techSpec.lengthMeters ||
    techSpec.heightMeters ||
    techSpec.letterHeightCm ||
    techSpec.mountingHeight ||
    techSpec.facadeType ||
    techSpec.powerSupply ||
    techSpec.approvalStatus ||
    techSpec.nightMountingOnly;

  // ═══════════════════════════════════════════════════════════════
  // РЕЖИМ ПРОСМОТРА (View Mode) — Читаемый аккуратный вид
  // ═══════════════════════════════════════════════════════════════
  if (!isEditing) {
    if (!hasAnyData) {
      return (
        <div className="p-8 text-center bg-slate-50/70 border border-dashed border-slate-200 rounded-3xl space-y-2 animate-in fade-in duration-150">
          <Layers className="w-8 h-8 text-slate-300 mx-auto" />
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
            Тех-спецификация не заполнена
          </h4>
          <p className="text-xs text-slate-400 font-medium max-w-sm mx-auto">
            Нажмите кнопку «Изменить» внизу или в шапке, чтобы указать тип конструкции, размеры, фасад и параметры монтажа.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4 animate-in fade-in duration-150">
        {/* Типы конструкций */}
        {selectedSignTypeLabels.length > 0 && (
          <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-2.5">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
              Тип конструкции
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedSignTypeLabels.map((lbl, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-orange-500 text-white shadow-2xs"
                >
                  {lbl}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Размеры и габариты */}
        {(techSpec.lengthMeters || techSpec.heightMeters || techSpec.letterHeightCm) && (
          <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-2.5">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Maximize className="w-3.5 h-3.5 text-orange-500" />
              Габариты и размеры
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {techSpec.lengthMeters && (
                <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 font-bold block mb-0.5">
                    Длина
                  </span>
                  <span className="text-sm font-black text-slate-900">
                    {techSpec.lengthMeters} м
                  </span>
                </div>
              )}

              {techSpec.heightMeters && (
                <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 font-bold block mb-0.5">
                    Высота
                  </span>
                  <span className="text-sm font-black text-slate-900">
                    {techSpec.heightMeters} м
                  </span>
                </div>
              )}

              {techSpec.letterHeightCm && (
                <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 font-bold block mb-0.5">
                    Высота букв
                  </span>
                  <span className="text-sm font-black text-slate-900">
                    {techSpec.letterHeightCm} см
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Монтажные условия */}
        <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-3">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Wrench className="w-3.5 h-3.5 text-indigo-500" />
            Условия монтажа и фасад
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white p-3 rounded-xl border border-slate-200/80">
              <span className="text-[10px] text-slate-400 font-bold block mb-0.5">
                Высота от земли
              </span>
              <span className="text-xs font-black text-slate-900">
                {mountingHeightLabel || "Не указана"}
              </span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200/80">
              <span className="text-[10px] text-slate-400 font-bold block mb-0.5">
                Материал фасада
              </span>
              <span className="text-xs font-black text-slate-900">
                {facadeTypeLabel || "Не указан"}
              </span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200/80">
              <span className="text-[10px] text-slate-400 font-bold block mb-0.5 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-500" />
                Питание 220V
              </span>
              <span className="text-xs font-black text-slate-900">
                {powerSupplyLabel || "Не указано"}
              </span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200/80">
              <span className="text-[10px] text-slate-400 font-bold block mb-0.5 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                Согласование
              </span>
              <span className="text-xs font-black text-slate-900">
                {approvalStatusLabel || "Не указано"}
              </span>
            </div>
          </div>

          {techSpec.nightMountingOnly && (
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-indigo-50 text-indigo-900 border border-indigo-200">
                <Moon className="w-3.5 h-3.5 text-indigo-600" />
                Строго ночной монтаж (требование ТРЦ)
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // РЕЖИМ РЕДАКТИРОВАНИЯ (Edit Mode) — Полный редактор
  // ═══════════════════════════════════════════════════════════════
  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* 1. Тип рекламной конструкции (Мультивыбор) */}
      <div className="bg-slate-50/80 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 space-y-2.5">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
          Тип конструкции (можно выбрать несколько)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SIGN_TYPES.map((st) => {
            const isSelected = selectedTypes.includes(st.id);
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => handleToggleSignType(st.id)}
                className={`p-2.5 rounded-xl border text-left text-xs font-extrabold transition cursor-pointer flex items-center justify-between active:scale-98 ${
                  isSelected
                    ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                    : "bg-white text-slate-800 border-slate-200 hover:bg-slate-100/70"
                }`}
              >
                <span>{st.label}</span>
                <span
                  className={`w-4 h-4 rounded-md border flex items-center justify-center text-[10px] ${
                    isSelected ? "bg-white text-orange-600 border-white font-black" : "border-slate-300"
                  }`}
                >
                  {isSelected && "✓"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Габариты и размеры */}
      <div className="bg-slate-50/80 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 space-y-3">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <Maximize className="w-3.5 h-3.5 text-orange-500" />
          Габариты и размеры объекта
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[10px] text-slate-500 font-bold mb-1">
              Длина конструкции (м)
            </label>
            <input
              type="number"
              step="any"
              value={techSpec.lengthMeters || ""}
              onChange={(e) => handleFieldChange("lengthMeters", parseFloat(e.target.value) || null)}
              placeholder="например: 4.5"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:border-orange-500 outline-none text-xs shadow-2xs transition"
            />
          </div>

          <div>
            <label className="block text-[10px] text-slate-500 font-bold mb-1">
              Высота конструкции (м)
            </label>
            <input
              type="number"
              step="any"
              value={techSpec.heightMeters || ""}
              onChange={(e) => handleFieldChange("heightMeters", parseFloat(e.target.value) || null)}
              placeholder="например: 0.8"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:border-orange-500 outline-none text-xs shadow-2xs transition"
            />
          </div>

          <div>
            <label className="block text-[10px] text-slate-500 font-bold mb-1">
              Высота букв / знака (см)
            </label>
            <input
              type="number"
              step="any"
              value={techSpec.letterHeightCm || ""}
              onChange={(e) => handleFieldChange("letterHeightCm", parseFloat(e.target.value) || null)}
              placeholder="например: 40"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:border-orange-500 outline-none text-xs shadow-2xs transition"
            />
          </div>
        </div>
      </div>

      {/* 3. Монтажные условия и фасад */}
      <div className="bg-slate-50/80 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 space-y-3">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <Wrench className="w-3.5 h-3.5 text-indigo-500" />
          Монтажные условия и тип стены
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] text-slate-500 font-bold mb-1">
              Высота монтажа от земли
            </label>
            <select
              value={techSpec.mountingHeight || ""}
              onChange={(e) => handleFieldChange("mountingHeight", e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:border-orange-500 outline-none text-xs shadow-2xs transition"
            >
              <option value="">Не указано</option>
              {MOUNTING_HEIGHTS.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-slate-500 font-bold mb-1">
              Материал фасада / стены
            </label>
            <select
              value={techSpec.facadeType || ""}
              onChange={(e) => handleFieldChange("facadeType", e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:border-orange-500 outline-none text-xs shadow-2xs transition"
            >
              <option value="">Не указано</option>
              {FACADE_WALL_TYPES.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] text-slate-500 font-bold mb-1 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500" />
              Питание 220V (подключение)
            </label>
            <select
              value={techSpec.powerSupply || ""}
              onChange={(e) => handleFieldChange("powerSupply", e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:border-orange-500 outline-none text-xs shadow-2xs transition"
            >
              <option value="">Не указано</option>
              {POWER_SUPPLY_OPTIONS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-slate-500 font-bold mb-1 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              Согласование вывески
            </label>
            <select
              value={techSpec.approvalStatus || ""}
              onChange={(e) => handleFieldChange("approvalStatus", e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:border-orange-500 outline-none text-xs shadow-2xs transition"
            >
              <option value="">Не указано</option>
              {APPROVAL_STATUSES.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200/60">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={Boolean(techSpec.nightMountingOnly)}
              onChange={(e) => handleFieldChange("nightMountingOnly", e.target.checked)}
              className="w-4 h-4 rounded text-orange-600 border-slate-300 focus:ring-orange-500 cursor-pointer"
            />
            <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5 text-indigo-600" />
              Строго ночной монтаж (требование ТРЦ / Бизнес-центра)
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
