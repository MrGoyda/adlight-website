// app/design-code/page.tsx

import { Metadata } from "next";
import {
  DESIGN_CODE_WAYS,
  DESIGN_CODE_TABS_DATA,
  DESIGN_CODE_TABS_LIST,
} from "@/dictionaries/design-code";

// --- ИМПОРТ КОМПОНЕНТОВ ---
import CallToAction from "@/components/CallToAction";
import ServicesCarousel from "@/components/ServicesCarousel";
import DesignCodeTabs from "@/components/DesignCodeTabs"; 
import HomeOfferBanner from "@/components/HomeOfferBanner";

// --- ИМПОРТ АТОМАРНЫХ КОМПОНЕНТОВ (Component Colocation) ---
import DesignCodeHero from "./_components/DesignCodeHero";
import DesignCodeWays from "./_components/DesignCodeWays";
import DesignCodeRules from "./_components/DesignCodeRules";
import DesignCodeBans from "./_components/DesignCodeBans";
import DesignCodeFees from "./_components/DesignCodeFees";

// 1. METADATA — Полная SEO/OG/AI оптимизация
export const metadata: Metadata = {
  title: "Дизайн-код Астаны 2026 | Правила вывесок и наружной рекламы",
  description: "Правила дизайн-кода Астаны: согласование вывесок, языковые нормы, ставки платы по ст. 653–656 НК РК. Избегайте штрафов и демонтажа — узнайте требования за 3 минуты.",

  keywords: [
    "дизайн код астана 2026",
    "правила размещения вывески астана",
    "согласование вывески астана",
    "паспорт наружной рекламы",
    "плата за наружную рекламу астана",
    "ставки МРП реклама казахстан",
    "статья 655 нк рк реклама",
    "штраф за рекламу без согласования",
    "требования к вывескам астана",
    "закон о языках вывеска казахстан",
    "наружная реклама астана требования",
    "дизайн код фасад здания",
    "паспорт рекламы астана получить",
    "нк рк параграф 6 реклама",
    "производство вывесок дизайн код"
  ],

  alternates: {
    canonical: "https://adlight.kz/design-code",
  },

  // Явные директивы для краулеров — максимальный сниппет и превью
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },

  // OpenGraph — полная карточка для соцсетей и мессенджеров
  openGraph: {
    title: "Дизайн-код Астаны 2026: правила вывесок и наружной рекламы",
    description: "Согласование вывесок, языковые нормы, ставки платы (ст. 653–656 НК РК). Всё о дизайн-коде столицы в одном гайде.",
    url: "https://adlight.kz/design-code",
    siteName: "ADLight — Наружная реклама в Астане",
    type: "article",
    locale: "ru_RU",
    images: [
      {
        url: "/images/pages/design-code-hero.jpg",
        width: 1200,
        height: 630,
        alt: "Правильное оформление вывесок по Дизайн-коду Астаны — ADLight",
      },
    ],
  },

  // Twitter / X карточка
  twitter: {
    card: "summary_large_image",
    title: "Дизайн-код Астаны 2026 | Правила вывесок",
    description: "Языковые нормы, технические требования и ставки платы за размещение рекламы в Астане.",
    images: ["/images/pages/design-code-hero.jpg"],
  },
};

