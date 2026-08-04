// app/services/[slug]/page.tsx

import { notFound } from "next/navigation";
import { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import { getImagesFromFolder } from "@/lib/serverUtils";
import { SERVICES_DETAILS, SERVICES_DETAILS_UI } from "@/dictionaries/services/service-details";

// --- ИМПОРТ ГЛОБАЛЬНЫХ DRY КОМПОНЕНТОВ ---
import ServiceHero from "@/components/services/ServiceHero";
import ServiceConcept from "@/components/services/ServiceConcept";
import ServiceCatalog from "@/components/services/ServiceCatalog";
import ServiceExpertTips from "@/components/services/ServiceExpertTips";
import ServiceComparison from "@/components/services/ServiceComparison";
import ServicePricing from "@/components/services/ServicePricing";
import ServiceRules from "@/components/services/ServiceRules";
import ServiceSteps from "@/components/services/ServiceSteps";
import ServiceFAQ from "@/components/services/ServiceFAQ";
import ServiceCareGuide from "@/components/services/ServiceCareGuide";
import ServiceSchema from "@/components/services/ServiceSchema";

// --- ИМПОРТ ГЛОБАЛЬНЫХ КОМПОНЕНТОВ ---
import ClientsMarquee from "@/components/ClientsMarquee";
import CallToAction from "@/components/CallToAction";
import HomeOfferBanner from "@/components/HomeOfferBanner";
import ServicesCarousel from "@/components/ServicesCarousel";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import ImageGallery from "@/components/ImageGallery";
import DesignCodeBlock from "@/components/DesignCodeBlock";
import Button from "@/components/ui/Button";

type Props = {
  params: Promise<{ slug: string }>;
};

// 1. ДИНАМИЧЕСКИЙ ГЕНЕРАТОР METADATA (SEO/GEO API)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const service = SERVICES_DETAILS[resolvedParams.slug];
  
  if (!service) return { title: SERVICES_DETAILS_UI.notFound };
  
  return constructMetadata({
    title: service.seoTitle,
    description: service.seoDesc,
    canonicalUrl: `https://adlight.kz/services/${service.slug}`,
    keywords: service.keywords
  });
}

// 2. СТАТИЧЕСКАЯ ГЕНЕРАЦИЯ СТРАНИЦ (SSG)
export async function generateStaticParams() {
  const staticRoutes = ["volume-letters"];
  return Object.keys(SERVICES_DETAILS)
    .filter((slug) => !staticRoutes.includes(slug))
    .map((slug) => ({
       slug: slug
    }));
}

