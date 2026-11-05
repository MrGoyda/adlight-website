/**
 * Интеллектуальный поисковый движок для каталога материалов и услуг.
 * Возможности:
 * 1. Мульти-токенизация (независимый порядок слов).
 * 2. Автоматическое исправление раскладки (QWERTY ⇄ ЙЦУКЕН).
 * 3. Нормализация единиц (3мм = 3 мм, 12v = 12в, 2.05х3.05 = 2.05x3.05).
 * 4. Словарь синонимов и сленга рекламного производства (встроенный + кастомный).
 * 5. Стемминг корней и прощение опечаток (Fuzzy / Levenshtein).
 * 6. Ранжирование по релевантности (Scoring).
 */

import { SupplierPriceItem } from "../_types/pricingTypes";
import { EN_TO_RU_KEYBOARD, RU_TO_EN_KEYBOARD, SynonymRule } from "../_data/synonymsDictionary";

/**
 * Переключение раскладки клавиатуры при опечатках менеджера
 */
export function convertKeyboardLayout(text: string): { ru: string; en: string } {
  const lower = text.toLowerCase();
  
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
 * Нормализация текста: удаление лишних знаков, приведение единиц и размеров
 */
export function normalizeSearchText(text: string): string {
  if (!text) return "";

  return text
    .toLowerCase()
    // Замена русской буквы "х" в размерах на латинскую "x" (2.05х3.05 -> 2.05x3.05)
    .replace(/(\d+)\s*[хx]\s*(\d+)/gi, "$1x$2")
    // Отделение цифр от единиц (3мм -> 3 мм, 12v -> 12 v, 200w -> 200 w)
    .replace(/(\d+)\s*(мм|mm|см|cm|м|m|v|в|w|вт|ватт|volt|вольт)\b/gi, "$1 $2")
    // Замена дефисов, слешей и точек между буквами на пробелы для разделения слов
    .replace(/[«»""''()[\]{}_,;!?]/g, " ")
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
          matrix[i - 1][j - 1] + 1, // замена
          matrix[i][j - 1] + 1,     // вставка
          matrix[i - 1][j] + 1      // удаление
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
    const canonical = rule.target.toLowerCase().trim();
    const allForms = [canonical, ...rule.aliases.map((a) => a.toLowerCase().trim())];

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
 * Расширение поискового токена всеми известными синонимами и альтернативными раскладками
 */
export function expandTokenVariants(token: string, synonymMap: Map<string, string[]>): string[] {
  const variants = new Set<string>();
  const clean = token.toLowerCase().trim();
  if (!clean) return [];

  variants.add(clean);

  // 1. Раскладка клавиатуры (на случай опечатки типа "frhbk" -> "акрил")
  const { ru, en } = convertKeyboardLayout(clean);
  if (ru && ru !== clean) variants.add(ru);
  if (en && en !== clean) variants.add(en);

  // 2. Синонимы из словаря
  for (const v of Array.from(variants)) {
    const synonyms = synonymMap.get(v);
    if (synonyms) {
      for (const s of synonyms) variants.add(s);
    }
  }

  // 3. Добавление основ слов (стемминг)
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

/**
 * Интеллектуальный подсчет релевантности товара поисковому запросу
 */
export function calculateItemRelevance(
  item: SupplierPriceItem,
  query: string,
  synonymMap: Map<string, string[]>
): number {
  if (!query || !query.trim()) return 100;

  const rawQuery = query.toLowerCase().trim();
  const normalizedQuery = normalizeSearchText(query);
  const queryTokens = normalizedQuery.split(/\s+/).filter((t) => t.length > 0);

  if (queryTokens.length === 0) return 100;

  // Подготавливаем поля товара
  const itemName = (item.name || "").toLowerCase();
  const itemDesc = (item.description || "").toLowerCase();
  const itemCategory = (item.category || "").toLowerCase();
  const itemSubcategory = (item.subcategory || "").toLowerCase();
  const itemSupplier = (item.supplier || "").toLowerCase();

  const combinedNormalized = normalizeSearchText(
    `${itemName} ${itemSubcategory} ${itemCategory} ${itemDesc} ${itemSupplier}`
  );

  let totalScore = 0;

  // 1. Прямое точное совпадение всей строки целиком (Джекпот!)
  if (itemName.includes(rawQuery) || itemName.includes(normalizedQuery)) {
    totalScore += 250;
  } else if (combinedNormalized.includes(normalizedQuery)) {
    totalScore += 120;
  }

  // 2. Проверка каждого токена запроса (Все токены должны присутствовать в товаре)
  let matchedTokensCount = 0;

  for (const token of queryTokens) {
    const variants = expandTokenVariants(token, synonymMap);
    let tokenMatched = false;
    let tokenBestWeight = 0;

    for (const v of variants) {
      // Совпадение в названии (самый высокий вес)
      if (itemName.includes(v)) {
        tokenMatched = true;
        tokenBestWeight = Math.max(tokenBestWeight, 60);
      }
      // Совпадение в подкатегории или категории
      else if (itemSubcategory.includes(v) || itemCategory.includes(v)) {
        tokenMatched = true;
        tokenBestWeight = Math.max(tokenBestWeight, 35);
      }
      // Совпадение в характеристиках / описании
      else if (itemDesc.includes(v)) {
        tokenMatched = true;
        tokenBestWeight = Math.max(tokenBestWeight, 30);
      }
      // Совпадение в имени поставщика
      else if (itemSupplier.includes(v)) {
        tokenMatched = true;
        tokenBestWeight = Math.max(tokenBestWeight, 20);
      }
      // Общий текст
      else if (combinedNormalized.includes(v)) {
        tokenMatched = true;
        tokenBestWeight = Math.max(tokenBestWeight, 15);
      }
    }

    // Если точное/синонимичное совпадение не сработало, пробуем мягкий нечеткий поиск (Fuzzy)
    if (!tokenMatched && token.length >= 4) {
      const tokenStem = stemRussianWord(token);
      // Проверяем стемминг в названии
      if (itemName.includes(tokenStem)) {
        tokenMatched = true;
        tokenBestWeight = 25;
      } else {
        // Проверяем расстояние Левенштейна по отдельным словам названия
        const nameWords = itemName.split(/\s+/);
        for (const nw of nameWords) {
          if (nw.length >= 4 && Math.abs(nw.length - token.length) <= 2) {
            const dist = getLevenshteinDistance(nw, token);
            if (dist <= 1 || (token.length >= 7 && dist <= 2)) {
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

  // Если хотя бы один токен запроса не найден, товар не подходит (Строгий multi-token AND)
  if (matchedTokensCount < queryTokens.length) {
    return 0;
  }

  // Дополнительный бонус за наличие фотографии (+5 баллов)
  if (item.imageUrl && item.imageUrl.trim()) {
    totalScore += 5;
  }

  return totalScore;
}
