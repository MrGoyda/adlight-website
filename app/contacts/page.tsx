// app/contacts/page.tsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Phone, 
  MapPin, 
  Clock, 
  Mail, 
  Send, 
  MessageCircle, 
  ChevronRight, 
  Copy, 
  Check, 
  Building2, 
  Users, 
  HardHat, 
  FileText,
  Navigation,
  CreditCard 
} from "lucide-react";

// --- КОМПОНЕНТЫ ---
import CallToAction from "@/components/CallToAction";

// --- ИМПОРТ СЛОВАРЯ ---
import { COMPANY_NAP } from "@/dictionaries/common";

export default function ContactsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Формируем полный текст реквизитов для копирования
  const requisitesText = `Исполнитель: ${COMPANY_NAP.owner}\nИИН: ${COMPANY_NAP.iin}\nИИК: ${COMPANY_NAP.iik} (${COMPANY_NAP.bankName})\nБИК: ${COMPANY_NAP.bik}\nЮр. адрес: ${COMPANY_NAP.legalAddress}`;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  const currentHour = isClient ? new Date().getHours() : 12;
  const isOpen = currentHour >= 9 && currentHour < 18;

  // SEO: Schema.org для локального бизнеса
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `${COMPANY_NAP.name} - Производство наружной рекламы`,
    "image": "https://adlight.kz/logo.png",
    "telephone": COMPANY_NAP.phoneRaw,
    "email": COMPANY_NAP.emailPersonal,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": COMPANY_NAP.address.replace(`${COMPANY_NAP.locality}, `, ""),
      "addressLocality": COMPANY_NAP.locality,
      "addressCountry": COMPANY_NAP.country
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": COMPANY_NAP.coordinates.latitude,
      "longitude": COMPANY_NAP.coordinates.longitude
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "18:00"
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] font-sans selection:bg-orange-500/30">
      
      {/* Вставка JSON-LD для Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* 1. HEADER SECTION */}
      <section className="relative pt-32 pb-12 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-slate-900/50"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-orange-500/5 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="container mx-auto px-4 relative z-10">
           {/* Хлебные крошки */}
           <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-8">
              <Link href="/" className="hover:text-white transition">Главная</Link>
              <ChevronRight className="w-3 h-3"/>
              <span className="text-orange-500 font-medium">Контакты</span>
           </div>

           <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Свяжитесь с нами</h1>
           <p className="text-gray-400 text-lg max-w-2xl">
              Мы открыты для диалога. Приезжайте в цех, пишите в мессенджеры или звоните. 
              Работаем с юридическими и физическими лицами по всему Казахстану.
           </p>
        </div>
      </section>

      {/* 2. BENTO GRID (ОСНОВНЫЕ КОНТАКТЫ) */}
      <section className="py-16 bg-[#0B1120]">
         <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               
               {/* ТЕЛЕФОН */}
               <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 hover:border-orange-500/50 transition group flex flex-col justify-between h-64">
                  <div className="flex justify-between items-start">
                     <div className="p-3 bg-orange-500/10 rounded-xl text-orange-500"><Phone className="w-6 h-6"/></div>
                     <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full animate-pulse">На связи</span>
                  </div>
                  <div>
                     <p className="text-gray-400 text-sm mb-1">Отдел продаж</p>
                     <a href={`tel:${COMPANY_NAP.phoneRaw}`} className="text-2xl font-bold text-white hover:text-orange-500 transition block mb-4">{COMPANY_NAP.phone}</a>
                     <a href={`tel:${COMPANY_NAP.phoneRaw}`} className="nav-call-btn inline-flex items-center text-sm font-bold text-white bg-slate-800 hover:bg-orange-600 px-4 py-2 rounded-lg transition border border-slate-700 hover:border-orange-500">
                        Позвонить сейчас
                     </a>
                  </div>
               </div>

               {/* МЕССЕНДЖЕРЫ */}
               <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 hover:border-blue-500/50 transition group flex flex-col justify-between h-64">
                  <div className="flex justify-between items-start">
                     <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500"><MessageCircle className="w-6 h-6"/></div>
                     <span className="text-xs font-bold text-white bg-blue-600 px-2 py-1 rounded-full">24/7</span>
                  </div>
                  <div>
                     <p className="text-gray-400 text-sm mb-4">Отвечаем круглосуточно</p>
                     <div className="flex gap-3">
                        <a href={COMPANY_NAP.socials.whatsapp} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white py-3 rounded-xl transition border border-[#25D366]/20">
                           <MessageCircle className="w-5 h-5"/> WhatsApp
                        </a>
                        <a href={COMPANY_NAP.socials.telegram} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-[#229ED9]/10 text-[#229ED9] hover:bg-[#229ED9] hover:text-white py-3 rounded-xl transition border border-[#229ED9]/20">
                           <Send className="w-5 h-5"/> Telegram
                        </a>
                     </div>
                  </div>
               </div>

               {/* ГРАФИК РАБОТЫ */}
               <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 hover:border-purple-500/50 transition group flex flex-col justify-between h-64">
                  <div className="flex justify-between items-start">
                     <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500"><Clock className="w-6 h-6"/></div>
                     <div className={`text-xs font-bold px-2 py-1 rounded-full border ${isOpen ? 'text-green-500 bg-green-500/10 border-green-500/20' : 'text-red-500 bg-red-500/10 border-red-500/20'}`}>
                        {isOpen ? 'Цех работает' : 'Цех закрыт'}
                     </div>
                  </div>
                  <div>
                     <p className="text-gray-400 text-sm mb-2">График производства</p>
                     <div className="space-y-1">
                        <div className="flex justify-between text-white font-medium"><span>Пн - Пт</span><span>09:00 - 18:00</span></div>
                        <div className="flex justify-between text-gray-500 text-sm"><span>Сб</span><span>09:00 - 14:00</span></div>
                     </div>
                  </div>
               </div>

               {/* ПОЧТА */}
               <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 hover:border-pink-500/50 transition group flex flex-col justify-between h-64">
                  <div className="flex justify-between items-start">
                     <div className="p-3 bg-pink-500/10 rounded-xl text-pink-500"><Mail className="w-6 h-6"/></div>
                  </div>
                  <div>
                     <p className="text-gray-400 text-sm mb-1">Для макетов и счетов</p>
                     <a href={`mailto:${COMPANY_NAP.emailPersonal}`} className="text-lg font-bold text-white hover:text-pink-500 transition block mb-4 break-words">{COMPANY_NAP.emailPersonal}</a>
                     
                     <button 
                        onClick={() => copyToClipboard(COMPANY_NAP.emailPersonal, 'email')} 
                        className={`text-sm flex items-center gap-2 transition ${copiedId === 'email' ? 'text-green-500' : 'text-slate-400 hover:text-white'}`}
                     >
                        {copiedId === 'email' ? <Check className="w-4 h-4"/> : <Copy className="w-4 h-4"/>} 
                        {copiedId === 'email' ? 'Скопировано!' : 'Скопировать'}
                     </button>
                  </div>
               </div>

            </div>
         </div>
      </section>

      {/* 3. ОТДЕЛЫ КОМПАНИИ */}
      <section className="py-16 bg-[#0F172A] border-t border-slate-800">
         <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-white mb-8">Наши отделы</h2>
            <div className="grid md:grid-cols-3 gap-6">
               {/* Продажи */}
               <div className="flex items-start gap-4 p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
                  <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-white shrink-0"><Users className="w-6 h-6"/></div>
                  <div>
                     <h3 className="text-white font-bold mb-1">Отдел продаж</h3>
                     <p className="text-gray-400 text-sm mb-3">Консультации, расчет стоимости, выезд на замер.</p>
                     <a href={`tel:${COMPANY_NAP.phoneRaw}`} className="text-orange-500 text-sm font-bold hover:underline">Связаться с менеджером →</a>
                  </div>
               </div>
               
               {/* Производство */}
               <div className="flex items-start gap-4 p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
                  <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-white shrink-0"><HardHat className="w-6 h-6"/></div>
                  <div>
                     <h3 className="text-white font-bold mb-1">Цех (Производство)</h3>
                     <p className="text-gray-400 text-sm mb-3">Находимся по адресу: {COMPANY_NAP.address}.</p>
                     <a href={COMPANY_NAP.socials.whatsapp} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm font-bold hover:underline">Написать в цех →</a>
                  </div>
               </div>

               {/* Бухгалтерия */}
               <div className="flex items-start gap-4 p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
                  <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-white shrink-0"><FileText className="w-6 h-6"/></div>
                  <div>
                     <h3 className="text-white font-bold mb-1">Документы</h3>
                     <p className="text-gray-400 text-sm mb-3">Счета, акты, договоры. {COMPANY_NAP.owner}</p>
                     <a href={`mailto:${COMPANY_NAP.emailPersonal}`} className="text-slate-400 text-sm font-bold hover:text-white transition">Запросить акт</a>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 4. КАРТА (АДРЕС ЦЕХА) */}
      <section className="py-0 bg-slate-950 border-t border-slate-800 relative h-[600px]">
        <div className="absolute inset-0 bg-slate-800">
           <iframe 
             src={`https://yandex.ru/map-widget/v1/?text=${encodeURIComponent(COMPANY_NAP.address)}&z=16`} 
             width="100%" 
             height="100%" 
             frameBorder="0" 
             title="Интерактивная карта проезда к цеху ADLight" 
             style={{ filter: 'grayscale(100%) invert(90%) hue-rotate(180deg)' }} 
             className="opacity-80"
             loading="lazy"
           ></iframe>
        </div>
        <div className="container mx-auto px-4 h-full flex items-center relative pointer-events-none">
           <div className="bg-[#0B1120]/95 backdrop-blur-md p-8 rounded-3xl border border-slate-700 shadow-2xl max-w-md w-full pointer-events-auto">
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-2 bg-orange-500 rounded-lg text-white"><MapPin/></div>
                 <div>
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Наш адрес (Цех)</p>
                    <h3 className="text-xl font-bold text-white">{COMPANY_NAP.address}</h3>
                 </div>
              </div>
              
              <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                 Приезжайте к нам на производство, чтобы увидеть образцы материалов и обсудить проект лично.
              </p>

              <div className="grid grid-cols-3 gap-2">
                 <a href={`https://2gis.kz/astana/search/${encodeURIComponent(COMPANY_NAP.address.replace("г. Астана, ", ""))}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-3 bg-slate-800 rounded-xl hover:bg-green-500/20 hover:border-green-500 hover:text-green-500 border border-slate-700 text-gray-400 transition group">
                    <Navigation className="w-5 h-5 mb-1"/>
                    <span className="text-xs font-bold">2GIS</span>
                 </a>
                 <a href={`https://yandex.kz/maps/?text=${encodeURIComponent(COMPANY_NAP.address)}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-3 bg-slate-800 rounded-xl hover:bg-yellow-500/20 hover:border-yellow-500 hover:text-yellow-500 border border-slate-700 text-gray-400 transition group">
                    <Navigation className="w-5 h-5 mb-1"/>
                    <span className="text-xs font-bold">Yandex</span>
                 </a>
                 <a href={`https://www.google.kz/maps/search/${encodeURIComponent(COMPANY_NAP.address)}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-3 bg-slate-800 rounded-xl hover:bg-blue-500/20 hover:border-blue-500 hover:text-blue-500 border border-slate-700 text-gray-400 transition group">
                    <Navigation className="w-5 h-5 mb-1"/>
                    <span className="text-xs font-bold">Google</span>
                 </a>
              </div>
           </div>
        </div>
      </section>

      {/* 5. РЕКВИЗИТЫ */}
      <section className="py-16 bg-[#0B1120] border-t border-slate-800">
         <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col md:flex-row justify-between items-start gap-8">
               <div className="flex-1 w-full">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                     <Building2 className="w-5 h-5 text-slate-500"/> Реквизиты компании
                  </h3>
                  <div className="grid md:grid-cols-2 gap-y-2 gap-x-8 text-sm text-gray-400 font-mono w-full">
                     <div className="col-span-2 text-white font-bold pb-2 text-base">Исполнитель: {COMPANY_NAP.owner}</div>
                     
                     <span className="text-gray-500">ИИН:</span> <span className="text-slate-300">{COMPANY_NAP.iin}</span>
                     <span className="text-gray-500">Телефон:</span> <span className="text-slate-300">{COMPANY_NAP.phone}</span>
                     
                     <div className="col-span-2 pt-4 text-white font-bold flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-green-500"/> {COMPANY_NAP.bankName}
                     </div>
                     <span className="text-gray-500">ИИК:</span> <span className="text-slate-300 break-all">{COMPANY_NAP.iik}</span>
                     <span className="text-gray-500">БИК:</span> <span className="text-slate-300">{COMPANY_NAP.bik}</span>

                     <div className="col-span-2 pt-4 border-t border-slate-800 mt-2">
                        <span className="block text-gray-500 text-xs mb-1">Юридический адрес:</span>
                        <span className="text-slate-300">{COMPANY_NAP.legalAddress}</span>
                     </div>
                  </div>
               </div>
               
               <button 
                  onClick={() => copyToClipboard(requisitesText, 'requisites')}
                  className={`shrink-0 px-6 py-3 rounded-xl border flex items-center gap-2 transition font-medium w-full md:w-auto justify-center ${copiedId === 'requisites' ? 'bg-green-500 text-white border-green-500' : 'bg-slate-800 text-white border-slate-700 hover:bg-slate-700'}`}
               >
                  {copiedId === 'requisites' ? <><Check className="w-4 h-4"/> Скопировано</> : <><Copy className="w-4 h-4"/> Копировать реквизиты</>}
               </button>
            </div>
         </div>
      </section>

      {/* 6. CTA: ЭКСКУРСИЯ */}
      <CallToAction 
         source="Страница контактов"
         title="Приглашаем на экскурсию в цех"
         subtitle={`Приезжайте на ${COMPANY_NAP.address.replace("г. Астана, ", "")}. Покажем образцы материалов, как работают ЧПУ станки и как собирается ваша будущая вывеска.`}
         buttonText="Записаться на встречу"
      />

    </div>
  );
}