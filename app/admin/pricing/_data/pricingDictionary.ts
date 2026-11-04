import { InventoryUnit, EstimateItemType } from "@prisma/client";

export const INVENTORY_UNITS: Record<InventoryUnit, { label: string; short: string }> = {
  SQUARE_METER: { label: "Квадратный метр", short: "м²" },
  RUNNING_METER: { label: "Погонный метр", short: "пог. м" },
  PIECE: { label: "Штука", short: "шт" },
  ROLL: { label: "Рулон", short: "рул" },
  PACK: { label: "Упаковка", short: "упак" },
  LITER: { label: "Литр", short: "л" },
};

export interface MaterialCategoryItem {
  id: string;
  label: string;
  iconType: "layers" | "square-stack" | "zap" | "scroll" | "columns-3" | "wrench" | "handshake";
  subcategories: string[];
}

export const MATERIAL_TAXONOMY: MaterialCategoryItem[] = [
  {
    id: "sheets",
    label: "Листовые материалы",
    iconType: "square-stack",
    subcategories: [
      "Листовой акрил и Оргстекло",
      "Вспененный листовой ПВХ",
      "Алюмокомпозит (АКП)",
      "Пластиковые листы ПЭТ / PVC",
      "Двухслойный пластик (Ромарк)",
      "Композитные листы для печати",
      "Полистирол и Поликарбонат",
    ],
  },
  {
    id: "lighting",
    label: "Светотехника и Электрика",
    iconType: "zap",
    subcategories: [
      "Светодиодные модули (линзованные)",
      "Светодиодные ленты",
      "Гибкий неон 12V / 24V",
      "Блоки питания (трансформаторы)",
      "Кабели, провода и клеммы",
      "Контроллеры и диммеры",
    ],
  },
  {
    id: "vinyl",
    label: "Пленки и Баннеры",
    iconType: "scroll",
    subcategories: [
      "Плоттерные пленки (Oracal 641)",
      "Светорассеивающие пленки (Oracal 8500)",
      "Монтажные пленки",
      "Баннерная ткань (Frontlit, Backlit)",
      "Пленки для печати и ламинация",
      "Световозвращающие и перфорированные пленки",
    ],
  },
  {
    id: "profiles",
    label: "Профили и Металл",
    iconType: "columns-3",
    subcategories: [
      "Алюминиевые профили для световых коробов и рамок",
      "Бортогибочные ленты и профили (для букв)",
      "Профильная труба (сталь и алюминий)",
      "Уголки, швеллеры и полосы",
      "Готовые световые короба и ультратонкие рамки",
    ],
  },
  {
    id: "hardware",
    label: "Клеи, Скотчи и Крепеж",
    iconType: "wrench",
    subcategories: [
      "Клеи и герметики (монтажные, 2-х компонентные)",
      "Двусторонние вспененные скотчи",
      "Усиленные и силиконовые клейкие ленты",
      "Специальные и малярные ленты",
      "Люверсы, пробойники и фурнитура",
      "Дистанционные держатели и метизы",
    ],
  },
  {
    id: "services",
    label: "Перезаказ услуг (Подрядчики)",
    iconType: "handshake",
    subcategories: [
      "Фрезерная резка (ЧПУ)",
      "Лазерная резка (акрил/фанера)",
      "УФ-печать (планшетная)",
      "Широкоформатная и интерьерная печать",
      "Плоттерная резка и выборка",
      "Порошковая покраска металла",
      "Гибка акрила и композита",
    ],
  },
];

// Для быстрого плоского списка категорий в фильтрах
export const MATERIAL_CATEGORIES = [
  { id: "all", label: "Все категории", iconType: "layers" as const },
  ...MATERIAL_TAXONOMY.map((c) => ({
    id: c.id,
    label: c.label,
    iconType: c.iconType,
  })),
];

