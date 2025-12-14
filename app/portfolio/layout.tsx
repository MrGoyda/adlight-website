import { Metadata } from "next";
import React from "react";

// 1. Метаданные (работают только в Server Components, то есть здесь)
export const metadata: Metadata = {
  title: "Портфолио ADLight | Галерея работ в Астане",
  description: "Примеры выполненных вывесок, лайтбоксов и крышных установок. Более 300 реализованных проектов. Фото и видео работ.",
  openGraph: {
    title: "Портфолио ADLight",
    description: "Посмотрите наши работы по наружной рекламе.",
    type: "website",
  }
};

// 2. Сам компонент Layout (Обязателен!)
export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}