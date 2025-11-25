"use client";

import Link from "next/link";
import { useRef, useEffect } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

// Данные услуг (ДОБАВЛЕНЫ: Стелы и Навигация)
const services = [
  { 
    title: "Объемные буквы", 
    desc: "Лицевая, боковая и контражурная подсветка. Комбинирование техник.", 
    price: "от 400 тг/см", 
    link: "/services/volume-letters", 
    image: "/images/calc/face.jpg" 
  },
  { 
    title: "Световые короба", 
    desc: "Лайтбоксы сложных форм, инкрустация.", 
    price: "от 45 000 тг/кв.м", 
    link: "/services/lightboxes", 
    image: "/images/calc/lightbox-1.jpg" 
  },
  { 
    title: "Неоновые вывески", 
    desc: "Гибкий неон для интерьера и фотозон.", 
    price: "Индивидуально", 
    link: "/services/neon", 
    image: "/neon.jpg" 
  },
  { 
    title: "Крышные установки", 
    desc: "Громадные буквы на крышу. Расчет нагрузок.", 
    price: "Проектно", 
    link: "/services/roof-installations", 
    image: "/krisha.jpg" 
  },
  { 
    title: "Панель-кронштейны", 
    desc: "Двусторонние торцевые вывески.", 
    price: "от 35 000 тг", 
    link: "/services/panel-brackets", 
    image: "/panel.jpg" 
  },
  { 
    title: "Входные группы", 
    desc: "Козырьки, композит, полная обшивка.", 
    price: "Проектно", 
    link: "/services/entrance-groups", 
    image: "/agro.jpg" 
  },
  // --- НОВЫЕ УСЛУГИ ---
  { 
    title: "Рекламные стелы", 
    desc: "Отдельно стоящие конструкции, пилоны для АЗС и навигации.", 
    price: "Проектно", 
    link: "/services/pylons", 
    image: "/kmg.jpeg" 
  },
  { 
    title: "Таблички и Навигация", 
    desc: "Офисные таблички, указатели и системы навигации внутри зданий.", 
    price: "от 5 000 ₸", 
    link: "/services/navigation", 
    image: "/1solution.jpg" // Используем фото интерьерной вывески
  }
];

interface ServicesCarouselProps {
  title?: string;
  subtitle?: string;
  hiddenLink?: string; // Пропс для скрытия текущей услуги
}

export default function ServicesCarousel({ 
  title = "Что мы производим", 
  subtitle = "Полный цикл: от таблички до крышной установки",
  hiddenLink 
}: ServicesCarouselProps) {
  
  // ФИЛЬТРАЦИЯ: Скрываем карточку, если ссылка совпадает
  const displayedServices = services.filter(s => s.link !== hiddenLink);

  const sliderRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = 400;
      sliderRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Логика Drag & Drop (Мышь)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    isDown.current = true;
    sliderRef.current.style.cursor = 'grabbing';
    sliderRef.current.style.scrollBehavior = 'auto';
    startX.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeft.current = sliderRef.current.scrollLeft;
  };
  const handleMouseLeave = () => {
    isDown.current = false;
    if (sliderRef.current) { 
        sliderRef.current.style.cursor = 'grab'; 
        sliderRef.current.style.scrollBehavior = 'smooth'; 
    }
  };
  const handleMouseUp = () => {
    isDown.current = false;
    if (sliderRef.current) { 
        sliderRef.current.style.cursor = 'grab'; 
        sliderRef.current.style.scrollBehavior = 'smooth'; 
    }
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    sliderRef.current.scrollLeft = scrollLeft.current - walk;
  };

  // Логика колесика мыши (Wheel)
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;

      const isAtEnd = Math.ceil(slider.scrollLeft + slider.clientWidth) >= slider.scrollWidth - 5;
      const isAtStart = slider.scrollLeft <= 0;
      
      if ((e.deltaY > 0 && isAtEnd) || (e.deltaY < 0 && isAtStart)) {
          return; 
      }
      
      e.preventDefault();
      slider.scrollLeft += e.deltaY;
    };

    slider.addEventListener('wheel', handleWheel, { passive: false });
    return () => slider.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <section data-aos="fade-up" className="py-12 lg:py-24 bg-[#0F172A] overflow-hidden border-t border-slate-800">
       <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
              <p className="text-gray-400">{subtitle}</p>
            </div>
            
            <div className="flex items-center gap-6">
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
          
          {/* Слайдер */}
          <div 
            ref={sliderRef}
            onMouseDown={handleMouseDown} 
            onMouseLeave={handleMouseLeave} 
            onMouseUp={handleMouseUp} 
            onMouseMove={handleMouseMove}
            className="flex overflow-x-auto gap-6 pb-8 hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0 select-none cursor-grab active:cursor-grabbing"
          >
             {displayedServices.map((service, i) => (
               <Link 
                  key={i} 
                  href={service.link} 
                  draggable={false} 
                  className="relative group min-w-[300px] md:min-w-[380px] h-[450px] flex-shrink-0 rounded-2xl overflow-hidden border border-slate-800 hover:border-orange-500/50 transition-colors flex-none"
               >
                  {/* Картинка */}
                  <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition duration-700 pointer-events-none" style={{ backgroundImage: `url(${service.image})` }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent opacity-90 pointer-events-none"></div>
                  
                  {/* Текст */}
                  <div className="absolute inset-0 flex flex-col justify-end p-8 pointer-events-none">
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-orange-500 transition">{service.title}</h3>
                    <p className="text-gray-300 text-sm mb-6 line-clamp-2">{service.desc}</p>
                    <div className="flex justify-between items-center pt-4 border-t border-white/10">
                        <span className="text-orange-400 font-bold">{service.price}</span>
                        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition">
                           <ArrowRight className="w-5 h-5"/>
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