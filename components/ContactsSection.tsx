"use client";

import { useState } from "react";
import { MapPin, Clock, Phone, MessageCircle } from "lucide-react";

export default function ContactsSection() {
  const [mapInteractive, setMapInteractive] = useState(false);

  const triggerHaptic = () => {
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const handleInteractiveClick = () => {
    triggerHaptic();
    setMapInteractive(true);
  };

  return (
    <section data-aos="fade-up" id="contacts" className="py-0 bg-slate-50 border-t border-slate-200 relative h-[600px] overflow-hidden">
      
      {/* Map (Layer 1) - Light Premium Grayscale */}
      <div 
        className="absolute inset-0 bg-slate-100"
        onMouseLeave={() => setMapInteractive(false)}
      >
        <iframe 
            src="https://yandex.ru/map-widget/v1/?text=Астана+Аспара+7&z=16" 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            title="Карта проезда к офису ADLight"
            style={{ 
              filter: 'grayscale(100%) contrast(1.15) opacity(0.9)',
              pointerEvents: mapInteractive ? 'auto' : 'none'
            }} 
            className="w-full h-full"
            loading="lazy"
        ></iframe>

        {/* Warm Orange Brand Interactivity Overlay */}
        {!mapInteractive && (
          <div 
            onClick={handleInteractiveClick}
            className="absolute inset-0 bg-gradient-to-tr from-orange-500/[0.12] via-orange-500/[0.04] to-transparent backdrop-blur-[1px] hover:backdrop-blur-0 transition-all duration-500 cursor-pointer flex items-center justify-center z-10"
          >
            <button className="bg-white/95 backdrop-blur-md px-6 py-3 rounded-full border border-orange-200 shadow-[0_4px_20px_rgba(249,115,22,0.15)] text-orange-600 font-black text-xs tracking-widest uppercase flex items-center gap-2 hover:scale-105 active:scale-95 transition-all select-none">
              <span>Взаимодействовать с картой</span>
            </button>
          </div>
        )}
      </div>

      {/* Warm orange brand ambient background glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-orange-500/[0.06] to-transparent rounded-full pointer-events-none z-10" />
      
      {/* Content (Layer 2) */}
      <div className="container mx-auto px-4 h-full flex items-center justify-center md:justify-start relative pointer-events-none z-20">
         <div className="bg-white/95 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-slate-200/80 border-t-4 border-t-orange-500 shadow-[0_15px_50px_rgba(0,0,0,0.04)] max-w-md w-full pointer-events-auto space-y-8">
            <div className="space-y-2">
               <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest block">Наши контакты</span>
               <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-none">Приезжайте в гости</h3>
            </div>
            
            <div className="space-y-6">
               
               {/* Address */}
               <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-orange-50 text-orange-600 border border-orange-100/60 rounded-xl flex items-center justify-center shrink-0">
                     <MapPin className="w-5 h-5"/>
                  </div>
                  <div className="text-left">
                     <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Адрес цеха и офиса:</span>
                     <p className="text-slate-900 font-extrabold text-base leading-tight">г. Астана, ул. Аспара 7</p>
                  </div>
               </div>
               
               {/* Mode of operation */}
               <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-orange-50/50 text-orange-600 border border-orange-100/40 rounded-xl flex items-center justify-center shrink-0">
                     <Clock className="w-5 h-5"/>
                  </div>
                  <div className="text-left">
                     <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Режим работы:</span>
                     <p className="text-slate-900 font-extrabold text-base leading-tight">Пн-Пт: 09:00 - 18:00</p>
                     <span className="text-[10px] text-emerald-600 font-black uppercase tracking-wider block mt-1.5">WhatsApp — круглосуточно</span>
                  </div>
               </div>
               
               {/* Phone */}
               <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-orange-50 text-orange-600 border border-orange-100/60 rounded-xl flex items-center justify-center shrink-0">
                     <Phone className="w-5 h-5"/>
                  </div>
                  <div className="text-left">
                     <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Телефон для связи:</span>
                     <a 
                       href="tel:+77071356701" 
                       className="text-slate-900 font-extrabold text-base hover:text-orange-600 transition block leading-tight"
                     >
                        +7 (707) 135-67-01
                     </a>
                  </div>
               </div>
            </div>
            
            {/* Quick Actions Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
               <a 
                 href="https://2gis.kz/astana/search/Аспара%207" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="inline-flex items-center justify-center py-3.5 border border-slate-200 text-slate-800 bg-white hover:bg-slate-50 rounded-xl transition font-extrabold text-xs uppercase tracking-wider shadow-sm active:scale-97 text-center"
               >
                  Маршрут 2GIS
               </a>
               <a 
                 href="https://wa.me/77071356701" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="inline-flex items-center justify-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition font-extrabold text-xs uppercase tracking-wider shadow-md shadow-emerald-950/10 active:scale-97 text-center"
               >
                  <MessageCircle className="w-4 h-4"/>
                  <span>Написать</span>
               </a>
            </div>
         </div>
      </div>
    </section>
  );
}