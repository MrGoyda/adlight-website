"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { normalizePhone, formatPhoneForMeta, formatPhoneForE164 } from "@/lib/phoneUtils";

export async function createClient(data: {
  name: string;
  phone: string;
  email?: string;
  companyName?: string;
  binIin?: string;
  contractNum?: string;
  legalAddress?: string;
  bankAccount?: string;
  notes?: string;
}) {
  try {
    const cleanPhone = normalizePhone(data.phone);

    if (!cleanPhone || cleanPhone.length < 10) {
      return { error: "Введите корректный номер телефона" };
    }

    const existing = await prisma.client.findUnique({
      where: { phone: cleanPhone },
    });

    if (existing) {
      return { error: "Клиент с таким номером телефона уже существует" };
    }

    const client = await prisma.client.create({
      data: {
        name: data.name.trim(),
        phone: cleanPhone,
        email: data.email?.trim() || null,
        companyName: data.companyName?.trim() || null,
        binIin: data.binIin?.trim() || null,
        contractNum: data.contractNum?.trim() || null,
        legalAddress: data.legalAddress?.trim() || null,
        bankAccount: data.bankAccount?.trim() || null,
        notes: data.notes?.trim() || null,
      },
    });

    // Автоматически связываем все существующие лиды с этим телефоном
    await prisma.lead.updateMany({
      where: { 
        phone: { in: [cleanPhone, data.phone] },
        clientId: null 
      },
      data: { clientId: client.id },
    });

    revalidatePath("/admin/clients");
    revalidatePath("/admin/leads");
    return { success: true, client };
  } catch (error) {
    console.error("Failed to create client:", error);
    return { error: "Не удалось создать клиента" };
  }
}

export async function updateClient(
  clientId: string,
  data: {
    name?: string;
    phone?: string;
    email?: string | null;
    companyName?: string | null;
    binIin?: string | null;
    contractNum?: string | null;
    legalAddress?: string | null;
    bankAccount?: string | null;
    notes?: string | null;
  }
) {
  try {
    const cleanPhone = data.phone ? normalizePhone(data.phone) : undefined;

    if (cleanPhone) {
      const existing = await prisma.client.findFirst({
        where: {
          phone: cleanPhone,
          id: { not: clientId },
        },
      });

      if (existing) {
        return { error: "Другой клиент с таким номером телефона уже существует" };
      }
    }

    const client = await prisma.client.update({
      where: { id: clientId },
      data: {
        name: data.name?.trim(),
        phone: cleanPhone,
        email: data.email?.trim() || null,
        companyName: data.companyName?.trim() || null,
        binIin: data.binIin?.trim() || null,
        contractNum: data.contractNum?.trim() || null,
        legalAddress: data.legalAddress?.trim() || null,
        bankAccount: data.bankAccount?.trim() || null,
        notes: data.notes?.trim() || null,
      },
    });

    revalidatePath("/admin/clients");
    revalidatePath("/admin/leads");
    return { success: true, client };
  } catch (error) {
    console.error("Failed to update client:", error);
    return { error: "Не удалось обновить карточку клиента" };
  }
}

export async function deleteClient(clientId: string) {
  try {
    await prisma.client.delete({
      where: { id: clientId },
    });

    revalidatePath("/admin/clients");
    revalidatePath("/admin/leads");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete client:", error);
    return { error: "Не удалось удалить клиента" };
  }
}

export async function linkLeadToClient(leadId: string, clientId: string | null) {
  try {
    await prisma.lead.update({
      where: { id: leadId },
      data: {
        clientId: clientId || null,
      },
    });

    revalidatePath("/admin/leads");
    revalidatePath("/admin/clients");
    return { success: true };
  } catch (error) {
    console.error("Failed to link lead to client:", error);
    return { error: "Не удалось связать лид с клиентом" };
  }
}

export async function createClientFromLead(leadId: string) {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
    });

    if (!lead) {
      return { error: "Лид не найден" };
    }

    const cleanPhone = normalizePhone(lead.phone);

    // Проверяем, существует ли уже клиент с таким телефоном
    let client = await prisma.client.findFirst({
      where: {
        OR: [
          { phone: cleanPhone },
          { phone: lead.phone }
        ]
      },
    });

    if (!client) {
      client = await prisma.client.create({
        data: {
          name: lead.name,
          phone: cleanPhone,
          notes: `Создан из лида от ${new Date(lead.createdAt).toLocaleDateString()}`,
        },
      });
    }

    // Связываем лид с клиентом
    await prisma.lead.update({
      where: { id: leadId },
      data: {
        clientId: client.id,
      },
    });

    revalidatePath("/admin/leads");
    revalidatePath("/admin/clients");
    return { success: true, clientId: client.id };
  } catch (error) {
    console.error("Failed to create client from lead:", error);
    return { error: "Не удалось создать карточку клиента из лида" };
  }
}

