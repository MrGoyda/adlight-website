"use client";

import Link from "next/link";
import Marquee from "react-fast-marquee"; // Библиотека для бегущей строки
import { useState, useRef, useEffect } from "react";
import { 
  ArrowRight, 
  Zap, 
  MapPin, 
  Phone,
  Hammer,
  FileCheck,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Maximize,
  PenTool,
  Building,
  Palette,
  Layers,
  CheckCircle,
  Clock // <--- ВОТ ОНА, ДОБАВЛЕНА!
} from "lucide-react";

// --- ДАННЫЕ: ЛОГОТИПЫ ---
const clients = [
  "KANGO", "COFFEE BOOM", "SMALL", "MAGNUM", 
  "TECHNODOM", "SULPAK", "BI GROUP", "BAZIS-A",
  "KASPI", "HALYK BANK", "DODO PIZZA"
];

// --- ДАННЫЕ: УСЛУГИ ---
const services = [
  {
    title: "Объемные буквы",
    desc: "Лицевая и контражурная подсветка. Премиальный акрил.",
    price: "от 400 тг/см",
    link: "/services/volume-letters",
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=800" 
  },
  {
    title: "Световые короба",
    desc: "Лайтбоксы сложных форм, инкрустация.",
    price: "от 45 000 тг/кв.м",
    link: "#",
    image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Неоновые вывески",
    desc: "Гибкий неон для интерьера и фотозон.",
    price: "Индивидуально",
    link: "#",
    image: "https://images.unsplash.com/photo-1554189097-ffe88e99047d?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Крышные установки",
    desc: "Громадные буквы на крышу. Расчет нагрузок.",
    price: "Проектно",
    link: "#",
    image: "https://images.unsplash.com/photo-1517677208171-0bc5e2553e57?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Панель-кронштейны",
    desc: "Двусторонние торцевые вывески.",
    price: "от 35 000 тг",
    link: "#",
    image: "https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Входные группы",
    desc: "Козырьки, композит, полная обшивка.",
    price: "Проектно",
    link: "#",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"
  }
];

