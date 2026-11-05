"use client";

import React, { useState } from "react";
import {
  X,
  Sliders,
  Plus,
  Edit2,
  Trash2,
  Check,
  RotateCcw,
  Tag,
  Filter,
  Layers,
  FolderTree,
  AlertCircle,
  Sparkles,
  Search,
  BookOpen,
} from "lucide-react";
import BottomSheet from "@/components/ui/BottomSheet";
import ConfirmDialog from "../common/ConfirmDialog";
import { MaterialCategoryItem } from "../../_data/pricingDictionary";
import {
  MaterialFacetState,
  FACET_LABELS,
  FACET_CONFIG_MAP,
} from "../../_data/materialFacets";
import { SynonymRule } from "../../_data/synonymsDictionary";
import { ZeroResultQuery } from "../../_hooks/useCustomSynonyms";
import { renderCategoryIcon } from "../tabs/materials/MaterialsSidebar";
import { triggerHaptic } from "@/lib/haptics";

interface TaxonomyManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  taxonomy: MaterialCategoryItem[];
  categoryCounts: Record<string, number>;
  subcategoryCounts: Record<string, number>;
  onAddSubcategory: (catId: string, subName: string) => boolean;
  onRenameSubcategory: (catId: string, oldName: string, newName: string) => boolean;
  onDeleteSubcategory: (catId: string, subName: string) => boolean;
  onAddCategory: (cat: MaterialCategoryItem) => boolean;
  onDeleteCategory: (catId: string) => boolean;
  getSubcategoryFacetKeys: (catId: string, subName: string) => (keyof MaterialFacetState)[];
  onUpdateSubcategoryFacets: (
    catId: string,
    subName: string,
    keys: (keyof MaterialFacetState)[]
  ) => void;
  onResetToDefaults: () => void;
  // Умный поиск и обучение синонимам
  synonymRules?: SynonymRule[];
  zeroQueries?: ZeroResultQuery[];
  onAddCustomSynonym?: (target: string, aliases: string[], description?: string) => boolean;
  onDeleteCustomSynonym?: (ruleId: string) => boolean;
  onClearZeroQueries?: () => void;
}

