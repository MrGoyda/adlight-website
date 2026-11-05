"use client";

import { useState, useMemo, useEffect, useRef, useCallback, useDeferredValue } from "react";
import { SupplierData, SupplierPriceItem } from "../_types/pricingTypes";
import { MATERIAL_TAXONOMY, MaterialCategoryItem } from "../_data/pricingDictionary";
import { BUILT_IN_SYNONYM_RULES } from "../_data/synonymsDictionary";
import {
  prepareSearchQuery,
  calculatePreparedRelevance,
  buildSynonymLookup,
} from "../_lib/smartSearch";
import {
  INITIAL_FACETS,
  MaterialFacetState,
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
  synonymMap?: Map<string, string[]>;
  onZeroResultQuery?: (q: string) => void;
}

/**
 * Интеллектуальное сопоставление категории товара с категорией таксономии
 */
export function isItemInCategory(
  item: SupplierPriceItem,
  catId: string,
  taxonomy: MaterialCategoryItem[]
): boolean {
  if (catId === "all") return true;

  const itemCat = (item.category || "").trim().toLowerCase();
  const itemSub = (item.subcategory || "").trim().toLowerCase();

  if (catId === "services") {
    return Boolean(
      item.isService ||
        itemCat.includes("перезаказ") ||
        itemSub.includes("перезаказ") ||
        itemCat.includes("услуг")
    );
  }

  const categoryDef = taxonomy.find((c) => c.id === catId);
  if (!categoryDef) return false;

  const catLabel = categoryDef.label.toLowerCase();

  // 1. Прямое совпадение по имени категории
  if (itemCat === catLabel || itemCat.includes(catLabel) || catLabel.includes(itemCat)) {
    return true;
  }

  // 2. Семантические синонимы по ключу категории
  if (catId === "sheets") {
    if (
      itemCat.includes("лист") ||
      itemSub.includes("пвх") ||
      itemSub.includes("акрил") ||
      itemSub.includes("оргстекл") ||
      itemSub.includes("композит") ||
      itemSub.includes("акп") ||
      itemSub.includes("пэт") ||
      itemSub.includes("ромарк") ||
      itemSub.includes("abs") ||
      itemSub.includes("поликарбонат") ||
      itemSub.includes("полистирол")
    ) {
      return true;
    }
  }

  if (catId === "lighting") {
    if (
      itemCat.includes("свет") ||
      itemCat.includes("электр") ||
      itemCat.includes("блок") ||
      itemCat.includes("трансформатор") ||
      itemSub.includes("модул") ||
      itemSub.includes("лент") ||
      itemSub.includes("неон") ||
      itemSub.includes("трансформатор") ||
      itemSub.includes("блок") ||
      itemSub.includes("драйвер") ||
      itemSub.includes("прожектор") ||
      itemSub.includes("ламп") ||
      itemSub.includes("контроллер") ||
      itemSub.includes("провод") ||
      itemSub.includes("кабел")
    ) {
      return true;
    }
  }

  if (catId === "vinyl") {
    if (
      itemCat.includes("пленк") ||
      itemCat.includes("баннер") ||
      itemCat.includes("рулон") ||
      itemCat.includes("винил") ||
      itemSub.includes("пленк") ||
      itemSub.includes("баннер") ||
      itemSub.includes("винил") ||
      itemSub.includes("бэклит") ||
      itemSub.includes("холст") ||
      itemSub.includes("ламина") ||
      itemSub.includes("флекс") ||
      itemSub.includes("v-mark")
    ) {
      return true;
    }
  }

  if (catId === "profiles") {
    if (
      itemCat.includes("профил") ||
      itemCat.includes("металл") ||
      itemSub.includes("профил") ||
      itemSub.includes("труб") ||
      itemSub.includes("багет") ||
      itemSub.includes("кайма")
    ) {
      return true;
    }
  }

  if (catId === "hardware") {
    if (
      itemCat.includes("клей") ||
      itemCat.includes("скотч") ||
      itemCat.includes("крепеж") ||
      itemCat.includes("химия") ||
      itemCat.includes("краск") ||
      itemCat.includes("чернил") ||
      itemCat.includes("инструмент") ||
      itemCat.includes("станок") ||
      itemCat.includes("фрез") ||
      itemSub.includes("клей") ||
      itemSub.includes("скотч") ||
      itemSub.includes("люверс") ||
      itemSub.includes("держател") ||
      itemSub.includes("метиз") ||
      itemSub.includes("фрез") ||
      itemSub.includes("сверл") ||
      itemSub.includes("ракел") ||
      itemSub.includes("резак") ||
      itemSub.includes("краск")
    ) {
      return true;
    }
  }

  // 3. Совпадение по списку подкатегорий
  return categoryDef.subcategories.some((s) => {
    const sLower = s.toLowerCase();
    return itemSub === sLower || itemSub.includes(sLower) || sLower.includes(itemSub);
  });
}

