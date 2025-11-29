import fs from 'fs';
import path from 'path';

export function getImagesFromFolder(folderSlug: string): string[] {
  try {
    // Путь к папке в проекте: public/images/letters-galery/[folderSlug]
    const directoryPath = path.join(process.cwd(), 'public', 'images', 'letters-galery', folderSlug);

    // Читаем содержимое папки
    const files = fs.readdirSync(directoryPath);

    // Фильтруем только картинки (jpg, png, webp) и создаем правильные пути
    const images = files
      .filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file))
      .map((file) => `/images/letters-galery/${folderSlug}/${file}`);

    return images;
  } catch (err) {
    console.warn(`⚠️ Папка не найдена или пуста: ${folderSlug}`);
    return [];
  }
}