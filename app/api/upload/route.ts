import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from "@/lib/r2";

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";

    // 1. Прямая загрузка через FormData (работает надежно на всех устройствах, без CORS)
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      const folder = (formData.get("folder") as string) || "general";

      if (!file) {
        return NextResponse.json({ error: "Файл не передан" }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const fileKey = `${folder}/${Date.now()}-${cleanFileName}`;

      const command = new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: fileKey,
        Body: buffer,
        ContentType: file.type || "application/octet-stream",
        ContentDisposition: "inline",
      });

      await r2Client.send(command);
      const publicUrl = R2_PUBLIC_URL ? `${R2_PUBLIC_URL}/${fileKey}` : fileKey;

      return NextResponse.json({
        success: true,
        publicUrl,
        fileKey,
      });
    }

    // 2. Генерация presigned URL (если передан JSON)
    const { fileName, fileType, folder = "general" } = await req.json();

    if (!fileName || !fileType) {
      return NextResponse.json({ error: "fileName и fileType обязательны" }, { status: 400 });
    }

    const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileKey = `${folder}/${Date.now()}-${cleanFileName}`;

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: fileKey,
      ContentType: fileType,
      ContentDisposition: "inline",
    });

    const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 });
    const publicUrl = R2_PUBLIC_URL ? `${R2_PUBLIC_URL}/${fileKey}` : fileKey;

    return NextResponse.json({
      success: true,
      uploadUrl,
      publicUrl,
      fileKey,
    });
  } catch (error: any) {
    console.error("Ошибка загрузки в Cloudflare R2:", error);
    return NextResponse.json({ error: error.message || "Ошибка сервера при загрузке" }, { status: 500 });
  }
}
