// dictionaries/services/volume-letters.ts

export interface VolumeLetterTechItem {
  id: number;
  slug: string;
  title: string;
  description: string;
  price: string;
  images: { day: string; night: string };
  badge?: string;
}

export const VOLUME_LETTERS_CATALOG: VolumeLetterTechItem[] = [
  {
    id: 1,
    slug: 'face-lit',
    title: 'Световое лицо', 
    description: 'Классика. Самый популярный выбор. Светится только лицевая часть, борта в цвет фасада.',
    price: "от 550 ₸/см",
    images: { day: '/images/letters/face-lit-day.webp', night: '/images/letters/face-lit-night.webp' },
    badge: "Хит продаж"
  },
  {
    id: 2,
    slug: 'full-lit',
    title: 'Полное свечение',
    description: 'Эффект «леденца». Буква светится целиком (лицо + борта). Максимальный угол обзора 360°.',
    price: "от 850 ₸/см",
    images: { day: '/images/letters/full-lit-day.webp', night: '/images/letters/full-lit-night.webp' },
    badge: "Premium"
  },
  {
    id: 3,
    slug: 'back-lit',
    title: 'Контражур',
    description: 'Эффект парения. Свет направлен на стену, создавая мягкий ореол вокруг темной буквы.',
    price: "от 650 ₸/см",
    images: { day: '/images/letters/back-lit-day.webp', night: '/images/letters/back-lit-night.webp' },
    badge: "Стиль"
  },
  {
    id: 4,
    slug: 'combo-lit',
    title: 'Комбо (Лицо + Бэк)',
    description: 'Двойной удар. Читаемость лицевого свечения + премиальный ореол контражура.',
    price: "от 950 ₸/см",
    images: { day: '/images/letters/combo-lit-day.webp', night: '/images/letters/combo-lit-night.webp' },
    badge: "VIP"
  },
  {
    id: 5,
    slug: 'side-lit',
    title: 'Светятся борта',
    description: 'Инверсия. Лицо темное, а контур (борт) светится. Строгий, архитектурный стиль.',
    price: "от 700 ₸/см",
    images: { day: '/images/letters/side-lit-day.webp', night: '/images/letters/side-lit-night.webp' },
  },
  {
    id: 6,
    slug: 'perforated',
    title: 'Перфорация',
    description: 'Wow-эффект. Алюминиевый борт с тысячами отверстий создает эффект мерцания кристаллов.',
    price: "от 750 ₸/см",
    images: { day: '/images/letters/perforated-day.webp', night: '/images/letters/perforated-night.webp' },
    badge: "Тренд"
  },
  {
    id: 7,
    slug: 'acrylic-slim',
    title: 'Жидкий акрил',
    description: 'Технология 2025. Монолитная заливка без рамок и кантов. На 30% ярче обычных.',
    price: "от 1000 ₸/см",
    images: { day: '/images/letters/acrylic-slim-day.webp', night: '/images/letters/acrylic-slim-night.webp' },
    badge: "New"
  },
  {
    id: 8,
    slug: 'loft-lamps',
    title: 'Ретро с лампами',
    description: 'Стиль Лофт / Бродвей. Открытые винтажные лампы для создания атмосферы.',
    price: "от 1200 ₸/см",
    images: { day: '/images/letters/loft-lamps-day.webp', night: '/images/letters/loft-lamps-night.webp' },
  },
  {
    id: 9,
    slug: 'pixel-led',
    title: 'Пиксельные LED',
    description: 'Открытые диоды. Рекордная яркость и динамические спецэффекты (анимация).',
    price: "от 1000 ₸/см",
    images: { day: '/images/letters/pixel-led-day.webp', night: '/images/letters/pixel-led-night.webp' },
  },
  {
    id: 10,
    slug: 'wood-style',
    title: 'Эко / Дерево',
    description: 'Натуральные материалы. Лазерная резка фанеры или массива с пропиткой маслом.',
    price: "от 350 ₸/см",
    images: { day: '/images/letters/wood-style-day.webp', night: '/images/letters/wood-style-night.webp' },
  },
  {
    id: 11,
    slug: 'non-lit',
    title: 'Без подсветки',
    description: 'Бюджетное решение для интерьеров. Объемные буквы из ПВХ или пенопласта.',
    price: "от 200 ₸/см",
    images: { day: '/images/letters/non-lit-day.webp', night: '/images/letters/non-lit-night.webp' },
  },
  {
    id: 12,
    slug: 'day-night-effect',
    title: 'День / Ночь',
    description: 'Магия пленки: днем буквы черные, ночью светятся ярко-белым.',
    price: "от 700 ₸/см",
    images: { day: '/images/letters/day-night-effect-day.webp', night: '/images/letters/day-night-effect-night.webp' },
  },
];

