import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import fs from "fs";
import path from "path";
import { PrismaClient, InventoryUnit } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// 1. Инициализация подключения к БД
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

/**
 * Очистка названия товара от рекламных надписей: АКЦИЯ, НОВИНКА, СКИДКА и т.д.
 */
function cleanTitle(raw: string): string {
  let title = raw
    .replace(/\*\*АКЦИЯ!+\*\*/gi, "")
    .replace(/АКЦИЯ!+/gi, "")
    .replace(/\*\*АКЦИЯ\*\*/gi, "")
    .replace(/АКЦИЯ/gi, "")
    .replace(/\*\*НОВИНКА!+\*\*/gi, "")
    .replace(/НОВИНКА!+/gi, "")
    .replace(/\*\*НОВИНКА\*\*/gi, "")
    .replace(/НОВИНКА/gi, "")
    .replace(/\*\*СКИДКА!+\*\*/gi, "")
    .replace(/СКИДКА!+/gi, "")
    .replace(/\*\*/g, "")
    .replace(/\s+/g, " ")
    .trim();

  // Удаляем начальные и конечные слеши / дефисы
  title = title.replace(/^[\s\/\-]+/, "").replace(/[\s\/\-]+$/, "").trim();
  return title;
}

/**
 * Преобразование единицы измерения каталога в Enum InventoryUnit
 */
function parseUnit(rawUnit: string): { unit: InventoryUnit; rawLabel: string } {
  const u = rawUnit.toLowerCase().trim();
  if (u === "лист") return { unit: InventoryUnit.PIECE, rawLabel: "лист" };
  if (u === "рул" || u === "рулон") return { unit: InventoryUnit.PIECE, rawLabel: "рулон" };
  if (u === "м" || u === "метр" || u === "пог.м") return { unit: InventoryUnit.RUNNING_METER, rawLabel: "погонный метр" };
  if (u === "шт" || u === "штука") return { unit: InventoryUnit.PIECE, rawLabel: "шт" };
  if (u === "тюб" || u === "тюбик") return { unit: InventoryUnit.PIECE, rawLabel: "тюбик" };
  if (u === "хл" || u === "хлыст") return { unit: InventoryUnit.RUNNING_METER, rawLabel: "хлыст" };
  if (u === "уп" || u === "упаковка") return { unit: InventoryUnit.PIECE, rawLabel: "упаковка" };
  if (u === "м²" || u === "кв.м") return { unit: InventoryUnit.SQUARE_METER, rawLabel: "м²" };

  return { unit: InventoryUnit.PIECE, rawLabel: rawUnit };
}

/**
 * Определение категории и подкатегории на основе секций markdown и названия товара
 */
