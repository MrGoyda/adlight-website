// app/services/neon/page.tsx

import Link from "next/link";
import { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import { getImagesFromFolder } from "@/lib/serverUtils";
import { neonDetails } from "@/dictionaries/services/details/neon";

// --- ИМПОРТ ЛОКАЛЬНЫХ ПРЕЗЕНТЕРОВ (COLOCATION POLICY) ---
import NeonHero from "./_components/NeonHero";
import NeonConcept from "./_components/NeonConcept";
import NeonCatalog from "./_components/NeonCatalog";
import NeonComparison from "./_components/NeonComparison";
import NeonPricing from "./_components/NeonPricing";
import NeonFAQ from "./_components/NeonFAQ";
import NeonRules from "./_components/NeonRules";
import NeonSteps from "./_components/NeonSteps";
import NeonCareGuide from "./_components/NeonCareGuide";
import NeonExpertTips from "./_components/NeonExpertTips";

// --- ИМПОРТ ГЛОБАЛЬНЫХ КОМПОНЕНТОВ ---
import ClientsMarquee from "@/components/ClientsMarquee";
import CallToAction from "@/components/CallToAction";
import ServicesCarousel from "@/components/ServicesCarousel";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import ImageGallery from "@/components/ImageGallery";

// 1. ДИНАМИЧЕСКИЕ МЕТАДАННЫЕ (GEO/SEO API)
export const metadata: Metadata = constructMetadata({
  title: neonDetails.seoTitle,
  description: neonDetails.seoDesc,
  canonicalUrl: "https://adlight.kz/services/neon",
  keywords: neonDetails.keywords
});

export default async function NeonServicePage() {
  const galleryImages = getImagesFromFolder("neon");
  
  const displayHeroImages = galleryImages.length > 0 
    ? galleryImages.slice(0, 15) 
    : ["/images/calc/neon-1.jpg", "/images/calc/neon-2.jpg"];

  // 2. ГЕНЕРАЦИЯ SCHEMA ДЛЯ ПОИСКОВИКОВ И ИИ (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": "https://adlight.kz/services/neon#product",
        "name": "Изготовление вывесок и надписей из гибкого LED неона в Астане",
        "image": "https://adlight.kz/images/pages/services-neon.webp",
        "description": "Профессиональное производство вывесок, логотипов и надписей из гибкого силиконового неона. Безопасно, ярко, долговечно.",
        "brand": {
          "@type": "Brand",
          "name": "ADLight"
        },
        "offers": {
          "@type": "AggregateOffer",
          "priceCurrency": "KZT",
          "lowPrice": "8000",
          "highPrice": "150000",
          "offerCount": "3",
          "offers": [
            {
              "@type": "Offer",
              "name": "Неоновая вывеска (Силикон) 6мм",
              "price": "8000",
              "priceCurrency": "KZT"
            }
          ]
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "21",
          "bestRating": "5",
          "worstRating": "1"
        },
        "review": [
          {
            "@type": "Review",
            "author": {
              "@type": "Person",
              "name": "Алия"
            },
            "datePublished": "2026-02-15",
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "5"
            },
            "reviewBody": "Заказали неоновую вывеску для нашей кофейни в Астане. Светит невероятно ярко, сделали очень аккуратно, прозрачная основа и пайка идеальные! Огромное спасибо за качество."
          }
        ]
      },
      {
        "@type": "Service",
        "@id": "https://adlight.kz/services/neon#service",
        "name": neonDetails.title,
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
        "description": neonDetails.subtitle,
        "offers": {
          "@type": "Offer",
          "url": "https://adlight.kz/services/neon",
          "priceCurrency": "KZT",
          "price": neonDetails.price.replace(/\D/g, ''),
          "availability": "https://schema.org/InStock"
        }
      },
      {
        "@type": "HowTo",
        "@id": "https://adlight.kz/services/neon#howto",
        "name": "Как заказать неоновую вывеску в Астане",
        "description": "Пошаговый процесс от разработки шрифтового макета до монтажа и безопасного подключения неона.",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Разработка макета",
            "text": "Подбор шрифта, цвета силикона и согласование размеров неоновой вывески с дизайнером."
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "Фрезеровка основы",
            "text": "Раскрой акрилового задника на ЧПУ станке с нанесением каналов для позиционирования неона."
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Пайка и сборка",
            "text": "Вклейка неона в пазы, распайка соединений прозрачным кабелем и герметизация контактов."
          },
          {
            "@type": "HowToStep",
            "position": 4,
            "name": "Монтаж",
            "text": "Крепление вывески на стену, подвешивание на цепочки или тросы и подключение к розетке."
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://adlight.kz/services/neon#faq",
        "mainEntity": neonDetails.faqs.map(item => ({
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
      <NeonHero heroImages={displayHeroImages} />

      {/* 2. БЕГУЩАЯ СТРОКА */}
      <ClientsMarquee />

      {/* 3. CONCEPT SECTION */}
      <NeonConcept fallbackImage={displayHeroImages[0]} />

      {/* 4. КАТАЛОГ РЕШЕНИЙ */}
      <NeonCatalog />

      {/* 4.1 СОВЕТЫ ГЛАВНОГО ТЕХНОЛОГА */}
      <NeonExpertTips />

      {/* 5. ТЕХНИЧЕСКИЙ СРАВНИТЕЛЬНЫЙ БЛОК */}
      <NeonComparison />

      {/* 6. ЦЕНЫ И ПРИМЕР СМЕТЫ */}
      <NeonPricing />

      {/* 7. ДИЗАЙН-КОД */}
      <NeonRules />

      {/* 7.2 ЭТАПЫ РАБОТЫ */}
      <NeonSteps />

      {/* 8. FAQ */}
      <NeonFAQ />

      {/* 9. ГАЛЕРЕЯ */}
      <section className="py-24 bg-slate-50 border-t border-slate-200/80">
        <div className="container mx-auto px-4 mb-12 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Наши работы</h2>
          <p className="text-slate-500">Примеры изготовленных и установленных неоновых вывесок в Астане</p>
        </div>
        <div className="container mx-auto px-4">
          {galleryImages.length > 0 ? (
            <ImageGallery 
              images={galleryImages} 
              projectTitle="Изготовление неоновых вывесок и надписей в Астане"
            /> 
          ) : (
            <div className="text-center text-slate-500 py-12 border border-dashed border-slate-200 rounded-2xl max-w-md mx-auto">
              Загрузите фотографии в папку public/images/neon
            </div>
          )}
        </div>
      </section>

      {/* 9.1 КЛИМАТИЧЕСКАЯ ЭКСПЛУАТАЦИЯ */}
      <NeonCareGuide />

      {/* 10. ОТЗЫВЫ И CTA */}
      <ReviewsCarousel />
      <ServicesCarousel title="Другие услуги" subtitle="Комплексный подход к вашему бренду" hiddenLink="/services/neon" />
      <CallToAction source="Услуга: Неоновые вывески" />
    </main>
  );
}
