"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { SupplierData, SupplierPriceItem } from "../_types/pricingTypes";
import { MATERIAL_TAXONOMY, MaterialCategoryItem } from "../_data/pricingDictionary";
import {
  MATERIAL_FACETS,
  INITIAL_FACETS,
  MaterialFacetState,
  FacetOption,
  getApplicableFacetKeys,
  FACET_CONFIG_MAP,
} from "../_data/materialFacets";

export type ViewMode = "table" | "grid";
export type SortOption = "default" | "price_asc" | "price_desc" | "name_asc" | "name_desc";

interface UseMaterialFiltersProps {
  supplierPrices: SupplierPriceItem[];
  suppliers: SupplierData[];
  onQuickUpdatePrice: (id: string, newPrice: number) => Promise<void>;
  taxonomy?: MaterialCategoryItem[];
  getFacetKeys?: (categoryId: string, subcategory: string) => (keyof MaterialFacetState)[];
}

export function useMaterialFilters({
  supplierPrices,
  suppliers,
  onQuickUpdatePrice,
  taxonomy = MATERIAL_TAXONOMY,
  getFacetKeys,
}: UseMaterialFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategoryState] = useState("all");
  const [selectedSupplier, setSelectedSupplier] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [onlyWithPhoto, setOnlyWithPhoto] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [inspectingItem, setInspectingItem] = useState<SupplierPriceItem | null>(null);
  const [facets, setFacets] = useState<MaterialFacetState>(INITIAL_FACETS);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Горячая клавиша ⌘K / Ctrl+K для мгновенного фокуса в поиск
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Список применимых ключей фасетов для текущей категории и подкатегории (Строгая изоляция)
  const applicableFacetKeys = useMemo(() => {
    if (getFacetKeys) {
      return getFacetKeys(selectedCategory, selectedSubcategory);
    }
    return getApplicableFacetKeys(selectedCategory, selectedSubcategory);
  }, [selectedCategory, selectedSubcategory, getFacetKeys]);

  // Проверка активности фильтров только среди применимых ключей
  const hasActiveFacets = useMemo(() => {
    return applicableFacetKeys.some((k) => facets[k] !== "all");
  }, [applicableFacetKeys, facets]);

  const handleFacetChange = (key: keyof MaterialFacetState, value: string) => {
    setFacets((prev) => ({
      ...prev,
      [key]: prev[key] === value ? "all" : value,
    }));
  };

  const handleResetFacets = () => {
    setFacets(INITIAL_FACETS);
  };

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    setSelectedSubcategoryState("all");
    handleResetFacets();
  };

  const setSelectedSubcategory = (subcat: string) => {
    setSelectedSubcategoryState(subcat);
    handleResetFacets();
  };

  // Список уникальных поставщиков
  const uniqueSuppliersFromPrices = useMemo(() => {
    return Array.from(new Set(supplierPrices.map((p) => p.supplier))).filter(Boolean);
  }, [supplierPrices]);

  // Считаем распределение по категориям
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: supplierPrices.length };
    for (const item of supplierPrices) {
      const itemCat = (item.category || "").trim().toLowerCase();
      if (item.isService || itemCat.includes("перезаказ")) {
        counts["services"] = (counts["services"] || 0) + 1;
      }
      for (const cat of taxonomy) {
        if (itemCat === cat.label.toLowerCase()) {
          counts[cat.id] = (counts[cat.id] || 0) + 1;
        }
      }
    }
    return counts;
  }, [supplierPrices, taxonomy]);

  // Считаем распределение по подкатегориям
  const subcategoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const item of supplierPrices) {
      if (item.subcategory) {
        const sub = item.subcategory.trim();
        counts[sub] = (counts[sub] || 0) + 1;
      }
    }
    return counts;
  }, [supplierPrices]);

  // Считаем распределение по поставщикам
  const supplierCounts = useMemo(() => {
    const counts: Record<string, number> = { all: supplierPrices.length };
    for (const item of supplierPrices) {
      if (item.supplier) {
        counts[item.supplier] = (counts[item.supplier] || 0) + 1;
      }
    }
    return counts;
  }, [supplierPrices]);

  // Количество товаров с фото
  const withPhotoCount = useMemo(() => {
    return supplierPrices.filter((p) => Boolean(p.imageUrl && p.imageUrl.trim())).length;
  }, [supplierPrices]);

  // Текущая выбранная категория
  const currentCategoryDef = useMemo(() => {
    return taxonomy.find((c) => c.id === selectedCategory);
  }, [taxonomy, selectedCategory]);

  // Фильтрация и сортировка данных
  const processedPrices = useMemo(() => {
    let result = supplierPrices.filter((item) => {
      // 1. Фильтр "Только с фото"
      if (onlyWithPhoto && (!item.imageUrl || !item.imageUrl.trim())) {
        return false;
      }

      // 2. Живой поиск
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesSupplier = item.supplier.toLowerCase().includes(q);
        const matchesCat = (item.category || "").toLowerCase().includes(q);
        const matchesSubcat = (item.subcategory || "").toLowerCase().includes(q);
        const matchesDesc = (item.description || "").toLowerCase().includes(q);
        if (!matchesName && !matchesSupplier && !matchesCat && !matchesSubcat && !matchesDesc) {
          return false;
        }
      }

      // 3. Поставщик
      if (selectedSupplier !== "all") {
        if (item.supplier.toLowerCase() !== selectedSupplier.toLowerCase()) return false;
      }

      // 4. Категория
      if (selectedCategory !== "all") {
        if (selectedCategory === "services") {
          if (!item.isService && !(item.category || "").toLowerCase().includes("перезаказ")) {
            return false;
          }
        } else {
          const categoryDef = MATERIAL_TAXONOMY.find((c) => c.id === selectedCategory);
          if (categoryDef) {
            const matchesCategory =
              (item.category || "").trim().toLowerCase() === categoryDef.label.toLowerCase();
            const matchesSubcategory = categoryDef.subcategories.some(
              (s) => s.toLowerCase() === (item.subcategory || "").trim().toLowerCase()
            );
            if (!matchesCategory && !matchesSubcategory) {
              return false;
            }
          }
        }
      }

      // 5. Подкатегория
      if (selectedSubcategory !== "all") {
        if (
          (item.subcategory || "").trim().toLowerCase() !== selectedSubcategory.trim().toLowerCase()
        ) {
          return false;
        }
      }

      // 6. Динамические характеристики со строгой изоляцией
      const fullItemText = `${item.name} ${item.description || ""}`;

      for (const facetKey of applicableFacetKeys) {
        const val = facets[facetKey];
        if (val && val !== "all") {
          const options = FACET_CONFIG_MAP[facetKey];
          const matchedOpt = options?.find((o) => o.id === val);
          if (matchedOpt?.match && !matchedOpt.match.test(fullItemText)) {
            return false;
          }
        }
      }

      return true;
    });

    // Сортировка
    if (sortBy === "default") {
      result = [...result].sort((a, b) => {
        const aHasImg = Boolean(a.imageUrl && a.imageUrl.trim());
        const bHasImg = Boolean(b.imageUrl && b.imageUrl.trim());
        if (aHasImg && !bHasImg) return -1;
        if (!aHasImg && bHasImg) return 1;
        return a.name.localeCompare(b.name, "ru");
      });
    } else if (sortBy === "price_asc") {
      result = [...result].sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "price_desc") {
      result = [...result].sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === "name_asc") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name, "ru"));
    } else if (sortBy === "name_desc") {
      result = [...result].sort((a, b) => b.name.localeCompare(a.name, "ru"));
    }

    return result;
  }, [
    supplierPrices,
    searchQuery,
    selectedCategory,
    selectedSubcategory,
    selectedSupplier,
    sortBy,
    onlyWithPhoto,
    facets,
    applicableFacetKeys,
  ]);

  // Инлайн обновление цены с синхронизацией инспектора
  const handleQuickUpdateAndSync = async (id: string, newPrice: number) => {
    await onQuickUpdatePrice(id, newPrice);
    if (inspectingItem && inspectingItem.id === id) {
      setInspectingItem((prev) => (prev ? { ...prev, price: newPrice } : null));
    }
  };

  const handleResetAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedSubcategoryState("all");
    setSelectedSupplier("all");
    setOnlyWithPhoto(false);
    handleResetFacets();
  };

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    handleCategorySelect,
    selectedSubcategory,
    setSelectedSubcategory,
    selectedSupplier,
    setSelectedSupplier,
    sortBy,
    setSortBy,
    onlyWithPhoto,
    setOnlyWithPhoto,
    viewMode,
    setViewMode,
    inspectingItem,
    setInspectingItem,
    facets,
    applicableFacetKeys,
    handleFacetChange,
    handleResetFacets,
    hasActiveFacets,
    handleResetAllFilters,
    handleQuickUpdateAndSync,
    searchInputRef,
    uniqueSuppliersFromPrices,
    categoryCounts,
    subcategoryCounts,
    supplierCounts,
    withPhotoCount,
    currentCategoryDef,
    processedPrices,
  };
}
