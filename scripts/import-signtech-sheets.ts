import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { PrismaClient, InventoryUnit } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// 1. Инициализация Prisma PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// 2. Инициализация Cloudflare R2
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim() || "";
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim() || "";
const bucketName = process.env.R2_BUCKET_NAME?.trim() || "adlight";
const publicR2Url = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.trim() || "https://media.adlight.kz";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId, secretAccessKey },
});

interface ScrapedItem {
  id: string;
  title: string;
  price: number;
  rawUnit: string;
  unit: InventoryUnit;
  category: string;
  subcategory: string;
  imageUrl: string;
  sourceUrl: string;
  description: string;
}

/**
 * Определение точной подкатегории листовых материалов
 */
function classifySubcategory(title: string, link: string): string {
  const t = title.toLowerCase();
  const l = link.toLowerCase();

  if (l.includes("listovoy_akril") || t.includes("акрил") || t.includes("оргстекло") || t.includes("plexiglas")) {
    return "Листовой акрил и Оргстекло";
  }
  if (l.includes("vspenennyy") || t.includes("вспененн") || (t.includes("пвх") && !t.includes("pet") && !t.includes("пэт"))) {
    return "Вспененный листовой ПВХ";
  }
  if (l.includes("alyukobond") || t.includes("композит") || t.includes("алюкобонд") || t.includes("акп")) {
    return "Алюмокомпозит (АКП)";
  }
  if (l.includes("plastikovye_pet_pvc") || t.includes("пэт") || t.includes("pet") || t.includes("pvc")) {
    return "Пластиковые листы ПЭТ / PVC";
  }
  if (l.includes("romark") || t.includes("ромарк") || t.includes("гравировк")) {
    return "Двухслойный пластик (Ромарк)";
  }
  if (l.includes("kompozitnye") || t.includes("нерж")) {
    return "Композитные листы для печати";
  }
  return "Листовые пластики";
}

/**
 * Интеллектуальное извлечение характеристик из названия и формирование описания
 */
function extractSpecsAndDescription(title: string, rawUnit: string): string {
  const parts: string[] = [];

  // 1. Толщина
  const thicknessMatch = title.match(/(\d+(?:[,\.]\d+)?)\s*мм/i);
  if (thicknessMatch) {
    const th = thicknessMatch[1].replace(",", ".");
    parts.push(`Толщина: ${th} мм`);
  }

  // 2. Размер / Формат раскроя
  const sizeMatch =
    title.match(/(\d+(?:[,\.]\d+)?)\s*[\*хx]\s*(\d+(?:[,\.]\d+)?)\s*м/i) ||
    title.match(/\((\d+(?:[,\.]\d+)?)\s*[\*хx]\s*(\d+(?:[,\.]\d+)?)\)/i);
  if (sizeMatch) {
    const w = sizeMatch[1].replace(",", ".");
    const h = sizeMatch[2].replace(",", ".");
    parts.push(`Формат: ${w} × ${h} м`);
  }

  // 3. Плотность для ПВХ
  const densityMatch = title.match(/плотност[^\d]*(\d+(?:[,\.]\d+)?)/i) || title.match(/\b(0[,\.]45|0[,\.]60)\b/);
  if (densityMatch) {
    const dens = densityMatch[1].replace(",", ".");
    parts.push(`Плотность: ${dens}`);
  }

  // 4. Цветовые и оптические свойства
  if (/прозрачн/i.test(title)) parts.push("Цвет: Прозрачный");
  else if (/белый\s*425/i.test(title)) parts.push("Цвет: Белый Опал (JM425)");
  else if (/белый/i.test(title)) parts.push("Цвет: Белый");
  else if (/черный/i.test(title)) parts.push("Цвет: Черный");
  else if (/красный/i.test(title)) parts.push("Цвет: Красный");
  else if (/желтый/i.test(title)) parts.push("Цвет: Желтый");
  else if (/серый/i.test(title)) parts.push("Цвет: Серый");
  else if (/зеркало/i.test(title)) parts.push("Покрытие: Зеркальное (Mirror)");
  else if (/серебро/i.test(title)) parts.push("Цвет: Серебро металлик");
  else if (/золото/i.test(title)) parts.push("Цвет: Золото металлик");
  else if (/антиблик/i.test(title)) parts.push("Поверхность: Антибликовая");

  // 5. Единица и склад
  parts.push(`Единица: ${rawUnit}`);
  parts.push("Склад: SignTech (в наличии)");

  return parts.join(" • ");
}

/**
 * Скачивание картинки и заливка в Cloudflare R2
 */
