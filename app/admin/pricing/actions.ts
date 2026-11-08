"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Prisma, EstimateItemType, InventoryUnit } from "@prisma/client";
import { 
  getCachedSuppliers, 
  getCachedCatalogPrices, 
  getCachedWorkOperations,
  invalidateSupplierPricesCache,
  invalidateSuppliersCache,
  invalidateWorkOperationsCache
} from "@/lib/cachedQueries";

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) return error.message;
  return fallback;
}

/**
 * Получение всех данных раздела: Материалы, Тарифы работ, Поставщики (кэшировано)
 */
export async function getPricingData() {
  try {
    const [suppliers, supplierPrices, workOperations] = await Promise.all([
      getCachedSuppliers(),
      getCachedCatalogPrices(),
      getCachedWorkOperations(),
    ]);

    return {
      success: true,
      suppliers: suppliers.map((s) => ({
        ...s,
        createdAt: typeof s.createdAt === "string" ? s.createdAt : s.createdAt.toISOString(),
        updatedAt: typeof s.updatedAt === "string" ? s.updatedAt : s.updatedAt.toISOString(),
      })),
      supplierPrices: supplierPrices.map((sp) => ({
        ...sp,
        createdAt: typeof sp.createdAt === "string" ? sp.createdAt : sp.createdAt.toISOString(),
        updatedAt: typeof sp.updatedAt === "string" ? sp.updatedAt : sp.updatedAt.toISOString(),
        supplierObj: sp.supplierObj
          ? {
              ...sp.supplierObj,
              createdAt: typeof sp.supplierObj.createdAt === "string" ? sp.supplierObj.createdAt : sp.supplierObj.createdAt.toISOString(),
              updatedAt: typeof sp.supplierObj.updatedAt === "string" ? sp.supplierObj.updatedAt : sp.supplierObj.updatedAt.toISOString(),
            }
          : null,
      })),
      workOperations: workOperations.map((wo) => ({
        ...wo,
        createdAt: typeof wo.createdAt === "string" ? wo.createdAt : wo.createdAt.toISOString(),
        updatedAt: typeof wo.updatedAt === "string" ? wo.updatedAt : wo.updatedAt.toISOString(),
      })),
    };
  } catch (error: unknown) {
    console.error("Ошибка при получении данных прайсов:", error);
    return {
      error: getErrorMessage(error, "Не удалось загрузить данные"),
      suppliers: [],
      supplierPrices: [],
      workOperations: [],
    };
  }
}

// ════════════════════════════════════════════════════════════════════
// 1. CRUD ДЛЯ МАТЕРИАЛОВ И ТОВАРОВ ПОСТАВЩИКОВ (SupplierPrice)
// ════════════════════════════════════════════════════════════════════

export async function createSupplierPrice(data: {
  name: string;
  supplier: string;
  price: number;
  unit: InventoryUnit;
  category?: string | null;
  subcategory?: string | null;
  imageUrl?: string | null;
  description?: string | null;
  sourceUrl?: string | null;
  isService?: boolean;
  supplierId?: string | null;
}) {
  try {
    if (!data.name.trim()) return { error: "Название материала обязательно" };
    if (!data.supplier.trim()) return { error: "Поставщик обязателен" };

    const item = await prisma.supplierPrice.create({
      data: {
        name: data.name.trim(),
        supplier: data.supplier.trim(),
        price: Number(data.price) || 0,
        unit: data.unit,
        category: data.category?.trim() || null,
        subcategory: data.subcategory?.trim() || null,
        imageUrl: data.imageUrl?.trim() || null,
        description: data.description?.trim() || null,
        sourceUrl: data.sourceUrl?.trim() || null,
        isService: Boolean(data.isService),
        supplierId: data.supplierId || null,
      },
      include: {
        supplierObj: true,
      },
    });

    invalidateSupplierPricesCache();
    invalidateSuppliersCache();
    revalidatePath("/admin/pricing");
    revalidatePath("/admin/leads");
    return { success: true, data: JSON.parse(JSON.stringify(item)) };
  } catch (error: unknown) {
    console.error("Ошибка создания товара:", error);
    return { error: getErrorMessage(error, "Не удалось создать товар") };
  }
}

