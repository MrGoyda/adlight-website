import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

/**
 * Приведение категории и подкатегории к канонической таксономии ADLight
 */
function normalizeTaxonomy(
  currentCategory: string | null,
  currentSubcategory: string | null,
  name: string
): { category: string; subcategory: string } {
  const cat = (currentCategory || "").toLowerCase();
  const sub = (currentSubcategory || "").toLowerCase();
  const n = (name || "").toLowerCase();

  // 1. Листовые материалы
  if (
    cat.includes("лист") ||
    sub.includes("пвх") ||
    sub.includes("акрил") ||
    sub.includes("оргстекл") ||
    sub.includes("акп") ||
    sub.includes("пэт") ||
    sub.includes("abs") ||
    sub.includes("ромарк")
  ) {
    const canonicalCat = "Листовые материалы";
    if (sub.includes("пвх") && !sub.includes("пэт")) return { category: canonicalCat, subcategory: "Вспененный листовой ПВХ" };
    if (sub.includes("акрил") || sub.includes("оргстекл")) return { category: canonicalCat, subcategory: "Листовой акрил и Оргстекло" };
    if (sub.includes("акп") || sub.includes("алюкобонд") || sub.includes("композит")) return { category: canonicalCat, subcategory: "Алюмокомпозит (АКП)" };
    if (sub.includes("пэт") || sub.includes("пластик листовой") || sub.includes("pvc")) return { category: canonicalCat, subcategory: "Пластиковые листы ПЭТ / PVC" };
    if (sub.includes("abs") || sub.includes("ромарк") || sub.includes("двухслойный")) return { category: canonicalCat, subcategory: "Двухслойный пластик (Ромарк / ABS)" };
    if (sub.includes("поликарбонат") || sub.includes("полистирол")) return { category: canonicalCat, subcategory: "Полистирол и Поликарбонат" };
    return { category: canonicalCat, subcategory: "Вспененный листовой ПВХ" };
  }

  // 2. Светотехника и Электрика
  if (
    cat.includes("светотехник") ||
    cat.includes("электр") ||
    cat.includes("блок") ||
    sub.includes("модул") ||
    sub.includes("лент") ||
    sub.includes("неон") ||
    sub.includes("трансформатор") ||
    sub.includes("прожектор") ||
    sub.includes("провод") ||
    sub.includes("контроллер") ||
    sub.includes("ламп")
  ) {
    const canonicalCat = "Светотехника и Электрика";
    if (sub.includes("модул")) return { category: canonicalCat, subcategory: "Светодиодные модули (линзованные)" };
    if (sub.includes("неон")) return { category: canonicalCat, subcategory: "Гибкий неон 12V / 24V" };
    if (sub.includes("лент")) return { category: canonicalCat, subcategory: "Светодиодные ленты" };
    if (sub.includes("блок") || sub.includes("трансформатор")) return { category: canonicalCat, subcategory: "Блоки питания (трансформаторы)" };
    if (sub.includes("контроллер") || sub.includes("диммер")) return { category: canonicalCat, subcategory: "Контроллеры и диммеры" };
    if (sub.includes("провод") || sub.includes("кабел") || sub.includes("электро")) return { category: canonicalCat, subcategory: "Кабели, провода и клеммы" };
    if (sub.includes("прожектор") || sub.includes("ламп")) return { category: canonicalCat, subcategory: "Прожекторы, лампы и освещение" };
    return { category: canonicalCat, subcategory: "Светодиодные модули (линзованные)" };
  }

  // 3. Пленки и Баннеры
  if (
    cat.includes("рулон") ||
    cat.includes("пленк") ||
    cat.includes("винил") ||
    sub.includes("баннер") ||
    sub.includes("v-mark") ||
    sub.includes("demer") ||
    sub.includes("dmr") ||
    sub.includes("витражн") ||
    sub.includes("монтажн") ||
    sub.includes("холст") ||
    sub.includes("бэклит") ||
    sub.includes("ламинац")
  ) {
    const canonicalCat = "Пленки и Баннеры";
    if (sub.includes("баннер") || n.includes("баннер")) return { category: canonicalCat, subcategory: "Баннерная ткань и сетка" };
    if (sub.includes("v-mark") || sub.includes("demer (1.22") || sub.includes("demer (1.07") || sub.includes("641") || n.includes("v-mark") || n.includes("oracal 641")) {
      return { category: canonicalCat, subcategory: "Плоттерные пленки (Oracal 641 / V-MARK)" };
    }
    if (sub.includes("транслюцентн") || sub.includes("8500") || n.includes("транслюцентн") || n.includes("oracal 8500")) {
      return { category: canonicalCat, subcategory: "Светорассеивающие пленки (Oracal 8500 / DEMER)" };
    }
    if (sub.includes("монтажн") || sub.includes("витражн") || n.includes("монтажн") || n.includes("витражн")) {
      return { category: canonicalCat, subcategory: "Монтажные и витражные пленки" };
    }
    if (sub.includes("светоотражающ") || sub.includes("световозвращающ") || sub.includes("перфорированн") || n.includes("светоотражающ") || n.includes("перфорированн")) {
      return { category: canonicalCat, subcategory: "Световозвращающие и перфорированные пленки" };
    }
    if (sub.includes("печать") || sub.includes("ламинац") || n.includes("ламинат") || n.includes("пленка для печати")) {
      return { category: canonicalCat, subcategory: "Пленки для печати и ламинация" };
    }
    if (sub.includes("холст") || sub.includes("бэклит") || sub.includes("ткани") || sub.includes("фотобумаг") || sub.includes("винил") || sub.includes("флекс")) {
      return { category: canonicalCat, subcategory: "Холсты, бэклит и ткани для печати" };
    }
    return { category: canonicalCat, subcategory: "Пленки для печати и ламинация" };
  }

  // 4. Профили и Металл
  if (cat.includes("профил") || sub.includes("профил") || sub.includes("багет") || sub.includes("кайма") || sub.includes("труб") || sub.includes("уголок")) {
    const canonicalCat = "Профили и Металл";
    if (n.includes("тюбинг") || n.includes("короб") || sub.includes("алюминиевые")) return { category: canonicalCat, subcategory: "Алюминиевые профили для световых коробов и рамок" };
    if (sub.includes("кайма") || sub.includes("багет")) return { category: canonicalCat, subcategory: "Кайма и багетный профиль" };
    if (sub.includes("борт")) return { category: canonicalCat, subcategory: "Бортогибочные ленты и профили (для букв)" };
    if (sub.includes("труб")) return { category: canonicalCat, subcategory: "Профильная труба (сталь и алюминий)" };
    return { category: canonicalCat, subcategory: "Уголки, швеллеры и полосы" };
  }

  // 5. Клеи, Скотчи и Крепеж
  if (
    cat.includes("клей") ||
    cat.includes("скотч") ||
    cat.includes("краск") ||
    cat.includes("инструмент") ||
    cat.includes("станок") ||
    cat.includes("фрез") ||
    cat.includes("hardware") ||
    cat.includes("крепеж")
  ) {
    const canonicalCat = "Клеи, Скотчи и Крепеж";
    if (sub.includes("скотч") || n.includes("скотч")) return { category: canonicalCat, subcategory: "Двусторонние вспененные скотчи" };
    if (sub.includes("клей") || n.includes("клей") || n.includes("cosmofen")) return { category: canonicalCat, subcategory: "Клеи и герметики (монтажные, 2-х компонентные)" };
    if (sub.includes("химия") || n.includes("очиститель") || sub.includes("ленты")) return { category: canonicalCat, subcategory: "Специальные и малярные ленты" };
    if (sub.includes("краск") || sub.includes("чернил") || n.includes("bosny") || n.includes("краска")) return { category: canonicalCat, subcategory: "Аэрозольные краски и чернила" };
    if (sub.includes("дистанционн") || sub.includes("держател") || sub.includes("люверс") || sub.includes("метиз") || sub.includes("саморез")) {
      return { category: canonicalCat, subcategory: "Дистанционные держатели и метизы" };
    }
    if (sub.includes("инструмент") || sub.includes("ракел") || sub.includes("резак") || sub.includes("стенд")) {
      return { category: canonicalCat, subcategory: "Монтажный инструмент, резаки и ракели" };
    }
    if (sub.includes("фрез") || sub.includes("гравер") || sub.includes("плоттер") || sub.includes("сверл") || sub.includes("станок")) {
      return { category: canonicalCat, subcategory: "Фрезы, сверла и комплектующие ЧПУ" };
    }
    return { category: canonicalCat, subcategory: "Клеи и герметики (монтажные, 2-х компонентные)" };
  }

  // 6. Перезаказ услуг
  if (cat.includes("перезаказ") || sub.includes("перезаказ") || cat.includes("услуг")) {
    return { category: "Перезаказ услуг (Подрядчики)", subcategory: "Широкоформатная и интерьерная печать" };
  }

  return { category: "Листовые материалы", subcategory: "Вспененный листовой ПВХ" };
}

async function main() {
  console.log("==========================================================");
  console.log("  Синхронизация и нормализация таксономии всей базы цен   ");
  console.log("==========================================================");

  const items = await prisma.supplierPrice.findMany();
  console.log(`Всего позиций в базе: ${items.length}`);

  let updatedCount = 0;
  for (const it of items) {
    const { category, subcategory } = normalizeTaxonomy(it.category, it.subcategory, it.name);

    if (it.category !== category || it.subcategory !== subcategory) {
      await prisma.supplierPrice.update({
        where: { id: it.id },
        data: {
          category,
          subcategory,
        },
      });
      updatedCount++;
    }
  }

  console.log(`[Готово] Успешно синхронизировано и обновлено: ${updatedCount} позиций.`);
  console.log("==========================================================");

  await pool.end();
}

main().catch(async (e) => {
  console.error("Ошибка синхронизации таксономии:", e);
  await pool.end();
  process.exit(1);
});
