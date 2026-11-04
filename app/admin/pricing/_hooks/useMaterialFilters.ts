"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { SupplierData, SupplierPriceItem } from "../_types/pricingTypes";
import { MATERIAL_TAXONOMY } from "../_data/pricingDictionary";
import {
  MATERIAL_FACETS,
  INITIAL_FACETS,
  MaterialFacetState,
} from "../_data/materialFacets";

export type ViewMode = "table" | "grid";
export type SortOption = "default" | "price_asc" | "price_desc" | "name_asc" | "name_desc";

interface UseMaterialFiltersProps {
  supplierPrices: SupplierPriceItem[];
  suppliers: SupplierData[];
  onQuickUpdatePrice: (id: string, newPrice: number) => Promise<void>;
}

export function useMaterialFilters({
  supplierPrices,
  suppliers,
  onQuickUpdatePrice,
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

  // Проверка активности фильтров характеристик
  const hasActiveFacets = useMemo(() => {
    return (
      facets.thickness !== "all" ||
      facets.color !== "all" ||
      facets.sheetSize !== "all" ||
      facets.pvcDensity !== "all" ||
      facets.compositeSkin !== "all" ||
      facets.vinylSurface !== "all" ||
      facets.bannerDensity !== "all" ||
      facets.voltage !== "all" ||
      facets.glowColor !== "all" ||
      facets.wattage !== "all" ||
      facets.lensCount !== "all" ||
      facets.ipRating !== "all" ||
      facets.housingType !== "all" ||
      facets.deliveryFormat !== "all"
    );
  }, [facets]);

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
      for (const cat of MATERIAL_TAXONOMY) {
        if (itemCat === cat.label.toLowerCase()) {
          counts[cat.id] = (counts[cat.id] || 0) + 1;
        }
      }
    }
    return counts;
  }, [supplierPrices]);

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
    return MATERIAL_TAXONOMY.find((c) => c.id === selectedCategory);
  }, [selectedCategory]);

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

      // 6. Динамические характеристики (Smart Contextual Facets)
      const fullItemText = `${item.name} ${item.description || ""}`;

      // 6.1 Листовые
      if (facets.thickness !== "all") {
        const tOpt = MATERIAL_FACETS.thicknesses.find((t) => t.id === facets.thickness);
        if (tOpt?.match && !tOpt.match.test(fullItemText)) return false;
      }

      if (facets.color !== "all") {
        const cOpt = MATERIAL_FACETS.colors.find((c) => c.id === facets.color);
        if (cOpt?.match && !cOpt.match.test(fullItemText)) return false;
      }

      if (facets.sheetSize !== "all") {
        const sOpt = MATERIAL_FACETS.sheetSizes.find((s) => s.id === facets.sheetSize);
        if (sOpt?.match && !sOpt.match.test(fullItemText)) return false;
      }

      if (facets.pvcDensity !== "all") {
        const pOpt = MATERIAL_FACETS.pvcDensities.find((p) => p.id === facets.pvcDensity);
        if (pOpt?.match && !pOpt.match.test(fullItemText)) return false;
      }

      if (facets.compositeSkin !== "all") {
        const csOpt = MATERIAL_FACETS.compositeSkins.find((cs) => cs.id === facets.compositeSkin);
        if (csOpt?.match && !csOpt.match.test(fullItemText)) return false;
      }

      // 6.2 Пленки и баннеры
      if (facets.vinylSurface !== "all") {
        const vOpt = MATERIAL_FACETS.vinylSurfaces.find((v) => v.id === facets.vinylSurface);
        if (vOpt?.match && !vOpt.match.test(fullItemText)) return false;
      }

      if (facets.bannerDensity !== "all") {
        const bOpt = MATERIAL_FACETS.bannerDensities.find((b) => b.id === facets.bannerDensity);
        if (bOpt?.match && !bOpt.match.test(fullItemText)) return false;
      }

      // 6.3 Светотехника и электрика
      if (facets.glowColor !== "all") {
        const glowOpt = MATERIAL_FACETS.glowColors.find((g) => g.id === facets.glowColor);
        if (glowOpt?.match && !glowOpt.match.test(fullItemText)) return false;
      }

      if (facets.voltage !== "all") {
        const voltOpt = MATERIAL_FACETS.voltages.find((v) => v.id === facets.voltage);
        if (voltOpt?.match && !voltOpt.match.test(fullItemText)) return false;
      }

      if (facets.wattage !== "all") {
        const wOpt = MATERIAL_FACETS.wattages.find((w) => w.id === facets.wattage);
        if (wOpt?.match && !wOpt.match.test(fullItemText)) return false;
      }

      if (facets.lensCount !== "all") {
        const lcOpt = MATERIAL_FACETS.lensCounts.find((lc) => lc.id === facets.lensCount);
        if (lcOpt?.match && !lcOpt.match.test(fullItemText)) return false;
      }

      if (facets.ipRating !== "all") {
        const ipOpt = MATERIAL_FACETS.ipRatings.find((ip) => ip.id === facets.ipRating);
        if (ipOpt?.match && !ipOpt.match.test(fullItemText)) return false;
      }

      if (facets.housingType !== "all") {
        const htOpt = MATERIAL_FACETS.housingTypes.find((ht) => ht.id === facets.housingType);
        if (htOpt?.match && !htOpt.match.test(fullItemText)) return false;
      }

      if (facets.deliveryFormat !== "all") {
        const dfOpt = MATERIAL_FACETS.deliveryFormats.find((df) => df.id === facets.deliveryFormat);
        if (dfOpt?.match && !dfOpt.match.test(fullItemText)) return false;
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
