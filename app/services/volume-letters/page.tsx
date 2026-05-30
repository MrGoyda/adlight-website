// app/services/volume-letters/page.tsx

import Link from "next/link";
import { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import { getImagesFromFolder } from "@/lib/serverUtils";
import { VOLUME_LETTERS_CATALOG } from "@/dictionaries/services/volume-letters";

// --- ИМПОРТ ЛОКАЛЬНЫХ ПРЕЗЕНТЕРОВ (COLOCATION POLICY) ---
import VolumeLettersHero from "./_components/VolumeLettersHero";
import VolumeLettersPsychology from "./_components/VolumeLettersPsychology";
import VolumeLettersTechCards from "./_components/VolumeLettersTechCards";
import VolumeLettersSteps from "./_components/VolumeLettersSteps";

// --- ИМПОРТ ГЛОБАЛЬНЫХ КОМПОНЕНТОВ ---
import ClientsMarquee from "@/components/ClientsMarquee";
import CallToAction from "@/components/CallToAction";
import ServicesCarousel from "@/components/ServicesCarousel";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import DesignCodeBlock from "@/components/DesignCodeBlock";
import ImageGallery from "@/components/ImageGallery";
import TechCatalogGrid from "./_components/TechCatalogGrid";

// 1. ДИНАМИЧЕСКИЕ МЕТАДАННЫЕ (GEO/SEO API)
export const metadata: Metadata = constructMetadata({
  title: "Объемные буквы в Астане | Цены от 200 тг/см | ADLight",
  description: "Изготовление световых букв всех видов: цельноклееный акрил, контражур, неон, ретро-лампы. Собственное производство, гарантия 1 год, согласование с Акиматом.",
  canonicalUrl: "https://adlight.kz/services/volume-letters",
  keywords: ["объемные буквы Астана", "световые буквы цена", "цельноклееные акриловые буквы", "ретро буквы с лампами", "изготовление рекламы"]
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

  // 2. ГЕНЕРАЦИЯ SCHEMA (OfferCatalog) для ИИ
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Изготовление объемных букв",
    "provider": {
      "@type": "LocalBusiness",
      "name": "ADLight",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Астана",
        "addressCountry": "KZ"
      }
    },
    "areaServed": "Астана",
    "description": "Производство всех видов объемных букв: от несветовых до цельноклееного премиум-акрила.",

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
  };

  return (
    <main className="min-h-screen bg-[#0F172A] font-sans selection:bg-orange-500/30">
      
      {/* Вставляем Schema */}
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

      {/* 5. ИНЖЕНЕРНАЯ ЧАСТЬ ("Качество не на словах") */}
      <VolumeLettersTechCards />

      {/* 6. КАЛЬКУЛЯТОР БЛОК */}
      <section className="py-24 bg-[#0F172A] border-t border-slate-800">
         <div className="container mx-auto px-4">
             <div className="max-w-5xl mx-auto bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl p-8 md:p-12 relative overflow-hidden text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-orange-900/50">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.webp')] opacity-20"></div>
                <div className="relative z-10 md:max-w-xl">
                   <h2 className="text-3xl font-bold text-white mb-4">Узнайте точную цену за 1 минуту</h2>
                   <p className="text-white/90 text-lg">
                      Не ждите менеджера. Наш умный калькулятор рассчитает стоимость вывески онлайн, учитывая шрифт, размеры и сложность монтажа.
                   </p>
                </div>
                <div className="relative z-10">
                   <Link href="/calculator" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-orange-600 font-bold text-lg rounded-xl hover:bg-gray-100 transition shadow-xl active:scale-95">
                      Перейти в калькулятор
                   </Link>
                </div>
             </div>
         </div>
      </section>

      {/* 7. ДИЗАЙН-КОД */}
      <DesignCodeBlock />

      {/* 8. ЭТАПЫ РАБОТЫ */}
      <VolumeLettersSteps />

      {/* 9. ГАЛЕРЕЯ РАБОТ */}
      <section className="py-24 bg-[#0F172A] border-t border-slate-800">
         <div className="container mx-auto px-4 mb-12 text-center">
             <h2 className="text-3xl font-bold text-white mb-4">Наши работы</h2>
             <p className="text-gray-400">Галерея реализованных проектов</p>
         </div>
         <div className="container mx-auto px-4">
            <ImageGallery images={allGalleryImages} />
         </div>
      </section>

      {/* 10. ОТЗЫВЫ, ДРУГИЕ УСЛУГИ, CTA */}
      <ReviewsCarousel />
      <ServicesCarousel title="Другие услуги" subtitle="Комплексное оформление" hiddenLink="/services/volume-letters"/>
      <CallToAction source="Страница: Объемные буквы (Hub)" />

    </main>
  );
}