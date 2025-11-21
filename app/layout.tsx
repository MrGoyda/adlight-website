import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/Header"; // <-- Импортируем наш новый компонент

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
        
        {/* Вставляем умный хедер сюда */}
        <Header />

        <main>{children}</main>

        <footer className="border-t border-slate-800 py-8 mt-auto bg-slate-950 text-center text-gray-500 text-sm">
           <div className="container mx-auto px-4">
             <p>© 2025 ADLight. Астана, ул. Акжол 110.</p>
           </div>
        </footer>
      </body>
    </html>
  );
}