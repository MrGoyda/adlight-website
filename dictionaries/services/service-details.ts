// dictionaries/services/service-details.ts

export interface ServiceTypeItem {
  title: string;
  desc: string;
  image: string;
  tag?: string;
  iconName?: string;
  specs?: string;
  bestFor?: string;
  hex?: string;
}

export interface ServiceComparisonItem {
  title: string;
  badge?: string;
  iconName?: string;
  items: { bold: string; normal: string }[];
}

export interface ServiceRuleItem {
  title: string;
  desc: string;
}

export interface ServiceRules {
  allowed: ServiceRuleItem[];
  forbidden: ServiceRuleItem[];
}

export interface ServiceStepItem {
  step: string;
  title: string;
  desc: string;
}

export interface ServiceCareTip {
  step: string;
  title: string;
  desc: string;
}

export interface ServiceCareGuide {
  title: string;
  subtitle: string;
  tips: ServiceCareTip[];
}

export interface ServiceExpertTip {
  title: string;
  desc: string;
  iconName: string;
}

export interface ServiceOfferItem {
  name: string;
  price: string;
  priceCurrency: string;
}

export interface ServiceReviewItem {
  author: string;
  datePublished: string;
  ratingValue: string;
  reviewBody: string;
}

export interface ServiceDetailData {
  slug: string;
  title: string;
  subtitle: string;
  price: string;
  priceSuffix?: string;
  badge: string;
  seoTitle: string;
  seoDesc: string;
  keywords: string[];
  
  // Hero Visual Details
  heroTag: string;
  priceColor: "blue" | "purple" | "orange" | "green" | "indigo" | "teal";
  heroVisualType: "box" | "zap" | "star" | "map" | "wind" | "store";
  heroBadgeText?: string;
  heroBadgeSubtext?: string;
  heroBadgeIcon?: string;

  // Concept Section
  conceptTitle: string;
  conceptDesc: string;
  conceptQuote?: string;
  conceptHighlights: { title: string; desc: string; iconName: string }[];
  conceptVisualType: "beauty" | "window" | "road" | "scheme" | "interior";

  // Sub-types/portfolio types
  typesTitle: string;
  typesSubtitle: string;
  types: ServiceTypeItem[];

  // Comparison Block
  comparisonTitle: string;
  comparisonDesc: string;
  comparisonA: ServiceComparisonItem;
  comparisonB: ServiceComparisonItem;

  // Pricing Block
  pricingTitle: string;
  pricingDesc: string;
  pricingItems: { label: string; value: string }[];
  pricingCalculatorPlaceholder: string;
  pricingActionText: string;

  // FAQ List
  faqs: { question: string; answer: string; iconName: string }[];

  // DRY Configurable layouts
  rules?: ServiceRules;
  steps?: ServiceStepItem[];
  careGuide?: ServiceCareGuide;
  expertTips?: {
    title: string;
    subtitle: string;
    expertId: string;
    expertQuote: string;
    tips: ServiceExpertTip[];
  };

  // Schema & Rich metadata extensions
  subOffers?: ServiceOfferItem[];
  reviews?: ServiceReviewItem[];

  // Conditional layout flags
  hasCalculatorBanner?: boolean;
  hasDesignCodeBlock?: boolean;
}


// Import modular service details
import { panel_bracketsDetails } from "./details/panel-brackets";
import { neonDetails } from "./details/neon";
import { interiorDetails } from "./details/interior";
import { navigationDetails } from "./details/navigation";
import { roof_installationsDetails } from "./details/roof-installations";
import { pylonsDetails } from "./details/pylons";
import { entrance_groupsDetails } from "./details/entrance-groups";
import { facade_decorationDetails } from "./details/facade-decoration";
import { branding_carsDetails } from "./details/branding-cars";
import { signboard_repairDetails } from "./details/signboard-repair";
import { exhibition_standsDetails } from "./details/exhibition-stands";
import { window_brandingDetails } from "./details/window-branding";
import { led_screensDetails } from "./details/led-screens";
import { architectural_lightingDetails } from "./details/architectural-lighting";
import { banners_platesDetails } from "./details/banners-plates";
import { lightboxesDetails } from "./details/lightboxes";

import { getCdnUrl } from "@/lib/serverUtils";

export const SERVICES_DETAILS: Record<string, ServiceDetailData> = {
  "panel-brackets": panel_bracketsDetails,
  "neon": neonDetails,
  "interior": interiorDetails,
  "navigation": navigationDetails,
  "roof-installations": roof_installationsDetails,
  "pylons": pylonsDetails,
  "entrance-groups": entrance_groupsDetails,
  "facade-decoration": facade_decorationDetails,
  "branding-cars": branding_carsDetails,
  "signboard-repair": signboard_repairDetails,
  "exhibition-stands": exhibition_standsDetails,
  "window-branding": window_brandingDetails,
  "led-screens": led_screensDetails,
  "architectural-lighting": architectural_lightingDetails,
  "banners-plates": banners_platesDetails,
  "lightboxes": lightboxesDetails,
};

// Автоматическое преобразование всех внутренних картинок в CDN ссылки
Object.values(SERVICES_DETAILS).forEach((service) => {
  if (service.types) {
    service.types = service.types.map((type) => ({
      ...type,
      image: getCdnUrl(type.image),
    }));
  }
});

export const SERVICES_DETAILS_UI = {
  notFound: "Услуга не найдена",
  calculator: {
    title: "Рассчитайте точную цену за 1 минуту",
    description: "Интеллектуальный калькулятор на нашем сайте моментально рассчитает ориентировочную стоимость вашей конструкции онлайн. Выберите желаемые параметры и получите моментальный сметный расчет.",
    buttonText: "Перейти в калькулятор"
  },
  gallery: {
    title: "Наши работы",
    subtitle: "Примеры выполненных работ",
    projectTitleTemplate: "Изготовление и монтаж {title} в Астане",
    placeholderTemplate: "Загрузите фотографии в папку public/images/{slug}"
  },
  carousel: {
    title: "Другие услуги",
    subtitle: "Комплексный подход к вашему бренду"
  }
};
