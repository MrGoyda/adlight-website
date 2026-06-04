// app/contacts/_components/ContactsBento.tsx

import { Phone, MessageCircle, Clock, Mail, Check, Copy } from "lucide-react";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/ui/FadeIn";
import { COMPANY_NAP } from "@/dictionaries/common";
import { CONTACTS_DICT } from "@/dictionaries/contacts";

interface ContactsBentoProps {
  copiedId: string | null;
  copyToClipboard: (text: string, id: string) => void;
}

export default function ContactsBento({ copiedId, copyToClipboard }: ContactsBentoProps) {
  const dict = CONTACTS_DICT.bento;

  return (
     <section className="py-16">
        <div className="container mx-auto px-4">
           <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* ТЕЛЕФОН */}
              <FadeIn direction="up" delay={0.1} className="h-full" as="li">
                <address className="not-italic bg-white p-8 rounded-3xl border border-slate-200 hover:border-orange-500/50 hover:shadow-[0_15px_40px_rgba(249,115,22,0.04)] transition-all duration-300 group flex flex-col justify-between h-64 shadow-sm relative overflow-hidden">
                   <div className="flex justify-between items-start">
                      <span className="text-xs font-black text-slate-900 uppercase tracking-widest">{dict.sales.label}</span>
                   </div>
                   <div className="flex flex-col justify-end mt-auto">
                      <a 
                        href={`tel:${COMPANY_NAP.phoneRaw}`} 
                        className="text-3xl font-black text-slate-950 hover:text-orange-600 transition-colors block mb-6 tracking-tight leading-none"
                        itemProp="telephone"
                      >
                        {COMPANY_NAP.phone}
                      </a>
                      
                      <Button 
                        href={`tel:${COMPANY_NAP.phoneRaw}`} 
                        variant="lightOutline" 
                        className="w-full text-sm font-black py-3.5 border-slate-300 hover:border-slate-400 text-slate-950 bg-slate-50 hover:bg-slate-100"
                        title={dict.sales.label}
                      >
                         {dict.sales.buttonText}
                      </Button>
                   </div>
                </address>
              </FadeIn>

              {/* МЕССЕНДЖЕРЫ */}
              <FadeIn direction="up" delay={0.2} className="h-full" as="li">
                <div className="bg-white p-8 rounded-3xl border border-slate-200 hover:border-blue-500/50 hover:shadow-[0_15px_40px_rgba(59,130,246,0.04)] transition-all duration-300 group flex flex-col justify-between h-64 shadow-sm relative overflow-hidden">
                   <div className="flex justify-between items-start">
                      <span className="text-xs font-black text-slate-900 uppercase tracking-widest">{dict.messengers.label}</span>
                   </div>
                   <div className="flex flex-col justify-end mt-auto">
                      <p className="text-slate-950 font-black text-base mb-6 leading-tight">{dict.messengers.subtitle}</p>
                      <div className="flex gap-3">
                         <Button 
                           href={COMPANY_NAP.socials.whatsapp} 
                           target="_blank" 
                           variant="lightGlass"
                           className="flex-1 text-xs font-black py-3.5 bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border-emerald-300 hover:border-emerald-400"
                           title={dict.messengers.whatsapp}
                         >
                            {dict.messengers.whatsapp}
                         </Button>
                         <Button 
                           href={COMPANY_NAP.socials.telegram} 
                           target="_blank" 
                           variant="lightGlass"
                           className="flex-1 text-xs font-black py-3.5 bg-blue-50 text-blue-900 hover:bg-blue-100 border-blue-300 hover:border-blue-400"
                           title={dict.messengers.telegram}
                         >
                            {dict.messengers.telegram}
                         </Button>
                      </div>
                   </div>
                </div>
              </FadeIn>

              {/* ГРАФИК РАБОТЫ */}
              <FadeIn direction="up" delay={0.3} className="h-full" as="li">
                <div 
                  className="bg-white p-8 rounded-3xl border border-slate-200 hover:border-purple-500/50 hover:shadow-[0_15px_40px_rgba(168,85,247,0.04)] transition-all duration-300 group flex flex-col justify-between h-64 shadow-sm relative overflow-hidden"
                >
                   <div className="flex justify-between items-start">
                      <span className="text-xs font-black text-slate-900 uppercase tracking-widest">{dict.schedule.label}</span>
                   </div>
                   <div className="flex flex-col justify-end mt-auto">
                      <div className="space-y-2 text-sm font-black text-slate-950">
                         <div className="flex justify-between border-b border-slate-200 pb-1.5" itemProp="openingHoursSpecification" itemScope itemType="https://schema.org/OpeningHoursSpecification">
                            <meta itemProp="dayOfWeek" content="Monday" />
                            <meta itemProp="dayOfWeek" content="Tuesday" />
                            <meta itemProp="dayOfWeek" content="Wednesday" />
                            <meta itemProp="dayOfWeek" content="Thursday" />
                            <meta itemProp="dayOfWeek" content="Friday" />
                            <meta itemProp="opens" content="09:00" />
                            <meta itemProp="closes" content="18:00" />
                            <span>{dict.schedule.weekdays}</span>
                            <span className="text-slate-950 font-black">09:00 - 18:00</span>
                         </div>
                         <div className="flex justify-between border-b border-slate-200 pb-1.5" itemProp="openingHoursSpecification" itemScope itemType="https://schema.org/OpeningHoursSpecification">
                            <meta itemProp="dayOfWeek" content="Saturday" />
                            <meta itemProp="opens" content="09:00" />
                            <meta itemProp="closes" content="14:00" />
                            <span>{dict.schedule.saturday}</span>
                            <span className="text-slate-950 font-black">09:00 - 14:00</span>
                         </div>
                         <div className="flex justify-between text-slate-900">
                            <span>{dict.schedule.sunday}</span>
                            <span className="text-slate-900 font-bold">{dict.schedule.sundayOff}</span>
                         </div>
                      </div>
                   </div>
                </div>
              </FadeIn>

              {/* ПОЧТА */}
              <FadeIn direction="up" delay={0.4} className="h-full" as="li">
                <address className="not-italic bg-white p-8 rounded-3xl border border-slate-200 hover:border-pink-500/50 hover:shadow-[0_15px_40px_rgba(236,72,153,0.04)] transition-all duration-300 group flex flex-col justify-between h-64 shadow-sm relative overflow-hidden">
                   <div className="flex justify-between items-start">
                      <span className="text-xs font-black text-slate-900 uppercase tracking-widest">{dict.email.label}</span>
                   </div>
                   <div className="flex flex-col justify-end mt-auto">
                      <a 
                        href={`mailto:${COMPANY_NAP.emailPersonal}`} 
                        className="text-xl font-black text-slate-950 hover:text-pink-600 transition-colors block mb-6 break-all tracking-tight leading-none"
                        itemProp="email"
                      >
                        {COMPANY_NAP.emailPersonal}
                      </a>
                      
                      <Button 
                         onClick={() => copyToClipboard(COMPANY_NAP.emailPersonal, 'email')} 
                         variant="lightOutline"
                         className="w-full text-sm font-black py-3.5 border-slate-300 hover:border-slate-400 text-slate-955 bg-slate-50 hover:bg-slate-100"
                         leftIcon={copiedId === 'email' ? <Check className="w-4 h-4 text-emerald-700"/> : <Copy className="w-4 h-4 text-slate-800"/>}
                      >
                         {copiedId === 'email' ? dict.email.copiedSuccess : dict.email.copyPrompt}
                      </Button>
                   </div>
                </address>
              </FadeIn>

           </ul>
        </div>
     </section>
  );
}
