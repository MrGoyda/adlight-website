// ════════════════════════════════════════════════════════════════════
// ХАРАКТЕРИСТИКИ И ФАСЕТЫ МАТЕРИАЛОВ (Apple Pro Dynamic Facets 2026)
// Матрица жесткой изоляции характеристик без ложных пересечений
// ════════════════════════════════════════════════════════════════════

export interface FacetOption {
  id: string;
  label: string;
  match?: RegExp;
}

export interface MaterialFacetState {
  // ── 1. Листовые материалы ──
  thickness: string;
  color: string;
  sheetSize: string;
  pvcDensity: string;
  compositeSkin: string;
  compositeFinish: string;
  plasticType: string;
  polycarbonateType: string;
  engravingColor: string;

  // ── 2. Светотехника и электрика ──
  lensCount: string;
  diodeWattage: string;
  glowColor: string;
  ipRating: string;
  transformerWattage: string;
  housingType: string;
  neonProfile: string;
  neonDeliveryFormat: string;
  stripWattage: string;
  controllerType: string;
  wireGauge: string;
  voltage: string;

  // ── 3. Пленки и баннеры ──
  vinylSurface: string;
  bannerDensity: string;
  bannerType: string;
  rollWidth: string;
  tapeMountType: string;
  adhesiveType: string;

  // ── 4. Профили и металл ──
  boxDepth: string;
  tubeSize: string;
  letterBorder: string;
  profileMetal: string;

  // ── 5. Клеи, скотчи и крепеж ──
  glueType: string;
  glueVolume: string;
  doubleTapeBase: string;
  tapeWidth: string;
  tapeLength: string;
  reinforcedTapeType: string;
  specialTapeType: string;
  grommetDiameter: string;
  grommetMaterial: string;
  standoffDistance: string;
  standoffDiameter: string;

  // ── 6. Перезаказ услуг ──
  serviceCutMaterial: string;
  servicePrintType: string;
}

export const INITIAL_FACETS: MaterialFacetState = {
  // Листовые
  thickness: "all",
  color: "all",
  sheetSize: "all",
  pvcDensity: "all",
  compositeSkin: "all",
  compositeFinish: "all",
  plasticType: "all",
  polycarbonateType: "all",
  engravingColor: "all",

  // Светотехника
  lensCount: "all",
  diodeWattage: "all",
  glowColor: "all",
  ipRating: "all",
  transformerWattage: "all",
  housingType: "all",
  neonProfile: "all",
  neonDeliveryFormat: "all",
  stripWattage: "all",
  controllerType: "all",
  wireGauge: "all",
  voltage: "all",

  // Пленки и баннеры
  vinylSurface: "all",
  bannerDensity: "all",
  bannerType: "all",
  rollWidth: "all",
  tapeMountType: "all",
  adhesiveType: "all",

  // Профили
  boxDepth: "all",
  tubeSize: "all",
  letterBorder: "all",
  profileMetal: "all",

  // Клеи, скотчи и крепеж
  glueType: "all",
  glueVolume: "all",
  doubleTapeBase: "all",
  tapeWidth: "all",
  tapeLength: "all",
  reinforcedTapeType: "all",
  specialTapeType: "all",
  grommetDiameter: "all",
  grommetMaterial: "all",
  standoffDistance: "all",
  standoffDiameter: "all",

  // Услуги
  serviceCutMaterial: "all",
  servicePrintType: "all",
};

