"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ProjectStatus } from "@prisma/client";

/**
 * Обновление статуса или заметок проекта
 */
export async function updateProjectData(projectId: string, rawJson: string) {
  try {
    const data = JSON.parse(rawJson) as {
      title?: string;
      status?: ProjectStatus;
      budget?: number;
      notes?: string;
    };

    await prisma.project.update({
      where: { id: projectId },
      data: {
        ...(data.title && { title: data.title.trim() }),
        ...(data.status && { status: data.status }),
        ...(data.budget !== undefined && { budget: data.budget }),
        ...(data.notes !== undefined && { notes: data.notes?.trim() || null }),
      },
    });

    revalidatePath(`/admin/projects/${projectId}`);
    revalidatePath("/admin/projects");
    return { success: true as const };
  } catch (error: any) {
    console.error("Ошибка при обновлении проекта:", error);
    return { error: error.message || "Не удалось обновить проект" };
  }
}

/**
 * Удалить проект
 */
export async function deleteProject(projectId: string) {
  try {
    await prisma.project.delete({
      where: { id: projectId },
    });

    revalidatePath("/admin/projects");
    return { success: true as const };
  } catch (error: any) {
    console.error("Ошибка при удалении проекта:", error);
    return { error: error.message || "Не удалось удалить проект" };
  }
}
