const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const signTechProducts = [
  // ПВХ
  { name: "ПВХ 3мм (плотность 0,45) 1,22х2,44м", price: 1730, unit: "PIECE" },
  { name: "ПВХ 4,5мм (плотность 0,45) 1,22х2,44м", price: 2250, unit: "PIECE" },
  { name: "ПВХ 5мм (плотность 0,45) 1,22х2,44м", price: 2550, unit: "PIECE" },
  { name: "ПВХ 5мм (чёрный 0,60) 1,22х2,44м", price: 7500, unit: "PIECE" },
  { name: "ПВХ 8мм (плотность 0,45) 1,22х2,44м", price: 3775, unit: "PIECE" },
  { name: "ПВХ 8мм (чёрный 0,60) 1,22х2,44м", price: 11500, unit: "PIECE" },
  { name: "ПВХ 10мм (плотность 0,45) 1,22х2,44м", price: 5650, unit: "PIECE" },
  { name: "ПВХ 15мм (плотность 0,45) 1,22х2,44м", price: 9300, unit: "PIECE" },
  { name: "ПВХ 20мм (плотность 0,45) 1,22х2,44м", price: 11500, unit: "PIECE" },
  { name: "ПВХ 3мм (плотность 0,50) 1,22х2,44м", price: 3000, unit: "PIECE" },
  { name: "ПВХ 5мм (плотность 0,50) 1,22х2,44м", price: 4800, unit: "PIECE" },
  { name: "ПВХ 8мм (плотность 0,50) 1,22х2,44м", price: 7650, unit: "PIECE" },
  { name: "ПВХ 3мм (плотность 0,60) 2,05х3,05м", price: 9500, unit: "PIECE" },
  { name: "ПВХ 5мм (плотность 0,60) 2,05х3,05м", price: 15000, unit: "PIECE" },
  { name: "ПВХ 8мм (плотность 0,60) 2,05х3,05м", price: 22500, unit: "PIECE" },

  // PVC/PET/Фомакс
  { name: "PVC PET 0,35мм (прозрачный) 1,22х2,44м", price: 1735, unit: "PIECE" },
  { name: "PVC PET 0,5мм (прозрачный) 1,22х2,44м", price: 2145, unit: "PIECE" },
  { name: "PVC PET 0,75мм (прозрачный) 1,22х2,44м", price: 3165, unit: "PIECE" },
  { name: "PVC 1,0мм (прозрачный) 1,22х2,44м", price: 5300, unit: "PIECE" },
  { name: "PVC 1,0мм (белый) 1,22х2,44м", price: 5500, unit: "PIECE" },
  { name: "PVC 1,0мм (черный) 1,22х2,44м", price: 5500, unit: "PIECE" },
  { name: "PVC PET 1,5мм (прозрачный) 1,22х2,44м", price: 6325, unit: "PIECE" },
  { name: "PVC PET 2,0мм (прозрачный) 1,22х2,44м", price: 8160, unit: "PIECE" },
  { name: "PVC 2,0мм (белый) 1,22х2,44м", price: 10500, unit: "PIECE" },
  { name: "PVC 2,0мм (черный) 1,22х2,44м", price: 11000, unit: "PIECE" },
  { name: "PVC 3,0мм (белый) 1,22х2,44м", price: 16830, unit: "PIECE" },
  { name: "PET 1мм (прозрачный) 1,22х2,44м", price: 3980, unit: "PIECE" },

  // Ромарк / Пластик для гравировки
  { name: "Ромарк золото/глянец 0.6x1.2м", price: 2960, unit: "PIECE" },
  { name: "Ромарк золото/матовый 0.6x1.2м", price: 2960, unit: "PIECE" },
  { name: "Ромарк серебро/глянец 0.6x1.2м", price: 2960, unit: "PIECE" },
  { name: "Ромарк серебро/матовый 0.6x1.2м", price: 2960, unit: "PIECE" },
  { name: "Ромарк цветной (синий) 0.6x1.2м", price: 2650, unit: "PIECE" },

  // Акрил Sunshine 1,22х2,44
  { name: "Акрил 1.8мм (прозрачный) 1,22х2,44м", price: 12400, unit: "PIECE" },
  { name: "Акрил 1.8мм (белый) 1,22х2,44м", price: 12400, unit: "PIECE" },
  { name: "Акрил 1.8мм (цветной) 1,22х2,44м", price: 12400, unit: "PIECE" },
  { name: "Акрил 2.5мм (прозрачный) 1,22х2,44м", price: 16400, unit: "PIECE" },
  { name: "Акрил 2.5мм (белый) 1,22х2,44м", price: 16400, unit: "PIECE" },
  { name: "Акрил 2.5мм (Цветной) 1,22х2,44м", price: 16400, unit: "PIECE" },
  { name: "Акрил 8мм (белый) 1,22х2,44м", price: 59000, unit: "PIECE" },
  { name: "Акрил 10мм (белый) 1,22х2,44м", price: 68000, unit: "PIECE" },
  { name: "Акрил 15мм (прозрачный) 1,22х2,44м", price: 100000, unit: "PIECE" },
  { name: "Акрил 20мм (прозрачный/белый) 1,22х2,44м", price: 143000, unit: "PIECE" },
  { name: "Акрил 2мм Золото 1,22х1,83м", price: 12750, unit: "PIECE" },
  { name: "Акрил 2мм Золото 1,22х2,44м", price: 16830, unit: "PIECE" },
  { name: "Акрил 3мм Золото 1,22х2,44м", price: 24000, unit: "PIECE" },
  { name: "Акрил 2мм Зеркальное серебро 1,22х2,44м", price: 16830, unit: "PIECE" },
  { name: "Акрил 3мм Зеркальное серебро 1,22х2,44м", price: 20500, unit: "PIECE" },

  // Акрил 2.15х3.15м
  { name: "Акрил (красный 136) 3мм 2,15х3,15м", price: 49500, unit: "PIECE" },
  { name: "Акрил (черный 502) 3мм 2,15х3,15м", price: 49500, unit: "PIECE" },

  // Акрил Jumei (1.25*2.45)
  { name: "Акрил 2мм JM (белый) 1,25х2,45м", price: 16000, unit: "PIECE" },
  { name: "Акрил 3мм JM (прозрачный) 1,25х2,45м", price: 20500, unit: "PIECE" },
  { name: "Акрил 3мм JM (белый) 1,25х2,45м", price: 20500, unit: "PIECE" },
  { name: "Акрил 3мм JM (Цветной) 1,25х2,45м", price: 20500, unit: "PIECE" },
  { name: "Акрил 3мм JM День-ночь 1,25х2,45м", price: 20500, unit: "PIECE" },
  { name: "Акрил 4мм JM (прозрачный) 1,25х2,45м", price: 30000, unit: "PIECE" },
  { name: "Акрил 4мм JM (белый) 1,25х2,45м", price: 30000, unit: "PIECE" },
  { name: "Акрил 5мм JM (прозрачный) 1,25х2,45м", price: 37500, unit: "PIECE" },
  { name: "Акрил 5мм JM (белый) 1,25х2,45м", price: 37500, unit: "PIECE" },
  { name: "Акрил 8мм JM (прозрачный) 1,25х2,45м", price: 58140, unit: "PIECE" },
  { name: "Акрил 10мм JM (прозрачный) 1,25х2,45м", price: 67000, unit: "PIECE" },

  // Акрил Jumei 2.08х3.08м
  { name: "Акрил (белый/прозрачный) 3мм 2,08х3,08м", price: 49500, unit: "PIECE" },
  { name: "Акрил (прозрачный) 4мм 2,08х3,08м", price: 66300, unit: "PIECE" },
  { name: "Акрил (прозрачный) 5мм 2,08х3,08м", price: 85500, unit: "PIECE" },

  // Алюкобонд OYU Bond 1,22х2,44
  { name: "Алюкобонд OYU Bond 3мм 12 мкр (цветные) 1,22х2,44м", price: 12955, unit: "PIECE" },
  { name: "Алюкобонд OYU Bond 3мм 18 мкр (цветные) 1,22х2,44м", price: 15400, unit: "PIECE" },
  { name: "Алюкобонд OYU Bond 4мм 21 мкр (цветные) 1,22х2,44м", price: 19890, unit: "PIECE" },

  // Алюкобонд OYU Bond 1,22х4м
  { name: "Алюкобонд OYU Bond 3мм 18 мкр Белый 8809 1,22х4м", price: 25704, unit: "PIECE" },
  { name: "Алюкобонд OYU Bond 3мм 18 мкр Черный 8808 1,22х4м", price: 25704, unit: "PIECE" },
  { name: "Алюкобонд 3мм 18 мкр Серебро 002/8801 1,22х4м", price: 25704, unit: "PIECE" },

  // Тюбинг / Профиль
  { name: "Тюбинг 0,6мм (2.5*5*6м) 6м", price: 4185, unit: "PIECE" },
  { name: "Тюбинг 0,8мм (2.5*5*6м) 6м", price: 6325, unit: "PIECE" },
  { name: "Профиль алюминиевый 4см для ткани 6м (KB-04D)", price: 8160, unit: "PIECE" },
  { name: "Профиль алюминиевый 6см для ткани 6м (KB-06K)", price: 10200, unit: "PIECE" },
  { name: "Профиль алюминиевый 8см для ткани 6м (KB-08C)", price: 13000, unit: "PIECE" },
  { name: "Уголок металлический для профиля 4см-6см-8см 45*13", price: 102, unit: "PIECE" },
  { name: "Уголок металлический для профиля 4см-6см-8см 45*7", price: 102, unit: "PIECE" },
  { name: "Уголок металлический для профиля 8см 60*17.5", price: 102, unit: "PIECE" },

  // Оргстекло 1,22х1,83
  { name: "Оргстекло 1,3мм (прозрачный) 1,22х1,83м", price: 3265, unit: "PIECE" },
  { name: "Оргстекло 1,5мм (прозрачный) 1,22х1,83м", price: 3880, unit: "PIECE" },
  { name: "Оргстекло 2мм (прозрачный) 1,22х1,83м", price: 4900, unit: "PIECE" },
  { name: "Оргстекло 2мм (матовый) 1,22х1,83м", price: 4700, unit: "PIECE" },
  { name: "Оргстекло 3мм (прозрачный) 1,22х1,83м", price: 6940, unit: "PIECE" },
  { name: "Оргстекло 3мм (матовый) 1,22х1,83м", price: 6940, unit: "PIECE" },
  { name: "Оргстекло 4мм (прозрачный/матовый) 1,22х1,83м", price: 9690, unit: "PIECE" },
  { name: "Оргстекло 5мм (прозрачный) 1,22х1,83м", price: 13600, unit: "PIECE" },
  { name: "Оргстекло 5мм (матовый) 1,22х1,83м", price: 13600, unit: "PIECE" },
  { name: "Оргстекло 7мм (прозрачный) 1,22х1,83м", price: 19380, unit: "PIECE" },
  { name: "Оргстекло 7мм (матовый) 1,22х1,83м", price: 19380, unit: "PIECE" },
  { name: "Оргстекло 9мм (прозрачный/матовый) 1,22х1,83м", price: 26010, unit: "PIECE" },

  // Оргстекло 1,22х2,44
  { name: "Оргстекло 3мм (прозрачный/матовый) 1,22х2,44м", price: 10100, unit: "PIECE" },
  { name: "Оргстекло 4мм (прозрачный) 1,22х2,44м", price: 13770, unit: "PIECE" },
  { name: "Оргстекло 4мм (матовый) 1,22х2,44м", price: 14280, unit: "PIECE" },
  { name: "Оргстекло 5мм (прозрачный) 1,22х2,44м", price: 17340, unit: "PIECE" },
  { name: "Оргстекло 5мм (матовый) 1,22х2,44м", price: 18200, unit: "PIECE" },
  { name: "Оргстекло 7мм (прозрачный) 1,22х2,44м", price: 29580, unit: "PIECE" },
  { name: "Оргстекло 7мм (матовый) 1,22х2,44м", price: 29580, unit: "PIECE" },
  { name: "Оргстекло 9мм (прозрачный/матовый) 1,22х2,44м", price: 34170, unit: "PIECE" },

  // Баннер / Рулонные материалы
  { name: "Баннер 300гр (Глянец/Матовый) 3,2х50м", price: 37500, unit: "ROLL" },
  { name: "Баннер 340гр (Матовый/Глянец) 3,2х50м", price: 39500, unit: "ROLL" },
  { name: "Баннер 340гр (Матовый/Глянец) 1,5х50м", price: 21500, unit: "ROLL" },
  { name: "Баннер 340гр (Матовый/Глянец) 1,8х50м", price: 25300, unit: "ROLL" },
  { name: "Баннер 340гр (Глянец/Матовый) 1,2х50м", price: 17800, unit: "ROLL" },
  { name: "Баннер 340гр (Матовый/Глянцевый) 2,5х50м", price: 33000, unit: "ROLL" },
  { name: "Баннер 400гр (3.2x50м) Матовый Greyback 3,2х50м", price: 56000, unit: "ROLL" },
  { name: "Баннер 340гр Матовый с серой подложкой 3,2х50м", price: 41000, unit: "ROLL" },
  { name: "Баннерная сетка 350гр 3,2х50м", price: 65000, unit: "ROLL" },
  { name: "Баннер 400гр (Глянец/Матовый) 3,2х50м", price: 49500, unit: "ROLL" },
  { name: "Баннер 440гр (Глянец/Матовый) 3,2х50м", price: 53000, unit: "ROLL" },
  { name: "Баннер 550гр Литой (Глянец/Матовый) 3,2х50м", price: 88000, unit: "ROLL" },
  { name: "Тентовая ткань 650гр Белый 2.5x50м PVC Tarpaulin", price: 153000, unit: "ROLL" },

  // Винил ЭКОНОМ 120гр
  { name: "Винил ЭКО (сольвент) 120гр (Матовый/Глянцевый) 0.914х50м", price: 14800, unit: "ROLL" },
  { name: "Винил ЭКО (сольвент) 120гр (Матовый/Глянцевый) 1,07х50м", price: 16800, unit: "ROLL" },
  { name: "Винил ЭКО (сольвент) 120гр (Матовый/Глянцевый) 1,27х50м", price: 20500, unit: "ROLL" },
  { name: "Винил ЭКО (сольвент) 120гр (Матовый/Глянцевый) 1,52х50м", price: 24800, unit: "ROLL" },

  // Винил 140гр
  { name: "Винил (сольвент) 140гр (Матовый/Глянцевый) 0.914х50м", price: 19500, unit: "ROLL" },
  { name: "Винил (сольвент) 140гр (Матовый/Глянцевый) 1,07х50м", price: 23500, unit: "ROLL" },
  { name: "Винил (сольвент) 140гр (Матовый/Глянцевый) 1,27х50м", price: 27800, unit: "ROLL" },
  { name: "Винил (сольвент) 140гр (Матовый/Глянцевый) 1,52х50м", price: 33000, unit: "ROLL" },
  { name: "Винил (сольвент) 140гр (Матовый/Глянцевый) 1,82х50м", price: 56100, unit: "ROLL" },
  { name: "Винил (сольвент) 140гр (Матовый/Глянцевый) 2,00х50м", price: 63240, unit: "ROLL" },

  // Винил GLP 140гр
  { name: "Винил GLP 140гр (Матовый/Глянцевый) 1,07х50м", price: 24500, unit: "ROLL" },
  { name: "Винил GLP 140гр (Матовый/Глянцевый) 1,27х50м", price: 28800, unit: "ROLL" },
  { name: "Винил GLP 140гр (Матовый/Глянцевый) 1,52х50м", price: 33800, unit: "ROLL" },
  { name: "Винил GLP 140гр с серой подложкой Матовый 1,27х50м", price: 31000, unit: "ROLL" },
  { name: "Винил OYUFILM 140гр (Матовый/Глянцевый) 1,27х50м", price: 25800, unit: "ROLL" },

  // Винил с воздушными каналами Bubble Free
  { name: "Винил Bubble Free с воздушными каналами (глянцевая/матовая) 140гр 1,27х50м", price: 30600, unit: "ROLL" },
  { name: "Винил Bubble Free с воздушными каналами (глянцевая/матовая) 140гр 1,52х50м", price: 37500, unit: "ROLL" },

  // Винил перфорированный
  { name: "Винил перфорированный 1,07х50м", price: 41500, unit: "ROLL" },
  { name: "Винил перфорированный 1,27х50м", price: 47000, unit: "ROLL" },
  { name: "Винил перфорированный 1,52х50м", price: 57000, unit: "ROLL" },

  // Винил Прозрачный
  { name: "Винил Прозрачный сольвент матовый (1005) 140гр 1,27х50м", price: 24500, unit: "ROLL" },
  { name: "Винил Прозрачный сольвент матовый (1005) 1,52х50м", price: 28000, unit: "ROLL" },
  { name: "Винил Прозрачный сольвент глянцевый (1006) 140гр 1,27х50м", price: 24500, unit: "ROLL" },
  { name: "Винил Прозрачный сольвент глянцевый (1006) 140гр 1,52х50м", price: 28000, unit: "ROLL" },

  // Пленка Black Out
  { name: "Пленка BLACK OUT для печати 1,27х50м", price: 28500, unit: "ROLL" },
  { name: "Пленка BLACK OUT для печати (матовый) 1,52х50м", price: 35500, unit: "ROLL" },
  { name: "Пленка BLACK OUT для печати (глянец) 1,52х50м", price: 35500, unit: "ROLL" },

  // Ткань для печати
  { name: "Ткань для сольвентной печати (Politex/шелк) 1,07х50м", price: 14280, unit: "ROLL" },
  { name: "Ткань для сольвентной печати (Politex/шелк) 1,27х50м", price: 18360, unit: "ROLL" },
  { name: "Ткань для сольвентной печати (Politex/шелк) 1,52х50м", price: 20400, unit: "ROLL" },
  { name: "Ткань для сольвентной печати (Politex/шелк) 1,82х50м", price: 28560, unit: "ROLL" },

  // Скроллеры, флаговая
  { name: "Виниловая пленка матовая 200гр (скроллеры) 2.85x100м", price: 212160, unit: "ROLL" },
  { name: "Виниловая пленка матовая 200гр (скроллеры) 3.2x100м", price: 229500, unit: "ROLL" },
  { name: "Ткань для лайтбоксов с покрытием PVC 150гр 3.2x100м", price: 283665, unit: "ROLL" },
  { name: "Ткань для сублимаций FL012 70гр 1.1x200м", price: 61200, unit: "ROLL" },
  { name: "Ткань для сублимаций FL012 90гр 1.1x100м", price: 37740, unit: "ROLL" },
  { name: "Ткань для сублимаций FL012 90гр 1.6x100м", price: 55080, unit: "ROLL" },
  { name: "Ткань для сублимаций FL0101 110гр 1.1x100м", price: 44880, unit: "ROLL" },
  { name: "Ткань для сублимаций FL0101 110гр 1.6x100м", price: 68340, unit: "ROLL" },
  { name: "Обои для сольвентной печати 255гр 1,07х50м", price: 36720, unit: "ROLL" },

  // Холст
  { name: "ХОЛСТ для Экосольвентной печати 290гр (матовый/глянцевый) 0.914х30м", price: 19890, unit: "ROLL" },
  { name: "ХОЛСТ для Экосольвентной печати 290гр (матовый/глянцевый) 1,07х30м", price: 22440, unit: "ROLL" },
  { name: "ХОЛСТ для Экосольвентной печати 290гр (матовый/глянцевый) 1,27х30м", price: 27030, unit: "ROLL" },
  { name: "ХОЛСТ для Экосольвентной печати 290гр (матовый/глянцевый) 1,52х30м", price: 32640, unit: "ROLL" },
  { name: "ХОЛСТ для Экосольвентной печати 400гр (матовый/глянцевый) 0.914х30м", price: 37740, unit: "ROLL" },
  { name: "ХОЛСТ для Экосольвентной печати 400гр (матовый/глянцевый) 1,07х30м", price: 42840, unit: "ROLL" },
  { name: "ХОЛСТ для Экосольвентной печати 400гр (матовый/глянцевый) 1,27х30м", price: 55080, unit: "ROLL" },
  { name: "ХОЛСТ для Экосольвентной печати 400гр (матовый/глянцевый) 1,52х30м", price: 62730, unit: "ROLL" },

  // Ткань флаговая
  { name: "Ткань флаговая с подложкой 1,27х50м", price: 53040, unit: "ROLL" },
  { name: "Ткань флаговая с подложкой 1,52х50м", price: 66300, unit: "ROLL" },

  // Ткань для лайтбоксов
  { name: "Ткань для лайтбоксов (180гр) 1.3x100м", price: 117300, unit: "ROLL" },
  { name: "Ткань для лайтбоксов (180гр) 1.6x100м", price: 132600, unit: "ROLL" },
  { name: "Ткань для лайтбоксов (180гр) 2.1x100м", price: 183600, unit: "ROLL" },
  { name: "Ткань для лайтбоксов (180гр) 2.6x100м", price: 224400, unit: "ROLL" },
  { name: "Ткань для лайтбоксов (180гр) 3.2x100м", price: 280500, unit: "ROLL" },
  { name: "Пвх лента под профиль для ткани (резинка) 3.15х200м", price: 22950, unit: "ROLL" },
  { name: "Пвх лента под профиль для ткани (резинка) 3.10х250м", price: 22950, unit: "ROLL" },

  // Бэклит
  { name: "Бэклит для сольвента PET (на просвет) 180 mic 1.27x50м", price: 45900, unit: "ROLL" },
  { name: "Бэклит для сольвента PET (на просвет) 180 mic 1.52x50м", price: 48960, unit: "ROLL" },
  { name: "Бэклит пластик PVC с серой подложкой 420 мкр 0.914x50м", price: 31110, unit: "ROLL" },
  { name: "Бэклит plastic PVC с серой подложкой 420 мкр 1.07x50м", price: 36720, unit: "ROLL" },
  { name: "Бэклит plastic PVC с серой подложкой 420 мкр 1.27x50м", price: 43350, unit: "ROLL" },
  { name: "Бэклит plastic PVC с серой подложкой 420 мкр 1.52x50м", price: 51510, unit: "ROLL" },
  { name: "Бэклит для сольвента 350гр (белая подложка) 1.07x50м", price: 34680, unit: "ROLL" },
  { name: "Бэклит для сольвента 180микрон (белый на просвет) 0.914x30м", price: 21420, unit: "ROLL" },
  { name: "Бэклит для сольвента 170мкр (белый на просвет) 0.914x30м", price: 21420, unit: "ROLL" },
  { name: "Бэклит для пигмента 160мкр (белый на просвет) 1.27x50м", price: 20710, unit: "ROLL" },
  { name: "Бэклит BF-03 калька с обратной печатью 0.91x50м", price: 15810, unit: "ROLL" },
  { name: "Бэклит BF-03 калька с обратной печатью 130гр 1.07x50м", price: 18360, unit: "ROLL" },
  { name: "Бэклит BF-03 калька с обратной печатью 120гр 1.27x50м", price: 20400, unit: "ROLL" },
  { name: "Бэклит BF-03 калька с обратной печатью 1.52x50м", price: 26010, unit: "ROLL" },

  // Фотобумага
  { name: "Фотобумага сольвентный 0.914x30м", price: 13770, unit: "ROLL" },
  { name: "Фотобумага сольвентный 1.07x30м", price: 16830, unit: "ROLL" },
  { name: "Фотобумага сольвентный 1.27x30м", price: 18870, unit: "ROLL" },
  { name: "Фотобумага сольвентный 1.52x30м", price: 22440, unit: "ROLL" },

  // Пигментные материалы
  { name: "Винил / самоклейка 110гр (HP) 0.914x50м", price: 8200, unit: "ROLL" },
  { name: "Винил / самоклейка 110гр (HP) 1.07x50м", price: 10000, unit: "ROLL" },
  { name: "Винил / самоклейка 110гр (HP) 1.27x50м", price: 11000, unit: "ROLL" },
  { name: "Винил / самоклейка 140гр (HP) 0.914x50м", price: 10400, unit: "ROLL" },
  { name: "Винил / самоклейка 140гр (HP) 1.07x50м", price: 12300, unit: "ROLL" },
  { name: "Винил / самоклейка 140гр (HP) 1.27x50м", price: 14000, unit: "ROLL" },
  { name: "Винил / самоклейка 140гр (HP) 1.52x50м", price: 18000, unit: "ROLL" },

  { name: "Фотобумага 220гр Экосольвент Глянцевая 0.914x30м", price: 15760, unit: "ROLL" },
  { name: "Фотобумага Экосольвент 240гр глянцевая 1.27x30м", price: 21930, unit: "ROLL" },
  { name: "Фотобумага 220гр Экосольвент Глянцевая 1.52x30м", price: 24480, unit: "ROLL" },

  { name: "Бэклит (калька) с обратной печатью 0.914x50м", price: 15810, unit: "ROLL" },
  { name: "Бэклит (калька) с обратной печатью 1.07x50м", price: 18360, unit: "ROLL" },
  { name: "Бэклит (калька) с обратной печатью 120гр 1.27x50м", price: 20400, unit: "ROLL" },
  { name: "Бэклит (калька) с обратной печатью 1.52x50м", price: 26010, unit: "ROLL" },

  { name: "ХОЛСТ Пигмент 290гр матовый 0.914x30м", price: 19890, unit: "ROLL" },
  { name: "ХОЛСТ Пигмент 290гр матовый 1.07x30м", price: 22440, unit: "ROLL" },
  { name: "ХОЛСТ Пигмент 290гр матовый 1.27x30м", price: 27030, unit: "ROLL" },
  { name: "ХОЛСТ Пигмент 290гр матовый 1.52x30м", price: 32640, unit: "ROLL" },
  { name: "ХОЛСТ Пигмент 400гр матовый 0.914x30м", price: 38760, unit: "ROLL" },
  { name: "ХОЛСТ Пигмент 400гр матовый 1.07x30м", price: 42840, unit: "ROLL" },
  { name: "ХОЛСТ Пигмент 400гр матовый 1.27x30м", price: 55080, unit: "ROLL" },
  { name: "ХОЛСТ Пигмент 400гр матовый 1.52x30м", price: 62220, unit: "ROLL" },

  // DTF / UV DTF
  { name: "Рулонная термопленка DTF (глянцевая/матовая) 30см х 100м", price: 14280, unit: "ROLL" },
  { name: "Рулонная термопленка DTF (глянцевая/матовая) 60см х 100м", price: 28560, unit: "ROLL" },
  { name: "Порошок DTF (1 кг)", price: 5100, unit: "PACK" },
  { name: "Пленка UV DTF (A+B) 30см х 100м", price: 39780, unit: "ROLL" },
  { name: "Пленка UV DTF (A+B) 60см х 100м", price: 80580, unit: "ROLL" },

  // Ламинация
  { name: "Пленка для ламинаций 100гр (Матовый/Глянцевый) 0.914х50м", price: 9180, unit: "ROLL" },
  { name: "Пленка для ламинаций 100гр (Матовый/Глянцевый) 1,07х50м", price: 11220, unit: "ROLL" },
  { name: "Пленка для ламинаций 100гр (Матовый/Глянцевый) 1,27х50м", price: 12550, unit: "ROLL" },
  { name: "Пленка для ламинаций 100гр (Матовый) 1,52х50м", price: 15300, unit: "ROLL" },
  { name: "Пленка для ламинаций 100гр (Глянцевый) 1,52х50м", price: 15300, unit: "ROLL" },
  { name: "Пленка для ламинаций 150гр (Матовый/Глянцевый) 1,27х50м", price: 23000, unit: "ROLL" },
  { name: "Пленка для ламинаций 180гр НАПОЛЬНЫЙ 1,27х30м", price: 35500, unit: "ROLL" },
  { name: "Пленка для ламинаций 100гр ДВУХСТОРОНИЙ 1,27х50м", price: 28500, unit: "ROLL" },
  { name: "Ламинат с объемным эффектом 3D (кошачий глаз/квадраты) 1,27х50м", price: 31000, unit: "ROLL" },
  { name: "Пленка для ламинации PANDA JET 180гр ANTI UV (глянцевый/матовая) 1,27х50м", price: 42840, unit: "ROLL" },

  // Магнитные
  { name: "Магнитная пленка PVC 0,5мм для сольвентной печати 0.6x20м", price: 32000, unit: "ROLL" },
  { name: "Магнитная пленка PVC 0,5мм для сольвентной печати 1.22x20м", price: 65000, unit: "ROLL" },
  { name: "Магнитная пленка (0,5мм) с клеевым слоем 0.6x20м", price: 32000, unit: "ROLL" },
  { name: "Магнитная пленка (0,5мм) с клеевым слоем 1.22x20м", price: 66300, unit: "ROLL" },
  { name: "Магнитная пленка (0,26мм) 1.27x30м", price: 32418, unit: "ROLL" },

  // Краска/Чернила
  { name: "Краска UV Marabu UltraJet (CMYK+W) 1л", price: 47940, unit: "LITER" },
  { name: "Краска UV Япония (CMYK+W) 1л", price: 15300, unit: "LITER" },
  { name: "Краска UV (XP600, I3200, G5I) (CMYK+W) 1л", price: 14790, unit: "LITER" },
  { name: "Краска UV GEU-4 (CMYK+W) 1л", price: 22000, unit: "LITER" },
  { name: "Краска UV Soft (i3200/XP600) (CMYK+W) 1л", price: 14790, unit: "LITER" },
  { name: "Краска UV Primer 1л", price: 26265, unit: "LITER" },
  { name: "Лак UV I3200 1л", price: 14790, unit: "LITER" },
  { name: "Лак горячий UV GEU-4 1л", price: 25500, unit: "LITER" },
  { name: "Лак для UV FLORA 1л", price: 35000, unit: "LITER" },
  { name: "UV Япония Лак 1л", price: 33500, unit: "LITER" },
  { name: "Краска СОЛЬВЕНТНАЯ 5л CMYK", price: 14790, unit: "PACK" },
  { name: "Промывка СОЛЬВЕНТНАЯ 5л", price: 12750, unit: "PACK" },
  { name: "краска DTF 1л CMYK+W", price: 8980, unit: "LITER" },
  { name: "Краска UV DTF 1л CMYK+W", price: 14790, unit: "LITER" },
  { name: "Краска Eco сольвент для DX7/DX8 1л CMYK", price: 14790, unit: "LITER" },
  { name: "Краска Eco сольвент Galaxy TEE для DX5 1л CMYK", price: 5100, unit: "LITER" },
  { name: "Краска I3200 / DX5 / XP600 4л CMYK", price: 18360, unit: "PACK" },
  { name: "Краска I3200 / DX5 / XP600 1л CMYK", price: 5100, unit: "LITER" },
  { name: "Краска сублимационная 1л CMYK", price: 17340, unit: "LITER" },
  { name: "Промывка для сублимационной краски 1л", price: 15300, unit: "LITER" },
  { name: "Краски для DX5/DX7/5113 пигмент 1л CMYK", price: 3880, unit: "LITER" },

  // Головки/Салфетки/Прочее
  { name: "Головка NOVAJET 1 шт", price: 8500, unit: "PIECE" },
  { name: "Салфетки тканевые (100шт/упак 9*9) Flora", price: 5305, unit: "PACK" },
  { name: "Салфетки тканевые (150шт/упак 9*9)", price: 5305, unit: "PACK" },
  { name: "Салфетки тканевые 29*30 (50шт/упак)", price: 5305, unit: "PACK" },
  { name: "Палочки чистящие короткие 13см (100шт/упак)", price: 10200, unit: "PACK" },
  { name: "Палочки чистящие длинные 23см (50шт/упак)", price: 10200, unit: "PACK" },

  // Люверсы / Пробойники
  { name: "Пробойник ручной HP-7-2 (10мм/12мм)", price: 7650, unit: "PIECE" },
  { name: "Пробойник с рукояткой HP-4 (синий)", price: 22440, unit: "PIECE" },
  { name: "Пробойник полуавтомат HP-9 (10мм)", price: 66300, unit: "PIECE" },
  { name: "Пробойник полуавтомат HP-9 (12мм)", price: 71400, unit: "PIECE" },
  { name: "Пробойник полуавтомат HP-11 (10мм)", price: 40800, unit: "PIECE" },
  { name: "Пробойник полуавтомат HP-12 (10мм)", price: 45900, unit: "PIECE" },
  { name: "Пробойник полуавтомат HP-15 (10мм)", price: 40800, unit: "PIECE" },
  { name: "Автоматический пробойник со столом (10мм)", price: 336600, unit: "PIECE" },
  { name: "Люверсы 12мм эконом (1000 шт)", price: 3980, unit: "PACK" },
  { name: "Люверсы одинарные 12мм эконом (1000 шт)", price: 3470, unit: "PACK" },
  { name: "Люверсы нержавейка для HP-4/5 (10мм) 1000 шт", price: 2755, unit: "PACK" },
  { name: "Люверсы нержавейка для HP-4/5/7-2 (12мм) 1000 шт", price: 4080, unit: "PACK" },
  { name: "Люверсы для пробойника HP-7-2 (10мм)", price: 2550, unit: "PACK" },
  { name: "Люверсы одинарные нержавейка для HP-9 (12мм)", price: 3060, unit: "PACK" },
  { name: "Люверсы одинарные нержавейка для HP-9 (10мм)", price: 2550, unit: "PACK" },
  { name: "Люверсы одинарные нержавейка (10мм) для HP-11/12/15", price: 1840, unit: "PACK" },

  // Ножи
  { name: "Нож Tajima 9мм", price: 1635, unit: "PIECE" },
  { name: "Нож Tajima 18мм DC 561", price: 2040, unit: "PIECE" },
  { name: "Нож Tajima 18мм LC 501", price: 2040, unit: "PIECE" },
  { name: "Нож ручка", price: 3570, unit: "PIECE" },
  { name: "Нож Tajima для оргстекла", price: 2550, unit: "PIECE" },
  { name: "Нож-скребок ударный для клея длинный", price: 8160, unit: "PIECE" },
  { name: "Нож-скребок ударный для клея короткий", price: 7140, unit: "PIECE" },
  { name: "Держатель ножа SH181", price: 665, unit: "PIECE" },
  { name: "Запасные лезвия Tajima 9мм 30 градусов (10шт)", price: 1275, unit: "PACK" },
  { name: "Запасные лезвия Tajima 18мм (10шт)", price: 1735, unit: "PACK" },
  { name: "Запасные лезвия Tajima 18мм (50шт)", price: 7650, unit: "PACK" },
  { name: "Лезвие для ножа линейки (10шт)", price: 1635, unit: "PACK" },
  { name: "Лезвие для ножа (оргстекло) (10шт)", price: 2655, unit: "PACK" },
  { name: "Линейка с ножом MT02 70см", price: 23460, unit: "PIECE" },
  { name: "Линейка с ножом MT02 100см", price: 22440, unit: "PIECE" },
  { name: "Линейка с ножом MT02 130см", price: 27540, unit: "PIECE" },
  { name: "Линейка с ножом MT02 160см", price: 30500, unit: "PIECE" },
  { name: "Линейка с ножом MT02 200см", price: 37550, unit: "PIECE" },

  // Ракели
  { name: "Ракель Желтый SH103", price: 615, unit: "PIECE" },
  { name: "Ракель войлочный красный-синий SH101", price: 1635, unit: "PIECE" },
  { name: "Ракель синий широкий SH116", price: 1020, unit: "PIECE" },
  { name: "Ракель войлочный", price: 650, unit: "PIECE" },
  { name: "Ракель эконом SH110", price: 160, unit: "PIECE" },
  { name: "Ракель силиконовый SH002", price: 620, unit: "PIECE" },
  { name: "Ракель силиконовый SH003", price: 510, unit: "PIECE" },
  { name: "Сменная войлочная накладка на ракель", price: 155, unit: "PIECE" },

  // Кайма / Кант
  { name: "Кант Серебро 3мм 2,4м (300шт в пачке)", price: 175, unit: "PIECE" },
  { name: "Кант Серебро 5мм 2,4м (300шт в пачке)", price: 305, unit: "PIECE" },
  { name: "Кант Золото/Серебро 8мм 2,4м (300шт в пачке)", price: 360, unit: "PIECE" },
  { name: "Кант Цветной 3мм 2,4м (300шт в пачке)", price: 85, unit: "PIECE" },
  { name: "Кант Цветной 5мм 2,4м (300шт в пачке)", price: 155, unit: "PIECE" },

  // Мобильные конструкции
  { name: "Ролл Ап 0.8х2м", price: 7960, unit: "PIECE" },
  { name: "Ролл Ап 1.2х2м", price: 13770, unit: "PIECE" },
  { name: "Ролл Ап 1.5х2м", price: 18870, unit: "PIECE" },
  { name: "Ролл Ап 2.0х2м", price: 17750, unit: "PIECE" },
  { name: "Ролл Ап (настольный) А4", price: 1840, unit: "PIECE" },
  { name: "Ролл Ап (электрический) 0.8х2м", price: 30600, unit: "PIECE" },
  { name: "Х-баннер Черный эконом 0.6х1.6м", price: 765, unit: "PIECE" },
  { name: "Х-баннер Черный эконом 0.8х1.8м", price: 820, unit: "PIECE" },
  { name: "Х-конструкция модель Корея 0.6х1.6м", price: 2250, unit: "PIECE" },
  { name: "Х-конструкция модель Корея 0.8х1.8м", price: 2550, unit: "PIECE" },
  { name: "Х-конструкция модель Американский 0.8х1.8м", price: 3060, unit: "PIECE" },
  { name: "Промостойка А4 нержавейка", price: 10200, unit: "PIECE" },
  { name: "Промостойка А3 нержавейка", price: 11730, unit: "PIECE" },
  { name: "SEG Light Box Световой короб 1х2м", price: 88740, unit: "PIECE" },
  { name: "SEG Light Box Световой короб 2х2м", price: 153000, unit: "PIECE" },
  { name: "SEG Light Box Световой короб 2х3м", price: 214200, unit: "PIECE" },
  { name: "SEG Light Box Световой короб A1", price: 28560, unit: "PIECE" },
  { name: "SEG Light Box Световой короб A3", price: 11950, unit: "PIECE" },
  { name: "SEG Light Box Световой короб A4", price: 8875, unit: "PIECE" },
  { name: "Промостол прямоугольный", price: 16830, unit: "PIECE" },
  { name: "Промостол закругленный", price: 22440, unit: "PIECE" },
  { name: "Промостол книжка", price: 9180, unit: "PIECE" },
  { name: "POP стол ресепшн 2*2", price: 35700, unit: "PIECE" },
  { name: "POP UP Magnetic Стенд полукруглый 4x3", price: 147900, unit: "PIECE" },
  { name: "Флаг напольный высота 4/5м", price: 12240, unit: "PIECE" },
  { name: "Флаг напольный высота 4/3-5/6м", price: 13260, unit: "PIECE" },
  { name: "Буклетница А3 напольная", price: 25500, unit: "PIECE" },
  { name: "Буклетница FT А4 в чемодане", price: 32640, unit: "PIECE" },

  // Холдеры
  { name: "Настольный холдер (деревянный) А4 вертикальный 297х210мм", price: 2040, unit: "PIECE" },
  { name: "Настольный холдер (деревянный) А4 горизонтальный 297х210мм", price: 2450, unit: "PIECE" },
  { name: "Настольный холдер (деревянный) А5 вертикальный 148.5х210мм", price: 1530, unit: "PIECE" },
  { name: "Настольный холдер (деревянный) А5 горизонтальный 148.5х210мм", price: 1735, unit: "PIECE" },
  { name: "Настольный холдер (деревянный) А6 вертикальный 100х150мм", price: 1275, unit: "PIECE" },
  { name: "Настольный холдер (деревянный) А6 горизонтальный 100х150мм", price: 1275, unit: "PIECE" },
  { name: "Настольный холдер А4 вертикальный 297х210мм", price: 920, unit: "PIECE" },
  { name: "Настольный холдер А4 горизонтальный 297х210мм", price: 1000, unit: "PIECE" },
  { name: "Настольный холдер А5 vertical 148.5х210мм", price: 715, unit: "PIECE" },
  { name: "Настольный холдер А5 horizontal 148.5х210мм", price: 815, unit: "PIECE" },
  { name: "Настольный холдер А6 vertical 148.5х105мм", price: 510, unit: "PIECE" },
  { name: "Настольный холдер А6 horizontal 148.5х105мм", price: 615, unit: "PIECE" },

  // Фрезы
  { name: "Фреза 1-заходная (3,17) стружка вниз (10 шт)", price: 1125, unit: "PACK" },
  { name: "Фреза 1-заходная (3,22) стружка вниз (10 шт)", price: 1325, unit: "PACK" },
  { name: "Фреза 1-заходная (3*12*38) (10 шт)", price: 1530, unit: "PACK" },
  { name: "Фреза 1-заходная (3*17*38) (10 шт)", price: 1330, unit: "PACK" },
  { name: "Фреза 1-заходная (3*22*45) (10 шт)", price: 1330, unit: "PACK" },
  { name: "Фреза 1-заходная (6*22) (10 шт)", price: 3570, unit: "PACK" },
  { name: "Фреза 1-заходная (6*32) (10 шт)", price: 3880, unit: "PACK" },
  { name: "Фреза для чистки стола 6х22 1 шт", price: 1530, unit: "PIECE" },
  { name: "Фреза 2-заходная (3,175*22) (10 шт)", price: 1020, unit: "PACK" },

  // Скотч / клейкие ленты
  { name: "Скотч Белый вспененный двухсторонний SH322-CA 0.5x30м", price: 440, unit: "ROLL" },
  { name: "Скотч Белый вспененный двухсторонний SH322-CA 1.0x30м", price: 850, unit: "ROLL" },
  { name: "Скотч Белый вспененный двухсторонний SH322-CA 2.0x30м", price: 1700, unit: "ROLL" },
  { name: "Скотч Белый вспененный двухсторонний SH322-CA 5.0x30м", price: 4000, unit: "ROLL" },
  { name: "Скотч Черный вспененный двухсторонний SH322-CB 2.0x50м", price: 2800, unit: "ROLL" },
  { name: "Скотч Черный вспененный двухсторонний SH322-CB 3.0x50м", price: 4000, unit: "ROLL" },
  { name: "Скотч Черный вспененный двухсторонний SH322-CB 5.0x50м", price: 6800, unit: "ROLL" },
  { name: "Скотч полиграфический двухсторонний SH328 0.5x50м", price: 200, unit: "ROLL" },
  { name: "Скотч полиграфический двухсторонний SH328 1.0x50м", price: 370, unit: "ROLL" },
  { name: "Скотч полиграфический двухсторонний SH328 1.5x50м", price: 540, unit: "ROLL" },
  { name: "Скотч полиграфический двухсторонний SH328 2.0x50м", price: 780, unit: "ROLL" },
  { name: "Скотч силиконовый двухсторонний прозрачный SH368 0.5x33м", price: 2400, unit: "ROLL" },
  { name: "Скотч силиконовый двухсторонний прозрачный SH368 1.0x33м", price: 4500, unit: "ROLL" },
  { name: "Скотч силиконовый двухсторонний прозрачный SH368 2.0x33м", price: 9000, unit: "ROLL" },
  { name: "Скотч для баннера двухсторонний прозрачный SH335 0.5x50м", price: 770, unit: "ROLL" },
  { name: "Скотч для баннера двухсторонний прозрачный SH335 1.0x50м", price: 1500, unit: "ROLL" },
  { name: "Скотч для баннера двухсторонний прозрачный SH335 1.5x50м", price: 2310, unit: "ROLL" },
  { name: "Скотч для баннера двухсторонний прозрачный SH335 2.0x50м", price: 3045, unit: "ROLL" },
  { name: "Скотч для станков ЧПУ SH336 2.0x50м", price: 900, unit: "ROLL" },
  { name: "Скотч для станков ЧПУ SH337 5.0x50м", price: 3165, unit: "ROLL" },
  { name: "Скотч прозрачный PET SH338 2.0x50м", price: 3200, unit: "ROLL" },
  { name: "Скотч для ковролана двухсторонний SH323 5.0x25м", price: 2705, unit: "ROLL" },
  { name: "Магнитная лента скотч 3М 1.5x30м", price: 7855, unit: "ROLL" },
  { name: "Скотч светоотражающий желто-черный SH501 5.0см x 45.7м", price: 5900, unit: "ROLL" },
  { name: "Скотч светоотражающий красно-белый SH502 5.0см x 45.7м", price: 5900, unit: "ROLL" },
  { name: "Лента светоотражающая красно-белая SH512 5.0см x 45.7м", price: 5900, unit: "ROLL" },
  { name: "Лента светоотражающая черно-желтая SH512 5.0см x 45.7м", price: 5900, unit: "ROLL" },

  // Клеи
  { name: "Клей Super Bond OK201 оригинал (50 шт в коробке) 20мл", price: 155, unit: "PIECE" },
  { name: "Клей SUBA 202 50мл", price: 245, unit: "PIECE" },
  { name: "Клей AKFIX 750 (100мл + 25г)", price: 1225, unit: "PIECE" },
  { name: "Клей AKFIX 750 (200мл + 50г)", price: 1530, unit: "PIECE" },
  { name: "Клей AKFIX 750 (400мл + 100г)", price: 2550, unit: "PIECE" },
  { name: "Клей Жидкие гвозди Akfix GPL200 Акриловый герметик", price: 1020, unit: "PIECE" },
  { name: "Клей Жидкие гвозди Akfix 310 на акриловой основе", price: 1530, unit: "PIECE" },
  { name: "Клей Жидкие гвозди APEL CIVI D4 390гр", price: 2100, unit: "PIECE" },
  { name: "Клей 2-компонентный MITRE APEL 100мл", price: 820, unit: "PIECE" },
  { name: "Клей 2-компонентный MITRE APEL 200мл", price: 1125, unit: "PIECE" },
  { name: "Клей 2-компонентный MITRE APEL 400мл", price: 1900, unit: "PIECE" }
];

async function main() {
  console.log("Starting import of SignTech supplier and pricelist...");

  // Создаем или обновляем поставщика SignTech
  const supplier = await prisma.supplier.upsert({
    where: { name: "SignTech" },
    update: {
      address: "г. Алматы, пр. Суюнбая 2, блок 3",
      phone: "+77079876543",
      whatsapp: "https://wa.me/77079876543",
      notes: "Официальный дилер продукции SignTech в Казахстане. Большой ассортимент листовых материалов, пленок, чернил и профилей."
    },
    create: {
      name: "SignTech",
      address: "г. Алматы, пр. Суюнбая 2, block 3",
      phone: "+77079876543",
      whatsapp: "https://wa.me/77079876543",
      notes: "Официальный дилер продукции SignTech в Казахстане. Большой ассортимент листовых материалов, пленок, чернил и профилей."
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
  for (const item of signTechProducts) {
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

  console.log(`Successfully imported ${successCount} prices under supplier "SignTech"!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
