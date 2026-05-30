import ClientsMarquee from "@/components/ClientsMarquee";
import StatsSection from "@/components/StatsSection";
import ProductionSection from "@/components/ProductionSection";
import ProjectsBento from "@/components/ProjectsBento";
import NicheServices from "@/components/NicheServices";

import ReviewsCarousel from "@/components/ReviewsCarousel";
import CallToAction from "@/components/CallToAction";
import DesignCodeBlock from "@/components/DesignCodeBlock";
import StepsSection from "@/components/StepsSection";
import FaqSection from "@/components/FaqSection";
import ContactsSection from "@/components/ContactsSection";

// Наш новый Hero (Client Component)
import HeroSection from "@/components/HeroSection";
import HomePainsSection from "@/components/HomePainsSection";
import HomeOfferBanner from "@/components/HomeOfferBanner";
import VolumeLettersShowcase from "@/components/VolumeLettersShowcase";
import DynamicServicesHub from "@/components/DynamicServicesHub";
import SpecializedServicesGrid from "@/components/SpecializedServicesGrid";


// --- СЕРВЕРНАЯ УТИЛИТА ---
import { getImagesFromFolder } from "@/lib/serverUtils";

// --- НОВЫЙ ИМПОРТ: Данные для FAQ (чтобы синхронизировать SEO и картинку) ---
import { HOME_FAQ } from "@/dictionaries/home";

// --- НАСТРОЙКА КЭШИРОВАНИЯ (ISR) ---
// Обновляем страницу и перемешиваем картинки раз в час (3600 сек),
// чтобы сервер не нагружался при каждом заходе пользователя.
export const revalidate = 3600;

export default function Home() {
  
  // --- СБОР КОНТЕНТА (Твой старый код перемешивания) ---
  const shuffle = (arr: string[]) => arr.sort(() => 0.5 - Math.random());

  const lettersImages = shuffle([
    ...getImagesFromFolder("face-lit"),
    ...getImagesFromFolder("full-lit"),
    ...getImagesFromFolder("combo-lit"),
    ...getImagesFromFolder("side-lit"),
  ]).slice(0, 8);

  const largeImages = shuffle([
    ...getImagesFromFolder("roof-installations"),
    ...getImagesFromFolder("entrance-groups"),
    ...getImagesFromFolder("pylons"),
  ]).slice(0, 8);

  const interiorImages = shuffle([
    ...getImagesFromFolder("neon"),
    ...getImagesFromFolder("interior"),
    ...getImagesFromFolder("loft-lamps"),
    ...getImagesFromFolder("wood-style"),
  ]).slice(0, 8);

  const navImages = shuffle([
    ...getImagesFromFolder("navigation"),
    ...getImagesFromFolder("lightboxes"),
    ...getImagesFromFolder("panel-brackets"),
  ]).slice(0, 8);

  // --- НОВОЕ: ГЕНЕРАЦИЯ SCHEMA.ORG ---
  // Создаем JSON-LD автоматически из тех же данных, что и в блоке FAQ
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": HOME_FAQ.map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a
      }
    }))
  };

  return (
    // Заменили <div> на <main> для лучшего понимания роботами структуры
    <main className="min-h-screen bg-white font-sans overflow-x-clip">

      
      {/* Вставляем невидимый скрипт для нейросетей */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      {/* 1. HERO SECTION (CLIENT) */}
      <HeroSection 
         lettersImages={lettersImages}
         largeImages={largeImages}
         interiorImages={interiorImages}
         navImages={navImages}
      />

      {/* 1.5. СЕКЦИЯ БОЛЕЙ И РЕШЕНИЙ (SEO / AI ОПТИМИЗИРОВАННАЯ) */}
      <HomePainsSection />

      {/* 1.5.5. ШОУКЕЙС ТЕХНОЛОГИЙ ОБЪЕМНЫХ БУКВ (ИНТЕРАКТИВНЫЙ ДЕНЬ/НОЧЬ) */}
      <VolumeLettersShowcase />

      {/* 1.6. СЕКЦИЯ ОФФЕРА (СКИДКА 10% И БЕСПЛАТНЫЙ ЗАМЕР) */}
      <HomeOfferBanner />

      {/* 2. БЕГУЩАЯ СТРОКА */}
      <ClientsMarquee />

      {/* 3. СТАТИСТИКА */}
      <StatsSection />

      {/* 4. ДИНАМИЧЕСКИЙ ХАБ УСЛУГ (iOS SEGMENTED TABS) */}
      {/* Добавил id="services" чтобы сохранить работоспособность навигационных ссылок adlight.kz/#services */}
      <section id="services">
        <DynamicServicesHub />
      </section>

      {/* 4.3. СПЕЦИАЛИЗИРОВАННЫЕ УСЛУГИ (АВТО, РЕМОНТ, EVENT) */}
      <SpecializedServicesGrid />

      {/* 4.5. РЕШЕНИЯ ПО НИШАМ БИЗНЕСА (SEO / AI ОПТИМИЗИРОВАННЫЙ БЛОК) */}
      <NicheServices />

      {/* 5. ДИЗАЙН-КОД АСТАНЫ */}
      <DesignCodeBlock />

      {/* 6. ЭТАПЫ РАБОТЫ */}
      <StepsSection />

      {/* 7. ПОРТФОЛИО */}
      <section id="portfolio">
        <ProjectsBento title="Последние проекты" subtitle="Гордость нашего производства в Астане" />
      </section>

      {/* 8. ПРОИЗВОДСТВЕННЫЙ БЛОК (E-E-A-T) */}
      <ProductionSection />

      {/* 9. FAQ */}
      <section id="faq">
        <FaqSection />
      </section>

      {/* 10. ОТЗЫВЫ */}
      <ReviewsCarousel />

      {/* 11. КАРТА И КОНТАКТЫ */}
      <section id="contacts">
        <ContactsSection />
      </section>

      {/* 12. CTA */}
      <CallToAction source="Главная страница" />
      
    </main>
  );
}