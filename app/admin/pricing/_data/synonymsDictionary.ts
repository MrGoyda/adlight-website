/**
 * Базовый словарь синонимов, сленга и профессиональных терминов рекламного производства.
 * Используется в smartSearch.ts для интеллектуального поиска материалов и услуг.
 */

export interface SynonymRule {
  id: string;
  target: string;       // Каноническое слово в базе (например: "акрил")
  aliases: string[];    // Что могут вводить менеджеры (например: ["оргстекло", "плекс", "плексиглас", "plexiglas"])
  description?: string; // Человекочитаемое описание
  isBuiltIn?: boolean;  // Предустановленный системный синоним
}

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
    description: "Светодиодные ленты 12V / 24V",
    isBuiltIn: true,
  },
  {
    id: "syn_neon",
    target: "неон",
    aliases: ["гибкий", "флекс", "neon flex", "холодный неон"],
    description: "Гибкий силиконовый неон",
    isBuiltIn: true,
  },
  {
    id: "syn_controller",
    target: "контроллер",
    aliases: ["диммер", "пульт", "регулятор", "контролер", "rgb контроллер"],
    description: "Контроллеры и диммеры",
    isBuiltIn: true,
  },

  // ── 3. Пленки и баннеры ───────────────────────────────────────────
  {
    id: "syn_vinyl_film",
    target: "пленк",
    aliases: [
      "оракал",
      "oracal",
      "самоклейка",
      "винил",
      "ritrama",
      "ритрама",
      "самоклеящаяся",
      "самоклеющаяся",
      "пленка",
      "v-mark",
      "vmark",
      "demer",
      "dmr",
      "olfa",
    ],
    description: "Самоклеящиеся виниловые пленки",
    isBuiltIn: true,
  },
  {
    id: "syn_banner",
    target: "баннер",
    aliases: ["баннерка", "баннерная", "frontlit", "backlit", "бэклит", "фронтлит", "ламинированный", "литой"],
    description: "Баннерные ткани Frontlit / Backlit",
    isBuiltIn: true,
  },
  {
    id: "syn_mesh",
    target: "сетка",
    aliases: ["баннерная сетка", "меш", "mesh"],
    description: "Баннерная сетка",
    isBuiltIn: true,
  },
  {
    id: "syn_mounting_film",
    target: "монтажн",
    aliases: ["монтажка", "монтажная пленка", "трансферная"],
    description: "Монтажная пленка для переноса",
    isBuiltIn: true,
  },

  // ── 4. Клеи, скотчи и метизы ─────────────────────────────────────
  {
    id: "syn_glue_cyan",
    target: "клей",
    aliases: ["космофен", "cosmofen", "секунда", "суперклей", "цианакрилат", "цианоакрилат", "ca12", "ca-12", "trifix", "трификс", "акрификс", "активатор"],
    description: "Клеи цианакрилатные и двухкомпонентные",
    isBuiltIn: true,
  },
  {
    id: "syn_tape",
    target: "скотч",
    aliases: ["двусторонний", "двухсторонний", "клейкая лента", "3m", "3м", "вспененный скотч"],
    description: "Двусторонние скотчи и клейкие ленты",
    isBuiltIn: true,
  },
  {
    id: "syn_eyelets",
    target: "люверс",
    aliases: ["кольца", "люверсы", "кольцо", "люверс 10", "люверс 12"],
    description: "Люверсы для баннеров",
    isBuiltIn: true,
  },
  {
    id: "syn_standoffs",
    target: "держател",
    aliases: ["дистанционеры", "дистанционные", "дистанционники", "держатели табличек"],
    description: "Дистанционные металлические держатели",
    isBuiltIn: true,
  },

  // ── 5. Профили и металл ───────────────────────────────────────────
  {
    id: "syn_profile",
    target: "профил",
    aliases: ["уголок", "труба", "клик", "багет", "алюминиевый профиль", "бокс"],
    description: "Профили алюминиевые и пластиковые",
    isBuiltIn: true,
  },

  // ── 6. Услуги и подрядчики ────────────────────────────────────────
  {
    id: "syn_cnc_milling",
    target: "фрезер",
    aliases: ["чпу", "фрезеровка", "фрезерная резка", "раскрой", "фрез"],
    description: "Фрезерная резка на станках ЧПУ",
    isBuiltIn: true,
  },
  {
    id: "syn_laser_cutting",
    target: "лазер",
    aliases: ["лазерная резка", "лазерка", "гравировка", "гравирование"],
    description: "Лазерная резка и гравировка",
    isBuiltIn: true,
  },
  {
    id: "syn_uv_print",
    target: "печать",
    aliases: ["уф", "uv", "ультрафиолетовая", "интерьерка", "интерьерная", "широкоформатка", "плоттерная"],
    description: "УФ и широкоформатная печать",
    isBuiltIn: true,
  },

  // ── 7. Поставщики и бренды ───────────────────────────────────────
  {
    id: "syn_demer",
    target: "демер",
    aliases: ["demer", "дмер", "дмр"],
    description: "Поставщик Демер",
    isBuiltIn: true,
  },
  {
    id: "syn_signtech",
    target: "signtech",
    aliases: ["сайнтек", "сигнтек", "сайнтекст", "сайнтеч"],
    description: "Поставщик Signtech",
    isBuiltIn: true,
  },

  // ── 8. Цвета и оптика ─────────────────────────────────────────────
  {
    id: "syn_color_white",
    target: "белый",
    aliases: ["молочный", "опал", "white", "белая", "белое", "светорассеивающий", "светорассеивающая"],
    description: "Белый и молочный рассеивающий цвет",
    isBuiltIn: true,
  },
  {
    id: "syn_color_black",
    target: "черный",
    aliases: ["чёрный", "black", "черная", "чёрная", "черное"],
    description: "Черный цвет",
    isBuiltIn: true,
  },
  {
    id: "syn_color_clear",
    target: "прозрачный",
    aliases: ["прозрач", "прозрачная", "прозрачное", "clear"],
    description: "Прозрачный акрил / стекло",
    isBuiltIn: true,
  },
];

// ── Карта переключения раскладки клавиатуры (QWERTY ⇄ ЙЦУКЕН) ────────
export const EN_TO_RU_KEYBOARD: Record<string, string> = {
  q: "й", w: "ц", e: "у", r: "к", t: "е", y: "н", u: "г", i: "ш", o: "щ", p: "з", "[": "х", "]": "ъ",
  a: "ф", s: "ы", d: "в", f: "а", g: "п", h: "р", j: "о", k: "л", l: "д", ";": "ж", "'": "э",
  z: "я", x: "ч", c: "с", v: "м", b: "и", n: "т", m: "ь", ",": "б", ".": "ю",
};

export const RU_TO_EN_KEYBOARD: Record<string, string> = Object.entries(EN_TO_RU_KEYBOARD).reduce(
  (acc, [en, ru]) => {
    acc[ru] = en;
    return acc;
  },
  {} as Record<string, string>
);
