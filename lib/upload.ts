/**
 * Надежная загрузка файла в Cloudflare R2 через серверный API.
 * Работает для любых типов файлов (изображения, видео, PDF, DOCX и др.)
 * Полностью исключает CORS-ошибки (Load failed) на мобильных устройствах (iOS Safari).
 */
export async function uploadFileToR2(
  file: File,
  folder: "portfolio" | "leads" | "warehouse" | "documents" | "general" = "general"
): Promise<{ success: boolean; publicUrl?: string; fileKey?: string; error?: string }> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Не удалось загрузить файл в хранилище");
    }

    return {
      success: true,
      publicUrl: data.publicUrl,
      fileKey: data.fileKey,
    };
  } catch (err: any) {
    console.error("Ошибка при загрузке файла в R2:", err);
    return {
      success: false,
      error: err.message || "Неизвестная ошибка загрузки",
    };
  }
}