// --- ДАННЫЕ: FAQ ---
const faqs = [
  {
    q: "Сколько стоит вывеска?",
    a: "Цена зависит от технологии и размеров. Объемные буквы начинаются от 400 тг за см высоты. Точную смету мы дадим после бесплатного замера."
  },
  {
    q: "Вы делаете согласование с Акиматом?",
    a: "Да, это наша сильная сторона. Мы готовим эскизный проект, фотопривязку и помогаем подать документы в Управление урбанистики через E-Otinish. Мы знаем Дизайн-код Астаны, поэтому наши вывески не демонтируют."
  },
  {
    q: "Какие сроки изготовления?",
    a: "Стандартный срок — 3-5 рабочих дней с момента утверждения макета и предоплаты. Срочные заказы (за 24 часа) обсуждаются индивидуально."
  },
  {
    q: "Какая гарантия?",
    a: "Мы даем официальную гарантию 1 год по договору. Она распространяется на целостность конструкции, пленку (от выцветания) и электрику. Если диод перегорит — заменим бесплатно."
  }
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  
  // Refs для карусели
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // --- ЛОГИКА КАРУСЕЛИ ---
  const scrollButtons = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = 400; 
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

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

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
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#0F172A]">
      
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* 1. HERO SECTION */}
      <section className="relative w-full py-20 lg:py-32 overflow-hidden border-b border-slate-800 flex items-center min-h-[calc(100vh-80px)]">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-orange-600/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
          <div className="space-y-8 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-sm font-medium w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              Работаем в Астане и области
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight">
              Наружная реклама <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                без посредников
              </span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-lg leading-relaxed">
              Изготовим вывеску по Дизайн-коду Астаны за 3 дня. 
              Собственный цех, гарантия на электрику и бесплатный дизайн-проект.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link href="/services/volume-letters" className="h-14 px-8 flex items-center justify-center bg-orange-600 rounded-xl text-white font-bold text-lg hover:bg-orange-700 transition shadow-lg shadow-orange-900/20 hover:scale-105 active:scale-95">
                Рассчитать стоимость
              </Link>
              <button className="h-14 px-8 flex items-center justify-center border border-slate-700 rounded-xl text-white font-medium hover:bg-slate-800 transition">
                Написать в WhatsApp
              </button>
            </div>
          </div>
          <div className="relative">
             <div className="absolute inset-0 bg-orange-500/5 blur-3xl -z-10 rounded-full"></div>
             <div className="grid grid-cols-2 gap-4">
                {['https://images.unsplash.com/photo-1524813686514-a57563d77965?auto=format&fit=crop&q=80&w=600', 
                  'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=600',
                  'https://images.unsplash.com/photo-1517677208171-0bc5e2553e57?auto=format&fit=crop&q=80&w=600',
                  'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=600'].map((url, i) => (
                  <div key={i} className="aspect-square rounded-2xl overflow-hidden relative group border border-slate-700/50 bg-slate-800">
                     <div className="absolute inset-0 bg-slate-800 group-hover:scale-110 transition duration-700" style={{backgroundImage: `url(${url})`, backgroundSize: 'cover'}}></div>
                     <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition"></div>
                     <div className="absolute bottom-4 left-4">
                        <p className="text-white font-bold text-lg">{['KANGO', 'COFFEE', 'LOFT', 'SHOP'][i]}</p>
                        <p className="text-xs text-gray-300">Вывеска</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* 2. БЕГУЩАЯ СТРОКА (REACT-FAST-MARQUEE) */}
      <section className="py-12 bg-slate-950 border-b border-slate-800 relative z-20">
        <div className="container mx-auto px-4 mb-10">
           <p className="text-center text-gray-500 text-xs md:text-sm uppercase tracking-[0.3em] font-semibold">
             Нам доверяют бизнес в Астане
           </p>
        </div>
        
        <div className="relative flex">
           <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none"></div>
           <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none"></div>

           <Marquee gradient={false} speed={40} autoFill={true} className="overflow-hidden" style={{ overflowY: 'hidden' }}>
              {clients.map((client, index) => (
                 <span 
                   key={index} 
                   className="text-4xl md:text-5xl font-black text-slate-800 uppercase tracking-tighter hover:text-orange-600 transition-colors duration-300 cursor-default select-none mx-12 leading-none py-2" 
                 >
                    {client}
                 </span>
              ))}
           </Marquee>
        </div>
      </section>

      {/* 3. ЦИФРЫ */}
      <section className="border-b border-slate-800 bg-slate-900/50">
        <div className="container mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
           <div><div className="text-4xl font-bold text-white mb-2">5 лет</div><div className="text-gray-500 text-sm">На рынке Астаны</div></div>
           <div><div className="text-4xl font-bold text-white mb-2">300+</div><div className="text-gray-500 text-sm">Реализованных вывесок</div></div>
           <div><div className="text-4xl font-bold text-white mb-2">3 дня</div><div className="text-gray-500 text-sm">Средний срок сдачи</div></div>
           <div><div className="text-4xl font-bold text-orange-500 mb-2">0 ₸</div><div className="text-gray-500 text-sm">Штрафов у клиентов</div></div>
        </div>
      </section>

      {/* 4. КАРУСЕЛЬ УСЛУГ */}
      <section className="py-24 bg-[#0F172A] overflow-hidden">
         <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Что мы производим</h2>
                <p className="text-gray-400">Полный цикл: от таблички до крышной установки</p>
              </div>
              <div className="hidden md:flex gap-3">
                 <button onClick={() => scrollButtons('left')} className="p-3 rounded-full border border-slate-700 text-white hover:bg-slate-800 transition active:scale-95"><ChevronLeft className="w-6 h-6"/></button>
                 <button onClick={() => scrollButtons('right')} className="p-3 rounded-full bg-orange-600 text-white hover:bg-orange-700 transition shadow-lg active:scale-95"><ChevronRight className="w-6 h-6"/></button>
              </div>
            </div>
            <div 
              ref={sliderRef}
              onMouseDown={handleMouseDown} onMouseLeave={handleMouseLeave} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}
              className="flex overflow-x-auto gap-6 pb-8 hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0 select-none cursor-grab active:cursor-grabbing"
            >
               {services.map((service, i) => (
                 <Link key={i} href={service.link} draggable={false} className="relative group min-w-[300px] md:min-w-[380px] h-[450px] flex-shrink-0 rounded-2xl overflow-hidden border border-slate-800 hover:border-orange-500/50 transition-colors">
                    <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition duration-700 pointer-events-none" style={{ backgroundImage: `url(${service.image})` }}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent opacity-90 pointer-events-none"></div>
                    <div className="absolute inset-0 flex flex-col justify-end p-8 pointer-events-none">
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-orange-500 transition">{service.title}</h3>
                      <p className="text-gray-300 text-sm mb-6 line-clamp-2">{service.desc}</p>
                      <div className="flex justify-between items-center pt-4 border-t border-white/10">
                         <span className="text-orange-400 font-bold">{service.price}</span>
                         <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition"><ArrowRight className="w-5 h-5"/></div>
                      </div>
                    </div>
                 </Link>
               ))}
            </div>
         </div>
      </section>

      {/* 5. ЭТАПЫ */}
      <section className="py-24 bg-slate-950 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-16 text-center">Как мы работаем</h2>
          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-slate-800 -z-10"></div>
            {[
              {n:1, t:"Заявка", d:"Вы оставляете заявку. Мы приезжаем, замеряем фасад."},
              {n:2, t:"Дизайн", d:"Фотопривязка. Эскизный проект. Согласование."},
              {n:3, t:"Цех", d:"Изготовление на ЧПУ. Сборка и электрика."},
              {n:4, t:"Монтаж", d:"Монтаж, подключение, гарантия."}
            ].map((step, i) => (
              <div key={i} className="relative bg-slate-950">
                <div className="w-16 h-16 bg-slate-900 border-2 border-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-6 mx-auto z-10 shadow-lg shadow-orange-900/20">{step.n}</div>
                <h3 className="text-xl font-bold text-white text-center mb-3">{step.t}</h3>
                <p className="text-gray-400 text-center text-sm">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. ТЕХНОЛОГИИ */}
      <section className="py-24 bg-[#0F172A]">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <div>
             <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Свое производство — <br/>ваша гарантия цены</h2>
             <p className="text-gray-400 text-lg mb-8 leading-relaxed">
               Многие "агентства" просто перезаказывают вывески в гаражах. Мы — реальный завод на ул. Акжол 110.
             </p>
             <div className="space-y-6">
               <div className="flex gap-4 p-4 rounded-xl hover:bg-slate-800/50 transition">
                 <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0 text-orange-500"><Palette/></div>
                 <div><h4 className="text-white font-bold text-lg">Oracal 8100 (Германия)</h4><p className="text-gray-400 text-sm">Пленка не выцветает на солнце.</p></div>
               </div>
               <div className="flex gap-4 p-4 rounded-xl hover:bg-slate-800/50 transition">
                 <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0 text-orange-500"><Layers/></div>
                 <div><h4 className="text-white font-bold text-lg">Двойная УФ-печать</h4><p className="text-gray-400 text-sm">Сочные цвета даже ночью.</p></div>
               </div>
               <div className="flex gap-4 p-4 rounded-xl hover:bg-slate-800/50 transition">
                 <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0 text-orange-500"><Hammer/></div>
                 <div><h4 className="text-white font-bold text-lg">Покраска Flame</h4><p className="text-gray-400 text-sm">Профессиональная эмаль, стойкая к сколам.</p></div>
               </div>
             </div>
          </div>
          <div className="relative h-[500px] bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden group">
             <div className="absolute inset-0 flex items-center justify-center text-slate-600 font-bold text-2xl">ФОТО ЦЕХА</div>
             <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 p-4 rounded-xl border border-slate-700">
               <div className="text-white font-bold">ул. Акжол 110</div>
               <div className="text-orange-500 text-sm">Наш адрес</div>
             </div>
          </div>
        </div>
      </section>

      {/* 7. СВЕЖИЕ ПРОЕКТЫ (Bento Grid) */}
      <section className="py-32 bg-slate-950 border-t border-slate-800/50 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent"></div>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div><h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Свежие проекты</h2><p className="text-gray-400 text-lg">То, что мы сдали на прошлой неделе</p></div>
            <a href="#" className="inline-flex items-center justify-center px-6 py-3 border border-slate-700 rounded-xl text-white hover:bg-slate-800 hover:border-slate-600 transition group">Все 300+ работ <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition"/></a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[600px]">
            <div className="md:col-span-2 md:row-span-2 group relative rounded-3xl overflow-hidden cursor-pointer border border-slate-800">
              <div className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1550534791-2677533605ab?auto=format&fit=crop&q=80&w=1200')" }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition"></div>
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <div className="inline-block px-3 py-1 mb-3 text-xs font-bold text-white bg-orange-600 rounded-full">КРЫШНАЯ УСТАНОВКА</div>
                <h3 className="text-3xl font-bold text-white mb-2">БЦ "Emerald Tower"</h3>
                <p className="text-gray-300 line-clamp-2">Изготовление и монтаж букв высотой 2.5 метра на высоте 20 этажа.</p>
              </div>
            </div>
            <div className="md:col-span-2 group relative rounded-3xl overflow-hidden cursor-pointer border border-slate-800 min-h-[250px]">
              <div className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=800')" }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-80"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <div className="text-orange-400 text-xs font-bold mb-1 tracking-wider uppercase">Интерьерный неон</div>
                <h3 className="text-xl font-bold text-white">LOFT Bar Astana</h3>
              </div>
            </div>
            <div className="md:col-span-1 group relative rounded-3xl overflow-hidden cursor-pointer border border-slate-800 min-h-[250px]">
              <div className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1514525253440-b393452e8d26?auto=format&fit=crop&q=80&w=600')" }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-80"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <div className="text-blue-400 text-xs font-bold mb-1 tracking-wider uppercase">Входная группа</div>
                <h3 className="text-lg font-bold text-white">Аптека "Biocare"</h3>
              </div>
            </div>
            <div className="md:col-span-1 group relative rounded-3xl overflow-hidden cursor-pointer border border-slate-800 min-h-[250px]">
              <div className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=600')" }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-80"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <div className="text-green-400 text-xs font-bold mb-1 tracking-wider uppercase">Лайтбокс</div>
                <h3 className="text-lg font-bold text-white">Кофейня "Marrone"</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ */}
      <section className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Частые вопросы</h2>
            <p className="text-gray-400">Отвечаем на то, что волнует вас больше всего</p>
          </div>
          <div className="space-y-4">
            {faqs.map((item, index) => (
              <div key={index} className={`group rounded-2xl transition-all duration-300 ${openFaq === index ? 'bg-slate-900 ring-1 ring-orange-500/30 shadow-2xl shadow-orange-900/10' : 'bg-slate-900/50 hover:bg-slate-900 border border-slate-800'}`}>
                <button onClick={() => toggleFaq(index)} className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none">
                  <span className={`text-lg md:text-xl font-bold transition-colors duration-300 ${openFaq === index ? 'text-orange-500' : 'text-white group-hover:text-orange-400'}`}>{item.q}</span>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${openFaq === index ? 'bg-orange-500 text-white rotate-180' : 'bg-slate-800 text-gray-400 group-hover:bg-slate-700'}`}><ChevronDown className="w-6 h-6"/></div>
                </button>
                <div className={`grid transition-all duration-300 ease-in-out ${openFaq === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                  <div className="overflow-hidden"><div className="px-6 md:px-8 pb-8 text-gray-400 leading-relaxed text-base md:text-lg border-t border-slate-800/50 pt-4">{item.a}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. ОТЗЫВЫ (NEW) */}
      <section className="py-24 bg-[#0F172A]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Что говорят клиенты</h2>
            <div className="flex items-center justify-center gap-2 text-gray-400">
               <span>Рейтинг 4.9 в</span>
               <span className="font-bold text-white bg-green-600 px-2 py-0.5 rounded text-sm">2GIS</span>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
             {[
               {name: "Айгерим С.", role: "Coffee Boom", text: "Заказывали объемные буквы для кофейни. Сделали за 3 дня, как и обещали. Монтажники аккуратные, мусор за собой убрали."},
               {name: "Ерлан М.", role: 'ТОО "StroyInvest"', text: "Отличная работа с документами. Сами подготовили эскиз для Акимата, согласовали с первого раза."},
               {name: "Дмитрий К.", role: 'Магазин "Техно"', text: "Цена адекватная, качество на высоте. Понравилось, что есть свой цех, можно приехать и посмотреть материалы вживую."}
             ].map((rev, i) => (
               <div key={i} className="bg-slate-900 p-8 rounded-2xl border border-slate-800 relative hover:border-slate-700 transition">
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

      {/* 10. КАРТА И КОНТАКТЫ (NEW) */}
      <section className="py-0 bg-slate-950 border-t border-slate-800 relative h-[600px]">
         <div className="absolute inset-0 bg-slate-800">
            <iframe 
              src="https://yandex.ru/map-widget/v1/?ll=71.497162%2C51.194223&mode=search&ol=geo&ouri=ymapsbm1%3A%2F%2Fgeo%3Fdata%3DCgg2NjIzOTY5MRJO0JrQsNC30LDRh9GB0YLQs0L0LCBBc3RhbmEsIEFxxb5vLCAxMTAsINCQ0YHRgtCw0L3QsCAwMTAwMDAsINCQ0YHRgtCw0L3QsCAwMTAwMDAiCg21RlFCFU_PUEI%2C&z=16.63" 
              width="100%" height="100%" frameBorder="0"
              style={{ filter: 'grayscale(100%) invert(90%) hue-rotate(180deg)' }} 
              className="opacity-80"
            ></iframe>
         </div>
         <div className="container mx-auto px-4 h-full flex items-center relative pointer-events-none">
            <div className="bg-slate-900/90 backdrop-blur-md p-10 rounded-3xl border border-slate-800 shadow-2xl max-w-md pointer-events-auto">
               <h3 className="text-2xl font-bold text-white mb-6">Приезжайте в гости</h3>
               <div className="space-y-6">
                  <div className="flex gap-4">
                     <div className="w-12 h-12 bg-orange-600/20 rounded-full flex items-center justify-center text-orange-500 flex-shrink-0"><MapPin/></div>
                     <div><p className="text-sm text-gray-400">Адрес цеха и офиса</p><p className="text-white font-medium text-lg">г. Астана, ул. Акжол 110</p></div>
                  </div>
                  <div className="flex gap-4">
                     <div className="w-12 h-12 bg-orange-600/20 rounded-full flex items-center justify-center text-orange-500 flex-shrink-0"><Clock/></div>
                     <div><p className="text-sm text-gray-400">Режим работы</p><p className="text-white font-medium text-lg">Пн-Пт: 09:00 - 18:00</p></div>
                  </div>
                  <div className="flex gap-4">
                     <div className="w-12 h-12 bg-orange-600/20 rounded-full flex items-center justify-center text-orange-500 flex-shrink-0"><Phone/></div>
                     <div><p className="text-sm text-gray-400">Телефон</p><a href="tel:+77071356701" className="text-white font-medium text-lg hover:text-orange-500 transition">+7 (707) 135-67-01</a></div>
                  </div>
               </div>
               <a href="https://go.2gis.com/..." target="_blank" className="mt-8 flex items-center justify-center w-full py-4 border border-slate-600 text-white rounded-xl hover:bg-slate-800 transition font-bold">Построить маршрут</a>
            </div>
         </div>
      </section>

      {/* 11. CTA */}
      <section className="py-20 bg-[#0F172A]">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-orange-600 to-orange-500 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden shadow-2xl shadow-orange-900/40">
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-10"></div>
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Нужна консультация?</h2>
              <p className="text-orange-50 text-lg mb-10">Оставьте заявку на бесплатный замер.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="h-14 px-10 bg-white text-orange-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition shadow-xl">Вызвать замерщика</button>
                <a href="tel:+77071356701" className="h-14 px-10 border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/10 transition flex items-center justify-center gap-2"><Phone className="w-5 h-5"/> +7 (707) 135-67-01</a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}