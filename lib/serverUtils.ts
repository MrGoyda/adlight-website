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