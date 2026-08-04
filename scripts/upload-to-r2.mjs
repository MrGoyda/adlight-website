import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Загружаем .env.local
dotenv.config({ path: '.env.local' });

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME || 'adlight';
const publicCdnUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || 'https://media.adlight.kz';

if (!accountId || !accessKeyId || !secretAccessKey) {
  console.error('❌ Ошибка: В .env.local не заданы переменные R2 (CLOUDFLARE_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY)');
  process.exit(1);
}

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

const PUBLIC_IMAGES_DIR = path.join(process.cwd(), 'public', 'images');
const MANIFEST_PATH = path.join(process.cwd(), 'lib', 'media-manifest.json');

// Карта определения MIME-типов
function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.webp': return 'image/webp';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.png': return 'image/png';
    case '.gif': return 'image/gif';
    case '.svg': return 'image/svg+xml';
    case '.avif': return 'image/avif';
    case '.txt': return 'text/plain';
    default: return 'application/octet-stream';
  }
}

// Преобразование локального относительного пути public/images/... в целевой ключ R2
function getR2Key(relativePath) {
  // Нормализуем слеши
  const normalized = relativePath.replace(/\\/g, '/');

  // 1. Буквы-галереи
  if (normalized.startsWith('letters-galery/')) {
    const subPath = normalized.replace('letters-galery/', '');
    return `portfolio/categories/volume-letters/${subPath}`;
  }

  // 2. Детальные проекты портфолио
  if (normalized.startsWith('portfolio/')) {
    const subPath = normalized.replace('portfolio/', '');
    return `portfolio/projects/${subPath}`;
  }

  // 3. Другие категории вывесок
  const categoryFolders = [
    'lightboxes', 'neon', 'panel-brackets', 'roof-installations',
    'pylons', 'entrance-groups', 'facade-decoration', 'interior',
    'navigation', 'branding-cars', 'window-branding', 'led-screens',
    'architectural-lighting', 'banners-plates', 'exhibition-stands',
    'signboard-repair'
  ];

  for (const cat of categoryFolders) {
    if (normalized.startsWith(`${cat}/`)) {
      const subPath = normalized.replace(`${cat}/`, '');
      return `portfolio/categories/${cat}/${subPath}`;
    }
  }

  // 4. Элементы интерфейса и сайта (pages, calc, clients, icons и файлы корня images)
  if (normalized.startsWith('pages/')) {
    return `static/pages/${normalized.replace('pages/', '')}`;
  }
  if (normalized.startsWith('calc/')) {
    return `static/calc/${normalized.replace('calc/', '')}`;
  }
  if (normalized.startsWith('clients/')) {
    return `static/clients/${normalized.replace('clients/', '')}`;
  }
  if (normalized.startsWith('icons/')) {
    return `static/icons/${normalized.replace('icons/', '')}`;
  }

  // Дефолтно в static/
  return `static/general/${normalized}`;
}

// Рекурсивный сбор всех файлов в директории
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

async function uploadFiles() {
  console.log('🚀 Начинаем сканирование папки public/images...');

  if (!fs.existsSync(PUBLIC_IMAGES_DIR)) {
    console.error('❌ Ошибка: Папка public/images не найдена.');
    process.exit(1);
  }

  const allFiles = getAllFiles(PUBLIC_IMAGES_DIR);
  console.log(`📸 Найдено ${allFiles.length} файлов для загрузки в Cloudflare R2.\n`);

  const manifest = {
    generatedAt: new Date().toISOString(),
    cdnBaseUrl: publicCdnUrl,
    categories: {}, // e.g. "volume-letters/face-lit": ["url1", "url2"]
    projects: {},   // e.g. "arustone": ["url1", "url2"]
    files: {},      // e.g. "relativeLocalPath": "cdnUrl"
  };

  let uploadedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const filePath of allFiles) {
    const relativePath = path.relative(PUBLIC_IMAGES_DIR, filePath);
    const r2Key = getR2Key(relativePath);
    const contentType = getContentType(filePath);
    const fileBuffer = fs.readFileSync(filePath);
    const cdnUrl = `${publicCdnUrl}/${r2Key}`;

    // Сохраняем в общем реестре
    manifest.files[relativePath.replace(/\\/g, '/')] = cdnUrl;

    // Формируем структурированные записи для категорий
    if (r2Key.startsWith('portfolio/categories/')) {
      const catKey = r2Key.replace('portfolio/categories/', '').split('/').slice(0, -1).join('/');
      if (!manifest.categories[catKey]) manifest.categories[catKey] = [];
      manifest.categories[catKey].push(cdnUrl);
    } else if (r2Key.startsWith('portfolio/projects/')) {
      const projKey = r2Key.replace('portfolio/projects/', '').split('/')[0];
      if (!manifest.projects[projKey]) manifest.projects[projKey] = [];
      manifest.projects[projKey].push(cdnUrl);
    }

    try {
      console.log(`[${uploadedCount + 1}/${allFiles.length}] Загрузка: ${relativePath} ➔ R2: ${r2Key}`);

      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: r2Key,
        Body: fileBuffer,
        ContentType: contentType,
        ContentDisposition: 'inline',
        // Агрессивное кэширование Edge CDN на 1 год для статики
        CacheControl: 'public, max-age=31536000, immutable',
      });

      await s3Client.send(command);
      uploadedCount++;
    } catch (err) {
      console.error(`❌ Ошибка загрузки ${relativePath}:`, err.message);
      errorCount++;
    }
  }

  // Записываем media-manifest.json
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8');

  console.log('\n==================================================');
  console.log(`🎉 МИГРАЦИЯ В CLOUDFLARE R2 УСПЕШНО ЗАВЕРШЕНА!`);
  console.log(`✅ Успешно загружено: ${uploadedCount} файлов`);
  if (errorCount > 0) console.log(`❌ Ошибок: ${errorCount}`);
  console.log(`📄 Манифест сохранен в: ${MANIFEST_PATH}`);
  console.log('==================================================\n');
}

uploadFiles();
