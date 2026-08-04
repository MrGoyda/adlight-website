const fs = require("fs");
const path = require("path");

// Load environment variables from .env.local
try {
  const envPath = path.join(__dirname, "../.env.local");
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, "utf-8");
    for (const line of envConfig.split("\n")) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || "";
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        }
        process.env[key] = value;
      }
    }
    console.log("Loaded environment from .env.local");
  }
} catch (e) {
  console.warn("Could not load .env.local:", e.message);
}

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const demerProducts = [
  // ЛИСТОВЫЕ МАТЕРИАЛЫ
  { name: "ПВХ 3мм/1,22*2,44м АКЦИЯ!!!", price: 1650, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "ПВХ 3мм/плотность 0,50/1,22*2,44м", price: 3000, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "ПВХ 3мм DEMER/плотность 0,60/1,22*2,44м", price: 4600, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "ПВХ 5мм/1,22*2,44м АКЦИЯ!!!", price: 2150, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "ПВХ 5мм/плотность 0,50/1,22*2,44м", price: 5500, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "ПВХ 5мм DEMER /плотность 0,60/1,22*2,44м", price: 7500, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "ПВХ 8мм/1,22*2,44м АКЦИЯ!!!", price: 3550, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "ПВХ 8мм/плотность 0,50/1,22*2,44м", price: 9000, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "ПВХ 8мм DEMER/плотность 0,60/1,22*2,44м", price: 13500, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "ПВХ 10мм/1,22*2,44м АКЦИЯ!!!", price: 5200, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "ПВХ 15мм/1,22*2,44м АКЦИЯ!!!", price: 8500, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "ПВХ 20мм/1,22*2,44м АКЦИЯ!!!", price: 10500, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Оргстекло 1,5мм/прозрачное/1,22*1,83м", price: 3200, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Оргстекло 3мм/матовое/1,22*1,83м", price: 6400, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Оргстекло 3мм/матовое/1,22*2,44м", price: 9200, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Оргстекло 3мм/прозрачное/1,22*1,83м", price: 6400, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Оргстекло 3мм/прозрачное/1,22*2,44м", price: 9200, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Оргстекло 4мм/матовое/1,22*1,83м", price: 9800, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Оргстекло 4мм/матовое/1,22*2,44м", price: 13200, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Оргстекло 4мм/прозрачное/1,22*1,83м", price: 9800, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Оргстекло 4мм/прозрачное/1,22*2,44м", price: 13200, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Оргстекло 5мм/матовое/1,22*1,83м", price: 12200, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Оргстекло 5мм/ матовое /1,22*2,44м", price: 17200, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Оргстекло 5мм/прозрачное/1,22*1,83м", price: 12200, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Оргстекло 5мм/прозрачное/1,22*2,44м", price: 17200, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Оргстекло 7мм/прозрачное/1,22*1,83м", price: 17800, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Оргстекло 9мм/прозрачное/1,22*1,83м", price: 21800, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Акрил 2мм/серебро зеркальное/1,23*2,45m/DEMER", price: 19000, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Акрил 2мм/золото зеркальное/1,23*2,45m/DEMER", price: 19000, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Акрил 2мм/белый 425/1,23*2,45m/DEMER", price: 14500, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Акрил 2мм/прозрачный 000/1,23*2,45m/DEMER", price: 14500, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Акрил 3мм/белый 425/1,23*2,45m/DEMER", price: 17000, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Акрил 3мм/голубой S835/8835/1,23*2,45m/DEMER", price: 17000, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Акрил 3мм/желтый 215/1,23*2,45m/DEMER", price: 17000, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Акрил 3мм/желтый 235/1,23*2,45m/DEMER", price: 17000, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Акрил 3мм/желтый лимонный 237/1,23*2,45m/DEMER", price: 17000, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Акрил 3мм/зеленый 617/1,23*2,45m/DEMER", price: 17000, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Акрил 3мм/коричневый 814/1,23*2,45m/DEMER", price: 17000, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Акрил 3мм/красный 136/1,23*2,45m/DEMER", price: 17000, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Акрил 3мм/оранжевый 266/1,23*2,45m/DEMER", price: 17000, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Акрил 3мм/прозрачный 000/1,23*2,45m/DEMER", price: 17000, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Акрил 3мм/розовый 3557/1,23*2,45m/DEMER", price: 17000, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Акрил 3мм/розовый S100/1,23*2,45m/DEMER", price: 17000, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Акрил 3мм/салатовый 635/1,23*2,45m/DEMER", price: 17000, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Акрил 3мм/серебро зеркальное/1,23*2,45m/DEMER", price: 22000, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Акрил 3мм/золото зеркальное/1,23*2,45m/DEMER", price: 22000, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Акрил 3мм/синий 322/1,23*2,45m/DEMER", price: 17000, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Акрил 3мм/синий 327/1,23*2,45m/DEMER", price: 17000, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Акрил 3мм/серый 505/1,23*2,45m/DEMER", price: 17000, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Акрил 3мм/черный 502/1,23*2,45m/DEMER", price: 17000, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Акрил 3мм/день и ночь/1,23*2,45m/DEMER", price: 23000, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Акрил белый 8мм/ белый А5-425/ 1,26*2,48m", price: 60000, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Алюкобонд 3мм/серый/1,22*2,44м", price: 12500, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Алюкобонд 3мм/8008/молочный/1,22*2,44м", price: 12500, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Алюкобонд 3мм/8011/бежевый/1,22*2,44м", price: 12500, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Алюкобонд 3мм/8024/черный/1,22*2,44м", price: 12500, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Алюкобонд 3мм/8028/темно-зеленый/1,22*2,44м", price: 12500, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Алюкобонд 3мм/8031/зеленый/1,22*2,44м", price: 12500, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Алюкобонд 3мм/8049/золото/1,22*2,44м", price: 12500, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Алюкобонд 3мм/8078/желтый /1,22*2,44м", price: 12500, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Алюкобонд 3мм/8079/красный/1,22*2,44м", price: 12500, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Алюкобонд 3мм/8083/темно-синий/1,22*2,44м", price: 12500, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Алюкобонд 3мм/8086/синий/1,22*2,44м", price: 12500, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Алюкобонд 3мм/8087/белый/1,22*2,44м", price: 12500, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Алюкобонд 3мм/бронза/8023/1,23*2,45", price: 14500, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Алюкобонд 3мм/8001/серебро/1,22*2,44м", price: 14500, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },
  { name: "Алюкобонд 3мм/золото/1,23*2,45", price: 14500, unit: "PIECE", category: "ЛИСТОВЫЕ МАТЕРИАЛЫ" },

  // PET/PVC ЛИСТОВОЙ
  { name: "ПЭТ/ПВС 0,35mm/прозрачный/1,22*2,44", price: 2000, unit: "PIECE", category: "PET/PVC ЛИСТОВОЙ" },
  { name: "ПЭТ/ПВС 0.5mm/прозрачный/1,22*2,44", price: 2400, unit: "PIECE", category: "PET/PVC ЛИСТОВОЙ" },
  { name: "ПЭТ/ПВС 0.75mm/прозрачный/1,22*2,44", price: 3500, unit: "PIECE", category: "PET/PVC ЛИСТОВОЙ" },
  { name: "ПЭТ/ПВС 1mm/прозрачный/1,22*2,44", price: 4700, unit: "PIECE", category: "PET/PVC ЛИСТОВОЙ" },
  { name: "ПЭТ/ПВС 1.5mm/прозрачный/1,22*2,44", price: 6700, unit: "PIECE", category: "PET/PVC ЛИСТОВОЙ" },
  { name: "ПЭТ/ПВС 2mm/прозрачное/1,22*2,44", price: 9000, unit: "PIECE", category: "PET/PVC ЛИСТОВОЙ" },
  { name: "Пластик ABS/золото глянцевый/1,20*0,60м", price: 2500, unit: "PIECE", category: "PET/PVC ЛИСТОВОЙ" },
  { name: "Пластик ABS/золото царапка/1,20*0,60м", price: 2500, unit: "PIECE", category: "PET/PVC ЛИСТОВОЙ" },
  { name: "Пластик ABS/серебро царапка LSR/1,20*0,60м", price: 4200, unit: "PIECE", category: "PET/PVC ЛИСТОВОЙ" },
  { name: "Пластик ABS/серебро глянцевый/1,20*0,60м", price: 2500, unit: "PIECE", category: "PET/PVC ЛИСТОВОЙ" },
  { name: "Пластик ABS/серебро царапка/1,20*0,60м", price: 2500, unit: "PIECE", category: "PET/PVC ЛИСТОВОЙ" },

  // РУЛОННЫЕ МАТЕРИАЛЫ ДЛЯ ПЕЧАТИ
  { name: "Баннер 340gsm/глянцевый/3,2м*50м", price: 35500, unit: "ROLL", category: "РУЛОННЫЕ МАТЕРИАЛЫ" },
  { name: "Баннер 340gsm/матовый/3,2м*50м", price: 35500, unit: "ROLL", category: "РУЛОННЫЕ МАТЕРИАЛЫ" },
  { name: "Пленка для печати OLFA 120gsm/глянцевая/1,27*50м", price: 20200, unit: "ROLL", category: "РУЛОННЫЕ МАТЕРИАЛЫ" },
  { name: "Пленка для печати OLFA 120gsm/глянцевая/1,52*50м", price: 24600, unit: "ROLL", category: "РУЛОННЫЕ МАТЕРИАЛЫ" },
  { name: "Пленка для печати DEMER 120gsm/глянцевая/1,52*50м", price: 10000, unit: "ROLL", category: "РУЛОННЫЕ МАТЕРИАЛЫ" },
  { name: "Пленка магнитная MV04/ толщина 0,4мм/ширина 1м", price: 3000, unit: "RUNNING_METER", category: "РУЛОННЫЕ МАТЕРИАЛЫ" },
  
  // СВЕТОДИОДЫ
  { name: "Светодиоды 5054/0,72w/белые/ теплого свечения", price: 10, unit: "PIECE", category: "СВЕТОДИОДЫ" },
  { name: "Светодиоды с линзой 7015 /DEMER 1.5W", price: 45, unit: "PIECE", category: "СВЕТОДИОДЫ" },
  { name: "Ленточные светодиоды 5050/закрытые/RGB/5м", price: 3800, unit: "ROLL", category: "СВЕТОДИОДЫ" },

  // НЕОН ФЛЕКС 12V
  { name: "Неон флекс белый 6*12/12v/5м", price: 3000, unit: "ROLL", category: "НЕОН ФЛЕКС" },
  
  // БЛОКИ ПИТАНИЯ И УПРАВЛЕНИЕ
  { name: "Трансформатор 100W/ закрытые/ 12V", price: 3900, unit: "PIECE", category: "БЛОКИ ПИТАНИЯ" },
  { name: "Трансформатор открытый 400W/ 33,3А / 12V", price: 6100, unit: "PIECE", category: "БЛОКИ ПИТАНИЯ" },
  { name: "ШВВП (250м/рулон) белый", price: 90, unit: "RUNNING_METER", category: "КАБЕЛЬ" },

  // СКОТЧ/КЛЕЙ
  { name: "Скотч 1см*50м/черный/двухсторонний", price: 1950, unit: "ROLL", category: "СКОТЧ" },
  { name: "502 ОК клей 20 мл", price: 280, unit: "PIECE", category: "КЛЕЙ" },
  { name: "Двухкомпонентный клей MITREAPEL/400мл", price: 1900, unit: "PIECE", category: "КЛЕЙ" }
];

