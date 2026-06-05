import { Metadata } from "next";
import React from "react";
import { SITE_CONTACTS } from "@/config/site";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: `Калькулятор вывески ${SITE_CONTACTS.locality} — Расчёт цены онлайн за 1 минуту`,
  description: `Бесплатный онлайн-калькулятор стоимости вывесок в ${SITE_CONTACTS.locality}. Объёмные буквы от 550 ₸/см, лайтбоксы от 80 000 ₸/м², неон от 8 000 ₸/пог.м. Результат мгновенно — замер и макет бесплатно.`,
  canonicalUrl: "https://adlight.kz/calculator",
  image: "/images/pages/services-lightboxes.webp",
  keywords: [
    "калькулятор вывески астана",
    "сколько стоит вывеска астана",
    "цена объемных букв астана",
    "рассчитать стоимость лайтбокса",
    "онлайн расчет наружной рекламы",
    "калькулятор стоимости рекламы",
    "цена неоновой вывески астана",
  ],
});

export default function CalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}