export interface VolumeLetterDetailData {
  slug: string;
  title: string;
  subtitle: string;
  price: string;
  badge?: string;
  seoTitle: string;
  seoDesc: string;
  keywords: string[];
  faqs: { question: string; answer: string; iconName: string }[];
  conceptTitle: string;
  conceptSubtitle: string;
  conceptDesc: string;
  conceptHighlights: { title: string; desc: string; iconName: string }[];
  anatomy: { title: string; desc: string; iconName: string }[];
  priceExample: { title: string; quantity: string; height: string; face: string; total: string };
}

export const VOLUME_LETTERS_DETAILS: Record<string, VolumeLetterDetailData> = {
  "face-lit": {
    slug: "face-lit",
    title: "Объемные буквы со световым лицом",
    subtitle: "Классика наружной рекламы. Самый яркий и читаемый вид вывесок в Астане.",
    price: "550",
    badge: "Хит продаж 2025",
    seoTitle: "Световые буквы (Face Lit) | Изготовление вывесок Астана",
    seoDesc: "Заказать объемные буквы с лицевой подсветкой. Акрил Plexiglas, гарантия 2 года, монтаж по дизайн-коду Астаны. Цена от 550 тг/см.",
    keywords: ["световые буквы астана", "объемные буквы цена", "вывеска для магазина", "face lit channel letters", "наружная реклама изготовление"],
    faqs: [
      {
        question: "Какой срок изготовления?",
        answer: "Стандартный срок производства — от 3 до 5 рабочих дней. Если проект сложный (крышная установка или большой объем) — до 7-10 дней. Мы работаем на собственном оборудовании, поэтому не зависим от подрядчиков.",
        iconName: "Clock"
      },
      {
        question: "Сколько электричества потребляет вывеска?",
        answer: "Современные LED-модули очень экономичны. Средняя вывеска потребляет как 1-2 обычные лампочки накаливания (около 60-100 Вт). Мы используем блоки питания с запасом мощности +20% для долговечности.",
        iconName: "BatteryCharging"
      },
      {
        question: "Из чего складывается гарантия?",
        answer: "Мы даем гарантию 2 года на светодиодные модули и блоки питания (IP67 влагозащита). Акрил Plexiglas имеет заводскую гарантию от выгорания на солнце — 10 лет.",
        iconName: "Shield"
      }
    ],
    conceptTitle: "Магия чистого света.",
    conceptSubtitle: "Технология Face Lit",
    conceptDesc: "В этой технологии светятся только лицевые панели. Борта остаются в тени, создавая естественный черный контур. Это повышает читаемость текста на 40% по сравнению с полностью светящимися буквами.",
    conceptHighlights: [
      {
        title: "Идеально для ТРЦ",
        desc: "Соответствует жестким регламентам пожарной безопасности и дизайн-кодам моллов.",
        iconName: "CheckCircle"
      },
      {
        title: "Максимальный контраст",
        desc: "Четкий контур без ореолов и засветов (\"мыла\"). Лучший выбор для логотипов со сложным шрифтом.",
        iconName: "Eye"
      }
    ],
    anatomy: [
      { title: "Лицевая панель", desc: "Литой акрил (Plexiglas) 3–4 мм. Идеально рассеивает свет.", iconName: "Layers" },
      { title: "Боковой борт", desc: "ПВХ пластик или алюминиевый профиль с порошковой покраской.", iconName: "Shield" },
      { title: "Подсветка", desc: "Сверхъяркие линзованные модули с широким углом (160°).", iconName: "Zap" },
      { title: "Задняя стенка", desc: "ПВХ пластик 8-10 мм или сталь. Основа жесткости.", iconName: "Layers" }
    ],
    priceExample: { title: "Вывеска \"ЦВЕТЫ\"", quantity: "5 букв", height: "40 см", face: "Акрил + ПВХ", total: "110 000 ₸" }
  },
  "back-lit": {
    slug: "back-lit",
    title: "Объемные буквы с контражуром",
    subtitle: "Эффект парения (Halo Lit). Мягкий световой ореол для создания премиальной атмосферы.",
    price: "650",
    badge: "Halo Lit Technology",
    seoTitle: "Контражурные вывески (Halo Lit) | Эффект парения | ADLight",
    seoDesc: "Изготовление букв с обратной подсветкой (контражур) в Астане. Мягкий ореол, премиальный вид, скрытый монтаж. Цена от 650 тг/см.",
    keywords: ["контражур астана", "вывеска с подсветкой сзади", "halo lit letters", "парящие буквы", "реклама для бутика"],
    faqs: [
      {
        question: "Видно ли крепления?",
        answer: "Да, контражурные буквы устанавливаются на дистанционных держателях (2-4 см от стены), чтобы свет мог рассеиваться. Если смотреть сбоку, эти ножки будут видны. Мы красим их в цвет фасада, чтобы сделать максимально незаметными.",
        iconName: "Eye"
      },
      {
        question: "Можно ли вешать на стекло?",
        answer: "Не рекомендуется. Стекло отражает заднюю стенку буквы и сами диоды. Эффекта 'мягкого облака' не получится. Для стекла лучше использовать буквы со световым лицом.",
        iconName: "AlertTriangle"
      },
      {
        question: "Какой цвет свечения выбрать?",
        answer: "Для кирпича, дерева и бетона лучше всего подходит Теплый свет (3000К). Для серых, белых и строгих офисных стен — Холодный (6000К).",
        iconName: "Palette"
      }
    ],
    conceptTitle: "Шепчет, а не кричит.",
    conceptSubtitle: "Магия света",
    conceptDesc: "Контражур (contre-jour) — это свет, направленный назад. Отражаясь от фасада, он создает мягкое облако света. Буквы выглядят темными силуэтами на ярком фоне. Это выбор брендов, которым не нужно доказывать свою значимость яркостью прожектора.",
    conceptHighlights: [
      {
        title: "Рестораны и Лаунж",
        desc: "Уютный свет, который не бьет в глаза посетителям на летней террасе.",
        iconName: "Utensils"
      },
      {
        title: "Офисы и Ресепшн",
        desc: "Стильно подчеркивает логотип в интерьере, не создавая бликов на мониторах.",
        iconName: "Building2"
      }
    ],
    anatomy: [
      { title: "Лицевая панель", desc: "Непрозрачная! ПВХ с пленкой, черный акрил или нержавеющая сталь.", iconName: "Layers" },
      { title: "Задняя стенка", desc: "Прозрачный акрил 3-5 мм. Именно через него свет выходит наружу.", iconName: "Layers" },
      { title: "Подсветка", desc: "Сверхъяркие линзованные модули с широким углом (160°).", iconName: "Zap" },
      { title: "Дистанционы", desc: "Ножки 2-4 см, которые держат букву на расстоянии от стены.", iconName: "Shield" }
    ],
    priceExample: { title: "Вывеска \"COFFEE\"", quantity: "6 букв", height: "30 см", face: "ПВХ + Пленка", total: "117 000 ₸" }
  }
};

