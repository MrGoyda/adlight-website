// ════════════════════════════════════════════════════════════════════
// ХАРАКТЕРИСТИКИ И ФАСЕТЫ МАТЕРИАЛОВ (Apple Pro Material Facets 2026)
// ════════════════════════════════════════════════════════════════════

export interface FacetOption {
  id: string;
  label: string;
  match?: RegExp;
}

export interface MaterialFacetState {
  thickness: string;
  color: string;
  sheetSize: string;
  vinylSurface: string;
  bannerDensity: string;
  voltage: string;
}

export const INITIAL_FACETS: MaterialFacetState = {
  thickness: "all",
  color: "all",
  sheetSize: "all",
  vinylSurface: "all",
  bannerDensity: "all",
  voltage: "all",
};

export const MATERIAL_FACETS = {
  // Толщина листовых материалов
  thicknesses: [
    { id: "all", label: "Все" },
    { id: "1.5", label: "1.5 мм", match: /(?:1[.,]5|1[.,]8|1[.,]2)\s*(?:мм|mm)/i },
    { id: "2", label: "2 мм", match: /(?:^|[\s(])2\s*(?:мм|mm)/i },
    { id: "3", label: "3 мм", match: /(?:^|[\s(])3\s*(?:мм|mm)/i },
    { id: "4", label: "4 мм", match: /(?:^|[\s(])4\s*(?:мм|mm)/i },
    { id: "5", label: "5 мм", match: /(?:^|[\s(])5\s*(?:мм|mm)/i },
    { id: "6-7", label: "6–7 мм", match: /(?:^|[\s(])[67]\s*(?:мм|mm)/i },
    { id: "8", label: "8 мм", match: /(?:^|[\s(])8\s*(?:мм|mm)/i },
    { id: "10+", label: "10 мм+", match: /(?:^|[\s(])(?:10|12|15|20)\s*(?:мм|mm)/i },
  ] as FacetOption[],

  // Цвета и прозрачность
  colors: [
    { id: "all", label: "Все цвета" },
    { id: "transparent", label: "Прозрачный", match: /прозрачн/i },
    { id: "white", label: "Белый / Опал", match: /бел|молочн|опал/i },
    { id: "black", label: "Черный", match: /черн/i },
    { id: "mirror", label: "Зеркальный", match: /зеркал|золото|серебро/i },
    { id: "colored", label: "Цветной", match: /красн|синий|желт|зелен|салатов|оранжев|серый/i },
  ] as FacetOption[],

  // Размеры листа
  sheetSizes: [
    { id: "all", label: "Все форматы" },
    { id: "1.22x2.44", label: "1.22 × 2.44 м", match: /1[.,]2[25]\s*[*хx]\s*2[.,]4[45]/i },
    { id: "2.05x3.05", label: "2.05 × 3.05 м", match: /2[.,]0[58]\s*[*хx]\s*3[.,]0[85]/i },
  ] as FacetOption[],

  // Поверхность пленок и баннеров
  vinylSurfaces: [
    { id: "all", label: "Все" },
    { id: "gloss", label: "Глянцевый", match: /глян/i },
    { id: "matte", label: "Матовый", match: /мат/i },
    { id: "translucent", label: "Транслюцент (8500)", match: /транслюц|8500|светорассе/i },
  ] as FacetOption[],

  // Плотность баннерной ткани
  bannerDensities: [
    { id: "all", label: "Все" },
    { id: "340", label: "340 г/м²", match: /340\s*(?:гр|г)/i },
    { id: "440", label: "440-510 г/м²", match: /(?:440|510)\s*(?:гр|г)/i },
    { id: "550", label: "550 г/м² Литой", match: /550\s*(?:гр|г)|литой/i },
  ] as FacetOption[],

  // Напряжение для светотехники
  voltages: [
    { id: "all", label: "Все" },
    { id: "12v", label: "12V", match: /12\s*(?:v|в)/i },
    { id: "24v", label: "24V", match: /24\s*(?:v|в)/i },
    { id: "220v", label: "220V", match: /220\s*(?:v|в)/i },
  ] as FacetOption[],
};
