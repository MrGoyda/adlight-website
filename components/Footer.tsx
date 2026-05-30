"use client";

import Link from "next/link";
import Image from "next/image";
import { 
  Instagram, 
  Send, 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  FileText
} from "lucide-react";

import { COMPANY_NAP } from "@/dictionaries/common";
import { VOLUME_LETTERS_CATALOG } from "@/dictionaries/services/volume-letters";
import { SITE_CONTACTS } from "@/config/site";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-20 pb-8 text-slate-600 font-sans relative overflow-hidden">
      {/* Soft warm brand ambient light glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/[0.015] blur-[150px] rounded-full pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        
        {/* UPPER PART: LINKS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          
          {/* COLUMN 1: ABOUT COMPANY & REG DETAILS */}
          <div className="space-y-6">
            {/* Logo */}
            <Link href="/" className="block relative w-36 h-10 md:w-44 md:h-12 mb-4 active:scale-98 transition-transform" aria-label="На главную">
                <Image 
                   src="/adlight-logo-full.webp" 
                   alt="ADLight - Рекламное агентство полного цикла в Астане: изготовление вывесок и наружной рекламы" 
                   fill
                   className="object-contain object-left"
                   sizes="(max-width: 768px) 144px, 176px"
                />
            </Link>

            <p className="text-sm leading-relaxed text-slate-500 font-semibold">
              Производственная компания наружной рекламы полного цикла в Астане. Изготавливаем вывески любой сложности с 2017 года. Собственный сборочный цех, гарантия на светодиоды до 3 лет, согласование с Акиматом.
            </p>

            {/* Legal details box */}
            <div className="text-xs text-slate-500 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-[0_4px_12px_rgba(0,0,0,0.01)]">
               <p className="font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[10px]">Юридическая информация:</p>
               <p className="font-bold text-slate-800">{COMPANY_NAP.owner}</p>
               <p className="mt-1">ИИН: {COMPANY_NAP.iin}</p>
               <p className="mt-0.5">г. Астана, ул. Аспара 7</p>
            </div>

            <div className="flex gap-4">
              <a href={COMPANY_NAP.socials.instagram} target="_blank" rel="nofollow noreferrer" className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-pink-600 hover:text-white hover:border-transparent flex items-center justify-center transition-all duration-305" aria-label="Instagram">
                <Instagram className="w-5 h-5"/>
              </a>
              <a href={COMPANY_NAP.socials.telegram} target="_blank" rel="nofollow noreferrer" className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-blue-500 hover:text-white hover:border-transparent flex items-center justify-center transition-all duration-305" aria-label="Telegram">
                <Send className="w-5 h-5 ml-0.5"/>
              </a>
              <a href={COMPANY_NAP.socials.whatsapp} target="_blank" rel="nofollow noreferrer" className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-green-500 hover:text-white hover:border-transparent flex items-center justify-center transition-all duration-305" aria-label="WhatsApp">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                   <path d="M12.004 2C6.48 2 2 6.48 2 12c0 2.17.7 4.19 1.89 5.83L2.03 22l4.31-1.83c1.55.98 3.39 1.54 5.37 1.54 5.52 0 10-4.48 10-10S17.52 2 12.004 2zm5.72 13.91c-.24.68-1.2 1.24-1.93 1.39-.49.1-1.13.17-3.29-.71-2.76-1.12-4.53-3.93-4.67-4.12-.14-.19-1.14-1.51-1.14-2.87a3 3 0 01.91-2.22c.26-.26.56-.33.75-.33h.49c.16 0 .37.01.53.39.17.41.59 1.43.64 1.54.05.11.09.24.01.39-.08.15-.12.24-.24.38-.12.14-.25.31-.36.42-.12.12-.25.25-.11.49.14.24.63 1.03 1.35 1.67.92.82 1.7 1.07 1.94 1.19.24.12.38.1.52-.06.14-.16.59-.69.75-.92.16-.23.32-.19.53-.11.22.08 1.37.65 1.61.76.24.12.4.17.46.28.06.11.06.64-.18 1.32z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* COLUMN 2: LETTERS & INTERIOR */}
          <div>
            <h3 className="text-slate-900 font-extrabold text-[11px] uppercase tracking-widest mb-6 border-b border-slate-200 pb-3">Буквы и Интерьер</h3>
            <ul className="space-y-3.5 text-sm font-semibold">
              <li>
                <Link href="/services/volume-letters" className="text-slate-600 hover:text-orange-600 transition-colors flex items-center gap-1.5 group">
                  Изготовление объемных букв <span className="text-[9px] text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100 font-bold uppercase tracking-wider">Хит</span>
                </Link>
              </li>
              {VOLUME_LETTERS_CATALOG.slice(0, 4).map((tech) => (
                <li key={tech.id}>
                  <Link href={`/services/volume-letters/${tech.slug}`} className="text-slate-500 hover:text-orange-600 transition-colors">
                    {tech.title} (буквы)
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/services/neon" className="text-slate-500 hover:text-orange-600 transition-colors">
                  Световые вывески из неона
                </Link>
              </li>
              <li>
                <Link href="/services/interior" className="text-slate-500 hover:text-orange-600 transition-colors">
                  Интерьерные логотипы на стену
                </Link>
              </li>
              <li>
                <Link href="/services/navigation" className="text-slate-500 hover:text-orange-600 transition-colors">
                  Таблички и навигация в офис
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: OUTDOOR ADVERTISING */}
          <div>
            <h3 className="text-slate-900 font-extrabold text-[11px] uppercase tracking-widest mb-6 border-b border-slate-200 pb-3">Наружная реклама</h3>
            <ul className="space-y-3.5 text-sm font-semibold">
              <li>
                <Link href="/services/lightboxes" className="text-slate-600 hover:text-orange-600 transition-colors">
                  Световые короба и лайтбоксы
                </Link>
              </li>
              <li>
                <Link href="/services/panel-brackets" className="text-slate-500 hover:text-orange-600 transition-colors">
                  Двусторонние панель-кронштейны
                </Link>
              </li>
              <li>
                <Link href="/services/facade-decoration" className="text-slate-500 hover:text-orange-600 transition-colors">
                  Рекламное оформление фасадов
                </Link>
              </li>
              <li>
                <Link href="/services/entrance-groups" className="text-slate-500 hover:text-orange-600 transition-colors">
                  Комплексные входные группы
                </Link>
              </li>
              <li>
                <Link href="/services/roof-installations" className="text-slate-500 hover:text-orange-600 transition-colors">
                  Крышные рекламные установки
                </Link>
              </li>
              <li>
                <Link href="/services/pylons" className="text-slate-500 hover:text-orange-600 transition-colors">
                  Рекламные стелы и пилоны
                </Link>
              </li>
              <li>
                <Link href="/services/branding-cars" className="text-slate-500 hover:text-orange-600 transition-colors">
                  Рекламное брендирование авто
                </Link>
              </li>
              <li>
                <Link href="/services/signboard-repair" className="text-slate-500 hover:text-orange-600 transition-colors">
                  Ремонт и обслуживание вывесок
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: CONTACTS (GEO) */}
          <div className="space-y-6">
            <h3 className="text-slate-900 font-extrabold text-[11px] uppercase tracking-widest mb-6 border-b border-slate-200 pb-3">Контакты</h3>
            <address className="not-italic space-y-6 text-sm font-semibold">
              <div className="flex gap-4 items-start">
                <MapPin className="w-5 h-5 text-orange-500 shrink-0 mt-0.5"/>
                <span itemScope itemType="http://schema.org/PostalAddress" className="leading-relaxed text-slate-700">
                   <span itemProp="addressLocality" className="font-extrabold text-slate-900 block text-base mb-1">г. {COMPANY_NAP.locality}</span>
                   <span itemProp="streetAddress" className="block text-slate-600 font-semibold">{COMPANY_NAP.address.replace(", г. Астана", "").replace("г. Астана, ", "")}</span>
                   <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mt-1.5">(Цех и Офис)</span>
                </span>
              </div>
              <div className="flex gap-4 items-center">
                <Phone className="w-5 h-5 text-orange-500 shrink-0"/>
                <a href={`tel:${COMPANY_NAP.phoneRaw}`} className="text-slate-900 font-extrabold hover:text-orange-600 transition-colors text-base" itemProp="telephone">{COMPANY_NAP.phone}</a>
              </div>
              <div className="flex gap-4 items-center">
                <Mail className="w-5 h-5 text-orange-500 shrink-0"/>
                <a href={`mailto:${COMPANY_NAP.email}`} className="text-slate-650 hover:text-orange-600 transition-colors font-semibold" itemProp="email">{COMPANY_NAP.email}</a>
              </div>
              <div className="flex gap-4 items-start">
                <Clock className="w-5 h-5 text-orange-500 shrink-0 mt-0.5"/>
                <div>
                   <span className="font-extrabold text-slate-800 block text-sm">{COMPANY_NAP.workingHours.split(", ")[0]}</span>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Прием заказов онлайн: 24/7</p>
                </div>
              </div>
            </address>

            {/* Maps search proezd */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Проложить маршрут:</span>
               <div className="grid grid-cols-3 gap-2">
                  <a 
                     href="https://2gis.kz/astana/search/%D1%83%D0%BB.%20%D0%90%D1%81%D0%BF%D0%B0%D1%80%D0%B0%2C%207" 
                     target="_blank" 
                     rel="nofollow noreferrer" 
                     className="px-2 py-2 bg-white border border-slate-200 text-[10px] font-bold text-center rounded-lg text-slate-500 hover:text-slate-900 hover:border-slate-350 shadow-sm transition"
                  >
                     2GIS
                  </a>
                  <a 
                     href={SITE_CONTACTS.maps.googleSearch} 
                     target="_blank" 
                     rel="nofollow noreferrer" 
                     className="px-2 py-2 bg-white border border-slate-200 text-[10px] font-bold text-center rounded-lg text-slate-500 hover:text-slate-900 hover:border-slate-350 shadow-sm transition"
                  >
                     Google
                  </a>
                  <a 
                     href={SITE_CONTACTS.maps.yandexSearch} 
                     target="_blank" 
                     rel="nofollow noreferrer" 
                     className="px-2 py-2 bg-white border border-slate-200 text-[10px] font-bold text-center rounded-lg text-slate-500 hover:text-slate-900 hover:border-slate-350 shadow-sm transition"
                  >
                     Yandex
                  </a>
               </div>
            </div>
            
            <div className="pt-2">
               <Link href="/calculator" className="block w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white text-center font-extrabold text-sm rounded-xl transition duration-300 shadow-lg shadow-orange-950/10 active:scale-[0.98]">
                  Рассчитать стоимость
               </Link>
               <Link href="/design-code" className="flex items-center justify-center gap-2 w-full py-2.5 mt-2.5 text-center text-xs font-semibold text-slate-400 hover:text-slate-600 transition group">
                  <FileText className="w-4 h-4 group-hover:text-orange-500 transition-colors"/>
                  <span className="underline decoration-slate-200 hover:decoration-slate-300">Дизайн-код Астаны (СНиП)</span>
               </Link>
            </div>
          </div>

        </div>

        {/* BOTTOM PART: COPYRIGHT */}
        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 font-semibold">
           <p>© 2017-{currentYear} ADLight. Изготовление вывесок и наружной рекламы в Астане. Все права защищены.</p>
           <div className="flex gap-6">
              <span className="cursor-default hover:text-slate-600 transition-colors">Политика конфиденциальности</span>
              <span className="cursor-default hover:text-slate-600 transition-colors">Договор оферты</span>
           </div>
        </div>
      </div>
    </footer>
  );
}