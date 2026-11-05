"use server";

import { prisma } from "@/lib/prisma";
import { EstimateItemType, InventoryUnit, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { STARTER_PRESETS } from "./_data/estimateSpreadsheetDictionary";
import { 
  CalculatorWarehouseItem, 
  CalculatorSupplierPrice, 
  CalculatorWorkOperation, 
  EstimatePresetData, 
  EstimatePresetItem,
  CalculatorInitialData
} from "./_types/calculatorTypes";

export async function getCalculatorData(): Promise<{ success: boolean; data?: CalculatorInitialData; error?: string }> {
  try {
    const [warehouseRaw, supplierRaw, workOperationsRaw, presetsRaw, leadsRaw] = await Promise.all([
      prisma.warehouseItem.findMany({
        orderBy: { name: "asc" },
      }),
      prisma.supplierPrice.findMany({
        orderBy: [
          { isFavorite: "desc" },
          { supplier: "asc" },
          { name: "asc" },
        ],
        include: {
          supplierObj: {
            select: { id: true, phone: true, whatsapp: true, address: true },
          },
        },
      }),
      prisma.workOperation.findMany({
        orderBy: { name: "asc" },
      }),
      prisma.estimatePreset.findMany({
        orderBy: [
          { isFavorite: "desc" },
          { name: "asc" },
        ],
      }),
      prisma.lead.findMany({
        where: {
          status: { in: ["NEW", "IN_PROGRESS", "ESTIMATE"] },
        },
        select: {
          id: true,
          name: true,
          phone: true,
          status: true,
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
    ]);

    // Если пресетов в БД еще нет, автоматически инициализируем базовые типовые шаблоны
    let finalPresets = presetsRaw;
    if (presetsRaw.length === 0) {
      try {
        await Promise.all(
          STARTER_PRESETS.map((p) =>
            prisma.estimatePreset.create({
              data: {
                name: p.name,
                category: p.category,
                description: p.description,
                items: p.items as unknown as Prisma.InputJsonValue,
                isFavorite: true,
              },
            })
          )
        );
        finalPresets = await prisma.estimatePreset.findMany({
          orderBy: [{ isFavorite: "desc" }, { name: "asc" }],
        });
      } catch (seedError) {
        console.warn("Could not seed starter presets:", seedError);
      }
    }

    const warehouseItems: CalculatorWarehouseItem[] = warehouseRaw.map((w) => ({
      id: w.id,
      name: w.name,
      category: w.category,
      quantity: w.quantity,
      unit: w.unit,
      price: w.price,
    }));

    const supplierPrices: CalculatorSupplierPrice[] = supplierRaw.map((s) => ({
      id: s.id,
      name: s.name,
      supplier: s.supplier,
      price: s.price,
      unit: s.unit,
      category: s.category,
      subcategory: s.subcategory,
      imageUrl: s.imageUrl,
      description: s.description,
      sourceUrl: s.sourceUrl,
      isService: s.isService,
      isFavorite: s.isFavorite,
      supplierObj: s.supplierObj,
    }));

    const workOperations: CalculatorWorkOperation[] = workOperationsRaw.map((op) => ({
      id: op.id,
      type: op.type,
      name: op.name,
      unit: op.unit,
      defaultCost: op.defaultCost,
      defaultPrice: op.defaultPrice,
      isCustom: op.isCustom,
    }));

    const presets: EstimatePresetData[] = finalPresets.map((p) => ({
      id: p.id,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      name: p.name,
      category: p.category,
      description: p.description,
      items: (Array.isArray(p.items) ? p.items : []) as unknown as EstimatePresetItem[],
      isFavorite: p.isFavorite,
    }));

    const leads = leadsRaw.map((l) => ({
      id: l.id,
      name: l.name,
      phone: l.phone,
      status: l.status,
    }));

    return {
      success: true,
      data: {
        warehouseItems,
        supplierPrices,
        workOperations,
        presets,
        leads,
      },
    };
  } catch (error) {
    console.error("Failed to load calculator data:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Не удалось загрузить данные калькулятора",
    };
  }
}

export async function saveEstimatePreset(data: {
  id?: string;
  name: string;
  category?: string | null;
  description?: string | null;
  items: EstimatePresetItem[];
  isFavorite?: boolean;
}) {
  try {
    if (!data.name.trim()) {
      return { success: false, error: "Укажите название шаблона" };
    }
    if (!data.items || data.items.length === 0) {
      return { success: false, error: "Шаблон не может быть пустым" };
    }

    let preset;
    if (data.id) {
      preset = await prisma.estimatePreset.update({
        where: { id: data.id },
        data: {
          name: data.name.trim(),
          category: data.category?.trim() || null,
          description: data.description?.trim() || null,
          items: data.items as unknown as Prisma.InputJsonValue,
          isFavorite: data.isFavorite ?? false,
        },
      });
    } else {
      preset = await prisma.estimatePreset.create({
        data: {
          name: data.name.trim(),
          category: data.category?.trim() || null,
          description: data.description?.trim() || null,
          items: data.items as unknown as Prisma.InputJsonValue,
          isFavorite: data.isFavorite ?? false,
        },
      });
    }

    revalidatePath("/admin/calculator");
    return {
      success: true,
      data: {
        id: preset.id,
        createdAt: preset.createdAt,
        updatedAt: preset.updatedAt,
        name: preset.name,
        category: preset.category,
        description: preset.description,
        items: preset.items as unknown as EstimatePresetItem[],
        isFavorite: preset.isFavorite,
      },
    };
  } catch (error) {
    console.error("Failed to save estimate preset:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Не удалось сохранить шаблон",
    };
  }
}

export async function deleteEstimatePreset(id: string) {
  try {
    await prisma.estimatePreset.delete({
      where: { id },
    });
    revalidatePath("/admin/calculator");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete estimate preset:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Не удалось удалить шаблон",
    };
  }
}

export async function togglePresetFavorite(id: string, isFavorite: boolean) {
  try {
    const updated = await prisma.estimatePreset.update({
      where: { id },
      data: { isFavorite },
    });
    revalidatePath("/admin/calculator");
    return { success: true, isFavorite: updated.isFavorite };
  } catch (error) {
    console.error("Failed to toggle preset favorite:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Ошибка обновления избранного",
    };
  }
}

export async function saveEstimateToLead(
  leadId: string,
  items: Array<{
    type: EstimateItemType;
    name: string;
    quantity: number;
    unit: InventoryUnit | null;
    costPrice: number;
    sellPrice: number;
    warehouseItemId?: string | null;
  }>
) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      let estimate = await tx.leadEstimate.findUnique({
        where: { leadId },
      });

      if (!estimate) {
        estimate = await tx.leadEstimate.create({
          data: { leadId },
        });
      }

      await tx.estimateItem.deleteMany({
        where: { estimateId: estimate.id },
      });

      if (items.length > 0) {
        await tx.estimateItem.createMany({
          data: items.map((i) => ({
            estimateId: estimate.id,
            type: i.type,
            name: i.name,
            quantity: Number(i.quantity) || 1,
            unit: i.unit,
            costPrice: Number(i.costPrice) || 0,
            sellPrice: Number(i.sellPrice) || 0,
            warehouseItemId: i.warehouseItemId || null,
          })),
        });
      }

      const totalSellPrice = items.reduce(
        (acc, item) => acc + (Number(item.quantity) || 0) * (Number(item.sellPrice) || 0),
        0
      );

      await tx.lead.update({
        where: { id: leadId },
        data: {
          calcDetails: `Смета обновлена из калькулятора: ${items.length} поз. на сумму ${totalSellPrice.toLocaleString("ru-RU")} ₸`,
        },
      });

      return { estimateId: estimate.id, totalSellPrice };
    });

    revalidatePath("/admin/leads");
    revalidatePath("/admin/calculator");
    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to save estimate to lead:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Не удалось сохранить расчет в сделку",
    };
  }
}

