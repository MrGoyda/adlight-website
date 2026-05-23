// dictionaries/design-code.ts

export interface DesignCodeWay {
  title: string;
  desc: string;
  example: string;
  badge: string;
  term: string;
  iconName: "Languages" | "FileText" | "Copyright";
}

export interface DesignCodeRule {
  id: number;
  badge: string;
  title: string;
  iconName: "MapPin" | "Layout" | "Ruler";
  items: string[];
}

export interface DesignCodeBan {
  title: string;
  desc: string;
}

export const DESIGN_CODE_WAYS: DesignCodeWay[] = [
  {
    title: "Перевод на казахский",
    desc: "Прямой перевод названия или транслитерация. Самый простой и быстрый способ согласования.",
    example: "Пример: \"Express repair\" → \"Жылдам жөндеу\"",
    badge: "Для ИП и малого бизнеса",
    term: "Срок: 3-5 дней",
    iconName: "Languages"
  },
  {
    title: "По документам",
    desc: "Использование названия точь-в-точь как в свидетельстве о регистрации ТОО или ИП.",
    example: "Пример: ТОО \"Express repair\"",
    badge: "Без товарного знака",
    term: "Срок: 3-5 дней",
    iconName: "FileText"
  },
  {
    title: "Товарный знак (ТЗ)",
    desc: "Регистрация бренда в Комитете интеллектуальной собственности. Дает право писать на любом языке.",
    example: "Пример: Зарегистрированный бренд \"Express repair\"",
    badge: "Защита бренда",
    term: "Срок: 6-7 месяцев",
    iconName: "Copyright"
  }
];

export const DESIGN_CODE_RULES: DesignCodeRule[] = [
  {
    id: 1,
    badge: "ПРАВИЛО 1",
    title: "Место размещения",
    iconName: "MapPin",
    items: [
      "Информационное поле: Строго в отведенном паспортом фасада месте.",
      "Входная группа: Над входом или сбоку от него."
    ]
  },
  {
    id: 2,
    badge: "ПРАВИЛО 2",
    title: "Дизайн и Технологии",
    iconName: "Layout",
    items: [
      "Разрешено: Только отдельные объемные или плоские буквы без подложки.",
      "Запрещено: Баннерная ткань, сплошные световые короба на фасаде здания."
    ]
  },
  {
    id: 3,
    badge: "ПРАВИЛО 3",
    title: "Допустимые габариты",
    iconName: "Ruler",
    items: [
      "1–2 этажа: Высота букв до 0,80 м",
      "3–5 этажей: Высота букв до 1,20 м",
      "6–9 этажей: Высота букв до 1,80 м",
      "10+ этажей: Высота букв до 2,20 м"
    ]
  }
];

export const DESIGN_CODE_BANS: DesignCodeBan[] = [
  { title: "Вертикальное размещение", desc: "Буквы нельзя писать столбиком (сверху вниз)." },
  { title: "Перекрытие архитектуры", desc: "Запрещено закрывать окна, витражи, декор и колонны." },
  { title: "Балконы и козырьки", desc: "Нельзя вешать конструкции на ограждениях балконов." },
  { title: "Выступ за фасад", desc: "Конструкции не должны выступать за плоскость фасада." },
  { title: "Жилые подъезды", desc: "Запрещено размещение вывесок на входах в подъезды." },
  { title: "Без разрешения", desc: "Размещение без согласия собственников здания запрещено." }
];
