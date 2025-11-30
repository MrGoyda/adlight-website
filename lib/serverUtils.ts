import fs from 'fs';
import path from 'path';

export function getImagesFromFolder(slug: string): string[] {
  // Определяем возможные пути, где могут лежать картинки
  const possiblePaths = [
    // 1. Сначала ищем в специфичной папке галерей букв
    path.join(process.cwd(), 'public', 'images', 'letters-galery', slug),
    // 2. Если нет, ищем в корне images (для лайтбоксов и прочего)
    path.join(process.cwd(), 'public', 'images', slug),
    // 3. На случай, если папка называется иначе, пробуем искать просто по слагу в public
    path.join(process.cwd(), 'public', slug)
  ];

  for (const dirPath of possiblePaths) {
    try {
      // Проверяем, существует ли папка
      if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath);
        
        const images = files
          .filter(file => /\.(jpg|jpeg|png|webp|avif)$/i.test(file))
          .map(file => {
            // Важно: возвращаем путь относительно public для браузера
            // Получаем часть пути после 'public'
            const relativePath = dirPath.split('public')[1];
            // Нормализуем слеши для Windows/Linux
            return path.join(relativePath, file).replace(/\\/g, '/');
          });

        if (images.length > 0) {
          // console.log(`[ServerUtils] Found ${images.length} images in ${dirPath}`);
          return images;
        }
      }
    } catch (error) {
      console.error(`Ошибка при чтении папки ${dirPath}:`, error);
    }
  }

  // Если нигде не нашли
  console.warn(`⚠️ [ServerUtils] Папка не найдена или пуста для слага: "${slug}". Проверены пути:`, possiblePaths);
  return [];
}