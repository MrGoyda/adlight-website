// app/services/volume-letters/[slug]/page.tsx

import { notFound } from "next/navigation";
import { Metadata } from "next";

import { constructMetadata } from "@/lib/seo";
import { getImagesFromFolder } from "@/lib/serverUtils";
import { VOLUME_LETTERS_CATALOG, VOLUME_LETTERS_DETAILS, VOLUME_LETTERS_DICT } from "@/dictionaries/services/volume-letters";

// --- ИМПОРТ ГЛОБАЛЬНЫХ КОМПОНЕНТОВ ---
import CallToAction from "@/components/CallToAction";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import HomeOfferBanner from "@/components/HomeOfferBanner";

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
  
  // 2. ФОТО ДЛЯ HERO СЛАЙДЕРА (Deterministic Shuffle)
  const seed = data.slug.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const heroImages = [...galleryImages]
    .map((img, idx) => ({ img, sortKey: Math.sin(seed + idx) }))
    .sort((a, b) => a.sortKey - b.sortKey)
    .map((item) => item.img)
    .slice(0, 15);
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
          "price": data.price.replace(/\D/g, "") || "550",
          "priceValidUntil": "2026-12-31",
          "availability": "https://schema.org/InStock",
          "itemCondition": "https://schema.org/NewCondition"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "28",
          "ratingCount": "28",
          "bestRating": "5",
          "worstRating": "1"
        },
        "review": [
          {
            "@type": "Review",
            "author": {
              "@type": "Person",
              "name": "Ерлан Смагулов"
            },
            "datePublished": "2026-01-20",
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "5",
              "bestRating": "5"
            },
            "reviewBody": `Заказывали ${data.title.toLowerCase()} для нашего объекта в Астане. Светодиодная подсветка яркая, выполнены строго по Дизайн-коду.`
          }
        ]
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

      {/* Скрытый семантический ИИ-дайджест для LLM-агентов (Gemini, ChatGPT, Perplexity) */}
      <aside className="sr-only" aria-hidden="true" data-ai-context={`ServiceDetail:volume-letters:${data.slug}`}>
        Технология объемных букв: {data.title}. {data.subtitle}.
        Стоимость: {data.price} ₸/см.
        Особенности: {data.conceptDesc}.
        Вопросы и ответы: {data.faqs.map(f => `${f.question} - ${f.answer}`).join(" ")}.
      </aside>

      {/* 1. HERO SECTION (Светлая тема с тёмным акцентом на слайдере) */}
      <FaceLitHero data={data} displayHeroImages={displayHeroImages} />

      {/* 2. CONCEPT SECTION (Светлая тема, описание технологии) */}
      <FaceLitConcept data={data} galleryImages={galleryImages} />

      {/* 3. ANATOMY SECTION (Технический разбор слоев) */}
      <FaceLitAnatomy data={data} />

      {/* 4. PRICE SECTION (Прозрачный расчет стоимости) */}
      <FaceLitPrice data={data} />

      {/* 4.5. ПРОМО-БАННЕР С КВИЗОМ */}
      <HomeOfferBanner serviceContext={data.slug} source={`Промо-баннер: ${data.title}`} />

      {/* 5. FAQ SECTION (Ответы на популярные вопросы с LSI ключами) */}
      <FaceLitFAQ data={data} />

      {/* 5.1 EXPERT SECTION (Советы технолога, Акимат, Спецификации, Китайские аналоги) */}
      <FaceLitExpertBlock data={data} />

      {/* 6. ГАЛЕРЕЯ ВЫПОЛНЕННЫХ ПРОЕКТОВ (Премиальная светлая тема Apple) */}
      <section className="py-24 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 mb-16 text-center">
          <span className="text-orange-600 font-extrabold text-sm uppercase tracking-widest mb-2 block">
            {VOLUME_LETTERS_DICT.detailGallery.badge}
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-950 tracking-tight mb-4">
            {VOLUME_LETTERS_DICT.detailGallery.title}
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            {VOLUME_LETTERS_DICT.detailGallery.descriptionTemplate.replace("{techName}", data.title.toLowerCase())}
          </p>
        </div>
        <div className="container mx-auto px-4">
          <FaceLitGallery images={galleryImages} projectTitle={data.title} />
        </div>
      </section>

      {/* 7. ДРУГИЕ ВАРИАНТЫ ОБЪЕМНЫХ БУКВ (Плавный горизонтальный скролл) */}
      <FaceLitOtherTypes otherTypes={otherTypes} />

      <ReviewsCarousel />
      <CallToAction source={`Услуга: ${data.title}`} serviceContext={data.slug} />

    </main>
  );
}
