"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import { SITE_PRICES } from "@/config/site";

// Данные услуг
const services = [
  { 
    title: "Объемные буквы", 
    desc: "Лицевая, боковая и контражурная подсветка. Комбинирование техник.", 
    price: SITE_PRICES.volumeLetters, 
    link: "/services/volume-letters", 
    image: "/images/pages/services-letters.webp" 
  },
  { 
    title: "Световые короба", 
    desc: "Лайтбоксы сложных форм, инкрустация.", 
    price: SITE_PRICES.lightboxes, 
    link: "/services/lightboxes", 
    image: "/images/pages/services-lightboxes.webp" 
  },
  { 
    title: "Неоновые вывески", 
    desc: "Гибкий неон для интерьера и фотозон.", 
    price: SITE_PRICES.neon, 
    link: "/services/neon", 
    image: "/images/pages/services-neon.webp" 
  },
  { 
    title: "Крышные установки", 
    desc: "Громадные буквы на крышу. Расчет нагрузок.", 
    price: "Проектно", 
    link: "/services/roof-installations", 
    image: "/images/pages/services-roof-installations.webp" 
  },
  { 
    title: "Панель-кронштейны", 
    desc: "Двусторонние торцевые вывески.", 
    price: SITE_PRICES.panelBrackets, 
    link: "/services/panel-brackets", 
    image: "/images/pages/services-panel-brackets.webp" 
  },
  { 
    title: "Входные группы", 
    desc: "Козырьки, композит, полная обшивка.", 
    price: "Проектно", 
    link: "/services/entrance-groups", 
    image: "/images/pages/services-entrance-groups.webp" 
  },
  { 
    title: "Рекламные стелы", 
    desc: "Отдельно стоящие конструкции, пилоны для АЗС и навигации.", 
    price: SITE_PRICES.pylons, 
    link: "/services/pylons", 
    image: "/images/pages/services-pylons.webp" 
  },
  { 
    title: "Таблички и Навигация", 
    desc: "Офисные таблички, указатели и системы навигации внутри зданий.", 
    price: SITE_PRICES.navigation, 
    link: "/services/navigation", 
    image: "/images/pages/services-navigation.webp"
  }
];

interface ServicesCarouselProps {
  title?: string;
  subtitle?: string;
  hiddenLink?: string;
  headingLevel?: "h2" | "h3";
}

