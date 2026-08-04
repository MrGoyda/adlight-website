import { useState, useRef, useEffect } from "react";
import { MapPin } from "lucide-react";
import Button from "@/components/ui/Button";
import { COMPANY_NAP } from "@/dictionaries/common";
import { CONTACTS_DICT } from "@/dictionaries/contacts";

// --- ВЕКТОРНЫЕ ИКОНКИ БРЕНДОВ НАВИГАЦИИ (SVG) ---
const Icon2GIS = () => (
  <div className="relative w-7 h-7 mb-1 flex items-center justify-center">
     <img 
        src="/images/icons/2gis.svg" 
        alt="2GIS" 
        width="28" 
        height="28" 
        className="object-contain transition-transform duration-300 group-hover:scale-110"
     />
  </div>
);

const IconYandex = () => (
  <div className="relative w-7 h-7 mb-1 flex items-center justify-center">
     <img 
        src="/images/icons/yandex.svg" 
        alt="Яндекс Карты" 
        width="28" 
        height="28" 
        className="object-contain transition-transform duration-300 group-hover:scale-110"
     />
  </div>
);

const IconGoogleMaps = () => (
  <div className="relative w-7 h-7 mb-1 flex items-center justify-center">
     <img 
        src="/images/icons/google.svg" 
        alt="Google Maps" 
        width="28" 
        height="28" 
        className="object-contain transition-transform duration-300 group-hover:scale-110"
     />
  </div>
);

interface ContactsMapProps {
  mapInteractive: boolean;
  handleInteractiveClick: () => void;
  setMapInteractive: (interactive: boolean) => void;
}

export default function ContactsMap({
  mapInteractive,
  handleInteractiveClick,
  setMapInteractive
}: ContactsMapProps) {
  const dict = CONTACTS_DICT.mapCard;
  const [shouldLoadIframe, setShouldLoadIframe] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Подгружаем тяжелый iframe Яндекс.Карты только при появлении карты в зоне видимости
  useEffect(() => {
    if (shouldLoadIframe) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoadIframe(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [shouldLoadIframe]);

  const onShieldClick = () => {
    setShouldLoadIframe(true);
    handleInteractiveClick();
  };

  return (
    <section ref={containerRef} className="py-0 bg-slate-100 border-b border-slate-200 relative h-[600px] overflow-hidden">
      {/* Map Container */}
      <div className="absolute inset-0 bg-slate-200">
          {shouldLoadIframe ? (
            <iframe 
              src={COMPANY_NAP.maps.yandexWidget} 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              title="Интерактивная карта проезда к цеху ADLight" 
              style={{ 
                filter: 'grayscale(100%) contrast(1.1) opacity(0.95)',
                pointerEvents: mapInteractive ? 'auto' : 'none'
              }} 
              className="w-full h-full"
              loading="lazy"
            ></iframe>
          ) : (
            <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400 font-bold text-xs uppercase tracking-wider">
               Загрузка интерактивной карты...
            </div>
          )}
          {/* Brand Interactivity Shield */}
          {!mapInteractive && (
            <div 
              onClick={onShieldClick}
              className="absolute inset-0 bg-gradient-to-tr from-orange-500/[0.08] via-orange-500/[0.02] to-transparent backdrop-blur-[0.5px] hover:backdrop-blur-0 transition-all duration-500 cursor-pointer flex items-center justify-center z-10"
            >
              <button className="bg-white/95 backdrop-blur-md px-6 py-3 rounded-full border border-orange-200 shadow-[0_4px_25px_rgba(249,115,22,0.12)] text-orange-600 font-extrabold text-xs tracking-widest uppercase flex items-center gap-2 hover:scale-105 active:scale-95 transition-all select-none">
                <span>{dict.interactiveShieldText}</span>
              </button>
            </div>
          )}
       </div>

       {/* Floating Card for Address Details */}
       <div 
         className="container mx-auto px-4 h-full flex items-center relative pointer-events-none z-20"
         onMouseLeave={() => setMapInteractive(false)}
       >
          <div className="bg-white/97 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-[0_20px_60px_rgba(15,23,42,0.06)] max-w-md w-full pointer-events-auto space-y-6">
             <div className="flex items-center gap-4" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                <div className="p-3 bg-orange-50 border border-orange-100 rounded-xl text-orange-600 shrink-0"><MapPin className="w-5 h-5"/></div>
                <div>
                   <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block mb-0.5">{dict.label}</span>
                   <h3 className="text-xl font-black text-slate-900 tracking-tight leading-snug" itemProp="streetAddress">
                      <meta itemProp="addressLocality" content="Астана" />
                      <meta itemProp="addressCountry" content="KZ" />
                      {COMPANY_NAP.address}
                   </h3>
                </div>
             </div>
             
             {/* Локальные SEO ориентиры */}
             <div className="space-y-3 border-t border-slate-100 pt-4 text-slate-800 text-sm leading-relaxed font-semibold">
                <p>
                   <strong className="text-slate-950 font-black">{dict.howToFindTitle}</strong> {dict.howToFindDesc}
                </p>
                <p>
                   <strong className="text-slate-955 font-black">{dict.parkingTitle}</strong> {dict.parkingDesc}
                </p>
             </div>

             <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                <Button 
                  href={COMPANY_NAP.maps.gisSearch} 
                  target="_blank"
                  variant="lightOutline"
                  className="flex flex-col items-center justify-center p-3 h-auto text-slate-900 hover:text-green-600 hover:border-green-300 transition-all duration-300 bg-slate-50 hover:bg-slate-100 group"
                  title="Открыть в 2GIS"
                >
                   <Icon2GIS />
                   <span className="text-[10px] font-black tracking-wider uppercase">2GIS</span>
                </Button>
                <Button 
                  href={COMPANY_NAP.maps.yandexSearch} 
                  target="_blank"
                  variant="lightOutline"
                  className="flex flex-col items-center justify-center p-3 h-auto text-slate-900 hover:text-red-600 hover:border-red-300 transition-all duration-300 bg-slate-50 hover:bg-slate-100 group"
                  title="Открыть в Яндекс.Картах"
                >
                   <IconYandex />
                   <span className="text-[10px] font-black tracking-wider uppercase">Yandex</span>
                </Button>
                <Button 
                  href={COMPANY_NAP.maps.googleSearch} 
                  target="_blank"
                  variant="lightOutline"
                  className="flex flex-col items-center justify-center p-3 h-auto text-slate-900 hover:text-blue-600 hover:border-blue-300 transition-all duration-300 bg-slate-50 hover:bg-slate-100 group"
                  title="Открыть в Google Maps"
                >
                   <IconGoogleMaps />
                   <span className="text-[10px] font-black tracking-wider uppercase">Google</span>
                </Button>
            </div>
         </div>
      </div>
    </section>
  );
}
