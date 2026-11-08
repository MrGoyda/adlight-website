"use server";

import { prisma } from "@/lib/prisma";
import { InventoryUnit } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { WarehouseItemData } from "./_types/warehouseTypes";

// Zod схемы валидации для безопасности API
const WarehouseItemSchema = z.object({
  name: z.string().min(2, "Название должно быть не менее 2 символов"),
  category: z.string().min(2, "Категория должна быть заполнена"),
  quantity: z.number().min(0, "Количество не может быть отрицательным"),
  unit: z.nativeEnum(InventoryUnit),
  price: z.number().nonnegative("Себестоимость не может быть отрицательной"),
  location: z.string().nullable().optional(),
  minStock: z.number().nonnegative("Порог остатка не может быть отрицательным"),
});

const AdjustStockSchema = z.object({
  id: z.string().uuid(),
  quantityChange: z.number().refine((val) => val !== 0, "Изменение не может быть нулевым"),
  description: z.string().min(2, "Укажите причину операции"),
  leadId: z.string().uuid().nullable().optional(),
});

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof z.ZodError) {
    return error.issues[0]?.message || fallback;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}

// ================= 1. СКЛАДСКИЕ ОСТАТКИ (Warehouse Items) =================

export async function getWarehouseItems(): Promise<{
  success: boolean;
  data?: WarehouseItemData[];
  error?: string;
}> {
  try {
    const items = await prisma.warehouseItem.findMany({
      orderBy: { name: "asc" },
    });
    return {
      success: true,
      data: items.map((i) => ({
        ...i,
        createdAt: i.createdAt.toISOString(),
        updatedAt: i.updatedAt.toISOString(),
      })),
    };
  } catch (error) {
    console.error("Failed to get warehouse items:", error);
    return { success: false, error: "Не удалось загрузить остатки склада" };
  }
}

export async function createWarehouseItem(rawData: {
  name: string;
  category: string;
  quantity: number;
  unit: InventoryUnit;
  price: number;
  location?: string | null;
  minStock: number;
}) {
  try {
    const data = WarehouseItemSchema.parse(rawData);

    const newItem = await prisma.$transaction(async (tx) => {
      const item = await tx.warehouseItem.create({
        data: {
          name: data.name.trim(),
          category: data.category.trim(),
          quantity: data.quantity,
          unit: data.unit,
          price: data.price,
          location: data.location?.trim() || null,
          minStock: data.minStock || 0,
        },
      });

      // Создаем транзакцию начального оприходования
      if (data.quantity > 0) {
        await tx.warehouseTransaction.create({
          data: {
            itemId: item.id,
            quantityChanged: data.quantity,
            description: "Начальное оприходование при создании карточки",
          },
        });
      }

      return item;
    });

    revalidatePath("/admin/warehouse");
    revalidatePath("/admin/calculator");
    revalidatePath("/admin/leads");
    return { success: true, data: newItem };
  } catch (error: unknown) {
    console.error("Failed to create warehouse item:", error);
    const msg = getErrorMessage(error, "Не удалось добавить материал на склад");
    if (typeof error === "object" && error !== null && "code" in error && (error as { code: string }).code === "P2002") {
      return { error: "Материал с таким названием уже существует на складе" };
    }
    return { error: msg };
  }
}

export async function updateWarehouseItem(
  id: string,
  rawData: {
    name: string;
    category: string;
    unit: InventoryUnit;
    price: number;
    location?: string | null;
    minStock: number;
  }
) {
  try {
    const data = WarehouseItemSchema.omit({ quantity: true }).parse(rawData);

    const updated = await prisma.warehouseItem.update({
      where: { id },
      data: {
        name: data.name.trim(),
        category: data.category.trim(),
        unit: data.unit,
        price: data.price,
        location: data.location?.trim() || null,
        minStock: data.minStock || 0,
      },
    });

    revalidatePath("/admin/warehouse");
    revalidatePath("/admin/calculator");
    revalidatePath("/admin/leads");
    return { success: true, data: updated };
  } catch (error: unknown) {
    console.error("Failed to update warehouse item:", error);
    return { error: getErrorMessage(error, "Не удалось обновить карточку товара") };
  }
}

