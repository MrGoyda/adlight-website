import { InventoryUnit, EstimateItemType } from "@prisma/client";

export const INVENTORY_UNITS: Record<InventoryUnit, { label: string; short: string }> = {
  SQUARE_METER: { label: "Квадратный метр", short: "м²" },
  RUNNING_METER: { label: "Погонный метр", short: "пог. м" },
  PIECE: { label: "Штука", short: "шт" },
  ROLL: { label: "Рулон", short: "рул" },
  PACK: { label: "Упаковка", short: "упак" },
  LITER: { label: "Литр", short: "л" },
};

export const MATERIAL_CATEGORIES = [
  { id: "all", label: "Все материалы", icon: "📦" },
  { id: "acrylic", label: "Акрил и Оргстекло", icon: "✨", keywords: ["акрил", "оргстекло", "plexiglas", "плексиглас", "молочный", "прозрачный"] },
  { id: "pvc", label: "ПВХ пластик", icon: "🧱", keywords: ["пвх", "пластик", "pvc", "вспененный"] },
  { id: "acp", label: "Композит АКП", icon: "🏢", keywords: ["композит", "акп", "alucobond", "алюкобонд", "панель"] },
  { id: "led", label: "Светодиоды и модули", icon: "💡", keywords: ["диод", "модуль", "линзованный", "лента", "led", "светодиод", "неон"] },
  { id: "power", label: "Блоки питания", icon: "⚡", keywords: ["блок", "питания", "трансформатор", "12v", "24v", "meanwell", "водостойкий"] },
  { id: "vinyl", label: "Пленки и Винил", icon: "🎨", keywords: ["oracal", "оракал", "пленка", "печать", "винил", "ламинация", "трансфер"] },
  { id: "profiles", label: "Профили и Металл", icon: "📏", keywords: ["профиль", "уголок", "труба", "клик", "алюминий", "металл", "каркас"] },
  { id: "hardware", label: "Клей и Крепеж", icon: "🔩", keywords: ["клей", "саморез", "космофен", "cosmofen", "дихлорэтан", "скотч", "дюбель"] },
];

export const RATE_CATEGORIES: Record<
  EstimateItemType,
  { label: string; icon: string; description: string; badgeColor: string; bgLight: string }
> = {
  LOGISTICS: {
    label: "Газель и Доставка",
    icon: "🚚",
    description: "Тарифы транспортной логистики по городу, пригороду и межгороду",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
    bgLight: "bg-blue-50/50",
  },
  EQUIPMENT: {
    label: "Автовышка и Спецтехника",
    icon: "🏗️",
    description: "Аренда вышки (18м/28м), крана-манипулятора и подъемников",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    bgLight: "bg-amber-50/50",
  },
  ASSEMBLY: {
    label: "ЗП Сборщиков (Цех и Производство)",
    icon: "🛠️",
    description: "Оплата мастерам цеха за изготовление букв, коробов, сварку и поклейку",
    badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-200",
    bgLight: "bg-indigo-50/50",
  },
  INSTALLATION: {
    label: "ЗП Монтажников (Монтажные работы)",
    icon: "🪜",
    description: "Оплата монтажной бригаде за установку вывесок, баннеров и демонтаж",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    bgLight: "bg-emerald-50/50",
  },
  MATERIAL_STOCK: {
    label: "Материалы со склада",
    icon: "📦",
    description: "Складской запас",
    badgeColor: "bg-slate-100 text-slate-800 border-slate-200",
    bgLight: "bg-slate-50/50",
  },
  MATERIAL_SUPPLIER: {
    label: "Материалы поставщиков",
    icon: "🏷️",
    description: "Заказные материалы",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
    bgLight: "bg-purple-50/50",
  },
  CUSTOM: {
    label: "Прочие услуги",
    icon: "⚙️",
    description: "Индивидуальные нестандартные работы",
    badgeColor: "bg-slate-100 text-slate-800 border-slate-200",
    bgLight: "bg-slate-50/50",
  },
};

