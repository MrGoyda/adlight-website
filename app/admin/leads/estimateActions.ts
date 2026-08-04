"use server";

import { prisma } from "@/lib/prisma";
import { EstimateItemType, InventoryUnit } from "@prisma/client";

export async function createWarehouseItem(data: {
  name: string;
  category: string;
  quantity: number;
  unit: InventoryUnit;
  price: number;
  location?: string | null;
  minStock?: number;
}) {
  try {
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

    if (data.quantity > 0) {
      await prisma.warehouseTransaction.create({
        data: {
          itemId: newItem.id,
          quantityChanged: data.quantity,
          description: "Начальное оприходование",
        },
      });
    }

    return { success: true, data: newItem };
  } catch (error: any) {
    console.error("Failed to create warehouse item:", error);
    if (error.code === "P2002") {
      return { error: "Материал с таким названием уже существует" };
    }
    return { error: "Не удалось добавить материал" };
  }
}

export async function getWarehouseItems() {
  try {
    const items = await prisma.warehouseItem.findMany({
      orderBy: { name: "asc" },
    });
    return { success: true, data: items };
  } catch (error) {
    console.error("Failed to get warehouse items:", error);
    return { error: "Не удалось загрузить склад" };
  }
}

export async function saveLeadEstimate(
  leadId: string | null,
  items: Array<{
    type: EstimateItemType;
    name: string;
    quantity: number;
    unit: InventoryUnit | null;
    costPrice: number;
    sellPrice: number;
    warehouseItemId?: string | null;
  }>,
  estimateId?: string | null
) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      let estimate = null;

      if (estimateId) {
        estimate = await tx.leadEstimate.findUnique({
          where: { id: estimateId },
        });
      } else if (leadId) {
        estimate = await tx.leadEstimate.findUnique({
          where: { leadId },
        });
      }

      if (!estimate) {
        estimate = await tx.leadEstimate.create({
          data: {
            id: estimateId || undefined,
            leadId: leadId || undefined,
          },
        });
      } else if (leadId && estimate.leadId !== leadId) {
        // Если лид изменился
        estimate = await tx.leadEstimate.update({
          where: { id: estimate.id },
          data: { leadId },
        });
      }

      await tx.estimateItem.deleteMany({
        where: { estimateId: estimate.id },
      });

      if (items.length > 0) {
        await tx.estimateItem.createMany({
          data: items.map((item) => ({
            estimateId: estimate!.id,
            type: item.type,
            name: item.name,
            quantity: item.quantity,
            unit: item.unit,
            costPrice: item.costPrice,
            sellPrice: item.sellPrice,
            warehouseItemId: item.warehouseItemId || null,
          })),
        });
      }

      // Если лид привязан, обновим его выручку и расходы
      if (leadId) {
        const totalCost = items.reduce((sum, item) => sum + (item.costPrice * item.quantity), 0);
        const totalRevenue = items.reduce((sum, item) => sum + (item.sellPrice * item.quantity), 0);

        await tx.lead.update({
          where: { id: leadId },
          data: {
            revenue: totalRevenue,
            expenses: totalCost,
          },
        });
      }

      return estimate;
    });

    return { success: true, data: result };
  } catch (error: any) {
    console.error("Failed to save estimate:", error);
    return { error: error.message || "Не удалось сохранить калькуляцию" };
  }
}

export async function linkEstimateToLead(estimateId: string, leadId: string) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Проверяем, есть ли уже смета у этого лида
      const existing = await tx.leadEstimate.findUnique({
        where: { leadId }
      });
      
      if (existing && existing.id !== estimateId) {
        throw new Error("У этой сделки уже есть смета. Удалите её сначала или отвяжите.");
      }

      // Обновляем смету
      const updated = await tx.leadEstimate.update({
        where: { id: estimateId },
        data: { leadId },
        include: { items: true }
      });

      // Пересчитаем доходы/расходы для лида
      const totalCost = updated.items.reduce((sum, item) => sum + (item.costPrice * item.quantity), 0);
      const totalRevenue = updated.items.reduce((sum, item) => sum + (item.sellPrice * item.quantity), 0);

      await tx.lead.update({
        where: { id: leadId },
        data: {
          revenue: totalRevenue,
          expenses: totalCost,
        },
      });

      return updated;
    });

    return { success: true, data: result };
  } catch (error: any) {
    console.error("Failed to link estimate:", error);
    return { error: error.message || "Не удалось связать смету" };
  }
}

export async function deductEstimateStock(leadId: string) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const estimate = await tx.leadEstimate.findUnique({
        where: { leadId },
        include: {
          items: {
            where: {
              type: EstimateItemType.MATERIAL_STOCK,
              warehouseItemId: { not: null },
            },
          },
        },
      });

      if (!estimate) throw new Error("Смета не найдена");
      if (estimate.isStockDeducted) throw new Error("Материалы уже списаны");

      for (const item of estimate.items) {
        const warehouseItem = await tx.warehouseItem.findUnique({
          where: { id: item.warehouseItemId! },
        });

        if (!warehouseItem) {
          throw new Error(`Материал "${item.name}" не найден на складе`);
        }

        if (warehouseItem.quantity < item.quantity) {
          throw new Error(
            `Недостаточно материала "${warehouseItem.name}" на складе. Требуется: ${item.quantity}, доступно: ${warehouseItem.quantity}`
          );
        }

        await tx.warehouseItem.update({
          where: { id: warehouseItem.id },
          data: {
            quantity: warehouseItem.quantity - item.quantity,
          },
        });

        await tx.warehouseTransaction.create({
          data: {
            itemId: warehouseItem.id,
            quantityChanged: -item.quantity,
            description: `Автоматическое списание под проект сметы сделки`,
            leadId,
          },
        });
      }

      const updated = await tx.leadEstimate.update({
        where: { id: estimate.id },
        data: { isStockDeducted: true },
      });

      return updated;
    });

    return { success: true, data: result };
  } catch (error: any) {
    console.error("Failed to deduct stock:", error);
    return { error: error.message || "Не удалось списать остатки" };
  }
}
