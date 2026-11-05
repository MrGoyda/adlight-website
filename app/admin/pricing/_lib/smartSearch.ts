/**
 * Интеллектуальный поисковый движок для каталога материалов и услуг.
 * Возможности:
 * 1. Мульти-токенизация (независимый порядок слов).
 * 2. Полная нечувствительность к регистру (Case-Insensitive & Unicode).
 * 3. Нормализация единиц (3мм = 3 мм = 3mm, 12v = 12в = 12 V, 2.05х3.05 = 2.05x3.05 = 2.05*3.05).
 * 4. Замена буквы "ё" на "е" (плёнка = пленка, чёрный = черный).
 * 5. Автоматическое исправление раскладки (QWERTY ⇄ ЙЦУКЕН).
 * 6. Транслитерация брендов (Demer ⇄ Демер, Signtech ⇄ Сайнтек, Oracal ⇄ Оракал).
 * 7. Словарь синонимов и сленга рекламного производства.
 * 8. Мягкий нечеткий поиск (Fuzzy / Levenshtein) без жесткого отсечения при опечатках.
 */

import { SupplierPriceItem } from "../_types/pricingTypes";
import { EN_TO_RU_KEYBOARD, RU_TO_EN_KEYBOARD, SynonymRule } from "../_data/synonymsDictionary";

const TRANSLIT_PAIRS: Record<string, string> = {
  demer: "демер",
  демер: "demer",
  signtech: "сайнтек",
  сайнтек: "signtech",
  сигнтек: "signtech",
  akril: "акрил",
  акрил: "akril",
  oracal: "оракал",
  оракал: "oracal",
  cosmofen: "космофен",
  космофен: "cosmofen",
  unext: "юнекст",
  юнекст: "unext",
  led: "диод",
  лед: "led",
};

/**
 * Переключение раскладки клавиатуры при опечатках менеджера
 */
export function convertKeyboardLayout(text: string): { ru: string; en: string } {
  const lower = text.toLowerCase().replace(/ё/g, "е");

  let ru = "";
  for (const ch of lower) {
    ru += EN_TO_RU_KEYBOARD[ch] || ch;
  }

  let en = "";
  for (const ch of lower) {
    en += RU_TO_EN_KEYBOARD[ch] || ch;
  }

  return { ru, en };
}

/**
 * Нормализация текста: регистр, буква ё, объединение единиц измерения, очистка пунктуации
 */
