import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Ваши компоненты
import Header from "@/components/Header"; 
import Footer from "@/components/Footer";
import AOSInit from "@/components/AOSInit";

// Компоненты для SEO и Аналитики
import JsonLd from "@/components/JsonLd";
import YandexMetrica from "@/components/YandexMetrica";

// Настройка шрифта (добавил переменную для Tailwind и display: swap)
const inter = Inter({ 
  subsets: ["latin", "cyrillic"], 
  display: "swap",
  variable: "--font-inter",
});

// Расширенные метаданные для SEO
export const metadata: Metadata = {
  metadataBase: new URL('https://adlight.kz'),
  title: {
    default: "ADLight | Изготовление наружной рекламы в Астане",
    template: "%s | ADLight Астана"
  },
  description: "Производство объемных букв, лайтбоксов, неоновых вывесок и крышных установок. Собственный цех в Астане. Гарантия до 3 лет.",
  keywords: ["наружная реклама Астана", "вывески Астана", "объемные буквы", "лайтбоксы", "рекламное агентство"],
  openGraph: {
    title: "ADLight | Яркая реклама для бизнеса",
    description: "Изготовление вывесок любой сложности. Расчет стоимости за 1 минуту.",
    url: 'https://adlight.kz',
    siteName: 'ADLight',
    images: [
      {
        url: '/og-image.jpg', // Убедитесь, что файл есть в папке public
        width: 1200,
        height: 630,
      },
    ],
    locale: 'ru_RU',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  // Верификация (заполните своими кодами)
  verification: {
    yandex: "ВАШ_КОД_ИЗ_ЯНДЕКС_ВЕБМАСТЕРА", 
    google: "ВАШ_КОД_ИЗ_GOOGLE_SEARCH_CONSOLE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`dark scroll-smooth ${inter.variable}`} data-scroll-behavior="smooth">
      <body className={`${inter.className} bg-slate-900 text-gray-100 antialiased overflow-x-clip`}>
        
        {/* Микроразметка и Аналитика (невидимые блоки) */}
        <JsonLd />
        <YandexMetrica />

        {/* Инициализация анимаций */}
        <AOSInit />
        
        {/* Глобальный хедер */}
        <Header />

        {/* Контент страницы */}
        {children}

        {/* Глобальный футер */}
        <Footer />
        
      </body>
    </html>
  );
}