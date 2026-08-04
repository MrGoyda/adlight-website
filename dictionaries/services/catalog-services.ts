// dictionaries/services/catalog-services.ts
import { SITE_PRICES, SITE_LINKS } from "@/config/site";
import { getCdnUrl } from "@/lib/serverUtils";

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
        price: SITE_PRICES.volumeLetters,
        link: SITE_LINKS.services.volumeLetters,
        image: getCdnUrl("/images/pages/services-letters.webp"),
        tags: ["Хит продаж", "Согласование", "Гарантия 3 года"],
        description: "Изготовление объемных букв любой сложности по единому Дизайн-коду Астаны."
      },
      {
        title: "Световые короба",
        price: SITE_PRICES.lightboxes,
        link: SITE_LINKS.services.lightboxes,
        image: getCdnUrl("/images/pages/services-lightboxes.webp"),
        tags: ["Много текста", "Яркость", "Любая форма"],
        description: "Лайтбоксы сложной формы и композитные короба с инкрустацией в Астане."
      },
      {
        title: "Панель-кронштейны",
        price: SITE_PRICES.panelBrackets,
        link: SITE_LINKS.services.panelBrackets,
        image: getCdnUrl("/images/pages/services-panel-brackets.webp"),
        tags: ["Двусторонние", "Для пешеходов", "Компактно"],
        description: "Двусторонние торцевые вывески для максимального обзора пешеходами."
      },
      {
        title: "Оформление фасадов",
        price: SITE_PRICES.facadeDecoration,
        link: SITE_LINKS.services.facadeDecoration,
        image: getCdnUrl("/images/facade-decoration/6.jpg"),
        tags: ["Композит", "Алюкобонд", "Под ключ"],
        description: "Облицовка фасадов композитными панелями и керамогранитом под рекламу."
      },
      {
        title: "Брендирование витрин",
        price: SITE_PRICES.windowBranding,
        link: SITE_LINKS.services.windowBranding,
        image: getCdnUrl("/images/window-branding/1.png"),
        tags: ["Оклейка окон", "Виниловая аппликация", "Перфорация"],
        description: "Оклейка витрин магазинов полноцветной печатью, перфопленкой или плоттерной резкой."
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
        price: SITE_PRICES.neon,
        link: SITE_LINKS.services.neon,
        image: getCdnUrl("/images/pages/services-neon.webp"),
        tags: ["Flex Neon 2.0", "Для фотозон", "Безопасно"],
        description: "Яркий гибкий неон для интерьера, офисов, баров и фотозон на заказ."
      },
      {
        title: "Интерьерные лого",
        price: SITE_PRICES.interiorLogo,
        link: SITE_LINKS.services.interior,
        image: getCdnUrl("/images/pages/services-interior.webp"),
        tags: ["Тонкий акрил", "Ресепшн", "Контражур"],
        description: "Стильные интерьерные логотипы для зоны ресепшн и офисов компаний."
      },
      {
        title: "Таблички и Навигация",
        price: SITE_PRICES.navigation,
        link: SITE_LINKS.services.navigation,
        image: getCdnUrl("/images/pages/services-navigation.webp"),
        tags: ["Указатели", "Стенды", "Акрил"],
        description: "Кабинетные таблички, указатели и системы навигации для бизнес-центров."
      },
      {
        title: "Баннеры и стенды",
        price: SITE_PRICES.bannersPlates,
        link: SITE_LINKS.services.bannersPlates,
        image: getCdnUrl("/images/banners-plates/1.webp"),
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
        link: SITE_LINKS.services.roofInstallations,
        image: getCdnUrl("/images/pages/services-roof-installations.webp"),
        tags: ["Документация", "Нагрузки", "Масштаб"],
        description: "Грандиозные масштабные рекламные конструкции на крышах зданий."
      },
      {
        title: "Входные группы",
        price: "Проектно",
        link: SITE_LINKS.services.entranceGroups,
        image: getCdnUrl("/images/pages/services-entrance-groups.webp"),
        tags: ["Козырьки", "Колонны", "Дизайн-проект"],
        description: "Комплексное оформление входа в магазин, банк или офис: козырьки, облицовка."
      },
      {
        title: "Стелы и Пилоны",
        price: SITE_PRICES.pylons,
        link: SITE_LINKS.services.pylons,
        image: getCdnUrl("/images/pages/services-pylons.webp"),
        tags: ["Фундамент", "Для АЗС", "Навигация"],
        description: "Отдельно стоящие рекламные стелы, пилоны и указатели направления."
      },
      {
        title: "LED-экраны",
        price: SITE_PRICES.ledScreens,
        link: SITE_LINKS.services.ledScreens,
        image: getCdnUrl("/images/led-screens/1.jpg"),
        tags: ["Медиафасады", "Бегущие строки", "Яркость"],
        description: "Установка уличных и интерьерных светодиодных LED-экранов под ключ в Астане."
      },
      {
        title: "Вывески на выставку",
        price: SITE_PRICES.exhibitionStands,
        link: SITE_LINKS.services.exhibitionStands,
        image: getCdnUrl("/images/exhibition-stands/1.jpg"),
        tags: ["EXPO Астана", "Промо-зоны", "Быстрая сборка"],
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
        price: SITE_PRICES.brandingCars,
        link: SITE_LINKS.services.brandingCars,
        image: getCdnUrl("/images/pages/services-branding-cars.png"),
        tags: ["Оклейка авто", "Винил Oracal", "Реклама на колесах"],
        description: "Оклейка коммерческого транспорта виниловой пленкой с рекламой компании."
      },
      {
        title: "Ремонт вывесок",
        price: SITE_PRICES.signboardRepair,
        link: SITE_LINKS.services.signboardRepair,
        image: getCdnUrl("/images/signboard-repair/1.gif"),
        tags: ["Диагностика", "Светодиоды Samsung", "Срочный выезд"],
        description: "Ремонт, модернизация на диоды, чистка и техническое обслуживание вывесок."
      },
      {
        title: "Согласование вывесок",
        price: SITE_PRICES.designCode,
        link: SITE_LINKS.designCode,
        image: getCdnUrl("/images/pages/dk_approved.png"),
        tags: ["e-Otinish", "Акимат Астаны", "100% Законно"],
        description: "Разработка эскизных проектов и полное сопровождение подачи на согласование."
      },
      {
        title: "Архитектурная подсветка",
        price: SITE_PRICES.architecturalLighting,
        link: SITE_LINKS.services.architecturalLighting,
        image: getCdnUrl("/images/architectural-lighting/1.jpg"),
        tags: ["Фасадный свет", "LED неон", "Дизайн освещения"],
        description: "Проектирование и монтаж контурной светодиодной подсветки фасадов коммерческих зданий."
      }
    ]
  }
];