async function uploadImageToR2(originalUrl: string, productId: string): Promise<string> {
  if (!originalUrl || !originalUrl.startsWith("http")) return "";

  try {
    const res = await fetch(originalUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      },
    });

    if (!res.ok) {
      console.warn(`[R2] Не удалось скачать фото ${originalUrl}: ${res.status}`);
      return originalUrl;
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let ext = "jpg";
    if (originalUrl.includes(".webp")) ext = "webp";
    else if (originalUrl.includes(".png")) ext = "png";

    const key = `materials/signtech/${productId}.${ext}`;

    await r2.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: ext === "webp" ? "image/webp" : ext === "png" ? "image/png" : "image/jpeg",
        CacheControl: "public, max-age=31536000, immutable",
      })
    );

    return `${publicR2Url}/${key}`;
  } catch (err: any) {
    console.warn(`[R2] Ошибка загрузки ${productId} в R2:`, err.message);
    return originalUrl;
  }
}

/**
 * Парсер страницы каталога SignTech
 */
async function parsePage(url: string): Promise<{ items: ScrapedItem[]; maxPage: number }> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const html = await res.text();

  // Max page
  const pageMatches = [...html.matchAll(/PAGEN_1=(\d+)/g)].map((m) => parseInt(m[1]));
  const maxPage = pageMatches.length > 0 ? Math.max(...pageMatches) : 1;

  // Items
  const itemRegex = /<div[^>]+class="[^"]*catalog_item_wrapp[^"]*"[^>]+id="bx_[^_]+_(\d+)"[\s\S]*?(?=<div[^>]+class="[^"]*catalog_item_wrapp|$)/gi;
  let match;
  const items: ScrapedItem[] = [];

  while ((match = itemRegex.exec(html)) !== null) {
    const block = match[0];
    const id = match[1];

    const linkMatch = block.match(/<a[^>]+href="(\/catalog\/[^\"]+\/(\d+)\/)"/i);
    const link = linkMatch ? `https://signtech.kz${linkMatch[1]}` : "";

    const titleMatch =
      block.match(/<div class="item-title"[^>]*>[\s\S]*?<span[^>]*>([\s\S]*?)<\/span>/i) ||
      block.match(/alt="([^"]+)"/i);
    const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, "").trim() : "";

    const imgMatch =
      block.match(/data-src="([^"]*\/upload\/iblock\/[^"]+)"/i) ||
      block.match(/src="([^"]*\/upload\/iblock\/[^"]+)"/i);
    let imageUrl = "";
    if (imgMatch) {
      const src = imgMatch[1];
      imageUrl = src.startsWith("http") ? src : `https://signtech.kz${src}`;
    }

    const priceMatch = block.match(/class="price_value"[^>]*>([\s\S]*?)<\/span>/i);
    const priceStr = priceMatch ? priceMatch[1].replace(/\s+/g, "").replace(",", ".") : "0";
    const price = parseFloat(priceStr) || 0;

    const unitMatch = block.match(/class="price_measure"[^>]*>([\s\S]*?)<\/span>/i);
    const rawUnit = unitMatch ? unitMatch[1].replace(/<[^>]+>/g, "").replace("/", "").trim() : "лист";

    if (title && price > 0) {
      items.push({
        id,
        title,
        price,
        rawUnit,
        unit: InventoryUnit.PIECE,
        category: "Листовые материалы",
        subcategory: classifySubcategory(title, link || url),
        imageUrl,
        sourceUrl: link || url,
        description: extractSpecsAndDescription(title, rawUnit),
      });
    }
  }

  return { items, maxPage };
}

