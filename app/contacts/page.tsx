// app/contacts/page.tsx

import { Metadata } from "next";

// --- КОМПОНЕНТЫ ---
import ContactsHeader from "./_components/ContactsHeader";
import ContactsClient from "./_components/ContactsClient";

// --- ИМПОРТ СЛОВАРЯ ---
import { COMPANY_NAP } from "@/dictionaries/common";

export const metadata: Metadata = {
  title: "Контакты ADLight Астана — Телефон, Адрес офиса и цеха вывесок",
  description: "Контакты рекламного агентства ADLight в Астанее. Звоните: +7 (707) 135-67-01. Наш адрес цеха: ул. Аспара, 7. Схема проезда, реквизиты компании и мессенджеры.",
  alternates: {
    canonical: "https://adlight.kz/contacts",
  },
  openGraph: {
    title: "Контакты рекламного агентства ADLight Астана — Офис и Производство вывесок",
    description: "Свяжитесь с нами для заказа наружной рекламы в Астане. Телефон: +7 (707) 135-67-01. Адрес производства: ул. Аспара, 7.",
    url: "https://adlight.kz/contacts",
    siteName: "ADLight",
    images: [
      {
        url: "/images/contacts-og.jpg",
        width: 1200,
        height: 630,
        alt: "Контакты ADLight Астана",
      }
    ],
    locale: "ru_RU",
    type: "website",
  }
};

export default function ContactsPage() {
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

      {/* 2. КЛИЕНТСКАЯ ИНТЕРАКТИВНАЯ ОБЕРТКА */}
      <ContactsClient />

    </main>
  );
}