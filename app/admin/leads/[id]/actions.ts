"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ClientRating, FileCategory, LeadStatus, PartnerName } from "@prisma/client";
import { r2Client, R2_BUCKET_NAME } from "@/lib/r2";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

/**
 * Обновление основных данных лида (включая оценку заказчика).
 * Принимает rawJson-строку чтобы избежать конфликта Prisma 7.x + Next.js 16 Server Action proxy.
 */
export async function updateLeadMainData(leadId: string, rawJson: string) {
  try {
    const data = JSON.parse(rawJson) as {
      name?: string;
      phone?: string;
      status?: string;
      rating?: string;
      source?: string;
      comment?: string;
      address?: string;
      appointmentDate?: string | null;
      deadline?: string | null;
      manager?: string | null;
      offeredPrice?: number | null;
      isDiscounted?: boolean;
      companyId?: string | null;
      projectId?: string | null;
      contactId?: string | null;
      calcDetails?: string | null;
      prepayment?: number | null;
      isPrepaymentPaid?: boolean;
      isBalancePaid?: boolean;
    };

    await prisma.lead.update({
      where: { id: leadId },
      data: {
        ...(data.name     !== undefined && { name:    data.name }),
        ...(data.phone    !== undefined && { phone:   data.phone }),
        ...(data.status   !== undefined && { status:  data.status  as LeadStatus }),
        ...(data.rating   !== undefined && { rating:  data.rating  as ClientRating }),
        ...(data.source   !== undefined && { source:  data.source }),
        ...(data.comment  !== undefined && { comment: data.comment }),
        ...(data.address  !== undefined && { address: data.address }),
        ...(data.calcDetails !== undefined && { calcDetails: data.calcDetails }),
        ...(data.appointmentDate !== undefined && {
          appointmentDate: data.appointmentDate ? new Date(data.appointmentDate) : null,
        }),
        ...(data.deadline !== undefined && {
          deadline: data.deadline ? new Date(data.deadline) : null,
        }),
        ...(data.manager !== undefined && {
          manager: (data.manager as PartnerName) || null,
        }),
        ...(data.offeredPrice !== undefined && {
          offeredPrice: data.offeredPrice === null || isNaN(Number(data.offeredPrice)) ? null : Number(data.offeredPrice),
        }),
        ...(data.isDiscounted !== undefined && {
          isDiscounted: Boolean(data.isDiscounted),
        }),
        ...(data.prepayment !== undefined && {
          prepayment: data.prepayment === null || isNaN(Number(data.prepayment)) ? 0 : Number(data.prepayment),
        }),
        ...(data.isPrepaymentPaid !== undefined && {
          isPrepaymentPaid: Boolean(data.isPrepaymentPaid),
        }),
        ...(data.isBalancePaid !== undefined && {
          isBalancePaid: Boolean(data.isBalancePaid),
        }),
        ...(data.companyId !== undefined && { companyId: data.companyId }),
        ...(data.projectId !== undefined && { projectId: data.projectId }),
        ...(data.contactId !== undefined && { contactId: data.contactId }),
      },
    });

    revalidatePath(`/admin/leads/${leadId}`);
    revalidatePath("/admin/leads");
    return { success: true as const };
  } catch (error: any) {
    console.error("Ошибка при обновлении данных лида:", error);
    return { error: error.message || "Не удалось обновить данные" };
  }
}

/**
 * Добавление хронологической заметки / активности
 */
export async function addLeadActivity(
  leadId: string,
  text: string,
  type: string = "NOTE",
  author?: string
) {
  try {
    if (!text.trim()) {
      return { error: "Текст записи не может быть пустым" };
    }

    const activity = await prisma.leadActivity.create({
      data: {
        leadId,
        text: text.trim(),
        type,
        author: author || "Менеджер",
      },
    });

    revalidatePath(`/admin/leads/${leadId}`);
    return { success: true, data: JSON.parse(JSON.stringify(activity)) };
  } catch (error: any) {
    console.error("Ошибка добавления активности:", error);
    return { error: error.message || "Не удалось добавить запись" };
  }
}

/**
 * Удаление заметки из таймлайна
 */
export async function deleteLeadActivity(activityId: string, leadId: string) {
  try {
    await prisma.leadActivity.delete({
      where: { id: activityId },
    });
    revalidatePath(`/admin/leads/${leadId}`);
    return { success: true };
  } catch (error: any) {
    console.error("Ошибка удаления активности:", error);
    return { error: error.message || "Не удалось удалить запись" };
  }
}

/**
 * Редактирование текста заметки в таймлайне
 */
export async function updateLeadActivity(
  activityId: string,
  text: string,
  leadId: string
) {
  try {
    if (!text.trim()) {
      return { error: "Текст записи не может быть пустым" };
    }

    const updated = await prisma.leadActivity.update({
      where: { id: activityId },
      data: {
        text: text.trim(),
      },
    });

    revalidatePath(`/admin/leads/${leadId}`);
    return { success: true, data: JSON.parse(JSON.stringify(updated)) };
  } catch (error: any) {
    console.error("Ошибка обновления активности:", error);
    return { error: error.message || "Не удалось обновить запись" };
  }
}

/**
 * Сохранение информации о загруженном в Cloudflare R2 файле
 */
export async function saveLeadFileRecord(
  leadId: string,
  fileData: {
    name: string;
    url: string;
    fileKey: string;
    size: number;
    mimeType: string;
    category: FileCategory;
  }
) {
  try {
    const record = await prisma.leadFile.create({
      data: {
        leadId,
        name: fileData.name,
        url: fileData.url,
        fileKey: fileData.fileKey,
        size: fileData.size,
        mimeType: fileData.mimeType,
        category: fileData.category,
      },
    });

    revalidatePath(`/admin/leads/${leadId}`);
    return { success: true, data: JSON.parse(JSON.stringify(record)) };
  } catch (error: any) {
    console.error("Ошибка сохранения записи о файле:", error);
    return { error: error.message || "Не удалось привязать файл" };
  }
}

/**
 * Удаление файла из Cloudflare R2 и БД
 */
export async function deleteLeadFile(fileId: string, leadId: string) {
  try {
    const fileRecord = await prisma.leadFile.findUnique({
      where: { id: fileId },
    });

    if (!fileRecord) {
      return { error: "Файл не найден" };
    }

    // Удаляем из Cloudflare R2 бакета
    try {
      const command = new DeleteObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: fileRecord.fileKey,
      });
      await r2Client.send(command);
    } catch (r2Err) {
      console.warn("Ошибка при удалении файла из R2 (продолжаем удаление из БД):", r2Err);
    }

    // Удаляем из БД
    await prisma.leadFile.delete({
      where: { id: fileId },
    });

    revalidatePath(`/admin/leads/${leadId}`);
    return { success: true };
  } catch (error: any) {
    console.error("Ошибка при удалении файла:", error);
    return { error: error.message || "Не удалось удалить файл" };
  }
}