export default function DesignCodePage() {

  // 2. SCHEMA.ORG @graph — полная структура для Google Rich Results и AI
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      // --- WebPage (с speakable для Google AI Overviews / SGE) ---
      {
        "@type": "WebPage",
        "@id": "https://adlight.kz/design-code",
        "url": "https://adlight.kz/design-code",
        "name": "Дизайн-код Астаны 2026 | Правила вывесок и наружной рекламы",
        "description": "Единые правила оформления фасадов, вывесок и городской среды в Астане. Ставки платы по НК РК.",
        "inLanguage": "ru-KZ",
        // speakable — указывает ИИ (Google SGE, Голосовой поиск), что озвучивать
        "speakable": {
          "@type": "SpeakableSpecification",
          "cssSelector": ["h1", "h2", "#fees-heading"]
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Главная", "item": "https://adlight.kz" },
            { "@type": "ListItem", "position": 2, "name": "Дизайн-код", "item": "https://adlight.kz/design-code" }
          ]
        },
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "url": "https://adlight.kz/images/pages/design-code-hero.jpg",
          "width": 1200,
          "height": 630
        }
      },

      // --- Article (обязательные поля для Google Rich Results) ---
      {
        "@type": "Article",
        "@id": "https://adlight.kz/design-code#article",
        "url": "https://adlight.kz/design-code",
        "headline": "Дизайн-код Астаны 2026: правила вывесок и наружной рекламы",
        "description": "Руководство по размещению наружной рекламы в Астане: языковые нормы, технические требования, ставки платы по Налоговому кодексу РК.",
        "inLanguage": "ru-KZ",
        "datePublished": "2026-01-01",
        "dateModified": "2026-05-31",
        "image": {
          "@type": "ImageObject",
          "url": "https://adlight.kz/images/pages/design-code-hero.jpg",
          "width": 1200,
          "height": 630
        },
        "about": { "@type": "Thing", "name": "Дизайн-код Астаны", "description": "Единые требования к вывескам и наружной рекламе в столице Казахстана" },
        "author": { "@type": "Organization", "name": "ADLight", "url": "https://adlight.kz" },
        "publisher": {
          "@type": "Organization",
          "name": "ADLight",
          "url": "https://adlight.kz",
          "logo": { "@type": "ImageObject", "url": "https://adlight.kz/logo.png", "width": 200, "height": 60 }
        }
      },

      // --- HowTo — расчёт платы (попадает в Featured Snippets) ---
      {
        "@type": "HowTo",
        "name": "Как рассчитать плату за размещение наружной рекламы в Астане",
        "description": "Пошаговый расчёт ежемесячной платы за вывеску согласно ст. 655–656 НК РК.",
        "step": [
          { "@type": "HowToStep", "position": 1, "name": "Определите тип рекламной конструкции", "text": "Найдите свой тип в таблице ст. 655 НК РК: лайтбокс, вывеска до 2 кв.м, панно и др." },
          { "@type": "HowToStep", "position": 2, "name": "Уточните местоположение", "text": "Столица и города республиканского значения, областной город или районный центр — от этого зависит ставка." },
          { "@type": "HowToStep", "position": 3, "name": "Найдите ставку в МРП", "text": "Для столицы: лайтбокс — 3 МРП/мес., реклама до 2 кв.м — 2 МРП, от 10 до 20 кв.м — 20 МРП." },
          { "@type": "HowToStep", "position": 4, "name": "Умножьте ставку на МРП текущего года", "text": "МРП действует на 1-е число каждого месяца размещения. Проверьте актуальный МРП на сайте Министерства финансов РК." },
          { "@type": "HowToStep", "position": 5, "name": "Оплатите до 25-го числа текущего месяца", "text": "Первый месяц — до подачи уведомления. Далее — ежемесячно не позднее 25-го числа по месту размещения." }
        ]
      },

      // --- FAQPage — вопросы для Rich Results и ИИ-ответов ---
      {
        "@type": "FAQPage",
        "mainEntity": [
          ...DESIGN_CODE_WAYS.map(way => ({
             "@type": "Question",
             "name": way.title,
             "acceptedAnswer": { "@type": "Answer", "text": way.desc }
          })),
          {
            "@type": "Question",
            "name": "Сколько стоит размещение наружной рекламы в Астане?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Плата исчисляется в МРП (месячный расчётный показатель). Для столицы: лайтбоксы — 3 МРП/мес., реклама до 2 кв.м — 2 МРП/мес., от 10 до 20 кв.м — 20 МРП/мес. Местные органы вправе повышать ставки до 200% (ст. 655 НК РК)."
            }
          },
          {
            "@type": "Question",
            "name": "Что будет, если разместить рекламу без уведомления?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Согласно ст. 653 НК РК, при размещении наружной рекламы без направления уведомления ставки платы увеличиваются в два раза."
            }
          },
          {
            "@type": "Question",
            "name": "Кто платит за размещение наружной рекламы?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Плательщиками являются собственники объектов наружной рекламы или собственники зданий, на которых реклама размещается (ст. 654 НК РК). Государственные органы РК плательщиками не являются."
            }
          },
          {
            "@type": "Question",
            "name": "В какой срок нужно платить за наружную рекламу?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Плата вносится ежемесячно не позднее 25 числа текущего месяца. Первый платёж производится до направления уведомления в местный орган (ст. 656 НК РК)."
            }
          },
          {
            "@type": "Question",
            "name": "Как узаконить название вывески на казахском языке?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Есть три способа: 1) Перевод или транслитерация на казахский (3–5 дней); 2) Использование названия как в свидетельстве о регистрации ТОО/ИП (3–5 дней); 3) Регистрация товарного знака в Комитете интеллектуальной собственности (6–7 месяцев, даёт право на любой язык)."
            }
          },
          {
            "@type": "Question",
            "name": "Можно ли писать вывеску на английском языке в Астане?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "По Закону РК «О языках» вывески обязаны быть на государственном (казахском) языке. Иностранный бренд может использовать оригинальное название только при наличии зарегистрированного товарного знака в Комитете интеллектуальной собственности РК. Без товарного знака необходимо перевести или транслитерировать название на казахский язык."
            }
          },
          {
            "@type": "Question",
            "name": "Какой максимальный размер букв вывески по дизайн-коду Астаны?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Высота букв зависит от этажности здания: 1–2 этажа — до 0,80 м; 3–5 этажей — до 1,20 м; 6–9 этажей — до 1,80 м; 10 и более этажей — до 2,20 м. Конструкции должны размещаться только в отведённом паспортом фасада месте и не перекрывать окна, витражи и архитектурный декор."
            }
          }
        ]
      },


      // --- ItemList — все 13 типов конструкций из словаря (ИИ отвечает «какие типы рекламы разрешены») ---
      {
        "@type": "ItemList",
        "name": "Типы наружной рекламной конструкции в Астане",
        "description": "Полный перечень допустимых видов наружной рекламы согласно Дизайн-коду Астаны",
        "itemListElement": [
          ...DESIGN_CODE_TABS_LIST.flatMap((tab, tabIdx) =>
            DESIGN_CODE_TABS_DATA[tab.id].map((item, i) => ({
              "@type": "ListItem",
              "position": tabIdx * 10 + i + 1,
              "name": item.t,
              "description": item.d
            }))
          )
        ]
      },

      // --- Service Schema — 3 пути согласования (ИИ отвечает на юридические запросы о согласовании) ---
      {
        "@type": "Service",
        "name": "Согласование вывески по Дизайн-коду Астаны",
        "description": "Три официальных способа узаконить название вывески в Астане: перевод, по документам регистрации, товарный знак.",
        "provider": { "@type": "Organization", "name": "ADLight", "url": "https://adlight.kz" },
        "areaServed": { "@type": "City", "name": "Астана", "sameAs": "https://www.wikidata.org/wiki/Q1520" },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Способы согласования",
          "itemListElement": DESIGN_CODE_WAYS.map((way, i) => ({
            "@type": "Offer",
            "position": i + 1,
            "name": way.title,
            "description": way.desc
          }))
        }
      }
    ]
  };


  return (
    // Семантический контейнер с микроразметкой WebPage для лучшего понимания поисковиками и ИИ
    <main 
      itemScope 
      itemType="https://schema.org/WebPage" 
      className="min-h-screen bg-white font-sans selection:bg-orange-500/30 overflow-x-hidden"
    >
      {/* Вставляем Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* 1. HERO SECTION (Атомарный) */}
      <DesignCodeHero />

      {/* 2. ТРИ ПУТИ СОГЛАСОВАНИЯ (Атомарный) */}
      <DesignCodeWays />

      {/* 3. ТЕХНИЧЕСКИЕ ТРЕБОВАНИЯ (Атомарный) */}
      <DesignCodeRules />

      {/* 4. СТОП-ЛИСТ / ЗАПРЕТЫ (Атомарный) */}
      <DesignCodeBans />

      {/* 5. ПЛАТА ЗА РАЗМЕЩЕНИЕ РЕКЛАМЫ (Ст. 653–656 НК РК) */}
      <DesignCodeFees />

      {/* 5.5. ПРОМО-БАННЕР С КВИЗОМ */}
      <HomeOfferBanner serviceContext="general" source="Дизайн-код: Промо" />

      {/* 6. КАТАЛОГ ФОРМАТОВ */}
      <DesignCodeTabs />

      {/* 6. ЛИД-МАГНИТ */}
      <CallToAction 
          source="Страница: Дизайн-код" 
          title="Сделаем вывеску строго по Дизайн-коду" 
          subtitle="Мы знаем все требования наизусть. Проверим ваш фасад, подготовим эскиз и гарантируем отсутствие штрафов."
          buttonText="Проверить вывеску"
      />

      {/* 7. ДРУГИЕ УСЛУГИ */}
      <ServicesCarousel title="Наши услуги" subtitle="Производство по Дизайн-коду" />

    </main>
  );
}