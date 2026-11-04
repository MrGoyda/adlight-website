// ════════════════════════════════════════════════════════════════════
// ХАРАКТЕРИСТИКИ И ФАСЕТЫ МАТЕРИАЛОВ (Apple Pro Dynamic Facets 2026)
// ════════════════════════════════════════════════════════════════════

export interface FacetOption {
  id: string;
  label: string;
  match?: RegExp;
}

export interface MaterialFacetState {
  // Листовые материалы
  thickness: string;
  color: string;
  sheetSize: string;
  pvcDensity: string;
  compositeSkin: string;

  // Пленки и баннеры
  vinylSurface: string;
  bannerDensity: string;

  // Светотехника и электрика
  voltage: string;
  glowColor: string;
  wattage: string;
  lensCount: string;
  ipRating: string;
  housingType: string;
  deliveryFormat: string;
}

export const INITIAL_FACETS: MaterialFacetState = {
  thickness: "all",
  color: "all",
  sheetSize: "all",
  pvcDensity: "all",
  compositeSkin: "all",
  vinylSurface: "all",
  bannerDensity: "all",
  voltage: "all",
  glowColor: "all",
  wattage: "all",
  lensCount: "all",
  ipRating: "all",
  housingType: "all",
  deliveryFormat: "all",
};

