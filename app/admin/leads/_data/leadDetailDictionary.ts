import { ClientRating } from "@prisma/client";

export interface RatingOption {
  value: ClientRating;
  label: string;
  shortLabel: string;
  icon: string;
  badgeClass: string;
  borderClass: string;
}

export const CLIENT_RATINGS: Record<ClientRating, RatingOption> = {
  EASY: {
    value: "EASY",
    label: "VIP / Лояльный клиент",
    shortLabel: "VIP",
    icon: "👑",
    badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
    borderClass: "border-emerald-500",
  },
  STANDARD: {
    value: "STANDARD",
    label: "Стандартный клиент",
    shortLabel: "Стандарт",
    icon: "🟢",
    badgeClass: "bg-blue-50 text-blue-800 border-blue-200",
    borderClass: "border-blue-500",
  },
  PROBLEM: {
    value: "PROBLEM",
    label: "Сложный / Торгуется",
    shortLabel: "Сложный",
    icon: "🟡",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
    borderClass: "border-amber-500",
  },
};

export const SIGN_TYPES = [
  { id: "LETTERS_FRONT", label: "Объемные буквы (лицевое свечение)", category: "Буквы" },
  { id: "LETTERS_BACK", label: "Объемные буквы (контражур)", category: "Буквы" },
  { id: "LETTERS_SIDE", label: "Объемные буквы (боковое/комбинированное)", category: "Буквы" },
  { id: "LIGHTBOX_ACRYLIC", label: "Световой короб (Акрил)", category: "Лайтбоксы" },
  { id: "LIGHTBOX_COMPOSITE", label: "Композитный короб с инкрустацией", category: "Лайтбоксы" },
  { id: "NEON_FLEX", label: "Гибкий неон 12V / Неоновая вывеска", category: "Неон" },
  { id: "ROOF_TOP", label: "Крышная установка / Металлоконструкция", category: "Крупные" },
  { id: "BANNER_FRAME", label: "Баннер на металлораме", category: "Баннеры" },
  { id: "WINDOW_FILM", label: "Оклейка витрин / Пленка One Way Vision", category: "Пленка" },
  { id: "TABLETS", label: "Интерьерная вывеска / Табличка", category: "Интерьер" },
];

export const MOUNTING_HEIGHTS = [
  { id: "UP_TO_3M", label: "До 3 м (со стремянки / туры)" },
  { id: "FROM_3_TO_6M", label: "3 – 6 м (требуется вышка/тура)" },
  { id: "ABOVE_6M", label: "Выше 6 м (автовышка обязательно)" },
  { id: "INTERIOR", label: "Интерьерный монтаж (в помещении)" },
];

export const FACADE_WALL_TYPES = [
  { id: "COMPOSITE", label: "Алюкобонд / Композит" },
  { id: "BRICK", label: "Кирпич / Бетон" },
  { id: "SANDWICH", label: "Сэндвич-панель" },
  { id: "GRANITE", label: "Керамогранит / Плитка" },
  { id: "GLASS", label: "Стеклопакет / Витрина" },
  { id: "WOOD_DRYWALL", label: "Гипсокартон / Дерево" },
];

export const POWER_SUPPLY_OPTIONS = [
  { id: "OUTSIDE_WIRE", label: "Кабель 220V выведен наружу" },
  { id: "INSIDE_ROOM", label: "Питание внутри, нужно сверлить" },
  { id: "NEED_ELECTRICIAN", label: "Нет питания, требуется прокладка" },
  { id: "BATTERY_SOLAR", label: "Автономное / Аккумулятор" },
];

export const APPROVAL_STATUSES = [
  { id: "NOT_NEEDED", label: "Не требуется (интерьер / частная территория)" },
  { id: "DESIGN_PASSPORT_NEEDED", label: "Требуется паспорт фасада" },
  { id: "IN_AKIMAT", label: "На согласовании в Акимате / Архитектуре" },
  { id: "IN_MALL", label: "На согласовании у администрации ТРЦ" },
  { id: "APPROVED", label: "Согласовано (документ получен)" },
];

export const CANCELLATION_REASONS = [
  { id: "TOO_EXPENSIVE", label: "Дорого / Не сошлись по цене" },
  { id: "CHOSE_COMPETITOR", label: "Выбрали конкурента" },
  { id: "POSTPONED", label: "Перенесли открытие / отложили" },
  { id: "TERMS_NOT_MET", label: "Не устроили сроки изготовления" },
  { id: "NO_RESPONSE", label: "Клиент перестал выходить на связь" },
  { id: "SPAM", label: "Нецелевой запрос / Спам" },
];

export const DEFAULT_CHECKLIST_ITEMS = [
  { id: "MEASUREMENT", label: "Замер объекта произведен", order: 1 },
  { id: "DESIGN_APPROVED", label: "Дизайн и привязка согласованы с клиентом", order: 2 },
  { id: "PREPAYMENT", label: "Предоплата (50%) получена", order: 3 },
  { id: "MATERIALS_DEDUCTED", label: "Материалы списаны / закуплены", order: 4 },
  { id: "PRODUCTION_READY", label: "Вывеска изготовлена в цеху", order: 5 },
  { id: "MOUNTING_DONE", label: "Монтаж завершен и принят заказчиком", order: 6 },
  { id: "FINAL_PAYMENT", label: "Полный расчет (100%) закрыт", order: 7 },
];

export type DetailTabType = "params" | "tech" | "files" | "timeline";

export const DETAIL_TABS: { id: DetailTabType; label: string; icon: string }[] = [
  { id: "params", label: "Параметры", icon: "📌" },
  { id: "tech", label: "Тех-спецификация", icon: "📐" },
  { id: "files", label: "Файлы и Фото", icon: "📁" },
  { id: "timeline", label: "Таймлайн и Чеклист", icon: "⏱" },
];
