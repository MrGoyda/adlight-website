// app/services/lightboxes/page.tsx

import Link from "next/link";
import { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import { getImagesFromFolder } from "@/lib/serverUtils";
import { lightboxesDetails } from "@/dictionaries/services/details/lightboxes";

// --- ИМПОРТ ЛОКАЛЬНЫХ ПРЕЗЕНТЕРОВ (COLOCATION POLICY) ---
import LightboxesHero from "./_components/LightboxesHero";
import LightboxesConcept from "./_components/LightboxesConcept";
import LightboxesCatalog from "./_components/LightboxesCatalog";
import LightboxesComparison from "./_components/LightboxesComparison";
import LightboxesPricing from "./_components/LightboxesPricing";
import LightboxesFAQ from "./_components/LightboxesFAQ";

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
  title: lightboxesDetails.seoTitle,
  description: lightboxesDetails.seoDesc,
  canonicalUrl: "https://adlight.kz/services/lightboxes",
  keywords: lightboxesDetails.keywords
});

export default async function LightboxesPage() {
  const galleryImages = getImagesFromFolder("lightboxes");
  
  const displayHeroImages = galleryImages.length > 0 
    ? galleryImages.slice(0, 15) 
    : ["/images/calc/lightbox-1.jpg", "/images/calc/face.jpg"];

  // 2. ГЕНЕРАЦИЯ SCHEMA ДЛЯ ПОИСКОВИКОВ И ИИ
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": "https://adlight.kz/services/lightboxes#product",
        "name": "Изготовление световых коробов (лайтбоксов) в Астане",
        "image": "https://adlight.kz/images/pages/services-lightboxes.webp",
        "description": "Профессиональное производство всех видов световых коробов: акриловые, баннерные, фигурные, композитные с инкрустацией. Собственное производство в Астане.",
        "brand": {
          "@type": "Brand",
          "name": "ADLight"
        },
        "offers": {
          "@type": "AggregateOffer",
          "priceCurrency": "KZT",
          "lowPrice": "80000",
          "highPrice": "120000",
          "offerCount": "3",
          "offers": [
            {
              "@type": "Offer",
              "name": "Акриловый световой короб",
              "price": "80000",
              "priceCurrency": "KZT"
            },
            {
              "@type": "Offer",
              "name": "Баннерный световой короб XXL",
              "price": "90000",
              "priceCurrency": "KZT"
            },
            {
              "@type": "Offer",
              "name": "Композитный световой короб с инкрустацией",
              "price": "120000",
              "priceCurrency": "KZT"
            }
          ]
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "32",
          "bestRating": "5",
          "worstRating": "1"
        }
      },
      {
        "@type": "Service",
        "@id": "https://adlight.kz/services/lightboxes#service",
        "name": lightboxesDetails.title,
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
        "description": lightboxesDetails.subtitle,
        "offers": {
          "@type": "Offer",
          "url": "https://adlight.kz/services/lightboxes",
          "priceCurrency": "KZT",
          "price": lightboxesDetails.price.replace(/\D/g, ''),
          "availability": "https://schema.org/InStock"
        }
      },
      {
        "@type": "HowTo",
        "@id": "https://adlight.kz/services/lightboxes#howto",
        "name": "Как заказать и согласовать световой короб в Астане",
        "description": "Пошаговый процесс от разработки макета до монтажа и законного размещения вывески.",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Заявка и замеры",
            "text": "Наш инженер выезжает на объект в Астане для проведения точных замеров фасада и анализа ветровых нагрузок."
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "Разработка дизайн-проекта",
            "text": "Создаем фотопривязку вывески строго в соответствии с правилами Дизайн-кода Астаны."
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Производство короба",
            "text": "Изготавливаем герметичный короб (акрил, композит или баннер) с использованием ярких светодиодов Samsung."
          },
          {
            "@type": "HowToStep",
            "position": 4,
            "name": "Монтажные работы",
            "text": "Профессиональный монтаж силами альпинистов или спецтехники с подключением к сети."
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://adlight.kz/services/lightboxes#faq",
        "mainEntity": lightboxesDetails.faqs.map(item => ({
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
      <LightboxesHero heroImages={displayHeroImages} />

      {/* 2. БЕГУЩАЯ СТРОКА */}
      <ClientsMarquee />

      {/* 3. CONCEPT SECTION */}
      <LightboxesConcept fallbackImage={displayHeroImages[0]} />

      {/* 4. КАТАЛОГ РЕШЕНИЙ */}
      <LightboxesCatalog />

      {/* 5. ТЕХНИЧЕСКИЙ СРАВНИТЕЛЬНЫЙ БЛОК */}
      <LightboxesComparison />

      {/* 6. ЦЕНЫ И ПРИМЕР СМЕТЫ */}
      <LightboxesPricing />

      {/* 7. ДИЗАЙН-КОД */}
      <DesignCodeBlock />

      {/* 7.1 ДОПОЛНИТЕЛЬНАЯ ЭКСПЕРТНАЯ ИНФОРМАЦИЯ */}
      <section className="py-20 bg-white border-t border-slate-200/80">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-3">Надежность по СНиП</span>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-6 tracking-tight">Климатическая устойчивость световых вывесок: прочность по СНиП РК</h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Астана известна своими резкими перепадами температур (от -40°C зимой до +40°C летом) и сильными порывистыми ветрами. Мы учитываем это при проектировании каждого светового короба:
              </p>
              <ul className="space-y-3.5 text-slate-600">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0 mt-2"></span>
                  <span><strong>Влагозащита IP67</strong>: Герметичные светодиодные модуми Samsung не боятся ливней, обледенения и талого снега.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0 mt-2"></span>
                  <span><strong>Усиленный металлокаркас</strong>: Применение профильных стальных труб с порошковой покраской защищает вывеску от парусности при штормовом ветре.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0 mt-2"></span>
                  <span><strong>Морозостойкий акрил Plexiglas</strong>: Защищает лицевую часть от пожелтения, растрескивания и деформации под солнцем и морозом.</span>
                </li>
              </ul>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200/80">
              <span className="text-xs font-bold text-red-500 uppercase tracking-widest block mb-3">Согласование вывески</span>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-6 tracking-tight">Правила размещения рекламы: согласование вывесок в Акимате без штрафов</h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Световой короб должен строго вписываться в общую архитектурную концепцию здания:
              </p>
              <ul className="space-y-3.5 text-slate-600">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-2"></span>
                  <span><strong>Закон о языках РК</strong>: Название вывески пишется на государственном (казахском) языке. Иностранный язык на латинице допустим только при наличии зарегистрированного товарного знака в РК.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-2"></span>
                  <span><strong>Инкрустация для фасадов</strong>: В центральных районах Астаны разрешены композитные короба, где светится только логотип и надпись, но не весь задний фон.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-2"></span>
                  <span><strong>Запрет на перекрытие окон</strong>: Вывеска не должна закрывать оконные проемы, декоративные пилястры и фасадные элементы здания.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ */}
      <LightboxesFAQ />

      {/* 9. ГАЛЕРЕЯ */}
      <section className="py-24 bg-slate-50 border-t border-slate-200/80">
        <div className="container mx-auto px-4 mb-12 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Живые примеры работ</h2>
          <p className="text-slate-500">Наше собственное производство в Астане</p>
        </div>
        <div className="container mx-auto px-4">
          {galleryImages.length > 0 ? (
            <ImageGallery 
              images={galleryImages} 
              projectTitle="Изготовление световых коробов и лайтбоксов в Астане"
            /> 
          ) : (
            <div className="text-center text-slate-500 py-12 border border-dashed border-slate-200 rounded-2xl max-w-md mx-auto">
              Загрузите фото в папку public/images/lightboxes
            </div>
          )}
        </div>
      </section>

      {/* 10. ОТЗЫВЫ И CTA */}
      <ReviewsCarousel />
      <ServicesCarousel title="Другие услуги" subtitle="Комплексный подход к вашему бренду" hiddenLink="/services/lightboxes" />
      <CallToAction source="Услуга: Световые короба (Лайтбоксы)" />
    </main>
  );
}
