"use client";

import React, { useState } from "react";
import { 
  SIGN_TYPES, 
  MOUNTING_HEIGHTS, 
  FACADE_WALL_TYPES, 
  POWER_SUPPLY_OPTIONS, 
  APPROVAL_STATUSES 
} from "../../../_data/leadDetailDictionary";
import { LeadTechSpec, LeadConstructionItem } from "../../../_types/leadDetailTypes";
import { triggerHaptic } from "@/lib/haptics";
import { toast } from "@/lib/toast";
import CustomDropdown, { CustomDropdownOption } from "@/components/ui/CustomDropdown";
import { 
  Wrench, 
  ShieldCheck, 
  Zap, 
  Maximize, 
  Moon, 
  Layers, 
  ChevronDown, 
  Check, 
  Trash2,
  Plus
} from "lucide-react";

interface LeadTechSpecTabProps {
  techSpec: LeadTechSpec;
  setTechSpec: (val: LeadTechSpec | ((prev: LeadTechSpec) => LeadTechSpec)) => void;
  onAutoSave?: (patch: { techSpec: LeadTechSpec }) => void;
}

export default function LeadTechSpecTab({ techSpec: rawTechSpec, setTechSpec, onAutoSave }: LeadTechSpecTabProps) {
  // Защитный парсинг: если techSpec пришел как JSON-строка, null или объект
  const techSpec: LeadTechSpec = typeof rawTechSpec === "string"
    ? (() => {
        try {
          return JSON.parse(rawTechSpec);
        } catch {
          return {};
        }
      })()
    : rawTechSpec || {};

  // Список конструкций. Если items нет, строим из legacy данных или инициализируем
  const items: LeadConstructionItem[] = Array.isArray(techSpec.items) && techSpec.items.length > 0
    ? techSpec.items
    : (Array.isArray(techSpec.signTypes) && techSpec.signTypes.length > 0)
      ? techSpec.signTypes.map((st, idx) => ({
          id: `legacy-${idx}-${st}`,
          signType: st,
          title: SIGN_TYPES.find((s) => s.id === st)?.label || "Конструкция",
          lengthMm: techSpec.lengthMm || (techSpec.lengthMeters ? Math.round(techSpec.lengthMeters * 1000) : null),
          heightMm: techSpec.heightMm || (techSpec.heightMeters ? Math.round(techSpec.heightMeters * 1000) : null),
          letterHeightMm: techSpec.letterHeightMm || (techSpec.letterHeightCm ? Math.round(techSpec.letterHeightCm * 10) : null),
          mountingHeight: techSpec.mountingHeight || null,
          facadeType: techSpec.facadeType || null,
          powerSupply: techSpec.powerSupply || null,
          approvalStatus: techSpec.approvalStatus || null,
          nightMountingOnly: techSpec.nightMountingOnly || false,
        }))
      : [
          {
            id: `item-${Date.now()}`,
            signType: null,
            title: "Основная вывеска",
            lengthMm: null,
            heightMm: null,
            letterHeightMm: null,
            depthMm: null,
            mountingHeight: techSpec.mountingHeight || null,
            facadeType: techSpec.facadeType || null,
            powerSupply: techSpec.powerSupply || null,
            approvalStatus: techSpec.approvalStatus || null,
            nightMountingOnly: techSpec.nightMountingOnly || false,
            comment: null,
          }
        ];

  // Состояние раскрытых карточек (ID конструкций, которые развернуты)
  const [expandedItemIds, setExpandedItemIds] = useState<string[]>(() => 
    items.length > 0 ? [items[0].id] : []
  );

  // Какая карточка сейчас выбирает тип конструкции (ID или null)
  const [openDropdownItemId, setOpenDropdownItemId] = useState<string | null>(null);

  const toggleExpandItem = (id: string) => {
    triggerHaptic("light");
    setExpandedItemIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleUpdateItems = (newItems: LeadConstructionItem[]) => {
    const updated: LeadTechSpec = {
      ...techSpec,
      items: newItems,
      // Сохраняем legacy поля для обратной совместимости
      signTypes: newItems.map((i) => i.signType).filter(Boolean) as string[],
      lengthMm: newItems[0]?.lengthMm || null,
      heightMm: newItems[0]?.heightMm || null,
      letterHeightMm: newItems[0]?.letterHeightMm || null,
      mountingHeight: newItems[0]?.mountingHeight || null,
      facadeType: newItems[0]?.facadeType || null,
      powerSupply: newItems[0]?.powerSupply || null,
      approvalStatus: newItems[0]?.approvalStatus || null,
      nightMountingOnly: newItems[0]?.nightMountingOnly || false,
    };
    setTechSpec(updated);
    if (onAutoSave) onAutoSave({ techSpec: updated });
  };

  const handleAddItem = () => {
    triggerHaptic("medium");
    const newItemId = `item-${Date.now()}`;
    const newItem: LeadConstructionItem = {
      id: newItemId,
      signType: null,
      title: `Конструкция #${items.length + 1}`,
      lengthMm: null,
      heightMm: null,
      letterHeightMm: null,
      depthMm: null,
      mountingHeight: null,
      facadeType: null,
      powerSupply: null,
      approvalStatus: null,
      nightMountingOnly: false,
      comment: null,
    };
    const nextItems = [...items, newItem];
    setExpandedItemIds((prev) => [...prev, newItemId]);
    handleUpdateItems(nextItems);
  };

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic("medium");
    const itemToDelete = items.find((i) => i.id === id);
    const itemTitle = itemToDelete?.title || "Конструкция";

    toast.confirm({
      title: `Удалить «${itemTitle}»?`,
      message: "Параметры и размеры этой конструкции будут удалены из тех-спецификации.",
      confirmText: "Да, удалить",
      cancelText: "Отмена",
      isDestructive: true,
      onConfirm: () => {
        if (items.length <= 1) {
          const resetItem: LeadConstructionItem = {
            id: `item-${Date.now()}`,
            signType: null,
            title: "Основная вывеска",
            lengthMm: null,
            heightMm: null,
            letterHeightMm: null,
          };
          handleUpdateItems([resetItem]);
          setExpandedItemIds([resetItem.id]);
          return;
        }
        const nextItems = items.filter((i) => i.id !== id);
        handleUpdateItems(nextItems);
      },
    });
  };

  const handleUpdateItemField = (id: string, field: keyof LeadConstructionItem, value: any) => {
    const nextItems = items.map((i) => {
      if (i.id !== id) return i;
      return { ...i, [field]: value };
    });
    handleUpdateItems(nextItems);
  };

  const handleSelectSignType = (itemId: string, typeId: string) => {
    triggerHaptic("light");
    const stObj = SIGN_TYPES.find((s) => s.id === typeId);
    const nextItems = items.map((i) => {
      if (i.id !== itemId) return i;
      return { 
        ...i, 
        signType: typeId,
        title: stObj ? stObj.label : i.title 
      };
    });
    // АВТОЗАКРЫТИЕ выпадающего списка при выборе!
    setOpenDropdownItemId(null);
    handleUpdateItems(nextItems);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* ── БЛОК КОНСТРУКЦИЙ И ЗАДАЧ (СЖАТЫЙ РЕЖИМ + ИНДИВИДУАЛЬНЫЙ МОНТАЖ) ── */}
      <div className="bg-slate-50/80 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-orange-500" />
            Конструкции и задачи в заказе ({items.length})
          </span>

          <button
            type="button"
            onClick={handleAddItem}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs shadow-2xs transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Добавить конструкцию</span>
          </button>
        </div>

        {/* Список конструкций с возможностью сворачивания */}
        <div className="space-y-2.5">
          {items.map((item, index) => {
            const isExpanded = expandedItemIds.includes(item.id);
            const stObj = SIGN_TYPES.find((s) => s.id === item.signType);
            const hasDimensions = item.lengthMm || item.heightMm || item.letterHeightMm;
            const mountingHeightObj = MOUNTING_HEIGHTS.find((h) => h.id === item.mountingHeight);
            const facadeTypeObj = FACADE_WALL_TYPES.find((w) => w.id === item.facadeType);

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border transition-all duration-200 shadow-2xs ${
                  isExpanded
                    ? "border-orange-300 ring-2 ring-orange-500/10 overflow-visible"
                    : "border-slate-200/80 hover:border-slate-300 overflow-hidden"
                }`}
              >
                {/* Заголовок конструкции (Сжатый режим / клик для раскрытия) */}
                <div
                  onClick={() => toggleExpandItem(item.id)}
                  className="p-3 sm:p-3.5 flex items-center justify-between gap-3 cursor-pointer select-none bg-slate-50/40 hover:bg-slate-50 transition"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="w-6 h-6 rounded-lg bg-orange-100 text-orange-800 text-xs font-black flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-slate-900 text-xs truncate">
                          {stObj?.label || item.title || `Конструкция #${index + 1}`}
                        </span>

                        {stObj && (
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold shrink-0">
                            {stObj.category}
                          </span>
                        )}
                      </div>

                      {/* Краткая сводка габаритов и монтажа в сжатом виде */}
                      <p className="text-[11px] text-slate-500 font-bold mt-0.5 truncate">
                        {hasDimensions || mountingHeightObj || facadeTypeObj ? (
                          <span>
                            {item.lengthMm ? `${item.lengthMm} мм (Д)` : ""}
                            {item.heightMm ? ` × ${item.heightMm} мм (В)` : ""}
                            {item.letterHeightMm ? ` • Буквы: ${item.letterHeightMm} мм` : ""}
                            {mountingHeightObj ? ` • ${mountingHeightObj.label}` : ""}
                            {facadeTypeObj ? ` • ${facadeTypeObj.label}` : ""}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-normal">Параметры не заполнены</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => handleDeleteItem(item.id, e)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      title="Удалить конструкцию"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="p-1 rounded-lg text-slate-400">
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isExpanded ? "rotate-180 text-orange-600" : ""
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Развернутый вид: форма редактирования конструкции и ее монтажа */}
                {isExpanded && (
                  <div className="p-3.5 sm:p-4 border-t border-slate-100 space-y-4 bg-white animate-in fade-in duration-150">
                    {/* 1. Выбор типа конструкции */}
                    <div className="relative">
                      <label className="block text-[10px] text-slate-500 font-bold mb-1">
                        Тип рекламной конструкции
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          triggerHaptic("light");
                          setOpenDropdownItemId((prev) => (prev === item.id ? null : item.id));
                        }}
                        className="w-full bg-slate-50 border border-slate-200 hover:border-orange-300 rounded-xl px-3 py-2.5 text-base sm:text-xs font-bold text-slate-900 flex items-center justify-between shadow-2xs transition cursor-pointer"
                      >
                        <span className="truncate">
                          {stObj ? stObj.label : "Выберите тип конструкции из каталога..."}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 ml-2 transition-transform duration-200 ${openDropdownItemId === item.id ? "rotate-180" : ""}`} />
                      </button>

                      {/* Выпадающий каталог с автозакрытием */}
                      {openDropdownItemId === item.id && (
                        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl border border-slate-200 shadow-2xl p-2 z-50 max-h-60 overflow-y-auto space-y-1 animate-in fade-in zoom-in-95 duration-150">
                          <div className="px-2 py-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                            Каталог рекламных конструкций
                          </div>
                          {SIGN_TYPES.map((st) => {
                            const isCurrentSelected = item.signType === st.id;
                            return (
                              <button
                                key={st.id}
                                type="button"
                                onClick={() => handleSelectSignType(item.id, st.id)}
                                className={`w-full text-left px-3 py-2.5 rounded-xl text-base sm:text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                                  isCurrentSelected
                                    ? "bg-orange-50 text-orange-950 font-black border border-orange-200"
                                    : "hover:bg-slate-50 text-slate-700"
                                }`}
                              >
                                <span>{st.label}</span>
                                {isCurrentSelected ? (
                                  <Check className="w-4 h-4 text-orange-600 stroke-[3]" />
                                ) : (
                                  <span className="text-[10px] text-slate-400 font-normal">{st.category}</span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* 2. Габариты и размеры в миллиметрах */}
                    <div className="bg-slate-50/60 p-3 rounded-xl border border-slate-200/80 space-y-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Maximize className="w-3 h-3 text-orange-500" />
                        Размеры конструкции (в миллиметрах, мм)
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {/* Длина (мм) */}
                        <div>
                          <label className="block text-[10px] text-slate-500 font-bold mb-1">
                            Длина (мм)
                          </label>
                          <input
                            type="number"
                            inputMode="numeric"
                            value={item.lengthMm ?? ""}
                            onChange={(e) => handleUpdateItemField(item.id, "lengthMm", parseInt(e.target.value, 10) || null)}
                            placeholder="например: 3500"
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-black focus:border-orange-500 outline-none text-base sm:text-xs shadow-2xs transition font-mono min-h-[40px]"
                          />
                        </div>

                        {/* Высота (мм) */}
                        <div>
                          <label className="block text-[10px] text-slate-500 font-bold mb-1">
                            Высота (мм)
                          </label>
                          <input
                            type="number"
                            inputMode="numeric"
                            value={item.heightMm ?? ""}
                            onChange={(e) => handleUpdateItemField(item.id, "heightMm", parseInt(e.target.value, 10) || null)}
                            placeholder="например: 800"
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-black focus:border-orange-500 outline-none text-base sm:text-xs shadow-2xs transition font-mono min-h-[40px]"
                          />
                        </div>

                        {/* Высота букв (мм) */}
                        <div>
                          <label className="block text-[10px] text-slate-500 font-bold mb-1">
                            Высота букв (мм)
                          </label>
                          <input
                            type="number"
                            inputMode="numeric"
                            value={item.letterHeightMm ?? ""}
                            onChange={(e) => handleUpdateItemField(item.id, "letterHeightMm", parseInt(e.target.value, 10) || null)}
                            placeholder="например: 450"
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-black focus:border-orange-500 outline-none text-base sm:text-xs shadow-2xs transition font-mono min-h-[40px]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 3. Монтажные условия этой конструкции */}
                    <div className="bg-slate-50/60 p-3 rounded-xl border border-slate-200/80 space-y-2.5">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Wrench className="w-3 h-3 text-indigo-500" />
                        Монтажные условия для этой конструкции
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[10px] text-slate-500 font-bold mb-1">
                            Высота монтажа от земли
                          </label>
                          <CustomDropdown
                            value={item.mountingHeight || ""}
                            onChange={(val) => handleUpdateItemField(item.id, "mountingHeight", val || null)}
                            options={[
                              { value: "", label: "Не указано" },
                              ...MOUNTING_HEIGHTS.map((h) => ({ value: h.id, label: h.label })),
                            ]}
                            placeholder="Не указано"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-500 font-bold mb-1">
                            Материал фасада / стены
                          </label>
                          <CustomDropdown
                            value={item.facadeType || ""}
                            onChange={(val) => handleUpdateItemField(item.id, "facadeType", val || null)}
                            options={[
                              { value: "", label: "Не указано" },
                              ...FACADE_WALL_TYPES.map((w) => ({ value: w.id, label: w.label })),
                            ]}
                            placeholder="Не указано"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[10px] text-slate-500 font-bold mb-1 flex items-center gap-1">
                            <Zap className="w-3 h-3 text-amber-500" />
                            Питание 220V (подключение)
                          </label>
                          <CustomDropdown
                            value={item.powerSupply || ""}
                            onChange={(val) => handleUpdateItemField(item.id, "powerSupply", val || null)}
                            options={[
                              { value: "", label: "Не указано" },
                              ...POWER_SUPPLY_OPTIONS.map((p) => ({ value: p.id, label: p.label })),
                            ]}
                            placeholder="Не указано"
                            icon={Zap}
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-500 font-bold mb-1 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-500" />
                            Согласование вывески
                          </label>
                          <CustomDropdown
                            value={item.approvalStatus || ""}
                            onChange={(val) => handleUpdateItemField(item.id, "approvalStatus", val || null)}
                            options={[
                              { value: "", label: "Не указано" },
                              ...APPROVAL_STATUSES.map((a) => ({ value: a.id, label: a.label })),
                            ]}
                            placeholder="Не указано"
                            icon={ShieldCheck}
                          />
                        </div>
                      </div>

                      <div className="pt-1">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={Boolean(item.nightMountingOnly)}
                            onChange={(e) => handleUpdateItemField(item.id, "nightMountingOnly", e.target.checked)}
                            className="w-4 h-4 rounded text-orange-600 border-slate-300 focus:ring-orange-500 cursor-pointer"
                          />
                          <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                            <Moon className="w-3.5 h-3.5 text-indigo-600" />
                            Строго ночной монтаж
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* 4. Дополнительное описание задачи / конструкции */}
                    <div>
                      <label className="block text-[10px] text-slate-500 font-bold mb-1">
                        Примечание / тех. особенности по этой конструкции
                      </label>
                      <input
                        type="text"
                        value={item.comment || ""}
                        onChange={(e) => handleUpdateItemField(item.id, "comment", e.target.value || null)}
                        placeholder="например: Лицевое свечение, акрил 3мм, подсветка контурная..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:border-orange-500 outline-none text-base sm:text-xs shadow-2xs transition min-h-[40px]"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
