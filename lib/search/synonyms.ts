/**
 * Базовый словарь синонимов, сленга и профессиональных терминов рекламного производства.
 * Служит ядром терминологии как для внутренней CRM/калькулятора, так и для будущего клиентского сайта.
 */

import { SynonymRule } from "./types";
import { convertKeyboardLayout, stemRussianWord } from "./normalizer";

export const TRANSLIT_PAIRS: Record<string, string> = {
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

export const BUILT_IN_SYNONYM_RULES: SynonymRule[] = [
  // ── 1. Листовые материалы ──────────────────────────────────────────
  {
    id: "syn_acrylic",
    target: "акрил",
    aliases: ["оргстекло", "плекс", "плексиглас", "plexiglas", "плексигласс", "орг стекло", "акриловый", "акриловое", "акриловая"],
    description: "Акрил и органическое стекло",
    isBuiltIn: true,
  },
  {
    id: "syn_acp",
    target: "акп",
    aliases: ["алюкобонд", "композит", "композитная", "дибонд", "alucobond", "алюкобонда", "алюминкомпозит", "компик"],
    description: "Алюминиевые композитные панели (АКП)",
    isBuiltIn: true,
  },
  {
    id: "syn_pvc",
    target: "пвх",
    aliases: ["пластик", "вспененный", "пенопластик", "пенокартон", "simona", "форекс", "forex"],
    description: "Вспененный листовой ПВХ",
    isBuiltIn: true,
  },
  {
    id: "syn_polycarbonate",
    target: "поликарбонат",
    aliases: ["карбонат", "сотовый", "монолитный", "мпк", "спк"],
    description: "Монолитный и сотовый поликарбонат",
    isBuiltIn: true,
  },
  {
    id: "syn_polystyrene",
    target: "полистирол",
    aliases: ["стирол", "hips", "хипс"],
    description: "Листовой полистирол",
    isBuiltIn: true,
  },

  // ── 2. Светотехника и электрика ───────────────────────────────────
  {
    id: "syn_power_supply",
    target: "питания",
    aliases: ["бп", "блок", "транс", "трансформатор", "адаптер", "драйвер", "источник", "meanwell", "mean well"],
    description: "Блоки питания и трансформаторы",
    isBuiltIn: true,
  },
  {
    id: "syn_led_module",
    target: "модул",
    aliases: ["диод", "диоды", "модули", "модуль", "линзованные", "линза", "линзы", "подсветка", "кластер", "светодиод", "светодиоды"],
    description: "Светодиодные линзованные модули",
    isBuiltIn: true,
  },
  {
    id: "syn_led_strip",
    target: "лент",
    aliases: ["лента", "полоса", "стрип", "led strip"],
    description: "Светодиодная лента",
    isBuiltIn: true,
  },
  {
    id: "syn_neon",
    target: "неон",
    aliases: ["гибкий", "flex", "флекс", "neon"],
    description: "Гибкий силиконовый LED-неон",
    isBuiltIn: true,
  },
  {
    id: "syn_wire",
    target: "провод",
    aliases: ["кабель", "шнур", "пвс", "шввп", "ввг", "проводка"],
    description: "Электрические провода и кабели",
    isBuiltIn: true,
  },

  // ── 3. Плёнки и самоклейка ─────────────────────────────────────────
  {
    id: "syn_oracal",
    target: "пленка",
    aliases: ["плёнка", "самоклейка", "винил", "оракал", "oracal", "orajet", "ораджет", "автовинил", "перфорированная", "транслюцентная"],
    description: "Самоклеящиеся пленки",
    isBuiltIn: true,
  },
  {
    id: "syn_banner",
    target: "баннер",
    aliases: ["банер", "баннерная", "винил баннер", "ламинированный", "литой", "сетка"],
    description: "Баннерная ткань и сетка",
    isBuiltIn: true,
  },

  // ── 4. Профили и металл ───────────────────────────────────────────
  {
    id: "syn_profile",
    target: "профиль",
    aliases: ["профиль", "уголок", "труба", "квадратная", "прямоугольная", "алюминиевый", "стальной", "кваттро", "nelsen", "нельсон"],
    description: "Алюминиевые и стальные профили",
    isBuiltIn: true,
  },

  // ── 5. Клеи, химия и расходники ──────────────────────────────────
  {
    id: "syn_glue",
    target: "клей",
    aliases: ["космофен", "cosmofen", "цианакрилат", "секундный", "суперклей", "дихлорэтан", "акфикс", "akfix", "акрификс", "acrifix", "герметик", "силикон"],
    description: "Клеи для рекламы и пластика",
    isBuiltIn: true,
  },
  {
    id: "syn_scotch",
    target: "скотч",
    aliases: ["клейкая лента", "двухсторонний", "3m", "акриловый скотч", "вспененный скотч"],
    description: "Монтажные и двухсторонние скотчи",
    isBuiltIn: true,
  },

  // ── 6. Поставщики рекламных материалов ─────────────────────────────
  {
    id: "syn_supplier_demer",
    target: "демер",
    aliases: ["demer", "дэмер", "демир"],
    description: "Поставщик Демер",
    isBuiltIn: true,
  },
  {
    id: "syn_supplier_signtech",
    target: "сайнтек",
    aliases: ["signtech", "сигнтек", "сайнтек", "сайн тек", "sign tech"],
    description: "Поставщик Signtech / Сайнтек",
    isBuiltIn: true,
  },

  // ── 7. Цвета и оптические свойства ─────────────────────────────────
  {
    id: "syn_color_white",
    target: "белый",
    aliases: ["молочный", "опал", "белоснежный", "матовый белый", "white"],
    description: "Белый / молочный цвет",
    isBuiltIn: true,
  },
  {
    id: "syn_color_black",
    target: "черный",
    aliases: ["чёрный", "black", "матовый черный", "глянцевый черный"],
    description: "Черный цвет",
    isBuiltIn: true,
  },
  {
    id: "syn_color_clear",
    target: "прозрачный",
    aliases: ["бесцветный", "clear", "прозрачка"],
    description: "Прозрачный материал",
    isBuiltIn: true,
  },
];

/**
 * Построение быстрого хеш-словаря синонимов
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
export function expandTokenVariants(
  token: string,
  synonymMap: Map<string, string[]> = new Map()
): string[] {
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
