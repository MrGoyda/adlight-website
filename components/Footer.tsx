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
  ArrowUpRight,
  FileText,
  Map
} from "lucide-react";

// --- ИМПОРТ СЛОВАРЕЙ ---
import { COMPANY_NAP } from "@/dictionaries/common";
import { VOLUME_LETTERS_CATALOG } from "@/dictionaries/services/volume-letters";
import { CATALOG_SERVICES } from "@/dictionaries/services/catalog-services";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#080B11] border-t border-slate-900/60 pt-20 pb-8 text-slate-400 font-sans relative overflow-hidden">
      {/* Мягкий градиент на заднем плане в стиле Apple Premium */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/[0.06] blur-[150px] rounded-full pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        
        {/* ВЕРХНЯЯ ЧАСТЬ: СЕТКА ССЫЛОК */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          
          {/* КОЛОНКА 1: О КОМПАНИИ И РЕКВИЗИТЫ */}
          <div className="space-y-6">
            {/* Логотип */}
            <Link href="/" className="block relative w-36 h-10 md:w-44 md:h-12 mb-4 active:scale-98 transition-transform" aria-label="На главную">
                <Image 
                   src="/adlight-logo-full.webp" 
                   alt="ADLight - Рекламное агентство полного цикла в Астане: изготовление вывесок и наружной рекламы" 
                   fill
                   className="object-contain object-left"
                   sizes="(max-width: 768px) 144px, 176px"
                />
            </Link>

            <p className="text-sm leading-relaxed text-slate-400">
              Производственная компания наружной рекламы полного цикла в Астане. Изготавливаем вывески любой сложности с 2017 года. Собственный сборочный цех, гарантия на светодиоды до 3 лет, согласование с Акиматом.
            </p>

            {/* Блок реквизитов для доверия (Trust Rank) */}
            <div className="text-xs text-slate-500 bg-slate-900/40 p-4 rounded-xl border border-slate-900">
               <p className="font-bold text-slate-400 mb-1.5">Юридическая информация:</p>
               <p className="font-medium text-slate-400">{COMPANY_NAP.owner}</p>
               <p>ИИН: 940222351384</p>
               <p className="mt-1">г. Астана, ул. Аспара 7</p>
            </div>

            <div className="flex gap-4">
              <a href={COMPANY_NAP.socials.instagram} target="_blank" rel="nofollow noreferrer" className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-gray-400 hover:bg-pink-600 hover:text-white hover:border-transparent transition-all duration-300" aria-label="Instagram">
                <Instagram className="w-5 h-5"/>
              </a>
              <a href={COMPANY_NAP.socials.telegram} target="_blank" rel="nofollow noreferrer" className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-gray-400 hover:bg-blue-500 hover:text-white hover:border-transparent transition-all duration-300" aria-label="Telegram">
                <Send className="w-5 h-5 ml-0.5"/>
              </a>
              <a href={COMPANY_NAP.socials.whatsapp} target="_blank" rel="nofollow noreferrer" className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-gray-400 hover:bg-green-500 hover:text-white hover:border-transparent transition-all duration-300" aria-label="WhatsApp">
                <MessageCircle className="w-5 h-5"/>
              </a>
            </div>
          </div>

          {/* КОЛОНКА 2: ОБЪЕМНЫЕ БУКВЫ И ИНТЕРЬЕР */}
          <div>
            <h3 className="text-white font-extrabold text-sm uppercase tracking-wider mb-6 border-b border-slate-900 pb-3">Буквы и Интерьер</h3>
            <ul className="space-y-3.5 text-sm">
              <li>
                <Link href="/services/volume-letters" className="hover:text-orange-400 transition-colors flex items-center gap-1.5 group font-medium">
                  Изготовление объемных букв <span className="text-[10px] text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Популярно</span>
                </Link>
              </li>
              {VOLUME_LETTERS_CATALOG.slice(0, 4).map((tech) => (
                <li key={tech.id}>
                  <Link href={`/services/volume-letters/${tech.slug}`} className="hover:text-orange-400 transition-colors text-slate-400">
                    {tech.title} (буквы)
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/services/neon" className="hover:text-orange-400 transition-colors text-slate-400">
                  Световые вывески из неона
                </Link>
              </li>
              <li>
                <Link href="/services/interior" className="hover:text-orange-400 transition-colors text-slate-400">
                  Интерьерные логотипы на стену
                </Link>
              </li>
              <li>
                <Link href="/services/navigation" className="hover:text-orange-400 transition-colors text-slate-400">
                  Таблички и навигация в офис
                </Link>
              </li>
              <li>
                <Link href="/services/banners-plates" className="hover:text-orange-400 transition-colors text-slate-400">
                  Печать баннеров и инфо-табличек
                </Link>
              </li>
            </ul>
          </div>

          {/* КОЛОНКА 3: НАРУЖНАЯ РЕКЛАМА И ФАСАДЫ */}
          <div>
            <h3 className="text-white font-extrabold text-sm uppercase tracking-wider mb-6 border-b border-slate-900 pb-3">Наружная реклама</h3>
            <ul className="space-y-3.5 text-sm">
              <li>
                <Link href="/services/lightboxes" className="hover:text-orange-400 transition-colors flex items-center gap-1.5 group font-medium">
                  Световые короба и лайтбоксы
                </Link>
              </li>
              <li>
                <Link href="/services/panel-brackets" className="hover:text-orange-400 transition-colors text-slate-400">
                  Двусторонние панель-кронштейны
                </Link>
              </li>
              <li>
                <Link href="/services/facade-decoration" className="hover:text-orange-400 transition-colors text-slate-400">
                  Рекламное оформление фасадов
                </Link>
              </li>
              <li>
                <Link href="/services/entrance-groups" className="hover:text-orange-400 transition-colors text-slate-400">
                  Комплексные входные группы
                </Link>
              </li>
              <li>
                <Link href="/services/roof-installations" className="hover:text-orange-400 transition-colors text-slate-400">
                  Крышные рекламные установки
                </Link>
              </li>
              <li>
                <Link href="/services/pylons" className="hover:text-orange-400 transition-colors text-slate-400">
                  Рекламные стелы и пилоны
                </Link>
              </li>
              <li>
                <Link href="/services/exhibition-stands" className="hover:text-orange-400 transition-colors text-slate-400">
                  Изготовление вывесок на выставку
                </Link>
              </li>
              <li>
                <Link href="/services/branding-cars" className="hover:text-orange-400 transition-colors text-slate-400">
                  Рекламное брендирование авто
                </Link>
              </li>
              <li>
                <Link href="/services/signboard-repair" className="hover:text-orange-400 transition-colors text-slate-400">
                  Ремонт и обслуживание вывесок
                </Link>
              </li>
            </ul>
          </div>

          {/* КОЛОНКА 4: КОНТАКТЫ (GEO) */}
          <div className="space-y-6">
            <h3 className="text-white font-extrabold text-sm uppercase tracking-wider mb-6 border-b border-slate-900 pb-3">Контакты</h3>
            {/* Используем тег address для SEO */}
            <address className="not-italic space-y-4.5 text-sm">
              <div className="flex gap-3 items-start">
                <MapPin className="w-5 h-5 text-orange-500 shrink-0 mt-0.5"/>
                <span itemScope itemType="http://schema.org/PostalAddress" className="leading-relaxed">
                   <span itemProp="addressLocality" className="font-bold text-white">г. {COMPANY_NAP.locality}</span>, <br/>
                   <span itemProp="streetAddress">{COMPANY_NAP.address.replace("г. Астана, ", "")}</span> <br/>
                   <span className="text-xs text-slate-500 font-medium">(Собственное производство / Офис)</span>
                </span>
              </div>
              <div className="flex gap-3 items-center">
                <Phone className="w-5 h-5 text-orange-500 shrink-0"/>
                <a href={`tel:${COMPANY_NAP.phoneRaw}`} className="text-white font-extrabold hover:text-orange-400 transition-colors" itemProp="telephone">{COMPANY_NAP.phone}</a>
              </div>
              <div className="flex gap-3 items-center">
                <Mail className="w-5 h-5 text-orange-500 shrink-0"/>
                <a href={`mailto:${COMPANY_NAP.email}`} className="hover:text-white transition-colors" itemProp="email">{COMPANY_NAP.email}</a>
              </div>
              <div className="flex gap-3 items-center">
                <Clock className="w-5 h-5 text-orange-500 shrink-0"/>
                <div>
                   <span className="font-semibold text-slate-300">{COMPANY_NAP.workingHours.split(", ")[0]}</span>
                   <p className="text-xs text-slate-500 mt-0.5">Прием заказов онлайн: 24/7</p>
                </div>
              </div>
            </address>

            {/* Карты (2GIS, Google, Яндекс) */}
            <div className="space-y-2 pt-2 border-t border-slate-900">
               <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Открыть карту проезда:</span>
               <div className="grid grid-cols-3 gap-2">
                  <a 
                     href="https://2gis.kz/astana/search/%D1%83%D0%BB.%20%D0%90%D1%81%D0%BF%D0%B0%D1%80%D0%B0%2C%207" 
                     target="_blank" 
                     rel="nofollow noreferrer" 
                     className="px-2 py-2 bg-slate-900 border border-slate-800 text-[10px] font-bold text-center rounded-lg text-gray-400 hover:text-white hover:border-slate-700 transition"
                  >
                     2GIS
                  </a>
                  <a 
                     href="https://maps.google.com/?q=ул.+Аспара+7,+Астана" 
                     target="_blank" 
                     rel="nofollow noreferrer" 
                     className="px-2 py-2 bg-slate-900 border border-slate-800 text-[10px] font-bold text-center rounded-lg text-gray-400 hover:text-white hover:border-slate-700 transition"
                  >
                     Google
                  </a>
                  <a 
                     href="https://yandex.kz/maps/?text=Астана+ул.+Аспара+7" 
                     target="_blank" 
                     rel="nofollow noreferrer" 
                     className="px-2 py-2 bg-slate-900 border border-slate-800 text-[10px] font-bold text-center rounded-lg text-gray-400 hover:text-white hover:border-slate-700 transition"
                  >
                     Yandex
                  </a>
               </div>
            </div>
            
            <div className="pt-2">
               <Link href="/calculator" className="block w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white text-center font-extrabold text-sm rounded-xl transition duration-300 shadow-lg shadow-orange-950/20 active:scale-95">
                  Рассчитать стоимость
               </Link>
               <Link href="/design-code" className="flex items-center justify-center gap-2 w-full py-2.5 mt-2.5 text-center text-xs font-semibold text-slate-500 hover:text-white transition group">
                  <FileText className="w-4 h-4 group-hover:text-orange-500 transition-colors"/>
                  <span className="underline decoration-slate-900 hover:decoration-slate-700">Дизайн-код Астаны (СНиП)</span>
               </Link>
            </div>
          </div>

        </div>

        {/* НИЖНЯЯ ЧАСТЬ: КОПИРАЙТ */}
        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
           <p>© 2017-{currentYear} ADLight. Изготовление вывесок и наружной рекламы в Астане. Все права защищены.</p>
           <div className="flex gap-6 font-semibold">
              <span className="cursor-default hover:text-slate-400 transition-colors">Политика конфиденциальности</span>
              <span className="cursor-default hover:text-slate-400 transition-colors">Договор оферты</span>
           </div>
        </div>
      </div>
    </footer>
  );
}