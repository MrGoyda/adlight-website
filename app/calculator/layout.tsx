import { Metadata } from "next";
import React from "react";
import { COMPANY_NAP } from "@/dictionaries/common";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: `Калькулятор вывески ${COMPANY_NAP.locality} | Рассчитать стоимость онлайн`,
  description: `Онлайн калькулятор наружной рекламы от ${COMPANY_NAP.name}. Узнайте цену объемных букв, лайтбоксов и неона за 1 минуту. Точный расчет стоимости изготовления в г. ${COMPANY_NAP.locality}.`,
  canonicalUrl: "https://adlight.kz/calculator",
  image: "/images/calc/lightbox-1.jpg",
  keywords: ["калькулятор вывески", "расчет стоимости наружной рекламы", "цена объемных букв астана", "сколько стоит вывеска", "онлайн расчет лайтбокса"]
});

export default function CalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}