// dictionaries/services/volume-letters.ts
import { SITE_PRICES_NUMERIC } from "@/config/site";

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
    price: `от ${SITE_PRICES_NUMERIC.letters['face-lit']} ₸/см`,
    images: { day: '/images/letters/face-lit-day.webp', night: '/images/letters/face-lit-night.webp' },
    badge: "Хит продаж"
  },
  {
    id: 2,
    slug: 'full-lit',
    title: 'Полное свечение',
    description: 'Эффект «леденца». Буква светится целиком (лицо + борта). Максимальный угол обзора 360°.',
    price: `от ${SITE_PRICES_NUMERIC.letters['full-lit']} ₸/см`,
    images: { day: '/images/letters/full-lit-day.webp', night: '/images/letters/full-lit-night.webp' },
    badge: "Premium"
  },
  {
    id: 3,
    slug: 'back-lit',
    title: 'Контражур',
    description: 'Эффект парения. Свет направлен на стену, создавая мягкий ореол вокруг темной буквы.',
    price: `от ${SITE_PRICES_NUMERIC.letters['back-lit']} ₸/см`,
    images: { day: '/images/letters/back-lit-day.webp', night: '/images/letters/back-lit-night.webp' },
    badge: "Стиль"
  },
  {
    id: 4,
    slug: 'combo-lit',
    title: 'Комбо (Лицо + Бэк)',
    description: 'Двойной удар. Читаемость лицевого свечения + премиальный ореол контражура.',
    price: `от ${SITE_PRICES_NUMERIC.letters['combo-lit']} ₸/см`,
    images: { day: '/images/letters/combo-lit-day.webp', night: '/images/letters/combo-lit-night.webp' },
    badge: "VIP"
  },
  {
    id: 5,
    slug: 'side-lit',
    title: 'Светятся борта',
    description: 'Инверсия. Лицо темное, а контур (борт) светится. Строгий, архитектурный стиль.',
    price: `от ${SITE_PRICES_NUMERIC.letters['side-lit']} ₸/см`,
    images: { day: '/images/letters/side-lit-day.webp', night: '/images/letters/side-lit-night.webp' },
  },
  {
    id: 6,
    slug: 'perforated',
    title: 'Перфорация',
    description: 'Wow-эффект. Алюминиевый борт с тысячами отверстий создает эффект мерцания кристаллов.',
    price: `от ${SITE_PRICES_NUMERIC.letters['perforated']} ₸/см`,
    images: { day: '/images/letters/perforated-day.webp', night: '/images/letters/perforated-night.webp' },
    badge: "Тренд"
  },
  {
    id: 7,
    slug: 'acrylic-slim',
    title: 'Цельноклееный акрил',
    description: 'Premium-класс. Бесшовное склеивание борта и лица. Абсолютная монолитность и ровная засветка.',
    price: `от ${SITE_PRICES_NUMERIC.letters['acrylic-slim']} ₸/см`,
    images: { day: '/images/letters/acrylic-slim-day.webp', night: '/images/letters/acrylic-slim-night.webp' },
    badge: "Премиум"
  },
  {
    id: 8,
    slug: 'loft-lamps',
    title: 'Ретро с лампами',
    description: 'Стиль Лофт / Бродвей. Открытые винтажные лампы для создания атмосферы.',
    price: `от ${SITE_PRICES_NUMERIC.letters['loft-lamps']} ₸/см`,
    images: { day: '/images/letters/loft-lamps-day.webp', night: '/images/letters/loft-lamps-night.webp' },
  },
  {
    id: 9,
    slug: 'pixel-led',
    title: 'Пиксельные LED',
    description: 'Открытые диоды. Рекордная яркость и динамические спецэффекты (анимация).',
    price: `от ${SITE_PRICES_NUMERIC.letters['pixel-led']} ₸/см`,
    images: { day: '/images/letters/pixel-led-day.webp', night: '/images/letters/pixel-led-night.webp' },
  },
  {
    id: 10,
    slug: 'wood-style',
    title: 'Эко / Дерево',
    description: 'Натуральные материалы. Лазерная резка фанеры или массива с пропиткой маслом.',
    price: `от ${SITE_PRICES_NUMERIC.letters['wood-style']} ₸/см`,
    images: { day: '/images/letters/wood-style-day.webp', night: '/images/letters/wood-style-night.webp' },
  },
  {
    id: 11,
    slug: 'non-lit',
    title: 'Без подсветки',
    description: 'Бюджетное решение для интерьеров. Объемные буквы из ПВХ или пенопласта.',
    price: `от ${SITE_PRICES_NUMERIC.letters['non-lit']} ₸/см`,
    images: { day: '/images/letters/non-lit-day.webp', night: '/images/letters/non-lit-night.webp' },
  },
  {
    id: 12,
    slug: 'day-night-effect',
    title: 'День / Ночь',
    description: 'Магия пленки: днем буквы черные, ночью светятся ярко-белым.',
    price: `от ${SITE_PRICES_NUMERIC.letters['day-night-effect']} ₸/см`,
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
  // Новые экспертные свойства для E-E-A-T
  expertAuthor?: { name: string; role: string; experience: string };
  expertQuote?: { title: string; text: string; subtext: string };
  expertRegulations?: { title: string; desc: string; items: string[] };
  expertSpecifications?: {
    title: string;
    subtitle: string;
    rows: { label: string; premium: string; chineseAlternative: string; purpose: string }[];
  };
  expertBudgetDisclaimer?: { title: string; text: string };
}

