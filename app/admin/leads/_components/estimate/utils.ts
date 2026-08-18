import { SupplierPrice, ParsedSupplierPrice, EstimateItem } from "./types";

export interface EstimateCategoryBreakdown {
  materialCost: number;
  assemblyCost: number;
  installationCost: number;
  equipmentCost: number;
  logisticsCost: number;
  totalSalary: number;
  totalCost: number;
  totalSell: number;
  margin: number;
  marginPercent: number;
  markupProfit: number;
  markupPercent: number;
  itemCount: number;
}

/**
 * Каскадный парсер прайс-листов поставщиков (Акрил, ПВХ, Светодиоды, Неон и т.д.)
 */
export function parseSupplierPrices(supplierPrices: SupplierPrice[]): ParsedSupplierPrice[] {
  return supplierPrices.map(sp => {
    let category = "Другое";
    const nameLower = sp.name.toLowerCase();

    if (
      nameLower.includes("пвх") || 
      nameLower.includes("оргстекло") || 
      nameLower.includes("акрил") || 
      nameLower.includes("алюкобонд") || 
      nameLower.includes("пэт") || 
      nameLower.includes("пвс") || 
      nameLower.includes("abs") || 
      nameLower.includes("пластик")
    ) {
      category = "Листовые материалы";
    } else if (nameLower.includes("баннер") || nameLower.includes("пленка") || nameLower.includes("магнитная")) {
      category = "Рулонные материалы";
    } else if (nameLower.includes("светодиод") || nameLower.includes("лент")) {
      category = "Светодиоды";
    } else if (nameLower.includes("неон")) {
      category = "Неон";
    } else if (
      nameLower.includes("трансформатор") || 
      nameLower.includes("блок питания") || 
      nameLower.includes("шввп") || 
      nameLower.includes("кабель") || 
      nameLower.includes("провод")
    ) {
      category = "Электрика и Питание";
    } else if (nameLower.includes("скотч") || nameLower.includes("клей") || nameLower.includes("mitreapel")) {
      category = "Клей и Скотч";
    }

    let materialType = "Общее";
    if (nameLower.includes("пвх")) materialType = "ПВХ пластик";
    else if (nameLower.includes("акрил")) materialType = "Акрил (Оргстекло)";
    else if (nameLower.includes("алюкобонд")) materialType = "Алюкобонд (АКП)";
    else if (nameLower.includes("пэт")) materialType = "ПЭТ";
    else if (nameLower.includes("баннер")) materialType = "Баннер";
    else if (nameLower.includes("пленка")) materialType = "Самоклеящаяся пленка";
    else if (nameLower.includes("неон")) materialType = "Гибкий неон";
    else if (nameLower.includes("светодиод") || nameLower.includes("модул")) materialType = "Светодиодные модули";
    else if (nameLower.includes("лент")) materialType = "Светодиодные ленты";
    else if (nameLower.includes("блок") || nameLower.includes("трансформатор")) materialType = "Блоки питания (220/12V)";

    let spec = "Стандарт";
    const thicknessMatch = sp.name.match(/(\d+(?:[.,]\d+)?)\s*(?:мм|mm)/i);
    if (thicknessMatch) {
      spec = `${thicknessMatch[1].replace(',', '.')} мм`;
    } else if (nameLower.includes("12v") || nameLower.includes("12в")) {
      spec = "12V";
    } else if (nameLower.includes("24v") || nameLower.includes("24в")) {
      spec = "24V";
    }

    return {
      id: sp.id,
      originalName: sp.name,
      supplier: sp.supplier,
      price: sp.price,
      unit: sp.unit,
      category,
      materialType,
      spec,
      detail: sp.name
    };
  });
}

/**
 * Расчет тарифа автовышки (мин. 2 часа = 20 000 ₸, далее +10 000 ₸/час)
 */
export function calcEquipmentRates(hours: number) {
  const h = Math.max(1, hours);
  if (h <= 1) {
    return { costPrice: 20000, sellPrice: 26000, name: `Аренда автовышки (${h} ч)` };
  }
  return { costPrice: 10000, sellPrice: 13000, name: `Аренда автовышки (${h} ч)` };
}

/**
 * Расчет тарифа 6-метровой газели (длинномер, мин. 2 часа = 20 000 ₸, далее +10 000 ₸/час)
 */
