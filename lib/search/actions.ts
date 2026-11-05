"use server";

/**
 * Server Actions для обучаемого поискового ядра:
 * - Логирование запросов и аналитика нулевых результатов
 * - Обучение на кликах (Click-Through Feedback)
 * - Управление динамическими синонимами из БД
 */

import { prisma } from "@/lib/prisma";
import { normalizeSearchText } from "./normalizer";
import { BUILT_IN_SYNONYM_RULES } from "./synonyms";
import { SynonymRule } from "./types";
import { revalidatePath } from "next/cache";

/**
 * Фиксация поискового запроса в аналитике (пожарный вызов, не блокирует UI)
 */
export async function logSearchQueryAction(
  query: string,
  resultsCount: number,
  context: string = "global"
) {
  if (!query || !query.trim() || query.trim().length < 2) return;

  const normalized = normalizeSearchText(query);

  try {
    await prisma.searchQueryLog.create({
      data: {
        query: query.trim(),
        normalized,
        context,
        resultsCount,
      },
    });
  } catch (error) {
    // Ошибки логирования не должны ломать работу пользователя
    console.error("[SearchEngine] Failed to log query:", error);
  }
}

/**
 * Обучение на выборе пользователя:
 * Фиксирует, какой товар/материал выбрал менеджер или клиент по данному запросу.
 * При следующих поисках этот товар получает преимущество в выдаче!
 */
export async function recordSearchSelectionAction({
  query,
  entityId,
  entityType = "supplier_price",
  selectedTitle,
  context = "calculator",
}: {
  query: string;
  entityId: string;
  entityType?: string;
  selectedTitle?: string;
  context?: string;
}) {
  if (!query || !query.trim() || !entityId) return;

  const queryNorm = normalizeSearchText(query);
  if (!queryNorm) return;

  try {
    // 1. Инкремент веса пары (запрос -> выбранная сущность)
    await prisma.searchClickWeight.upsert({
      where: {
        queryNorm_entityId: {
          queryNorm,
          entityId,
        },
      },
      update: {
        clickCount: { increment: 1 },
      },
      create: {
        queryNorm,
        entityType,
        entityId,
        clickCount: 1,
      },
    });

    // 2. Логирование выбора в SearchQueryLog
    await prisma.searchQueryLog.create({
      data: {
        query: query.trim(),
        normalized: queryNorm,
        context,
        resultsCount: 1,
        selectedId: entityId,
        selectedTitle: selectedTitle || null,
      },
    });
  } catch (error) {
    console.error("[SearchEngine] Failed to record selection:", error);
  }
}

/**
 * Получение карты обученных весов (entityId -> вес кликов) для текущего запроса
 */
export async function getClickWeightsForQueryAction(query: string): Promise<Record<string, number>> {
  if (!query || !query.trim()) return {};

  const queryNorm = normalizeSearchText(query);
  if (!queryNorm) return {};

  try {
    const weights = await prisma.searchClickWeight.findMany({
      where: {
        queryNorm,
      },
      select: {
        entityId: true,
        clickCount: true,
      },
    });

    const result: Record<string, number> = {};
    for (const w of weights) {
      result[w.entityId] = w.clickCount;
    }
    return result;
  } catch (error) {
    console.error("[SearchEngine] Failed to fetch click weights:", error);
    return {};
  }
}

/**
 * Получение всех синонимов (встроенные + из базы данных)
 */
export async function getSearchSynonymsAction(): Promise<SynonymRule[]> {
  try {
    const dbSynonyms = await prisma.searchSynonymRule.findMany({
      where: { isActive: true },
      orderBy: { updatedAt: "desc" },
    });

    const dbMap = new Map<string, SynonymRule>();
    for (const item of dbSynonyms) {
      dbMap.set(item.word.toLowerCase(), {
        id: item.id,
        target: item.word,
        aliases: item.synonyms,
        description: item.description || undefined,
        isBuiltIn: false,
      });
    }

    // Объединяем: если в БД есть переопределение, берем его, иначе встроенное
    const combined: SynonymRule[] = [];
    const processedWords = new Set<string>();

    for (const [word, rule] of dbMap.entries()) {
      combined.push(rule);
      processedWords.add(word);
    }

    for (const builtIn of BUILT_IN_SYNONYM_RULES) {
      const targetLower = builtIn.target.toLowerCase();
      if (!processedWords.has(targetLower)) {
        combined.push(builtIn);
      }
    }

    return combined;
  } catch (error) {
    console.error("[SearchEngine] Failed to fetch synonyms from DB, fallback to built-in:", error);
    return BUILT_IN_SYNONYM_RULES;
  }
}

/**
 * Добавление или обновление синонима в БД
 */
export async function saveSearchSynonymAction(data: {
  word: string;
  synonyms: string[];
  description?: string;
}) {
  const cleanWord = normalizeSearchText(data.word);
  if (!cleanWord) throw new Error("Укажите ключевое слово");

  const cleanAliases = data.synonyms
    .map((s) => normalizeSearchText(s))
    .filter((s) => s.length > 0 && s !== cleanWord);

  try {
    const result = await prisma.searchSynonymRule.upsert({
      where: { word: cleanWord },
      update: {
        synonyms: cleanAliases,
        description: data.description || null,
        isActive: true,
      },
      create: {
        word: cleanWord,
        synonyms: cleanAliases,
        description: data.description || null,
        isActive: true,
      },
    });

    revalidatePath("/admin/pricing");
    return { success: true, rule: result };
  } catch (error) {
    console.error("[SearchEngine] Failed to save synonym:", error);
    return { success: false, error: "Ошибка сохранения синонима" };
  }
}

/**
 * Аналитика поисковых запросов для дашборда администратора:
 * - Топ запросов с нулевыми результатами (где клиенты/менеджеры не нашли то, что искали)
 * - Самые частые запросы
 * - Топ выбранных позиций
 */
export async function getSearchAnalyticsAction() {
  try {
    // 1. Нулевые запросы (что искали, но ничего не найдено)
    const zeroResults = await prisma.searchQueryLog.groupBy({
      by: ["normalized"],
      where: {
        resultsCount: 0,
      },
      _count: {
        normalized: true,
      },
      orderBy: {
        _count: {
          normalized: "desc",
        },
      },
      take: 20,
    });

    // 2. Самые популярные запросы
    const popularQueries = await prisma.searchQueryLog.groupBy({
      by: ["normalized"],
      _count: {
        normalized: true,
      },
      orderBy: {
        _count: {
          normalized: "desc",
        },
      },
      take: 20,
    });

    // 3. Последние запросы
    const recentQueries = await prisma.searchQueryLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 30,
      select: {
        id: true,
        query: true,
        normalized: true,
        context: true,
        resultsCount: true,
        selectedTitle: true,
        createdAt: true,
      },
    });

    return {
      zeroResults: zeroResults.map((r) => ({
        query: r.normalized,
        count: r._count.normalized,
      })),
      popularQueries: popularQueries.map((r) => ({
        query: r.normalized,
        count: r._count.normalized,
      })),
      recentQueries,
    };
  } catch (error) {
    console.error("[SearchEngine] Failed to get analytics:", error);
    return { zeroResults: [], popularQueries: [], recentQueries: [] };
  }
}
