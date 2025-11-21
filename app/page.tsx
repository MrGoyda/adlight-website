"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { 
  CheckCircle, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Clock, 
  MapPin, 
  Phone,
  Hammer,
  FileCheck,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  ChevronLeft
} from "lucide-react";

// Данные услуг с КАРТИНКАМИ
// (Пока стоят ссылки на Unsplash, потом замените на свои фото из папки public)
const services = [
  {
    title: "Объемные буквы",
    desc: "Лицевая и контражурная подсветка.",
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
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=800" // Дубликат для примера
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

// FAQ Данные
const faqs = [
  {
    q: "Сколько стоит вывеска?",
    a: "Цена зависит от технологии и размеров. Объемные буквы начинаются от 400 тг за см высоты. Например, слово 'МЯСО' высотой 30см выйдет примерно в 40-50 тыс. тенге. Точную смету мы дадим после бесплатного замера."
  },
  {
    q: "Вы делаете согласование с Акиматом?",
    a: "Да, это наша сильная сторона. Мы готовим эскизный проект, фотопривязку и помогаем подать документы в Управление урбанистики через E-Otinish."
  },
  {
    q: "Какие сроки изготовления?",
    a: "Стандартный срок — 3-5 рабочих дней. Срочные заказы (за 24 часа) обсуждаются индивидуально."
  },
  {
    q: "Какая гарантия?",
    a: "Мы даем официальную гарантию 1 год по договору. Если диод перегорит — заменим бесплатно."
  }
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Логика FAQ
  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Логика скролла кнопками
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 350; // Ширина одной карточки + отступ
      scrollContainerRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Логика скролла колесиком мыши (Горизонтальный скролл при вертикальном колесе)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault(); // Блокируем скролл страницы вниз
        container.scrollLeft += e.deltaY; // Крутим карусель вбок
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#0F172A]">
      
      {/* Стиль для скрытия скроллбара */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* 1. HERO SECTION */}
      <section className="relative w-full py-24 lg:py-32 overflow-hidden border-b border-slate-800">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-orange-600/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              Работаем в Астане и области
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight">
              Наружная реклама <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                без посредников
              </span>
            </h1>
            <p className="text-gray-400 text-xl max-w-lg leading-relaxed">
              Изготовим вывеску по Дизайн-коду Астаны за 3 дня. 
              Собственный цех, гарантия на электрику и бесплатный дизайн-проект.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/services/volume-letters" className="h-14 px-8 flex items-center justify-center bg-orange-600 rounded-xl text-white font-bold text-lg hover:bg-orange-700 transition shadow-lg shadow-orange-900/20 hover:scale-105 active:scale-95">
                Рассчитать стоимость
              </Link>
              <button className="h-14 px-8 flex items-center justify-center border border-slate-700 rounded-xl text-white font-medium hover:bg-slate-800 transition">
                Написать в WhatsApp
              </button>
            </div>
          </div>
          {/* Имитация портфолио (Сетка) */}
          <div className="grid grid-cols-2 gap-4 opacity-90">
             <div className="bg-slate-800 aspect-square rounded-2xl border border-slate-700 flex flex-col items-center justify-center text-slate-600 group hover:border-orange-500/50 transition duration-500">
                <span className="text-2xl font-bold text-white mb-2">KANGO</span>
                <span className="text-xs px-2 py-1 bg-slate-700 rounded text-gray-300">Батутный парк</span>
             </div>
             <div className="bg-slate-800 aspect-square rounded-2xl border border-slate-700 flex flex-col items-center justify-center text-slate-600 mt-12 group hover:border-orange-500/50 transition duration-500">
                <span className="text-2xl font-bold text-white mb-2">COFFEE</span>
                <span className="text-xs px-2 py-1 bg-slate-700 rounded text-gray-300">Сеть кофеен</span>
             </div>
             <div className="bg-slate-800 aspect-square rounded-2xl border border-slate-700 flex flex-col items-center justify-center text-slate-600 -mt-12 group hover:border-orange-500/50 transition duration-500">
                <span className="text-2xl font-bold text-white mb-2">LOFT</span>
                <span className="text-xs px-2 py-1 bg-slate-700 rounded text-gray-300">Ресторан</span>
             </div>
             <div className="bg-slate-800 aspect-square rounded-2xl border border-slate-700 flex flex-col items-center justify-center text-slate-600 group hover:border-orange-500/50 transition duration-500">
                <span className="text-2xl font-bold text-white mb-2">SHOP</span>
                <span className="text-xs px-2 py-1 bg-slate-700 rounded text-gray-300">Магазин</span>
             </div>
          </div>
        </div>
      </section>

      {/* 2. ЦИФРЫ */}
      <section className="border-b border-slate-800 bg-slate-900/50">
        <div className="container mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
           <div>
             <div className="text-4xl font-bold text-white mb-2">5 лет</div>
             <div className="text-gray-500 text-sm">На рынке Астаны</div>
           </div>
           <div>
             <div className="text-4xl font-bold text-white mb-2">300+</div>
             <div className="text-gray-500 text-sm">Реализованных вывесок</div>
           </div>
           <div>
             <div className="text-4xl font-bold text-white mb-2">3 дня</div>
             <div className="text-gray-500 text-sm">Средний срок сдачи</div>
           </div>
           <div>
             <div className="text-4xl font-bold text-orange-500 mb-2">0 ₸</div>
             <div className="text-gray-500 text-sm">Штрафов у клиентов</div>
           </div>
        </div>
      </section>

      {/* 3. КАРУСЕЛЬ УСЛУГ (Фото + Скролл) */}
      <section className="py-24 bg-[#0F172A] overflow-hidden">
         <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Что мы производим</h2>
                <p className="text-gray-400">Полный цикл: от таблички до крышной установки</p>
              </div>
              
              {/* Кнопки навигации */}
              <div className="hidden md:flex gap-3">
                 <button onClick={() => scroll('left')} className="p-3 rounded-full border border-slate-700 text-white hover:bg-slate-800 transition active:scale-95">
                    <ChevronLeft className="w-6 h-6"/>
                 </button>
                 <button onClick={() => scroll('right')} className="p-3 rounded-full bg-orange-600 text-white hover:bg-orange-700 transition shadow-lg active:scale-95">
                    <ChevronRight className="w-6 h-6"/>
                 </button>
              </div>
            </div>
            
            {/* Контейнер скролла */}
            <div 
              ref={scrollContainerRef}
              className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0"
            >
               {services.map((service, i) => (
                 <Link 
                    key={i} 
                    href={service.link} 
                    className="relative group min-w-[300px] md:min-w-[380px] h-[450px] snap-center rounded-2xl overflow-hidden border border-slate-800 hover:border-orange-500/50 transition cursor-pointer"
                 >
                    {/* Картинка на фон */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition duration-700"
                      style={{ backgroundImage: `url(${service.image})` }}
                    ></div>
                    
                    {/* Затемнение (Градиент) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent opacity-90"></div>

                    {/* Контент */}
                    <div className="absolute inset-0 flex flex-col justify-end p-8">
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

      {/* 4. ЭТАПЫ РАБОТЫ */}
      <section className="py-24 bg-slate-950 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-16 text-center">Как мы работаем</h2>
          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-slate-800 -z-10"></div>
            
            <div className="relative bg-slate-950">
              <div className="w-16 h-16 bg-slate-900 border-2 border-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-6 mx-auto z-10 shadow-lg shadow-orange-900/20">1</div>
              <h3 className="text-xl font-bold text-white text-center mb-3">Заявка и Замер</h3>
              <p className="text-gray-400 text-center text-sm">Заявка -&gt; Выезд замерщика -&gt; Консультация.</p>
            </div>
            <div className="relative bg-slate-950">
              <div className="w-16 h-16 bg-slate-900 border-2 border-slate-700 rounded-full flex items-center justify-center text-gray-400 font-bold text-xl mb-6 mx-auto z-10">2</div>
              <h3 className="text-xl font-bold text-white text-center mb-3">Дизайн и Акимат</h3>
              <p className="text-gray-400 text-center text-sm">Фотопривязка -&gt; Эскизный проект -&gt; Согласование.</p>
            </div>
            <div className="relative bg-slate-950">
              <div className="w-16 h-16 bg-slate-900 border-2 border-slate-700 rounded-full flex items-center justify-center text-gray-400 font-bold text-xl mb-6 mx-auto z-10">3</div>
              <h3 className="text-xl font-bold text-white text-center mb-3">Производство</h3>
              <p className="text-gray-400 text-center text-sm">Изготовление на ЧПУ. Сборка и электрика.</p>
            </div>
            <div className="relative bg-slate-950">
              <div className="w-16 h-16 bg-slate-900 border-2 border-slate-700 rounded-full flex items-center justify-center text-gray-400 font-bold text-xl mb-6 mx-auto z-10">4</div>
              <h3 className="text-xl font-bold text-white text-center mb-3">Монтаж</h3>
              <p className="text-gray-400 text-center text-sm">Доставка -&gt; Монтаж -&gt; Акт работ -&gt; Гарантия.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ (Аккордеон) */}
      <section className="py-24 bg-[#0F172A]">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Частые вопросы</h2>
          
          <div className="space-y-4">
            {faqs.map((item, index) => (
              <div 
                key={index} 
                className={`bg-slate-900 border ${openFaq === index ? 'border-orange-500/50' : 'border-slate-800'} rounded-xl overflow-hidden transition-all duration-300`}
              >
                <button 
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none hover:bg-slate-800/50 transition"
                >
                  <span className={`font-bold text-lg pr-4 ${openFaq === index ? 'text-orange-500' : 'text-white'}`}>{item.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 flex-shrink-0 ${openFaq === index ? 'rotate-180' : ''}`}/>
                </button>
                
                <div className={`px-6 text-gray-400 leading-relaxed overflow-hidden transition-all duration-300 ${openFaq === index ? 'max-h-60 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                  {item.a}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. CTA */}
      <section className="py-20 bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-orange-600 to-orange-500 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden shadow-2xl shadow-orange-900/40">
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-10"></div>
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Нужна консультация?
              </h2>
              <p className="text-orange-50 text-lg mb-10">
                Оставьте заявку на бесплатный замер. Мы приедем с образцами материалов, чтобы вы могли выбрать цвет вживую.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="h-14 px-10 bg-white text-orange-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition shadow-xl">
                  Вызвать замерщика
                </button>
                <a href="tel:+77071356701" className="h-14 px-10 border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/10 transition flex items-center justify-center gap-2">
                  <Phone className="w-5 h-5"/> +7 (707) 135-67-01
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}