function resolveTaxonomy(
  section: string,
  subsection: string,
  cleanName: string
): { category: string; subcategory: string } {
  const sec = section.toLowerCase();
  const sub = subsection.toLowerCase();
  const name = cleanName.toLowerCase();

  // 1. Листовые материалы
  if (sec.includes("листовые")) {
    const category = "Листовые материалы";
    if (sub.includes("пвх") && !sub.includes("пэт")) return { category, subcategory: "Вспененный листовой ПВХ" };
    if (sub.includes("оргстекло") || sub.includes("акрил")) return { category, subcategory: "Листовой акрил и Оргстекло" };
    if (sub.includes("алюкобонд")) return { category, subcategory: "Алюмокомпозит (АКП)" };
    if (sub.includes("пэт") || sub.includes("листовой")) return { category, subcategory: "Пластиковые листы ПЭТ / PVC" };
    if (sub.includes("abs") || sub.includes("пластик")) return { category, subcategory: "Двухслойный пластик (Ромарк / ABS)" };
    return { category, subcategory: "Вспененный листовой ПВХ" };
  }

  // 2. Рулонные материалы -> Пленки и Баннеры
  if (sec.includes("рулонные")) {
    const category = "Пленки и Баннеры";
    if (name.includes("баннер") || name.includes("сетка")) return { category, subcategory: "Баннерная ткань и сетка" };
    if (name.includes("бэклит") || name.includes("холст") || name.includes("флажная") || name.includes("фотобумага") || name.includes("флекс") || name.includes("магнит")) {
      return { category, subcategory: "Холсты, бэклит и ткани для печати" };
    }
    return { category, subcategory: "Пленки для печати и ламинация" };
  }

  // 3. Светодиоды, неон и освещение -> Светотехника и Электрика
  if (sec.includes("светодиоды") || sec.includes("освещение")) {
    const category = "Светотехника и Электрика";
    if (sub.includes("модули")) return { category, subcategory: "Светодиодные модули (линзованные)" };
    if (sub.includes("неон")) return { category, subcategory: "Гибкий неон 12V / 24V" };
    if (sub.includes("ленты")) return { category, subcategory: "Светодиодные ленты" };
    if (sub.includes("лампы") || sub.includes("прожектор")) return { category, subcategory: "Прожекторы, лампы и освещение" };
    return { category, subcategory: "Светодиодные модули (линзованные)" };
  }

  // 4. Блоки питания, трансформаторы и управление -> Светотехника и Электрика
  if (sec.includes("блоки питания") || sec.includes("трансфоматоры") || sec.includes("управление")) {
    const category = "Светотехника и Электрика";
    if (sub.includes("закрытые") || sub.includes("полузакрытые") || sub.includes("открытые")) {
      return { category, subcategory: "Блоки питания (трансформаторы)" };
    }
    if (sub.includes("контроллеры")) return { category, subcategory: "Контроллеры и диммеры" };
    return { category, subcategory: "Кабели, провода и клеммы" };
  }

  // 5. Скотч, клей и химия -> Клеи, Скотчи и Крепеж
  if (sec.includes("скотч") || sec.includes("клей") || sec.includes("химия")) {
    const category = "Клеи, Скотчи и Крепеж";
    if (name.includes("скотч")) return { category, subcategory: "Двусторонние вспененные скотчи" };
    if (name.includes("клей") || name.includes("cosmofen") || name.includes("активатор") || name.includes("ca-12")) {
      return { category, subcategory: "Клеи и герметики (монтажные, 2-х компонентные)" };
    }
    return { category, subcategory: "Специальные и малярные ленты" };
  }

  // 6. Алюминиевые профили -> Профили и Металл
  if (sec.includes("профили")) {
    return { category: "Профили и Металл", subcategory: "Алюминиевые профили для световых коробов и рамок" };
  }

  // 7. Краски и сольвенты -> Клеи, Скотчи и Крепеж
  if (sec.includes("краски") || sec.includes("сольвенты")) {
    return { category: "Клеи, Скотчи и Крепеж", subcategory: "Аэрозольные краски и чернила" };
  }

  // 8. Оборудование, конструкции и инструменты
  if (sec.includes("оборудование") || sec.includes("инструменты")) {
    if (sub.includes("кайма") || sub.includes("багет")) {
      return { category: "Профили и Металл", subcategory: "Кайма и багетный профиль" };
    }
    if (sub.includes("дистанционные") || sub.includes("держатели") || sub.includes("фурнитура")) {
      return { category: "Клеи, Скотчи и Крепеж", subcategory: "Дистанционные держатели и метизы" };
    }
    return { category: "Клеи, Скотчи и Крепеж", subcategory: "Монтажный инструмент, резаки и ракели" };
  }

  // 9. Фрезы, сверла и запчасти для станков -> Клеи, Скотчи и Крепеж
  if (sec.includes("фрезы") || sec.includes("сверла")) {
    return { category: "Клеи, Скотчи и Крепеж", subcategory: "Фрезы, сверла и комплектующие ЧПУ" };
  }

  // 10. Цветные, транслюцентные и витражные пленки -> Пленки и Баннеры
  if (sec.includes("пленки") || sec.includes("цветные")) {
    const category = "Пленки и Баннеры";
    if (sub.includes("v-mark") || sub.includes("1,07") || sub.includes("1,22")) {
      return { category, subcategory: "Плоттерные пленки (Oracal 641 / V-MARK)" };
    }
    if (sub.includes("транслюцентная")) {
      return { category, subcategory: "Светорассеивающие пленки (Oracal 8500 / DEMER)" };
    }
    if (sub.includes("светоотражающие")) {
      return { category, subcategory: "Световозвращающие и перфорированные пленки" };
    }
    return { category, subcategory: "Монтажные и витражные пленки" };
  }

  return { category: "Листовые материалы", subcategory: "Вспененный листовой ПВХ" };
}

interface ParsedItem {
  rawTitle: string;
  cleanTitle: string;
  price: number;
  rawUnit: string;
  unit: InventoryUnit;
  category: string;
  subcategory: string;
  description: string;
}