// Import modular technology details
import { face_litDetails } from "./details/volume-letters/face-lit";
import { back_litDetails } from "./details/volume-letters/back-lit";
import { side_litDetails } from "./details/volume-letters/side-lit";
import { full_litDetails } from "./details/volume-letters/full-lit";
import { combo_litDetails } from "./details/volume-letters/combo-lit";
import { perforatedDetails } from "./details/volume-letters/perforated";
import { acrylic_slimDetails } from "./details/volume-letters/acrylic-slim";
import { loft_lampsDetails } from "./details/volume-letters/loft-lamps";
import { pixel_ledDetails } from "./details/volume-letters/pixel-led";
import { wood_styleDetails } from "./details/volume-letters/wood-style";
import { non_litDetails } from "./details/volume-letters/non-lit";
import { day_night_effectDetails } from "./details/volume-letters/day-night-effect";

export const VOLUME_LETTERS_DETAILS: Record<string, VolumeLetterDetailData> = {
  "face-lit": face_litDetails,
  "back-lit": back_litDetails,
  "side-lit": side_litDetails,
  "full-lit": full_litDetails,
  "combo-lit": combo_litDetails,
  "perforated": perforatedDetails,
  "acrylic-slim": acrylic_slimDetails,
  "loft-lamps": loft_lampsDetails,
  "pixel-led": pixel_ledDetails,
  "wood-style": wood_styleDetails,
  "non-lit": non_litDetails,
  "day-night-effect": day_night_effectDetails,
};

