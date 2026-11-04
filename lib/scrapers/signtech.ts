import { InventoryUnit } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export interface ScrapedProduct {
  id: string; // SignTech product ID
  title: string;
  price: number;
  rawUnit: string;
  unit: InventoryUnit;
  category: string;
  imageUrl: string;
  sourceUrl: string;
  description?: string;
}

/**
 * Нормализация единицы измерения в InventoryUnit
 */
export function mapUnitToInventory(raw: string): InventoryUnit {
  const lower = (raw || "").toLowerCase();
  if (lower.includes("м2") || lower.includes("кв") || lower.includes("м²")) {
    return InventoryUnit.SQUARE_METER;
  }
  if (lower.includes("пог") || lower.includes("п.м") || lower.includes("п/м") || lower.includes("м.п")) {
    return InventoryUnit.RUNNING_METER;
  }
  if (lower.includes("рул") || lower.includes("рулон")) {
    return InventoryUnit.ROLL;
  }
  if (lower.includes("упак") || lower.includes("пач") || lower.includes("кор")) {
    return InventoryUnit.PACK;
  }
  if (lower.includes("литр") || lower.includes("л")) {
    return InventoryUnit.LITER;
  }
  // Лист, штука, модуль, блок -> PIECE
  return InventoryUnit.PIECE;
}

/**
 * Определение категории по ссылке и названию товара
 */
export function inferCategory(title: string, link: string): string {
  const t = title.toLowerCase();
  const l = link.toLowerCase();

  if (l.includes("listovoy_akril") || t.includes("акрил") || t.includes("оргстекло") || t.includes("plexiglas")) {
    return "Листовой акрил и Оргстекло";
  }
  if (l.includes("vspenennyy_listovoy_pvkh") || t.includes("пвх") || t.includes("вспененный")) {
    return "Вспененный листовой ПВХ";
  }
  if (l.includes("alyukobond") || l.includes("kompozitnye") || t.includes("композит") || t.includes("алюкобонд") || t.includes("акп")) {
    return "Алюмокомпозит (АКП)";
  }
  if (l.includes("plastikovye_pet_pvc") || t.includes("пэт") || t.includes("pet")) {
    return "Пластиковые листы ПЭТ / PVC";
  }
  if (l.includes("romark") || t.includes("ромарк") || t.includes("гравировк")) {
    return "Пластик для гравировки (Ромарк)";
  }
  if (l.includes("svetodiod") || t.includes("светодиод") || t.includes("диод") || t.includes("модуль") || t.includes("лента") || t.includes("неон")) {
    return "Светотехника и Неон";
  }
  if (l.includes("transformatory") || t.includes("блок питания") || t.includes("трансформатор")) {
    return "Блоки питания и Электрика";
  }
  if (l.includes("kleevye") || t.includes("клей") || t.includes("cosmofen") || t.includes("скотч")) {
    return "Клеи, скотчи и химия";
  }
  if (l.includes("profili") || t.includes("профиль") || t.includes("клик")) {
    return "Профили и Металл";
  }
  if (l.includes("rulonnye") || t.includes("пленка") || t.includes("oracal") || t.includes("баннер")) {
    return "Рулонные пленки и Баннеры";
  }
  if (l.includes("listovye_materialy")) {
    return "Листовые материалы";
  }
  return "Материалы для рекламы";
}

/**
 * Парсер страницы каталога SignTech
 */
export async function scrapeSigntechPage(pageUrl: string): Promise<{
  products: ScrapedProduct[];
  maxPage: number;
  subcategories: { title: string; url: string }[];
}> {
  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
  };

  const res = await fetch(pageUrl, { headers });
  if (!res.ok) {
    throw new Error(`Ошибка загрузки страницы SignTech: ${res.status} ${res.statusText}`);
  }

  const html = await res.text();

  // 1. Поиск максимальной страницы пагинации
  const pageMatches = [...html.matchAll(/PAGEN_1=(\d+)/g)].map((m) => parseInt(m[1]));
  const maxPage = pageMatches.length > 0 ? Math.max(...pageMatches) : 1;

  // 2. Поиск подкатегорий
  const subcatRegex = /<a[^>]+href="(\/catalog\/[a-z0-9_\-\/]+\/)"[^>]*>([\s\S]*?)<\/a>/gi;
  const subcatsMap = new Map<string, string>();
  let sm;
  while ((sm = subcatRegex.exec(html)) !== null) {
    const link = sm[1];
    const text = sm[2].replace(/<[^>]+>/g, "").trim();
    if (
      text &&
      text.length > 2 &&
      !text.includes("Подробнее") &&
      !link.includes("?") &&
      !link.endsWith("/catalog/") &&
      !subcatsMap.has(link)
    ) {
      subcatsMap.set(`https://signtech.kz${link}`, text);
    }
  }

  const subcategories = Array.from(subcatsMap.entries()).map(([url, title]) => ({ url, title }));

  // 3. Извлечение карточек товаров
  const itemRegex = /<div[^>]+class="[^"]*catalog_item_wrapp[^"]*"[^>]+id="bx_[^_]+_(\d+)"[\s\S]*?(?=<div[^>]+class="[^"]*catalog_item_wrapp|$)/gi;
  let match;
  const products: ScrapedProduct[] = [];
  const seenIds = new Set<string>();

  while ((match = itemRegex.exec(html)) !== null) {
    const block = match[0];
    const id = match[1];
    if (seenIds.has(id)) continue;

    // Ссылка на товар
    const linkMatch = block.match(/<a[^>]+href="(\/catalog\/[^\"]+\/(\d+)\/)"/i);
    const link = linkMatch ? `https://signtech.kz${linkMatch[1]}` : "";

    // Название товара
    const titleMatch =
      block.match(/<div class="item-title"[^>]*>[\s\S]*?<span[^>]*>([\s\S]*?)<\/span>/i) ||
      block.match(/alt="([^"]+)"/i);
    const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, "").trim() : "";

    // Картинка товара
    const imgMatch =
      block.match(/data-src="([^"]*\/upload\/iblock\/[^"]+)"/i) ||
      block.match(/src="([^"]*\/upload\/iblock\/[^"]+)"/i);
    let imageUrl = "";
    if (imgMatch) {
      const src = imgMatch[1];
      imageUrl = src.startsWith("http") ? src : `https://signtech.kz${src}`;
    }

    // Цена в тенге
    const priceMatch = block.match(/class="price_value"[^>]*>([\s\S]*?)<\/span>/i);
    const priceStr = priceMatch ? priceMatch[1].replace(/\s+/g, "").replace(",", ".") : "0";
    const price = parseFloat(priceStr) || 0;

    // Единица измерения
    const unitMatch = block.match(/class="price_measure"[^>]*>([\s\S]*?)<\/span>/i);
    const rawUnit = unitMatch ? unitMatch[1].replace(/<[^>]+>/g, "").replace("/", "").trim() : "лист";

    if (title && price > 0) {
      seenIds.add(id);
      products.push({
        id,
        title,
        price,
        rawUnit,
        unit: mapUnitToInventory(rawUnit),
        category: inferCategory(title, link),
        imageUrl,
        sourceUrl: link || pageUrl,
      });
    }
  }

  return {
    products,
    maxPage,
    subcategories,
  };
}