/**
 * Интеллектуальное сопоставление подкатегории товара
 */
export function isItemInSubcategory(item: SupplierPriceItem, selectedSubcategory: string): boolean {
  if (selectedSubcategory === "all") return true;

  const itemSub = (item.subcategory || "").trim().toLowerCase();
  const target = selectedSubcategory.trim().toLowerCase();

  if (itemSub === target) return true;
  if (itemSub.includes(target) || target.includes(itemSub)) return true;

  // Синонимические сопоставления подкатегорий
  if (target.includes("акрил") || target.includes("оргстекло")) {
    return itemSub.includes("акрил") || itemSub.includes("оргстекло");
  }
  if (target.includes("пвх")) {
    return itemSub.includes("пвх");
  }
  if (target.includes("акп") || target.includes("алюмокомпозит")) {
    return itemSub.includes("акп") || itemSub.includes("алюмокомпозит") || itemSub.includes("композит");
  }
  if (target.includes("пэт") || target.includes("pvc") || target.includes("пластиковые")) {
    return itemSub.includes("пэт") || itemSub.includes("pvc") || itemSub.includes("пластиковые");
  }
  if (target.includes("ромарк") || target.includes("abs")) {
    return itemSub.includes("ромарк") || itemSub.includes("abs");
  }
  if (target.includes("модул")) {
    return itemSub.includes("модул");
  }
  if (target.includes("трансформатор") || target.includes("блок")) {
    return itemSub.includes("блок") || itemSub.includes("трансформатор");
  }
  if (target.includes("неон")) {
    return itemSub.includes("неон");
  }
  if (target.includes("лент")) {
    return itemSub.includes("лент");
  }
  if (target.includes("баннер")) {
    return itemSub.includes("баннер");
  }
  if (target.includes("плоттер") || target.includes("641") || target.includes("v-mark")) {
    return (
      itemSub.includes("плоттер") ||
      itemSub.includes("641") ||
      itemSub.includes("v-mark") ||
      itemSub.includes("demer")
    );
  }
  if (target.includes("8500") || target.includes("транслюцент") || target.includes("светорассе")) {
    return (
      itemSub.includes("8500") ||
      itemSub.includes("транслюцент") ||
      itemSub.includes("светорассе")
    );
  }
  if (target.includes("монтажн") || target.includes("витражн")) {
    return itemSub.includes("монтажн") || itemSub.includes("витражн");
  }
  if (target.includes("печать") || target.includes("ламинац")) {
    return itemSub.includes("печать") || itemSub.includes("ламинац");
  }
  if (target.includes("холст") || target.includes("бэклит") || target.includes("ткани")) {
    return (
      itemSub.includes("холст") ||
      itemSub.includes("бэклит") ||
      itemSub.includes("ткани") ||
      itemSub.includes("фотобумаг") ||
      itemSub.includes("флекс") ||
      itemSub.includes("винил")
    );
  }
  if (target.includes("скотч")) {
    return itemSub.includes("скотч");
  }
  if (target.includes("клей") || target.includes("cosmofen")) {
    return itemSub.includes("клей") || itemSub.includes("cosmofen");
  }
  if (target.includes("держател") || target.includes("люверс") || target.includes("метиз")) {
    return itemSub.includes("держател") || itemSub.includes("люверс") || itemSub.includes("метиз");
  }
  if (target.includes("краск") || target.includes("чернил")) {
    return itemSub.includes("краск") || itemSub.includes("чернил");
  }
  if (target.includes("инструмент") || target.includes("ракел") || target.includes("резак")) {
    return itemSub.includes("инструмент") || itemSub.includes("ракел") || itemSub.includes("резак");
  }
  if (
    target.includes("фрез") ||
    target.includes("гравер") ||
    target.includes("сверл") ||
    target.includes("чпу")
  ) {
    return (
      itemSub.includes("фрез") ||
      itemSub.includes("гравер") ||
      itemSub.includes("сверл") ||
      itemSub.includes("чпу")
    );
  }
  if (
    target.includes("профил") ||
    target.includes("короб") ||
    target.includes("кайма") ||
    target.includes("багет")
  ) {
    return (
      itemSub.includes("профил") ||
      itemSub.includes("короб") ||
      itemSub.includes("кайма") ||
      itemSub.includes("багет")
    );
  }

  return false;
}

