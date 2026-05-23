import React from "react";
import { Metadata } from "next";
import { COMPANY_NAP } from "@/dictionaries/common";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: `Контакты ${COMPANY_NAP.name} | Наружная реклама ${COMPANY_NAP.locality}`,
  description: `Адрес цеха: ${COMPANY_NAP.address}. Телефон: ${COMPANY_NAP.phone}. Пишите нам 24/7 в WhatsApp/Telegram. Реквизиты ${COMPANY_NAP.owner}`,
  canonicalUrl: "https://adlight.kz/contacts",
  keywords: ["контакты ADLight", "адрес цеха астана", "телефон вывески астана", "ИП Гойденко"]
});

export default function ContactsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}