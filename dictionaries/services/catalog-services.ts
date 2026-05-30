// dictionaries/services/catalog-services.ts

export interface CatalogServiceItem {
  title: string;
  price: string;
  link: string;
  image: string;
  tags: string[];
  description: string;
}

export interface CatalogServiceGroup {
  id: string;
  category: string;
  iconName: "Store" | "Zap" | "Building" | "Wrench";
  color: string;
  items: CatalogServiceItem[];
}

export const CATALOG_SERVICES: CatalogServiceGroup[] = [
  {
    id: "facade",
    category: "Фасадная реклама",
    iconName: "Store",
    color: "text-orange-500",
    items: [
      {
        title: "Объемные буквы",
        price: "от 550 ₸/см",
        link: "/services/volume-letters",
        image: "/images/pages/services-letters.webp",
        tags: ["Хит продаж", "Согласование", "Гарантия 3 года"],
        description: "Изготовление объемных букв любой сложности по единому Дизайн-коду Астаны."
      },
      {
        title: "Световые короба",
        price: "от 80 000 ₸/m²",
        link: "/services/lightboxes",
        image: "/images/pages/services-lightboxes.webp",
        tags: ["Много текста", "Яркость", "Любая форма"],
        description: "Лайтбоксы сложной формы и композитные короба с инкрустацией в Астане."
      },
      {
        title: "Панель-кронштейны",
        price: "от 35 000 ₸",
        link: "/services/panel-brackets",
        image: "/images/pages/services-panel-brackets.webp",
        tags: ["Двусторонние", "Для пешеходов", "Компактно"],
        description: "Двусторонние торцевые вывески для максимального обзора пешеходами."
      },
      {
        title: "Оформление фасадов",
        price: "от 18 000 ₸/m²",
        link: "/services/facade-decoration",
        image: "/images/pages/services-facade.webp",
        tags: ["Композит", "Алюкобонд", "Под ключ"],
        description: "Облицовка фасадов композитными панелями и керамогранитом под рекламу."
      }
    ]
  },
  {
    id: "interior",
    category: "Интерьер и Атмосфера",
    iconName: "Zap",
    color: "text-purple-500",
    items: [
      {
        title: "Неоновые вывески",
        price: "от 15 000 ₸",
        link: "/services/neon",
        image: "/images/pages/services-neon.webp",
        tags: ["Flex Neon 2.0", "Для фотозон", "Безопасно"],
        description: "Яркий гибкий неон для интерьера, офисов, баров и фотозон на заказ."
      },
      {
        title: "Интерьерные лого",
        price: "от 25 000 ₸",
        link: "/services/interior",
        image: "/images/pages/services-interior.webp",
        tags: ["Тонкий акрил", "Ресепшн", "Контражур"],
        description: "Стильные интерьерные логотипы для зоны ресепшн и офисов компаний."
      },
      {
        title: "Таблички и Навигация",
        price: "от 5 000 ₸",
        link: "/services/navigation",
        image: "/images/pages/services-navigation.webp",
        tags: ["Указатели", "Стенды", "Акрил"],
        description: "Кабинетные таблички, указатели и системы навигации для бизнес-центров."
      },
      {
        title: "Баннеры и таблички",
        price: "от 2 500 ₸/m²",
        link: "/services/banners-plates",
        image: "/images/pages/services-banners.webp",
        tags: ["Широкоформат", "Инфо-стенды", "Срочно"],
        description: "Печать баннеров, пресс-стены, информационные стенды и дверные таблички."
      }
    ]
  },
  {
    id: "scale",
    category: "Инженерные и Event проекты",
    iconName: "Building",
    color: "text-blue-500",
    items: [
      {
        title: "Крышные установки",
        price: "Проектно",
        link: "/services/roof-installations",
        image: "/images/pages/services-roof-installations.webp",
        tags: ["Документация", "Нагрузки", "Масштаб"],
        description: "Грандиозные масштабные рекламные конструкции на крышах зданий."
      },
      {
        title: "Входные группы",
        price: "Проектно",
        link: "/services/entrance-groups",
        image: "/images/pages/services-entrance-groups.webp",
        tags: ["Козырьки", "Колонны", "Дизайн-проект"],
        description: "Комплексное оформление входа в магазин, банк или офис: козырьки, облицовка."
      },
      {
        title: "Стелы и Пилоны",
        price: "от 250 000 ₸",
        link: "/services/pylons",
        image: "/images/pages/services-pylons.webp",
        tags: ["Фундамент", "Для АЗС", "Навигация"],
        description: "Отдельно стоящие рекламные стелы, пилоны и указатели направления."
      },
      {
        title: "Вывески на выставку",
        price: "от 120 000 ₸",
        link: "/services/exhibition-stands",
        image: "/images/pages/services-exhibition.webp",
        tags: ["Выставки", "Промо-зоны", "Быстрая сборка"],
        description: "Изготовление выставочных стендов, световых конструкций и промо-зон."
      }
    ]
  },
  {
    id: "service",
    category: "Услуги и Автотранспорт",
    iconName: "Wrench",
    color: "text-green-500",
    items: [
      {
        title: "Брендирование авто",
        price: "от 45 050 ₸",
        link: "/services/branding-cars",
        image: "/images/pages/services-branding-cars.webp",
        tags: ["Оклейка авто", "Винил", "Реклама на колесах"],
        description: "Оклейка коммерческого транспорта виниловой пленкой с рекламой компании."
      },
      {
        title: "Ремонт вывесок",
        price: "от 15 000 ₸",
        link: "/services/signboard-repair",
        image: "/images/pages/services-repair.webp",
        tags: ["Диагностика", "Светодиоды", "Срочный выезд"],
        description: "Ремонт, модернизация на диоды, чистка и техническое обслуживание вывесок."
      }
    ]
  }
];
