import { prisma } from "@/lib/prisma";
import { unstable_cache, revalidateTag } from "next/cache";

/**
 * ⚡ Кэшированный справочник поставщиков (1 час)
 * Инвалидируется мгновенно при добавлении/редактировании через revalidateTag("suppliers")
 */
export const getCachedSuppliers = unstable_cache(
  async () => {
    return prisma.supplier.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { prices: true },
        },
      },
    });
  },
  ["admin_cached_suppliers"],
  { tags: ["suppliers"], revalidate: 3600 }
);

/**
 * ⚡ Кэшированные тарифы работ (1 час)
 * Инвалидируется через revalidateTag("work_operations")
 */
export const getCachedWorkOperations = unstable_cache(
  async () => {
    return prisma.workOperation.findMany({
      orderBy: [{ type: "asc" }, { name: "asc" }],
    });
  },
  ["admin_cached_work_operations"],
  { tags: ["work_operations"], revalidate: 3600 }
);

/**
 * ⚡ Кэшированные пресеты типовых конструкций калькулятора (1 час)
 * Инвалидируется через revalidateTag("estimate_presets")
 */
export const getCachedEstimatePresets = unstable_cache(
  async () => {
    return prisma.estimatePreset.findMany({
      orderBy: [
        { isFavorite: "desc" },
        { name: "asc" },
      ],
    });
  },
  ["admin_cached_estimate_presets"],
  { tags: ["estimate_presets"], revalidate: 3600 }
);

/**
 * ⚡ Легковесный кэшированный прайс-лист для Калькулятора и Склада (5 минут)
 * Содержит скалярные поля, исключая тяжелые фото и текстовые описания.
 * Размер ответа сокращен в 25 раз.
 */
export const getCachedCalculatorPrices = unstable_cache(
  async () => {
    return prisma.supplierPrice.findMany({
      select: {
        id: true,
        name: true,
        supplier: true,
        supplierId: true,
        price: true,
        unit: true,
        category: true,
        subcategory: true,
        isService: true,
        isFavorite: true,
      },
      orderBy: [
        { isFavorite: "desc" },
        { supplier: "asc" },
        { name: "asc" },
      ],
    });
  },
  ["admin_cached_calculator_prices"],
  { tags: ["supplier_prices"], revalidate: 300 }
);

/**
 * ⚡ Полный кэшированный каталог материалов для раздела Тарифов (5 минут)
 */
export const getCachedCatalogPrices = unstable_cache(
  async () => {
    return prisma.supplierPrice.findMany({
      orderBy: [
        { isFavorite: "desc" },
        { supplier: "asc" },
        { name: "asc" },
      ],
      include: {
        supplierObj: true,
      },
    });
  },
  ["admin_cached_catalog_prices"],
  { tags: ["supplier_prices"], revalidate: 300 }
);

// Функция для безопасного вызова revalidateTag в Next.js 15
function safeRevalidateTag(tag: string) {
  try {
    revalidateTag(tag, "default");
  } catch {
    try {
      (revalidateTag as unknown as (t: string) => void)(tag);
    } catch (e) {
      console.warn(`Could not revalidate tag ${tag}:`, e);
    }
  }
}

// Функции мгновенной инвалидации
export function invalidateSupplierPricesCache() {
  safeRevalidateTag("supplier_prices");
}

export function invalidateSuppliersCache() {
  safeRevalidateTag("suppliers");
}

export function invalidateWorkOperationsCache() {
  safeRevalidateTag("work_operations");
}

export function invalidatePresetsCache() {
  safeRevalidateTag("estimate_presets");
}
