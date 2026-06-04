// app/services/navigation/page.tsx

import Link from "next/link";
import { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import { getImagesFromFolder } from "@/lib/serverUtils";
import { navigationDetails } from "@/dictionaries/services/details/navigation";

// --- ИМПОРТ ЛОКАЛЬНЫХ ПРЕЗЕНТЕРОВ (COLOCATION POLICY) ---
import NavigationHero from "./_components/NavigationHero";
import NavigationConcept from "./_components/NavigationConcept";
import NavigationCatalog from "./_components/NavigationCatalog";
import NavigationComparison from "./_components/NavigationComparison";
import NavigationPricing from "./_components/NavigationPricing";
import NavigationFAQ from "./_components/NavigationFAQ";
import NavigationRules from "./_components/NavigationRules";
import NavigationSteps from "./_components/NavigationSteps";
import NavigationCareGuide from "./_components/NavigationCareGuide";
import NavigationExpertTips from "./_components/NavigationExpertTips";

// --- ИМПОРТ ГЛОБАЛЬНЫХ КОМПОНЕНТОВ ---
import ClientsMarquee from "@/components/ClientsMarquee";
import CallToAction from "@/components/CallToAction";
import ServicesCarousel from "@/components/ServicesCarousel";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import ImageGallery from "@/components/ImageGallery";

// 1. ДИНАМИЧЕСКИЕ МЕТАДАННЫЕ (GEO/SEO API)
export const metadata: Metadata = constructMetadata({
  title: navigationDetails.seoTitle,
  description: navigationDetails.seoDesc,
  canonicalUrl: "https://adlight.kz/services/navigation",
  keywords: navigationDetails.keywords
});

export default async function NavigationServicePage() {
  const galleryImages = getImagesFromFolder("navigation");
  
  const displayHeroImages = galleryImages.length > 0 
    ? galleryImages.slice(0, 15) 
    : ["/images/pages/services-navigation.webp", "/images/calc/face.jpg"];

  // 2. ГЕНЕРАЦИЯ SCHEMA ДЛЯ ПОИСКОВИКОВ И ИИ (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": "https://adlight.kz/services/navigation#product",
        "name": "Изготовление табличек и систем навигации в Астане под ключ",
        "image": "https://adlight.kz/images/pages/services-navigation.webp",
        "description": "Производство кабинетных табличек, поэтажных указателей, модульных стендов и планов пожарной эвакуации по ГОСТу в Астане.",
        "brand": {
          "@type": "Brand",
          "name": "ADLight"
        },
        "offers": {
          "@type": "AggregateOffer",
          "priceCurrency": "KZT",
          "lowPrice": "5000",
          "highPrice": "180000",
          "offerCount": "3",
          "offers": [
            {
              "@type": "Offer",
              "name": "Дверная табличка Rowmark с гравировкой",
              "price": "55000",
              "priceCurrency": "KZT"
            }
          ]
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "22",
          "bestRating": "5",
          "worstRating": "1"
        },
        "review": [
          {
            "@type": "Review",
            "author": {
              "@type": "Person",
              "name": "Айбек"
            },
            "datePublished": "2026-04-05",
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "5"
            },
            "reviewBody": "Заказывали комплексную навигацию для нового бизнес-центра Astana Tower. Реечные модульные стенды получились отличными, информацию менять очень просто. Таблички Rowmark выглядят как дорогой металл. Монтажники справились быстро и аккуратно."
          }
        ]
      },
      {
        "@type": "Service",
        "@id": "https://adlight.kz/services/navigation#service",
        "name": navigationDetails.title,
        "provider": { 
          "@type": "LocalBusiness", 
          "name": "ADLight",
          "image": "https://adlight.kz/icon.png",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "ул. Аспара 7",
            "addressLocality": "Астана",
            "addressCountry": "KZ"
          },
          "telephone": "+7 (707) 135-67-01"
        },
        "description": navigationDetails.subtitle,
        "offers": {
          "@type": "Offer",
          "url": "https://adlight.kz/services/navigation",
          "priceCurrency": "KZT",
          "price": navigationDetails.price.replace(/\D/g, ''),
          "availability": "https://schema.org/InStock"
        }
      },
      {
        "@type": "HowTo",
        "@id": "https://adlight.kz/services/navigation#howto",
        "name": "Как заказать систему навигации в Астане",
        "description": "Пошаговый процесс от аудита планировки здания и проектирования путей до производства и чистового монтажа указателей.",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Аудит маршрутов",
            "text": "Анализ планировки, выявление ключевых точек принятия решений и составление карты навигации."
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "Дизайн-проект",
            "text": "Разработка макетов указателей, подбор шрифтов, пиктограмм и материалов под интерьер."
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "ЧПУ производство",
            "text": "Лазерная гравировка пластика Rowmark, УФ-печать, сборка модульных алюминиевых реек."
          },
          {
            "@type": "HowToStep",
            "position": 4,
            "name": "Монтаж на объекте",
            "text": "Профессиональный монтаж табличек, настенных и подвесных систем строго по лазерной разметке."
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://adlight.kz/services/navigation#faq",
        "mainEntity": navigationDetails.faqs.map(item => ({
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
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-orange-500/10 selection:text-orange-600 overflow-x-clip">
      {/* Внедряем JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. HERO SECTION */}
      <NavigationHero heroImages={displayHeroImages} />

      {/* 2. БЕГУЩАЯ СТРОКА */}
      <ClientsMarquee />

      {/* 3. CONCEPT SECTION */}
      <NavigationConcept fallbackImage={displayHeroImages[0]} />

      {/* 4. КАТАЛОГ РЕШЕНИЙ */}
      <NavigationCatalog />

      {/* 4.1 СОВЕТЫ ГЛАВНОГО ТЕХНОЛОГА */}
      <NavigationExpertTips />

      {/* 5. ТЕХНИЧЕСКИЙ СРАВНИТЕЛЬНЫЙ БЛОК */}
      <NavigationComparison />

      {/* 6. ЦЕНЫ И ПРИМЕР СМЕТЫ */}
      <NavigationPricing />

      {/* 7. ДИЗАЙН-КОД */}
      <NavigationRules />

      {/* 7.2 ЭТАПЫ РАБОТЫ */}
      <NavigationSteps />

      {/* 8. FAQ */}
      <NavigationFAQ />

      {/* 9. ГАЛЕРЕЯ */}
      <section className="py-24 bg-slate-50 border-t border-slate-200/80">
        <div className="container mx-auto px-4 mb-12 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Наши работы</h2>
          <p className="text-slate-500">Примеры реализованных систем навигации в Астане</p>
        </div>
        <div className="container mx-auto px-4">
          {galleryImages.length > 0 ? (
            <ImageGallery 
              images={galleryImages} 
              projectTitle="Изготовление указателей и систем навигации в Астане"
            /> 
          ) : (
            <div className="text-center text-slate-500 py-12 border border-dashed border-slate-200 rounded-2xl max-w-md mx-auto">
              Загрузите фотографии в папку public/images/navigation
            </div>
          )}
        </div>
      </section>

      {/* 9.1 КЛИМАТИЧЕСКАЯ ЭКСПЛУАТАЦИЯ */}
      <NavigationCareGuide />

      {/* 10. ОТЗЫВЫ И CTA */}
      <ReviewsCarousel />
      <ServicesCarousel title="Другие услуги" subtitle="Комплексный подход к вашему бренду" hiddenLink="/services/navigation" />
      <CallToAction source="Услуга: Системы навигации" />
    </main>
  );
}
