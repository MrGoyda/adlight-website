"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { EstimateItemType, InventoryUnit } from "@prisma/client";
import { DEFAULT_WORK_OPERATIONS } from "./_data/pricingDictionary";

/**
 * Получение всех данных раздела: Материалы, Тарифы работ, Поставщики
 */
export async function getPricingData() {
  try {
    // 1. Проверяем наличие базовых тарифов работ
    const operationsCount = await prisma.workOperation.count();
    if (operationsCount === 0) {
      for (const op of DEFAULT_WORK_OPERATIONS) {
        await prisma.workOperation.upsert({
          where: { name: op.name },
          update: {},
          create: {
            type: op.type,
            name: op.name,
            unit: op.unit,
            defaultCost: op.defaultCost,
            defaultPrice: op.defaultPrice,
            isCustom: false,
          },
        });
      }
    }

    const [suppliers, supplierPrices, workOperations] = await Promise.all([
      prisma.supplier.findMany({
        orderBy: { name: "asc" },
        include: {
          _count: {
            select: { prices: true },
          },
        },
      }),
      prisma.supplierPrice.findMany({
        orderBy: [{ supplier: "asc" }, { name: "asc" }],
        include: {
          supplierObj: true,
        },
      }),
      prisma.workOperation.findMany({
        orderBy: [{ type: "asc" }, { name: "asc" }],
      }),
    ]);

    return {
      success: true,
      suppliers: JSON.parse(JSON.stringify(suppliers)),
      supplierPrices: JSON.parse(JSON.stringify(supplierPrices)),
      workOperations: JSON.parse(JSON.stringify(workOperations)),
    };
  } catch (error: any) {
    console.error("Ошибка при получении данных прайсов:", error);
    return {
      error: error.message || "Не удалось загрузить данные",
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
        supplierId: data.supplierId || null,
      },
      include: {
        supplierObj: true,
      },
    });

    revalidatePath("/admin/pricing");
    revalidatePath("/admin/leads");
    return { success: true, data: JSON.parse(JSON.stringify(item)) };
  } catch (error: any) {
    console.error("Ошибка создания товара:", error);
    return { error: error.message || "Не удалось создать товар" };
  }
}

export async function updateSupplierPrice(
  id: string,
  data: {
    name?: string;
    supplier?: string;
    price?: number;
    unit?: InventoryUnit;
    supplierId?: string | null;
  }
) {
  try {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name.trim();
    if (data.supplier !== undefined) updateData.supplier = data.supplier.trim();
    if (data.price !== undefined) updateData.price = Number(data.price) || 0;
    if (data.unit !== undefined) updateData.unit = data.unit;
    if (data.supplierId !== undefined) updateData.supplierId = data.supplierId || null;

    const item = await prisma.supplierPrice.update({
      where: { id },
      data: updateData,
      include: {
        supplierObj: true,
      },
    });

    revalidatePath("/admin/pricing");
    revalidatePath("/admin/leads");
    return { success: true, data: JSON.parse(JSON.stringify(item)) };
  } catch (error: any) {
    console.error("Ошибка обновления товара:", error);
    return { error: error.message || "Не удалось обновить товар" };
  }
}

export async function deleteSupplierPrice(id: string) {
  try {
    await prisma.supplierPrice.delete({
      where: { id },
    });

    revalidatePath("/admin/pricing");
    revalidatePath("/admin/leads");
    return { success: true };
  } catch (error: any) {
    console.error("Ошибка удаления товара:", error);
    return { error: error.message || "Не удалось удалить товар" };
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

    revalidatePath("/admin/pricing");
    revalidatePath("/admin/leads");
    return { success: true, data: JSON.parse(JSON.stringify(item)) };
  } catch (error: any) {
    console.error("Ошибка создания тарифа:", error);
    return { error: error.message || "Не удалось создать тариф" };
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
    const updateData: any = {};
    if (data.type !== undefined) updateData.type = data.type;
    if (data.name !== undefined) updateData.name = data.name.trim();
    if (data.unit !== undefined) updateData.unit = data.unit;
    if (data.defaultCost !== undefined) updateData.defaultCost = Number(data.defaultCost) || 0;
    if (data.defaultPrice !== undefined) updateData.defaultPrice = Number(data.defaultPrice) || 0;

    const item = await prisma.workOperation.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/admin/pricing");
    revalidatePath("/admin/leads");
    return { success: true, data: JSON.parse(JSON.stringify(item)) };
  } catch (error: any) {
    console.error("Ошибка обновления тарифа:", error);
    return { error: error.message || "Не удалось обновить тариф" };
  }
}

export async function deleteWorkOperation(id: string) {
  try {
    await prisma.workOperation.delete({
      where: { id },
    });

    revalidatePath("/admin/pricing");
    revalidatePath("/admin/leads");
    return { success: true };
  } catch (error: any) {
    console.error("Ошибка удаления тарифа:", error);
    return { error: error.message || "Не удалось удалить тариф" };
  }
}

// ════════════════════════════════════════════════════════════════════
// 3. CRUD ДЛЯ СПРАВОЧНИКА ПОСТАВЩИКОВ (Supplier)
// ════════════════════════════════════════════════════════════════════

export async function createSupplier(data: {
  name: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  notes?: string;
}) {
  try {
    if (!data.name.trim()) return { error: "Название поставщика обязательно" };

    const supplier = await prisma.supplier.create({
      data: {
        name: data.name.trim(),
        address: data.address?.trim() || null,
        phone: data.phone?.trim() || null,
        whatsapp: data.whatsapp?.trim() || null,
        notes: data.notes?.trim() || null,
      },
      include: {
        _count: { select: { prices: true } },
      },
    });

    revalidatePath("/admin/pricing");
    return { success: true, data: JSON.parse(JSON.stringify(supplier)) };
  } catch (error: any) {
    console.error("Ошибка создания поставщика:", error);
    return { error: error.message || "Не удалось создать поставщика" };
  }
}

export async function updateSupplier(
  id: string,
  data: {
    name?: string;
    address?: string;
    phone?: string;
    whatsapp?: string;
    notes?: string;
  }
) {
  try {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name.trim();
    if (data.address !== undefined) updateData.address = data.address.trim() || null;
    if (data.phone !== undefined) updateData.phone = data.phone.trim() || null;
    if (data.whatsapp !== undefined) updateData.whatsapp = data.whatsapp.trim() || null;
    if (data.notes !== undefined) updateData.notes = data.notes.trim() || null;

    const supplier = await prisma.supplier.update({
      where: { id },
      data: updateData,
      include: {
        _count: { select: { prices: true } },
      },
    });

    revalidatePath("/admin/pricing");
    return { success: true, data: JSON.parse(JSON.stringify(supplier)) };
  } catch (error: any) {
    console.error("Ошибка обновления поставщика:", error);
    return { error: error.message || "Не удалось обновить поставщика" };
  }
}

export async function deleteSupplier(id: string) {
  try {
    await prisma.supplier.delete({
      where: { id },
    });

    revalidatePath("/admin/pricing");
    return { success: true };
  } catch (error: any) {
    console.error("Ошибка удаления поставщика:", error);
    return { error: error.message || "Не удалось удалить поставщика" };
  }
}
