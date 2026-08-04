import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { LazyMotion, domAnimation } from "framer-motion";
import Script from "next/script";
import "./globals.css";

// Ваши компоненты
import Header from "@/components/Header"; 
import Footer from "@/components/Footer";

// Компоненты для SEO и Аналитики
import JsonLd from "@/components/JsonLd";
import YandexMetrica from "@/components/YandexMetrica";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import { getCdnUrl } from "@/lib/serverUtils";

// Настройка шрифта
const inter = Inter({ 
  subsets: ["latin", "cyrillic"], 
  display: "swap",
  variable: "--font-inter",
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
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`scroll-smooth ${inter.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* Preconnect & DNS-Prefetch для моментального соединения с CDN */}
        <link rel="preconnect" href="https://media.adlight.kz" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://media.adlight.kz" />
        
        {/* LCP Preload для логотипа */}
        <link
          rel="preload"
          as="image"
          href="/adlight-logo-full.webp"
          // @ts-ignore
          fetchPriority="high"
        />
      </head>
      <body className={`${inter.className} bg-white text-slate-900 antialiased overflow-x-clip`}>
        <AnalyticsTracker />
        
        {/* --- GOOGLE ADS TAG (Вставка) --- */}
        {/* Загрузка библиотеки gtag.js */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17806280695"
          strategy="lazyOnload"
        />
        {/* Инициализация gtag */}
        <Script id="google-ads-init" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'AW-17806280695');
          `}
        </Script>
        {/* --- КОНЕЦ ВСТАВКИ --- */}

        {/* Микроразметка и Аналитика */}
        <JsonLd />
        <YandexMetrica />

        {/* --- MICROSOFT CLARITY --- */}
        <Script id="microsoft-clarity" strategy="lazyOnload">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "x37rwouxm5");
          `}
        </Script>

        {/* --- META PIXEL --- */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '971748072294128');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img 
            height="1" 
            width="1" 
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=971748072294128&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

        <LazyMotion features={domAnimation} strict={false}>
          {/* Глобальный хедер */}
          <Header />

          {/* Контент страницы */}
          {children}

          {/* Глобальный футер */}
          <Footer />
        </LazyMotion>
        
      </body>
    </html>
  );
}