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

export const SERVICES_DETAILS: Record<string, ServiceDetailData> = {
  "panel-brackets": panel_bracketsDetails,
  "neon": neonDetails,
  "interior": interiorDetails,
  "navigation": navigationDetails,
  "roof-installations": roof_installationsDetails,
  "pylons": pylonsDetails,
  "entrance-groups": entrance_groupsDetails,
  "facade-decoration": facade_decorationDetails,
};
