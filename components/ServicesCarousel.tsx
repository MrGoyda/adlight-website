"use client";

import Link from "next/link";
import { useRef, useEffect } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

// Данные услуг
const services = [
  { 
    title: "Объемные буквы", 
    desc: "Лицевая, боковая и контражурная подсветка. Комбинирование техник.", 
    price: "от 450 тг/см", 
    link: "/services/volume-letters", 
    image: "/images/pages/services-letters.webp" 
  },
  { 
    title: "Световые короба", 
    desc: "Лайтбоксы сложных форм, инкрустация.", 
    price: "от 35 000 тг/кв.м", 
    link: "/services/lightboxes", 
    image: "/images/pages/services-lightboxes.webp" 
  },
  { 
    title: "Неоновые вывески", 
    desc: "Гибкий неон для интерьера и фотозон.", 
    price: "Индивидуально", 
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
    price: "от 45 000 тг", 
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
    price: "Проектно", 
    link: "/services/pylons", 
    image: "/images/pages/services-pylons.webp" 
  },
  { 
    title: "Таблички и Навигация", 
    desc: "Офисные таблички, указатели и системы навигации внутри зданий.", 
    price: "от 5 000 ₸", 
    link: "/services/navigation", 
    image: "/images/pages/services-navigation.webp"
  }
];

interface ServicesCarouselProps {
  title?: string;
  subtitle?: string;
  hiddenLink?: string;
}

export default function ServicesCarousel({ 
  title = "Что мы производим", 
  subtitle = "Полный цикл: от таблички до крышной установки",
  hiddenLink 
}: ServicesCarouselProps) {
  
  const displayedServices = services.filter(s => s.link !== hiddenLink);

  const sliderRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // Кнопки: плавный скролл
  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      // Включаем плавность для кнопок
      sliderRef.current.style.scrollBehavior = 'smooth';
      const scrollAmount = 400;
      sliderRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth' // Дублируем для надежности
      });
    }
  };

  // Мышь: Drag & Drop
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    isDown.current = true;
    // Отключаем плавность для прямого контроля (чтобы не было "желе")
    sliderRef.current.style.scrollBehavior = 'auto';
    sliderRef.current.style.cursor = 'grabbing';
    startX.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeft.current = sliderRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDown.current = false;
    if (sliderRef.current) sliderRef.current.style.cursor = 'grab';
  };

  const handleMouseUp = () => {
    isDown.current = false;
    if (sliderRef.current) sliderRef.current.style.cursor = 'grab';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5; // Скорость прокрутки
    sliderRef.current.scrollLeft = scrollLeft.current - walk;
  };

  // Колесико мыши (Wheel) - Исправленная логика
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const handleWheel = (e: WheelEvent) => {
      // Если это тачпад (горизонтальный скролл) - не вмешиваемся, пусть работает нативно
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        return;
      }

      // Проверяем, достигли ли мы края
      const isAtEnd = Math.ceil(slider.scrollLeft + slider.clientWidth) >= slider.scrollWidth - 10;
      const isAtStart = slider.scrollLeft <= 0;

      // Если крутим вниз и уперлись в конец -> скроллим страницу
      if (e.deltaY > 0 && isAtEnd) return;
      // Если крутим вверх и уперлись в начало -> скроллим страницу
      if (e.deltaY < 0 && isAtStart) return;

      // Иначе перехватываем и скроллим слайдер
      e.preventDefault();
      
      // Отключаем плавность CSS для мгновенной реакции на колесо
      slider.style.scrollBehavior = 'auto';
      slider.scrollLeft += e.deltaY;
    };

    // Добавляем { passive: false } чтобы работал preventDefault
    slider.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      slider.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <section data-aos="fade-up" className="py-10 lg:py-24 bg-[#0F172A] overflow-hidden border-t border-slate-800">
       <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-6">
            <div>
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-4">{title}</h2>
              <p className="text-gray-400 text-sm md:text-base">{subtitle}</p>
            </div>
            
            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-start">
               <Link href="/services" className="text-orange-500 font-bold text-sm flex items-center gap-2 hover:text-orange-400 transition whitespace-nowrap">
                  Смотреть все <ArrowRight className="w-4 h-4"/>
               </Link>

               <div className="hidden md:flex gap-3">
                  <button onClick={() => scroll('left')} className="p-3 rounded-full border border-slate-700 text-white hover:bg-slate-800 transition active:scale-95">
                     <ChevronLeft className="w-6 h-6"/>
                  </button>
                  <button onClick={() => scroll('right')} className="p-3 rounded-full bg-orange-600 text-white hover:bg-orange-700 transition shadow-lg active:scale-95">
                     <ChevronRight className="w-6 h-6"/>
                  </button>
               </div>
            </div>
          </div>
          
          {/* СЛАЙДЕР КОНТЕЙНЕР 
             md:snap-none — отключает прилипание на десктопе для плавности мыши
             snap-x — включает прилипание на мобилках для удобства свайпа
          */}
          <div 
            ref={sliderRef}
            onMouseDown={handleMouseDown} 
            onMouseLeave={handleMouseLeave} 
            onMouseUp={handleMouseUp} 
            onMouseMove={handleMouseMove}
            className="flex overflow-x-auto gap-4 md:gap-6 pb-8 hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0 select-none cursor-grab active:cursor-grabbing snap-x snap-mandatory md:snap-none scroll-pl-4"
          >
              {displayedServices.map((service, i) => (
                <Link 
                  key={i} 
                  href={service.link} 
                  draggable={false} 
                  className="relative group min-w-[280px] md:min-w-[380px] h-[400px] md:h-[450px] flex-shrink-0 rounded-2xl overflow-hidden border border-slate-800 hover:border-orange-500/50 transition-colors flex-none snap-center"
                >
                  {/* Картинка */}
                  <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition duration-700 pointer-events-none" style={{ backgroundImage: `url(${service.image})` }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent opacity-90 pointer-events-none"></div>
                  
                  {/* Текст */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 pointer-events-none">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-orange-500 transition">{service.title}</h3>
                    <p className="text-gray-300 text-xs md:text-sm mb-6 line-clamp-2">{service.desc}</p>
                    <div className="flex justify-between items-center pt-4 border-t border-white/10">
                        <span className="text-orange-400 font-bold text-sm md:text-base">{service.price}</span>
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition">
                           <ArrowRight className="w-4 h-4 md:w-5 md:h-5"/>
                        </div>
                    </div>
                  </div>
               </Link>
              ))}
          </div>
       </div>
    </section>
  );
}