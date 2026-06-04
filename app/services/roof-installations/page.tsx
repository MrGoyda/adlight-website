// app/services/roof-installations/page.tsx

import { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import { getImagesFromFolder } from "@/lib/serverUtils";
import { roof_installationsDetails } from "@/dictionaries/services/details/roof-installations";

// --- ИМПОРТ ЛОКАЛЬНЫХ ПРЕЗЕНТЕРОВ (COLOCATION POLICY) ---
import RoofHero from "./_components/RoofHero";
import RoofConcept from "./_components/RoofConcept";
import RoofCatalog from "./_components/RoofCatalog";
import RoofExpertTips from "./_components/RoofExpertTips";
import RoofComparison from "./_components/RoofComparison";
import RoofPricing from "./_components/RoofPricing";
import RoofRules from "./_components/RoofRules";
import RoofSteps from "./_components/RoofSteps";
import RoofFAQ from "./_components/RoofFAQ";
import RoofCareGuide from "./_components/RoofCareGuide";

// --- ИМПОРТ ГЛОБАЛЬНЫХ КОМПОНЕНТОВ ---
import ClientsMarquee from "@/components/ClientsMarquee";
import CallToAction from "@/components/CallToAction";
import ServicesCarousel from "@/components/ServicesCarousel";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import ImageGallery from "@/components/ImageGallery";

// 1. ДИНАМИЧЕСКИЕ МЕТАДАННЫЕ (GEO/SEO API)
export const metadata: Metadata = constructMetadata({
  title: roof_installationsDetails.seoTitle,
  description: roof_installationsDetails.seoDesc,
  canonicalUrl: "https://adlight.kz/services/roof-installations",
  keywords: roof_installationsDetails.keywords
});

export default async function RoofInstallationsPage() {
  const galleryImages = getImagesFromFolder("roof-installations");
  
  const displayHeroImages = galleryImages.length > 0 
    ? galleryImages.slice(0, 15) 
    : ["/images/calc/lightbox-1.jpg", "/images/calc/face.jpg"];

  // 2. ГЕНЕРАЦИЯ SCHEMA ДЛЯ ПОИСКОВИКОВ И ИИ (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": "https://adlight.kz/services/roof-installations#product",
        "name": "Изготовление и высотный монтаж крышных установок в Астане",
        "image": "https://adlight.kz/images/pages/services-roof.webp",
        "description": "Проектирование силовой фермы, расчет ветровых нагрузок, изготовление объемных букв или медиаэкранов и монтаж на крышу под ключ в Астане.",
        "brand": {
          "@type": "Brand",
          "name": "ADLight"
        },
        "offers": {
          "@type": "AggregateOffer",
          "priceCurrency": "KZT",
          "lowPrice": "150000",
          "highPrice": "3500000",
          "offerCount": "3",
          "offers": [
            {
              "@type": "Offer",
              "name": "Проектирование и экспертиза КМ/КЖ крышных конструкций",
              "price": "150000",
              "priceCurrency": "KZT"
            }
          ]
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "5.0",
          "reviewCount": "12",
          "bestRating": "5",
          "worstRating": "1"
        },
        "review": [
          {
            "@type": "Review",
            "author": {
              "@type": "Person",
              "name": "Арман"
            },
            "datePublished": "2026-03-10",
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "5"
            },
            "reviewBody": "Заказали крышную установку высотой 2.5 метра с металлокаркасом для БЦ. Ребята из ADLight сделали всё профессионально: подготовили проект КМ с расчетом ветровой нагрузки, согласовали в акимате и подняли краном за одну ночь. Рекомендую!"
          }
        ]
      },
      {
        "@type": "Service",
        "@id": "https://adlight.kz/services/roof-installations#service",
        "name": roof_installationsDetails.title,
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
        "description": roof_installationsDetails.subtitle,
        "offers": {
          "@type": "Offer",
          "url": "https://adlight.kz/services/roof-installations",
          "priceCurrency": "KZT",
          "price": "150000",
          "availability": "https://schema.org/InStock"
        }
      },
      {
        "@type": "HowTo",
        "@id": "https://adlight.kz/services/roof-installations#howto",
        "name": "Как заказать и установить рекламу на крыше здания в Астане",
        "description": "Пошаговый процесс от инженерной экспертизы плит перекрытия до высотного монтажа силами альпинистов.",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Экспертиза кровли",
            "text": "Инженерный выезд для замера несущей способности перекрытий здания."
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "Разработка проектов КМ/КМД",
            "text": "Прочностные расчеты, трехмерное моделирование фермы и пригрузов."
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Производство металлоконструкции",
            "text": "Сварка рамы в сборочном цеху и антикоррозийная полимерная окраска."
          },
          {
            "@type": "HowToStep",
            "position": 4,
            "name": "Высотный монтаж",
            "text": "Подъем элементов автокраном и фиксация на кровле пром-альпинистами."
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://adlight.kz/services/roof-installations#faq",
        "mainEntity": roof_installationsDetails.faqs.map(item => ({
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
      <RoofHero heroImages={displayHeroImages} />

      {/* 2. БЕГУЩАЯ СТРОКА */}
      <ClientsMarquee />

      {/* 3. CONCEPT SECTION */}
      <RoofConcept fallbackImage={displayHeroImages[0]} />

      {/* 4. КАТАЛОГ РЕШЕНИЙ */}
      <RoofCatalog />

      {/* 4.1 СОВЕТЫ ГЛАВНОГО ТЕХНОЛОГА */}
      <RoofExpertTips />

      {/* 5. ТЕХНИЧЕСКИЙ СРАВНИТЕЛЬНЫЙ БЛОК */}
      <RoofComparison />

      {/* 6. ЦЕНЫ И ПРИМЕР СМЕТЫ */}
      <RoofPricing />

      {/* 7. ДИЗАЙН-КОД */}
      <RoofRules />

      {/* 7.2 ЭТАПЫ РАБОТЫ */}
      <RoofSteps />

      {/* 8. FAQ */}
      <RoofFAQ />

      {/* 9. ГАЛЕРЕЯ */}
      <section className="py-24 bg-slate-50 border-t border-slate-200/80">
        <div className="container mx-auto px-4 mb-12 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Наши работы</h2>
          <p className="text-slate-500">Примеры изготовленных и смонтированных крышных конструкций в Астане</p>
        </div>
        <div className="container mx-auto px-4">
          {galleryImages.length > 0 ? (
            <ImageGallery 
              images={galleryImages} 
              projectTitle="Изготовление крышных установок и рекламы на крыше в Астане"
            /> 
          ) : (
            <div className="text-center text-slate-500 py-12 border border-dashed border-slate-200 rounded-2xl max-w-md mx-auto">
              Загрузите фотографии в папку public/images/roof-installations
            </div>
          )}
        </div>
      </section>

      {/* 9.1 КЛИМАТИЧЕСКАЯ ЭКСПЛУАТАЦИЯ */}
      <RoofCareGuide />

      {/* 10. ОТЗЫВЫ И CTA */}
      <ReviewsCarousel />
      <ServicesCarousel title="Другие услуги" subtitle="Комплексный подход к вашему бренду" hiddenLink="/services/roof-installations" />
      <CallToAction source="Услуга: Крышные установки" />
    </main>
  );
}
