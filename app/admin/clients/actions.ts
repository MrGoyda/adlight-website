"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
    const existing = await prisma.client.findUnique({
      where: { phone: data.phone },
    });

    if (existing) {
      return { error: "Клиент с таким номером телефона уже существует" };
    }

    const client = await prisma.client.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        companyName: data.companyName || null,
        binIin: data.binIin || null,
        contractNum: data.contractNum || null,
        legalAddress: data.legalAddress || null,
        bankAccount: data.bankAccount || null,
        notes: data.notes || null,
      },
    });

    revalidatePath("/admin/clients");
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
    if (data.phone) {
      const existing = await prisma.client.findFirst({
        where: {
          phone: data.phone,
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
        name: data.name,
        phone: data.phone,
        email: data.email,
        companyName: data.companyName,
        binIin: data.binIin,
        contractNum: data.contractNum,
        legalAddress: data.legalAddress,
        bankAccount: data.bankAccount,
        notes: data.notes,
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

    // Проверяем, существует ли уже клиент с таким телефоном
    let client = await prisma.client.findUnique({
      where: { phone: lead.phone },
    });

    if (!client) {
      // Создаем нового клиента на основе данных лида
      client = await prisma.client.create({
        data: {
          name: lead.name,
          phone: lead.phone,
          notes: `Создан автоматически из лида от ${new Date(lead.createdAt).toLocaleDateString()}`,
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
