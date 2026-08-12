
"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
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
import { CATALOG_SERVICES } from "@/dictionaries/services/catalog-services";
import { SITE_CONTACTS, SITE_LINKS } from "@/config/site";
import Button from "@/components/ui/Button";
import CalculatePriceModal from "@/components/CalculatePriceModal/index";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  
  const isServicePage = pathname?.startsWith("/services/");

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
               <p className="mt-0.5">{COMPANY_NAP.legalAddress}</p>
            </div>

            <div className="flex gap-4">
              <a href={COMPANY_NAP.socials.instagram} target="_blank" rel="nofollow noreferrer" className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-pink-600 hover:text-white hover:border-transparent flex items-center justify-center transition-all duration-300" aria-label="Instagram">
                <Instagram className="w-5 h-5"/>
              </a>
              <a href={COMPANY_NAP.socials.telegram} target="_blank" rel="nofollow noreferrer" className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-blue-500 hover:text-white hover:border-transparent flex items-center justify-center transition-all duration-300" aria-label="Telegram">
                <Send className="w-5 h-5 ml-0.5"/>
              </a>
              <a 
                href={COMPANY_NAP.socials.whatsapp} 
                target="_blank" 
                rel="nofollow noreferrer" 
                onClick={async (e) => {
                  e.preventDefault();
                  const { getTrackedWhatsappUrl } = await import("@/lib/clickTracker");
                  const url = await getTrackedWhatsappUrl("77071356701", "Здравствуйте! Хочу заказать вывеску.");
                  window.open(url, "_blank");
                }}
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-green-500 hover:text-white hover:border-transparent flex items-center justify-center transition-all duration-300 cursor-pointer" 
                aria-label="WhatsApp"
              >
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
              {[
                ...(CATALOG_SERVICES.find(c => c.id === "facade")?.items || []),
                ...(CATALOG_SERVICES.find(c => c.id === "interior")?.items || [])
              ].map((item, idx) => (
                <li key={idx}>
                  <Link href={item.link} className="text-slate-500 hover:text-orange-600 transition-colors">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: OUTDOOR ADVERTISING */}
          <div>
            <h3 className="text-slate-900 font-extrabold text-[11px] uppercase tracking-widest mb-6 border-b border-slate-200 pb-3">Наружная реклама и Услуги</h3>
            <ul className="space-y-3.5 text-sm font-semibold">
              {[
                ...(CATALOG_SERVICES.find(c => c.id === "scale")?.items || []),
                ...(CATALOG_SERVICES.find(c => c.id === "service")?.items || [])
              ].map((item, idx) => (
                <li key={idx}>
                  <Link href={item.link} className="text-slate-500 hover:text-orange-600 transition-colors">
                    {item.title}
                  </Link>
                </li>
              ))}
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
                <a 
                  href={`tel:${COMPANY_NAP.phoneRaw}`} 
                  onClick={async () => {
                    const { handleTrackedClick } = await import("@/lib/clickTracker");
                    handleTrackedClick({ type: "phone", source: "Footer" });
                  }}
                  className="text-slate-900 font-extrabold hover:text-orange-600 transition-colors text-base" 
                  itemProp="telephone"
                >
                  {COMPANY_NAP.phone}
                </a>
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
                     href={SITE_CONTACTS.maps.gisSearch} 
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
                {isServicePage ? (
                   <Button 
                      onClick={() => setIsPriceModalOpen(true)}
                      variant="solid"
                      className="w-full text-center py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 active:scale-[0.98]"
                   >
                      Рассчитать стоимость
                   </Button>
                ) : (
                   <Button 
                      href="/calculator"
                      variant="solid"
                      className="w-full text-center py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 active:scale-[0.98]"
                   >
                      Рассчитать стоимость
                   </Button>
                )}
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
              <Link href={SITE_LINKS.privacy} className="hover:text-slate-600 transition-colors">Политика конфиденциальности</Link>
              <Link href={SITE_LINKS.offer} className="hover:text-slate-600 transition-colors">Договор оферты</Link>
           </div>
        </div>
      </div>
      <CalculatePriceModal 
        isOpen={isPriceModalOpen} 
        onClose={() => setIsPriceModalOpen(false)} 
        source="Футер сайта" 
      />
    </footer>
  );
}