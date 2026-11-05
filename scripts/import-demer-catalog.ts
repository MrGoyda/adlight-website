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
    if (sub.includes("оргстекло")) return { category, subcategory: "Листовое оргстекло" };
    if (sub.includes("акрил")) return { category, subcategory: "Листовой акрил" };
    if (sub.includes("алюкобонд")) return { category, subcategory: "Алюмокомпозит (АКП)" };
    if (sub.includes("пэт") || sub.includes("листовой")) return { category, subcategory: "ПЭТ и жесткий листовой пластик" };
    if (sub.includes("abs") || sub.includes("пластик")) return { category, subcategory: "Двухслойный пластик ABS (Ромарк)" };
    return { category, subcategory: "Листовые пластики" };
  }

  // 2. Рулонные материалы
  if (sec.includes("рулонные")) {
    const category = "Рулонные материалы";
    if (name.includes("баннер") || name.includes("сетка")) return { category, subcategory: "Баннерная ткань и сетка" };
    if (name.includes("бэклит")) return { category, subcategory: "Бэклит (Backlit)" };
    if (name.includes("холст")) return { category, subcategory: "Холсты для печати" };
    if (name.includes("ламинат")) return { category, subcategory: "Пленки для холодной ламинации" };
    if (name.includes("флажная")) return { category, subcategory: "Ткани для печати" };
    if (name.includes("фотобумага")) return { category, subcategory: "Фотобумага для печати" };
    if (name.includes("флекс")) return { category, subcategory: "Термотрансферный флекс" };
    if (name.includes("магнит")) return { category, subcategory: "Магнитный винил" };
    return { category, subcategory: "Самоклеящиеся пленки для печати" };
  }

  // 3. Светодиоды, неон и освещение
  if (sec.includes("светодиоды") || sec.includes("освещение")) {
    const category = "Светотехника";
    if (sub.includes("модули")) return { category, subcategory: "Светодиодные модули" };
    if (sub.includes("ленты") || sub.includes("неон")) return { category, subcategory: "Светодиодные ленты и гибкий неон" };
    if (sub.includes("лампы") || sub.includes("прожектор")) return { category, subcategory: "Прожекторы и лампы" };
    return { category, subcategory: "Светодиодная продукция" };
  }

  // 4. Блоки питания, трансформаторы и управление
  if (sec.includes("блоки питания") || sec.includes("трансфоматоры") || sec.includes("управление")) {
    const category = "Блоки питания и электротехника";
    if (sub.includes("закрытые")) return { category, subcategory: "Блоки питания закрытые (IP67 12V)" };
    if (sub.includes("полузакрытые")) return { category, subcategory: "Блоки питания полузакрытые (12V)" };
    if (sub.includes("открытые")) return { category, subcategory: "Блоки питания открытые (12V / 5V)" };
    if (sub.includes("контроллеры") || sub.includes("кабель")) return { category, subcategory: "Контроллеры, провод и электротовары" };
    return { category, subcategory: "Трансформаторы и блоки питания" };
  }

  // 5. Скотч, клей и химия
  if (sec.includes("скотч") || sec.includes("клей") || sec.includes("химия")) {
    const category = "Клеи, скотч и химия";
    if (name.includes("скотч")) return { category, subcategory: "Двухсторонний скотч" };
    if (name.includes("клей") || name.includes("cosmofen") || name.includes("активатор") || name.includes("ca-12")) {
      return { category, subcategory: "Клеи и активаторы (Cosmofen и др.)" };
    }
    return { category, subcategory: "Химия и очистители" };
  }

  // 6. Алюминиевые профили
  if (sec.includes("профили")) {
    return { category: "Профили и фурнитура", subcategory: "Алюминиевые профили" };
  }

  // 7. Краски и сольвенты
  if (sec.includes("краски") || sec.includes("сольвенты")) {
    const category = "Краски и чернила";
    if (sub.includes("аэрозольные") || name.includes("bosny") || name.includes("краска-спрей")) {
      return { category, subcategory: "Аэрозольные краски Bosny" };
    }
    return { category, subcategory: "Сольвентные и экосольвентные чернила" };
  }

  // 8. Оборудование, конструкции и инструменты
  if (sec.includes("оборудование") || sec.includes("инструменты")) {
    const category = "Инструменты и оборудование";
    if (sub.includes("мобильные") || sub.includes("конструкции")) return { category, subcategory: "Мобильные стенды и конструкции" };
    if (sub.includes("дистанционные") || sub.includes("держатели") || sub.includes("фурнитура")) {
      return { category, subcategory: "Дистанционные держатели и люверсы" };
    }
    if (sub.includes("резаки") || sub.includes("ракели") || sub.includes("лезвия")) {
      return { category, subcategory: "Монтажный инструмент и ракели" };
    }
    if (sub.includes("кайма") || sub.includes("багет")) return { category, subcategory: "Кайма и багетный профиль" };
    return { category, subcategory: "Инструменты для наружной рекламы" };
  }

  // 9. Фрезы, сверла и запчасти для станков
  if (sec.includes("фрезы") || sec.includes("сверла")) {
    const category = "Расходные материалы для станков";
    if (name.includes("гравировочн")) return { category, subcategory: "Гравировальные граверы" };
    if (name.includes("фрезерн") || name.includes("фреза")) return { category, subcategory: "Спиральные и концевые фрезы" };
    if (name.includes("плоттер") || name.includes("roland")) return { category, subcategory: "Ножи для плоттера" };
    return { category, subcategory: "Сверла, цанги и комплектующие ЧПУ" };
  }

  // 10. Цветные, транслюцентные и витражные пленки
  if (sec.includes("пленки") || sec.includes("цветные")) {
    const category = "Самоклеящиеся пленки";
    if (sub.includes("v-mark")) return { category, subcategory: "Цветные плоттерные пленки V-MARK" };
    if (sub.includes("транслюцентная")) return { category, subcategory: "Транслюцентные пленки DEMER" };
    if (sub.includes("1,07")) return { category, subcategory: "Цветные пленки DEMER (1.07м)" };
    if (sub.includes("1,22")) return { category, subcategory: "Цветные пленки DEMER (1.22м)" };
    if (sub.includes("светоотражающие")) return { category, subcategory: "Светоотражающие пленки DMR" };
    if (sub.includes("витражные") || sub.includes("монтажные")) return { category, subcategory: "Витражные и монтажные пленки" };
    return { category, subcategory: "Плоттерные пленки" };
  }

  return { category: "Материалы для рекламы", subcategory: "Прочие материалы" };
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
