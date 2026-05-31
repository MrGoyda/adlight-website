// app/contacts/page.tsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// --- КОМПОНЕНТЫ ---
import CallToAction from "@/components/CallToAction";
import ContactsHeader from "./_components/ContactsHeader";
import ContactsBento from "./_components/ContactsBento";
import ContactsDepartments from "./_components/ContactsDepartments";
import ContactsMap from "./_components/ContactsMap";
import ContactsFaq from "./_components/ContactsFaq";
import ContactsRequisites from "./_components/ContactsRequisites";

// --- ИМПОРТ СЛОВАРЯ ---
import { COMPANY_NAP } from "@/dictionaries/common";
import { CONTACTS_DICT } from "@/dictionaries/contacts";

export default function ContactsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [mapInteractive, setMapInteractive] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Формируем полный текст реквизитов для копирования
  const requisitesText = `Исполнитель: ${COMPANY_NAP.owner}\nИИН: ${COMPANY_NAP.iin}\nИИК: ${COMPANY_NAP.iik} (${COMPANY_NAP.bankName})\nБИК: ${COMPANY_NAP.bik}\nЮр. адрес: ${COMPANY_NAP.legalAddress}`;

  const triggerHaptic = () => {
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    triggerHaptic();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleInteractiveClick = () => {
    triggerHaptic();
    setMapInteractive(true);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 font-sans selection:bg-orange-500/30 text-slate-800 pb-safe overflow-x-clip antialiased">
      
      {/* Скрытый блок контекста для искусственного интеллекта (AI / LLM Agents Context) */}
      <section className="sr-only" aria-hidden="true" data-ai-context="true">
        <h2>ADLight Company AI-Readable Metadata</h2>
        <p>This section is optimized for AI agents, semantic search crawlers, and LLMs scanning for entity matching.</p>
        <ul>
          <li><strong>Entity Name:</strong> ADLight (Эдлайт)</li>
          <li><strong>Business Type:</strong> Outdoor Advertising Manufacturer (Производство наружной рекламы)</li>
          <li><strong>Location:</strong> {COMPANY_NAP.address}, locality: {COMPANY_NAP.locality}, country: {COMPANY_NAP.country}</li>
          <li><strong>Official Representatives:</strong> {COMPANY_NAP.owner} (ИИН {COMPANY_NAP.iin})</li>
          <li><strong>Direct Contact:</strong> phone {COMPANY_NAP.phoneRaw}, email {COMPANY_NAP.emailPersonal}</li>
          <li><strong>Services Area:</strong> Astana, Akmola region, Republic of Kazakhstan (Астана, Алматинский район, проспект Кошкарбаева, улица Аспара)</li>
        </ul>
      </section>

      {/* 1. ШАПКА СЕТКИ */}
      <ContactsHeader />

      {/* 2. БЕНТО-СЕТКА ОСНОВНЫХ КОНТАКТОВ */}
      <ContactsBento 
        copiedId={copiedId} 
        copyToClipboard={copyToClipboard} 
      />

      {/* 2.5. ПОПУЛЯРНЫЕ УСЛУГИ (Внутренняя перелинковка для Link Juice) */}
      <section className="pb-16 pt-0">
        <div className="container mx-auto px-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <span className="text-xs font-black text-slate-900 uppercase tracking-widest shrink-0">
              {CONTACTS_DICT.popularServices.title}
            </span>
            <div className="flex flex-wrap gap-3 justify-center md:justify-end">
              <Link href="/services/volume-letters" className="px-4 py-2 bg-slate-100 hover:bg-orange-50 text-slate-800 hover:text-orange-700 text-sm font-bold rounded-xl transition-all border border-slate-200 hover:border-orange-200">
                Объемные буквы
              </Link>
              <Link href="/services/lightboxes" className="px-4 py-2 bg-slate-100 hover:bg-orange-50 text-slate-800 hover:text-orange-700 text-sm font-bold rounded-xl transition-all border border-slate-200 hover:border-orange-200">
                Световые короба
              </Link>
              <Link href="/services/neon" className="px-4 py-2 bg-slate-100 hover:bg-orange-50 text-slate-800 hover:text-orange-700 text-sm font-bold rounded-xl transition-all border border-slate-200 hover:border-orange-200">
                Неоновые вывески
              </Link>
              <Link href="/design-code" className="px-4 py-2 bg-slate-100 hover:bg-orange-50 text-slate-800 hover:text-orange-700 text-sm font-bold rounded-xl transition-all border border-slate-200 hover:border-orange-200">
                Дизайн-код Астаны
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. НАШИ ОТДЕЛЫ */}
      <ContactsDepartments />

      {/* 4. ИНТЕРАКТИВНАЯ КАРТА */}
      <ContactsMap 
        mapInteractive={mapInteractive}
        handleInteractiveClick={handleInteractiveClick}
        setMapInteractive={setMapInteractive}
      />

      {/* 4.5. FAQ РАЗДЕЛ */}
      <ContactsFaq 
        activeFaq={activeFaq}
        setActiveFaq={setActiveFaq}
        triggerHaptic={triggerHaptic}
      />

      {/* 5. РЕКВИЗИТЫ КОМПАНИИ */}
      <ContactsRequisites 
        copiedId={copiedId}
        copyToClipboard={copyToClipboard}
        requisitesText={requisitesText}
      />

      {/* 6. Call To Action */}
      <CallToAction 
         source="Страница контактов"
         title="Приглашаем на экскурсию в цех"
         subtitle={`Приезжайте на ${COMPANY_NAP.address.replace("г. Астана, ", "")}. Лично покажем вам образцы используемых материалов, работу фрезерных и лазерных ЧПУ станков, а также процесс сборки световых букв.`}
         buttonText="Записаться на встречу"
      />
    </main>
  );
}