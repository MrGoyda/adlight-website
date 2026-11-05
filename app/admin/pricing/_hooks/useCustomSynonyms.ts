"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  SynonymRule,
  BUILT_IN_SYNONYM_RULES,
} from "../_data/synonymsDictionary";
import { buildSynonymLookup } from "../_lib/smartSearch";
import { triggerHaptic } from "@/lib/haptics";

const CUSTOM_SYNONYMS_KEY = "adlight_custom_synonyms_v2";
const ZERO_QUERIES_KEY = "adlight_zero_queries_v2";

export interface ZeroResultQuery {
  query: string;
  count: number;
  lastSearchedAt: string; // ISO
}

export function useCustomSynonyms() {
  const [customRules, setCustomRules] = useState<SynonymRule[]>([]);
  const [zeroQueries, setZeroQueries] = useState<ZeroResultQuery[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Загрузка из localStorage
  useEffect(() => {
    try {
      const savedSynonyms = localStorage.getItem(CUSTOM_SYNONYMS_KEY);
      if (savedSynonyms) {
        const parsed = JSON.parse(savedSynonyms);
        if (Array.isArray(parsed)) {
          setCustomRules(parsed);
        }
      }

      const savedZeros = localStorage.getItem(ZERO_QUERIES_KEY);
      if (savedZeros) {
        const parsed = JSON.parse(savedZeros);
        if (Array.isArray(parsed)) {
          setZeroQueries(parsed);
        }
      }
    } catch (e) {
      console.warn("[Synonyms] Ошибка чтения из localStorage:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Сохранение кастомных правил
  const saveCustomRules = useCallback((rules: SynonymRule[]) => {
    setCustomRules(rules);
    try {
      localStorage.setItem(CUSTOM_SYNONYMS_KEY, JSON.stringify(rules));
    } catch (e) {
      console.error("[Synonyms] Ошибка сохранения:", e);
    }
  }, []);

  // Сохранение пустых запросов
  const saveZeroQueries = useCallback((queries: ZeroResultQuery[]) => {
    setZeroQueries(queries);
    try {
      localStorage.setItem(ZERO_QUERIES_KEY, JSON.stringify(queries));
    } catch (e) {
      console.error("[ZeroQueries] Ошибка сохранения:", e);
    }
  }, []);

  // 2. Добавление нового правила синонима
  const addCustomSynonym = useCallback(
    (target: string, aliases: string[], description?: string) => {
      const cleanTarget = target.trim().toLowerCase();
      const cleanAliases = aliases
        .map((a) => a.trim().toLowerCase())
        .filter((a) => a && a !== cleanTarget);

      if (!cleanTarget || cleanAliases.length === 0) return false;

      const newRule: SynonymRule = {
        id: `user_syn_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        target: cleanTarget,
        aliases: cleanAliases,
        description: description || `Привязка к «${cleanTarget}»`,
        isBuiltIn: false,
      };

      const updated = [newRule, ...customRules];
      saveCustomRules(updated);

      // Если этот синоним был в списке пустых запросов, удаляем его оттуда
      const remainingZeros = zeroQueries.filter(
        (z) => !cleanAliases.includes(z.query.toLowerCase()) && z.query.toLowerCase() !== cleanTarget
      );
      if (remainingZeros.length !== zeroQueries.length) {
        saveZeroQueries(remainingZeros);
      }

      triggerHaptic("medium");
      return true;
    },
    [customRules, zeroQueries, saveCustomRules, saveZeroQueries]
  );

  // 3. Удаление кастомного правила
  const deleteCustomSynonym = useCallback(
    (ruleId: string) => {
      const updated = customRules.filter((r) => r.id !== ruleId);
      saveCustomRules(updated);
      triggerHaptic("error");
      return true;
    },
    [customRules, saveCustomRules]
  );

  // 4. Фиксация запроса с 0 результатов (для аналитики и дообучения)
  const logZeroResultQuery = useCallback(
    (query: string) => {
      const trimmed = query.trim().toLowerCase();
      if (!trimmed || trimmed.length < 2) return;

      setZeroQueries((prev) => {
        const existingIndex = prev.findIndex((z) => z.query.toLowerCase() === trimmed);
        let next: ZeroResultQuery[];

        if (existingIndex >= 0) {
          next = [...prev];
          next[existingIndex] = {
            ...next[existingIndex],
            count: next[existingIndex].count + 1,
            lastSearchedAt: new Date().toISOString(),
          };
        } else {
          next = [
            { query: trimmed, count: 1, lastSearchedAt: new Date().toISOString() },
            ...prev.slice(0, 49), // держим максимум 50 недавних запросов
          ];
        }

        try {
          localStorage.setItem(ZERO_QUERIES_KEY, JSON.stringify(next));
        } catch {}

        return next;
      });
    },
    []
  );

  // 5. Очистка списка запросов с 0 результатов
  const clearZeroResultQueries = useCallback(() => {
    saveZeroQueries([]);
    triggerHaptic("medium");
  }, [saveZeroQueries]);

  // 6. Удаление одного конкретного пустого запроса
  const removeZeroResultQuery = useCallback(
    (query: string) => {
      const updated = zeroQueries.filter((z) => z.query !== query);
      saveZeroQueries(updated);
    },
    [zeroQueries, saveZeroQueries]
  );

  // 7. Сброс к заводским правилам
  const resetSynonymsToDefaults = useCallback(() => {
    try {
      localStorage.removeItem(CUSTOM_SYNONYMS_KEY);
      localStorage.removeItem(ZERO_QUERIES_KEY);
    } catch {}
    setCustomRules([]);
    setZeroQueries([]);
    triggerHaptic("warning");
  }, []);

  // 8. Объединенный список всех правил
  const allRules = useMemo(() => {
    return [...customRules, ...BUILT_IN_SYNONYM_RULES];
  }, [customRules]);

  // 9. Скомпилированная быстрая карта поиска
  const synonymMap = useMemo(() => {
    return buildSynonymLookup(allRules);
  }, [allRules]);

  return {
    isLoaded,
    customRules,
    builtInRules: BUILT_IN_SYNONYM_RULES,
    allRules,
    zeroQueries,
    synonymMap,
    addCustomSynonym,
    deleteCustomSynonym,
    logZeroResultQuery,
    removeZeroResultQuery,
    clearZeroResultQueries,
    resetSynonymsToDefaults,
  };
}
