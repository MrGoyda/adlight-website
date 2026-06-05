import { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import { SITE_PRICES_NUMERIC, SITE_CONTACTS } from "@/config/site";
import { CALCULATOR_FAQ, CALC_UI } from "@/dictionaries/calculator";
import FaqSection from "@/components/FaqSection";

import CalculatorShell from "./_components/CalculatorShell";
import PriceShowcase from "./_components/PriceShowcase";

export const metadata: Metadata = constructMetadata({
  title: "Калькулятор стоимости вывески в Астане | Рассчитать цену вывески онлайн",
  description: "Онлайн-калькулятор стоимости изготовления объемных букв и лайтбоксов в Астане. Укажите размеры и тип конструкции, чтобы мгновенно получить ориентировочный расчет цены.",
  canonicalUrl: "https://adlight.kz/calculator",
  keywords: ["калькулятор вывески астана", "рассчитать стоимость вывески", "цена объемных букв онлайн", "расчет цены лайтбокса", "наружная реклама стоимость"]
});

// ─── Schema.org ───────────────────────────────────────────────────────────────

const schemaWebApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Калькулятор наружной рекламы ADLight",
  description: "Интерактивный онлайн-калькулятор стоимости объёмных букв и лайтбоксов в Астане. Рассчитайте ориентировочную цену за 30 секунд.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "All",
  url: "https://adlight.kz/calculator",
  provider: {
    "@type": "LocalBusiness",
    name: SITE_CONTACTS.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_CONTACTS.address,
      addressLocality: SITE_CONTACTS.locality,
      addressCountry: "KZ",
    },
    telephone: SITE_CONTACTS.phone,
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "KZT",
    description: "Использование калькулятора бесплатно",
  },
};

// Каждый тип буквы — отдельный Service с PriceSpecification
const schemaLettersServices = Object.entries(SITE_PRICES_NUMERIC.letters).map(
  ([id, price]) => ({
    "@type": "Service",
    serviceType: "Изготовление объёмных букв",
    name: `Объёмные буквы — ${id}`,
    provider: { "@type": "LocalBusiness", name: SITE_CONTACTS.name },
    areaServed: { "@type": "City", name: SITE_CONTACTS.locality },
    offers: {
      "@type": "Offer",
      priceCurrency: "KZT",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price,
        priceCurrency: "KZT",
        unitText: "см высоты",
        description: `Стоимость одного сантиметра высоты буквы типа ${id}`,
      },
    },
  })
);

const schemaLightboxServices = Object.entries(SITE_PRICES_NUMERIC.lightboxes).map(
  ([id, price]) => ({
    "@type": "Service",
    serviceType: "Изготовление лайтбоксов",
    name: `Лайтбокс — ${id}`,
    provider: { "@type": "LocalBusiness", name: SITE_CONTACTS.name },
    areaServed: { "@type": "City", name: SITE_CONTACTS.locality },
    offers: {
      "@type": "Offer",
      priceCurrency: "KZT",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price,
        priceCurrency: "KZT",
        unitText: "м²",
        description: `Стоимость одного м² лайтбокса типа ${id}`,
      },
    },
  })
);

const schemaItemList = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Цены на рекламные конструкции ADLight",
  itemListElement: [...schemaLettersServices, ...schemaLightboxServices].map(
    (item, i) => ({ "@type": "ListItem", position: i + 1, item })
  ),
};

const schemaFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: CALCULATOR_FAQ.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

// ─── Страница ─────────────────────────────────────────────────────────────────

export default function CalculatorPage() {

  return (
    <main className="min-h-screen bg-slate-50">

      {/* ── JSON-LD Schema ───────────────────────────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaWebApp) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaItemList) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq) }}
      />

      {/* ── Hero-шапка страницы (SSR — индексируется) ───────────────────── */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-10 md:py-14 text-center max-w-2xl">
          {/* Строго один h1 на страницу — скилл seo-expert */}
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">
            {CALC_UI.h1}
          </h1>
          <p className="text-slate-500 text-base md:text-lg">
            {CALC_UI.subtitle}
          </p>
        </div>
      </div>

      {/* ── Основной контент ─────────────────────────────────────────────── */}
      {/* pb-28 lg:pb-8 — отступ снизу для мобильного sticky-бара */}
      <div className="container mx-auto px-4 pt-8 pb-32 lg:pb-12">

        {/* Интерактивный калькулятор (Client Component) */}
        <CalculatorShell />

        {/* Таблица «Цены от» (SSR — видна без JS, индексируется) */}
        <PriceShowcase />

        {/* FAQ для AI-поисковиков (компонент «use client», данные SSR) */}
        <FaqSection
          faqs={CALCULATOR_FAQ.map(({ q, a }) => ({ q, a }))}
          title={CALC_UI.faqTitle}
          subtitle="Честные ответы о стоимости, сроках и процессе изготовления вывесок."
        />
      </div>
    </main>
  );
}