/**
 * Глубокий парсинг нескольких страниц раздела SignTech
 */
export async function scrapeSigntechCategoryDeep(
  targetUrl: string,
  options: { maxPagesToScan?: number } = {}
): Promise<{ products: ScrapedProduct[]; scannedPages: number }> {
  const maxPagesToScan = options.maxPagesToScan || 5;
  const baseUrl = targetUrl.split("?")[0].replace(/\/+$/, "") + "/";

  // Сканируем первую страницу
  const firstPage = await scrapeSigntechPage(baseUrl);
  let allProducts: ScrapedProduct[] = [...firstPage.products];
  const maxPage = Math.min(firstPage.maxPage, maxPagesToScan);

  // Сканируем остальные страницы пагинации
  const tasks: Promise<any>[] = [];
  for (let p = 2; p <= maxPage; p++) {
    const pageUrl = `${baseUrl}?PAGEN_1=${p}`;
    tasks.push(
      scrapeSigntechPage(pageUrl)
        .then((res) => {
          allProducts.push(...res.products);
        })
        .catch((err) => {
          console.warn(`Ошибка при парсинге страницы ${pageUrl}:`, err);
        })
    );
  }

  await Promise.all(tasks);

  // Убираем возможные дубли по ID
  const uniqueMap = new Map<string, ScrapedProduct>();
  for (const item of allProducts) {
    if (!uniqueMap.has(item.id)) {
      uniqueMap.set(item.id, item);
    }
  }

  return {
    products: Array.from(uniqueMap.values()),
    scannedPages: maxPage,
  };
}

/**
 * Сохранение / импорт распарсенных товаров в базу данных PostgreSQL
 */
export async function importProductsToDatabase(products: ScrapedProduct[]): Promise<{
  created: number;
  updated: number;
  supplierId: string;
}> {
  // 1. Убеждаемся, что поставщик SignTech существует
  let supplier = await prisma.supplier.findFirst({
    where: {
      OR: [
        { name: "SignTech" },
        { name: "SignTech (Сайнтек)" },
        { name: "Сайнтек" },
      ],
    },
  });

  if (!supplier) {
    supplier = await prisma.supplier.create({
      data: {
        name: "SignTech",
        address: "г. Алматы / филиалы по Казахстану",
        phone: "+7 700 484 8888",
        whatsapp: "https://wa.me/77004848888",
        notes: "Крупнейший поставщик листовых материалов, светотехники и рекламных расходников в Казахстане. Каталог signtech.kz",
      },
    });
  }

  let created = 0;
  let updated = 0;

  for (const item of products) {
    // Ищем существующий товар по названию и поставщику
    const existing = await prisma.supplierPrice.findFirst({
      where: {
        name: item.title,
        supplierId: supplier.id,
      },
    });

    if (existing) {
      await prisma.supplierPrice.update({
        where: { id: existing.id },
        data: {
          price: item.price,
          unit: item.unit,
          category: item.category,
          imageUrl: item.imageUrl || existing.imageUrl,
          sourceUrl: item.sourceUrl || existing.sourceUrl,
          description: `Единица поставщика: ${item.rawUnit}`,
          isService: false,
        },
      });
      updated++;
    } else {
      await prisma.supplierPrice.create({
        data: {
          name: item.title,
          supplier: "SignTech",
          supplierId: supplier.id,
          price: item.price,
          unit: item.unit,
          category: item.category,
          imageUrl: item.imageUrl,
          sourceUrl: item.sourceUrl,
          description: `Единица поставщика: ${item.rawUnit}`,
          isService: false,
        },
      });
      created++;
    }
  }

  return {
    created,
    updated,
    supplierId: supplier.id,
  };
}
