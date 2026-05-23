import { Metadata } from "next";
import React from "react";
import { COMPANY_NAP } from "@/dictionaries/common";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: `Портфолио ${COMPANY_NAP.name} | Галерея работ в ${COMPANY_NAP.locality}`,
  description: `Примеры выполненных вывесок, лайтбоксов и крышных установок от ${COMPANY_NAP.name}. Более 300 реализованных проектов в г. ${COMPANY_NAP.locality}. Фото и видео работ.`,
  canonicalUrl: "https://adlight.kz/portfolio",
  keywords: ["портфолио вывесок", "примеры вывесок астана", "фото вывесок", "наши работы ADLight"]
});

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