export default async function DynamicServicePage({ params }: Props) {
  const resolvedParams = await params;
  const service = SERVICES_DETAILS[resolvedParams.slug];

  if (!service) {
    notFound();
  }

  // Получаем фотографии из папки
  const galleryImages = getImagesFromFolder(service.slug);
  const seed = service.slug.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const heroImages = [...galleryImages]
    .map((img, idx) => ({ img, sortKey: Math.sin(seed + idx) }))
    .sort((a, b) => a.sortKey - b.sortKey)
    .map((item) => item.img)
    .slice(0, 15);
  
  const displayHeroImages = heroImages.length > 0 
    ? heroImages 
    : ["/images/calc/lightbox-1.jpg", "/images/calc/face.jpg"];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-orange-500/10 selection:text-orange-600 overflow-x-clip">
      {/* Внедряем JSON-LD */}
      <ServiceSchema data={service} imageUrl={displayHeroImages[0]} />

      {/* 1. HERO SECTION */}
      <ServiceHero data={service} heroImages={displayHeroImages} />

      {/* 2. БЕГУЩАЯ СТРОКА */}
      <ClientsMarquee />

      {/* 3. CONCEPT SECTION */}
      <ServiceConcept 
        data={service} 
        fallbackImage={
          service.slug === "branding-cars" 
            ? "/images/branding-cars/full-branding.jpg" 
            : service.slug === "panel-brackets"
            ? "/images/panel-brackets/panel-brackets-01.webp"
            : displayHeroImages[0]
        } 
      />

      {/* 4. КАТАЛОГ РЕШЕНИЙ */}
      <ServiceCatalog data={service} />

      {/* 4.1 СОВЕТЫ ГЛАВНОГО ТЕХНОЛОГА */}
      <ServiceExpertTips data={service} />

      {/* 5. ТЕХНИЧЕСКИЙ СРАВНИТЕЛЬНЫЙ БЛОК */}
      <ServiceComparison data={service} />

      {/* 5.5 КАЛЬКУЛЯТОР БЛОК */}
      {service.hasCalculatorBanner && (
        <section className="py-24 bg-slate-50 border-t border-slate-200/80">
          <div className="container mx-auto px-4 max-w-[1400px]">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl p-8 md:p-12 relative overflow-hidden text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.webp')] opacity-10"></div>
              <div className="relative z-10 md:max-w-xl">
                <h2 className="text-3xl font-extrabold text-white mb-4 tracking-tight">
                  {SERVICES_DETAILS_UI.calculator.title}
                </h2>
                <p className="text-white/95 text-base leading-relaxed">
                  {SERVICES_DETAILS_UI.calculator.description}
                </p>
              </div>
              <div className="relative z-10 shrink-0">
                <Button 
                  href="/calculator" 
                  variant="lightOutline" 
                  size="lg"
                >
                  {SERVICES_DETAILS_UI.calculator.buttonText}
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6. ЦЕНЫ И ПРИМЕР СМЕТЫ */}
      <ServicePricing data={service} />

      {/* 6.5. ПРОМО-БАННЕР С КВИЗОМ */}
      <HomeOfferBanner serviceContext={service.slug} source={`Служебный промо-баннер: ${service.title}`} />

      {/* 7. ДИЗАЙН-КОД */}
      {service.hasDesignCodeBlock && <DesignCodeBlock />}

      {/* 7.1 ДИЗАЙН-КОД ЧЕК-ЛИСТ (РАЗРЕШЕНО/ЗАПРЕЩЕНО) */}
      <ServiceRules data={service} />

      {/* 7.2 ЭТАПЫ РАБОТЫ */}
      <ServiceSteps data={service} />

      {/* 8. FAQ */}
      <ServiceFAQ data={service} />

      {/* 9. ГАЛЕРЕЯ */}
      <section className="py-24 bg-slate-50 border-t border-slate-200/80">
        <div className="container mx-auto px-4 mb-12 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">
            {SERVICES_DETAILS_UI.gallery.title}
          </h2>
          <p className="text-slate-500">
            {SERVICES_DETAILS_UI.gallery.subtitle}
          </p>
        </div>
        <div className="container mx-auto px-4">
          {galleryImages.length > 0 ? (
            <ImageGallery 
              images={galleryImages} 
              projectTitle={SERVICES_DETAILS_UI.gallery.projectTitleTemplate.replace("{title}", service.title)}
            /> 
          ) : (
            <div className="text-center text-slate-500 py-12 border border-dashed border-slate-200 rounded-2xl max-w-md mx-auto">
              {SERVICES_DETAILS_UI.gallery.placeholderTemplate.replace("{slug}", service.slug)}
            </div>
          )}
        </div>
      </section>

      {/* 9.1 КЛИМАТИЧЕСКАЯ ЭКСПЛУАТАЦИЯ */}
      <ServiceCareGuide data={service} />

      {/* 10. ОТЗЫВЫ И CTA */}
      <ReviewsCarousel />
      <ServicesCarousel title={SERVICES_DETAILS_UI.carousel.title} subtitle={SERVICES_DETAILS_UI.carousel.subtitle} hiddenLink={`/services/${service.slug}`} />
      <CallToAction source={`Услуга: ${service.title}`} serviceContext={service.slug} />
    </main>
  );
}