// Заполним все остальные 10 технологий дефолтными значениями, чтобы они все имели полноценные красивые страницы!
VOLUME_LETTERS_CATALOG.forEach(item => {
  if (!VOLUME_LETTERS_DETAILS[item.slug]) {
    VOLUME_LETTERS_DETAILS[item.slug] = {
      slug: item.slug,
      title: item.title,
      subtitle: item.description + " Премиальное решение в Астане.",
      price: item.price.replace(/\D/g, '') || "550",
      badge: item.badge || "Технология 2025",
      seoTitle: `${item.title} в Астане | Производство вывесок ADLight`,
      seoDesc: `Заказать объемные буквы типа "${item.title}". Высокое качество, собственное производство, гарантия от производителя в Астане.`,
      keywords: [item.slug, "объемные буквы астана", "реклама астана", "ADLight"],
      faqs: [
        {
          question: "Какой срок изготовления?",
          answer: "Стандартный срок производства — от 3 до 5 рабочих дней. Мы работаем на собственном оборудовании, поэтому гарантируем строгое соблюдение оговоренных сроков.",
          iconName: "Clock"
        },
        {
          question: "Какую гарантию вы даете?",
          answer: "Мы даем гарантию 1 год на конструкцию и электрические компоненты. Используются только высококачественные влагозащищенные светодиоды.",
          iconName: "Shield"
        }
      ],
      conceptTitle: "Совершенство в деталях.",
      conceptSubtitle: item.title,
      conceptDesc: item.description + " Данное решение идеально подходит для современных вывесок, обеспечивая великолепный внешний вид как днем, так и ночью.",
      conceptHighlights: [
        {
          title: "Собственный цех",
          desc: "Контроль качества на каждом этапе изготовления.",
          iconName: "CheckCircle"
        },
        {
          title: "Соблюдение Дизайн-кода",
          desc: "Все наши вывески гарантированно соответствуют требованиям Акимата Астаны.",
          iconName: "Eye"
        }
      ],
      anatomy: [
        { title: "Корпус буквы", desc: "Высокопрочные материалы (ПВХ, алюминий, акрил).", iconName: "Layers" },
        { title: "Засветка", desc: "Яркие диодные модули с низким энергопотреблением.", iconName: "Zap" }
      ],
      priceExample: { title: "Вывеска \"БИЗНЕС\"", quantity: "6 букв", height: "30 см", face: "Индивидуальный выбор", total: "98 000 ₸" }
    };
  }
});

