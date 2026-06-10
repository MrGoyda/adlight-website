import HeroSlider from "@/components/sections/Hero/HeroSlider";
import HeroActions from "@/components/sections/Hero/HeroActions";
import BlueprintGrid from "@/components/ui/BlueprintGrid";
import FadeIn from "@/components/ui/FadeIn";

interface HeroSectionProps {
  lettersImages: string[];
  largeImages: string[];
  interiorImages: string[];
  navImages: string[];
}

export default function HeroSection({
  lettersImages,
  largeImages,
  interiorImages,
}: HeroSectionProps) {
  // Слайдер картинок: собираем премиальные работы без визуального шума
  const sliderImages = [
    ...lettersImages.slice(0, 3),
    ...largeImages.slice(0, 3),
    ...interiorImages.slice(0, 2),
  ].filter(Boolean);

  // Надежные фоллбэки с реальными проектами
  if (sliderImages.length === 0) {
    sliderImages.push(
      "/images/portfolio/arustone/arustone-01.webp",
      "/images/portfolio/kmg/kmg-01.webp",
      "/images/portfolio/aigelova-beauty/aigelova-beauty-01.webp",
      "/images/portfolio/family-care/family-care-01.webp"
    );
  }

  return (
    <section className="relative w-full py-16 lg:py-28 overflow-hidden border-b border-slate-200 flex items-center min-h-[calc(100vh-80px)] bg-white">
      {/* Чертежная сетка и фоновые Apple-градиенты */}
      <BlueprintGrid showGradients={true} />

      <div className="container mx-auto px-4 grid lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
        {/* ЛЕВАЯ КОЛОНКА: SEO/AI-ОПТИМИЗИРОВАННЫЙ ТЕКСТ (7 колонок) */}
        <div className="lg:col-span-7 space-y-8 flex flex-col justify-center text-left">
          {/* ПРЕМИУМ-ПЛАШКА (Более 300 отзывов, 5.0 рейтинг, Лучшие) */}
          <FadeIn>
            <div className="inline-flex flex-wrap items-center gap-3 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-md shadow-slate-100 text-xs font-bold text-slate-800 w-fit leading-tight">
              <div className="flex items-center gap-1 text-orange-500 font-extrabold text-sm">
                ★★★★★
              </div>
              <span className="text-slate-600">более 300 отзывов</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
              <span className="text-slate-950 font-black">Рейтинг 5.0</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
              <span className="text-orange-600 font-black">Лучшие по Астане и регионам</span>
            </div>
          </FadeIn>

          {/* Восхитительный H1, оптимизированный под SEO и ИИ (AISO) */}
          <FadeIn delay={80}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-[68px] font-black text-slate-950 leading-[1.05] tracking-tight">
              Рекламное агентство <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-600 to-red-600">
                полного цикла в Астане
              </span>
            </h1>
          </FadeIn>

          {/* Уникальный, продающий подзаголовок */}
          <FadeIn delay={160}>
            <p className="text-slate-700 text-base md:text-lg lg:text-xl max-w-xl leading-relaxed font-semibold">
              Оформляем фасады и изготавливаем световые вывески любой сложности от 3 дней. Беремся за нестандартные задачи и реализуем проекты по высшему технологическому стандарту СНиП РК с гарантией в договоре.
            </p>
          </FadeIn>

          {/* Блок кнопок действий */}
          <FadeIn delay={240}>
            <HeroActions />
          </FadeIn>
        </div>

        {/* ПРАВАЯ КОЛОНКА: СЛАЙДЕР БЕЗ ЛИШНЕГО ШУМА (5 колонок) */}
        <div className="lg:col-span-5 relative w-full aspect-[4/5] sm:max-w-md lg:max-w-none mx-auto opacity-0 animate-fade-in-left-fast">
          <HeroSlider sliderImages={sliderImages} />
        </div>
      </div>
    </section>
  );
}