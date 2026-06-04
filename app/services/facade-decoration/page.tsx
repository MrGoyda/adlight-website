// app/services/facade-decoration/page.tsx

import Link from "next/link";
import { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import { getImagesFromFolder } from "@/lib/serverUtils";
import { facade_decorationDetails } from "@/dictionaries/services/details/facade-decoration";

// --- ИМПОРТ ЛОКАЛЬНЫХ ПРЕЗЕНТЕРОВ (COLOCATION POLICY) ---
import FacadeDecorationHero from "./_components/FacadeDecorationHero";
import FacadeDecorationConcept from "./_components/FacadeDecorationConcept";
import FacadeDecorationCatalog from "./_components/FacadeDecorationCatalog";
import FacadeDecorationComparison from "./_components/FacadeDecorationComparison";
import FacadeDecorationPricing from "./_components/FacadeDecorationPricing";
import FacadeDecorationFAQ from "./_components/FacadeDecorationFAQ";
import FacadeDecorationRules from "./_components/FacadeDecorationRules";
import FacadeDecorationSteps from "./_components/FacadeDecorationSteps";
import FacadeDecorationCareGuide from "./_components/FacadeDecorationCareGuide";
import FacadeDecorationExpertTips from "./_components/FacadeDecorationExpertTips";

// --- ИМПОРТ ГЛОБАЛЬНЫХ КОМПОНЕНТОВ ---
import ClientsMarquee from "@/components/ClientsMarquee";
import CallToAction from "@/components/CallToAction";
import ServicesCarousel from "@/components/ServicesCarousel";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import DesignCodeBlock from "@/components/DesignCodeBlock";
import ImageGallery from "@/components/ImageGallery";
import Button from "@/components/ui/Button";

// 1. ДИНАМИЧЕСКИЕ МЕТАДАННЫЕ (GEO/SEO API)
export const metadata: Metadata = constructMetadata({
  title: facade_decorationDetails.seoTitle,
  description: facade_decorationDetails.seoDesc,
  canonicalUrl: "https://adlight.kz/services/facade-decoration",
  keywords: facade_decorationDetails.keywords
});

export default async function FacadeDecorationPage() {
  const galleryImages = getImagesFromFolder("facade-decoration");
  
  const displayHeroImages = galleryImages.length > 0 
    ? galleryImages.slice(0, 15) 
    : ["/images/pages/services-facade.png", "/images/calc/face.jpg"];

  // 2. ГЕНЕРАЦИЯ SCHEMA ДЛЯ ПОИСКОВИКОВ И ИИ (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": "https://adlight.kz/services/facade-decoration#product",
        "name": "Оформление и облицовка фасадов композитом в Астане",
        "image": "https://adlight.kz/images/pages/services-facade.png",
        "description": "Профессиональное оформление фасадов композитными панелями (алюкобондом) и брендирование витрин. Полное соответствие дизайн-коду Астаны, гарантия по СНиП.",
        "brand": {
          "@type": "Brand",
          "name": "ADLight"
        },
        "offers": {
          "@type": "AggregateOffer",
          "priceCurrency": "KZT",
          "lowPrice": "18000",
          "highPrice": "150000",
          "offerCount": "4",
          "offers": [
            {
              "@type": "Offer",
              "name": "Облицовка композитом (Алюкобонд)",
              "price": "18000",
              "priceCurrency": "KZT"
            },
            {
              "@type": "Offer",
              "name": "Брендирование витрин",
              "price": "45000",
              "priceCurrency": "KZT"
            },
            {
              "@type": "Offer",
              "name": "Изготовление входных групп под ключ",
              "price": "150000",
              "priceCurrency": "KZT"
            }
          ]
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "19",
          "bestRating": "5",
          "worstRating": "1"
        }
      },
      {
        "@type": "Service",
        "@id": "https://adlight.kz/services/facade-decoration#service",
        "name": facade_decorationDetails.title,
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
        "description": facade_decorationDetails.subtitle,
        "offers": {
          "@type": "Offer",
          "url": "https://adlight.kz/services/facade-decoration",
          "priceCurrency": "KZT",
          "price": facade_decorationDetails.price.replace(/\D/g, ''),
          "availability": "https://schema.org/InStock"
        }
      },
      {
        "@type": "HowTo",
        "@id": "https://adlight.kz/services/facade-decoration#howto",
        "name": "Как заказать облицовку фасада и оформление витрин в Астане",
        "description": "Пошаговый процесс от согласования дизайн-проекта фасада до монтажа облицовочных панелей.",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Замеры и дизайн-проект",
            "text": "Наш конструктор выезжает на объект для замера площадей, оценки прочности стен и разработки 3D-визуализации фасада."
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "Согласование эскиза",
            "text": "Подготовка пакета документов для согласования нового облика фасада и вывески в Управлении архитектуры Астаны."
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Монтаж подсистемы",
            "text": "Сборка надежного металлического каркаса (подсистемы) с антикоррозийным покрытием строго по ветровым СНиП РК."
          },
          {
            "@type": "HowToStep",
            "position": 4,
            "name": "Облицовка и декорирование",
            "text": "Установка кассет из алюкобонда, оклейка витрин качественными пленками и подключение фасадной LED-подсветки."
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://adlight.kz/services/facade-decoration#faq",
        "mainEntity": facade_decorationDetails.faqs.map(item => ({
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
      <FacadeDecorationHero heroImages={displayHeroImages} />

      {/* 2. БЕГУЩАЯ СТРОКА */}
      <ClientsMarquee />

      {/* 3. CONCEPT SECTION */}
      <FacadeDecorationConcept fallbackImage={displayHeroImages[0]} />

      {/* 4. КАТАЛОГ РЕШЕНИЙ */}
      <FacadeDecorationCatalog />

      {/* 4.1 СОВЕТЫ ГЛАВНОГО ТЕХНОЛОГА */}
      <FacadeDecorationExpertTips />

      {/* 5. ТЕХНИЧЕСКИЙ СРАВНИТЕЛЬНЫЙ БЛОК */}
      <FacadeDecorationComparison />

      {/* 6. КАЛЬКУЛЯТОР БЛОК */}
      <section className="py-24 bg-slate-50 border-t border-slate-200/80">
         <div className="container mx-auto px-4">
             <div className="max-w-[1400px] mx-auto bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl p-8 md:p-12 relative overflow-hidden text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.webp')] opacity-10"></div>
                <div className="relative z-10 md:max-w-xl">
                   <h2 className="text-3xl font-extrabold text-white mb-4 tracking-tight">
                     Рассчитайте точную цену оформления фасада за 1 минуту
                   </h2>
                   <p className="text-white/95 text-base leading-relaxed">
                     Интеллектуальный калькулятор на нашем сайте моментально рассчитает ориентировочную стоимость облицовки и витрин онлайн. Выберите материалы, укажите площадь и получите смету.
                   </p>
                </div>
                <div className="relative z-10 shrink-0">
                    <Button 
                      href="/calculator" 
                      variant="lightOutline" 
                      size="lg"
                    >
                      Перейти в калькулятор
                    </Button>
                </div>
             </div>
         </div>
      </section>

      {/* 6.1 ЦЕНЫ И ПРИМЕР СМЕТЫ */}
      <FacadeDecorationPricing />

      {/* 7. ДИЗАЙН-КОД */}
      <DesignCodeBlock />

      {/* 7.1 ДИЗАЙН-КОД ЧЕК-ЛИСТ (РАЗРЕШЕНО/ЗАПРЕЩЕНО) */}
      <FacadeDecorationRules />

      {/* 7.2 ЭТАПЫ РАБОТЫ */}
      <FacadeDecorationSteps />

      {/* 8. FAQ */}
      <FacadeDecorationFAQ />

      {/* 9. ГАЛЕРЕЯ */}
      <section className="py-24 bg-slate-50 border-t border-slate-200/80">
        <div className="container mx-auto px-4 mb-12 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Наши работы</h2>
          <p className="text-slate-500">Примеры оформленных фасадов и брендирования витрин в Астане</p>
        </div>
        <div className="container mx-auto px-4">
          {galleryImages.length > 0 ? (
            <ImageGallery 
              images={galleryImages} 
              projectTitle="Комплексное оформление фасадов и витрин в Астане"
            /> 
          ) : (
            <div className="text-center text-slate-500 py-12 border border-dashed border-slate-200 rounded-2xl max-w-md mx-auto">
              Загрузите фотографии в папку public/images/facade-decoration
            </div>
          )}
        </div>
      </section>

      {/* 9.1 КЛИМАТИЧЕСКАЯ ЭКСПЛУАТАЦИЯ */}
      <FacadeDecorationCareGuide />

      {/* 10. ОТЗЫВЫ И CTA */}
      <ReviewsCarousel />
      <ServicesCarousel title="Другие услуги" subtitle="Комплексный подход к вашему бренду" hiddenLink="/services/facade-decoration" />
      <CallToAction source="Услуга: Оформление фасадов" />
    </main>
  );
}