async function main() {
  console.log("==========================================================");
  console.log("   ADLight: Импорт обновленного каталога DEMER 2026        ");
  console.log("==========================================================");

  // 1. Поиск или создание / обновление поставщика "Демер"
  let supplier = await prisma.supplier.findFirst({
    where: {
      OR: [{ name: "Демер" }, { name: "Demer" }, { name: "DEMER" }],
    },
  });

  const supplierData = {
    name: "Демер",
    address: "г. Астана, ул. Буйрат 45Б",
    phone: "+7 702 772 33 77",
    phones: ["+7 702 772 33 77", "+7 702 772 55 77", "+7 702 772 66 77"],
    whatsapp: "https://wa.me/77027723377",
    website: "demer.kz",
    instagram: "@demer_kz",
    notes: "demer.astana@mail.ru | Материалы для наружной и внутренней рекламы / Сыртқы және ішкі жарнамаға арналған заттар",
  };

  if (!supplier) {
    supplier = await prisma.supplier.create({
      data: supplierData,
    });
    console.log(`[DB] Поставщик "Демер" создан с ID: ${supplier.id}`);
  } else {
    supplier = await prisma.supplier.update({
      where: { id: supplier.id },
      data: supplierData,
    });
    console.log(`[DB] Поставщик "Демер" (${supplier.id}) успешно обновлен новыми реквизитами.`);
  }

  // 2. Чтение файла с каталогом
  const filePath = "C:/Users/user/.gemini/antigravity/brain/5db1bd29-e74c-4ff8-912a-bb573316bde3/.user_uploaded/media_1793854654945_15730294.md";
  if (!fs.existsSync(filePath)) {
    console.error(`Файл не найден: ${filePath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");

  let currentSection = "";
  let currentSubsection = "";
  const items: ParsedItem[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("## ")) {
      currentSection = trimmed.replace("## ", "").trim();
      currentSubsection = "";
      continue;
    }

    if (trimmed.startsWith("### ")) {
      currentSubsection = trimmed.replace("### ", "").trim();
      continue;
    }

    if (trimmed.startsWith("|") && !trimmed.includes("---") && !trimmed.includes("Товар") && !trimmed.includes("Ед.")) {
      const parts = trimmed.split("|").map((p) => p.trim()).filter(Boolean);
      if (parts.length >= 3) {
        const rawTitle = parts[0];
        const rawPriceStr = parts[1].replace(/\s+/g, "").replace(",", ".");
        let price = parseFloat(rawPriceStr);
        let priceNote = "";

        if (isNaN(price)) {
          price = 0;
          priceNote = "Цена по запросу у менеджера Демер";
        }

        const rawUnit = parts[2];
        const extraNote = parts.length >= 4 ? parts[3] : "";

        const cleaned = cleanTitle(rawTitle);
        const { unit, rawLabel } = parseUnit(rawUnit);
        const { category, subcategory } = resolveTaxonomy(currentSection, currentSubsection, cleaned);

        let description = `Ед. изм.: ${rawLabel}. Поставщик: Демер (Астана).`;
        if (extraNote && extraNote !== "KZT") {
          description += ` Примечание: ${extraNote}.`;
        }
        if (priceNote) {
          description += ` (${priceNote})`;
        }

        items.push({
          rawTitle,
          cleanTitle: cleaned,
          price,
          rawUnit,
          unit,
          category,
          subcategory,
          description,
        });
      }
    }
  }

  console.log(`[Parser] Спарсено позиций из прайс-листа: ${items.length}`);

  // 3. Сохранение позиций в PostgreSQL
  let createdCount = 0;
  let updatedCount = 0;

  for (let i = 0; i < items.length; i++) {
    const it = items[i];

    // Поиск существующего товара поставщика "Демер" по чистому названию
    const existing = await prisma.supplierPrice.findFirst({
      where: {
        supplierId: supplier.id,
        name: it.cleanTitle,
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
          description: it.description,
          supplier: "Демер",
          isService: false,
        },
      });
      updatedCount++;
    } else {
      await prisma.supplierPrice.create({
        data: {
          name: it.cleanTitle,
          supplier: "Демер",
          supplierId: supplier.id,
          price: it.price,
          unit: it.unit,
          category: it.category,
          subcategory: it.subcategory,
          description: it.description,
          isService: false,
        },
      });
      createdCount++;
    }

    if ((i + 1) % 50 === 0 || i === items.length - 1) {
      console.log(`[Progress] Обработано ${i + 1}/${items.length} товаров...`);
    }
  }

  console.log("==========================================================");
  console.log(`[УСПЕХ!] Всего в каталоге: ${items.length} позиций.`);
  console.log(`Создано новых: ${createdCount}, обновлено существующих: ${updatedCount}.`);
  console.log("Все позиции очищены от маркетинговых меток (АКЦИЯ, НОВИНКА и т.д.).");
  console.log("==========================================================");

  await pool.end();
}

main().catch(async (e) => {
  console.error("Ошибка при импорте каталога Демер:", e);
  await pool.end();
  process.exit(1);
});