// Заполним все остальные 10 технологий дефолтными значениями
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
      priceExample: { title: "Вывеска \"БИЗНЕС\"", quantity: "6 букв", height: "30 см", face: "Индивидуальный выбор", total: "98 000 ₸" },
      // Дефолтные экспертные блоки для стабильности остальных страниц
      expertAuthor: { name: "Парчевин Даниил", role: "Главный технолог производства ADLight", experience: "9+ лет" },
      expertQuote: {
        title: "«Тонкости подбора вывески под фасад здания»",
        text: `При выборе технологии "${item.title}" важно учитывать тип фасадного материала. В зависимости от текстуры (кирпич, керамогранит, остекление) мы подберем оптимальный вариант рассеивания света для обеспечения максимального контраста.`,
        subtext: "Совет технолога"
      },
      expertRegulations: {
        title: "Согласование вывески без штрафов",
        desc: "Акимат Астаны строго следит за соответствием вывесок городскому Дизайн-коду. Чтобы вашу вывеску не демонтировали, проверьте:",
        items: [
          "Только объемные буквы на металлораме в цвет фасада (без сплошных подложек на первом этаже).",
          "Высота букв не должна превышать 50 см согласно городским правилам благоустройства.",
          "Отсутствие агрессивной мигающей динамики и стробоскопических эффектов.",
          "Подача эскизного проекта с фотопривязкой 3D (день/ночь) через e-Otinish."
        ]
      },
      expertSpecifications: {
        title: "Технические спецификации и климат Астаны",
        subtitle: "Используемые материалы, стандарты ГОСТ и адаптация к нагрузкам",
        rows: [
          { label: "Корпус буквы", premium: "Премиальные европейские материалы", chineseAlternative: "Заводские прочные аналоги", purpose: "Высокая износостойкость и защита от выгорания" },
          { label: "Светодиодные модули", premium: "Линзованные диоды ELF (Samsung чипы)", chineseAlternative: "Заводские яркие LED-модули IP67", purpose: "Стабильная работа подсветки до 50 000 часов" },
          { label: "Морозостойкость", premium: "Специальный силикон для критических температур до -45°C", chineseAlternative: "Морозостойкий герметик до -35°C", purpose: "Защита вывески в условиях астанинских зим" }
        ]
      },
      expertBudgetDisclaimer: {
        title: "Гибкий выбор под ваш бюджет",
        text: `Мы предлагаем как премиальные комплектации на базе европейских и корейских комплектующих, так и качественные заводские китайские аналоги. Это позволяет вам сэкономить до 30-40% от стоимости вывески без ущерба для ее внешнего вида с нашей полной официальной гарантией по договору.`
      }
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
    title: "Акрил: Германия и заводской Китай",
    desc: "Для лицевых частей мы честно предлагаем оригинальный немецкий акрил Plexiglas или сертифицированный китайский акрил 2-5 мм заводского качества, гарантирующий ровное свечение."
  },
  {
    title: "Пленки и УФ-печать в 200%",
    desc: "Применяем оригинальную немецкую светорассеивающую пленку Oracal 8100 серии или наносим сочную прямую УФ-печать в 200% плотности на прозрачную пленку для максимальной яркости."
  },
  {
    title: "Борта, задники и автоэмали",
    desc: "Задники из ПВХ 8 мм (плотность 0.45 или 0.60). Борта из ПВХ 3, 5, 8 мм, окрашенные профессиональной краской Arton или Flame для превосходного глянцевого или матового покрытия."
  },
  {
    title: "Светодиоды ELF и БП с автозащитой",
    desc: "Премиальные корейские модули ELF (Samsung чипы), качественные заводские китайские диоды IP67 и промышленные адаптеры питания Mean Well с термопредохранителями."
  }
];

export const VOLUME_LETTERS_STEPS = [
  { 
    step: "01", 
    title: "Точный Замер и Фотофасад", 
    desc: "Наш специалист бесплатно выезжает на объект в Астане, производит лазерный замер фасада и делает фотофиксацию места будущей установки с учетом архитектурных особенностей." 
  },
  { 
    step: "02", 
    title: "3D-Дизайн и Смета", 
    desc: "Создаем фотопривязку объемных букв на реальный фасад. Готовим прозрачный сметный расчет в 2-3 вариантах комплектации под любой вкус и кошелек (от премиум до бюджета)." 
  },
  { 
    step: "03", 
    title: "Проект для Акимата", 
    desc: "Разрабатываем эскизный проект вывески в строгом соответствии с Дизайн-кодом Астаны, помогаем подготовить правильный пакет документов для беспрепятственного согласования." 
  },
  { 
    step: "04", 
    title: "Сборка в Цехе", 
    desc: "На высокоточных лазерных и фрезерных станках осуществляем раскрой. Мастера вручную склеивают боковины букв, герметизируют и монтируют яркие диоды." 
  },
  { 
    step: "05", 
    title: "Бережный Монтаж", 
    desc: "Монтажная бригада бережно привозит вывеску, прочно крепит буквы на металлическую раму в цвет фасада и подключает к сети. Предоставляем гарантию 1 год по договору." 
  }
];

