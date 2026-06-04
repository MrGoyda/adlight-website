// app/services/panel-brackets/page.tsx

import Link from "next/link";
import { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import { getImagesFromFolder } from "@/lib/serverUtils";
import { panel_bracketsDetails } from "@/dictionaries/services/details/panel-brackets";

// --- ИМПОРТ ЛОКАЛЬНЫХ ПРЕЗЕНТЕРОВ (COLOCATION POLICY) ---
import PanelBracketsHero from "./_components/PanelBracketsHero";
import PanelBracketsConcept from "./_components/PanelBracketsConcept";
import PanelBracketsCatalog from "./_components/PanelBracketsCatalog";
import PanelBracketsComparison from "./_components/PanelBracketsComparison";
import PanelBracketsPricing from "./_components/PanelBracketsPricing";
import PanelBracketsFAQ from "./_components/PanelBracketsFAQ";
import PanelBracketsRules from "./_components/PanelBracketsRules";
import PanelBracketsSteps from "./_components/PanelBracketsSteps";
import PanelBracketsCareGuide from "./_components/PanelBracketsCareGuide";
import PanelBracketsExpertTips from "./_components/PanelBracketsExpertTips";

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
  title: panel_bracketsDetails.seoTitle,
  description: panel_bracketsDetails.seoDesc,
  canonicalUrl: "https://adlight.kz/services/panel-brackets",
  keywords: panel_bracketsDetails.keywords
});

