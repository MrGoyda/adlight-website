"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Menu, 
  X, 
  Phone, 
  Instagram, 
  Send, 
  MessageCircle, 
  User, 
  ChevronDown,
  FileText,
  Home,
  Calculator,
  ChevronRight,
  MapPin,
  Store,
  Zap,
  Building,
  Wrench,
  ArrowUpRight
} from "lucide-react";

import ConsultationModal from "@/components/ConsultationModal";
import GlassLayer from "@/components/ui/GlassLayer";

// --- ИМПОРТ СЛОВАРЕЙ ---
import { COMPANY_NAP } from "@/dictionaries/common";
import { CATALOG_SERVICES } from "@/dictionaries/services/catalog-services";
import { VOLUME_LETTERS_CATALOG } from "@/dictionaries/services/volume-letters";

const GroupIconMap = {
  Store,
  Zap,
  Building,
  Wrench
};

function renderGroupIcon(iconName: keyof typeof GroupIconMap, className = "w-5 h-5") {
  const IconComponent = GroupIconMap[iconName] || Store;
  return <IconComponent className={className} />;
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isLettersOpen, setIsLettersOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const toggleCategory = (catId: string) => {
    if (activeCategory === catId) {
      setActiveCategory(null);
    } else {
      setActiveCategory(catId);
    }
  };

  // SCHEMA.ORG для Навигации (Динамический)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    "name": [
      "Главная",
      ...CATALOG_SERVICES.flatMap(cat => cat.items.map(item => item.title)),
      "Портфолио",
      "Дизайн-код",
      "Контакты"
    ],
    "url": [
      "https://adlight.kz",
      ...CATALOG_SERVICES.flatMap(cat => `https://adlight.kz${cat.items.map(item => item.link)}`),
      "https://adlight.kz/portfolio",
      "https://adlight.kz/design-code",
      "https://adlight.kz/contacts"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled 
          ? 'border-slate-200/80 shadow-xl shadow-slate-200/20' 
          : 'border-slate-200/40'
      }`}>
        <div className="absolute inset-0 z-[-1] bg-white rounded-inherit pointer-events-none" />
        
        <div className="container mx-auto px-4 h-16 sm:h-20 flex items-center justify-between relative">
          
          {/* Логотип */}
          <Link href="/" className="relative z-55 flex items-center" onClick={() => setIsOpen(false)} aria-label="ADLight - Наружная реклама Астана">
             <div className="relative w-36 h-10 md:w-44 md:h-12 active:scale-98 transition-transform">
                <Image 
                   src="/adlight-logo-full.webp" 
                   alt="ADLight - Изготовление вывесок и наружной рекламы в Астане" 
                   fill
                   className="object-contain object-left"
                   sizes="(max-width: 768px) 144px, 176px"
                   priority
                />
             </div>
          </Link>

          {/* ДЕСКТОПНЫЕ ЭЛЕМЕНТЫ (Адрес, Соцсети, Контакты) */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8 relative z-55">
             
             {/* 1. Адрес с иконкой */}
             <div className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition duration-250 text-xs font-semibold border-r border-slate-200 pr-5">
                <div className="p-2 bg-slate-100 rounded-lg border border-slate-200 text-orange-500">
                   <MapPin className="w-3.5 h-3.5"/>
                </div>
                <div className="text-left leading-tight">
                   <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-bold">Наше производство</span>
                   <span className="text-slate-700">г. {COMPANY_NAP.locality}, {COMPANY_NAP.address}</span>
                </div>
             </div>

             {/* 2. Соцсети с реальными иконками */}
             <div className="flex items-center gap-2.5 border-r border-slate-200 pr-5">
                <a 
                   href={COMPANY_NAP.socials.instagram} 
                   target="_blank" 
                   rel="nofollow noreferrer" 
                   className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-pink-500 hover:bg-pink-500/5 hover:border-pink-500/30 transition duration-300" 
                   aria-label="Наш Instagram"
                >
                   <Instagram className="w-4 h-4"/>
                </a>
                <a 
                   href={COMPANY_NAP.socials.telegram} 
                   target="_blank" 
                   rel="nofollow noreferrer" 
                   className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-400 hover:bg-blue-400/5 hover:border-blue-400/30 transition duration-300" 
                   aria-label="Наш Telegram"
                >
                   <Send className="w-4 h-4 ml-0.5"/>
                </a>
                <a 
                   href={COMPANY_NAP.socials.whatsapp} 
                   target="_blank" 
                   rel="nofollow noreferrer" 
                   className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-green-500 hover:bg-green-500/5 hover:border-green-500/30 transition duration-300" 
                   aria-label="Наш WhatsApp"
                >
                   <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M12.004 2C6.48 2 2 6.48 2 12c0 2.17.7 4.19 1.89 5.83L2.03 22l4.31-1.83c1.55.98 3.39 1.54 5.37 1.54 5.52 0 10-4.48 10-10S17.52 2 12.004 2zm5.72 13.91c-.24.68-1.2 1.24-1.93 1.39-.49.1-1.13.17-3.29-.71-2.76-1.12-4.53-3.93-4.67-4.12-.14-.19-1.14-1.51-1.14-2.87a3 3 0 01.91-2.22c.26-.26.56-.33.75-.33h.49c.16 0 .37.01.53.39.17.41.59 1.43.64 1.54.05.11.09.24.01.39-.08.15-.12.24-.24.38-.12.14-.25.31-.36.42-.12.12-.25.25-.11.49.14.24.63 1.03 1.35 1.67.92.82 1.7 1.07 1.94 1.19.24.12.38.1.52-.06.14-.16.59-.69.75-.92.16-.23.32-.19.53-.11.22.08 1.37.65 1.61.76.24.12.4.17.46.28.06.11.06.64-.18 1.32z"/>
                   </svg>
                </a>
             </div>

             {/* 3. Кликабельный номер телефона */}
             <a 
                href={`tel:${COMPANY_NAP.phoneRaw}`} 
                className="flex items-center gap-2.5 font-bold text-slate-800 hover:text-orange-500 transition duration-250 border-r border-slate-200 pr-5 whitespace-nowrap text-sm"
             >
                <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-orange-500 animate-pulse">
                   <Phone className="w-3.5 h-3.5"/>
                </div>
                <div className="text-left leading-tight">
                   <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-bold">Связь круглосуточно</span>
                   <span className="text-slate-800">{COMPANY_NAP.phone}</span>
                </div>
             </a>

             {/* 4. Кнопка «Получить консультацию» */}
             <button 
                onClick={() => setIsModalOpen(true)}
                className="relative overflow-hidden bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-extrabold py-2.5 px-5 rounded-xl transition duration-300 shadow-md shadow-orange-900/10 hover:scale-[1.02] active:scale-98 text-xs uppercase tracking-wider whitespace-nowrap"
             >
                Получить консультацию
             </button>

             {/* 5. Иконка входа в личный кабинет */}
             <button 
                className="w-9 h-9 rounded-xl bg-white text-slate-700 hover:text-orange-500 hover:bg-slate-50 border border-slate-200 hover:border-orange-500/30 flex items-center justify-center group transition duration-300 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-98"
                title="Личный кабинет клиента"
                aria-label="Личный кабинет"
              >
                <User className="w-4 h-4 group-hover:scale-110 group-hover:text-orange-500 transition-all duration-300"/>
             </button>
          </div>

          {/* КНОПКА МЕНЮ (БУРГЕР) — Видна на десктопе и мобильном */}
          <div className="flex items-center gap-4 relative z-55">
             <button 
                className="flex items-center gap-2.5 py-2 px-3.5 sm:py-2.5 sm:px-5 bg-white border border-slate-200 text-slate-800 hover:text-orange-600 hover:border-orange-500/30 rounded-xl transition-all duration-300 group shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-98"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
             >
                <span className="hidden sm:inline text-xs font-extrabold uppercase tracking-wider transition-colors duration-300 group-hover:text-orange-600">Меню</span>
                {isOpen ? (
                   <X className="w-4 h-4 text-orange-500 transition-transform duration-300 group-hover:rotate-90"/>
                ) : (
                   <Menu className="w-4 h-4 text-slate-600 group-hover:text-orange-500 transition-colors duration-300"/>
                )}
             </button>
          </div>
        </div>
      </header>

      {/* ФОНОВЫЙ OVERLAY ПРИ ОТКРЫТИИ МЕНЮ */}
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-md z-[90] transition-opacity duration-300 h-screen w-screen ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* ПЛАВНО ВЫЕЗЖАЮЩЕЕ СПРАВА НАЛЕВО ДЕКСТОП/МОБИЛЬНОЕ МЕНЮ */}
      <div className={`fixed top-0 right-0 h-screen w-full sm:w-[480px] md:w-[580px] bg-slate-950 border-l border-slate-900/60 z-[100] shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${
        isOpen ? "translate-x-0 visible pointer-events-auto" : "translate-x-full invisible pointer-events-none"
      }`}>
         
         {/* Шапка меню */}
         <div className="flex items-center justify-between p-6 border-b border-slate-900 bg-slate-950">
            <span className="text-sm font-black text-white tracking-widest uppercase flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
               Навигация по сайту
            </span>
            <button 
               onClick={() => setIsOpen(false)} 
               className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-gray-400 hover:text-white hover:bg-slate-800 transition"
               aria-label="Закрыть меню"
            >
               <X className="w-5 h-5"/>
            </button>
         </div>

         {/* Содержимое меню (Скролл-зона) */}
         <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-slate-800">
            
            {/* Группа 1: Основные разделы */}
            <div className="space-y-3">
               <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Основные страницы</h4>
               <div className="grid grid-cols-2 gap-2">
                  <Link 
                     href="/" 
                     className="flex items-center gap-2.5 text-sm font-bold text-gray-300 p-3 rounded-xl bg-slate-900/40 border border-slate-900 hover:border-slate-800/80 hover:bg-slate-900/80 hover:text-orange-400 transition duration-200" 
                     onClick={() => setIsOpen(false)}
                  >
                     <Home className="w-4 h-4 text-slate-500"/>
                     <span>Главная</span>
                  </Link>
                  <Link 
                     href="/portfolio" 
                     className="flex items-center gap-2.5 text-sm font-bold text-gray-300 p-3 rounded-xl bg-slate-900/40 border border-slate-900 hover:border-slate-800/80 hover:bg-slate-900/80 hover:text-orange-400 transition duration-200" 
                     onClick={() => setIsOpen(false)}
                  >
                     <Store className="w-4 h-4 text-slate-500"/>
                     <span>Портфолио</span>
                  </Link>
                  <Link 
                     href="/design-code" 
                     className="flex items-center gap-2.5 text-sm font-bold text-gray-300 p-3 rounded-xl bg-slate-900/40 border border-slate-900 hover:border-slate-800/80 hover:bg-slate-900/80 hover:text-orange-400 transition duration-200" 
                     onClick={() => setIsOpen(false)}
                  >
                     <Building className="w-4 h-4 text-slate-500"/>
                     <span>Дизайн-код</span>
                  </Link>
                  <Link 
                     href="/contacts" 
                     className="flex items-center gap-2.5 text-sm font-bold text-gray-300 p-3 rounded-xl bg-slate-900/40 border border-slate-900 hover:border-slate-800/80 hover:bg-slate-900/80 hover:text-orange-400 transition duration-200" 
                     onClick={() => setIsOpen(false)}
                  >
                     <MapPin className="w-4 h-4 text-slate-500"/>
                     <span>Контакты</span>
                  </Link>
               </div>
            </div>

            {/* Группа 2: Услуги (Интерактивный структурированный аккордеон) */}
            <div className="space-y-4">
               <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Каталог конструкций</h4>
               
               <div className="space-y-2.5">
                  {CATALOG_SERVICES.map((group) => {
                     const isGroupActive = activeCategory === group.id;
                     return (
                        <div key={group.id} className="border border-slate-900 rounded-2xl bg-slate-900/20 overflow-hidden">
                           <button 
                              onClick={() => toggleCategory(group.id)}
                              className="w-full flex items-center justify-between p-4 hover:bg-slate-900/40 transition duration-200 text-left"
                           >
                              <span className="flex items-center gap-3 font-extrabold text-sm text-white">
                                 <span className={group.color}>
                                    {renderGroupIcon(group.iconName, "w-5 h-5")}
                                 </span>
                                 {group.category}
                              </span>
                              <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${
                                 isGroupActive ? "rotate-180 text-orange-500" : ""
                              }`}/>
                           </button>
                           
                           <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                              isGroupActive ? "max-h-[500px] opacity-100 border-t border-slate-900" : "max-h-0 opacity-0"
                           }`}>
                              <div className="p-3 bg-slate-950/60 grid gap-1">
                                 {group.items.map((item, idx) => (
                                    <Link 
                                       key={idx}
                                       href={item.link}
                                       className="flex items-center justify-between p-2.5 rounded-lg text-xs font-bold text-gray-400 hover:text-orange-400 hover:bg-slate-900/40 transition duration-200"
                                       onClick={() => setIsOpen(false)}
                                    >
                                       <span>{item.title}</span>
                                       <ChevronRight className="w-3.5 h-3.5 text-slate-700"/>
                                    </Link>
                                 ))}
                              </div>
                           </div>
                        </div>
                     );
                  })}
               </div>
            </div>

            {/* Группа 3: Объемные буквы (Изолированные технологии) */}
            <div className="border border-slate-900 rounded-2xl bg-slate-900/20 overflow-hidden">
               <button 
                  onClick={() => setIsLettersOpen(!isLettersOpen)}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-900/40 transition duration-200 text-left"
               >
                  <span className="flex items-center gap-3 font-extrabold text-sm text-white">
                     <span className="text-orange-500">
                        <Zap className="w-5 h-5"/>
                     </span>
                     Технологии объемных букв
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${
                     isLettersOpen ? "rotate-180 text-orange-500" : ""
                  }`}/>
               </button>
               
               <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isLettersOpen ? "max-h-[500px] opacity-100 border-t border-slate-900" : "max-h-0 opacity-0"
               }`}>
                  <div className="p-3 bg-slate-950/60 grid gap-1">
                     <Link 
                        href="/services/volume-letters"
                        className="flex items-center justify-between p-2.5 rounded-lg text-xs font-black text-white bg-slate-900/60 hover:text-orange-400 hover:bg-slate-900 transition duration-200"
                        onClick={() => setIsOpen(false)}
                     >
                        <span>Все виды объемных букв</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-orange-500"/>
                     </Link>
                     
                     {VOLUME_LETTERS_CATALOG.slice(0, 7).map((tech) => (
                        <Link 
                           key={tech.id}
                           href={`/services/volume-letters/${tech.slug}`}
                           className="flex items-center justify-between p-2.5 rounded-lg text-xs font-bold text-gray-400 hover:text-orange-400 hover:bg-slate-900/40 transition duration-200"
                           onClick={() => setIsOpen(false)}
                        >
                           <span>{tech.title}</span>
                           <ChevronRight className="w-3.5 h-3.5 text-slate-700"/>
                        </Link>
                     ))}
                  </div>
               </div>
            </div>

            {/* Группа 4: Утилитарные действия */}
            <div className="space-y-3">
               <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1 font-sans">Инструменты</h4>
               <Link 
                  href="/calculator" 
                  className="flex items-center justify-between p-4 rounded-2xl bg-orange-600/10 border border-orange-500/20 text-orange-400 hover:text-orange-300 hover:bg-orange-600/20 transition duration-300"
                  onClick={() => setIsOpen(false)}
               >
                  <span className="flex items-center gap-3 font-extrabold text-sm">
                     <Calculator className="w-5 h-5"/>
                     Онлайн-калькулятор вывесок
                  </span>
                  <ChevronRight className="w-4 h-4"/>
               </Link>
            </div>

         </div>

         {/* Подвал меню (Контакты) */}
         <div className="p-6 bg-slate-950 border-t border-slate-900 space-y-4">
             <div className="flex justify-center gap-5">
                 <a 
                    href={COMPANY_NAP.socials.instagram} 
                    target="_blank" 
                    rel="nofollow noreferrer" 
                    className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-gray-400 hover:bg-pink-600 hover:text-white hover:border-transparent transition-all duration-300" 
                    aria-label="Наш Instagram"
                 >
                    <Instagram className="w-5 h-5"/>
                 </a>
                 <a 
                    href={COMPANY_NAP.socials.telegram} 
                    target="_blank" 
                    rel="nofollow noreferrer" 
                    className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-gray-400 hover:bg-blue-500 hover:text-white hover:border-transparent transition-all duration-300" 
                    aria-label="Наш Telegram"
                 >
                    <Send className="w-5 h-5 ml-0.5"/>
                 </a>
                 <a 
                    href={COMPANY_NAP.socials.whatsapp} 
                    target="_blank" 
                    rel="nofollow noreferrer" 
                    className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-gray-400 hover:bg-green-500 hover:text-white hover:border-transparent transition-all duration-300" 
                    aria-label="Наш WhatsApp"
                 >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                       <path d="M12.004 2C6.48 2 2 6.48 2 12c0 2.17.7 4.19 1.89 5.83L2.03 22l4.31-1.83c1.55.98 3.39 1.54 5.37 1.54 5.52 0 10-4.48 10-10S17.52 2 12.004 2zm5.72 13.91c-.24.68-1.2 1.24-1.93 1.39-.49.1-1.13.17-3.29-.71-2.76-1.12-4.53-3.93-4.67-4.12-.14-.19-1.14-1.51-1.14-2.87a3 3 0 01.91-2.22c.26-.26.56-.33.75-.33h.49c.16 0 .37.01.53.39.17.41.59 1.43.64 1.54.05.11.09.24.01.39-.08.15-.12.24-.24.38-.12.14-.25.31-.36.42-.12.12-.25.25-.11.49.14.24.63 1.03 1.35 1.67.92.82 1.7 1.07 1.94 1.19.24.12.38.1.52-.06.14-.16.59-.69.75-.92.16-.23.32-.19.53-.11.22.08 1.37.65 1.61.76.24.12.4.17.46.28.06.11.06.64-.18 1.32z"/>
                    </svg>
                 </a>
             </div>
             
             <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-850 text-white font-bold py-3.5 rounded-xl transition border border-slate-800 text-xs">
                   <User className="w-4 h-4"/> Кабинет
                </button>
                <button 
                   onClick={() => { setIsOpen(false); setIsModalOpen(true); }}
                   className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white text-center font-bold py-3.5 rounded-xl shadow-lg shadow-orange-950/20 active:scale-95 transition text-xs"
                >
                   <FileText className="w-4 h-4"/> Оставить заявку
                </button>
             </div>
         </div>
      </div>

      {/* МОДАЛЬНОЕ ОКНО */}
      <ConsultationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        source="Хедер (Кнопка заявки)"
      />
    </>
  );
}