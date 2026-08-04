"use server";

import { prisma } from "@/lib/prisma";
import { InventoryUnit } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

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
  quantityChange: z.number(),
  description: z.string().min(3, "Описание операции должно быть не менее 3 символов"),
});

// ================= Warehouse Items =================

export async function getWarehouseItems() {
  try {
    const items = await prisma.warehouseItem.findMany({
      orderBy: { name: "asc" },
    });
    return { success: true, data: items };
  } catch (error) {
    console.error("Failed to get warehouse items:", error);
    return { error: "Не удалось загрузить остатки склада" };
  }
}

export async function createWarehouseItem(rawData: any) {
  try {
    // Валидация входных данных
    const data = WarehouseItemSchema.parse(rawData);

    const newItem = await prisma.warehouseItem.create({
      data: {
        name: data.name,
        category: data.category,
        quantity: data.quantity,
        unit: data.unit,
        price: data.price,
        location: data.location || null,
        minStock: data.minStock || 0,
      },
    });

    // Создаем транзакцию оприходования
    if (data.quantity > 0) {
      await prisma.warehouseTransaction.create({
        data: {
          itemId: newItem.id,
          quantityChanged: data.quantity,
          description: "Начальное оприходование при создании карточки товара",
        },
      });
    }

    revalidatePath("/admin/warehouse");
    revalidatePath("/admin/leads");
    return { success: true, data: newItem };
  } catch (error: any) {
    console.error("Failed to create warehouse item:", error);
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    }
    if (error.code === "P2002") {
      return { error: "Материал с таким названием уже существует на складе" };
    }
    return { error: "Не удалось добавить материал на склад" };
  }
}

export async function updateWarehouseItem(
  id: string,
  rawData: any
) {
  try {
    // Валидация входных данных
    const data = WarehouseItemSchema.parse(rawData);

    const updated = await prisma.warehouseItem.update({
      where: { id },
      data: {
        name: data.name,
        category: data.category,
        unit: data.unit,
        price: data.price,
        location: data.location || null,
        minStock: data.minStock || 0,
      },
    });

    revalidatePath("/admin/warehouse");
    revalidatePath("/admin/leads");
    return { success: true, data: updated };
  } catch (error: any) {
    console.error("Failed to update warehouse item:", error);
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    }
    return { error: "Не удалось обновить карточку товара" };
  }
}

export async function adjustWarehouseStock(
  id: string,
  quantityChange: number,
  description: string
) {
  try {
    // Валидация входных данных
    const validated = AdjustStockSchema.parse({ id, quantityChange, description });

    const result = await prisma.$transaction(async (tx) => {
      const item = await tx.warehouseItem.findUnique({ where: { id: validated.id } });
      if (!item) throw new Error("Товар не найден на складе");

      const newQty = item.quantity + validated.quantityChange;

      // Защита от ухода остатков на складе в минус при ручных корректировках
      if (newQty < 0) {
        throw new Error(
          `Недостаточно товара на складе для списания. Текущий остаток: ${item.quantity}, вы пытаетесь списать: ${Math.abs(validated.quantityChange)}`
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
        },
      });

      return updated;
    });

    revalidatePath("/admin/warehouse");
    revalidatePath("/admin/leads");
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Failed to adjust warehouse stock:", error);
    return { error: error.message || "Не удалось изменить количество товара" };
  }
}

export async function deleteWarehouseItem(id: string) {
  try {
    await prisma.warehouseItem.delete({
      where: { id },
    });
    revalidatePath("/admin/warehouse");
    revalidatePath("/admin/leads");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete warehouse item:", error);
    return { error: "Не удалось удалить материал со склада" };
  }
}

// ================= Suppliers CRUD =================

export async function getSuppliers() {
  try {
    const suppliers = await prisma.supplier.findMany({
      orderBy: { name: "asc" },
      include: { prices: true }
    });
    return { success: true, data: suppliers };
  } catch (error) {
    console.error("Failed to get suppliers:", error);
    return { error: "Не удалось загрузить поставщиков" };
  }
}

export async function createSupplier(data: {
  name: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  notes?: string;
}) {
  try {
    const newSupplier = await prisma.supplier.create({
      data: {
        name: data.name,
        address: data.address || null,
        phone: data.phone || null,
        whatsapp: data.whatsapp || null,
        notes: data.notes || null,
      },
    });

    revalidatePath("/admin/warehouse");
    revalidatePath("/admin/leads");
    return { success: true, data: newSupplier };
  } catch (error: any) {
    console.error("Failed to create supplier:", error);
    if (error.code === "P2002") {
      return { error: "Поставщик с таким названием уже существует" };
    }
    return { error: "Не удалось создать поставщика" };
  }
}

