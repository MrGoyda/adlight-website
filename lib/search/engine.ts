/**
 * Unified Search Engine Core
 * Центральный универсальный движок поиска и ранжирования с поддержкой весов, синонимов и обучаемости.
 */

import {
  SearchDocument,
  SearchMatchResult,
  SearchOptions,
  PreparedSearchQuery,
  PreparedQueryToken,
} from "./types";
import { normalizeSearchText, getLevenshteinDistance, stemRussianWord } from "./normalizer";
import { expandTokenVariants } from "./synonyms";

/**
 * Подготовка и токенизация поискового запроса
 */
export function prepareSearchQuery(
  query: string,
  synonymMap: Map<string, string[]> = new Map()
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
 * Подсчет релевантности универсального документа SearchDocument
 */
export function scoreSearchDocument(
  doc: SearchDocument,
  prepared: PreparedSearchQuery,
  customWeights?: Map<string, number>
): number {
  const { raw, normalized, tokens } = prepared;

  const docTitle = normalizeSearchText(doc.title || "");
  const docSubtitle = normalizeSearchText(doc.subtitle || "");
  const docCategory = normalizeSearchText(doc.category || "");
  const docSubcategory = normalizeSearchText(doc.subcategory || "");
  const docDesc = normalizeSearchText(doc.description || "");
  const docTags = (doc.tags || []).map((t) => normalizeSearchText(t)).join(" ");

  const fullText = `${docTitle} ${docSubtitle} ${docCategory} ${docSubcategory} ${docTags} ${docDesc}`;

  let totalScore = doc.boost || 0;

  // Обучаемый бонус из истории кликов/выборов пользователей
  if (customWeights && customWeights.has(doc.id)) {
    const clickBonus = customWeights.get(doc.id) || 0;
    // Логарифмический или ступенчатый буст за частые выборы
    totalScore += Math.min(clickBonus * 30, 200);
  }

  // 1. Прямое совпадение полной фразы
  if (fullText.includes(raw) || fullText.includes(normalized)) {
    totalScore += 250;
    if (docTitle.includes(raw) || docTitle.includes(normalized)) {
      totalScore += 100; // Дополнительный бонус за совпадение именно в заголовке
    }
  }

  // 2. Проверка каждого токена
  let matchedTokensCount = 0;

  for (let i = 0; i < tokens.length; i++) {
    const { token, variants, stem } = tokens[i];
    let tokenMatched = false;
    let tokenBestWeight = 0;

    for (let j = 0; j < variants.length; j++) {
      const v = variants[j];
      if (docTitle.includes(v)) {
        tokenMatched = true;
        tokenBestWeight = 70;
        break;
      }
      if (docSubtitle.includes(v)) {
        tokenMatched = true;
        tokenBestWeight = Math.max(tokenBestWeight, 50);
        break;
      }
      if (docCategory.includes(v) || docSubcategory.includes(v)) {
        tokenMatched = true;
        tokenBestWeight = Math.max(tokenBestWeight, 40);
      } else if (docTags.includes(v)) {
        tokenMatched = true;
        tokenBestWeight = Math.max(tokenBestWeight, 35);
      } else if (docDesc.includes(v)) {
        tokenMatched = true;
        tokenBestWeight = Math.max(tokenBestWeight, 25);
      }
    }

    // Проверка стемминга и опечаток
    if (!tokenMatched && token.length >= 3) {
      if (docTitle.includes(stem) || docSubtitle.includes(stem)) {
        tokenMatched = true;
        tokenBestWeight = 25;
      } else {
        const words = docTitle.split(/\s+/);
        for (let k = 0; k < words.length; k++) {
          const w = words[k];
          if (w.length >= 3 && Math.abs(w.length - token.length) <= 2) {
            const dist = getLevenshteinDistance(w, token);
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
    return totalScore + (matchedTokensCount * 30);
  }

  // Длинный запрос (3+ слова): допускаем совпадение большинства слов
  if (tokens.length >= 3 && matchedTokensCount >= tokens.length - 1) {
    return totalScore;
  }

  return 0;
}

/**
 * Высокоуровневый универсальный поиск по любой коллекции объектов T
 */
export function searchCollection<T>(
  items: T[],
  toDocument: (item: T) => SearchDocument,
  query: string,
  options: SearchOptions = {},
  synonymMap: Map<string, string[]> = new Map()
): SearchMatchResult<T>[] {
  const prepared = prepareSearchQuery(query, synonymMap);
  if (!prepared) {
    return items.map((item) => ({
      item,
      score: 0,
      document: toDocument(item),
    }));
  }

  const results: SearchMatchResult<T>[] = [];
  const minScore = options.minScore ?? 1;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const doc = toDocument(item);
    const score = scoreSearchDocument(doc, prepared, options.customWeights);

    if (score >= minScore) {
      results.push({ item, score, document: doc });
    }
  }

  // Сортировка по убыванию релевантности
  results.sort((a, b) => b.score - a.score);

  if (options.limit && options.limit > 0) {
    return results.slice(0, options.limit);
  }

  return results;
}

/**
 * Быстрый булев матчер для inline-поиска (таблицы, быстрые полки, выпадающие списки)
 */
export function matchSearchQuery(
  item: {
    name: string;
    supplier?: string | null;
    category?: string | null;
    subcategory?: string | null;
    description?: string | null;
  },
  query: string,
  synonymMap: Map<string, string[]> = new Map()
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
    const variants = expandTokenVariants(token, synonymMap);
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
