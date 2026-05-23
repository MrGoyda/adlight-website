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
  iconName: "Store" | "Zap" | "Building";
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
        tags: ["Хит продаж", "Согласование", "Гарантия 1 год"],
        description: "Изготовление объемных букв любой сложности по единому Дизайн-коду Астаны."
      },
      {
        title: "Световые короба",
        price: "от 45 000 ₸/m²",
        link: "/services/lightboxes",
        image: "/images/pages/services-lightboxes.webp",
        tags: ["Много текста", "Яркость", "Любая форма"],
        description: "Лайтбоксы сложной формы и композитные короба с инкрустацией в Астане и Алматы."
      },
      {
        title: "Панель-кронштейны",
        price: "от 35 000 ₸",
        link: "/services/panel-brackets",
        image: "/images/pages/services-panel-brackets.webp",
        tags: ["Двусторонние", "Для пешеходов", "Компактно"],
        description: "Двусторонние торцевые вывески для максимального обзора."
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
        price: "Индивидуально",
        link: "/services/neon",
        image: "/images/pages/services-neon.webp",
        tags: ["Flex Neon 2.0", "Для фотозон", "Безопасно"],
        description: "Яркий гибкий неон для интерьера, баров и фотозон."
      },
      {
        title: "Интерьерные лого",
        price: "от 25 000 ₸",
        link: "/services/interior",
        image: "/images/pages/services-interior.webp",
        tags: ["Тонкий акрил", "Ресепшн", "Контражур"],
        description: "Стильные логотипы для зоны ресепшн и офиса."
      },
      {
        title: "Таблички и Навигация",
        price: "от 5 000 ₸",
        link: "/services/navigation",
        image: "/images/pages/services-navigation.webp",
        tags: ["Бизнес-центры", "Указатели", "Гравировка"],
        description: "Системы навигации для бизнес-центров и торговых залов."
      }
    ]
  },
  {
    id: "scale",
    category: "Инженерные проекты",
    iconName: "Building",
    color: "text-blue-500",
    items: [
      {
        title: "Крышные установки",
        price: "Проектно",
        link: "/services/roof-installations",
        image: "/images/pages/services-roof-installations.webp",
        tags: ["Документация", "Нагрузки", "Масштаб"],
        description: "Грандиозные рекламные конструкции на крышах зданий."
      },
      {
        title: "Входные группы",
        price: "Проектно",
        link: "/services/entrance-groups",
        image: "/images/pages/services-entrance-groups.webp",
        tags: ["Композит", "Козырьки", "Облицовка"],
        description: "Комплексное оформление входа: козырьки, колонны, обшивка."
      },
      {
        title: "Стелы и Пилоны",
        price: "Проектно",
        link: "/services/pylons",
        image: "/images/pages/services-pylons.webp",
        tags: ["Фундамент", "АЗС", "Навигация"],
        description: "Отдельно стоящие рекламные конструкции и навигационные стелы."
      }
    ]
  }
];
