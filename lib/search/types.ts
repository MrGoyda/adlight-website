/**
 * Unified Search Engine Types
 * Описывает структуры данных для универсального обучаемого поиска по всей CRM и будущему сайту.
 */

export interface SynonymRule {
  id: string;
  target: string;       // Каноническое слово/термин (например: "акрил")
  aliases: string[];    // Синонимы и сленг (например: ["оргстекло", "плекс", "плексиглас"])
  description?: string; // Описание термина
  isBuiltIn?: boolean;  // Предустановленный словарь
}

/**
 * Универсальный документ для индексации и поиска
 */
export interface SearchDocument {
  id: string;
  title: string;              // Главное название (напр. "Акрил молочный 3мм")
  subtitle?: string | null;   // Подзаголовок (напр. "Поставщик: Демер" или Телефон)
  category?: string | null;   // Основная категория ("Листовые пластики")
  subcategory?: string | null;// Подкатегория ("Акриловое стекло")
  description?: string | null;// Доп. описание, артикул, технические детали
  tags?: string[];            // Произвольные метки/теги
  boost?: number;             // Статический буст (например, +50 для избранных)
  metadata?: Record<string, unknown>;
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

export interface SearchMatchResult<T = unknown> {
  item: T;
  score: number;
  document: SearchDocument;
}

export interface SearchOptions {
  limit?: number;
  minScore?: number;
  context?: "pricing" | "calculator" | "leads" | "warehouse" | "site_catalog" | "global";
  customWeights?: Map<string, number>; // Динамические веса из истории кликов (entityId -> bonus)
}
