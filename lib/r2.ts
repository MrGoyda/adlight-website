import { S3Client } from "@aws-sdk/client-s3";

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim() || "";
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim() || "";

if (!accountId || !accessKeyId || !secretAccessKey) {
  console.warn("⚠️ Предупреждение: Переменные Cloudflare R2 не полностью заданы в окружении");
}

export const r2Client = new S3Client({
  region: "auto",
  endpoint: accountId 
    ? `https://${accountId}.r2.cloudflarestorage.com` 
    : undefined,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME?.trim() || "adlight";
export const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.trim() || "https://media.adlight.kz";
