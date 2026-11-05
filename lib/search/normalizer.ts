/**
 * Поисковый нормализатор текста:
 * - Приведение к нижнему регистру и нормализация буквы "ё" -> "е"
 * - Автовыравнивание единиц измерения (3 мм = 3мм, 100 вт = 100w, 12 в = 12v)
 * - Размеры листовых материалов и форматов (2.05х3.05 = 2.05x3.05)
 * - Двусторонняя конвертация раскладки клавиатуры (QWERTY ⇄ ЙЦУКЕН)
 * - Морфологический стемминг русских окончаний
 * - Мягкое расстояние Левенштейна для исправления опечаток
 */

export const EN_TO_RU_KEYBOARD: Record<string, string> = {
  q: "й", w: "ц", e: "у", r: "к", t: "е", y: "н", u: "г", i: "ш", o: "щ", p: "з",
  "[": "х", "]": "ъ", a: "ф", s: "ы", d: "в", f: "а", g: "п", h: "р", j: "о",
  k: "л", l: "д", ";": "ж", "'": "э", z: "я", x: "ч", c: "с", v: "м", b: "и",
  n: "т", m: "ь", ",": "б", ".": "ю", "/": ".", "`": "ё",
};

export const RU_TO_EN_KEYBOARD: Record<string, string> = {
  й: "q", ц: "w", у: "e", к: "r", е: "t", н: "y", г: "u", ш: "i", щ: "o", з: "p",
  х: "[", ъ: "]", ф: "a", ы: "s", в: "d", а: "f", п: "g", р: "h", о: "j",
  л: "k", д: "l", ж: ";", э: "'", я: "z", ч: "x", с: "c", м: "v", и: "b",
  т: "n", ь: "m", б: ",", ю: ".", ё: "`",
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

// Быстрый LRU-кэш для нормализации текста (избегает 40 000+ запусков regex при поиске по каталогу)
const NORMALIZE_CACHE_LIMIT = 5000;
const normalizeCache = new Map<string, string>();

/**
 * Нормализация текста: регистр, буква ё, объединение единиц измерения, очистка пунктуации
 */
export function normalizeSearchText(text: string): string {
  if (!text) return "";
  const cached = normalizeCache.get(text);
  if (cached !== undefined) return cached;

  const result = text
    .toLowerCase()
    .replace(/ё/g, "е")
    // Замена русской буквы "х" и звездочки в размерах на латинскую "x" (2.05х3.05 -> 2.05x3.05)
    .replace(/(\d+)\s*[хx*]\s*(\d+)/gi, "$1x$2")
    // Приведение мощностей и напряжений (100 вт -> 100w, 12 в -> 12v)
    .replace(/(\d+)\s*(?:вт|w|ватт|watt)(?!\w)/gi, "$1w")
    .replace(/(\d+)\s*(?:в|v|volt|вольт)(?!\w)/gi, "$1v")
    // Приведение толщин и длин (3 мм -> 3mm, 10 см -> 10cm, 5 м -> 5m)
    .replace(/(\d+)\s*(?:мм|mm)(?!\w)/gi, "$1mm")
    .replace(/(\d+)\s*(?:см|cm)(?!\w)/gi, "$1cm")
    .replace(/(\d+)\s*(?:м|m)(?!\w)/gi, "$1m")
    // Замена дефисов, скобок и спецсимволов на пробелы
    .replace(/[«»""''()[\]{}_,;!?/\\+-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (normalizeCache.size >= NORMALIZE_CACHE_LIMIT) {
    const firstKey = normalizeCache.keys().next().value;
    if (firstKey) normalizeCache.delete(firstKey);
  }
  normalizeCache.set(text, result);
  return result;
}

const stemCache = new Map<string, string>();

/**
 * Простое отсечение типичных русских окончаний для поиска по корню (Стемминг)
 */
export function stemRussianWord(word: string): string {
  if (word.length <= 3) return word;
  const cached = stemCache.get(word);
  if (cached !== undefined) return cached;

  const result = word
    .replace(/(овыми|ового|овому|овых|ными|ного|ному|ных|лями|тель|вать|ение|ения)$/i, "")
    .replace(/(овый|овая|овое|овые|ный|ная|ное|ные|ний|няя|нее|ние)$/i, "")
    .replace(/(ами|ями|ов|ев|ей|ом|ем|ам|ям|ах|ях|ую|юю|ой|ей|ою|ею)$/i, "")
    .replace(/(а|е|и|й|о|у|ы|ь|я)$/i, "");

  if (stemCache.size >= 3000) {
    const firstKey = stemCache.keys().next().value;
    if (firstKey) stemCache.delete(firstKey);
  }
  stemCache.set(word, result);
  return result;
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