export async function updateSupplier(
  id: string,
  data: {
    name: string;
    address?: string;
    phone?: string;
    whatsapp?: string;
    notes?: string;
  }
) {
  try {
    const updated = await prisma.supplier.update({
      where: { id },
      data: {
        name: data.name,
        address: data.address || null,
        phone: data.phone || null,
        whatsapp: data.whatsapp || null,
        notes: data.notes || null,
      },
    });

    // Также обновим текстовое поле supplier во всех связанных ценах для совместимости
    await prisma.supplierPrice.updateMany({
      where: { supplierId: id },
      data: { supplier: data.name }
    });

    revalidatePath("/admin/warehouse");
    revalidatePath("/admin/leads");
    return { success: true, data: updated };
  } catch (error) {
    console.error("Failed to update supplier:", error);
    return { error: "Не удалось обновить поставщика" };
  }
}

export async function deleteSupplier(id: string) {
  try {
    await prisma.supplier.delete({
      where: { id },
    });
    revalidatePath("/admin/warehouse");
    revalidatePath("/admin/leads");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete supplier:", error);
    return { error: "Не удалось удалить поставщика" };
  }
}

// ================= Supplier Prices =================

export async function getSupplierPrices() {
  try {
    const prices = await prisma.supplierPrice.findMany({
      orderBy: { supplier: "asc" },
      include: { supplierObj: true }
    });
    return { success: true, data: prices };
  } catch (error) {
    console.error("Failed to get supplier prices:", error);
    return { error: "Не удалось загрузить цены поставщиков" };
  }
}

export async function createSupplierPrice(data: {
  name: string;
  supplier: string; // текстовое имя
  supplierId?: string | null; // ссылка на контрагента
  price: number;
  unit: InventoryUnit;
}) {
  try {
    let finalSupplierName = data.supplier;

    // Если передан supplierId, возьмем название оттуда для точности
    if (data.supplierId) {
      const sup = await prisma.supplier.findUnique({
        where: { id: data.supplierId }
      });
      if (sup) {
        finalSupplierName = sup.name;
      }
    }

    const newPrice = await prisma.supplierPrice.create({
      data: {
        name: data.name,
        supplier: finalSupplierName,
        supplierId: data.supplierId || null,
        price: data.price,
        unit: data.unit,
      },
    });

    revalidatePath("/admin/warehouse");
    revalidatePath("/admin/leads");
    return { success: true, data: newPrice };
  } catch (error) {
    console.error("Failed to create supplier price:", error);
    return { error: "Не удалось добавить цену поставщика" };
  }
}

export async function updateSupplierPrice(
  id: string,
  data: {
    name: string;
    supplier: string;
    supplierId?: string | null;
    price: number;
    unit: InventoryUnit;
  }
) {
  try {
    let finalSupplierName = data.supplier;

    if (data.supplierId) {
      const sup = await prisma.supplier.findUnique({
        where: { id: data.supplierId }
      });
      if (sup) {
        finalSupplierName = sup.name;
      }
    }

    const updated = await prisma.supplierPrice.update({
      where: { id },
      data: {
        name: data.name,
        supplier: finalSupplierName,
        supplierId: data.supplierId || null,
        price: data.price,
        unit: data.unit,
      },
    });

    revalidatePath("/admin/warehouse");
    revalidatePath("/admin/leads");
    return { success: true, data: updated };
  } catch (error) {
    console.error("Failed to update supplier price:", error);
    return { error: "Не удалось обновить цену поставщика" };
  }
}

export async function deleteSupplierPrice(id: string) {
  try {
    await prisma.supplierPrice.delete({
      where: { id },
    });
    revalidatePath("/admin/warehouse");
    revalidatePath("/admin/leads");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete supplier price:", error);
    return { error: "Не удалось удалить цену поставщика" };
  }
}

// ================= Warehouse Transactions Log =================

export async function getWarehouseTransactions() {
  try {
    const logs = await prisma.warehouseTransaction.findMany({
      include: {
        item: true,
      },
      orderBy: { createdAt: "desc" },
      take: 200, // ограничение на последние 200 логов
    });
    return { success: true, data: logs };
  } catch (error) {
    console.error("Failed to get warehouse transactions:", error);
    return { error: "Не удалось загрузить историю транзакций склада" };
  }
}
