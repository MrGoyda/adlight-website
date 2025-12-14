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
          '/_next/',      // Системные папки Next.js
        ],
      },
      // 2. Явное приглашение для AI-ботов (GPT, Gemini и др.)
      // Многие сайты их блокируют, но тебе для GEO это нужно разрешить!
      {
        userAgent: [
          'GPTBot',           // ChatGPT (OpenAI)
          'Google-Extended',  // Gemini / Vertex AI (Google)
          'CCBot',            // Common Crawl (база для обучения большинства нейросетей)
          'Claude-Web',       // Anthropic (Claude)
          'Applebot-Extended' // Apple Intelligence
        ],
        allow: '/',
      },
    ],
    // 3. Указание, где лежит карта сайта (обязательно!)
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}