export default function ServicesCarousel({ 
  title = "Изготовление наружной рекламы в Астане", 
  subtitle = "Собственное производство вывесок полного цикла с гарантией до 3 лет",
  hiddenLink,
  headingLevel = "h2"
}: ServicesCarouselProps) {
  
  const displayedServices = services.filter(s => s.link !== hiddenLink);

  const sliderRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = 420;
      sliderRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    isDown.current = true;
    sliderRef.current.style.cursor = 'grabbing';
    sliderRef.current.style.scrollBehavior = 'auto';
    sliderRef.current.style.scrollSnapType = 'none'; // Отключаем привязку скролла для плавного драга
    startX.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeft.current = sliderRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDown.current = false;
    if (sliderRef.current) {
      sliderRef.current.style.cursor = 'grab';
      sliderRef.current.style.scrollBehavior = 'smooth';
      sliderRef.current.style.scrollSnapType = 'x mandatory'; // Возвращаем привязку скролла
    }
  };

  const handleMouseUp = () => {
    isDown.current = false;
    if (sliderRef.current) {
      sliderRef.current.style.cursor = 'grab';
      sliderRef.current.style.scrollBehavior = 'smooth';
      sliderRef.current.style.scrollSnapType = 'x mandatory'; // Возвращаем привязку скролла
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.6; // Увеличен коэффициент чувствительности
    sliderRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const triggerHaptic = () => {
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const handleScrollClick = (direction: 'left' | 'right') => {
    triggerHaptic();
    scroll(direction);
  };

  // Динамически рендерим нужный уровень заголовка для правильной SEO/AI иерархии
  const HeadingTag = headingLevel;

  return (
    <section 
      className="py-20 lg:py-28 bg-white relative overflow-hidden border-t border-slate-200/60"
      aria-label={title}
    >
       {/* Decorative subtle ambient light glow */}
       <div className="absolute left-0 bottom-0 w-[500px] h-[500px] bg-blue-500/[0.01] rounded-full pointer-events-none -z-10" />

       <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
            <div className="text-left space-y-4">
              <HeadingTag className="text-3xl sm:text-4xl md:text-5.5xl font-black text-slate-950 tracking-tight leading-none">
                 {title.includes("услуги") ? (
                   <>
                     Наши{" "}
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-600 to-red-600">услуги в Астане</span>
                   </>
                 ) : title}
              </HeadingTag>
              <p className="text-slate-500 text-sm md:text-base font-semibold">{subtitle}</p>
            </div>
            
            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end self-start md:self-end">
               <Link href="/services" className="text-orange-600 font-bold text-sm flex items-center gap-2 hover:text-orange-500 transition whitespace-nowrap">
                  Смотреть все <ArrowRight className="w-4 h-4"/>
               </Link>

               <div className="hidden md:flex gap-2.5">
                  <button 
                    onClick={() => handleScrollClick('left')} 
                    className="p-3.5 rounded-xl border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 transition active:scale-95 shadow-sm cursor-pointer"
                    aria-label="Предыдущий слайд"
                  >
                     <ChevronLeft className="w-5 h-5"/>
                  </button>
                  <button 
                    onClick={() => handleScrollClick('right')} 
                    className="p-3.5 rounded-xl bg-orange-600 text-white hover:bg-orange-700 transition shadow-md shadow-orange-600/10 active:scale-95 cursor-pointer"
                    aria-label="Следующий слайд"
                  >
                     <ChevronRight className="w-5 h-5"/>
                  </button>
               </div>
            </div>
          </div>
          
          {/* СЛАЙДЕР КОНТЕЙНЕР (С разметкой Schema.org ItemList для поисковиков и ИИ-ботов) */}
          <div 
            ref={sliderRef}
            onMouseDown={handleMouseDown} 
            onMouseLeave={handleMouseLeave} 
            onMouseUp={handleMouseUp} 
            onMouseMove={handleMouseMove}
            className="flex overflow-x-auto gap-6 pb-8 hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0 select-none cursor-grab active:cursor-grabbing snap-x snap-mandatory"
            itemScope 
            itemType="https://schema.org/ItemList"
          >
              {displayedServices.map((service, i) => (
                <FadeIn
                  key={i}
                  delay={i * 50}
                  threshold={0.1}
                  className="flex-none snap-center"
                >
                  <div
                    itemProp="itemListElement"
                    itemScope
                    itemType="https://schema.org/ListItem"
                    className="relative block"
                  >
                    {/* Метаданные для ИИ и Поисковых систем */}
                    <meta itemProp="position" content={String(i + 1)} />
                    <span itemProp="name" className="hidden">{service.title}</span>
                    
                    <Link 
                      href={service.link} 
                      draggable={false} 
                      className="relative group block w-[85vw] sm:w-[380px] h-[400px] md:h-[450px] rounded-3xl overflow-hidden border border-slate-200/80 hover:border-orange-500/30 transition duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.01)] hover:shadow-lg select-none"
                      itemProp="url"
                    >
                      {/* Картинка */}
                      <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition duration-700 pointer-events-none" style={{ backgroundImage: `url(${service.image})` }}></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent opacity-90 pointer-events-none"></div>
                      
                      {/* Текст */}
                      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 pointer-events-none">
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-orange-400 transition tracking-tight">{service.title}</h3>
                        <p className="text-gray-300 text-xs md:text-sm mb-6 line-clamp-2">{service.desc}</p>
                        <div className="flex justify-between items-center pt-4 border-t border-white/10">
                            <span className="text-orange-400 font-bold text-sm md:text-base">{service.price}</span>
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition">
                               <ArrowRight className="w-4 h-4 md:w-5 md:h-5"/>
                            </div>
                        </div>
                      </div>
                   </Link>
                  </div>
                </FadeIn>
              ))}
          </div>
       </div>
    </section>
  );
}