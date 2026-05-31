// app/services/volume-letters/page.tsx

import Link from "next/link";
import { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import { getImagesFromFolder } from "@/lib/serverUtils";
import { VOLUME_LETTERS_CATALOG, VOLUME_LETTERS_DICT } from "@/dictionaries/services/volume-letters";

// --- ИМПОРТ ЛОКАЛЬНЫХ ПРЕЗЕНТЕРОВ (COLOCATION POLICY) ---
import VolumeLettersHero from "./_components/VolumeLettersHero";
import VolumeLettersPsychology from "./_components/VolumeLettersPsychology";
import VolumeLettersTechCards from "./_components/VolumeLettersTechCards";
import VolumeLettersSteps from "./_components/VolumeLettersSteps";
import VolumeLettersFAQ from "./_components/VolumeLettersFAQ";
import VolumeLettersComparison from "./_components/VolumeLettersComparison";
import VolumeLettersRules from "./_components/VolumeLettersRules";
import VolumeLettersExpertTips from "./_components/VolumeLettersExpertTips";
import VolumeLettersCareGuide from "./_components/VolumeLettersCareGuide";

// --- ИМПОРТ ГЛОБАЛЬНЫХ КОМПОНЕНТОВ ---
import ClientsMarquee from "@/components/ClientsMarquee";
import CallToAction from "@/components/CallToAction";
import ServicesCarousel from "@/components/ServicesCarousel";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import DesignCodeBlock from "@/components/DesignCodeBlock";
import ImageGallery from "@/components/ImageGallery";
import TechCatalogGrid from "./_components/TechCatalogGrid";
import Button from "@/components/ui/Button";

// 1. ДИНАМИЧЕСКИЕ МЕТАДАННЫЕ (GEO/SEO API)
export const metadata: Metadata = constructMetadata({
  title: "Объемные буквы в Астане | Световые вывески от 200 тг/см | ADLight",
  description: "Изготовление световых 3D букв всех видов: цельноклееный акрил Plexiglas, контражур, гибкий неон, Loft ретро-лампы. Собственное производство в Астане, гарантия 1 год по договору, полное соответствие Дизайн-коду.",
  canonicalUrl: "https://adlight.kz/services/volume-letters",
  keywords: [
    "объемные буквы Астана",
    "световые буквы цена",
    "цельноклееные акриловые буквы",
    "ретро буквы с лампами",
    "изготовление рекламы астана",
    "вывеска заказать астана",
    "наружная реклама астана"
  ],
  image: "https://adlight.kz/images/og-volume-letters.jpg"
});

export default async function VolumeLettersPage() {
  
  // СБОР ГАЛЕРЕИ ФОТОГРАФИЙ
  const allSlugs = VOLUME_LETTERS_CATALOG.map(i => i.slug);
  let allGalleryImages: string[] = [];
  
  allSlugs.forEach(slug => {
    const images = getImagesFromFolder(slug);
    if (images.length > 0) {
        allGalleryImages = [...allGalleryImages, ...images.slice(0, 3)]; 
    }
  });

  let heroImages = [...allGalleryImages].sort(() => 0.5 - Math.random()).slice(0, 15);
  if (heroImages.length === 0) {
    heroImages = VOLUME_LETTERS_CATALOG.map(item => item.images.night);
  }

  // 2. ГЕНЕРАЦИЯ SCHEMA (Service, OfferCatalog, FAQPage) для ИИ и Google
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": "https://adlight.kz/services/volume-letters#service",
        "name": "Изготовление объемных букв в Астане",
        "provider": {
          "@type": "LocalBusiness",
          "name": "ADLight",
          "image": "https://adlight.kz/images/logo.png",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Астана",
            "addressCountry": "KZ"
          },
          "priceRange": "$$"
        },
        "areaServed": {
          "@type": "City",
          "name": "Астана"
        },
        "description": "Профессиональное производство всех видов объемных букв: от несветовых из ПВХ до премиум-акрила с подсветкой контражур.",
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Виды объемных букв",
          "itemListElement": VOLUME_LETTERS_CATALOG.map(item => ({
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": item.title,
              "description": item.description,
              "url": `https://adlight.kz/services/volume-letters/${item.slug}`
            },
            "priceSpecification": {
              "@type": "PriceSpecification",
              "minPrice": parseInt(item.price.replace(/\D/g, '')) || 0,
              "priceCurrency": "KZT",
              "unitCode": "CMT"
            }
          }))
        }
      },
      {
        "@type": "FAQPage",
        "@id": "https://adlight.kz/services/volume-letters#faq",
        "mainEntity": VOLUME_LETTERS_DICT.faq.items.map(item => ({
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
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-orange-500/10 selection:text-orange-600">
      
      {/* Вставляем Schema.org микроразметку */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. HERO SECTION */}
      <VolumeLettersHero heroImages={heroImages} />

      {/* 2. КЛИЕНТЫ (БЕГУЩАЯ СТРОКА) */}
      <ClientsMarquee />

      {/* 3. ПСИХОЛОГИЯ ("Почему объемные буквы") */}
      <VolumeLettersPsychology />

      {/* 4. КАТАЛОГ ТЕХНОЛОГИЙ */}
      <TechCatalogGrid />

      {/* 4.1 СОВЕТЫ ГЛАВНОГО ТЕХНОЛОГА */}
      <VolumeLettersExpertTips />

      {/* 5. ИНЖЕНЕРНАЯ ЧАСТЬ ("Качество не на словах") */}
      <VolumeLettersTechCards />

      {/* 5.1 ТАБЛИЦА СРАВНЕНИЯ КОМПЛЕКТАЦИЙ */}
      <VolumeLettersComparison />

      {/* 6. КАЛЬКУЛЯТОР БЛОК */}
      <section className="py-24 bg-slate-50 border-t border-slate-200/80">
         <div className="container mx-auto px-4">
             <div className="max-w-5xl mx-auto bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl p-8 md:p-12 relative overflow-hidden text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.webp')] opacity-10"></div>
                <div className="relative z-10 md:max-w-xl">
                   <h2 className="text-3xl font-extrabold text-white mb-4 tracking-tight">
                     {VOLUME_LETTERS_DICT.calculator.title}
                   </h2>
                   <p className="text-white/95 text-base leading-relaxed">
                     {VOLUME_LETTERS_DICT.calculator.description}
                   </p>
                </div>
                <div className="relative z-10 shrink-0">
                    <Button 
                      href="/calculator" 
                      variant="lightOutline" 
                      size="lg"
                    >
                      {VOLUME_LETTERS_DICT.calculator.buttonText}
                    </Button>
                </div>
             </div>
         </div>
      </section>

      {/* 7. ДИЗАЙН-КОД БЛОК АКИМАТА */}
      <DesignCodeBlock />

      {/* 7.1 ДИЗАЙН-КОД ЧЕК-ЛИСТ (РАЗРЕШЕНО/ЗАПРЕЩЕНО) */}
      <VolumeLettersRules />

      {/* 8. ЭТАПЫ РАБОТЫ */}
      <VolumeLettersSteps />

      {/* 9. ГАЛЕРЕЯ РАБОТ */}
      <section className="py-24 bg-slate-50 border-t border-slate-200/80">
         <div className="container mx-auto px-4 mb-12 text-center">
             <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
               {VOLUME_LETTERS_DICT.gallery.title}
             </h2>
             <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
               {VOLUME_LETTERS_DICT.gallery.subtitle}
             </p>
         </div>
         <div className="container mx-auto px-4">
            <ImageGallery images={allGalleryImages} />
         </div>
      </section>

      {/* 9.1 КЛИМАТИЧЕСКАЯ ЭКСПЛУАТАЦИЯ (УХОД) */}
      <VolumeLettersCareGuide />

      {/* 10. FAQ SECTION */}
      <VolumeLettersFAQ />

      {/* 11. ОТЗЫВЫ, ДРУГИЕ УСЛУГИ, CTA */}
      <ReviewsCarousel />
      <ServicesCarousel title="Другие услуги" subtitle="Комплексное оформление" hiddenLink="/services/volume-letters" />
      <CallToAction source="Страница: Объемные буквы (Hub)" />

    </main>
  );
}