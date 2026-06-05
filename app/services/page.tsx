// app/services/page.tsx

import { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import { CATALOG_SERVICES } from "@/dictionaries/services/catalog-services";
import { COMPANY_NAP } from "@/dictionaries/common";
import { SERVICES_CATALOG_UI } from "@/dictionaries/services/catalog-ui";
import ServicesHero from "./_components/ServicesHero";
import ServicesGrid from "./_components/ServicesGrid";
import ServicesFAQ from "./_components/ServicesFAQ";
import CallToAction from "@/components/CallToAction"; 

// 1. ДИНАМИЧЕСКИЕ МЕТАДАННЫЕ (GEO/SEO API)
export const metadata: Metadata = constructMetadata({
  title: SERVICES_CATALOG_UI.seo.title,
  description: SERVICES_CATALOG_UI.seo.description,
  canonicalUrl: "https://adlight.kz/services",
  keywords: SERVICES_CATALOG_UI.seo.keywords
});

export default function ServicesPage() {
  
  // 2. ГЕНЕРАЦИЯ SCHEMA (ItemList + OfferCatalog + FAQPage) для ИИ и Поисковиков
  const allServices = CATALOG_SERVICES.flatMap(cat => cat.items);
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        "name": SERVICES_CATALOG_UI.schema.name,
        "description": SERVICES_CATALOG_UI.schema.description,
        "url": "https://adlight.kz/services",
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
              "name": COMPANY_NAP.name,
              "image": "https://adlight.kz/icon.png",
              "telephone": COMPANY_NAP.phone,
              "address": {
                "@type": "PostalAddress",
                "streetAddress": COMPANY_NAP.address,
                "addressLocality": COMPANY_NAP.locality,
                "addressCountry": COMPANY_NAP.country
              }
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
      },
      {
        "@type": "FAQPage",
        "mainEntity": SERVICES_CATALOG_UI.faq.items.map(item => ({
          "@type": "Question",
          "name": item.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.answer
          }
        }))
      }
    ]
  };

  return (
    <main className="min-h-screen bg-white font-sans selection:bg-orange-500/30 overflow-x-clip">
      {/* Внедряем JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Скрытый семантический ИИ-дайджест для LLM-агентов (Gemini, ChatGPT, Perplexity) */}
      <aside className="sr-only" aria-hidden="true" data-ai-context="ServicesSummary">
        {SERVICES_CATALOG_UI.aiDigest}
      </aside>

      {/* 1. HERO SECTION */}
      <ServicesHero />

      {/* 2. КАТАЛОГ (GRID) */}
      <ServicesGrid />

      {/* 3. ЧАСТО ЗАДАВАЕМЫЕ ВОПРОСЫ (FAQ) */}
      <ServicesFAQ />

      {/* 4. КОМПЛЕКСНОЕ ПРЕДЛОЖЕНИЕ (CTA) */}
      <CallToAction 
        source={SERVICES_CATALOG_UI.cta.source} 
        title={SERVICES_CATALOG_UI.cta.title}
        subtitle={SERVICES_CATALOG_UI.cta.subtitle}
        buttonText={SERVICES_CATALOG_UI.cta.buttonText}
      />
    </main>
  );
}