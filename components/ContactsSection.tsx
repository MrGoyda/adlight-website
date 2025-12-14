"use client";

import { MapPin, Clock, Phone, MessageCircle } from "lucide-react";

export default function ContactsSection() {
  return (
    <section data-aos="fade-up" id="contacts" className="py-0 bg-slate-950 border-t border-slate-800 relative h-[600px]">
      
      {/* Карта (Слой 1) */}
      <div className="absolute inset-0 bg-slate-800">
        <iframe 
            src="https://yandex.ru/map-widget/v1/?text=Астана+Аспара+7&z=16" // Обновленный поиск по адресу
            width="100%" 
            height="100%" 
            frameBorder="0" 
            style={{ filter: 'grayscale(100%) invert(90%) hue-rotate(180deg)' }} 
            className="opacity-80 w-full h-full"
            loading="lazy"
        ></iframe>
      </div>
      
      {/* Контент (Слой 2) */}
      <div className="container mx-auto px-4 h-full flex items-center justify-center md:justify-start relative pointer-events-none">
         <div className="bg-slate-900/90 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-slate-700/50 shadow-2xl max-w-md w-full pointer-events-auto">
            <h3 className="text-2xl font-bold text-white mb-8">Приезжайте в гости</h3>
            
            <div className="space-y-8">
               
               {/* Адрес */}
               <div className="flex gap-5">
                  <div className="w-12 h-12 bg-orange-600/20 rounded-full flex items-center justify-center text-orange-500 flex-shrink-0 shadow-inner border border-orange-500/20">
                     <MapPin className="w-6 h-6"/>
                  </div>
                  <div>
                     <p className="text-sm text-gray-400 mb-1">Адрес цеха и офиса</p>
                     <p className="text-white font-medium text-lg leading-tight">г. Астана, ул. Аспара 7</p>
                  </div>
               </div>
               
               {/* Время работы */}
               <div className="flex gap-5">
                  <div className="w-12 h-12 bg-orange-600/20 rounded-full flex items-center justify-center text-orange-500 flex-shrink-0 shadow-inner border border-orange-500/20">
                     <Clock className="w-6 h-6"/>
                  </div>
                  <div>
                     <p className="text-sm text-gray-400 mb-1">Режим работы</p>
                     <p className="text-white font-medium text-lg leading-tight">Пн-Пт: 09:00 - 18:00</p>
                     <p className="text-xs text-green-500 mt-1 font-medium">WhatsApp — круглосуточно</p>
                  </div>
               </div>
               
               {/* Телефон */}
               <div className="flex gap-5">
                  <div className="w-12 h-12 bg-orange-600/20 rounded-full flex items-center justify-center text-orange-500 flex-shrink-0 shadow-inner border border-orange-500/20">
                     <Phone className="w-6 h-6"/>
                  </div>
                  <div>
                     <p className="text-sm text-gray-400 mb-1">Телефон</p>
                     <a href="tel:+77071356701" className="text-white font-medium text-lg hover:text-orange-500 transition block leading-tight">
                        +7 (707) 135-67-01
                     </a>
                  </div>
               </div>
            </div>
            
            {/* Кнопки действий */}
            <div className="mt-10 grid grid-cols-2 gap-3">
               <a href="https://2gis.kz/astana/search/Аспара%207" target="_blank" className="flex items-center justify-center py-3.5 border border-slate-600 text-white rounded-xl hover:bg-slate-800 hover:border-slate-500 transition font-bold text-sm active:scale-95">
                  Маршрут 2GIS
               </a>
               <a href="https://wa.me/77071356701" target="_blank" className="flex items-center justify-center gap-2 py-3.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-bold text-sm active:scale-95 shadow-lg shadow-green-900/20">
                  <MessageCircle className="w-4 h-4"/> Написать
               </a>
            </div>
         </div>
      </div>
    </section>
  );
}