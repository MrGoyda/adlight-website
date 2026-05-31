// app/services/volume-letters/[slug]/page.tsx

import { notFound } from "next/navigation";
import { Metadata } from "next";

import { constructMetadata } from "@/lib/seo";
import { getImagesFromFolder } from "@/lib/serverUtils";
import { VOLUME_LETTERS_CATALOG, VOLUME_LETTERS_DETAILS } from "@/dictionaries/services/volume-letters";

// --- ИМПОРТ ГЛОБАЛЬНЫХ КОМПОНЕНТОВ ---
import CallToAction from "@/components/CallToAction";
import ReviewsCarousel from "@/components/ReviewsCarousel";

// --- ИМПОРТ ЛОКАЛЬНЫХ АТОМАРНЫХ ПРЕЗЕНТЕРОВ ---
import FaceLitHero from "./_components/FaceLitHero";
import FaceLitConcept from "./_components/FaceLitConcept";
import FaceLitAnatomy from "./_components/FaceLitAnatomy";
import FaceLitPrice from "./_components/FaceLitPrice";
import FaceLitFAQ from "./_components/FaceLitFAQ";
import FaceLitGallery from "./_components/FaceLitGallery";
import FaceLitOtherTypes from "./_components/FaceLitOtherTypes";
import FaceLitExpertBlock from "./_components/FaceLitExpertBlock";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// 1. ДИНАМИЧЕСКИЕ МЕТАДАННЫЕ (Next.js 15 Async params с OG-разметкой)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = VOLUME_LETTERS_DETAILS[slug];
  
  if (!data) return {};

  return constructMetadata({
    title: data.seoTitle,
    description: data.seoDesc,
    canonicalUrl: `https://adlight.kz/services/volume-letters/${slug}`,
    keywords: data.keywords,
    image: `https://adlight.kz/images/letters/${slug}-night.webp`
  });
}

// ISR/SSG Генерация путей
export async function generateStaticParams() {
  return VOLUME_LETTERS_CATALOG.map((item) => ({
    slug: item.slug,
  }));
}

export default async function VolumeLetterSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const data = VOLUME_LETTERS_DETAILS[slug];

  if (!data) {
    notFound();
  }

  // 1. ПОЛУЧАЕМ ФОТО ГАЛЕРЕИ
  const galleryImages = getImagesFromFolder(data.slug);

  // 2. ФОТО ДЛЯ HERO СЛАЙДЕРА
  const heroImages = [...galleryImages].sort(() => 0.5 - Math.random()).slice(0, 15);
  const displayHeroImages = heroImages.length > 0 
    ? heroImages 
    : ["/images/letters/face-lit-night.webp", "/images/letters/face-lit-day.webp"];

  // 3. "ДРУГИЕ ВИДЫ"
  const otherTypes = VOLUME_LETTERS_CATALOG.filter(item => item.slug !== data.slug);

  // 4. ГЕНЕРАЦИЯ SCHEMA.ORG (Product + FAQPage) для ИИ и Google на 100%
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "name": data.title,
        "image": `https://adlight.kz${displayHeroImages[0]}`,
        "description": data.subtitle,
        "brand": {
          "@type": "Brand",
          "name": "ADLight"
        },
        "offers": {
          "@type": "Offer",
          "url": `https://adlight.kz/services/volume-letters/${data.slug}`,
          "priceCurrency": "KZT",
          "price": data.price,
          "availability": "https://schema.org/InStock",
          "itemCondition": "https://schema.org/NewCondition"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": data.faqs.map(item => ({
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
    <main className="min-h-screen bg-slate-50 font-sans selection:bg-orange-500/10 selection:text-orange-600">
      
      {/* Вставляем микроразметку Schema.org в head */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. HERO SECTION (Светлая тема с тёмным акцентом на слайдере) */}
      <FaceLitHero data={data} displayHeroImages={displayHeroImages} />

      {/* 2. CONCEPT SECTION (Светлая тема, описание технологии) */}
      <FaceLitConcept data={data} galleryImages={galleryImages} />

      {/* 3. ANATOMY SECTION (Технический разбор слоев) */}
      <FaceLitAnatomy data={data} />

      {/* 4. PRICE SECTION (Прозрачный расчет стоимости) */}
      <FaceLitPrice data={data} />

      {/* 5. FAQ SECTION (Ответы на популярные вопросы с LSI ключами) */}
      <FaceLitFAQ data={data} />

      {/* 5.1 EXPERT SECTION (Советы технолога, Акимат, Спецификации, Китайские аналоги) */}
      <FaceLitExpertBlock data={data} />

      {/* 6. ГАЛЕРЕЯ ВЫПОЛНЕННЫХ ПРОЕКТОВ (Премиальная светлая тема Apple) */}
      <section className="py-24 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 mb-16 text-center">
          <span className="text-orange-600 font-extrabold text-sm uppercase tracking-widest mb-2 block">Портфолио</span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-950 tracking-tight mb-4">Галерея реализованных проектов</h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">Фотоотчеты реальных объемных световых букв со световым лицом, установленных нашей монтажной командой ADLight в Астане.</p>
        </div>
        <div className="container mx-auto px-4">
          <FaceLitGallery images={galleryImages} projectTitle={data.title} />
        </div>
      </section>

      {/* 7. ДРУГИЕ ВАРИАНТЫ ОБЪЕМНЫХ БУКВ (Плавный горизонтальный скролл) */}
      <FaceLitOtherTypes otherTypes={otherTypes} />

      <ReviewsCarousel />
      <CallToAction source={`Услуга: ${data.title}`} />

    </main>
  );
}
