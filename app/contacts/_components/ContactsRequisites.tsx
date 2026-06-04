// app/contacts/_components/ContactsRequisites.tsx

import { Building2, CreditCard, Check, Copy } from "lucide-react";
import Button from "@/components/ui/Button";
import { COMPANY_NAP } from "@/dictionaries/common";
import { CONTACTS_DICT } from "@/dictionaries/contacts";

interface ContactsRequisitesProps {
  copiedId: string | null;
  copyToClipboard: (text: string, id: string) => void;
  requisitesText: string;
}

export default function ContactsRequisites({
  copiedId,
  copyToClipboard,
  requisitesText
}: ContactsRequisitesProps) {
  const dict = CONTACTS_DICT.requisites;

  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
       <div className="container mx-auto px-4">
          <aside className="max-w-4xl mx-auto bg-white border border-slate-250/60 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row justify-between items-start gap-8 shadow-sm">
             <div className="flex-1 w-full">
                <h3 className="text-xl font-black text-slate-900 tracking-tight mb-6 flex items-center gap-2.5">
                   <Building2 className="w-5 h-5 text-slate-400"/> {dict.title}
                </h3>
                <dl className="grid md:grid-cols-2 gap-y-3.5 gap-x-8 text-sm font-semibold w-full">
                   <div className="col-span-2 text-slate-900 font-extrabold pb-2 text-base border-b border-slate-100 flex flex-wrap gap-2">
                     <dt className="text-slate-400 font-medium">{dict.ownerLabel}</dt>
                     <dd className="text-slate-900 font-extrabold">{COMPANY_NAP.owner}</dd>
                   </div>
                   
                   <div className="flex justify-between md:contents">
                     <dt className="text-slate-400 font-medium">{dict.iinLabel}</dt> 
                     <dd className="text-slate-850 font-mono font-black select-all text-right md:text-left">{COMPANY_NAP.iin}</dd>
                   </div>
                   
                   <div className="flex justify-between md:contents">
                     <dt className="text-slate-400 font-medium">{dict.phoneLabel}</dt> 
                     <dd className="text-slate-850 font-black text-right md:text-left">{COMPANY_NAP.phone}</dd>
                   </div>
                   
                   <div className="col-span-2 pt-4 text-slate-900 font-extrabold flex items-center gap-2 border-b border-slate-100 pb-1">
                      <CreditCard className="w-4 h-4 text-emerald-500"/>
                      <span>{COMPANY_NAP.bankName}</span>
                   </div>
                   <div className="flex justify-between md:contents">
                     <dt className="text-slate-400 font-medium">{dict.iikLabel}</dt> 
                     <dd className="text-slate-850 font-mono font-black select-all break-all text-right md:text-left">{COMPANY_NAP.iik}</dd>
                   </div>
                   <div className="flex justify-between md:contents">
                     <dt className="text-slate-400 font-medium">{dict.bikLabel}</dt> 
                     <dd className="text-slate-850 font-mono font-black select-all text-right md:text-left">{COMPANY_NAP.bik}</dd>
                   </div>
                   <div className="col-span-2 pt-4 border-t border-slate-100 mt-2">
                      <dt className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{dict.legalAddressLabel}</dt>
                      <dd className="text-slate-750 leading-relaxed font-semibold">{COMPANY_NAP.legalAddress}</dd>
                   </div>
                </dl>
             </div>
             
             <Button 
                onClick={() => copyToClipboard(requisitesText, 'requisites')}
                variant={copiedId === 'requisites' ? 'solid' : 'secondary'}
                className={`shrink-0 px-6 py-4 rounded-xl flex items-center gap-2 font-extrabold w-full md:w-auto justify-center transition-all ${copiedId === 'requisites' ? 'bg-gradient-to-r from-emerald-600 to-teal-600' : ''}`}
                leftIcon={copiedId === 'requisites' ? <Check className="w-4 h-4"/> : <Copy className="w-4 h-4"/>}
             >
                {copiedId === 'requisites' ? dict.copiedText : dict.copyText}
             </Button>
          </aside>
       </div>
    </section>
  );
}
