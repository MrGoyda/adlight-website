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
 * Классификация подкатегорий клеев, скотчей и крепежа
 */
function classifyHardwareSubcategory(title: string, link: string): string {
  const t = title.toLowerCase();
  const l = link.toLowerCase();

  // 1. Люверсы, пробойники и фурнитура
  if (
    l.includes("lyuversy_i_proboyniki") ||
    t.includes("люверс") ||
    t.includes("пробойник") ||
    t.includes("рельс для пробойника") ||
    t.includes("насадка для пробойник")
  ) {
    return "Люверсы, пробойники и фурнитура";
  }

  // 2. Вспененные скотчи (ПРОВЕРЯЕМ ДО КЛЕЯ, так как лента "клейкая")
  if (
    l.includes("vspenennye_kleykie_lenty") ||
    t.includes("вспененн") ||
    t.includes("sh322") ||
    t.includes("sh333")
  ) {
    return "Двусторонние вспененные скотчи";
  }

  // 3. Усиленные и силиконовые клейкие ленты
  if (
    l.includes("usilennye_kleykie_lenty") ||
    t.includes("для баннера") ||
    t.includes("силиконов") ||
    t.includes("sh368") ||
    t.includes("sh338") ||
    t.includes("sh335")
  ) {
    return "Усиленные и силиконовые клейкие ленты";
  }

  // 4. Специальные и малярные ленты
  if (
    l.includes("prochie_kleykie_lenty_i_plenki_") ||
    l.includes("upakovochnye_materialy_") ||
    t.includes("малярн") ||
    t.includes("магнитн") ||
    t.includes("ковролан") ||
    t.includes("полиграфическ") ||
    t.includes("стретч") ||
    t.includes("упаковочн") ||
    t.includes("светоотражающ") ||
    t.includes("станков") ||
    t.includes("рулонный sh")
  ) {
    return "Специальные и малярные ленты";
  }

  // 5. Клеи и герметики
  if (
    l.includes("/kley/") ||
    t.includes("клей") ||
    t.includes("жидкие гвозди") ||
    t.includes("герметик") ||
    t.includes("усики для супер клея") ||
    t.includes("apel") ||
    t.includes("akfix") ||
    t.includes("suba") ||
    t.includes("ок 201") ||
    t.includes("j-20")
  ) {
    return "Клеи и герметики (монтажные, 2-х компонентные)";
  }

  return "Клеи, Скотчи и Крепеж";
}

/**
 * Определение единицы измерения
 */
function determineHardwareUnit(title: string, rawUnit: string): InventoryUnit {
  const t = title.toLowerCase();

  if (t.includes("1000 шт") || t.includes("50 шт в упаковке") || t.includes("упаковке")) {
    return InventoryUnit.PACK;
  }
  if (t.includes("метражом") || t.includes("м.п") || t.includes("пог. м")) {
    return InventoryUnit.RUNNING_METER;
  }
  if (
    t.includes("рулон") ||
    t.includes("лента") ||
    t.includes("стретч") ||
    /\d+\s*[\*хx]\s*\d+\s*м/i.test(t) ||
    /\d+мкр/i.test(t)
  ) {
    return InventoryUnit.ROLL;
  }

  return InventoryUnit.PIECE;
}

/**
 * Извлечение характеристик для клеев и крепежа
 */
