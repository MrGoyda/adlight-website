import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import fs from "fs";
import path from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID!;
const accessKeyId = process.env.R2_ACCESS_KEY_ID!;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY!;
const bucketName = process.env.R2_BUCKET_NAME || "adlight";
const publicDomain = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "https://media.adlight.kz";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

async function main() {
  const rootFilePath = path.join(process.cwd(), "AD Логотип.png");
  if (!fs.existsSync(rootFilePath)) {
    console.error("Файл 'AD Логотип.png' не найден в корне!");
    process.exit(1);
  }

  const fileBuffer = fs.readFileSync(rootFilePath);
  const fileKey = "branding/adlight-mark.png";

  console.log(`Загрузка на Cloudflare R2: bucket=${bucketName}, key=${fileKey}...`);

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileKey,
    Body: fileBuffer,
    ContentType: "image/png",
    ContentDisposition: "inline",
  });

  await r2.send(command);

  const publicUrl = `${publicDomain}/${fileKey}`;
  console.log(`✅ Успешно выгружено на Cloudflare R2!`);
  console.log(`Официальный CDN URL: ${publicUrl}`);
}

main().catch((err) => {
  console.error("Ошибка при загрузке на Cloudflare:", err);
  process.exit(1);
});
