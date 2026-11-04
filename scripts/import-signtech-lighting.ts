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
 * Классификация подкатегорий светотехники
 */
function classifyLightingSubcategory(title: string, link: string): string {
  const t = title.toLowerCase();
  const l = link.toLowerCase();

  // 1. Блоки питания и трансформаторы
  if (
    t.includes("трансформатор") ||
    t.includes("блок питания") ||
    t.includes("адаптер") ||
    l.includes("/transformatory/") ||
    t.includes("whoosh") ||
    t.includes("tauras")
  ) {
    return "Блоки питания (трансформаторы)";
  }

  // 2. Контроллеры и диммеры
  if (t.includes("контроллер") || t.includes("диммер") || l.includes("/kontrollery/")) {
    return "Контроллеры и диммеры";
  }

  // 3. Гибкий неон
  if (t.includes("неон") || t.includes("neon") || l.includes("neon")) {
    return "Гибкий неон 12V / 24V";
  }

  // 4. Светодиодные ленты и линейки
  if (t.includes("лента") || t.includes("линейка") || l.includes("lenty") || l.includes("lineyki")) {
    return "Светодиодные ленты";
  }

  // 5. Модули и диоды
  if (t.includes("модул") || t.includes("диод") || l.includes("modul")) {
    return "Светодиодные модули (линзованные)";
  }

  return "Светотехника и Электрика";
}

/**
 * Определение единицы измерения
 */
function determineUnit(title: string, rawUnit: string): InventoryUnit {
  const t = title.toLowerCase();
  if (t.includes("метраж") || t.includes("пог. м") || t.includes("м.п")) {
    return InventoryUnit.RUNNING_METER;
  }
  if (t.includes("рулон") || t.includes("рулоне") || t.includes("бухта") || (t.includes("неон") && (t.includes("50 м") || t.includes("100 м")))) {
    return InventoryUnit.ROLL;
  }
  if (t.includes("лента") && (t.includes("50 м") || t.includes("100 м"))) {
    return InventoryUnit.ROLL;
  }
  return InventoryUnit.PIECE;
}

/**
 * Извлечение характеристик светотехники
 */
function extractLightingSpecs(title: string, rawUnit: string): string {
  const parts: string[] = [];

  // 1. Вольтаж
  const voltMatch = title.match(/(\d+)\s*[vVвВ]/i) || title.match(/(DC12-24V)/i);
  if (voltMatch) {
    parts.push(`Напряжение: ${voltMatch[1].toUpperCase()}`);
  }

  // 2. Мощность
  const powerMatch = title.match(/(\d+(?:[,\.]\d+)?)\s*[wWвтВт]/i);
  if (powerMatch) {
    const p = powerMatch[1].replace(",", ".");
    parts.push(`Мощность: ${p}W`);
  }

  // 3. Цветовая температура / Цвет
  const kelvinMatch = title.match(/(\d{4,5})\s*k/i);
  if (kelvinMatch) {
    parts.push(`Цветовая t°: ${kelvinMatch[1]}K`);
  } else if (/теплый\s*белый/i.test(title)) {
    parts.push("Свечение: Теплый белый (3000K)");
  } else if (/белый/i.test(title)) {
    parts.push("Свечение: Белый (6500K - 10000K)");
  } else if (/красный/i.test(title)) {
    parts.push("Свечение: Красный");
  } else if (/синий/i.test(title)) {
    parts.push("Свечение: Синий");
  } else if (/зеленый/i.test(title)) {
    parts.push("Свечение: Зеленый");
  } else if (/rgb/i.test(title)) {
    parts.push("Свечение: Полноцветный (RGB)");
  }

  // 4. Пыле-влагозащита IP
  const ipMatch = title.match(/(IP\s*\d{2})/i);
  if (ipMatch) {
    parts.push(`Защита: ${ipMatch[1].replace(/\s+/g, "")}`);
  } else if (/уличн/i.test(title)) {
    parts.push("Защита: Уличный влагозащитный (IP67)");
  } else if (/внутренн|открыт/i.test(title)) {
    parts.push("Защита: Интерьерный (IP20)");
  }

  // 5. Длина / Фасовка
  const lenMatch = title.match(/(\d+)\s*м(?:етр)?\b/i);
  if (lenMatch) {
    parts.push(`Длина: ${lenMatch[1]} м`);
  } else if (/метраж/i.test(title)) {
    parts.push("Фасовка: Нарезка метражом");
  }

  // 6. Сечение
  const sizeMatch = title.match(/(\d{2}\s*[\*хx]\s*\d{2})/i);
  if (sizeMatch) {
    parts.push(`Сечение: ${sizeMatch[1]} мм`);
  }

  parts.push(`Единица: ${rawUnit}`);
  parts.push("Склад: SignTech");

  return parts.join(" • ");
}

