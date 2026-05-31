import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://adlight.kz'

  return {
    rules: [
      // 1. Правила для всех обычных поисковиков (Google, Yandex)
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',      // Закрываем админку (если будет)
          '/private/',    // Закрываем личные кабинеты
          '/api/',        // Закрываем API роуты (чтобы не тратить краулинговый бюджет)
          // ВАЖНО: /_next/ НЕЛЬЗЯ блокировать! Google рендерит страницы с JS/CSS из _next.
          // Блокировка /_next/ делает сайт «слепым» для Googlebot (не видит стили, шрифты).
        ],
      },
      // 2. Явное приглашение для AI-ботов (GEO-стратегия: разрешить обучающий краулинг)
      {
        userAgent: [
          'GPTBot',            // ChatGPT (OpenAI)
          'OAI-SearchBot',     // OpenAI Search
          'Google-Extended',   // Gemini / Vertex AI (Google)
          'CCBot',             // Common Crawl
          'claudebot',         // Anthropic Claude (актуальное имя)
          'anthropic-ai',      // Anthropic (второй агент)
          'Claude-Web',        // Anthropic (устаревший, оставляем для совместимости)
          'Applebot-Extended', // Apple Intelligence
          'PerplexityBot',     // Perplexity AI
          'YouBot',            // You.com
        ],
        allow: '/',
      },
    ],
    // 3. Карта сайта (обязательно для индексации)
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}