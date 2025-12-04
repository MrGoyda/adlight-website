"use client";

import { MapPin, Clock, Phone } from "lucide-react";

export default function ContactsSection() {
  return (
    <section data-aos="fade-up" id="contacts" className="py-0 bg-slate-950 border-t border-slate-800 relative h-[600px]">
      
      {/* Карта (Слой 1) */}
      <div className="absolute inset-0 bg-slate-800">
        <iframe 
            src="https://yandex.ru/map-widget/v1/?ll=71.497162%2C51.194223&mode=search&ol=geo&ouri=ymapsbm1%3A%2F%2Fgeo%3Fdata%3DCgg2NjIzOTY5MRJO0JrQsNC30LDRh9GB0YLQs0L0LCBBc3RhbmEsIEFxxb5vLCAxMTAsINCQ0YHRgtCw0L3QsCAwMTAwMDAsINCQ0YHRgtCw0L3QsCAwMTAwMDAiCg21RlFCFU_PUEI%2C&z=16.63" 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            style={{ filter: 'grayscale(100%) invert(90%) hue-rotate(180deg)' }} 
            className="opacity-80 w-full h-full"
        ></iframe>
      </div>
      
      {/* Контент (Слой 2) */}
      <div className="container mx-auto px-4 h-full flex items-center justify-center md:justify-start relative pointer-events-none">
         <div className="bg-slate-900/90 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-slate-700/50 shadow-2xl max-w-md w-full pointer-events-auto">
            <h3 className="text-2xl font-bold text-white mb-8">Приезжайте в гости</h3>
            
            <div className="space-y-8">
               <div className="flex gap-5">
                  <div className="w-12 h-12 bg-orange-600/20 rounded-full flex items-center justify-center text-orange-500 flex-shrink-0 shadow-inner border border-orange-500/20">
                     <MapPin className="w-6 h-6"/>
                  </div>
                  <div>
                     <p className="text-sm text-gray-400 mb-1">Адрес цеха и офиса</p>
                     <p className="text-white font-medium text-lg leading-tight">г. Астана, ул. Акжол 110</p>
                  </div>
               </div>
               
               <div className="flex gap-5">
                  <div className="w-12 h-12 bg-orange-600/20 rounded-full flex items-center justify-center text-orange-500 flex-shrink-0 shadow-inner border border-orange-500/20">
                     <Clock className="w-6 h-6"/>
                  </div>
                  <div>
                     <p className="text-sm text-gray-400 mb-1">Режим работы</p>
                     <p className="text-white font-medium text-lg leading-tight">Пн-Пт: 09:00 - 18:00</p>
                  </div>
               </div>
               
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
            
            <a href="https://2gis.kz/astana" target="_blank" className="mt-10 flex items-center justify-center w-full py-4 border border-slate-600 text-white rounded-xl hover:bg-slate-800 hover:border-slate-500 transition font-bold active:scale-95">
               Построить маршрут в 2GIS
            </a>
         </div>
      </div>
    </section>
  );
}