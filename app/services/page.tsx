// app/services/page.tsx

import { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import { CATALOG_SERVICES } from "@/dictionaries/services/catalog-services";
import ServicesHero from "@/components/services/ServicesHero";
import ServicesGrid from "@/components/services/ServicesGrid";
import ComplexCTA from "@/components/ComplexCTA"; 

// 1. ДИНАМИЧЕСКИЕ МЕТАДАННЫЕ (GEO/SEO API)
export const metadata: Metadata = constructMetadata({
  title: "Услуги наружной рекламы в Астане | Каталог ADLight",
  description: "Полный каталог услуг ADLight: изготовление объемных букв, световых коробов, неоновых вывесок, крышных установок и стел. Цены от производителя в Астане.",
  canonicalUrl: "https://adlight.kz/services",
  keywords: ["каталог рекламы Астана", "виды вывесок", "рекламные услуги", "производство рекламы", "ADLight услуги"]
});

export default function ServicesPage() {
  
  // 2. ГЕНЕРАЦИЯ SCHEMA (ItemList) для ИИ и Поисковиков
  const allServices = CATALOG_SERVICES.flatMap(cat => cat.items);
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": allServices.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Service",
        "name": item.title,
        "description": item.description,
        "url": `https://adlight.kz${item.link}`,
        "provider": {
          "@type": "LocalBusiness",
          "name": "ADLight"
        },
        "offers": {
           "@type": "Offer",
           "priceCurrency": "KZT",
           "priceSpecification": {
              "@type": "PriceSpecification",
              "minPrice": item.price === "Проектно" || item.price === "Индивидуально" ? undefined : parseInt(item.price.replace(/\D/g, '')) || 0,
              "priceCurrency": "KZT"
           }
        }
      }
    }))
  };

  return (
    <main className="min-h-screen bg-[#020617] font-sans selection:bg-orange-500/30">
      {/* Внедряем JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. HERO SECTION */}
      <ServicesHero />

      {/* 2. КАТАЛОГ (GRID) */}
      <ServicesGrid />

      {/* 3. КОМПЛЕКСНОЕ ПРЕДЛОЖЕНИЕ (CTA) */}
      <ComplexCTA source="Страница: Каталог Услуг" />
    </main>
  );
}