function extractHardwareSpecs(title: string, rawUnit: string, subcat: string): string {
  const parts: string[] = [];
  const t = title.toLowerCase();

  // 1. Люверсы и фурнитура
  if (subcat.includes("Люверсы")) {
    const diamMatch = title.match(/(\d+)\s*мм/i);
    if (diamMatch) {
      parts.push(`Диаметр: ${diamMatch[1]} мм`);
    }
    if (t.includes("нержавейка") || t.includes("нерж")) {
      parts.push("Материал: Нержавеющая сталь");
    } else if (t.includes("оцинков")) {
      parts.push("Материал: Оцинкованная сталь");
    } else if (t.includes("алюминиев")) {
      parts.push("Материал: Алюминий");
    }

    if (t.includes("1000 шт")) {
      parts.push("Фасовка: 1000 шт");
    }
  }

  // 2. Клеи
  else if (subcat.includes("Клеи")) {
    if (t.includes("2-х") || t.includes("двухкомпонентный") || t.includes("750") || t.includes("705") || t.includes("apel")) {
      parts.push("Тип: 2-х компонентный с активатором");
    } else if (t.includes("жидкие гвозди") || t.includes("308") || t.includes("310") || t.includes("gpl200") || t.includes("civi")) {
      parts.push("Тип: Жидкие гвозди / Герметик");
    } else if (t.includes("suba") || t.includes("ок 201") || t.includes("супер клей") || t.includes("202")) {
      parts.push("Тип: Цианакрилатный супер-клей");
    } else if (t.includes("клей ав") || t.includes("алюминиевых лент")) {
      parts.push("Тип: Двухкомпонентный для металла / алюминия");
    } else if (t.includes("j-20") || t.includes("резьбы")) {
      parts.push("Тип: Фиксатор резьбы");
    }

    // Объем
    const volMatch = title.match(/(\d+)\s*мл(?:\s*\+\s*(\d+)\s*гр)?/i) || title.match(/(\d+)\s*гр/i);
    if (volMatch) {
      if (volMatch[2]) {
        parts.push(`Объем: ${volMatch[1]}мл + ${volMatch[2]}г`);
      } else {
        parts.push(`Объем: ${volMatch[0]}`);
      }
    }
  }

  // 3. Скотчи и ленты
  else {
    // Цвет основы
    if (t.includes("белая") || t.includes("белый")) {
      parts.push("Цвет основы: Белый");
    } else if (t.includes("черная") || t.includes("черный")) {
      parts.push("Цвет основы: Черный");
    } else if (t.includes("прозрачная") || t.includes("прозрачный") || t.includes("силиконовая")) {
      parts.push("Цвет основы: Прозрачный силикон");
    }

    // Ширина
    const sizeMatch = title.match(/\((\d+(?:[,\.]\d+)?)\s*[\*хx]\s*(\d+)\s*м\)/i) ||
                      title.match(/(\d+(?:[,\.]\d+)?)\s*[\*хx]\s*(\d+)\s*м\b/i) ||
                      title.match(/(\d+)\s*мм\s*[\*хx]\s*(\d+)\s*м/i);
    if (sizeMatch) {
      const width = sizeMatch[1].replace(",", ".");
      const length = sizeMatch[2];
      const isCm = parseFloat(width) < 10;
      const mmWidth = isCm ? Math.round(parseFloat(width) * 10) : parseFloat(width);
      parts.push(`Ширина: ${mmWidth} мм (${width} см)`);
      parts.push(`Длина намотки: ${length} м`);
    } else {
      const widthOnly = title.match(/(\d+)\s*мм\b/i);
      if (widthOnly) parts.push(`Ширина: ${widthOnly[1]} мм`);
      const lenOnly = title.match(/(\d+)\s*м\b/i);
      if (lenOnly) parts.push(`Длина: ${lenOnly[1]} м`);
    }

    // Микроны / толщина
    const mkrMatch = title.match(/(\d+)\s*мкр/i);
    if (mkrMatch) {
      parts.push(`Плотность: ${mkrMatch[1]} мкр`);
    }
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
 * Парсер страницы каталога Bitrix
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

    // Универсальный парсинг цены: data-value -> values_wrapper -> price_value
    const dataValMatch = block.match(/data-value="([\d\s\.,]+)"/i);
    const valuesWrapMatch = block.match(/<span class="values_wrapper"[^>]*>([\d\s\.,]+)\s*тг/i);
    const priceValMatch = block.match(/class="price_value"[^>]*>([\d\s\.,]+)<\/span>/i);

    let price = 0;
    if (dataValMatch) {
      price = parseFloat(dataValMatch[1].replace(/\s+/g, "").replace(",", ".")) || 0;
    } else if (valuesWrapMatch) {
      price = parseFloat(valuesWrapMatch[1].replace(/\s+/g, "").replace(",", ".")) || 0;
    } else if (priceValMatch) {
      price = parseFloat(priceValMatch[1].replace(/\s+/g, "").replace(",", ".")) || 0;
    }

    const unitMatch = block.match(/class="price_measure"[^>]*>([\s\S]*?)<\/span>/i);
    const rawUnit = unitMatch ? unitMatch[1].replace(/[\/\s]/g, "").trim() : "шт";

    if (!title || price <= 0) continue;

    const subcat = classifyHardwareSubcategory(title, link || url);
    const unit = determineHardwareUnit(title, rawUnit);
    const description = extractHardwareSpecs(title, rawUnit, subcat);

    items.push({
      id,
      title,
      price,
      rawUnit,
      unit,
      category: "hardware",
      subcategory: subcat,
      imageUrl,
      sourceUrl: link,
      description,
    });
  }

  return { items, maxPage };
}

