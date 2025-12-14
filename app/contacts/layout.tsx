import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Контакты ADLight | Наружная реклама Астана",
  description: "Адрес цеха: г. Астана, ул. Аспара 7. Телефон: +7 707 135 67 01. Пишите нам 24/7 в WhatsApp/Telegram. Реквизиты ИП Гойденко Е.И.",
  openGraph: {
    title: "Контакты ADLight",
    description: "Свяжитесь с нами для заказа вывески. Мы находимся на ул. Аспара 7.",
    type: "website",
  }
};

export default function ContactsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}