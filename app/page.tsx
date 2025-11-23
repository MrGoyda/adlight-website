"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  MapPin, 
  Phone,
  Clock,
  ChevronDown,
  Zap, 
  Palette,
  ShieldCheck,
  Layers
} from "lucide-react";

// --- ИМПОРТ КОМПОНЕНТОВ ---
import ClientsMarquee from "@/components/ClientsMarquee";
import DesignCodeBlock from "@/components/DesignCodeBlock";
import CallToAction from "@/components/CallToAction";
import ProjectsBento from "@/components/ProjectsBento";
import ServicesCarousel from "@/components/ServicesCarousel";
import ReviewsCarousel from "@/components/ReviewsCarousel"; // Новый импорт

// --- ДАННЫЕ FAQ (Оставили тут, но можно тоже вынести) ---
const faqs = [
  { q: "Сколько стоит заказать вывеску в Астане, и как рассчитывается цена?", a: "Цена рассчитывается индивидуально по честной смете. Стоимость объемных световых букв начинается от 400 тенге за сантиметр высоты. Финальная сумма зависит от выбранной технологии и материалов. Мы гарантируем отсутствие скрытых доплат." },
  { q: "Нужно ли разрешение на установку вывески в Астане?", a: "Да, обязательно. В Астане действует строгий «Дизайн-код». Наша компания берет на себя подготовку всего пакета документов и подачу эскизного проекта в Управление архитектуры, чтобы избежать штрафов и демонтажа." },
  { q: "Какие материалы вы используете?", a: "Мы используем морозостойкие премиальные материалы: немецкий транслюцентный акрил (не желтеет), пленка Oracal 8100, профессиональная краска Flame и герметичные LED-модули IP67. Гарантия 1 год." },
  { q: "Какой срок изготовления?", a: "Благодаря собственному цеху (ЧПУ и лазерная резка) мы можем изготовить стандартные буквы или лайтбокс в течение 3-5 рабочих дней с момента утверждения макета и предоплаты." },
  { q: "Что входит в гарантию?", a: "Мы предоставляем официальную гарантию 1 год по договору на целостность конструкции, качество пленки и электрику. В случае выхода из строя светодиодов или блока питания — ремонт бесплатно в течение 24 часов." }
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

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
            <div data-aos="fade-up" className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-sm font-medium w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              Работаем в Астане и области
            </div>
            <h1 data-aos="fade-up" data-aos-delay="100" className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight">
              Производство рекламных конструкций<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              полного цикла в Астане.
              </span>
            </h1>
            <p data-aos="fade-up" data-aos-delay="200" className="text-gray-400 text-lg md:text-xl max-w-lg leading-relaxed">
              Комплексное оформление фасадов, премиальные вывески и архитектурная подсветка в Астане. Берем на себя сложные технические задачи, чтобы ваш бизнес был заметен.
            </p>
            <div data-aos="fade-up" data-aos-delay="300" className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link href="/calculator" className="h-14 px-8 flex items-center justify-center bg-orange-600 rounded-xl text-white font-bold text-lg hover:bg-orange-700 transition shadow-lg shadow-orange-900/20 hover:scale-105 active:scale-95">
                Рассчитать стоимость
              </Link>
              <button className="h-14 px-8 flex items-center justify-center border border-slate-700 rounded-xl text-white font-medium hover:bg-slate-800 transition">
                Написать в WhatsApp
              </button>
            </div>
          </div>
          <div className="relative">
             <div className="absolute inset-0 bg-orange-500/5 blur-3xl -z-10 rounded-full"></div>
             <div data-aos="fade-left" className="grid grid-cols-2 gap-4">
                {['/qazpost2.jpg', '/kmg.jpeg', '/loghtbox.jpg', '/bagnaz.jpg'].map((url, i) => (
                  <div key={i} className="aspect-square rounded-2xl overflow-hidden relative group border border-slate-700/50 bg-slate-800">
                      <div className="absolute inset-0 bg-slate-800 group-hover:scale-110 transition duration-700" style={{backgroundImage: `url(${url})`, backgroundSize: 'cover'}}></div>
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition"></div>
                      <div className="absolute bottom-4 left-4">
                         <p className="text-white font-bold text-lg">{['QazPost', 'KMG', 'AO Студия танца', 'BagNaz магазин'][i]}</p>
                         <p className="text-xs text-gray-300">Вывеска</p>
                      </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* 2. БЕГУЩАЯ СТРОКА */}
      <ClientsMarquee />

      {/* 3. ЦИФРЫ */}
      <section data-aos="fade-up" className="border-b border-slate-800 bg-slate-900/50">
        <div className="container mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
           <div><div className="text-4xl font-bold text-white mb-2">5 лет</div><div className="text-gray-500 text-sm">На рынке Астаны</div></div>
           <div><div className="text-4xl font-bold text-white mb-2">300+</div><div className="text-gray-500 text-sm">Реализованных вывесок</div></div>
           <div><div className="text-4xl font-bold text-white mb-2">3 дня</div><div className="text-gray-500 text-sm">Средний срок сдачи</div></div>
           <div><div className="text-4xl font-bold text-orange-500 mb-2">0 ₸</div><div className="text-gray-500 text-sm">Штрафов у клиентов</div></div>
        </div>
      </section>

      {/* 4. КАРУСЕЛЬ УСЛУГ */}
      <ServicesCarousel />

      {/* 5. БЛОК: ДИЗАЙН-КОД */}
      <DesignCodeBlock />

      {/* 6. ЭТАПЫ */}
      <section data-aos="fade-up" className="py-24 bg-slate-950 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-16 text-center">Как мы работаем</h2>
          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-slate-800 -z-10"></div>
            {[
              {n:1, t:"Заявка", d:"Вы оставляете заявку. Мы приезжаем, замеряем фасад."},
              {n:2, t:"Дизайн", d:"Фотопривязка. Эскизный проект. Согласование."},
              {n:3, t:"Цех", d:"Изготовление на ЧПУ. Сборка и электрика."},
              {n:4, t:"Монтаж", d:"Монтируем, подключение, гарантия."}
            ].map((step, i) => (
              <div key={i} data-aos="fade-up" data-aos-delay={i * 100} className="relative bg-slate-950">
                <div className="w-16 h-16 bg-slate-900 border-2 border-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-6 mx-auto z-10 shadow-lg shadow-orange-900/20">{step.n}</div>
                <h3 className="text-xl font-bold text-white text-center mb-3">{step.t}</h3>
                <p className="text-gray-400 text-center text-sm">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. СОБСТВЕННОЕ ПРОИЗВОДСТВО */}
      <section data-aos="fade-up" className="py-24 bg-[#0F172A]">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Качество, которое <span className="text-orange-500">служит годами</span></h2>
            <p className="text-gray-400 text-lg leading-relaxed max-w-lg">Наше производство — это гарантия. Мы используем только премиальные материалы и технологии.</p>
            <div className="space-y-6">
              {[{icon: <Zap/>, title: "Запас мощности +30%", desc: "Исключает перегрев."}, {icon: <Palette/>, title: "Покраска Flame", desc: "Устойчива к сколам."}, {icon: <ShieldCheck/>, title: "Гарантия 1 год", desc: "По договору."}, {icon: <Layers/>, title: "Акрил и Алюминий", desc: "Немецкие материалы."}].map((item, i) => (
                <div key={i} data-aos="fade-up" data-aos-delay={i * 50} className="flex gap-4 p-4 rounded-xl hover:bg-slate-800/50 transition duration-300 ease-in-out">
                  <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0 text-orange-500">{item.icon}</div>
                  <div><h4 className="text-white font-bold text-lg">{item.title}</h4><p className="text-gray-400 text-sm">{item.desc}</p></div>
                </div>
              ))}
            </div>
            <div data-aos="fade-up" data-aos-delay="300" className="mt-12 flex flex-col sm:flex-row gap-4">
              <Link href="/services/volume-letters" className="h-14 px-8 flex items-center justify-center bg-orange-600 rounded-xl text-white font-bold text-lg hover:bg-orange-700 transition shadow-lg shadow-orange-900/20 active:scale-95">Получить расчет</Link>
            </div>
          </div>
          <div data-aos="fade-left" data-aos-delay="200" className="relative">
              <div className="relative h-[450px] bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden group">
                <div className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105" style={{ backgroundImage: "url('/ceh.jpg')" }}></div>
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition"></div>
                <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 p-4 rounded-xl border border-slate-700">
                  <div className="text-white font-bold">Производственный цех: ул. Акжол 110</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 text-center"><div className="text-3xl font-bold text-white mb-1">300+</div><div className="text-gray-500 text-sm">проектов</div></div>
                  <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 text-center"><div className="text-3xl font-bold text-white mb-1">50k ч</div><div className="text-gray-500 text-sm">ресурс LED</div></div>
              </div>
          </div>
        </div>
      </section>

      {/* 8. BENTO GRID */}
      <ProjectsBento />

      {/* 9. FAQ */}
      <section data-aos="fade-up" className="py-24 bg-slate-950 relative overflow-hidden">
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

      {/* 10. ОТЗЫВЫ (КОМПОНЕНТ) */}
      <ReviewsCarousel />

      {/* 11. КАРТА И КОНТАКТЫ */}
      <section data-aos="fade-up" className="py-0 bg-slate-950 border-t border-slate-800 relative h-[600px]">
         <div className="absolute inset-0 bg-slate-800">
            <iframe src="https://yandex.ru/map-widget/v1/?ll=71.497162%2C51.194223&mode=search&ol=geo&ouri=ymapsbm1%3A%2F%2Fgeo%3Fdata%3DCgg2NjIzOTY5MRJO0JrQsNC30LDRh9GB0YLQs0L0LCBBc3RhbmEsIEFxxb5vLCAxMTAsINCQ0YHRgtCw0L3QsCAwMTAwMDAsINCQ0YHRgtCw0L3QsCAwMTAwMDAiCg21RlFCFU_PUEI%2C&z=16.63" width="100%" height="100%" frameBorder="0" style={{ filter: 'grayscale(100%) invert(90%) hue-rotate(180deg)' }} className="opacity-80"></iframe>
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

      {/* 12. CTA */}
      <CallToAction source="Главная страница" />

    </div>
  );
}