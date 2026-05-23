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
    title: "Акрил Plexiglas",
    desc: "Немецкое оргстекло. Не желтеет 10 лет, пропускает 92% света."
  },
  {
    title: "Диоды с линзой",
    desc: "Широкий угол рассеивания 170°. Никаких \"пятен\" на лицевой части."
  },
  {
    title: "Защита IP67",
    desc: "Герметичные блоки питания и модули. Работают в дождь и мороз -40°C."
  },
  {
    title: "Свой цех",
    desc: "ЧПУ станки, лазерная сварка и бортогибы. Контроль каждого этапа."
  }
];

export const VOLUME_LETTERS_STEPS = [
  { step: "01", title: "Заявка", desc: "Фото места и размеры" },
  { step: "02", title: "Макет", desc: "Визуализация на фасаде" },
  { step: "03", title: "Смета", desc: "Прозрачный расчет" },
  { step: "04", title: "Производство", desc: "3-7 дней в цехе" },
  { step: "05", title: "Монтаж", desc: "Установка и подключение" }
];