export function normalizeSearchText(text: string): string {
  if (!text) return "";

  return text
    .toLowerCase()
    .replace(/ё/g, "е")
    // Замена русской буквы "х" и звездочки в размерах на латинскую "x" (2.05х3.05 -> 2.05x3.05)
    .replace(/(\d+)\s*[хx*]\s*(\d+)/gi, "$1x$2")
    // Приведение мощностей и напряжений (100 вт -> 100w, 12 в -> 12v)
    .replace(/(\d+)\s*(?:вт|w|ватт|watt)(?!\w)/gi, "$1w")
    .replace(/(\d+)\s*(?:в|v|volt|вольт)(?!\w)/gi, "$1v")
    // Приведение толщин и длин (3 мм -> 3mm, 10 см -> 10cm)
    .replace(/(\d+)\s*(?:мм|mm)(?!\w)/gi, "$1mm")
    .replace(/(\d+)\s*(?:см|cm)(?!\w)/gi, "$1cm")
    .replace(/(\d+)\s*(?:м|m)(?!\w)/gi, "$1m")
    // Замена дефисов, скобок и спецсимволов на пробелы
    .replace(/[«»""''()[\]{}_,;!?/\\+-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Простое отсечение типичных русских окончаний для поиска по корню (Стемминг)
 */
export function stemRussianWord(word: string): string {
  if (word.length <= 3) return word;

  return word
    .replace(/(овыми|ового|овому|овых|ными|ного|ному|ных|лями|тель|вать|ение|ения)$/i, "")
    .replace(/(овый|овая|овое|овые|ный|ная|ное|ные|ний|няя|нее|ние)$/i, "")
    .replace(/(ами|ями|ов|ев|ей|ом|ем|ам|ям|ах|ях|ую|юю|ой|ей|ою|ею)$/i, "")
    .replace(/(а|е|и|й|о|у|ы|ь|я)$/i, "");
}

/**
 * Расстояние Левенштейна для нечеткого поиска опечаток
 */
export function getLevenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Построение быстрого словаря синонимов из правил
 */
export function buildSynonymLookup(rules: SynonymRule[]): Map<string, string[]> {
  const map = new Map<string, string[]>();

  for (const rule of rules) {
    const canonical = rule.target.toLowerCase().replace(/ё/g, "е").trim();
    const allForms = [
      canonical,
      ...rule.aliases.map((a) => a.toLowerCase().replace(/ё/g, "е").trim()),
    ];

    for (const form of allForms) {
      if (!form) continue;
      const existing = map.get(form) || [];
      const merged = Array.from(new Set([...existing, ...allForms]));
      map.set(form, merged);
    }
  }

  return map;
}

/**
 * Расширение поискового токена всеми известными синонимами, раскладками и транслитом
 */
export function expandTokenVariants(token: string, synonymMap: Map<string, string[]>): string[] {
  const variants = new Set<string>();
  const clean = token.toLowerCase().replace(/ё/g, "е").trim();
  if (!clean) return [];

  variants.add(clean);

  // 1. Прямой транслит (demer ⇄ демер, signtech ⇄ сайнтек)
  if (TRANSLIT_PAIRS[clean]) {
    variants.add(TRANSLIT_PAIRS[clean]);
  }

  // 2. Раскладка клавиатуры (на случай опечатки типа "frhbk" -> "акрил")
  const { ru, en } = convertKeyboardLayout(clean);
  if (ru && ru !== clean) variants.add(ru);
  if (en && en !== clean) variants.add(en);

  // 3. Синонимы из словаря
  for (const v of Array.from(variants)) {
    const synonyms = synonymMap.get(v);
    if (synonyms) {
      for (const s of synonyms) variants.add(s);
    }
  }

  // 4. Добавление основ слов (стемминг)
  for (const v of Array.from(variants)) {
    if (v.length >= 4) {
      variants.add(stemRussianWord(v));
    }
  }

  return Array.from(variants).filter(Boolean);
}

export interface MatchScoreResult {
  item: SupplierPriceItem;
  score: number;
}

export interface PreparedQueryToken {
  token: string;
  variants: string[];
  stem: string;
}

export interface PreparedSearchQuery {
  raw: string;
  normalized: string;
  tokens: PreparedQueryToken[];
}

/**
 * Предварительная компиляция поискового запроса
 */
export function prepareSearchQuery(
  query: string,
  synonymMap: Map<string, string[]>
): PreparedSearchQuery | null {
  if (!query || !query.trim()) return null;

  const raw = query.toLowerCase().replace(/ё/g, "е").trim();
  const normalized = normalizeSearchText(query);
  const rawTokens = normalized.split(/\s+/).filter((t) => t.length > 0);

  if (rawTokens.length === 0) return null;

  const tokens: PreparedQueryToken[] = rawTokens.map((token) => ({
    token,
    variants: expandTokenVariants(token, synonymMap),
    stem: token.length >= 4 ? stemRussianWord(token) : token,
  }));

  return { raw, normalized, tokens };
}

/**
 * Подсчет релевантности товара с использованием нормализации и нечувствительности к регистру
 */
export function calculatePreparedRelevance(
  item: SupplierPriceItem,
  prepared: PreparedSearchQuery
): number {
  const { raw, normalized, tokens } = prepared;

  const itemName = normalizeSearchText(item.name || "");
  const itemDesc = normalizeSearchText(item.description || "");
  const itemCategory = normalizeSearchText(item.category || "");
  const itemSubcategory = normalizeSearchText(item.subcategory || "");
  const itemSupplier = normalizeSearchText(item.supplier || "");

  const fullItemText = `${itemName} ${itemSupplier} ${itemCategory} ${itemSubcategory} ${itemDesc}`;

  let totalScore = 0;

  // 1. Прямое совпадение всей фразы целиком
  if (fullItemText.includes(raw) || fullItemText.includes(normalized)) {
    totalScore += 250;
  }

  // 2. Проверка каждого скомпилированного токена запроса
  let matchedTokensCount = 0;

  for (let i = 0; i < tokens.length; i++) {
    const { token, variants, stem } = tokens[i];
    let tokenMatched = false;
    let tokenBestWeight = 0;

    for (let j = 0; j < variants.length; j++) {
      const v = variants[j];
      if (itemName.includes(v)) {
        tokenMatched = true;
        tokenBestWeight = 60;
        break;
      }
      if (itemSupplier.includes(v)) {
        tokenMatched = true;
        tokenBestWeight = Math.max(tokenBestWeight, 50);
        break;
      }
      if (itemSubcategory.includes(v) || itemCategory.includes(v)) {
        tokenMatched = true;
        tokenBestWeight = Math.max(tokenBestWeight, 35);
      } else if (itemDesc.includes(v)) {
        tokenMatched = true;
        tokenBestWeight = Math.max(tokenBestWeight, 25);
      }
    }

    // Проверка стемминга и опечаток
    if (!tokenMatched && token.length >= 3) {
      if (itemName.includes(stem) || itemSupplier.includes(stem)) {
        tokenMatched = true;
        tokenBestWeight = 25;
      } else {
        const nameWords = itemName.split(/\s+/);
        for (let k = 0; k < nameWords.length; k++) {
          const nw = nameWords[k];
          if (nw.length >= 3 && Math.abs(nw.length - token.length) <= 2) {
            const dist = getLevenshteinDistance(nw, token);
            if (dist <= 1 || (token.length >= 6 && dist <= 2)) {
              tokenMatched = true;
              tokenBestWeight = 20;
              break;
            }
          }
        }
      }
    }

    if (tokenMatched) {
      matchedTokensCount++;
      totalScore += tokenBestWeight;
    }
  }

  // Одиночный токен обязан совпасть
  if (tokens.length === 1 && matchedTokensCount === 0) {
    return 0;
  }

  // Все токены совпали (100% покрытие запроса)
  if (matchedTokensCount === tokens.length) {
    return totalScore + (matchedTokensCount * 25);
  }

  // Длинный запрос (3+ слова): допускаем совпадение большинства слов
  if (tokens.length >= 3 && matchedTokensCount >= tokens.length - 1) {
    return totalScore;
  }

  return 0;
}

/**
 * Универсальный быстрый матчер для любого объекта (используется в таблице калькулятора, полке и пикерах)
 */
export function matchSearchQuery(
  item: {
    name: string;
    supplier?: string | null;
    category?: string | null;
    subcategory?: string | null;
    description?: string | null;
  },
  query: string
): boolean {
  if (!query || !query.trim()) return true;

  const qClean = normalizeSearchText(query);
  const qTokens = qClean.split(/\s+/).filter((t) => t.length > 0);
  if (qTokens.length === 0) return true;

  const itemFullText = normalizeSearchText(
    `${item.name} ${item.supplier || ""} ${item.category || ""} ${item.subcategory || ""} ${item.description || ""}`
  );

  // Точное совпадение всей строки
  if (itemFullText.includes(qClean)) return true;

  let matched = 0;
  for (const token of qTokens) {
    const variants = expandTokenVariants(token, new Map());
    let found = false;

    for (const v of variants) {
      if (itemFullText.includes(v)) {
        found = true;
        break;
      }
    }

    if (found) {
      matched++;
    }
  }

  if (qTokens.length === 1) return matched > 0;
  if (matched === qTokens.length) return true;
  if (qTokens.length >= 3 && matched >= qTokens.length - 1) return true;

  return false;
}
