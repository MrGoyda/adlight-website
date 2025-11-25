"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Phone, ChevronRight, Instagram, Send, MessageCircle } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  return (
    <>
      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/75 transition-all duration-300">
        
        <div className="container mx-auto px-4 h-16 flex items-center justify-between relative">
          
          {/* Логотип */}
          <Link href="/" className="font-bold text-2xl text-white tracking-wider hover:text-orange-500 transition relative z-50">
            ADLight
          </Link>

          {/* Десктоп Меню */}
          <nav className="hidden lg:flex gap-8 text-sm font-medium text-gray-300">
            <Link href="/services" className="hover:text-orange-500 transition">Услуги</Link>
            <Link href="/portfolio" className="hover:text-orange-500 transition">Портфолио</Link>
            {/* Ведет к футеру */}
            <Link href="#contacts" className="hover:text-orange-500 transition">Контакты</Link>
          </nav>

          {/* Правая часть */}
          <div className="hidden lg:flex items-center gap-5">
             <div className="flex items-center gap-3 pr-5 border-r border-slate-700">
                <a href="https://instagram.com" target="_blank" className="text-gray-400 hover:text-pink-500 transition"><Instagram className="w-5 h-5"/></a>
                <a href="https://t.me/username" target="_blank" className="text-gray-400 hover:text-blue-400 transition"><Send className="w-5 h-5"/></a>
                <a href="https://wa.me/77071356701" target="_blank" className="text-gray-400 hover:text-green-500 transition"><MessageCircle className="w-5 h-5"/></a>
             </div>
             <a href="tel:+77071356701" className="font-bold text-white hover:text-orange-500 transition flex items-center gap-2">
                <Phone className="w-4 h-4"/> +7 (707) 135-67-01
             </a>
             <Link href="/calculator" className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-5 rounded-lg transition shadow-lg shadow-orange-900/20">
                Рассчитать
             </Link>
          </div>

          {/* Мобильная кнопка */}
          <button 
            className="lg:hidden text-white p-2 relative z-[110] hover:bg-slate-800 rounded-lg transition"
            onClick={()=> setIsOpen(!isOpen)}
          >
            {isOpen ? <span className="w-7 h-7 block"></span> : <Menu className="w-7 h-7"/>}
          </button>
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
               <Link href="/services" className="flex items-center justify-between text-lg font-medium text-white p-4 rounded-xl hover:bg-slate-800 transition" onClick={() => setIsOpen(false)}>
                  Услуги <ChevronRight className="w-5 h-5 text-orange-500"/>
               </Link>
               <Link href="/portfolio" className="flex items-center justify-between text-lg font-medium text-gray-300 p-4 rounded-xl hover:bg-slate-800 hover:text-white transition" onClick={() => setIsOpen(false)}>
                  Портфолио <ChevronRight className="w-5 h-5 text-slate-600"/>
               </Link>
               <Link href="/calculator" className="flex items-center justify-between text-lg font-medium text-gray-300 p-4 rounded-xl hover:bg-slate-800 hover:text-white transition" onClick={() => setIsOpen(false)}>
                  Калькулятор <ChevronRight className="w-5 h-5 text-slate-600"/>
               </Link>
            </nav>
         </div>

         <div className="p-6 bg-slate-950 border-t border-slate-800">
             <div className="flex justify-center gap-6 mb-8">
                 <a href="https://instagram.com" target="_blank" className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-gray-400 hover:text-white transition"><Instagram className="w-6 h-6"/></a>
                 <a href="https://t.me/username" target="_blank" className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-gray-400 hover:text-white transition"><Send className="w-6 h-6 ml-1"/></a>
                 <a href="https://wa.me/77071356701" target="_blank" className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-gray-400 hover:text-white transition"><MessageCircle className="w-6 h-6"/></a>
             </div>
             <a href="tel:+77071356701" className="flex items-center justify-center gap-3 text-white font-bold text-xl mb-6">
                <Phone className="w-6 h-6 text-orange-500"/> +7 (707) 135-67-01
             </a>
             <Link href="/calculator" className="block w-full bg-orange-600 hover:bg-orange-700 text-white text-center font-bold text-lg py-4 rounded-xl shadow-lg shadow-orange-900/20 active:scale-95 transition" onClick={() => setIsOpen(false)}>
                Рассчитать стоимость
             </Link>
         </div>
      </div>
    </>
  );
}