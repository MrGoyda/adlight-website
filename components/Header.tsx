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
  ChevronRight
} from "lucide-react";

import ConsultationModal from "@/components/ConsultationModal";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const servicesList = [
    { name: "Объемные буквы", link: "/services/volume-letters" },
    { name: "Световые короба", link: "/services/lightboxes" },
    { name: "Неоновые вывески", link: "/services/neon" },
    { name: "Интерьерные логотипы", link: "/services/interior" },
    { name: "Таблички и Навигация", link: "/services/navigation" },
    { name: "Крышные установки", link: "/services/roof-installations" },
    { name: "Входные группы", link: "/services/entrance-groups" },
    { name: "Стелы и Пилоны", link: "/services/pylons" },
    { name: "Панель-кронштейны", link: "/services/panel-brackets" },
  ];

  return (
    <>
      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/75 transition-all duration-300">
        
        <div className="container mx-auto px-4 h-16 flex items-center justify-between relative">
          
          {/* Логотип */}
          <Link href="/" className="relative z-50 flex items-center" onClick={() => setIsOpen(false)}>
             <div className="relative w-32 h-10 md:w-40 md:h-12">
                <Image 
                   src="/images/ADLight-logo-full.png" 
                   alt="ADLight" 
                   fill
                   className="object-contain object-left"
                   sizes="(max-width: 768px) 128px, 160px"
                   priority
                />
             </div>
          </Link>

          {/* Десктоп Меню (Центр) */}
          <nav className="hidden xl:flex gap-6 text-sm font-medium text-gray-300 items-center">
            <Link href="/" className="hover:text-orange-500 transition">Главная</Link>

            <div className="relative group h-16 flex items-center">
                <Link href="/services" className="flex items-center gap-1 hover:text-orange-500 transition py-4">
                    Услуги <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300"/>
                </Link>
                <div className="absolute top-full left-0 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 overflow-hidden">
                    <div className="p-2 grid gap-1">
                        {servicesList.map((service, i) => (
                            <Link 
                                key={i} 
                                href={service.link}
                                className="block px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                            >
                                {service.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <Link href="/portfolio" className="hover:text-orange-500 transition">Портфолио</Link>
            <Link href="/design-code" className="hover:text-orange-500 transition">Дизайн-код</Link>
            <Link href="/contacts" className="hover:text-orange-500 transition">Контакты</Link>
          </nav>

          {/* Правая часть (Десктоп) */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-5">
             {/* Соцсети (скрываем на маленьких десктопах, чтобы влезло остальное) */}
             <div className="hidden 2xl:flex items-center gap-3 pr-5 border-r border-slate-700">
                <a href="https://instagram.com" target="_blank" className="text-gray-400 hover:text-pink-500 transition"><Instagram className="w-5 h-5"/></a>
                <a href="https://t.me/username" target="_blank" className="text-gray-400 hover:text-blue-400 transition"><Send className="w-5 h-5"/></a>
                <a href="https://wa.me/77071356701" target="_blank" className="text-gray-400 hover:text-green-500 transition"><MessageCircle className="w-5 h-5"/></a>
             </div>

             {/* Телефон */}
             <a href="tel:+77071356701" className="font-bold text-white hover:text-orange-500 transition flex items-center gap-2 whitespace-nowrap text-sm xl:text-base">
                <Phone className="w-4 h-4"/> +7 (707) 135-67-01
             </a>

             {/* Разделитель */}
             <div className="h-6 w-px bg-slate-700"></div>

             {/* Кнопка Калькулятор (Второстепенная) */}
             <Link 
                href="/calculator" 
                className="group flex items-center gap-2 text-gray-400 hover:text-white transition"
                title="Онлайн калькулятор"
             >
                <div className="p-2 bg-slate-800 rounded-lg border border-slate-700 group-hover:border-blue-500/50 group-hover:bg-blue-500/10 group-hover:text-blue-400 transition">
                    <Calculator className="w-5 h-5"/>
                </div>
                <span className="hidden xl:inline text-sm font-medium">Расчет</span>
             </Link>

             {/* Кнопка ЛК */}
             <button 
                className="p-2.5 rounded-lg bg-slate-800 text-gray-400 hover:text-white hover:bg-slate-700 transition border border-slate-700 group relative"
                title="Личный кабинет"
             >
                <User className="w-5 h-5 group-hover:scale-110 transition-transform"/>
             </button>

             {/* Кнопка Оставить заявку (Главная) */}
             <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 px-5 rounded-lg transition shadow-lg shadow-orange-900/20 flex items-center gap-2 text-sm xl:text-base whitespace-nowrap"
             >
                Оставить заявку
             </button>
          </div>

          {/* Мобильная кнопка Меню */}
          <div className="flex items-center gap-4 lg:hidden">
             <button 
                className="text-white p-2 relative z-[110] hover:bg-slate-800 rounded-lg transition"
                onClick={()=> setIsOpen(!isOpen)}
             >
                {isOpen ? <X className="w-7 h-7"/> : <Menu className="w-7 h-7"/>}
             </button>
          </div>
        </div>
      </header>

      {/* МОБИЛЬНОЕ МЕНЮ */}
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-[90] transition-opacity duration-300 h-screen w-screen ${isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}
        onClick={() => setIsOpen(false)}
      />

      <div className={`fixed top-0 right-0 h-screen w-[85%] max-w-[320px] bg-slate-900 border-l border-slate-800 z-[100] shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
         <div className="flex items-center justify-between p-6 border-b border-slate-800">
            <span className="text-xl font-bold text-white tracking-wider">Меню</span>
            <button onClick={() => setIsOpen(false)} className="p-2 bg-slate-800 rounded-full text-gray-400 hover:text-white hover:bg-slate-700 transition">
               <X className="w-6 h-6"/>
            </button>
         </div>

         <div className="flex-1 overflow-y-auto p-6">
            <nav className="flex flex-col space-y-2">
               <Link href="/" className="flex items-center justify-between text-lg font-medium text-white p-4 rounded-xl hover:bg-slate-800 transition" onClick={() => setIsOpen(false)}>
                  Главная <Home className="w-5 h-5 text-slate-500"/>
               </Link>

               {/* Аккордеон Услуг */}
               <div>
                   <button 
                      onClick={() => setIsServicesOpen(!isServicesOpen)}
                      className="w-full flex items-center justify-between text-lg font-medium text-white p-4 rounded-xl hover:bg-slate-800 transition"
                   >
                      Услуги 
                      <ChevronDown className={`w-5 h-5 text-orange-500 transition-transform duration-300 ${isServicesOpen ? "rotate-180" : ""}`}/>
                   </button>
                   
                   <div className={`pl-4 overflow-hidden transition-all duration-300 ${isServicesOpen ? "max-h-[600px] opacity-100 mt-2" : "max-h-0 opacity-0"}`}>
                      {servicesList.map((service, i) => (
                          <Link 
                             key={i}
                             href={service.link}
                             className="block p-3 text-gray-400 hover:text-orange-500 text-sm border-l border-slate-800 ml-2"
                             onClick={() => setIsOpen(false)}
                          >
                             {service.name}
                          </Link>
                      ))}
                   </div>
               </div>

               <Link href="/portfolio" className="flex items-center justify-between text-lg font-medium text-gray-300 p-4 rounded-xl hover:bg-slate-800 hover:text-white transition" onClick={() => setIsOpen(false)}>
                  Портфолио <ChevronRight className="w-5 h-5 text-slate-600"/>
               </Link>
               <Link href="/design-code" className="flex items-center justify-between text-lg font-medium text-gray-300 p-4 rounded-xl hover:bg-slate-800 hover:text-white transition" onClick={() => setIsOpen(false)}>
                  Дизайн-код <ChevronRight className="w-5 h-5 text-slate-600"/>
               </Link>
               <Link href="/contacts" className="flex items-center justify-between text-lg font-medium text-gray-300 p-4 rounded-xl hover:bg-slate-800 hover:text-white transition" onClick={() => setIsOpen(false)}>
                  Контакты <ChevronRight className="w-5 h-5 text-slate-600"/>
               </Link>
            </nav>
         </div>

         <div className="p-6 bg-slate-950 border-t border-slate-800 space-y-4">
             <div className="flex justify-center gap-6">
                 <a href="https://instagram.com" target="_blank" className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-gray-400 hover:text-white transition"><Instagram className="w-6 h-6"/></a>
                 <a href="https://t.me/username" target="_blank" className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-gray-400 hover:text-white transition"><Send className="w-6 h-6 ml-1"/></a>
                 <a href="https://wa.me/77071356701" target="_blank" className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-gray-400 hover:text-white transition"><MessageCircle className="w-6 h-6"/></a>
             </div>
             
             {/* Сетка кнопок для мобилки */}
             <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition border border-slate-700 text-sm">
                   <User className="w-4 h-4"/> Кабинет
                </button>
                <Link href="/calculator" className="flex items-center justify-center gap-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 hover:text-blue-300 border border-blue-500/30 font-bold py-3 rounded-xl transition text-sm" onClick={() => setIsOpen(false)}>
                   <Calculator className="w-4 h-4"/> Расчет
                </Link>
             </div>
             
             <button 
                onClick={() => { setIsOpen(false); setIsModalOpen(true); }}
                className="flex items-center justify-center gap-2 w-full bg-orange-600 hover:bg-orange-700 text-white text-center font-bold py-4 rounded-xl shadow-lg shadow-orange-900/20 active:scale-95 transition"
             >
                <FileText className="w-5 h-5"/> Оставить заявку
             </button>
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