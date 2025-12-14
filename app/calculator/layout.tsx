import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Калькулятор вывески Астана | Рассчитать стоимость онлайн",
  description: "Онлайн калькулятор наружной рекламы. Узнайте цену объемных букв, лайтбоксов и неона за 1 минуту. Точный расчет стоимости изготовления в Астане.",
  keywords: ["калькулятор вывески", "расчет стоимости наружной рекламы", "цена объемных букв астана", "сколько стоит вывеска", "онлайн расчет лайтбокса"],
  openGraph: {
    title: "Калькулятор вывески | Узнайте цену за 1 минуту",
    description: "Бесплатный расчет стоимости изготовления. Любые размеры и материалы.",
    images: ["/images/calc/lightbox-1.jpg"], // Картинка для превью в соцсетях
    type: "website",
  }
};

export default function CalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}