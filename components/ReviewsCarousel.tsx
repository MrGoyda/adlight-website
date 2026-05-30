"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, MessageSquare, Star } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";

const allReviews = [
  { name: "Айгерим С.", role: "Кофейня Coffee Boom", text: "Заказывали светящиеся объемные буквы для нашей кофейни. Сделали очень быстро, за 3 дня уже всё привезли и установили. Парни-монтажники вообще молодцы, всё аккуратно повесили, мусор за собой убрали, подключили. Сама вывеска горит ярко и ровно, клиенты постоянно фоткаются на фоне!"},
  { name: "Ерлан М.", role: 'ТОО "StroyInvest"', text: "Большое спасибо команде ADLight за помощь с Акиматом! Мы вообще не знали, как эти вывески согласовывать, куча бумаг. Ребята сами сделали все эскизы по дизайн-коду и отправили через e-Otinish. Одобрение получили быстро и без нервов. Очень профессиональный подход."},
  { name: "Дмитрий К.", role: 'Магазин "Техно"', text: "Искали надежного производителя вывесок в Астане без посредников. Решил съездить к ним в цех на Аспара, посмотреть производство. Там реально стоят ЧПУ станки, лазеры, всё серьезно. Заказали вывеску из композита, качество швов отличное, диоды яркие. Цена честная, без накруток."},
  { name: "Аслан К.", role: 'Торговый центр "Керуен"', text: "Сотрудничаем по сложным конструкциям. Заказывали большую вывеску на крышу торгового центра. ADLight полностью взяли на себя все расчеты нагрузок на ветер, чертежи и бумажную волокиту с паспортом рекламы. Изготовили и смонтировали в срок, конструкция держится намертво."},
  { name: "Виктория Т.", role: 'Фитнес-клуб "World Class"', text: "Очень круто сделали нам неоновый логотип на ресепшн и металлическую вывеску на входе! Всё выглядит безумно аккуратно, никаких следов клея или стыков не видно, даже если близко подойти. В интерьере смотрится дорого и современно, спасибо!"},
  { name: "Рашид Б.", role: 'Сеть АЗС "GasPoint"', text: "Уже не первый раз заказываем у ребят оклейку наших брендовых машин. Пленка Oracal с ламинацией реально качественная, машины ездят по трассе и в мороз, и в жару, ничего не отклеивается и цвета не тускнеют. Отличный печатный цех, рисунки четкие."},
  { name: "Тимур Н.", role: 'Бар "Loft"', text: "Заказывали у них стильный короб из композита с подсветкой и большие объемные буквы с лампочками в стиле лофт. Сделали именно так, как мы на макете согласовали. Свет мягкий, приятный, в баре теперь очень крутая атмосфера. Блоки питания работают стабильно."},
  { name: "Елена С.", role: 'Студия "Nails"', text: "Огромное спасибо за панель-кронштейн! Сделали круглый, светится с двух сторон, теперь нашу студию маникюра видно издалека даже с левого берега. Отдельное спасибо дизайнеру, которая бесплатно нарисовала нам классный эскиз вывески."}
];

export default function ReviewsCarousel() {
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

  const triggerHaptic = () => {
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const handleScrollClick = (direction: 'left' | 'right') => {
    triggerHaptic();
    scroll(direction);
  };

  return (
    <section className="py-20 lg:py-28 bg-slate-50/50 relative overflow-hidden border-t border-slate-200/60">
      {/* Decorative ambient light glow */}
      <div className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-orange-500/[0.01] rounded-full pointer-events-none -z-10" />
      
      <div className="container mx-auto px-4">
        
        {/* Header Block with Rating Information */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="text-left space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-black uppercase tracking-wider">
               <MessageSquare className="w-3.5 h-3.5 text-orange-500"/> Отзывы клиентов
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5.5xl font-black text-slate-950 tracking-tight leading-none">
               Что говорят <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-600 to-red-600">о нашей работе</span>
            </h2>
            <div className="flex flex-wrap items-center gap-2.5 text-slate-500 text-sm font-semibold">
              <span>Рейтинг 4.8 на основе более 300 реальных отзывов в</span>
              <a 
                href="https://2gis.kz" 
                target="_blank" 
                rel="nofollow noopener noreferrer"
                className="inline-flex items-center justify-center font-black text-white bg-[#00B159] px-2.5 py-0.5 rounded-lg text-xs hover:bg-[#00964b] transition duration-200"
              >
                2GIS
              </a>
            </div>
          </div>
          
          {/* Navigation Controls */}
          <div className="flex gap-2.5 self-start md:self-end">
             <button 
                onClick={() => handleScrollClick('left')} 
                className="p-3.5 rounded-xl border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 transition active:scale-95 shadow-sm"
                aria-label="Предыдущий отзыв"
             >
                <ChevronLeft className="w-5 h-5"/>
             </button>
             <button 
                onClick={() => handleScrollClick('right')} 
                className="p-3.5 rounded-xl bg-orange-600 text-white hover:bg-orange-700 transition shadow-md shadow-orange-600/10 active:scale-95"
                aria-label="Следующий отзыв"
             >
                <ChevronRight className="w-5 h-5"/>
             </button>
          </div>
        </div>
        
        {/* Horizontal Slider Area */}
        <div 
          ref={sliderRef}
          onMouseDown={handleMouseDown} 
          onMouseLeave={handleMouseLeave} 
          onMouseUp={handleMouseUp} 
          onMouseMove={handleMouseMove}
          className="flex overflow-x-auto gap-6 pb-8 hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0 select-none cursor-grab active:cursor-grabbing"
        >
           {allReviews.map((rev, i) => (
             <FadeIn
               key={i}
               delay={i * 50}
               threshold={0.1}
               className="relative group flex-none w-[85vw] sm:w-[420px] bg-white p-8 rounded-3xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-md hover:border-slate-350 transition duration-300 select-none flex flex-col justify-between"
             >
                <div>
                   {/* Golden rating stars */}
                   <div className="flex gap-1.5 text-amber-400 mb-6">
                      {[1,2,3,4,5].map(star => (
                         <Star key={star} className="w-4.5 h-4.5 fill-current"/>
                      ))}
                   </div>
                   
                   <p className="text-slate-600 text-sm leading-relaxed font-semibold mb-8 italic">
                      «{rev.text}»
                   </p>
                </div>
                
                {/* Reviewer Details */}
                <div className="flex items-center gap-3.5 border-t border-slate-100 pt-5 mt-auto">
                   <div className="w-10 h-10 bg-slate-50 border border-slate-200 text-slate-700 rounded-full flex items-center justify-center font-extrabold text-sm shrink-0">
                      {rev.name[0]}
                   </div>
                   <div className="text-left leading-tight">
                      <div className="text-slate-900 font-extrabold text-sm">{rev.name}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{rev.role}</div>
                   </div>
                </div>
             </FadeIn>
           ))}
        </div>
      </div>
    </section>
  );
}