export const MATERIAL_FACETS = {
  // ── 1. ЛИСТОВЫЕ МАТЕРИАЛЫ ──
  // Толщина листовых материалов
  thicknesses: [
    { id: "all", label: "Все" },
    { id: "0.35-0.75", label: "0.35–0.75 мм", match: /(?:0[.,]35|0[.,]5|0[.,]75)\s*(?:мм|mm)/i },
    { id: "1-1.5", label: "1–1.8 мм", match: /(?:^|[\s(])(?:1|1[.,]0|1[.,]2|1[.,]5|1[.,]8)\s*(?:мм|mm)/i },
    { id: "2", label: "2 мм", match: /(?:^|[\s(])2(?:\.0|)?\s*(?:мм|mm)/i },
    { id: "2.5-3", label: "2.5–3 мм", match: /(?:^|[\s(])(?:2[.,]5|3|3[.,]0)\s*(?:мм|mm)/i },
    { id: "4", label: "4 мм", match: /(?:^|[\s(])4(?:\.0|)?\s*(?:мм|mm)/i },
    { id: "5", label: "5 мм", match: /(?:^|[\s(])5(?:\.0|)?\s*(?:мм|mm)/i },
    { id: "6-8", label: "6–8 мм", match: /(?:^|[\s(])[68](?:\.0|)?\s*(?:мм|mm)/i },
    { id: "10+", label: "10–15 мм+", match: /(?:^|[\s(])(?:10|12|15|20)\s*(?:мм|mm)/i },
  ] as FacetOption[],

  // Цвета и оптика материалов
  colors: [
    { id: "all", label: "Все цвета" },
    { id: "transparent", label: "Прозрачный", match: /прозрачн/i },
    { id: "white", label: "Белый / Опал", match: /бел|молочн|опал/i },
    { id: "black", label: "Черный", match: /черн/i },
    { id: "mirror", label: "Зеркальный (Mirror)", match: /зеркал|золото|серебро/i },
    { id: "colored", label: "Цветной (Ral)", match: /красн|синий|желт|зелен|салатов|оранжев|серый/i },
  ] as FacetOption[],

  // Размеры листа
  sheetSizes: [
    { id: "all", label: "Все форматы" },
    { id: "1.22x2.44", label: "1.22 × 2.44 м", match: /1[.,]2[25]\s*[*хx]\s*2[.,]4[45]/i },
    { id: "2.05x3.05", label: "2.05 × 3.05 м", match: /2[.,]0[58]\s*[*хx]\s*3[.,]0[85]/i },
  ] as FacetOption[],

  // Плотность ПВХ
  pvcDensities: [
    { id: "all", label: "Любая плотность" },
    { id: "0.45", label: "Стандартная (0.45)", match: /(?:0[.,]45|стандарт)/i },
    { id: "0.60", label: "Повышенная (0.60)", match: /(?:0[.,]60|повышен)/i },
  ] as FacetOption[],

  // Стенка АКП (Алюмокомпозит)
  compositeSkins: [
    { id: "all", label: "Любая стенка" },
    { id: "12mkr", label: "12 мкр", match: /12\s*мкр/i },
    { id: "18mkr", label: "18 мкр", match: /18\s*мкр/i },
    { id: "21mkr", label: "21 мкр", match: /21\s*мкр/i },
  ] as FacetOption[],

  // ── 2. ПЛЕНКИ И БАННЕРЫ ──
  vinylSurfaces: [
    { id: "all", label: "Все" },
    { id: "gloss", label: "Глянцевый", match: /глян/i },
    { id: "matte", label: "Матовый", match: /мат/i },
    { id: "translucent", label: "Транслюцент (8500)", match: /транслюц|8500|светорассе/i },
  ] as FacetOption[],

  bannerDensities: [
    { id: "all", label: "Все" },
    { id: "340", label: "340 г/м²", match: /340\s*(?:гр|г)/i },
    { id: "440", label: "440-510 г/м²", match: /(?:440|510)\s*(?:гр|г)/i },
    { id: "550", label: "550 г/м² Литой", match: /550\s*(?:гр|г)|литой/i },
  ] as FacetOption[],

  // ── 3. СВЕТОТЕХНИКА И ЭЛЕКТРИКА ──
  // Напряжение (Вольтаж)
  voltages: [
    { id: "all", label: "Все" },
    { id: "12v", label: "12V", match: /(?:^|[\s\-_])12\s*(?:v|в)\b/i },
    { id: "24v", label: "24V", match: /(?:^|[\s\-_])24\s*(?:v|в)\b/i },
    { id: "220v", label: "220V", match: /(?:^|[\s\-_])220\s*(?:v|в)\b/i },
  ] as FacetOption[],

  // Свечение светодиодов и цветовая температура
  glowColors: [
    { id: "all", label: "Все свечения" },
    {
      id: "cold",
      label: "Холодный (6500K–12000K)",
      match: /(?:холодн|6[05]00\s*k|1[0123]000\s*k)/i,
    },
    {
      id: "neutral",
      label: "Нейтральный (4000K–5000K)",
      match: /(?:нейтрал|4[05]00\s*k|5000\s*k)/i,
    },
    {
      id: "warm",
      label: "Теплый (3000K–3200K)",
      match: /(?:тепл|3[012]00\s*k)/i,
    },
    {
      id: "white",
      label: "Белый (дневной)",
      match: /(?:бел(?:ый|ая|ое)|дневн)/i,
    },
    {
      id: "colored_rgb",
      label: "RGB / Цветной",
      match: /(?:rgb|красн|син(?:ий|яя)|зелен|желт|розов|фиолет)/i,
    },
  ] as FacetOption[],

  // Мощность / Ваттность (Диоды и Блоки питания)
  wattages: [
    { id: "all", label: "Все мощности" },
    // Для диодов/лент
    { id: "0.5w", label: "0.5 – 0.72 W", match: /(?:0[.,]5|0[.,]72)\s*(?:w|вт)/i },
    { id: "1.2w", label: "1.2 – 1.5 W", match: /(?:1[.,]2|1[.,]5)\s*(?:w|вт)/i },
    { id: "6-12w", label: "6 – 12 W", match: /(?:^|[\s\-_])(?:6|7[.,]2|8|10|12)\s*(?:w|вт)/i },
    // Для трансформаторов
    { id: "60-100w", label: "60 – 100 W", match: /(?:^|[\s\-_])(?:60|72|100)\s*(?:w|вт)/i },
    { id: "150-200w", label: "150 – 200 W", match: /(?:^|[\s\-_])(?:150|200)\s*(?:w|вт)/i },
    { id: "300-400w", label: "300 – 400 W", match: /(?:^|[\s\-_])(?:300|400)\s*(?:w|вт)/i },
  ] as FacetOption[],

  // Количество линз/точек (Светодиодные модули)
  lensCounts: [
    { id: "all", label: "Все модули" },
    { id: "1-point", label: "1-точечный", match: /1[- ]?(?:точеч|диод|led)/i },
    { id: "2-point", label: "2-точечный", match: /2[- ]?(?:точеч|диод|led|х точеч)/i },
    { id: "3-point", label: "3-точечный", match: /3[- ]?(?:точеч|диод|led|х точеч)/i },
    { id: "4-point", label: "4-точечный", match: /4[- ]?(?:точеч|диод|led|х точеч)/i },
  ] as FacetOption[],

  // Степень влагозащиты (IP)
  ipRatings: [
    { id: "all", label: "Любая защита" },
    { id: "ip67-68", label: "Герметичный (IP67 / IP68)", match: /ip\s*6[78]/i },
    { id: "ip65", label: "Влагозащитный (IP65)", match: /ip\s*65/i },
    { id: "ip20", label: "Интерьерный (IP20/IP32)", match: /(?:ip\s*20|ip\s*32|внутренн|открыт)/i },
  ] as FacetOption[],

  // Исполнение корпуса (Трансформаторы)
  housingTypes: [
    { id: "all", label: "Все типы" },
    { id: "outdoor", label: "Уличный закрытый", match: /(?:уличн|наружн|закрыт)/i },
    { id: "indoor", label: "Интерьерный (Lightbox)", match: /(?:внутренн|lightbox|открыт)/i },
    { id: "semi", label: "Полузакрытый", match: /полузакрыт/i },
  ] as FacetOption[],

  // Формат поставки (Неон и Ленты)
  deliveryFormats: [
    { id: "all", label: "Все форматы" },
    { id: "50m", label: "Бухта 50 м", match: /50\s*м\b/i },
    { id: "100m", label: "Бухта 100 м", match: /100\s*м\b/i },
    { id: "meterage", label: "Нарезка метражом", match: /метраж/i },
  ] as FacetOption[],
};
