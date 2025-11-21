"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/75">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Логотип */}
        <Link href="/" className="font-bold text-2xl text-white tracking-wider hover:text-orange-500 transition">
          ADLight
        </Link>

        {/* Десктоп Меню (Скрыто на мобильных) */}
        <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
          <Link href="/services/volume-letters" className="hover:text-orange-500 transition">Услуги</Link>
          <Link href="#" className="hover:text-orange-500 transition">Портфолио</Link>
          <Link href="#" className="hover:text-orange-500 transition">О компании</Link>
          <Link href="#" className="hover:text-orange-500 transition">Контакты</Link>
        </nav>

        {/* Правая часть (Телефон + Кнопка) */}
        <div className="hidden md:flex items-center gap-6">
           <a href="tel:+77071356701" className="font-bold text-white hover:text-orange-500 transition flex items-center gap-2">
             <Phone className="w-4 h-4"/> +7 (707) 135-67-01
           </a>
           <Link href="/services/volume-letters" className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-5 rounded-lg transition shadow-lg shadow-orange-900/20">
             Рассчитать
           </Link>
        </div>

        {/* Мобильная кнопка (Гамбургер) */}
        <button 
          className="md:hidden text-white p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-7 h-7"/> : <Menu className="w-7 h-7"/>}
        </button>
      </div>

      {/* Выпадающее мобильное меню */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-slate-900 border-b border-slate-800 shadow-xl animate-in slide-in-from-top-5">
          <nav className="flex flex-col p-4 space-y-4">
            <Link href="/services/volume-letters" className="text-lg font-medium text-gray-300 hover:text-orange-500" onClick={() => setIsOpen(false)}>
              Услуги
            </Link>
            <Link href="#" className="text-lg font-medium text-gray-300 hover:text-orange-500" onClick={() => setIsOpen(false)}>
              Портфолио
            </Link>
            <Link href="#" className="text-lg font-medium text-gray-300 hover:text-orange-500" onClick={() => setIsOpen(false)}>
              Контакты
            </Link>
            <hr className="border-slate-800"/>
            <a href="tel:+77071356701" className="flex items-center gap-3 text-white font-bold text-lg">
              <Phone className="w-5 h-5 text-orange-500"/> +7 (707) 135-67-01
            </a>
            <Link href="/services/volume-letters" className="bg-orange-600 text-white text-center font-bold py-3 rounded-lg" onClick={() => setIsOpen(false)}>
              Рассчитать стоимость
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}