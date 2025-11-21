import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
        {/* ХЕДЕР (Шапка) */}
        <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-900/95 backdrop-blur">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="font-bold text-2xl text-white tracking-wider">ADLight</div>
            
            <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-300">
              <a href="#" className="hover:text-orange-500 transition">Услуги</a>
              <a href="#" className="hover:text-orange-500 transition">Портфолио</a>
              <a href="#" className="hover:text-orange-500 transition">Контакты</a>
            </nav>

            <div className="flex items-center gap-4">
               <a href="tel:+77071356701" className="hidden lg:block font-bold text-white hover:text-orange-500 transition">+7 (707) 135-67-01</a>
               <button className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded transition">
                 Рассчитать
               </button>
            </div>
          </div>
        </header>

        {/* ОСНОВНОЙ КОНТЕНТ */}
        <main>{children}</main>

        {/* ФУТЕР */}
        <footer className="border-t border-slate-800 py-8 mt-auto bg-slate-950 text-center text-gray-500 text-sm">
           <div className="container mx-auto px-4">
             <p>© 2025 ADLight. Астана, ул. Акжол 110.</p>
           </div>
        </footer>
      </body>
    </html>
  );
}