/**
 * 🔄 Массовая синхронизация: прогоняет все исторические заявки и гарантирует,
 * что каждый уникальный телефон есть в базе Client и связан со своими сделками.
 */
export async function syncAllLeadsToClients() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "asc" },
    });

    let createdCount = 0;
    let linkedCount = 0;

    for (const lead of leads) {
      const cleanPhone = normalizePhone(lead.phone);
      if (!cleanPhone || cleanPhone.length < 10) continue;

      let client = await prisma.client.findFirst({
        where: {
          OR: [
            { phone: cleanPhone },
            { phone: lead.phone }
          ]
        },
      });

      if (!client) {
        client = await prisma.client.create({
          data: {
            name: lead.name || "Клиент",
            phone: cleanPhone,
            notes: `Авто-импорт из лида (${lead.source || "Сделка CRM"})`,
          },
        });
        createdCount++;
      }

      if (lead.clientId !== client.id) {
        await prisma.lead.update({
          where: { id: lead.id },
          data: { clientId: client.id },
        });
        linkedCount++;
      }
    }

    revalidatePath("/admin/clients");
    revalidatePath("/admin/leads");
    return { success: true, createdCount, linkedCount, totalLeads: leads.length };
  } catch (error) {
    console.error("Failed to sync leads to clients:", error);
    return { error: "Ошибка при синхронизации базы клиентов" };
  }
}

/**
 * 📥 Пакетный импорт клиентов (из вставки текста / Excel)
 */
export async function batchImportClients(
  contacts: Array<{ name: string; phone: string; companyName?: string; notes?: string }>
) {
  try {
    let createdCount = 0;
    let skippedCount = 0;

    for (const contact of contacts) {
      const cleanPhone = normalizePhone(contact.phone);
      if (!cleanPhone || cleanPhone.length < 10) {
        skippedCount++;
        continue;
      }

      const existing = await prisma.client.findFirst({
        where: {
          OR: [
            { phone: cleanPhone },
            { phone: contact.phone }
          ]
        }
      });

      if (existing) {
        skippedCount++;
        continue;
      }

      await prisma.client.create({
        data: {
          name: contact.name.trim() || "Клиент",
          phone: cleanPhone,
          companyName: contact.companyName?.trim() || null,
          notes: contact.notes?.trim() || "Импорт базы",
        }
      });
      createdCount++;
    }

    revalidatePath("/admin/clients");
    revalidatePath("/admin/leads");
    return { success: true, createdCount, skippedCount };
  } catch (error) {
    console.error("Failed to batch import clients:", error);
    return { error: "Ошибка при массовом импорте контактов" };
  }
}

/**
 * 🎯 Получение аудитории клиентов для таргетинга (Facebook Lookalike, Яндекс Аудитории)
 */
export async function getAudienceExportData(filter: "ALL" | "PAID_DEALS" | "COMPANIES") {
  try {
    const clients = await prisma.client.findMany({
      include: {
        leads: {
          select: {
            id: true,
            status: true,
            revenue: true,
            createdAt: true,
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    let filtered = clients;

    if (filter === "PAID_DEALS") {
      filtered = clients.filter(c => c.leads.some(l => l.revenue > 0 || l.status === "COMPLETED"));
    } else if (filter === "COMPANIES") {
      filtered = clients.filter(c => Boolean(c.companyName || c.binIin));
    }

    const exportRows = filtered.map(c => {
      const totalRevenue = c.leads.reduce((sum, l) => sum + (l.revenue || 0), 0);
      const dealsCount = c.leads.length;

      return {
        id: c.id,
        name: c.name,
        phoneRaw: c.phone,
        phoneMeta: formatPhoneForMeta(c.phone),
        phoneE164: formatPhoneForE164(c.phone),
        companyName: c.companyName || "",
        email: c.email || "",
        dealsCount,
        totalRevenue,
        createdAt: c.createdAt.toISOString(),
      };
    });

    return { success: true, data: exportRows, count: exportRows.length };
  } catch (error) {
    console.error("Failed to fetch audience export data:", error);
    return { error: "Не удалось сформировать выгрузку аудитории" };
  }
}