export const MATERIAL_FACETS = {
  // ─────────────────────────────────────────────────────────────
  // 1. ЛИСТОВЫЕ МАТЕРИАЛЫ
  // ─────────────────────────────────────────────────────────────

  // Толщина листа
  thicknesses: [
    { id: "all", label: "Все толщины" },
    { id: "0.35-0.75", label: "0.35–0.75 мм", match: /(?:0[.,]35|0[.,]5|0[.,]75)\s*(?:мм|mm)/i },
    { id: "1-1.5", label: "1–1.8 мм", match: /(?:^|[\s(])(?:1|1[.,]0|1[.,]2|1[.,]3|1[.,]5|1[.,]8)\s*(?:мм|mm)/i },
    { id: "2", label: "2 мм", match: /(?:^|[\s(])2(?:\.0|)?\s*(?:мм|mm)/i },
    { id: "2.5-3", label: "2.5–3 мм", match: /(?:^|[\s(])(?:2[.,]5|2[.,]8|3|3[.,]0)\s*(?:мм|mm)/i },
    { id: "4", label: "4 мм", match: /(?:^|[\s(])4(?:\.0|)?\s*(?:мм|mm)/i },
    { id: "5", label: "5 мм", match: /(?:^|[\s(])5(?:\.0|)?\s*(?:мм|mm)/i },
    { id: "6-8", label: "6–8 мм", match: /(?:^|[\s(])[68](?:\.0|)?\s*(?:мм|mm)/i },
    { id: "10+", label: "10–20 мм+", match: /(?:^|[\s(])(?:10|12|15|20)\s*(?:мм|mm)/i },
  ] as FacetOption[],

  // Цвет и оптика (Акрил, ПВХ, Пластики)
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
    { id: "1.22x2.05", label: "1.22 × 2.05 м", match: /1[.,]2[25]\s*[*хx]\s*2[.,]0[5]/i },
    { id: "0.6x1.2", label: "0.6 × 1.2 м", match: /0[.,]6\s*[*хx]\s*1[.,]2/i },
  ] as FacetOption[],

  // Плотность вспененного ПВХ
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
    { id: "30mkr", label: "30 мкр", match: /30\s*мкр/i },
  ] as FacetOption[],

  // Фактура и финиш АКП
  compositeFinishes: [
    { id: "all", label: "Все фактуры" },
    { id: "mirror", label: "Зеркало (золото/серебро)", match: /зеркал|золот|серебр/i },
    { id: "brush", label: "Царапанный (Brush)", match: /brush|царап/i },
    { id: "gloss", label: "Глянцевый", match: /глян/i },
    { id: "matte", label: "Матовый", match: /мат/i },
    { id: "ral", label: "Цвета RAL", match: /красн|син|желт|зелен|оранж|серый/i },
  ] as FacetOption[],

  // Тип пластика ПЭТ / PVC
  plasticTypes: [
    { id: "all", label: "Все типы" },
    { id: "pet", label: "ПЭТ прозрачный", match: /пэт|pet/i },
    { id: "rigid_pvc", label: "Жесткий ПВХ", match: /жестк/i },
  ] as FacetOption[],

  // Тип поликарбоната и полистирола
  polycarbonateTypes: [
    { id: "all", label: "Все виды" },
    { id: "monolith", label: "Монолитный поликарбонат", match: /монолит/i },
    { id: "cellular", label: "Сотовый поликарбонат", match: /сотов/i },
    { id: "hips", label: "Полистирол (HIPS)", match: /полистирол|hips/i },
  ] as FacetOption[],

  // Цвета гравировки Ромарк
  engravingColors: [
    { id: "all", label: "Все сочетания" },
    { id: "gold_black", label: "Золото / Черный", match: /золот/i },
    { id: "silver_black", label: "Серебро / Черный", match: /серебр/i },
    { id: "white_black", label: "Белый / Черный", match: /бел/i },
  ] as FacetOption[],

  // ─────────────────────────────────────────────────────────────
  // 2. СВЕТОТЕХНИКА И ЭЛЕКТРИКА
  // ─────────────────────────────────────────────────────────────

  // Количество линз (Светодиодные модули)
  lensCounts: [
    { id: "all", label: "Все модули" },
    { id: "1-point", label: "1-точечный", match: /1[- ]?(?:точеч|диод|led)/i },
    { id: "2-point", label: "2-точечный", match: /2[- ]?(?:точеч|диод|led|х точеч)/i },
    { id: "3-point", label: "3-точечный", match: /3[- ]?(?:точеч|диод|led|х точеч)/i },
    { id: "4-point", label: "4-точечный", match: /4[- ]?(?:точеч|диод|led|х точеч)/i },
    { id: "edge", label: "Торцевой (Edge)", match: /торцев|edge|боков/i },
  ] as FacetOption[],

  // Мощность модулей
  diodeWattages: [
    { id: "all", label: "Все мощности" },
    { id: "0.5w", label: "0.5 – 0.72 W", match: /(?:0[.,]5|0[.,]72)\s*(?:w|вт)/i },
    { id: "1.2w", label: "1.2 – 1.5 W", match: /(?:1[.,]2|1[.,]5)\s*(?:w|вт)/i },
    { id: "2.4w", label: "2.4 W+", match: /(?:2[.,]4|3|3[.,]6)\s*(?:w|вт)/i },
  ] as FacetOption[],

  // Свечение и цветовая t°
  glowColors: [
    { id: "all", label: "Все свечения" },
    {
      id: "cold",
      label: "Холодный (6500K–10000K)",
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

  // Степень влагозащиты (IP)
  ipRatings: [
    { id: "all", label: "Любая защита" },
    { id: "ip67-68", label: "Герметичный (IP67 / IP68)", match: /ip\s*6[78]/i },
    { id: "ip65", label: "Влагозащитный (IP65)", match: /ip\s*65/i },
    { id: "ip20", label: "Интерьерный (IP20/IP33)", match: /(?:ip\s*20|ip\s*3[23]|внутренн|открыт)/i },
  ] as FacetOption[],

  // Мощность трансформаторов / блоков
  transformerWattages: [
    { id: "all", label: "Все мощности" },
    { id: "60-100w", label: "60 – 100 W", match: /(?:^|[\s\-_])(?:60|72|100)\s*(?:w|вт)/i },
    { id: "150-200w", label: "150 – 200 W", match: /(?:^|[\s\-_])(?:150|200)\s*(?:w|вт)/i },
    { id: "300-400w", label: "300 – 400 W", match: /(?:^|[\s\-_])(?:300|400)\s*(?:w|вт)/i },
  ] as FacetOption[],

  // Исполнение корпуса трансформаторов
  housingTypes: [
    { id: "all", label: "Все типы" },
    { id: "outdoor", label: "Уличный закрытый (IP67)", match: /(?:уличн|наружн|закрыт|tauras|ip\s*67)/i },
    { id: "indoor", label: "Интерьерный Lightbox (IP20)", match: /(?:внутренн|lightbox|whoosh|ультратон)/i },
    { id: "semi", label: "Полузакрытый (с кулером)", match: /полузакрыт|кулер/i },
  ] as FacetOption[],

  // Сечение неона
  neonProfiles: [
    { id: "all", label: "Все размеры" },
    { id: "06x12", label: "06 × 12 мм", match: /0?6\s*[*хx]\s*12/i },
    { id: "08x16", label: "08 × 16 мм", match: /0?8\s*[*хx]\s*16/i },
  ] as FacetOption[],

  // Формат поставки неона
  neonDeliveryFormats: [
    { id: "all", label: "Все форматы" },
    { id: "50m", label: "Бухта 50 м", match: /50\s*м\b/i },
    { id: "100m", label: "Бухта 100 м", match: /100\s*м\b/i },
    { id: "meterage", label: "Нарезка метражом", match: /метраж/i },
  ] as FacetOption[],

  // Мощность лент
  stripWattages: [
    { id: "all", label: "Все мощности" },
    { id: "4.8-9.6w", label: "4.8 – 9.6 W/м", match: /(?:4[.,]8|7[.,]2|9[.,]6)\s*(?:w|вт)/i },
    { id: "14.4-24w", label: "14.4 – 24 W/м", match: /(?:14[.,]4|18|24)\s*(?:w|вт)/i },
  ] as FacetOption[],

  // Тип контроллера
  controllerTypes: [
    { id: "all", label: "Все типы" },
    { id: "dimmer", label: "Диммер монохромный", match: /диммер/i },
    { id: "rgb", label: "Контроллер RGB / RGBW", match: /rgb/i },
    { id: "rf", label: "Радиопульт (RF)", match: /пульт|rf|радио/i },
    { id: "touch", label: "Сенсорный", match: /сенсор/i },
  ] as FacetOption[],

  // Сечение провода
  wireGauges: [
    { id: "all", label: "Все сечения" },
    { id: "0.5-0.75", label: "0.5 – 0.75 мм²", match: /0[.,][57]5?\s*(?:мм|mm)/i },
    { id: "1.0-1.5", label: "1.0 – 1.5 мм²", match: /1[.,][05]\s*(?:мм|mm)/i },
    { id: "2.5+", label: "2.5 мм²+", match: /2[.,]5\s*(?:мм|mm)/i },
  ] as FacetOption[],

  // Напряжение питания
  voltages: [
    { id: "all", label: "Все вольтажи" },
    { id: "12v", label: "12V", match: /(?:^|[\s\-_])12\s*(?:v|в)\b/i },
    { id: "24v", label: "24V", match: /(?:^|[\s\-_])24\s*(?:v|в)\b/i },
    { id: "220v", label: "220V", match: /(?:^|[\s\-_])220\s*(?:v|в)\b/i },
  ] as FacetOption[],

  // ─────────────────────────────────────────────────────────────
  // 3. ПЛЕНКИ И БАННЕРЫ
  // ─────────────────────────────────────────────────────────────

  // Тип поверхности пленки
  vinylSurfaces: [
    { id: "all", label: "Все типы" },
    { id: "gloss", label: "Глянцевый", match: /глян/i },
    { id: "matte", label: "Матовый", match: /мат/i },
    { id: "translucent", label: "Транслюцент (8500)", match: /транслюц|8500|светорассе/i },
  ] as FacetOption[],

  // Плотность баннера
  bannerDensities: [
    { id: "all", label: "Все плотности" },
    { id: "340", label: "340 г/м² (эконом)", match: /340\s*(?:гр|г)/i },
    { id: "440", label: "440–510 г/м² (стандарт)", match: /(?:440|510)\s*(?:гр|г)/i },
    { id: "550", label: "550 г/м² (литой премиум)", match: /550\s*(?:гр|г)|литой/i },
  ] as FacetOption[],

  // Тип просвета баннера
  bannerTypes: [
    { id: "all", label: "Все виды" },
    { id: "frontlit", label: "Frontlit (лицевой)", match: /frontlit|фронтлит/i },
    { id: "backlit", label: "Backlit (световой короб)", match: /backlit|бэклит/i },
    { id: "blockout", label: "Blockout (блэкаут)", match: /blockout|блокаут|блэкаут/i },
  ] as FacetOption[],

  // Ширина рулона
  rollWidths: [
    { id: "all", label: "Все ширины" },
    { id: "1.00-1.26", label: "1.00 – 1.26 м", match: /(?:1[.,]0|1[.,]26)\s*м/i },
    { id: "1.60", label: "1.60 м", match: /1[.,]6(?:0)?\s*м/i },
    { id: "2.20", label: "2.20 м", match: /2[.,]2(?:0)?\s*м/i },
    { id: "3.20", label: "3.20 м", match: /3[.,]2(?:0)?\s*м/i },
  ] as FacetOption[],

  // Тип монтажной пленки
  tapeMountTypes: [
    { id: "all", label: "Все основы" },
    { id: "with_liner", label: "С подложкой (бумажная)", match: /подложк|бумажн/i },
    { id: "without_liner", label: "Без подложки (пленочная)", match: /без подложк|пленочн/i },
  ] as FacetOption[],

  // Тип клея пленки
  adhesiveTypes: [
    { id: "all", label: "Все виды клея" },
    { id: "permanent", label: "Постоянный", match: /постоян/i },
    { id: "removable", label: "Легкосъемный (Removable)", match: /съемн|removable/i },
    { id: "gray", label: "Серый клей (Blackout)", match: /серый клей|blackout/i },
  ] as FacetOption[],

  // ─────────────────────────────────────────────────────────────
  // 4. ПРОФИЛИ И МЕТАЛЛ
  // ─────────────────────────────────────────────────────────────

  // Глубина короба (Профиль для лайтбоксов)
  boxDepths: [
    { id: "all", label: "Все глубины" },
    { id: "60", label: "60 мм", match: /60\s*мм/i },
    { id: "90", label: "90 мм", match: /90\s*мм/i },
    { id: "130", label: "130 мм", match: /130\s*мм/i },
    { id: "180", label: "180 мм", match: /180\s*мм/i },
  ] as FacetOption[],

  // Сечение профильной трубы
  tubeSizes: [
    { id: "all", label: "Все сечения" },
    { id: "15x15-20x20", label: "15×15 – 20×20 мм", match: /(?:15|20)\s*[*хx]\s*(?:15|20)/i },
    { id: "25x25-30x30", label: "25×25 – 30×30 мм", match: /(?:25|30)\s*[*хx]\s*(?:25|30)/i },
    { id: "40x20-40x40", label: "40×20 – 40×40 мм", match: /40\s*[*хx]\s*(?:20|40)/i },
  ] as FacetOption[],

  // Высота борта для букв
  letterBorders: [
    { id: "all", label: "Все высоты" },
    { id: "30-50", label: "30 – 50 мм", match: /(?:30|40|50)\s*мм/i },
    { id: "60-80", label: "60 – 80 мм", match: /(?:60|70|80)\s*мм/i },
    { id: "100+", label: "100 мм+", match: /100\s*мм/i },
  ] as FacetOption[],

  // Металл
  profileMetals: [
    { id: "all", label: "Все металлы" },
    { id: "aluminum", label: "Алюминий", match: /алюмин/i },
    { id: "steel", label: "Сталь / Черный металл", match: /сталь|черн|метал/i },
  ] as FacetOption[],

  // ─────────────────────────────────────────────────────────────
  // 5. КЛЕИ, СКОТЧИ И КРЕПЕЖ
  // ─────────────────────────────────────────────────────────────

  // Назначение / тип клея
  glueTypes: [
    { id: "all", label: "Все клеи" },
    {
      id: "activator",
      label: "2-х компонентный с активатором",
      match: /двухкомпонент|2-х|активатор|705|750|apel/i,
    },
    {
      id: "cyanoacrylate",
      label: "Цианакрилат (Суперклей)",
      match: /suba|201|202|супер клей|цианакрил/i,
    },
    {
      id: "nails",
      label: "Жидкие гвозди / Герметик",
      match: /жидкие гвозди|герметик|308|310|gpl|civi/i,
    },
    {
      id: "metal",
      label: "Для металла / алюминия",
      match: /клей ав|алюминиев/i,
    },
    {
      id: "thread",
      label: "Фиксатор резьбы",
      match: /j-20|резьб/i,
    },
  ] as FacetOption[],

  // Объем / фасовка клея
  glueVolumes: [
    { id: "all", label: "Все фасовки" },
    { id: "100ml", label: "100 мл + 25 г", match: /100\s*мл/i },
    { id: "200ml", label: "200 мл + 50 г", match: /200\s*мл/i },
    { id: "400ml", label: "400 мл + 100 г", match: /400\s*мл/i },
    { id: "small", label: "25 – 50 мл / г", match: /(?:25|50)\s*(?:мл|гр)/i },
    { id: "large", label: "300 – 500 мл / г", match: /(?:300|308|310|390|500)\s*(?:мл|гр)/i },
  ] as FacetOption[],

  // Цвет основы вспененного скотча
  doubleTapeBases: [
    { id: "all", label: "Все основы" },
    { id: "white", label: "Белая основа", match: /бел/i },
    { id: "black", label: "Черная основа", match: /черн/i },
    { id: "transparent", label: "Прозрачный силикон", match: /прозрачн|силикон/i },
  ] as FacetOption[],

  // Ширина ленты / скотча
  tapeWidths: [
    { id: "all", label: "Все ширины" },
    { id: "5mm", label: "5 мм (0.5 см)", match: /(?:0[.,]5|5)\s*(?:см|мм)/i },
    { id: "10mm", label: "10 мм (1.0 см)", match: /(?:1[.,]0|10)\s*(?:см|мм)/i },
    { id: "15mm", label: "15 мм (1.5 см)", match: /(?:1[.,]5|15)\s*(?:см|мм)/i },
    { id: "20mm", label: "20 мм (2.0 см)", match: /(?:2[.,]0|20)\s*(?:см|мм)/i },
    { id: "25-30mm", label: "25 – 30 мм (3 см)", match: /(?:25|30|3[.,]0)\s*(?:см|мм)/i },
    { id: "40-50mm", label: "40 – 50 мм (5 см)", match: /(?:40|48|50|5[.,]0)\s*(?:см|мм)/i },
  ] as FacetOption[],

  // Длина намотки
  tapeLengths: [
    { id: "all", label: "Любая намотка" },
    { id: "25-33m", label: "25 – 33 м", match: /(?:25|30|33)\s*м\b/i },
    { id: "45-50m", label: "45 – 50 м", match: /(?:45|45[.,]7|50)\s*м\b/i },
    { id: "150-200m", label: "150 – 200 м", match: /(?:150|200)\s*м\b/i },
  ] as FacetOption[],

  // Усиленные и силиконовые ленты
  reinforcedTapeTypes: [
    { id: "all", label: "Все типы" },
    { id: "banner", label: "Для баннера (высокая адгезия)", match: /для баннера|sh335/i },
    { id: "silicone", label: "Силиконовая прозрачная (SH368)", match: /силиконов.*прозрачн|sh368/i },
    { id: "pet", label: "Тонкая PET (SH338)", match: /pet|sh338|тонкая/i },
  ] as FacetOption[],

  // Специальные ленты
  specialTapeTypes: [
    { id: "all", label: "Все назначения" },
    { id: "masking", label: "Малярная лента", match: /малярн/i },
    { id: "cnc", label: "Для фрезерных столов (SH336)", match: /станков|sh336/i },
    { id: "magnetic", label: "Магнитная лента с клеем", match: /магнитн/i },
    { id: "reflective", label: "Светоотражающая сигнальная", match: /светоотраж/i },
    { id: "polygraphy", label: "Полиграфическая / рулонная", match: /полиграфическ|рулонн|sh328/i },
    { id: "packaging", label: "Упаковочная / Стретч", match: /стретч|упаковочн/i },
  ] as FacetOption[],

  // Диаметр люверсов
  grommetDiameters: [
    { id: "all", label: "Все диаметры" },
    { id: "10mm", label: "Ø 10 мм", match: /10\s*мм/i },
    { id: "12mm", label: "Ø 12 мм", match: /12\s*мм/i },
  ] as FacetOption[],

  // Материал люверсов / фурнитуры
  grommetMaterials: [
    { id: "all", label: "Все материалы" },
    { id: "stainless", label: "Нержавеющая сталь", match: /нержавейк|нерж/i },
    { id: "galvanized", label: "Оцинкованный металл", match: /оцинков/i },
    { id: "tool", label: "Инструмент / Пробойник", match: /пробойник|рельс|насадка/i },
  ] as FacetOption[],

  // Вынос дистанционного держателя
  standoffDistances: [
    { id: "all", label: "Все выносы" },
    { id: "15-20", label: "15 – 20 мм", match: /(?:15|20)\s*мм/i },
    { id: "25-30", label: "25 – 30 мм", match: /(?:25|30)\s*мм/i },
    { id: "50", label: "50 мм", match: /50\s*мм/i },
  ] as FacetOption[],

  // Диаметр дистанционного держателя
  standoffDiameters: [
    { id: "all", label: "Все диаметры" },
    { id: "12-16", label: "Ø 12 – 16 мм", match: /(?:12|16)\s*мм/i },
    { id: "19-25", label: "Ø 19 – 25 мм", match: /(?:19|25)\s*мм/i },
  ] as FacetOption[],

  // ─────────────────────────────────────────────────────────────
  // 6. ПЕРЕЗАКАЗ УСЛУГ (ПОДРЯДЧИКИ)
  // ─────────────────────────────────────────────────────────────

  // Материал резки
  serviceCutMaterials: [
    { id: "all", label: "Все материалы" },
    { id: "pvc", label: "ПВХ", match: /пвх/i },
    { id: "acrylic", label: "Акрил / Оргстекло", match: /акрил|оргстекл/i },
    { id: "composite", label: "АКП (композит)", match: /композит|акп/i },
    { id: "wood", label: "Фанера / МДФ", match: /фанер|мдф/i },
    { id: "metal", label: "Металл", match: /метал/i },
  ] as FacetOption[],

  // Тип печати
  servicePrintTypes: [
    { id: "all", label: "Все типы печати" },
    { id: "uv", label: "УФ-печать (планшетная)", match: /уф|uv/i },
    { id: "banner", label: "Печать на баннере", match: /баннер/i },
    { id: "film", label: "Печать на пленке", match: /пленк|самоклей/i },
    { id: "canvas", label: "Холст", match: /холст/i },
  ] as FacetOption[],
};

// ════════════════════════════════════════════════════════════════════
// ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ ОПРЕДЕЛЕНИЯ ПРИМЕНИМЫХ ФАСЕТОВ
// Возвращает ТОЛЬКО те ключи, которые релевантны текущей подкатегории
// ════════════════════════════════════════════════════════════════════
export function getApplicableFacetKeys(
  category: string,
  subcategory: string
): (keyof MaterialFacetState)[] {
  const cat = (category || "").trim().toLowerCase();
  const sub = (subcategory || "").trim().toLowerCase();

  // 1. ЛИСТОВЫЕ МАТЕРИАЛЫ
  if (cat === "sheets") {
    if (sub.includes("акрил") || sub.includes("оргстекло")) {
      return ["thickness", "color", "sheetSize"];
    }
    if (sub.includes("пвх")) {
      return ["thickness", "pvcDensity", "color", "sheetSize"];
    }
    if (sub.includes("акп") || sub.includes("алюмокомпозит")) {
      return ["thickness", "compositeSkin", "compositeFinish"];
    }
    if (sub.includes("пэт") || sub.includes("pvc") || sub.includes("пластиковые")) {
      return ["thickness", "plasticType"];
    }
    if (sub.includes("поликарбонат") || sub.includes("полистирол")) {
      return ["thickness", "polycarbonateType"];
    }
    if (sub.includes("ромарк") || sub.includes("двухслойный")) {
      return ["engravingColor"];
    }
    // "Все листовые"
    return ["thickness", "color", "sheetSize"];
  }

  // 2. СВЕТОТЕХНИКА И ЭЛЕКТРИКА
  if (cat === "lighting") {
    if (sub.includes("модул")) {
      return ["lensCount", "diodeWattage", "glowColor", "ipRating", "voltage"];
    }
    if (sub.includes("трансформатор") || sub.includes("блок")) {
      return ["transformerWattage", "housingType", "voltage"];
    }
    if (sub.includes("неон")) {
      return ["glowColor", "neonProfile", "neonDeliveryFormat", "voltage"];
    }
    if (sub.includes("лент")) {
      return ["glowColor", "stripWattage", "ipRating", "voltage"];
    }
    if (sub.includes("контроллер") || sub.includes("диммер")) {
      return ["controllerType", "voltage"];
    }
    if (sub.includes("кабел") || sub.includes("провод")) {
      return ["wireGauge"];
    }
    // "Вся светотехника"
    return ["voltage", "glowColor", "ipRating"];
  }

  // 3. ПЛЕНКИ И БАННЕРЫ
  if (cat === "vinyl") {
    if (sub.includes("641") || sub.includes("плоттер")) {
      return ["vinylSurface", "color", "rollWidth"];
    }
    if (sub.includes("8500") || sub.includes("светорассе")) {
      return ["color", "rollWidth"];
    }
    if (sub.includes("баннер")) {
      return ["bannerDensity", "bannerType", "rollWidth"];
    }
    if (sub.includes("монтажн")) {
      return ["tapeMountType", "rollWidth"];
    }
    if (sub.includes("печат") || sub.includes("ламинац")) {
      return ["vinylSurface", "adhesiveType"];
    }
    // "Все пленки"
    return ["vinylSurface", "bannerDensity", "rollWidth"];
  }

  // 4. ПРОФИЛИ И МЕТАЛЛ
  if (cat === "profiles") {
    if (sub.includes("лайтбокс")) {
      return ["boxDepth"];
    }
    if (sub.includes("труб") || sub.includes("уголок")) {
      return ["tubeSize", "profileMetal"];
    }
    if (sub.includes("борт")) {
      return ["letterBorder"];
    }
    return ["profileMetal"];
  }

  // 5. КЛЕИ, СКОТЧИ И КРЕПЕЖ
  if (cat === "hardware") {
    if (sub.includes("клей") || sub.includes("герметик") || sub.includes("кле")) {
      return ["glueType", "glueVolume"];
    }
    if (sub.includes("вспененн")) {
      return ["doubleTapeBase", "tapeWidth", "tapeLength"];
    }
    if (sub.includes("усиленн") || sub.includes("силиконов")) {
      return ["reinforcedTapeType", "tapeWidth", "tapeLength"];
    }
    if (sub.includes("специальн") || sub.includes("малярн")) {
      return ["specialTapeType", "tapeWidth", "tapeLength"];
    }
    if (sub.includes("люверс") || sub.includes("пробойник") || sub.includes("фурнитур")) {
      return ["grommetDiameter", "grommetMaterial"];
    }
    if (sub.includes("дистанционн") || sub.includes("метиз") || sub.includes("держател")) {
      return ["standoffDistance", "standoffDiameter"];
    }
    // "Все клеи, скотчи и крепеж"
    return ["glueType", "doubleTapeBase", "tapeWidth", "grommetDiameter"];
  }

  // 6. ПЕРЕЗАКАЗ УСЛУГ
  if (cat === "services") {
    if (sub.includes("резк")) {
      return ["serviceCutMaterial"];
    }
    if (sub.includes("печат")) {
      return ["servicePrintType"];
    }
    return [];
  }

  // ВСЕ КАТЕГОРИИ (Верхний уровень)
  if (cat === "all") {
    return ["thickness", "color", "voltage"];
  }

  return [];
}

// ════════════════════════════════════════════════════════════════════
// ЧЕЛОВЕКОЧИТАЕМЫЕ НАЗВАНИЯ ХАРАКТЕРИСТИК ДЛЯ UI
// ════════════════════════════════════════════════════════════════════
export const FACET_LABELS: Record<keyof MaterialFacetState, string> = {
  // Листовые
  thickness: "Толщина листа",
  color: "Цвет и оптика",
  sheetSize: "Размер листа",
  pvcDensity: "Плотность ПВХ",
  compositeSkin: "Стенка алюминия АКП",
  compositeFinish: "Фактура и финиш АКП",
  plasticType: "Тип пластика",
  polycarbonateType: "Вид поликарбоната / полистирола",
  engravingColor: "Цвет Ромарк",

  // Светотехника
  lensCount: "Количество линз",
  diodeWattage: "Мощность диодов (W)",
  glowColor: "Свечение и цветовая t°",
  ipRating: "Степень влагозащиты (IP)",
  transformerWattage: "Мощность блока (W)",
  housingType: "Исполнение корпуса",
  neonProfile: "Сечение неона",
  neonDeliveryFormat: "Формат поставки неона",
  stripWattage: "Мощность ленты (W/м)",
  controllerType: "Тип управления",
  wireGauge: "Сечение провода",
  voltage: "Напряжение питания",

  // Пленки
  vinylSurface: "Тип поверхности",
  bannerDensity: "Плотность баннера",
  bannerType: "Тип просвета баннера",
  rollWidth: "Ширина рулона",
  tapeMountType: "Основа монтажки",
  adhesiveType: "Тип клея",

  // Профили
  boxDepth: "Глубина короба",
  tubeSize: "Сечение трубы",
  letterBorder: "Высота борта буквы",
  profileMetal: "Материал профиля",

  // Клеи, скотчи и крепеж
  glueType: "Тип клея",
  glueVolume: "Объем / Фасовка",
  doubleTapeBase: "Цвет основы",
  tapeWidth: "Ширина ленты / скотча",
  tapeLength: "Длина намотки",
  reinforcedTapeType: "Тип усиленной ленты",
  specialTapeType: "Назначение ленты",
  grommetDiameter: "Диаметр люверса",
  grommetMaterial: "Материал / Назначение",
  standoffDistance: "Вынос держателя",
  standoffDiameter: "Диаметр держателя",

  // Услуги
  serviceCutMaterial: "Материал резки",
  servicePrintType: "Тип печати",
};

// ════════════════════════════════════════════════════════════════════
// КАРТА СВЯЗИ КЛЮЧЕЙ С ИХ ОПЦИЯМИ
// ════════════════════════════════════════════════════════════════════
export const FACET_CONFIG_MAP: Record<keyof MaterialFacetState, FacetOption[]> = {
  // Листовые
  thickness: MATERIAL_FACETS.thicknesses,
  color: MATERIAL_FACETS.colors,
  sheetSize: MATERIAL_FACETS.sheetSizes,
  pvcDensity: MATERIAL_FACETS.pvcDensities,
  compositeSkin: MATERIAL_FACETS.compositeSkins,
  compositeFinish: MATERIAL_FACETS.compositeFinishes,
  plasticType: MATERIAL_FACETS.plasticTypes,
  polycarbonateType: MATERIAL_FACETS.polycarbonateTypes,
  engravingColor: MATERIAL_FACETS.engravingColors,

  // Светотехника
  lensCount: MATERIAL_FACETS.lensCounts,
  diodeWattage: MATERIAL_FACETS.diodeWattages,
  glowColor: MATERIAL_FACETS.glowColors,
  ipRating: MATERIAL_FACETS.ipRatings,
  transformerWattage: MATERIAL_FACETS.transformerWattages,
  housingType: MATERIAL_FACETS.housingTypes,
  neonProfile: MATERIAL_FACETS.neonProfiles,
  neonDeliveryFormat: MATERIAL_FACETS.neonDeliveryFormats,
  stripWattage: MATERIAL_FACETS.stripWattages,
  controllerType: MATERIAL_FACETS.controllerTypes,
  wireGauge: MATERIAL_FACETS.wireGauges,
  voltage: MATERIAL_FACETS.voltages,

  // Пленки и баннеры
  vinylSurface: MATERIAL_FACETS.vinylSurfaces,
  bannerDensity: MATERIAL_FACETS.bannerDensities,
  bannerType: MATERIAL_FACETS.bannerTypes,
  rollWidth: MATERIAL_FACETS.rollWidths,
  tapeMountType: MATERIAL_FACETS.tapeMountTypes,
  adhesiveType: MATERIAL_FACETS.adhesiveTypes,

  // Профили
  boxDepth: MATERIAL_FACETS.boxDepths,
  tubeSize: MATERIAL_FACETS.tubeSizes,
  letterBorder: MATERIAL_FACETS.letterBorders,
  profileMetal: MATERIAL_FACETS.profileMetals,

  // Клеи, скотчи и крепеж
  glueType: MATERIAL_FACETS.glueTypes,
  glueVolume: MATERIAL_FACETS.glueVolumes,
  doubleTapeBase: MATERIAL_FACETS.doubleTapeBases,
  tapeWidth: MATERIAL_FACETS.tapeWidths,
  tapeLength: MATERIAL_FACETS.tapeLengths,
  reinforcedTapeType: MATERIAL_FACETS.reinforcedTapeTypes,
  specialTapeType: MATERIAL_FACETS.specialTapeTypes,
  grommetDiameter: MATERIAL_FACETS.grommetDiameters,
  grommetMaterial: MATERIAL_FACETS.grommetMaterials,
  standoffDistance: MATERIAL_FACETS.standoffDistances,
  standoffDiameter: MATERIAL_FACETS.standoffDiameters,

  // Услуги
  serviceCutMaterial: MATERIAL_FACETS.serviceCutMaterials,
  servicePrintType: MATERIAL_FACETS.servicePrintTypes,
};