export const DEFAULT_WORK_OPERATIONS = [
  // ── ГАЗЕЛЬ И ЛОГИСТИКА ──
  {
    type: EstimateItemType.LOGISTICS,
    name: "Газель: доставка по городу (рейс)",
    unit: InventoryUnit.PIECE,
    defaultCost: 7000,
    defaultPrice: 10000,
  },
  {
    type: EstimateItemType.LOGISTICS,
    name: "Газель: доставка в пригород / промзона",
    unit: InventoryUnit.PIECE,
    defaultCost: 12000,
    defaultPrice: 18000,
  },
  {
    type: EstimateItemType.LOGISTICS,
    name: "Межгород (доставка в регионы)",
    unit: InventoryUnit.PIECE,
    defaultCost: 25000,
    defaultPrice: 35000,
  },

  // ── АВТОВЫШКА И СПЕЦТЕХНИКА ──
  {
    type: EstimateItemType.EQUIPMENT,
    name: "Автовышка 18м (почасовая аренда)",
    unit: InventoryUnit.PIECE,
    defaultCost: 10000,
    defaultPrice: 15000,
  },
  {
    type: EstimateItemType.EQUIPMENT,
    name: "Автовышка 28м (высотная техника)",
    unit: InventoryUnit.PIECE,
    defaultCost: 18000,
    defaultPrice: 25000,
  },
  {
    type: EstimateItemType.EQUIPMENT,
    name: "Манипулятор / Кран (смена)",
    unit: InventoryUnit.PIECE,
    defaultCost: 35000,
    defaultPrice: 50000,
  },

  // ── ЗП СБОРЩИКОВ (ЦЕХ) ──
  {
    type: EstimateItemType.ASSEMBLY,
    name: "Сборка световой вывески / букв",
    unit: InventoryUnit.PIECE,
    defaultCost: 15000,
    defaultPrice: 22000,
  },
  {
    type: EstimateItemType.ASSEMBLY,
    name: "Сборка лайтбокса (светового короба)",
    unit: InventoryUnit.SQUARE_METER,
    defaultCost: 12000,
    defaultPrice: 18000,
  },
  {
    type: EstimateItemType.ASSEMBLY,
    name: "Сварка кронштейна / металлокаркаса",
    unit: InventoryUnit.PIECE,
    defaultCost: 10000,
    defaultPrice: 15000,
  },
  {
    type: EstimateItemType.ASSEMBLY,
    name: "Закатка пленки Oracal / винила",
    unit: InventoryUnit.SQUARE_METER,
    defaultCost: 2500,
    defaultPrice: 4500,
  },
  {
    type: EstimateItemType.ASSEMBLY,
    name: "Фрезеровка и раскрой композита / ПВХ",
    unit: InventoryUnit.RUNNING_METER,
    defaultCost: 3000,
    defaultPrice: 5000,
  },
  {
    type: EstimateItemType.ASSEMBLY,
    name: "Пайка и коммутация светодиодов / блоков",
    unit: InventoryUnit.RUNNING_METER,
    defaultCost: 5000,
    defaultPrice: 8000,
  },
  {
    type: EstimateItemType.ASSEMBLY,
    name: "Сборка гибкого неона на подложке",
    unit: InventoryUnit.RUNNING_METER,
    defaultCost: 8000,
    defaultPrice: 13000,
  },

  // ── ЗП МОНТАЖНИКОВ (МОНТАЖ) ──
  {
    type: EstimateItemType.INSTALLATION,
    name: "Монтаж фасадной вывески",
    unit: InventoryUnit.PIECE,
    defaultCost: 25000,
    defaultPrice: 35000,
  },
  {
    type: EstimateItemType.INSTALLATION,
    name: "Монтаж интерьерной вывески / логотипа",
    unit: InventoryUnit.PIECE,
    defaultCost: 15000,
    defaultPrice: 22000,
  },
  {
    type: EstimateItemType.INSTALLATION,
    name: "Высотный монтаж (вышка / альпинисты)",
    unit: InventoryUnit.PIECE,
    defaultCost: 35000,
    defaultPrice: 50000,
  },
  {
    type: EstimateItemType.INSTALLATION,
    name: "Монтаж баннера на металлокаркасе / люверсах",
    unit: InventoryUnit.SQUARE_METER,
    defaultCost: 3500,
    defaultPrice: 6000,
  },
  {
    type: EstimateItemType.INSTALLATION,
    name: "Демонтаж старой конструкции / вывески",
    unit: InventoryUnit.PIECE,
    defaultCost: 15000,
    defaultPrice: 22000,
  },
  {
    type: EstimateItemType.INSTALLATION,
    name: "Демонтаж баннера / очистка фасада от пленки",
    unit: InventoryUnit.SQUARE_METER,
    defaultCost: 2000,
    defaultPrice: 3500,
  },
];