export const VOLUME_LETTERS_ADVANTAGES = {
  title: "Почему объемные буквы работают лучше?",
  subtitle: "В визуальном шуме города плоская вывеска — невидимка. Объем, свет и тень создают \"визуальный якорь\".",
  eyeMagnet: {
    title: "Магнит для глаз",
    desc: "Человеческий мозг эволюционно заточен замечать 3D-объекты. Объемная буква воспринимается как \"реальный предмет\", вызывая больше доверия."
  },
  efficiencyPercent: "42%",
  efficiencyText: "К вниманию прохожих по сравнению с плоскими коробами."
};

export const VOLUME_LETTERS_TECH_CARDS = [
  {
    title: "Акрил Plexiglas GS",
    desc: "Немецкий литой акрил. Не желтеет 10 лет, светопропускание 92%, повышенная прочность."
  },
  {
    title: "LED-модули ELF",
    desc: "Чипы Samsung с линзой 160°-170°. Идеально равномерная засветка лица без темных пятен."
  },
  {
    title: "Mean Well IP67",
    desc: "Герметичные блоки питания промышленного класса с авто-защитой от КЗ и перепадов сети."
  },
  {
    title: "Simona PVC & Oracal",
    desc: "Немецкий ПВХ-пластик 8-10 мм и светорассеивающая транслюцентная виниловая пленка."
  }
];

export const VOLUME_LETTERS_STEPS = [
  { step: "01", title: "Заявка", desc: "Фото места и размеры" },
  { step: "02", title: "Макет", desc: "Визуализация на фасаде" },
  { step: "03", title: "Смета", desc: "Прозрачный расчет" },
  { step: "04", title: "Производство", desc: "3-7 дней в цехе" },
  { step: "05", title: "Монтаж", desc: "Установка и подключение" }
];
