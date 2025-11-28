import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// Используем алиас @/ если он настроен, или относительные пути, как у вас
import Header from "@/components/Header"; 
import Footer from "@/components/Footer";
import AOSInit from "@/components/AOSInit";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "ADLight | Наружная реклама в Астане",
  description: "Изготовление вывесок, объемных букв и лайтбоксов.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // ДОБАВЛЕНО: scroll-smooth для плавности + data-атрибут для Next.js
    <html lang="ru" className="dark scroll-smooth" data-scroll-behavior="smooth">
      <body className={`${inter.className} bg-slate-900 text-gray-100 antialiased overflow-x-clip`}>
        
        <AOSInit /> {/* Инициализация анимаций */}
        
        {/* Глобальный хедер (будет на всех страницах) */}
        <Header />

        {/* Контент страницы (без лишнего <main>, так как он есть внутри страниц) */}
        {children}

        <Footer />
        
      </body>
    </html>
  );
}