/**
 * Скачивание картинки и загрузка в Cloudflare R2
 */
async function uploadImageToR2(originalUrl: string, productId: string): Promise<string> {
  if (!originalUrl || !originalUrl.startsWith("http")) return "";

  try {
    const res = await fetch(originalUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0.0 Safari/537.36",
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
 * Парсер страницы
 */
async function parsePage(url: string): Promise<{ items: ScrapedItem[]; maxPage: number }> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0.0 Safari/537.36",
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
    const rawUnit = unitMatch ? unitMatch[1].replace(/<[^>]+>/g, "").replace("/", "").trim() : "шт";

    if (title && price > 0) {
      items.push({
        id,
        title,
        price,
        rawUnit,
        unit: determineUnit(title, rawUnit),
        category: "Светотехника и Электрика",
        subcategory: classifyLightingSubcategory(title, link || url),
        imageUrl,
        sourceUrl: link || url,
        description: extractLightingSpecs(title, rawUnit),
      });
    }
  }

  return { items, maxPage };
}

async function main() {
  console.log("===============================================================");
  console.log("  ADLight: Полный парсинг Светотехники и Электрики (SignTech) ");
  console.log("  Фото в Cloudflare R2 + Характеристики + Себестоимость в БД   ");
  console.log("===============================================================");

  // 1. Поиск поставщика SignTech
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
        notes: "Официальный поставщик материалов и светотехники signtech.kz",
      },
    });
  }
  console.log(`[DB] Поставщик SignTech ID: ${supplier.id}`);

  // 2. Целевые разделы светотехники
  const targetUrls = [
    "https://signtech.kz/catalog/svetodiodnye_istochniki_sveta/",
    "https://signtech.kz/catalog/svetodiodnye_istochniki_sveta/svetodiodnye_moduli/",
    "https://signtech.kz/catalog/svetodiodnye_istochniki_sveta/svetodiodnye_lenty/",
    "https://signtech.kz/catalog/svetodiodnye_istochniki_sveta/gibkiy_neon/",
    "https://signtech.kz/catalog/svetodiodnye_istochniki_sveta/svetodiodnye_lineyki/",
    "https://signtech.kz/catalog/transformatory_bloki_pitaniya_i_kontrollery/",
    "https://signtech.kz/catalog/transformatory_bloki_pitaniya_i_kontrollery/transformatory/zakrytye_ulichnye/",
    "https://signtech.kz/catalog/transformatory_bloki_pitaniya_i_kontrollery/transformatory/otkrytye_vnutrennie/",
    "https://signtech.kz/catalog/transformatory_bloki_pitaniya_i_kontrollery/transformatory/poluzakrytye/",
    "https://signtech.kz/catalog/transformatory_bloki_pitaniya_i_kontrollery/kontrollery/",
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
      console.log(`[Scraper] Раздел ${url.split("/").filter(Boolean).slice(-1)[0]}: в базе ${allItemsMap.size} позиций`);
    } catch (err: any) {
      console.warn(`[Scraper] Ошибка ${url}:`, err.message);
    }
  }

  const items = Array.from(allItemsMap.values());
  console.log(`\n[Total] Всего уникальных позиций светотехники: ${items.length}\n`);

  // 3. Загрузка фото в R2 и сохранение в Supabase
  let createdCount = 0;
  let updatedCount = 0;
  let uploadedPhotosCount = 0;

  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    process.stdout.write(`\r[${i + 1}/${items.length}] Импорт: ${it.title.slice(0, 38)}... `);

    // Загрузка фото в R2
    let r2ImageUrl = it.imageUrl;
    if (it.imageUrl && !it.imageUrl.includes("media.adlight.kz")) {
      const uploaded = await uploadImageToR2(it.imageUrl, it.id);
      if (uploaded && uploaded.includes("media.adlight.kz")) {
        r2ImageUrl = uploaded;
        uploadedPhotosCount++;
      }
    }

    // Сохранение в Supabase
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
  console.log(`[УСПЕХ] Импорт светотехники завершен!`);
  console.log(`- Добавлено новых позиций: ${createdCount}`);
  console.log(`- Обновлено существующих позиций: ${updatedCount}`);
  console.log(`- Загружено фото в Cloudflare R2: ${uploadedPhotosCount}`);
  console.log(`- CDN хранилище: ${publicR2Url}/materials/signtech/`);
  console.log("===============================================================");

  await pool.end();
}

main().catch((err) => {
  console.error("\nФатальная ошибка:", err);
  process.exit(1);
});
