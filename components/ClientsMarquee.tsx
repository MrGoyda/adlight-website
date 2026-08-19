import Image from "next/image";
import { getCdnUrl } from "@/lib/serverUtils";

const CLIENTS = [
  { name: "Yandex Pro", src: "/images/clients/yandex-pro.png", alt: "Яндекс Про - Логотип клиента ADLight Астана" },
  { name: "Visa", src: "/images/clients/visa.png", alt: "Visa - Логотип клиента ADLight Астана" },
  { name: "DKC", src: "/images/clients/dkc.png", alt: "ДКС - Логотип партнера ADLight Астана" },
  { name: "Lunda", src: "/images/clients/lunda.png", alt: "Lunda - Логотип клиента ADLight Астана" },
  { name: "Reikartz Hotel", src: "/images/clients/reikartz-hotel.png", alt: "Reikartz Hotel - Логотип клиента ADLight Астана" },
  { name: "Green Leaf", src: "/images/clients/green-leaf.png", alt: "Green Leaf - Логотип клиента ADLight" },
  { name: "Happy Day", src: "/images/clients/happy-day.png", alt: "Happy Day - Логотип клиента ADLight" },
  { name: "Korean House", src: "/images/clients/korean-house.png", alt: "Korean House - Логотип клиента ADLight" },
  { name: "Mazaltov Man", src: "/images/clients/mazaltov-man.png", alt: "MazaltovMan - Логотип клиента ADLight" },
  { name: "Neuro Academy", src: "/images/clients/neuro-academy.png", alt: "Neuro Academy - Логотип клиента ADLight" },
  { name: "Prosto Top", src: "/images/clients/prosto-top.png", alt: "Prosto-top - Логотип клиента ADLight" },
  { name: "Wroom Autohouse", src: "/images/clients/wroom-autohouse.png", alt: "Wroom Autohouse - Логотип клиента ADLight" },
  { name: "Dars", src: "/images/clients/dars.png", alt: "Dars - Логотип клиента ADLight" },
  { name: "Alliance Francaise", src: "/images/clients/alliance-francaise.png", alt: "Alliance Francaise - Логотип клиента ADLight" },
  { name: "Kazeximex", src: "/images/clients/kazeximex.png", alt: "КазЭксиМекс - Логотип клиента ADLight" },
  { name: "Neurodin", src: "/images/clients/neurodin.png", alt: "Нейродин - Логотип клиента ADLight" },
  { name: "Positive Vibrations", src: "/images/clients/positive-vibrations.png", alt: "Позитивные вибрации - Логотип клиента ADLight" },
  { name: "Stumari", src: "/images/clients/stumari.png", alt: "Стумари - Логотип клиента ADLight" },
  { name: "Archiprosto", src: "/images/clients/archiprosto.png", alt: "Архипросто - Логотип клиента ADLight" },
  { name: "Profdor", src: "/images/clients/profdor.png", alt: "Профдор - Логотип клиента ADLight" },
  { name: "Disflexic Home School", src: "/images/clients/disflexic-home-school.png", alt: "Disflexic Home School - Логотип клиента ADLight" },
  { name: "LC", src: "/images/clients/lc.png", alt: "LC - Логотип клиента ADLight" },
  { name: "SF", src: "/images/clients/sf.png", alt: "SF - Логотип клиента ADLight" },
];

export default function ClientsMarquee() {
  return (
    <section className="py-12 bg-white border-b border-slate-200/60 relative z-20 overflow-hidden">
      <div className="container mx-auto px-4 mb-8">
         <p className="text-center text-slate-400 text-[10px] md:text-xs uppercase tracking-[0.35em] font-black">
            Нам доверяют лидеры рынка в Астане
         </p>
      </div>
      
      <div className="relative flex items-center overflow-hidden group">
         {/* Subtle side shading fades for seamless premium look */}
         <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-white via-white/50 to-transparent z-10 pointer-events-none"></div>
         <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-white via-white/50 to-transparent z-10 pointer-events-none"></div>

         <div className="flex w-max shrink-0 animate-marquee group-hover:[animation-play-state:paused] py-3">
            {CLIENTS.map((client, index) => (
               <div 
                 key={`${client.name}-${index}`} 
                 className="relative h-11 md:h-12 w-32 md:w-36 mx-8 md:mx-12 shrink-0 flex items-center justify-center filter grayscale contrast-125 opacity-40 hover:grayscale-0 hover:contrast-100 hover:opacity-100 transition-all duration-300 ease-in-out cursor-default"
               >
                  <Image 
                     src={getCdnUrl(client.src)} 
                     alt={client.alt}
                     fill
                     className="object-contain"
                     sizes="(max-width: 768px) 96px, 144px"
                     loading="lazy"
                  />
               </div>
            ))}
         </div>

         <div aria-hidden="true" className="flex w-max shrink-0 animate-marquee group-hover:[animation-play-state:paused] py-3">
            {CLIENTS.map((client, index) => (
               <div 
                 key={`clone-${client.name}-${index}`} 
                 className="relative h-11 md:h-12 w-32 md:w-36 mx-8 md:mx-12 shrink-0 flex items-center justify-center filter grayscale contrast-125 opacity-40 hover:grayscale-0 hover:contrast-100 hover:opacity-100 transition-all duration-300 ease-in-out cursor-default"
               >
                  <Image 
                     src={getCdnUrl(client.src)} 
                     alt={client.alt}
                     fill
                     className="object-contain"
                     sizes="(max-width: 768px) 96px, 144px"
                     loading="lazy"
                  />
               </div>
            ))}
         </div>
      </div>
    </section>
  );
}