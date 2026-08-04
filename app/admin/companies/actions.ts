"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ClientRating, ProjectStatus } from "@prisma/client";

/**
 * Создать новую компанию
 */
export async function createCompany(data: {
  name: string;
  binIin?: string;
  industry?: string;
  legalAddress?: string;
  bankAccount?: string;
  rating?: ClientRating;
  notes?: string;
}) {
  try {
    const company = await prisma.company.create({
      data: {
        name: data.name.trim(),
        binIin: data.binIin?.trim() || null,
        industry: data.industry?.trim() || null,
        legalAddress: data.legalAddress?.trim() || null,
        bankAccount: data.bankAccount?.trim() || null,
        rating: data.rating || ClientRating.STANDARD,
        notes: data.notes?.trim() || null,
      },
    });

    revalidatePath("/admin/companies");
    return { success: true as const, companyId: company.id };
  } catch (error: any) {
    console.error("Ошибка создания компании:", error);
    return { error: error.message || "Не удалось создать компанию" };
  }
}

/**
 * Обновить компанию
 */
export async function updateCompany(
  companyId: string,
  rawJson: string
) {
  try {
    const data = JSON.parse(rawJson) as {
      name?: string;
      binIin?: string;
      industry?: string;
      legalAddress?: string;
      bankAccount?: string;
      rating?: ClientRating;
      notes?: string;
    };

    await prisma.company.update({
      where: { id: companyId },
      data: {
        ...(data.name && { name: data.name.trim() }),
        ...(data.binIin !== undefined && { binIin: data.binIin?.trim() || null }),
        ...(data.industry !== undefined && { industry: data.industry?.trim() || null }),
        ...(data.legalAddress !== undefined && { legalAddress: data.legalAddress?.trim() || null }),
        ...(data.bankAccount !== undefined && { bankAccount: data.bankAccount?.trim() || null }),
        ...(data.rating && { rating: data.rating }),
        ...(data.notes !== undefined && { notes: data.notes?.trim() || null }),
      },
    });

    revalidatePath(`/admin/companies/${companyId}`);
    revalidatePath("/admin/companies");
    return { success: true as const };
  } catch (error: any) {
    console.error("Ошибка обновления компании:", error);
    return { error: error.message || "Не удалось обновить компанию" };
  }
}

/**
 * Удалить компанию
 */
export async function deleteCompany(companyId: string) {
  try {
    await prisma.company.delete({
      where: { id: companyId },
    });

    revalidatePath("/admin/companies");
    return { success: true as const };
  } catch (error: any) {
    console.error("Ошибка удаления компании:", error);
    return { error: error.message || "Не удалось удалить компанию" };
  }
}

/**
 * Нормализация телефона (удаляет +7, 8, 7 и пробелы, оставляет последние 10 цифр)
 */
function normalizePhoneDigits(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 ? digits.slice(-10) : digits;
}

/**
 * Добавить контакт (ЛПР / сотрудника) в компанию
 */
export async function createContact(data: {
  companyId: string;
  name: string;
  position?: string;
  phone: string;
  email?: string;
  whatsapp?: string;
  isDecisionMaker?: boolean;
  notes?: string;
}) {
  try {
    const normTarget = normalizePhoneDigits(data.phone);

    // Проверяем, есть ли уже такой контакт в этой или любой компании
    const existingContacts = await prisma.contact.findMany({
      where: { companyId: data.companyId },
    });

    const isDuplicateInCompany = existingContacts.some(
      (c) => normalizePhoneDigits(c.phone) === normTarget
    );

    if (isDuplicateInCompany) {
      return { error: `Контакт с номером ${data.phone} уже существует в этой компании!` };
    }

    const contact = await prisma.contact.create({
      data: {
        companyId: data.companyId,
        name: data.name.trim(),
        position: data.position?.trim() || null,
        phone: data.phone.trim(),
        email: data.email?.trim() || null,
        whatsapp: data.whatsapp?.trim() || null,
        isDecisionMaker: data.isDecisionMaker ?? false,
        notes: data.notes?.trim() || null,
      },
    });

    revalidatePath(`/admin/companies/${data.companyId}`);
    return { success: true as const, contactId: contact.id };
  } catch (error: any) {
    console.error("Ошибка создания контакта:", error);
    return { error: error.message || "Не удалось добавить контакт" };
  }
}

/**
 * Удалить контакт
 */
export async function deleteContact(contactId: string, companyId: string) {
  try {
    await prisma.contact.delete({
      where: { id: contactId },
    });

    revalidatePath(`/admin/companies/${companyId}`);
    return { success: true as const };
  } catch (error: any) {
    console.error("Ошибка удаления контакта:", error);
    return { error: error.message || "Не удалось удалить контакт" };
  }
}

/**
 * Создать проект компании
 */
export async function createProject(data: {
  companyId: string;
  title: string;
  status?: ProjectStatus;
  budget?: number;
  notes?: string;
}) {
  try {
    const project = await prisma.project.create({
      data: {
        companyId: data.companyId,
        title: data.title.trim(),
        status: data.status || ProjectStatus.IN_PROGRESS,
        budget: data.budget || 0,
        notes: data.notes?.trim() || null,
      },
    });

    revalidatePath(`/admin/companies/${data.companyId}`);
    return { success: true as const, projectId: project.id };
  } catch (error: any) {
    console.error("Ошибка создания проекта:", error);
    return { error: error.message || "Не удалось создать проект" };
  }
}

/**
 * Привязать лид к компании, проекту и контакту
 */
export async function linkLeadToB2B(
  leadId: string,
  data: {
    companyId?: string | null;
    projectId?: string | null;
    contactId?: string | null;
  }
) {
  try {
    await prisma.lead.update({
      where: { id: leadId },
      data: {
        ...(data.companyId !== undefined && { companyId: data.companyId }),
        ...(data.projectId !== undefined && { projectId: data.projectId }),
        ...(data.contactId !== undefined && { contactId: data.contactId }),
      },
    });

    revalidatePath(`/admin/leads/${leadId}`);
    revalidatePath("/admin/leads");
    if (data.companyId) {
      revalidatePath(`/admin/companies/${data.companyId}`);
    }
    return { success: true as const };
  } catch (error: any) {
    console.error("Ошибка привязки лида:", error);
    return { error: error.message || "Не удалось обновить связи лида" };
  }
}
