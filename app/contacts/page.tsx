"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Phone, 
  MapPin, 
  Clock, 
  Mail, 
  Instagram, 
  Send, 
  MessageCircle, 
  ChevronRight, 
  Copy, 
  Check, 
  Building2, 
  Users, 
  HardHat, 
  FileText,
  Navigation
} from "lucide-react";

// --- КОМПОНЕНТЫ ---
import CallToAction from "@/components/CallToAction";

export default function ContactsPage() {
  const [copied, setCopied] = useState(false);

  // Функция копирования реквизитов
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Простая логика статуса (Открыто/Закрыто)
  const currentHour = new Date().getHours();
  const isOpen = currentHour >= 9 && currentHour < 18;

  return (
    <div className="min-h-screen bg-[#0B1120] font-sans selection:bg-orange-500/30">
      
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
              Мы открыты для диалога. Приезжайте в офис, пишите в мессенджеры или звоните. 
              Работаем с юридическими и физическими лицами.
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
                     <a href="tel:+77071356701" className="text-2xl font-bold text-white hover:text-orange-500 transition block mb-4">+7 707 135 67 01</a>
                     <a href="tel:+77071356701" className="inline-flex items-center text-sm font-bold text-white bg-slate-800 hover:bg-orange-600 px-4 py-2 rounded-lg transition border border-slate-700 hover:border-orange-500">
                        Позвонить сейчас
                     </a>
                  </div>
               </div>

               {/* МЕССЕНДЖЕРЫ */}
               <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 hover:border-blue-500/50 transition group flex flex-col justify-between h-64">
                  <div className="flex justify-between items-start">
                     <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500"><MessageCircle className="w-6 h-6"/></div>
                  </div>
                  <div>
                     <p className="text-gray-400 text-sm mb-4">Пишите нам 24/7</p>
                     <div className="flex gap-3">
                        <a href="https://wa.me/77071356701" target="_blank" className="flex-1 flex items-center justify-center gap-2 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white py-3 rounded-xl transition border border-[#25D366]/20">
                           <MessageCircle className="w-5 h-5"/> WhatsApp
                        </a>
                        <a href="https://t.me/username" target="_blank" className="flex-1 flex items-center justify-center gap-2 bg-[#229ED9]/10 text-[#229ED9] hover:bg-[#229ED9] hover:text-white py-3 rounded-xl transition border border-[#229ED9]/20">
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
                        {isOpen ? 'Сейчас открыто' : 'Сейчас закрыто'}
                     </div>
                  </div>
                  <div>
                     <p className="text-gray-400 text-sm mb-2">Режим работы</p>
                     <div className="space-y-1">
                        <div className="flex justify-between text-white font-medium"><span>Пн - Пт</span><span>09:00 - 18:00</span></div>
                        <div className="flex justify-between text-gray-500 text-sm"><span>Сб - Вс</span><span>Выходной</span></div>
                     </div>
                  </div>
               </div>

               {/* ПОЧТА */}
               <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 hover:border-pink-500/50 transition group flex flex-col justify-between h-64">
                  <div className="flex justify-between items-start">
                     <div className="p-3 bg-pink-500/10 rounded-xl text-pink-500"><Mail className="w-6 h-6"/></div>
                  </div>
                  <div>
                     <p className="text-gray-400 text-sm mb-1">Для тендеров и КП</p>
                     <a href="mailto:info@adlight.kz" className="text-xl font-bold text-white hover:text-pink-500 transition block mb-4">info@adlight.kz</a>
                     <button onClick={() => {navigator.clipboard.writeText('info@adlight.kz'); alert('Email скопирован!')}} className="text-sm text-slate-400 hover:text-white flex items-center gap-2 transition">
                        <Copy className="w-4 h-4"/> Скопировать
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
                     <p className="text-gray-400 text-sm mb-3">Консультации, расчет стоимости, оформление заказов.</p>
                     <a href="tel:+77071356701" className="text-orange-500 text-sm font-bold hover:underline">Связаться с менеджером →</a>
                  </div>
               </div>
               
               {/* Производство */}
               <div className="flex items-start gap-4 p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
                  <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-white shrink-0"><HardHat className="w-6 h-6"/></div>
                  <div>
                     <h3 className="text-white font-bold mb-1">Технический отдел</h3>
                     <p className="text-gray-400 text-sm mb-3">Вопросы по монтажу, материалам и гарантийному обслуживанию.</p>
                     <a href="https://wa.me/77071356701" className="text-blue-500 text-sm font-bold hover:underline">Написать технологу →</a>
                  </div>
               </div>

               {/* Бухгалтерия */}
               <div className="flex items-start gap-4 p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
                  <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-white shrink-0"><FileText className="w-6 h-6"/></div>
                  <div>
                     <h3 className="text-white font-bold mb-1">Бухгалтерия</h3>
                     <p className="text-gray-400 text-sm mb-3">Акты сверки, счета-фактуры, закрывающие документы.</p>
                     <a href="mailto:buh@adlight.kz" className="text-slate-400 text-sm font-bold hover:text-white transition">buh@adlight.kz</a>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 4. КАРТА И МАРШРУТЫ */}
      <section className="py-0 bg-slate-950 border-t border-slate-800 relative h-[600px]">
        <div className="absolute inset-0 bg-slate-800">
           {/* КАРТА (Фильтр для темной темы) */}
           <iframe src="https://yandex.ru/map-widget/v1/?ll=71.497162%2C51.194223&mode=search&ol=geo&ouri=ymapsbm1%3A%2F%2Fgeo%3Fdata%3DCgg2NjIzOTY5MRJO0JrQsNC30LDRh9GB0YLQs0L0LCBBc3RhbmEsIEFxxb5vLCAxMTAsINCQ0YHRgtCw0L3QsCAwMTAwMDAsINCQ0YHRgtCw0L3QsCAwMTAwMDAiCg21RlFCFU_PUEI%2C&z=16.63" width="100%" height="100%" frameBorder="0" style={{ filter: 'grayscale(100%) invert(90%) hue-rotate(180deg)' }} className="opacity-80"></iframe>
        </div>
        <div className="container mx-auto px-4 h-full flex items-center relative pointer-events-none">
           <div className="bg-[#0B1120]/95 backdrop-blur-md p-8 rounded-3xl border border-slate-700 shadow-2xl max-w-md w-full pointer-events-auto">
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-2 bg-orange-500 rounded-lg text-white"><MapPin/></div>
                 <div>
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Наш адрес</p>
                    <h3 className="text-xl font-bold text-white">г. Астана, ул. Акжол 110</h3>
                 </div>
              </div>
              
              <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                 Мы находимся в районе "Байконур". Вход через синие ворота, на проходной скажите "в рекламный цех". Парковка бесплатная.
              </p>

              <div className="grid grid-cols-3 gap-2">
                 <a href="https://2gis.kz/astana" target="_blank" className="flex flex-col items-center justify-center p-3 bg-slate-800 rounded-xl hover:bg-green-500/20 hover:border-green-500 hover:text-green-500 border border-slate-700 text-gray-400 transition group">
                    <Navigation className="w-5 h-5 mb-1"/>
                    <span className="text-xs font-bold">2GIS</span>
                 </a>
                 <a href="https://yandex.kz/maps" target="_blank" className="flex flex-col items-center justify-center p-3 bg-slate-800 rounded-xl hover:bg-yellow-500/20 hover:border-yellow-500 hover:text-yellow-500 border border-slate-700 text-gray-400 transition group">
                    <Navigation className="w-5 h-5 mb-1"/>
                    <span className="text-xs font-bold">Yandex</span>
                 </a>
                 <a href="https://google.kz/maps" target="_blank" className="flex flex-col items-center justify-center p-3 bg-slate-800 rounded-xl hover:bg-blue-500/20 hover:border-blue-500 hover:text-blue-500 border border-slate-700 text-gray-400 transition group">
                    <Navigation className="w-5 h-5 mb-1"/>
                    <span className="text-xs font-bold">Google</span>
                 </a>
              </div>
           </div>
        </div>
      </section>

      {/* 5. РЕКВИЗИТЫ (TRUST BLOCK) */}
      <section className="py-16 bg-[#0B1120] border-t border-slate-800">
         <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
               <div>
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                     <Building2 className="w-5 h-5 text-slate-500"/> Реквизиты компании
                  </h3>
                  <div className="space-y-1 text-sm text-gray-400 font-mono">
                     <p>ТОО "ADLight Group"</p>
                     <p>БИН: 210540038219</p>
                     <p>Адрес: 010000, г. Астана, ул. Акжол 110</p>
                  </div>
               </div>
               <button 
                  onClick={() => copyToClipboard("БИН 210540038219\nТОО ADLight Group")}
                  className={`px-6 py-3 rounded-xl border flex items-center gap-2 transition font-medium ${copied ? 'bg-green-500 text-white border-green-500' : 'bg-slate-800 text-white border-slate-700 hover:bg-slate-700'}`}
               >
                  {copied ? <><Check className="w-4 h-4"/> Скопировано</> : <><Copy className="w-4 h-4"/> Копировать реквизиты</>}
               </button>
            </div>
         </div>
      </section>

      {/* 6. CTA: ЭКСКУРСИЯ */}
      <CallToAction 
         source="Страница контактов"
         title="Приглашаем на экскурсию в цех"
         subtitle="Приезжайте к нам на кофе. Покажем образцы материалов, как работают станки и как собирается ваша будущая вывеска."
         buttonText="Записаться на встречу"
      />

    </div>
  );
}