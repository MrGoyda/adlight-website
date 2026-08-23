"use client";

import React, { useState } from "react";
import { 
  SIGN_TYPES, 
  MOUNTING_HEIGHTS, 
  FACADE_WALL_TYPES, 
  POWER_SUPPLY_OPTIONS, 
  APPROVAL_STATUSES 
} from "../../../_data/leadDetailDictionary";
import { LeadTechSpec } from "../../../_types/leadDetailTypes";
import { triggerHaptic } from "@/lib/haptics";
import { 
  Wrench, 
  ShieldCheck, 
  Zap, 
  Maximize, 
  Moon, 
  Layers, 
  ChevronDown, 
  Check, 
  X,
  Plus
} from "lucide-react";

interface LeadTechSpecTabProps {
  techSpec: LeadTechSpec;
  setTechSpec: (val: LeadTechSpec | ((prev: LeadTechSpec) => LeadTechSpec)) => void;
  onAutoSave?: (patch: { techSpec: LeadTechSpec }) => void;
}

export default function LeadTechSpecTab({ techSpec, setTechSpec, onAutoSave }: LeadTechSpecTabProps) {
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const selectedTypes = techSpec.signTypes || [];

  const handleToggleSignType = (id: string) => {
    triggerHaptic("light");
    const nextTypes = selectedTypes.includes(id) 
      ? selectedTypes.filter((t) => t !== id) 
      : [...selectedTypes, id];
    
    const updated = { ...techSpec, signTypes: nextTypes };
    setTechSpec(updated);
    if (onAutoSave) onAutoSave({ techSpec: updated });
  };

  const handleFieldChange = (field: keyof LeadTechSpec, value: any) => {
    const updated = {
      ...techSpec,
      [field]: value,
    };
    setTechSpec(updated);
    if (onAutoSave) onAutoSave({ techSpec: updated });
  };

  const selectedSignTypeObjs = selectedTypes
    .map((id) => SIGN_TYPES.find((st) => st.id === id))
    .filter(Boolean);

  const hasSignType = selectedTypes.length > 0;

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* 1. Выбор типа рекламной конструкции (Дропдаун меню + Чипы) */}
      <div className="bg-slate-50/80 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-orange-500" />
            Тип рекламной конструкции
          </label>
          <span className="text-[10px] font-bold text-slate-400">
            {selectedTypes.length > 0 ? `Выбрано: ${selectedTypes.length}` : "Не выбрано"}
          </span>
        </div>

        {/* Выбранные конструкции (Чипы с кнопкой удаления) */}
        {selectedSignTypeObjs.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {selectedSignTypeObjs.map((st) => (
              <span
                key={st!.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-slate-900 text-white shadow-2xs animate-in zoom-in-95 duration-100"
              >
                <span>{st!.label}</span>
                <button
                  type="button"
                  onClick={() => handleToggleSignType(st!.id)}
                  className="p-0.5 rounded-md hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
                  title="Удалить"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Кнопка выпадающего меню */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              triggerHaptic("light");
              setShowTypeDropdown((prev) => !prev);
            }}
            className="w-full bg-white border border-slate-200 hover:border-orange-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 flex items-center justify-between shadow-2xs transition cursor-pointer active:scale-99"
          >
            <span className="flex items-center gap-2">
              <Plus className="w-3.5 h-3.5 text-orange-600" />
              <span>{selectedTypes.length === 0 ? "Выберите тип конструкции..." : "Добавить / Изменить тип конструкции..."}</span>
            </span>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showTypeDropdown ? "rotate-180" : ""}`} />
          </button>

          {showTypeDropdown && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-40 max-h-72 overflow-y-auto space-y-1 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2 py-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                Каталог рекламных конструкций
              </div>
              {SIGN_TYPES.map((st) => {
                const isSelected = selectedTypes.includes(st.id);
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => handleToggleSignType(st.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? "bg-orange-50 text-orange-950 font-black border border-orange-200"
                        : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <span>{st.label}</span>
                    {isSelected ? (
                      <Check className="w-4 h-4 text-orange-600 stroke-[3]" />
                    ) : (
                      <span className="text-[10px] text-slate-400">{st.category}</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 2. Габариты и размеры (появляются при выборе конструкции или наличии данных) */}
      {(hasSignType || techSpec.lengthMeters || techSpec.heightMeters || techSpec.letterHeightCm) && (
        <div className="bg-slate-50/80 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 space-y-3 animate-in fade-in duration-200">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
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
                value={techSpec.lengthMeters ?? ""}
                onChange={(e) => setTechSpec((prev) => ({ ...prev, lengthMeters: parseFloat(e.target.value) || null }))}
                onBlur={(e) => handleFieldChange("lengthMeters", parseFloat(e.target.value) || null)}
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
                value={techSpec.heightMeters ?? ""}
                onChange={(e) => setTechSpec((prev) => ({ ...prev, heightMeters: parseFloat(e.target.value) || null }))}
                onBlur={(e) => handleFieldChange("heightMeters", parseFloat(e.target.value) || null)}
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
                value={techSpec.letterHeightCm ?? ""}
                onChange={(e) => setTechSpec((prev) => ({ ...prev, letterHeightCm: parseFloat(e.target.value) || null }))}
                onBlur={(e) => handleFieldChange("letterHeightCm", parseFloat(e.target.value) || null)}
                placeholder="например: 40"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:border-orange-500 outline-none text-xs shadow-2xs transition"
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. Монтажные условия и фасад (Инлайн селекты с мгновенным сохранением) */}
      <div className="bg-slate-50/80 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 space-y-3">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
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
              onChange={(e) => handleFieldChange("mountingHeight", e.target.value || null)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:border-orange-500 outline-none text-xs shadow-2xs transition cursor-pointer"
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
              onChange={(e) => handleFieldChange("facadeType", e.target.value || null)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:border-orange-500 outline-none text-xs shadow-2xs transition cursor-pointer"
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
              onChange={(e) => handleFieldChange("powerSupply", e.target.value || null)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:border-orange-500 outline-none text-xs shadow-2xs transition cursor-pointer"
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
              onChange={(e) => handleFieldChange("approvalStatus", e.target.value || null)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:border-orange-500 outline-none text-xs shadow-2xs transition cursor-pointer"
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
