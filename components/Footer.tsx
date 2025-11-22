import Link from "next/link";
import { MapPin, Phone, Mail, Instagram, Send } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 pt-16 pb-8 text-sm">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* КОЛОНКА 1: О компании */}
          <div className="space-y-6">
            <Link href="/" className="text-2xl font-bold text-white tracking-wider">ADLight</Link>
            <p className="text-gray-400 leading-relaxed">
              Производство наружной рекламы полного цикла в Астане. 
              От дизайна до монтажа за 3 дня. Собственный цех.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-gray-400 hover:text-white hover:bg-orange-600 transition"><Instagram className="w-5 h-5"/></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-500 transition"><Send className="w-5 h-5"/></a>
            </div>
          </div>

          {/* КОЛОНКА 2: Услуги (SEO) */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Услуги</h3>
            <ul className="space-y-4 text-gray-400">
              <li><Link href="/services/volume-letters" className="hover:text-orange-500 transition">Объемные буквы</Link></li>
              <li><Link href="#" className="hover:text-orange-500 transition">Световые короба</Link></li>
              <li><Link href="#" className="hover:text-orange-500 transition">Неоновые вывески</Link></li>
              <li><Link href="#" className="hover:text-orange-500 transition">Крышные установки</Link></li>
              <li><Link href="#" className="hover:text-orange-500 transition">Панель-кронштейны</Link></li>
              <li><Link href="#" className="hover:text-orange-500 transition">Входные группы</Link></li>
            </ul>
          </div>

          {/* КОЛОНКА 3: Информация */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Компания</h3>
            <ul className="space-y-4 text-gray-400">
              <li><Link href="#" className="hover:text-orange-500 transition">Портфолио (300+ работ)</Link></li>
              <li><Link href="#" className="hover:text-orange-500 transition">О производстве</Link></li>
              <li><Link href="#" className="hover:text-orange-500 transition">Контакты</Link></li>
              <li><Link href="#" className="hover:text-orange-500 transition">Реквизиты</Link></li>
              <li><Link href="#" className="hover:text-orange-500 transition">Политика конфиденциальности</Link></li>
            </ul>
          </div>

          {/* КОЛОНКА 4: Контакты */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Контакты</h3>
            <ul className="space-y-6 text-gray-400">
              <li className="flex gap-4">
                <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0"/>
                <span>г. Астана, район Байконур, <br/>ул. Акжол 110</span>
              </li>
              <li className="flex gap-4 items-center">
                <Phone className="w-5 h-5 text-orange-500 flex-shrink-0"/>
                <a href="tel:+77071356701" className="text-white text-lg font-bold hover:text-orange-500 transition">+7 (707) 135-67-01</a>
              </li>
              <li className="flex gap-4 items-center">
                <Mail className="w-5 h-5 text-orange-500 flex-shrink-0"/>
                <a href="mailto:info@adlight.kz" className="hover:text-orange-500 transition">info@adlight.kz</a>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-600 text-xs">
          <p>© 2025 ADLight. Все права защищены.</p>
          <p>Разработка сайта: Localhost Inc.</p>
        </div>
      </div>
    </footer>
  );
}