import React from "react";
import { Metadata } from "next";
import { COMPANY_NAP } from "@/dictionaries/common";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: `Контакты ${COMPANY_NAP.name} | Наружная реклама в г. ${COMPANY_NAP.locality}`,
  description: `Контакты компании ${COMPANY_NAP.name} в г. ${COMPANY_NAP.locality}. Адрес производства: ${COMPANY_NAP.address}. Телефон отдела продаж: ${COMPANY_NAP.phone}. Пишите в WhatsApp/Telegram 24/7. Реквизиты: ${COMPANY_NAP.owner}`,
  canonicalUrl: "https://adlight.kz/contacts",
  image: "/images/pages/contacts-preview.png",
  keywords: [
    "контакты adlight",
    "адрес цеха рекламы астана",
    "телефон вывески астана",
    "ИП Гойденко",
    "где заказать вывеску астана",
    "производство рекламы аспара 7",
    "сарыаркинский район вывески"
  ]
});

export default function ContactsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Микроразметка Schema.org для локального бизнеса (LocalBusiness)
  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://adlight.kz/#local-business",
    "name": COMPANY_NAP.name,
    "alternateName": "Рекламно-производственная компания ADLight",
    "image": [
      "https://adlight.kz/logo.png",
      "https://adlight.kz/images/pages/contacts-preview.png"
    ],
    "telephone": COMPANY_NAP.phoneRaw,
    "email": COMPANY_NAP.emailPersonal,
    "url": "https://adlight.kz/contacts",
    "priceRange": "₸₸",
    "currenciesAccepted": "KZT",
    "paymentAccepted": "Cash, Credit Card, Bank Transfer",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": COMPANY_NAP.address.replace(`${COMPANY_NAP.locality}, `, "").replace(`г. ${COMPANY_NAP.locality}, `, ""),
      "addressLocality": COMPANY_NAP.locality,
      "addressRegion": "Сарыаркинский район",
      "postalCode": "010000",
      "addressCountry": "KZ"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": COMPANY_NAP.coordinates.latitude,
      "longitude": COMPANY_NAP.coordinates.longitude
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "09:00",
        "closes": "14:00"
      }
    ],
    "sameAs": [
      COMPANY_NAP.socials.instagram,
      COMPANY_NAP.socials.whatsapp,
      COMPANY_NAP.socials.telegram
    ],
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": "Казахстан"
    }
  };

  // Микроразметка BreadcrumbList для хлебных крошек
  const breadcrumbsSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Главная",
        "item": "https://adlight.kz"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Контакты",
        "item": "https://adlight.kz/contacts"
      }
    ]
  };

  // Микроразметка FAQPage для вопросов ИИ и Google
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Работает ли ADLight с юридическими лицами и как производится оплата?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Да, мы работаем как с физическими, так и с юридическими лицами по всему Казахстану. Оплата принимается наличным расчетом, банковскими картами и безналичным переводом на расчетный счет ИП Гойденко Е.И. Предоставляем полный пакет закрывающих документов."
        }
      },
      {
        "@type": "Question",
        "name": "Нужно ли договариваться о визите в цех заранее?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Да, мы рекомендуем согласовать время визита с менеджером отдела продаж по телефону. Это необходимо, чтобы наш ведущий технолог был на месте, подготовил для вас образцы материалов (акрила, жидкого акрила, светодиодов) и уделил вам максимум времени."
        }
      },
      {
        "@type": "Question",
        "name": "Осуществляете ли вы доставку и монтаж вывесок в других регионах?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Наш цех находится в Астане (ул. Аспара 7), где мы выполняем полный цикл производства и монтажа. Доставку готовых рекламных конструкций осуществляем во все регионы Казахстана надежными транспортными компаниями с жесткой обрешеткой."
        }
      }
    ]
  };

  return (
    <>
      {/* Серверный рендеринг структурированных данных для SEO и AI */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}