/**
 * Загрузка файла в Cloudflare R2 через Presigned URL.
 * Работает для любых типов файлов (изображения, видео, PDF, DOCX и др.)
 */
export async function uploadFileToR2(
  file: File,
  folder: "portfolio" | "leads" | "warehouse" | "documents" | "general" = "general"
): Promise<{ success: boolean; publicUrl?: string; fileKey?: string; error?: string }> {
  try {
    // 1. Запрашиваем временную signed URL у нашего API
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type || "application/octet-stream",
        folder,
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.uploadUrl) {
      throw new Error(data.error || "Не удалось получить URL для загрузки");
    }

    // 2. Загружаем файл НАПРЯМУЮ в Cloudflare R2
    const uploadRes = await fetch(data.uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type || "application/octet-stream",
      },
      body: file,
    });

    if (!uploadRes.ok) {
      throw new Error(`Ошибка загрузки в R2: ${uploadRes.statusText}`);
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