export async function updateSupplierPrice(
  id: string,
  data: {
    name?: string;
    supplier?: string;
    price?: number;
    unit?: InventoryUnit;
    category?: string | null;
    subcategory?: string | null;
    imageUrl?: string | null;
    description?: string | null;
    sourceUrl?: string | null;
    isService?: boolean;
    supplierId?: string | null;
  }
) {
  try {
    const updateData: Prisma.SupplierPriceUpdateInput = {};
    if (data.name !== undefined) updateData.name = data.name.trim();
    if (data.supplier !== undefined) updateData.supplier = data.supplier.trim();
    if (data.price !== undefined) updateData.price = Number(data.price) || 0;
    if (data.unit !== undefined) updateData.unit = data.unit;
    if (data.category !== undefined) updateData.category = data.category?.trim() || null;
    if (data.subcategory !== undefined) updateData.subcategory = data.subcategory?.trim() || null;
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl?.trim() || null;
    if (data.description !== undefined) updateData.description = data.description?.trim() || null;
    if (data.sourceUrl !== undefined) updateData.sourceUrl = data.sourceUrl?.trim() || null;
    if (data.isService !== undefined) updateData.isService = Boolean(data.isService);
    if (data.supplierId !== undefined) {
      updateData.supplierObj = data.supplierId
        ? { connect: { id: data.supplierId } }
        : { disconnect: true };
    }

    const item = await prisma.supplierPrice.update({
      where: { id },
      data: updateData,
      include: {
        supplierObj: true,
      },
    });

    invalidateSupplierPricesCache();
    invalidateSuppliersCache();
    revalidatePath("/admin/pricing");
    revalidatePath("/admin/leads");
    return { success: true, data: JSON.parse(JSON.stringify(item)) };
  } catch (error: unknown) {
    console.error("Ошибка обновления товара:", error);
    return { error: getErrorMessage(error, "Не удалось обновить товар") };
  }
}

export async function deleteSupplierPrice(id: string) {
  try {
    await prisma.supplierPrice.delete({
      where: { id },
    });

    invalidateSupplierPricesCache();
    invalidateSuppliersCache();
    revalidatePath("/admin/pricing");
    revalidatePath("/admin/leads");
    return { success: true };
  } catch (error: unknown) {
    console.error("Ошибка удаления товара:", error);
    return { error: getErrorMessage(error, "Не удалось удалить товар") };
  }
}

/**
 * Переключение статуса "Избранное" для материала (часто закупаемые позиции)
 */
export async function toggleMaterialFavorite(id: string, isFavorite: boolean) {
  try {
    const item = await prisma.supplierPrice.update({
      where: { id },
      data: { isFavorite },
      include: {
        supplierObj: true,
      },
    });

    invalidateSuppliersCache();
    revalidatePath("/admin/pricing");
    return { success: true, data: JSON.parse(JSON.stringify(item)) };
  } catch (error: unknown) {
    console.error("Ошибка переключения избранного:", error);
    return { error: getErrorMessage(error, "Не удалось обновить избранное") };
  }
}

/**
 * Массовое обновление подкатегории у товаров при переименовании в таксономии
 */
export async function renameSubcategoryInMaterials(oldSubName: string, newSubName: string) {
  try {
    const trimmedOld = oldSubName.trim();
    const trimmedNew = newSubName.trim();
    if (!trimmedOld || !trimmedNew || trimmedOld === trimmedNew) {
      return { success: true, count: 0 };
    }

    const result = await prisma.supplierPrice.updateMany({
      where: { subcategory: trimmedOld },
      data: { subcategory: trimmedNew },
    });

    invalidateSupplierPricesCache();
    invalidateSuppliersCache();
    revalidatePath("/admin/pricing");
    revalidatePath("/admin/leads");
    return { success: true, count: result.count };
  } catch (error: unknown) {
    console.error("Ошибка переименования подкатегории у товаров:", error);
    return { error: getErrorMessage(error, "Не удалось обновить подкатегорию в базе") };
  }
}