export default function TaxonomyManagerModal({
  isOpen,
  onClose,
  taxonomy,
  categoryCounts,
  subcategoryCounts,
  onAddSubcategory,
  onRenameSubcategory,
  onDeleteSubcategory,
  onAddCategory,
  onDeleteCategory,
  getSubcategoryFacetKeys,
  onUpdateSubcategoryFacets,
  onResetToDefaults,
  synonymRules = [],
  zeroQueries = [],
  onAddCustomSynonym,
  onDeleteCustomSynonym,
  onClearZeroQueries,
}: TaxonomyManagerModalProps) {
  const [selectedCatId, setSelectedCatId] = useState<string>(taxonomy[0]?.id || "sheets");
  const [activeTab, setActiveTab] = useState<"subcategories" | "facets" | "synonyms">("subcategories");

  // Состояния для вкладки обучения синонимам
  const [newSynTarget, setNewSynTarget] = useState("");
  const [newSynAliases, setNewSynAliases] = useState("");
  const [synSearchFilter, setSynSearchFilter] = useState("");

  // Состояния для добавления подкатегории
  const [newSubName, setNewSubName] = useState("");

  // Состояния для редактирования подкатегории (inline rename)
  const [editingSubOldName, setEditingSubOldName] = useState<string | null>(null);
  const [editingSubNewName, setEditingSubNewName] = useState("");

  // Выбранная подкатегория для настройки фильтров
  const [selectedSubForFacets, setSelectedSubForFacets] = useState<string>("");

  // Защита от случайных действий: ConfirmDialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    variant: "danger" | "warning";
  }>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
    variant: "danger",
  });

  const activeCategory = taxonomy.find((c) => c.id === selectedCatId) || taxonomy[0];

  // Синхронизация выбранной подкатегории для фильтров
  React.useEffect(() => {
    if (activeCategory?.subcategories.length > 0) {
      if (!activeCategory.subcategories.includes(selectedSubForFacets)) {
        setSelectedSubForFacets(activeCategory.subcategories[0]);
      }
    } else {
      setSelectedSubForFacets("");
    }
  }, [activeCategory, selectedSubForFacets]);

  const handleAddSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim()) return;
    const ok = onAddSubcategory(selectedCatId, newSubName.trim());
    if (ok) {
      setNewSubName("");
    }
  };

  const handleStartRename = (oldName: string) => {
    triggerHaptic("light");
    setEditingSubOldName(oldName);
    setEditingSubNewName(oldName);
  };

  const handleSaveRename = (oldName: string) => {
    if (!editingSubNewName.trim() || editingSubNewName.trim() === oldName) {
      setEditingSubOldName(null);
      return;
    }
    onRenameSubcategory(selectedCatId, oldName, editingSubNewName.trim());
    setEditingSubOldName(null);
  };

  // Удаление подкатегории с защитой
  const handleRequestDeleteSub = (subName: string) => {
    triggerHaptic("medium");
    const count = subcategoryCounts[subName] ?? 0;
    setConfirmDialog({
      isOpen: true,
      title: "Удалить подкатегорию?",
      description:
        count > 0
          ? `В подкатегории «${subName}» сейчас находится ${count} позиций. Если удалить подкатегорию, эти товары останутся в категории, но потеряют привязку.`
          : `Вы уверены, что хотите удалить подкатегорию «${subName}»?`,
      variant: "danger",
      onConfirm: () => {
        onDeleteSubcategory(selectedCatId, subName);
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Сброс к заводским настройкам с защитой
  const handleRequestResetDefaults = () => {
    triggerHaptic("medium");
    setConfirmDialog({
      isOpen: true,
      title: "Сбросить к заводским настройкам?",
      description:
        "Все созданные вами подкатегории и кастомные фильтры будут возвращены к исходной структуре таксономии по умолчанию.",
      variant: "warning",
      onConfirm: () => {
        onResetToDefaults();
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Список всех доступных ключей характеристик
  const allFacetKeys = React.useMemo(() => {
    return Object.keys(FACET_CONFIG_MAP) as (keyof MaterialFacetState)[];
  }, []);

  // Текущие активные ключи фильтров для выбранной подкатегории
  const currentSubFacets = React.useMemo(() => {
    if (!selectedSubForFacets) return [];
    return getSubcategoryFacetKeys(selectedCatId, selectedSubForFacets);
  }, [selectedCatId, selectedSubForFacets, getSubcategoryFacetKeys]);

  const handleToggleFacet = (facetKey: keyof MaterialFacetState) => {
    triggerHaptic("light");
    if (!selectedSubForFacets) return;

    let nextKeys: (keyof MaterialFacetState)[];
    if (currentSubFacets.includes(facetKey)) {
      nextKeys = currentSubFacets.filter((k) => k !== facetKey);
    } else {
      nextKeys = [...currentSubFacets, facetKey];
    }
    onUpdateSubcategoryFacets(selectedCatId, selectedSubForFacets, nextKeys);
  };

  // Добавление пользовательского правила синонима
  const handleAddSynonymSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSynTarget.trim() || !newSynAliases.trim() || !onAddCustomSynonym) return;

    const aliases = newSynAliases
      .split(/[,;\n]/)
      .map((a) => a.trim())
      .filter(Boolean);

    const ok = onAddCustomSynonym(newSynTarget.trim(), aliases);
    if (ok) {
      setNewSynTarget("");
      setNewSynAliases("");
    }
  };

  // Фильтрация списка синонимов для поиска
  const filteredSynonymRules = React.useMemo(() => {
    if (!synSearchFilter.trim()) return synonymRules;
    const q = synSearchFilter.toLowerCase().trim();
    return synonymRules.filter(
      (r) =>
        r.target.toLowerCase().includes(q) ||
        r.aliases.some((a) => a.toLowerCase().includes(q))
    );
  }, [synonymRules, synSearchFilter]);

  return (
    <>
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        desktopVariant="modal"
        desktopWidth="sm:max-w-4xl lg:max-w-5xl"
        maxHeight="max-h-[92dvh] sm:max-h-[85vh] sm:h-[80vh]"
        className="bg-white"
      >
        <div className="flex flex-col h-full w-full max-w-full overflow-hidden">
          {/* Шапка */}
          <div className="p-4 sm:px-6 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-white/95 backdrop-blur-md sticky top-0 z-20 shrink-0 w-full">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-orange-400 flex items-center justify-center shrink-0">
                <Sliders className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight truncate">
                  Центр управления каталогом и фильтрами
                </h3>
                <p className="text-[11px] text-slate-400 font-semibold truncate">
                  Настройка категорий, подкатегорий и характеристик сайдбара
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-400 bg-slate-100 rounded border border-slate-200">
                Esc
              </kbd>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer shrink-0"
                title="Закрыть (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Двухколоночный интерфейс управления */}
          <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-[260px_1fr] overflow-hidden">
            {/* Левая колонка: Список категорий */}
            <div className="p-3 sm:p-4 border-r border-slate-100 bg-slate-50/70 overflow-y-auto space-y-1.5 flex flex-col justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2 block mb-1">
                  Категории ({taxonomy.length})
                </span>

                {taxonomy.map((cat) => {
                  const isSelected = selectedCatId === cat.id;
                  const count = categoryCounts[cat.id] ?? 0;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        triggerHaptic("light");
                        setSelectedCatId(cat.id);
                      }}
                      className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-2xl text-xs font-bold transition text-left cursor-pointer ${
                        isSelected
                          ? "bg-slate-900 text-white font-extrabold shadow-sm"
                          : "text-slate-700 hover:bg-slate-200/60 hover:text-slate-900"
                      }`}
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        {renderCategoryIcon(
                          cat.iconType,
                          `w-4 h-4 shrink-0 transition ${
                            isSelected ? "text-orange-400" : "text-slate-400"
                          }`
                        )}
                        <span className="truncate leading-tight">{cat.label}</span>
                      </span>
                      <span
                        className={`px-1.5 py-0.2 rounded-full text-[10px] font-black shrink-0 ${
                          isSelected ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Кнопка сброса */}
              <div className="pt-3 border-t border-slate-200/60 mt-3">
                <button
                  type="button"
                  onClick={handleRequestResetDefaults}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                  title="Вернуть изначальную структуру"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Сбросить к заводским</span>
                </button>
              </div>
            </div>

            {/* Правая колонка: Детали категории, управление подкатегориями и фильтрами */}
            <div className="flex-1 min-h-0 flex flex-col overflow-hidden bg-white">
              {/* Верхняя плашка активной категории и переключатель табов */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap bg-white">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                    {renderCategoryIcon(activeCategory?.iconType || "layers", "w-4 h-4")}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 leading-tight">
                      {activeCategory?.label}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-semibold">
                      {activeCategory?.subcategories.length} подкатегорий • Всего{" "}
                      {categoryCounts[activeCategory?.id] ?? 0} товаров
                    </p>
                  </div>
                </div>

                {/* Табы */}
                <div className="flex items-center p-1 rounded-xl bg-slate-100 flex-wrap gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic("light");
                      setActiveTab("subcategories");
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      activeTab === "subcategories"
                        ? "bg-white text-slate-900 shadow-2xs font-extrabold"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <FolderTree className="w-3.5 h-3.5" />
                    <span>Подкатегории</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic("light");
                      setActiveTab("facets");
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      activeTab === "facets"
                        ? "bg-white text-slate-900 shadow-2xs font-extrabold"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <Filter className="w-3.5 h-3.5" />
                    <span>Фильтры</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic("light");
                      setActiveTab("synonyms");
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer relative ${
                      activeTab === "synonyms"
                        ? "bg-white text-slate-900 shadow-2xs font-extrabold"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                    <span>Синонимы и сленг</span>
                    {zeroQueries.length > 0 && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" title="Есть запросы без результатов" />
                    )}
                  </button>
                </div>
              </div>

              {/* Содержимое вкладки 1: Подкатегории */}
              {activeTab === "subcategories" && (
                <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                  {/* Форма добавления подкатегории */}
                  <form onSubmit={handleAddSub} className="flex gap-2">
                    <input
                      type="text"
                      value={newSubName}
                      onChange={(e) => setNewSubName(e.target.value)}
                      placeholder={`Новая подкатегория в «${activeCategory?.label}»...`}
                      className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white focus:border-orange-500 outline-none transition"
                    />
                    <button
                      type="submit"
                      disabled={!newSubName.trim()}
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-black transition cursor-pointer active:scale-98 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Добавить</span>
                    </button>
                  </form>

                  {/* Список подкатегорий */}
                  <div className="space-y-1.5">
                    {activeCategory?.subcategories.map((sub) => {
                      const count = subcategoryCounts[sub] ?? 0;
                      const isEditing = editingSubOldName === sub;

                      return (
                        <div
                          key={sub}
                          className="flex items-center justify-between gap-3 p-2.5 rounded-2xl border border-slate-200/80 bg-white hover:border-slate-300 transition"
                        >
                          {isEditing ? (
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <input
                                type="text"
                                autoFocus
                                value={editingSubNewName}
                                onChange={(e) => setEditingSubNewName(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleSaveRename(sub);
                                  if (e.key === "Escape") setEditingSubOldName(null);
                                }}
                                className="flex-1 px-2.5 py-1 rounded-lg border border-orange-400 bg-white text-xs font-bold text-slate-900 outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => handleSaveRename(sub)}
                                className="p-1 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition cursor-pointer"
                                title="Сохранить"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingSubOldName(null)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                                title="Отмена"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                                <span className="text-xs font-bold text-slate-800 leading-snug break-words">
                                  {sub}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <span
                                  className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-600"
                                  title={`Количество позиций в базе: ${count}`}
                                >
                                  {count} поз.
                                </span>

                                <button
                                  type="button"
                                  onClick={() => handleStartRename(sub)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                                  title="Переименовать подкатегорию"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleRequestDeleteSub(sub)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                  title="Удалить подкатегорию"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Содержимое вкладки 2: Настройка фильтров */}
              {activeTab === "facets" && (
                <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                  {/* Выбор подкатегории для настройки */}
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                      Выберите подкатегорию для настройки фильтров:
                    </label>
                    <select
                      value={selectedSubForFacets}
                      onChange={(e) => {
                        triggerHaptic("light");
                        setSelectedSubForFacets(e.target.value);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white focus:border-orange-500 outline-none cursor-pointer"
                    >
                      {activeCategory?.subcategories.map((s) => (
                        <option key={s} value={s}>
                          {s} ({subcategoryCounts[s] ?? 0} товаров)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Активные фильтры */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                        Активные фильтры в сайдбаре:
                      </span>
                      <span className="text-[10px] font-extrabold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-md">
                        {currentSubFacets.length} активно
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {allFacetKeys.map((key) => {
                        const isEnabled = currentSubFacets.includes(key);
                        const label = FACET_LABELS[key] || key;
                        const optionsCount = FACET_CONFIG_MAP[key]?.length || 0;

                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => handleToggleFacet(key)}
                            className={`flex items-center justify-between p-2.5 rounded-xl border text-xs text-left transition cursor-pointer active:scale-98 ${
                              isEnabled
                                ? "bg-orange-50 border-orange-200 text-orange-950 font-bold"
                                : "bg-slate-50/70 border-slate-200/80 text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            <div className="min-w-0 pr-2">
                              <p className="leading-snug break-words">{label}</p>
                              <p className="text-[10px] text-slate-400 font-medium">
                                {optionsCount} знач.
                              </p>
                            </div>

                            <div
                              className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition ${
                                isEnabled
                                  ? "bg-orange-500 border-orange-500 text-white"
                                  : "border-slate-300 bg-white"
                              }`}
                            >
                              {isEnabled && <Check className="w-3.5 h-3.5" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Содержимое вкладки 3: Умный поиск и обучение синонимам */}
              {activeTab === "synonyms" && (
                <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                  {/* Блок быстрого обучения (добавления синонима) */}
                  <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/90 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-black text-slate-900">
                        <Sparkles className="w-4 h-4 text-orange-500" />
                        <span>Добавить новое сокращение или сленг</span>
                      </div>
                      <span className="text-[10px] text-orange-700 font-extrabold bg-orange-100 px-2 py-0.5 rounded-full">
                        Обучение поиска
                      </span>
                    </div>

                    <form onSubmit={handleAddSynonymSubmit} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-black text-slate-600 uppercase mb-1">
                            Что вводят менеджеры (через запятую)
                          </label>
                          <input
                            type="text"
                            required
                            value={newSynAliases}
                            onChange={(e) => setNewSynAliases(e.target.value)}
                            placeholder="Напр. плекс, стекло, оргстекло"
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:border-orange-500 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-black text-slate-600 uppercase mb-1">
                            К какому слову в каталоге привязать
                          </label>
                          <input
                            type="text"
                            required
                            value={newSynTarget}
                            onChange={(e) => setNewSynTarget(e.target.value)}
                            placeholder="Напр. акрил"
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:border-orange-500 outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          type="submit"
                          disabled={!newSynAliases.trim() || !newSynTarget.trim()}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-extrabold text-xs transition active:scale-95 cursor-pointer shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Обучить поиск этому правилу</span>
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Блок: Что искали менеджеры и не нашли (Zero-Result) */}
                  {zeroQueries.length > 0 && (
                    <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-600" />
                          <h5 className="text-xs font-black text-amber-950">
                            Что искали менеджеры и не нашли ({zeroQueries.length})
                          </h5>
                        </div>

                        {onClearZeroQueries && (
                          <button
                            type="button"
                            onClick={onClearZeroQueries}
                            className="text-[10px] font-bold text-amber-700 hover:underline cursor-pointer"
                          >
                            Очистить журнал
                          </button>
                        )}
                      </div>

                      <p className="text-[11px] text-amber-850 leading-relaxed font-medium">
                        По этим фразам каталог вернул 0 результатов. Кликните «Обучить», чтобы привязать фразу:
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {zeroQueries.map((zq) => (
                          <div
                            key={zq.query}
                            className="inline-flex items-center gap-2 pl-3 pr-1.5 py-1 rounded-xl bg-white border border-amber-200 shadow-2xs text-xs font-bold text-slate-800"
                          >
                            <span>«{zq.query}»</span>
                            {zq.count > 1 && (
                              <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-700 text-[10px] font-black">
                                {zq.count}x
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                setNewSynAliases(zq.query);
                                setNewSynTarget("");
                                triggerHaptic("light");
                              }}
                              className="px-2 py-0.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-black cursor-pointer transition active:scale-95"
                            >
                              Обучить
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Список всех активных правил поиска */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <h5 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                        База синонимов и сленга ({filteredSynonymRules.length})
                      </h5>

                      <div className="relative">
                        <input
                          type="text"
                          value={synSearchFilter}
                          onChange={(e) => setSynSearchFilter(e.target.value)}
                          placeholder="Поиск по правилам..."
                          className="pl-7 pr-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white outline-none"
                        />
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {filteredSynonymRules.map((rule) => (
                        <div
                          key={rule.id}
                          className="p-3 rounded-2xl border border-slate-200/90 bg-white hover:border-slate-300 transition space-y-1.5 shadow-2xs"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-black text-slate-900 capitalize">
                                {rule.target}
                              </span>
                              <span
                                className={`text-[9px] font-black px-1.5 py-0.2 rounded-md ${
                                  rule.isBuiltIn
                                    ? "bg-slate-100 text-slate-500"
                                    : "bg-emerald-100 text-emerald-700"
                                }`}
                              >
                                {rule.isBuiltIn ? "Системный" : "Ваш"}
                              </span>
                            </div>

                            {!rule.isBuiltIn && onDeleteCustomSynonym && (
                              <button
                                type="button"
                                onClick={() => onDeleteCustomSynonym(rule.id)}
                                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                title="Удалить это правило"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-1 pt-0.5">
                            {rule.aliases.map((alias) => (
                              <span
                                key={alias}
                                className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold"
                              >
                                {alias}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Фиксированный подвал */}
          <div className="p-3 sm:px-6 sm:py-3.5 border-t border-slate-100 bg-white/95 backdrop-blur-md flex items-center justify-between shrink-0">
            <div className="text-[11px] text-slate-400 font-medium">
              Все изменения сохраняются автоматически
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition active:scale-95 cursor-pointer shadow-xs"
            >
              Закрыть
            </button>
          </div>
        </div>
      </BottomSheet>

      {/* Защита от случайных действий: Кастомный модальный алерт подтверждения */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        description={confirmDialog.description}
        variant={confirmDialog.variant}
        confirmLabel="Да, удалить"
        cancelLabel="Отмена"
      />
    </>
  );
}