export function calcLongTruckRates(hours: number) {
  const h = Math.max(1, hours);
  if (h <= 1) {
    return { costPrice: 20000, sellPrice: 26000, name: `Аренда 6-метровой газели (${h} ч)` };
  }
  return { costPrice: 10000, sellPrice: 13000, name: `Аренда 6-метровой газели (${h} ч)` };
}

/**
 * Расчет тарифа стандартной газели по рейсам
 */
export function calcStandardTruckRates(trips: number) {
  const t = Math.max(1, trips);
  return {
    costPrice: 15000,
    sellPrice: 20000,
    name: `Аренда газели (${t} ${t === 1 ? 'рейс' : t < 5 ? 'рейса' : 'рейсов'})`
  };
}

/**
 * Расчет общих финансовых итогов и подробной структуры затрат сметы
 */
export function calcEstimateBreakdown(items: EstimateItem[]): EstimateCategoryBreakdown {
  let materialCost = 0;
  let assemblyCost = 0;
  let installationCost = 0;
  let equipmentCost = 0;
  let logisticsCost = 0;
  let totalCost = 0;
  let totalSell = 0;

  for (const item of items) {
    const qty = Number(item.quantity) || 0;
    const cost = (Number(item.costPrice) || 0) * qty;
    const sell = (Number(item.sellPrice) || 0) * qty;

    totalCost += cost;
    totalSell += sell;

    if (item.type === "MATERIAL_STOCK" || item.type === "MATERIAL_SUPPLIER" || item.type === "CUSTOM") {
      materialCost += cost;
    } else if (item.type === "ASSEMBLY") {
      assemblyCost += cost;
    } else if (item.type === "INSTALLATION") {
      installationCost += cost;
    } else if (item.type === "EQUIPMENT") {
      equipmentCost += cost;
    } else if (item.type === "LOGISTICS") {
      logisticsCost += cost;
    }
  }

  const totalSalary = assemblyCost + installationCost;
  const markupProfit = totalSell - totalCost;
  const markupPercent = totalCost > 0 ? (markupProfit / totalCost) * 100 : (totalSell > 0 ? 100 : 0);

  return {
    materialCost,
    assemblyCost,
    installationCost,
    equipmentCost,
    logisticsCost,
    totalSalary,
    totalCost,
    totalSell,
    margin: markupProfit,
    marginPercent: markupPercent,
    markupProfit,
    markupPercent,
    itemCount: items.length,
  };
}

/**
 * Совместимость: расчет базовых итогов
 */
export function calcEstimateTotals(items: EstimateItem[]) {
  return calcEstimateBreakdown(items);
}

/* ─────────────────────────────────────────────────────────────
 * КЭШИРОВАНИЕ И АВТОСОХРАНЕНИЕ ЧЕРНОВИКОВ СМЕТЫ (LocalStorage)
 * ───────────────────────────────────────────────────────────── */
const DRAFT_PREFIX = "adlight_estimate_draft_";
const MAX_DRAFT_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 дней хранения черновика

export interface EstimateDraftData {
  items: EstimateItem[];
  leadId: string | null;
  timestamp: number;
  timeStr: string;
}

/**
 * Сохраняет черновик сметы в локальный кэш
 */
export function saveEstimateDraft(key: string, items: EstimateItem[], leadId: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (!items || items.length === 0) {
      localStorage.removeItem(`${DRAFT_PREFIX}${key}`);
      return;
    }
    const draft: EstimateDraftData = {
      items,
      leadId,
      timestamp: Date.now(),
      timeStr: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    localStorage.setItem(`${DRAFT_PREFIX}${key}`, JSON.stringify(draft));
  } catch (err) {
    console.error("Ошибка сохранения черновика сметы:", err);
  }
}

/**
 * Считывает черновик сметы из локального кэша
 */
export function loadEstimateDraft(key: string): EstimateDraftData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`${DRAFT_PREFIX}${key}`);
    if (!raw) return null;
    const draft: EstimateDraftData = JSON.parse(raw);
    if (!draft || !Array.isArray(draft.items) || draft.items.length === 0) {
      localStorage.removeItem(`${DRAFT_PREFIX}${key}`);
      return null;
    }
    if (Date.now() - draft.timestamp > MAX_DRAFT_AGE_MS) {
      localStorage.removeItem(`${DRAFT_PREFIX}${key}`);
      return null;
    }
    return draft;
  } catch (err) {
    return null;
  }
}

/**
 * Очищает сохраненный черновик сметы
 */
export function clearEstimateDraft(key: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(`${DRAFT_PREFIX}${key}`);
  } catch (err) {}
}

