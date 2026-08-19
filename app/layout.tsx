import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";


// Ваши компоненты
import Header from "@/components/Header"; 
import Footer from "@/components/Footer";
import PublicLayoutWrapper from "@/components/PublicLayoutWrapper";

// Компоненты для SEO и Аналитики
import JsonLd from "@/components/JsonLd";
import YandexMetrica from "@/components/YandexMetrica";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import PageViewTracker from "@/components/PageViewTracker";
import { getCdnUrl } from "@/lib/serverUtils";

// Настройка шрифта
const inter = Inter({ 
  subsets: ["latin", "cyrillic"], 
  display: "swap",
  variable: "--font-inter",
  preload: true,
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
});

// Расширенные метаданные
export const metadata: Metadata = {
  metadataBase: new URL('https://adlight.kz'),
  
  title: {
    default: "ADLight | Наружная реклама в Астане: Вывески, Буквы, Лайтбоксы",
    template: "%s | ADLight Астана"
  },
  
  description: "Закажите изготовление наружной рекламы в Астане. Собственный цех: объемные буквы, лайтбоксы, неон, крышные установки. Дизайн, согласование, монтаж. Гарантия до 3 лет.",
  
  keywords: [
    "наружная реклама Астана", 
    "заказать вывеску", 
    "объемные буквы цена", 
    "лайтбоксы производство", 
    "рекламное агентство ADLight",
    "согласование рекламы Астана"
  ],


  authors: [{ name: "ADLight Team", url: "https://adlight.kz" }],
  creator: "ADLight",
  publisher: "ADLight",
  category: "business",

  openGraph: {
    title: "ADLight | Яркая реклама для вашего бизнеса",
    description: "Изготовление вывесок любой сложности в Астане. Расчет стоимости за 1 минуту.",
    url: 'https://adlight.kz',
    siteName: 'ADLight - Наружная реклама',
    images: [
      {
        url: '/og-image.webp',
        width: 1200,
        height: 630,
        alt: "Примеры работ ADLight",
      },
    ],
    locale: 'ru_RU',
    type: 'website',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/icon.png",
    apple: "/apple-icon.png",
  },

  alternates: {
    canonical: '/',
  },

  verification: {
    yandex: "b6b612c60b50394f", 
    // google: "ВАШ_КОД_ИЗ_GOOGLE_SEARCH_CONSOLE", // Если есть код подтверждения домена, раскомментируйте
  },
};

// Viewport — отдельный экспорт (Next.js 15 требование).
// viewport-fit=cover обязателен для env(safe-area-inset-*) на iOS Safari.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Preconnect & DNS-Prefetch для моментального соединения с CDN (без crossOrigin для совпадения с non-cors img) */}
        <link rel="preconnect" href="https://media.adlight.kz" />
        <link rel="dns-prefetch" href="https://media.adlight.kz" />
        
        {/* LCP Preload для логотипа */}
        <link
          rel="preload"
          as="image"
          href="/adlight-logo-full.webp"
          // @ts-ignore
          fetchPriority="high"
        />
        {/* Google/Meta теги убраны — трекинг идёт через /api/track (SST) */}
        {/* --- GOOGLE TAG (GA4 + GOOGLE ADS) --- */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-8HHR00E9DN"
          strategy="lazyOnload"
        />
        <Script id="google-ga4-init" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-8HHR00E9DN');
            gtag('config', 'AW-17806280695');
          `}
        </Script>
      </head>
      <body className={`${inter.className} bg-white text-slate-900 antialiased`} suppressHydrationWarning>
        <AnalyticsTracker />
        <PageViewTracker />

        {/* Микроразметка и Аналитика */}
        <JsonLd />
        <YandexMetrica />

        {/* --- MICROSOFT CLARITY --- */}
        <Script id="microsoft-clarity" strategy="lazyOnload">
          {`
            setTimeout(function() {
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "x37rwouxm5");
            }, 5000); // 5-second delay to prioritize page render and UI interactivity
          `}
        </Script>

        {/* Meta Pixel убран — события идут через CAPI в /api/track (SST) */}

        <PublicLayoutWrapper>
          {children}
        </PublicLayoutWrapper>
        
      </body>
    </html>
  );
}