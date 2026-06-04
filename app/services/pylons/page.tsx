// app/services/pylons/page.tsx

import { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import { getImagesFromFolder } from "@/lib/serverUtils";
import { pylonsDetails } from "@/dictionaries/services/details/pylons";

// --- ИМПОРТ ЛОКАЛЬНЫХ ПРЕЗЕНТЕРОВ (COLOCATION POLICY) ---
import PylonsHero from "./_components/PylonsHero";
import PylonsConcept from "./_components/PylonsConcept";
import PylonsCatalog from "./_components/PylonsCatalog";
import PylonsExpertTips from "./_components/PylonsExpertTips";
import PylonsComparison from "./_components/PylonsComparison";
import PylonsPricing from "./_components/PylonsPricing";
import PylonsRules from "./_components/PylonsRules";
import PylonsSteps from "./_components/PylonsSteps";
import PylonsFAQ from "./_components/PylonsFAQ";
import PylonsCareGuide from "./_components/PylonsCareGuide";

// --- ИМПОРТ ГЛОБАЛЬНЫХ КОМПОНЕНТОВ ---
import ClientsMarquee from "@/components/ClientsMarquee";
import CallToAction from "@/components/CallToAction";
import ServicesCarousel from "@/components/ServicesCarousel";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import ImageGallery from "@/components/ImageGallery";

// 1. ДИНАМИЧЕСКИЕ МЕТАДАННЫЕ (GEO/SEO API)
export const metadata: Metadata = constructMetadata({
  title: pylonsDetails.seoTitle,
  description: pylonsDetails.seoDesc,
  canonicalUrl: "https://adlight.kz/services/pylons",
  keywords: pylonsDetails.keywords
});

export default async function PylonsPage() {
  const galleryImages = getImagesFromFolder("pylons");
  
  const displayHeroImages = galleryImages.length > 0 
    ? galleryImages.slice(0, 15) 
    : ["/images/calc/lightbox-1.jpg", "/images/calc/face.jpg"];

  // 2. ГЕНЕРАЦИЯ SCHEMA ДЛЯ ПОИСКОВИКОВ И ИИ (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": "https://adlight.kz/services/pylons#product",
        "name": "Изготовление и монтаж рекламных стел и пилонов в Астане под ключ",
        "image": "https://adlight.kz/images/pages/services-pylons.webp",
        "description": "Производство отдельно стоящих рекламных стел для АЗС, ТРЦ, автосалонов и навигационных пилонов с расчетом фундамента КЖ.",
        "brand": {
          "@type": "Brand",
          "name": "ADLight"
        },
        "offers": {
          "@type": "AggregateOffer",
          "priceCurrency": "KZT",
          "lowPrice": "100000",
          "highPrice": "2800000",
          "offerCount": "3",
          "offers": [
            {
              "@type": "Offer",
              "name": "Разработка чертежей КМ/КЖ для рекламной стелы",
              "price": "100000",
              "priceCurrency": "KZT"
            }
          ]
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "5.0",
          "reviewCount": "15",
          "bestRating": "5",
          "worstRating": "1"
        },
        "review": [
          {
            "@type": "Review",
            "author": {
              "@type": "Person",
              "name": "Бауыржан"
            },
            "datePublished": "2026-04-18",
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "5"
            },
            "reviewBody": "Заказывали уличный навигационный пилон высотой 3.5 метра для автосалона. ADLight сделали все оперативно: подготовили проект фундамента, согласовали АПЗ и смонтировали за один день. Стела выглядит шикарно, ровная обшивка и очень яркий светодиодный логотип."
          }
        ]
      },
      {
        "@type": "Service",
        "@id": "https://adlight.kz/services/pylons#service",
        "name": pylonsDetails.title,
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
        "description": pylonsDetails.subtitle,
        "offers": {
          "@type": "Offer",
          "url": "https://adlight.kz/services/pylons",
          "priceCurrency": "KZT",
          "price": "100000",
          "availability": "https://schema.org/InStock"
        }
      },
      {
        "@type": "HowTo",
        "@id": "https://adlight.kz/services/pylons#howto",
        "name": "Как заказать изготовление уличной рекламной стелы в Астане",
        "description": "Пошаговый процесс от геодезических изысканий до заливки железобетонного фундамента и финального монтажа конструкции.",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Геодезия и топосъемка",
            "text": "Анализ грунта и согласование расположения фундамента с подземными сетями."
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "Проект фундамента КЖ",
            "text": "Разработка чертежей армирования и заливки бетона ниже 1.8м."
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Сварка силового каркаса",
            "text": "Сборка несущей рамы из швеллеров и двутавровой балки в цеху."
          },
          {
            "@type": "HowToStep",
            "position": 4,
            "name": "Монтаж стелы",
            "text": "Подъем конструкции автокраном и монтаж опорной плиты к анкерной корзине."
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://adlight.kz/services/pylons#faq",
        "mainEntity": pylonsDetails.faqs.map(item => ({
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
      <PylonsHero heroImages={displayHeroImages} />

      {/* 2. БЕГУЩАЯ СТРОКА */}
      <ClientsMarquee />

      {/* 3. CONCEPT SECTION */}
      <PylonsConcept fallbackImage={displayHeroImages[0]} />

      {/* 4. КАТАЛОГ РЕШЕНИЙ */}
      <PylonsCatalog />

      {/* 4.1 СОВЕТЫ ГЛАВНОГО ТЕХНОЛОГА */}
      <PylonsExpertTips />

      {/* 5. ТЕХНИЧЕСКИЙ СРАВНИТЕЛЬНЫЙ БЛОК */}
      <PylonsComparison />

      {/* 6. ЦЕНЫ И ПРИМЕР СМЕТЫ */}
      <PylonsPricing />

      {/* 7. ДИЗАЙН-КОД */}
      <PylonsRules />

      {/* 7.2 ЭТАПЫ РАБОТЫ */}
      <PylonsSteps />

      {/* 8. FAQ */}
      <PylonsFAQ />

      {/* 9. ГАЛЕРЕЯ */}
      <section className="py-24 bg-slate-50 border-t border-slate-200/80">
        <div className="container mx-auto px-4 mb-12 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Наши работы</h2>
          <p className="text-slate-500">Примеры изготовленных и смонтированных стел и пилонов в Астане</p>
        </div>
        <div className="container mx-auto px-4">
          {galleryImages.length > 0 ? (
            <ImageGallery 
              images={galleryImages} 
              projectTitle="Изготовление и установка рекламных стел в Астане"
            /> 
          ) : (
            <div className="text-center text-slate-500 py-12 border border-dashed border-slate-200 rounded-2xl max-w-md mx-auto">
              Загрузите фотографии в папку public/images/pylons
            </div>
          )}
        </div>
      </section>

      {/* 9.1 КЛИМАТИЧЕСКАЯ ЭКСПЛУАТАЦИЯ */}
      <PylonsCareGuide />

      {/* 10. ОТЗЫВЫ И CTA */}
      <ReviewsCarousel />
      <ServicesCarousel title="Другие услуги" subtitle="Комплексный подход к вашему бренду" hiddenLink="/services/pylons" />
      <CallToAction source="Услуга: Рекламные стелы и пилоны" />
    </main>
  );
}
