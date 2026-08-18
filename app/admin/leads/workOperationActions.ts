"use server";

import { prisma } from "@/lib/prisma";
import { EstimateItemType, InventoryUnit } from "@prisma/client";
import { DEFAULT_WORK_OPERATIONS } from "../pricing/_data/pricingDictionary";

/**
 * Получить все доступные виды работ (с авто-инициализацией стандартного каталога)
 */
export async function getWorkOperations(type?: EstimateItemType) {
  try {
    let operations = await prisma.workOperation.findMany({
      where: type ? { type } : undefined,
      orderBy: { name: "asc" },
    });

    // Если база пуста, наполняем базовым списком операций
    if (operations.length === 0) {
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

      operations = await prisma.workOperation.findMany({
        where: type ? { type } : undefined,
        orderBy: { name: "asc" },
      });
    }

    return { success: true, data: operations };
  } catch (error) {
    console.error("Failed to get work operations:", error);
    // Возвращаем fallback из памяти, если БД еще мигрируется
    const filtered = type ? DEFAULT_WORK_OPERATIONS.filter(o => o.type === type) : DEFAULT_WORK_OPERATIONS;
    return { success: true, data: filtered.map((o, idx) => ({ id: `fallback-${idx}`, ...o, isCustom: false })) };
  }
}

/**
 * Сохранить новую кастомную операцию или обновить существующую
 */
export async function saveWorkOperation(data: {
  type: EstimateItemType;
  name: string;
  unit?: InventoryUnit;
  defaultCost?: number;
  defaultPrice?: number;
}) {
  try {
    const trimmedName = data.name.trim();
    if (!trimmedName) {
      return { error: "Название операции не может быть пустым" };
    }

    const op = await prisma.workOperation.upsert({
      where: { name: trimmedName },
      update: {
        type: data.type,
        unit: data.unit || InventoryUnit.PIECE,
        defaultCost: data.defaultCost || 0,
        defaultPrice: data.defaultPrice || Math.round((data.defaultCost || 0) * 1.3),
      },
      create: {
        type: data.type,
        name: trimmedName,
        unit: data.unit || InventoryUnit.PIECE,
        defaultCost: data.defaultCost || 0,
        defaultPrice: data.defaultPrice || Math.round((data.defaultCost || 0) * 1.3),
        isCustom: true,
      },
    });

    return { success: true, data: op };
  } catch (error) {
    console.error("Failed to save work operation:", error);
    return { error: "Не удалось сохранить операцию" };
  }
}
