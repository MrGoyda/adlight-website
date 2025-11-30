"use client";

import Marquee from "react-fast-marquee";

const clients = [ "SMALL", "COFFEE BOOM", "SMALL", "MAGNUM", "TECHNODOM", "SULPAK", "BI GROUP", "BAZIS-A", "KASPI", "HALYK BANK", "DODO PIZZA" ];

export default function ClientsMarquee() {
  return (
    <section data-aos="fade-up" className="py-10 bg-slate-950 border-b border-slate-800 relative z-20">
      <div className="container mx-auto px-4 mb-10">
         <p className="text-center text-gray-500 text-xs md:text-sm uppercase tracking-[0.3em] font-semibold">
           Нам доверяют бизнес в Астане
         </p>
      </div>
      
      <div className="relative flex">
         {/* Градиентные шторки */}
         <div className="absolute inset-y-0 left-0 w-24 md:w-32 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none"></div>
         <div className="absolute inset-y-0 right-0 w-24 md:w-32 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none"></div>

         <Marquee gradient={false} speed={40} autoFill={true} className="overflow-hidden" style={{ overflowY: 'hidden' }}>
            {clients.map((client, index) => (
               <span key={index} className="text-4xl md:text-5xl font-black text-slate-800 uppercase tracking-tighter hover:text-orange-600 transition-colors duration-300 cursor-default select-none mx-12 leading-none py-2">
                  {client}
               </span>
            ))}
         </Marquee>
      </div>
    </section>
  );
}