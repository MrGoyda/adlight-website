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
  FileText
} from "lucide-react";

// --- ИМПОРТ СЛОВАРЕЙ ---
import { COMPANY_NAP } from "@/dictionaries/common";
import { VOLUME_LETTERS_CATALOG } from "@/dictionaries/services/volume-letters";
import { CATALOG_SERVICES } from "@/dictionaries/services/catalog-services";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#020617] border-t border-slate-800 pt-16 pb-8 text-slate-400 font-sans">
      <div className="container mx-auto px-4">
        
        {/* ВЕРХНЯЯ ЧАСТЬ: СЕТКА ССЫЛОК */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* КОЛОНКА 1: О КОМПАНИИ И РЕКВИЗИТЫ */}
          <div className="space-y-6">
            {/* Логотип */}
            <Link href="/" className="block relative w-32 h-10 md:w-40 md:h-12 mb-4" aria-label="На главную">
                <Image 
                   src="/adlight-logo-full.webp" 
                   alt="ADLight - Наружная реклама Астана" 
                   fill
                   className="object-contain object-left"
                   sizes="(max-width: 768px) 128px, 160px"
                />
            </Link>

            <p className="text-sm leading-relaxed">
              Производственная компания полного цикла в Астане. Изготавливаем вывески любой сложности: от таблички до крышной установки. Собственный цех, гарантия качества.
            </p>

            {/* Блок реквизитов для доверия (Trust Rank) */}
            <div className="text-xs text-slate-500 bg-slate-900/50 p-3 rounded-lg border border-slate-800">
               <p className="font-bold text-slate-400 mb-1">Юридическая информация:</p>
               <p>{COMPANY_NAP.owner}</p>
               <p>ИИН: 940222351384</p>
            </div>

            <div className="flex gap-4">
              <a href={COMPANY_NAP.socials.instagram} target="_blank" rel="nofollow noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition duration-300" aria-label="Instagram">
                <Instagram className="w-5 h-5"/>
              </a>
              <a href={COMPANY_NAP.socials.telegram} target="_blank" rel="nofollow noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-500 hover:text-white transition duration-300" aria-label="Telegram">
                <Send className="w-5 h-5 ml-0.5"/>
              </a>
              <a href={COMPANY_NAP.socials.whatsapp} target="_blank" rel="nofollow noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-green-500 hover:text-white transition duration-300" aria-label="WhatsApp">
                <MessageCircle className="w-5 h-5"/>
              </a>
            </div>
          </div>

          {/* КОЛОНКА 2: УСЛУГИ (БУКВЫ И СВЕТ) */}
          <div>
            <h3 className="text-white font-bold mb-6">Объемные буквы</h3>
            <ul className="space-y-3 text-sm">
              {VOLUME_LETTERS_CATALOG.slice(0, 7).map((tech) => (
                <li key={tech.id}>
                  <Link href={`/services/volume-letters/${tech.slug}`} className="hover:text-orange-500 transition">
                    {tech.title}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                 <Link href="/services/volume-letters" className="text-white font-medium flex items-center gap-1 hover:gap-2 transition-all">
                    Все виды букв <ArrowUpRight className="w-3 h-3 text-orange-500"/>
                 </Link>
              </li>
            </ul>
          </div>

          {/* КОЛОНКА 3: НАРУЖНАЯ РЕКЛАМА И ИНТЕРЬЕР */}
          <div>
            <h3 className="text-white font-bold mb-6">Наружная реклама</h3>
            <ul className="space-y-3 text-sm">
              {CATALOG_SERVICES.find(c => c.id === "scale")?.items.map(item => (
                <li key={item.link}>
                  <Link href={item.link} className="hover:text-orange-500 transition">{item.title}</Link>
                </li>
              ))}
              {CATALOG_SERVICES.find(c => c.id === "facade")?.items.filter(item => item.link !== "/services/volume-letters").map(item => (
                <li key={item.link}>
                  <Link href={item.link} className="hover:text-orange-500 transition">{item.title}</Link>
                </li>
              ))}
              <li className="pt-4 border-t border-slate-800/50">
                 <h4 className="text-white font-bold mb-3">Интерьер</h4>
              </li>
              {CATALOG_SERVICES.find(c => c.id === "interior")?.items.map(item => (
                <li key={item.link}>
                  <Link href={item.link} className="hover:text-orange-500 transition">{item.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* КОЛОНКА 4: КОНТАКТЫ (GEO) */}
          <div>
            <h3 className="text-white font-bold mb-6">Контакты</h3>
            {/* Используем тег address для SEO */}
            <address className="not-italic space-y-4 text-sm">
              <div className="flex gap-3 items-start">
                <MapPin className="w-5 h-5 text-orange-500 shrink-0 mt-0.5"/>
                <span itemScope itemType="http://schema.org/PostalAddress">
                   <span itemProp="addressLocality">г. {COMPANY_NAP.locality}</span>, <br/>
                   <span itemProp="streetAddress">{COMPANY_NAP.address.replace("г. Астана, ", "")}</span> <br/>
                   <span className="text-xs text-slate-500">(Цех / Производство)</span>
                </span>
              </div>
              <div className="flex gap-3 items-center">
                <Phone className="w-5 h-5 text-orange-500 shrink-0"/>
                <a href={`tel:${COMPANY_NAP.phoneRaw}`} className="text-white font-bold hover:text-orange-500 transition" itemProp="telephone">{COMPANY_NAP.phone}</a>
              </div>
              <div className="flex gap-3 items-center">
                <Mail className="w-5 h-5 text-orange-500 shrink-0"/>
                <a href={`mailto:${COMPANY_NAP.email}`} className="hover:text-white transition" itemProp="email">{COMPANY_NAP.email}</a>
              </div>
              <div className="flex gap-3 items-center">
                <Clock className="w-5 h-5 text-orange-500 shrink-0"/>
                <div>
                   <span>{COMPANY_NAP.workingHours.split(", ")[0]}</span>
                   <p className="text-xs text-slate-500 mt-0.5">Мессенджеры: 24/7</p>
                </div>
              </div>
            </address>
            
            <div className="mt-8">
               <Link href="/calculator" className="block w-full py-3 bg-slate-800 hover:bg-orange-600 text-white text-center font-bold rounded-xl transition duration-300 border border-slate-700 hover:border-orange-500 shadow-lg shadow-orange-900/10">
                  Рассчитать стоимость
               </Link>
               <Link href="/design-code" className="flex items-center justify-center gap-2 w-full py-3 mt-3 text-center text-sm font-medium text-slate-400 hover:text-white transition group">
                  <FileText className="w-4 h-4 group-hover:text-blue-400 transition"/>
                  <span className="underline decoration-slate-700 hover:decoration-white">Дизайн-код Астаны</span>
               </Link>
            </div>
          </div>

        </div>

        {/* НИЖНЯЯ ЧАСТЬ: КОПИРАЙТ */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
           <p>© 2017-{currentYear} ADLight. Наружная реклама в Астане. Все права защищены.</p>
           <div className="flex gap-6">
              {/* Оставляем текстом, чтобы не было битых ссылок для SEO, пока страниц нет */}
              <span className="cursor-default opacity-50">Политика конфиденциальности</span>
              <span className="cursor-default opacity-50">Договор оферты</span>
           </div>
        </div>
      </div>
    </footer>
  );
}