// ════════════════════════════════════════════════════════════════════
// ХАРАКТЕРИСТИКИ И ФАСЕТЫ МАТЕРИАЛОВ (Реэкспорт)
// ════════════════════════════════════════════════════════════════════
export * from "./materialFacets";

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
    name: "Автовышка 18м (смена до 2 часов)",
    unit: InventoryUnit.PIECE,
    defaultCost: 20000,
    defaultPrice: 26000,
  },
  {
    type: EstimateItemType.EQUIPMENT,
    name: "Автовышка 18м (дополнительный час)",
    unit: InventoryUnit.PIECE,
    defaultCost: 10000,
    defaultPrice: 13000,
  },
  {
    type: EstimateItemType.EQUIPMENT,
    name: "Автовышка 28м (смена до 2 часов)",
    unit: InventoryUnit.PIECE,
    defaultCost: 35000,
    defaultPrice: 45000,
  },
  {
    type: EstimateItemType.EQUIPMENT,
    name: "Кран-манипулятор (рейс / монтаж)",
    unit: InventoryUnit.PIECE,
    defaultCost: 30000,
    defaultPrice: 40000,
  },
  // ── ЗП СБОРЩИКОВ (ЦЕХ) ──
  {
    type: EstimateItemType.ASSEMBLY,
    name: "Изготовление световой буквы (высота до 30см)",
    unit: InventoryUnit.PIECE,
    defaultCost: 2500,
    defaultPrice: 4000,
  },
  {
    type: EstimateItemType.ASSEMBLY,
    name: "Изготовление световой буквы (высота 31-50см)",
    unit: InventoryUnit.PIECE,
    defaultCost: 4000,
    defaultPrice: 6500,
  },
  {
    type: EstimateItemType.ASSEMBLY,
    name: "Изготовление световой буквы (высота 51-80см)",
    unit: InventoryUnit.PIECE,
    defaultCost: 6500,
    defaultPrice: 10000,
  },
  {
    type: EstimateItemType.ASSEMBLY,
    name: "Сборка лайтбокса стандартного (до 2 м²)",
    unit: InventoryUnit.SQUARE_METER,
    defaultCost: 6000,
    defaultPrice: 10000,
  },
  {
    type: EstimateItemType.ASSEMBLY,
    name: "Сварка металлокаркаса (проф. труба 20х20, 40х20)",
    unit: InventoryUnit.RUNNING_METER,
    defaultCost: 1500,
    defaultPrice: 2500,
  },
  {
    type: EstimateItemType.ASSEMBLY,
    name: "Закатка пленки Oracal на пластик / композит",
    unit: InventoryUnit.SQUARE_METER,
    defaultCost: 1000,
    defaultPrice: 2000,
  },
  // ── ЗП МОНТАЖНИКОВ ──
  {
    type: EstimateItemType.INSTALLATION,
    name: "Монтаж объемных букв на раме (высота до 3м)",
    unit: InventoryUnit.PIECE,
    defaultCost: 15000,
    defaultPrice: 25000,
  },
  {
    type: EstimateItemType.INSTALLATION,
    name: "Монтаж вывески с лестницы / туры (высота до 5м)",
    unit: InventoryUnit.PIECE,
    defaultCost: 25000,
    defaultPrice: 40000,
  },
  {
    type: EstimateItemType.INSTALLATION,
    name: "Монтаж с автовышки (высотные работы от 6м)",
    unit: InventoryUnit.PIECE,
    defaultCost: 35000,
    defaultPrice: 55000,
  },
  {
    type: EstimateItemType.INSTALLATION,
    name: "Монтаж баннера на раму со шнуровкой",
    unit: InventoryUnit.SQUARE_METER,
    defaultCost: 1200,
    defaultPrice: 2200,
  },
  {
    type: EstimateItemType.INSTALLATION,
    name: "Демонтаж старой вывески / баннера",
    unit: InventoryUnit.PIECE,
    defaultCost: 10000,
    defaultPrice: 18000,
  },
  {
    type: EstimateItemType.INSTALLATION,
    name: "Подключение к электросети и пуско-наладка",
    unit: InventoryUnit.PIECE,
    defaultCost: 5000,
    defaultPrice: 10000,
  },
];
