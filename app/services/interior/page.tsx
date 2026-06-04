// app/services/interior/page.tsx

import Link from "next/link";
import { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import { getImagesFromFolder } from "@/lib/serverUtils";
import { interiorDetails } from "@/dictionaries/services/details/interior";

// --- ИМПОРТ ЛОКАЛЬНЫХ ПРЕЗЕНТЕРОВ (COLOCATION POLICY) ---
import InteriorHero from "./_components/InteriorHero";
import InteriorConcept from "./_components/InteriorConcept";
import InteriorCatalog from "./_components/InteriorCatalog";
import InteriorComparison from "./_components/InteriorComparison";
import InteriorPricing from "./_components/InteriorPricing";
import InteriorFAQ from "./_components/InteriorFAQ";
import InteriorRules from "./_components/InteriorRules";
import InteriorSteps from "./_components/InteriorSteps";
import InteriorCareGuide from "./_components/InteriorCareGuide";
import InteriorExpertTips from "./_components/InteriorExpertTips";

// --- ИМПОРТ ГЛОБАЛЬНЫХ КОМПОНЕНТОВ ---
import ClientsMarquee from "@/components/ClientsMarquee";
import CallToAction from "@/components/CallToAction";
import ServicesCarousel from "@/components/ServicesCarousel";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import ImageGallery from "@/components/ImageGallery";

// 1. ДИНАМИЧЕСКИЕ МЕТАДАННЫЕ (GEO/SEO API)
export const metadata: Metadata = constructMetadata({
  title: interiorDetails.seoTitle,
  description: interiorDetails.seoDesc,
  canonicalUrl: "https://adlight.kz/services/interior",
  keywords: interiorDetails.keywords
});

export default async function InteriorServicePage() {
  const galleryImages = getImagesFromFolder("interior");
  
  const displayHeroImages = galleryImages.length > 0 
    ? galleryImages.slice(0, 15) 
    : ["/images/pages/services-interior.png", "/images/calc/face.jpg"];

  // 2. ГЕНЕРАЦИЯ SCHEMA ДЛЯ ПОИСКОВИКОВ И ИИ (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": "https://adlight.kz/services/interior#product",
        "name": "Изготовление интерьерных вывесок и логотипов в офис в Астане",
        "image": "https://adlight.kz/images/pages/services-interior.png",
        "description": "Профессиональное изготовление вывесок для зоны ресепшн, переговорных и офисов. Световые логотипы, контражурная подсветка, акрил и сталь.",
        "brand": {
          "@type": "Brand",
          "name": "ADLight"
        },
        "offers": {
          "@type": "AggregateOffer",
          "priceCurrency": "KZT",
          "lowPrice": "35000",
          "highPrice": "250000",
          "offerCount": "3",
          "offers": [
            {
              "@type": "Offer",
              "name": "Плоский логотип из акрила (5мм)",
              "price": "35000",
              "priceCurrency": "KZT"
            },
            {
              "@type": "Offer",
              "name": "Световой контражурный логотип в офис",
              "price": "55000",
              "priceCurrency": "KZT"
            }
          ]
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "18",
          "bestRating": "5",
          "worstRating": "1"
        },
        "review": [
          {
            "@type": "Review",
            "author": {
              "@type": "Person",
              "name": "Тимур"
            },
            "datePublished": "2026-03-10",
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "5"
            },
            "reviewBody": "Заказывали зеркальный металлический логотип с контражурной подсветкой на ресепшен. Выглядит просто шикарно! Смонтировали в белых перчатках, аккуратно, строительную пыль сразу убрали пылесосом. Настоящие профессионалы."
          }
        ]
      },
      {
        "@type": "Service",
        "@id": "https://adlight.kz/services/interior#service",
        "name": interiorDetails.title,
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
        "description": interiorDetails.subtitle,
        "offers": {
          "@type": "Offer",
          "url": "https://adlight.kz/services/interior",
          "priceCurrency": "KZT",
          "price": interiorDetails.price.replace(/\D/g, ''),
          "availability": "https://schema.org/InStock"
        }
      },
      {
        "@type": "HowTo",
        "@id": "https://adlight.kz/services/interior#howto",
        "name": "Как заказать интерьерный логотип в Астане",
        "description": "Пошаговый процесс от замеров и выбора материалов основы до чистового монтажа вывески в офисе.",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Замеры и ТЗ",
            "text": "Выезд нашего специалиста на замеры, оценка текстуры стен и обсуждение вывода проводов."
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "3D-проект",
            "text": "Разработка дизайн-проекта логотипа в векторе и привязка к фотографии ресепшена."
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Производство",
            "text": "Лазерная нарезка акрила, фрезеровка торцов и распайка контражурной светодиодной ленты."
          },
          {
            "@type": "HowToStep",
            "position": 4,
            "name": "Монтаж",
            "text": "Чистовой монтаж конструкции в офисе с пылесосом строго по разметке-трафарету."
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://adlight.kz/services/interior#faq",
        "mainEntity": interiorDetails.faqs.map(item => ({
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
      <InteriorHero heroImages={displayHeroImages} />

      {/* 2. БЕГУЩАЯ СТРОКА */}
      <ClientsMarquee />

      {/* 3. CONCEPT SECTION */}
      <InteriorConcept fallbackImage={displayHeroImages[0]} />

      {/* 4. КАТАЛОГ РЕШЕНИЙ */}
      <InteriorCatalog />

      {/* 4.1 СОВЕТЫ ГЛАВНОГО ТЕХНОЛОГА */}
      <InteriorExpertTips />

      {/* 5. ТЕХНИЧЕСКИЙ СРАВНИТЕЛЬНЫЙ БЛОК */}
      <InteriorComparison />

      {/* 6. ЦЕНЫ И ПРИМЕР СМЕТЫ */}
      <InteriorPricing />

      {/* 7. ДИЗАЙН-КОД */}
      <InteriorRules />

      {/* 7.2 ЭТАПЫ РАБОТЫ */}
      <InteriorSteps />

      {/* 8. FAQ */}
      <InteriorFAQ />

      {/* 9. ГАЛЕРЕЯ */}
      <section className="py-24 bg-slate-50 border-t border-slate-200/80">
        <div className="container mx-auto px-4 mb-12 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Наши работы</h2>
          <p className="text-slate-500">Примеры оформленных офисов и зон ресепшн в Астане</p>
        </div>
        <div className="container mx-auto px-4">
          {galleryImages.length > 0 ? (
            <ImageGallery 
              images={galleryImages} 
              projectTitle="Изготовление интерьерных вывесок и логотипов в Астане"
            /> 
          ) : (
            <div className="text-center text-slate-500 py-12 border border-dashed border-slate-200 rounded-2xl max-w-md mx-auto">
              Загрузите фотографии в папку public/images/interior
            </div>
          )}
        </div>
      </section>

      {/* 9.1 КЛИМАТИЧЕСКАЯ ЭКСПЛУАТАЦИЯ */}
      <InteriorCareGuide />

      {/* 10. ОТЗЫВЫ И CTA */}
      <ReviewsCarousel />
      <ServicesCarousel title="Другие услуги" subtitle="Комплексный подход к вашему бренду" hiddenLink="/services/interior" />
      <CallToAction source="Услуга: Интерьерные вывески" />
    </main>
  );
}
