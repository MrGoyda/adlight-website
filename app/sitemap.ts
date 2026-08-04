import { MetadataRoute } from 'next';
import { PROJECTS } from '@/lib/projectsData';
import { SERVICES_DETAILS } from '@/dictionaries/services/service-details';
import { volumeLettersCatalog } from '@/lib/volumeLettersData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://adlight.kz'; // Твой реальный домен

  // 1. Статические страницы (Общие)
  const staticPages = [
    '',           // Главная (Priority 1.0)
    '/contacts',  // Важно для бизнеса (Priority 0.9)
    '/portfolio', // Важно для доверия (Priority 0.9)
    '/services',  // Разводящая (Priority 0.9)
    '/calculator',
    '/design-code',
    '/privacy',
    '/offer',
  ];

  // 2. Основные категории услуг (Высокий приоритет 0.9)
  const mainServices = Array.from(
    new Set([
      '/services/volume-letters',
      ...Object.keys(SERVICES_DETAILS).map((slug) => `/services/${slug}`),
    ])
  );

  // 3. Узкие специализации
  const subServices = volumeLettersCatalog.map(
    (item) => `/services/volume-letters/${item.slug}`
  );

  // Формируем массив статики
  const routes = [
    ...staticPages.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(), // Тут можно оставить new Date(), если сайт пересобирается редко
      changeFrequency: 'monthly' as const,
      priority: route === '' ? 1 : 0.9,
    })),
    ...mainServices.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const, // Услуги обновляются чаще (цены, описание)
      priority: 0.9, // Подняли приоритет!
    })),
    ...subServices.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];

  // 4. Динамические маршруты (Кейсы портфолио)
  // Проверка на случай, если PROJECTS пустой или undefined
  const projectRoutes = (PROJECTS || []).map((project) => ({
    url: `${baseUrl}/portfolio/${project.slug}`,
    // Важно: Если у проекта есть дата, используем её. Если нет — текущую.
    lastModified: project.date ? new Date(project.date) : new Date(),
    changeFrequency: 'monthly' as const, // Кейсы меняются редко после публикации
    priority: 0.7,
  }));

  return [...routes, ...projectRoutes];
}