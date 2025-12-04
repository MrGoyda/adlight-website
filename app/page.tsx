// --- ИМПОРТ КОМПОНЕНТОВ ---
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

export default function Home() {
  
  // --- СБОР КОНТЕНТА ---
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


  return (
    <div className="min-h-screen bg-[#0B1120] font-sans">
      
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
      <ServicesCarousel title="Наши услуги" subtitle="От таблички до крышной установки" />

      {/* 5. ДИЗАЙН-КОД */}
      <DesignCodeBlock />

      {/* 6. ЭТАПЫ РАБОТЫ */}
      <StepsSection />

      {/* 7. ПОРТФОЛИО */}
      <ProjectsBento title="Последние проекты" subtitle="Гордость нашего производства" />

      {/* 8. ПРОИЗВОДСТВО */}
      <ProductionSection />

      {/* 9. FAQ */}
      <FaqSection />

      {/* 10. ОТЗЫВЫ */}
      <ReviewsCarousel />

      {/* 11. КАРТА И КОНТАКТЫ */}
      <ContactsSection />

      {/* 12. CTA */}
      <CallToAction source="Главная страница" />
      
    </div>
  );
}