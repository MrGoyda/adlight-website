import { MetadataRoute } from 'next';
import { PROJECTS } from '@/lib/projectsData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://adlight.kz'; // Убедись, что здесь твой реальный домен

  // 1. Статические маршруты (Все страницы, которые ты перечислил)
  const routes = [
    '', // Главная
    '/calculator',
    '/contacts',
    '/design-code',
    '/portfolio',
    '/services',
    
    // Основные услуги
    '/services/entrance-groups',
    '/services/interior',
    '/services/lightboxes',
    '/services/navigation',
    '/services/neon',
    '/services/panel-brackets',
    '/services/pylons',
    '/services/roof-installations',
    '/services/volume-letters',

    // Подуслуги (Виды объемных букв)
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
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    // Главная - 1.0, Разделы услуг - 0.9, Подуслуги - 0.8
    priority: route === '' ? 1 : route.split('/').length > 2 ? 0.8 : 0.9,
  }));

  // 2. Динамические маршруты (Кейсы портфолио)
  const projects = PROJECTS.map((project) => ({
    url: `${baseUrl}/portfolio/${project.slug}`,
    lastModified: new Date(project.date), // Дата публикации проекта
    changeFrequency: 'weekly' as const,   // Проекты могут обновляться
    priority: 0.7,
  }));

  return [...routes, ...projects];
}