// app/services/entrance-groups/page.tsx

import { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import { getImagesFromFolder } from "@/lib/serverUtils";
import { entrance_groupsDetails } from "@/dictionaries/services/details/entrance-groups";

// --- ИМПОРТ ЛОКАЛЬНЫХ ПРЕЗЕНТЕРОВ (COLOCATION POLICY) ---
import EntranceHero from "./_components/EntranceHero";
import EntranceConcept from "./_components/EntranceConcept";
import EntranceCatalog from "./_components/EntranceCatalog";
import EntranceExpertTips from "./_components/EntranceExpertTips";
import EntranceComparison from "./_components/EntranceComparison";
import EntrancePricing from "./_components/EntrancePricing";
import EntranceRules from "./_components/EntranceRules";
import EntranceSteps from "./_components/EntranceSteps";
import EntranceFAQ from "./_components/EntranceFAQ";
import EntranceCareGuide from "./_components/EntranceCareGuide";

// --- ИМПОРТ ГЛОБАЛЬНЫХ КОМПОНЕНТОВ ---
import ClientsMarquee from "@/components/ClientsMarquee";
import CallToAction from "@/components/CallToAction";
import ServicesCarousel from "@/components/ServicesCarousel";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import ImageGallery from "@/components/ImageGallery";

// 1. ДИНАМИЧЕСКИЕ МЕТАДАННЫЕ (GEO/SEO API)
export const metadata: Metadata = constructMetadata({
  title: entrance_groupsDetails.seoTitle,
  description: entrance_groupsDetails.seoDesc,
  canonicalUrl: "https://adlight.kz/services/entrance-groups",
  keywords: entrance_groupsDetails.keywords
});

export default async function EntranceGroupsPage() {
  const galleryImages = getImagesFromFolder("entrance-groups");
  
  const displayHeroImages = galleryImages.length > 0 
    ? galleryImages.slice(0, 15) 
    : ["/images/calc/lightbox-1.jpg", "/images/calc/face.jpg"];

  // 2. ГЕНЕРАЦИЯ SCHEMA ДЛЯ ПОИСКОВИКОВ И ИИ (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": "https://adlight.kz/services/entrance-groups#product",
        "name": "Комплексное оформление входных групп в Астане под ключ",
        "image": "https://adlight.kz/images/pages/services-entrance.webp",
        "description": "Профессиональный монтаж козырьков, обшивка стен композитными панелями (алюкобонд), изготовление фасадных вывесок и согласование.",
        "brand": {
          "@type": "Brand",
          "name": "ADLight"
        },
        "offers": {
          "@type": "AggregateOffer",
          "priceCurrency": "KZT",
          "lowPrice": "50000",
          "highPrice": "2500000",
          "offerCount": "3",
          "offers": [
            {
              "@type": "Offer",
              "name": "Разработка эскизного проекта входной группы фасада",
              "price": "50000",
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
              "name": "Нурлан"
            },
            "datePublished": "2026-04-05",
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "5"
            },
            "reviewBody": "Заказали у ребят из ADLight полное оформление входной группы: обшили стены алюкобондом, сделали козырек со встроенной подсветкой и смонтировали объемные буквы с контражуром. Всё выполнено на высшем уровне, углы идеальные, помогли с получением паспорта рекламы."
          }
        ]
      },
      {
        "@type": "Service",
        "@id": "https://adlight.kz/services/entrance-groups#service",
        "name": entrance_groupsDetails.title,
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
        "description": entrance_groupsDetails.subtitle,
        "offers": {
          "@type": "Offer",
          "url": "https://adlight.kz/services/entrance-groups",
          "priceCurrency": "KZT",
          "price": "50000",
          "availability": "https://schema.org/InStock"
        }
      },
      {
        "@type": "HowTo",
        "@id": "https://adlight.kz/services/entrance-groups#howto",
        "name": "Как заказать оформление входной группы в Астане",
        "description": "Пошаговый процесс от замера фасада и 3D моделирования до монтажа козырька и обшивки композитными панелями.",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Замер и фотофиксация",
            "text": "Лазерное сканирование габаритов фасада и дверного проема."
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "Разработка 3D макета",
            "text": "Подготовка визуализации входной группы для согласования с Акиматом."
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Сварочные работы и обшивка",
            "text": "Сборка силового каркаса и фрезеровка кассет из композита на ЧПУ."
          },
          {
            "@type": "HowToStep",
            "position": 4,
            "name": "Финальный монтаж",
            "text": "Навешивание облицовки, монтаж козырька, установка вывески и пусконаладка подсветки."
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://adlight.kz/services/entrance-groups#faq",
        "mainEntity": entrance_groupsDetails.faqs.map(item => ({
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
      <EntranceHero heroImages={displayHeroImages} />

      {/* 2. БЕГУЩАЯ СТРОКА */}
      <ClientsMarquee />

      {/* 3. CONCEPT SECTION */}
      <EntranceConcept fallbackImage={displayHeroImages[0]} />

      {/* 4. КАТАЛОГ РЕШЕНИЙ */}
      <EntranceCatalog />

      {/* 4.1 СОВЕТЫ ГЛАВНОГО ТЕХНОЛОГА */}
      <EntranceExpertTips />

      {/* 5. ТЕХНИЧЕСКИЙ СРАВНИТЕЛЬНЫЙ БЛОК */}
      <EntranceComparison />

      {/* 6. ЦЕНЫ И ПРИМЕР СМЕТЫ */}
      <EntrancePricing />

      {/* 7. ДИЗАЙН-КОД */}
      <EntranceRules />

      {/* 7.2 ЭТАПЫ РАБОТЫ */}
      <EntranceSteps />

      {/* 8. FAQ */}
      <EntranceFAQ />

      {/* 9. ГАЛЕРЕЯ */}
      <section className="py-24 bg-slate-50 border-t border-slate-200/80">
        <div className="container mx-auto px-4 mb-12 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Наши работы</h2>
          <p className="text-slate-500">Примеры оформленных входных групп и фасадов в Астане</p>
        </div>
        <div className="container mx-auto px-4">
          {galleryImages.length > 0 ? (
            <ImageGallery 
              images={galleryImages} 
              projectTitle="Оформление фасадов и комплексных входных групп в Астане"
            /> 
          ) : (
            <div className="text-center text-slate-500 py-12 border border-dashed border-slate-200 rounded-2xl max-w-md mx-auto">
              Загрузите фотографии в папку public/images/entrance-groups
            </div>
          )}
        </div>
      </section>

      {/* 9.1 КЛИМАТИЧЕСКАЯ ЭКСПЛУАТАЦИЯ */}
      <EntranceCareGuide />

      {/* 10. ОТЗЫВЫ И CTA */}
      <ReviewsCarousel />
      <ServicesCarousel title="Другие услуги" subtitle="Комплексный подход к вашему бренду" hiddenLink="/services/entrance-groups" />
      <CallToAction source="Услуга: Входные группы" />
    </main>
  );
}