async function main() {
  console.log("===============================================================");
  console.log("  ADLight: Полный парсинг Листовых Материалов (SignTech)       ");
  console.log("  Фото в Cloudflare R2 + Характеристики + Себестоимость в БД   ");
  console.log("===============================================================");

  // 1. Поиск/создание поставщика SignTech
  let supplier = await prisma.supplier.findFirst({
    where: {
      OR: [{ name: "SignTech" }, { name: "SignTech (Сайнтек)" }, { name: "Сайнтек" }],
    },
  });

  if (!supplier) {
    supplier = await prisma.supplier.create({
      data: {
        name: "SignTech",
        address: "г. Алматы, пр. Райымбека / филиалы по РК",
        phone: "+7 700 484 8888",
        whatsapp: "https://wa.me/77004848888",
        notes: "Официальный поставщик листовых материалов (акрил, ПВХ, АКП, ПЭТ) signtech.kz",
      },
    });
    console.log(`[DB] Поставщик SignTech создан с ID: ${supplier.id}`);
  } else {
    console.log(`[DB] Найден поставщик SignTech: ${supplier.id}`);
  }

  // 2. Список целевых URL для полного сбора
  const targetUrls = [
    "https://signtech.kz/catalog/listovye_materialy/",
    "https://signtech.kz/catalog/listovye_materialy/vspenennyy_listovoy_pvkh/vspenennyy_pvkh_standartnoy_plotnosti_0_45_1_22m_kh_2_44m_/",
    "https://signtech.kz/catalog/listovye_materialy/vspenennyy_listovoy_pvkh/vspenennyy_pvkh_povyshennoy_plotnosti_0_60_1_22m_kh_2_44m_/",
    "https://signtech.kz/catalog/listovye_materialy/vspenennyy_listovoy_pvkh/vspenennyy_pvkh_povyshennoy_plotnosti_0_60_2_05m_kh_3_05m_/",
    "https://signtech.kz/catalog/listovye_materialy/orgsteklo/",
    "https://signtech.kz/catalog/listovye_materialy/plastikovye_pet_pvc_listy/",
    "https://signtech.kz/catalog/listovye_materialy/listovoy_akril/",
    "https://signtech.kz/catalog/listovye_materialy/listovoy_dvukhsloynyy_plastik_dlya_gravirovki_romark_/",
    "https://signtech.kz/catalog/listovye_materialy/alyukobond/",
    "https://signtech.kz/catalog/listovye_materialy/kompozitnye-listy-dlya-pechati-_nerzh_-stal/",
  ];

  const allItemsMap = new Map<string, ScrapedItem>();

  for (const url of targetUrls) {
    try {
      const first = await parsePage(url);
      for (const it of first.items) {
        allItemsMap.set(it.id, it);
      }
      for (let p = 2; p <= first.maxPage; p++) {
        const pageUrl = `${url}?PAGEN_1=${p}`;
        try {
          const next = await parsePage(pageUrl);
          for (const it of next.items) {
            allItemsMap.set(it.id, it);
          }
        } catch {}
      }
      console.log(`[Scraper] Раздел ${url.split("/").filter(Boolean).slice(-1)[0]}: всего в базе ${allItemsMap.size} позиций`);
    } catch (err: any) {
      console.warn(`[Scraper] Ошибка раздела ${url}:`, err.message);
    }
  }

  const items = Array.from(allItemsMap.values());
  console.log(`\n[Total] Всего уникальных товаров для импорта: ${items.length}\n`);

  // 3. Загрузка фото в R2 и сохранение в Supabase
  let createdCount = 0;
  let updatedCount = 0;
  let uploadedPhotosCount = 0;

  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    process.stdout.write(`\r[${i + 1}/${items.length}] Импорт: ${it.title.slice(0, 40)}... `);

    // Загружаем картинку в Cloudflare R2
    let r2ImageUrl = it.imageUrl;
    if (it.imageUrl && !it.imageUrl.includes("media.adlight.kz")) {
      const uploaded = await uploadImageToR2(it.imageUrl, it.id);
      if (uploaded && uploaded.includes("media.adlight.kz")) {
        r2ImageUrl = uploaded;
        uploadedPhotosCount++;
      }
    }

    // Сохраняем/обновляем в PostgreSQL
    const existing = await prisma.supplierPrice.findFirst({
      where: {
        name: it.title,
        supplierId: supplier.id,
      },
    });

    if (existing) {
      await prisma.supplierPrice.update({
        where: { id: existing.id },
        data: {
          price: it.price,
          unit: it.unit,
          category: it.category,
          subcategory: it.subcategory,
          imageUrl: r2ImageUrl || existing.imageUrl,
          sourceUrl: it.sourceUrl || existing.sourceUrl,
          description: it.description || existing.description,
          isService: false,
        },
      });
      updatedCount++;
    } else {
      await prisma.supplierPrice.create({
        data: {
          name: it.title,
          supplier: "SignTech",
          supplierId: supplier.id,
          price: it.price,
          unit: it.unit,
          category: it.category,
          subcategory: it.subcategory,
          imageUrl: r2ImageUrl,
          sourceUrl: it.sourceUrl,
          description: it.description,
          isService: false,
        },
      });
      createdCount++;
    }
  }

  console.log("\n\n===============================================================");
  console.log(`[УСПЕХ] Завершено!`);
  console.log(`- Добавлено новых позиций: ${createdCount}`);
  console.log(`- Обновлено существующих позиций: ${updatedCount}`);
  console.log(`- Загружено новых фото в Cloudflare R2: ${uploadedPhotosCount}`);
  console.log(`- CDN хранилище: ${publicR2Url}/materials/signtech/`);
  console.log("===============================================================");

  await pool.end();
}

main().catch((err) => {
  console.error("\nФатальная ошибка:", err);
  process.exit(1);
});