export async function createLeadFromEstimate(
  leadData: {
    name: string;
    phone: string;
    address?: string;
    comment?: string;
  },
  items: Array<{
    type: EstimateItemType;
    name: string;
    quantity: number;
    unit: InventoryUnit | null;
    costPrice: number;
    sellPrice: number;
    warehouseItemId?: string | null;
  }>
) {
  try {
    if (!leadData.name.trim() || !leadData.phone.trim()) {
      return { success: false, error: "Укажите имя и телефон клиента" };
    }

    const totalSellPrice = items.reduce(
      (acc, item) => acc + (Number(item.quantity) || 0) * (Number(item.sellPrice) || 0),
      0
    );

    const result = await prisma.$transaction(async (tx) => {
      const newLead = await tx.lead.create({
        data: {
          name: leadData.name.trim(),
          phone: leadData.phone.trim(),
          address: leadData.address?.trim() || null,
          comment: leadData.comment?.trim() || null,
          source: "Калькулятор смет (Ручной просчет)",
          status: "ESTIMATE",
          calcDetails: `Создана смета: ${items.length} поз. на сумму ${totalSellPrice.toLocaleString("ru-RU")} ₸`,
        },
      });

      const estimate = await tx.leadEstimate.create({
        data: { leadId: newLead.id },
      });

      if (items.length > 0) {
        await tx.estimateItem.createMany({
          data: items.map((i) => ({
            estimateId: estimate.id,
            type: i.type,
            name: i.name,
            quantity: Number(i.quantity) || 1,
            unit: i.unit,
            costPrice: Number(i.costPrice) || 0,
            sellPrice: Number(i.sellPrice) || 0,
            warehouseItemId: i.warehouseItemId || null,
          })),
        });
      }

      return { leadId: newLead.id, leadName: newLead.name };
    });

    revalidatePath("/admin/leads");
    revalidatePath("/admin/calculator");
    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to create lead from estimate:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Не удалось создать сделку",
    };
  }
}
