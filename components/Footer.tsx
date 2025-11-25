import Link from "next/link";
import { MapPin, Phone, Mail, Instagram, Youtube, Send } from "lucide-react";

export default function Footer() {
  return (
    // Добавлен id="contacts" для якорной ссылки
    <footer id="contacts" className="bg-[#020617] border-t border-slate-800 pt-20 pb-10 text-sm">
      <div className="container mx-auto px-4">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* КОЛОНКА 1: О компании */}
          <div className="space-y-6">
            <Link href="/" className="text-2xl font-bold text-white tracking-wider flex items-center gap-2">
               ADLight
            </Link>
            <p className="text-gray-400 leading-relaxed max-w-xs">
               Производство наружной рекламы полного цикла в Астане. 
               От дизайна до монтажа за 5 дней. Собственный цех.
            </p>
            <div className="flex gap-4">
               <a href="https://instagram.com" target="_blank" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-pink-600 transition">
                  <Instagram className="w-5 h-5"/>
               </a>
               <a href="https://wa.me/77071356701" target="_blank" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-green-500 transition">
                  <Send className="w-5 h-5"/>
               </a>
               <a href="https://youtube.com" target="_blank" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-600 transition">
                  <Youtube className="w-5 h-5"/>
               </a>
            </div>
          </div>

          {/* КОЛОНКА 2: Услуги (ССЫЛКИ ОБНОВЛЕНЫ) */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Услуги</h3>
            <ul className="space-y-4 text-gray-400">
               {/* Ведет на детальную страницу */}
               <li><Link href="/services/volume-letters" className="hover:text-orange-500 transition">Объемные буквы</Link></li>
               {/* Ведут на якоря в каталоге */}
               <li><Link href="/services#facade" className="hover:text-orange-500 transition">Световые короба</Link></li>
               <li><Link href="/services#interior" className="hover:text-orange-500 transition">Неоновые вывески</Link></li>
               <li><Link href="/services#scale" className="hover:text-orange-500 transition">Крышные установки</Link></li>
               <li><Link href="/services" className="hover:text-orange-500 transition">Все услуги</Link></li>
            </ul>
          </div>

          {/* КОЛОНКА 3: Клиентам (ССЫЛКИ ОБНОВЛЕНЫ) */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Клиентам</h3>
            <ul className="space-y-4 text-gray-400">
               <li><Link href="/portfolio" className="hover:text-orange-500 transition">Портфолио работ</Link></li>
               <li><Link href="/calculator" className="hover:text-orange-500 transition">Онлайн калькулятор</Link></li>
               <li><Link href="#" className="hover:text-orange-500 transition">Требования к макетам</Link></li>
               <li><Link href="#" className="hover:text-orange-500 transition">Дизайн-код Астаны</Link></li>
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

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-600 text-xs">
           <p>© 2017-2025 ADLight. Все права защищены.</p>
           <div className="flex gap-6">
              <Link href="#" className="hover:text-gray-400 transition">Политика конфиденциальности</Link>
              <Link href="#" className="hover:text-gray-400 transition">Публичная оферта</Link>
           </div>
        </div>
      </div>
    </footer>
  );
}