async function main() {
  console.log("Starting import of Demer supplier and pricelist...");

  // Создаем или обновляем поставщика Демер
  const supplier = await prisma.supplier.upsert({
    where: { name: "Демер" },
    update: {
      address: "г. Алматы, ул. Радостовца 152",
      phone: "+77071234567",
      whatsapp: "https://wa.me/77071234567",
      notes: "Основной поставщик листовых пластиков, оргстекла, пленок и светодиодной продукции"
    },
    create: {
      name: "Демер",
      address: "г. Алматы, ул. Радостовца 152",
      phone: "+77071234567",
      whatsapp: "https://wa.me/77071234567",
      notes: "Основной поставщик листовых пластиков, оргстекла, пленок и светодиодной продукции"
    }
  });

  console.log(`Supplier "${supplier.name}" upserted successfully. ID: ${supplier.id}`);

  // Очистим старые цены этого поставщика, если они были, чтобы не плодить дубли
  const deleteCount = await prisma.supplierPrice.deleteMany({
    where: { supplierId: supplier.id }
  });
  console.log(`Deleted ${deleteCount.count} obsolete prices for supplier "${supplier.name}"`);

  // Импортируем товары
  let successCount = 0;
  for (const item of demerProducts) {
    await prisma.supplierPrice.create({
      data: {
        name: item.name,
        price: item.price,
        unit: item.unit,
        supplier: supplier.name, // для обратной совместимости
        supplierId: supplier.id
      }
    });
    successCount++;
  }

  console.log(`Successfully imported ${successCount} prices under supplier "Демер"!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
