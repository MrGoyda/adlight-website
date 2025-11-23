"use client";

import { useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const allReviews = [
  { name: "Айгерим С.", role: "Coffee Boom", text: "Заказывали объемные буквы для кофейни. Сделали за 3 дня, как и обещали. Монтажники аккуратные, мусор за собой убрали. Идеально!"},
  { name: "Ерлан М.", role: 'ТОО "StroyInvest"', text: "Отличная работа с документами. Сами подготовили эскиз для Акимата, согласовали с первого раза. Вы лучшие!"},
  { name: "Дмитрий К.", role: 'Магазин "Техно"', text: "Цена адекватная, качество на высоте. Понравилось, что есть свой цех, можно приехать и посмотреть материалы вживую. Рекомендую!"},
  { name: "Аслан К.", role: 'Торговый центр "Керуен"', text: "Заказали сложную крышную установку. Инженеры ADLight сами сделали расчёты и получили все разрешения. Работа выполнена точно в срок."},
  { name: "Виктория Т.", role: 'Фитнес-клуб "World Class"', text: "Наши неоновые вывески были изготовлены идеально. Цвет насыщенный, как и просили. Отличная коммуникация на всех этапах."},
  { name: "Рашид Б.", role: 'АЗС "GasPoint"', text: "Постоянно работаем с ADLight по брендированию заправок. Пленка Oracal служит дольше, чем у конкурентов. Качество стабильное."},
  { name: "Тимур Н.", role: 'Бар "Loft"', text: "Сделали интерьерную подсветку и логотип над барной стойкой. Вписалось в дизайн идеально. Спасибо за оперативность."},
  { name: "Елена С.", role: 'Студия маникюра "Nails"', text: "Заказывала панель-кронштейн. Теперь нас видно с двух сторон улицы. Дизайн-проект сделали бесплатно и быстро."}
];

export default function ReviewsCarousel() {
  const sliderRef = useRef<HTMLDivElement>(null);
  
  // Refs для Drag & Drop
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // Скролл кнопками
  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
        const scrollAmount = 400; 
        sliderRef.current.scrollBy({
            left: direction === 'right' ? scrollAmount : -scrollAmount,
            behavior: 'smooth'
        });
    }
  };

  // Drag Logic
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
      if (sliderRef.current) { sliderRef.current.style.cursor = 'grab'; sliderRef.current.style.scrollBehavior = 'smooth'; } 
  };
  const handleMouseUp = () => { 
      isDown.current = false; 
      if (sliderRef.current) { sliderRef.current.style.cursor = 'grab'; sliderRef.current.style.scrollBehavior = 'smooth'; } 
  };
  const handleMouseMove = (e: React.MouseEvent) => { 
      if (!isDown.current || !sliderRef.current) return; 
      e.preventDefault(); 
      const x = e.pageX - sliderRef.current.offsetLeft; 
      const walk = (x - startX.current) * 1.5; 
      sliderRef.current.scrollLeft = scrollLeft.current - walk; 
  };

  // Wheel Logic (Колесико)
  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      const handleWheel = (e: WheelEvent) => {
        if (e.deltaY === 0) return;
        const isAtEnd = Math.ceil(slider.scrollLeft + slider.clientWidth) >= slider.scrollWidth - 2;
        const isAtStart = slider.scrollLeft <= 0;
        if ((e.deltaY > 0 && isAtEnd) || (e.deltaY < 0 && isAtStart)) return;
        e.preventDefault();
        slider.scrollLeft += e.deltaY;
      };
      slider.addEventListener('wheel', handleWheel, { passive: false });
      return () => slider.removeEventListener('wheel', handleWheel);
    }
  }, []);

  return (
    <section data-aos="fade-up" className="py-24 bg-[#0F172A] border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Что говорят клиенты</h2>
              <div className="flex items-center gap-2 text-gray-400">
                <span>Рейтинг 4.9 на основе 82 отзывов в</span>
                <span className="font-bold text-white bg-green-600 px-2 py-0.5 rounded text-sm">2GIS</span>
              </div>
            </div>
            <div className="hidden md:flex gap-3">
               <button onClick={() => scroll('left')} className="p-3 rounded-full border border-slate-700 text-white hover:bg-slate-800 transition active:scale-95"><ChevronLeft className="w-6 h-6"/></button>
               <button onClick={() => scroll('right')} className="p-3 rounded-full bg-orange-600 text-white hover:bg-orange-700 transition shadow-lg active:scale-95"><ChevronRight className="w-6 h-6"/></button>
            </div>
          </div>
          
          <div 
            ref={sliderRef}
            onMouseDown={handleMouseDown} onMouseLeave={handleMouseLeave} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}
            className="flex overflow-x-auto gap-6 pb-8 hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0 select-none cursor-grab active:cursor-grabbing"
          >
             {allReviews.map((rev, i) => (
               <div 
                 key={i} 
                 data-aos="fade-up" // Оставляем анимацию AOS внутри карточек
                 data-aos-delay={i * 50} 
                 className="relative group flex-none w-[85vw] md:w-[30%] bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-slate-700 transition select-none"
               >
                  <div className="flex gap-1 text-orange-500 mb-4">
                     {[1,2,3,4,5].map(star => <svg key={star} className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>)}
                  </div>
                  <p className="text-gray-300 mb-6 leading-relaxed">"{rev.text}"</p>
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center font-bold text-slate-500">{rev.name[0]}</div>
                     <div>
                        <div className="text-white font-bold">{rev.name}</div>
                        <div className="text-xs text-gray-500">{rev.role}</div>
                     </div>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </section>
  );
}