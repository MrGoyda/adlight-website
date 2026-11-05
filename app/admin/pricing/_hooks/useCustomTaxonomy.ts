"use client";

import { useState, useEffect, useCallback } from "react";
import { MATERIAL_TAXONOMY, MaterialCategoryItem } from "../_data/pricingDictionary";
import { MaterialFacetState, getApplicableFacetKeys } from "../_data/materialFacets";
import { triggerHaptic } from "@/lib/haptics";

const TAXONOMY_STORAGE_KEY = "adlight_custom_taxonomy_v3";
const FACETS_STORAGE_KEY = "adlight_custom_facets_v3";

export function useCustomTaxonomy() {
  const [taxonomy, setTaxonomy] = useState<MaterialCategoryItem[]>(MATERIAL_TAXONOMY);
  const [facetOverrides, setFacetOverrides] = useState<Record<string, (keyof MaterialFacetState)[]>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Загрузка пользовательских настроек из localStorage при монтировании
  useEffect(() => {
    try {
      const savedTaxonomy = localStorage.getItem(TAXONOMY_STORAGE_KEY);
      if (savedTaxonomy) {
        const parsed = JSON.parse(savedTaxonomy);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTaxonomy(parsed);
        }
      }

      const savedFacets = localStorage.getItem(FACETS_STORAGE_KEY);
      if (savedFacets) {
        const parsed = JSON.parse(savedFacets);
        if (parsed && typeof parsed === "object") {
          setFacetOverrides(parsed);
        }
      }
    } catch (e) {
      console.warn("[Taxonomy] Ошибка чтения из localStorage:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Сохранение таксономии в localStorage
  const saveTaxonomy = useCallback((newTax: MaterialCategoryItem[]) => {
    setTaxonomy(newTax);
    try {
      localStorage.setItem(TAXONOMY_STORAGE_KEY, JSON.stringify(newTax));
    } catch (e) {
      console.error("[Taxonomy] Ошибка сохранения таксономии:", e);
    }
  }, []);

  // Сохранение переопределений фильтров в localStorage
  const saveFacetOverrides = useCallback((newOverrides: Record<string, (keyof MaterialFacetState)[]>) => {
    setFacetOverrides(newOverrides);
    try {
      localStorage.setItem(FACETS_STORAGE_KEY, JSON.stringify(newOverrides));
    } catch (e) {
      console.error("[Taxonomy] Ошибка сохранения фильтров:", e);
    }
  }, []);

  // 2. Добавление новой подкатегории
  const addSubcategory = useCallback(
    (categoryId: string, subName: string) => {
      const trimmed = subName.trim();
      if (!trimmed) return false;

      const updated = taxonomy.map((cat) => {
        if (cat.id === categoryId) {
          if (cat.subcategories.includes(trimmed)) return cat;
          return {
            ...cat,
            subcategories: [...cat.subcategories, trimmed],
          };
        }
        return cat;
      });

      saveTaxonomy(updated);
      triggerHaptic("medium");
      return true;
    },
    [taxonomy, saveTaxonomy]
  );

  // 3. Переименование подкатегории
  const renameSubcategory = useCallback(
    (categoryId: string, oldName: string, newName: string) => {
      const trimmed = newName.trim();
      if (!trimmed || trimmed === oldName) return false;

      const updated = taxonomy.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            subcategories: cat.subcategories.map((s) => (s === oldName ? trimmed : s)),
          };
        }
        return cat;
      });

      // Переносим настройки фильтров, если они были
      const oldKey = `${categoryId}::${oldName}`;
      const newKey = `${categoryId}::${trimmed}`;
      if (facetOverrides[oldKey]) {
        const nextOverrides = { ...facetOverrides, [newKey]: facetOverrides[oldKey] };
        delete nextOverrides[oldKey];
        saveFacetOverrides(nextOverrides);
      }

      saveTaxonomy(updated);
      triggerHaptic("medium");
      return true;
    },
    [taxonomy, facetOverrides, saveTaxonomy, saveFacetOverrides]
  );

  // 4. Удаление подкатегории
  const deleteSubcategory = useCallback(
    (categoryId: string, subName: string) => {
      const updated = taxonomy.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            subcategories: cat.subcategories.filter((s) => s !== subName),
          };
        }
        return cat;
      });

      const key = `${categoryId}::${subName}`;
      if (facetOverrides[key]) {
        const nextOverrides = { ...facetOverrides };
        delete nextOverrides[key];
        saveFacetOverrides(nextOverrides);
      }

      saveTaxonomy(updated);
      triggerHaptic("error");
      return true;
    },
    [taxonomy, facetOverrides, saveTaxonomy, saveFacetOverrides]
  );

  // 5. Добавление новой категории
  const addCategory = useCallback(
    (catItem: MaterialCategoryItem) => {
      if (taxonomy.some((c) => c.id === catItem.id || c.label.toLowerCase() === catItem.label.toLowerCase())) {
        return false;
      }
      const updated = [...taxonomy, catItem];
      saveTaxonomy(updated);
      triggerHaptic("medium");
      return true;
    },
    [taxonomy, saveTaxonomy]
  );

  // 6. Удаление категории
  const deleteCategory = useCallback(
    (categoryId: string) => {
      const updated = taxonomy.filter((c) => c.id !== categoryId);
      saveTaxonomy(updated);
      triggerHaptic("error");
      return true;
    },
    [taxonomy, saveTaxonomy]
  );

  // 7. Получение применимых фильтров (с учетом кастомных переопределений)
  const getSubcategoryFacetKeys = useCallback(
    (categoryId: string, subcategory: string): (keyof MaterialFacetState)[] => {
      const overrideKey = `${categoryId}::${subcategory}`;
      if (facetOverrides[overrideKey]) {
        return facetOverrides[overrideKey];
      }
      return getApplicableFacetKeys(categoryId, subcategory);
    },
    [facetOverrides]
  );

  // 8. Настройка фильтров для подкатегории
  const updateSubcategoryFacets = useCallback(
    (categoryId: string, subcategory: string, keys: (keyof MaterialFacetState)[]) => {
      const overrideKey = `${categoryId}::${subcategory}`;
      const nextOverrides = {
        ...facetOverrides,
        [overrideKey]: keys,
      };
      saveFacetOverrides(nextOverrides);
      triggerHaptic("medium");
    },
    [facetOverrides, saveFacetOverrides]
  );

  // 9. Сброс к заводским настройкам
  const resetToDefaults = useCallback(() => {
    try {
      localStorage.removeItem(TAXONOMY_STORAGE_KEY);
      localStorage.removeItem(FACETS_STORAGE_KEY);
    } catch {}
    setTaxonomy(MATERIAL_TAXONOMY);
    setFacetOverrides({});
    triggerHaptic("warning");
  }, []);

  return {
    taxonomy,
    isLoaded,
    addSubcategory,
    renameSubcategory,
    deleteSubcategory,
    addCategory,
    deleteCategory,
    getSubcategoryFacetKeys,
    updateSubcategoryFacets,
    resetToDefaults,
  };
}
