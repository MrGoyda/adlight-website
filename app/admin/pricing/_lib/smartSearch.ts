/**
 * Re-export и адаптер поискового движка из централизованного ядра @/lib/search.
 * Сохраняет 100% обратную совместимость для всех компонентов pricing.
 */

import { SupplierPriceItem } from "../_types/pricingTypes";
import {
  scoreSearchDocument,
  SearchDocument,
  PreparedSearchQuery,
} from "@/lib/search";

export * from "@/lib/search";

export interface MatchScoreResult {
  item: SupplierPriceItem;
  score: number;
}

/**
 * Подсчет релевантности для SupplierPriceItem через универсальный движок @/lib/search
 */
export function calculatePreparedRelevance(
  item: SupplierPriceItem,
  prepared: PreparedSearchQuery,
  customWeights?: Map<string, number>
): number {
  const doc: SearchDocument = {
    id: item.id,
    title: item.name,
    subtitle: item.supplier,
    category: item.category,
    subcategory: item.subcategory,
    description: item.description,
    boost: item.isFavorite ? 50 : 0,
  };

  return scoreSearchDocument(doc, prepared, customWeights);
}