export const VOLUME_LETTERS_DICT = {
  breadcrumbs: {
    home: "Главная",
    services: "Услуги"
  },
  hero: {
    badge: "Собственное производство вывесок в Астане",
    title: "Объемные буквы",
    titleAccent: "на любой бюджет",
    description: "Профессиональное изготовление световых и несветовых 3D букв в Астане. Подберем материалы на любой вкус и кошелек: от премиального немецкого акрила и корейской оптики до надежных, сертифицированных заводских китайских аналогов с официальной гарантией 1 год по договору. Работаем строго по Дизайн-кодом города.",
    badgeContract: "Инженерная рама",
    badgeContractDesc: "Металлокаркас в цвет фасада и ветрозащитный крепеж",
    badgeContractIcon: "Shield",
    btnCalculate: "Рассчитать стоимость",
    btnRequest: "Оставить заявку",
    modalTitle: "Заявка на объемные буквы",
    modalSubtitle: "Оставьте ваши контакты. Наш специалист свяжется с вами и рассчитает стоимость производства конструкции за 15 минут.",
    modalButton: "Получить расчет"
  },
  techCatalogNotice: {
    heading: "Выберите технологию",
    title: "Изготавливаем объемные буквы по всем известным мировым технологиям.",
    description: "В зависимости от ваших задач и стиля здания мы подберем идеальный способ засветки и материалов. Ознакомьтесь подробнее с каждым типом объемных букв ниже:",
    day: "День",
    night: "Ночь",
    altNightTemplate: "{title} - ночная подсветка",
    altDayTemplate: "{title} - вид днем"
  },
  calculator: {
    title: "Рассчитайте точную цену объемных букв за 1 минуту",
    description: "Интеллектуальный калькулятор на нашем сайте моментально рассчитает стоимость вывески онлайн. Выберите желаемый шрифт, высоту букв и тип подсветки, чтобы получить моментальный сметный расчет.",
    buttonText: "Перейти в калькулятор"
  },
  gallery: {
    title: "Наши реализованные вывески в Астане",
    subtitle: "Примеры готовых объемных букв, установленных нашей монтажной командой"
  },
  detailGallery: {
    badge: "Портфолио",
    title: "Галерея реализованных проектов",
    descriptionTemplate: "Фотоотчеты реальных объемных световых букв {techName}, установленных нашей монтажной командой ADLight в Астане."
  },
  specifications: {
    title: "Качество не на словах",
    subtitle: "Мы предоставляем честную гарантию, так как используем только проверенные материалы"
  },
  steps: {
    title: "Как мы работаем"
  },
  careGuide: {
    badge: "Надежность и уход",
    tipPrefix: "Рекомендация"
  },
  comparison: {
    badge: "Выбор комплектации",
    premiumLabel: "Премиум",
    budgetLabel: "Заводской Бюджет"
  },
  expertTips: {
    badge: "Экспертное мнение",
    facadeLabel: "Фасад",
    quote: "Правильный подбор типа крепления под особенности фасада вашего здания в Астане — это залог не только эстетики, но и безопасности эксплуатации конструкции при сильных ветрах.",
    footerProduction: "Собственное производство в Астане",
    footerWarranty: "Гарантия 1 год"
  },
  rules: {
    badge: "Дизайн-код Астаны"
  },
  psychology: {
    badge: "Эффективность"
  },
  carousel: {
    title: "Другие услуги",
    subtitle: "Комплексное оформление"
  },
  faq: {
    badge: "Вопросы и ответы",
    title: "Вопросы об объемных буквах",
    subtitle: "Всё, что важно знать перед заказом объемных световых букв для коммерческих объектов в Астане",
    items: [
      {
        question: "Можно ли заказать качественные объемные буквы при ограниченном бюджете?",
        answer: "Да, мы подбираем материалы на любой вкус и кошелек. Если бюджет ограничен, мы предложим сертифицированные заводские аналоги китайского производства. Они стоят дешевле премиальных европейских брендов, но проходят строгий заводской контроль качества, имеют отличную яркость и сопровождаются нашей полной гарантией 12 месяцев."
      },
      {
        question: "Как правильно подобрать размер и высоту объемных букв для вывески?",
        answer: "Согласно Дизайн-коду Астаны, для большинства фасадов высота объемных букв на первом этаже не должна превышать 50 см. Для интерьерных вывесок (внутри торговых центров или в офисах на ресепшн) стандартная высота букв составляет от 15 до 30 см. Наш дизайнер поможет определиться с размером на этапе создания 3D-привязки."
      },
      {
        question: "В чем разница между премиальными материалами и качественным заводским Китаем?",
        answer: "Премиум-класс комплектуется немецким литым акрилом Plexiglas GS и корейскими диодами ELF (Samsung) с повышенным ресурсом службы более 50 000 часов. Заводской Китай комплектуется качественными проверенными аналогами, которые имеют чуть меньший ресурс, но светят так же ярко и выглядят презентабельно, позволяя сэкономить до 30-40% от стоимости вывески."
      },
      {
        question: "Как объемные буквы крепятся к фасаду здания?",
        answer: "Для соответствия требованиям Акимата буквы монтируются на прочный металлический подрамник (каркас), который окрашивается порошковым методом строго под цвет фасада здания. Это делает несущую конструкцию практически невидимой, а сами объемные буквы выглядят аккуратно и эстетично."
      },
      {
        question: "Нужно ли регистрировать и согласовывать объемные буквы в Астане?",
        answer: "Да, любая наружная вывеска должна иметь согласование от Управления архитектуры. Мы делаем вывески строго в соответствии со всеми правилами (буквы без сплошных подложек, высота до 50 см, отсутствие мигающих эффектов) и предоставляем клиентам готовые эскизы и чертежи для легкого прохождения согласования."
      },
      {
        question: "Какой тип подсветки объемных букв наиболее популярен?",
        answer: "Наиболее востребовано классическое лицевое свечение (светится только передняя часть буквы) — оно обеспечивает отличную читаемость с большого расстояния. Вторым по популярности идет контражур — когда свет проецируется на стену за буквой, создавая эффект мягкого парения, что идеально подходит для бутиков, салонов красоты и ресторанов."
      }
    ]
  }
};

