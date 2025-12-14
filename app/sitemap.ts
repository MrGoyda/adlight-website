import { MetadataRoute } from 'next';
import { PROJECTS } from '@/lib/projectsData';

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
  ];

  // 2. Основные категории услуг (Высокий приоритет 0.9 - это твой хлеб)
  const mainServices = [
    '/services/entrance-groups',
    '/services/interior',
    '/services/lightboxes',
    '/services/navigation',
    '/services/neon',
    '/services/panel-brackets',
    '/services/pylons',
    '/services/roof-installations',
    '/services/volume-letters',
  ];

  // 3. Узкие специализации (Приоритет 0.8 - "Long tail" запросы)
  // AI очень любят эти страницы за конкретику
  const subServices = [
    '/services/volume-letters/acrylic-slim',
    '/services/volume-letters/back-lit',
    '/services/volume-letters/combo-lit',
    '/services/volume-letters/day-night-effect',
    '/services/volume-letters/face-lit',
    '/services/volume-letters/full-lit',
    '/services/volume-letters/loft-lamps',
    '/services/volume-letters/non-lit',
    '/services/volume-letters/perforated',
    '/services/volume-letters/pixel-led',
    '/services/volume-letters/side-lit',
    '/services/volume-letters/wood-style',
  ];

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