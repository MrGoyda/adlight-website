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

// Расширенные метаданные для SEO и AI
export const metadata: Metadata = {
  metadataBase: new URL('https://adlight.kz'),
  
  // Заголовок
  title: {
    default: "ADLight | Наружная реклама в Астане: Вывески, Буквы, Лайтбоксы",
    template: "%s | ADLight Астана" // Это будет подставляться на внутренних страницах
  },
  
  // Описание (немного расширил для захвата семантики)
  description: "Закажите изготовление наружной рекламы в Астане. Собственный цех: объемные буквы, лайтбоксы, неон, крышные установки. Дизайн, согласование, монтаж. Гарантия до 3 лет.",
  
  // Ключевые слова (добавил коммерческие запросы)
  keywords: [
    "наружная реклама Астана", 
    "заказать вывеску", 
    "объемные буквы цена", 
    "лайтбоксы производство", 
    "рекламное агентство ADLight",
    "согласование рекламы Астана"
  ],

  // Авторство (важно для E-E-A-T факторов)
  authors: [{ name: "ADLight Team", url: "https://adlight.kz" }],
  creator: "ADLight",
  publisher: "ADLight",
  
  // Категория сайта (помогает классификаторам AI)
  category: "business",

  // Open Graph (для красивых ссылок в WhatsApp/Telegram/Facebook)
  openGraph: {
    title: "ADLight | Яркая реклама для вашего бизнеса",
    description: "Изготовление вывесок любой сложности в Астане. Расчет стоимости за 1 минуту.",
    url: 'https://adlight.kz',
    siteName: 'ADLight - Наружная реклама',
    images: [
      {
        url: '/og-image.webp', // Рекомендую размер 1200x630
        width: 1200,
        height: 630,
        alt: "Примеры работ ADLight",
      },
    ],
    locale: 'ru_RU',
    type: 'website',
  },

  // Управление роботами (КРИТИЧНО ДЛЯ AI)
  robots: {
    index: true,
    follow: true,
    // Специальные настройки для Google и AI-ботов
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,   // Разрешаем любой размер видео-превью
      'max-image-preview': 'large', // Разрешаем большие картинки в выдаче
      'max-snippet': -1,         // Разрешаем длинные описания (не обрезать)
    },
  },

  // Иконки (чтобы в браузере и поиске был логотип)
  icons: {
    icon: '/favicon.ico',
    shortcut: '/icon.png',
    apple: '/apple-icon.png',
  },

  // Канонический URL (защита от дублей)
  alternates: {
    canonical: '/',
  },

  // Верификация
  verification: {
    yandex: "b6b612c60b50394f", 
    google: "ВАШ_КОД_ИЗ_GOOGLE_SEARCH_CONSOLE",
    // Можно добавить и Bing, если планируешь выход на иностранцев в Астане
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