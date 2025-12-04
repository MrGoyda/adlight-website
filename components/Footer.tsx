"use client";

import Link from "next/link";
import Image from "next/image";
import { 
  Instagram, 
  Send, 
  MessageCircle, 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  ArrowUpRight
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#020617] border-t border-slate-800 pt-16 pb-8 text-slate-400 font-sans">
      <div className="container mx-auto px-4">
        
        {/* ВЕРХНЯЯ ЧАСТЬ: СЕТКА ССЫЛОК */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* КОЛОНКА 1: О КОМПАНИИ */}
          <div className="space-y-6">
            {/* Логотип */}
            <Link href="/" className="block relative w-32 h-10 md:w-40 md:h-12 mb-4">
                <Image 
                   src="/images/ADLight-logo-full.png" 
                   alt="ADLight" 
                   fill
                   className="object-contain object-left"
                   sizes="(max-width: 768px) 128px, 160px"
                />
            </Link>

            <p className="text-sm leading-relaxed">
              Производственная компания полного цикла в Астане. Изготавливаем вывески любой сложности: от таблички до крышной установки. Собственный цех, лицензия, гарантия.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition duration-300">
                <Instagram className="w-5 h-5"/>
              </a>
              <a href="https://t.me/username" target="_blank" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-500 hover:text-white transition duration-300">
                <Send className="w-5 h-5 ml-0.5"/>
              </a>
              <a href="https://wa.me/77071356701" target="_blank" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-green-500 hover:text-white transition duration-300">
                <MessageCircle className="w-5 h-5"/>
              </a>
            </div>
          </div>

          {/* КОЛОНКА 2: УСЛУГИ (БУКВЫ И СВЕТ) */}
          <div>
            <h3 className="text-white font-bold mb-6">Объемные буквы</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/services/volume-letters/face-lit" className="hover:text-orange-500 transition">Световое лицо</Link></li>
              <li><Link href="/services/volume-letters/full-lit" className="hover:text-orange-500 transition">Полное свечение (Full Lit)</Link></li>
              <li><Link href="/services/volume-letters/back-lit" className="hover:text-orange-500 transition">Контражурная подсветка</Link></li>
              <li><Link href="/services/volume-letters/acrylic-slim" className="hover:text-orange-500 transition">Жидкий акрил (Slim)</Link></li>
              <li><Link href="/services/volume-letters/pixel-led" className="hover:text-orange-500 transition">Пиксельные (Smart LED)</Link></li>
              <li><Link href="/services/volume-letters/loft-lamps" className="hover:text-orange-500 transition">Ретро с лампами</Link></li>
              <li><Link href="/services/volume-letters/day-night-effect" className="hover:text-orange-500 transition">День / Ночь</Link></li>
              <li className="pt-2">
                 <Link href="/services/volume-letters" className="text-white font-medium flex items-center gap-1 hover:gap-2 transition-all">
                    Все виды букв <ArrowUpRight className="w-3 h-3 text-orange-500"/>
                 </Link>
              </li>
            </ul>
          </div>

          {/* КОЛОНКА 3: НАРУЖНАЯ РЕКЛАМА */}
          <div>
            <h3 className="text-white font-bold mb-6">Наружная реклама</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/services/roof-installations" className="hover:text-blue-500 transition">Крышные установки</Link></li>
              <li><Link href="/services/entrance-groups" className="hover:text-blue-500 transition">Входные группы</Link></li>
              <li><Link href="/services/lightboxes" className="hover:text-blue-500 transition">Световые короба</Link></li>
              <li><Link href="/services/pylons" className="hover:text-blue-500 transition">Стелы и Пилоны</Link></li>
              <li><Link href="/services/panel-brackets" className="hover:text-blue-500 transition">Панель-кронштейны</Link></li>
              <li className="pt-4 border-t border-slate-800/50">
                 <h4 className="text-white font-bold mb-3">Интерьер</h4>
              </li>
              <li><Link href="/services/neon" className="hover:text-purple-500 transition">Гибкий неон</Link></li>
              <li><Link href="/services/interior" className="hover:text-purple-500 transition">Логотипы в офис</Link></li>
              <li><Link href="/services/navigation" className="hover:text-purple-500 transition">Навигация и Таблички</Link></li>
            </ul>
          </div>

          {/* КОЛОНКА 4: КОНТАКТЫ */}
          <div>
            <h3 className="text-white font-bold mb-6">Контакты</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3 items-start">
                <MapPin className="w-5 h-5 text-orange-500 shrink-0"/>
                <span>г. Астана, район Байконур,<br/>ул. Акжол 110</span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone className="w-5 h-5 text-orange-500 shrink-0"/>
                <a href="tel:+77071356701" className="text-white font-bold hover:text-orange-500 transition">+7 707 135 67 01</a>
              </li>
              <li className="flex gap-3 items-center">
                <Mail className="w-5 h-5 text-orange-500 shrink-0"/>
                <a href="mailto:info@adlight.kz" className="hover:text-white transition">info@adlight.kz</a>
              </li>
              <li className="flex gap-3 items-center">
                <Clock className="w-5 h-5 text-orange-500 shrink-0"/>
                <span>Пн-Пт: 09:00 - 18:00</span>
              </li>
            </ul>
            
            <div className="mt-8">
               <Link href="/calculator" className="block w-full py-3 bg-slate-800 hover:bg-orange-600 text-white text-center font-bold rounded-xl transition duration-300 border border-slate-700 hover:border-orange-500">
                  Рассчитать стоимость
               </Link>
               <Link href="/design-code" className="block w-full py-3 mt-3 text-center text-sm font-medium text-slate-400 hover:text-white transition underline decoration-slate-700 hover:decoration-white">
                  Дизайн-код Астаны
               </Link>
            </div>
          </div>

        </div>

        {/* НИЖНЯЯ ЧАСТЬ: КОПИРАЙТ */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
           <p>© {new Date().getFullYear()} ADLight. Все права защищены.</p>
           <div className="flex gap-6">
              <Link href="#" className="hover:text-slate-400 transition">Политика конфиденциальности</Link>
              <Link href="#" className="hover:text-slate-400 transition">Договор оферты</Link>
           </div>
        </div>
      </div>
    </footer>
  );
}