export function useMaterialFilters({
  supplierPrices,
  suppliers,
  onQuickUpdatePrice,
  taxonomy = MATERIAL_TAXONOMY,
  getFacetKeys,
  synonymMap,
  onZeroResultQuery,
}: UseMaterialFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategoryState] = useState("all");
  const [selectedSupplier, setSelectedSupplier] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [onlyWithPhoto, setOnlyWithPhoto] = useState(false);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
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

  const handleFacetChange = useCallback((key: keyof MaterialFacetState, value: string) => {
    setFacets((prev) => ({
      ...prev,
      [key]: prev[key] === value ? "all" : value,
    }));
  }, []);

  const handleResetFacets = useCallback(() => {
    setFacets(INITIAL_FACETS);
  }, []);

  const handleCategorySelect = useCallback(
    (catId: string) => {
      setSelectedCategory(catId);
      setSelectedSubcategoryState("all");
      handleResetFacets();
    },
    [handleResetFacets]
  );

  const setSelectedSubcategory = useCallback(
    (subcat: string) => {
      setSelectedSubcategoryState(subcat);
      handleResetFacets();
    },
    [handleResetFacets]
  );

  const handleSupplierSelect = useCallback(
    (sup: string) => {
      setSelectedSupplier(sup);
      setSelectedSubcategoryState("all");
      handleResetFacets();
    },
    [handleResetFacets]
  );

  // Список уникальных поставщиков
  const uniqueSuppliersFromPrices = useMemo(() => {
    return Array.from(new Set(supplierPrices.map((p) => p.supplier))).filter(Boolean);
  }, [supplierPrices]);

  // Считаем распределение по категориям с учетом выбранного поставщика
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: 0 };
    for (const item of supplierPrices) {
      if (selectedSupplier !== "all") {
        const targetSup = selectedSupplier.toLowerCase().trim();
        const itemSup = item.supplier.toLowerCase().trim();
        if (itemSup !== targetSup && !itemSup.includes(targetSup) && !targetSup.includes(itemSup)) {
          continue;
        }
      }
      counts["all"] = (counts["all"] || 0) + 1;
      for (const cat of taxonomy) {
        if (isItemInCategory(item, cat.id, taxonomy)) {
          counts[cat.id] = (counts[cat.id] || 0) + 1;
        }
      }
    }
    return counts;
  }, [supplierPrices, taxonomy, selectedSupplier]);

  // Считаем распределение по подкатегориям с учетом выбранного поставщика
  const subcategoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of taxonomy) {
      for (const sub of cat.subcategories) {
        counts[sub] = supplierPrices.filter((p) => {
          if (selectedSupplier !== "all") {
            const targetSup = selectedSupplier.toLowerCase().trim();
            const itemSup = p.supplier.toLowerCase().trim();
            if (
              itemSup !== targetSup &&
              !itemSup.includes(targetSup) &&
              !targetSup.includes(itemSup)
            ) {
              return false;
            }
          }
          return isItemInCategory(p, cat.id, taxonomy) && isItemInSubcategory(p, sub);
        }).length;
      }
    }
    return counts;
  }, [supplierPrices, taxonomy, selectedSupplier]);

  // Считаем распределение по поставщикам с учетом выбранной категории
  const supplierCounts = useMemo(() => {
    const counts: Record<string, number> = { all: 0 };
    for (const item of supplierPrices) {
      if (selectedCategory !== "all" && !isItemInCategory(item, selectedCategory, taxonomy)) {
        continue;
      }
      counts["all"] = (counts["all"] || 0) + 1;
      const sup = item.supplier || "Неизвестный";
      counts[sup] = (counts[sup] || 0) + 1;
    }
    return counts;
  }, [supplierPrices, selectedCategory, taxonomy]);

  // Количество товаров с фото с учетом категории и поставщика
  const withPhotoCount = useMemo(() => {
    return supplierPrices.filter((p) => {
      if (!p.imageUrl || !p.imageUrl.trim()) return false;
      if (selectedSupplier !== "all") {
        const targetSup = selectedSupplier.toLowerCase().trim();
        const itemSup = p.supplier.toLowerCase().trim();
        if (itemSup !== targetSup && !itemSup.includes(targetSup) && !targetSup.includes(itemSup)) {
          return false;
        }
      }
      if (selectedCategory !== "all" && !isItemInCategory(p, selectedCategory, taxonomy)) {
        return false;
      }
      return true;
    }).length;
  }, [supplierPrices, selectedSupplier, selectedCategory, taxonomy]);

  // Количество избранных товаров (часто закупаемые позиции)
  const favoritesCount = useMemo(() => {
    return supplierPrices.filter((p) => {
      if (!p.isFavorite) return false;
      if (selectedSupplier !== "all") {
        const targetSup = selectedSupplier.toLowerCase().trim();
        const itemSup = p.supplier.toLowerCase().trim();
        if (itemSup !== targetSup && !itemSup.includes(targetSup) && !targetSup.includes(itemSup)) {
          return false;
        }
      }
      if (selectedCategory !== "all" && !isItemInCategory(p, selectedCategory, taxonomy)) {
        return false;
      }
      return true;
    }).length;
  }, [supplierPrices, selectedSupplier, selectedCategory, taxonomy]);

  // Текущая выбранная категория
  const currentCategoryDef = useMemo(() => {
    return taxonomy.find((c) => c.id === selectedCategory);
  }, [taxonomy, selectedCategory]);

  // Активная карта синонимов (встроенная или переданная)
  const defaultSynonymLookup = useMemo(() => {
    return buildSynonymLookup(BUILT_IN_SYNONYM_RULES);
  }, []);

  const activeSynonymMap = synonymMap || defaultSynonymLookup;

  // Отложенное значение поисковой строки для 120 FPS без блокировки ввода
  const deferredSearchQuery = useDeferredValue(searchQuery);

  // Интеллектуальная фильтрация и умный поиск с ранжированием
  const processedPrices = useMemo(() => {
    const isSearching = Boolean(deferredSearchQuery.trim());
    const preparedQuery = isSearching
      ? prepareSearchQuery(deferredSearchQuery, activeSynonymMap)
      : null;
    const scoredList: { item: SupplierPriceItem; score: number }[] = [];

    for (const item of supplierPrices) {
      // 0. Фильтр "Только избранное" (часто закупаемые)
      if (onlyFavorites && !item.isFavorite) {
        continue;
      }

      // 1. Фильтр "Только с фото"
      if (onlyWithPhoto && (!item.imageUrl || !item.imageUrl.trim())) {
        continue;
      }

      // 2. Поставщик
      if (selectedSupplier !== "all") {
        const targetSup = selectedSupplier.toLowerCase().trim();
        const itemSup = item.supplier.toLowerCase().trim();
        if (itemSup !== targetSup && !itemSup.includes(targetSup) && !targetSup.includes(itemSup)) {
          continue;
        }
      }

      // 3. Категория
      if (selectedCategory !== "all") {
        if (!isItemInCategory(item, selectedCategory, taxonomy)) {
          continue;
        }
      }

      // 4. Подкатегория
      if (selectedSubcategory !== "all") {
        if (!isItemInSubcategory(item, selectedSubcategory)) {
          continue;
        }
      }

      // 5. Динамические характеристики со строгой изоляцией
      const fullItemText = `${item.name} ${item.description || ""}`;
      let passesFacets = true;
      for (const facetKey of applicableFacetKeys) {
        const val = facets[facetKey];
        if (val && val !== "all") {
          const options = FACET_CONFIG_MAP[facetKey];
          const matchedOpt = options?.find((o) => o.id === val);
          if (matchedOpt?.match && !matchedOpt.match.test(fullItemText)) {
            passesFacets = false;
            break;
          }
        }
      }
      if (!passesFacets) continue;

      // 6. Умный поиск (Smart Multi-token & Synonyms Scoring с прекомпиляцией)
      let score = 100;
      if (preparedQuery) {
        score = calculatePreparedRelevance(item, preparedQuery);
        if (score <= 0) continue;
      }

      scoredList.push({ item, score });
    }

    // Если был реальный поисковый запрос (>= 3 символов), но результат 0 — фиксируем
    if (isSearching && deferredSearchQuery.trim().length >= 3 && scoredList.length === 0) {
      onZeroResultQuery?.(deferredSearchQuery.trim());
    }

    // Сортировка:
    // Всегда выводим избранные товары вверху списка!
    if (isSearching && sortBy === "default") {
      scoredList.sort((a, b) => {
        const aFav = Boolean(a.item.isFavorite);
        const bFav = Boolean(b.item.isFavorite);
        if (aFav !== bFav) return aFav ? -1 : 1;
        return b.score - a.score;
      });
      return scoredList.map((s) => s.item);
    }

    // Стандартные сортировки с выводом избранных сверху
    scoredList.sort((a, b) => {
      const aFav = Boolean(a.item.isFavorite);
      const bFav = Boolean(b.item.isFavorite);
      if (aFav !== bFav) return aFav ? -1 : 1;

      if (sortBy === "default") {
        const aHasImg = Boolean(a.item.imageUrl && a.item.imageUrl.trim());
        const bHasImg = Boolean(b.item.imageUrl && b.item.imageUrl.trim());
        if (aHasImg && !bHasImg) return -1;
        if (!aHasImg && bHasImg) return 1;
        return a.item.name.localeCompare(b.item.name, "ru");
      } else if (sortBy === "price_asc") {
        return Number(a.item.price) - Number(b.item.price);
      } else if (sortBy === "price_desc") {
        return Number(b.item.price) - Number(a.item.price);
      } else if (sortBy === "name_asc") {
        return a.item.name.localeCompare(b.item.name, "ru");
      } else if (sortBy === "name_desc") {
        return b.item.name.localeCompare(a.item.name, "ru");
      }
      return 0;
    });

    return scoredList.map((s) => s.item);
  }, [
    supplierPrices,
    deferredSearchQuery,
    selectedCategory,
    selectedSubcategory,
    selectedSupplier,
    sortBy,
    onlyWithPhoto,
    onlyFavorites,
    facets,
    applicableFacetKeys,
    activeSynonymMap,
    onZeroResultQuery,
    taxonomy,
  ]);

  // Инлайн обновление цены с синхронизацией инспектора (мемоизировано)
  const handleQuickUpdateAndSync = useCallback(
    async (id: string, newPrice: number) => {
      await onQuickUpdatePrice(id, newPrice);
      setInspectingItem((prev) => (prev && prev.id === id ? { ...prev, price: newPrice } : prev));
    },
    [onQuickUpdatePrice]
  );

  const handleResetAllFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedSubcategoryState("all");
    setSelectedSupplier("all");
    setOnlyWithPhoto(false);
    setOnlyFavorites(false);
    handleResetFacets();
  }, [handleResetFacets]);

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    handleCategorySelect,
    selectedSubcategory,
    setSelectedSubcategory,
    selectedSupplier,
    setSelectedSupplier: handleSupplierSelect,
    sortBy,
    setSortBy,
    onlyWithPhoto,
    setOnlyWithPhoto,
    onlyFavorites,
    setOnlyFavorites,
    favoritesCount,
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
