import manifest from './media-manifest.json';

export function getImagesFromFolder(slug: string): string[] {
  // 1. Проверяем среди категорий (например: "face-lit", "volume-letters/face-lit", "lightboxes")
  if (manifest.categories[slug as keyof typeof manifest.categories]) {
    return manifest.categories[slug as keyof typeof manifest.categories];
  }

  // Пробуем варианты с префиксом volume-letters/
  const volumeKey = `volume-letters/${slug}`;
  if (manifest.categories[volumeKey as keyof typeof manifest.categories]) {
    return manifest.categories[volumeKey as keyof typeof manifest.categories];
  }

  // Поиск совпадений по вложенным категориям
  for (const [key, urls] of Object.entries(manifest.categories)) {
    if (key.endsWith(`/${slug}`) || key === slug) {
      return urls as string[];
    }
  }

  // 2. Проверяем среди проектов портфолио
  if (manifest.projects[slug as keyof typeof manifest.projects]) {
    return manifest.projects[slug as keyof typeof manifest.projects];
  }

  // 3. Фолбэк поиска по путям файлов
  const matchedFiles: string[] = [];
  for (const [localPath, cdnUrl] of Object.entries(manifest.files)) {
    if (localPath.includes(`/${slug}/`) || localPath.startsWith(`${slug}/`)) {
      matchedFiles.push(cdnUrl);
    }
  }

  if (matchedFiles.length > 0) {
    return matchedFiles;
  }

  console.warn(`⚠️ [ServerUtils] Файлы не найдены в манифесте для слага: "${slug}"`);
  return [];
}

/**
 * Преобразует статический путь (например "/images/pages/dk_approved.png") 
 * в прямую ссылку на Cloudflare R2 CDN ("https://media.adlight.kz/static/pages/dk_approved.png")
 */
export function getCdnUrl(imagePath: string): string {
  if (!imagePath) return '';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;

  // Очищаем ведущий слеш и 'images/' префикс
  let cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  if (cleanPath.startsWith('images/')) {
    cleanPath = cleanPath.replace('images/', '');
  }

  // Проверяем точное совпадение в манифесте
  if (manifest.files[cleanPath as keyof typeof manifest.files]) {
    return manifest.files[cleanPath as keyof typeof manifest.files];
  }

  // Логика подмены по префиксам
  const CDN_BASE = manifest.cdnBaseUrl || 'https://media.adlight.kz';

  if (cleanPath.startsWith('letters-galery/')) {
    return `${CDN_BASE}/portfolio/categories/volume-letters/${cleanPath.replace('letters-galery/', '')}`;
  }
  if (cleanPath.startsWith('portfolio/')) {
    return `${CDN_BASE}/portfolio/projects/${cleanPath.replace('portfolio/', '')}`;
  }
  if (cleanPath.startsWith('pages/')) {
    return `${CDN_BASE}/static/pages/${cleanPath.replace('pages/', '')}`;
  }
  if (cleanPath.startsWith('calc/')) {
    return `${CDN_BASE}/static/calc/${cleanPath.replace('calc/', '')}`;
  }
  if (cleanPath.startsWith('clients/')) {
    return `${CDN_BASE}/static/clients/${cleanPath.replace('clients/', '')}`;
  }
  if (cleanPath.startsWith('icons/')) {
    return `${CDN_BASE}/static/icons/${cleanPath.replace('icons/', '')}`;
  }

  return `${CDN_BASE}/static/general/${cleanPath}`;
}