/**
 * Очистка подкатегории у товаров при ее удалении из таксономии
 */
export async function deleteSubcategoryInMaterials(subName: string) {
  try {
    const trimmed = subName.trim();
    if (!trimmed) {
      return { success: true, count: 0 };
    }

    const result = await prisma.supplierPrice.updateMany({
      where: { subcategory: trimmed },
      data: { subcategory: null },
    });

    invalidateSupplierPricesCache();
    invalidateSuppliersCache();
    revalidatePath("/admin/pricing");
    revalidatePath("/admin/leads");
    return { success: true, count: result.count };
  } catch (error: unknown) {
    console.error("Ошибка удаления подкатегории у товаров:", error);
    return { error: getErrorMessage(error, "Не удалось удалить подкатегорию у товаров") };
  }
}

// ════════════════════════════════════════════════════════════════════
// 2. CRUD ДЛЯ ТАРИФОВ И ВИДОВ РАБОТ (WorkOperation)
// ════════════════════════════════════════════════════════════════════

export async function createWorkOperation(data: {
  type: EstimateItemType;
  name: string;
  unit: InventoryUnit;
  defaultCost: number;
  defaultPrice: number;
}) {
  try {
    if (!data.name.trim()) return { error: "Название услуги обязательно" };

    const item = await prisma.workOperation.create({
      data: {
        type: data.type,
        name: data.name.trim(),
        unit: data.unit,
        defaultCost: Number(data.defaultCost) || 0,
        defaultPrice: Number(data.defaultPrice) || 0,
        isCustom: true,
      },
    });

    invalidateWorkOperationsCache();
    invalidateSuppliersCache();
    revalidatePath("/admin/pricing");
    revalidatePath("/admin/leads");
    return { success: true, data: JSON.parse(JSON.stringify(item)) };
  } catch (error: unknown) {
    console.error("Ошибка создания тарифа:", error);
    return { error: getErrorMessage(error, "Не удалось создать тариф") };
  }
}

export async function updateWorkOperation(
  id: string,
  data: {
    type?: EstimateItemType;
    name?: string;
    unit?: InventoryUnit;
    defaultCost?: number;
    defaultPrice?: number;
  }
) {
  try {
    const updateData: Prisma.WorkOperationUpdateInput = {};
    if (data.type !== undefined) updateData.type = data.type;
    if (data.name !== undefined) updateData.name = data.name.trim();
    if (data.unit !== undefined) updateData.unit = data.unit;
    if (data.defaultCost !== undefined) updateData.defaultCost = Number(data.defaultCost) || 0;
    if (data.defaultPrice !== undefined) updateData.defaultPrice = Number(data.defaultPrice) || 0;

    const item = await prisma.workOperation.update({
      where: { id },
      data: updateData,
    });

    invalidateWorkOperationsCache();
    invalidateSuppliersCache();
    revalidatePath("/admin/pricing");
    revalidatePath("/admin/leads");
    return { success: true, data: JSON.parse(JSON.stringify(item)) };
  } catch (error: unknown) {
    console.error("Ошибка обновления тарифа:", error);
    return { error: getErrorMessage(error, "Не удалось обновить тариф") };
  }
}

export async function deleteWorkOperation(id: string) {
  try {
    await prisma.workOperation.delete({
      where: { id },
    });

    invalidateWorkOperationsCache();
    invalidateSuppliersCache();
    revalidatePath("/admin/pricing");
    revalidatePath("/admin/leads");
    return { success: true };
  } catch (error: unknown) {
    console.error("Ошибка удаления тарифа:", error);
    return { error: getErrorMessage(error, "Не удалось удалить тариф") };
  }
}