export async function adjustWarehouseStock(
  id: string,
  quantityChange: number,
  description: string,
  leadId?: string | null
) {
  try {
    const validated = AdjustStockSchema.parse({
      id,
      quantityChange,
      description: description.trim(),
      leadId: leadId || null,
    });

    const result = await prisma.$transaction(async (tx) => {
      const item = await tx.warehouseItem.findUnique({ where: { id: validated.id } });
      if (!item) throw new Error("Товар не найден на складе");

      const newQty = item.quantity + validated.quantityChange;

      // Защита от ухода остатков на складе в минус при ручных списаниях
      if (newQty < 0) {
        throw new Error(
          `Недостаточно остатка на складе. В наличии: ${item.quantity}, попытка списать: ${Math.abs(validated.quantityChange)}`
        );
      }

      const updated = await tx.warehouseItem.update({
        where: { id: validated.id },
        data: { quantity: newQty },
      });

      await tx.warehouseTransaction.create({
        data: {
          itemId: validated.id,
          quantityChanged: validated.quantityChange,
          description: validated.description,
          leadId: validated.leadId,
        },
      });

      return updated;
    });

    revalidatePath("/admin/warehouse");
    revalidatePath("/admin/calculator");
    revalidatePath("/admin/leads");
    return { success: true, data: result };
  } catch (error: unknown) {
    console.error("Failed to adjust warehouse stock:", error);
    return { error: getErrorMessage(error, "Не удалось изменить количество товара") };
  }
}

export async function deleteWarehouseItem(id: string) {
  try {
    await prisma.warehouseItem.delete({
      where: { id },
    });
    revalidatePath("/admin/warehouse");
    revalidatePath("/admin/calculator");
    revalidatePath("/admin/leads");
    return { success: true };
  } catch (error: unknown) {
    console.error("Failed to delete warehouse item:", error);
    return { error: getErrorMessage(error, "Не удалось удалить материал со склада") };
  }
}

// ================= 2. ОПРИХОДОВАНИЕ ИЗ ПРАЙСА ПОСТАВЩИКА =================

export async function intakeFromSupplierPrice(data: {
  supplierPriceId: string;
  quantity: number;
  location?: string | null;
  notes?: string;
}) {
  try {
    if (data.quantity <= 0) {
      return { error: "Количество для оприходования должно быть больше 0" };
    }

    const supplierPrice = await prisma.supplierPrice.findUnique({
      where: { id: data.supplierPriceId },
    });

    if (!supplierPrice) {
      return { error: "Товар из прайса поставщика не найден" };
    }

    const result = await prisma.$transaction(async (tx) => {
      // Ищем, есть ли уже товар с таким названием на складе
      const existingItem = await tx.warehouseItem.findUnique({
        where: { name: supplierPrice.name },
      });

      let targetItem;

      if (existingItem) {
        // Увеличиваем остаток и обновляем себестоимость по накладной
        targetItem = await tx.warehouseItem.update({
          where: { id: existingItem.id },
          data: {
            quantity: existingItem.quantity + data.quantity,
            price: supplierPrice.price, // обновляем цену на актуальную
            location: data.location?.trim() || existingItem.location,
          },
        });
      } else {
        // Создаем новую складскую позицию
        targetItem = await tx.warehouseItem.create({
          data: {
            name: supplierPrice.name,
            category: supplierPrice.category || "Материалы поставщиков",
            quantity: data.quantity,
            unit: supplierPrice.unit,
            price: supplierPrice.price,
            location: data.location?.trim() || null,
            minStock: 0,
          },
        });
      }

      // Фиксируем транзакцию поступления
      await tx.warehouseTransaction.create({
        data: {
          itemId: targetItem.id,
          quantityChanged: data.quantity,
          description: `Поставка от поставщика "${supplierPrice.supplier}" (${data.notes?.trim() || "Оприходование по накладной"})`,
        },
      });

      return targetItem;
    });

    revalidatePath("/admin/warehouse");
    revalidatePath("/admin/calculator");
    revalidatePath("/admin/leads");
    return { success: true, data: result };
  } catch (error: unknown) {
    console.error("Failed to intake from supplier price:", error);
    return { error: getErrorMessage(error, "Не удалось оприходовать материал от поставщика") };
  }
}

// ================= 3. ЖУРНАЛ ОПЕРАЦИЙ (Transactions) =================

export async function getWarehouseTransactions(take = 200) {
  try {
    const logs = await prisma.warehouseTransaction.findMany({
      include: {
        item: {
          select: {
            id: true,
            name: true,
            unit: true,
            category: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take,
    });
    return {
      success: true,
      data: logs.map((log) => ({
        ...log,
        createdAt: log.createdAt.toISOString(),
      })),
    };
  } catch (error: unknown) {
    console.error("Failed to get warehouse transactions:", error);
    return { error: "Не удалось загрузить историю транзакций склада" };
  }
}
