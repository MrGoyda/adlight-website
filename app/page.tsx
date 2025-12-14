import ClientsMarquee from "@/components/ClientsMarquee";
import StatsSection from "@/components/StatsSection";
import ProductionSection from "@/components/ProductionSection";
import ProjectsBento from "@/components/ProjectsBento";
import ServicesCarousel from "@/components/ServicesCarousel";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import CallToAction from "@/components/CallToAction";
import DesignCodeBlock from "@/components/DesignCodeBlock";
import StepsSection from "@/components/StepsSection";
import FaqSection from "@/components/FaqSection";
import ContactsSection from "@/components/ContactsSection";

// Наш новый Hero (Client Component)
import HeroSection from "@/components/HeroSection";

// --- СЕРВЕРНАЯ УТИЛИТА ---
import { getImagesFromFolder } from "@/lib/serverUtils";

// --- НОВЫЙ ИМПОРТ: Данные для FAQ (чтобы синхронизировать SEO и картинку) ---
import { FAQS } from "@/lib/faqData";

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
    "mainEntity": FAQS.map(item => ({
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
    <main className="min-h-screen bg-[#0B1120] font-sans">
      
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

      {/* 2. БЕГУЩАЯ СТРОКА */}
      <ClientsMarquee />

      {/* 3. СТАТИСТИКА */}
      <StatsSection />

      {/* 4. УСЛУГИ */}
      {/* Добавил id="services" чтобы можно было давать ссылку adlight.kz/#services */}
      <section id="services">
        <ServicesCarousel title="Наши услуги" subtitle="От таблички до крышной установки" />
      </section>

      {/* 5. ДИЗАЙН-КОД */}
      <DesignCodeBlock />

      {/* 6. ЭТАПЫ РАБОТЫ */}
      <StepsSection />

      {/* 7. ПОРТФОЛИО */}
      <section id="portfolio">
        <ProjectsBento title="Последние проекты" subtitle="Гордость нашего производства" />
      </section>

      {/* 8. ПРОИЗВОДСТВО */}
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