// ════════════════════════════════════════════════════════════════════
// 3. CRUD ДЛЯ СПРАВОЧНИКА ПОСТАВЩИКОВ (Supplier)
// ════════════════════════════════════════════════════════════════════

export async function createSupplier(data: {
  name: string;
  address?: string | null;
  phone?: string | null;
  phones?: string[];
  whatsapp?: string | null;
  website?: string | null;
  instagram?: string | null;
  notes?: string | null;
}) {
  try {
    if (!data.name.trim()) return { error: "Название поставщика обязательно" };

    const cleanPhones = (data.phones || [])
      .map((p) => p.trim())
      .filter(Boolean);

    // Если передан единичный phone, но нет в массиве — добавим
    if (data.phone?.trim() && !cleanPhones.includes(data.phone.trim())) {
      cleanPhones.unshift(data.phone.trim());
    }

    const primaryPhone = cleanPhones[0] || data.phone?.trim() || null;

    const supplier = await prisma.supplier.create({
      data: {
        name: data.name.trim(),
        address: data.address?.trim() || null,
        phone: primaryPhone,
        phones: cleanPhones,
        whatsapp: data.whatsapp?.trim() || null,
        website: data.website?.trim() || null,
        instagram: data.instagram?.trim() || null,
        notes: data.notes?.trim() || null,
      },
      include: {
        _count: { select: { prices: true } },
      },
    });

    invalidateSuppliersCache();
    revalidatePath("/admin/pricing");
    return { success: true, data: JSON.parse(JSON.stringify(supplier)) };
  } catch (error: unknown) {
    console.error("Ошибка создания поставщика:", error);
    return { error: getErrorMessage(error, "Не удалось создать поставщика") };
  }
}

export async function updateSupplier(
  id: string,
  data: {
    name?: string;
    address?: string | null;
    phone?: string | null;
    phones?: string[];
    whatsapp?: string | null;
    website?: string | null;
    instagram?: string | null;
    notes?: string | null;
  }
) {
  try {
    const updateData: Prisma.SupplierUpdateInput = {};
    if (data.name !== undefined) updateData.name = data.name.trim();
    if (data.address !== undefined) updateData.address = data.address?.trim() || null;
    if (data.whatsapp !== undefined) updateData.whatsapp = data.whatsapp?.trim() || null;
    if (data.website !== undefined) updateData.website = data.website?.trim() || null;
    if (data.instagram !== undefined) updateData.instagram = data.instagram?.trim() || null;
    if (data.notes !== undefined) updateData.notes = data.notes?.trim() || null;

    if (data.phones !== undefined) {
      const cleanPhones = data.phones.map((p) => p.trim()).filter(Boolean);
      updateData.phones = cleanPhones;
      updateData.phone = cleanPhones[0] || null;
    } else if (data.phone !== undefined) {
      const trimmed = data.phone?.trim() || null;
      updateData.phone = trimmed;
      if (trimmed) {
        updateData.phones = [trimmed];
      } else {
        updateData.phones = [];
      }
    }

    const supplier = await prisma.supplier.update({
      where: { id },
      data: updateData,
      include: {
        _count: { select: { prices: true } },
      },
    });

    invalidateSuppliersCache();
    revalidatePath("/admin/pricing");
    return { success: true, data: JSON.parse(JSON.stringify(supplier)) };
  } catch (error: unknown) {
    console.error("Ошибка обновления поставщика:", error);
    return { error: getErrorMessage(error, "Не удалось обновить поставщика") };
  }
}

export async function deleteSupplier(id: string) {
  try {
    await prisma.supplier.delete({
      where: { id },
    });

    invalidateSuppliersCache();
    revalidatePath("/admin/pricing");
    return { success: true };
  } catch (error: unknown) {
    console.error("Ошибка удаления поставщика:", error);
    return { error: getErrorMessage(error, "Не удалось удалить поставщика") };
  }
}
