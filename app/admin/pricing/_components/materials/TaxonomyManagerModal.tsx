"use client";

import React, { useState, useEffect, useMemo } from "react";
import { X, Sliders, FolderTree, Filter, Sparkles } from "lucide-react";
import BottomSheet from "@/components/ui/BottomSheet";
import ConfirmDialog from "../common/ConfirmDialog";
import { MaterialCategoryItem } from "../../_data/pricingDictionary";
import { MaterialFacetState, FACET_CONFIG_MAP } from "../../_data/materialFacets";
import { SynonymRule } from "../../_data/synonymsDictionary";
import { ZeroResultQuery } from "../../_hooks/useCustomSynonyms";
import { renderCategoryIcon } from "../tabs/materials/MaterialsSidebar";
import { triggerHaptic } from "@/lib/haptics";
import { pricingDict } from "@/dictionaries/pricing";

import TaxonomyCategorySidebar from "./taxonomy/TaxonomyCategorySidebar";
import TaxonomySubcategoriesPane from "./taxonomy/TaxonomySubcategoriesPane";
import TaxonomyFacetsPane from "./taxonomy/TaxonomyFacetsPane";
import TaxonomySynonymsPane from "./taxonomy/TaxonomySynonymsPane";

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
  const [selectedSubForFacets, setSelectedSubForFacets] = useState<string>("");
  const t = pricingDict.modals.taxonomy;

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

  useEffect(() => {
    if (activeCategory?.subcategories.length > 0) {
      if (!activeCategory.subcategories.includes(selectedSubForFacets)) {
        setSelectedSubForFacets(activeCategory.subcategories[0]);
      }
    } else {
      setSelectedSubForFacets("");
    }
  }, [activeCategory, selectedSubForFacets]);

  const handleRequestDeleteSub = (subName: string) => {
    triggerHaptic("medium");
    const count = subcategoryCounts[subName] ?? 0;
    setConfirmDialog({
      isOpen: true,
      title: t.confirm.deleteSubTitle,
      description:
        count > 0
          ? t.confirm.deleteSubDescriptionWithCount(subName, count)
          : t.confirm.deleteSubDescription(subName),
      variant: "danger",
      onConfirm: () => {
        onDeleteSubcategory(selectedCatId, subName);
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleRequestResetDefaults = () => {
    triggerHaptic("medium");
    setConfirmDialog({
      isOpen: true,
      title: t.confirm.resetTitle,
      description: t.confirm.resetDescription,
      variant: "warning",
      onConfirm: () => {
        onResetToDefaults();
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const allFacetKeys = useMemo(() => {
    return Object.keys(FACET_CONFIG_MAP) as (keyof MaterialFacetState)[];
  }, []);

  const currentSubFacets = useMemo(() => {
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
          <div className="p-4 sm:px-6 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-20 shrink-0 w-full">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-orange-400 flex items-center justify-center shrink-0">
                <Sliders className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight truncate">
                  {t.title}
                </h3>
                <p className="text-[11px] text-slate-400 font-semibold truncate">
                  {t.subtitle}
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
            {/* Левая колонка: Категории */}
            <TaxonomyCategorySidebar
              taxonomy={taxonomy}
              selectedCatId={selectedCatId}
              categoryCounts={categoryCounts}
              onSelectCategory={setSelectedCatId}
              onRequestResetDefaults={handleRequestResetDefaults}
            />

            {/* Правая колонка: Детали категории, управление подкатегориями и фильтрами */}
            <div className="flex-1 min-h-0 flex flex-col overflow-hidden bg-white">
              {/* Верхняя плашка активной категории и табы */}
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
                    <span>{t.tabs.subcategories}</span>
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
                    <span>{t.tabs.facets}</span>
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
                    <span>{t.tabs.synonyms}</span>
                    {zeroQueries.length > 0 && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" title="Есть запросы без результатов" />
                    )}
                  </button>
                </div>
              </div>

              {/* Таб 1: Подкатегории */}
              {activeTab === "subcategories" && (
                <TaxonomySubcategoriesPane
                  activeCategory={activeCategory}
                  subcategoryCounts={subcategoryCounts}
                  onAddSubcategory={onAddSubcategory}
                  onRenameSubcategory={onRenameSubcategory}
                  onRequestDeleteSubcategory={handleRequestDeleteSub}
                />
              )}

              {/* Таб 2: Настройка фильтров */}
              {activeTab === "facets" && (
                <TaxonomyFacetsPane
                  activeCategory={activeCategory}
                  subcategoryCounts={subcategoryCounts}
                  selectedSubForFacets={selectedSubForFacets}
                  onSelectSubForFacets={setSelectedSubForFacets}
                  currentSubFacets={currentSubFacets}
                  onToggleFacet={handleToggleFacet}
                  allFacetKeys={allFacetKeys}
                />
              )}

              {/* Таб 3: Умный поиск и обучение синонимам */}
              {activeTab === "synonyms" && (
                <TaxonomySynonymsPane
                  synonymRules={synonymRules}
                  zeroQueries={zeroQueries}
                  onAddCustomSynonym={onAddCustomSynonym}
                  onDeleteCustomSynonym={onDeleteCustomSynonym}
                  onClearZeroQueries={onClearZeroQueries}
                />
              )}
            </div>
          </div>

          {/* Фиксированный подвал */}
          <div className="p-3 sm:px-6 sm:py-3.5 border-t border-slate-100 bg-white flex items-center justify-between shrink-0">
            <div className="text-[11px] text-slate-400 font-medium">
              {t.footer.autoSave}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition active:scale-95 cursor-pointer shadow-xs"
            >
              {t.footer.close}
            </button>
          </div>
        </div>
      </BottomSheet>

      {/* Защита от случайных действий: Кастомный модальный диалог подтверждения */}
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
