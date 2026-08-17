"use server";

import { prisma } from "@/lib/prisma";
import { EstimateItemType, InventoryUnit } from "@prisma/client";

const DEFAULT_OPERATIONS = [
  // ── СБОРКА И ПРОИЗВОДСТВО В ЦЕХУ (ASSEMBLY) ──
  {
    type: EstimateItemType.ASSEMBLY,
    name: "Сборка световой вывески / букв",
    unit: InventoryUnit.PIECE,
    defaultCost: 15000,
    defaultPrice: 22000,
  },
  {
    type: EstimateItemType.ASSEMBLY,
    name: "Сборка лайтбокса (светового короба)",
    unit: InventoryUnit.SQUARE_METER,
    defaultCost: 12000,
    defaultPrice: 18000,
  },
  {
    type: EstimateItemType.ASSEMBLY,
    name: "Сварка кронштейна / металлокаркаса",
    unit: InventoryUnit.PIECE,
    defaultCost: 10000,
    defaultPrice: 15000,
  },
  {
    type: EstimateItemType.ASSEMBLY,
    name: "Закатка пленки Oracal / винила",
    unit: InventoryUnit.SQUARE_METER,
    defaultCost: 2500,
    defaultPrice: 4500,
  },
  {
    type: EstimateItemType.ASSEMBLY,
    name: "Фрезеровка и раскрой композита / ПВХ",
    unit: InventoryUnit.RUNNING_METER,
    defaultCost: 3000,
    defaultPrice: 5000,
  },
  {
    type: EstimateItemType.ASSEMBLY,
    name: "Пайка и коммутация светодиодов / блоков",
    unit: InventoryUnit.RUNNING_METER,
    defaultCost: 5000,
    defaultPrice: 8000,
  },
  {
    type: EstimateItemType.ASSEMBLY,
    name: "Сборка гибкого неона на подложке",
    unit: InventoryUnit.RUNNING_METER,
    defaultCost: 8000,
    defaultPrice: 13000,
  },

  // ── МОНТАЖНЫЕ И ДЕМОНТАЖНЫЕ РАБОТЫ (INSTALLATION) ──
  {
    type: EstimateItemType.INSTALLATION,
    name: "Монтаж фасадной вывески",
    unit: InventoryUnit.PIECE,
    defaultCost: 25000,
    defaultPrice: 35000,
  },
  {
    type: EstimateItemType.INSTALLATION,
    name: "Монтаж интерьерной вывески / логотипа",
    unit: InventoryUnit.PIECE,
    defaultCost: 15000,
    defaultPrice: 22000,
  },
  {
    type: EstimateItemType.INSTALLATION,
    name: "Высотный монтаж (вышка / альпинисты)",
    unit: InventoryUnit.PIECE,
    defaultCost: 35000,
    defaultPrice: 50000,
  },
  {
    type: EstimateItemType.INSTALLATION,
    name: "Монтаж баннера на металлокаркасе / люверсах",
    unit: InventoryUnit.SQUARE_METER,
    defaultCost: 3500,
    defaultPrice: 6000,
  },
  {
    type: EstimateItemType.INSTALLATION,
    name: "Демонтаж старой конструкции / вывески",
    unit: InventoryUnit.PIECE,
    defaultCost: 15000,
    defaultPrice: 22000,
  },
  {
    type: EstimateItemType.INSTALLATION,
    name: "Демонтаж баннера / очистка фасада от пленки",
    unit: InventoryUnit.SQUARE_METER,
    defaultCost: 2000,
    defaultPrice: 3500,
  },
  {
    type: EstimateItemType.INSTALLATION,
    name: "Подключение и разводка электрики 220V",
    unit: InventoryUnit.PIECE,
    defaultCost: 8000,
    defaultPrice: 12000,
  },
];

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
      for (const op of DEFAULT_OPERATIONS) {
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
    const filtered = type ? DEFAULT_OPERATIONS.filter(o => o.type === type) : DEFAULT_OPERATIONS;
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
