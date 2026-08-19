"use client";

import { useState, useRef, useEffect } from "react";
import { MapPin, Clock, Phone, MessageCircle } from "lucide-react";
import { SITE_CONTACTS } from "@/config/site";
import Button from "@/components/ui/Button";

export default function ContactsSection() {
  const [mapInteractive, setMapInteractive] = useState(false);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsMapVisible(true);
            if (sectionRef.current) observer.unobserve(sectionRef.current);
          }
        });
      },
      { rootMargin: "300px" } // Начинаем подгрузку карты за 300px до скролла к секции
    );

    const currentRef = sectionRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

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
    <section ref={sectionRef} id="contacts" className="py-0 bg-slate-50 border-t border-slate-200 relative h-[600px] overflow-hidden">
      
      {/* Map (Layer 1) - Light Premium Grayscale */}
      <div 
        className="absolute inset-0 bg-slate-100"
        onMouseLeave={() => setMapInteractive(false)}
      >
        {isMapVisible ? (
          <iframe 
              src={SITE_CONTACTS.maps.yandexWidget} 
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
              suppressHydrationWarning
          ></iframe>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 text-xs font-semibold">
            Загрузка карты...
          </div>
        )}

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
         <div 
           className="bg-white/95 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-slate-200/80 border-t-4 border-t-orange-500 shadow-[0_15px_50px_rgba(0,0,0,0.04)] max-w-md w-full pointer-events-auto space-y-8"
           itemScope 
           itemType="https://schema.org/LocalBusiness"
         >
            <meta itemProp="name" content="ADLight" />
            <meta itemProp="image" content="https://adlight.kz/adlight-logo-full.webp" />
            <meta itemProp="priceRange" content="$$" />

            <div className="space-y-2">
               <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest block">Наши контакты</span>
               <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-none">Приезжайте в гости</h3>
            </div>
            
            <div className="space-y-6">
               
               {/* Address */}
               <div className="flex gap-4 items-start" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                  <meta itemProp="addressCountry" content="KZ" />
                  <meta itemProp="postalCode" content="010000" />
                  <div className="w-10 h-10 bg-orange-50 text-orange-600 border border-orange-100/60 rounded-xl flex items-center justify-center shrink-0">
                     <MapPin className="w-5 h-5"/>
                  </div>
                  <div className="text-left">
                     <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Адрес цеха и офиса:</span>
                     <p className="text-slate-900 font-extrabold text-base leading-tight">
                       г. <span itemProp="addressLocality">{SITE_CONTACTS.locality}</span>, <span itemProp="streetAddress">{SITE_CONTACTS.address.replace(", г. Астана", "")}</span>
                     </p>
                  </div>
               </div>
               
               {/* Mode of operation */}
               <div className="flex gap-4 items-start" itemProp="openingHoursSpecification" itemScope itemType="https://schema.org/OpeningHoursSpecification">
                  <meta itemProp="dayOfWeek" content="Monday" />
                  <meta itemProp="dayOfWeek" content="Tuesday" />
                  <meta itemProp="dayOfWeek" content="Wednesday" />
                  <meta itemProp="dayOfWeek" content="Thursday" />
                  <meta itemProp="dayOfWeek" content="Friday" />
                  <meta itemProp="opens" content="09:00" />
                  <meta itemProp="closes" content="18:00" />

                  <div className="w-10 h-10 bg-orange-50/50 text-orange-600 border border-orange-100/40 rounded-xl flex items-center justify-center shrink-0">
                     <Clock className="w-5 h-5"/>
                  </div>
                  <div className="text-left">
                     <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Режим работы:</span>
                     <p className="text-slate-900 font-extrabold text-base leading-tight">{SITE_CONTACTS.workingHours.split(", ")[0]}</p>
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
                        href={`tel:${SITE_CONTACTS.phoneRaw}`} 
                        onClick={async () => {
                          const { handleTrackedClick } = await import("@/lib/clickTracker");
                          handleTrackedClick({ type: "phone", source: "ContactsSection" });
                        }}
                        className="text-slate-900 font-extrabold text-base hover:text-orange-600 transition block leading-tight"
                        itemProp="telephone"
                      >
                         {SITE_CONTACTS.phone}
                      </a>
                   </div>
                </div>
             </div>
             
             {/* Quick Actions Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                 <Button 
                   href={SITE_CONTACTS.maps.yandexSearch} 
                   variant="lightOutline"
                   className="w-full text-xs font-extrabold py-3.5"
                   title="Открыть маршрут на карте"
                 >
                    Маршрут на карте
                 </Button>
                 <Button 
                   href={SITE_CONTACTS.socials.whatsapp} 
                   onClick={async (e) => {
                     e.preventDefault();
                     const { getTrackedWhatsappUrl } = await import("@/lib/clickTracker");
                     const url = await getTrackedWhatsappUrl("77071356701", "Здравствуйте! Хочу проконсультироваться по вывеске.", "ContactsSection");
                     window.open(url, "_blank");
                   }}
                   className="w-full bg-emerald-600 hover:bg-emerald-700 text-xs font-extrabold py-3.5 border-emerald-500/20 shadow-emerald-950/10 cursor-pointer"
                   leftIcon={<MessageCircle className="w-4 h-4"/>}
                   title="Написать в WhatsApp"
                 >
                    Написать
                 </Button>
              </div>
         </div>
      </div>
    </section>
  );
}