export const VOLUME_LETTERS_EXPERT = {
  comparison: {
    title: "Сравнение комплектаций объемных букв",
    subtitle: "Прозрачное сопоставление премиум-материалов и сертифицированных китайских аналогов для осознанного выбора",
    headers: ["Характеристика", "Премиум (Германия/Корея)", "Заводской Бюджет (Китай)", "Значение для вывески"],
    rows: [
      {
        name: "Лицевой акрил",
        premium: "Немецкий Plexiglas GS",
        budget: "Заводской акрил (Китай)",
        importance: "Равномерное рассеивание света без пятен и пожелтения более 10 лет"
      },
      {
        name: "Светодиоды",
        premium: "Чипы Samsung (ELF, Корея)",
        budget: "Заводские чипы (Китай)",
        importance: "Стабильная яркость. Корейские диоды служат до 7-10 лет без выгорания"
      },
      {
        name: "Блоки питания",
        premium: "Mean Well IP67 (Тайвань)",
        budget: "Влагозащищенный аналог",
        importance: "Защита вывески от перепадов напряжения и коротких замыканий"
      },
      {
        name: "Светопропускание",
        premium: "92% (идеальный глянец)",
        budget: "80-85% (матовый тон)",
        importance: "Влияет на общую яркость и читаемость букв в солнечные дни"
      },
      {
        name: "Срок службы",
        premium: "Более 8-10 лет",
        budget: "3-5 лет",
        importance: "Определяет периодичность сервисного обслуживания диодов"
      },
      {
        name: "Экономия бюджета",
        premium: "0% (базовый расчет)",
        budget: "До 35-40% экономии",
        importance: "Возможность снизить затраты на старте открытия бизнеса"
      }
    ]
  },
  designCode: {
    title: "Дизайн-код Астаны для объемных букв",
    subtitle: "Делаем вывески строго по закону, защищая вас от штрафов и демонтажа городских служб",
    badgeAllowed: "Разрешено Акиматом",
    badgeForbidden: "Запрещено законом",
    allowed: [
      {
        title: "Отдельно стоящие буквы",
        desc: "Каждая объемная буква монтируется на фасад как самостоятельный элемент."
      },
      {
        title: "Высота букв до 50 см",
        desc: "Стандартный регламент для первых этажей коммерческих помещений."
      },
      {
        title: "Невидимая металлорама",
        desc: "Каркас окрашивается порошковой краской точно под цвет фасада здания."
      },
      {
        title: "Размещение в один ряд",
        desc: "Вывеска должна располагаться строго на единой горизонтальной линии фасада."
      }
    ],
    forbidden: [
      {
        title: "Сплошные подложки",
        desc: "Запрещено монтировать буквы на массивные пластиковые или композитные щиты."
      },
      {
        title: "Выступающие баннеры",
        desc: "Запрещено использовать натяжные тканевые конструкции на фасадных вывесках."
      },
      {
        title: "Мигающая динамика",
        desc: "Запрещены бегущие строки и раздражающая стробоскопическая подсветка."
      },
      {
        title: "Закрытие окон и лепнины",
        desc: "Вывеска не должна перекрывать архитектурные декоративные элементы здания."
      }
    ]
  },
  technologistTips: {
    title: "Советы главного технолога ADLight",
    subtitle: "Как правильно подобрать подсветку объемных букв под материал вашего фасада",
    expertName: "Парчевин Даниил",
    expertRole: "Главный технолог производства ADLight",
    tips: [
      {
        facade: "Глянцевый керамогранит / Остекление",
        recommendation: "Используйте технологию «Световое лицо». Контражурная подсветка (свет назад) на зеркальном фасаде создаст сильные некрасивые блики, а сами буквы станут нечитаемыми. Световое лицо даст четкий ровный контур.",
        iconName: "Maximize2"
      },
      {
        facade: "Декоративный кирпич / Матовая штукатурка",
        recommendation: "Здесь идеально раскрывается «Контражур» (back-lit). Свет мягко ложится на текстурную стену, образуя глубокий ореол. Буквы выглядят благородно, подчеркивая архитектуру здания.",
        iconName: "Compass"
      },
      {
        facade: "Композитные панели светлых тонов",
        recommendation: "Для белых, серых или желтых фасадов рекомендуем использовать «Комбинированную подсветку» или буквы с темными бортами. Буквы не сольются с фасадом днем, а ночью обеспечат отличную яркость.",
        iconName: "Layers"
      }
    ]
  },
  careGuide: {
    title: "Эксплуатация в климате Астаны",
    subtitle: "Как наши объемные буквы переносят экстремальные температуры столицы (от -40°C до +40°C)",
    tips: [
      {
        step: "01",
        title: "Защита от степной пыли",
        desc: "Каждую весну мы рекомендуем аккуратно смывать пыль с лицевой части букв простой водой без жестких химикатов. Это восстанавливает первоначальную яркость акрила на 15-20%."
      },
      {
        step: "02",
        title: "Усиленные ветровые нагрузки",
        desc: "В Астане частые шквальные ветры. Все наши рамы рассчитываются конструктором с запасом прочности в 1.5 раза. Мы используем усиленные анкерные крепления."
      },
      {
        step: "03",
        title: "Морозостойкие диоды",
        desc: "Мы герметизируем светодиодные модули высокоэластичным силиконом, который не трескается и не сжимается при астанинских морозах до -40°C, защищая диоды от влаги."
      },
      {
        step: "04",
        title: "Стабильное напряжение",
        desc: "Все блоки питания оснащены термопредохранителями. При летней жаре свыше +40°C они автоматически снижают нагрузку, предотвращая перегрев и перегорание цепи."
      }
    ]
  }
};
