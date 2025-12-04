import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/private/', '/admin/'], // Если есть закрытые разделы
    },
    sitemap: 'https://adlight.kz/sitemap.xml', // Замени на свой реальный домен
  };
}