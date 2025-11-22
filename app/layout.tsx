import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/Header"; // <-- Импортируем наш новый компонент
import Footer from "../components/Footer";
import AOSInit from "../components/AOSInit";

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
    <html lang="ru" className="dark">
      <body className={`${inter.className} bg-slate-900 text-gray-100 antialiased`}>
        <AOSInit /> {/* <-- ИНИЦИАЛИЗАЦИЯ AOS */}
        
        {/* Вставляем умный хедер сюда */}
        <Header />

        <main>{children}</main>

        <Footer />
      </body>
    </html>
  );
}