async function main() {
  console.log("===============================================================");
  console.log("🚀 ЗАПУСК ПАРСИНГА КЛЕЕВ, СКОТЧЕЙ И КРЕПЕЖА С САЙТА SIGNTECH.KZ");
  console.log("===============================================================");

  // 1. Поиск или создание поставщика
  let supplier = await prisma.supplier.findFirst({
    where: { name: { contains: "signtech", mode: "insensitive" } },
  });

  if (!supplier) {
    supplier = await prisma.supplier.create({
      data: {
        name: "SignTech",
        phone: "+7 (727) 345-00-55",
        address: "Алматы, пр. Райымбека 221Б",
        whatsapp: "https://wa.me/77017208888",
        notes: "Официальный дистрибьютор SignTech. Клеи, скотчи, фурнитура, светотехника, листовые материалы.",
      },
    });
  }

  console.log(`[Поставщик] ID: ${supplier.id} (${supplier.name})`);

  // 2. Список целевых разделов
  const targetUrls = [
    "https://signtech.kz/catalog/kleevye_resheniya/kley/",
    "https://signtech.kz/catalog/kleevye_resheniya/kleykie_lenty/vspenennye_kleykie_lenty/",
    "https://signtech.kz/catalog/kleevye_resheniya/kleykie_lenty/usilennye_kleykie_lenty/",
    "https://signtech.kz/catalog/kleevye_resheniya/kleykie_lenty/prochie_kleykie_lenty_i_plenki_/",
    "https://signtech.kz/catalog/kleevye_resheniya/kleykie_lenty/upakovochnye_materialy_//",
    "https://signtech.kz/catalog/instrumenty/lyuversy_i_proboyniki/",
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
      const sectionName = url.split("/").filter(Boolean).slice(-1)[0];
      console.log(`[Scraper] Раздел ${sectionName}: в базе ${allItemsMap.size} позиций`);
    } catch (err: any) {
      console.warn(`[Scraper] Ошибка ${url}:`, err.message);
    }
  }

  const items = Array.from(allItemsMap.values());
  console.log(`\n[Total] Всего уникальных позиций крепежа/клеев: ${items.length}\n`);

  // 3. Загрузка фото в Cloudflare R2 и сохранение в Supabase
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
  console.log(`[УСПЕХ] Импорт клеевых решений и крепежа завершен!`);
  console.log(`- Добавлено новых позиций: ${createdCount}`);
  console.log(`- Обновлено существующих позиций: ${updatedCount}`);
  console.log(`- Загружено фото в Cloudflare R2: ${uploadedPhotosCount}`);
  console.log(`- CDN хранилище: ${publicR2Url}/materials/signtech/`);
  console.log("===============================================================");

  await pool.end();
}

main().catch(async (e) => {
  console.error("Критическая ошибка импорта:", e);
  await pool.end();
  process.exit(1);
});