export default async function PanelBracketsPage() {
  const galleryImages = getImagesFromFolder("panel-brackets");
  
  const displayHeroImages = galleryImages.length > 0 
    ? galleryImages.slice(0, 15) 
    : ["/images/calc/lightbox-1.jpg", "/images/calc/face.jpg"];

  // 2. ГЕНЕРАЦИЯ SCHEMA ДЛЯ ПОИСКОВИКОВ И ИИ (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": "https://adlight.kz/services/panel-brackets#product",
        "name": "Изготовление двухсторонних вывесок (панель-кронштейнов) в Астане",
        "image": "https://adlight.kz/images/pages/services-panel-brackets.webp",
        "description": "Профессиональное производство двухсторонних вывесок (консолей, торцевых лайтбоксов) в Астане. Устойчивость к ветровым нагрузкам по СНиП, соответствие Дизайн-коду.",
        "brand": {
          "@type": "Brand",
          "name": "ADLight"
        },
        "offers": {
          "@type": "AggregateOffer",
          "priceCurrency": "KZT",
          "lowPrice": "45000",
          "highPrice": "65000",
          "offerCount": "3",
          "offers": [
            {
              "@type": "Offer",
              "name": "Круглый световой панель-кронштейн D=50см",
              "price": "45000",
              "priceCurrency": "KZT"
            },
            {
              "@type": "Offer",
              "name": "Прямоугольный панель-кронштейн 60x60см",
              "price": "55000",
              "priceCurrency": "KZT"
            },
            {
              "@type": "Offer",
              "name": "Фигурный панель-кронштейн по форме логотипа",
              "price": "65000",
              "priceCurrency": "KZT"
            }
          ]
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "24",
          "bestRating": "5",
          "worstRating": "1"
        }
      },
      {
        "@type": "Service",
        "@id": "https://adlight.kz/services/panel-brackets#service",
        "name": panel_bracketsDetails.title,
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
        "description": panel_bracketsDetails.subtitle,
        "offers": {
          "@type": "Offer",
          "url": "https://adlight.kz/services/panel-brackets",
          "priceCurrency": "KZT",
          "price": panel_bracketsDetails.price.replace(/\D/g, ''),
          "availability": "https://schema.org/InStock"
        }
      },
      {
        "@type": "HowTo",
        "@id": "https://adlight.kz/services/panel-brackets#howto",
        "name": "Как заказать и установить панель-кронштейн в Астане",
        "description": "Пошаговый процесс от согласования по дизайн-коду Астаны до безопасного монтажа консоли.",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Замеры и расчет нагрузок",
            "text": "Инженер делает замеры фасада, рассчитывает ветровые нагрузки и выбирает оптимальное сечение металлического кронштейна."
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "Дизайн и привязка к Дизайн-коду",
            "text": "Подготовка макета с фотопривязкой к фасаду для соответствия правилам рекламы в Акимате."
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Сборка на металлокаркасе",
            "text": "Сварка внутреннего прочного каркаса, монтаж диодов с линзой 170 градусов для равномерной засветки с двух сторон."
          },
          {
            "@type": "HowToStep",
            "position": 4,
            "name": "Монтаж на анкерные болты",
            "text": "Перпендикулярный монтаж на прочные анкера к стене с аккуратным подведением герметичной проводки."
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://adlight.kz/services/panel-brackets#faq",
        "mainEntity": panel_bracketsDetails.faqs.map(item => ({
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
      <PanelBracketsHero heroImages={displayHeroImages} />

      {/* 2. БЕГУЩАЯ СТРОКА */}
      <ClientsMarquee />

      {/* 3. CONCEPT SECTION */}
      <PanelBracketsConcept fallbackImage={displayHeroImages[0]} />

      {/* 4. КАТАЛОГ РЕШЕНИЙ */}
      <PanelBracketsCatalog />

      {/* 4.1 СОВЕТЫ ГЛАВНОГО ТЕХНОЛОГА */}
      <PanelBracketsExpertTips />

      {/* 5. ТЕХНИЧЕСКИЙ СРАВНИТЕЛЬНЫЙ БЛОК */}
      <PanelBracketsComparison />

      {/* 6. КАЛЬКУЛЯТОР БЛОК */}
      <section className="py-24 bg-slate-50 border-t border-slate-200/80">
         <div className="container mx-auto px-4">
             <div className="max-w-[1400px] mx-auto bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl p-8 md:p-12 relative overflow-hidden text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.webp')] opacity-10"></div>
                <div className="relative z-10 md:max-w-xl">
                   <h2 className="text-3xl font-extrabold text-white mb-4 tracking-tight">
                     Рассчитайте точную цену панель-кронштейна за 1 минуту
                   </h2>
                   <p className="text-white/95 text-base leading-relaxed">
                     Интеллектуальный калькулятор на нашем сайте моментально рассчитает стоимость вашей вывески онлайн. Выберите желаемый размер, тип подсветки и форму, чтобы получить сметный расчет.
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
      <PanelBracketsPricing />

      {/* 7. ДИЗАЙН-КОД */}
      <DesignCodeBlock />

      {/* 7.1 ДИЗАЙН-КОД ЧЕК-ЛИСТ (РАЗРЕШЕНО/ЗАПРЕЩЕНО) */}
      <PanelBracketsRules />

      {/* 7.2 ЭТАПЫ РАБОТЫ */}
      <PanelBracketsSteps />

      {/* 8. FAQ */}
      <PanelBracketsFAQ />

      {/* 9. ГАЛЕРЕЯ */}
      <section className="py-24 bg-slate-50 border-t border-slate-200/80">
        <div className="container mx-auto px-4 mb-12 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Наши работы</h2>
          <p className="text-slate-500">Живые примеры изготовленных панель-кронштейнов в Астане</p>
        </div>
        <div className="container mx-auto px-4">
          {galleryImages.length > 0 ? (
            <ImageGallery 
              images={galleryImages} 
              projectTitle="Изготовление двухсторонних консолей и панель-кронштейнов в Астане"
            /> 
          ) : (
            <div className="text-center text-slate-500 py-12 border border-dashed border-slate-200 rounded-2xl max-w-md mx-auto">
              Загрузите фотографии в папку public/images/panel-brackets
            </div>
          )}
        </div>
      </section>

      {/* 9.1 КЛИМАТИЧЕСКАЯ ЭКСПЛУАТАЦИЯ */}
      <PanelBracketsCareGuide />

      {/* 10. ОТЗЫВЫ И CTA */}
      <ReviewsCarousel />
      <ServicesCarousel title="Другие услуги" subtitle="Комплексный подход к вашему бренду" hiddenLink="/services/panel-brackets" />
      <CallToAction source="Услуга: Панель-кронштейны" />
    </main>
  );
}
