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
